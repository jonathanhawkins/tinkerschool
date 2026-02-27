"use server";

import { auth } from "@clerk/nextjs/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { EventName } from "./events";

// ---------------------------------------------------------------------------
// trackEvent — lightweight funnel event tracking
// ---------------------------------------------------------------------------

/**
 * Record a user event for funnel analytics. Fire-and-forget: errors are
 * logged but never thrown, so callers can safely ignore the return value
 * and the UI is never blocked.
 *
 * Uses the admin Supabase client (bypasses RLS) because:
 * 1. Events may be logged in contexts where the Clerk JWT isn't available
 *    (e.g. onboarding, webhook-triggered flows).
 * 2. The function already validates the user via Clerk auth() — RLS would
 *    be redundant.
 *
 * @param eventName - One of the known event name constants from events.ts
 * @param eventData - Optional JSON-serializable context (lesson_id, subject, etc.)
 */
export async function trackEvent(
  eventName: EventName,
  eventData?: Record<string, unknown>,
): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = createAdminSupabaseClient();

    // Look up profile_id and family_id from the authenticated user's Clerk ID
    const { data: profile } = (await supabase
      .from("profiles")
      .select("id, family_id, role")
      .eq("clerk_id", userId)
      .single()) as { data: { id: string; family_id: string; role: string } | null };

    if (!profile) return;

    // If the user is a parent but the event is kid-facing, resolve the kid profile.
    // Most events are emitted by whoever is authenticated at the time.
    const profileId = profile.id;
    const familyId = profile.family_id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("user_events") as any).insert({
      profile_id: profileId,
      family_id: familyId,
      event_name: eventName,
      event_data: eventData ?? null,
    });
  } catch (err) {
    // Fire-and-forget: log but never throw
    console.error(
      "[trackEvent] Failed to record event:",
      eventName,
      err instanceof Error ? err.message : "unknown error",
    );
  }
}

/**
 * Variant of trackEvent that accepts explicit profile and family IDs.
 * Use this when the profile is already resolved (e.g. in server actions
 * that have already looked up the kid profile).
 *
 * Also fire-and-forget.
 */
export async function trackEventDirect(
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
      "[trackEventDirect] Failed to record event:",
      eventName,
      err instanceof Error ? err.message : "unknown error",
    );
  }
}
