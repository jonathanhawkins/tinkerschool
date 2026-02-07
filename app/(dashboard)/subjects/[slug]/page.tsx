import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Sparkles,
  GraduationCap,
  Rocket,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import type {
  Subject,
  Skill,
  SkillProficiency,
  SkillLevel,
  Module,
  Lesson,
  Progress,
  ProgressStatus,
} from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";

// ---------------------------------------------------------------------------
// Icon mapping -- resolves a DB icon string to a lucide-react component
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

// ---------------------------------------------------------------------------
// Subject descriptions (static, since they rarely change)
// ---------------------------------------------------------------------------

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  math: "Build number sense, practice operations, and discover patterns through fun challenges.",
  reading: "Grow your reading skills with stories, phonics, and comprehension activities.",
  science: "Explore the world around you with hands-on experiments and discoveries.",
  music: "Create melodies, learn rhythm, and make your M5Stick play songs.",
  art: "Express yourself with colors, shapes, and creative digital art projects.",
  problem_solving: "Sharpen your thinking with puzzles, logic games, and brain teasers.",
  coding: "Learn to code by building programs that run on your M5Stick device.",
};

// ---------------------------------------------------------------------------
// Skill proficiency level helpers
// ---------------------------------------------------------------------------

interface SkillLevelConfig {
  label: string;
  className: string;
  icon: React.ReactNode;
}

function getSkillLevelConfig(level: SkillLevel): SkillLevelConfig {
  switch (level) {
    case "mastered":
      return {
        label: "Mastered",
        className: "border-emerald-400 bg-emerald-50 text-emerald-700",
        icon: <Star className="size-3 fill-emerald-500 text-emerald-500" />,
      };
    case "proficient":
      return {
        label: "Proficient",
        className: "border-green-400 bg-green-50 text-green-700",
        icon: <CheckCircle2 className="size-3" />,
      };
    case "developing":
      return {
        label: "Developing",
        className: "border-amber-400 bg-amber-50 text-amber-700",
        icon: <Sparkles className="size-3" />,
      };
    case "beginning":
      return {
        label: "Beginning",
        className: "border-blue-400 bg-blue-50 text-blue-700",
        icon: <Circle className="size-3" />,
      };
    default:
      return {
        label: "Not Started",
        className: "border-border text-muted-foreground",
        icon: <Circle className="size-3" />,
      };
  }
}

// ---------------------------------------------------------------------------
// Lesson status helpers (reused from home page pattern)
// ---------------------------------------------------------------------------

function getLessonStatus(
  lessonId: string,
  progressMap: Map<string, Progress>,
): ProgressStatus {
  const p = progressMap.get(lessonId);
  if (!p) return "not_started";
  return p.status;
}

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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkillRow({
  skill,
  level,
}: {
  skill: Skill;
  level: SkillLevel;
}) {
  const config = getSkillLevelConfig(level);

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/50">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{skill.name}</p>
        {skill.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {skill.description}
          </p>
        )}
      </div>
      <BadgeUI variant="outline" className={cn("gap-1 shrink-0", config.className)}>
        {config.icon}
        {config.label}
      </BadgeUI>
    </div>
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

      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-foreground group-hover:text-primary">
          {lesson.title}
        </span>
        {lesson.estimated_minutes > 0 && (
          <p className="text-xs text-muted-foreground">
            ~{lesson.estimated_minutes} min
          </p>
        )}
      </div>

      <StatusBadge status={status} />
    </Link>
  );
}

