"use client";

import { useState } from "react";
import { motion, Reorder, useReducedMotion } from "framer-motion";
import { GripVertical, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { SequenceOrderContent, SequenceItem } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// SequenceOrder - Drag items into the correct order
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Normalize sequence_order data — seed migrations use 2 schemas:
//   1. items with correctPosition on each item  (curriculum doc standard)
//   2. items WITHOUT correctPosition + correctOrder array on question
// ---------------------------------------------------------------------------
interface RawSequenceItem {
  id: string;
  text: string;
  emoji?: string;
  correctPosition?: number;
}

interface RawSequenceQuestion {
  id: string;
  prompt: string;
  items: RawSequenceItem[];
  correctOrder?: string[];
  hint?: string;
}

function normalizeItems(question: RawSequenceQuestion): SequenceItem[] {
  return question.items.map((item) => {
    if (item.correctPosition != null) return item as SequenceItem;
    // Derive correctPosition from correctOrder array
    if (question.correctOrder) {
      const pos = question.correctOrder.indexOf(item.id);
      return { ...item, correctPosition: pos >= 0 ? pos + 1 : 0 };
    }
    // Fallback: assume items are already in correct order
    const idx = question.items.indexOf(item);
    return { ...item, correctPosition: idx + 1 };
  });
}

/** Shuffle array */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SequenceOrderProps {
  /** Pre-K mode: max 3 items, larger drag areas, hints instead of errors */
  isPreK?: boolean;
}

export function SequenceOrder({ isPreK = false }: SequenceOrderProps) {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as SequenceOrderContent;
  const rawQuestion = activity.questions[state.currentQuestionIndex] as unknown as RawSequenceQuestion | undefined;
  const question = rawQuestion ?? null;
  const prefersReducedMotion = useReducedMotion();

  // Normalized items with correctPosition (before shuffle)
  const allNormalizedItems = question ? normalizeItems(question) : [];
  // Pre-K: limit to 3 items max
  const normalizedItems = isPreK
    ? allNormalizedItems.slice(0, 3)
    : allNormalizedItems;

  // Correct text sequence (items sorted by correctPosition)
  const correctTextOrder = [...normalizedItems]
    .sort((a, b) => a.correctPosition - b.correctPosition)
    .map((item) => item.text);

  // Shuffled items for ordering
  const [items, setItems] = useState<SequenceItem[]>(() =>
    shuffle(normalizedItems),
  );

  // Pre-K: track whether to show a hint
  const [preKShowHint, setPreKShowHint] = useState(false);

  const questionKey = question?.id ?? state.currentQuestionIndex;

  if (!question) return null;

  function handleCheck() {
    // Compare by TEXT sequence, not item IDs — handles duplicate text values
    // (e.g. CLAP, TAP, CLAP, TAP where both CLAPs are equivalent)
    const isCorrect = items.every(
      (item, index) => item.text === correctTextOrder[index],
    );

    if (isPreK && !isCorrect) {
      // Pre-K: no error — show encouraging hint instead
      play("tap");
      setPreKShowHint(true);
      setTimeout(() => setPreKShowHint(false), 2500);
      return;
    }

    const orderStr = items.map((item) => item.text).join(",");
    recordAnswer(orderStr, isCorrect);

    if (!isCorrect) {
      // Don't reset - let them keep rearranging after dismissing feedback
    }
  }

  // Tap-to-swap: simpler interaction for young kids
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleTapItem(index: number) {
    if (state.showingFeedback && state.feedbackType === "correct") return;

    play("tap");
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      // Swap items
      const newItems = [...items];
      [newItems[selectedIndex], newItems[index]] = [
        newItems[index],
        newItems[selectedIndex],
      ];
      setItems(newItems);
      setSelectedIndex(null);
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
          Tap two items to swap them, or drag to reorder!
        </p>
      </div>

      {/* Reorderable list */}
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;

          return (
            <Reorder.Item
              key={item.id}
              value={item}
              className={cn(
                "flex cursor-grab items-center gap-3 rounded-2xl border-2 active:cursor-grabbing",
                "transition-colors duration-200",
                isPreK ? "p-5" : "p-4",
                isSelected
                  ? "shadow-md"
                  : "border-border bg-card hover:border-border/80",
              )}
              style={
                isSelected
                  ? {
                      borderColor: subjectColor,
                      backgroundColor: `${subjectColor}10`,
                    }
                  : undefined
              }
              whileDrag={
                prefersReducedMotion
                  ? {}
                  : { scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }
              }
              onClick={() => handleTapItem(index)}
            >
              {/* Position number */}
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
                  isPreK ? "size-10 text-base" : "size-8 text-sm",
                )}
                style={{ backgroundColor: subjectColor }}
              >
                {index + 1}
              </span>

              {/* Drag handle */}
              <GripVertical className={cn(
                "shrink-0 text-muted-foreground/50",
                isPreK ? "size-6" : "size-4",
              )} />

              {/* Item content */}
              {item.emoji && (
                <span className={cn(isPreK ? "text-3xl" : "text-2xl")}>
                  {item.emoji}
                </span>
              )}
              <span className={cn(
                "flex-1 font-medium text-foreground",
                isPreK ? "text-lg" : "text-base",
              )}>
                {item.text}
              </span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Check button */}
      {!state.showingFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleCheck}
            size="lg"
            className="rounded-xl px-8"
            style={{ backgroundColor: subjectColor }}
          >
            <Check className="size-4" />
            Check Order
          </Button>
        </motion.div>
      )}

      {/* Pre-K: encouraging hint instead of error feedback */}
      {isPreK && preKShowHint && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-base font-semibold text-amber-600"
        >
          Let&apos;s try moving this one! You&apos;re almost there! 🌟
        </motion.p>
      )}

      {/* Feedback (standard mode) */}
      {!isPreK && <ActivityFeedback hint={question.hint} />}
      {isPreK && state.feedbackType === "correct" && (
        <ActivityFeedback hint={question.hint} />
      )}
    </div>
  );
}
