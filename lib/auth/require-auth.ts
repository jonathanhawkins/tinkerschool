import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createServerSupabaseClient();
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
