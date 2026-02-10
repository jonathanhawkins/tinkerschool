import type { SupabaseClient } from "@supabase/supabase-js";

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
}

/**
 * Update a kid's activity streak after completing a lesson or saving a project.
 *
 * Logic:
 * - Same day as last activity: no change (already counted)
 * - Yesterday: increment streak (consecutive day!)
 * - Older or null: reset to 1 (streak broken, fresh start)
 *
 * Uses server-side UTC date to prevent timezone gaming.
 */
export async function updateStreak(
  supabase: SupabaseClient,
  profileId: string,
): Promise<StreakResult> {
  // Fetch current streak state
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("id", profileId)
    .single();

  if (!profile) {
    return { currentStreak: 0, longestStreak: 0, isNewDay: false };
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const lastDate = profile.last_activity_date as string | null;

  // Same day — already counted
  if (lastDate === today) {
    return {
      currentStreak: profile.current_streak as number,
      longestStreak: profile.longest_streak as number,
      isNewDay: false,
    };
  }

  // Calculate the new streak
  let newStreak: number;

  if (lastDate) {
    const last = new Date(lastDate + "T00:00:00Z");
    const todayDate = new Date(today + "T00:00:00Z");
    const diffDays = Math.round(
      (todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      // Consecutive day — extend streak
      newStreak = (profile.current_streak as number) + 1;
    } else {
      // Gap — streak broken
      newStreak = 1;
    }
  } else {
    // First ever activity
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, profile.longest_streak as number);

  // Update the profile
  await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
    })
    .eq("id", profileId);

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    isNewDay: true,
  };
}
