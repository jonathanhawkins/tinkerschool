import { auth } from "@clerk/nextjs/server";

import { getActiveKidProfile } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/supabase/types";

import { ChipTextFab } from "./chip-text-fab";

/**
 * Server component wrapper for ChipTextFab.
 *
 * Fetches the active kid profile data (name, age, band) from Supabase
 * and passes it to the client-side ChipTextFab component.
 *
 * Renders nothing if the user is not authenticated or has no profile.
 * This is intentional -- unauthenticated users should not see Chip.
 */
export async function ChipTextFabServer() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const supabase = createAdminSupabaseClient();

    // Fetch the profile for the authenticated user
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!profile) return null;

    const typedProfile = profile as Profile;

    // Resolve the active kid profile (respects kid-switcher cookie)
    const kidProfile = (await getActiveKidProfile(typedProfile, supabase)) ?? typedProfile;

    // Approximate age from grade level (grade + 5), default to 7
    const age =
      kidProfile.grade_level != null
        ? Math.max(3, Math.min(14, kidProfile.grade_level + 5))
        : 7;

    return (
      <ChipTextFab
        kidName={kidProfile.display_name}
        age={age}
        band={kidProfile.current_band}
      />
    );
  } catch {
    // Don't crash the layout if profile fetch fails
    return null;
  }
}
