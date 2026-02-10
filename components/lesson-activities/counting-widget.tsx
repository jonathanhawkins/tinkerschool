"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import type { CountingContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// CountingWidget - Tap plus/minus to count items, visual emoji grid
// ---------------------------------------------------------------------------

export function CountingWidget() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const activity = currentActivity as CountingContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [tappedItems, setTappedItems] = useState<Set<number>>(new Set());

  const questionKey = question?.id ?? state.currentQuestionIndex;

  if (!question) return null;

  // Generate array of item indices for the emoji grid
  const items = Array.from({ length: question.displayCount }, (_, i) => i);

  function handleTapItem(index: number) {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    if (submitted && state.feedbackType === "correct") return;

    setTappedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        setCount((c) => Math.max(0, c - 1));
      } else {
        next.add(index);
        setCount((c) => c + 1);
      }
      return next;
    });
  }

  function handleIncrement() {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    setCount((c) => c + 1);
  }

  function handleDecrement() {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    setCount((c) => Math.max(0, c - 1));
  }

  function handleSubmit() {
    setSubmitted(true);
    const isCorrect = count === question.correctCount;
    recordAnswer(String(count), isCorrect);

    if (!isCorrect) {
      // Reset for retry
      setTimeout(() => {
        setSubmitted(false);
        setCount(0);
        setTappedItems(new Set());
      }, 2000);
    }
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Question prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Tap each {question.emoji} to count them!
        </p>
      </div>

      {/* Emoji grid - tap to count */}
      <div className="flex flex-wrap justify-center gap-3 rounded-2xl bg-muted/20 p-6">
        {items.map((index) => {
          const isTapped = tappedItems.has(index);
          return (
            <motion.button
              key={index}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.5 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
              onClick={() => handleTapItem(index)}
              disabled={
                state.showingFeedback && state.feedbackType === "correct"
              }
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl border-2 text-3xl transition-all duration-200",
                isTapped
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-transparent bg-card hover:border-border hover:shadow-sm",
              )}
              aria-label={`${question.emoji} item ${index + 1}${isTapped ? ", counted" : ""}`}
            >
              <span className={cn(isTapped && "scale-110 transition-transform")}>
                {question.emoji}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Counter controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="icon"
          className="size-12 rounded-full text-lg"
          disabled={
            count <= 0 ||
            (state.showingFeedback && state.feedbackType === "correct")
          }
          aria-label="Subtract one"
        >
          <Minus className="size-5" />
        </Button>

        <motion.div
          key={count}
          initial={prefersReducedMotion ? {} : { scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex size-20 items-center justify-center rounded-2xl border-2"
          style={{
            borderColor: subjectColor,
            backgroundColor: `${subjectColor}10`,
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: subjectColor }}
          >
            {count}
          </span>
        </motion.div>

        <Button
          onClick={handleIncrement}
          variant="outline"
          size="icon"
          className="size-12 rounded-full text-lg"
          disabled={
            state.showingFeedback && state.feedbackType === "correct"
          }
          aria-label="Add one"
        >
          <Plus className="size-5" />
        </Button>
      </div>

      {/* Submit button */}
      {!state.showingFeedback && count > 0 && (
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
