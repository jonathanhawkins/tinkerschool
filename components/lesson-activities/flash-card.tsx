"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { FlashCardContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a card face that may be a flat string or a {text, emoji} object. */
function normalizeCardFace(
  face: string | { text: string; emoji?: string },
): { text: string; emoji?: string } {
  if (typeof face === "string") {
    return { text: face };
  }
  return face;
}

/**
 * Determines if a hex color is "light" (should use dark text) or "dark"
 * (should use white text). Uses relative luminance.
 */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.6;
}

// ---------------------------------------------------------------------------
// FlashCard - Flip to reveal, then move on
// ---------------------------------------------------------------------------

export function FlashCard() {
  const { currentActivity, state, recordAnswer, nextQuestion, subjectColor } =
    useActivity();
  const { play } = useSound();
  const activity = currentActivity as FlashCardContent;
  const rawCard = activity.cards[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [isFlipped, setIsFlipped] = useState(false);

  const questionKey = rawCard?.id ?? state.currentQuestionIndex;

  if (!rawCard) return null;

  // Normalize card faces: seed data may store front/back as flat strings
  // (e.g. "RED") instead of the expected {text, emoji} objects.
  const front = normalizeCardFace(rawCard.front as string | { text: string; emoji?: string });
  const back = normalizeCardFace(rawCard.back as string | { text: string; emoji?: string });
  const cardColor = rawCard.color ?? subjectColor;
  const useDarkText = isLightColor(cardColor);

  function handleFlip() {
    play("flip");
    setIsFlipped((prev) => !prev);
  }

  function handleNext() {
    // Record as seen/correct — flash cards are exposure-based learning
    recordAnswer("seen", true);
    setIsFlipped(false);
    nextQuestion();
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
          className="relative h-64 w-full max-w-sm cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }
          }
          aria-label={isFlipped ? "Card back - tap to flip" : "Card front - tap to flip"}
        >
          {/* ---- FRONT: Bold, colorful, eye-catching ---- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: cardColor,
              backfaceVisibility: "hidden",
            }}
          >
            {front.emoji && (
              <span className="text-6xl drop-shadow-sm">{front.emoji}</span>
            )}
            <span
              className={cn(
                "text-3xl font-bold tracking-wide drop-shadow-sm",
                useDarkText ? "text-gray-900" : "text-white",
              )}
            >
              {front.text}
            </span>
            <span
              className={cn(
                "mt-1 text-xs font-medium",
                useDarkText ? "text-gray-700/70" : "text-white/70",
              )}
            >
              Tap to flip
            </span>
          </div>

          {/* ---- BACK: Clean, readable, colored accent ---- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-3 bg-white p-6 shadow-lg dark:bg-gray-900"
            style={{
              borderColor: cardColor,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {back.emoji && (
              <span className="text-5xl">{back.emoji}</span>
            )}
            <p
              className="text-center text-base font-medium leading-relaxed"
              style={{ color: cardColor }}
            >
              {back.text}
            </p>
            <span className="mt-1 text-xs text-muted-foreground">
              Tap to flip back
            </span>
          </div>
        </motion.button>
      </div>

      {/* Next button (shown after flipping) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleNext}
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
