"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useActivity } from "@/lib/activities/activity-context";

// ---------------------------------------------------------------------------
// ActivityProgress - shows "Question X of Y" with an animated progress bar
// ---------------------------------------------------------------------------

export function ActivityProgress() {
  const { questionsCompleted, totalQuestions, subjectColor, state } =
    useActivity();
  const prefersReducedMotion = useReducedMotion();

  const progress =
    totalQuestions > 0 ? (questionsCompleted / totalQuestions) * 100 : 0;

  const displayIndex = state.isComplete
    ? totalQuestions
    : questionsCompleted + 1;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground">
          Question {displayIndex} of {totalQuestions}
        </span>
        <span className="font-semibold" style={{ color: subjectColor }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-muted/50"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Activity progress"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: subjectColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.4, ease: "easeOut" }
          }
        />
      </div>
    </div>
  );
}
