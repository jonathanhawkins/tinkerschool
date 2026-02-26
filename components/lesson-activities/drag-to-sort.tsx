"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { DragToSortContent, DragToSortItem } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// DragToSort - Drag items into category buckets for classification
// ---------------------------------------------------------------------------

/** Shuffle an array using Fisher-Yates */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Encouragement messages shown when an item is dropped in the wrong bucket */
const ENCOURAGEMENT = [
  "Try another spot!",
  "Hmm, not that one!",
  "Almost! Try again!",
  "Keep going!",
  "Try a different bucket!",
];

function randomEncouragement(): string {
  return ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
}

export function DragToSort() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as DragToSortContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  // Shuffled items (once on mount)
  const [unsortedItems, setUnsortedItems] = useState<DragToSortItem[]>(() =>
    shuffle(question?.items ?? []),
  );

  // Track which items are in each bucket: bucketId -> item[]
  const [bucketContents, setBucketContents] = useState<
    Record<string, DragToSortItem[]>
  >({});

  // Currently dragged item ID
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Which bucket is being hovered over
  const [hoveredBucketId, setHoveredBucketId] = useState<string | null>(null);

  // Item that shook back (incorrect placement)
  const [shakeItemId, setShakeItemId] = useState<string | null>(null);

  // Encouragement message for incorrect placement
  const [encouragement, setEncouragement] = useState<string | null>(null);

  // All items sorted flag
  const allSorted = unsortedItems.length === 0;

  const questionKey = question?.id ?? state.currentQuestionIndex;

  if (!question) return null;

  // -------------------------------------------------------------------------
  // Drop handler: validate placement, animate accordingly
  // -------------------------------------------------------------------------
  const handleDrop = useCallback(
    (bucketId: string, itemId: string) => {
      const item = unsortedItems.find((i) => i.id === itemId);
      if (!item) return;

      if (item.correctBucket === bucketId) {
        // Correct placement
        play("match");
        setBucketContents((prev) => ({
          ...prev,
          [bucketId]: [...(prev[bucketId] ?? []), item],
        }));
        setUnsortedItems((prev) => prev.filter((i) => i.id !== itemId));
        setEncouragement(null);

        // Check if all items are now sorted
        const remainingAfterThis = unsortedItems.filter(
          (i) => i.id !== itemId,
        );
        if (remainingAfterThis.length === 0) {
          // All sorted correctly
          recordAnswer("all_sorted", true);
        }
      } else {
        // Incorrect placement - shake back, show encouragement
        play("incorrect");
        setShakeItemId(itemId);
        setEncouragement(randomEncouragement());
        setTimeout(() => {
          setShakeItemId(null);
        }, 600);
      }

      setDraggedItemId(null);
      setHoveredBucketId(null);
    },
    [unsortedItems, play, recordAnswer],
  );

  // -------------------------------------------------------------------------
  // HTML5 Drag handlers
  // -------------------------------------------------------------------------
  function handleDragStart(e: React.DragEvent, itemId: string) {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItemId(itemId);
    setEncouragement(null);
  }

  function handleDragEnd() {
    setDraggedItemId(null);
    setHoveredBucketId(null);
  }

  function handleBucketDragOver(e: React.DragEvent, bucketId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredBucketId(bucketId);
  }

  function handleBucketDragLeave() {
    setHoveredBucketId(null);
  }

  function handleBucketDrop(e: React.DragEvent, bucketId: string) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      handleDrop(bucketId, itemId);
    }
  }

  // -------------------------------------------------------------------------
  // Pointer-based drag for touch devices (fallback for HTML5 D&D)
  // -------------------------------------------------------------------------
  // We use a tap-to-select + tap-bucket approach for touch, since HTML5
  // drag-and-drop has poor touch support across devices.
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  function handleItemTap(itemId: string) {
    if (state.showingFeedback && state.feedbackType === "correct") return;
    play("tap");
    setEncouragement(null);
    setSelectedItemId((prev) => (prev === itemId ? null : itemId));
  }

  function handleBucketTap(bucketId: string) {
    if (!selectedItemId) return;
    handleDrop(bucketId, selectedItemId);
    setSelectedItemId(null);
  }

  // -------------------------------------------------------------------------
  // Determine bucket grid layout based on count
  // -------------------------------------------------------------------------
  const bucketCount = question.buckets.length;
  const bucketGridClass =
    bucketCount === 2
      ? "grid-cols-2"
      : bucketCount === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2";

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Question prompt */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {question.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Drag each item to the right bucket, or tap to select then tap a
          bucket!
        </p>
      </div>

      {/* Encouragement message for incorrect placement */}
      <AnimatePresence>
        {encouragement && !allSorted && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-amber-500/10 p-3 text-center text-sm font-medium text-amber-700"
          >
            {encouragement}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items to sort */}
      {unsortedItems.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {unsortedItems.map((item, i) => {
            const isDragging = draggedItemId === item.id;
            const isSelected = selectedItemId === item.id;
            const isShaking = shakeItemId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 15 }
                }
                animate={{
                  opacity: isDragging ? 0.5 : 1,
                  y: 0,
                  x: isShaking ? [0, -6, 6, -6, 6, 0] : 0,
                  scale: isShaking ? 1 : 1,
                }}
                transition={
                  isShaking
                    ? { duration: 0.4 }
                    : { delay: i * 0.06, duration: 0.25 }
                }
                layout
              >
                <button
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleItemTap(item.id)}
                  className={cn(
                    "flex min-h-[56px] cursor-grab items-center gap-2.5 rounded-2xl border-2 p-3.5 transition-all duration-200 touch-manipulation active:cursor-grabbing",
                    isSelected
                      ? "shadow-md"
                      : "border-border bg-card hover:border-border/80 hover:shadow-sm",
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: subjectColor,
                          backgroundColor: `${subjectColor}10`,
                        }
                      : undefined
                  }
                >
                  <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Drop zone buckets */}
      <div className={cn("grid gap-3", bucketGridClass)}>
        {question.buckets.map((bucket, i) => {
          const isHovered = hoveredBucketId === bucket.id;
          const items = bucketContents[bucket.id] ?? [];
          const hasItems = items.length > 0;

          return (
            <motion.div
              key={bucket.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <div
                onDragOver={(e) => handleBucketDragOver(e, bucket.id)}
                onDragLeave={handleBucketDragLeave}
                onDrop={(e) => handleBucketDrop(e, bucket.id)}
                onClick={() => handleBucketTap(bucket.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBucketTap(bucket.id);
                  }
                }}
                aria-label={`${bucket.label} bucket`}
                className={cn(
                  "flex min-h-[140px] flex-col items-center rounded-2xl border-2 border-dashed p-4 transition-all duration-200 touch-manipulation",
                  isHovered
                    ? "scale-[1.02] shadow-md"
                    : "hover:shadow-sm",
                  !isHovered &&
                    !hasItems &&
                    "border-border/60 bg-muted/30",
                  !isHovered &&
                    hasItems &&
                    "border-border bg-card",
                  selectedItemId && !isHovered &&
                    "cursor-pointer ring-2 ring-primary/20",
                )}
                style={
                  isHovered
                    ? {
                        borderColor: subjectColor,
                        backgroundColor: `${subjectColor}0D`,
                      }
                    : undefined
                }
              >
                {/* Bucket header */}
                <div className="mb-3 flex items-center gap-2">
                  {bucket.emoji && (
                    <span className="text-2xl">{bucket.emoji}</span>
                  )}
                  <span
                    className="text-base font-semibold"
                    style={{ color: subjectColor }}
                  >
                    {bucket.label}
                  </span>
                </div>

                {/* Items in bucket */}
                {hasItems ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, scale: 0.6 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className="flex items-center gap-1.5 rounded-xl border bg-card px-3 py-1.5"
                          style={{
                            borderColor: `${subjectColor}40`,
                            backgroundColor: `${subjectColor}08`,
                          }}
                        >
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-xs font-medium text-foreground">
                            {item.label}
                          </span>
                          <CheckCircle2
                            className="size-3.5 shrink-0"
                            style={{ color: subjectColor }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60">
                    Drop items here
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Celebration when all sorted */}
      <AnimatePresence>
        {allSorted && !state.showingFeedback && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <p className="text-lg font-bold" style={{ color: subjectColor }}>
              All sorted!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <ActivityFeedback hint={question.hint} autoAdvanceDelay={2000} />
    </div>
  );
}
