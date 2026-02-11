"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { getHumeAccessToken } from "@/lib/hume/access-token";
import type { ChipVoiceProps, VoicePageContext } from "@/lib/hume/types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Lesson, Profile, Progress, Subject } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Voice usage limits (seconds)
// ---------------------------------------------------------------------------

/** Daily voice limit per child, by tier. */
const DAILY_LIMIT: Record<string, number> = {
  free: 10 * 60,       // 10 min/day
  supporter: 30 * 60,  // 30 min/day
};

/** Monthly voice limit per family, by tier. */
const MONTHLY_LIMIT: Record<string, number> = {
  free: 60 * 60,       // 60 min/month
  supporter: 300 * 60, // 300 min/month
};

/** Hume EVI cost rate: $0.07/min = 0.1167 cents/second */
const COST_CENTS_PER_SECOND = 0.07 / 60 * 100; // ~0.1167

// ---------------------------------------------------------------------------
// Voice budget check
// ---------------------------------------------------------------------------

export interface VoiceBudgetResult {
  allowed: boolean;
  /** Remaining seconds the child can use today */
  remainingSecondsToday: number;
  /** Remaining seconds the family can use this month */
  remainingSecondsMonth: number;
  /** The effective cap for this session (min of daily and monthly remaining) */
  remainingSeconds: number;
  dailyLimitSeconds: number;
  monthlyLimitSeconds: number;
  tier: string;
  /** Human-readable reason if not allowed */
  reason?: string;
}

/**
 * Check if the current user has voice minutes remaining.
 * Called before each voice connect to enforce cost caps.
 */
