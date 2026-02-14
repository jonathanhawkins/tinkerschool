"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { isValidUUID } from "@/lib/utils";
import type { Profile, ProfileUpdate } from "@/lib/supabase/types";

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
