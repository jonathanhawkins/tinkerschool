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
  deviceMode: "usb" | "simulator" | "none";
  inProgressLesson?: { title: string; subject: string; id: string };
  subjects: { name: string; slug: string }[];
  completedLessonCount: number;
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
