"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import { useActivity } from "@/lib/activities/activity-context";

// ---------------------------------------------------------------------------
// Message banks - at least 5-8 variants per category to avoid repetition
// ---------------------------------------------------------------------------

const WELCOME_MESSAGES = [
  "Let's do this!",
  "I believe in you!",
  "Ready to learn? Me too!",
  "You're going to do great!",
  "This is going to be fun!",
  "I'm here to help!",
  "Let's go, superstar!",
  "Adventure time!",
];

const CORRECT_MESSAGES = [
  "Amazing!",
  "You're on fire!",
  "Super smart!",
  "Wow, nailed it!",
  "Yes! You got it!",
  "Incredible!",
  "Woohoo!",
  "So proud of you!",
];

const INCORRECT_FIRST_MESSAGES = [
  "Almost! Try again!",
  "So close! One more try!",
  "Good thinking! Try again!",
  "Not quite, but keep going!",
  "Hmm, try another one!",
  "You're close, I can feel it!",
];

const INCORRECT_HINT_MESSAGES = [
  "Need a hint? Tap me!",
  "I have a hint for you!",
  "Tap me for a little help!",
  "Want a clue? I've got one!",
  "I can give you a hint!",
  "Stuck? Tap me for help!",
];

const STREAK_MESSAGES = [
  "You're unstoppable!",
  "Streak! You're a genius!",
  "On a roll!",
  "Nothing can stop you!",
  "You're a learning machine!",
  "Hat trick and beyond!",
  "Wow, keep it going!",
];

