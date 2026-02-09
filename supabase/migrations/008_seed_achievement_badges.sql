-- =============================================================================
-- TinkerSchool -- Seed Achievement Badges + user_badges INSERT policy
-- =============================================================================
-- Adds 6 new achievement badges that track cross-cutting milestones:
--   - First Steps (complete first lesson)
--   - Code Runner (run code in simulator 5 times)
--   - Week Warrior (complete lessons on 3 different days)
--   - Subject Explorer (try lessons in 3 different subjects)
--   - Perfect Ten (complete 10 lessons)
--   - Chip's Friend (have 5 conversations with Chip)
--
-- Also adds an INSERT policy to user_badges so the authenticated server
-- client (Clerk JWT) can award badges without needing the admin key.
--
-- Depends on: 001_initial_schema.sql (badges, user_badges tables)
-- =============================================================================

-- =========================================================================
-- RLS: Allow authenticated users to insert their own user_badges rows.
-- The evaluateBadges function runs in Server Actions which use the
-- Clerk-JWT client, so it needs an INSERT policy.
-- =========================================================================
CREATE POLICY "user_badges_insert_own"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- =========================================================================
-- BADGES: Achievement milestones
-- =========================================================================
INSERT INTO public.badges (id, name, description, icon, criteria)
VALUES
  (
    '00000000-0000-4000-b001-000000000101',
    'First Steps',
    'Complete your first lesson. Every journey begins with a single step!',
    'footprints',
    '{"type": "lessons_completed", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000102',
    'Code Runner',
    'Run code in the simulator 5 times. Practice makes perfect!',
    'play',
    '{"type": "simulator_runs", "threshold": 5}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000103',
    'Week Warrior',
    'Complete lessons on 3 different days. Consistency is key!',
    'calendar-check',
    '{"type": "unique_days_with_completions", "threshold": 3}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000104',
    'Subject Explorer',
    'Try lessons in 3 different subjects. You are a well-rounded learner!',
    'compass',
    '{"type": "unique_subjects_attempted", "threshold": 3}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000105',
    'Perfect Ten',
    'Complete 10 lessons. You are on a roll!',
    'trophy',
    '{"type": "lessons_completed", "threshold": 10}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000106',
    'Chip''s Friend',
    'Have 5 conversations with Chip. Chip loves chatting with you!',
    'message-circle',
    '{"type": "chat_sessions", "threshold": 5}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
