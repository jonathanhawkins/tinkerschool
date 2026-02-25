"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ActivityRouter } from "@/components/lesson-activities/activity-router";
import type { LessonActivityConfig, ActivitySessionMetrics } from "@/lib/activities/types";
import type { DifficultyLevel } from "@/lib/activities/adaptive-difficulty";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

import { completeAdventure } from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdventureShellProps {
  adventureId: string;
  profileId: string;
  title: string;
  description: string;
  storyText: string | null;
  subjectColor: string;
  config: LessonActivityConfig;
  difficultyLevel: DifficultyLevel;
  encouragementMessage: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdventureShell({
  adventureId,
  profileId,
  title,
  description,
  storyText,
  subjectColor,
  config,
  difficultyLevel,
  encouragementMessage,
}: AdventureShellProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleComplete = useCallback(
    async (metrics: ActivitySessionMetrics) => {
      startTransition(async () => {
        const result = await completeAdventure({
          adventureId,
          score: metrics.score,
          totalQuestions: metrics.totalQuestions,
          correctFirstTry: metrics.correctFirstTry,
          correctTotal: metrics.correctTotal,
          timeMs: metrics.totalTimeMs,
          hintsUsed: metrics.hintsUsed,
          activityData: metrics.answers,
        });

        if (result.success) {
          setCompleted(true);
        }
      });
    },
    [adventureId],
  );

  if (completed) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-[#EA580C]/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={80}
              height={80}
              className="size-20 drop-shadow-md"
            />
            <h2 className="text-2xl font-bold text-foreground">
              Adventure Complete!
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Great job finishing today&apos;s adventure! Come back tomorrow for a new one.
            </p>
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/home">
                <Sparkles className="size-4" />
                Back to Mission Control
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 rounded-xl text-muted-foreground"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft className="size-4" />
          Mission Control
        </Button>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Story text */}
      {storyText && (
        <Card
          className="rounded-2xl border"
          style={{
            backgroundColor: `${subjectColor}14`,
            borderColor: `${subjectColor}30`,
          }}
        >
          <CardContent className="flex items-start gap-3 p-4">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={40}
              height={40}
              className="size-10 shrink-0 drop-shadow-sm"
            />
            <p className="text-sm leading-relaxed text-foreground">
              {storyText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Activity router — reuses the exact same widget system as seed lessons */}
      <ActivityRouter
        config={config}
        lessonId={adventureId}
        profileId={profileId}
        subjectColor={subjectColor}
        onComplete={handleComplete}
        playAgainUrl={`/adventure?id=${adventureId}`}
        difficultyLevel={difficultyLevel}
        encouragementMessage={encouragementMessage}
      />

      {isPending && (
        <p className="text-center text-xs text-muted-foreground">
          Saving your progress...
        </p>
      )}
    </div>
  );
}
