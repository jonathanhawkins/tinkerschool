import { auth } from "@clerk/nextjs/server";

/**
 * Get a Clerk-issued JWT scoped for Supabase.
 *
 * Requires a "supabase" JWT template configured in the Clerk Dashboard:
 *   1. Go to Clerk Dashboard → JWT Templates → New Template
 *   2. Name: "supabase"
 *   3. Signing algorithm: HS256
 *   4. Signing key: your Supabase JWT secret (Settings → API → JWT Secret)
 *   5. Claims: { "role": "authenticated", "sub": "{{user.id}}" }
 *
 * Returns null if no session exists or the template isn't configured.
 */
export async function getSupabaseToken(): Promise<string | null> {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "supabase" });
    return token;
  } catch {
    // Template not configured or no active session
    return null;
  }
}
