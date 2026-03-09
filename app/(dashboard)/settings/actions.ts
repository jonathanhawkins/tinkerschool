"use server";

import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { hashPin } from "@/lib/auth/pin";
import { requireAuth, ACTIVE_KID_COOKIE } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { bandForGrade, GRADE_LABELS, isValidUUID, VALID_GRADES } from "@/lib/utils";
import type { Profile, ProfileInsert, ProfileUpdate, LearningProfileInsert } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Validation constants
// ---------------------------------------------------------------------------

/** Maximum length for kid display name. */
const MAX_KID_NAME_LENGTH = 30;

/**
 * Allowed characters for display names: letters (including accented/unicode
 * letters), numbers, spaces, hyphens, and apostrophes.
 */
const NAME_PATTERN = /^[\p{L}\p{N}\s'-]+$/u;

/**
 * Resets the kid's progress: clears all lesson progress rows,
 * earned badges, and resets XP/streak on the profile. Dev-only.
 *
 * If logged in as a parent, finds the first kid in the family.
 */
export async function resetProgress() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Reset is not available in production.");
  }

  const { profile, supabase } = await requireAuth();

  // Find the kid profile to reset
  let target = profile;
  if (profile.role === "parent") {
    const { data: kids } = await supabase
      .from("profiles")
      .select("*")
      .eq("family_id", profile.family_id)
      .eq("role", "kid")
      .order("created_at")
      .limit(1);
    const firstKid = (kids as Profile[] | null)?.[0];
    if (firstKid) target = firstKid;
  }

  // Delete progress rows, earned badges, and chat sessions
  await Promise.all([
    supabase.from("progress").delete().eq("profile_id", target.id),
    supabase.from("user_badges").delete().eq("profile_id", target.id),
    supabase.from("chat_sessions").delete().eq("profile_id", target.id),
  ]);

  // Reset XP and streak on the profile
  const reset: ProfileUpdate = {
    xp: 0,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
  };
  await supabase.from("profiles").update(reset as never).eq("id", target.id);

  revalidatePath("/", "layout");
}

/**
 * Resets onboarding by deleting all profiles and the family for the current
 * user. After this, `requireAuth()` will redirect to /onboarding since
 * no profile exists. Dev-only.
 */
