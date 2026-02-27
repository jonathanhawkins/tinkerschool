-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Math Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Math "Number Adventures" module.
-- Aligned to Common Core K standards: K.CC, K.OA, K.G, K.MD
--
-- Widget types used: counting, multiple_choice, drag_to_sort, sequence_order,
--   flash_card, matching_pairs, parent_activity
--
-- Module ID: 00000001-0011-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000001
--
-- Lesson UUIDs: c1000001-0001 through c1000001-0005
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- MATH LESSON 1: Count to 20 with Chip!
-- Skills: Counting to 20, Counting Objects
-- Widgets: counting + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000001-0001-4000-8000-000000000001',
  '00000001-0011-4000-8000-000000000001',
  1,
  'Count to 20 with Chip!',
  'Count animals, fruit, and stars all the way to 20! Tap each one to count.',
  'Hey there, explorer! Chip is SO excited to count with you today! Did you know you can count all the way to 20? Let''s try! Tap each item to count it!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000100-0001-4000-8000-000000000001',
    '10000100-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "count-apples",
            "prompt": "How many apples do you see?",
            "emoji": "\ud83c\udf4e",
            "correctCount": 7,
            "displayCount": 7,
            "hint": "Tap each apple! Count: 1, 2, 3, 4, 5, 6, 7!"
          },
          {
            "id": "count-stars",
            "prompt": "How many stars are shining?",
            "emoji": "\u2b50",
            "correctCount": 12,
            "displayCount": 12,
            "hint": "Point to each star and count. Keep going past 10!"
          },
          {
            "id": "count-butterflies",
            "prompt": "How many butterflies are flying?",
            "emoji": "\ud83e\udd8b",
            "correctCount": 15,
            "displayCount": 15,
            "hint": "Wow, that''s a lot! Count each butterfly carefully!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Count things around you together! How many pillows on the couch? How many forks in the drawer? Try counting to 20 using small objects like beans, LEGO bricks, or cereal pieces.",
        "parentTip": "At this age, kids should be able to count to 20 reliably. If they skip numbers or double-count, have them touch each object as they count (one-to-one correspondence).",
        "completionPrompt": "Did you count 20 things together?",
        "illustration": "\ud83d\udd22"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 2: More, Less, or the Same?
-- Skills: Comparing Numbers
-- Widgets: multiple_choice + drag_to_sort
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000001-0002-4000-8000-000000000001',
  '00000001-0011-4000-8000-000000000001',
  2,
  'More, Less, or the Same?',
  'Compare groups of objects! Which group has more? Which has fewer?',
  'Chip has two boxes of crayons but they have different numbers inside! Can you figure out which box has MORE crayons and which has FEWER? Let''s compare!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000100-0005-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "compare-1",
            "prompt": "Which group has MORE?\n\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e  or  \ud83c\udf4a\ud83c\udf4a\ud83c\udf4a",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "5 Apples", "emoji": "\ud83c\udf4e"},
              {"id": "b", "text": "3 Oranges", "emoji": "\ud83c\udf4a"}
            ],
            "correctOptionId": "a",
            "hint": "Count each group! 5 is more than 3!"
          },
          {
            "id": "compare-2",
            "prompt": "Which group has FEWER?\n\ud83d\udc1f\ud83d\udc1f  or  \ud83d\udc20\ud83d\udc20\ud83d\udc20\ud83d\udc20\ud83d\udc20\ud83d\udc20",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "2 Fish", "emoji": "\ud83d\udc1f"},
              {"id": "b", "text": "6 Fish", "emoji": "\ud83d\udc20"}
            ],
            "correctOptionId": "a",
            "hint": "Fewer means less! 2 is fewer than 6."
          },
          {
            "id": "compare-3",
            "prompt": "Are these groups the SAME?\n\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f  and  \ud83d\udc9a\ud83d\udc9a\ud83d\udc9a\ud83d\udc9a",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Yes, the same!", "emoji": "\u2705"},
              {"id": "b", "text": "No, different!", "emoji": "\u274c"}
            ],
            "correctOptionId": "a",
            "hint": "Count both groups! 4 and 4 are the same number \u2014 equal!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "sort-more-less",
            "prompt": "Sort the numbers! Which are MORE than 5? Which are LESS than 5?",
            "buckets": [
              {"id": "more", "label": "More than 5", "emoji": "\ud83d\udc46"},
              {"id": "less", "label": "Less than 5", "emoji": "\ud83d\udc47"}
            ],
            "items": [
              {"id": "n8", "label": "8", "emoji": "8\ufe0f\u20e3", "correctBucket": "more"},
              {"id": "n2", "label": "2", "emoji": "2\ufe0f\u20e3", "correctBucket": "less"},
              {"id": "n9", "label": "9", "emoji": "9\ufe0f\u20e3", "correctBucket": "more"},
              {"id": "n3", "label": "3", "emoji": "3\ufe0f\u20e3", "correctBucket": "less"},
              {"id": "n7", "label": "7", "emoji": "7\ufe0f\u20e3", "correctBucket": "more"}
            ],
            "hint": "Count from 1. Is the number bigger or smaller than 5?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 3: Adding Friends Together
