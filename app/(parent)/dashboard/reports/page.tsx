import type { Metadata } from "next";
import {
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Flame,
  Lightbulb,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { SubjectIcon } from "@/components/subject-icon";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { safeColor } from "@/lib/utils";
import { PrintButton } from "./print-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Profile, Subject, SkillLevel } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Learning Reports" };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivitySessionRow {
  id: string;
  profile_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  correct_first_try: number;
  correct_total: number;
  time_seconds: number;
  hints_used: number;
  created_at: string;
}

interface LessonRow {
  id: string;
  subject_id: string | null;
  title: string;
}

interface SkillProficiencyRow {
  id: string;
  profile_id: string;
  skill_id: string;
  level: SkillLevel;
  attempts: number;
  correct: number;
  skills: { id: string; name: string; subject_id: string } | null;
}

interface SkillMastery {
  skillId: string;
  name: string;
  level: SkillLevel;
  levelValue: number;
}

interface SubjectReport {
  subject: Subject;
  sessionsCount: number;
  avgScore: number;
  totalTimeMinutes: number;
  totalQuestions: number;
  correctFirstTry: number;
  hintsUsed: number;
  recentTrend: "improving" | "stable" | "declining";
  skills: SkillMastery[];
}

const MASTERY_ORDER: Record<SkillLevel, number> = {
  not_started: 0,
  beginning: 1,
  developing: 2,
  proficient: 3,
  mastered: 4,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ kid?: string }>;
}) {
  const { profile, supabase } = await requireAuth();
  const { kid: selectedKidId } = await searchParams;

  // Fetch kid profiles
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

  if (kidIds.length === 0) {
    return (
      <div className="space-y-8">
        <FadeIn>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Learning Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No kid profiles found. Add a child to your family to see reports.
          </p>
        </FadeIn>
      </div>
    );
  }

  // Fetch subjects, activity sessions, lessons, and skill proficiency
  const [
    subjectsResult,
    sessionsResult,
    lessonsResult,
    progressResult,
    skillProfResult,
  ] = await Promise.all([
    supabase.from("subjects").select("*").order("sort_order"),
    supabase
      .from("activity_sessions")
      .select(
        "id, profile_id, lesson_id, score, total_questions, correct_first_try, correct_total, time_seconds, hints_used, created_at",
      )
      .in("profile_id", kidIds)
      .order("created_at", { ascending: false }),
    supabase.from("lessons").select("id, subject_id, title"),
    supabase
      .from("progress")
      .select("*")
      .in("profile_id", kidIds)
      .eq("status", "completed"),
    supabase
      .from("skill_proficiency")
      .select("*, skills(id, name, subject_id)")
      .in("profile_id", kidIds),
  ]);

  const subjects = ((subjectsResult.data ?? []) as Subject[]).map((s) => ({
    ...s,
    color: safeColor(s.color),
  }));
  const sessions = (sessionsResult.data ?? []) as ActivitySessionRow[];
  const lessons = (lessonsResult.data ?? []) as LessonRow[];
  const completedCount = (progressResult.data ?? []).length;
  const skillProficiencies = (skillProfResult.data ??
    []) as SkillProficiencyRow[];

  // Group skill proficiencies by subject, taking the best mastery per skill
  const skillsBySubject = new Map<string, Map<string, SkillMastery>>();
  for (const sp of skillProficiencies) {
    if (!sp.skills) continue;
    const { subject_id } = sp.skills;
    const levelValue = MASTERY_ORDER[sp.level];

    if (!skillsBySubject.has(subject_id)) {
      skillsBySubject.set(subject_id, new Map());
    }
    const subjectSkills = skillsBySubject.get(subject_id)!;
    const existing = subjectSkills.get(sp.skill_id);

    // Keep the highest mastery level across all kids
    if (!existing || levelValue > existing.levelValue) {
      subjectSkills.set(sp.skill_id, {
        skillId: sp.skill_id,
        name: sp.skills.name,
        level: sp.level,
        levelValue,
      });
    }
  }

  // Build lesson -> subject map
  const lessonSubjectMap = new Map<string, string>();
  for (const l of lessons) {
    if (l.subject_id) {
      lessonSubjectMap.set(l.id, l.subject_id);
    }
  }

  // Group sessions by subject
  const sessionsBySubject = new Map<string, ActivitySessionRow[]>();
  for (const s of sessions) {
    const subjectId = lessonSubjectMap.get(s.lesson_id);
    if (!subjectId) continue;
    const group = sessionsBySubject.get(subjectId) ?? [];
    group.push(s);
    sessionsBySubject.set(subjectId, group);
  }

  // Build per-subject reports
  const reports: SubjectReport[] = [];
  for (const subject of subjects) {
    const subSessions = sessionsBySubject.get(subject.id) ?? [];
    if (subSessions.length === 0) continue;

    const avgScore =
      subSessions.reduce((sum, s) => sum + s.score, 0) / subSessions.length;
    const totalTimeMinutes = Math.round(
      subSessions.reduce((sum, s) => sum + s.time_seconds, 0) / 60,
    );
    const totalQuestions = subSessions.reduce(
      (sum, s) => sum + s.total_questions,
      0,
    );
    const correctFirstTry = subSessions.reduce(
      (sum, s) => sum + s.correct_first_try,
      0,
    );
    const hintsUsed = subSessions.reduce((sum, s) => sum + s.hints_used, 0);

    // Compute trend: compare first half vs second half scores
    const half = Math.floor(subSessions.length / 2);
    let recentTrend: "improving" | "stable" | "declining" = "stable";
    if (subSessions.length >= 4) {
      // Sessions are ordered newest first
      const recentAvg =
        subSessions
          .slice(0, half)
          .reduce((sum, s) => sum + s.score, 0) / half;
      const olderAvg =
        subSessions
          .slice(half)
          .reduce((sum, s) => sum + s.score, 0) /
        (subSessions.length - half);

      if (recentAvg - olderAvg > 5) recentTrend = "improving";
      else if (olderAvg - recentAvg > 5) recentTrend = "declining";
    }

    // Gather skills for this subject (skip not_started)
    const subjectSkillMap = skillsBySubject.get(subject.id);
    const subjectSkills: SkillMastery[] = [];
    if (subjectSkillMap) {
      for (const skill of subjectSkillMap.values()) {
        if (skill.level !== "not_started") {
          subjectSkills.push(skill);
        }
      }
      // Sort by mastery level descending, then alphabetically
      subjectSkills.sort(
        (a, b) => b.levelValue - a.levelValue || a.name.localeCompare(b.name),
      );
    }

    reports.push({
      subject,
      sessionsCount: subSessions.length,
      avgScore: Math.round(avgScore),
      totalTimeMinutes,
      totalQuestions,
      correctFirstTry,
      hintsUsed,
      recentTrend,
      skills: subjectSkills,
    });
  }

  // Sort by sessions count (most active first)
  reports.sort((a, b) => b.sessionsCount - a.sessionsCount);

  // Overall stats
  const totalSessions = sessions.length;
  const overallAvgScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length,
        )
      : 0;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.time_seconds, 0) / 60,
  );
  const bestStreak = kids.reduce(
    (max, k) => Math.max(max, k.current_streak ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Print-only header -- hidden on screen, shown when printing */}
      <div className="print-header hidden">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-xl font-bold">TinkerSchool Learning Report</h1>
          <p className="text-sm text-gray-600">
            Student: {kids.map((k) => k.display_name).join(", ")} | Generated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Page header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Learning Reports
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Detailed analytics for{" "}
              {selectedKidId && allKidIds.has(selectedKidId)
                ? kids[0].display_name
                : kids.map((k) => k.display_name).join(", ")}
            </p>
          </div>
          <PrintButton />
        </div>
      </FadeIn>

      {/* Overview stats */}
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            icon={BookOpen}
            label="Lessons Completed"
            value={completedCount}
            accent="text-blue-600"
            bgAccent="bg-blue-500/10"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Star}
            label="Average Score"
            value={`${overallAvgScore}%`}
            accent="text-amber-600"
            bgAccent="bg-amber-500/10"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Clock}
            label="Total Time"
            value={`${totalMinutes} min`}
            accent="text-emerald-600"
            bgAccent="bg-emerald-500/10"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Flame}
            label="Active Streak"
            value={`${bestStreak} day${bestStreak !== 1 ? "s" : ""}`}
            accent="text-orange-600"
            bgAccent="bg-orange-500/10"
          />
        </StaggerItem>
      </Stagger>

      {/* Per-subject reports */}
      {reports.length > 0 ? (
        <section className="space-y-4">
          <FadeIn>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                By Subject
              </h2>
            </div>
          </FadeIn>

          <Stagger className="space-y-4">
            {reports.map((report) => (
              <StaggerItem key={report.subject.id}>
                <SubjectReportCard report={report} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : (
        <FadeIn>
          <Card className="rounded-2xl py-12 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Brain className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No activity data yet. Reports will appear once your child
                completes interactive lessons.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Insights */}
      {reports.length > 0 && (
        <FadeIn delay={0.1}>
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="size-5 text-amber-500" />
                <CardTitle className="text-base">Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground/80">
                {reports.length > 0 && (
                  <li className="flex items-start gap-2">
                    <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      Strongest subject:{" "}
                      <strong>
                        {
                          reports.reduce((best, r) =>
                            r.avgScore > best.avgScore ? r : best,
                          ).subject.display_name
                        }
                      </strong>{" "}
                      with an average score of{" "}
                      {
                        reports.reduce((best, r) =>
                          r.avgScore > best.avgScore ? r : best,
                        ).avgScore
                      }
                      %
                    </span>
                  </li>
                )}
                {reports.some((r) => r.recentTrend === "improving") && (
                  <li className="flex items-start gap-2">
                    <TrendingUp className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      Improving in:{" "}
                      {reports
                        .filter((r) => r.recentTrend === "improving")
                        .map((r) => r.subject.display_name)
                        .join(", ")}
                    </span>
                  </li>
                )}
                {totalSessions >= 5 && (
                  <li className="flex items-start gap-2">
                    <Star className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span>
                      {totalSessions} activity sessions completed across all
                      subjects
                    </span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  bgAccent,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent: string;
  bgAccent: string;
}) {
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
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectReportCard({ report }: { report: SubjectReport }) {
  const { subject, sessionsCount, avgScore, totalTimeMinutes, totalQuestions, correctFirstTry, hintsUsed, recentTrend, skills } = report;
  const firstTryRate = totalQuestions > 0 ? Math.round((correctFirstTry / totalQuestions) * 100) : 0;

  return (
    <Card
      className="rounded-2xl"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: subject.color,
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${subject.color}1F` }}
          >
            <SubjectIcon
              icon={subject.icon}
              className="size-5"
              style={{ color: subject.color }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{subject.display_name}</CardTitle>
            <CardDescription>
              {sessionsCount} session{sessionsCount !== 1 ? "s" : ""} completed
            </CardDescription>
          </div>
          <TrendBadge trend={recentTrend} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat label="Avg Score" value={`${avgScore}%`} />
          <MiniStat label="Time Spent" value={`${totalTimeMinutes} min`} />
          <MiniStat label="First Try" value={`${firstTryRate}%`} />
          <MiniStat label="Hints Used" value={hintsUsed} />
        </div>

        {/* Score bar visualization */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Performance</span>
            <span className="font-medium">{avgScore}%</span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={avgScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${subject.display_name} average score`}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${avgScore}%`,
                backgroundColor: subject.color,
              }}
            />
          </div>
        </div>

        {/* Skill mastery pills */}
        {skills.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <SkillPill
                  key={skill.skillId}
                  skill={skill}
                  subjectColor={subject.color}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SkillPill({
  skill,
  subjectColor,
}: {
  skill: SkillMastery;
  subjectColor: string;
}) {
  // Mastery-based styling using subject color
  const styles: Record<
    Exclude<SkillLevel, "not_started">,
    { backgroundColor: string; color: string }
  > = {
    mastered: {
      backgroundColor: subjectColor,
      color: "#ffffff",
    },
    proficient: {
      backgroundColor: `${subjectColor}4D`, // 30% opacity
      color: subjectColor,
    },
    developing: {
      backgroundColor: "var(--muted)",
      color: "var(--foreground)",
    },
    beginning: {
      backgroundColor: "color-mix(in srgb, var(--muted) 60%, transparent)",
      color: "var(--muted-foreground)",
    },
  };

  const style = styles[skill.level as Exclude<SkillLevel, "not_started">];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={style}
      title={`${skill.name}: ${skill.level.replace("_", " ")}`}
    >
      {skill.name}
    </span>
  );
}

function TrendBadge({
  trend,
}: {
  trend: "improving" | "stable" | "declining";
}) {
  switch (trend) {
    case "improving":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-300 text-emerald-600"
        >
          <TrendingUp className="size-3" />
          Improving
        </Badge>
      );
    case "declining":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-300 text-amber-600"
        >
          Needs practice
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          Stable
        </Badge>
      );
  }
}
