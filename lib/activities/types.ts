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
  | "fill_in_blank"
  | "number_bond"
  | "ten_frame"
  | "number_line"
  | "rekenrek";

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
  /** Front of the card (question/prompt) — can be a string or {text, emoji} */
  front: string | {
    text: string;
    emoji?: string;
  };
  /** Back of the card (answer/explanation) — can be a string or {text, emoji} */
  back: string | {
    text: string;
    emoji?: string;
  };
  /** Optional hex color for the card (e.g. "#EF4444" for a red-themed card) */
  color?: string;
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
// Math-focused widget content definitions
// ---------------------------------------------------------------------------

/** Number Bond: Part-part-whole diagram with three connected circles */
export interface NumberBondQuestion {
  id: string;
  /** Instruction prompt */
  prompt: string;
  /** The whole (top circle) — null if student must fill */
  whole: number | null;
  /** First part (bottom-left) — null if student must fill */
  part1: number | null;
  /** Second part (bottom-right) — null if student must fill */
  part2: number | null;
  /** Hint text */
  hint?: string;
}

export interface NumberBondContent {
  type: "number_bond";
  questions: NumberBondQuestion[];
}

/** Ten Frame: 2x5 grid for placing counters and visualizing making-10 */
export interface TenFrameQuestion {
  id: string;
  /** Instruction prompt */
  prompt: string;
  /** For "show this number" tasks */
  targetNumber?: number;
  /** For addition tasks */
  operation?: {
    a: number;
    b: number;
    type: "add" | "subtract";
  };
  /** Highlight the "making 10" step */
  showMakingTen?: boolean;
  /** One frame (0-10) or two frames (0-20) */
  frameCount: 1 | 2;
  /** Hint text */
  hint?: string;
}

export interface TenFrameContent {
  type: "ten_frame";
  questions: TenFrameQuestion[];
}

/** Number Line: Hop along a number line to solve add/subtract */
export interface NumberLineQuestion {
  id: string;
  /** Instruction prompt */
  prompt: string;
  /** Start of number line (usually 0) */
  min: number;
  /** End of number line (usually 20) */
  max: number;
  /** Where the initial marker starts */
  startPosition: number;
  /** Where the marker should end up */
  correctEndPosition: number;
  /** Optional: force a specific jump size */
  jumpSize?: number;
  /** Show arc lines above the number line */
  showJumpArcs?: boolean;
  /** Whether adding or subtracting */
  operation: "add" | "subtract";
  /** Hint text */
  hint?: string;
}

export interface NumberLineContent {
  type: "number_line";
  questions: NumberLineQuestion[];
}

/** Rekenrek: Virtual counting rack with 2 rows of 10 beads (5 red + 5 white) */
export interface RekenrekQuestion {
  id: string;
  /** Instruction prompt */
  prompt: string;
  /** The number to represent */
  targetNumber: number;
  /** Interaction mode */
  mode: "show" | "add" | "subtract";
  /** Operands for add/subtract mode */
  operands?: {
    a: number;
    b: number;
  };
  /** Hint text */
  hint?: string;
}

export interface RekenrekContent {
  type: "rekenrek";
  questions: RekenrekQuestion[];
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
  | FillInBlankContent
  | NumberBondContent
  | TenFrameContent
  | NumberLineContent
  | RekenrekContent;

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
      "number_bond",
      "ten_frame",
      "number_line",
      "rekenrek",
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
