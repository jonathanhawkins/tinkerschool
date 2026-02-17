-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math: Fractions & Geometry Interactive Lessons
-- =============================================================================
-- 4 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - Lesson 1: Equal Parts: Halves
--   - Lesson 2: Thirds and Fourths
--   - Lesson 3: Arrays: Rows and Columns
--   - Lesson 4: Repeated Addition with Arrays
--
-- Widget types used: multiple_choice, matching_pairs, fill_in_blank, counting
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 017_seed_math_visual_lessons.sql   (established 2nd-grade Math subject)
--   - 019_seed_2nd_grade_math_problemsolving.sql (Basic Fractions skill)
--
-- Subject ID:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module ID:
--   Fractions & Geometry: 10000002-0109-4000-8000-000000000001
--
-- Skill IDs:
--   Basic Fractions (reused):         20000001-0004-4000-8000-000000000001
--   Arrays and Repeated Addition:     20000001-000b-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Subject, Module, Skills
-- =========================================================================

-- 0a. Subject (ON CONFLICT for idempotency)
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('71c781e1-71c9-455e-8e18-aea0676b490a', 'math_g2', 'Number World G2', 'Math', '#3B82F6', 'calculator', 8)
ON CONFLICT (id) DO NOTHING;

-- 0b. Module
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0109-4000-8000-000000000001', 2, 23, 'Fractions & Geometry', 'Discover equal parts, halves, thirds, and fourths! Plus, explore arrays and repeated addition!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  -- Reuse existing Basic Fractions skill
  ('20000001-0004-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'fractions_basic', 'Basic Fractions', 'Partition circles and rectangles into halves and fourths', '2.G.A.3', 4),
  -- New skill: Arrays and Repeated Addition
  ('20000001-000b-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'arrays_repeated_addition', 'Arrays and Repeated Addition', 'Use rectangular arrays to model repeated addition and understand rows and columns', '2.OA.C.4', 11)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Equal Parts: Halves
-- Module: Fractions & Geometry
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0021-4000-8000-000000000001',
  '10000002-0109-4000-8000-000000000001',
  1,
  'Equal Parts: Halves',
  'Learn what it means to split something into two equal parts! Each part is one half.',
  'Hey there, superstar! Chip here! Imagine you have a yummy pizza and you want to share it with your best friend. If you cut it RIGHT down the middle so both pieces are the SAME size, each piece is ONE HALF! But watch out -- if the pieces are NOT the same size, those are NOT halves. Let''s figure out which shapes are split into real halves!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "eh-mc1",
            "prompt": "A circle is split into 2 pieces. One piece is BIG and the other is small. Is this cut into halves? \ud83c\udf55",
            "options": [
              {"id": "a", "text": "Yes, those are halves"},
              {"id": "b", "text": "No, the pieces are not equal"}
            ],
            "correctOptionId": "b",
            "hint": "Halves must be EQUAL sizes! If one piece is bigger, they are not halves."
          },
          {
            "id": "eh-mc2",
            "prompt": "A sandwich is cut straight down the middle into 2 pieces that are the SAME size. Is this cut into halves? \ud83e\udd6a",
            "options": [
              {"id": "a", "text": "Yes, those are halves!"},
              {"id": "b", "text": "No, those are not halves"}
            ],
            "correctOptionId": "a",
            "hint": "Two pieces that are the SAME size means each one is one half! Great job!"
          },
          {
            "id": "eh-mc3",
            "prompt": "A rectangle is split into 2 equal parts. What do we call each part?",
            "options": [
              {"id": "a", "text": "One third"},
              {"id": "b", "text": "One half"},
              {"id": "c", "text": "One fourth"},
              {"id": "d", "text": "One whole"}
            ],
            "correctOptionId": "b",
            "hint": "When you split something into 2 EQUAL parts, each part is called one half!"
          },
          {
            "id": "eh-mc4",
            "prompt": "Which of these shows a shape cut into halves? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "A square with a line in the exact middle"},
              {"id": "b", "text": "A square with a line near the edge"},
              {"id": "c", "text": "A square with no line at all"},
              {"id": "d", "text": "A square cut into 3 pieces"}
            ],
            "correctOptionId": "a",
            "hint": "A line in the exact middle makes 2 EQUAL parts -- those are halves!"
          },
          {
            "id": "eh-mc5",
            "prompt": "How many halves make a whole? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "1"},
              {"id": "b", "text": "2"},
              {"id": "c", "text": "3"},
              {"id": "d", "text": "4"}
            ],
            "correctOptionId": "b",
            "hint": "If you put both halves back together, you get the whole thing! 2 halves = 1 whole."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each shape description to \"Halves\" or \"Not Halves\"! \u2702\ufe0f",
        "pairs": [
          { "id": "p1", "left": {"id": "l1", "text": "Circle split into 2 equal parts", "emoji": "\u26aa"}, "right": {"id": "r1", "text": "Halves", "emoji": "\u2705"} },
          { "id": "p2", "left": {"id": "l2", "text": "Rectangle: one big piece and one tiny piece", "emoji": "\ud83d\udfe8"}, "right": {"id": "r2", "text": "Not Halves", "emoji": "\u274c"} },
          { "id": "p3", "left": {"id": "l3", "text": "Square split right down the middle", "emoji": "\ud83d\udfea"}, "right": {"id": "r3", "text": "Halves", "emoji": "\u2705"} },
          { "id": "p4", "left": {"id": "l4", "text": "Triangle split into 2 unequal parts", "emoji": "\ud83d\udd3a"}, "right": {"id": "r4", "text": "Not Halves", "emoji": "\u274c"} },
          { "id": "p5", "left": {"id": "l5", "text": "Heart split into 2 equal parts", "emoji": "\u2764\ufe0f"}, "right": {"id": "r5", "text": "Halves", "emoji": "\u2705"} }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Thirds and Fourths
-- Module: Fractions & Geometry
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0022-4000-8000-000000000001',
  '10000002-0109-4000-8000-000000000001',
  2,
  'Thirds and Fourths',
  'Split shapes into 3 equal parts (thirds) and 4 equal parts (fourths)!',
  'Chip is having a party and baked some brownies! If Chip shares a brownie with 2 friends, that is 3 people total -- so we cut it into 3 EQUAL pieces called THIRDS. If Chip invites one MORE friend, that is 4 people -- so we cut it into 4 EQUAL pieces called FOURTHS. The more friends you share with, the smaller each piece gets!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tf-mc1",
            "prompt": "A brownie is cut into 3 EQUAL pieces. What do we call each piece? \ud83c\udf6b",
            "options": [
              {"id": "a", "text": "One half"},
              {"id": "b", "text": "One third"},
              {"id": "c", "text": "One fourth"},
              {"id": "d", "text": "One fifth"}
            ],
            "correctOptionId": "b",
            "hint": "3 equal pieces means each piece is 1 out of 3 -- that is one third!"
          },
          {
            "id": "tf-mc2",
            "prompt": "A rectangle is split into 4 EQUAL parts. What do we call each part? \ud83d\udfe8",
            "options": [
              {"id": "a", "text": "One half"},
              {"id": "b", "text": "One third"},
              {"id": "c", "text": "One fourth"},
              {"id": "d", "text": "One sixth"}
            ],
            "correctOptionId": "c",
            "hint": "4 equal parts means each part is 1 out of 4 -- that is one fourth!"
          },
          {
            "id": "tf-mc3",
            "prompt": "Which is BIGGER: one third (1/3) or one fourth (1/4)? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "One third (1/3) is bigger"},
              {"id": "b", "text": "One fourth (1/4) is bigger"},
              {"id": "c", "text": "They are the same size"}
            ],
            "correctOptionId": "a",
            "hint": "Fewer pieces means each piece is bigger! 3 pieces are bigger than 4 pieces of the same thing."
          },
          {
            "id": "tf-mc4",
            "prompt": "A pie is cut into 4 equal slices. You eat 1 slice. How many fourths are LEFT? \ud83e\udd67",
            "options": [
              {"id": "a", "text": "1 fourth"},
              {"id": "b", "text": "2 fourths"},
              {"id": "c", "text": "3 fourths"},
              {"id": "d", "text": "4 fourths"}
            ],
            "correctOptionId": "c",
            "hint": "You started with 4 fourths and ate 1. 4 - 1 = 3 fourths left!"
          },
          {
            "id": "tf-mc5",
            "prompt": "How many thirds make a whole? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "3"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "1"}
            ],
            "correctOptionId": "b",
            "hint": "If you split something into thirds and put all 3 pieces back, you get the whole thing!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "tf-fb1",
            "prompt": "A circle split into 4 equal parts has ___ fourths.",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4", "four"] }],
            "hint": "If a shape is split into 4 equal parts, there are 4 fourths total!"
          },
          {
            "id": "tf-fb2",
            "prompt": "A rectangle split into 3 equal parts has ___ thirds.",
            "blanks": [{ "id": "b1", "correctAnswer": "3", "acceptableAnswers": ["3", "three"] }],
            "hint": "3 equal parts means 3 thirds. Each piece is one third!"
          },
          {
            "id": "tf-fb3",
            "prompt": "You eat 2 fourths of a pizza. There are ___ fourths left.",
            "blanks": [{ "id": "b1", "correctAnswer": "2", "acceptableAnswers": ["2", "two"] }],
            "hint": "A whole pizza has 4 fourths. You ate 2, so 4 - 2 = 2 fourths left!"
          },
          {
            "id": "tf-fb4",
            "prompt": "A cake is cut into thirds. Chip eats 1 third. There are ___ thirds left. \ud83c\udf82",
            "blanks": [{ "id": "b1", "correctAnswer": "2", "acceptableAnswers": ["2", "two"] }],
            "hint": "3 thirds minus 1 third equals 2 thirds!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Arrays: Rows and Columns
-- Module: Fractions & Geometry
-- Widgets: counting + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0023-4000-8000-000000000001',
  '10000002-0109-4000-8000-000000000001',
  3,
  'Arrays: Rows and Columns',
  'Arrange objects in rows and columns to make arrays! Count the total in each array.',
  'Chip loves being organized! Today Chip is lining up toy soldiers in neat ROWS and COLUMNS. A row goes side to side like this: \u27a1\ufe0f. A column goes up and down like this: \u2b07\ufe0f. When objects are arranged in rows and columns, we call it an ARRAY. Let''s count how many are in each array!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000b-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "arr-c1",
            "prompt": "Count all the stars in this array! (2 rows, 3 in each row)",
            "emoji": "\u2b50",
            "correctCount": 6,
            "displayCount": 6,
            "hint": "Count row by row: 3 stars in the first row, 3 stars in the second row. 3 + 3 = 6!"
          },
          {
            "id": "arr-c2",
            "prompt": "Count all the apples! (3 rows, 4 in each row)",
            "emoji": "\ud83c\udf4e",
            "correctCount": 12,
            "displayCount": 12,
            "hint": "3 rows with 4 apples each: 4 + 4 + 4 = 12 apples!"
          },
          {
            "id": "arr-c3",
            "prompt": "Count all the flowers! (4 rows, 3 in each row)",
            "emoji": "\ud83c\udf3b",
            "correctCount": 12,
            "displayCount": 12,
            "hint": "4 rows with 3 flowers each: 3 + 3 + 3 + 3 = 12 flowers!"
          },
          {
            "id": "arr-c4",
            "prompt": "Count all the hearts! (5 rows, 2 in each row)",
            "emoji": "\u2764\ufe0f",
            "correctCount": 10,
            "displayCount": 10,
            "hint": "5 rows with 2 hearts each: 2 + 2 + 2 + 2 + 2 = 10 hearts!"
          },
          {
            "id": "arr-c5",
            "prompt": "Count all the rockets! (3 rows, 5 in each row)",
            "emoji": "\ud83d\ude80",
            "correctCount": 15,
            "displayCount": 15,
            "hint": "3 rows with 5 rockets each: 5 + 5 + 5 = 15 rockets!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "arr-fb1",
            "prompt": "An array has 2 rows and 4 columns. ___ rows of ___ = ___ total. (Enter the total.)",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "2 rows of 4 means 4 + 4 = 8 total!"
          },
          {
            "id": "arr-fb2",
            "prompt": "An array has 3 rows and 3 columns. How many objects in total? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "9", "acceptableAnswers": ["9"] }],
            "hint": "3 rows of 3: that is 3 + 3 + 3 = 9!"
          },
          {
            "id": "arr-fb3",
            "prompt": "An array has 4 rows and 2 columns. How many objects in total? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "4 rows of 2: that is 2 + 2 + 2 + 2 = 8!"
          },
          {
            "id": "arr-fb4",
            "prompt": "An array has 5 rows and 3 columns. How many objects in total? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "5 rows of 3: that is 3 + 3 + 3 + 3 + 3 = 15!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Repeated Addition with Arrays
-- Module: Fractions & Geometry
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0024-4000-8000-000000000001',
  '10000002-0109-4000-8000-000000000001',
  4,
  'Repeated Addition with Arrays',
  'Discover that adding equal groups over and over is a shortcut for counting! Arrays make it easy.',
  'Chip just discovered something AMAZING! Instead of counting every single object one by one, you can ADD equal groups together. If you have 4 rows of 3 stars, you do not need to count all 12 -- just add 3 + 3 + 3 + 3! Adding the SAME number over and over is called REPEATED ADDITION. It''s like a superpower for counting fast!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000b-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "ra-fb1",
            "prompt": "3 + 3 + 3 + 3 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "12", "acceptableAnswers": ["12"] }],
            "hint": "You are adding 3 four times! 3, 6, 9, 12!"
          },
          {
            "id": "ra-fb2",
            "prompt": "5 + 5 + 5 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "Three groups of 5! Count by 5s: 5, 10, 15!"
          },
          {
            "id": "ra-fb3",
            "prompt": "2 + 2 + 2 + 2 + 2 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "10", "acceptableAnswers": ["10"] }],
            "hint": "Five groups of 2! Count by 2s: 2, 4, 6, 8, 10!"
          },
          {
            "id": "ra-fb4",
            "prompt": "4 + 4 + 4 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "12", "acceptableAnswers": ["12"] }],
            "hint": "Three groups of 4! 4, 8, 12!"
          },
          {
            "id": "ra-fb5",
            "prompt": "An array has 3 rows of 2 cupcakes \ud83e\uddc1. Write the repeated addition answer: 2 + 2 + 2 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "6", "acceptableAnswers": ["6"] }],
            "hint": "3 groups of 2 cupcakes: 2, 4, 6! That is 6 cupcakes total!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ra-mc1",
            "prompt": "Which repeated addition equation matches an array with 4 rows of 5? \ud83e\udde9",
            "options": [
              {"id": "a", "text": "4 + 4 + 4 + 4 + 4"},
              {"id": "b", "text": "5 + 5 + 5 + 5"},
              {"id": "c", "text": "5 + 4"},
              {"id": "d", "text": "4 + 5 + 4 + 5"}
            ],
            "correctOptionId": "b",
            "hint": "4 rows of 5 means you add 5 four times: 5 + 5 + 5 + 5 = 20!"
          },
          {
            "id": "ra-mc2",
            "prompt": "Which repeated addition equation matches an array with 3 rows of 4? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "3 + 3 + 3 + 3"},
              {"id": "b", "text": "4 + 3"},
              {"id": "c", "text": "4 + 4 + 4"},
              {"id": "d", "text": "3 + 4 + 3 + 4"}
            ],
            "correctOptionId": "c",
            "hint": "3 rows of 4 means you add 4 three times: 4 + 4 + 4 = 12!"
          },
          {
            "id": "ra-mc3",
            "prompt": "Chip has 5 bags with 3 cookies in each bag \ud83c\udf6a. Which equation finds the total?",
            "options": [
              {"id": "a", "text": "5 + 3"},
              {"id": "b", "text": "3 + 3 + 3 + 3 + 3"},
              {"id": "c", "text": "5 + 5 + 5"},
              {"id": "d", "text": "3 + 5 + 3"}
            ],
            "correctOptionId": "b",
            "hint": "5 bags of 3 cookies means add 3 five times: 3 + 3 + 3 + 3 + 3 = 15 cookies!"
          },
          {
            "id": "ra-mc4",
            "prompt": "2 + 2 + 2 = 6. Which array matches this equation? \ud83e\udd16",
            "options": [
              {"id": "a", "text": "2 rows of 3"},
              {"id": "b", "text": "3 rows of 2"},
              {"id": "c", "text": "6 rows of 1"},
              {"id": "d", "text": "1 row of 6"}
            ],
            "correctOptionId": "b",
            "hint": "You are adding 2 three times, which is 3 rows of 2!"
          },
          {
            "id": "ra-mc5",
            "prompt": "Which is the SAME as counting 4 groups of 2? \ud83d\udca1",
            "options": [
              {"id": "a", "text": "4 + 2"},
              {"id": "b", "text": "2 + 4"},
              {"id": "c", "text": "2 + 2 + 2 + 2"},
              {"id": "d", "text": "4 + 4"}
            ],
            "correctOptionId": "c",
            "hint": "4 groups of 2 means add 2 four times: 2 + 2 + 2 + 2 = 8!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
