"use client";

import { useCallback, useState } from "react";

import { ActivityProvider, useActivity } from "@/lib/activities/activity-context";
import type { LessonActivityConfig, ActivitySessionMetrics } from "@/lib/activities/types";

import { ActivityProgress } from "./activity-progress";
import { ActivityComplete } from "./activity-complete";
import { ChipActivityBubble } from "./chip-activity-bubble";
import { MultipleChoice } from "./multiple-choice";
import { CountingWidget } from "./counting-widget";
import { MatchingPairs } from "./matching-pairs";
import { SequenceOrder } from "./sequence-order";
import { FlashCard } from "./flash-card";
import { FillInBlank } from "./fill-in-blank";
import { SoundToggle } from "./sound-toggle";

// ---------------------------------------------------------------------------
// ActivityRenderer - renders the current activity widget based on type
// ---------------------------------------------------------------------------

function ActivityRenderer() {
  const { currentActivity, state } = useActivity();

  if (state.isComplete) {
    return <ActivityComplete />;
  }

  switch (currentActivity.type) {
    case "multiple_choice":
      return <MultipleChoice />;
    case "counting":
      return <CountingWidget />;
    case "matching_pairs":
      return <MatchingPairs />;
    case "sequence_order":
      return <SequenceOrder />;
    case "flash_card":
      return <FlashCard />;
    case "fill_in_blank":
      return <FillInBlank />;
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
}

export function ActivityRouter({
  config,
  lessonId,
  profileId,
  subjectColor,
  onComplete,
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
    >
      <div className="relative space-y-6">
        {/* Progress bar + sound toggle */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <ActivityProgress />
          </div>
          <SoundToggle />
        </div>

        {/* Current activity widget */}
        <ActivityRenderer />

        {/* Chip mascot floating companion */}
        <ChipActivityBubble />
      </div>
    </ActivityProvider>
  );
}
