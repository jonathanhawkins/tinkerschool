import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { EventName } from "./events";

// ---------------------------------------------------------------------------
// recordEvent — low-level event recording for use in API routes & server code
// ---------------------------------------------------------------------------

/**
 * Record a user event directly. Unlike `trackEvent` (server action), this
 * function does NOT have the `'use server'` directive, so it can be called
 * from API route handlers, middleware, and other server-side code.
 *
 * Fire-and-forget: errors are logged but never thrown.
 *
 * @param profileId - The profile UUID to attribute the event to
 * @param familyId  - The family UUID for family-scoped queries
 * @param eventName - One of the known event name constants
 * @param eventData - Optional JSON-serializable context
 */
export async function recordEvent(
  profileId: string,
  familyId: string,
  eventName: EventName,
  eventData?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = createAdminSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("user_events") as any).insert({
      profile_id: profileId,
      family_id: familyId,
      event_name: eventName,
      event_data: eventData ?? null,
    });
  } catch (err) {
    console.error(
      "[recordEvent] Failed to record event:",
      eventName,
      err instanceof Error ? err.message : "unknown error",
    );
  }
}
