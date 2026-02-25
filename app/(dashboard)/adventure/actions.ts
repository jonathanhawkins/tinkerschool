"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { synthesizeChipNotes } from "@/lib/ai/chip-memory-synthesizer";
import { updateSkillProficiencyDirect } from "@/lib/ai/skill-proficiency-writer";
import {
  evaluateBadges,
  type EarnedBadgeInfo,
} from "@/lib/badges/evaluate-badges";
import { updateStreak } from "@/lib/gamification/streaks";
import { awardXP } from "@/lib/gamification/xp";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

import { gatherChildContext } from "@/lib/adventures/gather-child-context";
import { generateAdventure } from "@/lib/adventures/generate-adventure";
import {
  getTodayAdventure,
  saveAdventure,
  markAdventureCompleted,
} from "@/lib/adventures/adventure-store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getSupabase() {
  try {
    return await createServerSupabaseClient();
  } catch {
    console.warn(
      "[adventure/actions] Supabase JWT unavailable, falling back to admin client.",
    );
    return createAdminSupabaseClient();
  }
}

async function resolveKidProfileId(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
): Promise<string | null> {
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, role, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; role: string; family_id: string } | null };

  if (!profile) return null;

  if (profile.role === "kid") return profile.id;

  const { data: kids } = (await supabase
    .from("profiles")
    .select("id")
    .eq("family_id", profile.family_id)
    .eq("role", "kid")
    .order("created_at")
    .limit(1)) as { data: { id: string }[] | null };

  return kids?.[0]?.id ?? profile.id;
}

// ---------------------------------------------------------------------------
// Get or generate today's adventure
// ---------------------------------------------------------------------------

interface GetOrGenerateResult {
  success: boolean;
  adventureId?: string;
  error?: string;
}

/**
 * Check for today's adventure. If none exists, generate one using AI.
 * Idempotent: multiple calls on the same day return the same adventure.
 */
export async function getOrGenerateAdventure(): Promise<GetOrGenerateResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();
  const profileId = await resolveKidProfileId(supabase, userId);
  if (!profileId) {
    return { success: false, error: "Profile not found" };
  }

  const adminClient = createAdminSupabaseClient();

  // Check if today's adventure already exists
  const existing = await getTodayAdventure(adminClient, profileId);
  if (existing) {
    return { success: true, adventureId: existing.id };
  }

  // Gather child context for AI generation
  const context = await gatherChildContext(adminClient, profileId);
  if (!context) {
    return { success: false, error: "Failed to gather child context" };
  }

  // Generate adventure via AI
  try {
    const generated = await generateAdventure(context);

    // Save to database
    const saved = await saveAdventure(adminClient, {
      profileId,
      subjectId: generated.subjectId,
      skillIds: generated.skillIds,
      title: generated.title,
      description: generated.description,
      storyText: generated.storyText,
      content: generated.config,
      subjectColor: generated.subjectColor,
    });

    if (!saved) {
      return { success: false, error: "Failed to save adventure" };
    }

    revalidatePath("/home");
    return { success: true, adventureId: saved.id };
  } catch (err) {
    console.error("[adventure/actions] Generation failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Generation failed",
    };
  }
}

// ---------------------------------------------------------------------------
// Complete an adventure
// ---------------------------------------------------------------------------

interface CompleteAdventureInput {
  adventureId: string;
  score: number;
  totalQuestions: number;
  correctFirstTry: number;
  correctTotal: number;
  timeMs: number;
  hintsUsed: number;
  activityData: unknown[];
}

interface CompleteAdventureResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  xpAwarded?: number;
  error?: string;
}

/**
 * Record the completion of a daily adventure.
 * - Saves the activity session (with adventure_id, no lesson_id)
 * - Marks the adventure as completed with a score
 * - Awards XP, updates streak, evaluates badges
 * - Updates skill proficiency for the adventure's skills
 */
export async function completeAdventure(
  input: CompleteAdventureInput,
): Promise<CompleteAdventureResult> {
  if (!isValidUUID(input.adventureId)) {
    return { success: false, error: "Invalid adventure ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();
  const profileId = await resolveKidProfileId(supabase, userId);
  if (!profileId) {
    return { success: false, error: "Profile not found" };
  }

  const adminClient = createAdminSupabaseClient();

  // Fetch the adventure to get skill_ids
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adventure } = (await (adminClient.from("daily_adventures") as any)
    .select("id, skill_ids")
    .eq("id", input.adventureId)
    .single()) as { data: { id: string; skill_ids: string[] } | null };

  if (!adventure) {
    return { success: false, error: "Adventure not found" };
  }

  // Save activity session (with adventure_id, null lesson_id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: sessionError } = await (supabase.from("activity_sessions") as any).insert({
    profile_id: profileId,
    lesson_id: null,
    adventure_id: input.adventureId,
    score: input.score,
    total_questions: input.totalQuestions,
    correct_first_try: input.correctFirstTry,
    correct_total: input.correctTotal,
    time_seconds: Math.round(input.timeMs / 1000),
    hints_used: input.hintsUsed,
    activity_data: input.activityData,
  });

  if (sessionError) {
    console.error(
      "[completeAdventure] Failed to save activity session:",
      sessionError instanceof Error ? sessionError.message : "unknown error",
    );
  }

  // Mark adventure as completed
  await markAdventureCompleted(adminClient, input.adventureId, input.score);

  // Update skill proficiency directly (fire-and-forget)
  if (adventure.skill_ids.length > 0) {
    updateSkillProficiencyDirect(adminClient, profileId, adventure.skill_ids, {
      score: input.score,
      hintsUsed: input.hintsUsed,
      correctFirstTry: input.correctFirstTry,
      totalQuestions: input.totalQuestions,
    }).catch((err) => {
      console.error("[completeAdventure] Skill proficiency update failed:", err);
    });
  }

  // Determine if passed
  const passed = input.score >= 60;

  if (passed) {
    // Award XP, update streak, check badges
    const xpResult = await awardXP(supabase, profileId, "lesson_completed");
    await updateStreak(supabase, profileId);
    const newBadges = await evaluateBadges(supabase, profileId);

    // Synthesize Chip's notes (fire-and-forget)
    synthesizeChipNotes(adminClient, profileId).catch((err) => {
      console.error("[completeAdventure] Chip notes synthesis failed:", err);
    });

    revalidatePath("/home");
    revalidatePath("/achievements");
    revalidatePath("/adventure");

    return {
      success: true,
      newBadges,
      xpAwarded: xpResult.xpAwarded,
    };
  }

  revalidatePath("/home");
  revalidatePath("/adventure");

  return { success: true, xpAwarded: 0 };
}
