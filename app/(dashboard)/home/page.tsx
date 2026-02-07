import Link from "next/link";
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
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
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
import { cn } from "@/lib/utils";
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

// ---------------------------------------------------------------------------
// Icon helpers -- render the correct icon from a DB string key.
// ---------------------------------------------------------------------------

function SubjectIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "calculator":
      return <Calculator className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "flask-conical":
      return <FlaskConical className={className} />;
    case "music":
      return <Music className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "puzzle":
      return <Puzzle className={className} />;
    case "code-2":
      return <Code2 className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

function ModuleIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "monitor":
      return <Monitor className={className} />;
    case "rocket":
      return <Rocket className={className} />;
    case "paintbrush":
      return <Paintbrush className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "vibrate":
      return <Vibrate className={className} />;
    case "music":
      return <Music className={className} />;
    case "move":
      return <Move className={className} />;
    case "calculator":
      return <Calculator className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "flask-conical":
      return <FlaskConical className={className} />;
    case "code-2":
      return <Code2 className={className} />;
    case "puzzle":
      return <Puzzle className={className} />;
    default:
      return <Rocket className={className} />;
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
            ? "bg-emerald-100 text-emerald-700"
            : status === "in_progress"
              ? "bg-amber-100 text-amber-700"
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
        className="relative overflow-hidden rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md"
        style={{ borderLeftColor: subject.color }}
      >
        <CardContent className="flex items-start gap-4 p-5">
          {/* Icon circle */}
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: tintedBg(subject.color, 0.12) }}
          >
            <SubjectIcon
              icon={subject.icon}
              className="size-6"
              /* Use inline style for dynamic DB color */
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/80">
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
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
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
      className="rounded-2xl border-l-4"
      style={{
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
              /* Icon inherits color from parent or uses text-primary */
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
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
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
    <div className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center">
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

  // ---- Data Fetching (all queries in parallel) ----
  const modulesPromise = supabase
    .from("modules")
    .select("*")
    .eq("band", profile.current_band)
    .order("order_num");

  const subjectsPromise = supabase
    .from("subjects")
    .select("*")
    .order("sort_order");

  const progressPromise = supabase
    .from("progress")
    .select("*")
    .eq("profile_id", profile.id);

  const badgesPromise = supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("profile_id", profile.id)
    .order("earned_at", { ascending: false });

  const skillProficiencyPromise = supabase
    .from("skill_proficiencies")
    .select("*, skills(*)")
    .eq("profile_id", profile.id);

  const [
    { data: modules },
    { data: subjects },
    { data: progressRows },
    { data: userBadges },
    { data: skillProficiencies },
  ] = await Promise.all([
    modulesPromise,
    subjectsPromise,
    progressPromise,
    badgesPromise,
    skillProficiencyPromise,
  ]);

  const safeModules: Module[] = modules ?? [];
  const safeSubjects: Subject[] = subjects ?? [];
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
  // First, get total skills per subject from the skill_proficiency join data
  const skillCountBySubject = new Map<
    string,
    { mastered: number; total: number }
  >();

  // Collect all unique skills from proficiency data
  for (const sp of safeSkillProficiencies) {
    const subjectId = sp.skills?.subject_id;
    if (!subjectId) continue;

    const current = skillCountBySubject.get(subjectId) ?? {
      mastered: 0,
      total: 0,
    };
    current.total += 1;
    if (sp.level === "mastered" || sp.level === "proficient") {
      current.mastered += 1;
    }
    skillCountBySubject.set(subjectId, current);
  }

  // Group lessons by module
  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of safeLessons) {
    const existing = lessonsByModule.get(lesson.module_id) ?? [];
    existing.push(lesson);
    lessonsByModule.set(lesson.module_id, existing);
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

  return (
    <div className="space-y-8">
      {/* ----- Welcome Header ----- */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {profile.display_name}!{" "}
          <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">
            {"\uD83D\uDC4B"}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          What do you want to learn today?
        </p>
      </header>

      {/* ----- Subject Cards Grid ----- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Explore Subjects
          </h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-muted-foreground"
          >
            <Link href="/subjects">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {safeSubjects.map((subject) => {
            const counts = skillCountBySubject.get(subject.id) ?? {
              mastered: 0,
              total: 0,
            };
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                skillsMastered={counts.mastered}
                skillsTotal={counts.total}
              />
            );
          })}
        </div>

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

      {/* ----- Continue Learning ----- */}
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

      {/* ----- Modules Grid ----- */}
      {safeModules.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your Missions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {safeModules.map((mod, index) => {
              // Module is unlocked if it's the first one, or if the
              // previous module has >= 60% lessons completed.
              let locked = false;
              if (index > 0) {
                const prevModule = safeModules[index - 1];
                const prevLessons =
                  lessonsByModule.get(prevModule.id) ?? [];
                const prevCompleted = prevLessons.filter(
                  (l) =>
                    getLessonStatus(l.id, progressMap) === "completed",
                ).length;
                const threshold = Math.ceil(prevLessons.length * 0.6);
                locked = prevCompleted < threshold;
              }

              // Resolve subject color for this module
              const moduleSubject = mod.subject_id
                ? subjectMap.get(mod.subject_id) ?? null
                : null;

              return (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  lessons={lessonsByModule.get(mod.id) ?? []}
                  progressMap={progressMap}
                  locked={locked}
                  subjectColor={moduleSubject?.color ?? null}
                />
              );
            })}
          </div>
        </section>
      )}

      {safeModules.length === 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your Missions
          </h2>
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

      {/* ----- Recent Badges ----- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your Badges</h2>
        {safeUserBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {safeUserBadges.map((ub) => (
              <EarnedBadge key={ub.id} badge={ub.badges} />
            ))}
          </div>
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

      {/* ----- Quick Actions ----- */}
      <section className="flex flex-wrap gap-3">
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
    </div>
  );
}
