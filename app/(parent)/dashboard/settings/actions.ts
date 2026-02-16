"use server";

import { auth } from "@clerk/nextjs/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Export all child data as JSON (COPPA data portability)
// ---------------------------------------------------------------------------

// Note: `as unknown as` casts are needed because the hand-written Database
// type's TableDefinition omits Relationships, which breaks the Supabase
// client's type inference for select(). The queries are still correct.

interface ExportResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Exports all collected data for a specific child profile.
 * Only accessible by parents within the same family.
 * Returns a JSON string that the client can trigger as a download.
 */
export async function exportChildData(kidProfileId: string): Promise<ExportResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = createAdminSupabaseClient();

  // Verify the caller is a parent in the same family as the kid
  const { data: parentProfile } = (await supabase
    .from("profiles")
    .select("id, role, family_id")
    .eq("clerk_id", userId)
    .single()) as unknown as { data: { id: string; role: string; family_id: string } | null };

  if (!parentProfile || parentProfile.role !== "parent") {
    return { success: false, error: "Only parents can export child data" };
  }

  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("id, display_name, avatar_id, grade_level, current_band, role, family_id, created_at")
    .eq("id", kidProfileId)
    .single()) as unknown as {
    data: {
      id: string;
      display_name: string;
      avatar_id: string;
      grade_level: number;
      current_band: number;
      role: string;
      family_id: string;
      created_at: string;
    } | null;
  };

  if (!kidProfile || kidProfile.family_id !== parentProfile.family_id) {
    return { success: false, error: "Child not found in your family" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyQuery = any;

  // Gather all child data in parallel
  const [
    progressResult,
    chatSessionsResult,
    voiceSessionsResult,
    projectsResult,
    badgesResult,
    learningProfileResult,
    activitySessionsResult,
  ] = await Promise.all([
    supabase
      .from("progress")
      .select("lesson_id, status, started_at, completed_at, attempts")
      .eq("profile_id", kidProfileId) as AnyQuery,
    supabase
      .from("chat_sessions")
      .select("id, subject, lesson_id, messages, created_at")
      .eq("profile_id", kidProfileId)
      .order("created_at", { ascending: false }) as AnyQuery,
    supabase
      .from("voice_sessions")
      .select("id, chat_group_id, duration_seconds, created_at")
      .eq("profile_id", kidProfileId)
      .order("created_at", { ascending: false }) as AnyQuery,
    supabase
      .from("projects")
      .select("id, title, description, code, language, created_at, updated_at")
      .eq("profile_id", kidProfileId)
      .order("created_at", { ascending: false }) as AnyQuery,
    supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("profile_id", kidProfileId) as AnyQuery,
    supabase
      .from("learning_profiles")
      .select("*")
      .eq("profile_id", kidProfileId)
      .maybeSingle() as AnyQuery,
    supabase
      .from("activity_sessions")
      .select("lesson_id, score, total_questions, correct_first_try, correct_total, time_seconds, hints_used, created_at")
      .eq("profile_id", kidProfileId)
      .order("created_at", { ascending: false }) as AnyQuery,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const voiceSessions = ((voiceSessionsResult.data ?? []) as any[]).map((s) => ({
    id: s.id,
    chatGroupId: s.chat_group_id,
    durationSeconds: s.duration_seconds,
    createdAt: s.created_at,
  }));

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: "parent",
    child: {
      displayName: kidProfile.display_name,
      avatarId: kidProfile.avatar_id,
      gradeLevel: kidProfile.grade_level,
      currentBand: kidProfile.current_band,
      createdAt: kidProfile.created_at,
    },
    learningProfile: learningProfileResult.data ?? null,
    progress: progressResult.data ?? [],
    activitySessions: activitySessionsResult.data ?? [],
    chatSessions: chatSessionsResult.data ?? [],
    voiceSessions,
    projects: projectsResult.data ?? [],
    badges: badgesResult.data ?? [],
  };

  return {
    success: true,
    data: JSON.stringify(exportData, null, 2),
  };
}
