import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // If the user already has a profile, skip onboarding.
  const supabase = await createServerSupabaseClient();
  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", userId)
    .single()) as { data: { id: string } | null };

  if (profile) {
    redirect("/home");
  }

  // Pre-fill the parent name from Clerk user data.
  const user = await currentUser();
  const parentName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";

  return <OnboardingForm parentNameDefault={parentName} />;
}
