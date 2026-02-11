"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Link2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { MatchingPairsContent } from "@/lib/activities/types";
import { ActivityFeedback } from "./activity-feedback";

// ---------------------------------------------------------------------------
// MatchingPairs - Select items from left and right columns to match
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

export function MatchingPairs() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as MatchingPairsContent;
  const prefersReducedMotion = useReducedMotion();

  // Shuffled right-side items (only shuffled once on mount)
  const [shuffledRight] = useState(() =>
    shuffle(activity.pairs.map((p) => p.right)),
  );

  // Track which left item is currently selected
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  // Track matched pairs (left ID -> right ID)
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  // Track incorrect shake animation
  const [shakeId, setShakeId] = useState<string | null>(null);

  const totalPairs = activity.pairs.length;
  const allMatched = matches.size === totalPairs;

  // Check if we need to record completion
  const handleRightSelect = useCallback(
    (rightId: string) => {
      if (!selectedLeftId) return;
      if (matches.has(selectedLeftId)) return;

      // Check if already matched to a different left
      const rightAlreadyMatched = Array.from(matches.values()).includes(rightId);
      if (rightAlreadyMatched) return;

      // Find the pair
      const pair = activity.pairs.find((p) => p.left.id === selectedLeftId);
      if (!pair) return;

      const isCorrect = pair.right.id === rightId;

      if (isCorrect) {
        play("match");
        const newMatches = new Map(matches);
        newMatches.set(selectedLeftId, rightId);
        setMatches(newMatches);
        setSelectedLeftId(null);

        // If all matched, record answer
        if (newMatches.size === totalPairs) {
          recordAnswer("all_matched", true);
        }
      } else {
        // Shake animation for wrong match
        setShakeId(rightId);
        setTimeout(() => setShakeId(null), 500);
      }
    },
    [selectedLeftId, matches, activity.pairs, totalPairs, recordAnswer, play],
  );

  const handleLeftSelect = useCallback(
    (leftId: string) => {
      if (matches.has(leftId)) return; // Already matched
      play("tap");
      setSelectedLeftId((prev) => (prev === leftId ? null : leftId));
    },
    [matches, play],
  );

  // Color for matched pairs - cycle through pleasant colors
  const matchColors = [
    "#22C55E", // green
    "#3B82F6", // blue
    "#A855F7", // purple
    "#EC4899", // pink
    "#F97316", // orange
    "#14B8A6", // teal
  ];

  function getMatchColor(leftId: string): string {
    const index = Array.from(matches.keys()).indexOf(leftId);
    return matchColors[index % matchColors.length];
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {activity.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Tap one on the left, then tap its match on the right!
        </p>
      </div>

      {/* Match counter */}
      <div className="flex items-center justify-center gap-2">
        <Link2 className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {matches.size} of {totalPairs} matched
        </span>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {activity.pairs.map((pair, i) => {
            const isMatched = matches.has(pair.left.id);
            const isSelected = selectedLeftId === pair.left.id;
            const matchColor = isMatched
              ? getMatchColor(pair.left.id)
              : undefined;

            return (
              <motion.div
                key={pair.left.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, x: -10 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => handleLeftSelect(pair.left.id)}
                  disabled={isMatched || allMatched}
                  className={cn(
                    "flex min-h-[56px] w-full items-center gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 touch-manipulation",
                    isMatched &&
                      "opacity-80",
                    isSelected &&
                      !isMatched &&
                      "shadow-md",
                    !isSelected &&
                      !isMatched &&
                      "border-border bg-card hover:border-border/80 hover:shadow-sm",
                  )}
                  style={{
                    ...(isMatched
                      ? {
                          borderColor: matchColor,
                          backgroundColor: `${matchColor}15`,
                        }
                      : isSelected
                        ? {
                            borderColor: subjectColor,
                            backgroundColor: `${subjectColor}10`,
                          }
                        : undefined),
                  }}
                >
                  {pair.left.emoji && (
                    <span className="text-xl">{pair.left.emoji}</span>
                  )}
                  <span className="flex-1 text-sm font-medium">
                    {pair.left.text}
                  </span>
                  {isMatched && (
                    <CheckCircle2
                      className="size-4 shrink-0"
                      style={{ color: matchColor }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Right column (shuffled) */}
        <div className="space-y-3">
          {shuffledRight.map((right, i) => {
            const isMatched = Array.from(matches.values()).includes(right.id);
            const isShaking = shakeId === right.id;
            const matchedLeftId = Array.from(matches.entries()).find(
              ([, rId]) => rId === right.id,
            )?.[0];
            const matchColor = matchedLeftId
              ? getMatchColor(matchedLeftId)
              : undefined;

            return (
              <motion.div
                key={right.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, x: 10 }
                }
                animate={{
                  opacity: 1,
                  x: isShaking ? [0, -5, 5, -5, 5, 0] : 0,
                }}
                transition={
                  isShaking
                    ? { duration: 0.4 }
                    : { delay: i * 0.06 }
                }
              >
                <button
                  onClick={() => handleRightSelect(right.id)}
                  disabled={isMatched || !selectedLeftId || allMatched}
                  className={cn(
                    "flex min-h-[56px] w-full items-center gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 touch-manipulation",
                    isMatched && "opacity-80",
                    !isMatched &&
                      selectedLeftId &&
                      "border-border bg-card hover:border-border/80 hover:shadow-sm cursor-pointer",
                    !isMatched &&
                      !selectedLeftId &&
                      "border-border bg-card opacity-60",
                  )}
                  style={
                    isMatched
                      ? {
                          borderColor: matchColor,
                          backgroundColor: `${matchColor}15`,
                        }
                      : undefined
                  }
                >
                  {right.emoji && (
                    <span className="text-xl">{right.emoji}</span>
                  )}
                  <span className="flex-1 text-sm font-medium">
                    {right.text}
                  </span>
                  {isMatched && (
                    <CheckCircle2
                      className="size-4 shrink-0"
                      style={{ color: matchColor }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feedback when all matched */}
      <ActivityFeedback hint={activity.hint} autoAdvanceDelay={2000} />
    </div>
  );
}
