-- =============================================================================
-- TinkerSchool -- Seed 1st Grade (Band 1) Science Interactive Lessons
-- =============================================================================
-- 15 browser-only interactive lessons for 1st grade Science (Discovery Lab).
-- Organized into 3 modules: Sound & Light, Plants & Animals, Earth & Sky.
--
-- Aligned to NGSS 1st Grade Standards:
--   PS4  Waves: Light and Sound
--   LS1  Structure, Function, and Information Processing
--   LS3  Heredity: Inheritance and Variation of Traits
--   ESS1 Space Systems: Patterns and Cycles
--
-- Widget types used: multiple_choice, matching_pairs, sequence_order, flash_card
--
-- Subject ID:
--   Science: 9e6554ec-668a-4d27-b66d-412f4ce05d6d
--
-- Skill IDs (already seeded):
--   a8e55b88-89a0-41ae-82c2-52e4aa94cc3e  Sound & vibration
--   85dac0e1-ebd5-4c2b-adf3-fba27999bb5e  Volume & pitch
--   5a69c15a-a606-4049-8e67-670ac5a75c6c  Light & shadow
--   6e155775-e6a9-46af-89a2-ef99beff0a4f  Plant parts & function
--   b44f7206-1f9c-4757-b7c5-dcdb9a0e1b42  Animal needs & homes
--   95afe226-09d6-441f-8cc7-d1f0b50ebc78  Weather observation
--   62804c4c-8313-465d-920e-fc7afbdec406  Sun, moon, stars
--   d7235da0-79b4-49f8-a77b-b52c3e555e7f  Like parent, like baby (heredity)
--
-- Module IDs (new):
--   10000001-0301-4000-8000-000000000001  Sound & Light      (band=1, order=8)
--   10000001-0302-4000-8000-000000000001  Plants & Animals   (band=1, order=9)
--   10000001-0303-4000-8000-000000000001  Earth & Sky        (band=1, order=10)
--
-- Lesson UUID pattern: b1000003-YYYY-4000-8000-000000000001
--   Lessons 1-8:  YYYY = 1001..1008  (shifted to avoid collision with Math b1000003-0001..0008)
--   Lessons 9-15: YYYY = 0009..000f
--
-- Depends on: 002_tinkerschool_multi_subject.sql, skills already in DB
-- =============================================================================


