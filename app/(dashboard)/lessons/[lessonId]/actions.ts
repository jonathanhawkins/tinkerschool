"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  evaluateBadges,
  type EarnedBadgeInfo,
} from "@/lib/badges/evaluate-badges";
import { updateStreak } from "@/lib/gamification/streaks";
import { awardXP } from "@/lib/gamification/xp";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getSupabase() {
  try {
    return await createServerSupabaseClient();
  } catch {
    console.warn(
      "[lesson/actions] Supabase JWT unavailable, falling back to admin client.",
    );
    return createAdminSupabaseClient();
  }
}

// ---------------------------------------------------------------------------
// Complete an interactive activity
// ---------------------------------------------------------------------------

interface CompleteActivityInput {
  lessonId: string;
  score: number;
  totalQuestions: number;
  correctFirstTry: number;
  correctTotal: number;
  timeMs: number;
  hintsUsed: number;
  activityData: unknown[];
}

interface CompleteActivityResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  xpAwarded?: number;
  error?: string;
}

/**
 * Record the completion of an interactive lesson activity.
 * - Saves the activity session to the activity_sessions table
 * - Updates lesson progress to "completed" if score meets threshold
 * - Awards XP and updates streak
 * - Evaluates badge criteria
 */
export async function completeActivity(
  input: CompleteActivityInput,
): Promise<CompleteActivityResult> {
  if (!isValidUUID(input.lessonId)) {
    return { success: false, error: "Invalid lesson ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  // Fetch profile
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Save activity session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: sessionError } = await (supabase.from("activity_sessions") as any).insert({
    profile_id: profile.id,
    lesson_id: input.lessonId,
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
      "[completeActivity] Failed to save activity session:",
      sessionError instanceof Error ? sessionError.message : "unknown error",
    );
    // Don't fail the whole operation - still update progress
  }

  // Determine if the student passed (60% default threshold)
  const passed = input.score >= 60;

  if (passed) {
    // Update lesson progress to completed
    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: progressError } = await (supabase.from("progress") as any).upsert(
      {
        profile_id: profile.id,
        lesson_id: input.lessonId,
        status: "completed",
        started_at: now,
        completed_at: now,
        attempts: 1,
      },
      {
        onConflict: "profile_id, lesson_id",
        ignoreDuplicates: false,
      },
    );

    if (progressError) {
      console.error(
        "[completeActivity] Failed to update progress:",
        progressError instanceof Error ? progressError.message : "unknown error",
      );
    }

    // Award XP, update streak, check badges
    const xpResult = await awardXP(supabase, profile.id, "lesson_completed");
    await updateStreak(supabase, profile.id);
    const newBadges = await evaluateBadges(supabase, profile.id);

    revalidatePath("/home");
    revalidatePath("/achievements");
    revalidatePath(`/lessons/${input.lessonId}`);

    return {
      success: true,
      newBadges,
      xpAwarded: xpResult.xpAwarded,
    };
  }

  // Not passed - still mark as in_progress
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("progress") as any).upsert(
    {
      profile_id: profile.id,
      lesson_id: input.lessonId,
      status: "in_progress",
      started_at: now,
      attempts: 1,
    },
    {
      onConflict: "profile_id, lesson_id",
      ignoreDuplicates: true,
    },
  );

  revalidatePath("/home");
  revalidatePath(`/lessons/${input.lessonId}`);

  return { success: true, xpAwarded: 0 };
}
