"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import type { EmotionPickerContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Gentle encouragement messages for non-matching selections (no "wrong")
// ---------------------------------------------------------------------------

const ENCOURAGEMENT_MESSAGES = [
  "That's a good thought! Let's think again...",
  "Nice try! What else might they feel?",
  "Hmm, could there be a different feeling?",
  "Good thinking! Try another one!",
  "That's interesting! What about another feeling?",
];

const CELEBRATION_MESSAGES = [
  "You got it!",
  "Great job!",
  "That's right!",
  "Wonderful!",
  "You're so good at this!",
];

function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ---------------------------------------------------------------------------
// Sparkle particle for celebration
// ---------------------------------------------------------------------------

function CelebrationSparkles() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const sparkles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 80 - 40,
    rotate: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute left-1/2 top-1/2 text-lg"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: s.x,
            y: s.y,
            scale: s.scale,
            rotate: s.rotate,
          }}
          transition={{ duration: 0.8, delay: s.delay, ease: "easeOut" }}
        >
          {["✨", "⭐", "🌟"][s.id % 3]}
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmotionPicker
// ---------------------------------------------------------------------------

export function EmotionPicker() {
  const { currentActivity, state, recordAnswer, nextQuestion } = useActivity();
  const { play } = useSound();
  const activity = currentActivity as EmotionPickerContent;
  const question = activity.questions[state.currentQuestionIndex];
  const prefersReducedMotion = useReducedMotion();

  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementText, setEncouragementText] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");

  const questionKey = question?.id ?? state.currentQuestionIndex;

  const handleSelectEmotion = useCallback(
    (emotion: string) => {
      // Don't allow selection during celebration
      if (showCelebration) return;

      play("tap");
      setSelectedEmotion(emotion);

      const isValid = question.validEmotions.includes(emotion);

      if (isValid) {
        // Celebration! Record correct answer and auto-advance
        setShowEncouragement(false);
        setShowCelebration(true);
        setCelebrationText(randomMessage(CELEBRATION_MESSAGES));
        play("correct");
        recordAnswer(emotion, true);

        // Auto-advance after celebration delay
        setTimeout(() => {
          nextQuestion();
        }, 1800);
      } else {
        // Gentle encouragement, no "wrong" feedback
        setShowCelebration(false);
        setShowEncouragement(true);
        setEncouragementText(randomMessage(ENCOURAGEMENT_MESSAGES));
        // Record as incorrect but no harsh feedback
        recordAnswer(emotion, false);

        // Dismiss encouragement after a moment so the child can try again
        setTimeout(() => {
          setShowEncouragement(false);
          setSelectedEmotion(null);
        }, 2000);
      }
    },
    [question, showCelebration, play, recordAnswer, nextQuestion],
  );

  if (!question) return null;

  return (
    <div className="space-y-6" key={questionKey}>
      {/* Scenario illustration + text */}
      <div className="space-y-3 text-center">
        {question.scenarioEmoji && (
          <motion.div
            className="text-7xl sm:text-8xl"
            initial={prefersReducedMotion ? {} : { scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            role="img"
            aria-label="scenario illustration"
          >
            {question.scenarioEmoji}
          </motion.div>
        )}
        <motion.p
          className="mx-auto max-w-md text-lg font-semibold leading-relaxed text-foreground sm:text-xl"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {question.scenario}
        </motion.p>
        <p className="text-sm text-muted-foreground">
          How does this make you feel?
        </p>
      </div>

      {/* Emotion face buttons */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        role="group"
        aria-label="emotion choices"
      >
        {question.options.map((option, i) => {
          const isSelected = selectedEmotion === option.emotion;
          const isValidChoice = question.validEmotions.includes(option.emotion);
          const showValidHighlight = showCelebration && isSelected && isValidChoice;

          return (
            <motion.button
              key={option.emotion}
              type="button"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 16, scale: 0.9 }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: showValidHighlight ? 1.1 : 1,
              }}
              transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onClick={() => handleSelectEmotion(option.emotion)}
              disabled={showCelebration}
              aria-label={option.label}
              className={cn(
                "relative flex min-h-[72px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 transition-colors duration-200 sm:min-h-[88px] sm:min-w-[88px] sm:p-4",
                "touch-manipulation",
                // Default state
                !isSelected && "border-border bg-card hover:border-border/80 hover:shadow-md",
                // Selected + valid (celebration)
                showValidHighlight && "border-emerald-400 bg-emerald-500/10 shadow-lg",
                // Selected but not valid (gentle highlight)
                isSelected && !showValidHighlight && showEncouragement && "border-amber-300 bg-amber-500/5",
                // Disabled during celebration
                showCelebration && !showValidHighlight && "opacity-60",
              )}
            >
              {/* Celebration sparkles on the selected valid option */}
              {showValidHighlight && <CelebrationSparkles />}

              {/* Emoji face */}
              <span className="text-4xl sm:text-5xl" aria-hidden="true">
                {option.emoji}
              </span>

              {/* Label */}
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Encouragement message (gentle, not "wrong") */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl bg-amber-500/10 p-4 text-center"
            role="status"
            data-testid="encouragement-message"
          >
            <p className="text-sm font-semibold text-amber-700">
              {encouragementText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration message */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl bg-emerald-500/10 p-4 text-center"
            role="status"
            data-testid="celebration-message"
          >
            <p className="text-base font-bold text-emerald-700">
              {celebrationText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
