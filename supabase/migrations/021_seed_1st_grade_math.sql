-- =============================================================================
-- TinkerSchool -- Seed 1st Grade (Band 1) Math Lessons
-- =============================================================================
-- 25 browser-only interactive lessons for 1st grade (Band 1, K-1, ages 5-6):
--   Module 1: Counting & Number Sense      (7 lessons)
--   Module 2: Addition & Subtraction        (7 lessons)
--   Module 3: Place Value & Comparing       (5 lessons)
--   Module 4: Shapes & Measurement          (6 lessons)
--
-- Aligned with Common Core 1st Grade Math Standards:
--   1.OA  Operations & Algebraic Thinking
--   1.NBT Number & Operations in Base Ten
--   1.MD  Measurement & Data
--   1.G   Geometry
--
-- Widget types used: counting, fill_in_blank, multiple_choice, matching_pairs,
--   number_bond, ten_frame, number_line, rekenrek, sequence_order, flash_card
--
-- Subject ID:
--   Math (Number World): 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Existing Skill IDs (already in DB):
--   Counting to 50:          73513881-2984-40bb-bbe2-fde73d06fd55
--   Number lines & ordering: 138bb984-147f-42f6-862a-0cf969491dcb
--   Addition within 10:      83bd2c5d-2fad-441a-9ffb-e1373d5f68aa
--   Subtraction within 10:   951c53a0-eb22-48f4-a7f6-802f5cde4b40
--   Tens and ones:           d6fdf1c2-9ecb-4bd8-89fb-b37b42252870
--   Addition within 20:      42fd1fb0-e7b2-46e9-8f2a-f560e4b1cbc4
--   2D shapes & attributes:  6dbe4d0d-411e-4800-a390-92c4063f485a
--   Comparing lengths:       c6f9f6b7-326a-4ddb-9396-dbc7b79d1f9c
--   Telling time (hours):    78755bee-66fa-4e19-bd6b-be94a5e05069
--
-- Module IDs:
--   Counting & Number Sense:  10000001-0101-4000-8000-000000000001
--   Addition & Subtraction:   10000001-0102-4000-8000-000000000001
--   Place Value & Comparing:  10000001-0103-4000-8000-000000000001
--   Shapes & Measurement:     10000001-0104-4000-8000-000000000001
--
-- Lesson UUID pattern: b1010001-NNNN-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Modules
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0101-4000-8000-000000000001', 1, 1, 'Counting & Number Sense',  'Count to 100, learn number order, compare numbers, and skip count by 10s!',             'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a'),
  ('10000001-0102-4000-8000-000000000001', 1, 2, 'Addition & Subtraction',   'Add and subtract within 10 and 20 using number bonds, ten frames, and story problems!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a'),
  ('10000001-0103-4000-8000-000000000001', 1, 3, 'Place Value & Comparing',  'Discover tens and ones, compare numbers, and find number patterns!',                     'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a'),
  ('10000001-0104-4000-8000-000000000001', 1, 4, 'Shapes & Measurement',     'Explore 2D and 3D shapes, measure lengths, tell time, and find equal parts!',            'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MODULE 1: COUNTING & NUMBER SENSE (7 lessons)
-- =========================================================================


-- =========================================================================
-- LESSON 1: Count to 20
-- Module: Counting & Number Sense
-- Widgets: counting
-- Standard: 1.NBT.A.1 (Count to 120)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0001-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  1,
  'Count to 20',
  'Practice counting objects from 1 to 20.',
  'Hi friend! I love counting things. Let''s count together! Tap each one and see how high we can go. Ready? One, two, three... go!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['73513881-2984-40bb-bbe2-fde73d06fd55']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "c20-1",
            "prompt": "Count the stars!",
            "emoji": "\u2b50",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "Tap each star one by one: 1, 2, 3, 4, 5!"
          },
          {
            "id": "c20-2",
            "prompt": "Count the apples!",
            "emoji": "\ud83c\udf4e",
            "correctCount": 8,
            "displayCount": 8,
            "hint": "Count slowly. There are 8 apples!"
          },
          {
            "id": "c20-3",
            "prompt": "How many butterflies do you see?",
            "emoji": "\ud83e\udd8b",
            "correctCount": 12,
            "displayCount": 12,
            "hint": "Count past 10! 10, 11, 12. There are 12!"
          },
          {
            "id": "c20-4",
            "prompt": "Count all the fish!",
            "emoji": "\ud83d\udc1f",
            "correctCount": 15,
            "displayCount": 15,
            "hint": "Keep going after 10! 11, 12, 13, 14, 15."
          },
          {
            "id": "c20-5",
            "prompt": "Can you count all the flowers?",
            "emoji": "\ud83c\udf3b",
            "correctCount": 18,
            "displayCount": 18,
            "hint": "Almost to 20! Count carefully: 15, 16, 17, 18."
          },
          {
            "id": "c20-6",
            "prompt": "Count every single heart!",
            "emoji": "\u2764\ufe0f",
            "correctCount": 20,
            "displayCount": 20,
            "hint": "You can do it! Count all the way to 20!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Count to 50
-- Module: Counting & Number Sense
-- Widgets: counting + fill_in_blank
-- Standard: 1.NBT.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0002-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  2,
  'Count to 50',
  'Keep counting higher! Practice counting up to 50 objects.',
  'Wow, you can count to 20! But Chip knows you can go even BIGGER! Let''s count all the way to 50. That''s a LOT of things. You got this!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['73513881-2984-40bb-bbe2-fde73d06fd55']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "c50-1",
            "prompt": "Count the ladybugs!",
            "emoji": "\ud83d\udc1e",
            "correctCount": 22,
            "displayCount": 22,
            "hint": "Count past 20! 20, 21, 22."
          },
          {
            "id": "c50-2",
            "prompt": "How many rockets?",
            "emoji": "\ud83d\ude80",
            "correctCount": 30,
            "displayCount": 30,
            "hint": "Keep counting! 28, 29, 30!"
          },
          {
            "id": "c50-3",
            "prompt": "Count all the cookies!",
            "emoji": "\ud83c\udf6a",
            "correctCount": 40,
            "displayCount": 40,
            "hint": "You are almost there! 38, 39, 40!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "c50-fb1",
            "prompt": "28, 29, ___, 31, 32",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "What comes right after 29?"
          },
          {
            "id": "c50-fb2",
            "prompt": "38, 39, ___, 41, 42",
            "blanks": [{ "id": "b1", "correctAnswer": "40", "acceptableAnswers": ["40"] }],
            "hint": "What comes right after 39?"
          },
          {
            "id": "c50-fb3",
            "prompt": "46, 47, 48, ___, 50",
            "blanks": [{ "id": "b1", "correctAnswer": "49", "acceptableAnswers": ["49"] }],
            "hint": "Count: 46, 47, 48... what is next?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Count to 100
-- Module: Counting & Number Sense
-- Widgets: counting + fill_in_blank
-- Standard: 1.NBT.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0003-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  3,
  'Count to 100!',
  'Reach the big number! Practice counting all the way to 100.',
  'You are a counting champion! Chip is SO proud. Now let''s try something amazing -- counting to ONE HUNDRED! That is the biggest number yet. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['73513881-2984-40bb-bbe2-fde73d06fd55']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "c100-1",
            "prompt": "Count the gems!",
            "emoji": "\ud83d\udc8e",
            "correctCount": 55,
            "displayCount": 55,
            "hint": "Count past 50! 53, 54, 55."
          },
          {
            "id": "c100-2",
            "prompt": "Count all the leaves!",
            "emoji": "\ud83c\udf43",
            "correctCount": 75,
            "displayCount": 75,
            "hint": "You can do it! Keep going past 70."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "c100-fb1",
            "prompt": "58, 59, ___, 61, 62",
            "blanks": [{ "id": "b1", "correctAnswer": "60", "acceptableAnswers": ["60"] }],
            "hint": "What comes right after 59?"
          },
          {
            "id": "c100-fb2",
            "prompt": "77, 78, 79, ___, 81",
            "blanks": [{ "id": "b1", "correctAnswer": "80", "acceptableAnswers": ["80"] }],
            "hint": "What comes right after 79?"
          },
          {
            "id": "c100-fb3",
            "prompt": "97, 98, ___, 100",
            "blanks": [{ "id": "b1", "correctAnswer": "99", "acceptableAnswers": ["99"] }],
            "hint": "Almost at 100! 97, 98..."
          },
          {
            "id": "c100-fb4",
            "prompt": "88, 89, ___, 91, 92",
            "blanks": [{ "id": "b1", "correctAnswer": "90", "acceptableAnswers": ["90"] }],
            "hint": "What comes right after 89?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Number Before & After
-- Module: Counting & Number Sense
-- Widgets: fill_in_blank + number_line
-- Standard: 1.NBT.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0004-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  4,
  'Number Before & After',
  'Find the number neighbors! What comes before and after each number?',
  'Every number has neighbors! The number before 5 is 4, and the number after 5 is 6. Let''s find all the number neighbors together. Chip loves number neighbors!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['138bb984-147f-42f6-862a-0cf969491dcb']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "nba-1",
            "prompt": "___, 5, 6",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "What comes right before 5? Count: 3, 4, 5."
          },
          {
            "id": "nba-2",
            "prompt": "8, 9, ___",
            "blanks": [{ "id": "b1", "correctAnswer": "10", "acceptableAnswers": ["10"] }],
            "hint": "What comes right after 9?"
          },
          {
            "id": "nba-3",
            "prompt": "___, 12, 13",
            "blanks": [{ "id": "b1", "correctAnswer": "11", "acceptableAnswers": ["11"] }],
            "hint": "What comes right before 12?"
          },
          {
            "id": "nba-4",
            "prompt": "17, ___, 19",
            "blanks": [{ "id": "b1", "correctAnswer": "18", "acceptableAnswers": ["18"] }],
            "hint": "What number is between 17 and 19?"
          },
          {
            "id": "nba-5",
            "prompt": "14, 15, ___",
            "blanks": [{ "id": "b1", "correctAnswer": "16", "acceptableAnswers": ["16"] }],
            "hint": "What comes right after 15?"
          }
        ]
      },
      {
        "type": "number_line",
        "questions": [
          {
            "id": "nba-nl1",
            "prompt": "Start at 3. Move forward 1. Where do you land?",
            "min": 0,
            "max": 10,
            "startPosition": 3,
            "correctEndPosition": 4,
            "operation": "add",
            "hint": "3 plus 1 is 4!"
          },
          {
            "id": "nba-nl2",
            "prompt": "Start at 7. Move forward 1. Where do you land?",
            "min": 0,
            "max": 10,
            "startPosition": 7,
            "correctEndPosition": 8,
            "operation": "add",
            "hint": "7 plus 1 is 8!"
          },
          {
            "id": "nba-nl3",
            "prompt": "Start at 6. Move backward 1. Where do you land?",
            "min": 0,
            "max": 10,
            "startPosition": 6,
            "correctEndPosition": 5,
            "operation": "subtract",
            "hint": "6 minus 1 is 5!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Comparing Numbers
-- Module: Counting & Number Sense
-- Widgets: multiple_choice
-- Standard: 1.NBT.B.3
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0005-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  5,
  'Comparing Numbers',
  'Which number is bigger? Which is smaller? Let''s find out!',
  'Chip has a question for you! If you had 3 cookies or 7 cookies, which is MORE? Let''s learn to compare numbers and figure out which one is bigger or smaller!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['138bb984-147f-42f6-862a-0cf969491dcb']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cmp-1",
            "prompt": "Which number is BIGGER: 3 or 7?",
            "options": [
              {"id": "a", "text": "3"},
              {"id": "b", "text": "7"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "b",
            "hint": "Count up: 3, 4, 5, 6, 7. You counted higher to get to 7!"
          },
          {
            "id": "cmp-2",
            "prompt": "Which number is SMALLER: 9 or 4?",
            "options": [
              {"id": "a", "text": "9"},
              {"id": "b", "text": "4"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "b",
            "hint": "4 comes before 9 when you count, so 4 is smaller."
          },
          {
            "id": "cmp-3",
            "prompt": "Which is more: 6 apples or 2 apples?",
            "options": [
              {"id": "a", "text": "6 apples"},
              {"id": "b", "text": "2 apples"},
              {"id": "c", "text": "The same amount"}
            ],
            "correctOptionId": "a",
            "hint": "6 is a bigger number than 2!"
          },
          {
            "id": "cmp-4",
            "prompt": "Which number is BIGGER: 10 or 5?",
            "options": [
              {"id": "a", "text": "5"},
              {"id": "b", "text": "10"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "b",
            "hint": "10 is two whole hands! That is more than 5."
          },
          {
            "id": "cmp-5",
            "prompt": "Which is less: 8 stars or 3 stars?",
            "options": [
              {"id": "a", "text": "8 stars"},
              {"id": "b", "text": "3 stars"},
              {"id": "c", "text": "The same amount"}
            ],
            "correctOptionId": "b",
            "hint": "3 is a smaller number than 8!"
          },
          {
            "id": "cmp-6",
            "prompt": "Which is BIGGER: 15 or 12?",
            "options": [
              {"id": "a", "text": "12"},
              {"id": "b", "text": "15"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "b",
            "hint": "15 comes after 12 when you count, so 15 is bigger!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 6: Count by 10s to 100
-- Module: Counting & Number Sense
-- Widgets: counting + fill_in_blank
-- Standard: 1.NBT.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0006-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  6,
  'Count by 10s to 100',
  'Skip count by 10s! It is the fastest way to get to 100.',
  'Want to count SUPER fast? Chip will show you a trick! Instead of counting 1, 2, 3... we can SKIP and count by 10s! 10, 20, 30... all the way to 100! Let''s try!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['73513881-2984-40bb-bbe2-fde73d06fd55']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "ct10-1",
            "prompt": "Count the bundles of 10 crayons!",
            "emoji": "\ud83d\udd8d\ufe0f",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "Each bundle has 10. Count: 10, 20, 30! That is 3 bundles."
          },
          {
            "id": "ct10-2",
            "prompt": "Count the groups of 10 balloons!",
            "emoji": "\ud83c\udf88",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "5 groups of 10: 10, 20, 30, 40, 50!"
          },
          {
            "id": "ct10-3",
            "prompt": "Count the packs of 10 stickers!",
            "emoji": "\u2b50",
            "correctCount": 8,
            "displayCount": 8,
            "hint": "8 packs of 10: 10, 20, 30, 40, 50, 60, 70, 80!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "ct10-fb1",
            "prompt": "10, 20, ___, 40, 50",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "20 plus 10 is..."
          },
          {
            "id": "ct10-fb2",
            "prompt": "40, 50, 60, ___, 80",
            "blanks": [{ "id": "b1", "correctAnswer": "70", "acceptableAnswers": ["70"] }],
            "hint": "60 plus 10 is..."
          },
          {
            "id": "ct10-fb3",
            "prompt": "70, 80, ___, 100",
            "blanks": [{ "id": "b1", "correctAnswer": "90", "acceptableAnswers": ["90"] }],
            "hint": "80 plus 10 is..."
          },
          {
            "id": "ct10-fb4",
            "prompt": "10, ___, 30, 40, 50",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "10 plus 10 is..."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 7: Ordering Numbers
-- Module: Counting & Number Sense
-- Widgets: sequence_order
-- Standard: 1.NBT.B.3
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0007-4000-8000-000000000001',
  '10000001-0101-4000-8000-000000000001',
  7,
  'Ordering Numbers',
  'Put these numbers in order from smallest to biggest!',
  'Chip mixed up some numbers and needs your help! Can you put them back in order from the smallest to the biggest? It is like lining up from shortest to tallest!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['138bb984-147f-42f6-862a-0cf969491dcb']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ord-1",
            "prompt": "Put these numbers in order from smallest to biggest!",
            "items": [
              {"id": "i1", "text": "1"},
              {"id": "i2", "text": "3"},
              {"id": "i3", "text": "5"},
              {"id": "i4", "text": "7"}
            ]
          },
          {
            "id": "ord-2",
            "prompt": "Order these from smallest to biggest!",
            "items": [
              {"id": "i1", "text": "2"},
              {"id": "i2", "text": "6"},
              {"id": "i3", "text": "8"},
              {"id": "i4", "text": "10"}
            ]
          },
          {
            "id": "ord-3",
            "prompt": "Line up these numbers! Smallest first.",
            "items": [
              {"id": "i1", "text": "4"},
              {"id": "i2", "text": "9"},
              {"id": "i3", "text": "12"},
              {"id": "i4", "text": "15"}
            ]
          },
          {
            "id": "ord-4",
            "prompt": "Order from smallest to biggest!",
            "items": [
              {"id": "i1", "text": "5"},
              {"id": "i2", "text": "10"},
              {"id": "i3", "text": "15"},
              {"id": "i4", "text": "20"}
            ]
          },
          {
            "id": "ord-5",
            "prompt": "Put these bigger numbers in order!",
            "items": [
              {"id": "i1", "text": "11"},
              {"id": "i2", "text": "14"},
              {"id": "i3", "text": "17"},
              {"id": "i4", "text": "19"}
            ]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MODULE 2: ADDITION & SUBTRACTION (7 lessons)
-- =========================================================================


-- =========================================================================
-- LESSON 8: Adding to 5
-- Module: Addition & Subtraction
-- Widgets: number_bond + ten_frame + counting
-- Standard: 1.OA.C.6
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0008-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  1,
  'Adding to 5',
  'Learn to add small numbers together! All answers are 5 or less.',
  'Chip is baking cookies and needs your help! If you have 2 cookies and bake 1 more, how many do you have? That is called ADDING! Let''s practice adding little numbers together.',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['83bd2c5d-2fad-441a-9ffb-e1373d5f68aa']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "a5-nb1",
            "prompt": "2 and 1 make what number?",
            "whole": null,
            "part1": 2,
            "part2": 1,
            "hint": "Count: 2... then 1 more is 3!"
          },
          {
            "id": "a5-nb2",
            "prompt": "What goes with 3 to make 5?",
            "whole": 5,
            "part1": 3,
            "part2": null,
            "hint": "Start at 3 and count up to 5. How many did you count?"
          },
          {
            "id": "a5-nb3",
            "prompt": "1 and what make 4?",
            "whole": 4,
            "part1": 1,
            "part2": null,
            "hint": "1 plus what equals 4? Count up from 1!"
          }
        ]
      },
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "a5-tf1",
            "prompt": "Show 3 on the frame, then add 2 more. How many?",
            "targetNumber": 5,
            "frameCount": 1
          },
          {
            "id": "a5-tf2",
            "prompt": "Show 4 on the frame. You have 4!",
            "targetNumber": 4,
            "frameCount": 1
          },
          {
            "id": "a5-tf3",
            "prompt": "Put 2 on the frame, then add 1. How many total?",
            "targetNumber": 3,
            "frameCount": 1
          }
        ]
      },
      {
        "type": "counting",
        "questions": [
          {
            "id": "a5-ct1",
            "prompt": "You have 1 toy car and get 2 more. Count them all!",
            "emoji": "\ud83d\ude97",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "1 plus 2 equals 3 cars!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 9: Adding to 10
-- Module: Addition & Subtraction
-- Widgets: number_bond + ten_frame
-- Standard: 1.OA.C.6
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0009-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  2,
  'Adding to 10',
  'Add bigger numbers! All answers are 10 or less.',
  'You are getting SO good at adding! Now let''s try bigger numbers. Chip''s friend needs help counting how many toys they have together. Can you add them up?',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['83bd2c5d-2fad-441a-9ffb-e1373d5f68aa']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "a10-nb1",
            "prompt": "4 and 3 make what?",
            "whole": null,
            "part1": 4,
            "part2": 3,
            "hint": "Start at 4 and count up 3 more: 5, 6, 7!"
          },
          {
            "id": "a10-nb2",
            "prompt": "What goes with 5 to make 8?",
            "whole": 8,
            "part1": 5,
            "part2": null,
            "hint": "5 plus what equals 8? Count: 5, 6, 7, 8."
          },
          {
            "id": "a10-nb3",
            "prompt": "6 and 4 make what?",
            "whole": null,
            "part1": 6,
            "part2": 4,
            "hint": "6 plus 4... use your fingers!"
          },
          {
            "id": "a10-nb4",
            "prompt": "What goes with 7 to make 10?",
            "whole": 10,
            "part1": 7,
            "part2": null,
            "hint": "7 plus what makes 10? Count: 7, 8, 9, 10!"
          }
        ]
      },
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "a10-tf1",
            "prompt": "Fill 6 dots on the frame!",
            "targetNumber": 6,
            "frameCount": 1
          },
          {
            "id": "a10-tf2",
            "prompt": "Fill 9 dots on the frame!",
            "targetNumber": 9,
            "frameCount": 1
          },
          {
            "id": "a10-tf3",
            "prompt": "Fill all 10 dots! Make a full frame!",
            "targetNumber": 10,
            "frameCount": 1
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 10: Take Away (Subtract to 5)
-- Module: Addition & Subtraction
-- Widgets: number_bond + ten_frame
-- Standard: 1.OA.C.6
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000a-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  3,
  'Take Away (Subtract to 5)',
  'Learn to take away! Start with a small number and remove some.',
  'Oh no! Some of Chip''s snacks got eaten. If Chip had 5 crackers and ate 2, how many are left? That is called SUBTRACTING or taking away. Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['951c53a0-eb22-48f4-a7f6-802f5cde4b40']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "s5-nb1",
            "prompt": "5 take away 2 is what?",
            "whole": 5,
            "part1": 2,
            "part2": null,
            "hint": "Start at 5 and count back 2: 4, 3. The answer is 3!"
          },
          {
            "id": "s5-nb2",
            "prompt": "4 take away 1 is what?",
            "whole": 4,
            "part1": 1,
            "part2": null,
            "hint": "4 minus 1... just go back one number!"
          },
          {
            "id": "s5-nb3",
            "prompt": "3 take away 2 is what?",
            "whole": 3,
            "part1": 2,
            "part2": null,
            "hint": "Start at 3, count back 2: 2, 1. You got 1!"
          },
          {
            "id": "s5-nb4",
            "prompt": "5 take away 3 is what?",
            "whole": 5,
            "part1": 3,
            "part2": null,
            "hint": "5 minus 3: count back 4, 3, 2. The answer is 2!"
          }
        ]
      },
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "s5-tf1",
            "prompt": "Start with 5 dots. Take away 1. How many are left?",
            "targetNumber": 4,
            "frameCount": 1
          },
          {
            "id": "s5-tf2",
            "prompt": "Start with 4 dots. Take away 2. How many are left?",
            "targetNumber": 2,
            "frameCount": 1
          },
          {
            "id": "s5-tf3",
            "prompt": "Start with 3 dots. Take away 1. How many are left?",
            "targetNumber": 2,
            "frameCount": 1
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 11: Take Away (Subtract to 10)
-- Module: Addition & Subtraction
-- Widgets: number_bond + counting
-- Standard: 1.OA.C.6
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000b-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  4,
  'Take Away (Subtract to 10)',
  'Subtract bigger numbers! Start with up to 10 and take some away.',
  'Great job taking away small numbers! Now let''s try bigger ones. Chip has 10 stickers but gave some to friends. How many does Chip have left? Let''s figure it out!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['951c53a0-eb22-48f4-a7f6-802f5cde4b40']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "s10-nb1",
            "prompt": "8 take away 3 is what?",
            "whole": 8,
            "part1": 3,
            "part2": null,
            "hint": "Start at 8 and count back 3: 7, 6, 5!"
          },
          {
            "id": "s10-nb2",
            "prompt": "10 take away 4 is what?",
            "whole": 10,
            "part1": 4,
            "part2": null,
            "hint": "10 minus 4... count back: 9, 8, 7, 6!"
          },
          {
            "id": "s10-nb3",
            "prompt": "7 take away 5 is what?",
            "whole": 7,
            "part1": 5,
            "part2": null,
            "hint": "7 minus 5... count back 5 from 7. You get 2!"
          },
          {
            "id": "s10-nb4",
            "prompt": "9 take away 6 is what?",
            "whole": 9,
            "part1": 6,
            "part2": null,
            "hint": "9 minus 6 is 3!"
          },
          {
            "id": "s10-nb5",
            "prompt": "10 take away 7 is what?",
            "whole": 10,
            "part1": 7,
            "part2": null,
            "hint": "10 minus 7... count back: 9, 8, 7, 6, 5, 4, 3!"
          }
        ]
      },
      {
        "type": "counting",
        "questions": [
          {
            "id": "s10-ct1",
            "prompt": "You had 6 balloons but 2 flew away. Count what is left!",
            "emoji": "\ud83c\udf88",
            "correctCount": 4,
            "displayCount": 4,
            "hint": "6 minus 2 is 4 balloons!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 12: Making 10
-- Module: Addition & Subtraction
-- Widgets: ten_frame + number_bond
-- Standard: 1.OA.C.6
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000c-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  5,
  'Making 10',
  'Find pairs of numbers that add up to 10! These are the friends of 10.',
  'Chip''s favorite number is 10! Did you know lots of number pairs add up to 10? Like 3 and 7, or 6 and 4. These are called "friends of 10." Let''s find them all!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['83bd2c5d-2fad-441a-9ffb-e1373d5f68aa']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "mk10-tf1",
            "prompt": "Fill the whole frame to make 10!",
            "targetNumber": 10,
            "frameCount": 1
          },
          {
            "id": "mk10-tf2",
            "prompt": "There are 7 dots. How many more to make 10?",
            "targetNumber": 10,
            "frameCount": 1
          },
          {
            "id": "mk10-tf3",
            "prompt": "There are 4 dots. Fill up to 10!",
            "targetNumber": 10,
            "frameCount": 1
          }
        ]
      },
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "mk10-nb1",
            "prompt": "1 and ___ make 10!",
            "whole": 10,
            "part1": 1,
            "part2": null,
            "hint": "Count up from 1 to 10. How many more?"
          },
          {
            "id": "mk10-nb2",
            "prompt": "3 and ___ make 10!",
            "whole": 10,
            "part1": 3,
            "part2": null,
            "hint": "Use your fingers! Show 3 and count the rest."
          },
          {
            "id": "mk10-nb3",
            "prompt": "5 and ___ make 10!",
            "whole": 10,
            "part1": 5,
            "part2": null,
            "hint": "5 is half of 10! What is the other half?"
          },
          {
            "id": "mk10-nb4",
            "prompt": "8 and ___ make 10!",
            "whole": 10,
            "part1": 8,
            "part2": null,
            "hint": "8, 9, 10... you need 2 more!"
          },
          {
            "id": "mk10-nb5",
            "prompt": "6 and ___ make 10!",
            "whole": 10,
            "part1": 6,
            "part2": null,
            "hint": "6 plus 4 equals 10!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 13: Addition within 20
-- Module: Addition & Subtraction
-- Widgets: number_line + number_bond
-- Standard: 1.OA.A.1, 1.OA.C.5
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000d-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  6,
  'Addition within 20',
  'Add numbers that go higher than 10! Use the number line to help.',
  'You already know how to add to 10. Now let''s go BIGGER and add up to 20! Chip will show you a number line to hop along. Ready to jump?',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['42fd1fb0-e7b2-46e9-8f2a-f560e4b1cbc4']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "number_line",
        "questions": [
          {
            "id": "a20-nl1",
            "prompt": "Start at 8 and add 3. Where do you land?",
            "min": 0,
            "max": 20,
            "startPosition": 8,
            "correctEndPosition": 11,
            "operation": "add",
            "hint": "Hop 3 from 8: 9, 10, 11!"
          },
          {
            "id": "a20-nl2",
            "prompt": "Start at 9 and add 5. Where do you land?",
            "min": 0,
            "max": 20,
            "startPosition": 9,
            "correctEndPosition": 14,
            "operation": "add",
            "hint": "9 plus 5: hop to 10, 11, 12, 13, 14!"
          },
          {
            "id": "a20-nl3",
            "prompt": "Start at 7 and add 6. Where do you land?",
            "min": 0,
            "max": 20,
            "startPosition": 7,
            "correctEndPosition": 13,
            "operation": "add",
            "hint": "7 plus 6: make 10 first (7+3=10), then 3 more = 13!"
          },
          {
            "id": "a20-nl4",
            "prompt": "Start at 10 and add 8. Where do you land?",
            "min": 0,
            "max": 20,
            "startPosition": 10,
            "correctEndPosition": 18,
            "operation": "add",
            "hint": "10 plus 8 is 18! Easy when you start at 10!"
          }
        ]
      },
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "a20-nb1",
            "prompt": "9 and 4 make what?",
            "whole": null,
            "part1": 9,
            "part2": 4,
            "hint": "9 plus 1 is 10, then 3 more is 13!"
          },
          {
            "id": "a20-nb2",
            "prompt": "8 and 7 make what?",
            "whole": null,
            "part1": 8,
            "part2": 7,
            "hint": "8 plus 2 is 10, then 5 more is 15!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 14: Story Problems
-- Module: Addition & Subtraction
-- Widgets: multiple_choice (word problems)
-- Standard: 1.OA.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000e-4000-8000-000000000001',
  '10000001-0102-4000-8000-000000000001',
  7,
  'Story Problems',
  'Solve word problems about adding and taking away!',
  'Chip loves stories and math! Let''s put them together. Read each little story and figure out the answer. You can do this!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['83bd2c5d-2fad-441a-9ffb-e1373d5f68aa', '951c53a0-eb22-48f4-a7f6-802f5cde4b40']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sp-1",
            "prompt": "Chip has 3 apples. A friend gives Chip 4 more. How many apples does Chip have now?",
            "options": [
              {"id": "a", "text": "5"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "7"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "Start with 3 and count up 4 more: 4, 5, 6, 7!"
          },
          {
            "id": "sp-2",
            "prompt": "There are 8 birds on a tree. 3 fly away. How many birds are left?",
            "options": [
              {"id": "a", "text": "4"},
              {"id": "b", "text": "5"},
              {"id": "c", "text": "6"},
              {"id": "d", "text": "3"}
            ],
            "correctOptionId": "b",
            "hint": "Start with 8 and count back 3: 7, 6, 5!"
          },
          {
            "id": "sp-3",
            "prompt": "You have 5 crayons and find 2 more. How many crayons do you have?",
            "options": [
              {"id": "a", "text": "3"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "7"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "5 plus 2 equals 7!"
          },
          {
            "id": "sp-4",
            "prompt": "There are 10 cookies on a plate. You eat 4. How many are left?",
            "options": [
              {"id": "a", "text": "5"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "7"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "b",
            "hint": "10 take away 4: count back 9, 8, 7, 6!"
          },
          {
            "id": "sp-5",
            "prompt": "Chip sees 6 dogs at the park. Then 3 more dogs come. How many dogs are there now?",
            "options": [
              {"id": "a", "text": "8"},
              {"id": "b", "text": "9"},
              {"id": "c", "text": "10"},
              {"id": "d", "text": "3"}
            ],
            "correctOptionId": "b",
            "hint": "6 plus 3: count up 7, 8, 9!"
          },
          {
            "id": "sp-6",
            "prompt": "You have 7 stickers. You give 5 to a friend. How many do you have left?",
            "options": [
              {"id": "a", "text": "1"},
              {"id": "b", "text": "2"},
              {"id": "c", "text": "3"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "b",
            "hint": "7 take away 5: count back 6, 5, 4, 3, 2!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MODULE 3: PLACE VALUE & COMPARING (5 lessons)
-- =========================================================================


-- =========================================================================
-- LESSON 15: Tens and Ones
-- Module: Place Value & Comparing
-- Widgets: ten_frame + multiple_choice
-- Standard: 1.NBT.B.2
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-000f-4000-8000-000000000001',
  '10000001-0103-4000-8000-000000000001',
  1,
  'Tens and Ones',
  'Learn that numbers are made of tens and ones! 13 is 1 ten and 3 ones.',
  'Chip has a secret about numbers! Big numbers are made of TENS and ONES. The number 14 is 1 group of ten and 4 extra ones. Cool, right? Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['d6fdf1c2-9ecb-4bd8-89fb-b37b42252870']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "to-tf1",
            "prompt": "Show 10! Fill up one whole frame.",
            "targetNumber": 10,
            "frameCount": 1
          },
          {
            "id": "to-tf2",
            "prompt": "Show 13. That is 1 ten and 3 ones!",
            "targetNumber": 13,
            "frameCount": 2
          },
          {
            "id": "to-tf3",
            "prompt": "Show 16. That is 1 ten and 6 ones!",
            "targetNumber": 16,
            "frameCount": 2
          },
          {
            "id": "to-tf4",
            "prompt": "Show 19. That is 1 ten and 9 ones!",
            "targetNumber": 19,
            "frameCount": 2
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "to-mc1",
            "prompt": "The number 15 has how many TENS?",
            "options": [
              {"id": "a", "text": "0 tens"},
              {"id": "b", "text": "1 ten"},
              {"id": "c", "text": "5 tens"},
              {"id": "d", "text": "15 tens"}
            ],
            "correctOptionId": "b",
            "hint": "15 is 1 group of ten and 5 extra ones!"
          },
          {
            "id": "to-mc2",
            "prompt": "The number 12 has how many ONES?",
            "options": [
              {"id": "a", "text": "1"},
              {"id": "b", "text": "2"},
              {"id": "c", "text": "10"},
              {"id": "d", "text": "12"}
            ],
            "correctOptionId": "b",
            "hint": "12 is 1 ten and 2 ones. The ones digit is 2!"
          },
          {
            "id": "to-mc3",
            "prompt": "Which number is 1 ten and 7 ones?",
            "options": [
              {"id": "a", "text": "7"},
              {"id": "b", "text": "10"},
              {"id": "c", "text": "17"},
              {"id": "d", "text": "71"}
            ],
            "correctOptionId": "c",
            "hint": "1 ten is 10, plus 7 ones makes 17!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 16: Count by 10s (Rekenrek)
-- Module: Place Value & Comparing
-- Widgets: rekenrek + fill_in_blank
-- Standard: 1.NBT.B.2, 1.NBT.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0010-4000-8000-000000000001',
  '10000001-0103-4000-8000-000000000001',
  2,
  'Count by 10s with Beads',
  'Use the bead frame to count groups of 10!',
  'Look at this cool bead frame! Each row has 10 beads. Chip will help you see how groups of 10 make bigger numbers. Slide the beads and count!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['d6fdf1c2-9ecb-4bd8-89fb-b37b42252870', '73513881-2984-40bb-bbe2-fde73d06fd55']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "rekenrek",
        "questions": [
          {
            "id": "rk10-1",
            "prompt": "Show 5 beads on the frame!",
            "targetNumber": 5,
            "mode": "show"
          },
          {
            "id": "rk10-2",
            "prompt": "Show 10 beads -- fill a whole row!",
            "targetNumber": 10,
            "mode": "show"
          },
          {
            "id": "rk10-3",
            "prompt": "Show 14 beads. That is 1 full row plus 4 more!",
            "targetNumber": 14,
            "mode": "show"
          },
          {
            "id": "rk10-4",
            "prompt": "How many beads do you see? Count them!",
            "targetNumber": 8,
            "mode": "count"
          },
          {
            "id": "rk10-5",
            "prompt": "How many beads are showing?",
            "targetNumber": 17,
            "mode": "count"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "rk10-fb1",
            "prompt": "1 ten and 3 ones = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "13", "acceptableAnswers": ["13"] }],
            "hint": "10 plus 3 equals..."
          },
          {
            "id": "rk10-fb2",
            "prompt": "1 ten and 8 ones = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "18", "acceptableAnswers": ["18"] }],
            "hint": "10 plus 8 equals..."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 17: Compare Numbers (>, <, =)
-- Module: Place Value & Comparing
-- Widgets: multiple_choice
-- Standard: 1.NBT.B.3
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0011-4000-8000-000000000001',
  '10000001-0103-4000-8000-000000000001',
  3,
  'Compare Numbers (>, <, =)',
  'Use greater than, less than, and equal signs to compare numbers!',
  'Time to learn some fun math symbols! The > sign means "greater than" and the < sign means "less than." Think of them like a hungry alligator -- it always eats the BIGGER number! Let''s try!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['138bb984-147f-42f6-862a-0cf969491dcb', 'd6fdf1c2-9ecb-4bd8-89fb-b37b42252870']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cmp2-1",
            "prompt": "Which sign goes between 7 ___ 3?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "a",
            "hint": "7 is bigger than 3, so the alligator eats the 7! That means 7 > 3."
          },
          {
            "id": "cmp2-2",
            "prompt": "Which sign goes between 4 ___ 9?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "b",
            "hint": "4 is smaller than 9. The alligator eats the 9! So 4 < 9."
          },
          {
            "id": "cmp2-3",
            "prompt": "Which sign goes between 5 ___ 5?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "c",
            "hint": "They are the same number! 5 equals 5."
          },
          {
            "id": "cmp2-4",
            "prompt": "Which sign goes between 12 ___ 8?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "a",
            "hint": "12 is bigger than 8! 12 > 8."
          },
          {
            "id": "cmp2-5",
            "prompt": "Which sign goes between 6 ___ 15?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "b",
            "hint": "6 is smaller than 15. 6 < 15."
          },
          {
            "id": "cmp2-6",
            "prompt": "Which sign goes between 10 ___ 10?",
            "options": [
              {"id": "a", "text": ">  (greater than)"},
              {"id": "b", "text": "<  (less than)"},
              {"id": "c", "text": "=  (equal to)"}
            ],
            "correctOptionId": "c",
            "hint": "10 and 10 are the same! 10 = 10."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 18: Number Patterns
-- Module: Place Value & Comparing
-- Widgets: fill_in_blank + sequence_order
-- Standard: 1.OA.C.5
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0012-4000-8000-000000000001',
  '10000001-0103-4000-8000-000000000001',
  4,
  'Number Patterns',
  'Find the pattern and figure out what comes next!',
  'Chip loves puzzles! Numbers can make cool patterns. Like 2, 4, 6, 8 -- see how they go up by 2 each time? Let''s find more patterns together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['138bb984-147f-42f6-862a-0cf969491dcb']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "pat-1",
            "prompt": "2, 4, 6, ___, 10",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "The numbers go up by 2 each time. 6 plus 2 is..."
          },
          {
            "id": "pat-2",
            "prompt": "1, 3, 5, ___, 9",
            "blanks": [{ "id": "b1", "correctAnswer": "7", "acceptableAnswers": ["7"] }],
            "hint": "These are odd numbers. They go up by 2! 5 plus 2 is..."
          },
          {
            "id": "pat-3",
            "prompt": "5, 10, 15, ___",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "Counting by 5s! 15 plus 5 is..."
          },
          {
            "id": "pat-4",
            "prompt": "3, 6, 9, ___",
            "blanks": [{ "id": "b1", "correctAnswer": "12", "acceptableAnswers": ["12"] }],
            "hint": "Counting by 3s! 9 plus 3 is..."
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pat-so1",
            "prompt": "Put these numbers in the right pattern order (counting by 2s)!",
            "items": [
              {"id": "i1", "text": "2"},
              {"id": "i2", "text": "4"},
              {"id": "i3", "text": "6"},
              {"id": "i4", "text": "8"},
              {"id": "i5", "text": "10"}
            ]
          },
          {
            "id": "pat-so2",
            "prompt": "Put these numbers in the right pattern order (counting by 5s)!",
            "items": [
              {"id": "i1", "text": "5"},
              {"id": "i2", "text": "10"},
              {"id": "i3", "text": "15"},
              {"id": "i4", "text": "20"}
            ]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 19: Two-Digit Numbers
-- Module: Place Value & Comparing
-- Widgets: ten_frame + fill_in_blank
-- Standard: 1.NBT.B.2
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0013-4000-8000-000000000001',
  '10000001-0103-4000-8000-000000000001',
  5,
  'Two-Digit Numbers',
  'Explore bigger numbers! Understand what each digit means in numbers like 25 and 34.',
  'Numbers with TWO digits are so cool! The first digit tells you how many tens, and the second tells you how many ones. Like 25 is 2 tens and 5 ones. Let''s figure out more!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['d6fdf1c2-9ecb-4bd8-89fb-b37b42252870']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "td-tf1",
            "prompt": "Show 11. That is 1 ten and 1 one!",
            "targetNumber": 11,
            "frameCount": 2
          },
          {
            "id": "td-tf2",
            "prompt": "Show 15. That is 1 ten and 5 ones!",
            "targetNumber": 15,
            "frameCount": 2
          },
          {
            "id": "td-tf3",
            "prompt": "Show 20. That is 2 full tens!",
            "targetNumber": 20,
            "frameCount": 2
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "td-fb1",
            "prompt": "2 tens and 3 ones = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "23", "acceptableAnswers": ["23"] }],
            "hint": "2 tens is 20, plus 3 ones is 23!"
          },
          {
            "id": "td-fb2",
            "prompt": "3 tens and 0 ones = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "3 tens and no extra ones. That is just 30!"
          },
          {
            "id": "td-fb3",
            "prompt": "1 ten and 9 ones = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "19", "acceptableAnswers": ["19"] }],
            "hint": "10 plus 9 is..."
          },
          {
            "id": "td-fb4",
            "prompt": "The number 27 has ___ tens.",
            "blanks": [{ "id": "b1", "correctAnswer": "2", "acceptableAnswers": ["2"] }],
            "hint": "Look at the first digit of 27!"
          },
          {
            "id": "td-fb5",
            "prompt": "The number 34 has ___ ones.",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "Look at the last digit of 34!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MODULE 4: SHAPES & MEASUREMENT (6 lessons)
-- =========================================================================


-- =========================================================================
-- LESSON 20: 2D Shapes
-- Module: Shapes & Measurement
-- Widgets: flash_card + matching_pairs
-- Standard: 1.G.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0014-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  1,
  '2D Shapes',
  'Learn the names of flat shapes like circles, squares, triangles, and more!',
  'Shapes are EVERYWHERE! Chip sees them all the time. A door is a rectangle, a wheel is a circle, and a slice of pizza is a triangle. Let''s learn about flat shapes together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['6dbe4d0d-411e-4800-a390-92c4063f485a']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Learn these shapes! Flip each card to see its name.",
        "cards": [
          {"id": "fc-1", "front": "\u25cb  (this shape)", "back": "Circle - 0 sides, 0 corners, perfectly round!"},
          {"id": "fc-2", "front": "\u25a1  (this shape)", "back": "Square - 4 equal sides, 4 corners"},
          {"id": "fc-3", "front": "\u25b3  (this shape)", "back": "Triangle - 3 sides, 3 corners"},
          {"id": "fc-4", "front": "\u25ad  (this shape)", "back": "Rectangle - 4 sides, 4 corners, opposite sides equal"},
          {"id": "fc-5", "front": "\u2b21  (this shape)", "back": "Hexagon - 6 sides, 6 corners"}
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each shape to its name!",
        "pairs": [
          {"id": "mp-1", "left": {"id": "mp-1-l", "text": "\u25cb  Circle shape"}, "right": {"id": "mp-1-r", "text": "Circle"}},
          {"id": "mp-2", "left": {"id": "mp-2-l", "text": "\u25a1  Square shape"}, "right": {"id": "mp-2-r", "text": "Square"}},
          {"id": "mp-3", "left": {"id": "mp-3-l", "text": "\u25b3  Triangle shape"}, "right": {"id": "mp-3-r", "text": "Triangle"}},
          {"id": "mp-4", "left": {"id": "mp-4-l", "text": "\u25ad  Rectangle shape"}, "right": {"id": "mp-4-r", "text": "Rectangle"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 21: Attributes of Shapes
-- Module: Shapes & Measurement
-- Widgets: multiple_choice
-- Standard: 1.G.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0015-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  2,
  'Attributes of Shapes',
  'Count sides and corners! Learn what makes each shape special.',
  'Each shape has special things about it -- sides and corners! A triangle has 3 sides and 3 corners. Let''s count the sides and corners of different shapes. Chip is great at counting!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['6dbe4d0d-411e-4800-a390-92c4063f485a']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "attr-1",
            "prompt": "How many sides does a triangle have?",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "3"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "5"}
            ],
            "correctOptionId": "b",
            "hint": "TRI means 3! A triangle has 3 sides."
          },
          {
            "id": "attr-2",
            "prompt": "How many corners does a square have?",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "3"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "5"}
            ],
            "correctOptionId": "c",
            "hint": "A square has 4 sides AND 4 corners!"
          },
          {
            "id": "attr-3",
            "prompt": "How many sides does a circle have?",
            "options": [
              {"id": "a", "text": "0"},
              {"id": "b", "text": "1"},
              {"id": "c", "text": "2"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "a",
            "hint": "A circle is round with NO straight sides!"
          },
          {
            "id": "attr-4",
            "prompt": "Which shape has 4 sides but they are NOT all the same length?",
            "options": [
              {"id": "a", "text": "Square"},
              {"id": "b", "text": "Circle"},
              {"id": "c", "text": "Rectangle"},
              {"id": "d", "text": "Triangle"}
            ],
            "correctOptionId": "c",
            "hint": "A rectangle has 2 long sides and 2 short sides!"
          },
          {
            "id": "attr-5",
            "prompt": "Which shape has 3 sides and 3 corners?",
            "options": [
              {"id": "a", "text": "Square"},
              {"id": "b", "text": "Triangle"},
              {"id": "c", "text": "Circle"},
              {"id": "d", "text": "Rectangle"}
            ],
            "correctOptionId": "b",
            "hint": "3 sides and 3 corners -- that is a triangle!"
          },
          {
            "id": "attr-6",
            "prompt": "A hexagon has how many sides?",
            "options": [
              {"id": "a", "text": "4"},
              {"id": "b", "text": "5"},
              {"id": "c", "text": "6"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "HEX means 6! A hexagon has 6 sides."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 22: 3D Shapes
-- Module: Shapes & Measurement
-- Widgets: flash_card + multiple_choice
-- Standard: 1.G.A.2
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0016-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  3,
  '3D Shapes',
  'Explore shapes you can hold! Cubes, spheres, cylinders, and cones.',
  'Flat shapes are cool, but 3D shapes are even cooler because you can HOLD them! A ball is a sphere, a box is a cube, and a can of soup is a cylinder. Let''s learn about 3D shapes!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['6dbe4d0d-411e-4800-a390-92c4063f485a']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Learn these 3D shapes! Flip each card to see its name and real-life example.",
        "cards": [
          {"id": "3d-1", "front": "A ball you play with", "back": "Sphere - perfectly round in every direction, like a basketball!"},
          {"id": "3d-2", "front": "A box or dice", "back": "Cube - 6 flat square faces, 8 corners"},
          {"id": "3d-3", "front": "A soup can", "back": "Cylinder - 2 flat circle ends and a curved side"},
          {"id": "3d-4", "front": "An ice cream cone shape", "back": "Cone - 1 flat circle bottom and a pointy top"},
          {"id": "3d-5", "front": "A cereal box", "back": "Rectangular prism - 6 flat rectangle faces"}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "3d-mc1",
            "prompt": "Which 3D shape looks like a ball?",
            "options": [
              {"id": "a", "text": "Cube"},
              {"id": "b", "text": "Sphere"},
              {"id": "c", "text": "Cone"},
              {"id": "d", "text": "Cylinder"}
            ],
            "correctOptionId": "b",
            "hint": "A ball is round in every direction. That is a sphere!"
          },
          {
            "id": "3d-mc2",
            "prompt": "Which 3D shape has a point on top and a flat circle bottom?",
            "options": [
              {"id": "a", "text": "Sphere"},
              {"id": "b", "text": "Cube"},
              {"id": "c", "text": "Cone"},
              {"id": "d", "text": "Cylinder"}
            ],
            "correctOptionId": "c",
            "hint": "Think of an ice cream cone -- pointy on top, flat on bottom!"
          },
          {
            "id": "3d-mc3",
            "prompt": "A dice is shaped like a ___.",
            "options": [
              {"id": "a", "text": "Sphere"},
              {"id": "b", "text": "Cylinder"},
              {"id": "c", "text": "Cone"},
              {"id": "d", "text": "Cube"}
            ],
            "correctOptionId": "d",
            "hint": "A dice has 6 flat square faces. That is a cube!"
          },
          {
            "id": "3d-mc4",
            "prompt": "A can of soup is shaped like a ___.",
            "options": [
              {"id": "a", "text": "Cone"},
              {"id": "b", "text": "Cylinder"},
              {"id": "c", "text": "Cube"},
              {"id": "d", "text": "Sphere"}
            ],
            "correctOptionId": "b",
            "hint": "A can has 2 circles (top and bottom) and a curved side. That is a cylinder!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 23: Longer or Shorter
-- Module: Shapes & Measurement
-- Widgets: multiple_choice + matching_pairs
-- Standard: 1.MD.A.1
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0017-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  4,
  'Longer or Shorter',
  'Compare lengths! Which things are longer and which are shorter?',
  'Chip found some things and wants to know which one is longer! Is a pencil longer than a crayon? Is a bus longer than a car? Let''s measure and compare!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['c6f9f6b7-326a-4ddb-9396-dbc7b79d1f9c']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "len-1",
            "prompt": "Which is LONGER: a pencil or a crayon?",
            "options": [
              {"id": "a", "text": "Pencil"},
              {"id": "b", "text": "Crayon"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "a",
            "hint": "A pencil is usually longer than a crayon!"
          },
          {
            "id": "len-2",
            "prompt": "Which is SHORTER: a cat or an ant?",
            "options": [
              {"id": "a", "text": "Cat"},
              {"id": "b", "text": "Ant"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "b",
            "hint": "An ant is tiny! It is much shorter than a cat."
          },
          {
            "id": "len-3",
            "prompt": "Which is LONGER: a bus or a bicycle?",
            "options": [
              {"id": "a", "text": "Bus"},
              {"id": "b", "text": "Bicycle"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "a",
            "hint": "A bus is much bigger and longer than a bicycle!"
          },
          {
            "id": "len-4",
            "prompt": "Which is TALLER: a tree or a flower?",
            "options": [
              {"id": "a", "text": "Tree"},
              {"id": "b", "text": "Flower"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "a",
            "hint": "Trees grow very tall, much taller than flowers!"
          },
          {
            "id": "len-5",
            "prompt": "Which is SHORTER: a book or a ruler?",
            "options": [
              {"id": "a", "text": "Book"},
              {"id": "b", "text": "Ruler"},
              {"id": "c", "text": "It depends on the book!"}
            ],
            "correctOptionId": "c",
            "hint": "Some books are small and some are big. It really does depend!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each item to whether it is usually LONG or SHORT!",
        "pairs": [
          {"id": "lm-1", "left": {"id": "lm-1-l", "text": "A train"}, "right": {"id": "lm-1-r", "text": "Very long"}},
          {"id": "lm-2", "left": {"id": "lm-2-l", "text": "A paper clip"}, "right": {"id": "lm-2-r", "text": "Very short"}},
          {"id": "lm-3", "left": {"id": "lm-3-l", "text": "A jump rope"}, "right": {"id": "lm-3-r", "text": "Long"}},
          {"id": "lm-4", "left": {"id": "lm-4-l", "text": "A button"}, "right": {"id": "lm-4-r", "text": "Short"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 24: Tell Time to the Hour
-- Module: Shapes & Measurement
-- Widgets: matching_pairs + multiple_choice
-- Standard: 1.MD.B.3
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0018-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  5,
  'Tell Time to the Hour',
  'Learn to read a clock! When the big hand is on 12 and the little hand points to a number, that is the hour.',
  'Chip wants to know what time it is! A clock has a BIG hand and a LITTLE hand. When the big hand points UP to 12, the little hand shows the hour. Let''s practice reading clocks!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['78755bee-66fa-4e19-bd6b-be94a5e05069']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each clock description to the correct time!",
        "pairs": [
          {"id": "tm-1", "left": {"id": "tm-1-l", "text": "Little hand on 3, big hand on 12"}, "right": {"id": "tm-1-r", "text": "3 o''clock"}},
          {"id": "tm-2", "left": {"id": "tm-2-l", "text": "Little hand on 7, big hand on 12"}, "right": {"id": "tm-2-r", "text": "7 o''clock"}},
          {"id": "tm-3", "left": {"id": "tm-3-l", "text": "Little hand on 1, big hand on 12"}, "right": {"id": "tm-3-r", "text": "1 o''clock"}},
          {"id": "tm-4", "left": {"id": "tm-4-l", "text": "Little hand on 9, big hand on 12"}, "right": {"id": "tm-4-r", "text": "9 o''clock"}},
          {"id": "tm-5", "left": {"id": "tm-5-l", "text": "Little hand on 12, big hand on 12"}, "right": {"id": "tm-5-r", "text": "12 o''clock"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tm-mc1",
            "prompt": "The little hand points to 5 and the big hand points to 12. What time is it?",
            "options": [
              {"id": "a", "text": "12 o''clock"},
              {"id": "b", "text": "5 o''clock"},
              {"id": "c", "text": "3 o''clock"},
              {"id": "d", "text": "10 o''clock"}
            ],
            "correctOptionId": "b",
            "hint": "The little hand tells the hour. It points to 5, so it is 5 o''clock!"
          },
          {
            "id": "tm-mc2",
            "prompt": "It is 8 o''clock. Where does the LITTLE hand point?",
            "options": [
              {"id": "a", "text": "12"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "8"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "c",
            "hint": "At 8 o''clock, the little hand points to... 8!"
          },
          {
            "id": "tm-mc3",
            "prompt": "At any o''clock time, where does the BIG hand always point?",
            "options": [
              {"id": "a", "text": "3"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "9"},
              {"id": "d", "text": "12"}
            ],
            "correctOptionId": "d",
            "hint": "At exactly an o''clock time, the big hand always points straight up to 12!"
          },
          {
            "id": "tm-mc4",
            "prompt": "Which time do you usually eat lunch?",
            "options": [
              {"id": "a", "text": "6 o''clock in the morning"},
              {"id": "b", "text": "12 o''clock noon"},
              {"id": "c", "text": "3 o''clock in the morning"},
              {"id": "d", "text": "9 o''clock at night"}
            ],
            "correctOptionId": "b",
            "hint": "Most kids eat lunch around 12 o''clock, which is noon!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 25: Equal Parts (Halves)
-- Module: Shapes & Measurement
-- Widgets: multiple_choice
-- Standard: 1.G.A.3
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1010001-0019-4000-8000-000000000001',
  '10000001-0104-4000-8000-000000000001',
  6,
  'Equal Parts (Halves)',
  'Learn to split shapes into two equal parts called halves!',
  'Chip wants to share a cookie with a friend! If you break a cookie into 2 EQUAL pieces, each piece is called a HALF. Let''s learn how to split things into halves!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['6dbe4d0d-411e-4800-a390-92c4063f485a']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "half-1",
            "prompt": "If you cut a pizza into 2 EQUAL slices, each slice is called a ___.",
            "options": [
              {"id": "a", "text": "Quarter"},
              {"id": "b", "text": "Half"},
              {"id": "c", "text": "Third"},
              {"id": "d", "text": "Whole"}
            ],
            "correctOptionId": "b",
            "hint": "Two equal pieces means each one is a HALF!"
          },
          {
            "id": "half-2",
            "prompt": "How many halves make a whole?",
            "options": [
              {"id": "a", "text": "1"},
              {"id": "b", "text": "2"},
              {"id": "c", "text": "3"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "b",
            "hint": "If you put 2 halves back together, you get the whole thing!"
          },
          {
            "id": "half-3",
            "prompt": "A rectangle is cut in half. Are the two pieces EQUAL in size?",
            "options": [
              {"id": "a", "text": "Yes, always if it is cut in half"},
              {"id": "b", "text": "No, never"},
              {"id": "c", "text": "Only if the cut goes through the middle"}
            ],
            "correctOptionId": "c",
            "hint": "For halves to be equal, you must cut right through the middle!"
          },
          {
            "id": "half-4",
            "prompt": "Chip has 1 sandwich cut into 2 equal parts. Chip eats 1 part. How much is left?",
            "options": [
              {"id": "a", "text": "1 whole sandwich"},
              {"id": "b", "text": "1 half of the sandwich"},
              {"id": "c", "text": "Nothing is left"},
              {"id": "d", "text": "2 halves"}
            ],
            "correctOptionId": "b",
            "hint": "Chip ate 1 half, so 1 half is left!"
          },
          {
            "id": "half-5",
            "prompt": "Which shape is split into 2 EQUAL halves?",
            "options": [
              {"id": "a", "text": "A circle with a line through the middle"},
              {"id": "b", "text": "A circle with a line near the top"},
              {"id": "c", "text": "A circle with no line"},
              {"id": "d", "text": "A circle cut into 4 pieces"}
            ],
            "correctOptionId": "a",
            "hint": "A line through the MIDDLE makes 2 equal halves!"
          },
          {
            "id": "half-6",
            "prompt": "You and your friend want to share a brownie equally. How should you cut it?",
            "options": [
              {"id": "a", "text": "Into 1 big piece and 1 tiny piece"},
              {"id": "b", "text": "Into 2 equal pieces"},
              {"id": "c", "text": "Into 3 pieces"},
              {"id": "d", "text": "Don''t cut it at all"}
            ],
            "correctOptionId": "b",
            "hint": "To share EQUALLY means both pieces are the same size. Cut into 2 equal halves!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- SUMMARY
-- =========================================================================
-- Total lessons seeded: 25
--
-- Module 1 - Counting & Number Sense (7 lessons):
--   b1010001-0001  Count to 20
--   b1010001-0002  Count to 50
--   b1010001-0003  Count to 100!
--   b1010001-0004  Number Before & After
--   b1010001-0005  Comparing Numbers
--   b1010001-0006  Count by 10s to 100
--   b1010001-0007  Ordering Numbers
--
-- Module 2 - Addition & Subtraction (7 lessons):
--   b1010001-0008  Adding to 5
--   b1010001-0009  Adding to 10
--   b1010001-000a  Take Away (Subtract to 5)
--   b1010001-000b  Take Away (Subtract to 10)
--   b1010001-000c  Making 10
--   b1010001-000d  Addition within 20
--   b1010001-000e  Story Problems
--
-- Module 3 - Place Value & Comparing (5 lessons):
--   b1010001-000f  Tens and Ones
--   b1010001-0010  Count by 10s with Beads
--   b1010001-0011  Compare Numbers (>, <, =)
--   b1010001-0012  Number Patterns
--   b1010001-0013  Two-Digit Numbers
--
-- Module 4 - Shapes & Measurement (6 lessons):
--   b1010001-0014  2D Shapes
--   b1010001-0015  Attributes of Shapes
--   b1010001-0016  3D Shapes
--   b1010001-0017  Longer or Shorter
--   b1010001-0018  Tell Time to the Hour
--   b1010001-0019  Equal Parts (Halves)
-- =========================================================================
