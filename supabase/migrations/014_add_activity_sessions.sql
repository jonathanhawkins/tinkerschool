-- =============================================================================
-- Migration: Add activity_sessions table for interactive lesson tracking
-- =============================================================================
-- Stores per-session performance data when a kid completes an interactive
-- activity (multiple choice, counting, matching, etc.). This data powers
-- adaptive difficulty and parent progress reports.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.activity_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,

  -- Aggregate metrics
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  total_questions integer NOT NULL DEFAULT 0,
  correct_first_try integer NOT NULL DEFAULT 0,
  correct_total integer NOT NULL DEFAULT 0,
  time_seconds integer NOT NULL DEFAULT 0,
  hints_used integer NOT NULL DEFAULT 0,

  -- Detailed per-question data (array of AnswerEvent objects)
  activity_data jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Timestamps
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying a kid's activity history
CREATE INDEX IF NOT EXISTS idx_activity_sessions_profile
  ON public.activity_sessions (profile_id, completed_at DESC);

-- Index for querying all attempts on a lesson
CREATE INDEX IF NOT EXISTS idx_activity_sessions_lesson
  ON public.activity_sessions (lesson_id, profile_id);

-- RLS policies: kids see their own sessions, parents see family sessions
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;

-- Kids can read their own activity sessions
CREATE POLICY "Kids can read own activity sessions"
  ON public.activity_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = auth.uid()
    )
  );

-- Kids can insert their own activity sessions
CREATE POLICY "Kids can insert own activity sessions"
  ON public.activity_sessions
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = auth.uid()
    )
  );

-- Parents can read all family activity sessions
CREATE POLICY "Parents can read family activity sessions"
  ON public.activity_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.profiles parent ON parent.family_id = p.family_id
      WHERE parent.clerk_id = auth.uid() AND parent.role = 'parent'
    )
  );

-- Service role bypasses RLS (for server actions with admin client)
CREATE POLICY "Service role full access to activity sessions"
  ON public.activity_sessions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
