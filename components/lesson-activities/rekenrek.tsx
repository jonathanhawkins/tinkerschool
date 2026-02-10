"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { RekenrekContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// Rekenrek - Virtual counting rack with 2 rows of 10 beads
// ---------------------------------------------------------------------------
// Each row has 5 red beads and 5 white beads. The color break at 5 helps
// kids subitize and use "making 10" strategies. Tap a bead to slide it
// (and all beads to its left) to the active side.
// ---------------------------------------------------------------------------

const RED = "#EF4444";
const WHITE = "#E2E8F0";
const BEAD_COLORS = [RED, RED, RED, RED, RED, WHITE, WHITE, WHITE, WHITE, WHITE];

/** Single row of 10 beads */
function BeadRow({
  activeCount,
  onSetActive: setActive,
  disabled,
  prefersReducedMotion,
  rowLabel,
}: {
  activeCount: number;
  onSetActive: (count: number) => void;
  disabled: boolean;
  prefersReducedMotion: boolean | null;
  rowLabel: string;
}) {
  function handleBeadClick(index: number) {
    if (disabled) return;
    // If clicking an active bead, deactivate it and all to the right
    // If clicking an inactive bead, activate it and all to the left
    if (index < activeCount) {
      // Clicking an active bead — deactivate from this position
      setActive(index);
    } else {
      // Clicking an inactive bead — activate up to and including this bead
      setActive(index + 1);
    }
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={rowLabel}>
      {/* Rod background */}
      <div className="relative flex items-center rounded-full bg-muted/40 px-1 py-1.5">
        {/* Active zone highlight */}
        {activeCount > 0 && (
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-foreground/5 transition-all duration-200"
            style={{ width: `${(activeCount / 10) * 100}%` }}
          />
        )}

        {/* Beads */}
        {BEAD_COLORS.map((color, i) => {
          const isActive = i < activeCount;
          return (
            <motion.button
              key={i}
              onClick={() => handleBeadClick(i)}
              disabled={disabled}
              initial={prefersReducedMotion ? {} : { scale: 0.8 }}
              animate={{
                scale: 1,
                x: isActive ? 0 : 4,
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "relative z-10 size-8 rounded-full border-2 transition-all duration-200 sm:size-10",
                isActive
                  ? "shadow-md"
                  : "opacity-60 hover:opacity-80",
                disabled && "cursor-default",
              )}
              style={{
                backgroundColor: color,
                borderColor:
                  color === RED
                    ? isActive
                      ? "#DC2626"
                      : "#FCA5A5"
                    : isActive
                      ? "#94A3B8"
                      : "#CBD5E1",
              }}
              aria-label={`Bead ${i + 1}, ${color === RED ? "red" : "white"}, ${isActive ? "active" : "inactive"}`}
            >
              {/* Highlight shine */}
              <div className="absolute left-1 top-1 size-2 rounded-full bg-white/40 sm:size-2.5" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function Rekenrek() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as RekenrekContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [topRow, setTopRow] = useState(0);
  const [bottomRow, setBottomRow] = useState(0);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  // Reset on question change
  useEffect(() => {
    setTopRow(0);
    setBottomRow(0);
  }, [questionKey]);

  if (!question) return null;

  const totalActive = topRow + bottomRow;
  const { targetNumber } = question;

  const isCorrectFeedback =
    state.showingFeedback && state.feedbackType === "correct";

  function handleTopChange(count: number) {
    play("tap");
    setTopRow(count);
  }

  function handleBottomChange(count: number) {
    play("tap");
    setBottomRow(count);
  }

  function handleReset() {
    setTopRow(0);
    setBottomRow(0);
  }

  function handleSubmit() {
    const isCorrect = totalActive === targetNumber;
    recordAnswer(String(totalActive), isCorrect);

    if (!isCorrect) {
      setTimeout(() => {
        setTopRow(0);
        setBottomRow(0);
      }, 2000);
    }
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Slide the beads to show the number! Red beads first, then white.
        </p>
      </div>

      {/* Rekenrek frame */}
      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-4 sm:p-6">
        {/* Wooden frame look */}
        <div className="space-y-2">
          <BeadRow
            activeCount={topRow}
            onSetActive={handleTopChange}
            disabled={isCorrectFeedback}
            prefersReducedMotion={prefersReducedMotion}
            rowLabel="Top row"
          />
          <BeadRow
            activeCount={bottomRow}
            onSetActive={handleBottomChange}
            disabled={isCorrectFeedback}
            prefersReducedMotion={prefersReducedMotion}
            rowLabel="Bottom row"
          />
        </div>

        {/* Row counts */}
        <div className="mt-2 flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <span>Top: {topRow}</span>
          <span>Bottom: {bottomRow}</span>
        </div>
      </div>

      {/* Total counter */}
      <div className="flex items-center justify-center gap-4">
        <motion.div
          key={totalActive}
          initial={prefersReducedMotion ? {} : { scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex size-16 items-center justify-center rounded-2xl border-2"
          style={{
            borderColor: subjectColor,
            backgroundColor: `${subjectColor}10`,
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: subjectColor }}
          >
            {totalActive}
          </span>
        </motion.div>

        {totalActive > 0 && !isCorrectFeedback && (
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Making-10 insight (show when top row is full) */}
      {topRow === 10 && bottomRow > 0 && (
        <div className="text-center text-xs font-medium text-muted-foreground">
          10 + {bottomRow} = {totalActive}
        </div>
      )}

      {/* Submit */}
      {!state.showingFeedback && totalActive > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSubmit}
            size="lg"
            className="rounded-xl px-8"
            style={{ backgroundColor: subjectColor }}
          >
            <Check className="size-4" />
            Check My Answer
          </Button>
        </motion.div>
      )}

      {/* Feedback */}
      <ActivityFeedback hint={question.hint} />
    </div>
  );
}
