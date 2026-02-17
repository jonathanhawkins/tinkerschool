-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math: Word Problems & Data
-- =============================================================================
-- 4 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - Lesson 1: One-Step Word Problems (multiple_choice + fill_in_blank)
--   - Lesson 2: Two-Step Word Problems (fill_in_blank + number_bond)
--   - Lesson 3: Measurement Word Problems (number_line + fill_in_blank)
--   - Lesson 4: Picture Graphs & Bar Graphs (multiple_choice + matching_pairs)
--
-- Widget types used: multiple_choice, fill_in_blank, number_bond, number_line,
--   matching_pairs
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 017_seed_math_visual_lessons.sql   (established 2nd-grade Math subject)
--
-- Subject ID:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module ID:
--   Word Problems & Data: 10000002-010a-4000-8000-000000000001
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
  ('10000002-010a-4000-8000-000000000001', 2, 24, 'Word Problems & Data', 'Become a word problem champion! Solve real-world math puzzles and learn to read graphs!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000001-000c-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'multi_step_word_problems', 'Multi-Step Word Problems', 'Solve one-step and two-step word problems using addition and subtraction within 100', '2.OA.A.1', 12),
  ('20000001-000d-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'data_and_graphs',         'Data & Graphs',           'Read and interpret data from picture graphs and bar graphs with up to four categories', '2.MD.D.9', 13)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: One-Step Word Problems
-- Module: Word Problems & Data
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0025-4000-8000-000000000001',
  '10000002-010a-4000-8000-000000000001',
  1,
  'One-Step Word Problems',
  'Solve word problems with one step! Read the story, find the math, and get the answer.',
  'Welcome to Chip''s Word Problem Workshop! Word problems are like little math stories. You read the story, figure out what math to do, and solve it! Today we will practice ONE-STEP problems -- that means just one addition or subtraction. You''ve got this!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wp1-mc1",
            "prompt": "Sam has 45 stickers. He gives 18 to his friend. What should you do to find how many Sam has now? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "Add 45 + 18"},
              {"id": "b", "text": "Subtract 45 - 18"},
              {"id": "c", "text": "Multiply 45 x 18"},
              {"id": "d", "text": "Count to 45"}
            ],
            "correctOptionId": "b",
            "hint": "Sam GIVES stickers away, so he has FEWER. Giving away means subtract!"
          },
          {
            "id": "wp1-mc2",
            "prompt": "Emma has 23 crayons. She finds 15 more in her desk. What should you do? \ud83d\udd8d\ufe0f",
            "options": [
              {"id": "a", "text": "Subtract 23 - 15"},
              {"id": "b", "text": "Add 23 + 15"},
              {"id": "c", "text": "Count by 5s"},
              {"id": "d", "text": "Subtract 15 - 23"}
            ],
            "correctOptionId": "b",
            "hint": "Emma FINDS more crayons, so she has MORE. Finding more means add!"
          },
          {
            "id": "wp1-mc3",
            "prompt": "There are 32 kids on the playground. 14 go inside. How do you find how many are left? \ud83c\udfa2",
            "options": [
              {"id": "a", "text": "Add 32 + 14"},
              {"id": "b", "text": "Subtract 14 - 32"},
              {"id": "c", "text": "Subtract 32 - 14"},
              {"id": "d", "text": "Add 14 + 14"}
            ],
            "correctOptionId": "c",
            "hint": "Kids go AWAY, so there are fewer left. Subtract the ones who left from the total!"
          },
          {
            "id": "wp1-mc4",
            "prompt": "A bus has 28 people. 19 more get on at the next stop. What should you do? \ud83d\ude8c",
            "options": [
              {"id": "a", "text": "Subtract 28 - 19"},
              {"id": "b", "text": "Add 19 + 19"},
              {"id": "c", "text": "Add 28 + 19"},
              {"id": "d", "text": "Subtract 19 - 28"}
            ],
            "correctOptionId": "c",
            "hint": "More people GET ON the bus, so the number goes UP. Add!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "wp1-fb1",
            "prompt": "Sam has 45 stickers. He gives 18 to his friend. How many stickers does Sam have now? \ud83c\udf1f Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "27", "acceptableAnswers": ["27"] }],
            "hint": "45 minus 18... break it up! 45 - 10 = 35, then 35 - 8 = 27!"
          },
          {
            "id": "wp1-fb2",
            "prompt": "Emma has 23 crayons. She finds 15 more. How many crayons does Emma have? \ud83d\udd8d\ufe0f Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "38", "acceptableAnswers": ["38"] }],
            "hint": "23 plus 15... 23 + 10 = 33, then 33 + 5 = 38!"
          },
          {
            "id": "wp1-fb3",
            "prompt": "A baker made 50 cookies. He sold 34. How many are left? \ud83c\udf6a Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "16", "acceptableAnswers": ["16"] }],
            "hint": "50 minus 34... 50 - 30 = 20, then 20 - 4 = 16!"
          },
          {
            "id": "wp1-fb4",
            "prompt": "There are 37 birds in a tree. 21 more fly in. How many birds now? \ud83d\udc26 Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "58", "acceptableAnswers": ["58"] }],
            "hint": "37 plus 21... 37 + 20 = 57, then 57 + 1 = 58!"
          },
          {
            "id": "wp1-fb5",
            "prompt": "Mia has 62 beads. She uses 29 for a necklace. How many beads are left? \ud83d\udc8e Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "33", "acceptableAnswers": ["33"] }],
            "hint": "62 minus 29... 62 - 30 = 32, then add 1 back = 33! (We subtracted 1 too many.)"
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
-- LESSON 2: Two-Step Word Problems
-- Module: Word Problems & Data
-- Widgets: fill_in_blank + number_bond
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0026-4000-8000-000000000001',
  '10000002-010a-4000-8000-000000000001',
  2,
  'Two-Step Word Problems',
  'Break big problems into two small steps! Solve one step at a time like a math detective.',
  'Chip has a secret trick for solving BIG word problems -- break them into TWO small steps! First do one piece of math, then use that answer to do the second piece. It''s like climbing stairs: one step at a time gets you to the top! Let''s try it!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "wp2-fb1",
            "prompt": "Lily has 24 apples \ud83c\udf4e. She picks 13 more, then gives 10 away. Step 1: 24 + 13 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "37", "acceptableAnswers": ["37"] }],
            "hint": "First add the apples Lily picks! 24 + 13 = 37."
          },
          {
            "id": "wp2-fb2",
            "prompt": "Lily had 37 apples after picking. She gives 10 away. Step 2: 37 - 10 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "27", "acceptableAnswers": ["27"] }],
            "hint": "Now subtract the apples she gives away! 37 - 10 = 27."
          },
          {
            "id": "wp2-fb3",
            "prompt": "Jake has 30 marbles. He loses 12, then finds 8 more. Step 1: 30 - 12 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "18", "acceptableAnswers": ["18"] }],
            "hint": "First subtract the marbles Jake loses! 30 - 12 = 18."
          },
          {
            "id": "wp2-fb4",
            "prompt": "Jake had 18 marbles left. He finds 8 more. Step 2: 18 + 8 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "26", "acceptableAnswers": ["26"] }],
            "hint": "Now add the marbles he finds! 18 + 8 = 26."
          },
          {
            "id": "wp2-fb5",
            "prompt": "A box has 42 toys. Kids take out 15, then put back 6. How many toys are in the box? \ud83d\udce6 Answer: ___",
            "blanks": [{ "id": "b1", "correctAnswer": "33", "acceptableAnswers": ["33"] }],
            "hint": "Step 1: 42 - 15 = 27. Step 2: 27 + 6 = 33!"
          }
        ]
      },
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "wp2-nb1",
            "prompt": "Break this two-step problem into parts! A shelf has 35 books. 20 are taken out, 9 are put back. First step: 35 splits into 20 and what?",
            "whole": 35,
            "part1": 20,
            "part2": null,
            "hint": "35 minus 20 equals... the shelf has 15 books after the first step!"
          },
          {
            "id": "wp2-nb2",
            "prompt": "Now the second step! 15 books on the shelf, plus 9 put back. What is the new total?",
            "whole": null,
            "part1": 15,
            "part2": 9,
            "hint": "15 plus 9 equals 24! The shelf now has 24 books."
          },
          {
            "id": "wp2-nb3",
            "prompt": "Maria has 50 coins. She spends 22, then earns 10 back. What is 50 minus 22?",
            "whole": 50,
            "part1": 22,
            "part2": null,
            "hint": "50 minus 22... think of it as 50 - 20 = 30, then 30 - 2 = 28!"
          },
          {
            "id": "wp2-nb4",
            "prompt": "Maria had 28 coins left. She earns 10 more. What is the final total?",
            "whole": null,
            "part1": 28,
            "part2": 10,
            "hint": "28 plus 10 equals 38! Maria ends up with 38 coins."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Measurement Word Problems
-- Module: Word Problems & Data
-- Widgets: number_line + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0027-4000-8000-000000000001',
  '10000002-010a-4000-8000-000000000001',
  3,
  'Measurement Word Problems',
  'Solve word problems about length, weight, and more! Use a number line to help you.',
  'Chip is measuring things around the classroom today! How long is this ribbon? How tall is that plant? We can use math to compare measurements and find the difference. Grab your thinking cap and let''s measure!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "number_line",
        "questions": [
          {
            "id": "wp3-nl1",
            "prompt": "Tom''s ribbon is 48 cm. Jane''s is 25 cm. How much LONGER is Tom''s ribbon? Start at 25 and hop to 48. \ud83c\udf80",
            "min": 0,
            "max": 60,
            "startPosition": 25,
            "correctEndPosition": 48,
            "operation": "add",
            "hint": "Find the difference! Start at 25 and count up to 48. That is 23 cm longer!"
          },
          {
            "id": "wp3-nl2",
            "prompt": "A pencil is 19 cm long. An eraser is 5 cm long. How much longer is the pencil? Start at 5 and hop to 19. \u270f\ufe0f",
            "min": 0,
            "max": 30,
            "startPosition": 5,
            "correctEndPosition": 19,
            "operation": "add",
            "hint": "Start at 5 and count up to 19. The difference is 14 cm!"
          },
          {
            "id": "wp3-nl3",
            "prompt": "A bookshelf is 90 cm tall. A table is 65 cm tall. How much taller is the bookshelf? Start at 65 and hop to 90. \ud83d\udcda",
            "min": 50,
            "max": 100,
            "startPosition": 65,
            "correctEndPosition": 90,
            "operation": "add",
            "hint": "Hop from 65 to 90 on the number line. That is 25 cm taller!"
          },
          {
            "id": "wp3-nl4",
            "prompt": "A snake is 72 cm long. It sheds skin and is now 72 cm minus 18 cm. Start at 72 and hop back 18. \ud83d\udc0d",
            "min": 40,
            "max": 80,
            "startPosition": 72,
            "correctEndPosition": 54,
            "operation": "subtract",
            "hint": "72 minus 18... hop back from 72! 72 - 10 = 62, then 62 - 8 = 54."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "wp3-fb1",
            "prompt": "Tom''s ribbon is 48 cm. Jane''s ribbon is 25 cm. How much longer is Tom''s ribbon? ___ cm \ud83c\udf80",
            "blanks": [{ "id": "b1", "correctAnswer": "23", "acceptableAnswers": ["23"] }],
            "hint": "Subtract! 48 - 25 = 23 cm. Tom''s ribbon is 23 cm longer!"
          },
          {
            "id": "wp3-fb2",
            "prompt": "A plant is 34 cm tall. It grows 17 cm more. How tall is it now? ___ cm \ud83c\udf31",
            "blanks": [{ "id": "b1", "correctAnswer": "51", "acceptableAnswers": ["51"] }],
            "hint": "Add the growth! 34 + 17 = 51 cm tall."
          },
          {
            "id": "wp3-fb3",
            "prompt": "Aiden walks 56 meters to school. Bella walks 39 meters. How much farther does Aiden walk? ___ meters \ud83d\udeb6",
            "blanks": [{ "id": "b1", "correctAnswer": "17", "acceptableAnswers": ["17"] }],
            "hint": "Find the difference! 56 - 39 = 17 meters farther."
          },
          {
            "id": "wp3-fb4",
            "prompt": "A rope is 80 cm long. You cut off 35 cm. How long is the rope now? ___ cm \ud83e\uddf5",
            "blanks": [{ "id": "b1", "correctAnswer": "45", "acceptableAnswers": ["45"] }],
            "hint": "Cutting means subtract! 80 - 35 = 45 cm."
          },
          {
            "id": "wp3-fb5",
            "prompt": "One fish is 28 cm long. Another fish is 44 cm long. How much longer is the second fish? ___ cm \ud83d\udc1f",
            "blanks": [{ "id": "b1", "correctAnswer": "16", "acceptableAnswers": ["16"] }],
            "hint": "Find the difference! 44 - 28 = 16 cm longer."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Picture Graphs & Bar Graphs
-- Module: Word Problems & Data
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0028-4000-8000-000000000001',
  '10000002-010a-4000-8000-000000000001',
  4,
  'Picture Graphs & Bar Graphs',
  'Read picture graphs and bar graphs to answer questions! Data tells a story.',
  'Chip surveyed the whole class about their favorite things! Now we have lots of data, but how do we SHOW it? With GRAPHS! A picture graph uses little pictures, and a bar graph uses bars. Let''s learn to read them and answer questions like a data detective!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-000d-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wp4-mc1",
            "prompt": "Chip''s class voted for their favorite fruit! \ud83c\udf4e Apple: 8 kids, \ud83c\udf4c Banana: 5 kids, \ud83c\udf47 Grapes: 3 kids, \ud83c\udf4a Orange: 6 kids. How many kids chose Apple?",
            "options": [
              {"id": "a", "text": "3 kids"},
              {"id": "b", "text": "5 kids"},
              {"id": "c", "text": "8 kids"},
              {"id": "d", "text": "6 kids"}
            ],
            "correctOptionId": "c",
            "hint": "Look at the data next to the apple emoji! Apple: 8 kids."
          },
          {
            "id": "wp4-mc2",
            "prompt": "Same fruit graph! \ud83c\udf4e Apple: 8, \ud83c\udf4c Banana: 5, \ud83c\udf47 Grapes: 3, \ud83c\udf4a Orange: 6. Which fruit was the MOST popular?",
            "options": [
              {"id": "a", "text": "\ud83c\udf4c Banana"},
              {"id": "b", "text": "\ud83c\udf4e Apple"},
              {"id": "c", "text": "\ud83c\udf4a Orange"},
              {"id": "d", "text": "\ud83c\udf47 Grapes"}
            ],
            "correctOptionId": "b",
            "hint": "The most popular fruit has the BIGGEST number. 8 is the biggest!"
          },
          {
            "id": "wp4-mc3",
            "prompt": "Same fruit graph! \ud83c\udf4e Apple: 8, \ud83c\udf4c Banana: 5, \ud83c\udf47 Grapes: 3, \ud83c\udf4a Orange: 6. Which fruit was the LEAST popular?",
            "options": [
              {"id": "a", "text": "\ud83c\udf4e Apple"},
              {"id": "b", "text": "\ud83c\udf4c Banana"},
              {"id": "c", "text": "\ud83c\udf47 Grapes"},
              {"id": "d", "text": "\ud83c\udf4a Orange"}
            ],
            "correctOptionId": "c",
            "hint": "The least popular fruit has the SMALLEST number. 3 is the smallest!"
          },
          {
            "id": "wp4-mc4",
            "prompt": "Same fruit graph! \ud83c\udf4e Apple: 8, \ud83c\udf4c Banana: 5, \ud83c\udf47 Grapes: 3, \ud83c\udf4a Orange: 6. How many MORE kids chose Apple than Grapes?",
            "options": [
              {"id": "a", "text": "2 more"},
              {"id": "b", "text": "3 more"},
              {"id": "c", "text": "5 more"},
              {"id": "d", "text": "11 more"}
            ],
            "correctOptionId": "c",
            "hint": "Subtract! Apple (8) minus Grapes (3) = 5. Five more kids chose Apple!"
          },
          {
            "id": "wp4-mc5",
            "prompt": "Chip asked kids about their favorite pet! \ud83d\udc36 Dog: 7, \ud83d\udc31 Cat: 5, \ud83d\udc20 Fish: 2, \ud83d\udc30 Rabbit: 4. How many kids voted in TOTAL?",
            "options": [
              {"id": "a", "text": "14"},
              {"id": "b", "text": "16"},
              {"id": "c", "text": "18"},
              {"id": "d", "text": "20"}
            ],
            "correctOptionId": "c",
            "hint": "Add them all up! 7 + 5 + 2 + 4 = 18 kids total!"
          },
          {
            "id": "wp4-mc6",
            "prompt": "Pet graph! \ud83d\udc36 Dog: 7, \ud83d\udc31 Cat: 5, \ud83d\udc20 Fish: 2, \ud83d\udc30 Rabbit: 4. How many MORE kids chose Dog than Cat?",
            "options": [
              {"id": "a", "text": "1 more"},
              {"id": "b", "text": "2 more"},
              {"id": "c", "text": "3 more"},
              {"id": "d", "text": "12 more"}
            ],
            "correctOptionId": "b",
            "hint": "Dog (7) minus Cat (5) = 2. Two more kids chose Dog!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each graph question to its answer! Use Chip''s weather graph: \u2600\ufe0f Sunny: 10 days, \ud83c\udf27\ufe0f Rainy: 4 days, \u2601\ufe0f Cloudy: 6 days, \u2744\ufe0f Snowy: 2 days.",
        "pairs": [
          { "id": "p1", "left": {"id": "q1", "text": "Which weather happened MOST?", "emoji": "\ud83c\udf1f"}, "right": {"id": "a1", "text": "Sunny (10 days)", "emoji": "\u2600\ufe0f"} },
          { "id": "p2", "left": {"id": "q2", "text": "Which weather happened LEAST?", "emoji": "\ud83d\udd0d"}, "right": {"id": "a2", "text": "Snowy (2 days)", "emoji": "\u2744\ufe0f"} },
          { "id": "p3", "left": {"id": "q3", "text": "How many Sunny + Rainy days total?", "emoji": "\u2795"}, "right": {"id": "a3", "text": "14 days", "emoji": "\ud83d\udcca"} },
          { "id": "p4", "left": {"id": "q4", "text": "How many more Cloudy than Snowy?", "emoji": "\u2796"}, "right": {"id": "a4", "text": "4 more days", "emoji": "\ud83d\udcca"} },
          { "id": "p5", "left": {"id": "q5", "text": "How many days of weather data in all?", "emoji": "\ud83d\udcc8"}, "right": {"id": "a5", "text": "22 days", "emoji": "\ud83d\udcca"} }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
