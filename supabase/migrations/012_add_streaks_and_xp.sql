-- Migration: Add streak tracking and XP/level columns to profiles
-- These power the gamification system (streaks, XP awards, level-up)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_streak int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_date date,
  ADD COLUMN IF NOT EXISTS xp int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level int NOT NULL DEFAULT 1;

-- Index for quick streak queries (parent dashboard, leaderboards)
CREATE INDEX IF NOT EXISTS idx_profiles_streak
  ON public.profiles (current_streak DESC)
  WHERE role = 'kid';

-- Index for XP/level queries
CREATE INDEX IF NOT EXISTS idx_profiles_xp
  ON public.profiles (xp DESC)
  WHERE role = 'kid';
