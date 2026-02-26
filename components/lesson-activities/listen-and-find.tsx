"use client";

// =============================================================================
// ListenAndFind - Audio-matching widget for Pre-K
// =============================================================================
// Plays a sound via TTS, then the child taps the matching image from 3-4
// options. Audio-first learning is essential at Pre-K since kids can't read.
//
// - Auto-plays audio on question load
// - Correct answer: celebration animation + spoken label + advance
// - Incorrect answer: gentle encouragement ("Listen again!") + audio replay
// - No failure states -- only positive reinforcement
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";
import { useSound } from "@/lib/activities/use-sound";
import { useAudioNarration } from "@/hooks/use-audio-narration";
import { AudioReplayButton } from "@/components/audio-replay-button";
import type { ListenAndFindContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CORRECT_DELAY_MS = 1800;
const INCORRECT_FLASH_MS = 800;
const AUTO_PLAY_DELAY_MS = 400;

// ---------------------------------------------------------------------------
// Sparkle celebration overlay
// ---------------------------------------------------------------------------

function CelebrationSparkles() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400"
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [1, 1, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 8)],
            y: [0, -(15 + i * 6)],
          }}
          transition={{
            duration: 0.7,
            delay: i * 0.06,
            ease: "easeOut",
          }}
        >
          <Sparkles className="size-4" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ListenAndFind component
// ---------------------------------------------------------------------------

export function ListenAndFind() {
  const { currentActivity, state, recordAnswer, subjectColor } = useActivity();
  const { play } = useSound();
  const { speak } = useAudioNarration({ autoPlay: false });
  const prefersReducedMotion = useReducedMotion();

  const activity = currentActivity as ListenAndFindContent;
  const question = activity.questions[state.currentQuestionIndex];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [incorrectFlashId, setIncorrectFlashId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const autoPlayedRef = useRef(false);
  const encouragementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------------------
  // Auto-play audio on question mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!question || autoPlayedRef.current) return;
    autoPlayedRef.current = true;

    const timer = setTimeout(() => {
      speak(question.spokenText);
    }, AUTO_PLAY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [question, speak]);

  // -------------------------------------------------------------------------
  // Cleanup timeouts on unmount
  // -------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (encouragementTimeoutRef.current) clearTimeout(encouragementTimeoutRef.current);
      if (correctTimeoutRef.current) clearTimeout(correctTimeoutRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Handle option selection
  // -------------------------------------------------------------------------
  const handleSelect = useCallback(
    (optionId: string) => {
      if (isLocked) return;

      play("tap");
      setSelectedId(optionId);
      const isCorrect = optionId === question.correctOptionId;

      if (isCorrect) {
        // --- Correct answer ---
        setIsLocked(true);
        setShowCelebration(true);
        recordAnswer(optionId, true);

        const correctOption = question.options.find((o) => o.id === optionId);
        if (correctOption) {
          speak(`That's right! It's a ${correctOption.label}!`);
        }

        // Auto-advance after celebration
        correctTimeoutRef.current = setTimeout(() => {
          setShowCelebration(false);
          setSelectedId(null);
          setIsLocked(false);
        }, CORRECT_DELAY_MS);
      } else {
        // --- Incorrect answer: gentle encouragement, no failure state ---
        setIncorrectFlashId(optionId);
        setShowEncouragement(true);

        // Brief highlight then reset
        flashTimeoutRef.current = setTimeout(() => {
          setIncorrectFlashId(null);
        }, INCORRECT_FLASH_MS);

        // Auto-replay the audio prompt after encouragement
        encouragementTimeoutRef.current = setTimeout(() => {
          setShowEncouragement(false);
          setSelectedId(null);
          speak(question.spokenText);
        }, INCORRECT_FLASH_MS + 200);
      }
    },
    [isLocked, play, question, recordAnswer, speak],
  );

  if (!question) return null;

  return (
    <div className="space-y-6">
      {/* Speaker / prompt area */}
      <div className="flex flex-col items-center gap-3">
        <AudioReplayButton
          text={question.spokenText}
          size="lg"
          enabled
        />
        <p className="text-center text-base font-semibold leading-relaxed text-foreground">
          {question.prompt}
        </p>
      </div>

      {/* Encouragement message (shows on incorrect selection) */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.p
            className="text-center text-sm font-medium text-amber-600"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            role="status"
          >
            Hmm, listen again!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Options grid */}
      <div
        className={cn(
          "grid gap-3",
          question.options.length <= 3
            ? "grid-cols-3"
            : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {question.options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const showCorrectHighlight = showCelebration && isSelected && isCorrectOption;
          const showIncorrectFlash = incorrectFlashId === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 16, scale: 0.9 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onClick={() => handleSelect(option.id)}
              disabled={isLocked}
              aria-label={option.label}
              className={cn(
                "relative flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200",
                "touch-manipulation",
                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50",
                // Default state
                !isSelected && !showCorrectHighlight && !showIncorrectFlash &&
                  "border-border bg-card hover:shadow-md",
                // Correct highlight
                showCorrectHighlight &&
                  "border-emerald-400 bg-emerald-500/10",
                // Incorrect flash
                showIncorrectFlash &&
                  "border-amber-300 bg-amber-500/10",
                // Selected but no feedback yet
                isSelected && !showCorrectHighlight && !showIncorrectFlash &&
                  "border-primary/50 bg-primary/5",
              )}
              style={
                showCorrectHighlight
                  ? { borderColor: "#22C55E" }
                  : undefined
              }
            >
              {/* Emoji */}
              <motion.span
                className="text-5xl leading-none"
                animate={
                  showCorrectHighlight && !prefersReducedMotion
                    ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -5, 5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {option.emoji}
              </motion.span>

              {/* Label */}
              <span className="text-sm font-medium text-foreground">
                {option.label}
              </span>

              {/* Celebration sparkles overlay */}
              <AnimatePresence>
                {showCorrectHighlight && <CelebrationSparkles />}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
