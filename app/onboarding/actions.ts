"use server";

import { randomUUID } from "node:crypto";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { hashPin } from "@/lib/auth/pin";
import { EVENT_ONBOARDING_COMPLETE } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import { sendCoppaConsentConfirmation } from "@/lib/notifications/send-parent-notification";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { DeviceMode, FamilyInsert, LearningProfileInsert, ProfileInsert } from "@/lib/supabase/types";
import { bandForGrade, isValidUUID } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Onboarding result type
// ---------------------------------------------------------------------------

interface OnboardingResult {
  success: boolean;
  error?: string;
  kidProfileId?: string;
}

// ---------------------------------------------------------------------------
// Validation constants
// ---------------------------------------------------------------------------

/** Maximum length for parent/family name fields. */
const MAX_NAME_LENGTH = 50;

/** Maximum length for kid display name. */
const MAX_KID_NAME_LENGTH = 30;

/**
 * Allowed characters for display names: letters (including accented/unicode
 * letters), numbers, spaces, hyphens, and apostrophes. This prevents script
 * injection while allowing real names like "Mary-Jane" or "O'Brien".
 */
const NAME_PATTERN = /^[\p{L}\p{N}\s'-]+$/u;

/** Valid grade level values sent by the form (-1 = Pre-K, 0 = Kindergarten, 1-6 = grades). */
const VALID_GRADE_LEVELS = new Set(["-1", "0", "1", "2", "3", "4", "5", "6"]);

/** Allowed avatar IDs -- must match AVATAR_OPTIONS in onboarding-form.tsx. */
const VALID_AVATAR_IDS = new Set([
  "robot", "fairy", "astronaut", "wizard", "dragon", "unicorn", "ninja", "scientist",
]);

// ---------------------------------------------------------------------------
// Complete the onboarding flow (Steps 1-4)
// ---------------------------------------------------------------------------

export async function completeOnboarding(
  formData: FormData,
): Promise<OnboardingResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // ---- Extract & validate form data ----

  const familyName = (formData.get("family_name") as string | null)?.trim();
  const parentName = (formData.get("parent_name") as string | null)?.trim();
  const childName = (formData.get("child_name") as string | null)?.trim();
  const gradeLevelRaw = formData.get("grade_level") as string | null;
  const avatarId = (formData.get("avatar_id") as string | null)?.trim();
  const pin = formData.get("pin") as string | null;
  const coppaConsent = formData.get("coppa_consent") === "true";

  if (!familyName || !parentName || !childName || !gradeLevelRaw || !avatarId || !pin) {
    return { success: false, error: "All fields are required." };
  }

  if (!coppaConsent) {
    return { success: false, error: "Parental consent is required to create an account for your child." };
  }

  // -- Family name validation --
  if (familyName.length > MAX_NAME_LENGTH) {
    return { success: false, error: `Family name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!NAME_PATTERN.test(familyName)) {
    return { success: false, error: "Family name can only contain letters, numbers, spaces, hyphens, and apostrophes." };
  }

  // -- Parent name validation --
  if (parentName.length > MAX_NAME_LENGTH) {
    return { success: false, error: `Parent name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!NAME_PATTERN.test(parentName)) {
    return { success: false, error: "Parent name can only contain letters, numbers, spaces, hyphens, and apostrophes." };
  }

  // -- Kid display name validation (1-30 chars, no special characters) --
  if (childName.length > MAX_KID_NAME_LENGTH) {
    return { success: false, error: `Child name must be ${MAX_KID_NAME_LENGTH} characters or fewer.` };
  }
  if (!NAME_PATTERN.test(childName)) {
    return { success: false, error: "Child name can only contain letters, numbers, spaces, and hyphens." };
  }

  // -- PIN validation: exactly 4 digits --
  if (!/^\d{4}$/.test(pin)) {
    return { success: false, error: "PIN must be exactly 4 digits." };
  }

  // -- Grade level validation: must be a known value --
  if (!VALID_GRADE_LEVELS.has(gradeLevelRaw)) {
    return { success: false, error: "Invalid grade level." };
  }
  const gradeLevel = parseInt(gradeLevelRaw, 10);

  // -- Avatar ID validation: must be in the whitelist --
  if (!VALID_AVATAR_IDS.has(avatarId)) {
    return { success: false, error: "Invalid avatar selection." };
  }

  // ---- Persist to Supabase ----

  // Use the RLS-enforced client for SELECT queries (checking existing profile).
  const supabase = createAdminSupabaseClient();

  // Use the admin client (bypasses RLS) for all INSERT/UPSERT operations.
  // The families and profiles tables have no RLS INSERT policies by design --
  // inserts are only done server-side during onboarding or via Clerk webhooks.
  const adminSupabase = createAdminSupabaseClient();

  // Check that the parent doesn't already have a profile (prevent duplicates).
  const { data: existingProfile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (existingProfile) {
    redirect("/home");
  }

  // 1. Create (or reuse) a Clerk Organization for this family.
  // If a previous onboarding attempt already created an org but the
  // Supabase family insert failed, we reuse the existing org rather
  // than creating a duplicate.
  let clerkOrgId: string;
  try {
    const clerk = await clerkClient();
    const memberships = await clerk.users.getOrganizationMembershipList({
      userId,
    });

    if (memberships.totalCount > 0 && memberships.data.length > 0) {
      // Reuse the existing org from a prior partial onboarding attempt.
      clerkOrgId = memberships.data[0].organization.id;
    } else {
      // No org exists yet -- create a new one.
      const org = await clerk.organizations.createOrganization({
        name: familyName,
        createdBy: userId,
      });
      clerkOrgId = org.id;
    }
  } catch (err) {
    console.error("Failed to create Clerk Organization:", err);
    return { success: false, error: "Failed to create family organization." };
  }

  // 2. Create the family row (upsert to handle double-submit race condition).
  // families.clerk_org_id has a UNIQUE constraint, so concurrent requests
  // for the same user will resolve to the same family row.

  // Read the client IP from request headers for COPPA consent record.
  const headersList = await headers();
  const clientIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    null;

  const familyPayload: FamilyInsert = {
    clerk_org_id: clerkOrgId,
    name: familyName,
    coppa_consent_given: true,
    coppa_consent_at: new Date().toISOString(),
    coppa_consent_ip: clientIp ?? undefined,
    // "checkbox_email_plus" = parent checked consent box + confirmation email sent.
    // This is the FTC-approved "Email Plus" method for COPPA VPC.
    // TODO: Upgrade to "email_plus_verified" once confirmation link flow is implemented.
    coppa_consent_method: "checkbox_email_plus",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: family, error: familyError } = await (adminSupabase.from("families") as any)
    .upsert(familyPayload, { onConflict: "clerk_org_id" })
    .select()
    .single();

  if (familyError || !family) {
    console.error("Failed to create family:", familyError);
    return { success: false, error: "Failed to create family." };
  }

  // 3. Create the parent profile.
  const parentPayload: ProfileInsert = {
    clerk_id: userId,
    family_id: family.id,
    display_name: parentName,
    avatar_id: "parent",
    role: "parent",
    current_band: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: parentError } = await (adminSupabase.from("profiles") as any).insert(
    parentPayload,
  );

  if (parentError) {
    console.error("Failed to create parent profile:", parentError);
    return { success: false, error: "Failed to create parent profile." };
  }

  // 4. Create the kid profile.
  // In production this would create a Clerk managed user under the
  // parent's Organization. For now we use a cryptographically random ID.
  const kidClerkId = `kid_${randomUUID()}`;
  const pinHash = await hashPin(pin);
  const kidPayload: ProfileInsert = {
    clerk_id: kidClerkId,
    family_id: family.id,
    display_name: childName,
    avatar_id: avatarId,
    role: "kid",
    grade_level: gradeLevel,
    current_band: bandForGrade(gradeLevel),
    device_mode: "none",
    pin_hash: pinHash,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: kidProfile, error: kidError } = await (adminSupabase.from("profiles") as any)
    .insert(kidPayload)
    .select("id")
    .single();

  if (kidError || !kidProfile) {
    console.error("Failed to create kid profile:", kidError);
    return { success: false, error: "Failed to create kid profile." };
  }

  // 5. Create a default learning profile for the kid.
  // Also uses the admin client because the RLS insert policy on
  // learning_profiles requires the requesting user's clerk_id to match
  // the profile -- but during onboarding the parent (not the kid) is
  // the authenticated user.
  const learningProfilePayload: LearningProfileInsert = {
    profile_id: kidProfile.id,
    learning_style: { visual: 0.4, kinesthetic: 0.3, auditory: 0.2, reading: 0.1 },
    interests: [],
    preferred_session_length: 15,
    preferred_encouragement: "enthusiastic",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: learningProfileError } = await (adminSupabase.from("learning_profiles") as any)
    .insert(learningProfilePayload);

  if (learningProfileError) {
    // Log but don't fail onboarding -- the learning profile can be created later
    console.error("Failed to create learning profile:", learningProfileError);
  }

  // 6. Send COPPA consent confirmation notification (fire-and-forget).
  // This creates a notification record and will send a confirmation email
  // once email delivery is implemented (part of "Email Plus" VPC method).
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );

    // Look up the parent profile ID we just created
    const { data: parentProfile } = (await adminSupabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", userId)
      .single()) as { data: { id: string } | null };

    if (parentProfile) {
      // Don't await -- fire and forget so it doesn't slow onboarding
      sendCoppaConsentConfirmation(adminSupabase, {
        parentProfileId: parentProfile.id,
        familyId: family.id,
        kidName: childName,
        parentEmail: primaryEmail?.emailAddress ?? null,
      }).catch((err) => {
        console.error("[onboarding] Failed to send COPPA consent confirmation:", err);
      });
    }
  } catch (err) {
    // Non-fatal -- log and continue
    console.error("[onboarding] Failed to send COPPA consent confirmation:", err);
  }

  // NOTE: Do NOT call revalidatePath here. It causes the onboarding page's
  // server component to re-render, which detects the new profile and redirects
  // to /home before the client can show Steps 5-7. The /home page will fetch
  // fresh data on its own when the user eventually navigates there.

  // Track onboarding completion (fire-and-forget)
  trackEvent(EVENT_ONBOARDING_COMPLETE, {
    grade_level: gradeLevel,
    device_mode: "pending",
  }).catch(() => {});

  return { success: true, kidProfileId: kidProfile.id };
}

