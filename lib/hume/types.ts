/**
 * Shared types for the Chip Voice (Hume EVI) integration.
 */

/**
 * Actions that Chip can trigger in the UI via EVI tool calls.
 * Consuming pages handle these via the `onAction` callback.
 */
export type VoiceAction =
  | { type: "highlight"; target: string }
  | { type: "celebrate" }
  | { type: "navigate"; path: string }
  | { type: "show_hint"; text: string };

/**
 * Connection status for the voice interface.
 */
export type ChipVoiceStatus = "idle" | "connecting" | "connected";

/**
 * Server-fetched context passed to the voice FAB so Chip knows about
 * the child's progress and can give contextual greetings / navigation.
 */
export interface VoicePageContext {
  childName: string;
  age: number;
  gradeLevel: number;
  currentStreak: number;
  xp: number;
  deviceMode: "usb" | "wifi" | "simulator" | "none";
  inProgressLesson?: { title: string; subject: string; id: string };
  subjects: { name: string; slug: string }[];
  completedLessonCount: number;
}

// ---------------------------------------------------------------------------
// Voice lesson context — structured data about the current lesson so Chip
// can act as a real teacher (knows questions, answers, hints, etc.)
// ---------------------------------------------------------------------------

/** A single question summarized for Chip's reference during voice tutoring. */
export interface VoiceQuestionSummary {
  prompt: string;
  /** For Chip's reference — NEVER revealed to the child. */
  correctAnswer: string;
  hint?: string;
  /** Multiple-choice option texts (if applicable). */
  options?: string[];
}

/** Summary of a single activity widget within a lesson. */
export interface VoiceActivitySummary {
  widgetType: string;
  questionCount: number;
  questions: VoiceQuestionSummary[];
}

/** Full lesson context pushed into the voice bridge for Chip's awareness. */
export interface VoiceLessonContext {
  lessonId: string;
  title: string;
  description: string;
  storyText: string | null;
  subjectName: string;
  subjectSlug: string;
  subjectColor: string;
  lessonType: string;
  estimatedMinutes: number;
  skillsCovered: string[];
  activities: VoiceActivitySummary[];
  codingHints: string[];
  isInteractive: boolean;
}

/**
 * Props for the ChipVoice client component.
 */
export interface ChipVoiceProps {
  accessToken: string;
  configId?: string;
  onAction?: (action: VoiceAction) => void;
  className?: string;
  /** Server-provided context for the voice FAB (page awareness). */
  pageContext?: VoicePageContext;
}
