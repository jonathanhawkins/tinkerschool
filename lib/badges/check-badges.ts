/**
 * Badge checking entry point.
 *
 * Re-exports the core evaluateBadges function under the name
 * `checkAndAwardBadges` for use in Server Actions and API routes.
 *
 * Usage:
 *   const newBadges = await checkAndAwardBadges(supabase, profileId);
 *   // newBadges is an array of { name, icon, description } for celebration UI
 */
export {
  evaluateBadges as checkAndAwardBadges,
  type EarnedBadgeInfo,
} from "./evaluate-badges";
