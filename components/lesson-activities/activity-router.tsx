"use client";

import { Component, useCallback, useState, type ErrorInfo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { ActivityProvider, useActivity, type MilestoneNudgeData } from "@/lib/activities/activity-context";
import type { LessonActivityConfig, ActivitySessionMetrics } from "@/lib/activities/types";
import type { DifficultyLevel } from "@/lib/activities/adaptive-difficulty";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityVoiceSync } from "@/components/activity-voice-sync";

import { SessionTimer } from "@/lib/activities/session-timer";

import { ActivityProgress } from "./activity-progress";
import { ActivityComplete } from "./activity-complete";
import { MultipleChoice } from "./multiple-choice";
import { CountingWidget } from "./counting-widget";
import { MatchingPairs } from "./matching-pairs";
import { SequenceOrder } from "./sequence-order";
import { FlashCard } from "./flash-card";
import { FillInBlank } from "./fill-in-blank";
import { NumberBond } from "./number-bond";
import { TenFrame } from "./ten-frame";
import { NumberLine } from "./number-line";
import { Rekenrek } from "./rekenrek";
import { SoundToggle } from "./sound-toggle";

// ---------------------------------------------------------------------------
// Error boundary for activity widgets
// ---------------------------------------------------------------------------

interface ActivityErrorBoundaryProps {
  children: ReactNode;
}

interface ActivityErrorBoundaryState {
  hasError: boolean;
}

class ActivityErrorBoundary extends Component<ActivityErrorBoundaryProps, ActivityErrorBoundaryState> {
  constructor(props: ActivityErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ActivityErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ActivityErrorBoundary] Widget crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="rounded-2xl border-2 border-amber-300">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={64}
              height={64}
              className="size-16 drop-shadow-sm"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Oops! This lesson has a hiccup.
              </h3>
              <p className="text-sm text-muted-foreground">
                Something went wrong with this activity. Let&apos;s try another one!
              </p>
            </div>
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/home">Back to Mission Control</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// ActivityRenderer - renders the current activity widget based on type
// ---------------------------------------------------------------------------

function ActivityRenderer() {
  const { currentActivity, state } = useActivity();

  if (state.isComplete) {
    return <ActivityComplete />;
  }

  // Key forces React to remount the widget when the question changes,
  // resetting all internal useState hooks (selected answer, shuffle, etc.)
  const questionKey = `${state.currentActivityIndex}-${state.currentQuestionIndex}`;

  switch (currentActivity.type) {
    case "multiple_choice":
      return <MultipleChoice key={questionKey} />;
    case "counting":
      return <CountingWidget key={questionKey} />;
    case "matching_pairs":
      return <MatchingPairs key={questionKey} />;
    case "sequence_order":
      return <SequenceOrder key={questionKey} />;
    case "flash_card":
      return <FlashCard key={questionKey} />;
    case "fill_in_blank":
      return <FillInBlank key={questionKey} />;
    case "number_bond":
      return <NumberBond key={questionKey} />;
    case "ten_frame":
      return <TenFrame key={questionKey} />;
    case "number_line":
      return <NumberLine key={questionKey} />;
    case "rekenrek":
      return <Rekenrek key={questionKey} />;
    default:
      return (
        <p className="text-center text-sm text-muted-foreground">
          Unknown activity type
        </p>
      );
  }
}

// ---------------------------------------------------------------------------
// ActivityRouter - wraps provider + progress + renderer
// ---------------------------------------------------------------------------

interface ActivityRouterProps {
  config: LessonActivityConfig;
  lessonId: string;
  profileId: string;
  subjectColor: string;
  /** Server action to call when the activity completes */
  onComplete?: (metrics: ActivitySessionMetrics) => Promise<void>;
  /** Next lesson in sequence (for "Next Lesson" navigation) */
  nextLessonId?: string;
  nextLessonTitle?: string;
  /** Milestone nudge data (parent-facing supporter nudge) */
  milestoneNudge?: MilestoneNudgeData;
  /** Override "Play Again" URL (e.g. for adventures which aren't at /lessons/) */
  playAgainUrl?: string;
  /** Adaptive difficulty level (forwarded to global Chip FAB via voiceBridge) */
  difficultyLevel?: DifficultyLevel;
  /** Encouragement message from adaptive difficulty */
  encouragementMessage?: string;
}

export function ActivityRouter({
  config,
  lessonId,
  profileId,
  subjectColor,
  onComplete,
  nextLessonId,
  nextLessonTitle,
  milestoneNudge,
  playAgainUrl,
  difficultyLevel,
  encouragementMessage,
}: ActivityRouterProps) {
  const [key, setKey] = useState(0);

  const handleComplete = useCallback(
    async (metrics: ActivitySessionMetrics) => {
      if (onComplete) {
        await onComplete(metrics);
      }
    },
    [onComplete],
  );

  return (
    <ActivityProvider
      key={key}
      config={config}
      lessonId={lessonId}
      profileId={profileId}
      subjectColor={subjectColor}
      onComplete={handleComplete}
      nextLessonId={nextLessonId}
      nextLessonTitle={nextLessonTitle}
      milestoneNudge={milestoneNudge}
      playAgainUrl={playAgainUrl}
    >
      {/* Bridge activity feedback to the global Chip FAB via voiceBridge */}
      <ActivityVoiceSync
        difficultyLevel={difficultyLevel}
        encouragementMessage={encouragementMessage}
      />

      <div className="relative space-y-6">
        {/* Progress bar + sound toggle + timer */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <ActivityProgress />
          </div>
          <SessionTimer limitMinutes={30} />
          <SoundToggle />
        </div>

        {/* Current activity widget */}
        <ActivityErrorBoundary>
          <ActivityRenderer />
        </ActivityErrorBoundary>
      </div>
    </ActivityProvider>
  );
}
