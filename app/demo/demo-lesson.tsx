"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ActivityRouter } from "@/components/lesson-activities/activity-router";
import type {
  LessonActivityConfig,
  ActivitySessionMetrics,
} from "@/lib/activities/types";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// DemoLesson - Like InteractiveLesson but with no auth/server actions
// ---------------------------------------------------------------------------

interface DemoLessonProps {
  config: LessonActivityConfig;
}

export function DemoLesson({ config }: DemoLessonProps) {
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleComplete = useCallback(
    async (metrics: ActivitySessionMetrics) => {
      setScore(metrics.score);
      setCompleted(true);
      // No server action -- demo mode doesn't save progress
    },
    [],
  );

  if (completed) {
    return (
      <div className="space-y-4 py-8 text-center">
        <Image
          src="/images/chip.png"
          alt="Chip celebrating"
          width={80}
          height={80}
          className="mx-auto size-20 drop-shadow-md"
        />
        <h2 className="text-xl font-bold text-foreground">
          {score >= 50 ? "Amazing Job!" : "Great Try!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          You scored {score}% on this demo lesson!
          {score >= 50
            ? " Imagine what you can learn with the full TinkerSchool experience!"
            : " With TinkerSchool, you can practice as much as you want and get better!"}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/sign-up">
              <Sparkles className="size-4" />
              Start Learning Free
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chip intro */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-blue-500/5 p-4">
        <Image
          src="/images/chip.png"
          alt="Chip"
          width={40}
          height={40}
          className="size-10 shrink-0 drop-shadow-sm"
        />
        <p className="text-sm font-medium text-foreground">
          Hi there! I&apos;m Chip, your learning buddy. Let&apos;s try some
          fun activities together!
        </p>
      </div>

      {/* Activity router (no lessonId/profileId needed for demo) */}
      <ActivityRouter
        config={config}
        lessonId="demo"
        profileId="demo"
        subjectColor="#3B82F6"
        onComplete={handleComplete}
      />
    </>
  );
}
