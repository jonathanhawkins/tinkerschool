"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { TapAndRevealContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// TapAndReveal - Tap covered items to discover what's underneath
// ---------------------------------------------------------------------------

export function TapAndReveal() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as TapAndRevealContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [lastRevealedId, setLastRevealedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const questionKey = question?.id ?? state.currentQuestionIndex;
  const gridCols = question?.gridCols ?? 3;

  const targetIds = useMemo(() => {
    if (!question) return new Set<string>();
    if (question.mode === "find") {
      return new Set(
        question.items.filter((item) => item.isTarget).map((item) => item.id),
      );
    }
    // Explore mode: all items are "targets"
    return new Set(question.items.map((item) => item.id));
  }, [question]);

  const checkCompletion = useCallback(
    (newRevealed: Set<string>) => {
      if (completed) return;

      if (question.mode === "find") {
        // Find mode: complete when all targets are revealed
        const allTargetsFound = [...targetIds].every((id) =>
          newRevealed.has(id),
        );
        if (allTargetsFound) {
          setCompleted(true);
          play("complete");
          recordAnswer("all_targets_found", true);
        }
      } else {
        // Explore mode: complete when all items are revealed
        const allRevealed = question.items.every((item) =>
          newRevealed.has(item.id),
        );
        if (allRevealed) {
          setCompleted(true);
          play("complete");
          recordAnswer("all_revealed", true);
        }
      }
    },
    [completed, question, targetIds, play, recordAnswer],
  );

  const handleTap = useCallback(
    (itemId: string) => {
      if (revealedIds.has(itemId) || completed) return;

      const item = question.items.find((i) => i.id === itemId);
      if (!item) return;

      const newRevealed = new Set(revealedIds);
      newRevealed.add(itemId);
      setRevealedIds(newRevealed);
      setLastRevealedId(itemId);

      if (question.mode === "find" && item.isTarget) {
        play("correct");
      } else if (question.mode === "find" && !item.isTarget) {
        play("tap");
      } else {
        play("flip");
      }

      checkCompletion(newRevealed);
    },
    [revealedIds, completed, question, play, checkCompletion],
  );

  if (!question) return null;

  const gridClassName = cn(
    "mx-auto grid place-items-center gap-3",
    gridCols === 2 && "max-w-xs grid-cols-2",
    gridCols === 3 && "max-w-sm grid-cols-3",
    gridCols === 4 && "max-w-md grid-cols-4",
    !gridCols || (gridCols < 2 || gridCols > 4) ? "max-w-sm grid-cols-3" : "",
  );

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Question prompt */}
      <div className="space-y-2 text-center">
        {question.mode === "find" ? (
          <motion.div
            className="mx-auto flex size-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${subjectColor}1F` }}
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Search className="size-6" style={{ color: subjectColor }} />
          </motion.div>
        ) : null}
        <h3 className="text-lg font-semibold text-foreground">
          {question.mode === "find" && question.targetPrompt
            ? question.targetPrompt
            : question.prompt}
        </h3>
        {question.mode === "explore" && (
          <p className="text-sm text-muted-foreground">
            Tap to discover what&apos;s hiding!
          </p>
        )}
      </div>

      {/* Item grid */}
      <div className={gridClassName}>
        {question.items.map((item, i) => {
          const isRevealed = revealedIds.has(item.id);
          const isTarget = question.mode === "find" && item.isTarget;
          const isLastRevealed = lastRevealedId === item.id;

          return (
            <motion.button
              key={item.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              onClick={() => handleTap(item.id)}
              disabled={isRevealed || completed}
              aria-label={
                isRevealed
                  ? `${item.revealLabel} - revealed`
                  : "Hidden item - tap to reveal"
              }
              className={cn(
                "relative flex size-20 flex-col items-center justify-center rounded-2xl border-2 transition-colors sm:size-24",
                // Covered state
                !isRevealed &&
                  "cursor-pointer border-border bg-card shadow-sm hover:shadow-md active:scale-95",
                // Revealed: target in find mode
                isRevealed &&
                  isTarget &&
                  "border-emerald-400 bg-emerald-500/10",
                // Revealed: non-target in find mode
                isRevealed &&
                  question.mode === "find" &&
                  !isTarget &&
                  "border-border bg-muted/50",
                // Revealed: explore mode
                isRevealed &&
                  question.mode === "explore" &&
                  "border-border bg-card",
              )}
              style={
                !isRevealed
                  ? { borderColor: `${subjectColor}40` }
                  : undefined
              }
            >
              {isRevealed ? (
                <motion.div
                  className="flex flex-col items-center gap-1"
                  initial={
                    prefersReducedMotion ? {} : { scale: 0, rotateY: 90 }
                  }
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    duration: prefersReducedMotion ? 0 : 0.4,
                  }}
                >
                  <span className="text-3xl sm:text-4xl">
                    {item.revealEmoji}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {item.revealLabel}
                  </span>
                </motion.div>
              ) : (
                <motion.span
                  className="text-3xl sm:text-4xl"
                  whileHover={
                    prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                >
                  {item.coverEmoji}
                </motion.span>
              )}

              {/* Sparkle on reveal for targets in find mode */}
              {isRevealed && isTarget && isLastRevealed && (
                <motion.div
                  className="pointer-events-none absolute -right-1 -top-1"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
                >
                  <span className="text-lg">✨</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback for find mode: show message for non-target reveal */}
      {question.mode === "find" && lastRevealedId && !completed && (() => {
        const lastItem = question.items.find((i) => i.id === lastRevealedId);
        if (!lastItem || lastItem.isTarget) return null;
        return (
          <motion.p
            key={lastRevealedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-muted-foreground"
          >
            That&apos;s a {lastItem.revealLabel}! Keep looking!
          </motion.p>
        );
      })()}

      {/* Completion celebration */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <PartyPopper
              className="size-10"
              style={{ color: subjectColor }}
            />
          </motion.div>
          <p className="text-base font-semibold text-foreground">
            {question.mode === "find"
              ? "You found them all!"
              : "You discovered everything!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
