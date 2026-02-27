// ---------------------------------------------------------------------------
// Event name constants for user event tracking
// ---------------------------------------------------------------------------
// All known event names used across the application. Using constants prevents
// typos and makes it easy to discover all tracked events.

/** Onboarding */
export const EVENT_ONBOARDING_COMPLETE = "onboarding_complete" as const;

/** Lessons */
export const EVENT_LESSON_STARTED = "lesson_started" as const;
export const EVENT_LESSON_COMPLETED = "lesson_completed" as const;

/** AI Chat */
export const EVENT_CHIP_CHAT_OPENED = "chip_chat_opened" as const;
export const EVENT_CHIP_MESSAGE_SENT = "chip_message_sent" as const;

/** Parent Dashboard */
export const EVENT_PARENT_DASHBOARD_VIEWED = "parent_dashboard_viewed" as const;

/** Daily Adventures */
export const EVENT_DAILY_ADVENTURE_STARTED = "daily_adventure_started" as const;

/** Gamification */
export const EVENT_BADGE_EARNED = "badge_earned" as const;
export const EVENT_STREAK_CONTINUED = "streak_continued" as const;

/** Device */
export const EVENT_DEVICE_CONNECTED = "device_connected" as const;

/**
 * Union type of all known event names.
 * Kept as a string union rather than a strict enum so new events
 * can be added without migration.
 */
export type EventName =
  | typeof EVENT_ONBOARDING_COMPLETE
  | typeof EVENT_LESSON_STARTED
  | typeof EVENT_LESSON_COMPLETED
  | typeof EVENT_CHIP_CHAT_OPENED
  | typeof EVENT_CHIP_MESSAGE_SENT
  | typeof EVENT_PARENT_DASHBOARD_VIEWED
  | typeof EVENT_DAILY_ADVENTURE_STARTED
  | typeof EVENT_BADGE_EARNED
  | typeof EVENT_STREAK_CONTINUED
  | typeof EVENT_DEVICE_CONNECTED;