export async function resetOnboarding() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Reset onboarding is not available in production.");
  }

  const { profile, supabase } = await requireAuth();
  const familyId = profile.family_id;

  // Delete all dependent rows first (progress, badges, chat, etc.)
  const { data: familyProfiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("family_id", familyId);

  const profileIds = (familyProfiles as { id: string }[] | null)?.map((p) => p.id) ?? [];

  if (profileIds.length > 0) {
    await Promise.all([
      supabase.from("progress").delete().in("profile_id", profileIds),
      supabase.from("user_badges").delete().in("profile_id", profileIds),
      supabase.from("chat_sessions").delete().in("profile_id", profileIds),
      supabase.from("learning_profiles").delete().in("profile_id", profileIds),
      supabase.from("skill_proficiencies").delete().in("profile_id", profileIds),
    ]);

    // Delete all profiles in the family
    await supabase.from("profiles").delete().eq("family_id", familyId);
  }

  // Delete the family itself
  await supabase.from("families").delete().eq("id", familyId);

  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Update a kid's display name
// ---------------------------------------------------------------------------

interface UpdateKidNameResult {
  success: boolean;
  error?: string;
}

/**
 * Update a kid learner profile's display name. Only parents in the same
 * family can perform this action.
 */
export async function updateKidName(
  kidProfileId: string,
  newName: string,
): Promise<UpdateKidNameResult> {
  if (!isValidUUID(kidProfileId)) {
    return { success: false, error: "Invalid profile ID." };
  }

  const trimmed = newName.trim();

  if (!trimmed) {
    return { success: false, error: "Name cannot be empty." };
  }

  if (trimmed.length > MAX_KID_NAME_LENGTH) {
    return {
      success: false,
      error: `Name must be ${MAX_KID_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return {
      success: false,
      error: "Name can only contain letters, numbers, spaces, hyphens, and apostrophes.",
    };
  }

  const { profile, supabase } = await requireAuth();

  // Only parents can edit kid names
  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can edit learner names." };
  }

  // Verify the kid belongs to the same family
  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("id", kidProfileId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!kidProfile) {
    return { success: false, error: "Learner profile not found." };
  }

  if (kidProfile.family_id !== profile.family_id) {
    return { success: false, error: "Learner profile not found." };
  }

  if (kidProfile.role !== "kid") {
    return { success: false, error: "Can only edit learner profiles." };
  }

  // Update the display name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({ display_name: trimmed })
    .eq("id", kidProfileId);

  if (error) {
    return { success: false, error: "Failed to update name." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Update a kid's grade level (and recalculate band)
// ---------------------------------------------------------------------------

interface UpdateKidGradeResult {
  success: boolean;
  error?: string;
}

/**
 * Update a kid's grade level and automatically recalculate their
 * curriculum band. Only parents in the same family can do this.
 */
export async function updateKidGrade(
  kidProfileId: string,
  newGrade: number,
): Promise<UpdateKidGradeResult> {
  if (!isValidUUID(kidProfileId)) {
    return { success: false, error: "Invalid profile ID." };
  }

  if (!(VALID_GRADES as readonly number[]).includes(newGrade)) {
    return { success: false, error: "Invalid grade level." };
  }

  const { profile, supabase } = await requireAuth();

  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can change grade level." };
  }

  // Verify the kid belongs to the same family
  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("id", kidProfileId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!kidProfile) {
    return { success: false, error: "Learner profile not found." };
  }

  if (kidProfile.family_id !== profile.family_id) {
    return { success: false, error: "Learner profile not found." };
  }

  if (kidProfile.role !== "kid") {
    return { success: false, error: "Can only edit learner profiles." };
  }

  const newBand = bandForGrade(newGrade);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({ grade_level: newGrade, current_band: newBand })
    .eq("id", kidProfileId);

  if (error) {
    return { success: false, error: "Failed to update grade level." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Switch the active kid profile (cookie-based)
// ---------------------------------------------------------------------------

interface SwitchKidResult {
  success: boolean;
  error?: string;
}

/**
 * Sets the active kid profile via a cookie. All kid-facing dashboard pages
 * read this cookie in `getActiveKidProfile()` to show the correct kid's data.
 *
 * Only parents can switch kids. The kid must belong to the parent's family.
 */
export async function switchActiveKid(
  kidProfileId: string,
): Promise<SwitchKidResult> {
  if (!isValidUUID(kidProfileId)) {
    return { success: false, error: "Invalid profile ID." };
  }

  const { profile, supabase } = await requireAuth();

  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can switch learners." };
  }

  // Verify the kid belongs to the same family
  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("id", kidProfileId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!kidProfile || kidProfile.family_id !== profile.family_id || kidProfile.role !== "kid") {
    return { success: false, error: "Learner profile not found." };
  }

  // Set the cookie (expires in 1 year, httpOnly for security)
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_KID_COOKIE, kidProfileId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/", "layout");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Add a new child (learner) to the family
// ---------------------------------------------------------------------------

/** Allowed avatar IDs -- must match AVATAR_OPTIONS in onboarding-form.tsx. */
const VALID_AVATAR_IDS = new Set([
  "robot", "fairy", "astronaut", "wizard", "dragon", "unicorn", "ninja", "scientist",
]);

interface AddChildResult {
  success: boolean;
  error?: string;
  kidProfileId?: string;
}

/**
 * Creates a new kid profile under the parent's existing family. Collects the
 * same fields as onboarding: display name, grade level, avatar, and PIN.
 *
 * Also creates a default learning_profile for the new kid.
 */
export async function addChild(
  childName: string,
  gradeLevel: number,
  avatarId: string,
  pin: string,
): Promise<AddChildResult> {
  const { profile } = await requireAuth();

  // Only parents can add kids
  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can add learners." };
  }

  // -- Validate child name --
  const trimmedName = childName.trim();
  if (!trimmedName) {
    return { success: false, error: "Name is required." };
  }
  if (trimmedName.length > MAX_KID_NAME_LENGTH) {
    return { success: false, error: `Name must be ${MAX_KID_NAME_LENGTH} characters or fewer.` };
  }
  if (!NAME_PATTERN.test(trimmedName)) {
    return { success: false, error: "Name can only contain letters, numbers, spaces, hyphens, and apostrophes." };
  }

  // -- Validate grade level --
  if (!(VALID_GRADES as readonly number[]).includes(gradeLevel)) {
    return { success: false, error: "Invalid grade level." };
  }

  // -- Validate avatar --
  if (!VALID_AVATAR_IDS.has(avatarId)) {
    return { success: false, error: "Invalid avatar selection." };
  }

  // -- Validate PIN --
  if (!/^\d{4}$/.test(pin)) {
    return { success: false, error: "PIN must be exactly 4 digits." };
  }

  // Use admin client to bypass RLS for inserts (same as onboarding)
  const adminSupabase = createAdminSupabaseClient();

  // Create kid profile
  const kidClerkId = `kid_${randomUUID()}`;
  const pinHash = await hashPin(pin);
  const kidPayload: ProfileInsert = {
    clerk_id: kidClerkId,
    family_id: profile.family_id,
    display_name: trimmedName,
    avatar_id: avatarId,
    role: "kid",
    grade_level: gradeLevel,
    current_band: bandForGrade(gradeLevel),
    device_mode: "none",
    pin_hash: pinHash,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: newKidProfile, error: kidError } = await (adminSupabase.from("profiles") as any)
    .insert(kidPayload)
    .select("id")
    .single();

  if (kidError || !newKidProfile) {
    console.error("Failed to create kid profile:", kidError);
    return { success: false, error: "Failed to create learner profile." };
  }

  // Create a default learning profile for the kid
  const learningProfilePayload: LearningProfileInsert = {
    profile_id: newKidProfile.id,
    learning_style: { visual: 0.4, kinesthetic: 0.3, auditory: 0.2, reading: 0.1 },
    interests: [],
    preferred_session_length: 15,
    preferred_encouragement: "enthusiastic",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: learningError } = await (adminSupabase.from("learning_profiles") as any)
    .insert(learningProfilePayload);

  if (learningError) {
    console.error("Failed to create learning profile:", learningError);
    // Non-fatal -- the kid profile was created successfully
  }

  // Auto-switch to the newly created kid
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_KID_COOKIE, newKidProfile.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/", "layout");
  return { success: true, kidProfileId: newKidProfile.id };
}