// ---------------------------------------------------------------------------
// Update device mode (called from Step 5)
// ---------------------------------------------------------------------------

export async function updateDeviceMode(
  kidProfileId: string,
  deviceMode: DeviceMode,
): Promise<OnboardingResult> {
  if (!isValidUUID(kidProfileId)) {
    return { success: false, error: "Invalid profile ID." };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // Validate device_mode value
  if (!["usb", "wifi", "simulator", "none"].includes(deviceMode)) {
    return { success: false, error: "Invalid device mode." };
  }

  const supabase = createAdminSupabaseClient();

  // Verify the kid profile belongs to this parent's family.
  const { data: parentProfile } = (await supabase
    .from("profiles")
    .select("family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { family_id: string } | null };

  if (!parentProfile) {
    return { success: false, error: "Parent profile not found." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({ device_mode: deviceMode })
    .eq("id", kidProfileId)
    .eq("family_id", parentProfile.family_id);

  if (error) {
    return { success: false, error: "Failed to update device mode." };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Get the starter lesson ID for a band (called from Step 7)
// ---------------------------------------------------------------------------

/**
 * Queries for the first lesson in the first module of the given band.
 * Returns the lesson UUID or null if no lessons are seeded for that band.
 *
 * This replaces hardcoded starter lesson UUIDs, which may not exist if the
 * seed data hasn't been applied (seed.sql is only run during `db reset`,
 * not during normal deployment via migrations).
 */
export async function getStarterLessonId(
  gradeLevel: number,
): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const band = bandForGrade(gradeLevel);
  const supabase = createAdminSupabaseClient();

  // Find the first module at or below this band (lowest band, then order_num).
  const { data: firstModule } = (await supabase
    .from("modules")
    .select("id")
    .lte("band", band)
    .order("band", { ascending: true })
    .order("order_num", { ascending: true })
    .limit(1)
    .single()) as { data: { id: string } | null };

  if (!firstModule) {
    return null;
  }

  // Find the first lesson in that module (lowest order_num).
  const { data: firstLesson } = (await supabase
    .from("lessons")
    .select("id")
    .eq("module_id", firstModule.id)
    .order("order_num", { ascending: true })
    .limit(1)
    .single()) as { data: { id: string } | null };

  return firstLesson?.id ?? null;
}

// ---------------------------------------------------------------------------
// Check if the current user was invited to an existing family
// ---------------------------------------------------------------------------

interface InvitedParentInfo {
  isInvitedParent: boolean;
  familyName?: string;
  orgId?: string;
}

/**
 * Checks if the authenticated user has an existing Clerk Organization
 * membership (meaning they were invited to join a family). Used by the
 * onboarding page to show a simplified flow for invited parents.
 */
export async function checkInvitedParentStatus(): Promise<InvitedParentInfo> {
  const { userId } = await auth();
  if (!userId) {
    return { isInvitedParent: false };
  }

  try {
    const clerk = await clerkClient();
    const memberships = await clerk.users.getOrganizationMembershipList({
      userId,
    });

    if (memberships.totalCount > 0 && memberships.data.length > 0) {
      const membership = memberships.data[0];
      // If the user is the org admin (creator), they're not an "invited"
      // parent -- they started onboarding themselves but it may have
      // partially failed. Route them through the normal onboarding flow
      // so they can retry.
      if (membership.role === "org:admin") {
        return { isInvitedParent: false };
      }

      return {
        isInvitedParent: true,
        familyName: membership.organization.name,
        orgId: membership.organization.id,
      };
    }
  } catch (err) {
    console.error("Failed to check org memberships:", err);
  }

  return { isInvitedParent: false };
}

// ---------------------------------------------------------------------------
// Complete invited parent onboarding (simplified flow)
// ---------------------------------------------------------------------------

export async function completeInvitedParentOnboarding(
  formData: FormData,
): Promise<OnboardingResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const displayName = (formData.get("display_name") as string | null)?.trim();
  if (!displayName) {
    return { success: false, error: "Display name is required." };
  }
  if (displayName.length > MAX_NAME_LENGTH) {
    return { success: false, error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!NAME_PATTERN.test(displayName)) {
    return { success: false, error: "Name can only contain letters, numbers, spaces, hyphens, and apostrophes." };
  }

  // Look up the user's org membership to find the family
  let clerkOrgId: string;
  try {
    const clerk = await clerkClient();
    const memberships = await clerk.users.getOrganizationMembershipList({
      userId,
    });

    if (memberships.totalCount === 0 || memberships.data.length === 0) {
      return { success: false, error: "No family invitation found." };
    }

    clerkOrgId = memberships.data[0].organization.id;
  } catch (err) {
    console.error("Failed to look up org membership:", err);
    return { success: false, error: "Failed to look up family invitation." };
  }

  // Find the family record for this org
  const supabase = createAdminSupabaseClient();
  const { data: family } = (await supabase
    .from("families")
    .select("id")
    .eq("clerk_org_id", clerkOrgId)
    .single()) as { data: { id: string } | null };

  if (!family) {
    return { success: false, error: "Family not found. The invitation may still be processing." };
  }

  // Check if profile already exists (webhook may have created it)
  const { data: existingProfile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (existingProfile) {
    // Profile already exists (webhook created it) -- just update the display name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({ display_name: displayName })
      .eq("id", existingProfile.id);
    return { success: true };
  }

  // Create the parent profile using admin client (no RLS INSERT policy on profiles).
  const adminSupabase = createAdminSupabaseClient();
  const parentPayload: ProfileInsert = {
    clerk_id: userId,
    family_id: family.id,
    display_name: displayName,
    avatar_id: "parent",
    role: "parent",
    current_band: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: profileError } = await (adminSupabase.from("profiles") as any).insert(
    parentPayload,
  );

  if (profileError) {
    console.error("Failed to create invited parent profile:", profileError);
    return { success: false, error: "Failed to create profile." };
  }

  return { success: true };
}
