-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Modules (Band 1, Ages 5-6)
-- =============================================================================
-- Adds 7 modules (one per subject) for Kindergarten "Explorer" band (band=1):
--   1. Number Adventures     (Math)
--   2. Letter Land            (Reading)
--   3. Nature Explorers       (Science)
--   4. Music Makers           (Music)
--   5. Art Adventures         (Art)
--   6. Puzzle Pals            (Problem Solving)
--   7. Code Explorers         (Coding)
--
-- UUID scheme for modules: 00000001-00X1-4000-8000-000000000001
--   X = subject order (1-7), second digit pair = 01 (band 1)
--   These sit between Pre-K modules (0000...0101-0108) and
--   the now-shifted 1st grade modules (00000001-0001-..., band=2)
--
-- Using UUIDs: 00000001-0011 through 00000001-0071 for K modules
--
-- Depends on:
--   - 001_initial_schema.sql (modules table)
--   - 003_seed_1st_grade_curriculum.sql (subjects 1-7 seeded)
--   - 066_shift_bands_up.sql (bands shifted, band 1 now = Kindergarten)
--   - 067_seed_kindergarten_skills.sql (K skills seeded)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- KINDERGARTEN MODULES (band=1, one per subject)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  -- 1. Math: Number Adventures
  (
    '00000001-0011-4000-8000-000000000001',
    1, 1,
    'Number Adventures',
    'Count, compare, add, and discover shapes in our number playground!',
    'calculator',
    '00000000-0000-4000-8000-000000000001'
  ),

  -- 2. Reading: Letter Land
  (
    '00000001-0021-4000-8000-000000000001',
    1, 2,
    'Letter Land',
    'Meet all 26 letters, learn their sounds, and start reading words!',
    'book-open',
    '00000000-0000-4000-8000-000000000002'
  ),

  -- 3. Science: Nature Explorers
  (
    '00000001-0031-4000-8000-000000000001',
    1, 3,
    'Nature Explorers',
    'Push, pull, observe weather, and discover what living things need!',
    'flask-conical',
    '00000000-0000-4000-8000-000000000003'
  ),

  -- 4. Music: Music Makers
  (
    '00000001-0041-4000-8000-000000000001',
    1, 4,
    'Music Makers',
    'Keep the beat, sing songs, and explore loud, soft, fast, and slow!',
    'music',
    '00000000-0000-4000-8000-000000000004'
  ),

  -- 5. Art: Art Adventures
  (
    '00000001-0051-4000-8000-000000000001',
    1, 5,
    'Art Adventures',
    'Mix colors, draw lines and shapes, and create your very own art!',
    'palette',
    '00000000-0000-4000-8000-000000000005'
  ),

  -- 6. Problem Solving: Puzzle Pals
  (
    '00000001-0061-4000-8000-000000000001',
    1, 6,
    'Puzzle Pals',
    'Find patterns, sort by rules, and figure out what comes next!',
    'puzzle',
    '00000000-0000-4000-8000-000000000006'
  ),

  -- 7. Coding: Code Explorers
  (
    '00000001-0071-4000-8000-000000000001',
    1, 7,
    'Code Explorers',
    'Give step-by-step instructions, find mistakes, and think like a coder!',
    'code',
    '00000000-0000-4000-8000-000000000007'
  )
ON CONFLICT (id) DO NOTHING;
