// =============================================================================
// Activity System Types
// =============================================================================
// Type definitions for the interactive lesson activity system.
// Activities are composable widgets rendered inside lesson pages based on
// the lesson's `content` JSON field and `lesson_type`.
// =============================================================================

// ---------------------------------------------------------------------------
// Activity widget types
// ---------------------------------------------------------------------------

/** The kind of interactive widget to render */
export type ActivityWidgetType =
  | "multiple_choice"
  | "counting"
  | "matching_pairs"
  | "sequence_order"
  | "flash_card"
  | "fill_in_blank";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** A single option in a multiple-choice or matching question */
export interface ActivityOption {
  /** Unique ID within the question */
  id: string;
  /** Display text */
  text: string;
  /** Optional emoji or image URL for visual learners */
  emoji?: string;
  /** Optional image URL */
  imageUrl?: string;
}

/** Audio feedback configuration */
export interface AudioFeedback {
  /** Play a success sound on correct answer */
  correctSound?: string;
  /** Play a try-again sound on incorrect answer */
  incorrectSound?: string;
}

// ---------------------------------------------------------------------------
// Per-widget content definitions
// ---------------------------------------------------------------------------

/** Multiple Choice: Pick the right answer from 2-4 options */
export interface MultipleChoiceQuestion {
  /** Unique question ID */
  id: string;
  /** The question prompt (shown to the kid) */
  prompt: string;
  /** Optional emoji/image for the prompt */
  promptEmoji?: string;
  /** Available answer options */
  options: ActivityOption[];
  /** The ID of the correct option */
  correctOptionId: string;
  /** Hint text shown after first wrong attempt */
  hint?: string;
}

export interface MultipleChoiceContent {
  type: "multiple_choice";
  /** Array of questions in order */
  questions: MultipleChoiceQuestion[];
  /** Whether to shuffle question order */
  shuffleQuestions?: boolean;
  /** Whether to shuffle option order within each question */
  shuffleOptions?: boolean;
}

/** Counting Widget: Tap objects to count them */
export interface CountingQuestion {
  id: string;
  /** What to count (e.g., "apples", "stars") */
  prompt: string;
  /** Emoji representing the countable item */
  emoji: string;
  /** The correct count */
  correctCount: number;
  /** How many items to display visually (might differ from correctCount for decoys) */
  displayCount: number;
  /** Hint text */
  hint?: string;
}

export interface CountingContent {
  type: "counting";
  questions: CountingQuestion[];
}

/** Matching Pairs: Connect items that go together */
export interface MatchingPair {
  id: string;
  /** Left side item */
  left: ActivityOption;
  /** Right side item */
  right: ActivityOption;
}

export interface MatchingPairsContent {
  type: "matching_pairs";
  /** Instruction text (e.g., "Match the letter to its sound") */
  prompt: string;
  /** The pairs to match */
  pairs: MatchingPair[];
  /** Hint text */
  hint?: string;
}

/** Sequence Order: Put items in the correct order */
export interface SequenceItem {
  id: string;
  /** Display text or emoji */
  text: string;
  emoji?: string;
  /** The correct position (1-indexed) */
  correctPosition: number;
}

export interface SequenceOrderQuestion {
  id: string;
  /** Instruction (e.g., "Put the numbers in order from smallest to biggest") */
  prompt: string;
  /** Items to sort */
  items: SequenceItem[];
  /** Hint text */
  hint?: string;
}

export interface SequenceOrderContent {
  type: "sequence_order";
  questions: SequenceOrderQuestion[];
}

/** Flash Card: Flip to reveal answer, self-assess */
export interface FlashCardItem {
  id: string;
  /** Front of the card (question/prompt) */
  front: {
    text: string;
    emoji?: string;
  };
  /** Back of the card (answer/explanation) */
  back: {
    text: string;
    emoji?: string;
  };
}

export interface FlashCardContent {
  type: "flash_card";
  /** Instruction (e.g., "Read the letter, flip to hear the sound!") */
  prompt: string;
  cards: FlashCardItem[];
  /** Whether to shuffle card order */
  shuffleCards?: boolean;
}

