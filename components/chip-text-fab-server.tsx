import { auth } from "@clerk/nextjs/server";

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

    // If the user is a parent, resolve to the first kid profile
    let kidProfile = typedProfile;
    if (typedProfile.role === "parent") {
      const { data: kids } = await supabase
        .from("profiles")
        .select("*")
        .eq("family_id", typedProfile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1);

      const firstKid = (kids as Profile[] | null)?.[0];
      if (firstKid) kidProfile = firstKid;
    }

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
