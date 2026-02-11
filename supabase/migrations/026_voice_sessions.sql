-- ============================================================================
-- Voice session tracking for Hume EVI cost control
-- ============================================================================
-- Tracks voice AI usage per profile/family to enforce daily and monthly caps.
-- Cost estimate uses $0.07/min (Hume EVI 2 standard rate).

CREATE TABLE voice_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id       UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  chat_group_id   TEXT,                        -- Hume chatGroupId for session continuity
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  duration_seconds INT NOT NULL DEFAULT 0,
  estimated_cost_cents INT NOT NULL DEFAULT 0,  -- $0.07/min = 0.1167 cents/sec
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast budget lookups
CREATE INDEX idx_voice_sessions_profile_date
  ON voice_sessions (profile_id, started_at DESC);

CREATE INDEX idx_voice_sessions_family_date
  ON voice_sessions (family_id, started_at DESC);

-- ============================================================================
-- Helper: total voice seconds used today by a profile
-- ============================================================================
CREATE OR REPLACE FUNCTION get_voice_seconds_today(p_profile_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(duration_seconds), 0)::INT
  FROM voice_sessions
  WHERE profile_id = p_profile_id
    AND started_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
$$;

-- ============================================================================
-- Helper: total voice seconds used this calendar month by a family
-- ============================================================================
CREATE OR REPLACE FUNCTION get_voice_seconds_month(p_family_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(duration_seconds), 0)::INT
  FROM voice_sessions
  WHERE family_id = p_family_id
    AND started_at >= date_trunc('month', now() AT TIME ZONE 'UTC')
$$;

-- ============================================================================
-- RLS policies
-- ============================================================================
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;

-- Parents can see all family voice sessions (for billing/usage review)
CREATE POLICY "Parents can view family voice sessions"
  ON voice_sessions FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM profiles
      WHERE clerk_id = auth.uid()::TEXT AND role = 'parent'
    )
  );

-- Kids can see their own voice sessions
CREATE POLICY "Kids can view own voice sessions"
  ON voice_sessions FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Server-side inserts only (admin client) — no direct insert from client
-- This prevents kids from gaming the system by inserting fake low-duration rows.