const IDLE_MESSAGES = [
  "Take your time, you got this!",
  "No rush, I'm right here!",
  "Think it through, I believe in you!",
  "You're doing great, take your time!",
  "I'll wait, no worries!",
  "Deep breath, you've got this!",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BubbleMessageType =
  | "welcome"
  | "correct"
  | "incorrect_first"
  | "incorrect_hint"
  | "streak"
  | "idle";

interface BubbleMessage {
  text: string;
  type: BubbleMessageType;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom(messages: readonly string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

/** Count consecutive correct answers from the end of the answers array */
function countCurrentStreak(
  answers: ReadonlyArray<{ isCorrect: boolean }>,
): number {
  let streak = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Count incorrect attempts for the current question based on the most recent answers */
function countRecentIncorrect(
  answers: ReadonlyArray<{ isCorrect: boolean }>,
): number {
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (!answers[i].isCorrect) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// Idle animation keyframes for the floating bob
// ---------------------------------------------------------------------------

const bobVariants = {
  idle: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const bobVariantsReduced = {
  idle: {
    y: 0,
    transition: { duration: 0 },
  },
};

// ---------------------------------------------------------------------------
// ChipActivityBubble
// ---------------------------------------------------------------------------

export function ChipActivityBubble() {
  const { state } = useActivity();
  const prefersReducedMotion = useReducedMotion();

  const [currentMessage, setCurrentMessage] = useState<BubbleMessage | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(true);
  const [showHintRequest, setShowHintRequest] = useState(false);

  // Refs for tracking state changes to avoid duplicate triggers
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFeedbackRef = useRef<string>("none");
  const lastQuestionRef = useRef<string>(
    `${state.currentActivityIndex}-${state.currentQuestionIndex}`,
  );
  const hasShownWelcomeRef = useRef(false);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------------------------------------------------------------
  // Auto-dismiss message after a delay
  // ---------------------------------------------------------------------------
  const showMessage = useCallback(
    (msg: BubbleMessage, durationMs: number = 3500) => {
      setCurrentMessage(msg);
      setIsVisible(true);

      // Clear any existing dismiss timer
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }

      messageTimerRef.current = setTimeout(() => {
        setCurrentMessage(null);
        messageTimerRef.current = null;
      }, durationMs);
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Welcome message on first mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (hasShownWelcomeRef.current) return;
    hasShownWelcomeRef.current = true;

    // Short delay so the activity renders first
    const timer = setTimeout(() => {
      showMessage({ text: pickRandom(WELCOME_MESSAGES), type: "welcome" }, 4000);
    }, 800);

    return () => clearTimeout(timer);
  }, [showMessage]);

  // ---------------------------------------------------------------------------
  // React to answer feedback
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const feedbackKey = `${state.feedbackType}-${state.metrics.answers.length}`;

    // Skip if feedback hasn't changed or is "none"
    if (feedbackKey === lastFeedbackRef.current) return;
    lastFeedbackRef.current = feedbackKey;

    if (state.feedbackType === "none" || !state.showingFeedback) return;

    if (state.feedbackType === "correct") {
      // Check for streak
      const streak = countCurrentStreak(state.metrics.answers);
      if (streak >= 3) {
        showMessage(
          { text: pickRandom(STREAK_MESSAGES), type: "streak" },
          3000,
        );
      } else {
        showMessage(
          { text: pickRandom(CORRECT_MESSAGES), type: "correct" },
          2500,
        );
      }
    } else if (state.feedbackType === "incorrect") {
      const recentIncorrect = countRecentIncorrect(state.metrics.answers);
      if (recentIncorrect >= 2) {
        showMessage(
          {
            text: pickRandom(INCORRECT_HINT_MESSAGES),
            type: "incorrect_hint",
          },
          5000,
        );
        setShowHintRequest(true);
      } else {
        showMessage(
          {
            text: pickRandom(INCORRECT_FIRST_MESSAGES),
            type: "incorrect_first",
          },
          3000,
        );
        setShowHintRequest(false);
      }
    }
  }, [state.feedbackType, state.showingFeedback, state.metrics.answers, showMessage]);

  // ---------------------------------------------------------------------------
  // Idle nudge: show message if no interaction for 10+ seconds
  // ---------------------------------------------------------------------------
  const questionKey = `${state.currentActivityIndex}-${state.currentQuestionIndex}`;

  useEffect(() => {
    // Reset idle timer when question changes or feedback is shown
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Only set idle timer if not showing feedback and not complete
    if (state.showingFeedback || state.isComplete) return;

    idleTimerRef.current = setTimeout(() => {
      // Only show if no message is currently displayed
      setCurrentMessage((prev) => {
        if (prev) return prev;
        return { text: pickRandom(IDLE_MESSAGES), type: "idle" };
      });
      setIsVisible(true);

      // Auto-dismiss idle message
      messageTimerRef.current = setTimeout(() => {
        setCurrentMessage(null);
      }, 4000);
    }, 10000);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [questionKey, state.showingFeedback, state.isComplete]);

  // ---------------------------------------------------------------------------
  // Reset hint request when question changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (questionKey !== lastQuestionRef.current) {
      lastQuestionRef.current = questionKey;
      setShowHintRequest(false);
    }
  }, [questionKey]);

  // ---------------------------------------------------------------------------
  // Derive speech bubble color from message type
  // (must be above early returns to respect rules of hooks)
  // ---------------------------------------------------------------------------
  const bubbleBgClass = useMemo(() => {
    if (!currentMessage) return "bg-primary/10";
    switch (currentMessage.type) {
      case "correct":
      case "streak":
        return "bg-emerald-500/10";
      case "incorrect_first":
      case "incorrect_hint":
        return "bg-amber-500/10";
      case "idle":
        return "bg-blue-500/10";
      case "welcome":
      default:
        return "bg-primary/10";
    }
  }, [currentMessage]);

  const bubbleBorderClass = useMemo(() => {
    if (!currentMessage) return "border-primary/30";
    switch (currentMessage.type) {
      case "correct":
      case "streak":
        return "border-emerald-500/30";
      case "incorrect_first":
      case "incorrect_hint":
        return "border-amber-500/30";
      case "idle":
        return "border-blue-500/30";
      case "welcome":
      default:
        return "border-primary/30";
    }
  }, [currentMessage]);

  // ---------------------------------------------------------------------------
  // Hide when activity is complete (completion screen handles celebration)
  // ---------------------------------------------------------------------------
  if (state.isComplete) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Tap handler: dismiss message or trigger hint
  // ---------------------------------------------------------------------------
  const handleTap = () => {
    if (showHintRequest && currentMessage?.type === "incorrect_hint") {
      // The hint is handled by the ActivityFeedback component.
      // Dismiss our message so it doesn't compete.
      setShowHintRequest(false);
      setCurrentMessage(null);
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
      return;
    }

    // Toggle visibility / dismiss current message
    if (currentMessage) {
      setCurrentMessage(null);
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    } else {
      setIsVisible((prev) => !prev);
    }
  };

  return (
    <div
      className="flex items-end justify-end gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {currentMessage && isVisible && (
          <motion.div
            key={currentMessage.text}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 10, scale: 0.9 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 10, scale: 0.9 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "max-w-48 rounded-2xl rounded-br-md border px-3 py-2 shadow-sm",
              bubbleBgClass,
              bubbleBorderClass,
            )}
          >
            <p className="text-sm font-medium leading-snug text-foreground">
              {currentMessage.text}
            </p>

            {/* Hint icon for hint-available state */}
            {showHintRequest && currentMessage.type === "incorrect_hint" && (
              <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                <Lightbulb className="size-3" />
                <span>Tap for a hint</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chip avatar */}
      <motion.button
        onClick={handleTap}
        variants={prefersReducedMotion ? bobVariantsReduced : bobVariants}
        animate="idle"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
        className={cn(
          "relative flex size-12 shrink-0 items-center justify-center rounded-full shadow-md",
          "bg-primary/10 ring-2 ring-primary/30",
          "transition-shadow duration-200",
          "hover:shadow-lg hover:ring-primary/50",
          "focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
        )}
        aria-label={
          currentMessage
            ? "Dismiss Chip's message"
            : "Chip, your learning buddy"
        }
      >
        <Image
          src="/images/chip.png"
          alt="Chip"
          width={48}
          height={48}
          className="size-10 rounded-full object-cover"
        />

        {/* Pulse dot when Chip has something to say (hint available) */}
        {showHintRequest && !currentMessage && (
          <span
            className={cn(
              "absolute -top-0.5 -left-0.5 size-3 rounded-full border-2 border-background bg-amber-500",
              "animate-pulse motion-reduce:animate-none",
            )}
          />
        )}
      </motion.button>
    </div>
  );
}
