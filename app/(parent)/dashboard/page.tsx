import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Parent Dashboard" };
import {
  BookOpen,
  Trophy,
  Clock,
  Flame,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Star,
  Sparkles,
  TrendingUp,
  Calendar,
  Footprints,
  Play,
  CalendarCheck,
  Compass,
  Award,
  Cpu,
  LogIn,
  FolderOpen,
  Zap,
  Globe,
  Lock,
  MessageCircle,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { formatDate, formatShortDate } from "@/lib/format-date";
import { getWeeklySummaries } from "./actions";
import type { WeeklySummaryResult } from "./actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupportCard } from "@/components/support-card";
import { SubjectIcon } from "@/components/subject-icon";
import { cn } from "@/lib/utils";
import type { Badge, BadgeCriteria, Family, Lesson, Profile, Progress, Subject, UserBadge } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Shared types for sub-components
// ---------------------------------------------------------------------------

interface SubjectProgressItem {
  id: string;
  displayName: string;
  color: string;
  icon: string;
  completed: number;
  total: number;
}

interface ActivityItem {
  type: "lesson" | "badge";
  label: string;
  kidName: string;
  date: string;
  subjectColor?: string;
}

interface BadgeProgressStats {
  lessonsCompleted: number;
  chatSessionCount: number;
  uniqueCompletionDays: number;
  uniqueSubjectsAttempted: number;
}

export default async function ParentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ kid?: string }>;
}) {
  const { profile, supabase } = await requireAuth();
  const { kid: selectedKidId } = await searchParams;

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const allKids = (kidProfiles ?? []) as Profile[];
  const allKidIds = new Set(allKids.map((k) => k.id));

  // Filter to selected kid if the param is valid, otherwise show all
  const kids =
    selectedKidId && allKidIds.has(selectedKidId)
      ? allKids.filter((k) => k.id === selectedKidId)
      : allKids;
  const kidIds = kids.map((k) => k.id);

  // Fetch family billing tier
  const { data: familyRow } = await supabase
    .from("families")
    .select("subscription_tier")
    .eq("id", profile.family_id)
    .single();

  const family = familyRow as Pick<Family, "subscription_tier"> | null;
  const isFreeTier = family?.subscription_tier !== "supporter";

  // Fetch progress, badges, activity sessions, subjects, and lessons
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const [progressResult, badgesResult, activityTimeResult, subjectsResult, lessonsResult, activityDatesResult, allBadgesResult, chatSessionCountResult] = await Promise.all([
    kidIds.length > 0
      ? supabase
          .from("progress")
          .select("*, lessons(title, subject_id)")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
    kidIds.length > 0
      ? supabase
          .from("user_badges")
          .select("*, badges(*)")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
    kidIds.length > 0
      ? supabase
          .from("activity_sessions")
          .select("time_seconds")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
    supabase.from("subjects").select("id, display_name, color, icon, sort_order").order("sort_order"),
    supabase.from("lessons").select("id, subject_id"),
    kidIds.length > 0
      ? supabase
          .from("activity_sessions")
          .select("started_at")
          .in("profile_id", kidIds)
          .gte("started_at", ninetyDaysAgo)
      : Promise.resolve({ data: [] }),
    supabase.from("badges").select("*").order("name"),
    kidIds.length > 0
      ? supabase
          .from("chat_sessions")
          .select("id")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
  ]);

  type ProgressWithLesson = Progress & { lessons: { title: string; subject_id: string | null } | null };
  const allProgress = (progressResult.data ?? []) as ProgressWithLesson[];
  const allUserBadges = (badgesResult.data ?? []) as (UserBadge & { badges: Badge })[];
  const allBadges = (allBadgesResult.data ?? []) as Badge[];
  const chatSessionCount = (chatSessionCountResult.data ?? []).length;

  // Build subject lookup map and ordered subjects list
  const subjects = (subjectsResult.data ?? []) as Subject[];
  const subjectMap = new Map<string, { display_name: string; color: string; icon: string }>();
  for (const s of subjects) {
    subjectMap.set(s.id, { display_name: s.display_name, color: s.color, icon: s.icon });
  }

  // Build per-subject lesson counts (total available)
  const allLessons = (lessonsResult.data ?? []) as Pick<Lesson, "id" | "subject_id">[];
  const totalLessonsBySubject = new Map<string, number>();
  for (const lesson of allLessons) {
    if (lesson.subject_id) {
      totalLessonsBySubject.set(
        lesson.subject_id,
        (totalLessonsBySubject.get(lesson.subject_id) ?? 0) + 1,
      );
    }
  }

  // Build per-subject completed counts
  const completedBySubject = new Map<string, number>();
  for (const p of (progressResult.data ?? []) as ProgressWithLesson[]) {
    if (p.status === "completed" && p.lessons?.subject_id) {
      completedBySubject.set(
        p.lessons.subject_id,
        (completedBySubject.get(p.lessons.subject_id) ?? 0) + 1,
      );
    }
  }

  // Build subject progress data for rings
  const subjectProgressData: SubjectProgressItem[] = subjects.map((s) => ({
    id: s.id,
    displayName: s.display_name,
    color: s.color,
    icon: s.icon,
    completed: completedBySubject.get(s.id) ?? 0,
    total: totalLessonsBySubject.get(s.id) ?? 0,
  }));

  // Build heatmap data: count activities per day for last 90 days
  const activityDates = (activityDatesResult.data ?? []) as { started_at: string }[];
  const activityCountByDate = new Map<string, number>();
  for (const session of activityDates) {
    if (session.started_at) {
      const dateKey = session.started_at.slice(0, 10); // YYYY-MM-DD
      activityCountByDate.set(dateKey, (activityCountByDate.get(dateKey) ?? 0) + 1);
    }
  }
  // Also count completed lessons as activity
  for (const p of (progressResult.data ?? []) as ProgressWithLesson[]) {
    if (p.completed_at) {
      const dateKey = p.completed_at.slice(0, 10);
      activityCountByDate.set(dateKey, (activityCountByDate.get(dateKey) ?? 0) + 1);
    }
  }

  // Calculate total time on platform
  const totalTimeSeconds = ((activityTimeResult.data ?? []) as { time_seconds: number }[])
    .reduce((sum, s) => sum + (s.time_seconds ?? 0), 0);
  const totalHours = Math.floor(totalTimeSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeSeconds % 3600) / 60);
  const timeDisplay = totalTimeSeconds === 0
    ? "0 min"
    : totalHours > 0
      ? `${totalHours}h ${totalMinutes}m`
      : `${totalMinutes} min`;

  const lessonsCompleted = allProgress.filter(
    (p) => p.status === "completed",
  ).length;
  const badgesEarned = allUserBadges.length;

  // Aggregate streak across all kids (show the best active streak)
  const bestStreak = kids.reduce(
    (max, kid) => Math.max(max, kid.current_streak ?? 0),
    0,
  );

  // Stats for badge progress hints
  const uniqueCompletionDays = new Set(
    allProgress
      .filter((p) => p.status === "completed" && p.completed_at)
      .map((p) => p.completed_at!.slice(0, 10)),
  ).size;

  const uniqueSubjectsAttempted = new Set(
    allProgress
      .filter((p) => p.lessons?.subject_id)
      .map((p) => p.lessons!.subject_id!),
  ).size;

  const earnedBadgeIds = new Set(allUserBadges.map((ub) => ub.badge_id));

  const badgeProgressStats: BadgeProgressStats = {
    lessonsCompleted,
    chatSessionCount,
    uniqueCompletionDays,
    uniqueSubjectsAttempted,
  };

  // Recent activity: combine completed lessons and earned badges, sort by date
  const recentActivity: ActivityItem[] = [];

  for (const p of allProgress) {
    if (p.status === "completed" && p.completed_at) {
      const kid = kids.find((k) => k.id === p.profile_id);
      const lessonTitle = p.lessons?.title;
      const subjectId = p.lessons?.subject_id;
      const subject = subjectId ? subjectMap.get(subjectId) : undefined;

      recentActivity.push({
        type: "lesson",
        label: lessonTitle
          ? `Completed "${lessonTitle}"${subject ? ` in ${subject.display_name}` : ""}`
          : "Completed a lesson",
        kidName: kid?.display_name ?? "Unknown",
        date: p.completed_at,
        subjectColor: subject?.color,
      });
    }
  }

  for (const ub of allUserBadges) {
    const kid = kids.find((k) => k.id === ub.profile_id);
    recentActivity.push({
      type: "badge",
      label: `Earned "${ub.badges.name}"`,
      kidName: kid?.display_name ?? "Unknown",
      date: ub.earned_at,
    });
  }

  // Sort newest first, take top 8
  recentActivity.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const topActivity = recentActivity.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {kids.length > 0
              ? `Tracking progress for ${kids.map((k) => k.display_name).join(", ")}`
              : "No kid profiles found in your family yet."}
          </p>
        </div>
      </FadeIn>

      {/* Summary cards */}
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem>
          <SummaryCard
            icon={BookOpen}
            label="Lessons Completed"
            value={lessonsCompleted}
            accent="text-chart-1"
            bgAccent="bg-chart-1/10"
          />
        </StaggerItem>
        <StaggerItem>
          <SummaryCard
            icon={Trophy}
            label="Badges Earned"
            value={badgesEarned}
            accent="text-chart-2"
            bgAccent="bg-chart-2/10"
          />
        </StaggerItem>
        <StaggerItem>
          <SummaryCard
            icon={Clock}
            label="Time Learning"
            value={timeDisplay}
            accent="text-chart-3"
            bgAccent="bg-chart-3/10"
          />
        </StaggerItem>
        <StaggerItem>
          <SummaryCard
            icon={Flame}
            label="Active Streak"
            value={bestStreak > 0 ? `${bestStreak} day${bestStreak !== 1 ? "s" : ""}` : "0"}
            accent="text-chart-4"
            bgAccent="bg-chart-4/10"
            subtitle="Active Streak"
          />
        </StaggerItem>
      </Stagger>

      {/* Subject Progress Rings */}
      {subjects.length > 0 && (
        <FadeIn delay={0.05}>
          <SubjectProgressRings subjects={subjectProgressData} />
        </FadeIn>
      )}

      {/* Activity Heatmap */}
      <FadeIn delay={0.08}>
        <ActivityHeatmap
          activityByDate={activityCountByDate}
          currentStreak={bestStreak}
        />
      </FadeIn>

      {/* Badge Showcase */}
      {allBadges.length > 0 && (
        <FadeIn delay={0.1}>
          <BadgeShowcase
            allBadges={allBadges}
            earnedBadgeIds={earnedBadgeIds}
            earnedBadges={allUserBadges}
            stats={badgeProgressStats}
          />
        </FadeIn>
      )}

      {/* Recent activity + quick links */}
      <FadeIn delay={0.12}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent activity */}
          <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="size-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topActivity.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No activity yet. Once your child starts learning, their
                progress will show up here!
              </p>
            ) : (
              <ul className="space-y-3">
                {topActivity.map((item) => (
                  <li key={`${item.type}-${item.kidName}-${item.date}`} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        !item.subjectColor && "bg-muted",
                      )}
                      style={item.subjectColor ? { backgroundColor: `${item.subjectColor}1F` } : undefined}
                    >
                      {item.type === "lesson" ? (
                        <BookOpen
                          className={cn("size-4", !item.subjectColor && "text-muted-foreground")}
                          style={item.subjectColor ? { color: item.subjectColor } : undefined}
                        />
                      ) : (
                        <Trophy className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.kidName} &middot; {formatDate(item.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-1/10">
                <BarChart3 className="size-5 text-chart-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  Detailed Progress
                </p>
                <p className="text-xs text-muted-foreground">
                  Lesson-by-lesson breakdown
                </p>
              </div>
              <Button asChild variant="ghost" size="icon" aria-label="View detailed progress">
                <Link href="/dashboard/progress">
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-2/10">
                <Star className="size-5 text-chart-2" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  Learning Reports
                </p>
                <p className="text-xs text-muted-foreground">
                  Per-subject analytics & trends
                </p>
              </div>
              <Button asChild variant="ghost" size="icon" aria-label="View learning reports">
                <Link href="/dashboard/reports">
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-5/10">
                <MessageSquare className="size-5 text-chart-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  AI Chat History
                </p>
                <p className="text-xs text-muted-foreground">
                  Review Chip conversations
                </p>
              </div>
              <Button asChild variant="ghost" size="icon" aria-label="View AI chat history">
                <Link href="/dashboard/ai-history">
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </FadeIn>

      {/* Support card -- only shown to free-tier families */}
      {isFreeTier && kids.length > 0 && (
        <SupportCard
          kidName={kids.length === 1 ? kids[0].display_name : "Your family"}
          lessonsCompleted={lessonsCompleted}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent: string;
  bgAccent: string;
  subtitle?: string;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
  bgAccent,
  subtitle,
}: SummaryCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-4 py-5">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bgAccent}`}
        >
          <Icon className={`size-5 ${accent}`} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle ?? label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Subject Progress Rings
// ---------------------------------------------------------------------------

interface SubjectProgressRingsProps {
  subjects: SubjectProgressItem[];
}

function SubjectProgressRings({ subjects }: SubjectProgressRingsProps) {
  const RING_SIZE = 64;
  const STROKE_WIDTH = 5;
  const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="size-4 text-primary" />
          Subject Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {subjects.map((subject) => {
            const progress = subject.total > 0 ? subject.completed / subject.total : 0;
            const dashOffset = CIRCUMFERENCE * (1 - progress);

            return (
              <div key={subject.id} className="flex flex-col items-center gap-2">
                {/* SVG Ring */}
                <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
                  <svg
                    width={RING_SIZE}
                    height={RING_SIZE}
                    viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                    className="-rotate-90"
                  >
                    {/* Background track */}
                    <circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RADIUS}
                      fill="none"
                      className="stroke-muted"
                      strokeWidth={STROKE_WIDTH}
                    />
                    {/* Progress arc */}
                    {progress > 0 && (
                      <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        stroke={subject.color}
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
                      />
                    )}
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-foreground">
                      {subject.total > 0
                        ? `${subject.completed}/${subject.total}`
                        : "0"}
                    </span>
                  </div>
                </div>

                {/* Icon + Label */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex size-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${subject.color}1F` }}
                  >
                    <SubjectIcon
                      icon={subject.icon}
                      className="size-3.5"
                      style={{ color: subject.color }}
                    />
                  </div>
                  <span className="text-center text-xs font-medium text-muted-foreground leading-tight">
                    {subject.displayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Activity Heatmap
// ---------------------------------------------------------------------------

interface ActivityHeatmapProps {
  activityByDate: Map<string, number>;
  currentStreak: number;
}

function ActivityHeatmap({ activityByDate, currentStreak }: ActivityHeatmapProps) {
  // Build 13 weeks of data (91 days) ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the start of the grid: go back to fill complete weeks.
  // We want the grid to end on today's column, with 13 full columns.
  const todayDayOfWeek = today.getDay(); // 0=Sun
  const endOfGrid = new Date(today);
  const startOfGrid = new Date(endOfGrid);
  startOfGrid.setDate(startOfGrid.getDate() - (12 * 7 + todayDayOfWeek));

  // Generate all cells
  const CELL_SIZE = 13;
  const CELL_GAP = 3;
  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const BRAND_COLOR = "#F97316"; // primary orange

  interface HeatmapCell {
    date: Date;
    dateStr: string;
    count: number;
    col: number;
    row: number;
  }

  const cells: HeatmapCell[] = [];
  const totalDays = 13 * 7;
  const cursor = new Date(startOfGrid);

  for (let i = 0; i < totalDays; i++) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const dayOfWeek = cursor.getDay();
    const col = Math.floor(i / 7);
    const row = dayOfWeek;

    // Only include cells up to today
    if (cursor <= today) {
      cells.push({
        date: new Date(cursor),
        dateStr,
        count: activityByDate.get(dateStr) ?? 0,
        col,
        row,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  // Compute month labels: check when a new month starts at the top of a column
  const monthLabels: { col: number; label: string }[] = [];
  const seenMonths = new Set<string>();
  for (const cell of cells) {
    if (cell.row === 0) {
      const monthKey = `${cell.date.getFullYear()}-${cell.date.getMonth()}`;
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        monthLabels.push({ col: cell.col, label: MONTH_NAMES[cell.date.getMonth()] });
      }
    }
  }

  // Color for a given count
  function getCellColor(count: number): string {
    if (count === 0) return "var(--color-muted)";
    if (count === 1) return `color-mix(in oklch, ${BRAND_COLOR} 30%, var(--color-muted))`;
    if (count <= 3) return `color-mix(in oklch, ${BRAND_COLOR} 55%, var(--color-muted))`;
    return BRAND_COLOR;
  }

  // Tooltip text
  function getTooltip(cell: HeatmapCell): string {
    const dateLabel = cell.date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (cell.count === 0) return `${dateLabel}: No activity`;
    return `${dateLabel}: ${cell.count} activit${cell.count === 1 ? "y" : "ies"}`;
  }

  // SVG dimensions
  const LABEL_WIDTH = 20;
  const MONTH_LABEL_HEIGHT = 16;
  const gridWidth = 13 * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const gridHeight = 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const svgWidth = LABEL_WIDTH + gridWidth;
  const svgHeight = MONTH_LABEL_HEIGHT + gridHeight;

  // Count total activities
  const totalActivities = cells.reduce((sum, c) => sum + c.count, 0);
  const activeDays = cells.filter((c) => c.count > 0).length;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4 text-primary" />
            Activity
          </CardTitle>
          <div className="flex items-center gap-4">
            {currentStreak > 0 && (
              <div className="flex items-center gap-1.5">
                <Flame className="size-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {currentStreak} day{currentStreak !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-muted-foreground">streak</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="block"
            role="img"
            aria-label={`Activity heatmap: ${totalActivities} activities across ${activeDays} days in the last 90 days`}
          >
            {/* Month labels */}
            {monthLabels.map(({ col, label }) => (
              <text
                key={`month-${col}`}
                x={LABEL_WIDTH + col * (CELL_SIZE + CELL_GAP)}
                y={MONTH_LABEL_HEIGHT - 4}
                className="fill-muted-foreground"
                fontSize={10}
                fontFamily="inherit"
              >
                {label}
              </text>
            ))}

            {/* Day labels (only show Sun, Tue, Thu, Sat to avoid crowding) */}
            {[0, 2, 4, 6].map((row) => (
              <text
                key={`day-${row}`}
                x={0}
                y={MONTH_LABEL_HEIGHT + row * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 2}
                className="fill-muted-foreground"
                fontSize={9}
                fontFamily="inherit"
              >
                {DAY_LABELS[row]}
              </text>
            ))}

            {/* Heatmap cells */}
            {cells.map((cell) => (
              <rect
                key={cell.dateStr}
                x={LABEL_WIDTH + cell.col * (CELL_SIZE + CELL_GAP)}
                y={MONTH_LABEL_HEIGHT + cell.row * (CELL_SIZE + CELL_GAP)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                ry={3}
                fill={getCellColor(cell.count)}
                style={{ transition: "fill 0.2s ease" }}
              >
                <title>{getTooltip(cell)}</title>
              </rect>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {totalActivities} activit{totalActivities === 1 ? "y" : "ies"} in the last 90 days
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 4].map((count) => (
              <div
                key={count}
                className="size-3 rounded-sm"
                style={{ backgroundColor: getCellColor(count) }}
              />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Badge Showcase
// ---------------------------------------------------------------------------

/** Map lucide icon name strings (from DB) to actual icon components */
const BADGE_ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "zap": Zap,
  "message-square": MessageSquare,
  "message-circle": MessageCircle,
  "calendar": Calendar,
  "calendar-check": CalendarCheck,
  "globe": Globe,
  "award": Award,
  "cpu": Cpu,
  "log-in": LogIn,
  "folder-open": FolderOpen,
  "star": Star,
  "trophy": Trophy,
  "footprints": Footprints,
  "play": Play,
  "compass": Compass,
  "flame": Flame,
  "sparkles": Sparkles,
  "lock": Lock,
};

function getBadgeIcon(iconName: string): LucideIcon {
  return BADGE_ICONS[iconName] ?? Award;
}

/** Calculate a human-readable progress hint for an unearned badge */
function getBadgeProgressHint(
  criteria: BadgeCriteria,
  stats: BadgeProgressStats,
): string {
  const { type, threshold } = criteria;

  switch (type) {
    case "lessons_completed":
      return `${Math.min(stats.lessonsCompleted, threshold)}/${threshold} lessons`;
    case "chat_sessions":
      return `${Math.min(stats.chatSessionCount, threshold)}/${threshold} chats`;
    case "unique_days_with_completions":
      return `${Math.min(stats.uniqueCompletionDays, threshold)}/${threshold} days`;
    case "unique_subjects_attempted":
    case "cross_subject":
      return `${Math.min(stats.uniqueSubjectsAttempted, threshold)}/${threshold} subjects`;
    case "simulator_runs":
      return `0/${threshold} runs`;
    case "first_login":
      return "Log in to earn";
    case "device_flash":
      return `0/${threshold} flashes`;
    case "projects_saved":
      return `0/${threshold} projects`;
    default:
      return `0/${threshold}`;
  }
}

interface BadgeShowcaseProps {
  allBadges: Badge[];
  earnedBadgeIds: Set<string>;
  earnedBadges: (UserBadge & { badges: Badge })[];
  stats: BadgeProgressStats;
}

function BadgeShowcase({
  allBadges,
  earnedBadgeIds,
  earnedBadges,
  stats,
}: BadgeShowcaseProps) {
  const earnedCount = earnedBadgeIds.size;
  const totalCount = allBadges.length;

  // Build a map from badge_id to earned_at for quick lookup
  const earnedDateMap = new Map<string, string>();
  for (const ub of earnedBadges) {
    earnedDateMap.set(ub.badge_id, ub.earned_at);
  }

  // Sort: earned badges first, then unearned
  const sortedBadges = [...allBadges].sort((a, b) => {
    const aEarned = earnedBadgeIds.has(a.id) ? 0 : 1;
    const bEarned = earnedBadgeIds.has(b.id) ? 0 : 1;
    if (aEarned !== bEarned) return aEarned - bEarned;
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="size-4 text-primary" />
            Badges
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {earnedCount} of {totalCount} earned
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {totalCount === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No badges available yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {sortedBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              const earnedAt = earnedDateMap.get(badge.id);
              const Icon = getBadgeIcon(badge.icon);

              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-3",
                    isEarned
                      ? "bg-amber-50/50 dark:bg-amber-950/20"
                      : "opacity-60",
                  )}
                  title={badge.description}
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full",
                      isEarned
                        ? "bg-primary/10 ring-2 ring-amber-300/50"
                        : "bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-6",
                        isEarned
                          ? "text-primary"
                          : "text-muted-foreground/30",
                      )}
                    />
                  </div>

                  {/* Badge name */}
                  <span
                    className={cn(
                      "text-center text-xs font-medium leading-tight",
                      isEarned ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {badge.name}
                  </span>

                  {/* Earned date or progress hint */}
                  {isEarned && earnedAt ? (
                    <span className="text-[10px] text-muted-foreground">
                      {formatShortDate(earnedAt)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/70">
                      {getBadgeProgressHint(badge.criteria, stats)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
