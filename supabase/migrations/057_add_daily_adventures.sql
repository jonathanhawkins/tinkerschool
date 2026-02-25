-- =============================================================================
-- 057: Add daily_adventures table and extend activity_sessions
-- =============================================================================
-- Supports AI-generated personalized daily lessons ("Chip's Daily Adventure").
-- Adventures are standalone and do NOT pollute the hand-authored lessons table.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create adventure_status enum
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE adventure_status AS ENUM ('pending', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Create daily_adventures table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_adventures (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id   uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  skill_ids    uuid[] NOT NULL DEFAULT '{}',
  title        text NOT NULL,
  description  text NOT NULL,
  story_text   text,
  content      jsonb NOT NULL DEFAULT '{}',
  subject_color text NOT NULL DEFAULT '#F97316',
  status       adventure_status NOT NULL DEFAULT 'pending',
  score        integer,
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint: one adventure per kid per calendar day
CREATE UNIQUE INDEX IF NOT EXISTS daily_adventures_profile_day_idx
  ON daily_adventures (profile_id, (date(generated_at AT TIME ZONE 'UTC')));

-- Fast lookup for "today's adventure" queries
CREATE INDEX IF NOT EXISTS daily_adventures_profile_generated_idx
  ON daily_adventures (profile_id, generated_at DESC);

-- ---------------------------------------------------------------------------
-- 3. Extend activity_sessions to support adventures
-- ---------------------------------------------------------------------------
-- Make lesson_id nullable (adventures don't have a lesson)
ALTER TABLE activity_sessions
  ALTER COLUMN lesson_id DROP NOT NULL;

-- Add adventure_id FK
ALTER TABLE activity_sessions
  ADD COLUMN IF NOT EXISTS adventure_id uuid REFERENCES daily_adventures(id) ON DELETE SET NULL;

-- Ensure at least one of lesson_id or adventure_id is set
ALTER TABLE activity_sessions
  DROP CONSTRAINT IF EXISTS activity_sessions_lesson_or_adventure_check;

ALTER TABLE activity_sessions
  ADD CONSTRAINT activity_sessions_lesson_or_adventure_check
  CHECK (lesson_id IS NOT NULL OR adventure_id IS NOT NULL);

-- Index for querying adventure sessions
CREATE INDEX IF NOT EXISTS activity_sessions_adventure_id_idx
  ON activity_sessions (adventure_id) WHERE adventure_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. RLS policies for daily_adventures
-- ---------------------------------------------------------------------------
ALTER TABLE daily_adventures ENABLE ROW LEVEL SECURITY;

-- Kids can read their own adventures
CREATE POLICY daily_adventures_select_own ON daily_adventures
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
    )
  );

-- Parents can see all adventures in their family
CREATE POLICY daily_adventures_select_family ON daily_adventures
  FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.family_id IN (
        SELECT family_id FROM profiles WHERE clerk_id = auth.uid()::text
      )
    )
  );

-- Service role can do everything (used by server actions)
CREATE POLICY daily_adventures_service_all ON daily_adventures
  FOR ALL
  USING (true)
  WITH CHECK (true);
