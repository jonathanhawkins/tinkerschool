"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Target,
  Paintbrush,
  Trophy,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import type { NarrativeSections } from "@/lib/activities/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { completeNarrativeLesson } from "@/app/(dashboard)/lessons/[lessonId]/actions";

// ---------------------------------------------------------------------------
// NarrativeLesson - renders old-format sections-based lesson content
// ---------------------------------------------------------------------------

interface NarrativeLessonProps {
  sections: NarrativeSections;
  lessonId: string;
  profileId: string;
  subjectColor: string;
  lessonTitle: string;
  isCompleted: boolean;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
}

/** Section card wrapper with icon, title, and content */
function SectionCard({
  icon: Icon,
  title,
  color,
  children,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up fill-mode-both"
      style={{ animationDelay: `${delay}s` }}
    >
      <Card
        className="rounded-2xl border-l-4"
        style={{ borderLeftColor: color }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span
              className="flex size-8 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}1F` }}
            >
              <span style={{ color }}>
                <Icon className="size-4" />
              </span>
            </span>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export function NarrativeLesson(props: NarrativeLessonProps) {
  const {
    sections,
    lessonId,
    subjectColor,
    isCompleted: initialCompleted,
    nextLessonId,
    nextLessonTitle,
  } = props;
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lessonStarted = useRef(false);

  // Import startLesson dynamically to avoid bundling it if not needed
  useEffect(() => {
    if (!lessonStarted.current) {
      lessonStarted.current = true;
      import("@/app/(dashboard)/lessons/[lessonId]/actions").then(
        ({ startLesson }) => {
          startLesson(lessonId).catch(() => {
            // Non-critical
          });
        },
      );
    }
  }, [lessonId]);

  const handleComplete = useCallback(async () => {
    if (isCompleted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await completeNarrativeLesson(lessonId);
      if (result.success) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("[NarrativeLesson] Failed to complete:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [lessonId, isCompleted, isSubmitting]);

  let sectionIndex = 0;

  return (
    <div className="space-y-4">
      {/* Story section */}
      {sections.story && (
        <SectionCard
          icon={BookOpen}
          title={sections.story.title}
          color={subjectColor}
          delay={sectionIndex++ * 0.08}
        >
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {sections.story.narrative}
          </p>
        </SectionCard>
      )}

      {/* Explore section */}
      {sections.explore && (
        <SectionCard
          icon={Compass}
          title={sections.explore.title}
          color={subjectColor}
          delay={sectionIndex++ * 0.08}
        >
          <p className="text-sm leading-relaxed text-foreground/90">
            {sections.explore.instructions}
          </p>
          {sections.explore.simulator_fallback && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              {sections.explore.simulator_fallback}
            </p>
          )}
        </SectionCard>
      )}

      {/* Practice section */}
      {sections.practice && (
        <SectionCard
          icon={Target}
          title={sections.practice.title}
          color={subjectColor}
          delay={sectionIndex++ * 0.08}
        >
          <ul className="space-y-2">
            {sections.practice.problems.map((problem, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-xl bg-muted/30 p-3 text-sm"
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: subjectColor }}
                >
                  {i + 1}
                </span>
                <span className="text-foreground/90">
                  {formatProblem(problem)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Create section */}
      {sections.create && (
        <SectionCard
          icon={Paintbrush}
          title={sections.create.title}
          color={subjectColor}
          delay={sectionIndex++ * 0.08}
        >
          <p className="text-sm leading-relaxed text-foreground/90">
            {sections.create.prompt}
          </p>
        </SectionCard>
      )}

      {/* Celebrate section */}
      {sections.celebrate && (
        <SectionCard
          icon={Trophy}
          title={sections.celebrate.title}
          color={subjectColor}
          delay={sectionIndex++ * 0.08}
        >
          <p className="text-sm leading-relaxed text-foreground/90">
            {sections.celebrate.summary}
          </p>
          {sections.celebrate.parent_note && (
            <div className="mt-3 rounded-xl bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Note for parents
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {sections.celebrate.parent_note}
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Completion / Next Lesson */}
      <div
        className="animate-fade-in-up fill-mode-both pt-2"
        style={{ animationDelay: `${sectionIndex * 0.08}s` }}
      >
        {isCompleted ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="size-5" />
              Lesson complete!
            </div>
            {nextLessonId && (
              <Button asChild size="lg" className="rounded-xl">
                <Link href={`/lessons/${nextLessonId}`}>
                  {nextLessonTitle ?? "Next Lesson"}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="ml-2 rounded-xl"
            >
              <Link href="/home">Back to Mission Control</Link>
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            className={cn(
              "rounded-xl",
              isSubmitting && "opacity-70",
            )}
            disabled={isSubmitting}
            onClick={handleComplete}
          >
            <Sparkles className="size-4" />
            {isSubmitting ? "Saving..." : "Complete Lesson"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a practice problem object as a human-readable string */
function formatProblem(problem: Record<string, unknown>): string {
  // Try common keys to build a readable description
  const parts: string[] = [];

  if (typeof problem.type === "string") {
    parts.push(problem.type.replace(/_/g, " "));
  }
  if (typeof problem.elements === "string") {
    parts.push(`with ${problem.elements}`);
  }
  if (typeof problem.difficulty === "string") {
    parts.push(`(${problem.difficulty})`);
  }
  if (typeof problem.description === "string") {
    return problem.description as string;
  }
  if (typeof problem.prompt === "string") {
    return problem.prompt as string;
  }

  return parts.length > 0 ? parts.join(" ") : JSON.stringify(problem);
}
