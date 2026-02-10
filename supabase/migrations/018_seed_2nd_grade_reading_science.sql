-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Reading & Science Interactive Lessons
-- =============================================================================
-- 15 browser-only interactive lessons for 2nd grade (Band 2):
--   - 8 Reading lessons across 2 modules (Digraphs & Blends, Comprehension)
--   - 7 Science lessons across 2 modules (Life Cycles, Matter & Forces)
--
-- Also seeds the 2nd-grade subjects, modules, and skills required by these
-- lessons. All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, fill_in_blank, matching_pairs,
--   sequence_order, flash_card
--
-- Subject IDs:
--   Reading (2nd grade): f04d2171-6b54-41bf-900d-d3d082ba65ed
--   Science (2nd grade): 9e6554ec-668a-4d27-b66d-412f4ce05d6d
--
-- Module IDs:
--   Digraphs & Blends:       10000002-0204-4000-8000-000000000001
--   Comprehension & Stories:  10000002-0205-4000-8000-000000000001
--   Life Cycles:              10000002-0304-4000-8000-000000000001
--   Matter & Forces:          10000002-0305-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
-- =============================================================================


-- =========================================================================
-- 1. SUBJECTS (2nd Grade Reading & Science)
-- =========================================================================
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('f04d2171-6b54-41bf-900d-d3d082ba65ed', 'reading_g2',  'Word World: Grade 2',  'Reading (2nd)', '#22C55E', 'book-open',     12),
  ('9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'science_g2',  'Discovery Lab: Grade 2', 'Science (2nd)', '#F97316', 'flask-conical', 13)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. SKILLS -- Reading 2nd Grade (prefix: 20000002)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  -- Digraphs & Blends module skills
  ('20000002-0001-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'digraphs',           'Digraphs (ch, sh, th, wh)',     'Identify and read common consonant digraphs ch, sh, th, wh',                'RF.2.3',   1),
  ('20000002-0002-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'long_vowels',        'Long Vowel Sounds',             'Distinguish long and short vowel sounds in regularly spelled one-syllable words', 'RF.2.3.A', 2),
  ('20000002-0003-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'compound_words',     'Compound Words',                'Decode compound words by identifying the two smaller words within',         'RF.2.3.D', 3),
  ('20000002-0004-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'prefixes_suffixes',  'Prefixes & Suffixes',           'Use knowledge of common prefixes (un-, re-) and suffixes (-ful, -less) to determine word meaning', 'L.2.4.B', 4),
  -- Comprehension & Stories module skills
  ('20000002-0005-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'story_elements',     'Story Elements',                'Describe the characters, setting, and plot of a story',                     'RL.2.3',   5),
  ('20000002-0006-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'main_idea',          'Main Idea & Details',           'Identify the main topic and key details in a multi-paragraph text',         'RI.2.2',   6),
  ('20000002-0007-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'punctuation',        'Punctuation (. ? !)',           'Use end punctuation correctly for statements, questions, and exclamations',  'L.2.2.A',  7)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 3. SKILLS -- Science 2nd Grade (prefix: 20000003)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000003-0001-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'life_cycles',        'Life Cycles',                   'Describe the stages of life cycles for plants and animals',                 '2-LS4-1',  1),
  ('20000003-0002-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'food_chains',        'Food Chains',                   'Identify producers, consumers, and decomposers in a simple food chain',     '2-LS4-1',  2),
  ('20000003-0003-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'states_of_matter',   'States of Matter',              'Classify objects and materials as solids, liquids, or gases based on observable properties', '2-PS1-1', 3),
  ('20000003-0004-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'push_pull',          'Push and Pull Forces',          'Plan and conduct an investigation to compare the effects of pushes and pulls', '2-PS2-1', 4),
  ('20000003-0005-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'simple_machines',    'Simple Machines',               'Identify and describe simple machines (lever, pulley, ramp, wheel, screw, wedge)', '2-PS2-2', 5),
  ('20000003-0006-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'landforms',          'Landforms',                     'Identify and describe common landforms including mountains, valleys, plains, and islands', '2-ESS2-2', 6)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 4. MODULES (Band 2 Reading & Science)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0204-4000-8000-000000000001', 2, 14, 'Digraphs & Blends',       'Master consonant digraphs, blends, long vowels, and compound words through interactive word play!', 'book-open',     'f04d2171-6b54-41bf-900d-d3d082ba65ed'),
  ('10000002-0205-4000-8000-000000000001', 2, 15, 'Comprehension & Stories', 'Build reading comprehension skills with story elements, main ideas, prefixes, and punctuation!',    'book-open',     'f04d2171-6b54-41bf-900d-d3d082ba65ed'),
  ('10000002-0304-4000-8000-000000000001', 2, 16, 'Life Cycles',             'Explore the amazing life cycles of butterflies and frogs, and discover how food chains work!',       'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d'),
  ('10000002-0305-4000-8000-000000000001', 2, 17, 'Matter & Forces',         'Investigate solids, liquids, gases, pushes, pulls, simple machines, and landforms!',                 'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- READING LESSONS (8 lessons)
-- =============================================================================


-- =========================================================================
-- READING LESSON 1: Digraph Detectives
-- Module: Digraphs & Blends | Skill: Digraphs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0001-4000-8000-000000000001',
  '10000002-0204-4000-8000-000000000001',
  1,
  'Digraph Detectives',
  'Learn the ch, sh, th, and wh sounds and spot them in words!',
  'Hey there, detective! Chip here! Some sneaky letter pairs make brand new sounds when they team up. CH says "ch" like in cheese, SH says "sh" like in ship, TH says "th" like in think, and WH says "wh" like in whale. Let''s find them all!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "dg-1",
            "prompt": "Which word starts with the \"ch\" sound? \ud83e\uddd0",
            "options": [
              {"id": "a", "text": "cheese", "emoji": "\ud83e\uddc0"},
              {"id": "b", "text": "sheep", "emoji": "\ud83d\udc11"},
              {"id": "c", "text": "three", "emoji": "3\ufe0f\u20e3"}
            ],
            "correctOptionId": "a",
            "hint": "Say each word out loud. Which one starts with \"ch\"? Ch-ch-cheese!"
          },
          {
            "id": "dg-2",
            "prompt": "Which word starts with the \"sh\" sound? \ud83d\udd0d",
            "options": [
              {"id": "a", "text": "chair", "emoji": "\ud83e\ude91"},
              {"id": "b", "text": "shell", "emoji": "\ud83d\udc1a"},
              {"id": "c", "text": "whale", "emoji": "\ud83d\udc33"}
            ],
            "correctOptionId": "b",
            "hint": "Shhh! Which word starts with that quiet \"sh\" sound?"
          },
          {
            "id": "dg-3",
            "prompt": "Which word starts with the \"th\" sound? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "ship", "emoji": "\ud83d\udea2"},
              {"id": "b", "text": "chip", "emoji": "\ud83c\udf6a"},
              {"id": "c", "text": "think", "emoji": "\ud83d\udca1"}
            ],
            "correctOptionId": "c",
            "hint": "Put your tongue between your teeth and blow. Th-th-think!"
          },
          {
            "id": "dg-4",
            "prompt": "Which word starts with the \"wh\" sound? \ud83c\udf0a",
            "options": [
              {"id": "a", "text": "whale", "emoji": "\ud83d\udc33"},
              {"id": "b", "text": "chain", "emoji": "\u26d3\ufe0f"},
              {"id": "c", "text": "thin", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Whisper \"wh\" — which word starts like \"where\" and \"when\"?"
          },
          {
            "id": "dg-5",
            "prompt": "Which word has the \"sh\" sound in the middle? \ud83c\udfaf",
            "options": [
              {"id": "a", "text": "nothing", "emoji": ""},
              {"id": "b", "text": "fishing", "emoji": "\ud83c\udfa3"},
              {"id": "c", "text": "chicken", "emoji": "\ud83d\udc14"}
            ],
            "correctOptionId": "b",
            "hint": "Listen carefully: fi-SH-ing. Do you hear the \"sh\" hiding in the middle?"
          },
          {
            "id": "dg-6",
            "prompt": "Which digraph do you hear at the END of the word \"much\"? \ud83d\udc42",
            "options": [
              {"id": "a", "text": "sh", "emoji": ""},
              {"id": "b", "text": "th", "emoji": ""},
              {"id": "c", "text": "ch", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Say \"much\" slowly: mu-CH. What sound do you hear at the end?"
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
-- READING LESSON 2: Blend It Up!
-- Module: Digraphs & Blends | Skill: Digraphs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0002-4000-8000-000000000001',
  '10000002-0204-4000-8000-000000000001',
  2,
  'Blend It Up!',
  'Practice consonant blends like bl, br, cl, cr, fl, and fr by filling in missing letters!',
  'Chip loves smoothies, and today we''re blending LETTERS! When two consonants sit next to each other, you can hear BOTH sounds blended together. Like BL in blue, or FR in frog. Fill in the missing blend to complete each word!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "bl-1",
            "prompt": "The ___og jumped into the pond! \ud83d\udc38",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "fr",
                "acceptableAnswers": ["fr", "Fr", "FR"]
              }
            ],
            "hint": "This animal says \"ribbit\" and starts with the FR blend. FR-og!"
          },
          {
            "id": "bl-2",
            "prompt": "I see a pretty ___ower in the garden! \ud83c\udf3b",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "fl",
                "acceptableAnswers": ["fl", "Fl", "FL"]
              }
            ],
            "hint": "This grows in a garden and starts with the FL blend. FL-ower!"
          },
          {
            "id": "bl-3",
            "prompt": "The sky is very ___ue today! \ud83d\udd35",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "bl",
                "acceptableAnswers": ["bl", "Bl", "BL"]
              }
            ],
            "hint": "This color starts with BL. BL-ue!"
          },
          {
            "id": "bl-4",
            "prompt": "I ate ___ead for breakfast! \ud83c\udf5e",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "br",
                "acceptableAnswers": ["br", "Br", "BR"]
              }
            ],
            "hint": "You eat this toasted or as a sandwich. It starts with BR. BR-ead!"
          },
          {
            "id": "bl-5",
            "prompt": "The ___own bear slept in the cave! \ud83d\udc3b",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "br",
                "acceptableAnswers": ["br", "Br", "BR"]
              }
            ],
            "hint": "This color starts with BR, just like bread. BR-own!"
          },
          {
            "id": "bl-6",
            "prompt": "I can ___ap my hands! \ud83d\udc4f",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "cl",
                "acceptableAnswers": ["cl", "Cl", "CL"]
              }
            ],
            "hint": "When you put your hands together it makes a CL sound. CL-ap!"
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
-- READING LESSON 3: Long Vowel Magic
-- Module: Digraphs & Blends | Skill: Long Vowels
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0003-4000-8000-000000000001',
  '10000002-0204-4000-8000-000000000001',
  3,
  'Long Vowel Magic',
  'Discover how silent e makes vowels say their own name!',
  'Chip found a magic wand -- it''s the letter E! When you put a silent E at the end of a word, it makes the vowel say its OWN NAME. Watch: "cap" becomes "cape" and "hop" becomes "hope." That sneaky silent E changes everything!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "lv-1",
            "prompt": "What happens when you add a silent E to \"cap\"? \ud83e\udde2\u2728",
            "options": [
              {"id": "a", "text": "cape", "emoji": "\ud83e\uddb8"},
              {"id": "b", "text": "cup", "emoji": ""},
              {"id": "c", "text": "cop", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Add an E to the end: c-a-p-e. Now the A says its name: \"AY\"! Cape!"
          },
          {
            "id": "lv-2",
            "prompt": "What happens when you add a silent E to \"hop\"? \ud83d\udc30",
            "options": [
              {"id": "a", "text": "hoop", "emoji": ""},
              {"id": "b", "text": "hope", "emoji": "\u2728"},
              {"id": "c", "text": "hip", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "H-O-P-E. The O says its own name now: \"OH\"! Hope!"
          },
          {
            "id": "lv-3",
            "prompt": "Which word has a LONG vowel sound? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "bit", "emoji": ""},
              {"id": "b", "text": "bike", "emoji": "\ud83d\udeb2"},
              {"id": "c", "text": "big", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Which word has a silent E at the end? The I says its own name: \"EYE\"!"
          },
          {
            "id": "lv-4",
            "prompt": "Which word has a LONG vowel sound? \ud83d\udca7",
            "options": [
              {"id": "a", "text": "tub", "emoji": ""},
              {"id": "b", "text": "cut", "emoji": ""},
              {"id": "c", "text": "tube", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "T-U-B-E has a silent E! The U says \"YOO\" like in the word \"you\"!"
          },
          {
            "id": "lv-5",
            "prompt": "Add silent E to \"kit.\" What word do you get? \ud83c\udfef",
            "options": [
              {"id": "a", "text": "kite", "emoji": "\ud83c\udfcf"},
              {"id": "b", "text": "kitten", "emoji": "\ud83d\udc31"},
              {"id": "c", "text": "kick", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "K-I-T-E. The I says its name now: \"EYE\"! A kite flies in the sky!"
          },
          {
            "id": "lv-6",
            "prompt": "Which pair shows short vowel \u2192 long vowel with silent E? \ud83d\udd04",
            "options": [
              {"id": "a", "text": "cat \u2192 cake", "emoji": ""},
              {"id": "b", "text": "pin \u2192 pine", "emoji": "\ud83c\udf32"},
              {"id": "c", "text": "dog \u2192 doge", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Which pair changes the vowel from short to long by adding a silent E?"
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
-- READING LESSON 4: Compound Word Workshop
-- Module: Digraphs & Blends | Skill: Compound Words
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0004-4000-8000-000000000001',
  '10000002-0204-4000-8000-000000000001',
  4,
  'Compound Word Workshop',
  'Match two smaller words together to build compound words!',
  'Welcome to Chip''s Word Workshop! Did you know that some BIG words are actually two small words stuck together? Like "sun" + "flower" = "sunflower"! These are called compound words. Match the word halves to build them!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match the two words that go together to make a compound word! \ud83e\udde9",
        "pairs": [
          {
            "id": "cw-1",
            "left": {"id": "sun", "text": "sun", "emoji": "\u2600\ufe0f"},
            "right": {"id": "flower", "text": "flower", "emoji": "\ud83c\udf3b"}
          },
          {
            "id": "cw-2",
            "left": {"id": "rain", "text": "rain", "emoji": "\ud83c\udf27\ufe0f"},
            "right": {"id": "bow", "text": "bow", "emoji": "\ud83c\udf08"}
          },
          {
            "id": "cw-3",
            "left": {"id": "star", "text": "star", "emoji": "\u2b50"},
            "right": {"id": "fish", "text": "fish", "emoji": "\ud83d\udc1f"}
          },
          {
            "id": "cw-4",
            "left": {"id": "cup", "text": "cup", "emoji": "\u2615"},
            "right": {"id": "cake", "text": "cake", "emoji": "\ud83e\uddc1"}
          },
          {
            "id": "cw-5",
            "left": {"id": "butter", "text": "butter", "emoji": "\ud83e\uddc8"},
            "right": {"id": "fly", "text": "fly", "emoji": "\ud83e\udeb0"}
          },
          {
            "id": "cw-6",
            "left": {"id": "book", "text": "book", "emoji": "\ud83d\udcd6"},
            "right": {"id": "worm", "text": "worm", "emoji": "\ud83d\udc1b"}
          }
        ],
        "hint": "Think about it: which two words combine to make a real word? Sun + flower = sunflower!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- READING LESSON 5: Prefix Power!
-- Module: Comprehension & Stories | Skill: Prefixes/Suffixes
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0005-4000-8000-000000000001',
  '10000002-0205-4000-8000-000000000001',
  1,
  'Prefix Power!',
  'Learn how un- and re- change the meaning of words!',
  'Chip discovered something amazing! You can add tiny word parts to the FRONT of a word to change its meaning! Adding "un-" means "not" -- so "unhappy" means "not happy." Adding "re-" means "again" -- so "redo" means "do again." Try it out!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "pf-1",
            "prompt": "If happy means glad, ___happy means NOT glad. \ud83d\ude14",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "un",
                "acceptableAnswers": ["un", "Un", "UN"]
              }
            ],
            "hint": "Which prefix means \"not\"? Starts with U!"
          },
          {
            "id": "pf-2",
            "prompt": "If \"do\" means to finish something, ___do means to do it AGAIN! \ud83d\udd04",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "re",
                "acceptableAnswers": ["re", "Re", "RE"]
              }
            ],
            "hint": "Which prefix means \"again\"? Starts with R!"
          },
          {
            "id": "pf-3",
            "prompt": "My shoelaces came ___tied! They are NOT tied anymore. \ud83d\udc5f",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "un",
                "acceptableAnswers": ["un", "Un", "UN"]
              }
            ],
            "hint": "The shoelaces are NOT tied. Which prefix means \"not\"?"
          },
          {
            "id": "pf-4",
            "prompt": "I need to ___read this book because it was so good! \ud83d\udcd6",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "re",
                "acceptableAnswers": ["re", "Re", "RE"]
              }
            ],
            "hint": "You want to read it AGAIN. Which prefix means \"again\"?"
          },
          {
            "id": "pf-5",
            "prompt": "The door is ___locked. It is NOT locked! \ud83d\udd13",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "un",
                "acceptableAnswers": ["un", "Un", "UN"]
              }
            ],
            "hint": "The door is NOT locked. Un- means not!"
          },
          {
            "id": "pf-6",
            "prompt": "Oops! Let me ___write my name more neatly! \u270d\ufe0f",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "re",
                "acceptableAnswers": ["re", "Re", "RE"]
              }
            ],
            "hint": "You want to write it AGAIN, but better. Re- means again!"
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
-- READING LESSON 6: Story Parts
-- Module: Comprehension & Stories | Skill: Story Elements
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0006-4000-8000-000000000001',
  '10000002-0205-4000-8000-000000000001',
  2,
  'Story Parts',
  'Learn about characters, setting, problem, and solution in stories!',
  'Every great story has special parts! There are CHARACTERS (who the story is about), a SETTING (where and when it happens), a PROBLEM (something goes wrong), and a SOLUTION (how it gets fixed). Let''s read a little story and find all the parts!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sp-1",
            "prompt": "\ud83d\udcd6 Story: \"Luna the cat was lost in the park. She climbed a tall tree to look around. She spotted her house and ran home!\" Who is the CHARACTER in this story?",
            "options": [
              {"id": "a", "text": "The park", "emoji": "\ud83c\udfde\ufe0f"},
              {"id": "b", "text": "Luna the cat", "emoji": "\ud83d\udc31"},
              {"id": "c", "text": "The tree", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "b",
            "hint": "A character is WHO the story is about. Who was lost?"
          },
          {
            "id": "sp-2",
            "prompt": "\ud83d\udcd6 Same story about Luna. What is the SETTING?",
            "options": [
              {"id": "a", "text": "A park", "emoji": "\ud83c\udfde\ufe0f"},
              {"id": "b", "text": "A school", "emoji": "\ud83c\udfeb"},
              {"id": "c", "text": "A beach", "emoji": "\ud83c\udfd6\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "The setting is WHERE the story happens. Where was Luna?"
          },
          {
            "id": "sp-3",
            "prompt": "\ud83d\udcd6 Same story. What is the PROBLEM?",
            "options": [
              {"id": "a", "text": "Luna was hungry", "emoji": ""},
              {"id": "b", "text": "Luna was lost", "emoji": "\u2728"},
              {"id": "c", "text": "Luna was sleepy", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A problem is what goes WRONG. What happened to Luna at the start?"
          },
          {
            "id": "sp-4",
            "prompt": "\ud83d\udcd6 Same story. What is the SOLUTION?",
            "options": [
              {"id": "a", "text": "She climbed a tree and found her way home", "emoji": "\ud83c\udfe0"},
              {"id": "b", "text": "She fell asleep", "emoji": ""},
              {"id": "c", "text": "A bird helped her", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The solution is how the problem gets FIXED. How did Luna get home?"
          },
          {
            "id": "sp-5",
            "prompt": "\ud83d\udcd6 New story: \"Ben lost his toy at school. He asked his teacher for help. She found it under a desk!\" Who is the main CHARACTER?",
            "options": [
              {"id": "a", "text": "The desk", "emoji": ""},
              {"id": "b", "text": "Ben", "emoji": "\ud83d\udc66"},
              {"id": "c", "text": "The school", "emoji": "\ud83c\udfeb"}
            ],
            "correctOptionId": "b",
            "hint": "Who is the story mostly about? Who lost something?"
          },
          {
            "id": "sp-6",
            "prompt": "\ud83d\udcd6 Same story about Ben. What is the SETTING?",
            "options": [
              {"id": "a", "text": "At home", "emoji": "\ud83c\udfe0"},
              {"id": "b", "text": "At school", "emoji": "\ud83c\udfeb"},
              {"id": "c", "text": "At the park", "emoji": "\ud83c\udfde\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Where did Ben lose his toy?"
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
-- READING LESSON 7: What's the Big Idea?
-- Module: Comprehension & Stories | Skill: Main Idea
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0007-4000-8000-000000000001',
  '10000002-0205-4000-8000-000000000001',
  3,
  'What''s the Big Idea?',
  'Find the main idea and important details in short paragraphs!',
  'Chip loves reading, and every paragraph has ONE big idea -- that''s called the MAIN IDEA! The other sentences give details that support it. Think of it like a sandwich: the main idea is the bread, and the details are the yummy stuff inside. Let''s practice finding the big idea!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mi-1",
            "prompt": "\ud83d\udcd6 \"Dogs make great pets. They are loyal and friendly. Dogs love to play fetch. They can learn many tricks.\" What is the MAIN IDEA?",
            "options": [
              {"id": "a", "text": "Dogs can learn tricks", "emoji": ""},
              {"id": "b", "text": "Dogs make great pets", "emoji": "\ud83d\udc36"},
              {"id": "c", "text": "Dogs play fetch", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The main idea is the BIG message. All the other sentences tell us WHY dogs make great pets."
          },
          {
            "id": "mi-2",
            "prompt": "\ud83d\udcd6 \"Apples are a healthy snack. They come in red, green, and yellow. Apples have vitamins that help your body. They taste sweet and crunchy!\" What is the MAIN IDEA?",
            "options": [
              {"id": "a", "text": "Apples are a healthy snack", "emoji": "\ud83c\udf4e"},
              {"id": "b", "text": "Apples are red", "emoji": ""},
              {"id": "c", "text": "Apples are crunchy", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Which sentence tells you the BIGGEST idea about apples? The other sentences give more details."
          },
          {
            "id": "mi-3",
            "prompt": "\ud83d\udcd6 \"Winter is a cold season. Snow covers the ground. People wear warm coats and hats. Kids build snowmen and have snowball fights.\" Which is a DETAIL, not the main idea?",
            "options": [
              {"id": "a", "text": "Winter is a cold season", "emoji": ""},
              {"id": "b", "text": "Kids build snowmen", "emoji": "\u26c4"},
              {"id": "c", "text": "Winter is fun", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A detail is a smaller fact that supports the big idea. Which one is just one thing that happens in winter?"
          },
          {
            "id": "mi-4",
            "prompt": "\ud83d\udcd6 \"The ocean is full of amazing animals. Dolphins jump through waves. Octopuses have eight arms. Sea turtles swim thousands of miles.\" What is the MAIN IDEA?",
            "options": [
              {"id": "a", "text": "Dolphins jump through waves", "emoji": ""},
              {"id": "b", "text": "Sea turtles swim far", "emoji": ""},
              {"id": "c", "text": "The ocean is full of amazing animals", "emoji": "\ud83c\udf0a"}
            ],
            "correctOptionId": "c",
            "hint": "All the sentences talk about different ocean animals. What is the BIG idea that connects them all?"
          },
          {
            "id": "mi-5",
            "prompt": "\ud83d\udcd6 \"Brushing your teeth is important. It removes food stuck in your teeth. Brushing keeps your gums healthy. It helps prevent cavities.\" What is the MAIN IDEA?",
            "options": [
              {"id": "a", "text": "Brushing removes food", "emoji": ""},
              {"id": "b", "text": "Brushing your teeth is important", "emoji": "\ud83e\udea5"},
              {"id": "c", "text": "Cavities are bad", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The first sentence usually gives the main idea. The rest explain WHY."
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
-- READING LESSON 8: Punctuation Station
-- Module: Comprehension & Stories | Skill: Punctuation
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0008-4000-8000-000000000001',
  '10000002-0205-4000-8000-000000000001',
  4,
  'Punctuation Station',
  'Choose the right ending mark: period, question mark, or exclamation point!',
  'All aboard the Punctuation Station! Every sentence needs a mark at the end. A PERIOD (.) ends a regular sentence. A QUESTION MARK (?) ends a question. An EXCLAMATION POINT (!) shows excitement or strong feelings. Let''s pick the right one!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pn-1",
            "prompt": "\"The cat sat on the mat___\" Which punctuation mark goes at the end? \ud83d\udc31",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "This is a regular statement -- it tells us something. Statements end with a period."
          },
          {
            "id": "pn-2",
            "prompt": "\"Where is my backpack___\" Which punctuation mark goes at the end? \ud83c\udf92",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": "\u2728"},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "This sentence is asking something. Questions end with a question mark!"
          },
          {
            "id": "pn-3",
            "prompt": "\"Watch out for that puddle___\" Which punctuation mark goes at the end? \ud83d\udca6",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "This is a warning with strong feeling! Exciting or urgent sentences end with !"
          },
          {
            "id": "pn-4",
            "prompt": "\"Do you like ice cream___\" Which punctuation mark goes at the end? \ud83c\udf66",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": "\u2728"},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Someone is asking you a question about ice cream. Questions get a ?"
          },
          {
            "id": "pn-5",
            "prompt": "\"I love playing with my friends___\" Which punctuation mark goes at the end? \ud83d\udc6b",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": "\u2728"},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "This tells us something in a calm way. It is a statement, so it ends with a period."
          },
          {
            "id": "pn-6",
            "prompt": "\"We won the game___\" Which punctuation mark goes at the end? \ud83c\udfc6",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Winning is exciting! When you feel excited or surprised, use an exclamation point!"
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


-- =============================================================================
-- SCIENCE LESSONS (7 lessons)
-- =============================================================================


-- =========================================================================
-- SCIENCE LESSON 1: Butterfly Life Cycle
-- Module: Life Cycles | Skill: Life Cycles
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0001-4000-8000-000000000001',
  '10000002-0304-4000-8000-000000000001',
  1,
  'Butterfly Life Cycle',
  'Learn the four stages of a butterfly''s life and put them in order!',
  'Chip found a beautiful butterfly in the garden! But did you know butterflies weren''t always butterflies? They go through an AMAZING transformation called a life cycle. First they''re a tiny egg, then a hungry caterpillar, then they wrap up in a chrysalis, and FINALLY -- a butterfly! Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "bf-seq-1",
            "prompt": "Put the butterfly life cycle in the correct order! \ud83e\udd8b",
            "items": [
              {"id": "egg", "text": "Egg", "emoji": "\ud83e\udd5a", "correctPosition": 1},
              {"id": "caterpillar", "text": "Caterpillar", "emoji": "\ud83d\udc1b", "correctPosition": 2},
              {"id": "chrysalis", "text": "Chrysalis", "emoji": "\ud83e\udea6", "correctPosition": 3},
              {"id": "butterfly", "text": "Butterfly", "emoji": "\ud83e\udd8b", "correctPosition": 4}
            ],
            "hint": "It starts as an egg, then hatches into a caterpillar, then wraps in a chrysalis, and finally becomes a butterfly!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "bf-mc-1",
            "prompt": "What does a caterpillar do A LOT before it becomes a chrysalis? \ud83d\udc1b",
            "options": [
              {"id": "a", "text": "Eat leaves", "emoji": "\ud83c\udf43"},
              {"id": "b", "text": "Fly around", "emoji": ""},
              {"id": "c", "text": "Sing songs", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Caterpillars are VERY hungry! They eat and eat to grow big and strong."
          },
          {
            "id": "bf-mc-2",
            "prompt": "What is a chrysalis? \ud83e\udea6",
            "options": [
              {"id": "a", "text": "A type of flower", "emoji": "\ud83c\udf3a"},
              {"id": "b", "text": "A protective shell where the caterpillar transforms", "emoji": "\u2728"},
              {"id": "c", "text": "A baby butterfly", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The caterpillar wraps itself up in something special while it changes into a butterfly."
          },
          {
            "id": "bf-mc-3",
            "prompt": "Where does a butterfly lay its eggs? \ud83e\udd5a",
            "options": [
              {"id": "a", "text": "On leaves", "emoji": "\ud83c\udf3f"},
              {"id": "b", "text": "In water", "emoji": "\ud83d\udca7"},
              {"id": "c", "text": "In the dirt", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Butterflies lay their eggs on plants so the caterpillars have food to eat when they hatch!"
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
-- SCIENCE LESSON 2: Frog Life Cycle
-- Module: Life Cycles | Skill: Life Cycles
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0002-4000-8000-000000000001',
  '10000002-0304-4000-8000-000000000001',
  2,
  'Frog Life Cycle',
  'Discover how a tiny egg in a pond grows into a hopping frog!',
  'Ribbit! Chip went to the pond and found something cool -- frog eggs! Did you know frogs start as tiny jelly-like eggs in the water? Then they become tadpoles with tails, grow legs, lose their tail, and finally become grown-up frogs! Let''s put it in order!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "fr-seq-1",
            "prompt": "Put the frog life cycle in the correct order! \ud83d\udc38",
            "items": [
              {"id": "egg", "text": "Egg (in water)", "emoji": "\ud83e\udd5a", "correctPosition": 1},
              {"id": "tadpole", "text": "Tadpole", "emoji": "\ud83d\udc1f", "correctPosition": 2},
              {"id": "tadpole-legs", "text": "Tadpole with legs", "emoji": "\ud83e\uddbe", "correctPosition": 3},
              {"id": "froglet", "text": "Froglet (tiny frog with tail)", "emoji": "\ud83d\udc38", "correctPosition": 4},
              {"id": "frog", "text": "Adult Frog", "emoji": "\ud83d\udc38", "correctPosition": 5}
            ],
            "hint": "Start with the egg in water, then the swimming tadpole, then it grows legs, becomes a froglet, and finally a full-grown frog!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "fr-mc-1",
            "prompt": "How does a tadpole breathe? \ud83d\udc1f",
            "options": [
              {"id": "a", "text": "With lungs, like us", "emoji": ""},
              {"id": "b", "text": "With gills, like a fish", "emoji": "\u2728"},
              {"id": "c", "text": "Through its skin only", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Tadpoles live underwater! They breathe like fish do."
          },
          {
            "id": "fr-mc-2",
            "prompt": "What happens to a tadpole''s tail as it grows into a frog? \ud83d\udc38",
            "options": [
              {"id": "a", "text": "It gets longer", "emoji": ""},
              {"id": "b", "text": "It falls off", "emoji": ""},
              {"id": "c", "text": "It shrinks and disappears", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "The body absorbs the tail as the frog grows. It slowly gets smaller and smaller!"
          },
          {
            "id": "fr-mc-3",
            "prompt": "Where do frogs lay their eggs? \ud83e\udd5a",
            "options": [
              {"id": "a", "text": "In water", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "In a nest", "emoji": ""},
              {"id": "c", "text": "Underground", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Baby tadpoles need to swim right away! They need to be somewhere wet."
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
-- SCIENCE LESSON 3: Food Chain Fun
-- Module: Life Cycles | Skill: Food Chains
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0003-4000-8000-000000000001',
  '10000002-0304-4000-8000-000000000001',
  3,
  'Food Chain Fun',
  'Learn how energy flows from the sun to plants to animals in a food chain!',
  'Chip is hungry, and so is everything in nature! A food chain shows who eats what. It starts with the SUN giving energy to plants. Then animals eat the plants, and bigger animals eat the smaller animals. Let''s put it all in order and learn who''s who!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "fc-seq-1",
            "prompt": "Put this food chain in order from energy source to top predator! \u2600\ufe0f\u27a1\ufe0f\ud83e\udd85",
            "items": [
              {"id": "sun", "text": "Sun (energy)", "emoji": "\u2600\ufe0f", "correctPosition": 1},
              {"id": "plant", "text": "Plant (producer)", "emoji": "\ud83c\udf31", "correctPosition": 2},
              {"id": "caterpillar", "text": "Caterpillar", "emoji": "\ud83d\udc1b", "correctPosition": 3},
              {"id": "bird", "text": "Bird", "emoji": "\ud83d\udc26", "correctPosition": 4},
              {"id": "hawk", "text": "Hawk", "emoji": "\ud83e\udd85", "correctPosition": 5}
            ],
            "hint": "Start with the sun! Then think: plants use sunlight, caterpillars eat plants, birds eat caterpillars, and hawks eat birds!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each living thing to its role in the food chain! \ud83c\udf0e",
        "pairs": [
          {
            "id": "fc-p1",
            "left": {"id": "grass", "text": "Grass", "emoji": "\ud83c\udf3f"},
            "right": {"id": "producer", "text": "Producer (makes food)", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "fc-p2",
            "left": {"id": "rabbit", "text": "Rabbit", "emoji": "\ud83d\udc30"},
            "right": {"id": "consumer", "text": "Consumer (eats others)", "emoji": "\ud83c\udf7d\ufe0f"}
          },
          {
            "id": "fc-p3",
            "left": {"id": "mushroom", "text": "Mushroom", "emoji": "\ud83c\udf44"},
            "right": {"id": "decomposer", "text": "Decomposer (breaks down dead things)", "emoji": "\u267b\ufe0f"}
          },
          {
            "id": "fc-p4",
            "left": {"id": "tree", "text": "Oak Tree", "emoji": "\ud83c\udf33"},
            "right": {"id": "producer2", "text": "Producer (makes food)", "emoji": "\u2600\ufe0f"}
          }
        ],
        "hint": "Producers MAKE their own food from sunlight. Consumers EAT other living things. Decomposers break down dead plants and animals!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- SCIENCE LESSON 4: Solid, Liquid, Gas
-- Module: Matter & Forces | Skill: States of Matter
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0004-4000-8000-000000000001',
  '10000002-0305-4000-8000-000000000001',
  1,
  'Solid, Liquid, Gas',
  'Discover the three states of matter and sort everyday things into each group!',
  'Everything around you is made of MATTER, and matter comes in three forms! SOLIDS keep their shape (like a rock). LIQUIDS flow and take the shape of their container (like water). GASES spread out and fill up space (like the air you breathe). Let''s sort them!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "slg-1",
            "prompt": "Is an ice cube a solid, liquid, or gas? \ud83e\uddca",
            "options": [
              {"id": "a", "text": "Solid", "emoji": "\u2728"},
              {"id": "b", "text": "Liquid", "emoji": ""},
              {"id": "c", "text": "Gas", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Can you hold an ice cube? Does it keep its shape? Solids keep their shape!"
          },
          {
            "id": "slg-2",
            "prompt": "Is juice a solid, liquid, or gas? \ud83e\uddc3",
            "options": [
              {"id": "a", "text": "Solid", "emoji": ""},
              {"id": "b", "text": "Liquid", "emoji": "\u2728"},
              {"id": "c", "text": "Gas", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Can you pour juice? Does it take the shape of the cup? That is what liquids do!"
          },
          {
            "id": "slg-3",
            "prompt": "What state of matter is the air inside a balloon? \ud83c\udf88",
            "options": [
              {"id": "a", "text": "Solid", "emoji": ""},
              {"id": "b", "text": "Liquid", "emoji": ""},
              {"id": "c", "text": "Gas", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "You can''t see air, but it fills up the whole balloon. Gases spread out to fill their container!"
          },
          {
            "id": "slg-4",
            "prompt": "What happens when you heat an ice cube? \ud83d\udd25\ud83e\uddca",
            "options": [
              {"id": "a", "text": "It turns into a liquid (water)", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "It gets bigger", "emoji": ""},
              {"id": "c", "text": "Nothing happens", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "When solids get warm, they can melt! Ice melts into water."
          },
          {
            "id": "slg-5",
            "prompt": "Which of these is a GAS? \ud83d\udca8",
            "options": [
              {"id": "a", "text": "A rock", "emoji": "\ud83e\udea8"},
              {"id": "b", "text": "Milk", "emoji": "\ud83e\udd5b"},
              {"id": "c", "text": "Steam from a kettle", "emoji": "\u2668\ufe0f"}
            ],
            "correctOptionId": "c",
            "hint": "Steam rises up and spreads through the air. You can see it but you can''t hold it!"
          },
          {
            "id": "slg-6",
            "prompt": "A wooden block is a ___. It keeps its shape! \ud83e\uddf1",
            "options": [
              {"id": "a", "text": "Solid", "emoji": "\u2728"},
              {"id": "b", "text": "Liquid", "emoji": ""},
              {"id": "c", "text": "Gas", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "You can pick it up and it stays the same shape. That means it is a solid!"
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
-- SCIENCE LESSON 5: Push and Pull
-- Module: Matter & Forces | Skill: Push/Pull
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0005-4000-8000-000000000001',
  '10000002-0305-4000-8000-000000000001',
  2,
  'Push and Pull',
  'Discover pushes and pulls -- the two kinds of forces that make things move!',
  'Hey, Chip wants to know: how do things move? There are two main forces -- PUSH moves things AWAY from you, and PULL brings things TOWARD you! When you kick a ball, that''s a push. When you open a drawer, that''s a pull. Let''s figure out which is which!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Is each action a PUSH or a PULL? Match them up! \ud83d\udcaa",
        "pairs": [
          {
            "id": "pp-1",
            "left": {"id": "kick", "text": "Kicking a ball", "emoji": "\u26bd"},
            "right": {"id": "push1", "text": "Push", "emoji": "\u27a1\ufe0f"}
          },
          {
            "id": "pp-2",
            "left": {"id": "tug", "text": "Tug of war", "emoji": "\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1"},
            "right": {"id": "pull1", "text": "Pull", "emoji": "\u2b05\ufe0f"}
          },
          {
            "id": "pp-3",
            "left": {"id": "open-drawer", "text": "Opening a drawer", "emoji": "\ud83d\uddc4\ufe0f"},
            "right": {"id": "pull2", "text": "Pull", "emoji": "\u2b05\ufe0f"}
          },
          {
            "id": "pp-4",
            "left": {"id": "push-swing", "text": "Pushing a friend on a swing", "emoji": "\ud83d\ude80"},
            "right": {"id": "push2", "text": "Push", "emoji": "\u27a1\ufe0f"}
          }
        ],
        "hint": "Push means you move something AWAY from you. Pull means you bring something TOWARD you!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pp-mc-1",
            "prompt": "A magnet on the fridge holds up a picture. Is the magnet pushing or pulling? \ud83e\uddf2",
            "options": [
              {"id": "a", "text": "Pushing", "emoji": ""},
              {"id": "b", "text": "Pulling", "emoji": "\u2728"}
            ],
            "correctOptionId": "b",
            "hint": "The magnet sticks to the fridge -- it is pulling toward the metal!"
          },
          {
            "id": "pp-mc-2",
            "prompt": "What happens if you push a toy car harder? \ud83d\ude97",
            "options": [
              {"id": "a", "text": "It goes faster and farther", "emoji": "\ud83d\udca8"},
              {"id": "b", "text": "It goes slower", "emoji": ""},
              {"id": "c", "text": "Nothing changes", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "A bigger push means more force! More force makes things move faster and farther."
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
-- SCIENCE LESSON 6: Simple Machines
-- Module: Matter & Forces | Skill: Simple Machines
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0006-4000-8000-000000000001',
  '10000002-0305-4000-8000-000000000001',
  3,
  'Simple Machines',
  'Match simple machines to real-life examples and learn how they help us!',
  'Chip loves building things! Did you know there are SIX simple machines that help people do work? A ramp helps you roll things up. A lever helps you lift heavy stuff. A wheel helps things roll. Let''s match each simple machine to something you''ve seen in real life!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each simple machine to a real-life example! \ud83d\udd27",
        "pairs": [
          {
            "id": "sm-1",
            "left": {"id": "ramp", "text": "Ramp (inclined plane)", "emoji": "\ud83d\udea7"},
            "right": {"id": "slide", "text": "A playground slide", "emoji": "\ud83d\udecb\ufe0f"}
          },
          {
            "id": "sm-2",
            "left": {"id": "lever", "text": "Lever", "emoji": "\u2696\ufe0f"},
            "right": {"id": "seesaw", "text": "A seesaw", "emoji": "\ud83c\udfa2"}
          },
          {
            "id": "sm-3",
            "left": {"id": "wheel", "text": "Wheel and axle", "emoji": "\u2699\ufe0f"},
            "right": {"id": "wagon", "text": "A wagon", "emoji": "\ud83d\udeb2"}
          },
          {
            "id": "sm-4",
            "left": {"id": "pulley", "text": "Pulley", "emoji": "\ud83e\uddf5"},
            "right": {"id": "flag", "text": "A flagpole", "emoji": "\ud83c\udff3\ufe0f"}
          },
          {
            "id": "sm-5",
            "left": {"id": "wedge", "text": "Wedge", "emoji": "\ud83d\udd2a"},
            "right": {"id": "axe", "text": "An axe for splitting wood", "emoji": "\ud83e\udeb5"}
          },
          {
            "id": "sm-6",
            "left": {"id": "screw", "text": "Screw", "emoji": "\ud83e\ude9b"},
            "right": {"id": "jar-lid", "text": "A jar lid", "emoji": "\ud83c\udffa"}
          }
        ],
        "hint": "Think about how each machine works! A ramp is a flat surface that goes up. A lever rocks back and forth. A pulley uses a rope to lift things."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- SCIENCE LESSON 7: Landform Explorer
-- Module: Matter & Forces | Skill: Landforms
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0007-4000-8000-000000000001',
  '10000002-0305-4000-8000-000000000001',
  4,
  'Landform Explorer',
  'Explore mountains, valleys, plains, and islands with flash cards and a quiz!',
  'Chip is going on a world tour! The Earth has so many cool shapes on its surface -- tall mountains, flat plains, deep valleys, and islands surrounded by water. Let''s flip through some cards to learn about each landform, and then take a quiz to show what you know!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about different landforms! \ud83c\udf0d",
        "cards": [
          {
            "id": "lf-1",
            "front": {"text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"},
            "back": {"text": "A very tall, rocky landform that rises high above the land around it. Some have snow on top!", "emoji": "\ud83c\udfd4\ufe0f"}
          },
          {
            "id": "lf-2",
            "front": {"text": "Valley", "emoji": "\ud83c\udf3e"},
            "back": {"text": "A low area of land between hills or mountains. Rivers often flow through valleys.", "emoji": "\ud83c\udf3e"}
          },
          {
            "id": "lf-3",
            "front": {"text": "Plain", "emoji": "\ud83c\udf3f"},
            "back": {"text": "A large, flat area of land. Great for farming! Prairies and grasslands are plains.", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "lf-4",
            "front": {"text": "Island", "emoji": "\ud83c\udfdd\ufe0f"},
            "back": {"text": "Land that is completely surrounded by water on all sides. Hawaii is made of islands!", "emoji": "\ud83c\udfdd\ufe0f"}
          },
          {
            "id": "lf-5",
            "front": {"text": "Desert", "emoji": "\ud83c\udfdc\ufe0f"},
            "back": {"text": "A very dry area that gets very little rain. Deserts can be hot or cold!", "emoji": "\ud83c\udfdc\ufe0f"}
          },
          {
            "id": "lf-6",
            "front": {"text": "Hill", "emoji": "\u26f0\ufe0f"},
            "back": {"text": "A raised area of land, smaller than a mountain. Hills have gentle slopes and rounded tops.", "emoji": "\u26f0\ufe0f"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "lf-mc-1",
            "prompt": "Which landform is completely surrounded by water? \ud83c\udf0a",
            "options": [
              {"id": "a", "text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"},
              {"id": "b", "text": "Island", "emoji": "\ud83c\udfdd\ufe0f"},
              {"id": "c", "text": "Plain", "emoji": "\ud83c\udf3f"}
            ],
            "correctOptionId": "b",
            "hint": "Think about which landform has water all around it!"
          },
          {
            "id": "lf-mc-2",
            "prompt": "Which landform is flat and great for farming? \ud83c\udf3e",
            "options": [
              {"id": "a", "text": "Valley", "emoji": ""},
              {"id": "b", "text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"},
              {"id": "c", "text": "Plain", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "This is a large, FLAT area of land. Perfect for growing crops!"
          },
          {
            "id": "lf-mc-3",
            "prompt": "A low area between two mountains is called a ___. \ud83c\udfd4\ufe0f\ud83c\udf3e\ud83c\udfd4\ufe0f",
            "options": [
              {"id": "a", "text": "Valley", "emoji": "\u2728"},
              {"id": "b", "text": "Desert", "emoji": "\ud83c\udfdc\ufe0f"},
              {"id": "c", "text": "Island", "emoji": "\ud83c\udfdd\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "It sits LOW between two high places. Rivers often flow through it!"
          },
          {
            "id": "lf-mc-4",
            "prompt": "Which landform is the TALLEST? \ud83d\udcaa",
            "options": [
              {"id": "a", "text": "Hill", "emoji": "\u26f0\ufe0f"},
              {"id": "b", "text": "Plain", "emoji": "\ud83c\udf3f"},
              {"id": "c", "text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"}
            ],
            "correctOptionId": "c",
            "hint": "This rises VERY high above the land around it. Some have snow on top!"
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
