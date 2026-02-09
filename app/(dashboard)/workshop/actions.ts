"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  evaluateBadges,
  type EarnedBadgeInfo,
} from "@/lib/badges/evaluate-badges";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProgressInsert, ProjectInsert } from "@/lib/supabase/types";
import { isValidUUID } from "@/lib/utils";

/** Get a Supabase client, falling back to admin if Clerk JWT is unavailable. */
async function getSupabase() {
  try {
    return await createServerSupabaseClient();
  } catch {
    console.warn(
      "[workshop/actions] Supabase JWT unavailable, falling back to admin client.",
    );
    return createAdminSupabaseClient();
  }
}

// ---------------------------------------------------------------------------
// Save project
// ---------------------------------------------------------------------------

interface SaveProjectResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  error?: string;
}

export async function saveProject(
  formData: FormData,
): Promise<SaveProjectResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  // Fetch the profile for this Clerk user.
  // The hand-written Database type resolves Row to `never`, so we cast the
  // query result to the shape we actually need.
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const rawTitle = (formData.get("title") as string) || "My Project";
  const title = rawTitle.slice(0, 100); // Same limit as renameProject
  const blocksXml = formData.get("blocks_xml") as string;
  const pythonCode = formData.get("python_code") as string;
  const lessonId = formData.get("lesson_id") as string | null;

  // Validate lessonId format if provided
  if (lessonId && !isValidUUID(lessonId)) {
    return { success: false, error: "Invalid lesson ID" };
  }

  const insertPayload: ProjectInsert = {
    profile_id: profile.id,
    family_id: profile.family_id,
    title,
    blocks_xml: blocksXml,
    python_code: pythonCode,
    lesson_id: lessonId || null,
  };

  // Cast needed because the hand-written Database type uses a custom
  // TableDefinition wrapper that doesn't match the SDK's expected shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any).insert(insertPayload);

  if (error) {
    return { success: false, error: "Failed to save project" };
  }

  // Check for newly earned badges after saving
  const newBadges = await evaluateBadges(supabase, profile.id);

  revalidatePath("/gallery");
  revalidatePath("/achievements");
  return { success: true, newBadges };
}

// ---------------------------------------------------------------------------
// Update lesson progress
// ---------------------------------------------------------------------------

interface ProgressResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  error?: string;
}

