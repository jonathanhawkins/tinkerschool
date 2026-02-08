import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Lightbulb,
  BookOpen,
  ChevronRight,
  Puzzle,
  Usb,
  Blocks,
  MonitorPlay,
  Zap,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn } from "@/components/motion";
import type { Lesson, Module, Progress } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Fetch this kid's progress on this lesson (if any)
  const { data: progressRows } = await supabase
    .from("progress")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("lesson_id", lessonId);

  const progress: Progress | null =
    (progressRows as Progress[] | null)?.[0] ?? null;

  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in_progress";

  // Sort hints by order
  const hints = [...(safeLesson.hints ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const hasStarterBlocks = Boolean(safeLesson.starter_blocks_xml);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ----- Breadcrumb / back ----- */}
      <FadeIn>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-lg px-2"
          >
            <Link href="/">
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
        </nav>
      </FadeIn>

      {/* ----- Lesson header ----- */}
      <FadeIn delay={0.05}>
        <header className="space-y-2">
          <div className="flex items-center gap-3">
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
          </div>
          <p className="text-sm text-muted-foreground">
            {safeLesson.description}
          </p>
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
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
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
                This lesson comes with some blocks to get you started. Open the
                workshop to see them!
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
                Stuck? Check out these hints -- try the first one before peeking at
                the rest!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {hints.map((hint, index) => (
                  <li
                    key={hint.order}
                    className={cn(
                      "flex gap-3 rounded-xl p-3 text-sm",
                      index === 0 ? "bg-amber-50" : "bg-muted/30",
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

      {/* ----- Start Coding CTA ----- */}
      <FadeIn delay={0.3}>
        <div className="flex items-center gap-3 pt-2">
          <Button asChild size="lg" className="rounded-xl">
            <Link href={`/workshop?lessonId=${safeLesson.id}`}>
              <Play className="size-4" />
              {isInProgress ? "Continue Coding" : "Start Coding"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
