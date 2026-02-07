import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

/**
 * Create a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * Currently uses the service-role key so queries bypass RLS.
 * TODO: Replace with a Clerk-issued JWT per request so RLS policies are
 *       enforced server-side (see lib/clerk/supabase-token.ts).
 */
export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      // Server-side: we don't persist sessions or auto-refresh tokens.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
