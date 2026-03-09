import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/** Cookie name used to persist the active kid profile across navigations. */
export const ACTIVE_KID_COOKIE = "tinkerschool_active_kid";

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

/**
 * Given a parent profile, resolves the active kid profile in the same family.
 * If the profile is already a kid, returns it as-is. Returns null if no kid
 * profiles exist in the family.
 *
 * The active kid is determined by the `tinkerschool_active_kid` cookie. If
 * the cookie is not set or references a kid not in this family, falls back
 * to the first kid by creation date.
 *
 * Used by kid-facing dashboard pages (Mission Control, Subjects, etc.) that
 * need the kid's display_name, current_band, and profile.id for progress
 * queries instead of the parent's.
 */
export async function getActiveKidProfile(
  profile: Profile,
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
): Promise<Profile | null> {
  if (profile.role === "kid") {
    return profile;
  }

  // Fetch all kid profiles in this family (ordered by creation date)
  const { data: kids } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid")
    .order("created_at");

  const safeKids = (kids as Profile[] | null) ?? [];
  if (safeKids.length === 0) return null;

  // Check if a specific kid is selected via cookie
  const cookieStore = await cookies();
  const activeKidId = cookieStore.get(ACTIVE_KID_COOKIE)?.value;

  if (activeKidId) {
    const selected = safeKids.find((k) => k.id === activeKidId);
    if (selected) return selected;
  }

  // Fall back to the first kid
  return safeKids[0];
}

/**
 * Fetch all kid profiles in the current user's family. Useful for building
 * kid-switcher UIs. Returns an empty array if no kids exist.
 */
export async function getFamilyKids(
  profile: Profile,
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
): Promise<Profile[]> {
  const { data: kids } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid")
    .order("created_at");

  return (kids as Profile[] | null) ?? [];
}
