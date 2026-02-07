import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Badge criteria types from seed data
// ---------------------------------------------------------------------------

interface BadgeRow {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: {
    type: string;
    threshold: number;
  };
}

/** Returned to the UI so the celebration toast knows what to display. */
export interface EarnedBadgeInfo {
  name: string;
  icon: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Badge evaluators
// ---------------------------------------------------------------------------

/**
 * Evaluate all badge criteria for a profile and award any newly earned badges.
 * Called after progress updates, project saves, and device flashes.
 *
 * Returns the list of newly awarded badges (for UI celebration).
 */
export async function evaluateBadges(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<EarnedBadgeInfo[]> {
  // 1. Fetch all badges and already-earned badges
  const [badgesResult, earnedResult] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("badges") as any).select("id, name, icon, description, criteria"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("user_badges") as any)
      .select("badge_id")
      .eq("profile_id", profileId),
  ]);

  const allBadges: BadgeRow[] = badgesResult.data ?? [];
  const earnedBadgeIds = new Set(
    (earnedResult.data as Array<{ badge_id: string }> | null)?.map(
      (ub) => ub.badge_id
    ) ?? []
  );

  // Filter to unevaluated badges only
  const unearnedBadges = allBadges.filter((b) => !earnedBadgeIds.has(b.id));
  if (unearnedBadges.length === 0) return [];

  // 2. Gather stats for evaluation
  const stats = await gatherProfileStats(supabase, profileId);

  // 3. Check each unearned badge
  const newlyEarned: EarnedBadgeInfo[] = [];

  for (const badge of unearnedBadges) {
    const met = checkCriteria(badge.criteria, stats);
    if (met) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("user_badges") as any).insert({
        profile_id: profileId,
        badge_id: badge.id,
      });

      if (!error) {
        newlyEarned.push({
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
        });
      }
    }
  }

  if (newlyEarned.length > 0) {
    console.log(
      `[badges] Awarded to profile=${profileId}: ${newlyEarned.map((b) => b.name).join(", ")}`
    );
  }

  return newlyEarned;
}

// ---------------------------------------------------------------------------
// Stats gathering
// ---------------------------------------------------------------------------

interface ProfileStats {
  lessonsCompleted: number;
  projectsSaved: number;
  deviceFlashes: number;
}

async function gatherProfileStats(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<ProfileStats> {
  const [progressResult, projectsResult, deviceResult] = await Promise.all([
    // Count completed lessons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("status", "completed"),
    // Count saved projects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("projects") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId),
    // Count device sessions (each flash creates a session)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("device_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId),
  ]);

  return {
    lessonsCompleted: progressResult.count ?? 0,
    projectsSaved: projectsResult.count ?? 0,
    deviceFlashes: deviceResult.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Criteria checker
// ---------------------------------------------------------------------------

function checkCriteria(
  criteria: { type: string; threshold: number },
  stats: ProfileStats,
): boolean {
  switch (criteria.type) {
    // Trackable via database counts
    case "device_flash":
      return stats.deviceFlashes >= criteria.threshold;
    case "projects_saved":
      return stats.projectsSaved >= criteria.threshold;

    // These badge types are based on code content analysis.
    // For now, we award them based on lesson completion milestones
    // since lessons teach these concepts in order.
    // Module 1 (5 lessons) covers display + shapes
    // Module 2 (3 lessons) covers drawing/shapes
    // Module 3 (4 lessons) covers shake sensor + loops
    // Module 4 (3 lessons) covers buzzer/tones + songs
    // Module 5 (3 lessons) covers tilt sensor

    case "bug_fix":
      // Award after completing 3 lessons (implies debugging along the way)
      return stats.lessonsCompleted >= 3;
    case "shapes_drawn":
      // Award after completing Module 2 (8 lessons total = Module 1 + Module 2)
      return stats.lessonsCompleted >= 8;
    case "loop_used":
      // Award after completing first lesson of Module 3 (lesson 9)
      return stats.lessonsCompleted >= 9;
    case "shake_used":
      // Award after completing Module 3 (12 lessons total)
      return stats.lessonsCompleted >= 10;
    case "tones_played":
      // Award after completing first lesson of Module 4 (lesson 13)
      return stats.lessonsCompleted >= 13;
    case "random_used":
      // Award after completing Module 3 which has randomness
      return stats.lessonsCompleted >= 11;
    case "song_played":
      // Award after completing Module 4 (15 lessons total)
      return stats.lessonsCompleted >= 15;
    case "tilt_used":
      // Award after completing first lesson of Module 5 (lesson 16)
      return stats.lessonsCompleted >= 16;

    default:
      return false;
  }
}
