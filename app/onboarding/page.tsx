import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { checkInvitedParentStatus } from "./actions";
import { InvitedParentOnboarding } from "./invited-parent-onboarding";
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

  // If the user has a profile, they don't need onboarding at all.
  // (Unless they're resuming steps 5-7, which the client handles.)
  // Check if this is an invited parent who needs simplified onboarding.
  let invitedParentInfo = { isInvitedParent: false, familyName: "" };
  if (!hasProfile) {
    try {
      const info = await checkInvitedParentStatus();
      if (info.isInvitedParent) {
        invitedParentInfo = {
          isInvitedParent: true,
          familyName: info.familyName ?? "",
        };
      }
    } catch {
      // If check fails, fall through to normal onboarding
    }
  }

  try {
    // Pre-fill the parent name from Clerk user data.
    const user = await currentUser();
    parentName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
  } catch {
    // Network error -- parentName stays empty, user can type it.
  }

  // Invited parent: show simplified onboarding
  if (invitedParentInfo.isInvitedParent) {
    return (
      <InvitedParentOnboarding
        familyName={invitedParentInfo.familyName}
        parentNameDefault={parentName}
      />
    );
  }

  // Don't redirect server-side when a profile exists. The client component
  // needs to stay mounted for Steps 5-7 (which run AFTER profile creation).
  // The client handles the redirect when appropriate.
  return (
    <OnboardingForm parentNameDefault={parentName} hasProfile={hasProfile} />
  );
}
