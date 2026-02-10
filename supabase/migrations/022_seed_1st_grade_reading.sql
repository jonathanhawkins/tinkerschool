-- =============================================================================
-- TinkerSchool -- Seed 1st Grade (Band 1) Reading Lessons
-- =============================================================================
-- 20 browser-only interactive lessons for 1st grade (Band 1, K-1, ages 5-6):
--   - Module 1: Phonics Foundations (6 lessons)
--   - Module 2: Sight Words & Spelling (5 lessons)
--   - Module 3: Reading & Comprehension (5 lessons)
--   - Module 4: Sentences & Grammar (4 lessons)
--
-- All lessons use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, fill_in_blank, matching_pairs,
--   sequence_order, flash_card
--
-- Subject ID:
--   Reading (1st grade): f04d2171-6b54-41bf-900d-d3d082ba65ed
--
-- Module IDs:
--   Phonics Foundations:       10000001-0201-4000-8000-000000000001
--   Sight Words & Spelling:    10000001-0202-4000-8000-000000000001
--   Reading & Comprehension:   10000001-0203-4000-8000-000000000001
--   Sentences & Grammar:       10000001-0204-4000-8000-000000000001
--
-- Skill IDs (already in DB):
--   Consonant sounds:         bc6d52cc-9fc7-4c1a-a3b7-b41928e6f605
--   Short vowels:             3a88e7b4-a4cd-4604-b46b-96aca0cb00f4
--   Blending CVC words:       0001f94a-8379-4712-b678-65bf5a0269f4
--   Sight words (Dolch 1st):  81bca1c3-5822-479a-9632-a107cb4a5f49
--   Rhyming & word families:  b10791c6-0eb4-4e30-a602-2ad2a134d6b1
--   Spelling common words:    92a784e6-c1a3-4070-9066-81ec43e9dc86
--   Sentence building:        ccbf111a-52c4-49f2-b89b-c2302f87a63e
--   Story sequencing:         5272ef01-4e2b-445c-bbcd-0ca96050e317
--   Reading comprehension:    db62ca8f-1444-4448-a5c1-1eec152675c3
--
-- Lesson UUID pattern: b1000002-YYYY-4000-8000-000000000001 (YYYY = 0001..0020)
--
-- Depends on: subjects, skills, and modules tables existing
-- =============================================================================


