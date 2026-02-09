import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseToken } from "@/lib/clerk/supabase-token";
import type { Database } from "@/lib/supabase/types";

/**
 * Create a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * SECURITY: Uses a Clerk-issued JWT so that Supabase RLS policies are
 * enforced server-side. The JWT is obtained from Clerk's "supabase" JWT
 * template, which signs the token with Supabase's JWT secret.
 *
 * Throws if no Clerk JWT is available. For unauthenticated contexts
 * (webhooks, background jobs), use createAdminSupabaseClient() instead.
 *
 * Setup instructions: see lib/clerk/supabase-token.ts
 */
export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  // Get a Clerk-issued JWT for RLS-enforced access.
  // Never fall back to the service-role key — use createAdminSupabaseClient()
  // explicitly for the rare cases that genuinely need RLS bypass (webhooks,
  // AI buddy persistence).
  const clerkToken = await getSupabaseToken();

  if (!clerkToken) {
    throw new Error(
      "[supabase/server] No Clerk JWT available. Ensure the user is " +
        "authenticated and the Clerk 'supabase' JWT template is configured. " +
        "Use createAdminSupabaseClient() for unauthenticated contexts.",
    );
  }

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
