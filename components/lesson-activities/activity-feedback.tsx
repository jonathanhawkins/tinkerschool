"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";

// ---------------------------------------------------------------------------
// Kid-friendly encouragement messages
// ---------------------------------------------------------------------------

const CORRECT_MESSAGES = [
  "Awesome job!",
  "You got it!",
  "Super smart!",
  "Way to go!",
  "Nailed it!",
  "High five!",
  "Brilliant!",
  "Perfect!",
];

const INCORRECT_MESSAGES = [
  "Almost! Try again!",
  "Not quite, keep going!",
  "Good try! One more time!",
  "So close! You can do it!",
  "Oops! Give it another shot!",
];

function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ---------------------------------------------------------------------------
// ActivityFeedback
// ---------------------------------------------------------------------------

interface ActivityFeedbackProps {
  /** Optional hint to show on incorrect answers */
  hint?: string;
  /** Whether to auto-advance after correct answer */
  autoAdvance?: boolean;
  /** Delay before auto-advance in ms */
  autoAdvanceDelay?: number;
}

export function ActivityFeedback({
  hint,
  autoAdvance = true,
  autoAdvanceDelay = 1500,
}: ActivityFeedbackProps) {
  const { state, nextQuestion, dismissFeedback, useHint: markHintUsed } = useActivity();
  const prefersReducedMotion = useReducedMotion();
  const { play } = useSound();
  const lastPlayedRef = useRef<string | null>(null);

  const isCorrect = state.feedbackType === "correct";
  const isIncorrect = state.feedbackType === "incorrect";

  // Play sound on feedback change
  useEffect(() => {
    if (!state.showingFeedback) {
      lastPlayedRef.current = null;
      return;
    }
    const key = `${state.feedbackType}-${state.currentQuestionIndex}`;
    if (lastPlayedRef.current === key) return;
    lastPlayedRef.current = key;

    if (isCorrect) {
      play("correct");
    } else if (isIncorrect) {
      play("incorrect");
    }
  }, [state.showingFeedback, state.feedbackType, state.currentQuestionIndex, isCorrect, isIncorrect, play]);

  // Auto-advance on correct answer
  useEffect(() => {
    if (isCorrect && autoAdvance) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, autoAdvance, autoAdvanceDelay, nextQuestion]);

  // If showing hint, mark it as used
  useEffect(() => {
    if (isIncorrect && hint) {
      markHintUsed();
    }
  }, [isIncorrect, hint, markHintUsed]);

  if (!state.showingFeedback) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "mt-4 flex items-start gap-3 rounded-2xl p-4",
          isCorrect && "bg-emerald-500/10 text-emerald-700",
          isIncorrect && "bg-amber-500/10 text-amber-700",
        )}
      >
        {/* Icon */}
        {isCorrect ? (
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <CheckCircle2 className="size-6 shrink-0 text-emerald-500" />
          </motion.div>
        ) : (
          <XCircle className="size-6 shrink-0 text-amber-500" />
        )}

        {/* Message */}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold">
            {isCorrect
              ? randomMessage(CORRECT_MESSAGES)
              : randomMessage(INCORRECT_MESSAGES)}
          </p>

          {/* Hint on incorrect */}
          {isIncorrect && hint && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 p-2">
              <Lightbulb className="size-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-600">{hint}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {isIncorrect && (
          <Button
            onClick={dismissFeedback}
            size="sm"
            variant="outline"
            className="shrink-0 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-500/10"
          >
            Try Again
          </Button>
        )}

        {isCorrect && !autoAdvance && (
          <Button
            onClick={nextQuestion}
            size="sm"
            className="shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Next
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
