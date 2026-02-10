-- =============================================================================
-- TinkerSchool -- Seed 1st Grade Problem Solving & Coding Interactive Lessons
-- =============================================================================
-- 22 browser-only interactive lessons for 1st grade (Band 1, ages 5-6):
--   - 12 Problem Solving lessons (Patterns & Sorting, Sequencing & Logic)
--   - 10 Coding lessons (What is Code?, Sequences & Loops)
--
-- Widget types used: multiple_choice, matching_pairs, sequence_order,
--   flash_card, fill_in_blank
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--
-- Subject IDs:
--   Problem Solving: f4c1f559-85c6-412e-a788-d6efc8bf4c9d
--   Coding:          99c7ad43-0481-46b3-ace1-b88f90e6e070
--
-- Problem Solving Module IDs:
--   Patterns & Sorting:  10000001-0601-4000-8000-000000000001
--   Sequencing & Logic:  10000001-0602-4000-8000-000000000001
--
-- Coding Module IDs:
--   What is Code?:       10000001-0701-4000-8000-000000000001
--   Sequences & Loops:   10000001-0702-4000-8000-000000000001
--
-- Problem Solving Lesson IDs: b1000006-0001 through b1000006-000c
-- Coding Lesson IDs:          b1000007-0001 through b1000007-000a
--
-- Problem Solving Skill IDs:
--   Spot the pattern:         df9086dd-c246-4a3a-bb87-c4ffc75cfc14
--   Sequencing events:        2ccf118f-816b-4fd7-ad7d-802865d65139
--   Sorting & grouping:       ed58a42f-0c23-4cfe-87c9-4b444cee2888
--   Cause & effect:           0480a5f2-a0bd-422e-84bb-7c115f763106
--   Break it down:            c376f0f0-aab7-4c6d-9e8e-5b6e498b488d
--   Mazes & spatial:          a55495b3-1fab-431a-a59b-1dd7ad5948f3
--   Step-by-step:             7b5b8b7e-8578-4acc-ade1-889a48016454
--   Odd one out (logic):      5f8391a5-f5e3-4b2e-8327-656d05a054ad
--
-- Coding Skill IDs:
--   What is a computer?:      961b5403-2dfa-479f-93f4-616cb06ae931
--   Instructions & sequence:  a6ed8446-632c-4622-aaa8-752b6a641a11
--   Loops & patterns:         c8a3ee1e-b955-407b-ba0b-b2c31f8385a0
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Modules
-- =========================================================================

