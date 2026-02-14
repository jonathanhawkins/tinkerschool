import { clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { NotificationType } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParentNotificationInput {
  /** The kid profile that triggered the notification */
  kidProfileId: string;
  /** Notification category */
  type: NotificationType;
  /** Short notification title (shown in notification list) */
  title: string;
  /** Longer notification body (shown in detail / email) */
  body: string;
  /** Optional structured metadata (lesson name, subject, score, etc.) */
  metadata?: Record<string, unknown>;
}

interface NotificationResult {
  /** Whether at least one notification was created */
  success: boolean;
  /** Number of parent notifications inserted */
  notificationCount: number;
  /** Parent email addresses found (for future email delivery) */
  parentEmails: string[];
}

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Create notification records for all parents in a kid's family.
 *
 * This function:
 * 1. Looks up the kid's family_id
 * 2. Finds all parent profiles in that family
 * 3. Resolves parent email addresses from Clerk
 * 4. Inserts a notification record per parent
 * 5. Logs the notification (actual email sending is a future enhancement)
 *
 * Designed to be called fire-and-forget from server actions -- failures
 * are logged but never thrown so they don't break the calling action.
 */
export async function sendParentNotification(
  supabase: SupabaseClient,
  input: ParentNotificationInput,
): Promise<NotificationResult> {
  const { kidProfileId, type, title, body, metadata = {} } = input;

  // 1. Look up the kid's profile to get family_id and display_name
  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("id, family_id, display_name")
    .eq("id", kidProfileId)
    .single()) as {
    data: { id: string; family_id: string; display_name: string } | null;
  };

  if (!kidProfile) {
    console.warn(
      `[notifications] Kid profile not found: ${kidProfileId}`,
    );
    return { success: false, notificationCount: 0, parentEmails: [] };
  }

  // 2. Find all parent profiles in the same family
  const { data: parentProfiles } = (await supabase
    .from("profiles")
    .select("id, clerk_id")
    .eq("family_id", kidProfile.family_id)
    .eq("role", "parent")) as {
    data: Array<{ id: string; clerk_id: string }> | null;
  };

  if (!parentProfiles || parentProfiles.length === 0) {
    console.warn(
      `[notifications] No parent profiles found for family: ${kidProfile.family_id}`,
    );
    return { success: false, notificationCount: 0, parentEmails: [] };
  }

  // 3. Resolve parent emails from Clerk (best-effort, non-blocking)
  const parentEmails: string[] = [];
  try {
    const clerk = await clerkClient();
    const emailLookups = await Promise.allSettled(
      parentProfiles.map(async (parent) => {
        const user = await clerk.users.getUser(parent.clerk_id);
        const primaryEmail = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId,
        );
        return primaryEmail?.emailAddress ?? null;
      }),
    );

    for (const result of emailLookups) {
      if (result.status === "fulfilled" && result.value) {
        parentEmails.push(result.value);
      }
    }
  } catch (err) {
    // Clerk lookup failure is non-fatal -- we still insert the DB record
    console.warn("[notifications] Failed to look up parent emails from Clerk:", err);
  }

  // 4. Insert notification records (one per parent)
  const notificationRows = parentProfiles.map((parent) => ({
    family_id: kidProfile.family_id,
    recipient_profile_id: parent.id,
    kid_profile_id: kidProfileId,
    type,
    title,
    body,
    metadata: {
      ...metadata,
      kid_name: kidProfile.display_name,
    },
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (supabase.from("notifications") as any).insert(
    notificationRows,
  );

  if (insertError) {
    console.error(
      "[notifications] Failed to insert notification records:",
      insertError,
    );
    return { success: false, notificationCount: 0, parentEmails };
  }

  // 5. Log for observability (email delivery will be added later)
  console.log(
    `[notifications] Created ${notificationRows.length} notification(s) ` +
      `for family=${kidProfile.family_id} type=${type} ` +
      `kid=${kidProfile.display_name} ` +
      `parentEmails=[${parentEmails.join(", ")}]`,
  );

  return {
    success: true,
    notificationCount: notificationRows.length,
    parentEmails,
  };
}

// ---------------------------------------------------------------------------
// Convenience: lesson completion notification
// ---------------------------------------------------------------------------

/**
 * Send a "lesson completed" notification to the kid's parent(s).
 *
 * Looks up the lesson title and subject to build a descriptive message.
 * Designed to be called non-blocking after marking a lesson as completed.
 */
export async function sendLessonCompletionNotification(
  supabase: SupabaseClient,
  kidProfileId: string,
  lessonId: string,
  score: number,
): Promise<NotificationResult> {
  // Look up lesson details for a descriptive notification
  const { data: lesson } = (await supabase
    .from("lessons")
    .select("title, subject_id, subjects(name, slug)")
    .eq("id", lessonId)
    .single()) as {
    data: {
      title: string;
      subject_id: string | null;
      subjects: { name: string; slug: string } | null;
    } | null;
  };

  const lessonTitle = lesson?.title ?? "a lesson";
  const subjectName = lesson?.subjects?.name ?? "TinkerSchool";
  const subjectSlug = lesson?.subjects?.slug;

  // Look up kid name for the notification message
  const { data: kidProfile } = (await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", kidProfileId)
    .single()) as { data: { display_name: string } | null };

  const kidName = kidProfile?.display_name ?? "Your child";

  return sendParentNotification(supabase, {
    kidProfileId,
    type: "lesson_completed",
    title: `${kidName} completed a ${subjectName} lesson!`,
    body: `${kidName} finished "${lessonTitle}" with a score of ${score}%. Great job!`,
    metadata: {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      subject_name: subjectName,
      subject_slug: subjectSlug,
      score,
    },
  });
}
