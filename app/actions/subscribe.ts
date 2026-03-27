"use server";

import { headers } from "next/headers";

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
// Rate limiting (in-memory, per-IP)
// ---------------------------------------------------------------------------

/** In-memory rate limiter: max 5 subscribe attempts per IP per hour. */
const ipSubscribeHits = new Map<string, { count: number; resetAt: number }>();
const MAX_SUBSCRIBE_HITS = 5;
const SUBSCRIBE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkSubscribeRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubscribeHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipSubscribeHits.set(ip, { count: 1, resetAt: now + SUBSCRIBE_WINDOW_MS });
    return false; // not limited
  }

  entry.count++;
  return entry.count > MAX_SUBSCRIBE_HITS;
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

/**
 * Subscribe an email address to the TinkerSchool mailing list.
 *
 * - Rate limits by IP (5 per hour)
 * - Validates email format
 * - Checks for honeypot (spam) field
 * - Inserts into email_subscribers (ignores duplicates gracefully)
 * - Sends a welcome email via Resend (fire-and-forget)
 */
export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  // Rate limit by IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (checkSubscribeRateLimit(ip)) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  // Honeypot check — bots fill in hidden fields
  const honeypot = formData.get("website") as string | null;
  if (honeypot) {
    // Silently succeed so bots think it worked
    return { success: true };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const rawName = (formData.get("name") as string | null)?.trim() || null;
  // Sanitize name: truncate and strip control characters
  const name = rawName ? rawName.slice(0, 100).replace(/[\x00-\x1f\x7f]/g, "") : null;
  const source = ((formData.get("source") as string | null) ?? "unknown").slice(0, 50);
  const referrer = ((formData.get("referrer") as string | null) ?? null)?.slice(0, 500) ?? null;

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
