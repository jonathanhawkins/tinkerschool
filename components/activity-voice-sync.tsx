"use client";

/**
 * Bridges the activity system's real-time feedback into the voiceBridge so
 * the global Chip FAB can show contextual encouragement messages.
 *
 * Renders nothing -- purely a side-effect component. Must be placed inside
 * an ActivityProvider so it can subscribe to activity state via useActivity().
 */

import { useCallback, useEffect, useRef } from "react";

import { useActivity } from "@/lib/activities/activity-context";
import type { VoiceActivityFeedback, ActivityFeedbackType } from "@/lib/hume/types";
import { voiceBridge } from "@/lib/hume/voice-bridge";
import type { DifficultyLevel } from "@/lib/activities/adaptive-difficulty";

// ---------------------------------------------------------------------------
// Message banks -- migrated from chip-activity-bubble.tsx
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
  "Need a hint? Ask me!",
  "I have a hint for you!",
  "Ask me for a little help!",
  "Want a clue? I've got one!",
  "I can give you a hint!",
  "Stuck? I can help!",
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

/** Count incorrect attempts for the current question */
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
// Monotonically increasing ID for deduplication
// ---------------------------------------------------------------------------

let feedbackIdCounter = 0;

function emitFeedback(
  text: string,
  type: ActivityFeedbackType,
  durationMs: number,
  difficultyLabel?: string,
): void {
  feedbackIdCounter += 1;
  const feedback: VoiceActivityFeedback = {
    text,
    type,
    durationMs,
    difficultyLabel,
    id: feedbackIdCounter,
  };
  voiceBridge.setActivityFeedback(feedback);
}

function clearFeedback(): void {
  voiceBridge.setActivityFeedback(null);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ActivityVoiceSyncProps {
  /** Difficulty level for badge display */
  difficultyLevel?: DifficultyLevel;
  /** Encouragement message from adaptive difficulty */
  encouragementMessage?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActivityVoiceSync({
  difficultyLevel,
  encouragementMessage,
}: ActivityVoiceSyncProps) {
  const { state } = useActivity();

  // Refs for tracking state changes to avoid duplicate triggers
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFeedbackRef = useRef<string>("none");
  const lastQuestionRef = useRef<string>(
    `${state.currentActivityIndex}-${state.currentQuestionIndex}`,
  );
  const hasShownWelcomeRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to schedule auto-clear of feedback
  const scheduleAutoClear = useCallback((durationMs: number) => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }
    dismissTimerRef.current = setTimeout(() => {
      clearFeedback();
      dismissTimerRef.current = null;
    }, durationMs);
  }, []);

  // ---------------------------------------------------------------------------
  // Initial encouragement message (from adaptive difficulty)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (hasShownWelcomeRef.current) return;
    hasShownWelcomeRef.current = true;

    // Short delay so the lesson UI renders first
    const timer = setTimeout(() => {
      const diffLabel =
        difficultyLevel === "challenge"
          ? "Challenge Mode"
          : difficultyLevel === "supportive"
            ? "Extra hints enabled"
            : undefined;

      if (encouragementMessage) {
        emitFeedback(encouragementMessage, "encouragement", 5000, diffLabel);
        scheduleAutoClear(5000);
      } else {
        emitFeedback(pickRandom(WELCOME_MESSAGES), "welcome", 4000, diffLabel);
        scheduleAutoClear(4000);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [encouragementMessage, difficultyLevel, scheduleAutoClear]);

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
        const msg = pickRandom(STREAK_MESSAGES);
        emitFeedback(msg, "streak", 3000);
        scheduleAutoClear(3000);
      } else {
        const msg = pickRandom(CORRECT_MESSAGES);
        emitFeedback(msg, "correct", 2500);
        scheduleAutoClear(2500);
      }
    } else if (state.feedbackType === "incorrect") {
      const recentIncorrect = countRecentIncorrect(state.metrics.answers);
      if (recentIncorrect >= 2) {
        const msg = pickRandom(INCORRECT_HINT_MESSAGES);
        emitFeedback(msg, "incorrect_hint", 5000);
        scheduleAutoClear(5000);
      } else {
        const msg = pickRandom(INCORRECT_FIRST_MESSAGES);
        emitFeedback(msg, "incorrect_first", 3000);
        scheduleAutoClear(3000);
      }
    }
  }, [
    state.feedbackType,
    state.showingFeedback,
    state.metrics.answers,
    scheduleAutoClear,
  ]);

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
      // Only show if no feedback is currently active
      const current = voiceBridge.activityFeedback;
      if (current) return;

      const msg = pickRandom(IDLE_MESSAGES);
      emitFeedback(msg, "idle", 4000);
      scheduleAutoClear(4000);
    }, 10000);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [questionKey, state.showingFeedback, state.isComplete, scheduleAutoClear]);

  // ---------------------------------------------------------------------------
  // Reset when question changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (questionKey !== lastQuestionRef.current) {
      lastQuestionRef.current = questionKey;
    }
  }, [questionKey]);

  // ---------------------------------------------------------------------------
  // Clean up on unmount -- clear activity feedback from the bridge
  // ---------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      clearFeedback();
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // This component renders nothing — purely a side-effect bridge
  return null;
}
