import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface ConsentTokenRecord {
  id: string;
  family_id: string;
  expires_at: string;
  confirmed_at: string | null;
}

/**
 * GET /api/coppa-confirm?token=<token>
 *
 * Handles the COPPA "Email Plus" consent confirmation. When a parent clicks
 * the link in the consent confirmation email, this route:
 *
 * 1. Validates the token exists and is not expired
 * 2. Marks the token as confirmed
 * 3. Updates the family's coppa_consent_confirmed_at timestamp
 * 4. Redirects to a thank-you page
 *
 * If the token is invalid or expired, shows an appropriate message.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length < 10) {
    return redirectWithMessage(request, "invalid");
  }

  const supabase = createAdminSupabaseClient();

  // Look up the token (cast needed: table not yet in generated types)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenRecord, error: lookupError } = await (supabase
    .from("coppa_consent_tokens") as any)
    .select("id, family_id, expires_at, confirmed_at")
    .eq("token", token)
    .single() as { data: ConsentTokenRecord | null; error: unknown };

  if (lookupError || !tokenRecord) {
    return redirectWithMessage(request, "invalid");
  }

  // Already confirmed
  if (tokenRecord.confirmed_at) {
    return redirectWithMessage(request, "already_confirmed");
  }

  // Check expiration
  const expiresAt = new Date(tokenRecord.expires_at);
  if (expiresAt < new Date()) {
    return redirectWithMessage(request, "expired");
  }

  // Mark token as confirmed
  const now = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateTokenError } = await (supabase
    .from("coppa_consent_tokens") as any)
    .update({ confirmed_at: now })
    .eq("id", tokenRecord.id);

  if (updateTokenError) {
    console.error("[coppa-confirm] Failed to update token:", updateTokenError);
    return redirectWithMessage(request, "error");
  }

  // Update the family's consent confirmation timestamp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateFamilyError } = await (supabase
    .from("families") as any)
    .update({
      coppa_consent_confirmed_at: now,
      coppa_consent_method: "email_plus_verified",
    })
    .eq("id", tokenRecord.family_id);

  if (updateFamilyError) {
    console.error("[coppa-confirm] Failed to update family:", updateFamilyError);
    return redirectWithMessage(request, "error");
  }

  console.log(
    `[coppa-confirm] Consent confirmed for family=${tokenRecord.family_id}`,
  );

  return redirectWithMessage(request, "success");
}

function redirectWithMessage(request: NextRequest, status: string): NextResponse {
  const url = new URL("/coppa-confirmed", request.nextUrl.origin);
  url.searchParams.set("status", status);
  return NextResponse.redirect(url);
}
