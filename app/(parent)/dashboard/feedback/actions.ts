"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type {
  Feedback,
  FeedbackCategory,
  FeedbackInsert,
  FeedbackStatus,
  FeedbackUpdate,
  Profile,
} from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_CATEGORIES: FeedbackCategory[] = [
  "bug",
  "feature_request",
  "general",
];

const VALID_STATUSES: FeedbackStatus[] = [
  "new",
  "in_review",
  "planned",
  "resolved",
  "closed",
];

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_ADMIN_NOTES_LENGTH = 2000;

/**
 * The Clerk user ID of the site owner/admin who can access the admin panel.
 * In production, this would come from an environment variable.
 */
function getSiteAdminClerkIds(): string[] {
  const envIds = process.env.SITE_ADMIN_CLERK_IDS;
  if (envIds) {
    return envIds.split(",").map((id) => id.trim()).filter(Boolean);
  }
  // Fallback: all parents are treated as potential admins in dev mode
  return [];
}

/**
 * Check if the current user is a site admin.
 * Site admins are identified by their Clerk user IDs.
 * In development without SITE_ADMIN_CLERK_IDS, any parent is treated as admin.
 */
async function requireSiteAdmin(): Promise<{
  userId: string;
  profile: Profile;
}> {
  const { userId, profile } = await requireAuth();

  if (profile.role !== "parent") {
    throw new Error("Only parents can access the admin panel.");
  }

  const adminIds = getSiteAdminClerkIds();

  // If no admin IDs configured, allow any parent in development
  if (adminIds.length === 0 && process.env.NODE_ENV !== "production") {
    return { userId, profile };
  }

  if (!adminIds.includes(userId)) {
    throw new Error("Unauthorized: not a site admin.");
  }

  return { userId, profile };
}

// ---------------------------------------------------------------------------
// Submit feedback (parent-facing)
// ---------------------------------------------------------------------------

interface SubmitFeedbackInput {
  category: FeedbackCategory;
  title: string;
  description: string;
  pageUrl?: string;
  userAgent?: string;
}

interface SubmitFeedbackResult {
  success: boolean;
  error?: string;
}

export async function submitFeedback(
  input: SubmitFeedbackInput,
): Promise<SubmitFeedbackResult> {
  // Auth
  const { profile } = await requireAuth();

  if (profile.role !== "parent") {
    return { success: false, error: "Only parents can submit feedback." };
  }

  // Validate category
  if (!VALID_CATEGORIES.includes(input.category)) {
    return { success: false, error: "Invalid feedback category." };
  }

  // Validate title
  const title = input.title.trim();
  if (!title) {
    return { success: false, error: "Title is required." };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return {
      success: false,
      error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    };
  }

  // Validate description
  const description = input.description.trim();
  if (!description) {
    return { success: false, error: "Description is required." };
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      success: false,
      error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    };
  }

  // Insert using admin client (RLS INSERT policy requires parent role check
  // via JWT, but we already verified role above -- admin client is simpler
  // and avoids JWT template issues in dev).
  const supabase = createAdminSupabaseClient();

  const row: FeedbackInsert = {
    profile_id: profile.id,
    family_id: profile.family_id,
    category: input.category,
    title,
    description,
    page_url: input.pageUrl || null,
    user_agent: input.userAgent || null,
  };

  const { error } = await supabase.from("feedback").insert(row as never);

  if (error) {
    console.error("[feedback] Insert failed:", error);
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }

  revalidatePath("/dashboard/feedback");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Get feedback for the current parent (their own submissions)
// ---------------------------------------------------------------------------

export async function getMyFeedback(): Promise<Feedback[]> {
  const { profile } = await requireAuth();

  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[feedback] Fetch own feedback failed:", error);
    return [];
  }

  return (data ?? []) as Feedback[];
}

// ---------------------------------------------------------------------------
// Admin: get all feedback with submitter info
// ---------------------------------------------------------------------------

export interface FeedbackWithProfile extends Feedback {
  profiles: {
    display_name: string;
    role: string;
    clerk_id: string;
  };
}

export async function getAllFeedback(): Promise<FeedbackWithProfile[]> {
  await requireSiteAdmin();

  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*, profiles(display_name, role, clerk_id)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[feedback] Admin fetch failed:", error);
    return [];
  }

  return (data ?? []) as FeedbackWithProfile[];
}

// ---------------------------------------------------------------------------
// Admin: update feedback status and/or admin notes
// ---------------------------------------------------------------------------

interface UpdateFeedbackInput {
  feedbackId: string;
  status?: FeedbackStatus;
  adminNotes?: string;
}

interface UpdateFeedbackResult {
  success: boolean;
  error?: string;
}

export async function updateFeedback(
  input: UpdateFeedbackInput,
): Promise<UpdateFeedbackResult> {
  await requireSiteAdmin();

  // Validate status if provided
  if (input.status && !VALID_STATUSES.includes(input.status)) {
    return { success: false, error: "Invalid status." };
  }

  // Validate admin notes length
  if (
    input.adminNotes !== undefined &&
    input.adminNotes.length > MAX_ADMIN_NOTES_LENGTH
  ) {
    return {
      success: false,
      error: `Admin notes must be ${MAX_ADMIN_NOTES_LENGTH} characters or fewer.`,
    };
  }

  const supabase = createAdminSupabaseClient();

  const update: FeedbackUpdate = {};
  if (input.status) {
    update.status = input.status;
  }
  if (input.adminNotes !== undefined) {
    update.admin_notes = input.adminNotes || null;
  }

  const { error } = await supabase
    .from("feedback")
    .update(update as never)
    .eq("id", input.feedbackId);

  if (error) {
    console.error("[feedback] Admin update failed:", error);
    return { success: false, error: "Failed to update feedback." };
  }

  revalidatePath("/dashboard/feedback/admin");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Admin check (used by pages to conditionally show admin link)
// ---------------------------------------------------------------------------

export async function checkIsSiteAdmin(): Promise<boolean> {
  try {
    const { userId, profile } = await requireAuth();

    if (profile.role !== "parent") return false;

    const adminIds = getSiteAdminClerkIds();

    // In development without admin IDs configured, any parent is admin
    if (adminIds.length === 0 && process.env.NODE_ENV !== "production") {
      return true;
    }

    return adminIds.includes(userId);
  } catch {
    return false;
  }
}
