"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import { useRepeatPress } from "@/hooks/use-repeat-press";
import type { CountingContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// CountingWidget - Tap plus/minus to count items, visual emoji grid
// ---------------------------------------------------------------------------

// When there are lots of items, rotate emojis every GROUP_SIZE to create
// visual landmarks so kids don't lose their place while scrolling.
const GROUP_SIZE = 25;
const ALTERNATE_EMOJIS = ["🌟", "🌸", "🔷", "🍀"];

function getEmojiForIndex(
  baseEmoji: string,
  index: number,
  totalItems: number,
): string {
  if (totalItems <= GROUP_SIZE) return baseEmoji;
  const groupIndex = Math.floor(index / GROUP_SIZE);
  if (groupIndex === 0) return baseEmoji;
  const alts = ALTERNATE_EMOJIS.filter((e) => e !== baseEmoji);
  return alts[(groupIndex - 1) % alts.length];
}

interface CountingWidgetProps {
  /** Pre-K mode: larger targets, max count 5, no negative feedback */
  isPreK?: boolean;
}

export function CountingWidget({ isPreK = false }: CountingWidgetProps) {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as CountingContent;
  const rawQuestion = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  // Pre-K: cap correctCount and displayCount at 5
  const question = rawQuestion
    ? isPreK
      ? {
          ...rawQuestion,
          correctCount: Math.min(rawQuestion.correctCount, 5),
          displayCount: Math.min(rawQuestion.displayCount, 5),
        }
      : rawQuestion
    : null;

  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [tappedItems, setTappedItems] = useState<Set<number>>(new Set());
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [editValue, setEditValue] = useState("");
  const countInputRef = useRef<HTMLInputElement>(null);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  if (!question) return null;

  // Generate array of item indices for the emoji grid
  const items = Array.from({ length: question.displayCount }, (_, i) => i);

  function handleTapItem(index: number) {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    if (submitted && state.feedbackType === "correct") return;

    play("tap");
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

  const handleIncrement = useCallback(() => {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    setCount((c) => c + 1);
  }, [state.showingFeedback, state.feedbackType]);

  const handleDecrement = useCallback(() => {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    setCount((c) => Math.max(0, c - 1));
  }, [state.showingFeedback, state.feedbackType]);

  const isLocked = state.showingFeedback && state.feedbackType === "correct";

  const { pressHandlers: incrementHandlers } = useRepeatPress({
    onAction: handleIncrement,
    disabled: isLocked,
  });

  const { pressHandlers: decrementHandlers } = useRepeatPress({
    onAction: handleDecrement,
    disabled: count <= 0 || isLocked,
  });

  function handleSubmit() {
    if (!question) return;
    setSubmitted(true);
    const isCorrect = count === question.correctCount;

    if (isPreK && !isCorrect) {
      // Pre-K: no failure state — just encourage and reset gently
      play("tap");
      setTimeout(() => {
        setSubmitted(false);
        setCount(0);
        setTappedItems(new Set());
      }, 2000);
      return;
    }

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
        <p className={cn(
          "text-muted-foreground",
          isPreK ? "text-base" : "text-sm",
        )}>
          Tap each {question.emoji} to count them!
        </p>
      </div>

      {/* Emoji grid - tap to count, grouped in rows of 5 */}
      {/* For large counts (>25), emojis rotate every 25 items with group labels */}
      <div className="space-y-1 rounded-2xl bg-muted/20 p-4 sm:p-6">
        {/* First group label when there are multiple groups */}
        {items.length > GROUP_SIZE && (
          <div className="mb-1 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              1 – {Math.min(GROUP_SIZE, items.length)}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}
        {Array.from(
          { length: Math.ceil(items.length / 5) },
          (_, rowIdx) => {
            const rowStart = rowIdx * 5;
            const rowItems = items.slice(rowStart, rowStart + 5);
            // Extra gap between every pair of rows (groups of 10)
            const isGroupBoundary = rowIdx > 0 && rowIdx % 2 === 0;
            // Show a labeled separator at every 25-item boundary (row 5, 10, 15...)
            const isEmojiGroupStart =
              items.length > GROUP_SIZE &&
              rowStart > 0 &&
              rowStart % GROUP_SIZE === 0;

            return (
              <div key={rowIdx}>
                {isEmojiGroupStart && (
                  <div className="my-2 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {rowStart + 1} – {Math.min(rowStart + GROUP_SIZE, items.length)}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}
                <div
                  className={cn(
                    "flex justify-center gap-2.5",
                    isGroupBoundary && !isEmojiGroupStart && "mt-3",
                  )}
                >
                  {rowItems.map((index) => {
                    const isTapped = tappedItems.has(index);
                    const emoji = getEmojiForIndex(
                      question.emoji,
                      index,
                      items.length,
                    );
                    return (
                      <motion.button
                        key={index}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, scale: 0.5 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: Math.min(index * 0.03, 1.5),
                          duration: 0.2,
                        }}
                        whileTap={
                          prefersReducedMotion ? {} : { scale: 0.85 }
                        }
                        onClick={() => handleTapItem(index)}
                        disabled={
                          state.showingFeedback &&
                          state.feedbackType === "correct"
                        }
                        className={cn(
                          "flex items-center justify-center rounded-xl border-2 transition-all duration-200 touch-manipulation",
                          isPreK
                            ? "size-16 text-3xl sm:size-18 sm:text-4xl"
                            : "size-12 text-2xl sm:size-14 sm:text-3xl",
                          isTapped
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-transparent bg-card hover:border-border hover:shadow-sm",
                        )}
                        aria-label={`${emoji} item ${index + 1}${isTapped ? ", counted" : ""}`}
                      >
                        <span
                          className={cn(
                            isTapped && "scale-110 transition-transform",
                          )}
                        >
                          {emoji}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* Counter controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full text-lg select-none",
            isPreK ? "size-14" : "size-12",
          )}
          disabled={count <= 0 || isLocked}
          aria-label="Subtract one"
          {...decrementHandlers}
        >
          <Minus className={cn(isPreK ? "size-6" : "size-5")} />
        </Button>

        <motion.div
          key={isEditingCount ? "editing" : count}
          initial={prefersReducedMotion ? {} : { scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex size-20 items-center justify-center rounded-2xl border-2"
          style={{
            borderColor: subjectColor,
            backgroundColor: `${subjectColor}10`,
          }}
        >
          {isEditingCount ? (
            <input
              ref={countInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={editValue}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value.replace(/\D/g, "");
                setEditValue(val);
              }}
              onBlur={() => {
                const parsed = parseInt(editValue, 10);
                if (!isNaN(parsed) && parsed >= 0) {
                  setCount(parsed);
                  setTappedItems(new Set());
                }
                setIsEditingCount(false);
                setEditValue("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  countInputRef.current?.blur();
                }
              }}
              className="w-16 bg-transparent text-center text-3xl font-bold outline-none"
              style={{ color: subjectColor }}
              autoComplete="off"
              aria-label="Type your count"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isLocked) return;
                setIsEditingCount(true);
                setEditValue(count > 0 ? String(count) : "");
                // Focus the input after React renders it
                setTimeout(() => countInputRef.current?.focus(), 50);
              }}
              disabled={isLocked}
              className="flex size-full items-center justify-center"
              aria-label={`Count is ${count}, tap to type a number`}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: subjectColor }}
              >
                {count}
              </span>
            </button>
          )}
        </motion.div>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full text-lg select-none",
            isPreK ? "size-14" : "size-12",
          )}
          disabled={isLocked}
          aria-label="Add one"
          {...incrementHandlers}
        >
          <Plus className={cn(isPreK ? "size-6" : "size-5")} />
        </Button>
      </div>

      {/* Hint: tap the number to type */}
      {!isLocked && !isEditingCount && (
        <p className="text-center text-xs text-muted-foreground">
          Tap the number to type your answer directly
        </p>
      )}

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

      {/* Pre-K: encouraging message instead of error feedback */}
      {isPreK && submitted && count !== question.correctCount && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-base font-semibold text-amber-600"
        >
          Keep counting! You&apos;re doing great! 🌟
        </motion.p>
      )}

      {/* Feedback (hidden for Pre-K wrong answers — handled above) */}
      {!isPreK && <ActivityFeedback hint={question.hint} />}
      {isPreK && state.feedbackType === "correct" && (
        <ActivityFeedback hint={question.hint} />
      )}
    </div>
  );
}
