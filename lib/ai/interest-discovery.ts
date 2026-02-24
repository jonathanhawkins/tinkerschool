/**
 * Interest Discovery
 *
 * Lightweight keyword matching (no AI cost) that scans kid chat messages
 * for interest signals and appends new interests to the learning profile.
 *
 * Runs after each chat persistence as fire-and-forget.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Interest categories with keyword triggers
// ---------------------------------------------------------------------------

interface InterestCategory {
  name: string;
  keywords: RegExp;
}

/**
 * 15 interest categories with word-boundary regex patterns.
 * Each pattern matches common kid-language signals for the interest.
 */
export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    name: "dinosaurs",
    keywords: /\b(dinosaurs?|dinos?|t-?rex|triceratops|stegosaurus|velociraptor|jurassic|fossils?)\b/i,
  },
  {
    name: "space",
    keywords: /\b(space|planets?|rockets?|astronauts?|moons?|stars?|mars|jupiter|saturn|galaxy|nasa|orbit|meteors?|comets?|aliens?)\b/i,
  },
  {
    name: "animals",
    keywords: /\b(animals?|dogs?|cats?|puppies|puppy|kittens?|horses?|dolphins?|whales?|sharks?|lions?|tigers?|bears?|elephants?|penguins?|bunn(?:y|ies)|rabbits?|pets?|zoo)\b/i,
  },
  {
    name: "sports",
    keywords: /\b(soccer|football|basketball|baseball|tennis|swimming|gymnastics|karate|skating|hockey|volleyball|sports?)\b/i,
  },
  {
    name: "art & drawing",
    keywords: /\b(draw|drawing|paint|painting|colors?|crayons?|sketch|doodle|watercolors?|clay|sculpt)\b/i,
  },
  {
    name: "music",
    keywords: /\b(music|songs?|sing|singing|piano|guitar|drums?|violin|ukulele|concert|band|melody|dance|dancing)\b/i,
  },
  {
    name: "video games",
    keywords: /\b(minecraft|roblox|fortnite|mario|zelda|pokemon|video\s*games?|gaming|nintendo|playstation|xbox)\b/i,
  },
  {
    name: "superheroes",
    keywords: /\b(superhero(?:es)?|spider-?man|batman|superman|avengers|marvel|hulk|iron\s*man|wonder\s*woman|heroes?|superpowers?)\b/i,
  },
  {
    name: "cooking & food",
    keywords: /\b(cook|bake|baking|recipes?|cakes?|cookies?|pizza|chocolate|kitchen|chef|food|cupcakes?|ice\s*cream)\b/i,
  },
  {
    name: "nature",
    keywords: /\b(nature|trees?|flowers?|garden|forest|mountains?|ocean|beach|rivers?|waterfalls?|butterfl(?:y|ies)|bugs?|insects?)\b/i,
  },
  {
    name: "vehicles",
    keywords: /\b(cars?|trucks?|trains?|airplanes?|helicopters?|boats?|ships?|race\s*cars?|monster\s*trucks?|fire\s*trucks?|ambulances?)\b/i,
  },
  {
    name: "robots & technology",
    keywords: /\b(robots?|ai|computers?|technology|machines?|inventions?|inventors?|engineers?|circuits?|gadgets?|3d\s*print)\b/i,
  },
  {
    name: "fairy tales & fantasy",
    keywords: /\b(fair(?:y|ies)|princess|prince|dragons?|unicorns?|wizards?|magic|castles?|knights?|fairy\s*tales?|mermaids?|el(?:f|ves))\b/i,
  },
  {
    name: "science experiments",
    keywords: /\b(experiments?|volcanos?|volcanoes?|slime|magnets?|crystals?|microscopes?|laboratory|scientists?|potions?|chemicals?|fizz|bubbles?)\b/i,
  },
  {
    name: "building & construction",
    keywords: /\b(legos?|build|building|blocks?|construct|towers?|bridges?|forts?|houses?|architecture|design|create)\b/i,
  },
];

/** Maximum number of interests to store per child. */
const MAX_INTERESTS = 20;

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Detect interest signals from a kid's chat message.
 * Returns an array of newly detected interest names.
 */
export function detectInterests(message: string): string[] {
  const detected: string[] = [];

  for (const category of INTEREST_CATEGORIES) {
    if (category.keywords.test(message)) {
      detected.push(category.name);
    }
  }

  return detected;
}

/**
 * Scan a kid's message for interests and append any new ones to the
 * learning profile. Deduplicates and caps at MAX_INTERESTS.
 *
 * Uses admin client (bypasses RLS) since this runs fire-and-forget.
 */
export async function discoverInterests(
  supabase: SupabaseClient<Database>,
  profileId: string,
  message: string,
): Promise<void> {
  const newInterests = detectInterests(message);
  if (newInterests.length === 0) return;

  // Fetch current interests
  const { data: profile, error: fetchError } = (await supabase
    .from("learning_profiles")
    .select("id, interests")
    .eq("profile_id", profileId)
    .single()) as { data: { id: string; interests: string[] } | null; error: unknown };

  if (fetchError) {
    console.error("[interest-discovery] Failed to fetch learning profile:", fetchError);
    return;
  }

  if (!profile) return;

  const currentSet = new Set(profile.interests ?? []);
  const additions: string[] = [];

  for (const interest of newInterests) {
    if (!currentSet.has(interest)) {
      additions.push(interest);
      currentSet.add(interest);
    }
  }

  if (additions.length === 0) return;

  // Cap at MAX_INTERESTS
  const updatedInterests = [...currentSet].slice(0, MAX_INTERESTS);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("learning_profiles") as any)
    .update({
      interests: updatedInterests,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
}
