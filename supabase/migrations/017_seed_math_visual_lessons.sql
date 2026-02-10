-- =============================================================================
-- TinkerSchool -- Seed Math Visual Widget Lessons (Band 1-2, Grade 1)
-- =============================================================================
-- 8 interactive lessons using the 4 new math-focused widget types:
--   number_bond, ten_frame, number_line, rekenrek
--
-- These teach alternative math methods (number bonds, making-10 strategy,
-- number line hopping, subitizing) aligned with Singapore Math and
-- Cognitively Guided Instruction research.
--
-- Subject IDs:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module IDs:
--   Counting & Number Sense: 10000002-0101-4000-8000-000000000001
--   Operations & Place Value: 10000002-0102-4000-8000-000000000001
--
-- Skill IDs:
--   Counting to 50:          73513881-2984-40bb-bbe2-fde73d06fd55
--   Addition within 10:      83bd2c5d-2fad-441a-9ffb-e1373d5f68aa
--   Addition within 20:      42fd1fb0-e7b2-46e9-8f2a-f560e4b1cbc4
--   Subtraction within 10:   951c53a0-eb22-48f4-a7f6-802f5cde4b40
--   Number lines & ordering: 138bb984-147f-42f6-862a-0cf969491dcb
-- =============================================================================


-- =========================================================================
-- LESSON 1: Number Bonds to 10 (number_bond widget)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0001-4000-8000-000000000001',
  '10000002-0101-4000-8000-000000000001',
  30,
  'Number Bonds to 10',
  'Learn how numbers split apart and come together! Every number is made of two parts.',
  'Hey there! Chip here! Did you know that every number is like a puzzle? You can break it into two pieces! For example, 7 is made of 3 and 4. Let''s practice finding the missing pieces!',
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
        "type": "number_bond",
        "questions": [
          {
            "id": "nb-1",
            "prompt": "What number goes with 3 to make 5?",
            "whole": 5,
            "part1": 3,
            "part2": null,
            "hint": "Count up from 3 to get to 5!"
          },
          {
            "id": "nb-2",
            "prompt": "What number goes with 6 to make 10?",
            "whole": 10,
            "part1": 6,
            "part2": null,
            "hint": "Think: 6 plus what equals 10?"
          },
          {
            "id": "nb-3",
            "prompt": "Split 8 into two parts!",
            "whole": 8,
            "part1": 5,
            "part2": null,
            "hint": "8 is 5 and how many more?"
          },
          {
            "id": "nb-4",
            "prompt": "What is the whole when the parts are 4 and 3?",
            "whole": null,
            "part1": 4,
            "part2": 3,
            "hint": "Add the two parts together!"
          },
          {
            "id": "nb-5",
            "prompt": "Find the missing part!",
            "whole": 9,
            "part1": null,
            "part2": 2,
            "hint": "9 take away 2 gives you the answer!"
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
-- LESSON 2: Friends of 10 (number_bond widget)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0002-4000-8000-000000000001',
  '10000002-0101-4000-8000-000000000001',
  31,
  'Friends of 10',
  'Find all the number pairs that add up to 10! These are your "friends of 10."',
  'Chip needs your help! In Robot Land, you need to know all the pairs of numbers that make 10. These are called "friends of 10" and they are super important for math! Let''s find them all!',
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
            "id": "fo10-1",
            "prompt": "1 and ___ make 10!",
            "whole": 10,
            "part1": 1,
            "part2": null,
            "hint": "Start at 1 and count up to 10!"
          },
          {
            "id": "fo10-2",
            "prompt": "3 and ___ make 10!",
            "whole": 10,
            "part1": 3,
            "part2": null,
            "hint": "Use your fingers: show 3, then count the rest!"
          },
          {
            "id": "fo10-3",
            "prompt": "5 and ___ make 10!",
            "whole": 10,
            "part1": 5,
            "part2": null,
            "hint": "This is an easy one — both hands have 5 fingers!"
          },
          {
            "id": "fo10-4",
            "prompt": "7 and ___ make 10!",
            "whole": 10,
            "part1": 7,
            "part2": null,
            "hint": "10 minus 7 gives you the answer!"
          },
          {
            "id": "fo10-5",
            "prompt": "2 and ___ make 10!",
            "whole": 10,
            "part1": 2,
            "part2": null,
            "hint": "Think about it: 2 + ? = 10"
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
-- LESSON 3: Ten Frame Fun (ten_frame widget - show numbers)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0003-4000-8000-000000000001',
  '10000002-0101-4000-8000-000000000001',
  32,
  'Ten Frame Fun!',
  'Use the ten frame to show numbers. Tap the boxes to fill them with counters!',
  'Welcome to the Ten Frame Factory! A ten frame is a special grid with 10 boxes. It helps us see numbers in groups of 5 and 10. Tap the boxes to place counters and show each number!',
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
        "type": "ten_frame",
        "questions": [
          {
            "id": "tf-1",
            "prompt": "Show the number 3 on the ten frame!",
            "targetNumber": 3,
            "frameCount": 1,
            "hint": "Tap 3 boxes to fill them with counters!"
          },
          {
            "id": "tf-2",
            "prompt": "Show the number 7 on the ten frame!",
            "targetNumber": 7,
            "frameCount": 1,
            "hint": "Fill the top row (5) and then 2 more!"
          },
          {
            "id": "tf-3",
            "prompt": "Show the number 10 on the ten frame!",
            "targetNumber": 10,
            "frameCount": 1,
            "hint": "Fill every single box!"
          },
          {
            "id": "tf-4",
            "prompt": "Show the number 5 on the ten frame!",
            "targetNumber": 5,
            "frameCount": 1,
            "hint": "That is exactly one full row!"
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
-- LESSON 4: Making 10 with Ten Frames (ten_frame widget - addition)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0004-4000-8000-000000000001',
  '10000002-0102-4000-8000-000000000001',
  33,
  'Making 10 to Add!',
  'Use two ten frames to add numbers bigger than 10. Fill one frame, then overflow into the next!',
  'Here is a super math trick! When you add two numbers and they go past 10, fill up the first ten frame ALL the way, then put the extra in a second frame. Like 8 + 5: fill 8, then add 2 more to make 10, and put the leftover 3 in the next frame. 10 + 3 = 13!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['42fd1fb0-e7b2-46e9-8f2a-f560e4b1cbc4']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "ten_frame",
        "questions": [
          {
            "id": "mk10-1",
            "prompt": "Show 8 + 4 using making 10!",
            "operation": { "a": 8, "b": 4, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "Fill 8, then add 2 to make 10, then put 2 more in the next frame!"
          },
          {
            "id": "mk10-2",
            "prompt": "Show 7 + 5 using making 10!",
            "operation": { "a": 7, "b": 5, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "7 needs 3 more to make 10, then you have 2 left!"
          },
          {
            "id": "mk10-3",
            "prompt": "Show 9 + 6 using making 10!",
            "operation": { "a": 9, "b": 6, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "9 just needs 1 more to make 10! Then 5 go in the next frame."
          },
          {
            "id": "mk10-4",
            "prompt": "Show 6 + 6 using making 10!",
            "operation": { "a": 6, "b": 6, "type": "add" },
            "showMakingTen": true,
            "frameCount": 2,
            "hint": "6 needs 4 to make 10, then 2 left over. 10 + 2 = 12!"
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
-- LESSON 5: Number Line Hopping - Addition (number_line widget)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0005-4000-8000-000000000001',
  '10000002-0102-4000-8000-000000000001',
  34,
  'Frog Hops Forward!',
  'Help the frog hop along the number line to add numbers together!',
  'Ribbit! This little frog loves to hop! When we add numbers, the frog hops FORWARD on the number line. If we start at 4 and add 3, the frog makes 3 hops forward and lands on... 7! Let''s practice!',
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
        "type": "number_line",
        "questions": [
          {
            "id": "nl-add-1",
            "prompt": "Start at 3 and add 4. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 3,
            "correctEndPosition": 7,
            "showJumpArcs": true,
            "operation": "add",
            "hint": "Hop forward 4 times from 3!"
          },
          {
            "id": "nl-add-2",
            "prompt": "Start at 5 and add 6. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 5,
            "correctEndPosition": 11,
            "showJumpArcs": true,
            "operation": "add",
            "hint": "From 5, hop forward 6 times!"
          },
          {
            "id": "nl-add-3",
            "prompt": "Start at 8 and add 5. Where does the frog land?",
            "min": 0,
            "max": 20,
            "startPosition": 8,
            "correctEndPosition": 13,
            "showJumpArcs": true,
            "operation": "add",
            "hint": "8 plus 5 — hop past 10!"
          },
          {
            "id": "nl-add-4",
            "prompt": "Start at 2 and add 7. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 2,
            "correctEndPosition": 9,
            "showJumpArcs": true,
            "operation": "add",
            "hint": "2 + 7 = ? Hop forward 7 times!"
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
-- LESSON 6: Number Line Hopping - Subtraction (number_line widget)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0006-4000-8000-000000000001',
  '10000002-0102-4000-8000-000000000001',
  35,
  'Frog Hops Backward!',
  'Help the frog hop backward on the number line to subtract!',
  'Ribbit ribbit! Now the frog needs to hop BACKWARD! When we subtract, we move to the left on the number line. If we start at 9 and subtract 3, the frog hops back 3 times and lands on 6!',
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
        "type": "number_line",
        "questions": [
          {
            "id": "nl-sub-1",
            "prompt": "Start at 8 and subtract 3. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 8,
            "correctEndPosition": 5,
            "showJumpArcs": true,
            "operation": "subtract",
            "hint": "Hop backward 3 times from 8!"
          },
          {
            "id": "nl-sub-2",
            "prompt": "Start at 12 and subtract 5. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 12,
            "correctEndPosition": 7,
            "showJumpArcs": true,
            "operation": "subtract",
            "hint": "From 12, hop backward 5 times!"
          },
          {
            "id": "nl-sub-3",
            "prompt": "Start at 10 and subtract 4. Where does the frog land?",
            "min": 0,
            "max": 15,
            "startPosition": 10,
            "correctEndPosition": 6,
            "showJumpArcs": true,
            "operation": "subtract",
            "hint": "10 minus 4 — hop backward from 10!"
          },
          {
            "id": "nl-sub-4",
            "prompt": "Start at 15 and subtract 7. Where does the frog land?",
            "min": 0,
            "max": 20,
            "startPosition": 15,
            "correctEndPosition": 8,
            "showJumpArcs": true,
            "operation": "subtract",
            "hint": "15 take away 7... hop back past 10!"
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
-- LESSON 7: Bead Counter! (rekenrek widget - show numbers)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0007-4000-8000-000000000001',
  '10000002-0101-4000-8000-000000000001',
  36,
  'Bead Counter!',
  'Use the counting rack to show numbers. Slide the red and white beads!',
  'Chip found a special counting tool called a rekenrek! It has two rows of beads — 5 red and 5 white in each row. The red beads help you see groups of 5 right away! Slide the beads to show each number.',
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
        "type": "rekenrek",
        "questions": [
          {
            "id": "rek-1",
            "prompt": "Show the number 4 on the rekenrek!",
            "targetNumber": 4,
            "mode": "show",
            "hint": "Slide 4 beads on the top row!"
          },
          {
            "id": "rek-2",
            "prompt": "Show the number 7 on the rekenrek!",
            "targetNumber": 7,
            "mode": "show",
            "hint": "Slide all 5 red beads, then 2 white beads on the top row!"
          },
          {
            "id": "rek-3",
            "prompt": "Show the number 10 on the rekenrek!",
            "targetNumber": 10,
            "mode": "show",
            "hint": "Slide all 10 beads on the top row!"
          },
          {
            "id": "rek-4",
            "prompt": "Show the number 13 on the rekenrek!",
            "targetNumber": 13,
            "mode": "show",
            "hint": "Slide all 10 on top, then 3 on the bottom!"
          },
          {
            "id": "rek-5",
            "prompt": "Show the number 16 on the rekenrek!",
            "targetNumber": 16,
            "mode": "show",
            "hint": "10 on top and 6 on the bottom!"
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
-- LESSON 8: Bead Addition! (rekenrek widget - add mode)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0008-4000-8000-000000000001',
  '10000002-0102-4000-8000-000000000001',
  37,
  'Bead Addition!',
  'Add numbers together using the counting rack. Show the answer with beads!',
  'Now let''s use the rekenrek to ADD numbers! Show the first number on the top row, then add more beads on the bottom row. Count all the beads together to find the answer!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['42fd1fb0-e7b2-46e9-8f2a-f560e4b1cbc4']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "rekenrek",
        "questions": [
          {
            "id": "rek-add-1",
            "prompt": "Show 3 + 4 on the rekenrek!",
            "targetNumber": 7,
            "mode": "add",
            "operands": { "a": 3, "b": 4 },
            "hint": "Put 3 on top and 4 on bottom. Count them all!"
          },
          {
            "id": "rek-add-2",
            "prompt": "Show 5 + 5 on the rekenrek!",
            "targetNumber": 10,
            "mode": "add",
            "operands": { "a": 5, "b": 5 },
            "hint": "5 on each row — that fills up to 10!"
          },
          {
            "id": "rek-add-3",
            "prompt": "Show 8 + 4 on the rekenrek!",
            "targetNumber": 12,
            "mode": "add",
            "operands": { "a": 8, "b": 4 },
            "hint": "8 on top, 4 on bottom. That is more than 10!"
          },
          {
            "id": "rek-add-4",
            "prompt": "Show 6 + 7 on the rekenrek!",
            "targetNumber": 13,
            "mode": "add",
            "operands": { "a": 6, "b": 7 },
            "hint": "6 on top, 7 on bottom. Count past 10!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
