import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

// RESEND_API_KEY — required for email delivery.
// Add to .env.local for local dev, Vercel env vars for production.
// When not set, email sending is silently skipped (graceful degradation).
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ---------------------------------------------------------------------------
// Client (lazy singleton)
// ---------------------------------------------------------------------------

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SendEmailInput {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** HTML body */
  html: string;
  /** Plain text fallback (optional but recommended for accessibility) */
  text?: string;
}

interface SendEmailResult {
  /** Whether the email was sent (or skipped because RESEND_API_KEY is not set) */
  success: boolean;
  /** Resend message ID if sent successfully */
  messageId?: string;
  /** Whether sending was skipped because no API key is configured */
  skipped?: boolean;
}

// ---------------------------------------------------------------------------
// Default sender
// ---------------------------------------------------------------------------

const FROM_ADDRESS = "TinkerSchool <noreply@tinkerschool.ai>";

// ---------------------------------------------------------------------------
// Send email utility
// ---------------------------------------------------------------------------

/**
 * Send a transactional email via Resend.
 *
 * - If RESEND_API_KEY is not configured, the call is silently skipped.
 * - Errors are logged but never thrown — this is designed for fire-and-forget
 *   usage where email delivery should not break the calling action.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const client = getResendClient();

  if (!client) {
    console.log("[email] RESEND_API_KEY not configured — skipping email delivery");
    return { success: true, skipped: true };
  }

  const { to, subject, html, text } = input;

  try {
    const { data, error } = await client.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[email] Resend API error:", error);
      return { success: false };
    }

    console.log(`[email] Sent "${subject}" to ${to} (id: ${data?.id})`);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return { success: false };
  }
}
