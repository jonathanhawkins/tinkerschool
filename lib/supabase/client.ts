import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Create (or return the existing) Supabase client for use in Client
 * Components (browser).
 *
 * Uses the public anon key which respects RLS policies.
 * The client is created as a singleton so multiple components share the
 * same GoTrue session and realtime connection.
 *
 * TODO: Once Clerk JWT integration is wired up, pass the Clerk session
 *       token via `global.headers` or `accessToken` so RLS policies can
 *       identify the current user.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // In the browser the Clerk SDK manages auth; we disable Supabase's
      // own auth persistence to avoid conflicts.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return browserClient;
}