function ModuleSection({
  module,
  lessons,
  progressMap,
}: {
  module: Module;
  lessons: Lesson[];
  progressMap: Map<string, Progress>;
}) {
  const completedCount = lessons.filter(
    (l) => getLessonStatus(l.id, progressMap) === "completed",
  ).length;
  const totalCount = lessons.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{module.title}</CardTitle>
            <CardDescription className="text-xs">
              {module.description}
            </CardDescription>
          </div>
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
        <ProgressBar value={progressPercent} className="h-2" />
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
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { profile, supabase } = await requireAuth();

  // Fetch the subject by slug
  const { data: subject } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!subject) {
    notFound();
  }

  const safeSubject = subject as Subject;

  // Fetch skills for this subject
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("subject_id", safeSubject.id)
    .order("sort_order");

  const safeSkills: Skill[] = (skills as Skill[] | null) ?? [];

  // Fetch kid's proficiency on these skills
  const skillIds = safeSkills.map((s) => s.id);
  const { data: proficiency } = await supabase
    .from("skill_proficiencies")
    .select("*")
    .eq("profile_id", profile.id)
    .in("skill_id", skillIds.length > 0 ? skillIds : ["__none__"]);

  const safeProficiency: SkillProficiency[] =
    (proficiency as SkillProficiency[] | null) ?? [];

  // Build proficiency lookup: skillId -> level
  const proficiencyMap = new Map<string, SkillLevel>();
  for (const row of safeProficiency) {
    proficiencyMap.set(row.skill_id, row.level);
  }

  // Fetch modules for this subject and kid's band
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("band", profile.current_band)
    .eq("subject_id", safeSubject.id)
    .order("order_num");

  const safeModules: Module[] = (modules as Module[] | null) ?? [];

  // Fetch lessons for those modules
  const moduleIds = safeModules.map((m) => m.id);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .in("module_id", moduleIds.length > 0 ? moduleIds : ["__none__"])
    .order("order_num");

  const safeLessons: Lesson[] = (lessons as Lesson[] | null) ?? [];

  // Fetch kid's progress
  const { data: progressRows } = await supabase
    .from("progress")
    .select("*")
    .eq("profile_id", profile.id);

  const safeProgress: Progress[] = (progressRows as Progress[] | null) ?? [];

  // Build progress lookup: lessonId -> Progress
  const progressMap = new Map<string, Progress>();
  for (const p of safeProgress) {
    progressMap.set(p.lesson_id, p);
  }

  // Group lessons by module
  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of safeLessons) {
    const existing = lessonsByModule.get(lesson.module_id) ?? [];
    existing.push(lesson);
    lessonsByModule.set(lesson.module_id, existing);
  }

  // Compute overall skill stats
  const skillsStarted = safeSkills.filter((s) => {
    const level = proficiencyMap.get(s.id);
    return level && level !== "not_started";
  }).length;

  const description =
    SUBJECT_DESCRIPTIONS[safeSubject.slug] ??
    `Explore ${safeSubject.display_name} through fun, interactive lessons.`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* ----- Breadcrumb / back ----- */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-lg px-2"
        >
          <Link href="/subjects">
            <ArrowLeft className="size-4" />
            Subjects
          </Link>
        </Button>
        <ChevronRight className="size-3.5" />
        <span className="truncate font-medium text-foreground">
          {safeSubject.display_name}
        </span>
      </nav>

      {/* ----- Subject Header ----- */}
      <header className="flex items-center gap-5">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl shadow-sm"
          style={{ backgroundColor: `${safeSubject.color}20` }}
        >
          <span style={{ color: safeSubject.color }}>
            <SubjectIcon icon={safeSubject.icon} className="size-8" />
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {safeSubject.display_name}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">
            {skillsStarted} of {safeSkills.length} skill
            {safeSkills.length !== 1 ? "s" : ""} started
          </p>
        </div>
      </header>

      {/* ----- Skills Section ----- */}
      {safeSkills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Your Skills
            </h2>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="space-y-1 pt-4">
              {safeSkills.map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  level={proficiencyMap.get(skill.id) ?? "not_started"}
                />
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ----- Lessons Section ----- */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Lessons</h2>
        </div>

        {safeModules.length > 0 ? (
          <div className="space-y-4">
            {safeModules.map((mod) => (
              <ModuleSection
                key={mod.id}
                module={mod}
                lessons={lessonsByModule.get(mod.id) ?? []}
                progressMap={progressMap}
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl py-12 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Rocket className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Lessons coming soon!
              </p>
              <p className="text-xs text-muted-foreground">
                Check back later for new {safeSubject.display_name.toLowerCase()}{" "}
                lessons.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ----- Back to Subjects ----- */}
      <div className="flex items-center gap-3 pt-2">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/subjects">
            <ArrowLeft className="size-4" />
            All Subjects
          </Link>
        </Button>
      </div>
    </div>
  );
}