/** Fill in the Blank: Complete a sentence or equation */
export interface FillInBlankQuestion {
  id: string;
  /** Template with ___ for the blank (e.g., "2 + 3 = ___") */
  template: string;
  /** The correct answer (string comparison, case-insensitive) */
  correctAnswer: string;
  /** Alternative accepted answers */
  acceptableAnswers?: string[];
  /** Hint text */
  hint?: string;
  /** Optional word bank (for younger kids) */
  wordBank?: string[];
}

export interface FillInBlankContent {
  type: "fill_in_blank";
  questions: FillInBlankQuestion[];
}

// ---------------------------------------------------------------------------
// Union of all activity content types
// ---------------------------------------------------------------------------

export type ActivityContent =
  | MultipleChoiceContent
  | CountingContent
  | MatchingPairsContent
  | SequenceOrderContent
  | FlashCardContent
  | FillInBlankContent;

/** A lesson may contain one or more activity steps */
export interface LessonActivityConfig {
  /** Ordered list of activity steps in this lesson */
  activities: ActivityContent[];
  /** Subject color override (hex) */
  subjectColor?: string;
  /** Estimated time in minutes */
  estimatedMinutes?: number;
  /** Minimum score (0-100) to pass the lesson */
  passingScore?: number;
}

// ---------------------------------------------------------------------------
// Activity session tracking (runtime state)
// ---------------------------------------------------------------------------

/** A single answer event recorded during an activity */
export interface AnswerEvent {
  /** Question ID */
  questionId: string;
  /** What the student selected/typed */
  givenAnswer: string;
  /** Whether it was correct */
  isCorrect: boolean;
  /** Milliseconds taken for this question */
  timeMs: number;
  /** Whether a hint was used before answering */
  hintUsed: boolean;
  /** Attempt number for this question (1 = first try) */
  attemptNumber: number;
}

/** Aggregate session metrics */
export interface ActivitySessionMetrics {
  /** Total questions answered */
  totalQuestions: number;
  /** Number answered correctly (first try) */
  correctFirstTry: number;
  /** Number answered correctly (any try) */
  correctTotal: number;
  /** Total time in milliseconds */
  totalTimeMs: number;
  /** Total hints used */
  hintsUsed: number;
  /** Score as percentage (0-100) */
  score: number;
  /** Per-question answer events */
  answers: AnswerEvent[];
}

// ---------------------------------------------------------------------------
// Activity provider state
// ---------------------------------------------------------------------------

export interface ActivityState {
  /** Which activity step we're on (index into activities array) */
  currentActivityIndex: number;
  /** Which question within the current activity */
  currentQuestionIndex: number;
  /** Whether the activity is complete */
  isComplete: boolean;
  /** Whether we're showing feedback for the last answer */
  showingFeedback: boolean;
  /** The feedback type for the current answer */
  feedbackType: "correct" | "incorrect" | "none";
  /** Session metrics so far */
  metrics: ActivitySessionMetrics;
  /** Whether the user has passed (score >= passingScore) */
  hasPassed: boolean;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to parse a lesson's `content` field as a LessonActivityConfig.
 * Returns null if the content does not contain valid activity data.
 */
export function parseActivityConfig(
  content: Record<string, unknown>,
): LessonActivityConfig | null {
  if (!content || typeof content !== "object") return null;

  const activities = content.activities;
  if (!Array.isArray(activities) || activities.length === 0) return null;

  // Basic validation: each activity must have a `type` field
  for (const activity of activities) {
    if (!activity || typeof activity !== "object") return null;
    if (!("type" in activity) || typeof activity.type !== "string") return null;

    const validTypes: ActivityWidgetType[] = [
      "multiple_choice",
      "counting",
      "matching_pairs",
      "sequence_order",
      "flash_card",
      "fill_in_blank",
    ];

    if (!validTypes.includes(activity.type as ActivityWidgetType)) return null;
  }

  return content as unknown as LessonActivityConfig;
}

/**
 * Check if a lesson should render interactive activities instead of
 * the coding workshop flow.
 */
export function isInteractiveLesson(
  lessonType: string,
  content: Record<string, unknown>,
): boolean {
  // Only "interactive" and "quiz" lesson types use the activity system
  if (lessonType !== "interactive" && lessonType !== "quiz") return false;
  return parseActivityConfig(content) !== null;
}
