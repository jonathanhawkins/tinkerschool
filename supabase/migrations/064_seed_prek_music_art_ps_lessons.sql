-- =============================================================================
-- TinkerSchool -- Seed Pre-K Music, Art & Problem Solving Lessons
-- =============================================================================
-- 15 browser-only interactive lessons for Pre-K (Band 0, Ages 3-5):
--   - 5 Music "Music Garden" lessons
--   - 5 Art "Color Play" lessons
--   - 5 Problem Solving "Think & Play" lessons
--
-- Widget types used: listen_and_find, parent_activity, sequence_order,
--   multiple_choice, flash_card, tap_and_reveal, trace_shape, drag_to_sort
--
-- Depends on:
--   - 001_initial_schema.sql (lessons table)
--   - 002_tinkerschool_multi_subject.sql (subject_id, skills_covered, etc.)
--   - 058_seed_prek_skills.sql (Pre-K music/art/problem-solving skills)
--   - 060_seed_prek_modules.sql (Pre-K modules)
--
-- Subject IDs:
--   Music:            00000000-0000-4000-8000-000000000004
--   Art:              00000000-0000-4000-8000-000000000005
--   Problem Solving:  00000000-0000-4000-8000-000000000006
--
-- Module IDs:
--   Music Garden:     00000000-0000-4000-8000-000000000104
--   Color Play:       00000000-0000-4000-8000-000000000105
--   Think & Play:     00000000-0000-4000-8000-000000000106
--
-- Music Skill IDs:
--   Singing Along:        40000000-0001-4000-8000-000000000001
--   Loud and Soft:        40000000-0002-4000-8000-000000000001
--   Fast and Slow:        40000000-0003-4000-8000-000000000001
--   Keeping a Beat:       40000000-0004-4000-8000-000000000001
--   Sound Exploration:    40000000-0005-4000-8000-000000000001
--   Musical Movement:     40000000-0006-4000-8000-000000000001
--
-- Art Skill IDs:
--   Color Naming:         50000000-0001-4000-8000-000000000001
--   Shape Drawing:        50000000-0002-4000-8000-000000000001
--   Color Mixing:         50000000-0003-4000-8000-000000000001
--   Texture Awareness:    50000000-0004-4000-8000-000000000001
--   Free Drawing:         50000000-0005-4000-8000-000000000001
--   Pattern Making:       50000000-0006-4000-8000-000000000001
--
-- Problem Solving Skill IDs:
--   Shape Sorting:        60000000-0001-4000-8000-000000000001
--   Simple Puzzles:       60000000-0002-4000-8000-000000000001
--   AB Patterns:          60000000-0003-4000-8000-000000000001
--   What Comes Next:      60000000-0004-4000-8000-000000000001
--   Odd One Out:          60000000-0005-4000-8000-000000000001
--   Following Directions: 60000000-0006-4000-8000-000000000001
--
-- Music Lesson IDs:    b0000004-0001 through b0000004-0005
-- Art Lesson IDs:      b0000005-0001 through b0000005-0005
-- PS Lesson IDs:       b0000006-0001 through b0000006-0005
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- *************************************************************************
--
--  PART A: MUSIC "MUSIC GARDEN" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- MUSIC LESSON 1: Loud and Soft
-- Module: Music Garden
-- Widgets: listen_and_find + parent_activity
-- Skills: Loud and Soft
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000004-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000104',
  1,
  'Loud and Soft',
  'Hear a sound and decide: is it LOUD or SOFT? Thunder booms, whispers hush!',
  'Shhh! Listen closely, friend! Some sounds are LOUD like thunder, and some are soft like a whisper. Chip will play a sound and you pick if it''s loud or soft!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000000-0002-4000-8000-000000000001'
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
            "id": "loud-thunder",
            "prompt": "Is this sound loud or soft?",
            "spokenText": "BOOM! Thunder crashes in the sky! Is thunder loud or soft?",
            "correctOptionId": "loud",
            "options": [
              {"id": "loud", "emoji": "\ud83d\udce2", "label": "Loud"},
              {"id": "soft", "emoji": "\ud83e\udd2b", "label": "Soft"}
            ]
          },
          {
            "id": "soft-whisper",
            "prompt": "Is this sound loud or soft?",
            "spokenText": "Shhhh... a tiny whisper in your ear. Is a whisper loud or soft?",
            "correctOptionId": "soft",
            "options": [
              {"id": "loud", "emoji": "\ud83d\udce2", "label": "Loud"},
              {"id": "soft", "emoji": "\ud83e\udd2b", "label": "Soft"}
            ]
          },
          {
            "id": "loud-drum",
            "prompt": "Is this sound loud or soft?",
            "spokenText": "BANG BANG BANG! A big drum is playing! Is a drum loud or soft?",
            "correctOptionId": "loud",
            "options": [
              {"id": "loud", "emoji": "\ud83d\udce2", "label": "Loud"},
              {"id": "soft", "emoji": "\ud83e\udd2b", "label": "Soft"}
            ]
          },
          {
            "id": "soft-rain",
            "prompt": "Is this sound loud or soft?",
            "spokenText": "Pitter patter, pitter patter... gentle rain on the window. Is rain loud or soft?",
            "correctOptionId": "soft",
            "options": [
              {"id": "loud", "emoji": "\ud83d\udce2", "label": "Loud"},
              {"id": "soft", "emoji": "\ud83e\udd2b", "label": "Soft"}
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play the Loud and Soft game! Clap loudly, then whisper. Stomp your feet, then tiptoe. Can you make a loud sound with your voice? Now make the softest sound you can!",
        "parentTip": "This activity builds dynamic awareness \u2014 the ability to distinguish volume levels. Try contrasting pairs: loud clap vs. soft clap, stomping vs. tiptoeing, shouting vs. whispering.",
        "completionPrompt": "Did you play the Loud and Soft game together?",
        "illustration": "\ud83d\udd0a"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 2: What's That Sound?
-- Module: Music Garden
-- Widgets: listen_and_find + parent_activity
-- Skills: Sound Exploration
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000004-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000104',
  2,
  'What''s That Sound?',
  'Listen to everyday sounds and pick what makes them! Birds, cars, rain, and more.',
  'Chip hears something! What could it be? A bird? A car? Let''s listen to some sounds and find out what makes each one. Put on your listening ears!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000000-0005-4000-8000-000000000001'
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
            "id": "sound-bird",
            "prompt": "What makes this sound?",
            "spokenText": "Tweet tweet tweet! Chirp chirp! What animal sings like this?",
            "correctOptionId": "bird",
            "options": [
              {"id": "bird", "emoji": "\ud83d\udc26", "label": "Bird"},
              {"id": "car", "emoji": "\ud83d\ude97", "label": "Car"},
              {"id": "dog", "emoji": "\ud83d\udc36", "label": "Dog"}
            ]
          },
          {
            "id": "sound-car",
            "prompt": "What makes this sound?",
            "spokenText": "Beep beep! Honk honk! Vroom vroom! What goes on the road?",
            "correctOptionId": "car",
            "options": [
              {"id": "bird", "emoji": "\ud83d\udc26", "label": "Bird"},
              {"id": "car", "emoji": "\ud83d\ude97", "label": "Car"},
              {"id": "rain", "emoji": "\ud83c\udf27\ufe0f", "label": "Rain"}
            ]
          },
          {
            "id": "sound-rain",
            "prompt": "What makes this sound?",
            "spokenText": "Drip drop drip drop, pitter patter on the roof. What falls from the sky?",
            "correctOptionId": "rain",
            "options": [
              {"id": "bell", "emoji": "\ud83d\udd14", "label": "Bell"},
              {"id": "rain", "emoji": "\ud83c\udf27\ufe0f", "label": "Rain"},
              {"id": "cat", "emoji": "\ud83d\udc31", "label": "Cat"}
            ]
          },
          {
            "id": "sound-doorbell",
            "prompt": "What makes this sound?",
            "spokenText": "Ding dong! Ding dong! Someone is at the door! What made that sound?",
            "correctOptionId": "doorbell",
            "options": [
              {"id": "doorbell", "emoji": "\ud83d\udecf\ufe0f", "label": "Doorbell"},
              {"id": "drum", "emoji": "\ud83e\udd41", "label": "Drum"},
              {"id": "bird", "emoji": "\ud83d\udc26", "label": "Bird"}
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Close your eyes and listen! What sounds can you hear right now? Count them together! Try to hear at least 3 different sounds. Is it a bird? The fridge humming? Someone talking?",
        "parentTip": "Active listening is a foundational music skill. Try this in different locations \u2014 inside, outside, in the car. Ask: ''Is that sound near or far? High or low?''",
        "completionPrompt": "Did you close your eyes and listen for sounds together?",
        "illustration": "\ud83d\udc42"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 3: Clap the Beat
-- Module: Music Garden
-- Widgets: sequence_order + parent_activity
-- Skills: Keeping a Beat
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000004-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000104',
  3,
  'Clap the Beat',
  'Learn to keep a steady beat! Put clapping patterns in the right order.',
  'Let''s clap together, friend! Music has a beat \u2014 like a heartbeat! Clap, clap, rest, clap, clap, rest. Can you put the pattern in the right order?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000000-0004-4000-8000-000000000001'
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
            "id": "beat-pattern-1",
            "prompt": "Put the clapping pattern in order: Clap, Clap, Rest!",
            "items": [
              {"id": "clap1", "text": "Clap!", "emoji": "\ud83d\udc4f", "correctPosition": 1},
              {"id": "clap2", "text": "Clap!", "emoji": "\ud83d\udc4f", "correctPosition": 2},
              {"id": "rest1", "text": "Rest", "emoji": "\ud83e\udd2b", "correctPosition": 3}
            ],
            "hint": "The pattern goes: clap, clap, then a quiet rest!"
          },
          {
            "id": "beat-pattern-2",
            "prompt": "Now try this pattern: Clap, Rest, Clap, Rest!",
            "items": [
              {"id": "clap-a", "text": "Clap!", "emoji": "\ud83d\udc4f", "correctPosition": 1},
              {"id": "rest-a", "text": "Rest", "emoji": "\ud83e\udd2b", "correctPosition": 2},
              {"id": "clap-b", "text": "Clap!", "emoji": "\ud83d\udc4f", "correctPosition": 3},
              {"id": "rest-b", "text": "Rest", "emoji": "\ud83e\udd2b", "correctPosition": 4}
            ],
            "hint": "This pattern switches: clap, rest, clap, rest. Like walking!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Sing ''Twinkle Twinkle Little Star'' and clap along to the beat together! Try clapping on every word. Then try stomping your feet to the beat instead!",
        "parentTip": "Keeping a steady beat is one of the most important early music skills. Don''t worry about being perfect \u2014 the goal is feeling the pulse of the music. Try different body percussion: clapping, stomping, patting knees.",
        "completionPrompt": "Did you sing and clap to the beat together?",
        "illustration": "\ud83d\udc4f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 4: Fast and Slow
-- Module: Music Garden
-- Widgets: multiple_choice + parent_activity
-- Skills: Fast and Slow
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000004-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000104',
  4,
  'Fast and Slow',
  'Is the music fast or slow? Rabbits zoom and turtles crawl \u2014 just like music!',
  'Some music is FAST like a bunny hopping, and some is SLOW like a turtle walking. Let''s figure out which is which! Ready, friend?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000000-0003-4000-8000-000000000001'
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
            "id": "tempo-rabbit",
            "prompt": "A rabbit hops really quickly! Is the rabbit''s music fast or slow?",
            "promptEmoji": "\ud83d\udc07",
            "options": [
              {"id": "fast", "text": "Fast", "emoji": "\ud83d\udc07"},
              {"id": "slow", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "fast",
            "hint": "Rabbits hop hop hop really quickly! That''s fast music!"
          },
          {
            "id": "tempo-turtle",
            "prompt": "A turtle walks very slowly. Is the turtle''s music fast or slow?",
            "promptEmoji": "\ud83d\udc22",
            "options": [
              {"id": "fast", "text": "Fast", "emoji": "\ud83d\udc07"},
              {"id": "slow", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "slow",
            "hint": "Turtles take their time... nice and slow!"
          },
          {
            "id": "tempo-cheetah",
            "prompt": "A cheetah runs super duper fast! Is the cheetah''s music fast or slow?",
            "promptEmoji": "\ud83d\udc06",
            "options": [
              {"id": "fast", "text": "Fast", "emoji": "\ud83d\udc06"},
              {"id": "slow", "text": "Slow", "emoji": "\ud83d\udc0c"}
            ],
            "correctOptionId": "fast",
            "hint": "Cheetahs are the fastest animals! Zoom zoom!"
          },
          {
            "id": "tempo-snail",
            "prompt": "A snail moves really, really slowly. Is the snail''s music fast or slow?",
            "promptEmoji": "\ud83d\udc0c",
            "options": [
              {"id": "fast", "text": "Fast", "emoji": "\ud83d\udc06"},
              {"id": "slow", "text": "Slow", "emoji": "\ud83d\udc0c"}
            ],
            "correctOptionId": "slow",
            "hint": "Snails are sooo slow. Their music would be slow too!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "March fast like a bunny! Now walk slow like a turtle! Try playing fast music and slow music \u2014 dance to each one. How does your body move differently to fast vs. slow music?",
        "parentTip": "Tempo (fast/slow) is a key musical concept. Try humming a familiar song fast, then slow. Ask: ''Which way do you like it better?'' This builds preference and critical listening.",
        "completionPrompt": "Did you march fast and slow like the animals?",
        "illustration": "\ud83d\udc07"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 5: Sing Along!
-- Module: Music Garden
-- Widgets: flash_card + parent_activity
-- Skills: Singing Along, Musical Movement
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000004-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000104',
  5,
  'Sing Along!',
  'Flip through song cards with your favorite nursery rhymes and sing together!',
  'It''s singing time! Chip loves to sing \u2014 even though robots aren''t the best singers! Let''s look at some songs you might know. Flip each card and sing along!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000000-0001-4000-8000-000000000001',
    '40000000-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to see a song! Can you sing it?",
        "cards": [
          {
            "id": "song-twinkle",
            "front": {"text": "Do you know this song?", "emoji": "\u2b50"},
            "back": {"text": "Twinkle, Twinkle, Little Star!", "emoji": "\u2b50"},
            "color": "#EAB308"
          },
          {
            "id": "song-macdonald",
            "front": {"text": "Do you know this song?", "emoji": "\ud83d\udc04"},
            "back": {"text": "Old MacDonald Had a Farm!", "emoji": "\ud83e\uddab"},
            "color": "#22C55E"
          },
          {
            "id": "song-spider",
            "front": {"text": "Do you know this song?", "emoji": "\ud83d\udd78\ufe0f"},
            "back": {"text": "Itsy Bitsy Spider!", "emoji": "\ud83c\udf27\ufe0f"},
            "color": "#3B82F6"
          },
          {
            "id": "song-wheels",
            "front": {"text": "Do you know this song?", "emoji": "\ud83d\ude8c"},
            "back": {"text": "The Wheels on the Bus!", "emoji": "\ud83d\ude8c"},
            "color": "#EF4444"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Sing one of these songs together! Add hand motions or movements \u2014 twinkling fingers for Twinkle Twinkle, animal sounds for Old MacDonald, climbing fingers for Itsy Bitsy Spider, or rolling arms for Wheels on the Bus!",
        "parentTip": "Singing with hand motions combines music, language, and motor skills. Don''t worry about pitch \u2014 the joy of singing together is what matters most! Let your child pick their favorite song.",
        "completionPrompt": "Did you sing a song together with hand motions?",
        "illustration": "\ud83c\udfb6"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- *************************************************************************
--
--  PART B: ART "COLOR PLAY" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- ART LESSON 1: Name That Color!
-- Module: Color Play
-- Widgets: flash_card + tap_and_reveal (find)
-- Skills: Color Naming
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000005-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000105',
  1,
  'Name That Color!',
  'Learn the names of colors! Red, blue, yellow, green, orange, and purple.',
  'Colors are EVERYWHERE, friend! Chip sees red apples, blue skies, and yellow suns! Let''s learn the names of all the beautiful colors together!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000000-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn the color name!",
        "cards": [
          {
            "id": "color-red",
            "front": {"text": "What color is this?", "emoji": "\u2764\ufe0f"},
            "back": {"text": "Red!", "emoji": "\u2764\ufe0f"},
            "color": "#EF4444"
          },
          {
            "id": "color-blue",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udc99"},
            "back": {"text": "Blue!", "emoji": "\ud83d\udc99"},
            "color": "#3B82F6"
          },
          {
            "id": "color-yellow",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udc9b"},
            "back": {"text": "Yellow!", "emoji": "\ud83d\udc9b"},
            "color": "#EAB308"
          },
          {
            "id": "color-green",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udc9a"},
            "back": {"text": "Green!", "emoji": "\ud83d\udc9a"},
            "color": "#22C55E"
          },
          {
            "id": "color-orange",
            "front": {"text": "What color is this?", "emoji": "\ud83e\udde1"},
            "back": {"text": "Orange!", "emoji": "\ud83e\udde1"},
            "color": "#F97316"
          },
          {
            "id": "color-purple",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udc9c"},
            "back": {"text": "Purple!", "emoji": "\ud83d\udc9c"},
            "color": "#A855F7"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "find-red",
            "prompt": "Find all the RED things!",
            "mode": "find",
            "targetPrompt": "Tap the red ones!",
            "gridCols": 3,
            "items": [
              {
                "id": "red-apple",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf4e",
                "revealLabel": "Red Apple",
                "isTarget": true
              },
              {
                "id": "blue-ball",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83d\udfe6",
                "revealLabel": "Blue Ball",
                "isTarget": false
              },
              {
                "id": "red-heart",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\u2764\ufe0f",
                "revealLabel": "Red Heart",
                "isTarget": true
              },
              {
                "id": "green-leaf",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf4f",
                "revealLabel": "Green Apple",
                "isTarget": false
              },
              {
                "id": "red-strawberry",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf53",
                "revealLabel": "Red Strawberry",
                "isTarget": true
              },
              {
                "id": "yellow-star",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\u2b50",
                "revealLabel": "Yellow Star",
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


-- =========================================================================
-- ART LESSON 2: Draw a Shape
-- Module: Color Play
-- Widgets: trace_shape + parent_activity
-- Skills: Shape Drawing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000005-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000105',
  2,
  'Draw a Shape',
  'Trace a circle, a square, and a triangle! Follow the dotted lines with your finger.',
  'Time to draw, friend! Chip loves shapes! Can you trace a circle round and round? Then a square with straight lines? Let''s try together!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000000-0002-4000-8000-000000000001'
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
            "id": "trace-circle",
            "prompt": "Trace the circle! Go round and round!",
            "shape": "circle",
            "strokeColor": "#EC4899",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-square",
            "prompt": "Trace the square! Follow the straight lines!",
            "shape": "square",
            "strokeColor": "#3B82F6",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-triangle",
            "prompt": "Trace the triangle! It has 3 sides!",
            "shape": "triangle",
            "strokeColor": "#22C55E",
            "traceColor": "#F97316"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Draw shapes together! Use crayons, chalk, or even your finger in sand! Try drawing circles, squares, and triangles. Can you find these shapes around the house?",
        "parentTip": "Tracing builds fine motor skills needed for writing. Let your child use thick crayons or markers. Drawing in sand, shaving cream, or finger paint makes it extra fun and sensory-rich!",
        "completionPrompt": "Did you draw shapes together?",
        "illustration": "\u270d\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 3: Mix It Up!
-- Module: Color Play
-- Widgets: tap_and_reveal (explore) + parent_activity
-- Skills: Color Mixing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000005-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000105',
  3,
  'Mix It Up!',
  'What happens when you mix two colors? Tap to find out! Red + Blue = ???',
  'Chip has a COLOR SURPRISE for you! When you mix two colors together, they make a BRAND NEW color! Tap each pair to see what happens!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000000-0003-4000-8000-000000000001'
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
            "id": "mix-colors",
            "prompt": "Tap each pair to see what new color they make!",
            "mode": "explore",
            "gridCols": 3,
            "items": [
              {
                "id": "red-plus-blue",
                "coverEmoji": "\ud83d\udfe5\u2795\ud83d\udfe6",
                "revealEmoji": "\ud83d\udfea",
                "revealLabel": "Red + Blue = Purple!"
              },
              {
                "id": "red-plus-yellow",
                "coverEmoji": "\ud83d\udfe5\u2795\ud83d\udfe8",
                "revealEmoji": "\ud83d\udfe7",
                "revealLabel": "Red + Yellow = Orange!"
              },
              {
                "id": "blue-plus-yellow",
                "coverEmoji": "\ud83d\udfe6\u2795\ud83d\udfe8",
                "revealEmoji": "\ud83d\udfe9",
                "revealLabel": "Blue + Yellow = Green!"
              }
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Try color mixing with paint, playdough, or colored water! What happens when you mix red and yellow? Blue and yellow? Red and blue? Let your child predict first, then mix to check!",
        "parentTip": "Color mixing teaches cause and effect and is deeply satisfying for young children. Colored water in clear cups is the easiest setup. Add food coloring to water and let your child pour one into another. The wow factor is huge!",
        "completionPrompt": "Did you try mixing colors together?",
        "illustration": "\ud83c\udfa8"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 4: How Does It Feel?
-- Module: Color Play
-- Widgets: drag_to_sort + parent_activity
-- Skills: Texture Awareness
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000005-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000105',
  4,
  'How Does It Feel?',
  'Is it smooth or rough? Sort things by how they feel when you touch them!',
  'Touch is amazing, friend! Some things feel smooth like glass, and some feel rough like sandpaper. Let''s sort them! Which group does each one go in?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000000-0004-4000-8000-000000000001'
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
            "id": "sort-texture",
            "prompt": "Sort these things! Is it smooth or rough?",
            "buckets": [
              {"id": "smooth", "label": "Smooth", "emoji": "\u2728"},
              {"id": "rough", "label": "Rough", "emoji": "\ud83e\udea8"}
            ],
            "items": [
              {"id": "glass", "label": "Glass", "emoji": "\ud83e\udea9", "correctBucket": "smooth"},
              {"id": "sandpaper", "label": "Sandpaper", "emoji": "\ud83d\udfe8", "correctBucket": "rough"},
              {"id": "silk", "label": "Silk", "emoji": "\ud83e\udde3", "correctBucket": "smooth"},
              {"id": "bark", "label": "Tree Bark", "emoji": "\ud83c\udf33", "correctBucket": "rough"}
            ],
            "hint": "Glass and silk feel nice and smooth. Sandpaper and tree bark feel bumpy and rough!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Go on a texture hunt! Find something smooth, something rough, something bumpy, and something soft. Touch each one and describe how it feels. Try closing your eyes and guessing just by touch!",
        "parentTip": "Texture awareness builds sensory vocabulary and observation skills \u2014 both important for art and science. Encourage descriptive words beyond just smooth/rough: bumpy, fuzzy, squishy, hard, slimy, silky.",
        "completionPrompt": "Did you go on a texture hunt together?",
        "illustration": "\u270b"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 5: Free Draw Fun
-- Module: Color Play
-- Widgets: trace_shape + parent_activity
-- Skills: Free Drawing, Pattern Making
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000005-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000105',
  5,
  'Free Draw Fun',
  'Trace your favorite shapes \u2014 circles, stars, and hearts! Then draw anything you want!',
  'It''s FREE DRAW time! Chip''s favorite! Pick a shape and trace it, or just have fun drawing whatever you imagine! Remember \u2014 there''s no wrong answer in art!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000000-0005-4000-8000-000000000001',
    '50000000-0006-4000-8000-000000000001'
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
            "id": "trace-circle-free",
            "prompt": "Trace a circle! Round and round!",
            "shape": "circle",
            "strokeColor": "#EC4899",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-star-free",
            "prompt": "Trace a star! Connect the points!",
            "shape": "star",
            "strokeColor": "#EAB308",
            "traceColor": "#F97316"
          },
          {
            "id": "trace-heart-free",
            "prompt": "Trace a heart! Show the love!",
            "shape": "heart",
            "strokeColor": "#EF4444",
            "traceColor": "#F97316"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Draw anything you want! Tell me about your picture when you''re done! There''s no wrong answer in art! Try drawing your favorite animal, your family, or something from your imagination.",
        "parentTip": "Open-ended art builds creativity and confidence. Ask your child to tell you about their drawing rather than guessing what it is. Say ''Tell me about your picture!'' instead of ''What is that?'' to keep it positive.",
        "completionPrompt": "Did you draw something awesome together?",
        "illustration": "\ud83c\udfa8"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- *************************************************************************
--
--  PART C: PROBLEM SOLVING "THINK & PLAY" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- PS LESSON 1: Sort It Out
-- Module: Think & Play
-- Widgets: drag_to_sort + parent_activity
-- Skills: Shape Sorting
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000006-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000106',
  1,
  'Sort It Out',
  'Sort shapes into groups! Put circles with circles and squares with squares.',
  'Chip''s shapes got all mixed up! Can you help sort them? Put all the circles in one group and all the squares in the other. You''re a sorting superstar!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000000-0001-4000-8000-000000000001'
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
            "id": "sort-shapes",
            "prompt": "Sort the shapes! Circles go in one group, squares in the other!",
            "buckets": [
              {"id": "circles", "label": "Circles", "emoji": "\ud83d\udfe2"},
              {"id": "squares", "label": "Squares", "emoji": "\ud83d\udfe7"}
            ],
            "items": [
              {"id": "red-circle", "label": "Red Circle", "emoji": "\ud83d\udd34", "correctBucket": "circles"},
              {"id": "blue-square", "label": "Blue Square", "emoji": "\ud83d\udfe6", "correctBucket": "squares"},
              {"id": "green-circle", "label": "Green Circle", "emoji": "\ud83d\udfe2", "correctBucket": "circles"},
              {"id": "orange-square", "label": "Orange Square", "emoji": "\ud83d\udfe7", "correctBucket": "squares"},
              {"id": "purple-circle", "label": "Purple Circle", "emoji": "\ud83d\udfea", "correctBucket": "circles"},
              {"id": "yellow-square", "label": "Yellow Square", "emoji": "\ud83d\udfe8", "correctBucket": "squares"}
            ],
            "hint": "Look at the shape! Is it round like a ball (circle) or has it got straight sides (square)?"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Sort your toys! Put all the cars together, all the dolls together, all the blocks together. Then try sorting by color \u2014 all the red toys, all the blue toys. How many groups can you make?",
        "parentTip": "Sorting is a foundational thinking skill. Start with one attribute (shape or color), then try two (''big red things'' vs. ''small blue things''). Ask your child to explain WHY each item goes in its group.",
        "completionPrompt": "Did you sort your toys into groups?",
        "illustration": "\ud83e\udde9"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- PS LESSON 2: What's the Pattern?
-- Module: Think & Play
-- Widgets: sequence_order + flash_card
-- Skills: AB Patterns
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000006-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000106',
  2,
  'What''s the Pattern?',
  'Red, blue, red, blue \u2014 what comes next? Discover and extend AB patterns!',
  'Look at this, friend! Chip found a PATTERN! Red, blue, red, blue... it keeps going! Patterns are everywhere. Can you figure out what comes next?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000000-0003-4000-8000-000000000001'
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
            "id": "pattern-ab",
            "prompt": "Finish the pattern: Red, Blue, ???",
            "items": [
              {"id": "red", "text": "Red", "emoji": "\ud83d\udfe5", "correctPosition": 1},
              {"id": "blue", "text": "Blue", "emoji": "\ud83d\udfe6", "correctPosition": 2},
              {"id": "red2", "text": "Red", "emoji": "\ud83d\udfe5", "correctPosition": 3}
            ],
            "hint": "The pattern goes A-B-A-B. Red is A, Blue is B. After blue comes... red again!"
          }
        ]
      },
      {
        "type": "flash_card",
        "prompt": "Look at these patterns! Tap to flip and see!",
        "cards": [
          {
            "id": "pattern-star-moon",
            "front": {"text": "Star, Moon, Star, Moon, ???", "emoji": "\u2b50\ud83c\udf19"},
            "back": {"text": "Star! The pattern repeats!", "emoji": "\u2b50"},
            "color": "#EAB308"
          },
          {
            "id": "pattern-cat-dog",
            "front": {"text": "Cat, Dog, Cat, Dog, ???", "emoji": "\ud83d\udc31\ud83d\udc36"},
            "back": {"text": "Cat! A-B-A-B pattern!", "emoji": "\ud83d\udc31"},
            "color": "#F97316"
          },
          {
            "id": "pattern-big-small",
            "front": {"text": "Big, Small, Big, Small, ???", "emoji": "\ud83d\udc18\ud83d\udc1d"},
            "back": {"text": "Big! The pattern keeps going!", "emoji": "\ud83d\udc18"},
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
-- PS LESSON 3: Which One Is Different?
-- Module: Think & Play
-- Widgets: multiple_choice + parent_activity
-- Skills: Odd One Out
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000006-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000106',
  3,
  'Which One Is Different?',
  'One of these things is not like the others! Can you spot the odd one out?',
  'Hmm, Chip sees something funny! Three things look alike, but one is DIFFERENT. Can you find the one that doesn''t belong? Put on your detective hat!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000000-0005-4000-8000-000000000001'
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
            "id": "odd-fruits-animal",
            "prompt": "Which one does NOT belong with the others?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              {"id": "apple", "text": "Apple", "emoji": "\ud83c\udf4e"},
              {"id": "banana", "text": "Banana", "emoji": "\ud83c\udf4c"},
              {"id": "dog", "text": "Dog", "emoji": "\ud83d\udc36"},
              {"id": "grape", "text": "Grapes", "emoji": "\ud83c\udf47"}
            ],
            "correctOptionId": "dog",
            "hint": "Three of these are things you eat. One is an animal!"
          },
          {
            "id": "odd-circles-square",
            "prompt": "Which shape is different from the others?",
            "promptEmoji": "\ud83d\udd0d",
            "options": [
              {"id": "c1", "text": "Circle", "emoji": "\ud83d\udd34"},
              {"id": "c2", "text": "Circle", "emoji": "\ud83d\udfe2"},
              {"id": "sq", "text": "Square", "emoji": "\ud83d\udfe7"},
              {"id": "c3", "text": "Circle", "emoji": "\ud83d\udfea"}
            ],
            "correctOptionId": "sq",
            "hint": "Three are round and one has straight sides!"
          },
          {
            "id": "odd-big-small",
            "prompt": "Which one is NOT like the others?",
            "promptEmoji": "\ud83d\udc40",
            "options": [
              {"id": "big1", "text": "Elephant", "emoji": "\ud83d\udc18"},
              {"id": "big2", "text": "Whale", "emoji": "\ud83d\udc33"},
              {"id": "small", "text": "Ant", "emoji": "\ud83d\udc1c"},
              {"id": "big3", "text": "Bear", "emoji": "\ud83d\udc3b"}
            ],
            "correctOptionId": "small",
            "hint": "Three are very BIG animals. One is very tiny!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play Odd One Out at home! Put 3 spoons and 1 fork on the table. Which one is different? Try with toys: 3 cars and 1 doll. 3 red blocks and 1 blue block. Let your child make the groups too!",
        "parentTip": "''Odd one out'' builds classification skills \u2014 the ability to group things by shared attributes. Start with obvious differences (category) then try subtle ones (color, size). Ask: ''Why is that one different?''",
        "completionPrompt": "Did you play Odd One Out together?",
        "illustration": "\ud83d\udd0d"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- PS LESSON 4: What Comes Next?
-- Module: Think & Play
-- Widgets: sequence_order + tap_and_reveal (explore)
-- Skills: What Comes Next
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000006-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000106',
  4,
  'What Comes Next?',
  'Baby, child, grown-up! Seed, sprout, flower! Put things in order!',
  'Things grow and change, friend! A tiny seed becomes a sprout, then a beautiful flower! Can you put these stories in the right order?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000000-0004-4000-8000-000000000001'
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
            "id": "seq-grow-up",
            "prompt": "Put these in order: from youngest to oldest!",
            "items": [
              {"id": "baby", "text": "Baby", "emoji": "\ud83d\udc76", "correctPosition": 1},
              {"id": "child", "text": "Child", "emoji": "\ud83e\uddd2", "correctPosition": 2},
              {"id": "adult", "text": "Grown-Up", "emoji": "\ud83e\uddd1", "correctPosition": 3}
            ],
            "hint": "First we are tiny babies, then we grow into children, then into grown-ups!"
          },
          {
            "id": "seq-plant",
            "prompt": "How does a plant grow? Put these in order!",
            "items": [
              {"id": "seed", "text": "Seed", "emoji": "\ud83c\udf31", "correctPosition": 1},
              {"id": "sprout", "text": "Sprout", "emoji": "\ud83c\udf3f", "correctPosition": 2},
              {"id": "flower", "text": "Flower", "emoji": "\ud83c\udf3b", "correctPosition": 3}
            ],
            "hint": "First it''s a tiny seed, then a little green sprout, then a beautiful flower!"
          }
        ]
      },
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "reveal-sequences",
            "prompt": "Tap to reveal what comes next in each story!",
            "mode": "explore",
            "gridCols": 3,
            "items": [
              {
                "id": "egg-reveal",
                "coverEmoji": "\ud83e\udd5a\u27a1\ufe0f\u2753",
                "revealEmoji": "\ud83d\udc23",
                "revealLabel": "Egg becomes a Chick!"
              },
              {
                "id": "caterpillar-reveal",
                "coverEmoji": "\ud83d\udc1b\u27a1\ufe0f\u2753",
                "revealEmoji": "\ud83e\udd8b",
                "revealLabel": "Caterpillar becomes a Butterfly!"
              },
              {
                "id": "tadpole-reveal",
                "coverEmoji": "\ud83d\udc20\u27a1\ufe0f\u2753",
                "revealEmoji": "\ud83d\udc38",
                "revealLabel": "Tadpole becomes a Frog!"
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


-- =========================================================================
-- PS LESSON 5: Follow the Steps
-- Module: Think & Play
-- Widgets: sequence_order + parent_activity
-- Skills: Following Directions
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000006-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000106',
  5,
  'Follow the Steps',
  'Put instructions in the right order! First this, then that. Step by step!',
  'Chip does things step by step! First you open the box, THEN you take out the toy. First you pick up the crayon, THEN you draw. Let''s practice putting steps in order!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000000-0006-4000-8000-000000000001'
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
            "id": "steps-box",
            "prompt": "Put these steps in order: How do you get a toy from a box?",
            "items": [
              {"id": "open", "text": "Open the box", "emoji": "\ud83d\udce6", "correctPosition": 1},
              {"id": "take-out", "text": "Take out the toy", "emoji": "\ud83e\uddf8", "correctPosition": 2}
            ],
            "hint": "First you have to open the box, THEN you can take out what''s inside!"
          },
          {
            "id": "steps-draw",
            "prompt": "Put these steps in order: How do you draw a picture?",
            "items": [
              {"id": "pick-up", "text": "Pick up the crayon", "emoji": "\ud83d\udd8d\ufe0f", "correctPosition": 1},
              {"id": "draw", "text": "Draw a circle", "emoji": "\u2b55", "correctPosition": 2}
            ],
            "hint": "First you need to pick up the crayon, THEN you can draw!"
          },
          {
            "id": "steps-wash",
            "prompt": "Put these steps in order: How do you wash your hands?",
            "items": [
              {"id": "water", "text": "Turn on the water", "emoji": "\ud83d\udeb0", "correctPosition": 1},
              {"id": "soap", "text": "Use soap", "emoji": "\ud83e\uddfc", "correctPosition": 2},
              {"id": "dry", "text": "Dry your hands", "emoji": "\ud83e\uddfb", "correctPosition": 3}
            ],
            "hint": "First water, then soap to scrub, then dry! Three steps in a row!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play Simon Says with 2 steps! ''Simon says clap your hands AND stomp your feet!'' ''Simon says touch your nose AND jump!'' Start with 2-step instructions and see if your child can follow them in order.",
        "parentTip": "Following multi-step directions is a key school readiness skill. Start with just 2 steps. As your child gets comfortable, try 3 steps. Make it silly and fun \u2014 the sillier the better for engagement!",
        "completionPrompt": "Did you play Simon Says with 2-step instructions?",
        "illustration": "\ud83d\ude4b"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);