-- Problem Solving modules
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0601-4000-8000-000000000001', 1, 1, 'Patterns & Sorting',  'Discover patterns, sort by color and shape, and find what doesn''t belong!', 'puzzle', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d'),
  ('10000001-0602-4000-8000-000000000001', 1, 2, 'Sequencing & Logic',  'Put things in order, figure out what happens next, and solve simple puzzles!', 'puzzle', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d')
ON CONFLICT (id) DO NOTHING;

-- Coding modules
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0701-4000-8000-000000000001', 1, 1, 'What is Code?',      'Learn what computers are, how to give instructions, and how to find bugs!', 'code', '99c7ad43-0481-46b3-ace1-b88f90e6e070'),
  ('10000001-0702-4000-8000-000000000001', 1, 2, 'Sequences & Loops',  'Master step-by-step instructions and discover the power of repeating patterns!', 'code', '99c7ad43-0481-46b3-ace1-b88f90e6e070')
ON CONFLICT (id) DO NOTHING;


-- *************************************************************************
--
--  PART A: PROBLEM SOLVING LESSONS (12 lessons)
--
-- *************************************************************************


-- =========================================================================
-- PS LESSON 1: What Comes Next? (AB Patterns)
-- Module: Patterns & Sorting
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0001-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  1,
  'What Comes Next?',
  'Find the pattern and figure out what comes next! AB patterns are everywhere.',
  'Hey there, pattern detective! Chip here! Did you know patterns are EVERYWHERE? On your shirt, on a fence, even in music! A pattern is something that repeats over and over. Let''s see if you can spot what comes next!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['df9086dd-c246-4a3a-bb87-c4ffc75cfc14']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps1-mc1",
            "prompt": "Red, Blue, Red, Blue, Red, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Red" },
              { "id": "b", "text": "Blue" },
              { "id": "c", "text": "Green" },
              { "id": "d", "text": "Yellow" }
            ],
            "correctOptionId": "b",
            "hint": "Look at the pattern: Red, Blue keeps repeating. After Red comes..."
          },
          {
            "id": "ps1-mc2",
            "prompt": "Star, Heart, Star, Heart, Star, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Star" },
              { "id": "b", "text": "Circle" },
              { "id": "c", "text": "Heart" },
              { "id": "d", "text": "Square" }
            ],
            "correctOptionId": "c",
            "hint": "Star, Heart is the pattern. After Star comes..."
          },
          {
            "id": "ps1-mc3",
            "prompt": "Clap, Stomp, Clap, Stomp, Clap, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Clap" },
              { "id": "b", "text": "Jump" },
              { "id": "c", "text": "Stomp" },
              { "id": "d", "text": "Spin" }
            ],
            "correctOptionId": "c",
            "hint": "Clap, Stomp keeps repeating. After Clap comes..."
          },
          {
            "id": "ps1-mc4",
            "prompt": "Big, Small, Big, Small, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Small" },
              { "id": "b", "text": "Big" },
              { "id": "c", "text": "Medium" },
              { "id": "d", "text": "Tiny" }
            ],
            "correctOptionId": "b",
            "hint": "Big, Small repeats. After Small comes..."
          },
          {
            "id": "ps1-mc5",
            "prompt": "Happy, Sad, Happy, Sad, Happy, Sad, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Sad" },
              { "id": "b", "text": "Angry" },
              { "id": "c", "text": "Happy" },
              { "id": "d", "text": "Silly" }
            ],
            "correctOptionId": "c",
            "hint": "Happy, Sad keeps going. After Sad comes..."
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
-- PS LESSON 2: Color Patterns
-- Module: Patterns & Sorting
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0002-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  2,
  'Color Patterns',
  'Complete the color pattern! Fill in the missing color to keep the pattern going.',
  'Wow, you did great with patterns! Now Chip has a trickier challenge. Some colors are MISSING from the pattern! Can you figure out which color goes in the blank spot? Think about what repeats!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['df9086dd-c246-4a3a-bb87-c4ffc75cfc14']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "ps2-fb1",
            "sentence": "Red, Yellow, Red, Yellow, Red, ___",
            "correctAnswer": "Yellow",
            "acceptableAnswers": ["yellow", "YELLOW"],
            "hint": "Red and Yellow take turns. After Red comes..."
          },
          {
            "id": "ps2-fb2",
            "sentence": "Blue, Blue, Green, Blue, Blue, ___",
            "correctAnswer": "Green",
            "acceptableAnswers": ["green", "GREEN"],
            "hint": "Two Blues, then one Green. Two Blues, then..."
          },
          {
            "id": "ps2-fb3",
            "sentence": "Pink, Orange, Pink, Orange, ___, Orange",
            "correctAnswer": "Pink",
            "acceptableAnswers": ["pink", "PINK"],
            "hint": "Pink and Orange take turns. What goes before Orange?"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps2-mc1",
            "prompt": "Which color pattern is an AB pattern? (A then B, over and over)",
            "options": [
              { "id": "a", "text": "Red, Red, Red, Red" },
              { "id": "b", "text": "Red, Blue, Red, Blue" },
              { "id": "c", "text": "Red, Blue, Green, Red" },
              { "id": "d", "text": "Blue, Blue, Red, Red" }
            ],
            "correctOptionId": "b",
            "hint": "An AB pattern has two things that take turns: A, B, A, B..."
          },
          {
            "id": "ps2-mc2",
            "prompt": "Purple, White, Purple, White, Purple, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Purple" },
              { "id": "b", "text": "White" },
              { "id": "c", "text": "Black" },
              { "id": "d", "text": "Green" }
            ],
            "correctOptionId": "b",
            "hint": "Purple and White take turns. After Purple comes..."
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
-- PS LESSON 3: Shape Patterns
-- Module: Patterns & Sorting
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0003-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  3,
  'Shape Patterns',
  'Shapes make patterns too! Put the shapes in the right order to finish the pattern.',
  'Chip loves shapes! Circles, squares, triangles -- they can all make patterns! Sometimes shapes take turns just like colors do. Can you put these shapes in the right order to finish the pattern?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['df9086dd-c246-4a3a-bb87-c4ffc75cfc14']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ps3-sq1",
            "prompt": "Put these in pattern order: Circle, Square, Circle, Square, Circle, Square",
            "items": [
              { "id": "s1", "text": "Circle" },
              { "id": "s2", "text": "Square" },
              { "id": "s3", "text": "Circle" },
              { "id": "s4", "text": "Square" },
              { "id": "s5", "text": "Circle" },
              { "id": "s6", "text": "Square" }
            ]
          },
          {
            "id": "ps3-sq2",
            "prompt": "Put these in pattern order: Triangle, Triangle, Star, Triangle, Triangle, Star",
            "items": [
              { "id": "s1", "text": "Triangle" },
              { "id": "s2", "text": "Triangle" },
              { "id": "s3", "text": "Star" },
              { "id": "s4", "text": "Triangle" },
              { "id": "s5", "text": "Triangle" },
              { "id": "s6", "text": "Star" }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps3-mc1",
            "prompt": "Circle, Triangle, Circle, Triangle, Circle, ___. What shape comes next?",
            "options": [
              { "id": "a", "text": "Circle" },
              { "id": "b", "text": "Square" },
              { "id": "c", "text": "Triangle" },
              { "id": "d", "text": "Star" }
            ],
            "correctOptionId": "c",
            "hint": "Circle and Triangle take turns. After Circle comes..."
          },
          {
            "id": "ps3-mc2",
            "prompt": "Square, Square, Heart, Square, Square, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Square" },
              { "id": "b", "text": "Heart" },
              { "id": "c", "text": "Circle" },
              { "id": "d", "text": "Triangle" }
            ],
            "correctOptionId": "b",
            "hint": "Two Squares then a Heart. Two Squares then..."
          },
          {
            "id": "ps3-mc3",
            "prompt": "Diamond, Star, Diamond, Star, Diamond, ___. What comes next?",
            "options": [
              { "id": "a", "text": "Diamond" },
              { "id": "b", "text": "Circle" },
              { "id": "c", "text": "Star" },
              { "id": "d", "text": "Heart" }
            ],
            "correctOptionId": "c",
            "hint": "Diamond and Star take turns!"
          },
          {
            "id": "ps3-mc4",
            "prompt": "How many sides does a triangle have?",
            "options": [
              { "id": "a", "text": "2" },
              { "id": "b", "text": "3" },
              { "id": "c", "text": "4" },
              { "id": "d", "text": "5" }
            ],
            "correctOptionId": "b",
            "hint": "Tri means three! A TRIangle has three sides."
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
-- PS LESSON 4: Sort by Color
-- Module: Patterns & Sorting
-- Widgets: matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0004-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  4,
  'Sort by Color',
  'Group the objects by their color! Match each item to the right color group.',
  'Time to sort! Chip''s toy box is a big mess. Can you help sort the toys by COLOR? All the red things go together, all the blue things go together. Let''s clean up and sort!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['ed58a42f-0c23-4cfe-87c9-4b444cee2888']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each item to its color group!",
        "pairs": [
          { "id": "sc1", "left": {"id": "sc1-l", "text": "Apple"}, "right": {"id": "sc1-r", "text": "Red Group"} },
          { "id": "sc2", "left": {"id": "sc2-l", "text": "Fire Truck"}, "right": {"id": "sc2-r", "text": "Red Group"} },
          { "id": "sc3", "left": {"id": "sc3-l", "text": "Sky"}, "right": {"id": "sc3-r", "text": "Blue Group"} },
          { "id": "sc4", "left": {"id": "sc4-l", "text": "Ocean"}, "right": {"id": "sc4-r", "text": "Blue Group"} },
          { "id": "sc5", "left": {"id": "sc5-l", "text": "Banana"}, "right": {"id": "sc5-r", "text": "Yellow Group"} },
          { "id": "sc6", "left": {"id": "sc6-l", "text": "Sun"}, "right": {"id": "sc6-r", "text": "Yellow Group"} }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps4-mc1",
            "prompt": "Which of these is NOT red?",
            "options": [
              { "id": "a", "text": "Strawberry" },
              { "id": "b", "text": "Cherry" },
              { "id": "c", "text": "Blueberry" },
              { "id": "d", "text": "Tomato" }
            ],
            "correctOptionId": "c",
            "hint": "Three of these are red fruits. One is a different color!"
          },
          {
            "id": "ps4-mc2",
            "prompt": "If you sort by color, which two go together?",
            "options": [
              { "id": "a", "text": "Grass and Frog" },
              { "id": "b", "text": "Grass and Sun" },
              { "id": "c", "text": "Frog and Fire" },
              { "id": "d", "text": "Sun and Sky" }
            ],
            "correctOptionId": "a",
            "hint": "Grass and frogs are both the same color. What color is that?"
          },
          {
            "id": "ps4-mc3",
            "prompt": "How many color groups would you need for: Apple, Banana, Grape, Orange?",
            "options": [
              { "id": "a", "text": "2" },
              { "id": "b", "text": "3" },
              { "id": "c", "text": "4" },
              { "id": "d", "text": "1" }
            ],
            "correctOptionId": "c",
            "hint": "Each fruit is a different color: red, yellow, purple, orange."
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
-- PS LESSON 5: Sort by Shape
-- Module: Patterns & Sorting
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0005-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  5,
  'Sort by Shape',
  'Sort everyday objects by their shape! Match each object to the shape it looks like.',
  'Great job sorting by color! Now let''s sort by SHAPE! Look around you -- everything has a shape. A door is a rectangle, a clock is a circle, a pizza slice is a triangle! Let''s match things to their shapes!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['ed58a42f-0c23-4cfe-87c9-4b444cee2888']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each object to the shape it looks like!",
        "pairs": [
          { "id": "ss1", "left": {"id": "ss1-l", "text": "Clock"}, "right": {"id": "ss1-r", "text": "Circle"} },
          { "id": "ss2", "left": {"id": "ss2-l", "text": "Ball"}, "right": {"id": "ss2-r", "text": "Circle"} },
          { "id": "ss3", "left": {"id": "ss3-l", "text": "Door"}, "right": {"id": "ss3-r", "text": "Rectangle"} },
          { "id": "ss4", "left": {"id": "ss4-l", "text": "Book"}, "right": {"id": "ss4-r", "text": "Rectangle"} },
          { "id": "ss5", "left": {"id": "ss5-l", "text": "Pizza Slice"}, "right": {"id": "ss5-r", "text": "Triangle"} },
          { "id": "ss6", "left": {"id": "ss6-l", "text": "Roof"}, "right": {"id": "ss6-r", "text": "Triangle"} }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps5-mc1",
            "prompt": "A wheel is shaped like a ___.",
            "options": [
              { "id": "a", "text": "Square" },
              { "id": "b", "text": "Triangle" },
              { "id": "c", "text": "Circle" },
              { "id": "d", "text": "Star" }
            ],
            "correctOptionId": "c",
            "hint": "Wheels are round! What shape is round?"
          },
          {
            "id": "ps5-mc2",
            "prompt": "A window is usually shaped like a ___.",
            "options": [
              { "id": "a", "text": "Circle" },
              { "id": "b", "text": "Square" },
              { "id": "c", "text": "Triangle" },
              { "id": "d", "text": "Star" }
            ],
            "correctOptionId": "b",
            "hint": "Windows have four equal sides and four corners!"
          },
          {
            "id": "ps5-mc3",
            "prompt": "How is sorting by shape different from sorting by color?",
            "options": [
              { "id": "a", "text": "You look at how something looks around the edges" },
              { "id": "b", "text": "You look at how big something is" },
              { "id": "c", "text": "You look at how heavy something is" },
              { "id": "d", "text": "You look at how it smells" }
            ],
            "correctOptionId": "a",
            "hint": "Shape is about the outline -- the edges and corners of something."
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
-- PS LESSON 6: Odd One Out
-- Module: Patterns & Sorting
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0006-4000-8000-000000000001',
  '10000001-0601-4000-8000-000000000001',
  6,
  'Odd One Out',
  'One of these things is not like the others! Can you find which one doesn''t belong?',
  'Chip loves this game! Look at a group of things and find the one that doesn''t belong. Maybe three are animals and one is a plant. Maybe three are big and one is small. Be a detective and find the odd one out!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['5f8391a5-f5e3-4b2e-8327-656d05a054ad']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps6-mc1",
            "prompt": "Which one does NOT belong? Dog, Cat, Fish, Apple",
            "options": [
              { "id": "a", "text": "Dog" },
              { "id": "b", "text": "Cat" },
              { "id": "c", "text": "Fish" },
              { "id": "d", "text": "Apple" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these are animals. One is something you eat!"
          },
          {
            "id": "ps6-mc2",
            "prompt": "Which one does NOT belong? Red, Blue, Green, Banana",
            "options": [
              { "id": "a", "text": "Red" },
              { "id": "b", "text": "Blue" },
              { "id": "c", "text": "Green" },
              { "id": "d", "text": "Banana" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these are colors. One is a fruit!"
          },
          {
            "id": "ps6-mc3",
            "prompt": "Which one does NOT belong? Shirt, Pants, Hat, Pencil",
            "options": [
              { "id": "a", "text": "Shirt" },
              { "id": "b", "text": "Pants" },
              { "id": "c", "text": "Hat" },
              { "id": "d", "text": "Pencil" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these are things you wear. One is something you write with!"
          },
          {
            "id": "ps6-mc4",
            "prompt": "Which one does NOT belong? Car, Bus, Bike, Tree",
            "options": [
              { "id": "a", "text": "Car" },
              { "id": "b", "text": "Bus" },
              { "id": "c", "text": "Bike" },
              { "id": "d", "text": "Tree" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these can take you places. One stays in the ground!"
          },
          {
            "id": "ps6-mc5",
            "prompt": "Which one does NOT belong? Circle, Square, Triangle, Purple",
            "options": [
              { "id": "a", "text": "Circle" },
              { "id": "b", "text": "Square" },
              { "id": "c", "text": "Triangle" },
              { "id": "d", "text": "Purple" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these are shapes. One is a color!"
          },
          {
            "id": "ps6-mc6",
            "prompt": "Which one does NOT belong? Fork, Spoon, Knife, Shoe",
            "options": [
              { "id": "a", "text": "Fork" },
              { "id": "b", "text": "Spoon" },
              { "id": "c", "text": "Knife" },
              { "id": "d", "text": "Shoe" }
            ],
            "correctOptionId": "d",
            "hint": "Three of these help you eat. One goes on your foot!"
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
-- PS LESSON 7: First, Next, Last
-- Module: Sequencing & Logic
-- Widgets: sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0007-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  1,
  'First, Next, Last',
  'Put the steps of everyday activities in the right order! What comes first, next, and last?',
  'Every day you do things in a certain order! You don''t put on your shoes before your socks, right? Let''s practice putting steps in the right order. First, Next, Last -- you''ve got this!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['2ccf118f-816b-4fd7-ad7d-802865d65139']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ps7-sq1",
            "prompt": "Put these steps for waking up in order!",
            "items": [
              { "id": "s1", "text": "Wake up in bed" },
              { "id": "s2", "text": "Get out of bed" },
              { "id": "s3", "text": "Put on clothes" },
              { "id": "s4", "text": "Eat breakfast" }
            ]
          },
          {
            "id": "ps7-sq2",
            "prompt": "Put these steps for making a sandwich in order!",
            "items": [
              { "id": "s1", "text": "Get two slices of bread" },
              { "id": "s2", "text": "Spread peanut butter" },
              { "id": "s3", "text": "Put the slices together" },
              { "id": "s4", "text": "Eat the sandwich" }
            ]
          },
          {
            "id": "ps7-sq3",
            "prompt": "Put these steps for washing your hands in order!",
            "items": [
              { "id": "s1", "text": "Turn on the water" },
              { "id": "s2", "text": "Put soap on your hands" },
              { "id": "s3", "text": "Rub your hands together" },
              { "id": "s4", "text": "Rinse and dry your hands" }
            ]
          },
          {
            "id": "ps7-sq4",
            "prompt": "Put these steps for planting a seed in order!",
            "items": [
              { "id": "s1", "text": "Dig a hole in the dirt" },
              { "id": "s2", "text": "Put the seed in the hole" },
              { "id": "s3", "text": "Cover it with dirt" },
              { "id": "s4", "text": "Water the seed" }
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
-- PS LESSON 8: Story Order
-- Module: Sequencing & Logic
-- Widgets: sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0008-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  2,
  'Story Order',
  'Every story has a beginning, middle, and end. Put the story parts in the right order!',
  'Chip loves stories! But oh no -- these stories got all mixed up! The beginning, middle, and end are out of order. Can you be a story detective and put them back together?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['2ccf118f-816b-4fd7-ad7d-802865d65139']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ps8-sq1",
            "prompt": "Put this story about a puppy in order!",
            "items": [
              { "id": "s1", "text": "A puppy was lost in the park." },
              { "id": "s2", "text": "A kind girl found the puppy." },
              { "id": "s3", "text": "She took the puppy home." },
              { "id": "s4", "text": "The puppy was happy in its new home!" }
            ]
          },
          {
            "id": "ps8-sq2",
            "prompt": "Put this story about a rainy day in order!",
            "items": [
              { "id": "s1", "text": "Dark clouds came into the sky." },
              { "id": "s2", "text": "Rain started falling down." },
              { "id": "s3", "text": "The kids opened their umbrellas." },
              { "id": "s4", "text": "The sun came back out and a rainbow appeared!" }
            ]
          },
          {
            "id": "ps8-sq3",
            "prompt": "Put this story about baking cookies in order!",
            "items": [
              { "id": "s1", "text": "Mix the flour, sugar, and butter." },
              { "id": "s2", "text": "Roll the dough into little balls." },
              { "id": "s3", "text": "Put them in the oven to bake." },
              { "id": "s4", "text": "Take them out and let them cool. Yum!" }
            ]
          },
          {
            "id": "ps8-sq4",
            "prompt": "Put this story about building a tower in order!",
            "items": [
              { "id": "s1", "text": "Pick up the first block." },
              { "id": "s2", "text": "Stack more blocks on top." },
              { "id": "s3", "text": "The tower gets really tall!" },
              { "id": "s4", "text": "Oh no! The tower falls down! Try again!" }
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
-- PS LESSON 9: What Happens Next? (Cause & Effect)
-- Module: Sequencing & Logic
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-0009-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  3,
  'What Happens Next?',
  'When something happens, something else happens because of it! Figure out what happens next.',
  'Here''s a fun question: What happens if you drop an ice cream cone? It falls on the ground! That''s called cause and effect. One thing CAUSES another thing to happen. Let''s figure out what happens next!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['0480a5f2-a0bd-422e-84bb-7c115f763106']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps9-mc1",
            "prompt": "You leave your toy in the rain. What happens to it?",
            "options": [
              { "id": "a", "text": "It gets wet" },
              { "id": "b", "text": "It flies away" },
              { "id": "c", "text": "It gets bigger" },
              { "id": "d", "text": "It turns invisible" }
            ],
            "correctOptionId": "a",
            "hint": "Rain is water. When water falls on things, they get..."
          },
          {
            "id": "ps9-mc2",
            "prompt": "You water a plant every day. What happens?",
            "options": [
              { "id": "a", "text": "The plant shrinks" },
              { "id": "b", "text": "The plant grows" },
              { "id": "c", "text": "The plant flies" },
              { "id": "d", "text": "The plant sings" }
            ],
            "correctOptionId": "b",
            "hint": "Plants need water to live and get bigger!"
          },
          {
            "id": "ps9-mc3",
            "prompt": "You push a ball. What happens?",
            "options": [
              { "id": "a", "text": "The ball stays still" },
              { "id": "b", "text": "The ball disappears" },
              { "id": "c", "text": "The ball rolls" },
              { "id": "d", "text": "The ball talks" }
            ],
            "correctOptionId": "c",
            "hint": "When you push something round, it moves by..."
          },
          {
            "id": "ps9-mc4",
            "prompt": "You blow out the candles on a cake. What happens?",
            "options": [
              { "id": "a", "text": "The candles get bigger" },
              { "id": "b", "text": "The flames go out" },
              { "id": "c", "text": "The cake melts" },
              { "id": "d", "text": "More candles appear" }
            ],
            "correctOptionId": "b",
            "hint": "When you blow on a flame, the wind makes it..."
          },
          {
            "id": "ps9-mc5",
            "prompt": "You don''t eat lunch. What happens later?",
            "options": [
              { "id": "a", "text": "You feel full" },
              { "id": "b", "text": "You feel sleepy" },
              { "id": "c", "text": "You feel hungry" },
              { "id": "d", "text": "You feel cold" }
            ],
            "correctOptionId": "c",
            "hint": "When you skip a meal, your tummy tells you it needs food!"
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
-- PS LESSON 10: Following Steps
-- Module: Sequencing & Logic
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-000a-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  4,
  'Following Steps',
  'Follow simple instructions step by step! Can you put the directions in order?',
  'Chip is learning to follow directions! When someone tells you to do something, the ORDER matters. You can''t frost a cake before you bake it! Help Chip put these instructions in the right order.',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY[
    '7b5b8b7e-8578-4acc-ade1-889a48016454',
    'c376f0f0-aab7-4c6d-9e8e-5b6e498b488d'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ps10-sq1",
            "prompt": "Put the steps for brushing your teeth in order!",
            "items": [
              { "id": "s1", "text": "Pick up your toothbrush" },
              { "id": "s2", "text": "Put toothpaste on the brush" },
              { "id": "s3", "text": "Brush all your teeth" },
              { "id": "s4", "text": "Spit and rinse your mouth" }
            ]
          },
          {
            "id": "ps10-sq2",
            "prompt": "Put the steps for drawing a house in order!",
            "items": [
              { "id": "s1", "text": "Draw a big square for the walls" },
              { "id": "s2", "text": "Draw a triangle on top for the roof" },
              { "id": "s3", "text": "Draw a door and windows" },
              { "id": "s4", "text": "Color in your house" }
            ]
          },
          {
            "id": "ps10-sq3",
            "prompt": "Put the steps for getting ready for bed in order!",
            "items": [
              { "id": "s1", "text": "Put on your pajamas" },
              { "id": "s2", "text": "Brush your teeth" },
              { "id": "s3", "text": "Read a bedtime story" },
              { "id": "s4", "text": "Turn off the light and sleep" }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps10-mc1",
            "prompt": "Why is it important to follow steps in order?",
            "options": [
              { "id": "a", "text": "It makes things work the right way" },
              { "id": "b", "text": "It doesn''t matter at all" },
              { "id": "c", "text": "To make things harder" },
              { "id": "d", "text": "To go slower" }
            ],
            "correctOptionId": "a",
            "hint": "If you put on shoes before socks, it wouldn''t work! Order matters."
          },
          {
            "id": "ps10-mc2",
            "prompt": "What would happen if you tried to eat cereal BEFORE pouring it in the bowl?",
            "options": [
              { "id": "a", "text": "You would eat it perfectly" },
              { "id": "b", "text": "There would be nothing in the bowl to eat" },
              { "id": "c", "text": "The cereal would pour itself" },
              { "id": "d", "text": "The bowl would fill up on its own" }
            ],
            "correctOptionId": "b",
            "hint": "You need to pour cereal first, THEN you can eat it!"
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
-- PS LESSON 11: Same and Different
-- Module: Sequencing & Logic
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-000b-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  5,
  'Same and Different',
  'Compare things and find what is the same and what is different!',
  'Time to be a super detective! Chip wants to know: how are things the SAME and how are they DIFFERENT? A cat and a dog are both animals (same!) but one barks and one meows (different!). Let''s compare!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY[
    '5f8391a5-f5e3-4b2e-8327-656d05a054ad',
    'ed58a42f-0c23-4cfe-87c9-4b444cee2888'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps11-mc1",
            "prompt": "How are a cat and a dog the SAME?",
            "options": [
              { "id": "a", "text": "They both bark" },
              { "id": "b", "text": "They are both pets" },
              { "id": "c", "text": "They both have wings" },
              { "id": "d", "text": "They both live in water" }
            ],
            "correctOptionId": "b",
            "hint": "Cats and dogs both live in houses with people. They are both..."
          },
          {
            "id": "ps11-mc2",
            "prompt": "How are a bicycle and a car DIFFERENT?",
            "options": [
              { "id": "a", "text": "They both have wheels" },
              { "id": "b", "text": "They both help you travel" },
              { "id": "c", "text": "A bicycle has 2 wheels, a car has 4 wheels" },
              { "id": "d", "text": "They are both red" }
            ],
            "correctOptionId": "c",
            "hint": "Count the wheels! A bike has fewer wheels than a car."
          },
          {
            "id": "ps11-mc3",
            "prompt": "An apple and a basketball are both ___.",
            "options": [
              { "id": "a", "text": "Red" },
              { "id": "b", "text": "Round" },
              { "id": "c", "text": "Yummy to eat" },
              { "id": "d", "text": "Soft" }
            ],
            "correctOptionId": "b",
            "hint": "Think about their shape! Both an apple and a basketball are..."
          },
          {
            "id": "ps11-mc4",
            "prompt": "How are a fish and a bird DIFFERENT?",
            "options": [
              { "id": "a", "text": "They are both animals" },
              { "id": "b", "text": "They both eat food" },
              { "id": "c", "text": "A fish swims, a bird flies" },
              { "id": "d", "text": "They both have eyes" }
            ],
            "correctOptionId": "c",
            "hint": "Think about how they move. Fish live in water, birds live in the..."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each pair that is the SAME in some way!",
        "pairs": [
          { "id": "mp1", "left": {"id": "mp1-l", "text": "Apple & Banana"}, "right": {"id": "mp1-r", "text": "Both are Fruit"} },
          { "id": "mp2", "left": {"id": "mp2-l", "text": "Dog & Cat"}, "right": {"id": "mp2-r", "text": "Both are Pets"} },
          { "id": "mp3", "left": {"id": "mp3-l", "text": "Shirt & Pants"}, "right": {"id": "mp3-r", "text": "Both are Clothes"} },
          { "id": "mp4", "left": {"id": "mp4-l", "text": "Car & Bus"}, "right": {"id": "mp4-r", "text": "Both have Wheels"} }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- PS LESSON 12: Simple Puzzles
-- Module: Sequencing & Logic
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000006-000c-4000-8000-000000000001',
  '10000001-0602-4000-8000-000000000001',
  6,
  'Simple Puzzles',
  'Use clues to solve puzzles! Read the hints and figure out the answer.',
  'You''re a super problem solver now! Let''s try some real puzzles. Chip will give you clues, and you figure out the answer. Think carefully about each clue -- they all help you find the answer!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY[
    '5f8391a5-f5e3-4b2e-8327-656d05a054ad',
    'c376f0f0-aab7-4c6d-9e8e-5b6e498b488d'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ps12-mc1",
            "prompt": "I am a fruit. I am red. I grow on trees. What am I?",
            "options": [
              { "id": "a", "text": "Banana" },
              { "id": "b", "text": "Apple" },
              { "id": "c", "text": "Grape" },
              { "id": "d", "text": "Watermelon" }
            ],
            "correctOptionId": "b",
            "hint": "Think about the clues: fruit + red + grows on trees. Which one fits ALL the clues?"
          },
          {
            "id": "ps12-mc2",
            "prompt": "I have four legs. I say \"moo.\" I give us milk. What am I?",
            "options": [
              { "id": "a", "text": "Dog" },
              { "id": "b", "text": "Cat" },
              { "id": "c", "text": "Cow" },
              { "id": "d", "text": "Horse" }
            ],
            "correctOptionId": "c",
            "hint": "Which animal says moo and gives us milk?"
          },
          {
            "id": "ps12-mc3",
            "prompt": "I am round. You can bounce me. You use me to play games. What am I?",
            "options": [
              { "id": "a", "text": "A book" },
              { "id": "b", "text": "A ball" },
              { "id": "c", "text": "A shoe" },
              { "id": "d", "text": "A hat" }
            ],
            "correctOptionId": "b",
            "hint": "Something round that bounces and you play games with..."
          },
          {
            "id": "ps12-mc4",
            "prompt": "I am in the sky. I come out at night. I am big and round and bright. What am I?",
            "options": [
              { "id": "a", "text": "The sun" },
              { "id": "b", "text": "A cloud" },
              { "id": "c", "text": "The moon" },
              { "id": "d", "text": "An airplane" }
            ],
            "correctOptionId": "c",
            "hint": "It is in the sky at NIGHT, and it is round and bright. The sun is during the day!"
          },
          {
            "id": "ps12-mc5",
            "prompt": "Sam has a pet. It has fur. It wags its tail. It barks. What is Sam''s pet?",
            "options": [
              { "id": "a", "text": "A fish" },
              { "id": "b", "text": "A bird" },
              { "id": "c", "text": "A cat" },
              { "id": "d", "text": "A dog" }
            ],
            "correctOptionId": "d",
            "hint": "Which pet has fur, wags its tail, AND barks?"
          },
          {
            "id": "ps12-mc6",
            "prompt": "There are 3 friends: Ana, Ben, and Cho. Ana is the tallest. Cho is the shortest. Who is in the middle?",
            "options": [
              { "id": "a", "text": "Ana" },
              { "id": "b", "text": "Ben" },
              { "id": "c", "text": "Cho" },
              { "id": "d", "text": "Nobody" }
            ],
            "correctOptionId": "b",
            "hint": "Ana is tallest, Cho is shortest. That means Ben is..."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- *************************************************************************
--
--  PART B: CODING LESSONS (10 lessons)
--
-- *************************************************************************


-- =========================================================================
-- CODE LESSON 1: What is a Computer?
-- Module: What is Code?
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0001-4000-8000-000000000001',
  '10000001-0701-4000-8000-000000000001',
  1,
  'What is a Computer?',
  'Learn what a computer is and discover that computers are all around you!',
  'Hi friend! Chip here -- and guess what? I AM a computer! Well, a tiny one. Computers are everywhere -- in phones, cars, even refrigerators! Let''s learn about what makes a computer a computer. Flip the cards to find out!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['961b5403-2dfa-479f-93f4-616cb06ae931']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about computers!",
        "cards": [
          {
            "id": "fc-input",
            "front": "Input",
            "back": "Input is how you TELL a computer what to do. You use a keyboard, mouse, or touchscreen!"
          },
          {
            "id": "fc-output",
            "front": "Output",
            "back": "Output is how a computer SHOWS you things. The screen, speakers, and printer are all output!"
          },
          {
            "id": "fc-brain",
            "front": "Processor (Brain)",
            "back": "The processor is the computer''s BRAIN. It thinks really fast and follows instructions!"
          },
          {
            "id": "fc-memory",
            "front": "Memory",
            "back": "Memory is where a computer REMEMBERS things. Like your brain remembers your name!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd1-mc1",
            "prompt": "Which of these is a computer?",
            "options": [
              { "id": "a", "text": "A tablet" },
              { "id": "b", "text": "A rock" },
              { "id": "c", "text": "A shoe" },
              { "id": "d", "text": "A sandwich" }
            ],
            "correctOptionId": "a",
            "hint": "A computer can follow instructions and show things on a screen. Which one does that?"
          },
          {
            "id": "cd1-mc2",
            "prompt": "What is the computer''s \"brain\" called?",
            "options": [
              { "id": "a", "text": "The screen" },
              { "id": "b", "text": "The keyboard" },
              { "id": "c", "text": "The processor" },
              { "id": "d", "text": "The mouse" }
            ],
            "correctOptionId": "c",
            "hint": "Think about the card that said it ''thinks really fast''!"
          },
          {
            "id": "cd1-mc3",
            "prompt": "A keyboard is an example of ___.",
            "options": [
              { "id": "a", "text": "Output" },
              { "id": "b", "text": "Input" },
              { "id": "c", "text": "Memory" },
              { "id": "d", "text": "A game" }
            ],
            "correctOptionId": "b",
            "hint": "You use a keyboard to TELL the computer what to do. That is called..."
          },
          {
            "id": "cd1-mc4",
            "prompt": "The screen on a computer is an example of ___.",
            "options": [
              { "id": "a", "text": "Input" },
              { "id": "b", "text": "Memory" },
              { "id": "c", "text": "Output" },
              { "id": "d", "text": "A snack" }
            ],
            "correctOptionId": "c",
            "hint": "The screen SHOWS you things. When a computer shows you something, it is called..."
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
-- CODE LESSON 2: Giving Instructions
-- Module: What is Code?
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0002-4000-8000-000000000001',
  '10000001-0701-4000-8000-000000000001',
  2,
  'Giving Instructions',
  'Learn how to give step-by-step instructions -- just like a real programmer!',
  'Did you know that coding is just giving instructions? When you tell someone how to make a peanut butter sandwich, you''re kind of coding! But here''s the tricky part: computers need VERY clear instructions. Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['a6ed8446-632c-4622-aaa8-752b6a641a11']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd2-sq1",
            "prompt": "Put the instructions for making a peanut butter sandwich in order!",
            "items": [
              { "id": "s1", "text": "Get two pieces of bread" },
              { "id": "s2", "text": "Open the peanut butter jar" },
              { "id": "s3", "text": "Spread peanut butter on the bread" },
              { "id": "s4", "text": "Put the two pieces together" }
            ]
          },
          {
            "id": "cd2-sq2",
            "prompt": "Put the instructions for pouring a glass of milk in order!",
            "items": [
              { "id": "s1", "text": "Get a cup from the shelf" },
              { "id": "s2", "text": "Open the milk carton" },
              { "id": "s3", "text": "Pour the milk into the cup" },
              { "id": "s4", "text": "Put the milk carton back" }
            ]
          },
          {
            "id": "cd2-sq3",
            "prompt": "Put the instructions for feeding a dog in order!",
            "items": [
              { "id": "s1", "text": "Pick up the dog bowl" },
              { "id": "s2", "text": "Open the bag of dog food" },
              { "id": "s3", "text": "Pour food into the bowl" },
              { "id": "s4", "text": "Put the bowl on the floor for the dog" }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd2-mc1",
            "prompt": "Why do computers need step-by-step instructions?",
            "options": [
              { "id": "a", "text": "Because they can figure things out on their own" },
              { "id": "b", "text": "Because they can only do exactly what you tell them" },
              { "id": "c", "text": "Because they like to read" },
              { "id": "d", "text": "Because they are lazy" }
            ],
            "correctOptionId": "b",
            "hint": "Computers are very good at following instructions, but they need YOU to tell them what to do!"
          },
          {
            "id": "cd2-mc2",
            "prompt": "What happens if you skip a step in your instructions?",
            "options": [
              { "id": "a", "text": "Everything works perfectly" },
              { "id": "b", "text": "The computer guesses what you meant" },
              { "id": "c", "text": "Something might go wrong" },
              { "id": "d", "text": "The computer adds the step for you" }
            ],
            "correctOptionId": "c",
            "hint": "If you forget to open the jar, you can''t spread the peanut butter! Missing steps cause problems."
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
-- CODE LESSON 3: Be a Robot!
-- Module: What is Code?
-- Widgets: sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0003-4000-8000-000000000001',
  '10000001-0701-4000-8000-000000000001',
  3,
  'Be a Robot!',
  'Pretend you are a robot and follow directions! Move up, down, left, and right.',
  'Beep boop! Chip wants you to pretend you are a ROBOT! Robots only move when you tell them how. Up, down, left, right -- those are your commands. Can you put the robot moves in the right order to reach the goal?',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['a6ed8446-632c-4622-aaa8-752b6a641a11']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd3-sq1",
            "prompt": "The robot needs to go RIGHT then UP to reach the star. Put the moves in order!",
            "items": [
              { "id": "s1", "text": "Move Right" },
              { "id": "s2", "text": "Move Up" }
            ]
          },
          {
            "id": "cd3-sq2",
            "prompt": "The robot needs to go UP, UP, then RIGHT to get the cookie. Put the moves in order!",
            "items": [
              { "id": "s1", "text": "Move Up" },
              { "id": "s2", "text": "Move Up" },
              { "id": "s3", "text": "Move Right" }
            ]
          },
          {
            "id": "cd3-sq3",
            "prompt": "The robot needs to go RIGHT, RIGHT, DOWN to get the treasure. Put the moves in order!",
            "items": [
              { "id": "s1", "text": "Move Right" },
              { "id": "s2", "text": "Move Right" },
              { "id": "s3", "text": "Move Down" }
            ]
          },
          {
            "id": "cd3-sq4",
            "prompt": "The robot needs to go DOWN, LEFT, LEFT, UP to get home. Put the moves in order!",
            "items": [
              { "id": "s1", "text": "Move Down" },
              { "id": "s2", "text": "Move Left" },
              { "id": "s3", "text": "Move Left" },
              { "id": "s4", "text": "Move Up" }
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
-- CODE LESSON 4: Bugs! (Finding Mistakes)
-- Module: What is Code?
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0004-4000-8000-000000000001',
  '10000001-0701-4000-8000-000000000001',
  4,
  'Bugs! (Finding Mistakes)',
  'Programmers call mistakes \"bugs.\" Can you find the bug in each set of instructions?',
  'Uh oh! Chip found some BUGS! Not real bugs -- in coding, a \"bug\" is a mistake in your instructions. Even the best programmers make bugs! The important thing is learning to FIND them. Can you spot the bug?',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['a6ed8446-632c-4622-aaa8-752b6a641a11']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd4-mc1",
            "prompt": "To make toast: 1) Put bread in toaster, 2) Eat the toast, 3) Push the lever down. Which step is in the wrong place?",
            "options": [
              { "id": "a", "text": "Step 1 - Put bread in toaster" },
              { "id": "b", "text": "Step 2 - Eat the toast" },
              { "id": "c", "text": "Step 3 - Push the lever down" },
              { "id": "d", "text": "No step is wrong" }
            ],
            "correctOptionId": "b",
            "hint": "Can you eat the toast BEFORE it is toasted? Something is out of order!"
          },
          {
            "id": "cd4-mc2",
            "prompt": "To put on shoes: 1) Put on your shoes, 2) Tie the laces, 3) Put on your socks. What is the bug?",
            "options": [
              { "id": "a", "text": "You should put on socks BEFORE shoes" },
              { "id": "b", "text": "You should tie laces first" },
              { "id": "c", "text": "You don''t need socks" },
              { "id": "d", "text": "There is no bug" }
            ],
            "correctOptionId": "a",
            "hint": "Socks go on your feet BEFORE shoes. The order is: socks, then shoes, then laces!"
          },
          {
            "id": "cd4-mc3",
            "prompt": "The robot was told: Move Right, Move Right, Move Up. But it went RIGHT, LEFT, UP! Which instruction had a bug?",
            "options": [
              { "id": "a", "text": "The first Move Right" },
              { "id": "b", "text": "The second Move Right (it went Left instead)" },
              { "id": "c", "text": "The Move Up" },
              { "id": "d", "text": "There was no bug" }
            ],
            "correctOptionId": "b",
            "hint": "Compare the plan and what happened: Right, Right, Up vs Right, LEFT, Up. Which one changed?"
          },
          {
            "id": "cd4-mc4",
            "prompt": "To water a flower: 1) Fill the watering can with water, 2) Carry the can to the flower, 3) Pour water on the flower, 4) Eat the flower. What is the bug?",
            "options": [
              { "id": "a", "text": "Step 1 is wrong" },
              { "id": "b", "text": "Step 2 is wrong" },
              { "id": "c", "text": "Step 3 is wrong" },
              { "id": "d", "text": "Step 4 is wrong -- you don''t eat flowers!" }
            ],
            "correctOptionId": "d",
            "hint": "Steps 1, 2, and 3 all make sense. But step 4... do you eat flowers? That''s the bug!"
          },
          {
            "id": "cd4-mc5",
            "prompt": "What do programmers call a mistake in code?",
            "options": [
              { "id": "a", "text": "A bird" },
              { "id": "b", "text": "A bug" },
              { "id": "c", "text": "A fish" },
              { "id": "d", "text": "A cat" }
            ],
            "correctOptionId": "b",
            "hint": "It is the name of a tiny crawly creature. Programmers call mistakes..."
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
-- CODE LESSON 5: Everyday Algorithms
-- Module: What is Code?
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0005-4000-8000-000000000001',
  '10000001-0701-4000-8000-000000000001',
  5,
  'Everyday Algorithms',
  'An algorithm is a fancy word for a set of steps! You follow algorithms every day without knowing it.',
  'Big word alert: ALGORITHM! Don''t worry, it just means a set of steps you follow to do something. Brushing your teeth is an algorithm! Getting dressed is an algorithm! You already know lots of algorithms. Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY[
    'a6ed8446-632c-4622-aaa8-752b6a641a11',
    '961b5403-2dfa-479f-93f4-616cb06ae931'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd5-sq1",
            "prompt": "Put the algorithm for brushing your teeth in order!",
            "items": [
              { "id": "s1", "text": "Wet your toothbrush" },
              { "id": "s2", "text": "Squeeze toothpaste on the brush" },
              { "id": "s3", "text": "Brush your teeth for 2 minutes" },
              { "id": "s4", "text": "Spit out the toothpaste" },
              { "id": "s5", "text": "Rinse your mouth with water" }
            ]
          },
          {
            "id": "cd5-sq2",
            "prompt": "Put the algorithm for getting dressed in order!",
            "items": [
              { "id": "s1", "text": "Put on underwear" },
              { "id": "s2", "text": "Put on socks" },
              { "id": "s3", "text": "Put on pants" },
              { "id": "s4", "text": "Put on a shirt" },
              { "id": "s5", "text": "Put on shoes" }
            ]
          },
          {
            "id": "cd5-sq3",
            "prompt": "Put the algorithm for going to school in order!",
            "items": [
              { "id": "s1", "text": "Wake up" },
              { "id": "s2", "text": "Eat breakfast" },
              { "id": "s3", "text": "Pack your backpack" },
              { "id": "s4", "text": "Get in the car or bus" },
              { "id": "s5", "text": "Walk into school" }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd5-mc1",
            "prompt": "What is an algorithm?",
            "options": [
              { "id": "a", "text": "A type of animal" },
              { "id": "b", "text": "A set of steps to do something" },
              { "id": "c", "text": "A kind of food" },
              { "id": "d", "text": "A big number" }
            ],
            "correctOptionId": "b",
            "hint": "An algorithm is like a recipe -- it tells you what to do step by step!"
          },
          {
            "id": "cd5-mc2",
            "prompt": "Which of these is an algorithm you do every morning?",
            "options": [
              { "id": "a", "text": "Flying to the moon" },
              { "id": "b", "text": "Brushing your teeth" },
              { "id": "c", "text": "Building a house" },
              { "id": "d", "text": "Driving a car" }
            ],
            "correctOptionId": "b",
            "hint": "Think about something you do every single morning with steps you follow!"
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
-- CODE LESSON 6: Step by Step
-- Module: Sequences & Loops
-- Widgets: sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0006-4000-8000-000000000001',
  '10000001-0702-4000-8000-000000000001',
  1,
  'Step by Step',
  'Arrange code-like instructions in the right order to complete each task!',
  'Now you know what an algorithm is! Let''s practice putting instructions in order -- just like a real programmer writes code. Each step does one small thing. Together, the steps do something awesome!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['a6ed8446-632c-4622-aaa8-752b6a641a11']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd6-sq1",
            "prompt": "Put these instructions in order to draw a smiley face!",
            "items": [
              { "id": "s1", "text": "Draw a big circle for the head" },
              { "id": "s2", "text": "Draw two dots for eyes" },
              { "id": "s3", "text": "Draw a curved line for the smile" },
              { "id": "s4", "text": "Color it yellow" }
            ]
          },
          {
            "id": "cd6-sq2",
            "prompt": "Put these instructions in order to build a snowman!",
            "items": [
              { "id": "s1", "text": "Roll a big snowball for the body" },
              { "id": "s2", "text": "Roll a medium snowball, put it on top" },
              { "id": "s3", "text": "Roll a small snowball for the head" },
              { "id": "s4", "text": "Add a carrot nose and button eyes" }
            ]
          },
          {
            "id": "cd6-sq3",
            "prompt": "Put these instructions for a robot to make lemonade in order!",
            "items": [
              { "id": "s1", "text": "Get a pitcher" },
              { "id": "s2", "text": "Squeeze lemons into the pitcher" },
              { "id": "s3", "text": "Add water and sugar" },
              { "id": "s4", "text": "Stir it all together" },
              { "id": "s5", "text": "Pour into a glass" }
            ]
          },
          {
            "id": "cd6-sq4",
            "prompt": "Put these instructions for a robot to set the table in order!",
            "items": [
              { "id": "s1", "text": "Put a plate on the table" },
              { "id": "s2", "text": "Put a fork on the left side" },
              { "id": "s3", "text": "Put a knife on the right side" },
              { "id": "s4", "text": "Put a glass above the plate" }
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
-- CODE LESSON 7: Repeat After Me (Loops)
-- Module: Sequences & Loops
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0007-4000-8000-000000000001',
  '10000001-0702-4000-8000-000000000001',
  2,
  'Repeat After Me (Loops)',
  'Discover loops -- the magic trick that makes computers repeat things without writing the same instruction over and over!',
  'Chip has a SUPER power: loops! A loop means doing the same thing again and again. Instead of saying \"jump, jump, jump, jump, jump,\" you can say \"jump 5 times!\" That''s a loop! Let''s learn about this amazing shortcut!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['c8a3ee1e-b955-407b-ba0b-b2c31f8385a0']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd7-mc1",
            "prompt": "If you say \"clap 3 times,\" how many claps will you do?",
            "options": [
              { "id": "a", "text": "1 clap" },
              { "id": "b", "text": "2 claps" },
              { "id": "c", "text": "3 claps" },
              { "id": "d", "text": "0 claps" }
            ],
            "correctOptionId": "c",
            "hint": "The number tells you how many times to repeat! \"3 times\" means..."
          },
          {
            "id": "cd7-mc2",
            "prompt": "Which is a loop in real life?",
            "options": [
              { "id": "a", "text": "Eating one cookie" },
              { "id": "b", "text": "Bouncing a ball 10 times" },
              { "id": "c", "text": "Opening a door" },
              { "id": "d", "text": "Waving once" }
            ],
            "correctOptionId": "b",
            "hint": "A loop is doing the SAME thing MANY times. Which one repeats?"
          },
          {
            "id": "cd7-mc3",
            "prompt": "Instead of writing \"hop, hop, hop, hop,\" a programmer would say:",
            "options": [
              { "id": "a", "text": "Hop one time" },
              { "id": "b", "text": "Hop 4 times" },
              { "id": "c", "text": "Don''t hop" },
              { "id": "d", "text": "Hop forever" }
            ],
            "correctOptionId": "b",
            "hint": "Count the hops: hop, hop, hop, hop. That is 4 hops. So you say hop ___ times."
          },
          {
            "id": "cd7-mc4",
            "prompt": "Why do programmers like loops?",
            "options": [
              { "id": "a", "text": "They make code longer" },
              { "id": "b", "text": "They make code shorter and easier" },
              { "id": "c", "text": "They make code harder to read" },
              { "id": "d", "text": "They make computers slower" }
            ],
            "correctOptionId": "b",
            "hint": "Instead of writing the same thing 100 times, you just write it once and say repeat 100 times!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cd7-fb1",
            "sentence": "Repeat ___ times: stomp your feet. (You want to stomp 5 times)",
            "correctAnswer": "5",
            "acceptableAnswers": ["five"],
            "hint": "You want to stomp 5 times, so the number is..."
          },
          {
            "id": "cd7-fb2",
            "sentence": "Repeat ___ times: spin around. (You want to spin 3 times)",
            "correctAnswer": "3",
            "acceptableAnswers": ["three"],
            "hint": "You want to spin 3 times!"
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
-- CODE LESSON 8: Pattern Machine
-- Module: Sequences & Loops
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0008-4000-8000-000000000001',
  '10000001-0702-4000-8000-000000000001',
  3,
  'Pattern Machine',
  'Loops and patterns go together! Find the repeating part and predict what comes next.',
  'Remember patterns from Puzzle Lab? Patterns and loops are BEST FRIENDS! When you see a pattern like clap-stomp-clap-stomp, the loop is \"repeat clap-stomp.\" Let''s find the loop inside each pattern!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY[
    'c8a3ee1e-b955-407b-ba0b-b2c31f8385a0',
    'a6ed8446-632c-4622-aaa8-752b6a641a11'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cd8-fb1",
            "sentence": "Clap, Stomp, Clap, Stomp, Clap, ___",
            "correctAnswer": "Stomp",
            "acceptableAnswers": ["stomp", "STOMP"],
            "hint": "The pattern is Clap, Stomp repeating. After Clap comes..."
          },
          {
            "id": "cd8-fb2",
            "sentence": "Jump, Jump, Spin, Jump, Jump, ___",
            "correctAnswer": "Spin",
            "acceptableAnswers": ["spin", "SPIN"],
            "hint": "The pattern is: Jump, Jump, then what? It repeats!"
          },
          {
            "id": "cd8-fb3",
            "sentence": "Beep, Boop, Beep, Boop, ___, Boop",
            "correctAnswer": "Beep",
            "acceptableAnswers": ["beep", "BEEP"],
            "hint": "Beep and Boop take turns. Before Boop comes..."
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd8-sq1",
            "prompt": "The pattern is: Clap, Snap, Tap. Put one full repeat in order!",
            "items": [
              { "id": "s1", "text": "Clap" },
              { "id": "s2", "text": "Snap" },
              { "id": "s3", "text": "Tap" }
            ]
          },
          {
            "id": "cd8-sq2",
            "prompt": "The loop says: Step Forward, Turn Right. Put TWO repeats in order!",
            "items": [
              { "id": "s1", "text": "Step Forward" },
              { "id": "s2", "text": "Turn Right" },
              { "id": "s3", "text": "Step Forward" },
              { "id": "s4", "text": "Turn Right" }
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
-- CODE LESSON 9: If This, Then That
-- Module: Sequences & Loops
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-0009-4000-8000-000000000001',
  '10000001-0702-4000-8000-000000000001',
  4,
  'If This, Then That',
  'Learn about choices in coding! IF something is true, THEN do something. It''s like making decisions!',
  'You make choices every day! IF it is raining, THEN take an umbrella. IF you are hungry, THEN eat a snack. Computers make choices too! They use something called IF-THEN. Let''s practice thinking like a computer!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['a6ed8446-632c-4622-aaa8-752b6a641a11']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd9-mc1",
            "prompt": "IF it is cold outside, THEN you should ___.",
            "options": [
              { "id": "a", "text": "Wear a swimsuit" },
              { "id": "b", "text": "Wear a warm coat" },
              { "id": "c", "text": "Stay up all night" },
              { "id": "d", "text": "Eat ice cream outside" }
            ],
            "correctOptionId": "b",
            "hint": "When it is cold, you want to stay warm! What keeps you warm?"
          },
          {
            "id": "cd9-mc2",
            "prompt": "IF the traffic light is red, THEN you should ___.",
            "options": [
              { "id": "a", "text": "Go really fast" },
              { "id": "b", "text": "Close your eyes" },
              { "id": "c", "text": "Stop" },
              { "id": "d", "text": "Turn around" }
            ],
            "correctOptionId": "c",
            "hint": "Red means stop! IF the light is red, THEN you..."
          },
          {
            "id": "cd9-mc3",
            "prompt": "IF your hands are dirty, THEN you should ___.",
            "options": [
              { "id": "a", "text": "Touch your food" },
              { "id": "b", "text": "Wash your hands" },
              { "id": "c", "text": "Wipe them on the couch" },
              { "id": "d", "text": "Do nothing" }
            ],
            "correctOptionId": "b",
            "hint": "Dirty hands need to be cleaned! What do you do to clean your hands?"
          },
          {
            "id": "cd9-mc4",
            "prompt": "IF it is your friend''s birthday, THEN you could ___.",
            "options": [
              { "id": "a", "text": "Ignore them" },
              { "id": "b", "text": "Be mean to them" },
              { "id": "c", "text": "Say happy birthday!" },
              { "id": "d", "text": "Take their cake" }
            ],
            "correctOptionId": "c",
            "hint": "On birthdays, friends do something nice! What would you say?"
          },
          {
            "id": "cd9-mc5",
            "prompt": "A robot has this rule: IF it sees a wall, THEN turn left. The robot is walking and sees a wall. What does it do?",
            "options": [
              { "id": "a", "text": "Walk through the wall" },
              { "id": "b", "text": "Turn left" },
              { "id": "c", "text": "Turn right" },
              { "id": "d", "text": "Stop forever" }
            ],
            "correctOptionId": "b",
            "hint": "The rule says: IF wall, THEN turn left. The robot sees a wall, so it should..."
          },
          {
            "id": "cd9-mc6",
            "prompt": "IF you are sleepy, THEN ___. What is the best answer?",
            "options": [
              { "id": "a", "text": "Go to bed" },
              { "id": "b", "text": "Run a race" },
              { "id": "c", "text": "Eat a big meal" },
              { "id": "d", "text": "Yell really loud" }
            ],
            "correctOptionId": "a",
            "hint": "When you feel sleepy, what does your body want you to do?"
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
-- CODE LESSON 10: Code a Dance!
-- Module: Sequences & Loops
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000007-000a-4000-8000-000000000001',
  '10000001-0702-4000-8000-000000000001',
  5,
  'Code a Dance!',
  'Put dance moves in order to create a dance routine! Use sequences and loops to make it awesome!',
  'Time to DANCE! Chip loves dancing -- and guess what? A dance is just an algorithm with music! You put moves in order, and some moves REPEAT (that''s a loop!). Let''s code a dance routine together!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY[
    'a6ed8446-632c-4622-aaa8-752b6a641a11',
    'c8a3ee1e-b955-407b-ba0b-b2c31f8385a0'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cd10-sq1",
            "prompt": "Code Chip''s dance! Put the moves in order: Wave, Spin, Jump, Bow!",
            "items": [
              { "id": "s1", "text": "Wave your arms" },
              { "id": "s2", "text": "Spin around" },
              { "id": "s3", "text": "Jump up high" },
              { "id": "s4", "text": "Take a bow" }
            ]
          },
          {
            "id": "cd10-sq2",
            "prompt": "This dance uses a loop! Put it in order: Clap, Clap, Stomp, Clap, Clap, Stomp",
            "items": [
              { "id": "s1", "text": "Clap" },
              { "id": "s2", "text": "Clap" },
              { "id": "s3", "text": "Stomp" },
              { "id": "s4", "text": "Clap" },
              { "id": "s5", "text": "Clap" },
              { "id": "s6", "text": "Stomp" }
            ]
          },
          {
            "id": "cd10-sq3",
            "prompt": "Code the Freeze Dance! Put the moves in order: Dance, Dance, Dance, FREEZE!",
            "items": [
              { "id": "s1", "text": "Dance" },
              { "id": "s2", "text": "Dance" },
              { "id": "s3", "text": "Dance" },
              { "id": "s4", "text": "FREEZE!" }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd10-mc1",
            "prompt": "In the dance Clap, Clap, Stomp, Clap, Clap, Stomp -- what is the loop?",
            "options": [
              { "id": "a", "text": "Clap, Clap, Stomp" },
              { "id": "b", "text": "Just Clap" },
              { "id": "c", "text": "Just Stomp" },
              { "id": "d", "text": "Stomp, Clap" }
            ],
            "correctOptionId": "a",
            "hint": "The loop is the part that REPEATS. What group of moves happens twice?"
          },
          {
            "id": "cd10-mc2",
            "prompt": "A dance routine is like an algorithm because ___.",
            "options": [
              { "id": "a", "text": "It is always slow" },
              { "id": "b", "text": "It has steps you follow in order" },
              { "id": "c", "text": "It only uses your feet" },
              { "id": "d", "text": "It never repeats" }
            ],
            "correctOptionId": "b",
            "hint": "Both a dance and an algorithm are a set of ___ you follow in order."
          },
          {
            "id": "cd10-mc3",
            "prompt": "You learned about sequences, loops, and IF-THEN. Which one means \"repeat something\"?",
            "options": [
              { "id": "a", "text": "Sequence" },
              { "id": "b", "text": "Loop" },
              { "id": "c", "text": "IF-THEN" },
              { "id": "d", "text": "Bug" }
            ],
            "correctOptionId": "b",
            "hint": "When you want to do the same thing over and over, you use a..."
          },
          {
            "id": "cd10-mc4",
            "prompt": "Congratulations! You learned the basics of coding! What did you learn?",
            "options": [
              { "id": "a", "text": "Computers follow instructions called code" },
              { "id": "b", "text": "Algorithms are step-by-step instructions" },
              { "id": "c", "text": "Loops repeat actions and bugs are mistakes" },
              { "id": "d", "text": "All of the above!" }
            ],
            "correctOptionId": "d",
            "hint": "You learned SO much! Think about everything: instructions, algorithms, loops, bugs..."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
