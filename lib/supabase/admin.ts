import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

/**
 * Create a Supabase admin client that uses the service-role key.
 *
 * This client **bypasses RLS** and should only be used in trusted
 * server-side contexts such as:
 *
 *   - Clerk webhook handlers (syncing users to the profiles table)
 *   - Database migrations or one-off scripts
 *   - Background jobs (badge evaluation, analytics aggregation)
 *
 * NEVER expose this client or its key to the browser.
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
