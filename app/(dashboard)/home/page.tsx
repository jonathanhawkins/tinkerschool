import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MissionControlWalkthrough } from "@/components/mission-control-walkthrough";

export const metadata: Metadata = {
  title: "Mission Control",
  robots: { index: false, follow: false },
};
import {
  Rocket,
  Paintbrush,
  Monitor,
  Play,
  Wrench,
  ImageIcon,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Bug,
  Palette,
  Music,
  Repeat,
  Trophy,
  Award,
  Vibrate,
  Move,
  Headphones,
  Dice1,
  Lock,
  Calculator,
  BookOpen,
  FlaskConical,
  Code2,
  Puzzle,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  MessageCircle,
  Flame,
  Star,
} from "lucide-react";

import { SubjectIcon } from "@/components/subject-icon";
import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import type {
  Module,
  Lesson,
  Progress,
  Badge,
  UserBadge,
  ProgressStatus,
  Subject,
  Skill,
  SkillProficiency,
} from "@/lib/supabase/types";
import { cn, safeColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { FadeIn, Stagger, StaggerItem, HoverLift } from "@/components/motion";
import { getLevelForXP, getNextLevelXP } from "@/lib/gamification/xp";

function ModuleIcon({
  icon,
  className,
  style,
}: {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const props = { className, style };
  switch (icon) {
    case "monitor":
      return <Monitor {...props} />;
    case "rocket":
      return <Rocket {...props} />;
    case "paintbrush":
      return <Paintbrush {...props} />;
    case "palette":
      return <Palette {...props} />;
    case "vibrate":
      return <Vibrate {...props} />;
    case "music":
      return <Music {...props} />;
    case "move":
      return <Move {...props} />;
    case "calculator":
      return <Calculator {...props} />;
    case "book-open":
      return <BookOpen {...props} />;
    case "flask-conical":
      return <FlaskConical {...props} />;
    case "code-2":
      return <Code2 {...props} />;
    case "puzzle":
      return <Puzzle {...props} />;
    default:
      return <Rocket {...props} />;
  }
}

function BadgeIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "zap":
      return <Zap className={className} />;
    case "bug":
      return <Bug className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "music":
      return <Music className={className} />;
    case "brush":
      return <Paintbrush className={className} />;
    case "repeat":
      return <Repeat className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    case "vibrate":
      return <Vibrate className={className} />;
    case "dice":
      return <Dice1 className={className} />;
    case "headphones":
      return <Headphones className={className} />;
    case "move":
      return <Move className={className} />;
    default:
      return <Award className={className} />;
  }
}

// ---------------------------------------------------------------------------
// Types for joined query results
// ---------------------------------------------------------------------------

interface UserBadgeWithBadge extends UserBadge {
  badges: Badge;
}

interface SkillProficiencyWithSkill extends SkillProficiency {
  skills: Skill;
}

// ---------------------------------------------------------------------------
// Helper to derive lesson status from progress records
// ---------------------------------------------------------------------------

function getLessonStatus(
  lessonId: string,
  progressMap: Map<string, Progress>,
): ProgressStatus {
  const p = progressMap.get(lessonId);
  if (!p) return "not_started";
  return p.status;
}

// ---------------------------------------------------------------------------
// Compute a lighter tinted background from a hex color for card accents
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function tintedBg(hex: string, opacity: number = 0.1): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "transparent";
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

// ---------------------------------------------------------------------------
// Sub-components (server-rendered)
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: ProgressStatus }) {
  if (status === "completed") {
    return (
      <BadgeUI
        variant="default"
        className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"
      >
        <CheckCircle2 className="size-3" />
        Done
      </BadgeUI>
    );
  }

  if (status === "in_progress") {
    return (
      <BadgeUI
        variant="outline"
        className="gap-1 border-amber-400 text-amber-600"
      >
        <Clock className="size-3" />
        In Progress
      </BadgeUI>
    );
  }

  return (
    <BadgeUI variant="outline" className="gap-1 text-muted-foreground">
      <Circle className="size-3" />
      Not Started
    </BadgeUI>
  );
}

function LessonRow({
  lesson,
  status,
}: {
  lesson: Lesson;
  status: ProgressStatus;
}) {
  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent",
        status === "in_progress" && "bg-accent/60",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          status === "completed"
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            : status === "in_progress"
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
        )}
      >
        {status === "completed" ? (
          <CheckCircle2 className="size-4" />
        ) : (
          lesson.order_num
        )}
      </span>

      <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary">
        {lesson.title}
      </span>

      <StatusBadge status={status} />
    </Link>
  );
}