-- Skills: Addition within 5, Decomposing Numbers to 10
-- Widgets: counting + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000001-0003-4000-8000-000000000001',
  '00000001-0011-4000-8000-000000000001',
  3,
  'Adding Friends Together',
  'When groups come together, we can ADD them up! How many do we get?',
  'Look! Chip sees 2 puppies playing, and 1 more puppy comes to join! When friends come TOGETHER, we add them up! 2 plus 1 equals... let''s find out!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000100-0006-4000-8000-000000000001',
    '10000100-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "add-1",
            "prompt": "2 bunnies + 1 bunny = how many bunnies?\n\ud83d\udc30\ud83d\udc30 + \ud83d\udc30 = ?",
            "promptEmoji": "\ud83d\udc30",
            "options": [
              {"id": "a", "text": "2", "emoji": "2\ufe0f\u20e3"},
              {"id": "b", "text": "3", "emoji": "3\ufe0f\u20e3"},
              {"id": "c", "text": "4", "emoji": "4\ufe0f\u20e3"}
            ],
            "correctOptionId": "b",
            "hint": "Count them all together: 1, 2... and 3!"
          },
          {
            "id": "add-2",
            "prompt": "3 stars + 2 stars = how many stars?\n\u2b50\u2b50\u2b50 + \u2b50\u2b50 = ?",
            "promptEmoji": "\u2b50",
            "options": [
              {"id": "a", "text": "4", "emoji": "4\ufe0f\u20e3"},
              {"id": "b", "text": "5", "emoji": "5\ufe0f\u20e3"},
              {"id": "c", "text": "6", "emoji": "6\ufe0f\u20e3"}
            ],
            "correctOptionId": "b",
            "hint": "Start with 3 and count 2 more: 3... 4, 5!"
          },
          {
            "id": "add-3",
            "prompt": "1 cookie + 4 cookies = how many cookies?\n\ud83c\udf6a + \ud83c\udf6a\ud83c\udf6a\ud83c\udf6a\ud83c\udf6a = ?",
            "promptEmoji": "\ud83c\udf6a",
            "options": [
              {"id": "a", "text": "3", "emoji": "3\ufe0f\u20e3"},
              {"id": "b", "text": "4", "emoji": "4\ufe0f\u20e3"},
              {"id": "c", "text": "5", "emoji": "5\ufe0f\u20e3"}
            ],
            "correctOptionId": "c",
            "hint": "Count all the cookies: 1, 2, 3, 4, 5!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Use small objects (blocks, crackers, toys) to practice adding! Put 2 in one hand and 3 in the other. Ask: ''How many do we have when we put them together?'' Then push them together and count!",
        "parentTip": "Physical manipulation is key at this age. Let your child touch and move objects. Say ''2 plus 3 equals 5'' as they push groups together, building the connection between action and math language.",
        "completionPrompt": "Did you practice adding with real objects?",
        "illustration": "\u2795"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 4: Shapes All Around
-- Skills: Naming 2D Shapes
-- Widgets: tap_and_reveal + multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000001-0004-4000-8000-000000000001',
  '00000001-0011-4000-8000-000000000001',
  4,
  'Shapes All Around',
  'Circles, triangles, rectangles, squares, and hexagons! Find shapes everywhere!',
  'Chip loves shapes! Did you know that shapes are EVERYWHERE? A clock is a circle, a door is a rectangle, and a stop sign is... something special! Let''s learn all about shapes!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000100-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Meet the shapes! Tap to flip each card and learn the shape name.",
        "cards": [
          {
            "id": "shape-circle",
            "front": {"text": "What shape is this?", "emoji": "\ud83d\udfe2"},
            "back": {"text": "Circle!\n0 corners, round", "emoji": "\ud83d\udfe2"},
            "color": "#22C55E"
          },
          {
            "id": "shape-triangle",
            "front": {"text": "What shape is this?", "emoji": "\ud83d\udd3a"},
            "back": {"text": "Triangle!\n3 sides, 3 corners", "emoji": "\ud83d\udd3a"},
            "color": "#EF4444"
          },
          {
            "id": "shape-square",
            "front": {"text": "What shape is this?", "emoji": "\ud83d\udfe7"},
            "back": {"text": "Square!\n4 equal sides", "emoji": "\ud83d\udfe7"},
            "color": "#F97316"
          },
          {
            "id": "shape-rectangle",
            "front": {"text": "What shape is this?", "emoji": "\ud83d\udfe6"},
            "back": {"text": "Rectangle!\n4 sides, 2 long + 2 short", "emoji": "\ud83d\udfe6"},
            "color": "#3B82F6"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "shape-mc-1",
            "prompt": "Which shape has 3 sides?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Circle", "emoji": "\ud83d\udfe2"},
              {"id": "b", "text": "Triangle", "emoji": "\ud83d\udd3a"},
              {"id": "c", "text": "Square", "emoji": "\ud83d\udfe7"}
            ],
            "correctOptionId": "b",
            "hint": "Count the sides: 1, 2, 3! That''s a triangle!"
          },
          {
            "id": "shape-mc-2",
            "prompt": "A wheel is shaped like a...",
            "promptEmoji": "\ud83d\udede",
            "options": [
              {"id": "a", "text": "Square", "emoji": "\ud83d\udfe7"},
              {"id": "b", "text": "Triangle", "emoji": "\ud83d\udd3a"},
              {"id": "c", "text": "Circle", "emoji": "\ud83d\udfe2"}
            ],
            "correctOptionId": "c",
            "hint": "Wheels are round! What shape is round?"
          },
          {
            "id": "shape-mc-3",
            "prompt": "How many sides does a rectangle have?",
            "promptEmoji": "\ud83d\udfe6",
            "options": [
              {"id": "a", "text": "3", "emoji": "3\ufe0f\u20e3"},
              {"id": "b", "text": "4", "emoji": "4\ufe0f\u20e3"},
              {"id": "c", "text": "5", "emoji": "5\ufe0f\u20e3"}
            ],
            "correctOptionId": "b",
            "hint": "Count the sides of the rectangle: top, right, bottom, left!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 5: Take Away Time
-- Skills: Subtraction within 5, Writing Numbers
-- Widgets: multiple_choice + counting + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000001-0005-4000-8000-000000000001',
  '00000001-0011-4000-8000-000000000001',
  5,
  'Take Away Time',
  'When things go away, we subtract! How many are left?',
  'Oh no! Chip had 5 balloons, but 2 floated away into the sky! How many balloons does Chip have LEFT? When things go away, we SUBTRACT \u2014 we take away!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000100-0007-4000-8000-000000000001',
    '10000100-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sub-1",
            "prompt": "5 balloons - 2 fly away = how many left?\n\ud83c\udf88\ud83c\udf88\ud83c\udf88\ud83c\udf88\ud83c\udf88 take away 2...",
            "promptEmoji": "\ud83c\udf88",
            "options": [
              {"id": "a", "text": "2", "emoji": "2\ufe0f\u20e3"},
              {"id": "b", "text": "3", "emoji": "3\ufe0f\u20e3"},
              {"id": "c", "text": "4", "emoji": "4\ufe0f\u20e3"}
            ],
            "correctOptionId": "b",
            "hint": "Start with 5 fingers up. Put 2 down. How many are still up?"
          },
          {
            "id": "sub-2",
            "prompt": "4 cookies - 1 eaten = how many left?\n\ud83c\udf6a\ud83c\udf6a\ud83c\udf6a\ud83c\udf6a take away 1...",
            "promptEmoji": "\ud83c\udf6a",
            "options": [
              {"id": "a", "text": "2", "emoji": "2\ufe0f\u20e3"},
              {"id": "b", "text": "3", "emoji": "3\ufe0f\u20e3"},
              {"id": "c", "text": "5", "emoji": "5\ufe0f\u20e3"}
            ],
            "correctOptionId": "b",
            "hint": "You had 4 cookies. You ate 1. Count what''s left!"
          },
          {
            "id": "sub-3",
            "prompt": "3 birds - 2 fly away = how many left?\n\ud83d\udc26\ud83d\udc26\ud83d\udc26 take away 2...",
            "promptEmoji": "\ud83d\udc26",
            "options": [
              {"id": "a", "text": "1", "emoji": "1\ufe0f\u20e3"},
              {"id": "b", "text": "2", "emoji": "2\ufe0f\u20e3"},
              {"id": "c", "text": "3", "emoji": "3\ufe0f\u20e3"}
            ],
            "correctOptionId": "a",
            "hint": "Hold up 3 fingers. Put 2 down. How many are left?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Use snacks or toys to practice subtraction! Start with 5 crackers. Ask your child: ''If you eat 2, how many are left?'' Let them physically remove objects and count what remains.",
        "parentTip": "Use the word ''take away'' alongside ''minus'' and ''subtract.'' Physical removal of objects helps kids internalize the concept. Try: ''5 take away 2 is 3'' while moving objects.",
        "completionPrompt": "Did you practice taking away with real objects?",
        "illustration": "\u2796"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
