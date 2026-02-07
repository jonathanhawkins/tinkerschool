"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { FamilyInsert, ProfileInsert } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Onboarding result type
// ---------------------------------------------------------------------------

interface OnboardingResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Band assignment based on grade level
// ---------------------------------------------------------------------------

function bandForGrade(grade: number): number {
  if (grade <= 1) return 1;
  if (grade <= 3) return 2;
  if (grade <= 4) return 3;
  if (grade <= 5) return 4;
  return 5;
}

// ---------------------------------------------------------------------------
// Complete the onboarding flow
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

  if (!familyName || !parentName || !childName || !gradeLevelRaw || !avatarId || !pin) {
    return { success: false, error: "All fields are required." };
  }

  const gradeLevel = parseInt(gradeLevelRaw, 10);

  if (Number.isNaN(gradeLevel) || gradeLevel < 0 || gradeLevel > 6) {
    return { success: false, error: "Invalid grade level." };
  }

  if (!/^\d{4}$/.test(pin)) {
    return { success: false, error: "PIN must be exactly 4 digits." };
  }

  // ---- Persist to Supabase ----

  const supabase = await createServerSupabaseClient();

  // Check that the parent doesn't already have a profile (prevent duplicates).
  const { data: existingProfile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (existingProfile) {
    redirect("/home");
  }

  // 1. Create the family row.
  const familyPayload: FamilyInsert = {
    clerk_org_id: userId, // placeholder until Clerk Organization is created
    name: familyName,
  };

  // Cast needed because the hand-written Database type uses a custom
  // TableDefinition wrapper that doesn't match the SDK's expected shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: family, error: familyError } = await (supabase.from("families") as any)
    .insert(familyPayload)
    .select()
    .single();

  if (familyError || !family) {
    return { success: false, error: "Failed to create family." };
  }

  // 2. Create the parent profile.
  const parentPayload: ProfileInsert = {
    clerk_id: userId,
    family_id: family.id,
    display_name: parentName,
    avatar_id: "parent",
    role: "parent",
    current_band: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: parentError } = await (supabase.from("profiles") as any).insert(
    parentPayload,
  );

  if (parentError) {
    return { success: false, error: "Failed to create parent profile." };
  }

  // 3. Create the kid profile.
  // In production this would create a Clerk managed user under the
  // parent's Organization. For now we use a generated clerk_id.
  const kidPayload: ProfileInsert = {
    clerk_id: `kid_${userId}_${Date.now()}`,
    family_id: family.id,
    display_name: childName,
    avatar_id: avatarId,
    role: "kid",
    grade_level: gradeLevel,
    current_band: bandForGrade(gradeLevel),
    // TODO: hash PIN before storing in production
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: kidError } = await (supabase.from("profiles") as any).insert(
    kidPayload,
  );

  if (kidError) {
    return { success: false, error: "Failed to create kid profile." };
  }

  revalidatePath("/home");
  redirect("/home");
}
