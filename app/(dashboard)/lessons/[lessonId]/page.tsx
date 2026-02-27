import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import {
  ArrowLeft,
  Play,
  Lightbulb,
  BookOpen,
  ChevronRight,
  Monitor,
  Puzzle,
  Usb,
  Blocks,
  MonitorPlay,
  Zap,
  Sparkles,
  Clock,
} from "lucide-react";

import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import { FadeIn } from "@/components/motion";
import type { Lesson, Module, Progress, Subject } from "@/lib/supabase/types";
import { cn, safeColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubjectIcon } from "@/components/subject-icon";
import {
  isInteractiveLesson,
  isNarrativeLesson,
  parseActivityConfig,
  parseNarrativeConfig,
} from "@/lib/activities/types";
import { computeDifficulty } from "@/lib/activities/adaptive-difficulty";
import { DeviceEnhancementCard } from "@/components/device-enhancement-card";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { LessonVoiceSync } from "@/components/lesson-voice-sync";
import { buildVoiceLessonContext } from "@/lib/hume/lesson-context-builder";
import { InteractiveLesson } from "./interactive-lesson";
import { NarrativeLesson } from "@/components/narrative-lesson";
import { ConceptIntro } from "@/components/concept-intro";
import { CodingLessonIntro } from "@/components/coding-lesson-intro";
import { detectConceptsForLesson } from "@/lib/tutorials/detect-concepts";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const { profile, supabase } = await requireAuth();

  // Resolve the active kid profile for progress queries
  const kidProfile = await getActiveKidProfile(profile, supabase);
  const activeProfile = kidProfile ?? profile;

  // Fetch the lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  const safeLesson = lesson as Lesson;

  // Fetch the parent module for context
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("id", safeLesson.module_id)
    .single();

  const safeModule = module as Module | null;

  // Fetch subject for theming
  const { data: subject } = safeLesson.subject_id
    ? await supabase
        .from("subjects")
        .select("*")
        .eq("id", safeLesson.subject_id)
        .single()
    : { data: null };

  const safeSubject = subject as Subject | null;
  const subjectColor = safeColor(safeSubject?.color ?? null);

  // Fetch this kid's progress on this lesson (if any)
  const { data: progressRows } = await supabase
    .from("progress")
    .select("*")
    .eq("profile_id", activeProfile.id)
    .eq("lesson_id", lessonId);

  const progress: Progress | null =
    (progressRows as Progress[] | null)?.[0] ?? null;

  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in_progress";

  // Check if this is the user's very first lesson (for walkthrough)
  const { count: completedCount } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", activeProfile.id)
    .eq("status", "completed");
  const isFirstLesson = (completedCount ?? 0) === 0;

  // Check if this is an interactive lesson (activities-based)
  const isInteractive = isInteractiveLesson(
    safeLesson.lesson_type,
    safeLesson.content,
  );
  const activityConfig = isInteractive
    ? parseActivityConfig(safeLesson.content)
    : null;

  // Check if this is a narrative lesson (old sections-based format)
  const isNarrative = !isInteractive && isNarrativeLesson(
    safeLesson.lesson_type,
    safeLesson.content,
  );
  const narrativeConfig = isNarrative
    ? parseNarrativeConfig(safeLesson.content)
    : null;

  // Compute adaptive difficulty for interactive lessons
  const difficulty = isInteractive
    ? await computeDifficulty(supabase, activeProfile.id, safeLesson.subject_id, activeProfile.current_band)
    : null;

  // Apply difficulty adjustments to config
  if (activityConfig && difficulty) {
    activityConfig.passingScore = difficulty.passingScore;
  }

  // Query next lesson for "Next Lesson" navigation
  let nextLessonId: string | null = null;
  let nextLessonTitle: string | null = null;

  if (safeModule && safeModule.subject_id) {
    // Try: next lesson in same module
    const { data: nextInModule } = await supabase
      .from("lessons")
      .select("id, title")
      .eq("module_id", safeModule.id)
      .gt("order_num", safeLesson.order_num)
      .order("order_num", { ascending: true })
      .limit(1)
      .single();

    if (nextInModule) {
      nextLessonId = (nextInModule as { id: string; title: string }).id;
      nextLessonTitle = (nextInModule as { id: string; title: string }).title;
    } else {
      // Try: first lesson of next module in same subject/band
      const { data: nextModule } = await supabase
        .from("modules")
        .select("id")
        .eq("subject_id", safeModule.subject_id)
        .eq("band", safeModule.band)
        .gt("order_num", safeModule.order_num)
        .order("order_num", { ascending: true })
        .limit(1)
        .single();

      if (nextModule) {
        const { data: firstLesson } = await supabase
          .from("lessons")
          .select("id, title")
          .eq("module_id", (nextModule as { id: string }).id)
          .order("order_num", { ascending: true })
          .limit(1)
          .single();

        if (firstLesson) {
          nextLessonId = (firstLesson as { id: string; title: string }).id;
          nextLessonTitle = (firstLesson as { id: string; title: string }).title;
        }
      }
    }
  }

  // Sort hints by order
  const hints = [...(safeLesson.hints ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const hasStarterBlocks = Boolean(safeLesson.starter_blocks_xml);

  // Detect programming concepts for this lesson (used by ConceptIntro)
  const conceptIds = !isInteractive
    ? detectConceptsForLesson(
        hints,
        safeLesson.starter_blocks_xml,
        safeLesson.solution_code,
      )
    : [];

  // Build voice lesson context so Chip can act as a real teacher
  const voiceLessonContext = buildVoiceLessonContext(
    safeLesson,
    safeSubject,
    activityConfig,
    isInteractive,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Push lesson context into voice bridge for Chip awareness */}
      <LessonVoiceSync lessonContext={voiceLessonContext} />

      {/* ----- Breadcrumb / back + Fullscreen toggle ----- */}
      <FadeIn>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-lg px-2"
          >
            <Link href="/home">
              <ArrowLeft className="size-4" />
              Mission Control
            </Link>
          </Button>
          {safeModule && (
            <>
              <ChevronRight className="size-3.5" />
              <span className="truncate font-medium">{safeModule.title}</span>
            </>
          )}

          {/* Push fullscreen toggle to the right */}
          <div className="ml-auto">
            <FullscreenToggle />
          </div>
        </nav>
      </FadeIn>

      {/* ----- Lesson header ----- */}
      <FadeIn delay={0.05}>
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* Subject badge */}
            {safeSubject && (
              <Badge
                variant="outline"
                className="gap-1 text-xs"
                style={{
                  borderColor: subjectColor,
                  color: subjectColor,
                }}
              >
                <SubjectIcon icon={safeSubject.icon} className="size-3" />
                {safeSubject.display_name}
              </Badge>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {safeLesson.title}
            </h1>
            {isCompleted && (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                Completed
              </Badge>
            )}
            {isInProgress && (
              <Badge
                variant="outline"
                className="border-amber-400 text-amber-600"
              >
                In Progress
              </Badge>
            )}

            {/* Interactive vs coding badge */}
            {isInteractive ? (
              <Badge
                variant="outline"
                className="gap-1 border-primary/30 bg-primary/10 text-primary"
              >
                <Sparkles className="size-3" />
                Interactive
              </Badge>
            ) : safeLesson.simulator_compatible ? (
              <Badge
                variant="outline"
                className="gap-1 border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                <Monitor className="size-3" />
                Simulator Ready
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              >
                <Usb className="size-3" />
                Hardware Needed
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {safeLesson.description}
          </p>

          {/* Estimated time */}
          {safeLesson.estimated_minutes > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              About {safeLesson.estimated_minutes} minutes
            </div>
          )}
        </header>
      </FadeIn>

      {/* ----- Story ----- */}
      {safeLesson.story_text && (
        <FadeIn delay={0.1}>
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <CardTitle className="text-base">The Story</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {safeLesson.story_text}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* ================================================================= */}
      {/* INTERACTIVE LESSON: Render activity system inline                  */}
      {/* ================================================================= */}
      {isInteractive && activityConfig && (
        <FadeIn delay={0.15}>
          <Card
            className="rounded-2xl border-2"
            style={{ borderColor: `${subjectColor}40` }}
          >
            <CardContent className="p-5 sm:p-6">
              <InteractiveLesson
                config={activityConfig}
                lessonId={lessonId}
                profileId={activeProfile.id}
                subjectColor={subjectColor}
                lessonTitle={safeLesson.title}
                difficultyLevel={difficulty?.level ?? "standard"}
                encouragementMessage={difficulty?.encouragementMessage}
                isFirstLesson={isFirstLesson}
                nextLessonId={nextLessonId}
                nextLessonTitle={nextLessonTitle}
                band={activeProfile.current_band}
              />
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* ----- Device Enhancement (shown for interactive lessons) ----- */}
      {isInteractive && (
        <FadeIn delay={0.2}>
          <DeviceEnhancementCard
            subjectSlug={safeSubject?.slug ?? null}
            subjectColor={subjectColor}
            lessonTitle={safeLesson.title}
            lessonId={safeLesson.id}
          />
        </FadeIn>
      )}

      {/* ================================================================= */}
      {/* NARRATIVE LESSON: Old sections-based format (60 non-coding)        */}
      {/* ================================================================= */}
      {isNarrative && narrativeConfig && (
        <FadeIn delay={0.15}>
          <Card
            className="rounded-2xl border-2"
            style={{ borderColor: `${subjectColor}40` }}
          >
            <CardContent className="p-5 sm:p-6">
              <NarrativeLesson
                sections={narrativeConfig.sections}
                lessonId={lessonId}
                profileId={activeProfile.id}
                subjectColor={subjectColor}
                lessonTitle={safeLesson.title}
                isCompleted={isCompleted}
                nextLessonId={nextLessonId}
                nextLessonTitle={nextLessonTitle}
              />
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* ================================================================= */}
      {/* CODING LESSON: Show workshop CTA and coding-specific content       */}
      {/* ================================================================= */}
      {!isInteractive && !isNarrative && (
        <>
          {/* ----- First-time coding lesson walkthrough ----- */}
          <CodingLessonIntro />

          {/* ----- How It Works ----- */}
          <FadeIn delay={0.15}>
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-primary" />
                  <CardTitle className="text-base">How It Works</CardTitle>
                </div>
                <CardDescription>
                  Follow these steps to get your code running on the M5Stick!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {[
                    {
                      icon: Usb,
                      title: "Plug in your M5Stick",
                      desc: "Connect it to your computer with the USB-C cable.",
                    },
                    {
                      icon: Blocks,
                      title: "Build your code",
                      desc: "Drag blocks in the workshop to write your program.",
                    },
                    {
                      icon: MonitorPlay,
                      title: "Test in the simulator",
                      desc: "Click Run to see what your code does on the virtual screen.",
                    },
                    {
                      icon: Zap,
                      title: "Flash it!",
                      desc: "Click Connect Device, then Flash Code to send it to your real M5Stick.",
                    },
                  ].map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-muted/30 p-3 text-sm"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <step.icon className="size-3.5 text-primary" />
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </FadeIn>

          {/* ----- Starter blocks info ----- */}
          {hasStarterBlocks && (
            <FadeIn delay={0.2}>
              <Card className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Puzzle className="size-5 text-primary" />
                    <CardTitle className="text-base">Starter Blocks</CardTitle>
                  </div>
                  <CardDescription>
                    This lesson comes with some blocks to get you started. Open
                    the workshop to see them!
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          )}

          {/* ----- Hints ----- */}
          {hints.length > 0 && (
            <FadeIn delay={0.25}>
              <Card className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-5 text-amber-500" />
                    <CardTitle className="text-base">Hints</CardTitle>
                  </div>
                  <CardDescription>
                    Stuck? Check out these hints -- try the first one before
                    peeking at the rest!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {hints.map((hint, index) => (
                      <li
                        key={hint.order}
                        className={cn(
                          "flex gap-3 rounded-xl p-3 text-sm",
                          index === 0 ? "bg-amber-500/10" : "bg-muted/30",
                        )}
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {hint.order}
                        </span>
                        <span className="text-foreground/90">{hint.text}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* ----- Concept Introductions ----- */}
          {conceptIds.length > 0 && (
            <FadeIn delay={0.3}>
              <ConceptIntro conceptIds={conceptIds} />
            </FadeIn>
          )}

          {/* ----- Start Coding CTA ----- */}
          <FadeIn delay={0.35}>
            <div className="flex items-center gap-3 pt-2">
              <Button asChild size="lg" className="rounded-xl">
                <Link href={`/workshop?lessonId=${safeLesson.id}`}>
                  <Play className="size-4" />
                  {isInProgress ? "Continue Coding" : "Start Coding"}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl"
              >
                <Link href="/home">
                  <ArrowLeft className="size-4" />
                  Back
                </Link>
              </Button>
            </div>
          </FadeIn>
        </>
      )}
    </div>
  );
}
