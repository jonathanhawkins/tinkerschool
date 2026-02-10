"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { TenFrameContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// TenFrame - 2x5 grid for placing counters (making-10 strategy)
// ---------------------------------------------------------------------------
// Kids tap cells to place/remove counters. For addition: fill frame 1,
// overflow into frame 2. Color distinction between addends.
// ---------------------------------------------------------------------------

/** Single 2x5 grid frame */
function Frame({
  cells,
  onToggle,
  disabled,
  subjectColor,
  secondColor,
  prefersReducedMotion,
  frameOffset,
}: {
  cells: ("a" | "b" | null)[];
  onToggle: (index: number) => void;
  disabled: boolean;
  subjectColor: string;
  secondColor: string;
  prefersReducedMotion: boolean | null;
  frameOffset: number;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5 rounded-2xl border-2 border-border bg-muted/20 p-3 sm:gap-2 sm:p-4">
      {cells.map((cell, i) => {
        const filled = cell !== null;
        const color = cell === "b" ? secondColor : subjectColor;
        return (
          <motion.button
            key={i}
            initial={prefersReducedMotion ? {} : { scale: 0.9 }}
            animate={{ scale: 1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            onClick={() => onToggle(frameOffset + i)}
            disabled={disabled}
            className={cn(
              "flex size-12 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all duration-200 sm:size-14",
              filled
                ? "border-transparent shadow-sm"
                : "border-dashed border-border/60 bg-card hover:border-border",
            )}
            style={
              filled
                ? { backgroundColor: `${color}25`, borderColor: color }
                : undefined
            }
            aria-label={`Cell ${frameOffset + i + 1}${filled ? ", filled" : ", empty"}`}
          >
            {filled && (
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="size-7 rounded-full sm:size-8"
                style={{ backgroundColor: color }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export function TenFrame() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as TenFrameContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const frameCount = question?.frameCount ?? 1;
  const totalCells = frameCount * 10;

  // Each cell is null (empty), "a" (first addend color), or "b" (second addend color)
  const [cells, setCells] = useState<("a" | "b" | null)[]>(
    Array(totalCells).fill(null),
  );

  const questionKey = question?.id ?? state.currentQuestionIndex;

  // Reset on question change
  useEffect(() => {
    setCells(Array(totalCells).fill(null));
  }, [questionKey, totalCells]);

  const filledCount = cells.filter((c) => c !== null).length;

  // Compute the correct answer
  const correctCount = question?.operation
    ? question.operation.type === "add"
      ? question.operation.a + question.operation.b
      : question.operation.a - question.operation.b
    : question?.targetNumber ?? 0;

  const secondColor = "#3B82F6"; // Blue for second addend (distinct from subject color)

  const handleToggle = useCallback(
    (index: number) => {
      if (state.showingFeedback && state.feedbackType === "correct") return;
      play("tap");

      setCells((prev) => {
        const next = [...prev];
        if (next[index] !== null) {
          next[index] = null;
        } else {
          // For operation mode, track which addend the counter belongs to
          if (question?.operation) {
            const aCount = prev.filter((c) => c === "a").length;
            next[index] = aCount < question.operation.a ? "a" : "b";
          } else {
            next[index] = "a";
          }
        }
        return next;
      });
    },
    [play, question, state.showingFeedback, state.feedbackType],
  );

  function handleReset() {
    setCells(Array(totalCells).fill(null));
  }

  function handleSubmit() {
    const isCorrect = filledCount === correctCount;
    recordAnswer(String(filledCount), isCorrect);

    if (!isCorrect) {
      setTimeout(() => {
        setCells(Array(totalCells).fill(null));
      }, 2000);
    }
  }

  if (!question) return null;

  const isCorrectFeedback =
    state.showingFeedback && state.feedbackType === "correct";

  const frame1Cells = cells.slice(0, 10);
  const frame2Cells = frameCount === 2 ? cells.slice(10, 20) : [];

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Tap the boxes to place counters!
        </p>
      </div>

      {/* Ten frame(s) */}
      <div className="flex flex-col items-center gap-3">
        <Frame
          cells={frame1Cells}
          onToggle={handleToggle}
          disabled={isCorrectFeedback}
          subjectColor={subjectColor}
          secondColor={secondColor}
          prefersReducedMotion={prefersReducedMotion}
          frameOffset={0}
        />
        {frameCount === 2 && (
          <Frame
            cells={frame2Cells}
            onToggle={handleToggle}
            disabled={isCorrectFeedback}
            subjectColor={subjectColor}
            secondColor={secondColor}
            prefersReducedMotion={prefersReducedMotion}
            frameOffset={10}
          />
        )}
      </div>

      {/* Counter display */}
      <div className="flex items-center justify-center gap-4">
        <motion.div
          key={filledCount}
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
            {filledCount}
          </span>
        </motion.div>

        {filledCount > 0 && !isCorrectFeedback && (
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

      {/* Making-10 hint */}
      {question.showMakingTen && question.operation && filledCount > 0 && (
        <div className="text-center text-xs text-muted-foreground">
          {filledCount <= 10 ? (
            <span>
              {10 - filledCount} more to fill the frame!
            </span>
          ) : (
            <span>
              10 + {filledCount - 10} = {filledCount}
            </span>
          )}
        </div>
      )}

      {/* Submit */}
      {!state.showingFeedback && filledCount > 0 && (
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
