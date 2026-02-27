-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Problem Solving Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Problem Solving "Puzzle Pals" module.
-- Aligned to CC Mathematical Practices + ISTE Computational Thinking
--
-- Module ID: 00000001-0061-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000006
--
-- Lesson UUIDs: c1000006-0001 through c1000006-0005
-- =============================================================================


-- =========================================================================
-- PS LESSON 1: Pattern Party!
-- Skills: AB Patterns, ABC Patterns
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000006-0001-4000-8000-000000000001',
  '00000001-0061-4000-8000-000000000001',
  1,
  'Pattern Party!',
  'Spot patterns and figure out what comes next! Red, blue, red, blue, ???',
  'Chip sees patterns EVERYWHERE! A pattern is something that repeats. Like: red, blue, red, blue, red, blue! Can you tell what comes NEXT? Let''s be pattern detectives!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000100-0001-4000-8000-000000000001',
    '60000100-0002-4000-8000-000000000001'
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
            "id": "pattern-ab-1",
            "prompt": "What comes next?\n\ud83d\udfe5\ud83d\udfe6\ud83d\udfe5\ud83d\udfe6\ud83d\udfe5 ???",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Blue", "emoji": "\ud83d\udfe6"},
              {"id": "b", "text": "Red", "emoji": "\ud83d\udfe5"},
              {"id": "c", "text": "Green", "emoji": "\ud83d\udfe9"}
            ],
            "correctOptionId": "a",
            "hint": "Red, blue, red, blue, red \u2014 the pattern alternates! After red comes..."
          },
          {
            "id": "pattern-ab-2",
            "prompt": "What comes next?\n\u2b50\u2764\ufe0f\u2b50\u2764\ufe0f\u2b50 ???",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Star", "emoji": "\u2b50"},
              {"id": "b", "text": "Heart", "emoji": "\u2764\ufe0f"},
              {"id": "c", "text": "Circle", "emoji": "\ud83d\udfe2"}
            ],
            "correctOptionId": "b",
            "hint": "Star, heart, star, heart, star \u2014 what follows star?"
          },
          {
            "id": "pattern-abc",
            "prompt": "What comes next?\n\ud83d\udfe5\ud83d\udfe8\ud83d\udfe6\ud83d\udfe5\ud83d\udfe8 ???",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Red", "emoji": "\ud83d\udfe5"},
              {"id": "b", "text": "Yellow", "emoji": "\ud83d\udfe8"},
              {"id": "c", "text": "Blue", "emoji": "\ud83d\udfe6"}
            ],
            "correctOptionId": "c",
            "hint": "Red, yellow, blue, red, yellow \u2014 this is an ABC pattern! A-B-C, A-B-???"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pattern-build",
            "prompt": "Build the pattern! Put these in the right order: Sun, Moon, Sun",
            "items": [
              {"id": "sun1", "text": "Sun", "emoji": "\u2600\ufe0f", "correctPosition": 1},
              {"id": "moon1", "text": "Moon", "emoji": "\ud83c\udf19", "correctPosition": 2},
              {"id": "sun2", "text": "Sun", "emoji": "\u2600\ufe0f", "correctPosition": 3}
            ],
            "hint": "The AB pattern goes: Sun, Moon, Sun!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- PS LESSON 2: Sort It Out!
