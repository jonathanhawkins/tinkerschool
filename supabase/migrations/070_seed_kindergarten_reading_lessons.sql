-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Reading Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Reading "Letter Land" module.
-- Aligned to Common Core K ELA: RF.K, RL.K, L.K
--
-- Module ID: 00000001-0021-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000002
--
-- Lesson UUIDs: c1000002-0001 through c1000002-0005
-- =============================================================================


-- =========================================================================
-- READING LESSON 1: Meet the ABCs!
-- Skills: Uppercase Letter Recognition
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000002-0001-4000-8000-000000000001',
  '00000001-0021-4000-8000-000000000001',
  1,
  'Meet the ABCs!',
  'Learn the first letters of the alphabet! A, B, C, D, E, F, G... let''s go!',
  'Chip LOVES letters! Every word you say or read is made of letters! Today we''re going to meet some special letters. Tap each card to see what letter is hiding!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000100-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Meet the letters! Tap to flip each card.",
        "cards": [
          {
            "id": "letter-a",
            "front": {"text": "What letter is this?", "emoji": "\ud83c\udd70\ufe0f"},
            "back": {"text": "A!\nA is for Apple \ud83c\udf4e", "emoji": "\ud83c\udd70\ufe0f"},
            "color": "#EF4444"
          },
          {
            "id": "letter-b",
            "front": {"text": "What letter is this?", "emoji": "\ud83c\udd71\ufe0f"},
            "back": {"text": "B!\nB is for Bear \ud83d\udc3b", "emoji": "\ud83c\udd71\ufe0f"},
            "color": "#3B82F6"
          },
          {
            "id": "letter-c",
            "front": {"text": "What letter is this?", "emoji": "\ud83c\udd72"},
            "back": {"text": "C!\nC is for Cat \ud83d\udc31", "emoji": "\ud83c\udd72"},
            "color": "#22C55E"
          },
          {
            "id": "letter-d",
            "front": {"text": "What letter is this?", "emoji": "\ud83c\udd73"},
            "back": {"text": "D!\nD is for Dog \ud83d\udc36", "emoji": "\ud83c\udd73"},
            "color": "#F97316"
          },
          {
            "id": "letter-e",
            "front": {"text": "What letter is this?", "emoji": "\ud83c\udd74"},
            "back": {"text": "E!\nE is for Elephant \ud83d\udc18", "emoji": "\ud83c\udd74"},
            "color": "#A855F7"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "abc-mc-1",
            "prompt": "Which letter makes the sound at the start of ''Apple''?",
            "promptEmoji": "\ud83c\udf4e",
            "options": [
              {"id": "a", "text": "A", "emoji": "\ud83c\udd70\ufe0f"},
              {"id": "b", "text": "B", "emoji": "\ud83c\udd71\ufe0f"},
              {"id": "c", "text": "C", "emoji": "\ud83c\udd72"}
            ],
            "correctOptionId": "a",
            "hint": "Say ''Apple'' slowly. What sound do you hear first? Aaaa..."
          },
          {
            "id": "abc-mc-2",
            "prompt": "Which letter comes after B in the alphabet?",
            "promptEmoji": "\ud83d\udcda",
            "options": [
              {"id": "a", "text": "A", "emoji": "\ud83c\udd70\ufe0f"},
              {"id": "b", "text": "C", "emoji": "\ud83c\udd72"},
              {"id": "c", "text": "D", "emoji": "\ud83c\udd73"}
            ],
            "correctOptionId": "b",
            "hint": "Sing it! A, B, ... what comes next?"
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
-- READING LESSON 2: Sound It Out!
-- Skills: Letter-Sound Matching, Rhyming Words
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000002-0002-4000-8000-000000000001',
  '00000001-0021-4000-8000-000000000001',
  2,
  'Sound It Out!',
  'Every letter makes a sound! Match letters to the sounds they make.',
  'Did you know that every letter has a special SOUND? The letter S sounds like a snake: sssss! The letter M sounds like yummy food: mmmm! Let''s match letters to their sounds!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000100-0003-4000-8000-000000000001',
    '20000100-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each letter to the picture that starts with its sound!",
        "pairs": [
          {
            "id": "match-s",
            "left": {"id": "letter-s", "text": "S", "emoji": "\ud83d\udce7"},
            "right": {"id": "pic-sun", "text": "Sun", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "match-m",
            "left": {"id": "letter-m", "text": "M", "emoji": "\ud83d\udce7"},
            "right": {"id": "pic-moon", "text": "Moon", "emoji": "\ud83c\udf19"}
          },
          {
            "id": "match-f",
            "left": {"id": "letter-f", "text": "F", "emoji": "\ud83d\udce7"},
            "right": {"id": "pic-fish", "text": "Fish", "emoji": "\ud83d\udc1f"}
          },
          {
            "id": "match-b",
            "left": {"id": "letter-b", "text": "B", "emoji": "\ud83d\udce7"},
            "right": {"id": "pic-ball", "text": "Ball", "emoji": "\u26bd"}
          }
        ],
        "hint": "Say the letter sound, then say the picture word. Do they start the same?"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "rhyme-1",
            "prompt": "Which word rhymes with CAT?",
            "promptEmoji": "\ud83d\udc31",
            "options": [
              {"id": "a", "text": "Hat", "emoji": "\ud83e\udde2"},
              {"id": "b", "text": "Dog", "emoji": "\ud83d\udc36"},
              {"id": "c", "text": "Cup", "emoji": "\u2615"}
            ],
            "correctOptionId": "a",
            "hint": "Rhyming words sound the same at the end! Cat... hat... they both end in -at!"
          },
          {
            "id": "rhyme-2",
            "prompt": "Which word rhymes with FUN?",
            "promptEmoji": "\ud83c\udf89",
            "options": [
              {"id": "a", "text": "Tree", "emoji": "\ud83c\udf33"},
              {"id": "b", "text": "Sun", "emoji": "\u2600\ufe0f"},
              {"id": "c", "text": "Fish", "emoji": "\ud83d\udc1f"}
            ],
            "correctOptionId": "b",
            "hint": "Fun and _____ both end in -un!"
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
-- READING LESSON 3: My First Words
-- Skills: Blending CVC Words, Common Sight Words
-- Widgets: multiple_choice + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000002-0003-4000-8000-000000000001',
  '00000001-0021-4000-8000-000000000001',
  3,
  'My First Words',
  'Put sounds together to read words! C-A-T makes... CAT!',
  'You know letters AND their sounds now \u2014 amazing! Today, we''ll put sounds TOGETHER to make words! When you blend c-a-t together fast, you get... CAT! Let''s try!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000100-0005-4000-8000-000000000001',
    '20000100-0006-4000-8000-000000000001'
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
            "id": "blend-1",
            "prompt": "Put these sounds together: d - o - g. What word?",
            "promptEmoji": "\ud83d\udd24",
            "options": [
              {"id": "a", "text": "Dog", "emoji": "\ud83d\udc36"},
              {"id": "b", "text": "Dig", "emoji": "\u26cf\ufe0f"},
              {"id": "c", "text": "Dug", "emoji": "\ud83d\udca8"}
            ],
            "correctOptionId": "a",
            "hint": "Say it fast: d...o...g \u2014 dog!"
          },
          {
            "id": "blend-2",
            "prompt": "Put these sounds together: s - u - n. What word?",
            "promptEmoji": "\ud83d\udd24",
            "options": [
              {"id": "a", "text": "Sat", "emoji": "\ud83e\uddd1"},
              {"id": "b", "text": "Sun", "emoji": "\u2600\ufe0f"},
              {"id": "c", "text": "Son", "emoji": "\ud83d\udc66"}
            ],
            "correctOptionId": "b",
            "hint": "Blend the sounds: ssss...uuu...nnn \u2014 sun!"
          },
          {
            "id": "blend-3",
            "prompt": "Put these sounds together: p - i - g. What word?",
            "promptEmoji": "\ud83d\udd24",
            "options": [
              {"id": "a", "text": "Pig", "emoji": "\ud83d\udc37"},
              {"id": "b", "text": "Peg", "emoji": "\ud83d\udccc"},
              {"id": "c", "text": "Pug", "emoji": "\ud83d\udc36"}
            ],
            "correctOptionId": "a",
            "hint": "Listen carefully: p...i...g \u2014 pig!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "flash_card",
        "prompt": "These are sight words \u2014 words you''ll see a LOT! Tap to learn each one.",
        "cards": [
          {
            "id": "sight-the",
            "front": {"text": "Can you read this word?", "emoji": "\ud83d\udcda"},
            "back": {"text": "THE\n(We see THE everywhere!)", "emoji": "\ud83d\udcda"},
            "color": "#3B82F6"
          },
          {
            "id": "sight-and",
            "front": {"text": "Can you read this word?", "emoji": "\ud83d\udcda"},
            "back": {"text": "AND\n(Peanut butter AND jelly!)", "emoji": "\ud83d\udcda"},
            "color": "#22C55E"
          },
          {
            "id": "sight-is",
            "front": {"text": "Can you read this word?", "emoji": "\ud83d\udcda"},
            "back": {"text": "IS\n(Chip IS happy!)", "emoji": "\ud83d\udcda"},
            "color": "#F97316"
          },
          {
            "id": "sight-it",
            "front": {"text": "Can you read this word?", "emoji": "\ud83d\udcda"},
            "back": {"text": "IT\n(I like IT!)", "emoji": "\ud83d\udcda"},
            "color": "#A855F7"
          }
        ],
        "shuffleCards": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 4: Story Time with Chip
-- Skills: Story Key Details, Retelling Stories
-- Widgets: multiple_choice + sequence_order + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000002-0004-4000-8000-000000000001',
  '00000001-0021-4000-8000-000000000001',
  4,
  'Story Time with Chip',
  'Listen to a story and answer questions about what happened!',
  'Chip has a story for you! Listen carefully...\n\nOnce upon a time, a little bear named Boo wanted to find honey. Boo looked in a tree and found a beehive! The bees buzzed, but Boo was gentle. The bees shared their honey, and Boo said thank you!\n\nNow let''s see what you remember!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000100-0007-4000-8000-000000000001',
    '20000100-0008-4000-8000-000000000001'
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
            "id": "story-1",
            "prompt": "What was the bear''s name?",
            "promptEmoji": "\ud83d\udc3b",
            "options": [
              {"id": "a", "text": "Boo", "emoji": "\ud83d\udc3b"},
              {"id": "b", "text": "Max", "emoji": "\ud83d\udc36"},
              {"id": "c", "text": "Chip", "emoji": "\ud83e\udd16"}
            ],
            "correctOptionId": "a",
            "hint": "Think back to the beginning of the story. The little bear was named..."
          },
          {
            "id": "story-2",
            "prompt": "What was Boo looking for?",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "a", "text": "Fish", "emoji": "\ud83d\udc1f"},
              {"id": "b", "text": "Honey", "emoji": "\ud83c\udf6f"},
              {"id": "c", "text": "Berries", "emoji": "\ud83c\udf53"}
            ],
            "correctOptionId": "b",
            "hint": "Bears love something sweet that comes from bees!"
          },
          {
            "id": "story-3",
            "prompt": "Where did Boo find the beehive?",
            "promptEmoji": "\ud83c\udfda\ufe0f",
            "options": [
              {"id": "a", "text": "In a tree", "emoji": "\ud83c\udf33"},
              {"id": "b", "text": "In a cave", "emoji": "\ud83d\uddfb"},
              {"id": "c", "text": "In a pond", "emoji": "\ud83c\udf0a"}
            ],
            "correctOptionId": "a",
            "hint": "Boo looked up and found the beehive in a..."
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "story-order",
            "prompt": "Put the story in order! What happened first, next, and last?",
            "items": [
              {"id": "first", "text": "Boo wanted honey", "emoji": "\ud83c\udf6f", "correctPosition": 1},
              {"id": "second", "text": "Boo found bees in a tree", "emoji": "\ud83d\udc1d", "correctPosition": 2},
              {"id": "third", "text": "Bees shared honey", "emoji": "\ud83e\udd1d", "correctPosition": 3}
            ],
            "hint": "What happened at the very beginning of the story?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- READING LESSON 5: I Can Write!
-- Skills: Printing Letters, Nouns and Verbs
-- Widgets: multiple_choice + parent_activity + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000002-0005-4000-8000-000000000001',
  '00000001-0021-4000-8000-000000000001',
  5,
  'I Can Write!',
  'Learn about naming words (nouns) and doing words (verbs), then practice writing!',
  'Guess what? You can be a WRITER! Every sentence has naming words \u2014 like ''dog'' or ''ball'' \u2014 and doing words \u2014 like ''run'' or ''jump.'' Let''s learn about them!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000100-0009-4000-8000-000000000001',
    '20000100-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Naming words name things! Doing words tell actions! Tap to learn.",
        "cards": [
          {
            "id": "noun-dog",
            "front": {"text": "Is DOG a naming word or a doing word?", "emoji": "\ud83d\udc36"},
            "back": {"text": "Naming Word! (noun)\nA dog is a thing!", "emoji": "\ud83d\udc36"},
            "color": "#3B82F6"
          },
          {
            "id": "verb-run",
            "front": {"text": "Is RUN a naming word or a doing word?", "emoji": "\ud83c\udfc3"},
            "back": {"text": "Doing Word! (verb)\nRun is something you DO!", "emoji": "\ud83c\udfc3"},
            "color": "#EF4444"
          },
          {
            "id": "noun-ball",
            "front": {"text": "Is BALL a naming word or a doing word?", "emoji": "\u26bd"},
            "back": {"text": "Naming Word! (noun)\nA ball is a thing!", "emoji": "\u26bd"},
            "color": "#3B82F6"
          },
          {
            "id": "verb-jump",
            "front": {"text": "Is JUMP a naming word or a doing word?", "emoji": "\ud83e\udd38"},
            "back": {"text": "Doing Word! (verb)\nJump is something you DO!", "emoji": "\ud83e\udd38"},
            "color": "#EF4444"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "noun-verb-1",
            "prompt": "Which one is a DOING word (verb)?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Cat", "emoji": "\ud83d\udc31"},
              {"id": "b", "text": "Eat", "emoji": "\ud83c\udf7d\ufe0f"},
              {"id": "c", "text": "House", "emoji": "\ud83c\udfe0"}
            ],
            "correctOptionId": "b",
            "hint": "Doing words describe actions. Can you DO a cat? Can you DO a eat?"
          },
          {
            "id": "noun-verb-2",
            "prompt": "Which one is a NAMING word (noun)?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "a", "text": "Sing", "emoji": "\ud83c\udfa4"},
              {"id": "b", "text": "Tree", "emoji": "\ud83c\udf33"},
              {"id": "c", "text": "Run", "emoji": "\ud83c\udfc3"}
            ],
            "correctOptionId": "b",
            "hint": "Naming words name people, animals, or things!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Practice writing together! Have your child write their first name on paper. Then try writing simple CVC words: cat, dog, sun. Say each sound slowly as they write each letter.",
        "parentTip": "Proper pencil grip matters! Help them hold the pencil with a tripod grip (thumb, index, middle finger). If they reverse letters (like writing a backwards ''s''), that''s normal at this age.",
        "completionPrompt": "Did you practice writing letters and words together?",
        "illustration": "\u270d\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
