"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { NumberLineContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// NumberLine - Tap-to-hop along a number line to solve addition/subtraction
// ---------------------------------------------------------------------------
// A horizontal number line with tick marks. Student taps tick marks to
// place their marker or taps +/- to hop. Shows arc lines above for each hop.
// ---------------------------------------------------------------------------

interface Hop {
  from: number;
  to: number;
}

export function NumberLine() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as NumberLineContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [position, setPosition] = useState(question?.startPosition ?? 0);
  const [hops, setHops] = useState<Hop[]>([]);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  // Reset on question change
  useEffect(() => {
    setPosition(question?.startPosition ?? 0);
    setHops([]);
  }, [questionKey, question?.startPosition]);

  if (!question) return null;

  const { min, max, startPosition, correctEndPosition, operation, jumpSize } =
    question;
  const range = max - min || 1;
  const showArcs = question.showJumpArcs !== false; // default true

  const isCorrectFeedback =
    state.showingFeedback && state.feedbackType === "correct";

  // Number line tick marks
  const ticks: number[] = [];
  for (let i = min; i <= max; i++) {
    ticks.push(i);
  }

  // Convert a number to a percentage position on the line
  function toPercent(n: number): number {
    return ((n - min) / range) * 100;
  }

  function handleHop(direction: 1 | -1) {
    if (isCorrectFeedback) return;
    const hopAmount = jumpSize ?? 1;
    const from = position;
    const to = Math.max(min, Math.min(max, position + direction * hopAmount));
    if (to === from) return;

    play("tap");
    setPosition(to);
    setHops((prev) => [...prev, { from, to }]);
  }

  function handleTickClick(n: number) {
    if (isCorrectFeedback) return;
    if (n === position) return;

    play("tap");
    const from = position;
    setPosition(n);
    setHops((prev) => [...prev, { from, to: n }]);
  }

  function handleReset() {
    setPosition(startPosition);
    setHops([]);
  }

  function handleSubmit() {
    const isCorrect = position === correctEndPosition;
    recordAnswer(String(position), isCorrect);

    if (!isCorrect) {
      setTimeout(() => {
        setPosition(startPosition);
        setHops([]);
      }, 2000);
    }
  }

  // Decide which ticks get labels (show every tick if <= 20, else every 5)
  const labelEvery = range <= 20 ? 1 : range <= 50 ? 5 : 10;

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          {operation === "add"
            ? "Hop forward to add!"
            : "Hop backward to subtract!"}
        </p>
      </div>

      {/* Number line visualization */}
      <div className="relative mx-auto w-full max-w-lg px-4">
        {/* Hop arcs (SVG overlay) */}
        {showArcs && hops.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-x-4 -top-8 h-10"
            preserveAspectRatio="none"
            viewBox={`0 0 100 20`}
            aria-hidden
          >
            {hops.map((hop, i) => {
              const x1 = toPercent(hop.from);
              const x2 = toPercent(hop.to);
              const midX = (x1 + x2) / 2;
              const arcHeight = Math.min(18, Math.abs(x2 - x1) * 0.5);
              return (
                <path
                  key={i}
                  d={`M ${x1} 19 Q ${midX} ${19 - arcHeight} ${x2} 19`}
                  fill="none"
                  stroke={subjectColor}
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity={i === hops.length - 1 ? 1 : 0.4}
                />
              );
            })}
          </svg>
        )}

        {/* Main line */}
        <div className="relative h-16">
          {/* Horizontal line */}
          <div className="absolute left-0 right-0 top-8 h-0.5 bg-border" />

          {/* Tick marks and labels */}
          {ticks.map((n) => {
            const pct = toPercent(n);
            const showLabel = (n - min) % labelEvery === 0;
            const isStart = n === startPosition;
            const isCurrent = n === position;

            return (
              <button
                key={n}
                className={cn(
                  "absolute top-6 flex -translate-x-1/2 flex-col items-center px-1 py-0.5 touch-manipulation",
                  isCorrectFeedback ? "cursor-default" : "cursor-pointer",
                )}
                style={{ left: `${pct}%`, minWidth: "24px", minHeight: "44px" }}
                onClick={() => handleTickClick(n)}
                disabled={isCorrectFeedback}
                aria-label={`Number ${n}${isCurrent ? ", current position" : ""}`}
              >
                {/* Tick line */}
                <div
                  className={cn(
                    "w-0.5 transition-all duration-200",
                    isCurrent || isStart
                      ? "h-5 bg-foreground"
                      : showLabel
                        ? "h-3.5 bg-border"
                        : "h-2 bg-border/60",
                  )}
                />
                {/* Label */}
                {showLabel && (
                  <span
                    className={cn(
                      "mt-0.5 text-[10px] font-medium transition-colors",
                      isCurrent
                        ? "font-bold text-foreground"
                        : isStart
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60",
                    )}
                  >
                    {n}
                  </span>
                )}
              </button>
            );
          })}

          {/* Start marker (subtle) */}
          <motion.div
            className="absolute top-4 size-3 -translate-x-1/2 rounded-full bg-muted-foreground/30"
            style={{ left: `${toPercent(startPosition)}%` }}
            aria-hidden
          />

          {/* Current position marker */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={position}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { y: -8, opacity: 0.5 }
              }
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-1 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${toPercent(position)}%` }}
            >
              <span className="text-lg" role="img" aria-label="marker">
                🐸
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => handleHop(-1)}
          variant="outline"
          size="lg"
          className="rounded-xl px-6 text-base"
          disabled={position <= min || isCorrectFeedback}
        >
          ← {jumpSize ?? 1}
        </Button>

        <motion.div
          key={position}
          initial={prefersReducedMotion ? {} : { scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex size-14 items-center justify-center rounded-2xl border-2"
          style={{
            borderColor: subjectColor,
            backgroundColor: `${subjectColor}10`,
          }}
        >
          <span
            className="text-xl font-bold"
            style={{ color: subjectColor }}
          >
            {position}
          </span>
        </motion.div>

        <Button
          onClick={() => handleHop(1)}
          variant="outline"
          size="lg"
          className="rounded-xl px-6 text-base"
          disabled={position >= max || isCorrectFeedback}
        >
          {jumpSize ?? 1} →
        </Button>
      </div>

      {/* Hop counter & reset */}
      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>
          {hops.length} hop{hops.length !== 1 ? "s" : ""} from {startPosition}
        </span>
        {hops.length > 0 && !isCorrectFeedback && (
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

      {/* Submit */}
      {!state.showingFeedback && hops.length > 0 && (
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
