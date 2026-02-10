"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import { ActivityRouter } from "@/components/lesson-activities/activity-router";
import { BadgeCelebration, type EarnedBadge } from "@/components/badge-celebration";
import type {
  LessonActivityConfig,
  ActivitySessionMetrics,
} from "@/lib/activities/types";
import { completeActivity } from "./actions";

// ---------------------------------------------------------------------------
// InteractiveLesson - client wrapper that connects activity system to server
// ---------------------------------------------------------------------------

interface InteractiveLessonProps {
  config: LessonActivityConfig;
  lessonId: string;
  profileId: string;
  subjectColor: string;
  lessonTitle: string;
}

export function InteractiveLesson({
  config,
  lessonId,
  profileId,
  subjectColor,
  lessonTitle,
}: InteractiveLessonProps) {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

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
      } catch (err) {
        console.error("[InteractiveLesson] Failed to submit results:", err);
      }
    },
    [lessonId],
  );

  return (
    <>
      {/* Chip mascot floating encouragement */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
        <Image
          src="/images/chip.png"
          alt="Chip"
          width={40}
          height={40}
          className="size-10 shrink-0 drop-shadow-sm"
        />
        <p className="text-sm font-medium text-foreground">
          Let&apos;s do this, friend! I&apos;m right here if you need help.
        </p>
      </div>

      {/* Activity router */}
      <ActivityRouter
        config={config}
        lessonId={lessonId}
        profileId={profileId}
        subjectColor={subjectColor}
        onComplete={handleComplete}
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
