"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import {
  buildWelcomeSubscriberHtml,
  buildWelcomeSubscriberText,
} from "@/lib/email/templates/welcome-subscriber";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SubscribeResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 320;
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

/**
 * Subscribe an email address to the TinkerSchool mailing list.
 *
 * - Validates email format
 * - Checks for honeypot (spam) field
 * - Inserts into email_subscribers (ignores duplicates gracefully)
 * - Sends a welcome email via Resend (fire-and-forget)
 */
export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  // Honeypot check — bots fill in hidden fields
  const honeypot = formData.get("website") as string | null;
  if (honeypot) {
    // Silently succeed so bots think it worked
    return { success: true };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const name = (formData.get("name") as string | null)?.trim() || null;
  const source = (formData.get("source") as string | null) ?? "unknown";
  const referrer = (formData.get("referrer") as string | null) ?? null;

  if (!email || !isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = createAdminSupabaseClient();

    // Use type assertion since email_subscribers may not be in generated types yet
    const { error: dbError } = await (supabase
      .from("email_subscribers") as ReturnType<typeof supabase.from>)
      .upsert(
        { email, name, source, referrer } as Record<string, unknown>,
        { onConflict: "email", ignoreDuplicates: true },
      );

    if (dbError) {
      console.error("[subscribe] DB error:", dbError);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    // Send welcome email (fire-and-forget — don't block the response)
    sendEmail({
      to: email,
      subject: "Welcome to TinkerSchool!",
      html: buildWelcomeSubscriberHtml({ name: name ?? undefined }),
      text: buildWelcomeSubscriberText({ name: name ?? undefined }),
    }).catch((err) => console.error("[subscribe] Welcome email failed:", err));

    return { success: true };
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
