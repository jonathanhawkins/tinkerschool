/**
 * Adventure Store
 *
 * CRUD operations for the daily_adventures table.
 * Uses the admin Supabase client (bypasses RLS) since this runs
 * in server action context.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, DailyAdventure } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch today's adventure for a profile. Returns null if no adventure exists
 * for today (UTC calendar day).
 */
export async function getTodayAdventure(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<DailyAdventure | null> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setUTCHours(23, 59, 59, 999);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from("daily_adventures") as any)
    .select("*")
    .eq("profile_id", profileId)
    .gte("generated_at", todayStart.toISOString())
    .lte("generated_at", todayEnd.toISOString())
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle()) as { data: DailyAdventure | null; error: unknown };

  if (error) {
    console.error("[adventure-store] Failed to fetch today's adventure:", error);
    return null;
  }

  return data;
}

/**
 * Fetch a specific adventure by ID.
 */
export async function getAdventureById(
  supabase: SupabaseClient<Database>,
  adventureId: string,
): Promise<DailyAdventure | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from("daily_adventures") as any)
    .select("*")
    .eq("id", adventureId)
    .single()) as { data: DailyAdventure | null; error: unknown };

  if (error) {
    console.error("[adventure-store] Failed to fetch adventure:", error);
    return null;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Save a newly generated adventure to the database.
 */
export async function saveAdventure(
  supabase: SupabaseClient<Database>,
  adventure: {
    profileId: string;
    subjectId: string;
    skillIds: string[];
    title: string;
    description: string;
    storyText: string;
    content: Record<string, unknown>;
    subjectColor: string;
  },
): Promise<DailyAdventure | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from("daily_adventures") as any)
    .insert({
      profile_id: adventure.profileId,
      subject_id: adventure.subjectId,
      skill_ids: adventure.skillIds,
      title: adventure.title,
      description: adventure.description,
      story_text: adventure.storyText,
      content: adventure.content,
      subject_color: adventure.subjectColor,
      status: "pending",
      generated_at: new Date().toISOString(),
      expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    })
    .select()
    .single()) as { data: DailyAdventure | null; error: unknown };

  if (error) {
    console.error("[adventure-store] Failed to save adventure:", error);
    return null;
  }

  return data;
}

/**
 * Mark an adventure as completed with a score.
 */
export async function markAdventureCompleted(
  supabase: SupabaseClient<Database>,
  adventureId: string,
  score: number,
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("daily_adventures") as any)
    .update({ status: "completed", score })
    .eq("id", adventureId);

  if (error) {
    console.error("[adventure-store] Failed to mark adventure completed:", error);
    return false;
  }

  return true;
}
