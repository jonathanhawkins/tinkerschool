import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

interface AuthResult {
  userId: string;
  profile: Profile;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

/**
 * Server-side auth guard. Redirects to sign-in if the user is not
 * authenticated. Fetches the matching Supabase profile and redirects to
 * onboarding if the profile has not been created yet.
 *
 * Returns the Clerk userId, the profile row, and a Supabase client
 * scoped to the current request.
 *
 * If the Clerk "supabase" JWT template is not configured, falls back to
 * the admin client so the app remains functional during development.
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    // Clerk session exists but Supabase JWT is unavailable (template not
    // configured, token expired, etc.). Fall back to the admin client so
    // the page renders instead of causing a redirect loop.
    console.warn(
      "[require-auth] Supabase JWT unavailable, falling back to admin client. " +
        "Configure the Clerk 'supabase' JWT template for RLS-enforced access.",
    );
    supabase = createAdminSupabaseClient();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  return { userId, profile, supabase };
}
