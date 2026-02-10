-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math & Problem Solving Interactive Lessons
-- =============================================================================
-- 13 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - 8 Math lessons (Skip Counting & Patterns, Money & Fractions)
--   - 5 Problem Solving lessons (Strategy Toolbox)
--
-- Widget types used: counting, fill_in_blank, multiple_choice, matching_pairs,
--   number_line, rekenrek, number_bond, sequence_order
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 017_seed_math_visual_lessons.sql   (established 2nd-grade Math subject)
--
-- Subject IDs:
--   Math:            71c781e1-71c9-455e-8e18-aea0676b490a
--   Problem Solving: f4c1f559-85c6-412e-a788-d6efc8bf4c9d
--
-- Module IDs:
--   Skip Counting & Patterns: 10000002-0104-4000-8000-000000000001
--   Money & Fractions:        10000002-0105-4000-8000-000000000001
--   Strategy Toolbox:         10000002-0604-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Subjects, Modules, Skills
-- =========================================================================

-- 0a. Subjects (ON CONFLICT for idempotency)
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('71c781e1-71c9-455e-8e18-aea0676b490a', 'math_g2',            'Number World G2',  'Math',            '#3B82F6', 'calculator', 8),
  ('f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'problem_solving_g2', 'Puzzle Lab G2',    'Problem Solving', '#EAB308', 'puzzle',     13)
ON CONFLICT (id) DO NOTHING;

-- 0b. Modules
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0104-4000-8000-000000000001', 2, 14, 'Skip Counting & Patterns',  'Master skip counting by 2s, 5s, and 10s, and discover the magic of even and odd numbers!',           'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a'),
  ('10000002-0105-4000-8000-000000000001', 2, 15, 'Money & Fractions',         'Learn to identify coins, count money, explore fractions, and tackle bigger addition problems!',       'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a'),
  ('10000002-0604-4000-8000-000000000001', 2, 16, 'Strategy Toolbox',          'Build your problem-solving toolkit with multi-step word problems, guess-and-check, and logic puzzles!', 'puzzle',     'f4c1f559-85c6-412e-a788-d6efc8bf4c9d')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  -- Math skills
  ('20000001-0001-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'skip_counting',     'Skip Counting',         'Count forward by 2s, 5s, and 10s from any starting number',       '2.NBT.A.2', 1),
  ('20000001-0002-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'even_odd',          'Even and Odd Numbers',  'Determine whether a group of objects has an even or odd number',   '2.OA.C.3',  2),
  ('20000001-0003-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'coin_id',           'Coin Identification',   'Identify pennies, nickels, dimes, and quarters and their values',  '2.MD.C.8',  3),
  ('20000001-0004-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'fractions_basic',   'Basic Fractions',       'Partition circles and rectangles into halves and fourths',          '2.G.A.3',   4),
  ('20000001-0005-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'add_within_100',    'Addition within 100',   'Fluently add within 100 using strategies based on place value',    '2.NBT.B.5', 5),
  ('20000001-0006-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'sub_within_100',    'Subtraction within 100','Fluently subtract within 100 using strategies based on place value','2.NBT.B.5', 6),
  -- Problem Solving skills
  ('20000006-0001-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'multi_step',        'Multi-Step Problems',   'Solve two-step word problems using addition and subtraction',      '2.OA.A.1',  1),
  ('20000006-0002-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'guess_and_check',   'Guess and Check',       'Use systematic guessing and checking to find unknown values',      NULL,         2),
  ('20000006-0003-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'working_backward',  'Working Backward',      'Work backward from a result to find the starting value',           NULL,         3),
  ('20000006-0004-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'venn_diagrams',     'Venn Diagrams',         'Sort and classify items using Venn diagrams with two categories',  NULL,         4)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MATH LESSON 1: Skip Counting by 2s
-- Module: Skip Counting & Patterns
-- Widgets: counting + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0001-4000-8000-000000000001',
  '10000002-0104-4000-8000-000000000001',
  1,
  'Skip Counting by 2s',
  'Count by twos and discover the pattern! Every other number is your friend.',
  'Hey there, superstar! Chip here! Did you know you can count SUPER fast by skipping every other number? It''s like hopping over one number each time: 2, 4, 6, 8... Let''s practice skip counting by 2s together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "sc2-c1",
            "prompt": "Count the pairs of socks! Each pair has 2 socks.",
            "emoji": "\ud83e\udde6",
            "correctCount": 4,
            "displayCount": 4,
            "hint": "Count by 2s: 2, 4, 6, 8. There are 4 pairs!"
          },
          {
            "id": "sc2-c2",
            "prompt": "Count the pairs of shoes! How many pairs?",
            "emoji": "\ud83d\udc5f",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "Each shoe icon is one pair. Count them: 1, 2, 3, 4, 5 pairs!"
          },
          {
            "id": "sc2-c3",
            "prompt": "Count the pairs of mittens!",
            "emoji": "\ud83e\udde4",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "3 pairs of mittens means 6 mittens total when you count by 2s!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sc2-fb1",
            "prompt": "2, 4, ___, 8, 10",
            "blanks": [{ "id": "b1", "correctAnswer": "6", "acceptableAnswers": ["6"] }],
            "hint": "What comes after 4 when you count by 2s?"
          },
          {
            "id": "sc2-fb2",
            "prompt": "10, 12, ___, 16, 18",
            "blanks": [{ "id": "b1", "correctAnswer": "14", "acceptableAnswers": ["14"] }],
            "hint": "12 plus 2 equals..."
          },
          {
            "id": "sc2-fb3",
            "prompt": "6, 8, 10, ___, 14",
            "blanks": [{ "id": "b1", "correctAnswer": "12", "acceptableAnswers": ["12"] }],
            "hint": "10 plus 2 equals..."
          },
          {
            "id": "sc2-fb4",
            "prompt": "14, 16, ___, 20",
            "blanks": [{ "id": "b1", "correctAnswer": "18", "acceptableAnswers": ["18"] }],
            "hint": "16 plus 2 equals..."
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
-- MATH LESSON 2: Skip Counting by 5s
-- Module: Skip Counting & Patterns
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0002-4000-8000-000000000001',
  '10000002-0104-4000-8000-000000000001',
  2,
  'Skip Counting by 5s',
  'Count by fives like a clock master! Every 5 minutes on a clock is one number.',
  'Chip loves looking at clocks! Did you know the numbers on a clock go by 5s? The 1 means 5 minutes, the 2 means 10 minutes, and the 3 means 15 minutes. Let''s practice counting by 5s!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sc5-fb1",
            "prompt": "5, 10, ___, 20, 25",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "10 plus 5 equals..."
          },
          {
            "id": "sc5-fb2",
            "prompt": "20, 25, ___, 35, 40",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "25 plus 5 equals..."
          },
          {
            "id": "sc5-fb3",
            "prompt": "35, 40, 45, ___, 55",
            "blanks": [{ "id": "b1", "correctAnswer": "50", "acceptableAnswers": ["50"] }],
            "hint": "45 plus 5 equals..."
          },
          {
            "id": "sc5-fb4",
            "prompt": "55, 60, ___, 70, 75",
            "blanks": [{ "id": "b1", "correctAnswer": "65", "acceptableAnswers": ["65"] }],
            "hint": "60 plus 5 equals..."
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sc5-mc1",
            "prompt": "If you count by 5s starting at 5, what is the 4th number you say?",
            "options": [
              {"id": "a", "text": "15"},
              {"id": "b", "text": "20"},
              {"id": "c", "text": "25"},
              {"id": "d", "text": "10"}
            ],
            "correctOptionId": "b",
            "hint": "Count: 5, 10, 15, 20. The 4th number is..."
          },
          {
            "id": "sc5-mc2",
            "prompt": "Which number does NOT belong when counting by 5s? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "10"},
              {"id": "b", "text": "23"},
              {"id": "c", "text": "35"},
              {"id": "d", "text": "50"}
            ],
            "correctOptionId": "b",
            "hint": "Numbers that count by 5s always end in 0 or 5!"
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
-- MATH LESSON 3: Skip Counting by 10s
-- Module: Skip Counting & Patterns
-- Widgets: fill_in_blank + number_line
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0003-4000-8000-000000000001',
  '10000002-0104-4000-8000-000000000001',
  3,
  'Skip Counting by 10s',
  'Count by tens all the way to 100! This is the fastest way to count big numbers.',
  'Wow, you are getting SO good at skip counting! Now let''s go TURBO speed and count by 10s! 10, 20, 30... all the way to 100! Chip says counting by 10s is like a rocket -- zoom!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sc10-fb1",
            "prompt": "10, 20, ___, 40, 50",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "20 plus 10 equals..."
          },
          {
            "id": "sc10-fb2",
            "prompt": "40, 50, 60, ___, 80",
            "blanks": [{ "id": "b1", "correctAnswer": "70", "acceptableAnswers": ["70"] }],
            "hint": "60 plus 10 equals..."
          },
          {
            "id": "sc10-fb3",
            "prompt": "70, ___, 90, 100",
            "blanks": [{ "id": "b1", "correctAnswer": "80", "acceptableAnswers": ["80"] }],
            "hint": "70 plus 10 equals..."
          }
        ]
      },
      {
        "type": "number_line",
        "questions": [
          {
            "id": "sc10-nl1",
            "prompt": "Start at 10 and hop forward by 10. Where do you land?",
            "min": 0,
            "max": 50,
            "startPosition": 10,
            "correctEndPosition": 20,
            "operation": "add",
            "hint": "10 plus 10 equals 20! Hop forward one big jump."
          },
          {
            "id": "sc10-nl2",
            "prompt": "Start at 30 and hop forward by 10. Where do you land?",
            "min": 0,
            "max": 50,
            "startPosition": 30,
            "correctEndPosition": 40,
            "operation": "add",
            "hint": "30 plus 10 equals 40!"
          },
          {
            "id": "sc10-nl3",
            "prompt": "Start at 50 and hop forward by 10. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 50,
            "correctEndPosition": 60,
            "operation": "add",
            "hint": "50 plus 10 equals 60!"
          },
          {
            "id": "sc10-nl4",
            "prompt": "Start at 80 and hop forward by 10. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 80,
            "correctEndPosition": 90,
            "operation": "add",
            "hint": "80 plus 10 equals 90!"
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
-- MATH LESSON 4: Even and Odd Numbers
-- Module: Skip Counting & Patterns
-- Widgets: multiple_choice + rekenrek
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0004-4000-8000-000000000001',
  '10000002-0104-4000-8000-000000000001',
  4,
  'Even and Odd Numbers',
  'Discover the secret world of even and odd! Can a number be split into two equal groups?',
  'Chip has a riddle for you! Some numbers can be split perfectly into two equal teams, and some always have one left over. The ones that split evenly are called EVEN, and the ones with a leftover are called ODD. Let''s figure out which is which!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "eo-mc1",
            "prompt": "Is 7 even or odd? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Even"},
              {"id": "b", "text": "Odd"}
            ],
            "correctOptionId": "b",
            "hint": "Try splitting 7 into two equal groups. Can you? There is 1 left over!"
          },
          {
            "id": "eo-mc2",
            "prompt": "Is 12 even or odd? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Even"},
              {"id": "b", "text": "Odd"}
            ],
            "correctOptionId": "a",
            "hint": "12 can be split into two groups of 6. No leftovers!"
          },
          {
            "id": "eo-mc3",
            "prompt": "Is 15 even or odd? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Even"},
              {"id": "b", "text": "Odd"}
            ],
            "correctOptionId": "b",
            "hint": "15 split into two groups gives 7 and 8 -- not equal! It is odd."
          },
          {
            "id": "eo-mc4",
            "prompt": "Is 20 even or odd? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Even"},
              {"id": "b", "text": "Odd"}
            ],
            "correctOptionId": "a",
            "hint": "20 splits into two groups of 10. Even!"
          },
          {
            "id": "eo-mc5",
            "prompt": "Which of these numbers is ODD? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "4"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "9"},
              {"id": "d", "text": "10"}
            ],
            "correctOptionId": "c",
            "hint": "Odd numbers end in 1, 3, 5, 7, or 9!"
          }
        ]
      },
      {
        "type": "rekenrek",
        "questions": [
          {
            "id": "eo-rk1",
            "prompt": "Show 6 on the rekenrek. Can you split it into two equal rows?",
            "targetNumber": 6,
            "mode": "show",
            "hint": "6 is even! Put 3 beads on each row to prove it."
          },
          {
            "id": "eo-rk2",
            "prompt": "Show 9 on the rekenrek. Can you split it evenly?",
            "targetNumber": 9,
            "mode": "show",
            "hint": "9 is odd! You get 4 and 5 -- they are not equal."
          },
          {
            "id": "eo-rk3",
            "prompt": "Show 8 on the rekenrek. Is 8 even or odd?",
            "targetNumber": 8,
            "mode": "show",
            "hint": "8 is even! 4 beads on each row makes two equal groups."
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
-- MATH LESSON 5: Meet the Coins!
-- Module: Money & Fractions
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0005-4000-8000-000000000001',
  '10000002-0105-4000-8000-000000000001',
  1,
  'Meet the Coins!',
  'Learn the names and values of pennies, nickels, dimes, and quarters!',
  'Chip just found a treasure chest full of coins! But Chip doesn''t know their names or how much they are worth. Can you help? There are 4 types of coins: pennies, nickels, dimes, and quarters. Let''s learn about each one!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each coin to its value! \ud83e\ude99",
        "pairs": [
          { "id": "p1", "left": "Penny \ud83e\udeb5", "right": "1 cent" },
          { "id": "p2", "left": "Nickel \ud83e\ude99", "right": "5 cents" },
          { "id": "p3", "left": "Dime \ud83e\ude99", "right": "10 cents" },
          { "id": "p4", "left": "Quarter \ud83e\ude99", "right": "25 cents" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "coin-mc1",
            "prompt": "Which coin is worth the MOST?",
            "options": [
              {"id": "a", "text": "Penny (1\u00a2)"},
              {"id": "b", "text": "Nickel (5\u00a2)"},
              {"id": "c", "text": "Dime (10\u00a2)"},
              {"id": "d", "text": "Quarter (25\u00a2)"}
            ],
            "correctOptionId": "d",
            "hint": "A quarter is 25 cents -- that is the biggest value!"
          },
          {
            "id": "coin-mc2",
            "prompt": "Which coin is worth 10 cents?",
            "options": [
              {"id": "a", "text": "Penny"},
              {"id": "b", "text": "Nickel"},
              {"id": "c", "text": "Dime"},
              {"id": "d", "text": "Quarter"}
            ],
            "correctOptionId": "c",
            "hint": "A dime is the small thin coin worth 10 cents!"
          },
          {
            "id": "coin-mc3",
            "prompt": "How many pennies make a nickel?",
            "options": [
              {"id": "a", "text": "3"},
              {"id": "b", "text": "5"},
              {"id": "c", "text": "10"},
              {"id": "d", "text": "25"}
            ],
            "correctOptionId": "b",
            "hint": "A nickel is 5 cents and each penny is 1 cent. 5 pennies = 1 nickel!"
          },
          {
            "id": "coin-mc4",
            "prompt": "Which coin is the SMALLEST in size but worth MORE than a penny?",
            "options": [
              {"id": "a", "text": "Quarter"},
              {"id": "b", "text": "Nickel"},
              {"id": "c", "text": "Dime"},
              {"id": "d", "text": "Penny"}
            ],
            "correctOptionId": "c",
            "hint": "The dime is tiny but worth 10 cents. Don''t judge a coin by its size!"
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
-- MATH LESSON 6: Counting Coins
-- Module: Money & Fractions
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0006-4000-8000-000000000001',
  '10000002-0105-4000-8000-000000000001',
  2,
  'Counting Coins',
  'Add up groups of coins to find the total! How much money do you have?',
  'Chip is saving up to buy a new battery! Can you help count the coins in Chip''s piggy bank? Remember: start with the biggest coins first, then add the smaller ones. Let''s see how much money Chip has!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0003-4000-8000-000000000001', '20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cc-mc1",
            "prompt": "How much is 2 dimes and 1 nickel? \ud83e\ude99\ud83e\ude99\ud83e\ude99",
            "options": [
              {"id": "a", "text": "15\u00a2"},
              {"id": "b", "text": "25\u00a2"},
              {"id": "c", "text": "30\u00a2"},
              {"id": "d", "text": "20\u00a2"}
            ],
            "correctOptionId": "b",
            "hint": "2 dimes = 10 + 10 = 20 cents. Plus 1 nickel = 5 cents. 20 + 5 = 25 cents!"
          },
          {
            "id": "cc-mc2",
            "prompt": "How much is 1 quarter and 2 pennies? \ud83e\ude99\ud83e\udeb5\ud83e\udeb5",
            "options": [
              {"id": "a", "text": "27\u00a2"},
              {"id": "b", "text": "30\u00a2"},
              {"id": "c", "text": "7\u00a2"},
              {"id": "d", "text": "26\u00a2"}
            ],
            "correctOptionId": "a",
            "hint": "1 quarter = 25 cents. Plus 2 pennies = 2 cents. 25 + 2 = 27 cents!"
          },
          {
            "id": "cc-mc3",
            "prompt": "How much is 3 nickels? \ud83e\ude99\ud83e\ude99\ud83e\ude99",
            "options": [
              {"id": "a", "text": "3\u00a2"},
              {"id": "b", "text": "10\u00a2"},
              {"id": "c", "text": "15\u00a2"},
              {"id": "d", "text": "30\u00a2"}
            ],
            "correctOptionId": "c",
            "hint": "Each nickel is 5 cents. Count by 5s: 5, 10, 15!"
          },
          {
            "id": "cc-mc4",
            "prompt": "How much is 1 quarter and 1 dime? \ud83e\ude99\ud83e\ude99",
            "options": [
              {"id": "a", "text": "30\u00a2"},
              {"id": "b", "text": "35\u00a2"},
              {"id": "c", "text": "15\u00a2"},
              {"id": "d", "text": "26\u00a2"}
            ],
            "correctOptionId": "b",
            "hint": "1 quarter = 25 cents. 1 dime = 10 cents. 25 + 10 = 35 cents!"
          },
          {
            "id": "cc-mc5",
            "prompt": "How much is 2 quarters? \ud83e\ude99\ud83e\ude99",
            "options": [
              {"id": "a", "text": "25\u00a2"},
              {"id": "b", "text": "30\u00a2"},
              {"id": "c", "text": "50\u00a2"},
              {"id": "d", "text": "75\u00a2"}
            ],
            "correctOptionId": "c",
            "hint": "Each quarter is 25 cents. 25 + 25 = 50 cents. That is half a dollar!"
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
-- MATH LESSON 7: Half and Half
-- Module: Money & Fractions
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0007-4000-8000-000000000001',
  '10000002-0105-4000-8000-000000000001',
  3,
  'Half and Half',
  'Learn about fractions! What does one half and one fourth look like?',
  'Chip is sharing a pizza with friends! If you cut a pizza into 2 equal slices, each slice is ONE HALF. If you cut it into 4 equal slices, each slice is ONE FOURTH. Let''s explore fractions together!',
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
            "id": "frac-mc1",
            "prompt": "A pizza is cut into 2 EQUAL slices. What fraction is each slice? \ud83c\udf55",
            "options": [
              {"id": "a", "text": "One half (1/2)"},
              {"id": "b", "text": "One third (1/3)"},
              {"id": "c", "text": "One fourth (1/4)"},
              {"id": "d", "text": "One whole (1/1)"}
            ],
            "correctOptionId": "a",
            "hint": "2 equal pieces means each piece is 1 out of 2, which is one half!"
          },
          {
            "id": "frac-mc2",
            "prompt": "A sandwich is cut into 4 EQUAL pieces. What fraction is each piece? \ud83e\udd6a",
            "options": [
              {"id": "a", "text": "One half (1/2)"},
              {"id": "b", "text": "One third (1/3)"},
              {"id": "c", "text": "One fourth (1/4)"},
              {"id": "d", "text": "One fifth (1/5)"}
            ],
            "correctOptionId": "c",
            "hint": "4 equal pieces means each piece is 1 out of 4, which is one fourth!"
          },
          {
            "id": "frac-mc3",
            "prompt": "Which is BIGGER: one half (1/2) or one fourth (1/4)?",
            "options": [
              {"id": "a", "text": "One half (1/2) is bigger"},
              {"id": "b", "text": "One fourth (1/4) is bigger"},
              {"id": "c", "text": "They are the same"}
            ],
            "correctOptionId": "a",
            "hint": "Imagine a cookie: cutting it into 2 pieces gives bigger pieces than cutting it into 4!"
          },
          {
            "id": "frac-mc4",
            "prompt": "You eat 1/2 of a cake. How much is LEFT? \ud83c\udf82",
            "options": [
              {"id": "a", "text": "None"},
              {"id": "b", "text": "1/4"},
              {"id": "c", "text": "1/2"},
              {"id": "d", "text": "3/4"}
            ],
            "correctOptionId": "c",
            "hint": "If you eat one half, the other half is still there!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each fraction to what it looks like! \ud83c\udf55",
        "pairs": [
          { "id": "p1", "left": "1/2", "right": "Half of a circle colored" },
          { "id": "p2", "left": "1/4", "right": "One of four equal parts colored" },
          { "id": "p3", "left": "2/4", "right": "Same as one half" },
          { "id": "p4", "left": "4/4", "right": "The whole thing" }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MATH LESSON 8: Big Number Addition
-- Module: Money & Fractions
-- Widgets: number_line
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0008-4000-8000-000000000001',
  '10000002-0105-4000-8000-000000000001',
  4,
  'Big Number Addition',
  'Use the number line to add bigger numbers! Hop your way to the answer.',
  'Chip is ready for a BIG challenge! Now that you know how to skip count by 10s, we can use that skill to add big numbers. Start at a number, then hop forward by 10 or 20 to find the answer. You are going to do great!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "number_line",
        "questions": [
          {
            "id": "bna-nl1",
            "prompt": "Start at 23 and add 10. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 23,
            "correctEndPosition": 33,
            "operation": "add",
            "hint": "When you add 10, only the tens digit changes! 23 + 10 = 33."
          },
          {
            "id": "bna-nl2",
            "prompt": "Start at 45 and add 20. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 45,
            "correctEndPosition": 65,
            "operation": "add",
            "hint": "Adding 20 is like hopping forward by 10 two times! 45 + 10 = 55, then 55 + 10 = 65."
          },
          {
            "id": "bna-nl3",
            "prompt": "Start at 37 and add 10. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 37,
            "correctEndPosition": 47,
            "operation": "add",
            "hint": "37 + 10 = 47. The ones digit stays the same!"
          },
          {
            "id": "bna-nl4",
            "prompt": "Start at 58 and add 30. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 58,
            "correctEndPosition": 88,
            "operation": "add",
            "hint": "Adding 30 means 3 hops of 10! 58, 68, 78, 88!"
          },
          {
            "id": "bna-nl5",
            "prompt": "Start at 14 and add 20. Where do you land?",
            "min": 0,
            "max": 100,
            "startPosition": 14,
            "correctEndPosition": 34,
            "operation": "add",
            "hint": "14 + 10 = 24, then 24 + 10 = 34!"
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
-- PROBLEM SOLVING LESSON 1: Two-Step Word Problems
-- Module: Strategy Toolbox
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0001-4000-8000-000000000001',
  '10000002-0604-4000-8000-000000000001',
  1,
  'Two-Step Word Problems',
  'Solve word problems that need TWO steps! Read carefully and think it through.',
  'Chip has some tricky puzzles for you today! These word problems need TWO steps to solve. That means you will do one math step, then use that answer to do a SECOND step. Ready to be a math detective? Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "twostep-mc1",
            "prompt": "Sam has 5 apples \ud83c\udf4e. He picks 3 more, then eats 2. How many does Sam have now?",
            "options": [
              {"id": "a", "text": "6"},
              {"id": "b", "text": "8"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "10"}
            ],
            "correctOptionId": "a",
            "hint": "Step 1: 5 + 3 = 8 apples. Step 2: 8 - 2 = 6 apples!"
          },
          {
            "id": "twostep-mc2",
            "prompt": "Mia has 10 stickers \u2b50. She gives 4 to her friend, then gets 3 new ones. How many stickers does Mia have?",
            "options": [
              {"id": "a", "text": "7"},
              {"id": "b", "text": "9"},
              {"id": "c", "text": "3"},
              {"id": "d", "text": "17"}
            ],
            "correctOptionId": "b",
            "hint": "Step 1: 10 - 4 = 6 stickers. Step 2: 6 + 3 = 9 stickers!"
          },
          {
            "id": "twostep-mc3",
            "prompt": "There are 8 birds \ud83d\udc26 on a fence. 3 fly away, then 5 more land. How many birds are on the fence?",
            "options": [
              {"id": "a", "text": "6"},
              {"id": "b", "text": "16"},
              {"id": "c", "text": "10"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "Step 1: 8 - 3 = 5 birds. Step 2: 5 + 5 = 10 birds!"
          },
          {
            "id": "twostep-mc4",
            "prompt": "Tom has 7 crayons \ud83d\udd8d\ufe0f. He finds 6 more, then loses 3. How many crayons does Tom have?",
            "options": [
              {"id": "a", "text": "10"},
              {"id": "b", "text": "16"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "13"}
            ],
            "correctOptionId": "a",
            "hint": "Step 1: 7 + 6 = 13 crayons. Step 2: 13 - 3 = 10 crayons!"
          },
          {
            "id": "twostep-mc5",
            "prompt": "A box has 12 cookies \ud83c\udf6a. Dad takes 5 out, then Mom puts 2 back in. How many cookies are in the box?",
            "options": [
              {"id": "a", "text": "9"},
              {"id": "b", "text": "7"},
              {"id": "c", "text": "19"},
              {"id": "d", "text": "5"}
            ],
            "correctOptionId": "a",
            "hint": "Step 1: 12 - 5 = 7 cookies. Step 2: 7 + 2 = 9 cookies!"
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
-- PROBLEM SOLVING LESSON 2: Guess and Check
-- Module: Strategy Toolbox
-- Widgets: fill_in_blank + number_bond
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0002-4000-8000-000000000001',
  '10000002-0604-4000-8000-000000000001',
  2,
  'Guess and Check',
  'Use the guess-and-check strategy to find mystery numbers! Make a guess, test it, and try again.',
  'Chip loves guessing games! Today we will play number detective. Chip will give you clues about two mystery numbers, and you will use GUESS AND CHECK to find them. Make a guess, see if it works, and adjust. Let''s solve some mysteries!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "gc-fb1",
            "prompt": "I am thinking of two numbers that add up to 10. One number is 2 more than the other. What are they? The smaller number is ___.",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "Try guessing! If one number is 3, the other is 7. Is 7 - 3 = 2? No, that is 4 apart. Try 4 and 6!"
          },
          {
            "id": "gc-fb2",
            "prompt": "Two numbers add up to 8. They are the SAME number. What is each number? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "What number plus itself equals 8? Try 4 + 4!"
          },
          {
            "id": "gc-fb3",
            "prompt": "I am thinking of a number. If I add 5 to it, I get 12. What is my number? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "7", "acceptableAnswers": ["7"] }],
            "hint": "Try guessing! Is it 6? 6 + 5 = 11 -- too small. Try 7! 7 + 5 = 12!"
          }
        ]
      },
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "gc-nb1",
            "prompt": "Two numbers add up to 12. One part is 5. What is the other part?",
            "whole": 12,
            "part1": 5,
            "part2": null,
            "hint": "12 minus 5 equals... guess and check!"
          },
          {
            "id": "gc-nb2",
            "prompt": "Two numbers add up to 15. One part is 9. What is the other part?",
            "whole": 15,
            "part1": 9,
            "part2": null,
            "hint": "15 minus 9 equals... think about what you need to add to 9 to get 15!"
          },
          {
            "id": "gc-nb3",
            "prompt": "Find the missing part! The whole is 20.",
            "whole": 20,
            "part1": 8,
            "part2": null,
            "hint": "20 minus 8 equals... you can count up from 8 to 20!"
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
-- PROBLEM SOLVING LESSON 3: Working Backward
-- Module: Strategy Toolbox
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0003-4000-8000-000000000001',
  '10000002-0604-4000-8000-000000000001',
  3,
  'Working Backward',
  'Start from the answer and work your way back to find the beginning! Reverse your thinking.',
  'Sometimes you know the END of a story but not the BEGINNING! Chip calls this "working backward" -- like rewinding a movie. If you know where you ended up, you can figure out where you started. Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "wb-so1",
            "prompt": "A number puzzle! Put the steps in REVERSE order to find the starting number.",
            "items": [
              {"id": "i1", "text": "Start with a mystery number"},
              {"id": "i2", "text": "Add 3"},
              {"id": "i3", "text": "Then add 2 more"},
              {"id": "i4", "text": "You end up with 10"}
            ],
            "correctOrder": ["i4", "i3", "i2", "i1"],
            "hint": "Start from the end (10) and undo each step! Subtract instead of add."
          },
          {
            "id": "wb-so2",
            "prompt": "Put these BACKWARD to undo the recipe! \ud83c\udf73",
            "items": [
              {"id": "i1", "text": "Get bowl"},
              {"id": "i2", "text": "Add flour"},
              {"id": "i3", "text": "Add eggs"},
              {"id": "i4", "text": "Mix it up"},
              {"id": "i5", "text": "Bake the cake"}
            ],
            "correctOrder": ["i5", "i4", "i3", "i2", "i1"],
            "hint": "If you are un-making a cake, start with the last step and go backward!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wb-mc1",
            "prompt": "I started with some marbles. I found 4 more and now I have 11. How many did I START with?",
            "options": [
              {"id": "a", "text": "7"},
              {"id": "b", "text": "15"},
              {"id": "c", "text": "4"},
              {"id": "d", "text": "6"}
            ],
            "correctOptionId": "a",
            "hint": "Work backward! You ended with 11 and added 4. So 11 - 4 = 7. You started with 7!"
          },
          {
            "id": "wb-mc2",
            "prompt": "I had some pencils. I gave away 3 and now I have 5. How many did I START with? \u270f\ufe0f",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "8"},
              {"id": "c", "text": "3"},
              {"id": "d", "text": "5"}
            ],
            "correctOptionId": "b",
            "hint": "You ended with 5 after giving away 3. Undo it: 5 + 3 = 8. You started with 8!"
          },
          {
            "id": "wb-mc3",
            "prompt": "I had some books. I bought 6 more and now I have 14. How many did I START with? \ud83d\udcda",
            "options": [
              {"id": "a", "text": "20"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "8"},
              {"id": "d", "text": "10"}
            ],
            "correctOptionId": "c",
            "hint": "Work backward from 14! You added 6, so undo it: 14 - 6 = 8."
          },
          {
            "id": "wb-mc4",
            "prompt": "I had some coins. I spent 5 and found 2. Now I have 9. How many did I START with? \ud83e\ude99",
            "options": [
              {"id": "a", "text": "12"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "16"},
              {"id": "d", "text": "14"}
            ],
            "correctOptionId": "a",
            "hint": "Work backward! Undo finding 2: 9 - 2 = 7. Undo spending 5: 7 + 5 = 12!"
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
-- PROBLEM SOLVING LESSON 4: Compare with Venn
-- Module: Strategy Toolbox
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0004-4000-8000-000000000001',
  '10000002-0604-4000-8000-000000000001',
  4,
  'Compare with Venn',
  'Use Venn diagrams to sort and compare! Find what things have in common.',
  'Chip learned about a cool tool called a Venn diagram! It uses two overlapping circles to sort things. Items that belong to BOTH groups go in the middle where the circles overlap. Let''s try sorting!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Sort these animals! Match each animal to where it lives. \ud83d\udc3e",
        "pairs": [
          { "id": "p1", "left": "Fish \ud83d\udc1f", "right": "Water only" },
          { "id": "p2", "left": "Dog \ud83d\udc36", "right": "Land only" },
          { "id": "p3", "left": "Frog \ud83d\udc38", "right": "Both land and water" },
          { "id": "p4", "left": "Bird \ud83d\udc26", "right": "Land only" },
          { "id": "p5", "left": "Turtle \ud83d\udc22", "right": "Both land and water" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "venn-mc1",
            "prompt": "In a Venn diagram of \"Has Fur\" and \"Has 4 Legs,\" where does a cat go? \ud83d\udc31",
            "options": [
              {"id": "a", "text": "Has Fur only"},
              {"id": "b", "text": "Has 4 Legs only"},
              {"id": "c", "text": "In the middle (both!)"},
              {"id": "d", "text": "Outside both circles"}
            ],
            "correctOptionId": "c",
            "hint": "A cat has fur AND 4 legs, so it goes in the overlapping part!"
          },
          {
            "id": "venn-mc2",
            "prompt": "In a Venn diagram of \"Has Fur\" and \"Has 4 Legs,\" where does a snake go? \ud83d\udc0d",
            "options": [
              {"id": "a", "text": "Has Fur only"},
              {"id": "b", "text": "Has 4 Legs only"},
              {"id": "c", "text": "In the middle (both!)"},
              {"id": "d", "text": "Outside both circles"}
            ],
            "correctOptionId": "d",
            "hint": "A snake has no fur and no legs! It goes outside both circles."
          },
          {
            "id": "venn-mc3",
            "prompt": "Apples and bananas are both ___.",
            "options": [
              {"id": "a", "text": "Red"},
              {"id": "b", "text": "Fruits"},
              {"id": "c", "text": "Round"},
              {"id": "d", "text": "Yellow"}
            ],
            "correctOptionId": "b",
            "hint": "What do apples and bananas have in common? They are both fruits!"
          },
          {
            "id": "venn-mc4",
            "prompt": "In a Venn diagram of \"Can Fly\" and \"Can Swim,\" where does a duck go? \ud83e\udd86",
            "options": [
              {"id": "a", "text": "Can Fly only"},
              {"id": "b", "text": "Can Swim only"},
              {"id": "c", "text": "In the middle (both!)"},
              {"id": "d", "text": "Outside both circles"}
            ],
            "correctOptionId": "c",
            "hint": "Ducks can fly AND swim! They go in the overlapping part."
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
-- PROBLEM SOLVING LESSON 5: Logic Puzzles
-- Module: Strategy Toolbox
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0005-4000-8000-000000000001',
  '10000002-0604-4000-8000-000000000001',
  5,
  'Logic Puzzles',
  'Use your brain power to solve logic riddles! Think carefully about each clue.',
  'Chip''s favorite thing is a good brain teaser! Logic puzzles are like detective work -- you use CLUES to figure out the answer. Sometimes you have to think about what MUST be true. Ready to give your brain a workout?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0001-4000-8000-000000000001', '20000006-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "logic-mc1",
            "prompt": "All dogs have tails. Buddy is a dog. Does Buddy have a tail? \ud83d\udc36",
            "options": [
              {"id": "a", "text": "Yes, Buddy has a tail"},
              {"id": "b", "text": "No, Buddy does not"},
              {"id": "c", "text": "Maybe"},
              {"id": "d", "text": "We cannot tell"}
            ],
            "correctOptionId": "a",
            "hint": "ALL dogs have tails. Buddy IS a dog. So Buddy MUST have a tail!"
          },
          {
            "id": "logic-mc2",
            "prompt": "Sara is taller than Ben. Ben is taller than Lily. Who is the SHORTEST? \ud83d\udccf",
            "options": [
              {"id": "a", "text": "Sara"},
              {"id": "b", "text": "Ben"},
              {"id": "c", "text": "Lily"},
              {"id": "d", "text": "They are all the same"}
            ],
            "correctOptionId": "c",
            "hint": "Sara > Ben > Lily. Lily is shorter than both Ben and Sara!"
          },
          {
            "id": "logic-mc3",
            "prompt": "There are 3 boxes: red, blue, and green. The toy is NOT in the red box. The toy is NOT in the green box. Where is the toy? \ud83c\udf81",
            "options": [
              {"id": "a", "text": "Red box"},
              {"id": "b", "text": "Blue box"},
              {"id": "c", "text": "Green box"},
              {"id": "d", "text": "None of them"}
            ],
            "correctOptionId": "b",
            "hint": "Cross out the ones that do NOT have the toy. Not red, not green... only blue is left!"
          },
          {
            "id": "logic-mc4",
            "prompt": "Every cat in this room is orange. Whiskers is in this room. Whiskers is a cat. What color is Whiskers? \ud83d\udc31",
            "options": [
              {"id": "a", "text": "Black"},
              {"id": "b", "text": "White"},
              {"id": "c", "text": "Orange"},
              {"id": "d", "text": "We cannot tell"}
            ],
            "correctOptionId": "c",
            "hint": "Every cat in the room is orange. Whiskers is a cat in the room. So Whiskers is orange!"
          },
          {
            "id": "logic-mc5",
            "prompt": "On Monday, Chip ate more than Tuesday. On Wednesday, Chip ate less than Tuesday. Which day did Chip eat the MOST? \ud83d\ude0b",
            "options": [
              {"id": "a", "text": "Monday"},
              {"id": "b", "text": "Tuesday"},
              {"id": "c", "text": "Wednesday"},
              {"id": "d", "text": "All the same"}
            ],
            "correctOptionId": "a",
            "hint": "Monday > Tuesday > Wednesday. Monday is when Chip ate the most!"
          },
          {
            "id": "logic-mc6",
            "prompt": "If it is raining, Chip brings an umbrella. It IS raining today. What does Chip bring? \u2614",
            "options": [
              {"id": "a", "text": "Sunglasses"},
              {"id": "b", "text": "An umbrella"},
              {"id": "c", "text": "A hat"},
              {"id": "d", "text": "Nothing"}
            ],
            "correctOptionId": "b",
            "hint": "The rule says: raining = umbrella. It is raining. So Chip brings an umbrella!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
