"use client";

import { useState, useEffect, useRef } from "react";
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

interface FlashCardProps {
  /** Pre-K mode: larger cards, bigger text, auto-advance after 3s */
  isPreK?: boolean;
}

export function FlashCard({ isPreK = false }: FlashCardProps) {
  const { currentActivity, state, recordAnswer, nextQuestion, subjectColor } =
    useActivity();
  const { play } = useSound();
  const activity = currentActivity as FlashCardContent;
  const rawCard = activity.cards[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [isFlipped, setIsFlipped] = useState(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questionKey = rawCard?.id ?? state.currentQuestionIndex;

  // Pre-K: auto-advance 3 seconds after flipping
  useEffect(() => {
    if (!isPreK || !isFlipped) return;
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, 3000);
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreK, isFlipped, questionKey]);

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
          className={cn(
            "relative w-full max-w-sm cursor-pointer",
            isPreK ? "h-80" : "h-64",
          )}
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
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl shadow-lg",
              isPreK ? "p-8" : "p-6",
            )}
            style={{
              backgroundColor: cardColor,
              backfaceVisibility: "hidden",
            }}
          >
            {front.emoji && (
              <span className={cn(
                "drop-shadow-sm",
                isPreK ? "text-7xl" : "text-6xl",
              )}>
                {front.emoji}
              </span>
            )}
            <span
              className={cn(
                "font-bold tracking-wide drop-shadow-sm",
                isPreK ? "text-4xl" : "text-3xl",
                useDarkText ? "text-gray-900" : "text-white",
              )}
            >
              {front.text}
            </span>
            <span
              className={cn(
                "mt-1 font-medium",
                isPreK ? "text-sm" : "text-xs",
                useDarkText ? "text-gray-700/70" : "text-white/70",
              )}
            >
              Tap to flip
            </span>
          </div>

          {/* ---- BACK: Clean, readable, colored accent ---- */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-3 bg-white shadow-lg dark:bg-gray-900",
              isPreK ? "p-8" : "p-6",
            )}
            style={{
              borderColor: cardColor,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {back.emoji && (
              <span className={cn(isPreK ? "text-6xl" : "text-5xl")}>
                {back.emoji}
              </span>
            )}
            <p
              className={cn(
                "text-center font-medium leading-relaxed",
                isPreK ? "text-xl" : "text-base",
              )}
              style={{ color: cardColor }}
            >
              {back.text}
            </p>
            <span className={cn(
              "mt-1 text-muted-foreground",
              isPreK ? "text-sm" : "text-xs",
            )}>
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
          className="flex flex-col items-center gap-2"
        >
          {isPreK && (
            <p className="text-sm text-muted-foreground">
              Auto-advancing in a moment...
            </p>
          )}
          <Button
            onClick={handleNext}
            size="lg"
            className={cn("rounded-xl", isPreK && "px-10")}
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
