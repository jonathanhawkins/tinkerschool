"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  evaluateBadges,
  type EarnedBadgeInfo,
} from "@/lib/badges/evaluate-badges";
import { updateStreak } from "@/lib/gamification/streaks";
import { awardXP } from "@/lib/gamification/xp";
import { sendLessonCompletionNotification } from "@/lib/notifications/send-parent-notification";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Note: `as any` casts on .from() calls are needed because the hand-written
// Database type's TableDefinition omits Relationships, which breaks the
// Supabase client's type inference for insert/upsert. The interfaces
// (ProgressInsert, ActivitySessionInsert) are still correct — only the
// generic plumbing is off. TODO: replace hand-written types with
// `npx supabase gen types` output to eliminate these casts.

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

/**
 * Resolve the active kid profile for the authenticated user.
 * If the authenticated user is a parent, returns the first kid in the family.
 * Falls back to the parent's profile ID if no kids exist.
 */
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

  // If already a kid, return directly
  if (profile.role === "kid") return profile.id;

  // Parent -- find the first kid in the family
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
// Start a lesson (create in_progress record if none exists)
// ---------------------------------------------------------------------------

export async function startLesson(lessonId: string): Promise<{ success: boolean }> {
  if (!isValidUUID(lessonId)) {
    return { success: false };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false };
  }

  const supabase = await getSupabase();

  const profileId = await resolveKidProfileId(supabase, userId);
  if (!profileId) {
    return { success: false };
  }

  // Only insert if no record exists (don't overwrite completed/in_progress)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("progress") as any).upsert(
    {
      profile_id: profileId,
      lesson_id: lessonId,
      status: "in_progress",
      started_at: new Date().toISOString(),
      attempts: 0,
    },
    {
      onConflict: "profile_id, lesson_id",
      ignoreDuplicates: true,
    },
  );

  return { success: true };
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

/** Milestone data for the supporter nudge (parent-facing). */
export interface MilestoneInfo {
  /** Total number of completed lessons across all subjects */
  totalCompleted: number;
  /** The kid's display name */
  kidName: string;
  /** Whether the family is on the free tier */
  isFree: boolean;
}

interface CompleteActivityResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  xpAwarded?: number;
  milestone?: MilestoneInfo;
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

  // Resolve the active kid profile
  const profileId = await resolveKidProfileId(supabase, userId);
  if (!profileId) {
    return { success: false, error: "Profile not found" };
  }

  // Save activity session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: sessionError } = await (supabase.from("activity_sessions") as any).insert({
    profile_id: profileId,
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
        profile_id: profileId,
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
    const xpResult = await awardXP(supabase, profileId, "lesson_completed");
    await updateStreak(supabase, profileId);
    const newBadges = await evaluateBadges(supabase, profileId);

    // Compute milestone data for supporter nudge (non-blocking)
    let milestone: MilestoneInfo | undefined;
    try {
      const [completedResult, profileResult] = await Promise.all([
        supabase
          .from("progress")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profileId)
          .eq("status", "completed"),
        supabase
          .from("profiles")
          .select("display_name, family_id")
          .eq("id", profileId)
          .single() as unknown as Promise<{ data: { display_name: string; family_id: string } | null }>,
      ]);

      const totalCompleted = completedResult.count ?? 0;
      const MILESTONES = [3, 5, 10, 25, 50, 100];

      if (MILESTONES.includes(totalCompleted) && profileResult.data) {
        const { data: family } = (await supabase
          .from("families")
          .select("subscription_tier")
          .eq("id", profileResult.data.family_id)
          .single()) as { data: { subscription_tier: string } | null };

        const isFree = family?.subscription_tier !== "supporter";

        if (isFree) {
          milestone = {
            totalCompleted,
            kidName: profileResult.data.display_name,
            isFree: true,
          };
        }
      }
    } catch (err) {
      // Non-critical — don't fail activity completion
      console.error("[completeActivity] Milestone check failed:", err);
    }

    // Notify parent(s) about lesson completion (fire-and-forget)
    sendLessonCompletionNotification(
      supabase,
      profileId,
      input.lessonId,
      input.score,
    ).catch((err) => {
      console.error("[completeActivity] Parent notification failed:", err);
    });

    revalidatePath("/home");
    revalidatePath("/achievements");
    revalidatePath(`/lessons/${input.lessonId}`);

    return {
      success: true,
      newBadges,
      xpAwarded: xpResult.xpAwarded,
      milestone,
    };
  }

  // Not passed - still mark as in_progress and increment attempts
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("progress") as any).upsert(
    {
      profile_id: profileId,
      lesson_id: input.lessonId,
      status: "in_progress",
      started_at: now,
      attempts: 1,
    },
    {
      onConflict: "profile_id, lesson_id",
      ignoreDuplicates: false,
    },
  );

  revalidatePath("/home");
  revalidatePath(`/lessons/${input.lessonId}`);

  return { success: true, xpAwarded: 0 };
}
