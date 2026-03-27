-- =============================================================================
-- TinkerSchool -- Fix Pre-K "Count to Five!" question order
-- =============================================================================
-- The first question in the lesson should match the lesson goal and start at 5.
-- Keep all visible counts aligned with the expected answer, then place the
-- slightly harder 4-count prompt last.
-- =============================================================================

UPDATE public.lessons
SET content = jsonb_set(
  content,
  '{activities,0,questions}',
  '[
    {"id":"c5a","hint":"ONE, TWO, THREE, FOUR, FIVE!","emoji":"⭐","prompt":"How many stars?","correctCount":5,"displayCount":5},
    {"id":"c5b","hint":"ONE, TWO, THREE!","emoji":"🍎","prompt":"How many apples?","correctCount":3,"displayCount":3},
    {"id":"c5c","hint":"ONE, TWO, THREE, FOUR!","emoji":"🦋","prompt":"How many butterflies?","correctCount":4,"displayCount":4}
  ]'::jsonb
)
WHERE title = 'Count to Five!'
  AND order_num = 9
  AND lesson_type = 'interactive'
  AND subject_id = (
    SELECT id
    FROM subjects
    WHERE display_name = 'Math'
    LIMIT 1
  )
  AND module_id = (
    SELECT id
    FROM modules
    WHERE band = 0
      AND subject_id = (
        SELECT id
        FROM subjects
        WHERE display_name = 'Math'
        LIMIT 1
      )
    LIMIT 1
  );
