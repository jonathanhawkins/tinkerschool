-- =============================================================================
-- TinkerSchool -- Seed Pre-K Modules (Band 0, Ages 3-5)
-- =============================================================================
-- Adds 8 modules (one per subject) for Pre-K "Seedling" band (band=0):
--   1. Counting Corner      (Math)
--   2. Story Time            (Reading)
--   3. Wonder Lab            (Science)
--   4. Music Garden          (Music)
--   5. Color Play            (Art)
--   6. Think & Play          (Problem Solving)
--   7. Step by Step          (Coding)
--   8. Feelings & Friends    (Social-Emotional)
--
-- UUID scheme for modules: 00000000-0000-4000-8000-000000000100 + offset
--   (band 0 modules use the 01xx range to avoid collisions with band 1 at 0001-0007)
--
-- Depends on:
--   - 001_initial_schema.sql (modules table)
--   - 002_tinkerschool_multi_subject.sql (modules.subject_id column)
--   - 003_seed_1st_grade_curriculum.sql (subjects 1-7 seeded)
--   - 058_seed_prek_skills.sql (Pre-K skills for subjects 1-7)
--   - 059_seed_social_emotional_subject.sql (subject 8 + Pre-K skills)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- PRE-K MODULES (band=0, one per subject)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  -- 1. Math: Counting Corner
  (
    '00000000-0000-4000-8000-000000000101',
    0, 1,
    'Counting Corner',
    'Count, sort, and discover shapes through play.',
    'calculator',
    '00000000-0000-4000-8000-000000000001'
  ),

  -- 2. Reading: Story Time
  (
    '00000000-0000-4000-8000-000000000102',
    0, 2,
    'Story Time',
    'Explore letters, rhymes, and stories together.',
    'book-open',
    '00000000-0000-4000-8000-000000000002'
  ),

  -- 3. Science: Wonder Lab
  (
    '00000000-0000-4000-8000-000000000103',
    0, 3,
    'Wonder Lab',
    'Observe nature and discover how things work.',
    'flask-conical',
    '00000000-0000-4000-8000-000000000003'
  ),

  -- 4. Music: Music Garden
  (
    '00000000-0000-4000-8000-000000000104',
    0, 4,
    'Music Garden',
    'Sing, clap, and move to the beat.',
    'music',
    '00000000-0000-4000-8000-000000000004'
  ),

  -- 5. Art: Color Play
  (
    '00000000-0000-4000-8000-000000000105',
    0, 5,
    'Color Play',
    'Explore colors, shapes, and textures through art.',
    'palette',
    '00000000-0000-4000-8000-000000000005'
  ),

  -- 6. Problem Solving: Think & Play
  (
    '00000000-0000-4000-8000-000000000106',
    0, 6,
    'Think & Play',
    'Sort, match, and solve simple puzzles.',
    'puzzle',
    '00000000-0000-4000-8000-000000000006'
  ),

  -- 7. Coding: Step by Step
  (
    '00000000-0000-4000-8000-000000000107',
    0, 7,
    'Step by Step',
    'Learn sequencing and cause-and-effect through play.',
    'code',
    '00000000-0000-4000-8000-000000000007'
  ),

  -- 8. Social-Emotional: Feelings & Friends
  (
    '00000000-0000-4000-8000-000000000108',
    0, 8,
    'Feelings & Friends',
    'Name emotions, practice kindness, and learn to share.',
    'heart-handshake',
    '00000000-0000-4000-8000-000000000008'
  )
ON CONFLICT (id) DO NOTHING;