export async function checkVoiceBudget(): Promise<VoiceBudgetResult> {
  try {
    const { profile } = await requireAuth();
    const supabase = createAdminSupabaseClient();

    // Get family tier — cast needed because admin client types may not include
    // all columns (subscription_tier was added after initial type generation).
    const { data: family } = (await supabase
      .from("families")
      .select("id, subscription_tier")
      .eq("id", profile.family_id)
      .single()) as { data: { id: string; subscription_tier: string | null } | null };

    const tier = (family?.subscription_tier as string) ?? "free";
    const dailyLimit = DAILY_LIMIT[tier] ?? DAILY_LIMIT.free;
    const monthlyLimit = MONTHLY_LIMIT[tier] ?? MONTHLY_LIMIT.free;

    // Resolve the kid profile (if parent, get first kid)
    let kidProfileId = profile.id;
    if (profile.role === "parent") {
      const { data: kids } = (await supabase
        .from("profiles")
        .select("id")
        .eq("family_id", profile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1)) as { data: { id: string }[] | null };
      if (kids?.[0]) kidProfileId = kids[0].id;
    }

    // Query daily and monthly usage in parallel
    // RPC functions added by 026_voice_sessions migration — cast because
    // generated types don't include them yet.
    const [dailyResult, monthlyResult] = await Promise.all([
      supabase.rpc("get_voice_seconds_today" as never, { p_profile_id: kidProfileId } as never),
      supabase.rpc("get_voice_seconds_month" as never, { p_family_id: profile.family_id } as never),
    ]);

    const usedToday = (dailyResult.data as unknown as number) ?? 0;
    const usedMonth = (monthlyResult.data as unknown as number) ?? 0;

    const remainingToday = Math.max(0, dailyLimit - usedToday);
    const remainingMonth = Math.max(0, monthlyLimit - usedMonth);
    const remaining = Math.min(remainingToday, remainingMonth);

    if (remaining <= 0) {
      const reason = remainingMonth <= 0
        ? "You've used all your voice minutes for this month. They'll reset next month!"
        : "Chip needs to rest! You've used all your voice time for today. Try again tomorrow!";
      return {
        allowed: false,
        remainingSecondsToday: remainingToday,
        remainingSecondsMonth: remainingMonth,
        remainingSeconds: 0,
        dailyLimitSeconds: dailyLimit,
        monthlyLimitSeconds: monthlyLimit,
        tier,
        reason,
      };
    }

    return {
      allowed: true,
      remainingSecondsToday: remainingToday,
      remainingSecondsMonth: remainingMonth,
      remainingSeconds: remaining,
      dailyLimitSeconds: dailyLimit,
      monthlyLimitSeconds: monthlyLimit,
      tier,
    };
  } catch {
    // If auth fails or DB is down, deny voice to prevent untracked cost
    return {
      allowed: false,
      remainingSecondsToday: 0,
      remainingSecondsMonth: 0,
      remainingSeconds: 0,
      dailyLimitSeconds: 0,
      monthlyLimitSeconds: 0,
      tier: "free",
      reason: "Unable to check voice budget. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Voice session logging
// ---------------------------------------------------------------------------

/**
 * Log a completed voice session for cost tracking.
 * Called from the client when the voice connection ends.
 */
export async function logVoiceSession(
  chatGroupId: string | null,
  durationSeconds: number,
): Promise<void> {
  if (durationSeconds <= 0) return;

  try {
    const { profile } = await requireAuth();
    const supabase = createAdminSupabaseClient();

    // Resolve kid profile (same logic as budget check)
    let kidProfileId = profile.id;
    if (profile.role === "parent") {
      const { data: kids } = (await supabase
        .from("profiles")
        .select("id")
        .eq("family_id", profile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1)) as { data: { id: string }[] | null };
      if (kids?.[0]) kidProfileId = kids[0].id;
    }

    const costCents = Math.round(durationSeconds * COST_CENTS_PER_SECOND);

    // voice_sessions table added by 026 migration — cast because generated
    // types don't include it yet.
    await (supabase.from("voice_sessions" as never) as unknown as ReturnType<typeof supabase.from>).insert({
      profile_id: kidProfileId,
      family_id: profile.family_id,
      chat_group_id: chatGroupId,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      ended_at: new Date().toISOString(),
      duration_seconds: Math.round(durationSeconds),
      estimated_cost_cents: costCents,
    } as never);
  } catch (err) {
    console.error(
      "[voice] Failed to log session:",
      err instanceof Error ? err.message : "unknown",
    );
  }
}

/**
 * Server action to fetch a fresh Hume access token.
 * Now gates on voice budget — returns null if the user has no remaining minutes.
 *
 * Called from the client before each voice `connect()` so that expired
 * tokens are transparently replaced without a full page reload.
 */
export async function refreshHumeAccessToken(): Promise<string | null> {
  return getHumeAccessToken();
}

/**
 * Fetches initial data for the Chip voice FAB: access token + page context.
 *
 * Called once on mount by the client-side ChipVoiceGlobal component.
 * This replaces the previous ChipVoiceServer approach where a server
 * component inside Suspense would re-evaluate on each navigation, causing
 * the client FAB to unmount and lose its WebSocket connection.
 */
export async function getChipVoiceInitialData(): Promise<ChipVoiceProps | null> {
  const accessToken = await getHumeAccessToken();
  if (!accessToken) return null;

  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
  const pageContext = await fetchVoicePageContext();

  return { accessToken, configId, pageContext };
}

// ---------------------------------------------------------------------------
// Server-side data fetching for FAB page context
// ---------------------------------------------------------------------------

async function fetchVoicePageContext(): Promise<VoicePageContext> {
  const defaults: VoicePageContext = {
    childName: "friend",
    age: 7,
    gradeLevel: 1,
    currentStreak: 0,
    xp: 0,
    deviceMode: "none",
    subjects: [],
    completedLessonCount: 0,
  };

  try {
    const { profile, supabase } = await requireAuth();

    // Chip talks to the kid, not the parent. If the logged-in user is a
    // parent, find the first kid profile in the same family.
    let kidProfile = profile;
    if (profile.role === "parent") {
      const { data: kids } = await supabase
        .from("profiles")
        .select("*")
        .eq("family_id", profile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1);
      const firstKid = (kids as Profile[] | null)?.[0];
      if (firstKid) kidProfile = firstKid;
    }

    // Parallel queries: subjects + progress
    const [subjectsResult, progressResult] = await Promise.all([
      supabase.from("subjects").select("*").order("sort_order"),
      supabase.from("progress").select("*").eq("profile_id", kidProfile.id),
    ]);

    const safeSubjects = (subjectsResult.data as Subject[] | null) ?? [];
    const subjects = safeSubjects.map((s) => ({
      name: s.display_name,
      slug: s.slug,
    }));

    const progressRows = (progressResult.data as Progress[] | null) ?? [];
    const completedLessonCount = progressRows.filter(
      (p) => p.status === "completed",
    ).length;

    // Find most recent in-progress lesson
    const inProgressEntries = progressRows
      .filter((p) => p.status === "in_progress" && p.started_at)
      .sort(
        (a, b) =>
          new Date(b.started_at!).getTime() - new Date(a.started_at!).getTime(),
      );

    const topEntry = inProgressEntries[0];

    // Only fetch the single lesson we need (instead of ALL lessons)
    let inProgressLesson: { title: string; subject: string; id: string } | undefined;
    if (topEntry?.lesson_id) {
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", topEntry.lesson_id)
        .single();
      const matchedLesson = lessonData as Lesson | null;

      if (matchedLesson) {
        const lessonSubject = matchedLesson.subject_id
          ? safeSubjects.find((s) => s.id === matchedLesson.subject_id)
          : undefined;

        inProgressLesson = {
          title: matchedLesson.title,
          subject: lessonSubject?.display_name ?? "a subject",
          id: matchedLesson.id,
        };
      }
    }

    // Map age from grade_level (approximate: grade 1 ~ age 6-7)
    const gradeLevel = kidProfile.grade_level ?? 1;
    const age = gradeLevel + 5;

    return {
      childName: kidProfile.display_name,
      age,
      gradeLevel,
      currentStreak: kidProfile.current_streak,
      xp: kidProfile.xp ?? 0,
      deviceMode: kidProfile.device_mode,
      inProgressLesson,
      subjects,
      completedLessonCount,
    };
  } catch {
    // Auth might fail (e.g. during static generation). Return safe defaults.
    return defaults;
  }
}
