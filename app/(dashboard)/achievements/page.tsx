import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/require-auth";

export const metadata: Metadata = { title: "Achievements" };
import { BadgeIcon } from "@/lib/badge-icons";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Badge as BadgeRow, UserBadge } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Stats for progress display
// ---------------------------------------------------------------------------

interface BadgeStats {
  lessonsCompleted: number;
  simulatorRuns: number;
  uniqueDaysWithCompletions: number;
  uniqueSubjectsAttempted: number;
  chatSessions: number;
  deviceFlashes: number;
  projectsSaved: number;
}

/**
 * Return the current progress value for a badge criteria type, so the
 * achievements page can show how far along the user is.
 */
function getProgressForBadge(
  criteria: BadgeRow["criteria"],
  stats: BadgeStats,
): number {
  switch (criteria.type) {
    case "lessons_completed":
    case "lesson_complete":
      return stats.lessonsCompleted;
    case "simulator_runs":
      return stats.simulatorRuns;
    case "unique_days_with_completions":
      return stats.uniqueDaysWithCompletions;
    case "unique_subjects_attempted":
    case "cross_subject":
      return stats.uniqueSubjectsAttempted;
    case "chat_sessions":
      return stats.chatSessions;
    case "device_flash":
      return stats.deviceFlashes;
    case "projects_saved":
      return stats.projectsSaved;
    case "weekly_lessons":
      return stats.lessonsCompleted;
    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AchievementsPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch all badges, user's earned badges, and stats in parallel
  const [
    badgesResult,
    userBadgesResult,
    lessonsCompletedResult,
    simulatorRunsResult,
    chatSessionsResult,
    deviceFlashesResult,
    projectsSavedResult,
    completionDatesResult,
    subjectProgressResult,
  ] = await Promise.all([
    supabase.from("badges").select("*"),
    supabase
      .from("user_badges")
      .select("*, badges(*)")
      .eq("profile_id", profile.id),
    // Count completed lessons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("status", "completed"),
    // Count simulator runs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("device_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("device_type", "simulator"),
    // Count chat sessions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("chat_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id),
    // Count device flashes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("device_sessions") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id),
    // Count projects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("projects") as any)
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id),
    // Fetch completion dates for unique days
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("completed_at")
      .eq("profile_id", profile.id)
      .eq("status", "completed")
      .not("completed_at", "is", null),
    // Fetch completed lessons with subjects for unique subject count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("progress") as any)
      .select("lesson_id, lessons(subject_id)")
      .eq("profile_id", profile.id)
      .eq("status", "completed"),
  ]);

  // Calculate unique days
  const completionDates =
    (completionDatesResult.data as Array<{ completed_at: string }> | null) ??
    [];
  const uniqueDays = new Set<string>();
  for (const row of completionDates) {
    if (row.completed_at) {
      uniqueDays.add(row.completed_at.slice(0, 10));
    }
  }

  // Calculate unique subjects
  interface SubjectRow {
    lesson_id: string;
    lessons: { subject_id: string | null } | null;
  }
  const subjectRows =
    (subjectProgressResult.data as SubjectRow[] | null) ?? [];
  const uniqueSubjects = new Set<string>();
  for (const row of subjectRows) {
    if (row.lessons?.subject_id) {
      uniqueSubjects.add(row.lessons.subject_id);
    }
  }

  const stats: BadgeStats = {
    lessonsCompleted: lessonsCompletedResult.count ?? 0,
    simulatorRuns: simulatorRunsResult.count ?? 0,
    chatSessions: chatSessionsResult.count ?? 0,
    deviceFlashes: deviceFlashesResult.count ?? 0,
    projectsSaved: projectsSavedResult.count ?? 0,
    uniqueDaysWithCompletions: uniqueDays.size,
    uniqueSubjectsAttempted: uniqueSubjects.size,
  };

  const allBadges = (badgesResult.data ?? []) as BadgeRow[];
  const userBadges = (userBadgesResult.data ?? []) as UserBadge[];

  // Build a set of earned badge IDs for quick lookup
  const earnedBadgeMap = new Map<string, UserBadge>(
    userBadges.map((ub) => [ub.badge_id, ub]),
  );

  const earnedCount = earnedBadgeMap.size;
  const totalCount = allBadges.length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Achievements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have earned{" "}
            <span className="font-semibold text-primary">
              {earnedCount} of {totalCount}
            </span>{" "}
            badges! Keep learning to unlock them all.
          </p>
        </div>
      </FadeIn>

      {/* Summary progress */}
      <FadeIn delay={0.05}>
        <div className="mb-8">
          <Progress
            value={totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}
            className="h-3"
          />
        </div>
      </FadeIn>

      {/* Badge grid */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allBadges.map((badge) => {
          const earned = earnedBadgeMap.get(badge.id);
          const currentProgress = getProgressForBadge(badge.criteria, stats);
          return (
            <StaggerItem key={badge.id}>
              <BadgeCard
                badge={badge}
                earnedAt={earned?.earned_at}
                currentProgress={currentProgress}
              />
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BadgeCardProps {
  badge: BadgeRow;
  earnedAt?: string;
  currentProgress: number;
}

function BadgeCard({ badge, earnedAt, currentProgress }: BadgeCardProps) {
  const isEarned = Boolean(earnedAt);
  const threshold = badge.criteria.threshold;
  const clampedProgress = Math.min(currentProgress, threshold);
  const progressPercent =
    threshold > 0 ? (clampedProgress / threshold) * 100 : 0;

  return (
    <Card
      className={cn(
        "rounded-2xl transition-shadow",
        isEarned
          ? "border-primary/30 shadow-[0_0_12px_-3px] shadow-primary/20"
          : "opacity-60 grayscale",
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl",
              isEarned
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <BadgeIcon name={badge.icon} className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{badge.name}</CardTitle>
            {isEarned && earnedAt ? (
              <p className="text-xs text-primary">
                Earned {formatDate(earnedAt)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Keep learning to earn this!
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        <p className="text-sm text-muted-foreground">{badge.description}</p>

        {/* Progress toward threshold */}
        {threshold > 1 && !isEarned && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {clampedProgress} / {threshold}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