-- =========================================================================
-- 1. MODULES (Band 1 Reading)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0201-4000-8000-000000000001', 1, 1, 'Phonics Foundations',      'Learn letter sounds, short vowels, and how to blend letters into words!',                         'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed'),
  ('10000001-0202-4000-8000-000000000001', 1, 2, 'Sight Words & Spelling',   'Practice reading and spelling important words you will see everywhere!',                          'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed'),
  ('10000001-0203-4000-8000-000000000001', 1, 3, 'Reading & Comprehension',  'Read short stories and answer questions about what happened!',                                    'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed'),
  ('10000001-0204-4000-8000-000000000001', 1, 4, 'Sentences & Grammar',      'Learn how to build sentences and discover nouns and verbs!',                                       'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 1: PHONICS FOUNDATIONS (6 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Letter Sounds A-M
-- Module: Phonics Foundations | Skills: Consonant sounds
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0001-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  1,
  'Letter Sounds A-M',
  'Match each letter to the sound it makes! From A to M, every letter has a special sound.',
  'Hi there, friend! Chip here! Did you know every letter makes a special sound? Today we are going to learn the sounds for letters A through M. Let''s see how many you know!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['bc6d52cc-9fc7-4c1a-a3b7-b41928e6f605']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each letter to the word that starts with its sound!",
        "pairs": [
          {
            "id": "a-sound",
            "left": {"id": "letter-a", "text": "A", "emoji": ""},
            "right": {"id": "word-a", "text": "Apple", "emoji": "\ud83c\udf4e"}
          },
          {
            "id": "b-sound",
            "left": {"id": "letter-b", "text": "B", "emoji": ""},
            "right": {"id": "word-b", "text": "Ball", "emoji": "\u26bd"}
          },
          {
            "id": "d-sound",
            "left": {"id": "letter-d", "text": "D", "emoji": ""},
            "right": {"id": "word-d", "text": "Dog", "emoji": "\ud83d\udc36"}
          },
          {
            "id": "f-sound",
            "left": {"id": "letter-f", "text": "F", "emoji": ""},
            "right": {"id": "word-f", "text": "Fish", "emoji": "\ud83d\udc1f"}
          },
          {
            "id": "m-sound",
            "left": {"id": "letter-m", "text": "M", "emoji": ""},
            "right": {"id": "word-m", "text": "Moon", "emoji": "\ud83c\udf19"}
          }
        ],
        "hint": "Say the letter sound out loud. Which word starts with that sound?"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc-c",
            "prompt": "What sound does the letter C make?",
            "options": [
              {"id": "a", "text": "kuh like Cat", "emoji": "\ud83d\udc31"},
              {"id": "b", "text": "buh like Bear", "emoji": "\ud83d\udc3b"},
              {"id": "c", "text": "duh like Dog", "emoji": "\ud83d\udc36"}
            ],
            "correctOptionId": "a",
            "hint": "Think of a furry pet that says meow. C-c-cat!"
          },
          {
            "id": "mc-g",
            "prompt": "What sound does the letter G make?",
            "options": [
              {"id": "a", "text": "juh like Jam", "emoji": ""},
              {"id": "b", "text": "guh like Goat", "emoji": "\ud83d\udc10"},
              {"id": "c", "text": "kuh like Kite", "emoji": "\ud83e\ude81"}
            ],
            "correctOptionId": "b",
            "hint": "Think of an animal that lives on a farm and goes baa-aah! G-g-goat!"
          },
          {
            "id": "mc-h",
            "prompt": "Which word starts with the letter H sound?",
            "options": [
              {"id": "a", "text": "hat", "emoji": "\ud83e\udde2"},
              {"id": "b", "text": "fan", "emoji": ""},
              {"id": "c", "text": "leg", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "H sounds like a little puff of air. Huh-huh-hat!"
          },
          {
            "id": "mc-j",
            "prompt": "Which word starts with the letter J sound?",
            "options": [
              {"id": "a", "text": "lamp", "emoji": ""},
              {"id": "b", "text": "jump", "emoji": "\u2b50"},
              {"id": "c", "text": "milk", "emoji": "\ud83e\udd5b"}
            ],
            "correctOptionId": "b",
            "hint": "J-j-jump! Can you jump up and down?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Letter Sounds N-Z
-- Module: Phonics Foundations | Skills: Consonant sounds
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0002-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  2,
  'Letter Sounds N-Z',
  'Keep going! Match the rest of the letters to their sounds, from N to Z.',
  'Great job with A through M! Now Chip wants to show you the rest of the alphabet. Letters N through Z have cool sounds too. Let''s learn them together!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['bc6d52cc-9fc7-4c1a-a3b7-b41928e6f605']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each letter to the word that starts with its sound!",
        "pairs": [
          {
            "id": "n-sound",
            "left": {"id": "letter-n", "text": "N", "emoji": ""},
            "right": {"id": "word-n", "text": "Nest", "emoji": "\ud83e\udea2"}
          },
          {
            "id": "p-sound",
            "left": {"id": "letter-p", "text": "P", "emoji": ""},
            "right": {"id": "word-p", "text": "Pig", "emoji": "\ud83d\udc37"}
          },
          {
            "id": "r-sound",
            "left": {"id": "letter-r", "text": "R", "emoji": ""},
            "right": {"id": "word-r", "text": "Rain", "emoji": "\ud83c\udf27\ufe0f"}
          },
          {
            "id": "s-sound",
            "left": {"id": "letter-s", "text": "S", "emoji": ""},
            "right": {"id": "word-s", "text": "Sun", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "z-sound",
            "left": {"id": "letter-z", "text": "Z", "emoji": ""},
            "right": {"id": "word-z", "text": "Zebra", "emoji": "\ud83e\udd93"}
          }
        ],
        "hint": "Say each letter sound slowly. Which word starts with that sound?"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc-t",
            "prompt": "What sound does the letter T make?",
            "options": [
              {"id": "a", "text": "tuh like Tiger", "emoji": "\ud83d\udc2f"},
              {"id": "b", "text": "puh like Pan", "emoji": ""},
              {"id": "c", "text": "nuh like Net", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Touch the tip of your tongue to the top of your mouth. T-t-tiger!"
          },
          {
            "id": "mc-w",
            "prompt": "Which word starts with the letter W sound?",
            "options": [
              {"id": "a", "text": "van", "emoji": "\ud83d\ude90"},
              {"id": "b", "text": "yak", "emoji": ""},
              {"id": "c", "text": "water", "emoji": "\ud83d\udca7"}
            ],
            "correctOptionId": "c",
            "hint": "Round your lips like you are about to whistle. W-w-water!"
          },
          {
            "id": "mc-v",
            "prompt": "Which word starts with the letter V sound?",
            "options": [
              {"id": "a", "text": "worm", "emoji": "\ud83e\udeb1"},
              {"id": "b", "text": "vest", "emoji": ""},
              {"id": "c", "text": "tent", "emoji": "\u26fa"}
            ],
            "correctOptionId": "b",
            "hint": "Put your top teeth on your bottom lip and hum. V-v-vest!"
          },
          {
            "id": "mc-y",
            "prompt": "Which word starts with the letter Y sound?",
            "options": [
              {"id": "a", "text": "yellow", "emoji": "\ud83d\udfe1"},
              {"id": "b", "text": "zipper", "emoji": ""},
              {"id": "c", "text": "rabbit", "emoji": "\ud83d\udc30"}
            ],
            "correctOptionId": "a",
            "hint": "Think of a bright, sunny color! Y-y-yellow!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Short Vowel Sounds
-- Module: Phonics Foundations | Skills: Short vowels
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0003-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  3,
  'Short Vowel Sounds',
  'The vowels A, E, I, O, U each have a short sound. Can you hear them?',
  'Hey! Chip has a secret to share. There are 5 special letters called vowels -- A, E, I, O, and U. Each one makes a short sound. Listen close and see if you can pick the right one!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['3a88e7b4-a4cd-4604-b46b-96aca0cb00f4']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sv-1",
            "prompt": "Which vowel sound do you hear in the word CAT?",
            "options": [
              {"id": "a", "text": "short a (ah)", "emoji": "\ud83d\udc31"},
              {"id": "b", "text": "short e (eh)", "emoji": ""},
              {"id": "c", "text": "short o (oh)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Say it slowly: c-aaa-t. Do you hear the \"ah\" sound?"
          },
          {
            "id": "sv-2",
            "prompt": "Which vowel sound do you hear in the word PEN?",
            "options": [
              {"id": "a", "text": "short a (ah)", "emoji": ""},
              {"id": "b", "text": "short e (eh)", "emoji": "\u270f\ufe0f"},
              {"id": "c", "text": "short i (ih)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Say it slowly: p-eee-n. Do you hear the \"eh\" sound?"
          },
          {
            "id": "sv-3",
            "prompt": "Which vowel sound do you hear in the word SIT?",
            "options": [
              {"id": "a", "text": "short u (uh)", "emoji": ""},
              {"id": "b", "text": "short o (oh)", "emoji": ""},
              {"id": "c", "text": "short i (ih)", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Say it slowly: s-iii-t. Do you hear the \"ih\" sound?"
          },
          {
            "id": "sv-4",
            "prompt": "Which vowel sound do you hear in the word HOT?",
            "options": [
              {"id": "a", "text": "short o (oh)", "emoji": "\u2600\ufe0f"},
              {"id": "b", "text": "short a (ah)", "emoji": ""},
              {"id": "c", "text": "short e (eh)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Say it slowly: h-ooo-t. Do you hear the \"oh\" sound?"
          },
          {
            "id": "sv-5",
            "prompt": "Which vowel sound do you hear in the word BUS?",
            "options": [
              {"id": "a", "text": "short i (ih)", "emoji": ""},
              {"id": "b", "text": "short u (uh)", "emoji": "\ud83d\ude8c"},
              {"id": "c", "text": "short a (ah)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Say it slowly: b-uuu-s. Do you hear the \"uh\" sound?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sv-fb-1",
            "sentence": "The short vowel in the word MAP is the letter ___.",
            "correctAnswer": "a",
            "acceptableAnswers": ["A"],
            "hint": "Say m-aaa-p. Which vowel makes the \"ah\" sound?"
          },
          {
            "id": "sv-fb-2",
            "sentence": "The short vowel in the word PIG is the letter ___.",
            "correctAnswer": "i",
            "acceptableAnswers": ["I"],
            "hint": "Say p-iii-g. Which vowel makes the \"ih\" sound?"
          },
          {
            "id": "sv-fb-3",
            "sentence": "The short vowel in the word CUP is the letter ___.",
            "correctAnswer": "u",
            "acceptableAnswers": ["U"],
            "hint": "Say c-uuu-p. Which vowel makes the \"uh\" sound?"
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
-- LESSON 4: CVC Words
-- Module: Phonics Foundations | Skills: Blending CVC words, Short vowels
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0004-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  4,
  'CVC Words',
  'Blend sounds together to make words like cat, dog, and pig!',
  'Chip loves building things, and today we are building WORDS! Take three letter sounds, blend them together, and -- boom -- you get a word! Like c-a-t makes cat! Ready to try?',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    '0001f94a-8379-4712-b678-65bf5a0269f4',
    '3a88e7b4-a4cd-4604-b46b-96aca0cb00f4'
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
            "id": "cvc-1",
            "sentence": "Blend the sounds: c - a - t = ___",
            "correctAnswer": "cat",
            "acceptableAnswers": ["Cat", "CAT"],
            "hint": "Say each sound fast: cuh-aah-tuh. What word do you hear?"
          },
          {
            "id": "cvc-2",
            "sentence": "Blend the sounds: d - o - g = ___",
            "correctAnswer": "dog",
            "acceptableAnswers": ["Dog", "DOG"],
            "hint": "Say each sound fast: duh-ooh-guh. What animal is it?"
          },
          {
            "id": "cvc-3",
            "sentence": "Blend the sounds: p - i - g = ___",
            "correctAnswer": "pig",
            "acceptableAnswers": ["Pig", "PIG"],
            "hint": "Say each sound fast: puh-iih-guh. This pink animal says oink!"
          },
          {
            "id": "cvc-4",
            "sentence": "Blend the sounds: h - e - n = ___",
            "correctAnswer": "hen",
            "acceptableAnswers": ["Hen", "HEN"],
            "hint": "Say each sound fast: huh-eeh-nuh. This bird lays eggs!"
          },
          {
            "id": "cvc-5",
            "sentence": "Blend the sounds: s - u - n = ___",
            "correctAnswer": "sun",
            "acceptableAnswers": ["Sun", "SUN"],
            "hint": "Say each sound fast: sss-uuh-nuh. It shines bright in the sky!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cvc-mc-1",
            "prompt": "Which picture matches the word BUG?",
            "options": [
              {"id": "a", "text": "A ladybug", "emoji": "\ud83d\udc1e"},
              {"id": "b", "text": "A cup", "emoji": "\u2615"},
              {"id": "c", "text": "A rug", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "B-U-G. A bug is a little crawling critter!"
          },
          {
            "id": "cvc-mc-2",
            "prompt": "Which picture matches the word HAT?",
            "options": [
              {"id": "a", "text": "A bat", "emoji": "\ud83e\udd87"},
              {"id": "b", "text": "A hat", "emoji": "\ud83e\udde2"},
              {"id": "c", "text": "A rat", "emoji": "\ud83d\udc00"}
            ],
            "correctOptionId": "b",
            "hint": "H-A-T. You wear this on your head!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Beginning Blends (bl, cl, fl)
-- Module: Phonics Foundations | Skills: Consonant sounds, Blending CVC words
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0005-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  5,
  'Beginning Blends',
  'Some words start with two consonant sounds blended together, like bl, cl, and fl!',
  'Wow, you are getting so good at sounds! Chip found some words that start with TWO letters blended together. Like BL in blue, CL in clap, and FL in flag. Let''s practice hearing them!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    'bc6d52cc-9fc7-4c1a-a3b7-b41928e6f605',
    '0001f94a-8379-4712-b678-65bf5a0269f4'
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
            "id": "bl-1",
            "prompt": "Which word starts with the BL blend?",
            "options": [
              {"id": "a", "text": "black", "emoji": "\u2b1b"},
              {"id": "b", "text": "clock", "emoji": "\u23f0"},
              {"id": "c", "text": "flower", "emoji": "\ud83c\udf3b"}
            ],
            "correctOptionId": "a",
            "hint": "BL sounds like \"bl\" at the start. Say bl-bl-black!"
          },
          {
            "id": "bl-2",
            "prompt": "Which word starts with the CL blend?",
            "options": [
              {"id": "a", "text": "flag", "emoji": "\ud83c\udff3\ufe0f"},
              {"id": "b", "text": "clap", "emoji": "\ud83d\udc4f"},
              {"id": "c", "text": "blue", "emoji": "\ud83d\udfe6"}
            ],
            "correctOptionId": "b",
            "hint": "CL sounds like \"cl\" at the start. Clap your hands! Cl-cl-clap!"
          },
          {
            "id": "bl-3",
            "prompt": "Which word starts with the FL blend?",
            "options": [
              {"id": "a", "text": "block", "emoji": "\ud83e\uddf1"},
              {"id": "b", "text": "cloud", "emoji": "\u2601\ufe0f"},
              {"id": "c", "text": "flag", "emoji": "\ud83c\udff3\ufe0f"}
            ],
            "correctOptionId": "c",
            "hint": "FL sounds like \"fl\" at the start. A flag flaps in the wind! Fl-fl-flag!"
          },
          {
            "id": "bl-4",
            "prompt": "Which word starts with the BL blend?",
            "options": [
              {"id": "a", "text": "flip", "emoji": ""},
              {"id": "b", "text": "clip", "emoji": "\ud83d\udcce"},
              {"id": "c", "text": "blob", "emoji": "\ud83e\udea3"}
            ],
            "correctOptionId": "c",
            "hint": "Listen for the \"bl\" at the start. Bl-bl-blob!"
          },
          {
            "id": "bl-5",
            "prompt": "Which blend do you hear at the start of FLAT?",
            "options": [
              {"id": "a", "text": "bl", "emoji": ""},
              {"id": "b", "text": "fl", "emoji": "\u2728"},
              {"id": "c", "text": "cl", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Say it slowly: fl-at. Do you hear the \"fl\" blend?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "bl-fb-1",
            "sentence": "The sky is ___ (color that starts with bl).",
            "correctAnswer": "blue",
            "acceptableAnswers": ["Blue", "BLUE"],
            "hint": "What color is the sky? It starts with bl..."
          },
          {
            "id": "bl-fb-2",
            "sentence": "I can ___ my hands together! (starts with cl)",
            "correctAnswer": "clap",
            "acceptableAnswers": ["Clap", "CLAP"],
            "hint": "Put your hands together and smack them. That is called a cl..."
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
-- LESSON 6: Ending Sounds
-- Module: Phonics Foundations | Skills: Consonant sounds, Blending CVC words
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0006-4000-8000-000000000001',
  '10000001-0201-4000-8000-000000000001',
  6,
  'Ending Sounds',
  'Listen for the last sound in each word. What letter do you hear at the end?',
  'You know the sounds at the START of words. Now let''s listen to the END! Every word has a last sound. Chip will say a word, and you pick the letter that makes the ending sound. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    'bc6d52cc-9fc7-4c1a-a3b7-b41928e6f605',
    '0001f94a-8379-4712-b678-65bf5a0269f4'
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
            "id": "end-1",
            "prompt": "What is the LAST sound in the word CAT?",
            "options": [
              {"id": "a", "text": "t", "emoji": "\u2728"},
              {"id": "b", "text": "c", "emoji": ""},
              {"id": "c", "text": "a", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Say cat slowly: ca-tuh. The last sound is tuh. What letter is that?"
          },
          {
            "id": "end-2",
            "prompt": "What is the LAST sound in the word BIG?",
            "options": [
              {"id": "a", "text": "b", "emoji": ""},
              {"id": "b", "text": "i", "emoji": ""},
              {"id": "c", "text": "g", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Say big slowly: bi-guh. The last sound is guh. What letter is that?"
          },
          {
            "id": "end-3",
            "prompt": "What is the LAST sound in the word RUN?",
            "options": [
              {"id": "a", "text": "n", "emoji": "\u2728"},
              {"id": "b", "text": "r", "emoji": ""},
              {"id": "c", "text": "u", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Say run slowly: ru-nnn. The last sound is nnn. What letter is that?"
          },
          {
            "id": "end-4",
            "prompt": "What is the LAST sound in the word MOP?",
            "options": [
              {"id": "a", "text": "m", "emoji": ""},
              {"id": "b", "text": "p", "emoji": "\u2728"},
              {"id": "c", "text": "o", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Say mop slowly: mo-puh. The last sound is puh. What letter is that?"
          },
          {
            "id": "end-5",
            "prompt": "What is the LAST sound in the word BED?",
            "options": [
              {"id": "a", "text": "b", "emoji": ""},
              {"id": "b", "text": "e", "emoji": ""},
              {"id": "c", "text": "d", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Say bed slowly: be-duh. The last sound is duh. What letter is that?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match the word to the letter it ENDS with!",
        "pairs": [
          {
            "id": "end-m1",
            "left": {"id": "word-cup", "text": "cup", "emoji": "\u2615"},
            "right": {"id": "letter-p", "text": "p", "emoji": ""}
          },
          {
            "id": "end-m2",
            "left": {"id": "word-fan", "text": "fan", "emoji": ""},
            "right": {"id": "letter-n", "text": "n", "emoji": ""}
          },
          {
            "id": "end-m3",
            "left": {"id": "word-bus", "text": "bus", "emoji": "\ud83d\ude8c"},
            "right": {"id": "letter-s", "text": "s", "emoji": ""}
          },
          {
            "id": "end-m4",
            "left": {"id": "word-leg", "text": "leg", "emoji": "\ud83e\uddb5"},
            "right": {"id": "letter-g", "text": "g", "emoji": ""}
          }
        ],
        "hint": "Say each word slowly and listen to the very last sound."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 2: SIGHT WORDS & SPELLING (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 7: Sight Words Set 1 (the, and, is, in, it)
-- Module: Sight Words & Spelling | Skills: Sight words (Dolch 1st)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0007-4000-8000-000000000001',
  '10000001-0202-4000-8000-000000000001',
  1,
  'Sight Words Set 1',
  'Learn five important words you will see in every book: the, and, is, in, it.',
  'Some words show up ALL the time in books! Chip calls them sight words because you should know them on sight -- no sounding out needed! Today we learn: the, and, is, in, it. Ready?',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['81bca1c3-5822-479a-9632-a107cb4a5f49']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn a sight word! Try to read the word before you flip it.",
        "cards": [
          {
            "id": "sw1-the",
            "front": {"text": "the", "emoji": "\ud83d\udcda"},
            "back": {"text": "THE - I see the dog.", "emoji": "\ud83d\udc36"}
          },
          {
            "id": "sw1-and",
            "front": {"text": "and", "emoji": "\ud83d\udcda"},
            "back": {"text": "AND - Red and blue.", "emoji": "\ud83c\udf08"}
          },
          {
            "id": "sw1-is",
            "front": {"text": "is", "emoji": "\ud83d\udcda"},
            "back": {"text": "IS - The cat is big.", "emoji": "\ud83d\udc31"}
          },
          {
            "id": "sw1-in",
            "front": {"text": "in", "emoji": "\ud83d\udcda"},
            "back": {"text": "IN - The toy is in the box.", "emoji": "\ud83d\udce6"}
          },
          {
            "id": "sw1-it",
            "front": {"text": "it", "emoji": "\ud83d\udcda"},
            "back": {"text": "IT - I like it!", "emoji": "\u2764\ufe0f"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sw1-mc-1",
            "prompt": "Which word fits? I see ___ sun.",
            "options": [
              {"id": "a", "text": "the", "emoji": "\u2728"},
              {"id": "b", "text": "and", "emoji": ""},
              {"id": "c", "text": "it", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "We are talking about one special sun. I see ___ sun."
          },
          {
            "id": "sw1-mc-2",
            "prompt": "Which word fits? A cat ___ a dog.",
            "options": [
              {"id": "a", "text": "in", "emoji": ""},
              {"id": "b", "text": "and", "emoji": "\u2728"},
              {"id": "c", "text": "is", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "We need a word that joins two things together."
          },
          {
            "id": "sw1-mc-3",
            "prompt": "Which word fits? The ball ___ red.",
            "options": [
              {"id": "a", "text": "it", "emoji": ""},
              {"id": "b", "text": "in", "emoji": ""},
              {"id": "c", "text": "is", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "The ball ___ red. Which word tells us what the ball looks like?"
          },
          {
            "id": "sw1-mc-4",
            "prompt": "Which word fits? The frog is ___ the pond.",
            "options": [
              {"id": "a", "text": "in", "emoji": "\u2728"},
              {"id": "b", "text": "it", "emoji": ""},
              {"id": "c", "text": "the", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Where is the frog? Inside the pond!"
          },
          {
            "id": "sw1-mc-5",
            "prompt": "Which word fits? I like ___!",
            "options": [
              {"id": "a", "text": "the", "emoji": ""},
              {"id": "b", "text": "is", "emoji": ""},
              {"id": "c", "text": "it", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "I like ___! Which short word means the thing we are talking about?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 8: Sight Words Set 2 (he, she, was, for, on)
-- Module: Sight Words & Spelling | Skills: Sight words (Dolch 1st)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0008-4000-8000-000000000001',
  '10000001-0202-4000-8000-000000000001',
  2,
  'Sight Words Set 2',
  'Five more sight words to learn: he, she, was, for, on. You are becoming a reading star!',
  'You already know five sight words! Chip is so proud! Now let''s add five more to your collection: he, she, was, for, on. The more sight words you know, the faster you can read!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['81bca1c3-5822-479a-9632-a107cb4a5f49']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to see the word used in a sentence!",
        "cards": [
          {
            "id": "sw2-he",
            "front": {"text": "he", "emoji": "\ud83d\udcda"},
            "back": {"text": "HE - He is my friend.", "emoji": "\ud83d\udc66"}
          },
          {
            "id": "sw2-she",
            "front": {"text": "she", "emoji": "\ud83d\udcda"},
            "back": {"text": "SHE - She can run fast.", "emoji": "\ud83d\udc67"}
          },
          {
            "id": "sw2-was",
            "front": {"text": "was", "emoji": "\ud83d\udcda"},
            "back": {"text": "WAS - The dog was happy.", "emoji": "\ud83d\udc36"}
          },
          {
            "id": "sw2-for",
            "front": {"text": "for", "emoji": "\ud83d\udcda"},
            "back": {"text": "FOR - This is for you!", "emoji": "\ud83c\udf81"}
          },
          {
            "id": "sw2-on",
            "front": {"text": "on", "emoji": "\ud83d\udcda"},
            "back": {"text": "ON - The book is on the table.", "emoji": "\ud83d\udcda"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sw2-mc-1",
            "prompt": "Which word fits? ___ is a good boy.",
            "options": [
              {"id": "a", "text": "He", "emoji": "\u2728"},
              {"id": "b", "text": "She", "emoji": ""},
              {"id": "c", "text": "On", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "We use this word for a boy or a man."
          },
          {
            "id": "sw2-mc-2",
            "prompt": "Which word fits? ___ can sing well.",
            "options": [
              {"id": "a", "text": "Was", "emoji": ""},
              {"id": "b", "text": "She", "emoji": "\u2728"},
              {"id": "c", "text": "For", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "We use this word for a girl or a woman."
          },
          {
            "id": "sw2-mc-3",
            "prompt": "Which word fits? The bird ___ in the tree.",
            "options": [
              {"id": "a", "text": "on", "emoji": ""},
              {"id": "b", "text": "for", "emoji": ""},
              {"id": "c", "text": "was", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "The bird ___ in the tree. This happened before, in the past."
          },
          {
            "id": "sw2-mc-4",
            "prompt": "Which word fits? This gift is ___ mom.",
            "options": [
              {"id": "a", "text": "for", "emoji": "\u2728"},
              {"id": "b", "text": "he", "emoji": ""},
              {"id": "c", "text": "was", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "This gift is ___ mom. Who gets the gift?"
          },
          {
            "id": "sw2-mc-5",
            "prompt": "Which word fits? The cup is ___ the table.",
            "options": [
              {"id": "a", "text": "she", "emoji": ""},
              {"id": "b", "text": "on", "emoji": "\u2728"},
              {"id": "c", "text": "he", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Where is the cup? It is sitting right ___ top of the table."
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 9: Sight Words Set 3 (are, but, not, you, all)
-- Module: Sight Words & Spelling | Skills: Sight words (Dolch 1st)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0009-4000-8000-000000000001',
  '10000001-0202-4000-8000-000000000001',
  3,
  'Sight Words Set 3',
  'Five more words every reader needs: are, but, not, you, all!',
  'You are on a roll! Chip is adding five more words to your sight word collection: are, but, not, you, all. Soon you will be able to read so many sentences. Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['81bca1c3-5822-479a-9632-a107cb4a5f49']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Read the word on the front, then flip to check! Try to say it before you peek!",
        "cards": [
          {
            "id": "sw3-are",
            "front": {"text": "are", "emoji": "\ud83d\udcda"},
            "back": {"text": "ARE - You are kind.", "emoji": "\u2764\ufe0f"}
          },
          {
            "id": "sw3-but",
            "front": {"text": "but", "emoji": "\ud83d\udcda"},
            "back": {"text": "BUT - I like it, but it is big.", "emoji": "\ud83d\ude04"}
          },
          {
            "id": "sw3-not",
            "front": {"text": "not", "emoji": "\ud83d\udcda"},
            "back": {"text": "NOT - I am not sad.", "emoji": "\ud83d\ude0a"}
          },
          {
            "id": "sw3-you",
            "front": {"text": "you", "emoji": "\ud83d\udcda"},
            "back": {"text": "YOU - I like you!", "emoji": "\ud83c\udf1f"}
          },
          {
            "id": "sw3-all",
            "front": {"text": "all", "emoji": "\ud83d\udcda"},
            "back": {"text": "ALL - We all play.", "emoji": "\u26bd"}
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sw3-fb-1",
            "sentence": "We ___ friends. (starts with a)",
            "correctAnswer": "are",
            "acceptableAnswers": ["Are", "ARE"],
            "hint": "We ___ friends. This word means the same as \"am\" but for more than one person."
          },
          {
            "id": "sw3-fb-2",
            "sentence": "I like cats, ___ I also like dogs. (starts with b)",
            "correctAnswer": "but",
            "acceptableAnswers": ["But", "BUT"],
            "hint": "This word shows a different idea is coming. I like cats, ___ I also like dogs."
          },
          {
            "id": "sw3-fb-3",
            "sentence": "I am ___ tired. (starts with n)",
            "correctAnswer": "not",
            "acceptableAnswers": ["Not", "NOT"],
            "hint": "This word means no or the opposite. I am ___ tired means I feel fine!"
          },
          {
            "id": "sw3-fb-4",
            "sentence": "___ are my best friend! (starts with y)",
            "correctAnswer": "You",
            "acceptableAnswers": ["you", "YOU"],
            "hint": "This word means the person I am talking to."
          },
          {
            "id": "sw3-fb-5",
            "sentence": "We ___ like to sing. (starts with a)",
            "correctAnswer": "all",
            "acceptableAnswers": ["All", "ALL"],
            "hint": "This word means everyone, the whole group."
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
-- LESSON 10: Spelling CVC Words
-- Module: Sight Words & Spelling | Skills: Spelling common words, Short vowels
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000a-4000-8000-000000000001',
  '10000001-0202-4000-8000-000000000001',
  4,
  'Spelling CVC Words',
  'Can you spell simple words like cat, bed, and hop? Type the missing letters!',
  'Time to be a spelling star! Chip will show you a picture and a word with a missing letter. Can you figure out which letter goes in the blank? Sound it out and give it a try!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    '92a784e6-c1a3-4070-9066-81ec43e9dc86',
    '3a88e7b4-a4cd-4604-b46b-96aca0cb00f4'
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
            "id": "spell-1",
            "sentence": "c ___ t (a furry pet that says meow)",
            "correctAnswer": "a",
            "acceptableAnswers": ["A"],
            "hint": "What sound is in the middle of cat? C-aaa-t!"
          },
          {
            "id": "spell-2",
            "sentence": "b ___ d (where you sleep at night)",
            "correctAnswer": "e",
            "acceptableAnswers": ["E"],
            "hint": "What sound is in the middle of bed? B-eee-d!"
          },
          {
            "id": "spell-3",
            "sentence": "h ___ p (what a bunny does)",
            "correctAnswer": "o",
            "acceptableAnswers": ["O"],
            "hint": "What sound is in the middle of hop? H-ooo-p!"
          },
          {
            "id": "spell-4",
            "sentence": "p ___ n (you write with this)",
            "correctAnswer": "e",
            "acceptableAnswers": ["E"],
            "hint": "What sound is in the middle of pen? P-eee-n!"
          },
          {
            "id": "spell-5",
            "sentence": "s ___ t (you do this in a chair)",
            "correctAnswer": "i",
            "acceptableAnswers": ["I"],
            "hint": "What sound is in the middle of sit? S-iii-t!"
          },
          {
            "id": "spell-6",
            "sentence": "r ___ n (what you do when you go fast)",
            "correctAnswer": "u",
            "acceptableAnswers": ["U"],
            "hint": "What sound is in the middle of run? R-uuu-n!"
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
-- LESSON 11: Word Families (-at, -an, -ig, -op)
-- Module: Sight Words & Spelling | Skills: Rhyming & word families
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000b-4000-8000-000000000001',
  '10000001-0202-4000-8000-000000000001',
  5,
  'Word Families',
  'Words that end the same way are in the same family! Meet the -at, -an, -ig, and -op families.',
  'Chip found out that words have families too! Words that end with the same sound belong together. Cat, hat, and bat are all in the -at family! Let''s meet some word families today!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['b10791c6-0eb4-4e30-a602-2ad2a134d6b1']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each word to its word family!",
        "pairs": [
          {
            "id": "wf-cat",
            "left": {"id": "word-cat", "text": "cat", "emoji": "\ud83d\udc31"},
            "right": {"id": "family-at", "text": "-at family", "emoji": ""}
          },
          {
            "id": "wf-pan",
            "left": {"id": "word-pan", "text": "pan", "emoji": "\ud83c\udf73"},
            "right": {"id": "family-an", "text": "-an family", "emoji": ""}
          },
          {
            "id": "wf-pig",
            "left": {"id": "word-pig", "text": "pig", "emoji": "\ud83d\udc37"},
            "right": {"id": "family-ig", "text": "-ig family", "emoji": ""}
          },
          {
            "id": "wf-hop",
            "left": {"id": "word-hop", "text": "hop", "emoji": "\ud83d\udc30"},
            "right": {"id": "family-op", "text": "-op family", "emoji": ""}
          }
        ],
        "hint": "Look at the ending of each word. Cat ends in -at, pan ends in -an..."
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "wf-fb-1",
            "sentence": "Cat, hat, bat, and ___ all end in -at. (what you sit on)",
            "correctAnswer": "mat",
            "acceptableAnswers": ["Mat", "MAT"],
            "hint": "You might wipe your feet on this before you come inside. It rhymes with cat!"
          },
          {
            "id": "wf-fb-2",
            "sentence": "Pan, can, man, and ___ all end in -an. (a thing to cool you down)",
            "correctAnswer": "fan",
            "acceptableAnswers": ["Fan", "FAN"],
            "hint": "When you are hot, you use this to make a breeze. It rhymes with pan!"
          },
          {
            "id": "wf-fb-3",
            "sentence": "Pig, big, dig, and ___ all end in -ig. (a dancer''s move)",
            "correctAnswer": "jig",
            "acceptableAnswers": ["Jig", "JIG"],
            "hint": "This is a fun little dance! It rhymes with pig!"
          },
          {
            "id": "wf-fb-4",
            "sentence": "Hop, mop, top, and ___ all end in -op. (you do this when you quit)",
            "correctAnswer": "stop",
            "acceptableAnswers": ["Stop", "STOP"],
            "hint": "A red sign on the street says this word. It rhymes with hop!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 3: READING & COMPREHENSION (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 12: Story Order
-- Module: Reading & Comprehension | Skills: Story sequencing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000c-4000-8000-000000000001',
  '10000001-0203-4000-8000-000000000001',
  1,
  'Story Order',
  'Put the parts of each story in the right order. What happened first, next, and last?',
  'Chip mixed up the pages of some stories! Oh no! Can you help put them back in order? Think about what happens first, what happens next, and what happens last. You can do it!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['5272ef01-4e2b-445c-bbcd-0ca96050e317']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq-morning",
            "prompt": "Put the morning story in order! What does Sam do first?",
            "items": [
              {"id": "step1", "text": "Sam wakes up.", "emoji": "\u2600\ufe0f", "correctPosition": 1},
              {"id": "step2", "text": "Sam eats breakfast.", "emoji": "\ud83e\udd5e", "correctPosition": 2},
              {"id": "step3", "text": "Sam brushes his teeth.", "emoji": "\ud83e\udea5", "correctPosition": 3},
              {"id": "step4", "text": "Sam goes to school.", "emoji": "\ud83c\udfeb", "correctPosition": 4}
            ],
            "hint": "Think about your morning. What do you do first when you get up?"
          },
          {
            "id": "seq-plant",
            "prompt": "Put the plant story in order! How does a seed grow?",
            "items": [
              {"id": "p-step1", "text": "Plant a seed in the dirt.", "emoji": "\ud83c\udf31", "correctPosition": 1},
              {"id": "p-step2", "text": "Water the seed.", "emoji": "\ud83d\udca7", "correctPosition": 2},
              {"id": "p-step3", "text": "A tiny green stem pops up.", "emoji": "\ud83c\udf3f", "correctPosition": 3},
              {"id": "p-step4", "text": "A flower blooms!", "emoji": "\ud83c\udf3b", "correctPosition": 4}
            ],
            "hint": "First you put the seed in the ground. Then what does a seed need to grow?"
          },
          {
            "id": "seq-dog",
            "prompt": "Put Benny the dog''s story in order!",
            "items": [
              {"id": "d-step1", "text": "Benny sees a ball.", "emoji": "\ud83d\udc36", "correctPosition": 1},
              {"id": "d-step2", "text": "Benny runs to the ball.", "emoji": "\ud83c\udfc3", "correctPosition": 2},
              {"id": "d-step3", "text": "Benny picks up the ball.", "emoji": "\u26bd", "correctPosition": 3},
              {"id": "d-step4", "text": "Benny brings the ball back.", "emoji": "\ud83c\udf89", "correctPosition": 4}
            ],
            "hint": "What does Benny see first? Then what does he do?"
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
-- LESSON 13: Who and Where? (Characters & Settings)
-- Module: Reading & Comprehension | Skills: Reading comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000d-4000-8000-000000000001',
  '10000001-0203-4000-8000-000000000001',
  2,
  'Who and Where?',
  'Read a short story and find the characters and the setting!',
  'Every story has a WHO and a WHERE! The WHO is the character -- the person or animal the story is about. The WHERE is the setting -- the place where the story happens. Let''s read some stories and find them!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['db62ca8f-1444-4448-a5c1-1eec152675c3']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ww-1",
            "prompt": "Story: Lily went to the park. She played on the swings. Her dog Max ran in the grass. WHO is the main character?",
            "options": [
              {"id": "a", "text": "Lily", "emoji": "\ud83d\udc67"},
              {"id": "b", "text": "Max", "emoji": "\ud83d\udc36"},
              {"id": "c", "text": "The swings", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The main character is the person the story is mostly about. Who did the most things?"
          },
          {
            "id": "ww-2",
            "prompt": "Story: Lily went to the park. She played on the swings. Her dog Max ran in the grass. WHERE does this story happen?",
            "options": [
              {"id": "a", "text": "At school", "emoji": "\ud83c\udfeb"},
              {"id": "b", "text": "At home", "emoji": "\ud83c\udfe0"},
              {"id": "c", "text": "At the park", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "c",
            "hint": "Look at the first sentence. Where did Lily go?"
          },
          {
            "id": "ww-3",
            "prompt": "Story: Tom baked cookies in the kitchen. He put them on a plate. His sister ate two! WHO baked the cookies?",
            "options": [
              {"id": "a", "text": "His sister", "emoji": "\ud83d\udc67"},
              {"id": "b", "text": "Tom", "emoji": "\ud83d\udc66"},
              {"id": "c", "text": "Mom", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Read the first sentence again. Who baked cookies?"
          },
          {
            "id": "ww-4",
            "prompt": "Story: Tom baked cookies in the kitchen. He put them on a plate. His sister ate two! WHERE did Tom bake?",
            "options": [
              {"id": "a", "text": "In the kitchen", "emoji": "\ud83c\udf73"},
              {"id": "b", "text": "In the garden", "emoji": "\ud83c\udf3b"},
              {"id": "c", "text": "At school", "emoji": "\ud83c\udfeb"}
            ],
            "correctOptionId": "a",
            "hint": "The story says Tom baked cookies in the ..."
          },
          {
            "id": "ww-5",
            "prompt": "Story: A little bird sat on a tree branch in the forest. It sang a happy song. A squirrel listened. WHO sang a song?",
            "options": [
              {"id": "a", "text": "The squirrel", "emoji": "\ud83d\udc3f\ufe0f"},
              {"id": "b", "text": "The little bird", "emoji": "\ud83d\udc26"},
              {"id": "c", "text": "The tree", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "b",
            "hint": "Read the second sentence. Who sang a happy song?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 14: What Happened? (Key Events)
-- Module: Reading & Comprehension | Skills: Reading comprehension, Story sequencing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000e-4000-8000-000000000001',
  '10000001-0203-4000-8000-000000000001',
  3,
  'What Happened?',
  'Read short stories and answer questions about the key events. What happened in the story?',
  'Chip loves a good story! After you read a story, it is fun to think about what happened. Let''s read together and answer some questions. Pay close attention to the details!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    'db62ca8f-1444-4448-a5c1-1eec152675c3',
    '5272ef01-4e2b-445c-bbcd-0ca96050e317'
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
            "id": "wh-1",
            "prompt": "Story: Mia lost her red hat. She looked under the bed. She looked in the closet. She found it on the chair! What did Mia lose?",
            "options": [
              {"id": "a", "text": "Her red hat", "emoji": "\ud83e\udde2"},
              {"id": "b", "text": "Her dog", "emoji": "\ud83d\udc36"},
              {"id": "c", "text": "Her shoe", "emoji": "\ud83d\udc5f"}
            ],
            "correctOptionId": "a",
            "hint": "Read the very first sentence. What did Mia lose?"
          },
          {
            "id": "wh-2",
            "prompt": "Story: Mia lost her red hat. She looked under the bed. She looked in the closet. She found it on the chair! Where did Mia find her hat?",
            "options": [
              {"id": "a", "text": "Under the bed", "emoji": "\ud83d\udecf\ufe0f"},
              {"id": "b", "text": "In the closet", "emoji": "\ud83d\udeaa"},
              {"id": "c", "text": "On the chair", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Read the last sentence. Where did Mia finally find her hat?"
          },
          {
            "id": "wh-3",
            "prompt": "Story: Ben went to the zoo. He saw a tall giraffe. He saw a funny monkey. The monkey ate a banana! What did the monkey eat?",
            "options": [
              {"id": "a", "text": "An apple", "emoji": "\ud83c\udf4e"},
              {"id": "b", "text": "A banana", "emoji": "\ud83c\udf4c"},
              {"id": "c", "text": "A cookie", "emoji": "\ud83c\udf6a"}
            ],
            "correctOptionId": "b",
            "hint": "Read the last sentence about the monkey."
          },
          {
            "id": "wh-4",
            "prompt": "Story: Ben went to the zoo. He saw a tall giraffe. He saw a funny monkey. The monkey ate a banana! Where did Ben go?",
            "options": [
              {"id": "a", "text": "To the zoo", "emoji": "\ud83e\udd92"},
              {"id": "b", "text": "To school", "emoji": "\ud83c\udfeb"},
              {"id": "c", "text": "To the store", "emoji": "\ud83c\udfea"}
            ],
            "correctOptionId": "a",
            "hint": "Read the very first sentence. Where did Ben go?"
          },
          {
            "id": "wh-5",
            "prompt": "Story: It started to rain. Emma ran inside. She got her umbrella. Then she jumped in the puddles! What did Emma do LAST?",
            "options": [
              {"id": "a", "text": "She ran inside", "emoji": "\ud83c\udfe0"},
              {"id": "b", "text": "She jumped in puddles", "emoji": "\ud83d\udca6"},
              {"id": "c", "text": "She got her umbrella", "emoji": "\u2602\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "What is the very last thing Emma did in the story?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 15: Rhyme Time!
-- Module: Reading & Comprehension | Skills: Rhyming & word families
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-000f-4000-8000-000000000001',
  '10000001-0203-4000-8000-000000000001',
  4,
  'Rhyme Time!',
  'Match words that sound the same at the end! Rhyming words are so much fun!',
  'Rhyming is when words sound the same at the end. Like cat and hat! Or bug and rug! Chip thinks rhyming is super fun. Can you find all the rhyming pairs?',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['b10791c6-0eb4-4e30-a602-2ad2a134d6b1']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match the words that rhyme! (They sound the same at the end.)",
        "pairs": [
          {
            "id": "rhyme-1",
            "left": {"id": "word-cat", "text": "cat", "emoji": "\ud83d\udc31"},
            "right": {"id": "word-hat", "text": "hat", "emoji": "\ud83e\udde2"}
          },
          {
            "id": "rhyme-2",
            "left": {"id": "word-bug", "text": "bug", "emoji": "\ud83d\udc1e"},
            "right": {"id": "word-rug", "text": "rug", "emoji": ""}
          },
          {
            "id": "rhyme-3",
            "left": {"id": "word-fish", "text": "fish", "emoji": "\ud83d\udc1f"},
            "right": {"id": "word-dish", "text": "dish", "emoji": "\ud83c\udf7d\ufe0f"}
          },
          {
            "id": "rhyme-4",
            "left": {"id": "word-cake", "text": "cake", "emoji": "\ud83c\udf82"},
            "right": {"id": "word-lake", "text": "lake", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "rhyme-5",
            "left": {"id": "word-star", "text": "star", "emoji": "\u2b50"},
            "right": {"id": "word-car", "text": "car", "emoji": "\ud83d\ude97"}
          }
        ],
        "hint": "Say each word out loud. Which two words end with the same sound?"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "rhyme-mc-1",
            "prompt": "Which word rhymes with DOG?",
            "options": [
              {"id": "a", "text": "log", "emoji": "\ud83e\udeb5"},
              {"id": "b", "text": "cat", "emoji": "\ud83d\udc31"},
              {"id": "c", "text": "sun", "emoji": "\u2600\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Dog ends with -og. Which other word ends with -og?"
          },
          {
            "id": "rhyme-mc-2",
            "prompt": "Which word rhymes with PAN?",
            "options": [
              {"id": "a", "text": "pin", "emoji": ""},
              {"id": "b", "text": "man", "emoji": "\ud83e\uddd1"},
              {"id": "c", "text": "paw", "emoji": "\ud83d\udc3e"}
            ],
            "correctOptionId": "b",
            "hint": "Pan ends with -an. Which word also ends with -an?"
          },
          {
            "id": "rhyme-mc-3",
            "prompt": "Which word rhymes with RING?",
            "options": [
              {"id": "a", "text": "ran", "emoji": ""},
              {"id": "b", "text": "red", "emoji": ""},
              {"id": "c", "text": "sing", "emoji": "\ud83c\udfa4"}
            ],
            "correctOptionId": "c",
            "hint": "Ring ends with -ing. Which word also ends with -ing?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 16: How Do They Feel? (Feelings from Context)
-- Module: Reading & Comprehension | Skills: Reading comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0010-4000-8000-000000000001',
  '10000001-0203-4000-8000-000000000001',
  5,
  'How Do They Feel?',
  'Read about characters and figure out how they are feeling! Happy, sad, scared, or excited?',
  'Did you know that when you read a story, you can figure out how the characters feel? If someone smiles and laughs, they are probably happy! If they cry, they might be sad. Let''s be feeling detectives!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['db62ca8f-1444-4448-a5c1-1eec152675c3']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "feel-1",
            "prompt": "Jess got a puppy for her birthday! She smiled big and hugged it tight. How does Jess feel?",
            "options": [
              {"id": "a", "text": "Happy", "emoji": "\ud83d\ude04"},
              {"id": "b", "text": "Sad", "emoji": "\ud83d\ude22"},
              {"id": "c", "text": "Scared", "emoji": "\ud83d\ude28"}
            ],
            "correctOptionId": "a",
            "hint": "Jess smiled big and hugged the puppy. When you smile and hug, how do you feel?"
          },
          {
            "id": "feel-2",
            "prompt": "Leo dropped his ice cream on the ground. His lip started to shake. How does Leo feel?",
            "options": [
              {"id": "a", "text": "Excited", "emoji": "\ud83e\udd29"},
              {"id": "b", "text": "Sad", "emoji": "\ud83d\ude22"},
              {"id": "c", "text": "Angry", "emoji": "\ud83d\ude20"}
            ],
            "correctOptionId": "b",
            "hint": "Leo lost his ice cream and his lip is shaking. That sounds like he might cry. How does he feel?"
          },
          {
            "id": "feel-3",
            "prompt": "Sara heard a loud noise in the dark. She hid under her blanket. How does Sara feel?",
            "options": [
              {"id": "a", "text": "Happy", "emoji": "\ud83d\ude04"},
              {"id": "b", "text": "Tired", "emoji": "\ud83d\ude34"},
              {"id": "c", "text": "Scared", "emoji": "\ud83d\ude28"}
            ],
            "correctOptionId": "c",
            "hint": "Sara heard a loud noise and hid under her blanket. Why would she hide?"
          },
          {
            "id": "feel-4",
            "prompt": "Max is going to the amusement park today! He keeps jumping up and down. How does Max feel?",
            "options": [
              {"id": "a", "text": "Excited", "emoji": "\ud83e\udd29"},
              {"id": "b", "text": "Bored", "emoji": "\ud83d\ude10"},
              {"id": "c", "text": "Sad", "emoji": "\ud83d\ude22"}
            ],
            "correctOptionId": "a",
            "hint": "Max is going somewhere fun and jumping up and down. How do you feel when something great is about to happen?"
          },
          {
            "id": "feel-5",
            "prompt": "Ava worked very hard on her drawing. Her teacher said it was beautiful! Ava stood up tall. How does Ava feel?",
            "options": [
              {"id": "a", "text": "Scared", "emoji": "\ud83d\ude28"},
              {"id": "b", "text": "Proud", "emoji": "\ud83c\udf1f"},
              {"id": "c", "text": "Angry", "emoji": "\ud83d\ude20"}
            ],
            "correctOptionId": "b",
            "hint": "Ava worked hard, her teacher liked her work, and she stood up tall. How do you feel when someone says good job?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 4: SENTENCES & GRAMMAR (4 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 17: What is a Sentence?
-- Module: Sentences & Grammar | Skills: Sentence building
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0011-4000-8000-000000000001',
  '10000001-0204-4000-8000-000000000001',
  1,
  'What is a Sentence?',
  'A sentence is a group of words that tells a complete thought. Let''s learn which groups of words are sentences!',
  'Hey friend! Chip wants to teach you about sentences! A sentence tells a whole idea. It has a WHO (like a person or animal) and a WHAT (what they do). "The cat ran" is a sentence. But just "the cat" is not -- what did the cat do? Let''s practice!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['ccbf111a-52c4-49f2-b89b-c2302f87a63e']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sent-1",
            "prompt": "Which one is a complete sentence?",
            "options": [
              {"id": "a", "text": "The big dog.", "emoji": ""},
              {"id": "b", "text": "The big dog runs fast.", "emoji": "\u2728"},
              {"id": "c", "text": "Runs fast.", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A sentence needs a WHO and a WHAT. Which one has both?"
          },
          {
            "id": "sent-2",
            "prompt": "Which one is a complete sentence?",
            "options": [
              {"id": "a", "text": "I like apples.", "emoji": "\u2728"},
              {"id": "b", "text": "Like apples.", "emoji": ""},
              {"id": "c", "text": "Red and green.", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "A sentence tells a whole idea. Which one tells you WHO likes WHAT?"
          },
          {
            "id": "sent-3",
            "prompt": "Which one is a complete sentence?",
            "options": [
              {"id": "a", "text": "On the table.", "emoji": ""},
              {"id": "b", "text": "A happy cat.", "emoji": ""},
              {"id": "c", "text": "The cat sits on the mat.", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Which one tells you WHO does WHAT? Remember, a sentence needs both parts!"
          },
          {
            "id": "sent-4",
            "prompt": "Which one is a complete sentence?",
            "options": [
              {"id": "a", "text": "She sings a song.", "emoji": "\u2728"},
              {"id": "b", "text": "Sings a song.", "emoji": ""},
              {"id": "c", "text": "A pretty song.", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Who is singing? A sentence needs to tell us WHO does the action."
          },
          {
            "id": "sent-5",
            "prompt": "Which one is NOT a complete sentence?",
            "options": [
              {"id": "a", "text": "We play outside.", "emoji": ""},
              {"id": "b", "text": "The blue ball.", "emoji": "\u2728"},
              {"id": "c", "text": "He reads a book.", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Look for the one that is missing a WHAT (an action). The blue ball did what?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 18: Capital Letters & Periods
-- Module: Sentences & Grammar | Skills: Sentence building
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0012-4000-8000-000000000001',
  '10000001-0204-4000-8000-000000000001',
  2,
  'Capital Letters & Periods',
  'Every sentence starts with a BIG letter and ends with a little dot called a period!',
  'Chip has two important rules for sentences! Rule 1: Start with a capital (big) letter. Rule 2: End with a period (a tiny dot). Let''s practice spotting which sentences follow the rules!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['ccbf111a-52c4-49f2-b89b-c2302f87a63e']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cap-1",
            "prompt": "Which sentence is written correctly?",
            "options": [
              {"id": "a", "text": "the cat is soft.", "emoji": ""},
              {"id": "b", "text": "The cat is soft.", "emoji": "\u2728"},
              {"id": "c", "text": "The cat is soft", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A correct sentence starts with a capital letter AND ends with a period."
          },
          {
            "id": "cap-2",
            "prompt": "Which sentence is written correctly?",
            "options": [
              {"id": "a", "text": "I like to run.", "emoji": "\u2728"},
              {"id": "b", "text": "i like to run.", "emoji": ""},
              {"id": "c", "text": "i like to run", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The word I is always a capital letter, and the sentence needs a period at the end."
          },
          {
            "id": "cap-3",
            "prompt": "What is MISSING from this sentence? \"she has a red bike\"",
            "options": [
              {"id": "a", "text": "A capital letter at the start", "emoji": ""},
              {"id": "b", "text": "A period at the end", "emoji": ""},
              {"id": "c", "text": "Both a capital letter and a period", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Look at the beginning -- is the first letter big? Look at the end -- is there a period?"
          },
          {
            "id": "cap-4",
            "prompt": "Which sentence is written correctly?",
            "options": [
              {"id": "a", "text": "we play ball", "emoji": ""},
              {"id": "b", "text": "We play ball.", "emoji": "\u2728"},
              {"id": "c", "text": "we Play Ball.", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Only the FIRST word gets a capital letter. And we need a period at the end!"
          },
          {
            "id": "cap-5",
            "prompt": "Fix this sentence: \"my dog is happy\" What should it look like?",
            "options": [
              {"id": "a", "text": "My dog is happy.", "emoji": "\u2728"},
              {"id": "b", "text": "my Dog is happy.", "emoji": ""},
              {"id": "c", "text": "My Dog Is Happy", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Capitalize only the first word, and add a period at the very end."
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 19: Naming Words (Nouns)
-- Module: Sentences & Grammar | Skills: Sentence building, Reading comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0013-4000-8000-000000000001',
  '10000001-0204-4000-8000-000000000001',
  3,
  'Naming Words (Nouns)',
  'Nouns are naming words! They name people, places, animals, and things.',
  'Chip has a fun word game for you! Some words are special because they NAME things. A dog is a noun. A park is a noun. Your name is a noun! These naming words are called nouns. Let''s find them!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    'ccbf111a-52c4-49f2-b89b-c2302f87a63e',
    'db62ca8f-1444-4448-a5c1-1eec152675c3'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each noun to what kind of noun it is!",
        "pairs": [
          {
            "id": "noun-person",
            "left": {"id": "w-teacher", "text": "teacher", "emoji": "\ud83d\udc69\u200d\ud83c\udfeb"},
            "right": {"id": "t-person", "text": "Person", "emoji": "\ud83d\udc64"}
          },
          {
            "id": "noun-place",
            "left": {"id": "w-school", "text": "school", "emoji": "\ud83c\udfeb"},
            "right": {"id": "t-place", "text": "Place", "emoji": "\ud83d\udccd"}
          },
          {
            "id": "noun-animal",
            "left": {"id": "w-rabbit", "text": "rabbit", "emoji": "\ud83d\udc30"},
            "right": {"id": "t-animal", "text": "Animal", "emoji": "\ud83d\udc3e"}
          },
          {
            "id": "noun-thing",
            "left": {"id": "w-ball", "text": "ball", "emoji": "\u26bd"},
            "right": {"id": "t-thing", "text": "Thing", "emoji": "\ud83d\udce6"}
          }
        ],
        "hint": "Is it a person, a place, an animal, or a thing? Think about what each word names!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "noun-mc-1",
            "prompt": "Which word is a NOUN (a naming word)?",
            "options": [
              {"id": "a", "text": "run", "emoji": ""},
              {"id": "b", "text": "happy", "emoji": ""},
              {"id": "c", "text": "tree", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "c",
            "hint": "A noun names a person, place, animal, or thing. Which word is a thing?"
          },
          {
            "id": "noun-mc-2",
            "prompt": "Which word is a NOUN?",
            "options": [
              {"id": "a", "text": "book", "emoji": "\ud83d\udcd6"},
              {"id": "b", "text": "jump", "emoji": ""},
              {"id": "c", "text": "fast", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Which word names a thing you can hold in your hands?"
          },
          {
            "id": "noun-mc-3",
            "prompt": "Find the noun in this sentence: The bird sat on a branch.",
            "options": [
              {"id": "a", "text": "sat", "emoji": ""},
              {"id": "b", "text": "bird", "emoji": "\ud83d\udc26"},
              {"id": "c", "text": "on", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Which word names a living creature in the sentence?"
          },
          {
            "id": "noun-mc-4",
            "prompt": "Find the noun in this sentence: She ate a cookie.",
            "options": [
              {"id": "a", "text": "ate", "emoji": ""},
              {"id": "b", "text": "she", "emoji": ""},
              {"id": "c", "text": "cookie", "emoji": "\ud83c\udf6a"}
            ],
            "correctOptionId": "c",
            "hint": "Which word names a yummy treat you can eat?"
          },
          {
            "id": "noun-mc-5",
            "prompt": "Which of these is NOT a noun?",
            "options": [
              {"id": "a", "text": "dog", "emoji": "\ud83d\udc36"},
              {"id": "b", "text": "big", "emoji": "\u2728"},
              {"id": "c", "text": "park", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "b",
            "hint": "One of these words describes something instead of naming something. Which one?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 20: Action Words (Verbs)
-- Module: Sentences & Grammar | Skills: Sentence building, Reading comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000002-0014-4000-8000-000000000001',
  '10000001-0204-4000-8000-000000000001',
  4,
  'Action Words (Verbs)',
  'Verbs are action words! They tell you what someone or something DOES.',
  'Last time we learned nouns -- naming words. Now Chip wants to teach you VERBS! Verbs are action words. Run, jump, eat, sing -- those are all verbs! Let''s find the action in every sentence!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY[
    'ccbf111a-52c4-49f2-b89b-c2302f87a63e',
    'db62ca8f-1444-4448-a5c1-1eec152675c3'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each action word to its picture!",
        "pairs": [
          {
            "id": "verb-run",
            "left": {"id": "w-run", "text": "run", "emoji": ""},
            "right": {"id": "p-run", "text": "Moving legs fast", "emoji": "\ud83c\udfc3"}
          },
          {
            "id": "verb-eat",
            "left": {"id": "w-eat", "text": "eat", "emoji": ""},
            "right": {"id": "p-eat", "text": "Putting food in mouth", "emoji": "\ud83c\udf54"}
          },
          {
            "id": "verb-sing",
            "left": {"id": "w-sing", "text": "sing", "emoji": ""},
            "right": {"id": "p-sing", "text": "Making music with voice", "emoji": "\ud83c\udfa4"}
          },
          {
            "id": "verb-sleep",
            "left": {"id": "w-sleep", "text": "sleep", "emoji": ""},
            "right": {"id": "p-sleep", "text": "Eyes closed in bed", "emoji": "\ud83d\ude34"}
          },
          {
            "id": "verb-read",
            "left": {"id": "w-read", "text": "read", "emoji": ""},
            "right": {"id": "p-read", "text": "Looking at words in a book", "emoji": "\ud83d\udcd6"}
          }
        ],
        "hint": "A verb tells what you DO. Match the action word to what it looks like!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "verb-mc-1",
            "prompt": "Which word is a VERB (an action word)?",
            "options": [
              {"id": "a", "text": "book", "emoji": "\ud83d\udcd6"},
              {"id": "b", "text": "jump", "emoji": "\u2728"},
              {"id": "c", "text": "red", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A verb is something you can DO. Can you book? Can you jump? Can you red?"
          },
          {
            "id": "verb-mc-2",
            "prompt": "Which word is a VERB?",
            "options": [
              {"id": "a", "text": "swim", "emoji": "\ud83c\udfca"},
              {"id": "b", "text": "table", "emoji": ""},
              {"id": "c", "text": "happy", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Which word is something you can DO in a pool?"
          },
          {
            "id": "verb-mc-3",
            "prompt": "Find the verb in this sentence: The girl runs to school.",
            "options": [
              {"id": "a", "text": "girl", "emoji": ""},
              {"id": "b", "text": "runs", "emoji": "\u2728"},
              {"id": "c", "text": "school", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "What is the girl DOING? That is the verb!"
          },
          {
            "id": "verb-mc-4",
            "prompt": "Find the verb in this sentence: He eats a banana.",
            "options": [
              {"id": "a", "text": "eats", "emoji": "\u2728"},
              {"id": "b", "text": "He", "emoji": ""},
              {"id": "c", "text": "banana", "emoji": "\ud83c\udf4c"}
            ],
            "correctOptionId": "a",
            "hint": "What is he DOING to the banana? That word is the verb!"
          },
          {
            "id": "verb-mc-5",
            "prompt": "Which of these is NOT a verb?",
            "options": [
              {"id": "a", "text": "kick", "emoji": "\u26bd"},
              {"id": "b", "text": "dance", "emoji": "\ud83d\udc83"},
              {"id": "c", "text": "chair", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "One of these is a thing (a noun), not an action. Which one can you sit on but not DO?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
