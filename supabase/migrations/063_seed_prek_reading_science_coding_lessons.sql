-- =============================================================================
-- TinkerSchool -- Seed Pre-K Reading, Science & Coding Lessons
-- =============================================================================
-- 15 browser-only interactive lessons for Pre-K (Band 0, Ages 3-5):
--   - 5 Reading "Story Time" lessons
--   - 5 Science "Wonder Lab" lessons
--   - 5 Coding  "Step by Step" lessons
--
-- Widget types used: flash_card, parent_activity, matching_pairs,
--   listen_and_find, trace_shape, multiple_choice, tap_and_reveal,
--   drag_to_sort, sequence_order
--
-- Depends on:
--   - 001_initial_schema.sql (lessons table)
--   - 002_tinkerschool_multi_subject.sql (subject_id, skills_covered, etc.)
--   - 058_seed_prek_skills.sql (Pre-K skills for reading, science, coding)
--   - 060_seed_prek_modules.sql (Pre-K modules)
--
-- Subject IDs:
--   Reading:  00000000-0000-4000-8000-000000000002
--   Science:  00000000-0000-4000-8000-000000000003
--   Coding:   00000000-0000-4000-8000-000000000007
--
-- Module IDs:
--   Story Time:    00000000-0000-4000-8000-000000000102
--   Wonder Lab:    00000000-0000-4000-8000-000000000103
--   Step by Step:  00000000-0000-4000-8000-000000000107
--
-- Reading Skill IDs:
--   Letter Recognition:        20000000-0002-4000-8000-000000000001
--   Rhyme Recognition:         20000000-0004-4000-8000-000000000001
--   Beginning Sound Awareness: 20000000-0003-4000-8000-000000000001
--   Listening Comprehension:   20000000-0006-4000-8000-000000000001
--
-- Science Skill IDs:
--   Animal Sounds and Homes:   30000000-0006-4000-8000-000000000001
--   Weather Awareness:         30000000-0005-4000-8000-000000000001
--   Cause and Effect:          30000000-0003-4000-8000-000000000001
--   Using Senses:              30000000-0001-4000-8000-000000000001
--   Living vs. Non-Living:     30000000-0004-4000-8000-000000000001
--
-- Coding Skill IDs:
--   Sequencing:                70000000-0001-4000-8000-000000000001
--   Cause and Effect:          70000000-0002-4000-8000-000000000001
--   Simple Directions:         70000000-0003-4000-8000-000000000001
--   Repeating Patterns:        70000000-0004-4000-8000-000000000001
--   Matching Input to Output:  70000000-0005-4000-8000-000000000001
--
-- Reading Lesson IDs:  b0000002-0001 through b0000002-0005
-- Science Lesson IDs:  b0000003-0001 through b0000003-0005
-- Coding Lesson IDs:   b0000007-0001 through b0000007-0005
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- *************************************************************************
--
--  PART A: READING "STORY TIME" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- READING LESSON 1: Letters All Around
-- Module: Story Time
-- Widgets: flash_card + parent_activity
-- Skills: Letter Recognition
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000002-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  1,
  'Letters All Around',
  'Meet the first five letters of the alphabet! Flip the cards to learn A, B, C, D, and E.',
  'Hi friend! Chip loves letters! Letters are everywhere — on signs, books, and cereal boxes! Let''s flip some cards and learn the first five letters together!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn the letter! Say its name out loud!",
        "cards": [
          {
            "id": "letter-a",
            "front": {"text": "What letter is this?", "emoji": "🅰️"},
            "back": {"text": "A! A is for Apple! 🍎", "emoji": "🍎"},
            "color": "#EF4444"
          },
          {
            "id": "letter-b",
            "front": {"text": "What letter is this?", "emoji": "🅱️"},
            "back": {"text": "B! B is for Bear! 🐻", "emoji": "🐻"},
            "color": "#3B82F6"
          },
          {
            "id": "letter-c",
            "front": {"text": "What letter is this?", "emoji": "©️"},
            "back": {"text": "C! C is for Cat! 🐱", "emoji": "🐱"},
            "color": "#22C55E"
          },
          {
            "id": "letter-d",
            "front": {"text": "Can you name this letter?"},
            "back": {"text": "D! D is for Dog! 🐶", "emoji": "🐶"},
            "color": "#A855F7"
          },
          {
            "id": "letter-e",
            "front": {"text": "One more! What letter?"},
            "back": {"text": "E! E is for Elephant! 🐘", "emoji": "🐘"},
            "color": "#F97316"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Go on a letter hunt! Walk around your home and find the letter A on a cereal box, book, or sign. Then look for B and C too! Point to each one and say the letter name together.",
        "parentTip": "Focus on uppercase letters first — they are easier for little ones to recognize. Celebrate each letter found! You can make it a game: ''I spy the letter A!''",
        "completionPrompt": "Did you find letters A, B, and C around the house?",
        "illustration": "🔤"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 2: Rhyme Time
-- Module: Story Time
-- Widgets: matching_pairs + listen_and_find
-- Skills: Rhyme Recognition
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000002-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  2,
  'Rhyme Time',
  'Match words that rhyme! Cat and hat, star and car — can you hear which words sound the same?',
  'Listen up, friend! Chip has a game — it''s all about words that sound the SAME at the end! Cat and hat both end with -at! Let''s find more rhyming pairs!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000000-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match the words that rhyme! They sound the same at the end.",
        "pairs": [
          {
            "id": "rhyme-cat-hat",
            "left": {"id": "cat", "text": "Cat", "emoji": "🐱"},
            "right": {"id": "hat", "text": "Hat", "emoji": "🎩"}
          },
          {
            "id": "rhyme-star-car",
            "left": {"id": "star", "text": "Star", "emoji": "⭐"},
            "right": {"id": "car", "text": "Car", "emoji": "🚗"}
          },
          {
            "id": "rhyme-fish-dish",
            "left": {"id": "fish", "text": "Fish", "emoji": "🐟"},
            "right": {"id": "dish", "text": "Dish", "emoji": "🍽️"}
          }
        ],
        "hint": "Listen to the end of each word. Cat ends with -at. Which other word ends with -at?"
      },
      {
        "type": "listen_and_find",
        "questions": [
          {
            "id": "rhyme-listen-1",
            "prompt": "Which word rhymes with ''ball''?",
            "spokenText": "Ball! Which word rhymes with ball? They sound the same at the end!",
            "correctOptionId": "wall",
            "options": [
              {"id": "wall", "emoji": "🧱", "label": "Wall"},
              {"id": "dog", "emoji": "🐶", "label": "Dog"},
              {"id": "cup", "emoji": "🥤", "label": "Cup"}
            ]
          },
          {
            "id": "rhyme-listen-2",
            "prompt": "Which word rhymes with ''bug''?",
            "spokenText": "Bug! Which word rhymes with bug?",
            "correctOptionId": "rug",
            "options": [
              {"id": "sun", "emoji": "☀️", "label": "Sun"},
              {"id": "rug", "emoji": "🟫", "label": "Rug"},
              {"id": "bird", "emoji": "🐦", "label": "Bird"}
            ]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 3: What Sound?
-- Module: Story Time
-- Widgets: listen_and_find + parent_activity
-- Skills: Beginning Sound Awareness
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000002-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  3,
  'What Sound?',
  'Listen for the first sound in a word! What starts with /b/? What starts with /s/?',
  'Chip has super listening ears today! Every word starts with a special sound. Ball starts with /b/! Sun starts with /s/! Let''s listen carefully and find the right one!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000000-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "listen_and_find",
        "questions": [
          {
            "id": "sound-b",
            "prompt": "What starts with the /b/ sound?",
            "spokenText": "Buh! Buh! What starts with the /b/ sound? Listen: /b/ /b/ ball!",
            "correctOptionId": "ball",
            "options": [
              {"id": "ball", "emoji": "⚽", "label": "Ball"},
              {"id": "cat", "emoji": "🐱", "label": "Cat"},
              {"id": "sun", "emoji": "☀️", "label": "Sun"},
              {"id": "fish", "emoji": "🐟", "label": "Fish"}
            ]
          },
          {
            "id": "sound-s",
            "prompt": "What starts with the /s/ sound?",
            "spokenText": "Ssss! Ssss! What starts with the /s/ sound? Listen: /s/ /s/ sun!",
            "correctOptionId": "sun",
            "options": [
              {"id": "dog", "emoji": "🐶", "label": "Dog"},
              {"id": "sun", "emoji": "☀️", "label": "Sun"},
              {"id": "hat", "emoji": "🎩", "label": "Hat"},
              {"id": "tree", "emoji": "🌳", "label": "Tree"}
            ]
          },
          {
            "id": "sound-m",
            "prompt": "What starts with the /m/ sound?",
            "spokenText": "Mmm! Mmm! What starts with the /m/ sound? Listen: /m/ /m/ moon!",
            "correctOptionId": "moon",
            "options": [
              {"id": "car", "emoji": "🚗", "label": "Car"},
              {"id": "book", "emoji": "📚", "label": "Book"},
              {"id": "moon", "emoji": "🌙", "label": "Moon"},
              {"id": "pen", "emoji": "🖊️", "label": "Pen"}
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play the /b/ game! Walk around and find things that start with the B sound: ball, book, banana, bed, bear, button! Say each word slowly and emphasize the first sound: /b/ /b/ ball!",
        "parentTip": "Use the letter SOUND, not the letter NAME. Say /b/ (like the start of ''ball''), not ''bee.'' This phonemic awareness is the foundation of reading.",
        "completionPrompt": "Did you find things that start with the /b/ sound?",
        "illustration": "🔊"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 4: Trace Your Letters
-- Module: Story Time
-- Widgets: trace_shape + flash_card
-- Skills: Letter Recognition
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000002-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  4,
  'Trace Your Letters',
  'Practice tracing letters with your finger! Then learn five more letters: F, G, H, I, and J.',
  'Time to draw letters, friend! Use your finger to trace along the dotted lines. Then Chip has five MORE letters for you to learn! Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "trace_shape",
        "questions": [
          {
            "id": "trace-a",
            "prompt": "Trace the letter A!",
            "shape": "A",
            "strokeColor": "#22C55E",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-b",
            "prompt": "Trace the letter B!",
            "shape": "B",
            "strokeColor": "#3B82F6",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-c",
            "prompt": "Trace the letter C!",
            "shape": "C",
            "strokeColor": "#A855F7",
            "traceColor": "#F97316"
          }
        ]
      },
      {
        "type": "flash_card",
        "prompt": "Five more letters! Flip each card to learn them!",
        "cards": [
          {
            "id": "letter-f",
            "front": {"text": "What letter is this?"},
            "back": {"text": "F! F is for Fish! 🐟", "emoji": "🐟"},
            "color": "#3B82F6"
          },
          {
            "id": "letter-g",
            "front": {"text": "What letter is this?"},
            "back": {"text": "G! G is for Grapes! 🍇", "emoji": "🍇"},
            "color": "#A855F7"
          },
          {
            "id": "letter-h",
            "front": {"text": "What letter is this?"},
            "back": {"text": "H! H is for House! 🏠", "emoji": "🏠"},
            "color": "#EF4444"
          },
          {
            "id": "letter-i",
            "front": {"text": "What letter is this?"},
            "back": {"text": "I! I is for Ice cream! 🍦", "emoji": "🍦"},
            "color": "#EC4899"
          },
          {
            "id": "letter-j",
            "front": {"text": "What letter is this?"},
            "back": {"text": "J! J is for Jellyfish! 🪼", "emoji": "🪼"},
            "color": "#14B8A6"
          }
        ],
        "shuffleCards": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 5: Story Questions
-- Module: Story Time
-- Widgets: multiple_choice + parent_activity
-- Skills: Listening Comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000002-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  5,
  'Story Questions',
  'Listen to a short story and answer questions about it! Where did the bunny go?',
  'Chip loves story time! Let me tell you a little story, and then you answer some questions about it. Ready? Let''s listen carefully!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000000-0006-4000-8000-000000000001'
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
            "id": "story-bunny",
            "prompt": "The bunny hopped to the garden. Where did the bunny go?",
            "promptEmoji": "🐰",
            "options": [
              {"id": "garden", "text": "The garden", "emoji": "🌻"},
              {"id": "store", "text": "The store", "emoji": "🏪"}
            ],
            "correctOptionId": "garden",
            "hint": "Listen again: The bunny hopped to the GARDEN."
          },
          {
            "id": "story-bear",
            "prompt": "The bear ate honey and fell asleep. What did the bear eat?",
            "promptEmoji": "🐻",
            "options": [
              {"id": "pizza", "text": "Pizza", "emoji": "🍕"},
              {"id": "honey", "text": "Honey", "emoji": "🍯"}
            ],
            "correctOptionId": "honey",
            "hint": "The bear ate something sweet — honey!"
          },
          {
            "id": "story-bird",
            "prompt": "The bird sang a song in the tree. Where was the bird?",
            "promptEmoji": "🐦",
            "options": [
              {"id": "water", "text": "In the water", "emoji": "🌊"},
              {"id": "tree", "text": "In the tree", "emoji": "🌳"}
            ],
            "correctOptionId": "tree",
            "hint": "The bird sang a song in the... tree!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Read a favorite book together. After reading, ask your child simple questions: Who was in the story? What happened? Where did they go? Let your child point to the pictures for clues!",
        "parentTip": "Asking ''who, what, where'' questions builds comprehension. Don''t worry about ''right'' answers — the goal is getting your child to think about the story. Praise any answer that shows they were listening!",
        "completionPrompt": "Did you read a book and talk about the story together?",
        "illustration": "📖"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- *************************************************************************
--
--  PART B: SCIENCE "WONDER LAB" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- SCIENCE LESSON 1: Animal Sounds
-- Module: Wonder Lab
-- Widgets: listen_and_find + parent_activity
-- Skills: Animal Sounds and Homes
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000003-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  1,
  'Animal Sounds',
  'Hear an animal sound and find which animal makes it! Moo, meow, woof, quack!',
  'Chip hears something! Is that a cow? A duck? Animals make all kinds of sounds! Listen carefully and tap the animal that makes each sound. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000000-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "listen_and_find",
        "questions": [
          {
            "id": "sound-cow",
            "prompt": "Which animal says MOO?",
            "spokenText": "Mooooo! Which animal says moo?",
            "correctOptionId": "cow",
            "options": [
              {"id": "cow", "emoji": "🐄", "label": "Cow"},
              {"id": "cat", "emoji": "🐱", "label": "Cat"},
              {"id": "duck", "emoji": "🦆", "label": "Duck"}
            ]
          },
          {
            "id": "sound-cat",
            "prompt": "Which animal says MEOW?",
            "spokenText": "Meow! Meow! Which animal says meow?",
            "correctOptionId": "cat",
            "options": [
              {"id": "dog", "emoji": "🐶", "label": "Dog"},
              {"id": "cat", "emoji": "🐱", "label": "Cat"},
              {"id": "cow", "emoji": "🐄", "label": "Cow"}
            ]
          },
          {
            "id": "sound-dog",
            "prompt": "Which animal says WOOF?",
            "spokenText": "Woof! Woof woof! Which animal says woof?",
            "correctOptionId": "dog",
            "options": [
              {"id": "duck", "emoji": "🦆", "label": "Duck"},
              {"id": "dog", "emoji": "🐶", "label": "Dog"},
              {"id": "cat", "emoji": "🐱", "label": "Cat"}
            ]
          },
          {
            "id": "sound-duck",
            "prompt": "Which animal says QUACK?",
            "spokenText": "Quack quack! Which animal says quack?",
            "correctOptionId": "duck",
            "options": [
              {"id": "cow", "emoji": "🐄", "label": "Cow"},
              {"id": "duck", "emoji": "🦆", "label": "Duck"},
              {"id": "dog", "emoji": "🐶", "label": "Dog"}
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Look out the window or go outside! What animals can you see or hear? A bird singing? A dog barking? A squirrel chattering? Name the animals and try to make their sounds together!",
        "parentTip": "If you can''t go outside, flip through a picture book of animals or watch a short nature video. Pause and ask ''What sound does this animal make?'' before revealing it.",
        "completionPrompt": "Did you find animals to see or hear?",
        "illustration": "🐾"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 2: What's the Weather?
-- Module: Wonder Lab
-- Widgets: multiple_choice + matching_pairs
-- Skills: Weather Awareness
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000003-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  2,
  'What''s the Weather?',
  'Is it sunny, rainy, or snowy? Learn about weather and match it to the right clothes!',
  'Chip is looking outside! What''s the weather like today? Is the sun shining? Are there clouds? Let''s learn about different kinds of weather and what to wear!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000000-0005-4000-8000-000000000001'
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
            "id": "weather-sunny",
            "prompt": "The sun is bright and the sky is blue. What''s the weather?",
            "promptEmoji": "☀️",
            "options": [
              {"id": "sunny", "text": "Sunny", "emoji": "☀️"},
              {"id": "rainy", "text": "Rainy", "emoji": "🌧️"},
              {"id": "snowy", "text": "Snowy", "emoji": "❄️"}
            ],
            "correctOptionId": "sunny",
            "hint": "When the sun is shining bright, we call it a sunny day!"
          },
          {
            "id": "weather-rainy",
            "prompt": "Water is falling from the clouds. What''s the weather?",
            "promptEmoji": "🌧️",
            "options": [
              {"id": "sunny", "text": "Sunny", "emoji": "☀️"},
              {"id": "rainy", "text": "Rainy", "emoji": "🌧️"},
              {"id": "snowy", "text": "Snowy", "emoji": "❄️"}
            ],
            "correctOptionId": "rainy",
            "hint": "Water falling from the clouds is called rain!"
          },
          {
            "id": "weather-snowy",
            "prompt": "White fluffy flakes are falling and everything is covered in white. What''s the weather?",
            "promptEmoji": "❄️",
            "options": [
              {"id": "sunny", "text": "Sunny", "emoji": "☀️"},
              {"id": "rainy", "text": "Rainy", "emoji": "🌧️"},
              {"id": "snowy", "text": "Snowy", "emoji": "❄️"}
            ],
            "correctOptionId": "snowy",
            "hint": "White fluffy flakes are snowflakes! It''s snowy!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match the weather to what you should wear!",
        "pairs": [
          {
            "id": "weather-rain-gear",
            "left": {"id": "rain", "text": "Rain", "emoji": "🌧️"},
            "right": {"id": "umbrella", "text": "Umbrella", "emoji": "☂️"}
          },
          {
            "id": "weather-sun-gear",
            "left": {"id": "sun", "text": "Sunny", "emoji": "☀️"},
            "right": {"id": "sunglasses", "text": "Sunglasses", "emoji": "🕶️"}
          },
          {
            "id": "weather-snow-gear",
            "left": {"id": "snow", "text": "Snow", "emoji": "❄️"},
            "right": {"id": "mittens", "text": "Mittens", "emoji": "🧤"}
          }
        ],
        "hint": "When it rains, we need an umbrella! When it snows, we need mittens to stay warm!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 3: Push and Pull
-- Module: Wonder Lab
-- Widgets: tap_and_reveal (explore) + parent_activity
-- Skills: Cause and Effect
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000003-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  3,
  'Push and Pull',
  'What happens when you push or pull? Tap objects to find out! A ball rolls, a swing moves, a door opens!',
  'Chip is curious! What happens when you PUSH something? What happens when you PULL something? Let''s tap each thing and see what it does!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000000-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "push-pull-explore",
            "prompt": "Tap each object to see what happens when you push or pull it!",
            "mode": "explore",
            "gridCols": 3,
            "items": [
              {
                "id": "ball",
                "coverEmoji": "⚽",
                "revealEmoji": "🏃",
                "revealLabel": "Push the ball — it rolls!"
              },
              {
                "id": "swing",
                "coverEmoji": "🪢",
                "revealEmoji": "🎠",
                "revealLabel": "Pull the swing — it moves!"
              },
              {
                "id": "door",
                "coverEmoji": "🚪",
                "revealEmoji": "🚶",
                "revealLabel": "Push the door — it opens!"
              },
              {
                "id": "wagon",
                "coverEmoji": "🛒",
                "revealEmoji": "🏎️",
                "revealLabel": "Pull the wagon — it follows you!"
              },
              {
                "id": "drawer",
                "coverEmoji": "🗄️",
                "revealEmoji": "📦",
                "revealLabel": "Pull the drawer — it slides out!"
              },
              {
                "id": "toy-car",
                "coverEmoji": "🚗",
                "revealEmoji": "💨",
                "revealLabel": "Push the car — it zooms away!"
              }
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Find 3 things you can push and 3 things you can pull! Try pushing a ball, a toy car, and a door. Then try pulling a drawer, a wagon, and a blanket. Talk about what happens each time!",
        "parentTip": "Use the words ''push'' and ''pull'' as your child does each action. Ask: ''What happened when you pushed the ball?'' This builds cause-and-effect thinking.",
        "completionPrompt": "Did you find things to push and pull?",
        "illustration": "💪"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 4: My Five Senses
-- Module: Wonder Lab
-- Widgets: drag_to_sort + parent_activity
-- Skills: Using Senses
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000003-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  4,
  'My Five Senses',
  'Sort things by the sense you use! Do you see it, hear it, or smell it?',
  'Chip has five super powers — and so do you! Eyes to SEE, ears to HEAR, a nose to SMELL, hands to TOUCH, and a tongue to TASTE! Let''s sort these things by which sense you use!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000000-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "senses-sort",
            "prompt": "Sort these things! Do you use your eyes, ears, or nose?",
            "buckets": [
              {"id": "eyes", "label": "Eyes (See)", "emoji": "👀"},
              {"id": "ears", "label": "Ears (Hear)", "emoji": "👂"},
              {"id": "nose", "label": "Nose (Smell)", "emoji": "👃"}
            ],
            "items": [
              {"id": "rainbow", "label": "Rainbow", "emoji": "🌈", "correctBucket": "eyes"},
              {"id": "music", "label": "Music", "emoji": "🎵", "correctBucket": "ears"},
              {"id": "flower", "label": "Flower", "emoji": "🌸", "correctBucket": "nose"},
              {"id": "book", "label": "Book", "emoji": "📖", "correctBucket": "eyes"},
              {"id": "bird-song", "label": "Bird Song", "emoji": "🐦", "correctBucket": "ears"},
              {"id": "cookie", "label": "Cookie", "emoji": "🍪", "correctBucket": "nose"}
            ],
            "hint": "You SEE a rainbow with your eyes. You HEAR music with your ears. You SMELL a flower with your nose!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Go on a senses walk! Walk around the house or outside and take turns naming things: What can you SEE? What can you HEAR? What can you SMELL? What can you TOUCH? Count how many things you find for each sense!",
        "parentTip": "Encourage descriptive words: ''The grass feels soft,'' ''The bird sounds chirpy,'' ''The flower smells sweet.'' This builds vocabulary AND science observation skills at the same time.",
        "completionPrompt": "Did you go on a senses walk together?",
        "illustration": "🌍"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 5: Living or Not?
-- Module: Wonder Lab
-- Widgets: drag_to_sort + tap_and_reveal (find)
-- Skills: Living vs. Non-Living
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000003-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  5,
  'Living or Not?',
  'Is it alive? Sort things into Living and Not Living! Dogs grow, rocks don''t!',
  'Chip has a big question: is that thing ALIVE? Living things grow, eat, and move on their own. A dog is alive! A rock is not. Let''s sort them together!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000000-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "living-sort",
            "prompt": "Sort these into Living and Not Living!",
            "buckets": [
              {"id": "living", "label": "Living", "emoji": "🌱"},
              {"id": "not-living", "label": "Not Living", "emoji": "🪨"}
            ],
            "items": [
              {"id": "dog", "label": "Dog", "emoji": "🐶", "correctBucket": "living"},
              {"id": "rock", "label": "Rock", "emoji": "🪨", "correctBucket": "not-living"},
              {"id": "tree", "label": "Tree", "emoji": "🌳", "correctBucket": "living"},
              {"id": "car", "label": "Car", "emoji": "🚗", "correctBucket": "not-living"},
              {"id": "flower", "label": "Flower", "emoji": "🌸", "correctBucket": "living"},
              {"id": "ball", "label": "Ball", "emoji": "⚽", "correctBucket": "not-living"}
            ],
            "hint": "Living things grow and need food and water. A dog grows, a tree grows — they are alive! A rock and a car do not grow."
          }
        ]
      },
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "find-living",
            "prompt": "Find all the living things hiding in the garden!",
            "mode": "find",
            "targetPrompt": "Find all the living things!",
            "gridCols": 3,
            "items": [
              {
                "id": "butterfly",
                "coverEmoji": "🌿",
                "revealEmoji": "🦋",
                "revealLabel": "Butterfly — living!",
                "isTarget": true
              },
              {
                "id": "bench",
                "coverEmoji": "🌿",
                "revealEmoji": "🪑",
                "revealLabel": "Bench — not living",
                "isTarget": false
              },
              {
                "id": "ladybug",
                "coverEmoji": "🌿",
                "revealEmoji": "🐞",
                "revealLabel": "Ladybug — living!",
                "isTarget": true
              },
              {
                "id": "watering-can",
                "coverEmoji": "🌿",
                "revealEmoji": "🚿",
                "revealLabel": "Watering can — not living",
                "isTarget": false
              },
              {
                "id": "sunflower",
                "coverEmoji": "🌿",
                "revealEmoji": "🌻",
                "revealLabel": "Sunflower — living!",
                "isTarget": true
              },
              {
                "id": "garden-gnome",
                "coverEmoji": "🌿",
                "revealEmoji": "🗿",
                "revealLabel": "Garden gnome — not living",
                "isTarget": false
              }
            ]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- *************************************************************************
--
--  PART C: CODING "STEP BY STEP" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- CODING LESSON 1: First, Then, Last
-- Module: Step by Step
-- Widgets: sequence_order + parent_activity
-- Skills: Sequencing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000007-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000107',
  1,
  'First, Then, Last',
  'Put picture cards in order! What do you do first, then, and last?',
  'Chip does things in order every day! First wake up, then brush teeth, then eat breakfast! Let''s practice putting things in the right order!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000000-0001-4000-8000-000000000001'
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
            "id": "morning-routine",
            "prompt": "Put the morning routine in order! What comes first?",
            "items": [
              {"id": "wake-up", "text": "Wake up", "emoji": "🌅", "correctPosition": 1},
              {"id": "brush-teeth", "text": "Brush teeth", "emoji": "🪥", "correctPosition": 2},
              {"id": "eat-breakfast", "text": "Eat breakfast", "emoji": "🥣", "correctPosition": 3}
            ],
            "hint": "Think about your morning! What do you do first when you open your eyes?"
          },
          {
            "id": "plant-seed",
            "prompt": "How do you grow a plant? Put the steps in order!",
            "items": [
              {"id": "dig", "text": "Dig a hole", "emoji": "🕳️", "correctPosition": 1},
              {"id": "seed", "text": "Put in a seed", "emoji": "🌱", "correctPosition": 2},
              {"id": "water", "text": "Water it", "emoji": "💧", "correctPosition": 3}
            ],
            "hint": "First you need a hole, then you put the seed in, then you give it water!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Practice sequencing! Act out getting dressed together: first socks, then shoes, then coat! What happens if you try to put on shoes before socks? Talk about why order matters!",
        "parentTip": "Sequencing is the foundation of computational thinking. Use ''first, then, last'' language throughout the day: ''First we wash hands, then we eat, last we clean up.''",
        "completionPrompt": "Did you practice putting things in order together?",
        "illustration": "👣"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 2: What Happens Next?
-- Module: Step by Step
-- Widgets: tap_and_reveal (explore) + multiple_choice
-- Skills: Cause and Effect
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000007-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000107',
  2,
  'What Happens Next?',
  'Tap buttons to see what each one does! Then predict what will happen!',
  'Look at all these buttons! Chip is so curious — what does each one do? Let''s tap them and find out! Then YOU get to guess what will happen!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "buttons-explore",
            "prompt": "Tap each button to see what it does!",
            "mode": "explore",
            "gridCols": 3,
            "items": [
              {
                "id": "red-btn",
                "coverEmoji": "🔴",
                "revealEmoji": "🔊",
                "revealLabel": "Red button makes a sound!"
              },
              {
                "id": "blue-btn",
                "coverEmoji": "🔵",
                "revealEmoji": "💡",
                "revealLabel": "Blue button turns on a light!"
              },
              {
                "id": "green-btn",
                "coverEmoji": "🟢",
                "revealEmoji": "🌀",
                "revealLabel": "Green button makes it spin!"
              }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "predict-red",
            "prompt": "If you press the red button, what happens?",
            "promptEmoji": "🔴",
            "options": [
              {"id": "sound", "text": "It makes a sound", "emoji": "🔊"},
              {"id": "light", "text": "It turns on a light", "emoji": "💡"}
            ],
            "correctOptionId": "sound",
            "hint": "Remember what happened when you tapped the red button?"
          },
          {
            "id": "predict-blue",
            "prompt": "If you press the blue button, what happens?",
            "promptEmoji": "🔵",
            "options": [
              {"id": "spin", "text": "It spins", "emoji": "🌀"},
              {"id": "light", "text": "It turns on a light", "emoji": "💡"}
            ],
            "correctOptionId": "light",
            "hint": "Think back — the blue button made something bright appear!"
          },
          {
            "id": "predict-green",
            "prompt": "If you press the green button, what happens?",
            "promptEmoji": "🟢",
            "options": [
              {"id": "sound", "text": "It makes a sound", "emoji": "🔊"},
              {"id": "spin", "text": "It spins", "emoji": "🌀"}
            ],
            "correctOptionId": "spin",
            "hint": "The green button made something go round and round!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 3: Follow the Path
-- Module: Step by Step
-- Widgets: sequence_order + parent_activity
-- Skills: Simple Directions
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000007-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000107',
  3,
  'Follow the Path',
  'Help Chip get to the treasure! Put the direction steps in the right order.',
  'Chip sees a treasure chest but doesn''t know how to get there! Can you put the directions in order so Chip can follow the path? Go forward, turn, and stop!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000000-0003-4000-8000-000000000001'
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
            "id": "path-treasure",
            "prompt": "Put the directions in order to help Chip reach the treasure!",
            "items": [
              {"id": "forward", "text": "Go forward", "emoji": "⬆️", "correctPosition": 1},
              {"id": "turn", "text": "Turn right", "emoji": "➡️", "correctPosition": 2},
              {"id": "stop", "text": "Stop at the treasure!", "emoji": "🏆", "correctPosition": 3}
            ],
            "hint": "First Chip walks forward, then turns, then stops at the treasure!"
          },
          {
            "id": "path-home",
            "prompt": "Help the cat get home! Put the steps in order.",
            "items": [
              {"id": "walk", "text": "Walk forward", "emoji": "🐱", "correctPosition": 1},
              {"id": "turn-left", "text": "Turn left", "emoji": "⬅️", "correctPosition": 2},
              {"id": "arrive", "text": "Arrive home!", "emoji": "🏠", "correctPosition": 3}
            ],
            "hint": "The cat walks, then turns, then arrives at the house!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play Robot! Give your child 2 directions: ''Walk forward. Turn around.'' They follow your instructions like a robot! Then switch — they give YOU directions. Start simple and add more steps as they get comfortable!",
        "parentTip": "This is ''unplugged coding'' — giving step-by-step instructions is the same thing as writing a program! Use words like ''forward,'' ''turn,'' ''stop.'' Praise precise directions.",
        "completionPrompt": "Did you play the Robot direction game together?",
        "illustration": "🤖"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 4: Again and Again
-- Module: Step by Step
-- Widgets: sequence_order + flash_card
-- Skills: Repeating Patterns
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000007-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000107',
  4,
  'Again and Again',
  'Discover repeating patterns! Clap, stomp, clap, stomp — what comes next?',
  'Chip found a pattern! Clap, stomp, clap, stomp. It keeps repeating! In coding, when something repeats, we call it a LOOP. Let''s find the pattern and finish it!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000000-0004-4000-8000-000000000001'
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
            "id": "pattern-clap-stomp",
            "prompt": "The pattern is: clap, stomp, clap, stomp, ???. What comes next? Put them in order!",
            "items": [
              {"id": "clap1", "text": "Clap", "emoji": "👏", "correctPosition": 1},
              {"id": "stomp1", "text": "Stomp", "emoji": "🦶", "correctPosition": 2},
              {"id": "clap2", "text": "Clap", "emoji": "👏", "correctPosition": 3}
            ],
            "hint": "The pattern goes clap, stomp, clap, stomp. After stomp comes... clap again!"
          },
          {
            "id": "pattern-sun-moon",
            "prompt": "Day, night, day, night, ???. What comes next?",
            "items": [
              {"id": "day1", "text": "Day", "emoji": "☀️", "correctPosition": 1},
              {"id": "night1", "text": "Night", "emoji": "🌙", "correctPosition": 2},
              {"id": "day2", "text": "Day", "emoji": "☀️", "correctPosition": 3}
            ],
            "hint": "Day and night keep going back and forth. After night comes... day!"
          }
        ]
      },
      {
        "type": "flash_card",
        "prompt": "Look at these patterns! Can you say what comes next before flipping?",
        "cards": [
          {
            "id": "pattern-ab-1",
            "front": {"text": "🔴🔵🔴🔵 ???", "emoji": "❓"},
            "back": {"text": "🔴! The pattern repeats!", "emoji": "🔴"},
            "color": "#EF4444"
          },
          {
            "id": "pattern-ab-2",
            "front": {"text": "⭐🌙⭐🌙 ???", "emoji": "❓"},
            "back": {"text": "⭐! Star and moon repeat!", "emoji": "⭐"},
            "color": "#EAB308"
          },
          {
            "id": "pattern-ab-3",
            "front": {"text": "🍎🍌🍎🍌 ???", "emoji": "❓"},
            "back": {"text": "🍎! Apple and banana repeat!", "emoji": "🍎"},
            "color": "#22C55E"
          },
          {
            "id": "pattern-aab",
            "front": {"text": "👏👏🦶👏👏🦶 ???", "emoji": "❓"},
            "back": {"text": "👏! Clap clap stomp repeats!", "emoji": "👏"},
            "color": "#A855F7"
          }
        ],
        "shuffleCards": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 5: Button Magic
-- Module: Step by Step
-- Widgets: matching_pairs + parent_activity
-- Skills: Matching Input to Output
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000007-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000107',
  5,
  'Button Magic',
  'Match each action to what happens! Press a button and the light turns on. Cause and effect!',
  'Everything in coding has a cause and effect! When you press a button, something happens! When you clap, music plays! Let''s match each action to its result!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000000-0005-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each action to what happens!",
        "pairs": [
          {
            "id": "io-button-light",
            "left": {"id": "press-button", "text": "Press button", "emoji": "🔘"},
            "right": {"id": "light-on", "text": "Light turns on", "emoji": "💡"}
          },
          {
            "id": "io-clap-music",
            "left": {"id": "clap-hands", "text": "Clap hands", "emoji": "👏"},
            "right": {"id": "music-plays", "text": "Music plays", "emoji": "🎵"}
          },
          {
            "id": "io-turn-knob",
            "left": {"id": "turn-knob", "text": "Turn knob", "emoji": "🎛️"},
            "right": {"id": "door-opens", "text": "Door opens", "emoji": "🚪"}
          }
        ],
        "hint": "Think about what happens when you DO something. Pressing a button is the action — the light turning on is what happens!"
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Explore cause and effect around the house! Press light switches, ring doorbells, turn on water faucets, squeeze a toy. For each one, ask: ''What did you do?'' (the input) and ''What happened?'' (the output).",
        "parentTip": "In coding, we call actions ''inputs'' and results ''outputs.'' You can use those words casually: ''The input was pressing the switch. The output was the light turning on!'' This builds computational thinking naturally.",
        "completionPrompt": "Did you explore cause and effect with buttons and switches?",
        "illustration": "🔮"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);