function SubjectCard({
  subject,
  skillsMastered,
  skillsTotal,
}: {
  subject: Subject;
  skillsMastered: number;
  skillsTotal: number;
}) {
  const progressPercent =
    skillsTotal > 0 ? (skillsMastered / skillsTotal) * 100 : 0;

  return (
    <Link href={`/subjects/${subject.slug}`} className="group block">
      <Card
        className="relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: `${subject.color}14`,
          borderLeftWidth: "4px",
          borderLeftColor: subject.color,
        }}
      >
        <CardContent className="flex items-start gap-4 p-5">
          {/* Icon circle -- tinted with subject color */}
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: `${subject.color}1F` }}
          >
            <SubjectIcon
              icon={subject.icon}
              className="size-6"
              style={{ color: subject.color }}
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3
                className="text-sm font-semibold"
                style={{ color: subject.color }}
              >
                {subject.display_name}
              </h3>
              <ArrowRight className="size-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </div>

            {/* Skill progress mini indicator */}
            {skillsTotal > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {skillsMastered} of {skillsTotal} skills
                  </span>
                  <span className="font-medium">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-background/60"
                  role="progressbar"
                  aria-valuenow={Math.round(progressPercent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${subject.display_name} skill progress`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Ready to explore</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ContinueLearningCard({
  lesson,
  moduleName,
  totalLessonsInModule,
  completedInModule,
  subjectColor,
  subjectName,
  subjectIcon,
}: {
  lesson: Lesson;
  moduleName: string;
  totalLessonsInModule: number;
  completedInModule: number;
  subjectColor: string | null;
  subjectName: string | null;
  subjectIcon: string | null;
}) {
  const progressPercent =
    totalLessonsInModule > 0
      ? (completedInModule / totalLessonsInModule) * 100
      : 0;

  return (
    <FadeIn>
      <Card className="rounded-2xl border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Continue Where You Left Off
                </p>
                {subjectName && subjectColor && (
                  <BadgeUI
                    variant="outline"
                    className="gap-1 text-xs"
                    style={{
                      borderColor: subjectColor,
                      color: subjectColor,
                    }}
                  >
                    {subjectIcon && (
                      <SubjectIcon icon={subjectIcon} className="size-3" />
                    )}
                    {subjectName}
                  </BadgeUI>
                )}
              </div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <CardDescription>{moduleName}</CardDescription>
            </div>
            <BadgeUI
              variant="outline"
              className="shrink-0 gap-1 border-amber-400 text-amber-600"
            >
              <Clock className="size-3" />
              In Progress
            </BadgeUI>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Module progress</span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar value={progressPercent} className="h-2.5" />
        </CardContent>

        <CardFooter>
          <Button asChild className="rounded-xl">
            <Link href={`/lessons/${lesson.id}`}>
              <Play className="size-4" />
              Continue
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  );
}

function ModuleCard({
  module,
  lessons,
  progressMap,
  locked,
  subjectColor,
}: {
  module: Module;
  lessons: Lesson[];
  progressMap: Map<string, Progress>;
  locked: boolean;
  subjectColor: string | null;
}) {
  const completedCount = lessons.filter(
    (l) => getLessonStatus(l.id, progressMap) === "completed",
  ).length;
  const totalCount = lessons.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (locked) {
    return (
      <Card className="rounded-2xl opacity-60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Lock className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base text-muted-foreground">
                {module.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                Complete the previous module to unlock!
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-center text-xs text-muted-foreground">
            {totalCount} lessons waiting for you
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="rounded-2xl border shadow-sm transition-shadow duration-200 hover:shadow-md"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: subjectColor ?? "var(--border)",
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: subjectColor
                ? tintedBg(subjectColor, 0.12)
                : undefined,
            }}
          >
            <ModuleIcon
              icon={module.icon}
              className="size-5"
              style={subjectColor ? { color: subjectColor } : undefined}
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{module.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">
              {module.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            status={getLessonStatus(lesson.id, progressMap)}
          />
        ))}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedCount} of {totalCount} lessons
          </span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${module.title} lesson progress`}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: subjectColor ?? "var(--primary)",
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

function EarnedBadge({ badge }: { badge: Badge }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <BadgeIcon icon={badge.icon} className="size-6 text-primary" />
      </div>
      <span className="text-xs font-medium text-foreground">{badge.name}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default async function MissionControlPage() {
  const { profile, supabase } = await requireAuth();

  // Resolve the active kid profile -- the dashboard should show the kid's
  // name and progress, not the parent's.
  const kidProfile = await getActiveKidProfile(profile, supabase);
  const activeProfile = kidProfile ?? profile;

  // ---- Data Fetching (all queries in parallel) ----
  const modulesPromise = supabase
    .from("modules")
    .select("*")
    .lte("band", activeProfile.current_band)
    .order("band")
    .order("order_num");

  const subjectsPromise = supabase
    .from("subjects")
    .select("*")
    .order("sort_order");

  const progressPromise = supabase
    .from("progress")
    .select("*")
    .eq("profile_id", activeProfile.id);

  const badgesPromise = supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("profile_id", activeProfile.id)
    .order("earned_at", { ascending: false });

  const skillProficiencyPromise = supabase
    .from("skill_proficiencies")
    .select("*, skills(*)")
    .eq("profile_id", activeProfile.id);

  // Fetch ALL skills so we can show accurate totals per subject even when
  // the kid hasn't started a subject yet.
  const allSkillsPromise = supabase
    .from("skills")
    .select("id, subject_id");

  const [
    { data: modules },
    { data: subjects },
    { data: progressRows },
    { data: userBadges },
    { data: skillProficiencies },
    { data: allSkills },
  ] = await Promise.all([
    modulesPromise,
    subjectsPromise,
    progressPromise,
    badgesPromise,
    skillProficiencyPromise,
    allSkillsPromise,
  ]);

  const safeModules: Module[] = modules ?? [];
  const safeSubjects: Subject[] = ((subjects as Subject[] | null) ?? []).map((s) => ({
    ...s,
    color: safeColor(s.color),
  }));
  const safeProgress: Progress[] = progressRows ?? [];
  const safeUserBadges: UserBadgeWithBadge[] =
    (userBadges as UserBadgeWithBadge[] | null) ?? [];
  const safeSkillProficiencies: SkillProficiencyWithSkill[] =
    (skillProficiencies as SkillProficiencyWithSkill[] | null) ?? [];

  // Fetch lessons for modules (depends on module IDs)
  const moduleIds = safeModules.map((m) => m.id);
  const { data: lessons } = moduleIds.length > 0
    ? await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("order_num")
    : { data: [] as Lesson[] };

  const safeLessons: Lesson[] = lessons ?? [];

  // ---- Build lookup maps ----

  // Progress: lessonId -> Progress
  const progressMap = new Map<string, Progress>();
  for (const p of safeProgress) {
    progressMap.set(p.lesson_id, p);
  }

  // Subjects: id -> Subject
  const subjectMap = new Map<string, Subject>();
  for (const s of safeSubjects) {
    subjectMap.set(s.id, s);
  }

  // Skills mastered per subject: subjectId -> { mastered, total }
  // Total comes from the full skills table so subjects show "X of Y skills"
  // even when the kid hasn't started that subject yet.
  const safeAllSkills = (allSkills ?? []) as Pick<Skill, "id" | "subject_id">[];

  const skillCountBySubject = new Map<
    string,
    { mastered: number; total: number }
  >();

  // First, count total skills per subject from the skills table
  for (const skill of safeAllSkills) {
    if (!skill.subject_id) continue;
    const current = skillCountBySubject.get(skill.subject_id) ?? {
      mastered: 0,
      total: 0,
    };
    current.total += 1;
    skillCountBySubject.set(skill.subject_id, current);
  }

  // Then, count mastered/proficient skills from the kid's proficiency records
  for (const sp of safeSkillProficiencies) {
    const subjectId = sp.skills?.subject_id;
    if (!subjectId) continue;

    if (sp.level === "mastered" || sp.level === "proficient") {
      const current = skillCountBySubject.get(subjectId) ?? {
        mastered: 0,
        total: 0,
      };
      current.mastered += 1;
      skillCountBySubject.set(subjectId, current);
    }
  }

  // Group lessons by module
  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of safeLessons) {
    const existing = lessonsByModule.get(lesson.module_id) ?? [];
    existing.push(lesson);
    lessonsByModule.set(lesson.module_id, existing);
  }

  // Group modules by subject for per-subject locking
  const modulesBySubject = new Map<string, Module[]>();
  for (const mod of safeModules) {
    const subjectId = mod.subject_id ?? "__none__";
    const existing = modulesBySubject.get(subjectId) ?? [];
    existing.push(mod);
    modulesBySubject.set(subjectId, existing);
  }

  // Precompute locked module IDs (per-subject sequential unlock)
  const lockedModuleIds = new Set<string>();
  for (const subjectModules of modulesBySubject.values()) {
    for (let i = 1; i < subjectModules.length; i++) {
      const prevMod = subjectModules[i - 1];
      const prevLessons = lessonsByModule.get(prevMod.id) ?? [];
      const prevCompleted = prevLessons.filter(
        (l) => getLessonStatus(l.id, progressMap) === "completed",
      ).length;
      const threshold = Math.ceil(prevLessons.length * 0.6);
      if (prevCompleted < threshold) {
        // Lock this and all subsequent modules in the subject
        for (let j = i; j < subjectModules.length; j++) {
          lockedModuleIds.add(subjectModules[j].id);
        }
        break;
      }
    }
  }

  // ---- Derive "continue learning" ----
  const inProgressEntries = safeProgress
    .filter((p) => p.status === "in_progress" && p.started_at)
    .sort(
      (a, b) =>
        new Date(b.started_at!).getTime() - new Date(a.started_at!).getTime(),
    );

  const continueProgress = inProgressEntries[0] ?? null;
  const continueLesson = continueProgress
    ? safeLessons.find((l) => l.id === continueProgress.lesson_id) ?? null
    : null;

  const continueModule = continueLesson
    ? safeModules.find((m) => m.id === continueLesson.module_id) ?? null
    : null;

  const continueLessonsInModule = continueModule
    ? safeLessons.filter((l) => l.module_id === continueModule.id)
    : [];
  const continueCompletedInModule = continueLessonsInModule.filter(
    (l) => getLessonStatus(l.id, progressMap) === "completed",
  ).length;

  // Find subject for the continue learning card
  const continueSubject =
    continueModule?.subject_id
      ? subjectMap.get(continueModule.subject_id) ?? null
      : null;

  // Count overall stats for the welcome header
  const totalCompleted = safeProgress.filter(
    (p) => p.status === "completed",
  ).length;

  // Find "getting started" lesson for brand-new users (0 lessons completed).
  // Prefer an interactive lesson (works in any browser, no hardware needed).
  // Try the "Count to 20" math lesson first -- it's the ideal first experience.
  // Fall back to any interactive lesson, then to the first lesson of any kind.
  const PREFERRED_FIRST_LESSON_ID = "b1010001-0001-4000-8000-000000000001";
  const firstInteractiveLesson =
    safeLessons.find((l) => l.id === PREFERRED_FIRST_LESSON_ID) ??
    safeLessons.find(
      (l) => l.lesson_type === "interactive" && !l.device_required,
    ) ??
    safeLessons[0] ??
    null;

  const firstStarterModule = firstInteractiveLesson
    ? safeModules.find((m) => m.id === firstInteractiveLesson.module_id) ?? null
    : null;

  const firstStarterSubject = firstStarterModule?.subject_id
    ? subjectMap.get(firstStarterModule.subject_id) ?? null
    : null;

  return (
    <div className="space-y-8">
      {/* Mission Control walkthrough for first-time users from onboarding */}
      <Suspense>
        <MissionControlWalkthrough />
      </Suspense>

      {/* ----- Welcome Header ----- */}
      <FadeIn>
        <header className="flex items-center gap-4">
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={64}
            height={64}
            className="size-16 shrink-0 drop-shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back to TinkerSchool, {activeProfile.display_name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalCompleted > 0
                ? `You've completed ${totalCompleted} lesson${totalCompleted !== 1 ? "s" : ""}. Keep exploring!`
                : "What do you want to learn today?"}
            </p>
          </div>
        </header>
      </FadeIn>

      {/* ----- Streak + XP Stats ----- */}
      <FadeIn delay={0.05}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-2">
            <Flame className="size-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">
              {activeProfile.current_streak > 0
                ? `${activeProfile.current_streak} day streak!`
                : "Start a streak today!"}
            </span>
          </div>

          {/* XP + Level */}
          {(() => {
            const xp = activeProfile.xp ?? 0;
            const levelInfo = getLevelForXP(xp);
            const nextXP = getNextLevelXP(xp);
            const progressPct = nextXP
              ? Math.round(((xp - levelInfo.minXP) / (nextXP - levelInfo.minXP)) * 100)
              : 100;
            return (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
                <Star className="size-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Level {levelInfo.level} &middot; {levelInfo.name}
                </span>
                <div
                  className="h-2 w-16 overflow-hidden rounded-full bg-primary/20"
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="XP progress"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {xp}{nextXP ? `/${nextXP}` : ""} XP
                </span>
              </div>
            );
          })()}
        </div>
      </FadeIn>

      {/* ----- Getting Started hero for brand-new users ----- */}
      {totalCompleted === 0 &&
        !continueLesson &&
        firstInteractiveLesson &&
        firstStarterModule && (
          <FadeIn>
            <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-[#EA580C]/5">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
                <div
                  className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: firstStarterSubject
                      ? `${firstStarterSubject.color}1F`
                      : undefined,
                  }}
                >
                  {firstStarterSubject ? (
                    <SubjectIcon
                      icon={firstStarterSubject.icon}
                      className="size-8"
                      style={{ color: firstStarterSubject.color }}
                    />
                  ) : (
                    <Rocket className="size-8 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    New here? Start your adventure!
                  </p>
                  <h2 className="text-xl font-bold text-foreground">
                    {firstInteractiveLesson.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {firstInteractiveLesson.description ??
                      `Jump into your first ${firstStarterSubject?.display_name ?? "interactive"} lesson -- no hardware needed!`}
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-[#EA580C] text-white"
                >
                  <Link href={`/lessons/${firstInteractiveLesson.id}`}>
                    <Play className="size-4" />
                    Start First Lesson
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        )}

      {/* ----- Continue Learning (promoted above subjects for returning users) ----- */}
      {continueLesson && continueProgress && continueModule && (
        <section>
          <ContinueLearningCard
            lesson={continueLesson}
            moduleName={continueModule.title}
            totalLessonsInModule={continueLessonsInModule.length}
            completedInModule={continueCompletedInModule}
            subjectColor={continueSubject?.color ?? null}
            subjectName={continueSubject?.display_name ?? null}
            subjectIcon={continueSubject?.icon ?? null}
          />
        </section>
      )}

      {/* ----- Recent Badges ----- */}
      <section className="space-y-4">
        <FadeIn>
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Your Badges
            </h2>
          </div>
        </FadeIn>
        {safeUserBadges.length > 0 ? (
          <Stagger className="flex flex-wrap gap-3">
            {safeUserBadges.map((ub) => (
              <StaggerItem key={ub.id}>
                <EarnedBadge badge={ub.badges} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Card className="rounded-2xl py-8 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Trophy className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Complete lessons to earn badges!
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ----- Subject Cards Grid ----- */}
      <section className="space-y-4">
        <FadeIn>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Explore Subjects
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1 rounded-xl text-xs text-muted-foreground"
            >
              <Link href="/subjects">
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {safeSubjects.map((subject) => {
            const counts = skillCountBySubject.get(subject.id) ?? {
              mastered: 0,
              total: 0,
            };
            return (
              <StaggerItem key={subject.id}>
                <HoverLift>
                  <SubjectCard
                    subject={subject}
                    skillsMastered={counts.mastered}
                    skillsTotal={counts.total}
                  />
                </HoverLift>
              </StaggerItem>
            );
          })}
        </Stagger>

        {safeSubjects.length === 0 && (
          <Card className="rounded-2xl py-12 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Compass className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Subjects are being prepared. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ----- Missions grouped by subject ----- */}
      {safeModules.length > 0 && (
        <section className="space-y-6">
          <FadeIn>
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Your Missions
              </h2>
            </div>
          </FadeIn>

          {safeSubjects
            .filter(
              (subject) =>
                (modulesBySubject.get(subject.id) ?? []).length > 0,
            )
            .map((subject) => {
              const subjectModules =
                modulesBySubject.get(subject.id) ?? [];
              return (
                <FadeIn key={subject.id}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex size-7 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${subject.color}1F`,
                        }}
                      >
                        <SubjectIcon
                          icon={subject.icon}
                          className="size-4"
                          style={{ color: subject.color }}
                        />
                      </div>
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: subject.color }}
                      >
                        {subject.display_name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {subjectModules.length} module
                        {subjectModules.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {subjectModules.map((mod) => (
                        <HoverLift key={mod.id}>
                          <ModuleCard
                            module={mod}
                            lessons={
                              lessonsByModule.get(mod.id) ?? []
                            }
                            progressMap={progressMap}
                            locked={lockedModuleIds.has(mod.id)}
                            subjectColor={subject.color}
                          />
                        </HoverLift>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
        </section>
      )}

      {safeModules.length === 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Your Missions
            </h2>
          </div>
          <Card className="rounded-2xl py-12 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Rocket className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No missions available yet. Explore a subject to get started!
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ----- Quick Actions ----- */}
      <FadeIn>
        <section className="flex flex-wrap gap-3 pb-4">
          <Button asChild size="lg" className="rounded-xl bg-primary">
            <Link href="/chat">
              <MessageCircle className="size-4" />
              Chat with Chip
            </Link>
          </Button>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/workshop">
              <Wrench className="size-4" />
              Open Workshop
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/subjects">
              <Sparkles className="size-4" />
              Browse Subjects
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/gallery">
              <ImageIcon className="size-4" />
              My Gallery
            </Link>
          </Button>
        </section>
      </FadeIn>
    </div>
  );
}
