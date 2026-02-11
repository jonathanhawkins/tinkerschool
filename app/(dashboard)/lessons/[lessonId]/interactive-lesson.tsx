"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { ActivityRouter } from "@/components/lesson-activities/activity-router";
import { BadgeCelebration, type EarnedBadge } from "@/components/badge-celebration";
import { LessonWalkthrough } from "@/components/lesson-walkthrough";
import type {
  LessonActivityConfig,
  ActivitySessionMetrics,
} from "@/lib/activities/types";
import type { MilestoneNudgeData } from "@/lib/activities/activity-context";
import type { DifficultyLevel } from "@/lib/activities/adaptive-difficulty";
import { completeActivity, startLesson } from "./actions";

// ---------------------------------------------------------------------------
// InteractiveLesson - client wrapper that connects activity system to server
// ---------------------------------------------------------------------------

interface InteractiveLessonProps {
  config: LessonActivityConfig;
  lessonId: string;
  profileId: string;
  subjectColor: string;
  lessonTitle: string;
  difficultyLevel?: DifficultyLevel;
  encouragementMessage?: string;
  isFirstLesson?: boolean;
  nextLessonId?: string | null;
  nextLessonTitle?: string | null;
}

export function InteractiveLesson({
  config,
  lessonId,
  profileId,
  subjectColor,
  lessonTitle,
  difficultyLevel = "standard",
  encouragementMessage,
  isFirstLesson = false,
  nextLessonId,
  nextLessonTitle,
}: InteractiveLessonProps) {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [milestoneNudge, setMilestoneNudge] = useState<MilestoneNudgeData | undefined>(undefined);
  const lessonStarted = useRef(false);

  // Record that the lesson was started (creates in_progress record if none exists)
  useEffect(() => {
    if (!lessonStarted.current) {
      lessonStarted.current = true;
      startLesson(lessonId).catch(() => {
        // Non-critical — don't block the lesson
      });
    }
  }, [lessonId]);

  const handleComplete = useCallback(
    async (metrics: ActivitySessionMetrics) => {
      try {
        const result = await completeActivity({
          lessonId,
          score: metrics.score,
          totalQuestions: metrics.totalQuestions,
          correctFirstTry: metrics.correctFirstTry,
          correctTotal: metrics.correctTotal,
          timeMs: metrics.totalTimeMs,
          hintsUsed: metrics.hintsUsed,
          activityData: metrics.answers,
        });

        if (result.success && result.newBadges && result.newBadges.length > 0) {
          setEarnedBadges(
            result.newBadges.map((b) => ({
              name: b.name,
              icon: b.icon,
              description: b.description,
            })),
          );
        }

        // Set milestone nudge if server returned one
        if (result.milestone) {
          setMilestoneNudge({
            totalCompleted: result.milestone.totalCompleted,
            kidName: result.milestone.kidName,
          });
        }
      } catch (err) {
        console.error("[InteractiveLesson] Failed to submit results:", err);
      }
    },
    [lessonId],
  );

  return (
    <>
      {/* First-lesson walkthrough */}
      <LessonWalkthrough isFirstLesson={isFirstLesson} />

      {/* Chip mascot floating encouragement */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
        <Image
          src="/images/chip.png"
          alt="Chip"
          width={40}
          height={40}
          className="size-10 shrink-0 drop-shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {encouragementMessage ??
              "Let's do this, friend! I'm right here if you need help."}
          </p>
          {difficultyLevel === "challenge" && (
            <p className="mt-0.5 text-xs text-primary">Challenge Mode</p>
          )}
          {difficultyLevel === "supportive" && (
            <p className="mt-0.5 text-xs text-emerald-600">
              Extra hints enabled
            </p>
          )}
        </div>
      </div>

      {/* Activity router */}
      <ActivityRouter
        config={config}
        lessonId={lessonId}
        profileId={profileId}
        subjectColor={subjectColor}
        onComplete={handleComplete}
        nextLessonId={nextLessonId ?? undefined}
        nextLessonTitle={nextLessonTitle ?? undefined}
        milestoneNudge={milestoneNudge}
      />

      {/* Badge celebration overlay */}
      {earnedBadges.length > 0 && (
        <BadgeCelebration
          badges={earnedBadges}
          onDismiss={() => setEarnedBadges([])}
        />
      )}
    </>
  );
}
