"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import type { Profile, ProfileUpdate } from "@/lib/supabase/types";

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
