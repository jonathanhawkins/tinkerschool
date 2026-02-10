-- =============================================================================
-- TinkerSchool -- Interactive Lessons Batch 2 (All 7 Subjects, Band 1)
-- =============================================================================
-- 18 browser-only interactive lessons covering all subjects.
-- Builds on 015_seed_interactive_lessons.sql (6 lessons for Math/Reading/Science).
--
-- Subject IDs / Module IDs (from 003_seed_1st_grade_curriculum.sql):
--   Math:             00000000-...-001 / 00000001-0001-...-001
--   Reading:          00000000-...-002 / 00000001-0002-...-001
--   Science:          00000000-...-003 / 00000001-0003-...-001
--   Music:            00000000-...-004 / 00000001-0004-...-001
--   Art:              00000000-...-005 / 00000001-0005-...-001
--   Problem Solving:  00000000-...-006 / 00000001-0006-...-001
--   Coding:           00000000-...-007 / 00000001-0007-...-001
-- =============================================================================


-- =========================================================================
-- MATH: Subtraction Snack Time (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0007-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  14,
  'Subtraction Snack Time!',
  'Help Chip figure out how many snacks are left after sharing!',
  'Chip packed a yummy lunch, but all the animal friends want to share! Help Chip figure out how many snacks are left after giving some away. Remember: subtraction means taking away!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY['10000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sub-1",
            "prompt": "Chip has 3 cookies. He gives 1 to Bear. How many are left?",
            "promptEmoji": "\ud83c\udf6a",
            "options": [
              {"id": "a", "text": "2", "emoji": "\u2728"},
              {"id": "b", "text": "3", "emoji": ""},
              {"id": "c", "text": "1", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Start with 3 cookies. Take away 1. Count what is left: 1, 2!"
          },
          {
            "id": "sub-2",
            "prompt": "There are 5 apples. Rabbit eats 2. How many are left?",
            "promptEmoji": "\ud83c\udf4e",
            "options": [
              {"id": "a", "text": "2", "emoji": ""},
              {"id": "b", "text": "3", "emoji": "\u2728"},
              {"id": "c", "text": "4", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "5 apples, take away 2: count 5, 4, 3. Three are left!"
          },
          {
            "id": "sub-3",
            "prompt": "Chip has 4 grapes. He drops 1. How many now?",
            "promptEmoji": "\ud83c\udf47",
            "options": [
              {"id": "a", "text": "3", "emoji": "\u2728"},
              {"id": "b", "text": "5", "emoji": ""},
              {"id": "c", "text": "2", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "4 take away 1 is... count backwards from 4!"
          },
          {
            "id": "sub-4",
            "prompt": "There are 6 bananas. Monkey takes 3. How many are left?",
            "promptEmoji": "\ud83c\udf4c",
            "options": [
              {"id": "a", "text": "2", "emoji": ""},
              {"id": "b", "text": "4", "emoji": ""},
              {"id": "c", "text": "3", "emoji": "\u2728"},
              {"id": "d", "text": "1", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Start at 6 and count back 3: 5, 4, 3!"
          },
          {
            "id": "sub-5",
            "prompt": "Chip has 7 strawberries. He shares 4 with Fox. How many left?",
            "promptEmoji": "\ud83c\udf53",
            "options": [
              {"id": "a", "text": "4", "emoji": ""},
              {"id": "b", "text": "2", "emoji": ""},
              {"id": "c", "text": "3", "emoji": "\u2728"},
              {"id": "d", "text": "5", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "7 minus 4: count back from 7... 6, 5, 4, 3!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- MATH: Number Patterns (sequence_order)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0008-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  15,
  'Number Train!',
  'Put the numbers in order to help the train leave the station!',
  'All aboard the Number Train! But oh no -- the train cars got all mixed up! Each car has a number on it. Can you put them in the right order so the train can leave the station?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY['10000001-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "train-1",
            "prompt": "Put the numbers in order from smallest to biggest!",
            "items": [
              {"id": "n1", "text": "1", "emoji": "\ud83d\ude83", "correctPosition": 1},
              {"id": "n3", "text": "3", "emoji": "\ud83d\ude83", "correctPosition": 2},
              {"id": "n5", "text": "5", "emoji": "\ud83d\ude83", "correctPosition": 3}
            ],
            "hint": "Which number comes first when you count? 1, then 3, then 5!"
          },
          {
            "id": "train-2",
            "prompt": "Put these numbers in order from smallest to biggest!",
            "items": [
              {"id": "n2", "text": "2", "emoji": "\ud83d\ude83", "correctPosition": 1},
              {"id": "n4", "text": "4", "emoji": "\ud83d\ude83", "correctPosition": 2},
              {"id": "n6", "text": "6", "emoji": "\ud83d\ude83", "correctPosition": 3},
              {"id": "n8", "text": "8", "emoji": "\ud83d\ude83", "correctPosition": 4}
            ],
            "hint": "Count by twos: 2, 4, 6, 8!"
          },
          {
            "id": "train-3",
            "prompt": "Now put these in order from BIGGEST to smallest!",
            "items": [
              {"id": "n10", "text": "10", "emoji": "\ud83d\ude82", "correctPosition": 1},
              {"id": "n7", "text": "7", "emoji": "\ud83d\ude82", "correctPosition": 2},
              {"id": "n4b", "text": "4", "emoji": "\ud83d\ude82", "correctPosition": 3},
              {"id": "n1b", "text": "1", "emoji": "\ud83d\ude82", "correctPosition": 4}
            ],
            "hint": "Start with the biggest number (10) and go down!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- READING: Rhyming Word Match (matching_pairs)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0009-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  13,
  'Rhyme Time!',
  'Match words that rhyme with each other!',
  'Chip loves making silly rhymes! Can you help match the words that sound alike at the end? Words that rhyme have the same ending sound, like "cat" and "hat"!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY['20000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each word to the word it rhymes with!",
        "pairs": [
          {
            "id": "cat-hat",
            "left": {"id": "cat", "text": "Cat", "emoji": "\ud83d\udc31"},
            "right": {"id": "hat", "text": "Hat", "emoji": "\ud83e\udde2"}
          },
          {
            "id": "dog-log",
            "left": {"id": "dog", "text": "Dog", "emoji": "\ud83d\udc36"},
            "right": {"id": "log", "text": "Log", "emoji": "\ud83e\udeb5"}
          },
          {
            "id": "sun-fun",
            "left": {"id": "sun", "text": "Sun", "emoji": "\u2600\ufe0f"},
            "right": {"id": "fun", "text": "Fun", "emoji": "\ud83c\udf89"}
          },
          {
            "id": "bee-tree",
            "left": {"id": "bee", "text": "Bee", "emoji": "\ud83d\udc1d"},
            "right": {"id": "tree", "text": "Tree", "emoji": "\ud83c\udf33"}
          }
        ],
        "hint": "Listen to the ending sound of each word. Cat ends with -at. Which other word ends with -at?"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- READING: CVC Word Builder (fill_in_blank)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000a-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  14,
  'Word Builder!',
  'Fill in the missing letter to complete each word!',
  'Chip is reading a book but some letters fell off the pages! Can you figure out which letter is missing in each word? Look at the picture for a clue!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY['20000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cvc-1",
            "template": "c ___ t",
            "correctAnswer": "a",
            "acceptableAnswers": ["A"],
            "wordBank": ["a", "i", "o", "u"],
            "hint": "Think of a furry pet that says meow! C-A-T!"
          },
          {
            "id": "cvc-2",
            "template": "d ___ g",
            "correctAnswer": "o",
            "acceptableAnswers": ["O"],
            "wordBank": ["a", "i", "o", "u"],
            "hint": "A pet that barks and wags its tail! D-O-G!"
          },
          {
            "id": "cvc-3",
            "template": "p ___ n",
            "correctAnswer": "i",
            "acceptableAnswers": ["I"],
            "wordBank": ["a", "i", "o", "e"],
            "hint": "Something pointy you can stick in a board! P-I-N!"
          },
          {
            "id": "cvc-4",
            "template": "b ___ s",
            "correctAnswer": "u",
            "acceptableAnswers": ["U"],
            "wordBank": ["a", "u", "o", "i"],
            "hint": "A big yellow vehicle that takes you to school! B-U-S!"
          },
          {
            "id": "cvc-5",
            "template": "h ___ n",
            "correctAnswer": "e",
            "acceptableAnswers": ["E"],
            "wordBank": ["a", "e", "i", "o"],
            "hint": "A bird on a farm that lays eggs! H-E-N!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- SCIENCE: Five Senses Explorer (multiple_choice + matching)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000b-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  12,
  'Five Senses Explorer!',
  'Learn about your five amazing senses and match them to body parts!',
  'Did you know you have FIVE super powers? They are called your senses! You can see, hear, smell, taste, and touch the world around you. Let''s explore each sense with Chip!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY['30000001-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each sense to the body part that uses it!",
        "pairs": [
          {
            "id": "see",
            "left": {"id": "see-sense", "text": "Seeing", "emoji": "\ud83d\udc40"},
            "right": {"id": "see-part", "text": "Eyes", "emoji": "\ud83d\udc41\ufe0f"}
          },
          {
            "id": "hear",
            "left": {"id": "hear-sense", "text": "Hearing", "emoji": "\ud83d\udd0a"},
            "right": {"id": "hear-part", "text": "Ears", "emoji": "\ud83d\udc42"}
          },
          {
            "id": "smell",
            "left": {"id": "smell-sense", "text": "Smelling", "emoji": "\ud83c\udf3a"},
            "right": {"id": "smell-part", "text": "Nose", "emoji": "\ud83d\udc43"}
          },
          {
            "id": "taste",
            "left": {"id": "taste-sense", "text": "Tasting", "emoji": "\ud83c\udf66"},
            "right": {"id": "taste-part", "text": "Tongue", "emoji": "\ud83d\udc45"}
          }
        ],
        "hint": "Think about which part of your body you use for each sense!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sense-q1",
            "prompt": "Which sense do you use to enjoy music?",
            "promptEmoji": "\ud83c\udfb5",
            "options": [
              {"id": "a", "text": "Hearing", "emoji": "\ud83d\udc42"},
              {"id": "b", "text": "Seeing", "emoji": "\ud83d\udc40"},
              {"id": "c", "text": "Tasting", "emoji": "\ud83d\udc45"}
            ],
            "correctOptionId": "a",
            "hint": "Music is made of sounds. Which body part helps you hear sounds?"
          },
          {
            "id": "sense-q2",
            "prompt": "Which sense tells you if ice cream is cold?",
            "promptEmoji": "\ud83c\udf68",
            "options": [
              {"id": "a", "text": "Smelling", "emoji": "\ud83d\udc43"},
              {"id": "b", "text": "Touch", "emoji": "\u270b"},
              {"id": "c", "text": "Hearing", "emoji": "\ud83d\udc42"}
            ],
            "correctOptionId": "b",
            "hint": "You feel hot and cold with your skin -- that is your sense of touch!"
          },
          {
            "id": "sense-q3",
            "prompt": "Which sense helps you read a book?",
            "promptEmoji": "\ud83d\udcda",
            "options": [
              {"id": "a", "text": "Tasting", "emoji": "\ud83d\udc45"},
              {"id": "b", "text": "Smelling", "emoji": "\ud83d\udc43"},
              {"id": "c", "text": "Seeing", "emoji": "\ud83d\udc40"}
            ],
            "correctOptionId": "c",
            "hint": "You look at the words on the page. Which sense lets you look at things?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
);


-- =========================================================================
-- SCIENCE: Weather Watch (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000c-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  13,
  'Weather Watch!',
  'Learn about different types of weather and what to wear!',
  'Chip is a weather reporter today! Help Chip learn about different kinds of weather. Sunny, rainy, snowy, windy -- each type of weather is special. Let''s find out what we should wear for each one!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY['30000001-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "weather-1",
            "prompt": "What should you wear on a rainy day?",
            "promptEmoji": "\ud83c\udf27\ufe0f",
            "options": [
              {"id": "a", "text": "Raincoat & boots", "emoji": "\ud83e\udde5"},
              {"id": "b", "text": "Swimsuit", "emoji": "\ud83e\ude71"},
              {"id": "c", "text": "Shorts & t-shirt", "emoji": "\ud83d\udc55"}
            ],
            "correctOptionId": "a",
            "hint": "When it rains, you need something to keep you dry!"
          },
          {
            "id": "weather-2",
            "prompt": "What falls from the sky when it is very cold?",
            "promptEmoji": "\u2744\ufe0f",
            "options": [
              {"id": "a", "text": "Rain", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "Snow", "emoji": "\u2603\ufe0f"},
              {"id": "c", "text": "Leaves", "emoji": "\ud83c\udf42"}
            ],
            "correctOptionId": "b",
            "hint": "When it is very very cold outside, water freezes into white fluffy flakes!"
          },
          {
            "id": "weather-3",
            "prompt": "Which weather makes puddles on the ground?",
            "promptEmoji": "\ud83d\udca6",
            "options": [
              {"id": "a", "text": "Sunny", "emoji": "\u2600\ufe0f"},
              {"id": "b", "text": "Windy", "emoji": "\ud83d\udca8"},
              {"id": "c", "text": "Rainy", "emoji": "\ud83c\udf27\ufe0f"}
            ],
            "correctOptionId": "c",
            "hint": "Puddles are made of water. Which weather brings water from the sky?"
          },
          {
            "id": "weather-4",
            "prompt": "What can you see in the sky after rain and sunshine together?",
            "promptEmoji": "\ud83c\udf08",
            "options": [
              {"id": "a", "text": "A rainbow!", "emoji": "\ud83c\udf08"},
              {"id": "b", "text": "A cloud", "emoji": "\u2601\ufe0f"},
              {"id": "c", "text": "The moon", "emoji": "\ud83c\udf19"}
            ],
            "correctOptionId": "a",
            "hint": "When sunlight shines through raindrops, it makes beautiful colors in the sky!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- SCIENCE: Plant Parts (matching + sequence)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000d-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  14,
  'Plant Parts!',
  'Learn the parts of a plant and how it grows from a tiny seed!',
  'Chip is growing a garden! But first, we need to learn about plants. Every plant has special parts that help it live and grow. And did you know every big tree started as a tiny seed?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY['30000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each plant part to what it does!",
        "pairs": [
          {
            "id": "roots",
            "left": {"id": "roots-part", "text": "Roots", "emoji": "\ud83e\udeb4"},
            "right": {"id": "roots-job", "text": "Drink water from soil", "emoji": "\ud83d\udca7"}
          },
          {
            "id": "stem",
            "left": {"id": "stem-part", "text": "Stem", "emoji": "\ud83c\udf3f"},
            "right": {"id": "stem-job", "text": "Hold the plant up", "emoji": "\u2b06\ufe0f"}
          },
          {
            "id": "leaves",
            "left": {"id": "leaves-part", "text": "Leaves", "emoji": "\ud83c\udf43"},
            "right": {"id": "leaves-job", "text": "Catch sunlight for food", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "flower",
            "left": {"id": "flower-part", "text": "Flower", "emoji": "\ud83c\udf3b"},
            "right": {"id": "flower-job", "text": "Make seeds for new plants", "emoji": "\ud83c\udf31"}
          }
        ],
        "hint": "Think about what each part needs to do to help the plant survive!"
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "grow-order",
            "prompt": "Put the plant growth stages in order!",
            "items": [
              {"id": "seed", "text": "Seed", "emoji": "\ud83c\udf31", "correctPosition": 1},
              {"id": "sprout", "text": "Sprout", "emoji": "\ud83c\udf3f", "correctPosition": 2},
              {"id": "plant", "text": "Plant", "emoji": "\ud83c\udf3e", "correctPosition": 3},
              {"id": "flower", "text": "Flower", "emoji": "\ud83c\udf3b", "correctPosition": 4}
            ],
            "hint": "A plant starts as a tiny seed, then grows into a sprout, then a plant, then flowers!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
);


-- =========================================================================
-- MUSIC: High and Low Sounds (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000e-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  11,
  'High and Low Sounds!',
  'Can you tell which sounds are high and which are low?',
  'Chip is learning about music! Some sounds are HIGH like a tiny bird chirping, and some sounds are LOW like a big bear growling. Let''s figure out which animals and things make high or low sounds!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY['40000001-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pitch-1",
            "prompt": "A tiny bird chirping makes a ___ sound.",
            "promptEmoji": "\ud83d\udc26",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Small animals usually make high-pitched sounds. Tweet tweet!"
          },
          {
            "id": "pitch-2",
            "prompt": "A big bear growling makes a ___ sound.",
            "promptEmoji": "\ud83d\udc3b",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Big animals usually make low, deep sounds. GRRRR!"
          },
          {
            "id": "pitch-3",
            "prompt": "A whistle makes a ___ sound.",
            "promptEmoji": "\ud83d\udcef",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Think about a referee blowing a whistle -- FWEEET! That is a high sound!"
          },
          {
            "id": "pitch-4",
            "prompt": "Thunder in a storm makes a ___ sound.",
            "promptEmoji": "\u26a1",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "BOOOOM! Thunder is a deep, rumbly, low sound!"
          },
          {
            "id": "pitch-5",
            "prompt": "A baby kitten meowing makes a ___ sound.",
            "promptEmoji": "\ud83d\udc31",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Kittens are tiny and make squeaky, high-pitched meows!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- MUSIC: Musical Note Names (flash_card)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-000f-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  12,
  'Do Re Mi!',
  'Learn the musical note names with fun memory tricks!',
  'Every song is made of special notes called Do, Re, Mi, Fa, Sol, La, Ti! Each note has its own sound. Flip each card to learn a fun way to remember it!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY['40000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn the musical notes!",
        "cards": [
          {
            "id": "note-do",
            "front": {"text": "Do", "emoji": "\ud83c\udfb5"},
            "back": {"text": "Do - a deer, a female deer!", "emoji": "\ud83e\udd8c"}
          },
          {
            "id": "note-re",
            "front": {"text": "Re", "emoji": "\ud83c\udfb6"},
            "back": {"text": "Re - a drop of golden sun!", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "note-mi",
            "front": {"text": "Mi", "emoji": "\ud83c\udfb5"},
            "back": {"text": "Mi - a name I call myself!", "emoji": "\ud83d\ude4b"}
          },
          {
            "id": "note-fa",
            "front": {"text": "Fa", "emoji": "\ud83c\udfb6"},
            "back": {"text": "Fa - a long long way to run!", "emoji": "\ud83c\udfc3"}
          },
          {
            "id": "note-sol",
            "front": {"text": "Sol", "emoji": "\ud83c\udfb5"},
            "back": {"text": "Sol - a needle pulling thread!", "emoji": "\ud83e\udea1"}
          }
        ]
      }
    ],
    "passingScore": 50,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- ART: Color Mixing Magic (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0010-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  11,
  'Color Mixing Magic!',
  'Mix colors together and discover what new colors you can make!',
  'Chip found three magic paint bottles: RED, BLUE, and YELLOW! When you mix two colors together, something amazing happens -- you get a brand new color! Let''s see what happens when we mix them!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY['50000001-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mix-1",
            "prompt": "What color do you get when you mix RED + BLUE?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Purple", "emoji": "\ud83d\udc9c"},
              {"id": "b", "text": "Green", "emoji": "\ud83d\udc9a"},
              {"id": "c", "text": "Orange", "emoji": "\ud83e\udde1"}
            ],
            "correctOptionId": "a",
            "hint": "Red and blue together make a royal color that grapes are!"
          },
          {
            "id": "mix-2",
            "prompt": "What color do you get when you mix RED + YELLOW?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Green", "emoji": "\ud83d\udc9a"},
              {"id": "b", "text": "Orange", "emoji": "\ud83e\udde1"},
              {"id": "c", "text": "Purple", "emoji": "\ud83d\udc9c"}
            ],
            "correctOptionId": "b",
            "hint": "Think about the color of a pumpkin or a carrot!"
          },
          {
            "id": "mix-3",
            "prompt": "What color do you get when you mix BLUE + YELLOW?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Orange", "emoji": "\ud83e\udde1"},
              {"id": "b", "text": "Purple", "emoji": "\ud83d\udc9c"},
              {"id": "c", "text": "Green", "emoji": "\ud83d\udc9a"}
            ],
            "correctOptionId": "c",
            "hint": "Think about the color of grass and leaves!"
          },
          {
            "id": "mix-4",
            "prompt": "Which colors do you mix to make GREEN?",
            "promptEmoji": "\ud83d\udc9a",
            "options": [
              {"id": "a", "text": "Red + Blue", "emoji": ""},
              {"id": "b", "text": "Red + Yellow", "emoji": ""},
              {"id": "c", "text": "Blue + Yellow", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "We just learned this! Blue + Yellow = ?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- ART: Shape Patterns (sequence_order)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0011-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  12,
  'Pattern Parade!',
  'Complete the pattern by putting shapes in the right order!',
  'Chip is decorating a parade float! The float has a beautiful pattern of shapes on it, but some shapes fell off! Can you figure out the pattern and put them back in order?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY['50000001-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pattern-1",
            "prompt": "What comes next? Circle, Square, Circle, Square, ...",
            "items": [
              {"id": "p1-circle", "text": "Circle", "emoji": "\u2b55", "correctPosition": 1},
              {"id": "p1-square", "text": "Square", "emoji": "\ud83d\udfe6", "correctPosition": 2},
              {"id": "p1-circle2", "text": "Circle", "emoji": "\u2b55", "correctPosition": 3}
            ],
            "hint": "The pattern goes: Circle, Square, Circle, Square. It keeps repeating!"
          },
          {
            "id": "pattern-2",
            "prompt": "Put these in pattern order: Red, Blue, Red, Blue...",
            "items": [
              {"id": "p2-red", "text": "Red", "emoji": "\ud83d\udd34", "correctPosition": 1},
              {"id": "p2-blue", "text": "Blue", "emoji": "\ud83d\udd35", "correctPosition": 2},
              {"id": "p2-red2", "text": "Red", "emoji": "\ud83d\udd34", "correctPosition": 3},
              {"id": "p2-blue2", "text": "Blue", "emoji": "\ud83d\udd35", "correctPosition": 4}
            ],
            "hint": "The pattern alternates: Red, Blue, Red, Blue!"
          },
          {
            "id": "pattern-3",
            "prompt": "Complete: Star, Star, Heart, Star, Star, Heart...",
            "items": [
              {"id": "p3-star1", "text": "Star", "emoji": "\u2b50", "correctPosition": 1},
              {"id": "p3-star2", "text": "Star", "emoji": "\u2b50", "correctPosition": 2},
              {"id": "p3-heart", "text": "Heart", "emoji": "\u2764\ufe0f", "correctPosition": 3}
            ],
            "hint": "Two stars, then one heart. Two stars, then one heart!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING: Pattern Detective (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0012-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  11,
  'Pattern Detective!',
  'Find the hidden pattern and figure out what comes next!',
  'Detective Chip is on the case! Someone has been leaving mysterious patterns everywhere. Can you crack the code and figure out what comes next in each pattern?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY['60000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pat-1",
            "prompt": "What comes next? 1, 2, 3, 4, ___",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "5", "emoji": "\u2728"},
              {"id": "b", "text": "3", "emoji": ""},
              {"id": "c", "text": "6", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Count up by ones: 1, 2, 3, 4... what number comes after 4?"
          },
          {
            "id": "pat-2",
            "prompt": "What comes next? 2, 4, 6, 8, ___",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "9", "emoji": ""},
              {"id": "b", "text": "10", "emoji": "\u2728"},
              {"id": "c", "text": "12", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "These numbers skip by 2 each time. 8 + 2 = ?"
          },
          {
            "id": "pat-3",
            "prompt": "What comes next? A, B, A, B, A, ___",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "A", "emoji": ""},
              {"id": "b", "text": "C", "emoji": ""},
              {"id": "c", "text": "B", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "The pattern goes A, B, A, B, A... it keeps switching between A and B!"
          },
          {
            "id": "pat-4",
            "prompt": "What comes next? Sun, Moon, Sun, Moon, ___",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "Sun", "emoji": "\u2600\ufe0f"},
              {"id": "b", "text": "Star", "emoji": "\u2b50"},
              {"id": "c", "text": "Moon", "emoji": "\ud83c\udf19"}
            ],
            "correctOptionId": "a",
            "hint": "Sun, Moon, Sun, Moon... it keeps going back and forth!"
          },
          {
            "id": "pat-5",
            "prompt": "What comes next? 10, 20, 30, 40, ___",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "45", "emoji": ""},
              {"id": "b", "text": "50", "emoji": "\u2728"},
              {"id": "c", "text": "100", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Counting by tens: 10, 20, 30, 40... add 10 more!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING: Sort It Out (matching_pairs)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0013-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  12,
  'Sort It Out!',
  'Match each item to the group it belongs to!',
  'Chip''s toy box is a mess! Can you help sort everything? Match each thing to the group where it belongs. Some things are animals, some are foods, and some are vehicles!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY['60000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each item to its category!",
        "pairs": [
          {
            "id": "dog-animal",
            "left": {"id": "dog-item", "text": "Dog", "emoji": "\ud83d\udc36"},
            "right": {"id": "animal-cat", "text": "Animal", "emoji": "\ud83d\udc3e"}
          },
          {
            "id": "apple-food",
            "left": {"id": "apple-item", "text": "Apple", "emoji": "\ud83c\udf4e"},
            "right": {"id": "food-cat", "text": "Food", "emoji": "\ud83c\udf7d\ufe0f"}
          },
          {
            "id": "car-vehicle",
            "left": {"id": "car-item", "text": "Car", "emoji": "\ud83d\ude97"},
            "right": {"id": "vehicle-cat", "text": "Vehicle", "emoji": "\ud83d\ude8c"}
          },
          {
            "id": "flower-plant",
            "left": {"id": "flower-item", "text": "Flower", "emoji": "\ud83c\udf3b"},
            "right": {"id": "plant-cat", "text": "Plant", "emoji": "\ud83c\udf3f"}
          }
        ],
        "hint": "Think about what each item IS. A dog is an animal, an apple is a food..."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING: Story Order (sequence_order)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0014-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  13,
  'Story Time Order!',
  'Put the story events in the right order!',
  'Chip is writing a story but the pages got mixed up! Can you put the events in the right order so the story makes sense? Think about what happens first, next, and last!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY['60000001-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "story-morning",
            "prompt": "Put the morning routine in order!",
            "items": [
              {"id": "wake", "text": "Wake up", "emoji": "\u23f0", "correctPosition": 1},
              {"id": "brush", "text": "Brush teeth", "emoji": "\ud83e\udea5", "correctPosition": 2},
              {"id": "eat", "text": "Eat breakfast", "emoji": "\ud83e\udd5e", "correctPosition": 3},
              {"id": "school", "text": "Go to school", "emoji": "\ud83c\udfeb", "correctPosition": 4}
            ],
            "hint": "Think about your own morning! What do you do first when you open your eyes?"
          },
          {
            "id": "story-plant",
            "prompt": "Put the steps to grow a flower in order!",
            "items": [
              {"id": "dig", "text": "Dig a hole", "emoji": "\ud83e\udea3", "correctPosition": 1},
              {"id": "plant", "text": "Plant the seed", "emoji": "\ud83c\udf31", "correctPosition": 2},
              {"id": "water", "text": "Water it every day", "emoji": "\ud83d\udca7", "correctPosition": 3},
              {"id": "bloom", "text": "Watch it bloom!", "emoji": "\ud83c\udf3b", "correctPosition": 4}
            ],
            "hint": "First you need to make space in the dirt, then put the seed in, then give it water!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- CODING: What Is a Computer? (flash_card + multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0015-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  11,
  'What Is a Computer?',
  'Learn what makes something a computer and find computers all around you!',
  'Chip IS a computer! But did you know computers are everywhere? A computer is anything that can take instructions, think about them, and do something. Your M5Stick is a tiny computer! Let''s find out more!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY['70000001-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about computer parts!",
        "cards": [
          {
            "id": "part-input",
            "front": {"text": "Input", "emoji": "\u2328\ufe0f"},
            "back": {"text": "How you TELL the computer what to do! Like a keyboard or button.", "emoji": "\ud83d\udc46"}
          },
          {
            "id": "part-output",
            "front": {"text": "Output", "emoji": "\ud83d\udcfa"},
            "back": {"text": "How the computer SHOWS you things! Like a screen or speaker.", "emoji": "\ud83d\udd0a"}
          },
          {
            "id": "part-brain",
            "front": {"text": "Processor", "emoji": "\ud83e\udde0"},
            "back": {"text": "The computer''s BRAIN! It thinks and follows instructions.", "emoji": "\ud83d\udca1"}
          },
          {
            "id": "part-memory",
            "front": {"text": "Memory", "emoji": "\ud83d\udcbe"},
            "back": {"text": "Where the computer REMEMBERS things! Like your brain remembers your name.", "emoji": "\ud83d\uddd3\ufe0f"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "comp-1",
            "prompt": "Which of these is a computer?",
            "promptEmoji": "\ud83d\udcbb",
            "options": [
              {"id": "a", "text": "A rock", "emoji": "\ud83e\udea8"},
              {"id": "b", "text": "A tablet", "emoji": "\ud83d\udcf1"},
              {"id": "c", "text": "A pencil", "emoji": "\u270f\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "A computer can take instructions and do things. Which one has a screen and buttons?"
          },
          {
            "id": "comp-2",
            "prompt": "What is the keyboard on a computer for?",
            "promptEmoji": "\u2328\ufe0f",
            "options": [
              {"id": "a", "text": "Input - telling the computer what to do", "emoji": "\ud83d\udc46"},
              {"id": "b", "text": "Output - showing you things", "emoji": "\ud83d\udcfa"},
              {"id": "c", "text": "Memory - remembering things", "emoji": "\ud83e\udde0"}
            ],
            "correctOptionId": "a",
            "hint": "When you press keys, you are TELLING the computer something. That is called input!"
          },
          {
            "id": "comp-3",
            "prompt": "Your M5Stick has a tiny screen. The screen is a type of...",
            "promptEmoji": "\ud83d\udcdf",
            "options": [
              {"id": "a", "text": "Input", "emoji": "\u2328\ufe0f"},
              {"id": "b", "text": "Output", "emoji": "\ud83d\udcfa"},
              {"id": "c", "text": "Processor", "emoji": "\ud83e\udde0"}
            ],
            "correctOptionId": "b",
            "hint": "The screen SHOWS you things. When a computer shows you something, that is output!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
);


-- =========================================================================
-- CODING: Follow the Instructions (sequence_order)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0016-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  12,
  'Follow the Instructions!',
  'Learn that computers follow instructions in a specific order!',
  'Computers can only do what you tell them -- and they follow instructions in ORDER, step by step! If you mix up the steps, things go wrong. Can you put these instructions in the right order?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY['70000001-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "inst-sandwich",
            "prompt": "Tell the robot how to make a sandwich! Put the steps in order.",
            "items": [
              {"id": "s1", "text": "Get two slices of bread", "emoji": "\ud83c\udf5e", "correctPosition": 1},
              {"id": "s2", "text": "Put peanut butter on one slice", "emoji": "\ud83e\udd5c", "correctPosition": 2},
              {"id": "s3", "text": "Put jelly on the other slice", "emoji": "\ud83c\udf53", "correctPosition": 3},
              {"id": "s4", "text": "Put the slices together", "emoji": "\ud83e\udd6a", "correctPosition": 4}
            ],
            "hint": "First you need bread, then add the fillings, then put it all together!"
          },
          {
            "id": "inst-drawing",
            "prompt": "Tell the robot how to draw a face! Put the steps in order.",
            "items": [
              {"id": "d1", "text": "Draw a big circle", "emoji": "\u2b55", "correctPosition": 1},
              {"id": "d2", "text": "Add two eyes", "emoji": "\ud83d\udc40", "correctPosition": 2},
              {"id": "d3", "text": "Draw a nose", "emoji": "\ud83d\udc43", "correctPosition": 3},
              {"id": "d4", "text": "Add a smile", "emoji": "\ud83d\ude0a", "correctPosition": 4}
            ],
            "hint": "Start with the face shape (circle), then add features from top to bottom!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- READING: Story Sequencing (sequence_order)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0017-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  15,
  'The Three Bears!',
  'Put the famous story events in the right order!',
  'Do you know the story of Goldilocks and the Three Bears? Chip loves this story! But the pages got all mixed up. Can you put the events back in the right order?',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY['20000001-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "bears-story",
            "prompt": "Put the story of Goldilocks in order!",
            "items": [
              {"id": "b1", "text": "Bears go for a walk", "emoji": "\ud83d\udc3b", "correctPosition": 1},
              {"id": "b2", "text": "Goldilocks finds the house", "emoji": "\ud83c\udfe0", "correctPosition": 2},
              {"id": "b3", "text": "She eats the porridge", "emoji": "\ud83c\udf5c", "correctPosition": 3},
              {"id": "b4", "text": "She falls asleep in a bed", "emoji": "\ud83d\udecf\ufe0f", "correctPosition": 4},
              {"id": "b5", "text": "The bears come home!", "emoji": "\ud83d\ude31", "correctPosition": 5}
            ],
            "hint": "First the bears leave, then Goldilocks arrives. She eats, then sleeps, then the bears come back!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);


-- =========================================================================
-- MUSIC: Fast and Slow (multiple_choice)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000001-0018-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  13,
  'Fast and Slow!',
  'Learn about tempo -- how fast or slow music plays!',
  'Music can be FAST like a race car or SLOW like a lazy river! The speed of music is called TEMPO. Let''s figure out which songs and activities are fast and which are slow!',
  NULL, NULL, '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY['40000001-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tempo-1",
            "prompt": "A lullaby that helps you sleep has a ___ tempo.",
            "promptEmoji": "\ud83c\udfb6",
            "options": [
              {"id": "a", "text": "Fast", "emoji": "\ud83c\udfc3"},
              {"id": "b", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "b",
            "hint": "Lullabies are gentle and slow to help you relax and fall asleep."
          },
          {
            "id": "tempo-2",
            "prompt": "A march that soldiers walk to has a ___ tempo.",
            "promptEmoji": "\ud83e\udd41",
            "options": [
              {"id": "a", "text": "Fast", "emoji": "\ud83c\udfc3"},
              {"id": "b", "text": "Slow", "emoji": "\ud83d\udc22"},
              {"id": "c", "text": "Medium (steady)", "emoji": "\ud83d\udeb6"}
            ],
            "correctOptionId": "c",
            "hint": "Soldiers march at a steady, regular pace -- not too fast, not too slow!"
          },
          {
            "id": "tempo-3",
            "prompt": "A song that makes you want to dance and jump has a ___ tempo.",
            "promptEmoji": "\ud83d\udd7a",
            "options": [
              {"id": "a", "text": "Fast", "emoji": "\ud83c\udfc3"},
              {"id": "b", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "a",
            "hint": "When you hear music that makes you want to move and jump, it is usually fast!"
          },
          {
            "id": "tempo-4",
            "prompt": "If a turtle were a song, would it be fast or slow?",
            "promptEmoji": "\ud83d\udc22",
            "options": [
              {"id": "a", "text": "Fast", "emoji": "\ud83c\udfc3"},
              {"id": "b", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "b",
            "hint": "Turtles move very slowly, so a turtle song would be slow too!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
);
