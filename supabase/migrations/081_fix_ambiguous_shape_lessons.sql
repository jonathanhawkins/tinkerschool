-- =============================================================================
-- TinkerSchool -- Fix ambiguous early shape lesson prompts
-- =============================================================================
-- Replace real-world examples that can reasonably have multiple shapes with
-- direct shape language or clearer examples so parents and early learners do
-- not get contradictory signals.
-- =============================================================================

UPDATE public.lessons
SET story_text = 'Circles are round. Squares have four equal sides and four corners!',
    content = jsonb_set(
      jsonb_set(
        content,
        '{activities,0,questions,1,prompt}',
        '"Which one is a square?"'::jsonb
      ),
      '{activities,0,questions,1,hint}',
      '"A square has 4 equal sides and 4 corners!"'::jsonb
    )
WHERE title = 'Circles and Squares'
  AND order_num = 5
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

UPDATE public.lessons
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      content,
      '{activities,0,cards,1,back}',
      '"A square has 4 equal sides and 4 corners! Think of a cheese cracker or one square on a checkerboard."'::jsonb
    ),
    '{activities,1,questions,2,prompt}',
    '"What shape is a door?"'::jsonb
  ),
  '{activities,1,questions,2,hint}',
  '"Doors have 4 sides, and two sides are longer than the other two!"'::jsonb
)
WHERE id = 'b1000005-0002-4000-8000-000000000001';

UPDATE public.lessons
SET content = jsonb_set(
  jsonb_set(
    content,
    '{activities,1,questions,1,prompt}',
    '"Which shape has 4 equal sides and 4 corners?"'::jsonb
  ),
  '{activities,1,questions,1,hint}',
  '"A square has 4 equal sides and 4 corners!"'::jsonb
)
WHERE id = 'b1000006-0005-4000-8000-000000000001';
