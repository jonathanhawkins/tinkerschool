-- =============================================================================
-- TinkerSchool -- Seed Interactive Activity Lessons (Band 1, Grade 1)
-- =============================================================================
-- 6 browser-only interactive lessons across Math, Reading, and Science.
-- These use the new activity system (multiple_choice, counting, matching_pairs,
-- sequence_order, flash_card, fill_in_blank) and do NOT require hardware.
--
-- Depends on: 003_seed_1st_grade_curriculum.sql (subjects, skills, modules)
--
-- Subject IDs:
--   Math:    00000000-0000-4000-8000-000000000001
--   Reading: 00000000-0000-4000-8000-000000000002
--   Science: 00000000-0000-4000-8000-000000000003
--
-- Module IDs:
--   Number World:   00000001-0001-4000-8000-000000000001
--   Word World:     00000001-0002-4000-8000-000000000001
--   Discovery Lab:  00000001-0003-4000-8000-000000000001
-- =============================================================================


-- =========================================================================
-- LESSON 1: Count the Animals (Math - Counting)
-- Type: counting widget
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0001-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  11,
  'Count the Animals!',
  'Count the animals on the screen. Tap each one to count them up!',
  'Hi friend! Chip here! Farmer Fred has a problem -- he lost track of how many animals are in each pen! Can you help him count? Tap each animal to count it. Let''s see how fast you can count them all!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY['10000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "count-chicks",
            "prompt": "How many chicks does Farmer Fred have?",
            "emoji": "\ud83d\udc25",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "Tap each chick one at a time. Count slowly: 1, 2, 3..."
          },
          {
            "id": "count-cows",
            "prompt": "How many cows are in the barn?",
            "emoji": "\ud83d\udc04",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "There are 5 cows! Try tapping each one."
          },
          {
            "id": "count-pigs",
            "prompt": "How many pigs are playing in the mud?",
            "emoji": "\ud83d\udc37",
            "correctCount": 7,
            "displayCount": 7,
            "hint": "Count carefully -- there are 7 pigs!"
          },
          {
            "id": "count-horses",
            "prompt": "How many horses are running in the field?",
            "emoji": "\ud83d\udc34",
            "correctCount": 4,
            "displayCount": 4,
            "hint": "Look carefully -- there are 4 horses galloping!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- LESSON 2: Addition Basics (Math - Multiple Choice)
-- Type: multiple_choice widget
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0002-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  12,
  'Addition Adventure!',
  'Help Chip solve addition problems! Pick the right answer from the choices.',
  'Guess what? Chip found a treasure chest but it''s locked with a number code! To crack the code, you need to solve some addition puzzles. Each time you get one right, part of the code appears. Can you solve them all and unlock the treasure?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0003-4000-8000-000000000001',
    '10000001-0006-4000-8000-000000000001'
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
            "id": "add-1",
            "prompt": "What is 1 + 1?",
            "promptEmoji": "\ud83c\udf4e",
            "options": [
              {"id": "a", "text": "2", "emoji": "\u2728"},
              {"id": "b", "text": "3", "emoji": ""},
              {"id": "c", "text": "1", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "If you have 1 apple and get 1 more apple, how many apples do you have?"
          },
          {
            "id": "add-2",
            "prompt": "What is 2 + 3?",
            "promptEmoji": "\u2b50",
            "options": [
              {"id": "a", "text": "4", "emoji": ""},
              {"id": "b", "text": "5", "emoji": "\u2728"},
              {"id": "c", "text": "6", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Count on your fingers: start at 2, then count 3 more: 3, 4, 5!"
          },
          {
            "id": "add-3",
            "prompt": "What is 4 + 2?",
            "promptEmoji": "\ud83c\udf1f",
            "options": [
              {"id": "a", "text": "5", "emoji": ""},
              {"id": "b", "text": "7", "emoji": ""},
              {"id": "c", "text": "6", "emoji": "\u2728"},
              {"id": "d", "text": "8", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Start at 4 and count 2 more: 5, 6. The answer is 6!"
          },
          {
            "id": "add-4",
            "prompt": "What is 3 + 3?",
            "promptEmoji": "\ud83c\udf88",
            "options": [
              {"id": "a", "text": "6", "emoji": "\u2728"},
              {"id": "b", "text": "5", "emoji": ""},
              {"id": "c", "text": "7", "emoji": ""},
              {"id": "d", "text": "9", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "3 + 3 is a double! Think of 3 pairs of socks -- that is 6 socks!"
          },
          {
            "id": "add-5",
            "prompt": "What is 5 + 4?",
            "promptEmoji": "\ud83d\ude80",
            "options": [
              {"id": "a", "text": "8", "emoji": ""},
              {"id": "b", "text": "10", "emoji": ""},
              {"id": "c", "text": "9", "emoji": "\u2728"},
              {"id": "d", "text": "7", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Use your fingers! Hold up 5 on one hand and 4 on the other. Count them all!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- LESSON 3: Shape Detective (Math - Multiple Choice + Matching)
-- Type: matching_pairs widget
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0003-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  13,
  'Shape Detective!',
  'Match each shape to its name! Can you find all the pairs?',
  'Detective Chip needs your help! Someone mixed up all the shape labels at the Shape Museum! The circle sign is on the square display, and the triangle label fell behind the rectangle case. Can you match each shape back to the right name?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY['10000001-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each shape to its name!",
        "pairs": [
          {
            "id": "circle",
            "left": {"id": "circle-shape", "text": "Circle", "emoji": "\u2b55"},
            "right": {"id": "circle-name", "text": "Round like a ball", "emoji": "\ud83c\udfc0"}
          },
          {
            "id": "square",
            "left": {"id": "square-shape", "text": "Square", "emoji": "\ud83d\udfe7"},
            "right": {"id": "square-name", "text": "4 equal sides", "emoji": "\ud83d\uddbc\ufe0f"}
          },
          {
            "id": "triangle",
            "left": {"id": "triangle-shape", "text": "Triangle", "emoji": "\ud83d\udd3a"},
            "right": {"id": "triangle-name", "text": "3 sides and 3 corners", "emoji": "\ud83c\udfd4\ufe0f"}
          },
          {
            "id": "rectangle",
            "left": {"id": "rect-shape", "text": "Rectangle", "emoji": "\ud83d\udfe9"},
            "right": {"id": "rect-name", "text": "Like a door shape", "emoji": "\ud83d\udeaa"}
          }
        ],
        "hint": "Look at each shape carefully. A circle is round, a square has 4 equal sides..."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- LESSON 4: Letter Sounds (Reading - Flash Cards)
-- Type: flash_card widget
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0004-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  11,
  'Letter Sound Safari!',
  'Flip each card to discover what sound each letter makes!',
  'Welcome to the Letter Sound Safari! Chip found a magical deck of cards in the jungle. Each card has a letter on the front, but when you flip it over, you discover the sound it makes and a fun animal! Ready to explore?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0001-4000-8000-000000000001',
    '20000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn the letter sound!",
        "cards": [
          {
            "id": "letter-a",
            "front": {"text": "A", "emoji": "\ud83c\udf4e"},
            "back": {"text": "ah like Apple!", "emoji": "\ud83c\udf4e"}
          },
          {
            "id": "letter-b",
            "front": {"text": "B", "emoji": "\ud83d\udc3b"},
            "back": {"text": "buh like Bear!", "emoji": "\ud83d\udc3b"}
          },
          {
            "id": "letter-c",
            "front": {"text": "C", "emoji": "\ud83d\udc31"},
            "back": {"text": "kuh like Cat!", "emoji": "\ud83d\udc31"}
          },
          {
            "id": "letter-d",
            "front": {"text": "D", "emoji": "\ud83d\udc36"},
            "back": {"text": "duh like Dog!", "emoji": "\ud83d\udc36"}
          },
          {
            "id": "letter-e",
            "front": {"text": "E", "emoji": "\ud83d\udc18"},
            "back": {"text": "eh like Elephant!", "emoji": "\ud83d\udc18"}
          },
          {
            "id": "letter-f",
            "front": {"text": "F", "emoji": "\ud83d\udc38"},
            "back": {"text": "fff like Frog!", "emoji": "\ud83d\udc38"}
          }
        ]
      }
    ],
    "passingScore": 50,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- LESSON 5: Sight Words (Reading - Fill in Blank)
-- Type: fill_in_blank widget with word bank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0005-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  12,
  'Sight Word Sentences!',
  'Fill in the missing sight words to complete each sentence.',
  'Oh no! A gust of wind blew some words right out of Chip''s storybook! Can you help put the right words back in? Look at each sentence and pick the word that fits. You can use the word bank below to help!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY['20000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sight-1",
            "template": "I ___ a big red ball.",
            "correctAnswer": "see",
            "acceptableAnswers": ["See"],
            "wordBank": ["see", "the", "run", "go"],
            "hint": "Which word means to look at something? I ... a big red ball."
          },
          {
            "id": "sight-2",
            "template": "___ cat is sleeping.",
            "correctAnswer": "The",
            "acceptableAnswers": ["the"],
            "wordBank": ["The", "Go", "See", "And"],
            "hint": "Which word goes at the beginning of a sentence about a specific cat?"
          },
          {
            "id": "sight-3",
            "template": "We ___ to school.",
            "correctAnswer": "go",
            "acceptableAnswers": ["Go"],
            "wordBank": ["go", "the", "see", "is"],
            "hint": "Which word means to move somewhere? We ... to school."
          },
          {
            "id": "sight-4",
            "template": "I like red ___ blue.",
            "correctAnswer": "and",
            "acceptableAnswers": ["And"],
            "wordBank": ["and", "the", "is", "go"],
            "hint": "Which word connects two things together? Red ... blue."
          },
          {
            "id": "sight-5",
            "template": "The dog ___ happy.",
            "correctAnswer": "is",
            "acceptableAnswers": ["Is"],
            "wordBank": ["is", "and", "see", "go"],
            "hint": "Which word tells us what the dog feels? The dog ... happy."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- LESSON 6: Animal Homes (Science - Matching + Sequence)
-- Type: matching_pairs + sequence_order widgets (multi-activity lesson)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0006-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  11,
  'Animal Homes!',
  'Match animals to their homes, then put the food chain in order!',
  'Chip is making a nature documentary! First, help match each animal to where it lives. Then, put the food chain in order from smallest to biggest. Every creature has a special home -- let''s find out where they all belong!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0005-4000-8000-000000000001',
    '30000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each animal to its home!",
        "pairs": [
          {
            "id": "bird",
            "left": {"id": "bird-animal", "text": "Bird", "emoji": "\ud83d\udc26"},
            "right": {"id": "bird-home", "text": "Nest in a tree", "emoji": "\ud83c\udf33"}
          },
          {
            "id": "fish",
            "left": {"id": "fish-animal", "text": "Fish", "emoji": "\ud83d\udc1f"},
            "right": {"id": "fish-home", "text": "Lake or river", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "rabbit",
            "left": {"id": "rabbit-animal", "text": "Rabbit", "emoji": "\ud83d\udc30"},
            "right": {"id": "rabbit-home", "text": "Burrow underground", "emoji": "\ud83d\udd73\ufe0f"}
          },
          {
            "id": "bee",
            "left": {"id": "bee-animal", "text": "Bee", "emoji": "\ud83d\udc1d"},
            "right": {"id": "bee-home", "text": "Beehive", "emoji": "\ud83c\udf6f"}
          }
        ],
        "hint": "Think about where you would find each animal in nature!"
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "food-chain",
            "prompt": "Put the food chain in order from smallest to biggest!",
            "items": [
              {"id": "grass", "text": "Grass", "emoji": "\ud83c\udf31", "correctPosition": 1},
              {"id": "caterpillar", "text": "Caterpillar", "emoji": "\ud83d\udc1b", "correctPosition": 2},
              {"id": "bird-food", "text": "Bird", "emoji": "\ud83d\udc26", "correctPosition": 3},
              {"id": "cat-food", "text": "Cat", "emoji": "\ud83d\udc31", "correctPosition": 4}
            ],
            "hint": "What does a caterpillar eat? What eats a caterpillar? Think about who eats who!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
);
