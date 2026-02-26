-- =============================================================================
-- TinkerSchool -- Seed Pre-K Badges (Band 0, Ages 3-5)
-- =============================================================================
-- Adds 10 badges specifically for Pre-K learners:
--
--   Milestone badges (2):
--     - "First Steps!" - Complete your first Pre-K lesson
--     - "Seedling Star" - Complete all Pre-K modules
--
--   Subject starter badges (8, one per subject):
--     - "Counting Star" (Math)
--     - "Story Starter" (Reading)
--     - "Little Scientist" (Science)
--     - "Music Maker" (Music)
--     - "Color Explorer" (Art)
--     - "Puzzle Pro" (Problem Solving)
--     - "Code Sprout" (Coding)
--     - "Feelings Friend" (Social-Emotional)
--
-- UUID scheme: 00000000-0000-4000-b000-0000000002xx (Pre-K badges in 02xx range)
--
-- Depends on:
--   - 001_initial_schema.sql (badges table)
--   - 059_seed_social_emotional_subject.sql (subject 8)
--   - 060_seed_prek_modules.sql (Pre-K modules)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- PRE-K MILESTONE BADGES
-- =========================================================================
INSERT INTO public.badges (id, name, description, icon, criteria)
VALUES
  -- "First Steps!" - Complete your first Pre-K lesson
  (
    '00000000-0000-4000-b000-000000000201',
    'First Steps!',
    'You finished your very first lesson! Every big adventure starts with one small step.',
    'footprints',
    '{"type": "lessons_completed", "threshold": 1, "band": 0, "color": "#F97316"}'::jsonb
  ),

  -- "Seedling Star" - Complete all Pre-K modules
  (
    '00000000-0000-4000-b000-000000000202',
    'Seedling Star',
    'You explored every Pre-K adventure! You are growing so fast!',
    'sprout',
    '{"type": "modules_completed", "threshold": 8, "band": 0, "color": "#22C55E"}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;


-- =========================================================================
-- PRE-K SUBJECT STARTER BADGES (one per subject)
-- =========================================================================
INSERT INTO public.badges (id, name, description, icon, criteria)
VALUES
  -- Math: Counting Star
  (
    '00000000-0000-4000-b000-000000000211',
    'Counting Star',
    'You finished Counting Corner! You can count on yourself!',
    'calculator',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000101", "color": "#3B82F6"}'::jsonb
  ),

  -- Reading: Story Starter
  (
    '00000000-0000-4000-b000-000000000212',
    'Story Starter',
    'You finished Story Time! Every great reader starts here!',
    'book-open',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000102", "color": "#22C55E"}'::jsonb
  ),

  -- Science: Little Scientist
  (
    '00000000-0000-4000-b000-000000000213',
    'Little Scientist',
    'You finished Wonder Lab! You asked great questions!',
    'flask-conical',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000103", "color": "#F97316"}'::jsonb
  ),

  -- Music: Music Maker
  (
    '00000000-0000-4000-b000-000000000214',
    'Music Maker',
    'You finished Music Garden! You have a wonderful sense of rhythm!',
    'music',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000104", "color": "#A855F7"}'::jsonb
  ),

  -- Art: Color Explorer
  (
    '00000000-0000-4000-b000-000000000215',
    'Color Explorer',
    'You finished Color Play! What a creative artist you are!',
    'palette',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000105", "color": "#EC4899"}'::jsonb
  ),

  -- Problem Solving: Puzzle Pro
  (
    '00000000-0000-4000-b000-000000000216',
    'Puzzle Pro',
    'You finished Think & Play! You are a super problem solver!',
    'puzzle',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000106", "color": "#EAB308"}'::jsonb
  ),

  -- Coding: Code Sprout
  (
    '00000000-0000-4000-b000-000000000217',
    'Code Sprout',
    'You finished Step by Step! You are learning to think like a coder!',
    'code',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000107", "color": "#14B8A6"}'::jsonb
  ),

  -- Social-Emotional: Feelings Friend
  (
    '00000000-0000-4000-b000-000000000218',
    'Feelings Friend',
    'You finished Feelings & Friends! You are a kind and caring friend!',
    'heart-handshake',
    '{"type": "module_completed", "module_id": "00000000-0000-4000-8000-000000000108", "color": "#F472B6"}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
