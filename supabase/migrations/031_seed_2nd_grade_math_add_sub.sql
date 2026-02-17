-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math: Addition & Subtraction Strategies
-- =============================================================================
-- 6 interactive lessons for 2nd grade (Band 2, ages 7-8):
--   1. Addition Facts to 20 (Fluency)       -- flash_card + fill_in_blank
--   2. Making 10 to Add                     -- ten_frame + number_bond
--   3. Two-Digit Addition (No Regrouping)   -- rekenrek + fill_in_blank
--   4. Two-Digit Addition (With Regrouping) -- number_bond + fill_in_blank
--   5. Two-Digit Subtraction                -- number_line + fill_in_blank
--   6. Adding Three or Four Numbers         -- rekenrek + fill_in_blank
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 017_seed_math_visual_lessons.sql   (established math visual widgets)
--   - 019_seed_2nd_grade_math_problemsolving.sql (established 2nd-grade Math skills)
--
-- Subject ID:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module ID:
--   Addition & Subtraction Strategies: 10000002-0107-4000-8000-000000000001
--
-- Skill IDs (existing):
--   Addition within 100:    20000001-0005-4000-8000-000000000001
--   Subtraction within 100: 20000001-0006-4000-8000-000000000001
-- Skill IDs (new):
--   Add/Sub within 1000:    20000001-0009-4000-8000-000000000001
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
  ('10000002-0107-4000-8000-000000000001', 2, 21, 'Addition & Subtraction Strategies', 'Level up your adding and subtracting skills! Use ten frames, number lines, and clever strategies to solve big problems!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills (reuse existing + one new)
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000001-0005-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'add_within_100',    'Addition within 100',            'Fluently add within 100 using strategies based on place value',                '2.NBT.B.5', 5),
  ('20000001-0006-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'sub_within_100',    'Subtraction within 100',         'Fluently subtract within 100 using strategies based on place value',           '2.NBT.B.5', 6),
  ('20000001-0009-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'add_sub_within_1000','Addition/Subtraction within 1000','Add and subtract within 1000 using models and strategies based on place value','2.NBT.B.7', 9)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Addition Facts to 20 (Fluency)
-- Module: Addition & Subtraction Strategies
-- Widgets: flash_card + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0016-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  1,
  'Addition Facts to 20 (Fluency)',
  'Practice your addition facts to 20 until they are super fast! Flip, solve, repeat!',
  'Welcome to Chip''s Speed Math Challenge! The fastest robots in Robot Land know their addition facts by heart. Can YOU answer these as fast as Chip? Flip each card to check your answer, then try the fill-in-the-blank round. Ready, set, GO!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to check your addition answer! Try to answer BEFORE you flip!",
        "shuffleCards": true,
        "cards": [
          {
            "id": "af-fc1",
            "front": "7 + 8 = ?",
            "back": "15! Seven plus eight equals fifteen."
          },
          {
            "id": "af-fc2",
            "front": "9 + 6 = ?",
            "back": "15! Nine plus six equals fifteen."
          },
          {
            "id": "af-fc3",
            "front": "8 + 5 = ?",
            "back": "13! Eight plus five equals thirteen."
          },
          {
            "id": "af-fc4",
            "front": "6 + 7 = ?",
            "back": "13! Six plus seven equals thirteen."
          },
          {
            "id": "af-fc5",
            "front": "9 + 9 = ?",
            "back": "18! Nine plus nine equals eighteen."
          },
          {
            "id": "af-fc6",
            "front": "8 + 6 = ?",
            "back": "14! Eight plus six equals fourteen."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "af-fb1",
            "prompt": "7 + 8 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "Think: 7 + 3 = 10, then 10 + 5 = 15!"
          },
          {
            "id": "af-fb2",
            "prompt": "9 + 4 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "13", "acceptableAnswers": ["13"] }],
            "hint": "9 + 1 = 10, then 10 + 3 = 13!"
          },
          {
            "id": "af-fb3",
            "prompt": "6 + 9 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "6 + 4 = 10, then 10 + 5 = 15!"
          },
          {
            "id": "af-fb4",
            "prompt": "8 + 7 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "15", "acceptableAnswers": ["15"] }],
            "hint": "8 + 2 = 10, then 10 + 5 = 15!"
          },
          {
            "id": "af-fb5",
            "prompt": "5 + 9 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "14", "acceptableAnswers": ["14"] }],
            "hint": "5 + 5 = 10, then 10 + 4 = 14!"
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
-- LESSON 2: Making 10 to Add
-- Module: Addition & Subtraction Strategies
-- Widgets: ten_frame + number_bond
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0017-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  2,
  'Making 10 to Add',
  'Learn the making-10 trick! Break numbers apart so you can make a 10 first, then add the rest.',
  'Chip has the BEST math trick ever! When you need to add two numbers, you can break one apart to MAKE A 10 first. Like 8 + 5: take 2 from the 5 to make 8 into 10, then you have 3 left. 10 + 3 = 13! Easy peasy! Let''s practice this awesome trick!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "mk10-tf1",
            "prompt": "Show 8 + 5 by making 10 first!",
            "operation": { "a": 8, "b": 5, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "Fill 8 in the first frame, then add 2 more to make 10. The leftover 3 go in the second frame. 10 + 3 = 13!"
          },
          {
            "id": "mk10-tf2",
            "prompt": "Show 9 + 6 by making 10 first!",
            "operation": { "a": 9, "b": 6, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "9 just needs 1 more to make 10! Take 1 from the 6, leaving 5. 10 + 5 = 15!"
          },
          {
            "id": "mk10-tf3",
            "prompt": "Show 7 + 6 by making 10 first!",
            "operation": { "a": 7, "b": 6, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "7 needs 3 more to make 10. Take 3 from the 6, leaving 3. 10 + 3 = 13!"
          },
          {
            "id": "mk10-tf4",
            "prompt": "Show 8 + 8 by making 10 first!",
            "operation": { "a": 8, "b": 8, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "8 needs 2 more to make 10. Take 2 from the other 8, leaving 6. 10 + 6 = 16!"
          }
        ]
      },
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "mk10-nb1",
            "prompt": "Break apart 5 to make 10 with 8! What goes with 8 to make 10?",
            "whole": 10,
            "part1": 8,
            "part2": null,
            "hint": "8 + ___ = 10. You need 2!"
          },
          {
            "id": "mk10-nb2",
            "prompt": "Break apart 7 to make 10 with 6! How much does 6 need to become 10?",
            "whole": 10,
            "part1": 6,
            "part2": null,
            "hint": "6 + ___ = 10. You need 4!"
          },
          {
            "id": "mk10-nb3",
            "prompt": "Break apart 4 to make 10 with 9! What does 9 need?",
            "whole": 10,
            "part1": 9,
            "part2": null,
            "hint": "9 + ___ = 10. Just 1 more!"
          },
          {
            "id": "mk10-nb4",
            "prompt": "Break apart 8 to make 10 with 7! What does 7 need?",
            "whole": 10,
            "part1": 7,
            "part2": null,
            "hint": "7 + ___ = 10. You need 3!"
          },
          {
            "id": "mk10-nb5",
            "prompt": "8 + 5 = 13. Show the bond: 13 is 10 and ___!",
            "whole": 13,
            "part1": 10,
            "part2": null,
            "hint": "13 minus 10 equals 3. The answer is 3!"
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
-- LESSON 3: Two-Digit Addition (No Regrouping)
-- Module: Addition & Subtraction Strategies
-- Widgets: rekenrek + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0018-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  3,
  'Two-Digit Addition (No Regrouping)',
  'Add two-digit numbers the easy way -- no carrying needed! Add tens, then add ones.',
  'Chip is learning to add BIG numbers! When you add numbers like 23 + 15, you can add the tens first (20 + 10 = 30), then add the ones (3 + 5 = 8), and put them together: 30 + 8 = 38! Let''s try it on the rekenrek and then do some on our own!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "rekenrek",
        "questions": [
          {
            "id": "nogrp-rk1",
            "prompt": "Show 23 on the rekenrek!",
            "targetNumber": 23,
            "mode": "show",
            "hint": "Slide 20 beads (all of both rows on the first rack), then 3 more. That is 23!"
          },
          {
            "id": "nogrp-rk2",
            "prompt": "Now show 38 -- that is 23 + 15!",
            "targetNumber": 38,
            "mode": "show",
            "hint": "38 means 3 full rows of 10 (30 beads) plus 8 more. Slide them over!"
          },
          {
            "id": "nogrp-rk3",
            "prompt": "Show 42 on the rekenrek!",
            "targetNumber": 42,
            "mode": "show",
            "hint": "4 rows of 10 (40 beads) plus 2 more. You got this!"
          },
          {
            "id": "nogrp-rk4",
            "prompt": "Now show 73 -- that is 42 + 31!",
            "targetNumber": 73,
            "mode": "show",
            "hint": "7 rows of 10 (70 beads) plus 3 more. Awesome!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "nogrp-fb1",
            "prompt": "34 + 25 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "59", "acceptableAnswers": ["59"] }],
            "hint": "Add tens: 30 + 20 = 50. Add ones: 4 + 5 = 9. Together: 50 + 9 = 59!"
          },
          {
            "id": "nogrp-fb2",
            "prompt": "42 + 31 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "73", "acceptableAnswers": ["73"] }],
            "hint": "Add tens: 40 + 30 = 70. Add ones: 2 + 1 = 3. Together: 70 + 3 = 73!"
          },
          {
            "id": "nogrp-fb3",
            "prompt": "51 + 26 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "77", "acceptableAnswers": ["77"] }],
            "hint": "Add tens: 50 + 20 = 70. Add ones: 1 + 6 = 7. Together: 70 + 7 = 77!"
          },
          {
            "id": "nogrp-fb4",
            "prompt": "13 + 24 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "37", "acceptableAnswers": ["37"] }],
            "hint": "Add tens: 10 + 20 = 30. Add ones: 3 + 4 = 7. Together: 30 + 7 = 37!"
          },
          {
            "id": "nogrp-fb5",
            "prompt": "61 + 18 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "79", "acceptableAnswers": ["79"] }],
            "hint": "Add tens: 60 + 10 = 70. Add ones: 1 + 8 = 9. Together: 70 + 9 = 79!"
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
-- LESSON 4: Two-Digit Addition (With Regrouping)
-- Module: Addition & Subtraction Strategies
-- Widgets: number_bond + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0019-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  4,
  'Two-Digit Addition (With Regrouping)',
  'When the ones add up past 10, you need to regroup! Learn how to carry the one like a pro.',
  'Uh oh -- what happens when the ones add up to MORE than 9? Time to REGROUP! Chip calls it "carrying the one." For 47 + 35, you add the ones: 7 + 5 = 12. That is 1 ten and 2 ones. Carry that extra ten over! 40 + 30 + 10 = 80, plus 2 = 82. Let''s practice!',
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
        "type": "number_bond",
        "questions": [
          {
            "id": "rgrp-nb1",
            "prompt": "Break 47 into tens and ones! 47 = 40 + ___",
            "whole": 47,
            "part1": 40,
            "part2": null,
            "hint": "47 has 4 tens (40) and how many ones? 47 - 40 = 7!"
          },
          {
            "id": "rgrp-nb2",
            "prompt": "Break 35 into tens and ones! 35 = 30 + ___",
            "whole": 35,
            "part1": 30,
            "part2": null,
            "hint": "35 has 3 tens (30) and how many ones? 35 - 30 = 5!"
          },
          {
            "id": "rgrp-nb3",
            "prompt": "Add the ones: 7 + 5 = 12. Break 12 into a ten and ones! 12 = 10 + ___",
            "whole": 12,
            "part1": 10,
            "part2": null,
            "hint": "12 is 1 ten and 2 ones. The extra ten gets carried!"
          },
          {
            "id": "rgrp-nb4",
            "prompt": "Now add ALL the tens: 40 + 30 + 10 = ___. What is the total tens part?",
            "whole": null,
            "part1": 40,
            "part2": 40,
            "hint": "40 + 30 = 70, then 70 + 10 = 80! That is the tens part."
          },
          {
            "id": "rgrp-nb5",
            "prompt": "Break 56 into tens and ones! 56 = 50 + ___",
            "whole": 56,
            "part1": 50,
            "part2": null,
            "hint": "56 has 5 tens (50) and 6 ones!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "rgrp-fb1",
            "prompt": "47 + 35 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "82", "acceptableAnswers": ["82"] }],
            "hint": "Ones: 7 + 5 = 12 (write 2, carry 1). Tens: 4 + 3 + 1 = 8. Answer: 82!"
          },
          {
            "id": "rgrp-fb2",
            "prompt": "56 + 27 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "83", "acceptableAnswers": ["83"] }],
            "hint": "Ones: 6 + 7 = 13 (write 3, carry 1). Tens: 5 + 2 + 1 = 8. Answer: 83!"
          },
          {
            "id": "rgrp-fb3",
            "prompt": "38 + 44 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "82", "acceptableAnswers": ["82"] }],
            "hint": "Ones: 8 + 4 = 12 (write 2, carry 1). Tens: 3 + 4 + 1 = 8. Answer: 82!"
          },
          {
            "id": "rgrp-fb4",
            "prompt": "29 + 53 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "82", "acceptableAnswers": ["82"] }],
            "hint": "Ones: 9 + 3 = 12 (write 2, carry 1). Tens: 2 + 5 + 1 = 8. Answer: 82!"
          },
          {
            "id": "rgrp-fb5",
            "prompt": "65 + 18 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "83", "acceptableAnswers": ["83"] }],
            "hint": "Ones: 5 + 8 = 13 (write 3, carry 1). Tens: 6 + 1 + 1 = 8. Answer: 83!"
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
-- LESSON 5: Two-Digit Subtraction
-- Module: Addition & Subtraction Strategies
-- Widgets: number_line + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001a-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  5,
  'Two-Digit Subtraction',
  'Subtract two-digit numbers by hopping backward on the number line! Count back like a pro.',
  'Chip is counting backward like a champion! When you subtract big numbers, the number line is your best friend. Start at the bigger number and HOP BACK to find the answer. For 63 - 27, start at 63 and jump back 27 spaces. Let''s do it together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "number_line",
        "questions": [
          {
            "id": "sub-nl1",
            "prompt": "Solve: 63 - 27 = ? Hop backward from 63!",
            "min": 0,
            "max": 100,
            "startPosition": 63,
            "correctEndPosition": 36,
            "operation": "subtract",
            "showJumpArcs": true,
            "hint": "Start at 63. Hop back 20 to reach 43, then hop back 7 more to reach 36!"
          },
          {
            "id": "sub-nl2",
            "prompt": "Solve: 52 - 18 = ? Hop backward from 52!",
            "min": 0,
            "max": 100,
            "startPosition": 52,
            "correctEndPosition": 34,
            "operation": "subtract",
            "showJumpArcs": true,
            "hint": "Start at 52. Hop back 10 to reach 42, then hop back 8 more to reach 34!"
          },
          {
            "id": "sub-nl3",
            "prompt": "Solve: 75 - 30 = ? Hop backward from 75!",
            "min": 0,
            "max": 100,
            "startPosition": 75,
            "correctEndPosition": 45,
            "operation": "subtract",
            "showJumpArcs": true,
            "hint": "Hop back 3 tens from 75! 75, 65, 55, 45. You land on 45!"
          },
          {
            "id": "sub-nl4",
            "prompt": "Solve: 81 - 45 = ? Hop backward from 81!",
            "min": 0,
            "max": 100,
            "startPosition": 81,
            "correctEndPosition": 36,
            "operation": "subtract",
            "showJumpArcs": true,
            "hint": "Start at 81. Hop back 40 to reach 41, then hop back 5 more to reach 36!"
          },
          {
            "id": "sub-nl5",
            "prompt": "Solve: 90 - 34 = ? Hop backward from 90!",
            "min": 0,
            "max": 100,
            "startPosition": 90,
            "correctEndPosition": 56,
            "operation": "subtract",
            "showJumpArcs": true,
            "hint": "Start at 90. Hop back 30 to reach 60, then hop back 4 more to reach 56!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sub-fb1",
            "prompt": "63 - 27 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "36", "acceptableAnswers": ["36"] }],
            "hint": "Start at 63 and count back 27. Or subtract tens first: 63 - 20 = 43, then 43 - 7 = 36!"
          },
          {
            "id": "sub-fb2",
            "prompt": "54 - 29 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "25", "acceptableAnswers": ["25"] }],
            "hint": "54 - 30 = 24, but we subtracted 1 too many, so add 1 back: 24 + 1 = 25!"
          },
          {
            "id": "sub-fb3",
            "prompt": "72 - 38 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "34", "acceptableAnswers": ["34"] }],
            "hint": "72 - 40 = 32, but we subtracted 2 too many, so add 2 back: 32 + 2 = 34!"
          },
          {
            "id": "sub-fb4",
            "prompt": "85 - 46 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "39", "acceptableAnswers": ["39"] }],
            "hint": "Ones: 5 - 6? Regroup! Borrow a ten. 15 - 6 = 9. Tens: 7 - 4 = 3. Answer: 39!"
          },
          {
            "id": "sub-fb5",
            "prompt": "60 - 25 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "35", "acceptableAnswers": ["35"] }],
            "hint": "60 - 20 = 40, then 40 - 5 = 35!"
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
-- LESSON 6: Adding Three or Four Numbers
-- Module: Addition & Subtraction Strategies
-- Widgets: rekenrek + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-001b-4000-8000-000000000001',
  '10000002-0107-4000-8000-000000000001',
  6,
  'Adding Three or Four Numbers',
  'Add more than two numbers at once! Look for pairs that make 10 to speed things up.',
  'Chip went shopping and needs to add up LOTS of prices! When you add 3 or 4 numbers, look for friends of 10 first. If you see 7 and 3, grab them -- that is 10! Then add the rest. Let''s help Chip add up the shopping list!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0005-4000-8000-000000000001', '20000001-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "rekenrek",
        "questions": [
          {
            "id": "multi-rk1",
            "prompt": "Show 12 + 23 + 15 = 50 on the rekenrek! Start with 50.",
            "targetNumber": 50,
            "mode": "show",
            "hint": "50 is 5 full rows of 10 beads. Slide them all over!"
          },
          {
            "id": "multi-rk2",
            "prompt": "Show 10 + 8 + 12 = 30 on the rekenrek!",
            "targetNumber": 30,
            "mode": "show",
            "hint": "30 is 3 full rows of 10 beads. That is 10 + 10 + 10!"
          },
          {
            "id": "multi-rk3",
            "prompt": "Show 7 + 3 + 5 = 15 on the rekenrek!",
            "targetNumber": 15,
            "mode": "show",
            "hint": "7 + 3 = 10, then add 5 more. 10 + 5 = 15 beads!"
          },
          {
            "id": "multi-rk4",
            "prompt": "Show 6 + 4 + 8 + 2 = 20 on the rekenrek!",
            "targetNumber": 20,
            "mode": "show",
            "hint": "6 + 4 = 10, and 8 + 2 = 10. That is 10 + 10 = 20!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "multi-fb1",
            "prompt": "7 + 3 + 8 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "18", "acceptableAnswers": ["18"] }],
            "hint": "Look for friends of 10! 7 + 3 = 10, then 10 + 8 = 18!"
          },
          {
            "id": "multi-fb2",
            "prompt": "5 + 9 + 5 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "19", "acceptableAnswers": ["19"] }],
            "hint": "5 + 5 = 10 (friends of 10!), then 10 + 9 = 19!"
          },
          {
            "id": "multi-fb3",
            "prompt": "6 + 4 + 8 + 2 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "Find TWO pairs of 10! 6 + 4 = 10, and 8 + 2 = 10. Then 10 + 10 = 20!"
          },
          {
            "id": "multi-fb4",
            "prompt": "12 + 23 + 15 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "50", "acceptableAnswers": ["50"] }],
            "hint": "Add tens: 10 + 20 + 10 = 40. Add ones: 2 + 3 + 5 = 10. Together: 40 + 10 = 50!"
          },
          {
            "id": "multi-fb5",
            "prompt": "8 + 7 + 2 + 3 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "Look for 10s! 8 + 2 = 10, and 7 + 3 = 10. Then 10 + 10 = 20!"
          },
          {
            "id": "multi-fb6",
            "prompt": "11 + 14 + 9 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "34", "acceptableAnswers": ["34"] }],
            "hint": "Add tens: 10 + 10 + 0 = 20. Add ones: 1 + 4 + 9 = 14. Together: 20 + 14 = 34!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
