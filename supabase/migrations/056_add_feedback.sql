-- =============================================================================
-- Migration: Add feedback table for user bug reports and feature requests
-- =============================================================================
-- Stores feedback submitted by parents. Supports categories (bug, feature
-- request, general), status tracking, and admin notes. The admin panel
-- uses the service-role client to read all feedback across families.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who submitted the feedback
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,

  -- Feedback content
  category text NOT NULL CHECK (category IN ('bug', 'feature_request', 'general')),
  title text NOT NULL,
  description text NOT NULL,

  -- Status tracking (managed by admin)
  status text NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',
    'in_review',
    'planned',
    'resolved',
    'closed'
  )),
  admin_notes text,

  -- Context metadata
  page_url text,
  user_agent text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_profile
  ON public.feedback (profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_status
  ON public.feedback (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_category
  ON public.feedback (category, created_at DESC);

-- Auto-update updated_at on changes
CREATE TRIGGER trg_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Parents can insert feedback for themselves
CREATE POLICY "Parents can insert own feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles
      WHERE clerk_id = requesting_clerk_id()
        AND role = 'parent'
    )
  );

-- Parents can read their own submitted feedback
CREATE POLICY "Parents can read own feedback"
  ON public.feedback
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles
      WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Service role has full access (for admin panel)
CREATE POLICY "Service role full access to feedback"
  ON public.feedback
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
