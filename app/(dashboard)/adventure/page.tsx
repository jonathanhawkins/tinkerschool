import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth, getActiveKidProfile } from "@/lib/auth/require-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { parseActivityConfig } from "@/lib/activities/types";
import { computeDifficulty } from "@/lib/activities/adaptive-difficulty";
import { getAdventureById } from "@/lib/adventures/adventure-store";

import { AdventureShell } from "./adventure-shell";

export const metadata: Metadata = {
  title: "Daily Adventure",
  robots: { index: false, follow: false },
};

interface AdventurePageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdventurePage({ searchParams }: AdventurePageProps) {
  const { profile, supabase } = await requireAuth();
  const kidProfile = await getActiveKidProfile(profile, supabase);
  const activeProfile = kidProfile ?? profile;

  const params = await searchParams;
  const adventureId = params.id;

  if (!adventureId) {
    redirect("/home");
  }

  const adminClient = createAdminSupabaseClient();
  const adventure = await getAdventureById(adminClient, adventureId);

  if (!adventure) {
    redirect("/home");
  }

  // Parse the activity config
  const config = parseActivityConfig(
    adventure.content as Record<string, unknown>,
  );

  if (!config) {
    redirect("/home");
  }

  // Compute adaptive difficulty
  const difficulty = await computeDifficulty(
    supabase,
    activeProfile.id,
    adventure.subject_id,
    activeProfile.current_band,
  );

  // Apply adaptive passing score
  if (difficulty.passingScore !== 60) {
    config.passingScore = difficulty.passingScore;
  }

  return (
    <AdventureShell
      adventureId={adventure.id}
      profileId={activeProfile.id}
      title={adventure.title}
      description={adventure.description}
      storyText={adventure.story_text}
      subjectColor={adventure.subject_color}
      config={config}
      difficultyLevel={difficulty.level}
      encouragementMessage={difficulty.encouragementMessage}
    />
  );
}