-- =========================================================================
-- 1. MODULES (Band 1 Science -- 3 new modules)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0301-4000-8000-000000000001', 1, 8,  'Sound & Light',     'Discover how sounds are made, how light works, and why we see shadows!',                        'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d'),
  ('10000001-0302-4000-8000-000000000001', 1, 9,  'Plants & Animals',  'Learn about plant parts, what living things need, animal homes, and baby animals!',              'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d'),
  ('10000001-0303-4000-8000-000000000001', 1, 10, 'Earth & Sky',       'Explore the sun, moon, stars, weather, and the four seasons that make our world so amazing!',   'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 1: SOUND & LIGHT (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: What Makes Sound?
-- Module: Sound & Light | Skills: Sound & vibration
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1001-4000-8000-000000000001',
  '10000001-0301-4000-8000-000000000001',
  1,
  'What Makes Sound?',
  'Discover that sounds come from things that shake and vibrate!',
  'Hey there, explorer! Chip here! Have you ever wondered why a guitar goes TWANG or a drum goes BOOM? It''s all because of vibrations -- tiny shakes that travel through the air to your ears! Let''s find out what makes different sounds!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['a8e55b88-89a0-41ae-82c2-52e4aa94cc3e']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each thing to the sound it makes!",
        "pairs": [
          {"id": "mp-1", "left": {"id": "mp-1-l", "text": "Drum"}, "right": {"id": "mp-1-r", "text": "Boom boom"}},
          {"id": "mp-2", "left": {"id": "mp-2-l", "text": "Guitar string"}, "right": {"id": "mp-2-r", "text": "Twang"}},
          {"id": "mp-3", "left": {"id": "mp-3-l", "text": "Whistle"}, "right": {"id": "mp-3-r", "text": "Tweeet"}},
          {"id": "mp-4", "left": {"id": "mp-4-l", "text": "Clapping hands"}, "right": {"id": "mp-4-r", "text": "Clap clap"}},
          {"id": "mp-5", "left": {"id": "mp-5-l", "text": "Bell"}, "right": {"id": "mp-5-r", "text": "Ding ding"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc-1",
            "prompt": "What do all sounds come from?",
            "options": [
              {"id": "a", "text": "Things that vibrate (shake)"},
              {"id": "b", "text": "Things that are cold"},
              {"id": "c", "text": "Things that are big"}
            ],
            "correctOptionId": "a",
            "hint": "When something shakes back and forth very fast, it makes a sound!"
          },
          {
            "id": "mc-2",
            "prompt": "What vibrates when you talk?",
            "options": [
              {"id": "a", "text": "Your knees"},
              {"id": "b", "text": "Your vocal cords in your throat"},
              {"id": "c", "text": "Your hair"}
            ],
            "correctOptionId": "b",
            "hint": "Put your hand on your throat and hum. Feel that buzzing? Those are your vocal cords!"
          },
          {
            "id": "mc-3",
            "prompt": "If you pluck a rubber band, what happens?",
            "options": [
              {"id": "a", "text": "It changes color"},
              {"id": "b", "text": "It vibrates and makes a sound"},
              {"id": "c", "text": "It gets bigger"}
            ],
            "correctOptionId": "b",
            "hint": "A plucked rubber band shakes back and forth -- that shaking is a vibration!"
          },
          {
            "id": "mc-4",
            "prompt": "Which of these does NOT make a sound by vibrating?",
            "options": [
              {"id": "a", "text": "A triangle instrument"},
              {"id": "b", "text": "A xylophone"},
              {"id": "c", "text": "A rock sitting on the ground"}
            ],
            "correctOptionId": "c",
            "hint": "A rock just sitting there is not shaking, so it is not making any sound."
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
-- LESSON 2: Loud and Quiet Sounds
-- Module: Sound & Light | Skills: Volume & pitch
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1002-4000-8000-000000000001',
  '10000001-0301-4000-8000-000000000001',
  2,
  'Loud and Quiet Sounds',
  'Learn about loud sounds and quiet sounds, and what makes them different!',
  'Shhh... can you hear that? Some sounds are very quiet, like a whisper. And some sounds are SUPER LOUD, like a fire truck siren! Chip wants to figure out what makes sounds loud or quiet. Ready to investigate?',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['85dac0e1-ebd5-4c2b-adf3-fba27999bb5e']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "vol-1",
            "prompt": "Which sound is the LOUDEST?",
            "options": [
              {"id": "a", "text": "A whisper"},
              {"id": "b", "text": "A fire truck siren"},
              {"id": "c", "text": "A cat purring"}
            ],
            "correctOptionId": "b",
            "hint": "Fire trucks need to be heard far away so cars will move out of the way!"
          },
          {
            "id": "vol-2",
            "prompt": "Which sound is the QUIETEST?",
            "options": [
              {"id": "a", "text": "A dog barking"},
              {"id": "b", "text": "A drum being hit"},
              {"id": "c", "text": "A mouse squeaking"}
            ],
            "correctOptionId": "c",
            "hint": "Mice are tiny and make very soft, small sounds!"
          },
          {
            "id": "vol-3",
            "prompt": "What happens when you bang a drum HARDER?",
            "options": [
              {"id": "a", "text": "The sound gets louder"},
              {"id": "b", "text": "The sound gets quieter"},
              {"id": "c", "text": "The sound stays the same"}
            ],
            "correctOptionId": "a",
            "hint": "Hitting harder makes bigger vibrations, and bigger vibrations make louder sounds!"
          },
          {
            "id": "vol-4",
            "prompt": "If you pluck a thick guitar string and a thin guitar string, which one sounds lower?",
            "options": [
              {"id": "a", "text": "The thick string"},
              {"id": "b", "text": "The thin string"},
              {"id": "c", "text": "They sound the same"}
            ],
            "correctOptionId": "a",
            "hint": "Thick strings vibrate slower and make deeper, lower sounds!"
          },
          {
            "id": "vol-5",
            "prompt": "When you whisper, your vocal cords vibrate...",
            "options": [
              {"id": "a", "text": "Very hard and fast"},
              {"id": "b", "text": "Gently and softly"},
              {"id": "c", "text": "Not at all"}
            ],
            "correctOptionId": "b",
            "hint": "Whispering uses very gentle vibrations, which is why it is so quiet!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each sound to whether it is loud or quiet!",
        "pairs": [
          {"id": "lq-1", "left": {"id": "lq-1-l", "text": "Thunder"}, "right": {"id": "lq-1-r", "text": "Loud"}},
          {"id": "lq-2", "left": {"id": "lq-2-l", "text": "Leaf falling"}, "right": {"id": "lq-2-r", "text": "Quiet"}},
          {"id": "lq-3", "left": {"id": "lq-3-l", "text": "Lion roaring"}, "right": {"id": "lq-3-r", "text": "Loud"}},
          {"id": "lq-4", "left": {"id": "lq-4-l", "text": "Butterfly wings"}, "right": {"id": "lq-4-r", "text": "Quiet"}},
          {"id": "lq-5", "left": {"id": "lq-5-l", "text": "Alarm clock"}, "right": {"id": "lq-5-r", "text": "Loud"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Light All Around
-- Module: Sound & Light | Skills: Light & shadow
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1003-4000-8000-000000000001',
  '10000001-0301-4000-8000-000000000001',
  3,
  'Light All Around',
  'Explore where light comes from and how it helps us see!',
  'Look around you -- what do you see? You can see because of LIGHT! Some things make their own light, like the sun and a lamp. Chip is curious: where does all this light come from? Let''s find out together!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['5a69c15a-a606-4049-8e67-670ac5a75c6c']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about things that make light!",
        "cards": [
          {"id": "fc-1", "front": "The Sun", "back": "The sun is our biggest light source. It lights up the whole Earth during the day!"},
          {"id": "fc-2", "front": "A Lamp", "back": "A lamp uses electricity to make light so we can see indoors at night."},
          {"id": "fc-3", "front": "A Candle", "back": "A candle makes light by burning. The flame glows and gives off warm light."},
          {"id": "fc-4", "front": "A Flashlight", "back": "A flashlight uses a battery to make a bright beam of light you can point."},
          {"id": "fc-5", "front": "A Firefly", "back": "Fireflies are bugs that make their own light! Their tummies glow in the dark."},
          {"id": "fc-6", "front": "Stars", "back": "Stars are like faraway suns. They make their own light, but they look tiny because they are so far away."}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "lt-1",
            "prompt": "Which of these makes its OWN light?",
            "options": [
              {"id": "a", "text": "A mirror"},
              {"id": "b", "text": "The sun"},
              {"id": "c", "text": "A rock"}
            ],
            "correctOptionId": "b",
            "hint": "The sun is a giant ball of hot gas that glows and makes light all by itself!"
          },
          {
            "id": "lt-2",
            "prompt": "Which of these does NOT make its own light?",
            "options": [
              {"id": "a", "text": "A flashlight"},
              {"id": "b", "text": "A candle"},
              {"id": "c", "text": "The moon"}
            ],
            "correctOptionId": "c",
            "hint": "The moon looks bright, but it is actually reflecting light from the sun!"
          },
          {
            "id": "lt-3",
            "prompt": "Why can we see things?",
            "options": [
              {"id": "a", "text": "Because light bounces off things and reaches our eyes"},
              {"id": "b", "text": "Because our eyes shoot out beams"},
              {"id": "c", "text": "Because everything glows on its own"}
            ],
            "correctOptionId": "a",
            "hint": "Light hits objects and bounces into our eyes -- that is how we see!"
          },
          {
            "id": "lt-4",
            "prompt": "In a very dark room with no light at all, what can you see?",
            "options": [
              {"id": "a", "text": "Everything, if you wait long enough"},
              {"id": "b", "text": "Nothing at all"},
              {"id": "c", "text": "Only big things"}
            ],
            "correctOptionId": "b",
            "hint": "Without any light, there is nothing to bounce into our eyes, so we cannot see!"
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
-- LESSON 4: Shadows
-- Module: Sound & Light | Skills: Light & shadow
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1004-4000-8000-000000000001',
  '10000001-0301-4000-8000-000000000001',
  4,
  'Shadow Play!',
  'Learn how shadows are made and what changes their shape and size!',
  'Whoa, look at the ground on a sunny day -- do you see your shadow following you? Shadows happen when something blocks the light. Chip loves making silly shadow shapes! Let''s learn all about how shadows work!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['5a69c15a-a606-4049-8e67-670ac5a75c6c']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sh-1",
            "prompt": "What do you need to make a shadow?",
            "options": [
              {"id": "a", "text": "Light and something to block it"},
              {"id": "b", "text": "Water and a bucket"},
              {"id": "c", "text": "Wind and a kite"}
            ],
            "correctOptionId": "a",
            "hint": "A shadow forms when an object blocks light from passing through!"
          },
          {
            "id": "sh-2",
            "prompt": "Can you see your shadow in a completely dark room?",
            "options": [
              {"id": "a", "text": "Yes, shadows are always there"},
              {"id": "b", "text": "No, you need light to make a shadow"},
              {"id": "c", "text": "Only if you stand very still"}
            ],
            "correctOptionId": "b",
            "hint": "No light means no shadow! You need a light source to create shadows."
          },
          {
            "id": "sh-3",
            "prompt": "When is your shadow the LONGEST outside?",
            "options": [
              {"id": "a", "text": "At noon when the sun is high"},
              {"id": "b", "text": "Early morning or late afternoon"},
              {"id": "c", "text": "At midnight"}
            ],
            "correctOptionId": "b",
            "hint": "When the sun is low in the sky, it makes long, stretched-out shadows!"
          },
          {
            "id": "sh-4",
            "prompt": "Which material would make the DARKEST shadow?",
            "options": [
              {"id": "a", "text": "A piece of cardboard"},
              {"id": "b", "text": "A clear glass window"},
              {"id": "c", "text": "A sheet of tissue paper"}
            ],
            "correctOptionId": "a",
            "hint": "Cardboard blocks all the light, so it makes the darkest shadow!"
          },
          {
            "id": "sh-5",
            "prompt": "What happens to your shadow when you move closer to a light?",
            "options": [
              {"id": "a", "text": "Your shadow gets smaller"},
              {"id": "b", "text": "Your shadow gets bigger"},
              {"id": "c", "text": "Your shadow disappears"}
            ],
            "correctOptionId": "b",
            "hint": "Moving closer to the light makes your shadow grow bigger on the wall!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each object to the kind of shadow it makes!",
        "pairs": [
          {"id": "shm-1", "left": {"id": "shm-1-l", "text": "Your hand"}, "right": {"id": "shm-1-r", "text": "Hand-shaped shadow"}},
          {"id": "shm-2", "left": {"id": "shm-2-l", "text": "A ball"}, "right": {"id": "shm-2-r", "text": "Round shadow"}},
          {"id": "shm-3", "left": {"id": "shm-3-l", "text": "A tree"}, "right": {"id": "shm-3-r", "text": "Tall shadow with branches"}},
          {"id": "shm-4", "left": {"id": "shm-4-l", "text": "Clear glass"}, "right": {"id": "shm-4-r", "text": "Almost no shadow"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: See in the Dark
-- Module: Sound & Light | Skills: Light & shadow, Sound & vibration
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1005-4000-8000-000000000001',
  '10000001-0301-4000-8000-000000000001',
  5,
  'Why Do We Need Light?',
  'Find out why we need light to see and how people use light and sound to communicate!',
  'Imagine you are in a cave with no flashlight. Could you read a book? Nope! We need light to see things. And guess what -- people use both light and sound to send messages! Chip is going to show you how. Let''s go!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY[
    '5a69c15a-a606-4049-8e67-670ac5a75c6c',
    'a8e55b88-89a0-41ae-82c2-52e4aa94cc3e'
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
            "id": "nd-1",
            "prompt": "Why do people turn on lights at night?",
            "options": [
              {"id": "a", "text": "To make the room warmer"},
              {"id": "b", "text": "So they can see things"},
              {"id": "c", "text": "Because lights are pretty"}
            ],
            "correctOptionId": "b",
            "hint": "Without light, our eyes cannot see what is around us!"
          },
          {
            "id": "nd-2",
            "prompt": "How does a traffic light communicate with drivers?",
            "options": [
              {"id": "a", "text": "It uses colored lights: red, yellow, and green"},
              {"id": "b", "text": "It honks a horn"},
              {"id": "c", "text": "It waves flags"}
            ],
            "correctOptionId": "a",
            "hint": "Red means stop, yellow means slow down, green means go -- all using light!"
          },
          {
            "id": "nd-3",
            "prompt": "How does an ambulance tell other cars to move?",
            "options": [
              {"id": "a", "text": "It drives very slowly"},
              {"id": "b", "text": "It uses flashing lights AND a loud siren"},
              {"id": "c", "text": "It sends a text message"}
            ],
            "correctOptionId": "b",
            "hint": "Ambulances use both light (flashing) and sound (siren) to communicate!"
          },
          {
            "id": "nd-4",
            "prompt": "A lighthouse helps ships at sea by using...",
            "options": [
              {"id": "a", "text": "A very bright spinning light"},
              {"id": "b", "text": "A colorful flag"},
              {"id": "c", "text": "A long rope"}
            ],
            "correctOptionId": "a",
            "hint": "Ships can see the lighthouse beam from far away in the dark!"
          },
          {
            "id": "nd-5",
            "prompt": "A doorbell communicates using...",
            "options": [
              {"id": "a", "text": "Light"},
              {"id": "b", "text": "Sound"},
              {"id": "c", "text": "Smell"}
            ],
            "correctOptionId": "b",
            "hint": "When someone pushes the button, you hear a ding-dong -- that is sound!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each thing to how it communicates: with light or with sound!",
        "pairs": [
          {"id": "com-1", "left": {"id": "com-1-l", "text": "Fire truck siren"}, "right": {"id": "com-1-r", "text": "Sound"}},
          {"id": "com-2", "left": {"id": "com-2-l", "text": "Traffic light"}, "right": {"id": "com-2-r", "text": "Light"}},
          {"id": "com-3", "left": {"id": "com-3-l", "text": "School bell"}, "right": {"id": "com-3-r", "text": "Sound"}},
          {"id": "com-4", "left": {"id": "com-4-l", "text": "Flashlight signal"}, "right": {"id": "com-4-r", "text": "Light"}},
          {"id": "com-5", "left": {"id": "com-5-l", "text": "Car horn"}, "right": {"id": "com-5-r", "text": "Sound"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MODULE 2: PLANTS & ANIMALS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 6: Parts of a Plant
-- Module: Plants & Animals | Skills: Plant parts & function
-- Widgets: matching_pairs + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1006-4000-8000-000000000001',
  '10000001-0302-4000-8000-000000000001',
  1,
  'Parts of a Plant',
  'Learn the parts of a plant and what each part does!',
  'Chip found a garden full of beautiful plants! Every plant has special parts that help it live and grow -- roots, a stem, leaves, and flowers. Let''s explore each part and find out what job it does!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['6e155775-e6a9-46af-89a2-ef99beff0a4f']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn what this plant part does!",
        "cards": [
          {"id": "pp-1", "front": "Roots", "back": "Roots grow underground. They drink up water and hold the plant in the soil."},
          {"id": "pp-2", "front": "Stem", "back": "The stem is like a straw! It carries water from the roots up to the leaves."},
          {"id": "pp-3", "front": "Leaves", "back": "Leaves catch sunlight and use it to make food for the plant. Amazing!"},
          {"id": "pp-4", "front": "Flower", "back": "Flowers are pretty AND important! They help the plant make seeds for new baby plants."},
          {"id": "pp-5", "front": "Seeds", "back": "Seeds are like tiny plant babies. When they get water and sun, they grow into new plants!"}
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each plant part to its job!",
        "pairs": [
          {"id": "ppj-1", "left": {"id": "ppj-1-l", "text": "Roots"}, "right": {"id": "ppj-1-r", "text": "Soak up water from the soil"}},
          {"id": "ppj-2", "left": {"id": "ppj-2-l", "text": "Stem"}, "right": {"id": "ppj-2-r", "text": "Carry water up to the leaves"}},
          {"id": "ppj-3", "left": {"id": "ppj-3-l", "text": "Leaves"}, "right": {"id": "ppj-3-r", "text": "Catch sunlight to make food"}},
          {"id": "ppj-4", "left": {"id": "ppj-4-l", "text": "Flower"}, "right": {"id": "ppj-4-r", "text": "Make seeds for new plants"}},
          {"id": "ppj-5", "left": {"id": "ppj-5-l", "text": "Seeds"}, "right": {"id": "ppj-5-r", "text": "Grow into new baby plants"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 7: What Plants Need
-- Module: Plants & Animals | Skills: Plant parts & function
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1007-4000-8000-000000000001',
  '10000001-0302-4000-8000-000000000001',
  2,
  'What Do Plants Need?',
  'Discover the four things every plant needs to live and grow!',
  'Chip tried to grow a plant in a dark closet with no water. Guess what happened? It did not grow at all! Plants need special things to be happy and healthy. Let''s figure out what every plant needs!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['6e155775-e6a9-46af-89a2-ef99beff0a4f']::uuid[],
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
            "prompt": "Which of these does a plant need to grow?",
            "options": [
              {"id": "a", "text": "Water"},
              {"id": "b", "text": "Toys"},
              {"id": "c", "text": "A hat"}
            ],
            "correctOptionId": "a",
            "hint": "Plants drink water through their roots, just like you drink from a cup!"
          },
          {
            "id": "pn-2",
            "prompt": "What do leaves use to make food for the plant?",
            "options": [
              {"id": "a", "text": "Moonlight"},
              {"id": "b", "text": "Sunlight"},
              {"id": "c", "text": "A microwave"}
            ],
            "correctOptionId": "b",
            "hint": "Leaves are like tiny solar panels -- they catch sunlight to make food!"
          },
          {
            "id": "pn-3",
            "prompt": "Where do most plants grow their roots?",
            "options": [
              {"id": "a", "text": "In the air"},
              {"id": "b", "text": "In the soil (dirt)"},
              {"id": "c", "text": "On a shelf"}
            ],
            "correctOptionId": "b",
            "hint": "Roots dig down into the soil to find water and nutrients!"
          },
          {
            "id": "pn-4",
            "prompt": "Plants also need this invisible thing from the air. What is it?",
            "options": [
              {"id": "a", "text": "Candy"},
              {"id": "b", "text": "Air (a gas called carbon dioxide)"},
              {"id": "c", "text": "Music"}
            ],
            "correctOptionId": "b",
            "hint": "Plants breathe in a gas from the air to help make their food!"
          },
          {
            "id": "pn-5",
            "prompt": "What would happen if a plant got NO water at all?",
            "options": [
              {"id": "a", "text": "It would grow super fast"},
              {"id": "b", "text": "It would dry up and die"},
              {"id": "c", "text": "It would turn blue"}
            ],
            "correctOptionId": "b",
            "hint": "Just like you get thirsty, plants need water to stay alive!"
          },
          {
            "id": "pn-6",
            "prompt": "Which group shows what ALL plants need?",
            "options": [
              {"id": "a", "text": "Water, sunlight, air, and soil"},
              {"id": "b", "text": "Toys, candy, and a blanket"},
              {"id": "c", "text": "Ice cream, pizza, and juice"}
            ],
            "correctOptionId": "a",
            "hint": "Plants need water, sunlight, air, and soil -- the four big things!"
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
-- LESSON 8: Animal Body Parts
-- Module: Plants & Animals | Skills: Animal needs & homes
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-1008-4000-8000-000000000001',
  '10000001-0302-4000-8000-000000000001',
  3,
  'Amazing Animal Body Parts',
  'Learn how animals use their body parts to survive!',
  'Animals are amazing! A bird has wings to fly, a fish has fins to swim, and a rabbit has big ears to hear danger. Chip wants to match animals with their special body parts. Can you help?',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['b44f7206-1f9c-4757-b7c5-dcdb9a0e1b42']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each animal body part to what it helps the animal do!",
        "pairs": [
          {"id": "ab-1", "left": {"id": "ab-1-l", "text": "Bird wings"}, "right": {"id": "ab-1-r", "text": "Fly through the air"}},
          {"id": "ab-2", "left": {"id": "ab-2-l", "text": "Fish fins"}, "right": {"id": "ab-2-r", "text": "Swim in the water"}},
          {"id": "ab-3", "left": {"id": "ab-3-l", "text": "Rabbit ears"}, "right": {"id": "ab-3-r", "text": "Hear sounds far away"}},
          {"id": "ab-4", "left": {"id": "ab-4-l", "text": "Cat claws"}, "right": {"id": "ab-4-r", "text": "Climb trees and catch food"}},
          {"id": "ab-5", "left": {"id": "ab-5-l", "text": "Duck webbed feet"}, "right": {"id": "ab-5-r", "text": "Paddle in the water"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "abq-1",
            "prompt": "Why does a bird have a beak?",
            "options": [
              {"id": "a", "text": "To pick up and eat food"},
              {"id": "b", "text": "To wear a hat"},
              {"id": "c", "text": "To play music"}
            ],
            "correctOptionId": "a",
            "hint": "Birds use their beaks like we use forks and spoons -- to eat!"
          },
          {
            "id": "abq-2",
            "prompt": "What do a turtle''s hard shell and a porcupine''s sharp quills have in common?",
            "options": [
              {"id": "a", "text": "They help the animal swim"},
              {"id": "b", "text": "They protect the animal from danger"},
              {"id": "c", "text": "They help the animal fly"}
            ],
            "correctOptionId": "b",
            "hint": "Both the shell and the quills keep other animals from hurting them!"
          },
          {
            "id": "abq-3",
            "prompt": "Why do polar bears have thick white fur?",
            "options": [
              {"id": "a", "text": "To stay warm in the cold and blend in with the snow"},
              {"id": "b", "text": "Because they like looking fluffy"},
              {"id": "c", "text": "To help them fly"}
            ],
            "correctOptionId": "a",
            "hint": "White fur hides them in the snow, and thick fur keeps them toasty warm!"
          },
          {
            "id": "abq-4",
            "prompt": "A giraffe has a very long neck. This helps it...",
            "options": [
              {"id": "a", "text": "Dig holes in the ground"},
              {"id": "b", "text": "Reach leaves high up in tall trees"},
              {"id": "c", "text": "Run faster"}
            ],
            "correctOptionId": "b",
            "hint": "Giraffes eat leaves from the tops of trees that other animals cannot reach!"
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
-- LESSON 9: Where Animals Live
-- Module: Plants & Animals | Skills: Animal needs & homes
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-0009-4000-8000-000000000001',
  '10000001-0302-4000-8000-000000000001',
  4,
  'Where Do Animals Live?',
  'Match animals to their homes and learn about different habitats!',
  'Every animal has a special place it calls home! Fish live in water, birds build nests in trees, and bears find cozy caves. Chip wants to be a habitat detective -- let''s match animals to their homes!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['b44f7206-1f9c-4757-b7c5-dcdb9a0e1b42']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each animal to the place it lives!",
        "pairs": [
          {"id": "hab-1", "left": {"id": "hab-1-l", "text": "Fish"}, "right": {"id": "hab-1-r", "text": "Ocean or lake"}},
          {"id": "hab-2", "left": {"id": "hab-2-l", "text": "Bird"}, "right": {"id": "hab-2-r", "text": "Nest in a tree"}},
          {"id": "hab-3", "left": {"id": "hab-3-l", "text": "Bear"}, "right": {"id": "hab-3-r", "text": "Cave or den"}},
          {"id": "hab-4", "left": {"id": "hab-4-l", "text": "Rabbit"}, "right": {"id": "hab-4-r", "text": "Burrow underground"}},
          {"id": "hab-5", "left": {"id": "hab-5-l", "text": "Bee"}, "right": {"id": "hab-5-r", "text": "Beehive"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "hq-1",
            "prompt": "What do ALL animals need from their homes?",
            "options": [
              {"id": "a", "text": "A television"},
              {"id": "b", "text": "Food, water, and shelter"},
              {"id": "c", "text": "Toys and games"}
            ],
            "correctOptionId": "b",
            "hint": "Animals need food to eat, water to drink, and a safe place to rest!"
          },
          {
            "id": "hq-2",
            "prompt": "Why do birds build nests high up in trees?",
            "options": [
              {"id": "a", "text": "To be safe from animals on the ground"},
              {"id": "b", "text": "Because they like climbing"},
              {"id": "c", "text": "To get better TV signal"}
            ],
            "correctOptionId": "a",
            "hint": "High nests keep baby birds safe from cats, foxes, and other predators!"
          },
          {
            "id": "hq-3",
            "prompt": "A camel lives in the desert. What special thing does it have?",
            "options": [
              {"id": "a", "text": "A hump that stores fat for energy"},
              {"id": "b", "text": "Roller skates"},
              {"id": "c", "text": "An umbrella"}
            ],
            "correctOptionId": "a",
            "hint": "The hump stores fat that the camel can use when there is no food or water around!"
          },
          {
            "id": "hq-4",
            "prompt": "Could a polar bear live in a hot jungle?",
            "options": [
              {"id": "a", "text": "Yes, it would love it"},
              {"id": "b", "text": "No, it would be too hot with all that thick fur"},
              {"id": "c", "text": "Maybe, if it wore sunglasses"}
            ],
            "correctOptionId": "b",
            "hint": "Polar bears are built for the cold! They would overheat in a hot jungle."
          },
          {
            "id": "hq-5",
            "prompt": "What is a habitat?",
            "options": [
              {"id": "a", "text": "The natural home where an animal lives"},
              {"id": "b", "text": "A kind of hat"},
              {"id": "c", "text": "A type of food"}
            ],
            "correctOptionId": "a",
            "hint": "A habitat is the place where an animal finds everything it needs to survive!"
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
-- LESSON 10: Baby Animals
-- Module: Plants & Animals | Skills: Heredity (like parent, like baby)
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000a-4000-8000-000000000001',
  '10000001-0302-4000-8000-000000000001',
  5,
  'Baby Animals Look Like Their Parents!',
  'Match baby animals to their parents and see how they are alike!',
  'Have you ever seen a baby kitten? It looks a lot like its mom and dad! Baby animals look like their parents -- they share the same colors, shapes, and features. Let''s match baby animals to their parents!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['d7235da0-79b4-49f8-a77b-b52c3e555e7f']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each baby animal to its parent!",
        "pairs": [
          {"id": "ba-1", "left": {"id": "ba-1-l", "text": "Kitten"}, "right": {"id": "ba-1-r", "text": "Cat"}},
          {"id": "ba-2", "left": {"id": "ba-2-l", "text": "Puppy"}, "right": {"id": "ba-2-r", "text": "Dog"}},
          {"id": "ba-3", "left": {"id": "ba-3-l", "text": "Chick"}, "right": {"id": "ba-3-r", "text": "Chicken"}},
          {"id": "ba-4", "left": {"id": "ba-4-l", "text": "Calf"}, "right": {"id": "ba-4-r", "text": "Cow"}},
          {"id": "ba-5", "left": {"id": "ba-5-l", "text": "Tadpole"}, "right": {"id": "ba-5-r", "text": "Frog"}},
          {"id": "ba-6", "left": {"id": "ba-6-l", "text": "Joey"}, "right": {"id": "ba-6-r", "text": "Kangaroo"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "bq-1",
            "prompt": "A baby cat (kitten) looks like its parent cat because...",
            "options": [
              {"id": "a", "text": "It has fur, whiskers, and a tail just like mom and dad"},
              {"id": "b", "text": "It wears the same clothes"},
              {"id": "c", "text": "Someone painted it to match"}
            ],
            "correctOptionId": "a",
            "hint": "Baby animals get their features from their parents!"
          },
          {
            "id": "bq-2",
            "prompt": "Do all puppies in the same family look exactly alike?",
            "options": [
              {"id": "a", "text": "Yes, they are all identical"},
              {"id": "b", "text": "No, they can have different fur colors and spots"},
              {"id": "c", "text": "Only the girls look the same"}
            ],
            "correctOptionId": "b",
            "hint": "Puppies from the same family are similar, but each one is a little bit different!"
          },
          {
            "id": "bq-3",
            "prompt": "Which baby animal looks VERY different from its parent?",
            "options": [
              {"id": "a", "text": "A kitten (baby cat)"},
              {"id": "b", "text": "A tadpole (baby frog)"},
              {"id": "c", "text": "A puppy (baby dog)"}
            ],
            "correctOptionId": "b",
            "hint": "A tadpole lives in water and has a tail. It changes a LOT to become a frog!"
          },
          {
            "id": "bq-4",
            "prompt": "If a mother bird has blue feathers, her baby bird will probably...",
            "options": [
              {"id": "a", "text": "Have blue feathers too"},
              {"id": "b", "text": "Have purple polka dots"},
              {"id": "c", "text": "Have no feathers ever"}
            ],
            "correctOptionId": "a",
            "hint": "Baby birds get their feather colors from their parents!"
          },
          {
            "id": "bq-5",
            "prompt": "Why do baby animals look like their parents?",
            "options": [
              {"id": "a", "text": "Parents pass on their traits to their babies"},
              {"id": "b", "text": "Someone draws them to match"},
              {"id": "c", "text": "They copy each other on purpose"}
            ],
            "correctOptionId": "a",
            "hint": "Traits like fur color, body shape, and size are passed from parents to babies!"
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
-- MODULE 3: EARTH & SKY (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 11: The Sun
-- Module: Earth & Sky | Skills: Sun, moon, stars
-- Widgets: multiple_choice + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000b-4000-8000-000000000001',
  '10000001-0303-4000-8000-000000000001',
  1,
  'Our Amazing Sun!',
  'Learn about the sun and all the important things it does for Earth!',
  'Look up at the sky on a sunny day -- do you see that big, bright ball? That is the SUN! It gives us light, it keeps us warm, and it helps plants grow. Chip thinks the sun is the coolest star ever. Let''s learn all about it!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['62804c4c-8313-465d-920e-fc7afbdec406']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn a fun fact about the sun!",
        "cards": [
          {"id": "sun-1", "front": "What is the sun?", "back": "The sun is a star! It is a giant ball of hot, glowing gas. It is the closest star to Earth."},
          {"id": "sun-2", "front": "How big is the sun?", "back": "The sun is SO big that a million Earths could fit inside it!"},
          {"id": "sun-3", "front": "What does the sun give us?", "back": "The sun gives us light and heat. Without it, Earth would be dark and freezing cold!"},
          {"id": "sun-4", "front": "Why do plants need the sun?", "back": "Plants use sunlight to make their food. No sun means no food for plants!"},
          {"id": "sun-5", "front": "Should you look at the sun?", "back": "NEVER look directly at the sun! It is so bright it can hurt your eyes. Always wear sunglasses on sunny days."}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sunq-1",
            "prompt": "What is the sun?",
            "options": [
              {"id": "a", "text": "A planet"},
              {"id": "b", "text": "A star"},
              {"id": "c", "text": "The moon"}
            ],
            "correctOptionId": "b",
            "hint": "The sun is actually a star -- the closest one to Earth!"
          },
          {
            "id": "sunq-2",
            "prompt": "What two things does the sun give to Earth?",
            "options": [
              {"id": "a", "text": "Light and heat"},
              {"id": "b", "text": "Water and food"},
              {"id": "c", "text": "Wind and rain"}
            ],
            "correctOptionId": "a",
            "hint": "Feel how warm a sunny day is? The sun gives us warmth (heat) and brightness (light)!"
          },
          {
            "id": "sunq-3",
            "prompt": "Where does the sun appear to go at night?",
            "options": [
              {"id": "a", "text": "It turns off like a lamp"},
              {"id": "b", "text": "It goes below the horizon as Earth spins"},
              {"id": "c", "text": "It hides behind the clouds"}
            ],
            "correctOptionId": "b",
            "hint": "Earth is always spinning! When our side turns away from the sun, we get night."
          },
          {
            "id": "sunq-4",
            "prompt": "Is the sun closer or farther than the other stars we see at night?",
            "options": [
              {"id": "a", "text": "MUCH closer -- that is why it looks so big and bright"},
              {"id": "b", "text": "Farther away"},
              {"id": "c", "text": "The same distance"}
            ],
            "correctOptionId": "a",
            "hint": "The sun is our nearest star. The others are so far away they look like tiny dots!"
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
-- LESSON 12: Day and Night
-- Module: Earth & Sky | Skills: Sun, moon, stars
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000c-4000-8000-000000000001',
  '10000001-0303-4000-8000-000000000001',
  2,
  'Day and Night',
  'Learn why we have daytime and nighttime and put the daily cycle in order!',
  'Every day the sun comes up and the sky gets bright. Then at night, the sun goes away and we see the moon and stars. But why? Chip discovered that the Earth is spinning like a top! Let''s explore the cycle of day and night!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['62804c4c-8313-465d-920e-fc7afbdec406']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "dn-seq-1",
            "prompt": "Put the parts of a day in the right order, starting from morning!",
            "items": [
              {"id": "s1", "text": "Sunrise -- the sun comes up"},
              {"id": "s2", "text": "Morning -- time for breakfast and school"},
              {"id": "s3", "text": "Noon -- the sun is high in the sky"},
              {"id": "s4", "text": "Afternoon -- the sun starts going down"},
              {"id": "s5", "text": "Sunset -- the sky turns orange and pink"},
              {"id": "s6", "text": "Night -- the moon and stars come out"}
            ],
            "hint": "Think about your day from when you wake up to when you go to sleep!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "dnq-1",
            "prompt": "Why do we have day and night?",
            "options": [
              {"id": "a", "text": "Someone turns the sun on and off"},
              {"id": "b", "text": "The Earth spins, so different sides face the sun"},
              {"id": "c", "text": "The sun gets tired and takes a nap"}
            ],
            "correctOptionId": "b",
            "hint": "Earth keeps spinning! When your side faces the sun, it is day. When it faces away, it is night."
          },
          {
            "id": "dnq-2",
            "prompt": "When it is daytime where you live, what is it on the other side of Earth?",
            "options": [
              {"id": "a", "text": "Also daytime"},
              {"id": "b", "text": "Nighttime"},
              {"id": "c", "text": "Always afternoon"}
            ],
            "correctOptionId": "b",
            "hint": "The other side of Earth is facing away from the sun, so it is dark there!"
          },
          {
            "id": "dnq-3",
            "prompt": "About how long does one full day-and-night cycle take?",
            "options": [
              {"id": "a", "text": "1 hour"},
              {"id": "b", "text": "24 hours (one full day)"},
              {"id": "c", "text": "1 week"}
            ],
            "correctOptionId": "b",
            "hint": "Earth takes about 24 hours to spin all the way around once!"
          },
          {
            "id": "dnq-4",
            "prompt": "What can you see in the sky at night that you cannot see during the day?",
            "options": [
              {"id": "a", "text": "Stars and sometimes the moon"},
              {"id": "b", "text": "Rainbows"},
              {"id": "c", "text": "The sun"}
            ],
            "correctOptionId": "a",
            "hint": "Stars are always there, but sunlight is so bright during the day that we cannot see them!"
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
-- LESSON 13: The Moon and Stars
-- Module: Earth & Sky | Skills: Sun, moon, stars
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000d-4000-8000-000000000001',
  '10000001-0303-4000-8000-000000000001',
  3,
  'The Moon and Stars',
  'Explore the moon and the stars that light up our night sky!',
  'When the sun goes to sleep, the night sky puts on an amazing show! The moon glows bright and thousands of stars twinkle. Chip loves stargazing! Did you know the moon changes shape? Let''s find out why!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['62804c4c-8313-465d-920e-fc7afbdec406']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about the moon and stars!",
        "cards": [
          {"id": "ms-1", "front": "Does the moon make its own light?", "back": "No! The moon reflects light from the sun. It is like a big mirror in the sky."},
          {"id": "ms-2", "front": "Why does the moon look different each night?", "back": "As the moon moves around Earth, we see different amounts of the sunny side. These are called moon phases!"},
          {"id": "ms-3", "front": "Full Moon", "back": "A full moon looks like a big, round, bright circle. We can see the whole sunny side!"},
          {"id": "ms-4", "front": "Crescent Moon", "back": "A crescent moon looks like a curved sliver or banana shape. We only see a small piece of the sunny side."},
          {"id": "ms-5", "front": "What are stars?", "back": "Stars are giant balls of hot, glowing gas -- just like our sun, but very far away!"},
          {"id": "ms-6", "front": "Why do stars twinkle?", "back": "Starlight travels through Earth''s air, which bends and wiggles the light. That makes stars look like they are twinkling!"}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "msq-1",
            "prompt": "The moon gets its light from...",
            "options": [
              {"id": "a", "text": "A lamp inside the moon"},
              {"id": "b", "text": "The sun -- moonlight is reflected sunlight"},
              {"id": "c", "text": "The stars"}
            ],
            "correctOptionId": "b",
            "hint": "The moon does not glow on its own. Sunlight bounces off it and reaches our eyes!"
          },
          {
            "id": "msq-2",
            "prompt": "What shape is a full moon?",
            "options": [
              {"id": "a", "text": "A banana"},
              {"id": "b", "text": "A big round circle"},
              {"id": "c", "text": "A square"}
            ],
            "correctOptionId": "b",
            "hint": "When we see the whole lit-up side of the moon, it is a perfect circle!"
          },
          {
            "id": "msq-3",
            "prompt": "Stars are really...",
            "options": [
              {"id": "a", "text": "Tiny lights stuck to the sky"},
              {"id": "b", "text": "Giant balls of hot gas, like faraway suns"},
              {"id": "c", "text": "Holes in the sky"}
            ],
            "correctOptionId": "b",
            "hint": "Every star is a sun! They just look small because they are so far away."
          },
          {
            "id": "msq-4",
            "prompt": "We can see the moon and stars best when...",
            "options": [
              {"id": "a", "text": "It is nighttime and the sky is clear"},
              {"id": "b", "text": "It is a sunny afternoon"},
              {"id": "c", "text": "It is raining"}
            ],
            "correctOptionId": "a",
            "hint": "A clear, dark sky is perfect for seeing the moon and stars!"
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
-- LESSON 14: Weather Watch
-- Module: Earth & Sky | Skills: Weather observation
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000e-4000-8000-000000000001',
  '10000001-0303-4000-8000-000000000001',
  4,
  'Weather Watch!',
  'Learn about different types of weather and what to wear for each one!',
  'Is it sunny today? Rainy? Snowy? Chip checks the weather every morning to decide what to wear. Rain means an umbrella, snow means a warm coat! Let''s become weather watchers and learn about all kinds of weather!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['95afe226-09d6-441f-8cc7-d1f0b50ebc78']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each type of weather to the right clothing!",
        "pairs": [
          {"id": "wc-1", "left": {"id": "wc-1-l", "text": "Sunny and hot"}, "right": {"id": "wc-1-r", "text": "Shorts and sunglasses"}},
          {"id": "wc-2", "left": {"id": "wc-2-l", "text": "Rainy"}, "right": {"id": "wc-2-r", "text": "Raincoat and umbrella"}},
          {"id": "wc-3", "left": {"id": "wc-3-l", "text": "Snowy and cold"}, "right": {"id": "wc-3-r", "text": "Warm coat and boots"}},
          {"id": "wc-4", "left": {"id": "wc-4-l", "text": "Windy"}, "right": {"id": "wc-4-r", "text": "Jacket and scarf"}},
          {"id": "wc-5", "left": {"id": "wc-5-l", "text": "Cloudy and cool"}, "right": {"id": "wc-5-r", "text": "Sweater and long pants"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wq-1",
            "prompt": "Where does rain come from?",
            "options": [
              {"id": "a", "text": "Someone pours water from the sky"},
              {"id": "b", "text": "Clouds -- water drops in clouds get heavy and fall down"},
              {"id": "c", "text": "The ocean jumps up into the air"}
            ],
            "correctOptionId": "b",
            "hint": "Clouds are made of tiny water drops. When the drops get big enough, they fall as rain!"
          },
          {
            "id": "wq-2",
            "prompt": "What tool do scientists use to measure how hot or cold it is?",
            "options": [
              {"id": "a", "text": "A ruler"},
              {"id": "b", "text": "A thermometer"},
              {"id": "c", "text": "A magnifying glass"}
            ],
            "correctOptionId": "b",
            "hint": "A thermometer shows the temperature -- how warm or cool the air is!"
          },
          {
            "id": "wq-3",
            "prompt": "What kind of weather makes puddles on the ground?",
            "options": [
              {"id": "a", "text": "Sunny weather"},
              {"id": "b", "text": "Rainy weather"},
              {"id": "c", "text": "Windy weather"}
            ],
            "correctOptionId": "b",
            "hint": "When it rains, water collects on the ground and makes puddles!"
          },
          {
            "id": "wq-4",
            "prompt": "Snow is really...",
            "options": [
              {"id": "a", "text": "Tiny ice crystals that fall from clouds when it is very cold"},
              {"id": "b", "text": "White sand falling from the sky"},
              {"id": "c", "text": "Fluffy cotton from clouds"}
            ],
            "correctOptionId": "a",
            "hint": "When it is cold enough, water drops in clouds freeze into beautiful ice crystals -- snowflakes!"
          },
          {
            "id": "wq-5",
            "prompt": "Why is it important to know the weather?",
            "options": [
              {"id": "a", "text": "So we can dress right and plan our day"},
              {"id": "b", "text": "So we can do homework"},
              {"id": "c", "text": "So we know what to eat for lunch"}
            ],
            "correctOptionId": "a",
            "hint": "Knowing the weather helps us wear the right clothes and stay safe!"
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
-- LESSON 15: Four Seasons
-- Module: Earth & Sky | Skills: Weather observation, Sun/moon/stars
-- Widgets: sequence_order + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000003-000f-4000-8000-000000000001',
  '10000001-0303-4000-8000-000000000001',
  5,
  'The Four Seasons',
  'Discover spring, summer, fall, and winter and what makes each one special!',
  'Did you know the year has four big parts called seasons? Spring is when flowers bloom, summer is hot and sunny, fall has crunchy leaves, and winter brings snow! Chip loves every season. Let''s explore them all!',
  NULL, NULL, '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY[
    '95afe226-09d6-441f-8cc7-d1f0b50ebc78',
    '62804c4c-8313-465d-920e-fc7afbdec406'
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
            "id": "sea-seq-1",
            "prompt": "Put the four seasons in order, starting with spring!",
            "items": [
              {"id": "sp", "text": "Spring -- flowers bloom, baby animals are born"},
              {"id": "su", "text": "Summer -- hot and sunny, time for swimming"},
              {"id": "fa", "text": "Fall -- leaves change color and drop from trees"},
              {"id": "wi", "text": "Winter -- cold and snowy, time for warm cocoa"}
            ],
            "hint": "Think about the year: spring, then it gets hot, then leaves fall, then it gets cold!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each season to what happens during it!",
        "pairs": [
          {"id": "sp-m", "left": {"id": "sp-m-l", "text": "Spring"}, "right": {"id": "sp-m-r", "text": "Flowers bloom and rain showers"}},
          {"id": "su-m", "left": {"id": "su-m-l", "text": "Summer"}, "right": {"id": "su-m-r", "text": "Long sunny days and swimming"}},
          {"id": "fa-m", "left": {"id": "fa-m-l", "text": "Fall"}, "right": {"id": "fa-m-r", "text": "Leaves turn red, orange, and yellow"}},
          {"id": "wi-m", "left": {"id": "wi-m-l", "text": "Winter"}, "right": {"id": "wi-m-r", "text": "Snow falls and days are short"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sq-1",
            "prompt": "Why do we have different seasons?",
            "options": [
              {"id": "a", "text": "Because Earth is tilted and moves around the sun"},
              {"id": "b", "text": "Because the sun changes size"},
              {"id": "c", "text": "Because someone changes the weather machine"}
            ],
            "correctOptionId": "a",
            "hint": "Earth is tilted like a leaning top! As it travels around the sun, different parts get more or less sunlight."
          },
          {
            "id": "sq-2",
            "prompt": "In which season do we have the MOST hours of daylight?",
            "options": [
              {"id": "a", "text": "Winter"},
              {"id": "b", "text": "Summer"},
              {"id": "c", "text": "Fall"}
            ],
            "correctOptionId": "b",
            "hint": "Summer days are long! The sun rises early and sets late, giving us lots of daylight."
          },
          {
            "id": "sq-3",
            "prompt": "What happens to many trees in fall?",
            "options": [
              {"id": "a", "text": "Their leaves turn colors and fall off"},
              {"id": "b", "text": "They grow new flowers"},
              {"id": "c", "text": "They get taller"}
            ],
            "correctOptionId": "a",
            "hint": "In fall, leaves change to beautiful reds, oranges, and yellows before dropping off!"
          },
          {
            "id": "sq-4",
            "prompt": "In which season do many baby animals get born?",
            "options": [
              {"id": "a", "text": "Winter"},
              {"id": "b", "text": "Spring"},
              {"id": "c", "text": "Fall"}
            ],
            "correctOptionId": "b",
            "hint": "Spring is when nature wakes up! Flowers bloom and baby animals are born."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