-- Skills: Sorting by Attribute, Classify and Count
-- Widgets: drag_to_sort + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000006-0002-4000-8000-000000000001',
  '00000001-0061-4000-8000-000000000001',
  2,
  'Sort It Out!',
  'Sort objects by color, shape, and size! Everything has a group!',
  'Chip''s toy box is a big mess! Can you help sort everything? We can sort by COLOR, by SHAPE, or by SIZE. Let''s organize!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000100-0003-4000-8000-000000000001',
    '60000100-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "sort-color",
            "prompt": "Sort by color! Put red things in one group and blue things in another.",
            "buckets": [
              {"id": "red", "label": "Red Things", "emoji": "\ud83d\udfe5"},
              {"id": "blue", "label": "Blue Things", "emoji": "\ud83d\udfe6"}
            ],
            "items": [
              {"id": "apple", "label": "Apple", "emoji": "\ud83c\udf4e", "correctBucket": "red"},
              {"id": "ocean", "label": "Ocean", "emoji": "\ud83c\udf0a", "correctBucket": "blue"},
              {"id": "firetruck", "label": "Fire truck", "emoji": "\ud83d\ude92", "correctBucket": "red"},
              {"id": "sky", "label": "Sky", "emoji": "\ud83c\udf24\ufe0f", "correctBucket": "blue"},
              {"id": "strawberry", "label": "Strawberry", "emoji": "\ud83c\udf53", "correctBucket": "red"}
            ],
            "hint": "Look at the color of each thing! Is it red or blue?"
          }
        ]
      },
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "sort-type",
            "prompt": "Sort by type! Which ones are animals and which are food?",
            "buckets": [
              {"id": "animals", "label": "Animals", "emoji": "\ud83d\udc3e"},
              {"id": "food", "label": "Food", "emoji": "\ud83c\udf7d\ufe0f"}
            ],
            "items": [
              {"id": "cat", "label": "Cat", "emoji": "\ud83d\udc31", "correctBucket": "animals"},
              {"id": "pizza", "label": "Pizza", "emoji": "\ud83c\udf55", "correctBucket": "food"},
              {"id": "dog", "label": "Dog", "emoji": "\ud83d\udc36", "correctBucket": "animals"},
              {"id": "banana", "label": "Banana", "emoji": "\ud83c\udf4c", "correctBucket": "food"},
              {"id": "fish", "label": "Fish", "emoji": "\ud83d\udc1f", "correctBucket": "animals"}
            ],
            "hint": "Is it something alive that moves? Or something you eat?"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "count-groups",
            "prompt": "Chip sorted: \ud83c\udf4e\ud83c\udf4e\ud83c\udf4e apples and \ud83c\udf4c\ud83c\udf4c bananas. Which group has more?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Apples (3)", "emoji": "\ud83c\udf4e"},
              {"id": "b", "text": "Bananas (2)", "emoji": "\ud83c\udf4c"}
            ],
            "correctOptionId": "a",
            "hint": "Count each group! 3 apples vs 2 bananas \u2014 which number is bigger?"
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
-- PS LESSON 3: Which One Doesn't Belong?
-- Skills: Odd One Out, Simple Logic
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000006-0003-4000-8000-000000000001',
  '00000001-0061-4000-8000-000000000001',
  3,
  'Which One Doesn''t Belong?',
  'One of these things is not like the others! Can you find the odd one out?',
  'Chip has a fun puzzle for you! Look at a group of things \u2014 most of them are similar, but ONE is different! Can you spot the one that DOESN''T BELONG?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000100-0005-4000-8000-000000000001',
    '60000100-0007-4000-8000-000000000001'
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
            "id": "odd-1",
            "prompt": "Which one doesn''t belong?\n\ud83c\udf4e \ud83c\udf4c \ud83c\udf53 \ud83d\udc36",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Apple", "emoji": "\ud83c\udf4e"},
              {"id": "b", "text": "Banana", "emoji": "\ud83c\udf4c"},
              {"id": "c", "text": "Strawberry", "emoji": "\ud83c\udf53"},
              {"id": "d", "text": "Dog", "emoji": "\ud83d\udc36"}
            ],
            "correctOptionId": "d",
            "hint": "Three of these are fruits. One is an animal!"
          },
          {
            "id": "odd-2",
            "prompt": "Which one doesn''t belong?\n\ud83d\udd35 \ud83d\udd35 \ud83d\udd35 \ud83d\udfe2",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Blue circle", "emoji": "\ud83d\udd35"},
              {"id": "b", "text": "Green circle", "emoji": "\ud83d\udfe2"}
            ],
            "correctOptionId": "b",
            "hint": "Look at the colors! Most are blue, but one is..."
          },
          {
            "id": "odd-3",
            "prompt": "Which one doesn''t belong?\n\ud83d\ude97 \ud83d\ude8c \ud83d\ude80 \ud83c\udf33",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Car", "emoji": "\ud83d\ude97"},
              {"id": "b", "text": "Bus", "emoji": "\ud83d\ude8c"},
              {"id": "c", "text": "Rocket", "emoji": "\ud83d\ude80"},
              {"id": "d", "text": "Tree", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "d",
            "hint": "Three of these are vehicles that can move. One is a plant!"
          },
          {
            "id": "logic-1",
            "prompt": "If it is raining, you should bring a...",
            "promptEmoji": "\ud83c\udf27\ufe0f",
            "options": [
              {"id": "a", "text": "Umbrella", "emoji": "\u2602\ufe0f"},
              {"id": "b", "text": "Sunglasses", "emoji": "\ud83d\udd76\ufe0f"},
              {"id": "c", "text": "Swimsuit", "emoji": "\ud83e\ude73"}
            ],
            "correctOptionId": "a",
            "hint": "IF it rains, THEN you need something to stay dry!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play ''Odd One Out'' with real objects! Put 3 fruits and 1 toy on the table \u2014 which doesn''t belong? Try: 3 round things and 1 square, or 3 big things and 1 small. Let your child make one for YOU to solve!",
        "parentTip": "This builds classification skills and logical reasoning. Ask your child to EXPLAIN why something doesn''t belong \u2014 the reasoning matters more than the answer.",
        "completionPrompt": "Did you play Odd One Out together?",
        "illustration": "\ud83e\udde9"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- PS LESSON 4: What Comes Next?
-- Skills: What Comes Next?, AB Patterns
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000006-0004-4000-8000-000000000001',
  '00000001-0061-4000-8000-000000000001',
  4,
  'What Comes Next?',
  'Look at the sequence and predict what happens next! Be a pattern detective!',
  'Chip loves guessing games! If you see: morning, afternoon, night, morning, afternoon... what comes NEXT? You can predict things by looking at the pattern!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000100-0004-4000-8000-000000000001',
    '60000100-0001-4000-8000-000000000001'
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
            "id": "next-1",
            "prompt": "What comes next?\n\ud83c\udf1e \ud83c\udf19 \ud83c\udf1e \ud83c\udf19 \ud83c\udf1e ???",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Moon", "emoji": "\ud83c\udf19"},
              {"id": "b", "text": "Sun", "emoji": "\ud83c\udf1e"},
              {"id": "c", "text": "Star", "emoji": "\u2b50"}
            ],
            "correctOptionId": "a",
            "hint": "Sun, moon, sun, moon, sun \u2014 they take turns! After sun comes..."
          },
          {
            "id": "next-2",
            "prompt": "What comes next in getting ready for school?\n1. Wake up \u2192 2. Get dressed \u2192 3. Eat breakfast \u2192 4. ???",
            "promptEmoji": "\ud83c\udfeb",
            "options": [
              {"id": "a", "text": "Go to school!", "emoji": "\ud83d\ude8c"},
              {"id": "b", "text": "Go to sleep", "emoji": "\ud83d\ude34"},
              {"id": "c", "text": "Take a bath", "emoji": "\ud83d\udec1"}
            ],
            "correctOptionId": "a",
            "hint": "After you wake up, get dressed, and eat, you''re ready to..."
          },
          {
            "id": "next-3",
            "prompt": "What size comes next?\nSmall \u2192 Medium \u2192 ???",
            "promptEmoji": "\ud83d\udcc8",
            "options": [
              {"id": "a", "text": "Tiny", "emoji": "\ud83d\udc1c"},
              {"id": "b", "text": "Large", "emoji": "\ud83d\udc18"},
              {"id": "c", "text": "Small again", "emoji": "\ud83d\udc2d"}
            ],
            "correctOptionId": "b",
            "hint": "Small, medium \u2014 things are getting BIGGER! What''s bigger than medium?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "daily-order",
            "prompt": "Put these in order from morning to night!",
            "items": [
              {"id": "breakfast", "text": "Eat breakfast", "emoji": "\ud83e\udd5e", "correctPosition": 1},
              {"id": "lunch", "text": "Eat lunch", "emoji": "\ud83c\udf54", "correctPosition": 2},
              {"id": "dinner", "text": "Eat dinner", "emoji": "\ud83c\udf5d", "correctPosition": 3}
            ],
            "hint": "Breakfast is in the morning, lunch is in the middle, dinner is at night!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- PS LESSON 5: Don't Give Up!
-- Skills: Sticking With It (Perseverance)
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000006-0005-4000-8000-000000000001',
  '00000001-0061-4000-8000-000000000001',
  5,
  'Don''t Give Up!',
  'Sometimes things are hard \u2014 but that''s how you learn! Practice sticking with it.',
  'Chip wants to tell you a secret: even Chip finds things hard sometimes! But the BEST learners don''t give up. They try again, ask for help, and keep going! That''s called PERSEVERANCE!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000100-0008-4000-8000-000000000001'
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
            "id": "persist-1",
            "prompt": "You''re building a tower and it falls down. What should you do?",
            "promptEmoji": "\ud83c\udfdb\ufe0f",
            "options": [
              {"id": "a", "text": "Give up and walk away", "emoji": "\ud83d\udeb6"},
              {"id": "b", "text": "Try building it again!", "emoji": "\ud83d\udcaa"},
              {"id": "c", "text": "Cry and never try again", "emoji": "\ud83d\ude2d"}
            ],
            "correctOptionId": "b",
            "hint": "Great builders try again! Maybe try a different way this time."
          },
          {
            "id": "persist-2",
            "prompt": "A puzzle is really hard. What can you try?",
            "promptEmoji": "\ud83e\udde9",
            "options": [
              {"id": "a", "text": "Ask for a hint", "emoji": "\ud83d\udca1"},
              {"id": "b", "text": "Try different pieces", "emoji": "\ud83d\udd04"},
              {"id": "c", "text": "Both!", "emoji": "\ud83c\udf1f"}
            ],
            "correctOptionId": "c",
            "hint": "You have lots of strategies! Try again, try differently, or ask for help!"
          },
          {
            "id": "persist-3",
            "prompt": "Which is a growth mindset thought?",
            "promptEmoji": "\ud83e\udde0",
            "options": [
              {"id": "a", "text": "I can''t do this... YET!", "emoji": "\ud83c\udf1f"},
              {"id": "b", "text": "I''ll never learn this", "emoji": "\ud83d\ude1e"}
            ],
            "correctOptionId": "a",
            "hint": "Adding ''YET'' means you believe you CAN learn it with practice!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Build something challenging together (LEGO, a card tower, or a puzzle). When it''s hard, model saying: ''This is tricky! Let me try a different way.'' Celebrate the effort: ''You stuck with it \u2014 that''s what matters!''",
        "parentTip": "Praise effort and strategy, not just results. ''I love how you tried a different way!'' builds a growth mindset. Avoid jumping in to fix things \u2014 let them struggle productively with your encouragement.",
        "completionPrompt": "Did you practice sticking with a challenge together?",
        "illustration": "\ud83d\udcaa"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
