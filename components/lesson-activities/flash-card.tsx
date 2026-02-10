"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { FlashCardContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// FlashCard - Flip to reveal, self-assess "Got it" / "Still learning"
// ---------------------------------------------------------------------------

export function FlashCard() {
  const { currentActivity, state, recordAnswer, nextQuestion, subjectColor } =
    useActivity();
  const { play } = useSound();
  const activity = currentActivity as FlashCardContent;
  const card = activity.cards[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAssessed, setHasAssessed] = useState(false);

  const questionKey = card?.id ?? state.currentQuestionIndex;

  if (!card) return null;

  function handleFlip() {
    play("flip");
    setIsFlipped((prev) => !prev);
  }

  function handleAssess(gotIt: boolean) {
    setHasAssessed(true);
    recordAnswer(gotIt ? "got_it" : "still_learning", gotIt);
  }

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Instructions */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {activity.prompt}
        </h3>
        <p className="text-sm text-muted-foreground">
          Tap the card to flip it!
        </p>
      </div>

      {/* Card */}
      <div className="flex justify-center" style={{ perspective: "1000px" }}>
        <motion.button
          onClick={handleFlip}
          className="relative h-56 w-full max-w-sm cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }
          }
          aria-label={isFlipped ? "Card back - tap to flip" : "Card front - tap to flip"}
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6",
              "backface-hidden",
            )}
            style={{
              borderColor: subjectColor,
              backgroundColor: `${subjectColor}08`,
              backfaceVisibility: "hidden",
            }}
          >
            {card.front.emoji && (
              <span className="text-5xl">{card.front.emoji}</span>
            )}
            <span className="text-xl font-bold text-foreground">
              {card.front.text}
            </span>
            <span className="text-xs text-muted-foreground">
              Tap to flip
            </span>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6",
            )}
            style={{
              borderColor: subjectColor,
              backgroundColor: `${subjectColor}15`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {card.back.emoji && (
              <span className="text-5xl">{card.back.emoji}</span>
            )}
            <span className="text-xl font-bold" style={{ color: subjectColor }}>
              {card.back.text}
            </span>
            <span className="text-xs text-muted-foreground">
              Tap to flip back
            </span>
          </div>
        </motion.button>
      </div>

      {/* Self-assessment buttons (only show when flipped) */}
      {isFlipped && !hasAssessed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3"
        >
          <Button
            onClick={() => handleAssess(true)}
            size="lg"
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <ThumbsUp className="size-4" />
            Got it!
          </Button>
          <Button
            onClick={() => handleAssess(false)}
            variant="outline"
            size="lg"
            className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-500/10"
          >
            <ThumbsDown className="size-4" />
            Still learning
          </Button>
        </motion.div>
      )}

      {/* Next button after assessment */}
      {hasAssessed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => {
              setIsFlipped(false);
              setHasAssessed(false);
              nextQuestion();
            }}
            size="lg"
            className="rounded-xl"
            style={{ backgroundColor: subjectColor }}
          >
            <ArrowRight className="size-4" />
            Next Card
          </Button>
        </motion.div>
      )}
    </div>
  );
}
