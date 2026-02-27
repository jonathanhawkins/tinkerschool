-- Migration: Add lightweight user event tracking for alpha funnel analytics
-- COPPA-safe: no PII beyond what's already in profiles, all data stays in Supabase

-- ---------------------------------------------------------------------------
-- Table: user_events
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id   uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  event_name  text NOT NULL,
  event_data  jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for querying a family's event stream (parent dashboard)
CREATE INDEX IF NOT EXISTS idx_user_events_family_created
  ON public.user_events (family_id, created_at DESC);

-- Index for filtering by event name (funnel analysis)
CREATE INDEX IF NOT EXISTS idx_user_events_event_name
  ON public.user_events (event_name, created_at DESC);

-- Index for querying a specific profile's events
CREATE INDEX IF NOT EXISTS idx_user_events_profile
  ON public.user_events (profile_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------------

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Parents can read their family's events (for the parent dashboard events viewer)
CREATE POLICY "Parents can read family events"
  ON public.user_events
  FOR SELECT
  USING (
    family_id IN (
      SELECT p.family_id FROM public.profiles p
      WHERE p.clerk_id = auth.uid()::text
        AND p.role = 'parent'
    )
  );

-- Any authenticated user in the family can insert events (kids and parents)
CREATE POLICY "Family members can insert own events"
  ON public.user_events
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      WHERE p.clerk_id = auth.uid()::text
    )
  );

-- Service role (admin client) bypasses RLS automatically
