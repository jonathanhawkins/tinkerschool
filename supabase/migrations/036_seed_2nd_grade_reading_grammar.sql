-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Reading Module: Grammar & Writing
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Grammar & Writing module (collective nouns, past tense verbs, adjectives
--     & adverbs, punctuation, sentence expanding)
--
-- Reuses existing skill from 018:
--   Punctuation (. ? !):              20000002-0007-4000-8000-000000000001
-- Adds new skills:
--   Parts of Speech:                  20000002-0009-4000-8000-000000000001
--   Punctuation & Capitalization:     20000002-000a-4000-8000-000000000001
--
-- Widget types used: matching_pairs, fill_in_blank, multiple_choice,
--   sequence_order
--
-- Subject ID:
--   Reading (2nd grade): f04d2171-6b54-41bf-900d-d3d082ba65ed
--
-- Module ID:
--   Grammar & Writing:  10000002-0207-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql, 018_seed_2nd_grade_reading_science.sql
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Grammar & Writing (2nd Grade Reading)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000002-0009-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'parts_of_speech',          'Parts of Speech',               'Identify and use nouns, verbs, adjectives, and adverbs in sentences',        'L.2.1',  9),
  ('20000002-000a-4000-8000-000000000001', 'f04d2171-6b54-41bf-900d-d3d082ba65ed', 'punctuation_capitalization', 'Punctuation & Capitalization',  'Use correct capitalization, commas, and end punctuation in writing',          'L.2.2', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE -- Grammar & Writing (Band 2 Reading)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0207-4000-8000-000000000001', 2, 26, 'Grammar & Writing', 'Level up your sentences! Learn about nouns, verbs, adjectives, and punctuation to write like a pro!', 'book-open', 'f04d2171-6b54-41bf-900d-d3d082ba65ed')
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Nouns Everywhere (Collective Nouns)
-- Module: Grammar & Writing | Skill: Parts of Speech
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0015-4000-8000-000000000001',
  '10000002-0207-4000-8000-000000000001',
  1,
  'Nouns Everywhere (Collective Nouns)',
  'Discover the special names for groups of animals and things!',
  'Hey there! Chip just learned something AMAZING! Did you know that a group of birds is called a FLOCK? And a group of wolves is called a PACK? These special group names are called collective nouns, and they''re super fun. Let''s match each group name to the right animal!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each collective noun to the group it describes! \ud83e\udd81",
        "pairs": [
          {
            "id": "cn-1",
            "left": {"id": "flock", "text": "A flock", "emoji": "\ud83d\udc26"},
            "right": {"id": "birds", "text": "Birds", "emoji": "\ud83d\udc26"}
          },
          {
            "id": "cn-2",
            "left": {"id": "team", "text": "A team", "emoji": "\ud83c\udfc5"},
            "right": {"id": "players", "text": "Players", "emoji": "\u26bd"}
          },
          {
            "id": "cn-3",
            "left": {"id": "herd", "text": "A herd", "emoji": "\ud83d\udc04"},
            "right": {"id": "cows", "text": "Cows", "emoji": "\ud83d\udc04"}
          },
          {
            "id": "cn-4",
            "left": {"id": "pack", "text": "A pack", "emoji": "\ud83d\udc3a"},
            "right": {"id": "wolves", "text": "Wolves", "emoji": "\ud83d\udc3a"}
          },
          {
            "id": "cn-5",
            "left": {"id": "school", "text": "A school", "emoji": "\ud83d\udc1f"},
            "right": {"id": "fish", "text": "Fish", "emoji": "\ud83d\udc20"}
          }
        ],
        "hint": "A flock flies in the sky, a team plays together, a herd grazes in a field, a pack hunts together, and a school swims in the ocean!"
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cn-fb-1",
            "prompt": "A ___ of fish swam through the coral reef! \ud83d\udc20",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "school",
                "acceptableAnswers": ["school", "School", "SCHOOL"]
              }
            ],
            "hint": "This word is also a place where kids learn! A ___ of fish."
          },
          {
            "id": "cn-fb-2",
            "prompt": "A ___ of birds flew across the sunset sky! \ud83c\udf05",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "flock",
                "acceptableAnswers": ["flock", "Flock", "FLOCK"]
              }
            ],
            "hint": "Starts with FL. Rhymes with clock! A fl-___ of birds."
          },
          {
            "id": "cn-fb-3",
            "prompt": "The ___ of wolves howled at the moon! \ud83c\udf19",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "pack",
                "acceptableAnswers": ["pack", "Pack", "PACK"]
              }
            ],
            "hint": "When you put things in a suitcase, you ___ them. Wolves travel in a ___!"
          },
          {
            "id": "cn-fb-4",
            "prompt": "A ___ of cows grazed in the green field! \ud83c\udf3e",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "herd",
                "acceptableAnswers": ["herd", "Herd", "HERD"]
              }
            ],
            "hint": "This word sounds like \"heard\" (what your ears do). A h-___ of cows."
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
-- LESSON 2: Action Verbs & Past Tense
-- Module: Grammar & Writing | Skill: Parts of Speech
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0016-4000-8000-000000000001',
  '10000002-0207-4000-8000-000000000001',
  2,
  'Action Verbs & Past Tense',
  'Match present tense verbs to their tricky past tense forms!',
  'Chip is talking about what happened YESTERDAY versus what happens TODAY! TODAY I run, but YESTERDAY I ran. TODAY I eat, but YESTERDAY I ate. Some past tense words are tricky -- they don''t just add "-ed." Let''s match them up and practice using them!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each TODAY verb to its YESTERDAY (past tense) form! \ud83d\udd04",
        "pairs": [
          {
            "id": "vb-1",
            "left": {"id": "run", "text": "run", "emoji": "\ud83c\udfc3"},
            "right": {"id": "ran", "text": "ran", "emoji": "\u2728"}
          },
          {
            "id": "vb-2",
            "left": {"id": "sit", "text": "sit", "emoji": "\ud83e\ude91"},
            "right": {"id": "sat", "text": "sat", "emoji": "\u2728"}
          },
          {
            "id": "vb-3",
            "left": {"id": "eat", "text": "eat", "emoji": "\ud83c\udf54"},
            "right": {"id": "ate", "text": "ate", "emoji": "\u2728"}
          },
          {
            "id": "vb-4",
            "left": {"id": "go", "text": "go", "emoji": "\ud83d\udeb6"},
            "right": {"id": "went", "text": "went", "emoji": "\u2728"}
          },
          {
            "id": "vb-5",
            "left": {"id": "see", "text": "see", "emoji": "\ud83d\udc40"},
            "right": {"id": "saw", "text": "saw", "emoji": "\u2728"}
          }
        ],
        "hint": "These are irregular verbs -- they don''t follow the normal rules! Run becomes ran, sit becomes sat, eat becomes ate, go becomes went, and see becomes saw."
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "vb-fb-1",
            "prompt": "Today I run, but yesterday I ___. \ud83c\udfc3",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "ran",
                "acceptableAnswers": ["ran", "Ran", "RAN"]
              }
            ],
            "hint": "Run changes to r-a-n. Ran!"
          },
          {
            "id": "vb-fb-2",
            "prompt": "Today I eat lunch, but yesterday I ___ lunch. \ud83c\udf54",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "ate",
                "acceptableAnswers": ["ate", "Ate", "ATE"]
              }
            ],
            "hint": "Eat changes to a-t-e. Ate! It sounds like the number 8."
          },
          {
            "id": "vb-fb-3",
            "prompt": "Today I go to school, but yesterday I ___ to school. \ud83c\udfeb",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "went",
                "acceptableAnswers": ["went", "Went", "WENT"]
              }
            ],
            "hint": "Go is a funny one! It changes completely to w-e-n-t. Went!"
          },
          {
            "id": "vb-fb-4",
            "prompt": "Today I see a rainbow, but yesterday I ___ a rainbow. \ud83c\udf08",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "saw",
                "acceptableAnswers": ["saw", "Saw", "SAW"]
              }
            ],
            "hint": "See changes to s-a-w. Saw! Like the tool but a different meaning."
          },
          {
            "id": "vb-fb-5",
            "prompt": "Today I sit on the bench, but yesterday I ___ on the bench. \ud83e\ude91",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "sat",
                "acceptableAnswers": ["sat", "Sat", "SAT"]
              }
            ],
            "hint": "Sit changes the I to an A. S-a-t. Sat!"
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
-- LESSON 3: Adjectives & Adverbs
-- Module: Grammar & Writing | Skill: Parts of Speech
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0017-4000-8000-000000000001',
  '10000002-0207-4000-8000-000000000001',
  3,
  'Adjectives & Adverbs',
  'Make boring sentences AMAZING by adding describing words!',
  'Chip thinks sentences can be SO much better with describing words! Adjectives describe NOUNS (things) -- like "the FLUFFY dog" or "the BIG house." Adverbs describe VERBS (actions) -- like "she ran QUICKLY" or "he sang LOUDLY." Let''s make boring sentences amazing!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "adj-1",
            "prompt": "The ___ dog ran across the yard! (Pick an adjective: big, tiny, or fluffy) \ud83d\udc36",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "fluffy",
                "acceptableAnswers": ["fluffy", "Fluffy", "FLUFFY", "big", "Big", "BIG", "tiny", "Tiny", "TINY"]
              }
            ],
            "hint": "An adjective describes what the dog looks like. Try fluffy, big, or tiny -- any describing word works!"
          },
          {
            "id": "adj-2",
            "prompt": "I ate a ___ apple for snack! (Pick an adjective: red, juicy, or crunchy) \ud83c\udf4e",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "juicy",
                "acceptableAnswers": ["juicy", "Juicy", "JUICY", "red", "Red", "RED", "crunchy", "Crunchy", "CRUNCHY"]
              }
            ],
            "hint": "What does the apple look, taste, or feel like? Red, juicy, and crunchy all describe the apple!"
          },
          {
            "id": "adj-3",
            "prompt": "The ___ cat slept on the warm pillow. (Pick an adjective: sleepy, gray, or little) \ud83d\udc31",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "sleepy",
                "acceptableAnswers": ["sleepy", "Sleepy", "SLEEPY", "gray", "Gray", "GRAY", "little", "Little", "LITTLE"]
              }
            ],
            "hint": "What kind of cat? A describing word that tells us about the cat goes here!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "adv-1",
            "prompt": "Which word is an ADVERB (describes how something is done)? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "quickly", "emoji": "\ud83d\udca8"},
              {"id": "b", "text": "purple", "emoji": "\ud83d\udc9c"},
              {"id": "c", "text": "kitten", "emoji": "\ud83d\udc31"}
            ],
            "correctOptionId": "a",
            "hint": "Adverbs often end in -LY and tell you HOW something is done. Which word ends in -ly?"
          },
          {
            "id": "adv-2",
            "prompt": "\"The turtle walked ___.\" Which adverb fits best? \ud83d\udc22",
            "options": [
              {"id": "a", "text": "slowly", "emoji": "\ud83d\udc22"},
              {"id": "b", "text": "purple", "emoji": ""},
              {"id": "c", "text": "happy", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Turtles are not fast! Which -ly word describes HOW the turtle walked?"
          },
          {
            "id": "adv-3",
            "prompt": "Which word is an ADJECTIVE (describes a noun)? \ud83c\udf1f",
            "options": [
              {"id": "a", "text": "softly", "emoji": ""},
              {"id": "b", "text": "tall", "emoji": "\u2728"},
              {"id": "c", "text": "running", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "An adjective describes a THING (noun). Which word could describe a building or a person? The ___ building."
          },
          {
            "id": "adv-4",
            "prompt": "\"The lion roared ___.\" Which adverb fits best? \ud83e\udd81",
            "options": [
              {"id": "a", "text": "tiny", "emoji": ""},
              {"id": "b", "text": "green", "emoji": ""},
              {"id": "c", "text": "loudly", "emoji": "\ud83d\udce2"}
            ],
            "correctOptionId": "c",
            "hint": "Lions roar with a big sound! Which -ly word tells HOW the lion roared?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Punctuation Party
-- Module: Grammar & Writing | Skill: Punctuation & Capitalization
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0018-4000-8000-000000000001',
  '10000002-0207-4000-8000-000000000001',
  4,
  'Punctuation Party',
  'Period, Question Mark, and Exclamation Point are throwing a party -- pick the right one for each sentence!',
  'Welcome to the Punctuation Party! Chip invited three special friends: PERIOD (.) who ends calm, regular sentences. QUESTION MARK (?) who LOVES asking questions. And EXCLAMATION POINT (!) who gets super excited about everything! Let''s figure out which friend belongs at the end of each sentence!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pp-1",
            "prompt": "\"What time is lunch___\" Which punctuation mark goes at the end? \ud83c\udf55",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": "\u2728"},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "This sentence is ASKING something. When you ask, you need a question mark!"
          },
          {
            "id": "pp-2",
            "prompt": "\"I have a pet goldfish___\" Which punctuation mark goes at the end? \ud83d\udc1f",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": "\u2728"},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "This is a calm statement -- just telling you a fact. Statements end with a period."
          },
          {
            "id": "pp-3",
            "prompt": "\"Look out, the ball is coming___\" Which punctuation mark goes at the end? \u26bd",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "This is a warning! The person sounds urgent and excited. That calls for an exclamation point!"
          },
          {
            "id": "pp-4",
            "prompt": "\"Can I have a cookie___\" Which punctuation mark goes at the end? \ud83c\udf6a",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": ""},
              {"id": "b", "text": "?  (question mark)", "emoji": "\u2728"},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Someone is asking for permission. Questions always end with a question mark!"
          },
          {
            "id": "pp-5",
            "prompt": "\"We are going to the park today___\" Which punctuation mark goes at the end? \ud83c\udfde\ufe0f",
            "options": [
              {"id": "a", "text": ".  (period)", "emoji": "\u2728"},
              {"id": "b", "text": "?  (question mark)", "emoji": ""},
              {"id": "c", "text": "!  (exclamation point)", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "This is just telling you a plan in a calm way. Regular statements end with a period."
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "pp-fb-1",
            "prompt": "My name is Chip___ (Add the correct punctuation: . or ? or !)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": ".",
                "acceptableAnswers": ["."]
              }
            ],
            "hint": "This is a calm statement telling you a name. Statements end with a period."
          },
          {
            "id": "pp-fb-2",
            "prompt": "Where did my pencil go___ (Add the correct punctuation: . or ? or !)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "?",
                "acceptableAnswers": ["?"]
              }
            ],
            "hint": "Someone is asking a question! What mark goes at the end of a question?"
          },
          {
            "id": "pp-fb-3",
            "prompt": "Wow, that rainbow is beautiful___ (Add the correct punctuation: . or ? or !)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "!",
                "acceptableAnswers": ["!"]
              }
            ],
            "hint": "\"Wow\" shows excitement! Excited sentences end with an exclamation point!"
          },
          {
            "id": "pp-fb-4",
            "prompt": "The cat is sleeping on the couch___ (Add the correct punctuation: . or ? or !)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": ".",
                "acceptableAnswers": ["."]
              }
            ],
            "hint": "This is a calm fact about where the cat is. Regular statements end with a period."
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
-- LESSON 5: Sentence Expander
-- Module: Grammar & Writing | Skills: Parts of Speech + Punctuation & Capitalization
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000001-0019-4000-8000-000000000001',
  '10000002-0207-4000-8000-000000000001',
  5,
  'Sentence Expander',
  'Put words in order and grow tiny sentences into amazing ones!',
  'Chip loves playing the sentence growing game! Start with a tiny sentence like "The cat sat." Now let''s make it GROW! Add an adjective: "The fluffy cat sat." Add an adverb: "The fluffy cat sat quietly." Add more details: "The fluffy orange cat sat quietly on the soft mat." See how much better that is? Let''s play!',
  NULL, NULL,
  '[]'::jsonb,
  'f04d2171-6b54-41bf-900d-d3d082ba65ed',
  ARRAY['20000002-0009-4000-8000-000000000001', '20000002-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "se-seq-1",
            "prompt": "Put these words in order to make a sentence! \ud83d\udcdd",
            "items": [
              {"id": "the", "text": "The", "emoji": "", "correctPosition": 1},
              {"id": "dog", "text": "dog", "emoji": "\ud83d\udc36", "correctPosition": 2},
              {"id": "ran", "text": "ran", "emoji": "\ud83c\udfc3", "correctPosition": 3},
              {"id": "fast", "text": "fast.", "emoji": "\ud83d\udca8", "correctPosition": 4}
            ],
            "hint": "Start with \"The\" (capital letter = beginning!), then the noun (dog), then the verb (ran), then how (fast)."
          },
          {
            "id": "se-seq-2",
            "prompt": "Put these words in order to make a sentence! \ud83c\udf1f",
            "items": [
              {"id": "a", "text": "A", "emoji": "", "correctPosition": 1},
              {"id": "little", "text": "little", "emoji": "", "correctPosition": 2},
              {"id": "bird", "text": "bird", "emoji": "\ud83d\udc26", "correctPosition": 3},
              {"id": "sang", "text": "sang", "emoji": "\ud83c\udfb5", "correctPosition": 4},
              {"id": "sweetly", "text": "sweetly.", "emoji": "\u2728", "correctPosition": 5}
            ],
            "hint": "Start with \"A\" (capital!), then the adjective (little), noun (bird), verb (sang), adverb (sweetly)."
          },
          {
            "id": "se-seq-3",
            "prompt": "Put these words in order to make a question! \u2753",
            "items": [
              {"id": "can", "text": "Can", "emoji": "", "correctPosition": 1},
              {"id": "you", "text": "you", "emoji": "", "correctPosition": 2},
              {"id": "see", "text": "see", "emoji": "\ud83d\udc40", "correctPosition": 3},
              {"id": "the", "text": "the", "emoji": "", "correctPosition": 4},
              {"id": "stars", "text": "stars?", "emoji": "\u2b50", "correctPosition": 5}
            ],
            "hint": "Questions often start with \"Can\" or \"Do\" or \"What.\" Look for the word with a capital letter and the word with a question mark!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "se-fb-1",
            "prompt": "Make the sentence bigger! \"The cat sat.\" \u2192 \"The ___ cat sat.\" (Add an adjective!) \ud83d\udc31",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "fluffy",
                "acceptableAnswers": ["fluffy", "Fluffy", "FLUFFY", "big", "Big", "BIG", "fat", "Fat", "FAT", "orange", "Orange", "ORANGE", "small", "Small", "SMALL", "cute", "Cute", "CUTE", "lazy", "Lazy", "LAZY", "black", "Black", "BLACK", "white", "White", "WHITE", "soft", "Soft", "SOFT", "little", "Little", "LITTLE", "happy", "Happy", "HAPPY", "sleepy", "Sleepy", "SLEEPY", "tiny", "Tiny", "TINY", "gray", "Gray", "GRAY", "brown", "Brown", "BROWN"]
              }
            ],
            "hint": "An adjective describes the cat! What does the cat look like? Try fluffy, big, tiny, orange, or any other describing word!"
          },
          {
            "id": "se-fb-2",
            "prompt": "Make the sentence bigger! \"The dog ran.\" \u2192 \"The dog ran ___.\" (Add an adverb!) \ud83d\udc36",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "quickly",
                "acceptableAnswers": ["quickly", "Quickly", "QUICKLY", "fast", "Fast", "FAST", "slowly", "Slowly", "SLOWLY", "happily", "Happily", "HAPPILY", "loudly", "Loudly", "LOUDLY", "wildly", "Wildly", "WILDLY", "away", "Away", "AWAY"]
              }
            ],
            "hint": "An adverb describes HOW the dog ran. Did it run quickly? Slowly? Happily? Try a word that ends in -ly!"
          },
          {
            "id": "se-fb-3",
            "prompt": "Make the sentence bigger! \"The bird sang.\" \u2192 \"The ___ bird sang.\" (Add an adjective!) \ud83d\udc26",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "little",
                "acceptableAnswers": ["little", "Little", "LITTLE", "tiny", "Tiny", "TINY", "blue", "Blue", "BLUE", "pretty", "Pretty", "PRETTY", "red", "Red", "RED", "happy", "Happy", "HAPPY", "small", "Small", "SMALL", "yellow", "Yellow", "YELLOW", "colorful", "Colorful", "COLORFUL", "beautiful", "Beautiful", "BEAUTIFUL"]
              }
            ],
            "hint": "Describe the bird! What does it look like? Try little, tiny, blue, pretty, or any describing word!"
          },
          {
            "id": "se-fb-4",
            "prompt": "Make the sentence bigger! \"The fish swam.\" \u2192 \"The fish swam ___.\" (Add an adverb!) \ud83d\udc1f",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "slowly",
                "acceptableAnswers": ["slowly", "Slowly", "SLOWLY", "quickly", "Quickly", "QUICKLY", "happily", "Happily", "HAPPILY", "gracefully", "Gracefully", "GRACEFULLY", "fast", "Fast", "FAST", "away", "Away", "AWAY"]
              }
            ],
            "hint": "An adverb tells HOW the fish swam. Did it swim slowly? Quickly? Happily? Try a word that ends in -ly!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
