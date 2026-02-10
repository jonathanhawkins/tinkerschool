"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ActivityContent,
  ActivitySessionMetrics,
  ActivityState,
  AnswerEvent,
  LessonActivityConfig,
} from "./types";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface ActivityContextValue {
  /** The full activity config for this lesson */
  config: LessonActivityConfig;
  /** Current runtime state */
  state: ActivityState;
  /** The current activity content being rendered */
  currentActivity: ActivityContent;
  /** Total number of questions across all activities */
  totalQuestions: number;
  /** Number of questions completed so far */
  questionsCompleted: number;
  /** Record an answer for the current question */
  recordAnswer: (givenAnswer: string, isCorrect: boolean) => void;
  /** Record that a hint was used */
  useHint: () => void;
  /** Advance to the next question (after feedback) */
  nextQuestion: () => void;
  /** Dismiss feedback overlay */
  dismissFeedback: () => void;
  /** Get the subject color for theming */
  subjectColor: string;
  /** Lesson ID for server actions */
  lessonId: string;
  /** Profile ID for server actions */
  profileId: string;
  /** Next lesson in sequence (for navigation after completion) */
  nextLessonId?: string;
  nextLessonTitle?: string;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useActivity(): ActivityContextValue {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count total questions across all activities */
function countTotalQuestions(activities: ActivityContent[]): number {
  let total = 0;
  for (const activity of activities) {
    switch (activity.type) {
      case "multiple_choice":
        total += activity.questions.length;
        break;
      case "counting":
        total += activity.questions.length;
        break;
      case "matching_pairs":
        total += 1; // matching is one big question
        break;
      case "sequence_order":
        total += activity.questions.length;
        break;
      case "flash_card":
        total += activity.cards.length;
        break;
      case "fill_in_blank":
        total += activity.questions.length;
        break;
    }
  }
  return total;
}

/** Get the number of questions in a specific activity */
function questionsInActivity(activity: ActivityContent): number {
  switch (activity.type) {
    case "multiple_choice":
      return activity.questions.length;
    case "counting":
      return activity.questions.length;
    case "matching_pairs":
      return 1;
    case "sequence_order":
      return activity.questions.length;
    case "flash_card":
      return activity.cards.length;
    case "fill_in_blank":
      return activity.questions.length;
    case "number_bond":
      return activity.questions.length;
    case "ten_frame":
      return activity.questions.length;
    case "number_line":
      return activity.questions.length;
    case "rekenrek":
      return activity.questions.length;
  }
}

function createInitialMetrics(): ActivitySessionMetrics {
  return {
    totalQuestions: 0,
    correctFirstTry: 0,
    correctTotal: 0,
    totalTimeMs: 0,
    hintsUsed: 0,
    score: 0,
    answers: [],
  };
}

function createInitialState(): ActivityState {
  return {
    currentActivityIndex: 0,
    currentQuestionIndex: 0,
    isComplete: false,
    showingFeedback: false,
    feedbackType: "none",
    metrics: createInitialMetrics(),
    hasPassed: false,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ActivityProviderProps {
  config: LessonActivityConfig;
  lessonId: string;
  profileId: string;
  subjectColor: string;
  children: React.ReactNode;
  /** Called when the activity is fully completed */
  onComplete?: (metrics: ActivitySessionMetrics) => void;
  /** Next lesson in sequence (for navigation after completion) */
  nextLessonId?: string;
  nextLessonTitle?: string;
}

export function ActivityProvider({
  config,
  lessonId,
  profileId,
  subjectColor,
  children,
  onComplete,
  nextLessonId,
  nextLessonTitle,
}: ActivityProviderProps) {
  const [state, setState] = useState<ActivityState>(createInitialState);

  // Track time per question
  const questionStartTime = useRef<number>(Date.now());
  // Track attempt count per question
  const attemptCount = useRef<number>(1);
  // Track hint usage for current question
  const hintUsedForQuestion = useRef<boolean>(false);

  // Reset timers when question changes
  useEffect(() => {
    questionStartTime.current = Date.now();
    attemptCount.current = 1;
    hintUsedForQuestion.current = false;
  }, [state.currentActivityIndex, state.currentQuestionIndex]);

  const totalQuestions = useMemo(
    () => countTotalQuestions(config.activities),
    [config.activities],
  );

  const currentActivity = config.activities[state.currentActivityIndex];

  // Count completed questions
  const questionsCompleted = useMemo(() => {
    let completed = 0;
    for (let i = 0; i < state.currentActivityIndex; i++) {
      completed += questionsInActivity(config.activities[i]);
    }
    completed += state.currentQuestionIndex;
    if (state.isComplete) {
      completed = totalQuestions;
    }
    return completed;
  }, [
    state.currentActivityIndex,
    state.currentQuestionIndex,
    state.isComplete,
    config.activities,
    totalQuestions,
  ]);

  const recordAnswer = useCallback(
    (givenAnswer: string, isCorrect: boolean) => {
      const timeMs = Date.now() - questionStartTime.current;

      // Determine question ID based on current activity
      const activity = config.activities[state.currentActivityIndex];
      let questionId = "unknown";
      switch (activity.type) {
        case "multiple_choice":
          questionId =
            activity.questions[state.currentQuestionIndex]?.id ?? "unknown";
          break;
        case "counting":
          questionId =
            activity.questions[state.currentQuestionIndex]?.id ?? "unknown";
          break;
        case "matching_pairs":
          questionId = "matching";
          break;
        case "sequence_order":
          questionId =
            activity.questions[state.currentQuestionIndex]?.id ?? "unknown";
          break;
        case "flash_card":
          questionId =
            activity.cards[state.currentQuestionIndex]?.id ?? "unknown";
          break;
        case "fill_in_blank":
          questionId =
            activity.questions[state.currentQuestionIndex]?.id ?? "unknown";
          break;
      }

      const event: AnswerEvent = {
        questionId,
        givenAnswer,
        isCorrect,
        timeMs,
        hintUsed: hintUsedForQuestion.current,
        attemptNumber: attemptCount.current,
      };

      setState((prev) => {
        const newAnswers = [...prev.metrics.answers, event];
        const newCorrectFirstTry =
          prev.metrics.correctFirstTry +
          (isCorrect && attemptCount.current === 1 ? 1 : 0);
        const newCorrectTotal =
          prev.metrics.correctTotal + (isCorrect ? 1 : 0);
        const newTotalQuestions = prev.metrics.totalQuestions + (isCorrect ? 1 : 0);
        const newHintsUsed =
          prev.metrics.hintsUsed + (hintUsedForQuestion.current ? 1 : 0);
        const newTotalTimeMs = prev.metrics.totalTimeMs + timeMs;

        // Score = percentage of correct first tries
        const questionsAnswered = newAnswers.filter(
          (a, i, arr) =>
            // Only count the first correct answer per question
            a.isCorrect && arr.findIndex((x) => x.questionId === a.questionId && x.isCorrect) === i,
        ).length;
        const score =
          totalQuestions > 0
            ? Math.round((questionsAnswered / totalQuestions) * 100)
            : 0;

        return {
          ...prev,
          showingFeedback: true,
          feedbackType: isCorrect ? "correct" : "incorrect",
          metrics: {
            totalQuestions: newTotalQuestions,
            correctFirstTry: newCorrectFirstTry,
            correctTotal: newCorrectTotal,
            totalTimeMs: newTotalTimeMs,
            hintsUsed: newHintsUsed,
            score,
            answers: newAnswers,
          },
        };
      });

      if (!isCorrect) {
        attemptCount.current += 1;
      }
    },
    [config.activities, state.currentActivityIndex, state.currentQuestionIndex, totalQuestions],
  );

  const useHint = useCallback(() => {
    hintUsedForQuestion.current = true;
  }, []);

  const dismissFeedback = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showingFeedback: false,
      feedbackType: "none",
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const activity = config.activities[prev.currentActivityIndex];
      const totalInActivity = questionsInActivity(activity);

      const nextQ = prev.currentQuestionIndex + 1;

      // If there are more questions in this activity
      if (nextQ < totalInActivity) {
        return {
          ...prev,
          currentQuestionIndex: nextQ,
          showingFeedback: false,
          feedbackType: "none",
        };
      }

      // Move to next activity
      const nextA = prev.currentActivityIndex + 1;
      if (nextA < config.activities.length) {
        return {
          ...prev,
          currentActivityIndex: nextA,
          currentQuestionIndex: 0,
          showingFeedback: false,
          feedbackType: "none",
        };
      }

      // All done!
      const passingScore = config.passingScore ?? 60;
      const hasPassed = prev.metrics.score >= passingScore;

      return {
        ...prev,
        isComplete: true,
        showingFeedback: false,
        feedbackType: "none",
        hasPassed,
      };
    });
  }, [config]);

  // Notify parent when complete
  useEffect(() => {
    if (state.isComplete && onComplete) {
      onComplete(state.metrics);
    }
  }, [state.isComplete, state.metrics, onComplete]);

  const value = useMemo<ActivityContextValue>(
    () => ({
      config,
      state,
      currentActivity,
      totalQuestions,
      questionsCompleted,
      recordAnswer,
      useHint,
      nextQuestion,
      dismissFeedback,
      subjectColor,
      lessonId,
      profileId,
      nextLessonId,
      nextLessonTitle,
    }),
    [
      config,
      state,
      currentActivity,
      totalQuestions,
      questionsCompleted,
      recordAnswer,
      useHint,
      nextQuestion,
      dismissFeedback,
      subjectColor,
      lessonId,
      profileId,
      nextLessonId,
      nextLessonTitle,
    ],
  );

  return (
    <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
  );
}
