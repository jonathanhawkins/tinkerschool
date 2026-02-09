import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Badge criteria types from seed data
// ---------------------------------------------------------------------------

interface BadgeCriteria {
  type: string;
  threshold: number;
  subject?: string;
  week?: number;
}

interface BadgeRow {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: BadgeCriteria;
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
 * Called after progress updates, project saves, device flashes, and chat
 * sessions.
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
    (supabase.from("badges") as any).select(
      "id, name, icon, description, criteria",
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("user_badges") as any)
      .select("badge_id")
      .eq("profile_id", profileId),
  ]);

  const allBadges: BadgeRow[] = badgesResult.data ?? [];
  const earnedBadgeIds = new Set(
    (earnedResult.data as Array<{ badge_id: string }> | null)?.map(
      (ub) => ub.badge_id,
    ) ?? [],
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
      `[badges] Awarded to profile=${profileId}: ${newlyEarned.map((b) => b.name).join(", ")}`,
    );
  }

  return newlyEarned;
}

// ---------------------------------------------------------------------------
// Stats gathering
// ---------------------------------------------------------------------------

interface ProfileStats {
  /** Total completed lessons */
  lessonsCompleted: number;
  /** Total saved projects */
  projectsSaved: number;
  /** Total device flash sessions (USB + simulator) */
  deviceFlashes: number;
  /** Total simulator runs specifically */
  simulatorRuns: number;
  /** Total chat sessions */
  chatSessions: number;
  /** Number of unique calendar days with a lesson completion */
  uniqueDaysWithCompletions: number;
  /** Number of unique subjects with at least one completed lesson */
  uniqueSubjectsAttempted: number;
  /** Per-subject completed lesson counts: slug -> count */
  subjectLessonCounts: Record<string, number>;
}

async function gatherProfileStats(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<ProfileStats> {
  // Run all stat queries in parallel for performance
  const [
    progressResult,
    projectsResult,
    deviceResult,
    simulatorResult,
    chatResult,
    completionDatesResult,
    subjectProgressResult,
  ] = await Promise.all([
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

    // Count all device sessions (USB + simulator)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("device_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId),

    // Count simulator runs specifically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("device_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("device_type", "simulator"),

    // Count chat sessions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("chat_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId),

    // Fetch completed_at dates for unique-days calculation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("completed_at")
      .eq("profile_id", profileId)
      .eq("status", "completed")
      .not("completed_at", "is", null),

    // Fetch completed lessons with their subject_id (via the lesson join)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("lesson_id, lessons(subject_id, subjects(slug))")
      .eq("profile_id", profileId)
      .eq("status", "completed"),
  ]);

  // Calculate unique days with completions
  const completionDates =
    (completionDatesResult.data as Array<{ completed_at: string }> | null) ??
    [];
  const uniqueDays = new Set<string>();
  for (const row of completionDates) {
    if (row.completed_at) {
      // Extract date portion (YYYY-MM-DD)
      uniqueDays.add(row.completed_at.slice(0, 10));
    }
  }

  // Calculate per-subject lesson counts and unique subjects
  interface SubjectProgressRow {
    lesson_id: string;
    lessons: {
      subject_id: string | null;
      subjects: { slug: string } | null;
    } | null;
  }

  const subjectRows =
    (subjectProgressResult.data as SubjectProgressRow[] | null) ?? [];
  const subjectLessonCounts: Record<string, number> = {};
  const uniqueSubjects = new Set<string>();

  for (const row of subjectRows) {
    const slug = row.lessons?.subjects?.slug;
    if (slug) {
      uniqueSubjects.add(slug);
      subjectLessonCounts[slug] = (subjectLessonCounts[slug] ?? 0) + 1;
    }
  }

  return {
    lessonsCompleted: progressResult.count ?? 0,
    projectsSaved: projectsResult.count ?? 0,
    deviceFlashes: deviceResult.count ?? 0,
    simulatorRuns: simulatorResult.count ?? 0,
    chatSessions: chatResult.count ?? 0,
    uniqueDaysWithCompletions: uniqueDays.size,
    uniqueSubjectsAttempted: uniqueSubjects.size,
    subjectLessonCounts,
  };
}

// ---------------------------------------------------------------------------
// Criteria checker
// ---------------------------------------------------------------------------

function checkCriteria(criteria: BadgeCriteria, stats: ProfileStats): boolean {
  switch (criteria.type) {
    // ---- New achievement badge criteria (007 migration) ----

    case "lessons_completed":
      return stats.lessonsCompleted >= criteria.threshold;

    case "simulator_runs":
      return stats.simulatorRuns >= criteria.threshold;

    case "unique_days_with_completions":
      return stats.uniqueDaysWithCompletions >= criteria.threshold;

    case "unique_subjects_attempted":
      return stats.uniqueSubjectsAttempted >= criteria.threshold;

    case "chat_sessions":
      return stats.chatSessions >= criteria.threshold;

    // ---- TinkerSchool seed badge criteria (003 migration) ----

    case "lesson_complete":
      // Same as lessons_completed but used in earlier seed data
      return stats.lessonsCompleted >= criteria.threshold;

    case "subject_lesson_complete":
      // Requires N completed lessons in a specific subject
      if (!criteria.subject) return false;
      return (
        (stats.subjectLessonCounts[criteria.subject] ?? 0) >=
        criteria.threshold
      );

    case "cross_subject":
      // Requires completed lessons across N different subjects
      return stats.uniqueSubjectsAttempted >= criteria.threshold;

    case "weekly_lessons":
      // Simplified: treat as total lessons completed (exact weekly tracking
      // would require more complex date windowing logic)
      return stats.lessonsCompleted >= criteria.threshold;

    case "device_flash":
      return stats.deviceFlashes >= criteria.threshold;

    case "first_login":
      // Awarded via onboarding flow, not stats-based; always true if profile
      // exists since evaluateBadges is only called for authenticated users
      return true;

    // ---- Legacy CodeBuddy criteria (backward compat) ----

    case "projects_saved":
      return stats.projectsSaved >= criteria.threshold;

    case "bug_fix":
      return stats.lessonsCompleted >= 3;

    case "shapes_drawn":
      return stats.lessonsCompleted >= 8;

    case "loop_used":
      return stats.lessonsCompleted >= 9;

    case "shake_used":
      return stats.lessonsCompleted >= 10;

    case "tones_played":
      return stats.lessonsCompleted >= 13;

    case "random_used":
      return stats.lessonsCompleted >= 11;

    case "song_played":
      return stats.lessonsCompleted >= 15;

    case "tilt_used":
      return stats.lessonsCompleted >= 16;

    default:
      console.warn(`[badges] Unknown criteria type: ${criteria.type}`);
      return false;
  }
}
