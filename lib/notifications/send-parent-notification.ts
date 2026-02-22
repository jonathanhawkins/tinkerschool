import { randomBytes } from "node:crypto";

import { clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/email/resend";
import {
  buildCoppaConsentHtml,
  buildCoppaConsentText,
} from "@/lib/email/templates/coppa-consent-confirmation";
import {
  buildParentNotificationHtml,
  buildParentNotificationText,
} from "@/lib/email/templates/parent-notification";
import type { NotificationType } from "@/lib/supabase/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tinkerschool.ai";

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

  // 5. Log + send emails (fire-and-forget, non-blocking)
  console.log(
    `[notifications] Created ${notificationRows.length} notification(s) ` +
      `for family=${kidProfile.family_id} type=${type} ` +
      `kid=${kidProfile.display_name} ` +
      `parentEmails=[${parentEmails.join(", ")}]`,
  );

  // Send email to each parent (non-blocking)
  for (const email of parentEmails) {
    const html = buildParentNotificationHtml({
      title,
      body,
      kidName: kidProfile.display_name,
    });
    const text = buildParentNotificationText({
      title,
      body,
      kidName: kidProfile.display_name,
    });
    void sendEmail({ to: email, subject: `TinkerSchool: ${title}`, html, text });
  }

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
/**
 * Send a COPPA consent confirmation notification to the parent after
 * onboarding. This implements the "Email Plus" pattern recommended by
 * the FTC: after the parent provides initial consent via the onboarding
 * checkbox, we send a confirmation email summarizing what data is
 * collected, which third parties receive it, and how to revoke consent.
 *
 * The notification is stored in the database and will be delivered via
 * email when email delivery is implemented. For now it is logged and
 * available in the parent dashboard notification feed.
 *
 * NOTE: A full "Email Plus" implementation requires the parent to take
 * an affirmative action (click a link or reply) to confirm consent, with
 * automatic data deletion if they do not confirm within a reasonable
 * period (e.g. 48 hours). This is a TODO for production readiness.
 */
export async function sendCoppaConsentConfirmation(
  supabase: SupabaseClient,
  {
    parentProfileId,
    familyId,
    kidName,
    parentEmail,
  }: {
    parentProfileId: string;
    familyId: string;
    kidName: string;
    parentEmail: string | null;
  },
): Promise<void> {
  const title = "COPPA Consent Confirmation";
  const body =
    `You have consented to TinkerSchool collecting the following information ` +
    `from ${kidName} for educational purposes:\n\n` +
    `- First name and grade level (lesson personalization)\n` +
    `- Learning progress, projects, and quiz scores\n` +
    `- AI chat conversations with Chip (viewable in your parent dashboard)\n` +
    `- Learning style preferences and skill proficiency levels\n\n` +
    `This data is shared with:\n` +
    `- Anthropic (Claude AI) for personalized tutoring\n` +
    `- Supabase for secure database storage\n\n` +
    `Your data is NEVER sold or used for advertising.\n\n` +
    `To exercise your rights:\n` +
    `- Review data: Parent Dashboard > Settings\n` +
    `- Export data: Parent Dashboard > Settings > Export Child Data\n` +
    `- Delete data: Parent Dashboard > Settings > Delete Account\n` +
    `- Revoke consent: Email privacy@tinkerschool.ai\n\n` +
    `Privacy Policy: https://tinkerschool.ai/privacy`;

  const notificationRow = {
    family_id: familyId,
    recipient_profile_id: parentProfileId,
    kid_profile_id: null,
    type: "system" as const,
    title,
    body,
    metadata: {
      kid_name: kidName,
      parent_email: parentEmail,
      notification_subtype: "coppa_consent_confirmation",
      consent_timestamp: new Date().toISOString(),
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("notifications") as any).insert(
    notificationRow,
  );

  if (error) {
    console.error(
      "[notifications] Failed to insert COPPA consent confirmation:",
      error,
    );
  } else {
    console.log(
      `[notifications] COPPA consent confirmation created for ` +
        `family=${familyId} kid=${kidName} email=${parentEmail ?? "unknown"}`,
    );
  }

  // Create a verification token for Email Plus confirmation
  let verificationUrl: string | undefined;
  if (parentEmail) {
    try {
      const token = randomBytes(32).toString("hex");
      const { error: tokenError } = await supabase
        .from("coppa_consent_tokens")
        .insert({
          family_id: familyId,
          token,
          parent_email: parentEmail,
        });

      if (tokenError) {
        console.error("[notifications] Failed to create consent verification token:", tokenError);
      } else {
        verificationUrl = `${APP_URL}/api/coppa-confirm?token=${token}`;
      }
    } catch (err) {
      console.error("[notifications] Failed to create consent verification token:", err);
    }
  }

  // Send COPPA consent confirmation email via Resend (fire-and-forget)
  if (parentEmail) {
    const consentTimestamp = new Date().toISOString();
    const html = buildCoppaConsentHtml({ kidName, consentTimestamp, verificationUrl });
    const text = buildCoppaConsentText({ kidName, consentTimestamp, verificationUrl });
    void sendEmail({
      to: parentEmail,
      subject: "Action Required: Confirm COPPA Consent — TinkerSchool",
      html,
      text,
    });
  }
}

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
