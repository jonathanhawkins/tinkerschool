-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math: Money & Time Interactive Lessons
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - 3 Money lessons (coins, counting, making change)
--   - 2 Time lessons (telling time, A.M./P.M.)
--
-- Widget types used: flash_card, matching_pairs, counting, fill_in_blank,
--   multiple_choice, sequence_order
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 019_seed_2nd_grade_math_problemsolving.sql (established 2nd-grade Math subject + coin skill)
--
-- Subject ID:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module ID:
--   Money & Time: 10000002-0108-4000-8000-000000000001
--
-- Skill IDs:
--   Coin Identification (existing): 20000001-0003-4000-8000-000000000001
--   Telling Time to 5 Minutes (new):  20000001-000a-4000-8000-000000000001
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
  ('10000002-0108-4000-8000-000000000001', 2, 22, 'Money & Time', 'Learn to count coins, make change, and tell time like a champ! Master dollars, cents, and clocks!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000001-0003-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'coin_id',           'Coin Identification',       'Identify pennies, nickels, dimes, and quarters and their values',  '2.MD.C.8', 3),
  ('20000001-000a-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'telling_time_5min', 'Telling Time to 5 Minutes', 'Tell and write time to the nearest five minutes using analog and digital clocks', '2.MD.C.7', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Meet the Coins
-- Module: Money & Time
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001c-4000-8000-000000000001',
  '10000002-0108-4000-8000-000000000001',
  1,
  'Meet the Coins',
  'Open a piggy bank and learn about pennies, nickels, dimes, and quarters!',
  'Hey there, superstar! Chip just cracked open a giant piggy bank and coins went EVERYWHERE! There are four different kinds of coins in here, and each one is worth a different amount. Let''s figure out what each coin is called and how much it is worth!',
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
        "type": "flash_card",
        "prompt": "Flip each card to learn about the four U.S. coins!",
        "cards": [
          {
            "id": "fc-penny",
            "front": "Penny",
            "back": "A penny is worth 1 cent (1\u00a2). It is copper-colored (brownish) and has Abraham Lincoln on the front. It is the smallest value coin!"
          },
          {
            "id": "fc-nickel",
            "front": "Nickel",
            "back": "A nickel is worth 5 cents (5\u00a2). It is silver-colored and bigger than a penny. Thomas Jefferson is on the front. 5 pennies = 1 nickel!"
          },
          {
            "id": "fc-dime",
            "front": "Dime",
            "back": "A dime is worth 10 cents (10\u00a2). It is the smallest and thinnest coin! Franklin Roosevelt is on the front. 10 pennies = 1 dime!"
          },
          {
            "id": "fc-quarter",
            "front": "Quarter",
            "back": "A quarter is worth 25 cents (25\u00a2). It is the biggest coin! George Washington is on the front. 4 quarters make a whole dollar!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each coin to its value! \ud83e\ude99",
        "pairs": [
          { "id": "p1", "left": "Penny \ud83e\udeb5", "right": "1 cent (1\u00a2)" },
          { "id": "p2", "left": "Nickel \ud83e\ude99", "right": "5 cents (5\u00a2)" },
          { "id": "p3", "left": "Dime \ud83e\ude99", "right": "10 cents (10\u00a2)" },
          { "id": "p4", "left": "Quarter \ud83e\ude99", "right": "25 cents (25\u00a2)" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc-coin1",
            "prompt": "Which coin is worth the MOST? \ud83e\ude99",
            "options": [
              {"id": "a", "text": "Penny (1\u00a2)"},
              {"id": "b", "text": "Nickel (5\u00a2)"},
              {"id": "c", "text": "Dime (10\u00a2)"},
              {"id": "d", "text": "Quarter (25\u00a2)"}
            ],
            "correctOptionId": "d",
            "hint": "A quarter is 25 cents -- that is the biggest value of the four coins!"
          },
          {
            "id": "mc-coin2",
            "prompt": "Which coin is the SMALLEST in size but worth MORE than a penny?",
            "options": [
              {"id": "a", "text": "Quarter"},
              {"id": "b", "text": "Nickel"},
              {"id": "c", "text": "Dime"},
              {"id": "d", "text": "Penny"}
            ],
            "correctOptionId": "c",
            "hint": "The dime is tiny but worth 10 cents. Don''t judge a coin by its size!"
          },
          {
            "id": "mc-coin3",
            "prompt": "How many pennies make a nickel? \ud83e\udeb5",
            "options": [
              {"id": "a", "text": "3"},
              {"id": "b", "text": "5"},
              {"id": "c", "text": "10"},
              {"id": "d", "text": "25"}
            ],
            "correctOptionId": "b",
            "hint": "A nickel is worth 5 cents, and each penny is 1 cent. 5 pennies = 1 nickel!"
          },
          {
            "id": "mc-coin4",
            "prompt": "Which coin has a copper (brownish) color?",
            "options": [
              {"id": "a", "text": "Nickel"},
              {"id": "b", "text": "Dime"},
              {"id": "c", "text": "Penny"},
              {"id": "d", "text": "Quarter"}
            ],
            "correctOptionId": "c",
            "hint": "Only one coin looks different from the rest -- it is brownish instead of silver!"
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
-- LESSON 2: Counting Coins
-- Module: Money & Time
-- Widgets: counting + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001d-4000-8000-000000000001',
  '10000002-0108-4000-8000-000000000001',
  2,
  'Counting Coins',
  'Add up groups of mixed coins to find out how much money you have!',
  'Chip was cleaning the couch and found coins hidden in ALL the cushions! There are dimes, nickels, quarters, and pennies mixed up together. Can you help Chip count them? Remember the trick: start with the biggest coins first, then add the smaller ones!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "cc-c1",
            "prompt": "Count the dimes! Each dime is worth 10\u00a2.",
            "emoji": "\ud83e\ude99",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "Each dime is 10 cents. Count by 10s: 10, 20, 30. That is 30\u00a2!"
          },
          {
            "id": "cc-c2",
            "prompt": "Count the nickels! Each nickel is worth 5\u00a2.",
            "emoji": "\ud83e\ude99",
            "correctCount": 4,
            "displayCount": 4,
            "hint": "Each nickel is 5 cents. Count by 5s: 5, 10, 15, 20. That is 20\u00a2!"
          },
          {
            "id": "cc-c3",
            "prompt": "Count the quarters! Each quarter is worth 25\u00a2.",
            "emoji": "\ud83e\ude99",
            "correctCount": 2,
            "displayCount": 2,
            "hint": "Each quarter is 25 cents. 25 + 25 = 50\u00a2. That is half a dollar!"
          },
          {
            "id": "cc-c4",
            "prompt": "Count all the pennies! Each penny is worth 1\u00a2.",
            "emoji": "\ud83e\udeb5",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "Each penny is 1 cent. Count: 1, 2, 3, 4, 5. That is 5\u00a2!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cc-fb1",
            "prompt": "3 dimes + 2 nickels = ___ cents",
            "blanks": [{ "id": "b1", "correctAnswer": "40", "acceptableAnswers": ["40"] }],
            "hint": "3 dimes = 30\u00a2. 2 nickels = 10\u00a2. 30 + 10 = 40\u00a2!"
          },
          {
            "id": "cc-fb2",
            "prompt": "1 quarter + 1 dime + 1 nickel = ___ cents",
            "blanks": [{ "id": "b1", "correctAnswer": "40", "acceptableAnswers": ["40"] }],
            "hint": "25 + 10 + 5 = 40\u00a2! Start with the biggest coin."
          },
          {
            "id": "cc-fb3",
            "prompt": "2 quarters + 3 pennies = ___ cents",
            "blanks": [{ "id": "b1", "correctAnswer": "53", "acceptableAnswers": ["53"] }],
            "hint": "2 quarters = 50\u00a2. Plus 3 pennies = 3\u00a2. 50 + 3 = 53\u00a2!"
          },
          {
            "id": "cc-fb4",
            "prompt": "4 dimes + 1 nickel + 2 pennies = ___ cents",
            "blanks": [{ "id": "b1", "correctAnswer": "47", "acceptableAnswers": ["47"] }],
            "hint": "4 dimes = 40\u00a2. 1 nickel = 5\u00a2. 2 pennies = 2\u00a2. 40 + 5 + 2 = 47\u00a2!"
          },
          {
            "id": "cc-fb5",
            "prompt": "1 quarter + 2 dimes + 1 nickel + 3 pennies = ___ cents",
            "blanks": [{ "id": "b1", "correctAnswer": "53", "acceptableAnswers": ["53"] }],
            "hint": "25 + 20 + 5 + 3 = 53\u00a2! Go from biggest to smallest."
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
-- LESSON 3: Making Change
-- Module: Money & Time
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001e-4000-8000-000000000001',
  '10000002-0108-4000-8000-000000000001',
  3,
  'Making Change',
  'Figure out how much change you get back when you buy something!',
  'Welcome to Chip''s Pretend Store! Chip has toys, stickers, and snacks for sale. But when you pay with coins, sometimes you give MORE money than the price. The extra money you get back is called CHANGE. Let''s practice making change!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc-ch1",
            "prompt": "A sticker costs 35\u00a2. You pay with 2 quarters (50\u00a2). How much change do you get back? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "10\u00a2"},
              {"id": "b", "text": "15\u00a2"},
              {"id": "c", "text": "20\u00a2"},
              {"id": "d", "text": "25\u00a2"}
            ],
            "correctOptionId": "b",
            "hint": "You paid 50\u00a2 for something that costs 35\u00a2. 50 - 35 = 15\u00a2 change!"
          },
          {
            "id": "mc-ch2",
            "prompt": "A pencil costs 20\u00a2. You pay with a quarter (25\u00a2). How much change? \u270f\ufe0f",
            "options": [
              {"id": "a", "text": "3\u00a2"},
              {"id": "b", "text": "5\u00a2"},
              {"id": "c", "text": "10\u00a2"},
              {"id": "d", "text": "15\u00a2"}
            ],
            "correctOptionId": "b",
            "hint": "25 - 20 = 5. You get 5 cents back -- that is one nickel!"
          },
          {
            "id": "mc-ch3",
            "prompt": "A toy car costs 40\u00a2. You pay with 2 quarters (50\u00a2). How much change? \ud83d\ude97",
            "options": [
              {"id": "a", "text": "5\u00a2"},
              {"id": "b", "text": "10\u00a2"},
              {"id": "c", "text": "15\u00a2"},
              {"id": "d", "text": "20\u00a2"}
            ],
            "correctOptionId": "b",
            "hint": "50\u00a2 minus 40\u00a2 = 10\u00a2 change! That is one dime."
          },
          {
            "id": "mc-ch4",
            "prompt": "An eraser costs 15\u00a2. You pay with 2 dimes (20\u00a2). How much change?",
            "options": [
              {"id": "a", "text": "5\u00a2"},
              {"id": "b", "text": "10\u00a2"},
              {"id": "c", "text": "3\u00a2"},
              {"id": "d", "text": "15\u00a2"}
            ],
            "correctOptionId": "a",
            "hint": "20\u00a2 minus 15\u00a2 = 5\u00a2 change. That is one nickel!"
          },
          {
            "id": "mc-ch5",
            "prompt": "A candy bar costs 60\u00a2. You pay with 3 quarters (75\u00a2). How much change? \ud83c\udf6b",
            "options": [
              {"id": "a", "text": "5\u00a2"},
              {"id": "b", "text": "10\u00a2"},
              {"id": "c", "text": "15\u00a2"},
              {"id": "d", "text": "25\u00a2"}
            ],
            "correctOptionId": "c",
            "hint": "75\u00a2 minus 60\u00a2 = 15\u00a2. You get 15 cents back!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb-ch1",
            "prompt": "A bookmark costs 30\u00a2. You pay with 2 quarters. Your change is ___ cents.",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "2 quarters = 50\u00a2. The bookmark costs 30\u00a2. 50 - 30 = 20\u00a2!"
          },
          {
            "id": "fb-ch2",
            "prompt": "A gumball costs 10\u00a2. You pay with a quarter. Your change is ___ cents.",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "1 quarter = 25\u00a2. Minus 10\u00a2 for the gumball. 25 - 10 = 15\u00a2!"
          },
          {
            "id": "fb-ch3",
            "prompt": "A ring pop costs 45\u00a2. You pay with 2 quarters. Your change is ___ cents.",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5"] }],
            "hint": "2 quarters = 50\u00a2. 50 - 45 = 5\u00a2. You get a nickel back!"
          },
          {
            "id": "fb-ch4",
            "prompt": "A bouncy ball costs 55\u00a2. You pay with 3 quarters. Your change is ___ cents.",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "3 quarters = 75\u00a2. 75 - 55 = 20\u00a2. Two dimes back!"
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
-- LESSON 4: Telling Time to 5 Minutes
-- Module: Money & Time
-- Widgets: matching_pairs + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001f-4000-8000-000000000001',
  '10000002-0108-4000-8000-000000000001',
  4,
  'Telling Time to 5 Minutes',
  'Learn to read clocks and tell time to the nearest 5 minutes!',
  'Tick-tock, tick-tock! Chip wants to learn how to read a clock. A clock has two hands: the SHORT hand tells the HOUR, and the LONG hand tells the MINUTES. The long hand points to numbers, and each number means 5 minutes. Let''s practice reading clocks together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match the clock description to the correct digital time! \u23f0",
        "pairs": [
          { "id": "p1", "left": "Hour hand on 3, minute hand on 12", "right": "3:00" },
          { "id": "p2", "left": "Hour hand on 7, minute hand on 6", "right": "7:30" },
          { "id": "p3", "left": "Hour hand past 2, minute hand on 3", "right": "2:15" },
          { "id": "p4", "left": "Hour hand past 10, minute hand on 9", "right": "10:45" },
          { "id": "p5", "left": "Hour hand past 5, minute hand on 2", "right": "5:10" },
          { "id": "p6", "left": "Hour hand past 8, minute hand on 7", "right": "8:35" }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "tt-fb1",
            "prompt": "The minute hand points to the 3. That means ___ minutes past the hour.",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "Each number on the clock means 5 minutes. The 3 means: 5, 10, 15 minutes!"
          },
          {
            "id": "tt-fb2",
            "prompt": "The minute hand points to the 6. That means ___ minutes past the hour.",
            "blanks": [{ "id": "b1", "correctAnswer": "30", "acceptableAnswers": ["30"] }],
            "hint": "Count by 5s to the 6: 5, 10, 15, 20, 25, 30 minutes! That is also called half past."
          },
          {
            "id": "tt-fb3",
            "prompt": "The minute hand points to the 12. That means ___ minutes past the hour.",
            "blanks": [{ "id": "b1", "correctAnswer": "0", "acceptableAnswers": ["0", "00"] }],
            "hint": "When the minute hand is on 12, it means zero minutes -- it is exactly on the hour!"
          },
          {
            "id": "tt-fb4",
            "prompt": "The hour hand is on 4 and the minute hand is on 9. The time is 4:___.",
            "blanks": [{ "id": "b1", "correctAnswer": "45", "acceptableAnswers": ["45"] }],
            "hint": "Count by 5s to the 9: 5, 10, 15, 20, 25, 30, 35, 40, 45 minutes!"
          },
          {
            "id": "tt-fb5",
            "prompt": "The hour hand is past 11 and the minute hand is on 4. The time is 11:___.",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "Count by 5s to the 4: 5, 10, 15, 20 minutes past 11!"
          },
          {
            "id": "tt-fb6",
            "prompt": "It is 6:___. The minute hand is on the 11.",
            "blanks": [{ "id": "b1", "correctAnswer": "55", "acceptableAnswers": ["55"] }],
            "hint": "Count by 5s to the 11: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55!"
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
-- LESSON 5: A.M. and P.M.
-- Module: Money & Time
-- Widgets: multiple_choice + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0020-4000-8000-000000000001',
  '10000002-0108-4000-8000-000000000001',
  5,
  'A.M. and P.M.',
  'Learn the difference between A.M. (morning) and P.M. (afternoon/night) and order daily activities by time!',
  'Good morning! Or is it good afternoon? Chip gets confused sometimes! A.M. means the time from midnight to noon (morning time), and P.M. means the time from noon to midnight (afternoon and night). Let''s follow Chip through a whole day and figure out which times are A.M. and which are P.M.!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ampm-mc1",
            "prompt": "You eat breakfast at 7:00. Is that A.M. or P.M.? \ud83e\udd5e",
            "options": [
              {"id": "a", "text": "A.M. (morning)"},
              {"id": "b", "text": "P.M. (afternoon/night)"}
            ],
            "correctOptionId": "a",
            "hint": "Breakfast is in the morning. Morning times use A.M.!"
          },
          {
            "id": "ampm-mc2",
            "prompt": "You eat dinner at 6:00. Is that A.M. or P.M.? \ud83c\udf5d",
            "options": [
              {"id": "a", "text": "A.M. (morning)"},
              {"id": "b", "text": "P.M. (afternoon/night)"}
            ],
            "correctOptionId": "b",
            "hint": "Dinner is in the evening. Evening times use P.M.!"
          },
          {
            "id": "ampm-mc3",
            "prompt": "School starts at 8:30. Is that A.M. or P.M.? \ud83c\udfeb",
            "options": [
              {"id": "a", "text": "A.M. (morning)"},
              {"id": "b", "text": "P.M. (afternoon/night)"}
            ],
            "correctOptionId": "a",
            "hint": "You go to school in the morning. A.M. means morning!"
          },
          {
            "id": "ampm-mc4",
            "prompt": "You go to bed at 8:00. Is that A.M. or P.M.? \ud83d\udca4",
            "options": [
              {"id": "a", "text": "A.M. (morning)"},
              {"id": "b", "text": "P.M. (afternoon/night)"}
            ],
            "correctOptionId": "b",
            "hint": "Bedtime is at night. Night times use P.M.!"
          },
          {
            "id": "ampm-mc5",
            "prompt": "The sun rises at 6:30. Is that A.M. or P.M.? \ud83c\udf05",
            "options": [
              {"id": "a", "text": "A.M. (morning)"},
              {"id": "b", "text": "P.M. (afternoon/night)"}
            ],
            "correctOptionId": "a",
            "hint": "Sunrise happens in the early morning. That is A.M.!"
          },
          {
            "id": "ampm-mc6",
            "prompt": "Which of these happens in the P.M.? \ud83c\udf19",
            "options": [
              {"id": "a", "text": "Waking up at 7:00"},
              {"id": "b", "text": "Eating lunch at 12:30"},
              {"id": "c", "text": "Brushing teeth before bed at 8:00"},
              {"id": "d", "text": "Riding the bus to school at 7:45"}
            ],
            "correctOptionId": "c",
            "hint": "P.M. is afternoon and night. Brushing teeth before bed happens at night!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ampm-so1",
            "prompt": "Put Chip''s daily activities in order from EARLIEST to LATEST! \ud83d\udcc5",
            "items": [
              {"id": "i1", "text": "Wake up at 7:00 A.M. \u2600\ufe0f"},
              {"id": "i2", "text": "Eat breakfast at 7:30 A.M. \ud83e\udd5e"},
              {"id": "i3", "text": "Go to school at 8:00 A.M. \ud83c\udfeb"},
              {"id": "i4", "text": "Eat lunch at 12:00 P.M. \ud83c\udf54"},
              {"id": "i5", "text": "Play outside at 3:30 P.M. \u26bd"},
              {"id": "i6", "text": "Eat dinner at 6:00 P.M. \ud83c\udf5d"},
              {"id": "i7", "text": "Go to bed at 8:00 P.M. \ud83d\udca4"}
            ],
            "correctOrder": ["i1", "i2", "i3", "i4", "i5", "i6", "i7"],
            "hint": "Start with the earliest morning activity (7:00 A.M.) and end with bedtime (8:00 P.M.)!"
          },
          {
            "id": "ampm-so2",
            "prompt": "Put these times in order from EARLIEST to LATEST! \u23f0",
            "items": [
              {"id": "i1", "text": "9:00 A.M."},
              {"id": "i2", "text": "12:00 P.M."},
              {"id": "i3", "text": "3:00 P.M."},
              {"id": "i4", "text": "6:00 A.M."},
              {"id": "i5", "text": "7:00 P.M."}
            ],
            "correctOrder": ["i4", "i1", "i2", "i3", "i5"],
            "hint": "A.M. comes first (morning), then P.M. (afternoon and night). 6:00 A.M. is the earliest!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
