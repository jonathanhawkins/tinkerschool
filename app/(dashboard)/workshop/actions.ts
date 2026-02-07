"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  evaluateBadges,
  type EarnedBadgeInfo,
} from "@/lib/badges/evaluate-badges";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProgressInsert, ProjectInsert } from "@/lib/supabase/types";

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

  const supabase = await createServerSupabaseClient();

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

  const title = (formData.get("title") as string) || "My Project";
  const blocksXml = formData.get("blocks_xml") as string;
  const pythonCode = formData.get("python_code") as string;
  const lessonId = formData.get("lesson_id") as string | null;

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
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await createServerSupabaseClient();

  // Fetch profile for this Clerk user
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Check for an existing progress row
  const { data: existingRows } = (await supabase
    .from("progress")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("lesson_id", lessonId)) as {
    data: Array<{
      id: string;
      status: string;
      started_at: string | null;
      attempts: number;
    }> | null;
  };

  const existing = existingRows?.[0] ?? null;

  if (existing) {
    // Update the existing progress record
    const updates: Record<string, unknown> = {};

    if (status === "in_progress" && !existing.started_at) {
      updates.started_at = new Date().toISOString();
      updates.status = "in_progress";
    }

    if (status === "completed") {
      updates.status = "completed";
      updates.completed_at = new Date().toISOString();
      updates.attempts = (existing.attempts ?? 0) + 1;
      if (!existing.started_at) {
        updates.started_at = new Date().toISOString();
      }
    }

    if (Object.keys(updates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("progress") as any)
        .update(updates)
        .eq("id", existing.id);

      if (error) {
        return { success: false, error: "Failed to update progress" };
      }
    }
  } else {
    // Insert a new progress record
    const now = new Date().toISOString();

    const insertPayload: ProgressInsert = {
      profile_id: profile.id,
      lesson_id: lessonId,
      status,
      started_at: now,
      completed_at: status === "completed" ? now : null,
      attempts: status === "completed" ? 1 : 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("progress") as any).insert(
      insertPayload,
    );

    if (error) {
      return { success: false, error: "Failed to create progress" };
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
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any)
    .update({ is_public: true })
    .eq("id", projectId);

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
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await createServerSupabaseClient();

  // Verify the project belongs to the user's family
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any)
    .delete()
    .eq("id", projectId)
    .eq("family_id", profile.family_id);

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
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const trimmed = newTitle.trim();
  if (!trimmed || trimmed.length > 100) {
    return { success: false, error: "Title must be 1-100 characters" };
  }

  const supabase = await createServerSupabaseClient();

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id, family_id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string; family_id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any)
    .update({ title: trimmed })
    .eq("id", projectId)
    .eq("family_id", profile.family_id);

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
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const supabase = await createServerSupabaseClient();

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Insert a device session record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("device_sessions") as any).insert({
    profile_id: profile.id,
    device_type: deviceType,
  });

  if (error) {
    console.error("[recordDeviceFlash] Failed to insert device_session:", error);
    return { success: false, error: "Failed to record flash" };
  }

  // Evaluate badges after recording the flash
  const newBadges = await evaluateBadges(supabase, profile.id);

  revalidatePath("/achievements");
  revalidatePath("/home");
  return { success: true, newBadges };
}