export async function updateProgress(
  lessonId: string,
  status: "in_progress" | "completed",
): Promise<ProgressResult> {
  if (!isValidUUID(lessonId)) {
    return { success: false, error: "Invalid lesson ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  // Fetch profile for this Clerk user
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Use upsert to atomically create-or-update, avoiding TOCTOU race
  // conditions. The progress table has UNIQUE (profile_id, lesson_id).
  const now = new Date().toISOString();

  if (status === "in_progress") {
    // Insert if not exists; if already tracked, this is a no-op.
    const upsertPayload: ProgressInsert = {
      profile_id: profile.id,
      lesson_id: lessonId,
      status: "in_progress",
      started_at: now,
      attempts: 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("progress") as any)
      .upsert(upsertPayload, {
        onConflict: "profile_id, lesson_id",
        ignoreDuplicates: true, // Don't overwrite if already exists
      });

    if (error) {
      return { success: false, error: "Failed to update progress" };
    }
  } else {
    // status === "completed"
    // Upsert creates the row if it doesn't exist, or updates if it does.
    const upsertPayload: ProgressInsert = {
      profile_id: profile.id,
      lesson_id: lessonId,
      status: "completed",
      started_at: now,
      completed_at: now,
      attempts: 1,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("progress") as any)
      .upsert(upsertPayload, {
        onConflict: "profile_id, lesson_id",
        ignoreDuplicates: false,
      });

    if (error) {
      return { success: false, error: "Failed to update progress" };
    }
  }

  // Check for newly earned badges after progress update
  let newBadges: EarnedBadgeInfo[] = [];
  if (status === "completed") {
    newBadges = await evaluateBadges(supabase, profile.id);
  }

  revalidatePath("/home");
  revalidatePath("/achievements");
  return { success: true, newBadges };
}

// ---------------------------------------------------------------------------
// Submit project to gallery
// ---------------------------------------------------------------------------

interface SubmitGalleryResult {
  success: boolean;
  error?: string;
}

export async function submitProjectToGallery(
  projectId: string,
): Promise<SubmitGalleryResult> {
  if (!isValidUUID(projectId)) {
    return { success: false, error: "Invalid project ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  // Verify the project belongs to the user (or their family if parent)
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Kids can only publish their own projects; parents can publish any family project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from("projects") as any)
    .update({ is_public: true })
    .eq("id", projectId)
    .eq("family_id", profile.family_id);

  if (profile.role !== "parent") {
    query = query.eq("profile_id", profile.id);
  }

  const { error } = await query;

  if (error) {
    return { success: false, error: "Failed to submit to gallery" };
  }

  revalidatePath("/gallery");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Delete project
// ---------------------------------------------------------------------------

interface DeleteProjectResult {
  success: boolean;
  error?: string;
}

export async function deleteProject(
  projectId: string,
): Promise<DeleteProjectResult> {
  if (!isValidUUID(projectId)) {
    return { success: false, error: "Invalid project ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  // Verify the project belongs to the user (or their family if parent)
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Kids can only delete their own projects; parents can delete any family project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from("projects") as any)
    .delete()
    .eq("id", projectId)
    .eq("family_id", profile.family_id);

  if (profile.role !== "parent") {
    query = query.eq("profile_id", profile.id);
  }

  const { error } = await query;

  if (error) {
    return { success: false, error: "Failed to delete project" };
  }

  revalidatePath("/gallery");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Rename project
// ---------------------------------------------------------------------------

interface RenameProjectResult {
  success: boolean;
  error?: string;
}

export async function renameProject(
  projectId: string,
  newTitle: string,
): Promise<RenameProjectResult> {
  if (!isValidUUID(projectId)) {
    return { success: false, error: "Invalid project ID" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const trimmed = newTitle.trim();
  if (!trimmed || trimmed.length > 100) {
    return { success: false, error: "Title must be 1-100 characters" };
  }

  const supabase = await getSupabase();

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id, role")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string; role: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Kids can only rename their own projects; parents can rename any family project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from("projects") as any)
    .update({ title: trimmed })
    .eq("id", projectId)
    .eq("family_id", profile.family_id);

  if (profile.role !== "parent") {
    query = query.eq("profile_id", profile.id);
  }

  const { error } = await query;

  if (error) {
    return { success: false, error: "Failed to rename project" };
  }

  revalidatePath("/gallery");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Record device flash (for badge awarding)
// ---------------------------------------------------------------------------

interface RecordFlashResult {
  success: boolean;
  newBadges?: EarnedBadgeInfo[];
  error?: string;
}

/**
 * Records a successful code flash (to physical device or simulator) in the
 * `device_sessions` table and evaluates badge criteria.
 *
 * Called from the DevicePanel and SimulatorPanel client components after code
 * has been successfully sent to the device or run in the simulator.
 */
export async function recordDeviceFlash(
  deviceType: "usb-serial" | "simulator",
): Promise<RecordFlashResult> {
  // TypeScript types are erased at runtime — validate the value
  if (deviceType !== "usb-serial" && deviceType !== "simulator") {
    return { success: false, error: "Invalid device type" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await getSupabase();

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Prevent duplicate sessions from rapid clicks: skip insert if a session
  // for this profile was recorded in the last 5 seconds.
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  const { data: recentSessions } = (await supabase
    .from("device_sessions")
    .select("id")
    .eq("profile_id", profile.id)
    .gte("connected_at", fiveSecondsAgo)
    .limit(1)) as { data: Array<{ id: string }> | null };

  if (recentSessions && recentSessions.length > 0) {
    // Already recorded recently — return success without inserting a dupe
    return { success: true };
  }

  // Insert a device session record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("device_sessions") as any).insert({
    profile_id: profile.id,
    device_type: deviceType,
  });

  if (error) {
    console.error("[recordDeviceFlash] Failed to insert device_session:", error instanceof Error ? error.message : "unknown error");
    return { success: false, error: "Failed to record flash" };
  }

  // Evaluate badges after recording the flash
  const newBadges = await evaluateBadges(supabase, profile.id);

  revalidatePath("/achievements");
  revalidatePath("/home");
  return { success: true, newBadges };
}
