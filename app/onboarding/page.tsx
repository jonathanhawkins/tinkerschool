import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  let userId: string | null = null;
  let parentName = "";
  let hasProfile = false;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    // Network error (e.g. Clerk unreachable) -- render the form anyway;
    // the server action will re-check auth before writing anything.
  }

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // Check whether the user already completed onboarding.
    const supabase = await createServerSupabaseClient();
    const { data: profile } = (await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", userId)
      .single()) as { data: { id: string } | null };

    hasProfile = !!profile;
  } catch {
    // Supabase unreachable -- let the client component handle it.
  }

  try {
    // Pre-fill the parent name from Clerk user data.
    const user = await currentUser();
    parentName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
  } catch {
    // Network error -- parentName stays empty, user can type it.
  }

  // Don't redirect server-side when a profile exists. The client component
  // needs to stay mounted for Steps 5-7 (which run AFTER profile creation).
  // The client handles the redirect when appropriate.
  return (
    <OnboardingForm parentNameDefault={parentName} hasProfile={hasProfile} />
  );
}
