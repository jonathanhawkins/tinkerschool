-- =============================================================================
-- TinkerSchool -- Fix old-format sections-based lessons
-- =============================================================================
-- There are 72 lessons with lesson_type='interactive' that use an OLD content
-- format with `content.sections` instead of `content.activities`. The current
-- interactive lesson renderer expects `content.activities`, so these lessons
-- fall through to the coding path incorrectly.
--
-- This migration:
-- 1. Changes lesson_type from 'interactive' to 'creative' for the 18 CODING
--    old-format lessons (they have starter_blocks_xml and solution_code, so
--    the coding workshop path is correct for them). 'creative' is already
--    allowed by the lessons_lesson_type_check constraint and does NOT match
--    the isInteractiveLesson or isNarrativeLesson checks, so these lessons
--    will correctly fall through to the coding/workshop CTA.
-- 2. The remaining 54 non-coding lessons (math, reading, science, music, art,
--    problem-solving) keep lesson_type='interactive' and will be rendered by
--    the new NarrativeLesson component which detects `content.sections`.
--
-- The story_text column is already populated for all 72 lessons, so no
-- narrative text migration is needed.
-- =============================================================================

-- =========================================================================
-- 1. Reclassify coding lessons with old sections format as 'creative'
-- =========================================================================
-- These 18 lessons have starter_blocks_xml and solution_code, meaning they
-- are actually coding/workshop lessons that should show the "Start Coding"
-- CTA rather than the interactive or narrative renderer.
-- =========================================================================
UPDATE public.lessons
SET lesson_type = 'creative'
WHERE lesson_type = 'interactive'
  AND content ? 'sections'
  AND NOT content ? 'activities'
  AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'coding' LIMIT 1);
