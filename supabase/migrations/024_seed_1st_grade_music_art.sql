-- =============================================================================
-- TinkerSchool -- Seed 1st Grade Music & Art Interactive Lessons (Band 1)
-- =============================================================================
-- 18 browser-only interactive lessons: 10 Music + 8 Art
-- Target audience: K-1 (ages 5-6)
-- All lessons use interactive widget types (no device required)
--
-- Subject IDs:
--   Music: 87ee4010-8b16-4f55-9627-b1961a87e726
--   Art:   5a848c8e-f476-4cd5-8d04-c67492961bc8
--
-- Module IDs:
--   Beat & Rhythm:     10000001-0401-4000-8000-000000000001
--   Pitch & Dynamics:  10000001-0402-4000-8000-000000000001
--   Colors & Shapes:   10000001-0501-4000-8000-000000000001
--   Lines & Patterns:  10000001-0502-4000-8000-000000000001
--
-- Music Skill IDs:
--   Steady beat & rhythm:         2916c645-669a-4cc1-8a62-801eb7979bf2
--   High & low pitch:             53ecce78-d8e7-4fe1-a478-97bc343eae9a
--   Fast & slow (tempo):          b4d766ce-039e-4ff7-b041-3251899bbc02
--   Loud & soft (dynamics):       ec739ad0-4922-47e9-99bb-6f0bd476281f
--   Musical notes (do, re, mi):   abc35276-0980-4e76-8f7f-0045e02c89af
--   Repeating patterns in music:  2c5d3229-8f71-4ebd-94bc-cc30753cea03
--
-- Art Skill IDs:
--   Pixels & digital images:      c879ab2b-decb-4881-9c04-b0f777a5eceb
--   Color mixing (RGB):           61a387e3-6e45-4ca1-8080-a6a79cb84774
--   Shapes & lines in art:        f62fc0f2-6185-4612-87b1-765639c358a9
--   Repeating patterns:           6c874342-e04c-4f7a-b9f2-3238236583ce
--   Symmetry & mirror images:     866e3946-0a02-4486-a1a3-1b337238ab55
--
-- Lesson UUIDs:
--   Music: b1000004-YYYY-4000-8000-000000000001 (YYYY = 0001..0010)
--   Art:   b1000005-YYYY-4000-8000-000000000001 (YYYY = 0001..0008)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Subjects, Modules, Skills
-- =========================================================================

-- 0a. Subjects (ON CONFLICT for idempotency)
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('87ee4010-8b16-4f55-9627-b1961a87e726', 'music_g1',  'Sound Studio G1', 'Music', '#A855F7', 'music',   4),
  ('5a848c8e-f476-4cd5-8d04-c67492961bc8', 'art_g1',    'Pixel Studio G1', 'Art',   '#EC4899', 'palette', 5)
ON CONFLICT (id) DO NOTHING;

-- 0b. Modules
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000001-0401-4000-8000-000000000001', 1, 1, 'Beat & Rhythm',     'Discover steady beats, fast and slow tempos, and fun rhythm patterns!',            'music',   '87ee4010-8b16-4f55-9627-b1961a87e726'),
  ('10000001-0402-4000-8000-000000000001', 1, 2, 'Pitch & Dynamics',  'Explore high and low sounds, loud and soft music, and your first musical notes!',  'music',   '87ee4010-8b16-4f55-9627-b1961a87e726'),
  ('10000001-0501-4000-8000-000000000001', 1, 1, 'Colors & Shapes',   'Learn rainbow colors, basic shapes, and see them everywhere around you!',          'palette', '5a848c8e-f476-4cd5-8d04-c67492961bc8'),
  ('10000001-0502-4000-8000-000000000001', 1, 2, 'Lines & Patterns',  'Discover different types of lines, repeating patterns, and symmetry!',             'palette', '5a848c8e-f476-4cd5-8d04-c67492961bc8')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  -- Music skills
  ('2916c645-669a-4cc1-8a62-801eb7979bf2', '87ee4010-8b16-4f55-9627-b1961a87e726', 'steady_beat_rhythm',   'Steady Beat & Rhythm',        'Keep a steady beat and clap simple rhythms',                      NULL, 1),
  ('53ecce78-d8e7-4fe1-a478-97bc343eae9a', '87ee4010-8b16-4f55-9627-b1961a87e726', 'high_low_pitch',       'High & Low Pitch',            'Distinguish between high and low sounds',                         NULL, 2),
  ('b4d766ce-039e-4ff7-b041-3251899bbc02', '87ee4010-8b16-4f55-9627-b1961a87e726', 'fast_slow_tempo',      'Fast & Slow (Tempo)',          'Identify and demonstrate fast and slow tempos',                   NULL, 3),
  ('ec739ad0-4922-47e9-99bb-6f0bd476281f', '87ee4010-8b16-4f55-9627-b1961a87e726', 'loud_soft_dynamics',   'Loud & Soft (Dynamics)',       'Identify and demonstrate loud and soft sounds',                   NULL, 4),
  ('abc35276-0980-4e76-8f7f-0045e02c89af', '87ee4010-8b16-4f55-9627-b1961a87e726', 'musical_notes_doremi', 'Musical Notes (Do, Re, Mi)',   'Recognize and sing the first three notes of the musical scale',   NULL, 5),
  ('2c5d3229-8f71-4ebd-94bc-cc30753cea03', '87ee4010-8b16-4f55-9627-b1961a87e726', 'repeating_patterns_music', 'Repeating Patterns in Music', 'Identify and create repeating patterns in music',             NULL, 6),
  -- Art skills
  ('c879ab2b-decb-4881-9c04-b0f777a5eceb', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'pixels_digital',      'Pixels & Digital Images',     'Understand that pictures on screens are made of tiny dots',       NULL, 1),
  ('61a387e3-6e45-4ca1-8080-a6a79cb84774', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'color_mixing_rgb',    'Color Mixing (RGB)',          'Mix red, green, and blue light to make new colors',               NULL, 2),
  ('f62fc0f2-6185-4612-87b1-765639c358a9', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'shapes_lines_art',    'Shapes & Lines in Art',       'Use circles, squares, triangles, and different lines in art',     NULL, 3),
  ('6c874342-e04c-4f7a-b9f2-3238236583ce', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'repeating_patterns',  'Repeating Patterns',          'Create and continue repeating visual patterns',                   NULL, 4),
  ('866e3946-0a02-4486-a1a3-1b337238ab55', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'symmetry_mirror',     'Symmetry & Mirror Images',    'Identify symmetry and create mirror images',                      NULL, 5)
ON CONFLICT (id) DO NOTHING;


-- #########################################################################
--  MUSIC LESSONS (10 lessons, Band 1)
-- #########################################################################


-- =========================================================================
-- MUSIC LESSON 1: Feel the Beat
-- Module: Beat & Rhythm
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0001-4000-8000-000000000001',
  '10000001-0401-4000-8000-000000000001',
  1,
  'Feel the Beat!',
  'Discover what a beat is and practice clapping along to a steady rhythm.',
  'Hey there, little musician! Chip here! Did you know that music has a heartbeat? It''s called a BEAT! Just like your heart goes thump-thump-thump, music has a steady beat too. Let''s clap along and feel the beat together!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['2916c645-669a-4cc1-8a62-801eb7979bf2']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "fb-1",
            "prompt": "What is a beat in music?",
            "options": [
              {"id": "a", "text": "A steady pulse that keeps going"},
              {"id": "b", "text": "A very loud sound"},
              {"id": "c", "text": "A type of instrument"}
            ],
            "correctOptionId": "a",
            "hint": "Think about your heartbeat -- it keeps going over and over!"
          },
          {
            "id": "fb-2",
            "prompt": "What part of your body has its own beat?",
            "options": [
              {"id": "a", "text": "Your elbow"},
              {"id": "b", "text": "Your heart"},
              {"id": "c", "text": "Your nose"}
            ],
            "correctOptionId": "b",
            "hint": "Put your hand on your chest. What do you feel?"
          },
          {
            "id": "fb-3",
            "prompt": "How can you show a beat with your hands?",
            "options": [
              {"id": "a", "text": "Wave them in the air"},
              {"id": "b", "text": "Put them in your pockets"},
              {"id": "c", "text": "Clap them together over and over"}
            ],
            "correctOptionId": "c",
            "hint": "Try clapping your hands one... two... three... four!"
          },
          {
            "id": "fb-4",
            "prompt": "A clock goes tick-tock, tick-tock. Is that a steady beat?",
            "options": [
              {"id": "a", "text": "Yes! It repeats the same way each time."},
              {"id": "b", "text": "No, clocks don''t have beats."},
              {"id": "c", "text": "Only if it''s a music clock."}
            ],
            "correctOptionId": "a",
            "hint": "A steady beat is something that repeats the same way over and over."
          },
          {
            "id": "fb-5",
            "prompt": "Which sound has a steady beat?",
            "options": [
              {"id": "a", "text": "A dog barking whenever it wants"},
              {"id": "b", "text": "A drum hit at the same speed: boom, boom, boom"},
              {"id": "c", "text": "Thunder during a storm"}
            ],
            "correctOptionId": "b",
            "hint": "A steady beat happens at the same speed every time."
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
-- MUSIC LESSON 2: Fast and Slow
-- Module: Beat & Rhythm
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0002-4000-8000-000000000001',
  '10000001-0401-4000-8000-000000000001',
  2,
  'Fast and Slow',
  'Learn about tempo -- how music can be fast like a rabbit or slow like a turtle!',
  'Chip loves to dance! Sometimes Chip dances really fast like a bunny hopping, and sometimes Chip moves slow like a sleepy turtle. That''s called TEMPO! Let''s find out which things are fast and which are slow!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY[
    'b4d766ce-039e-4ff7-b041-3251899bbc02',
    '2916c645-669a-4cc1-8a62-801eb7979bf2'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each thing to how fast it goes!",
        "pairs": [
          {"id": "mp-1", "left": {"id": "mp-1-l", "text": "A running cheetah"},       "right": {"id": "mp-1-r", "text": "Fast"}},
          {"id": "mp-2", "left": {"id": "mp-2-l", "text": "A crawling snail"},        "right": {"id": "mp-2-r", "text": "Slow"}},
          {"id": "mp-3", "left": {"id": "mp-3-l", "text": "A hopping bunny"},         "right": {"id": "mp-3-r", "text": "Fast"}},
          {"id": "mp-4", "left": {"id": "mp-4-l", "text": "A sleepy turtle walking"},  "right": {"id": "mp-4-r", "text": "Slow"}},
          {"id": "mp-5", "left": {"id": "mp-5-l", "text": "A race car zooming"},      "right": {"id": "mp-5-r", "text": "Fast"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "fs-1",
            "prompt": "What is the word for how fast or slow music plays?",
            "options": [
              {"id": "a", "text": "Tempo"},
              {"id": "b", "text": "Volume"},
              {"id": "c", "text": "Color"}
            ],
            "correctOptionId": "a",
            "hint": "It starts with the letter T!"
          },
          {
            "id": "fs-2",
            "prompt": "If a song plays very slowly, what kind of tempo does it have?",
            "options": [
              {"id": "a", "text": "A fast tempo"},
              {"id": "b", "text": "A slow tempo"},
              {"id": "c", "text": "A loud tempo"}
            ],
            "correctOptionId": "b",
            "hint": "If the music is slow, the tempo is..."
          },
          {
            "id": "fs-3",
            "prompt": "A lullaby at bedtime is usually...",
            "options": [
              {"id": "a", "text": "Fast and exciting"},
              {"id": "b", "text": "Slow and gentle"},
              {"id": "c", "text": "Loud and jumpy"}
            ],
            "correctOptionId": "b",
            "hint": "Think about how a lullaby makes you feel. Calm and sleepy!"
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
-- MUSIC LESSON 3: Rhythm Patterns
-- Module: Beat & Rhythm
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0003-4000-8000-000000000001',
  '10000001-0401-4000-8000-000000000001',
  3,
  'Rhythm Patterns',
  'Learn how rhythms repeat in patterns -- clap, tap, clap, tap!',
  'Chip found something cool! In music, sounds make PATTERNS that repeat over and over! Like clap-clap-stomp, clap-clap-stomp! Your job is to figure out the pattern and keep it going. Ready?',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY[
    '2916c645-669a-4cc1-8a62-801eb7979bf2',
    '2c5d3229-8f71-4ebd-94bc-cc30753cea03'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "rp-1",
            "prompt": "Put these sounds in order to make the pattern: CLAP - TAP - CLAP - TAP",
            "items": [
              {"id": "s1", "text": "CLAP"},
              {"id": "s2", "text": "TAP"},
              {"id": "s3", "text": "CLAP"},
              {"id": "s4", "text": "TAP"}
            ]
          },
          {
            "id": "rp-2",
            "prompt": "Put these sounds in order: BOOM - BOOM - SNAP - BOOM - BOOM - SNAP",
            "items": [
              {"id": "s1", "text": "BOOM"},
              {"id": "s2", "text": "BOOM"},
              {"id": "s3", "text": "SNAP"},
              {"id": "s4", "text": "BOOM"},
              {"id": "s5", "text": "BOOM"},
              {"id": "s6", "text": "SNAP"}
            ]
          },
          {
            "id": "rp-3",
            "prompt": "Put these in order: CLAP - CLAP - STOMP - REST",
            "items": [
              {"id": "s1", "text": "CLAP"},
              {"id": "s2", "text": "CLAP"},
              {"id": "s3", "text": "STOMP"},
              {"id": "s4", "text": "REST (silence)"}
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "rp-mc1",
            "prompt": "The pattern is: CLAP - TAP - CLAP - TAP. What comes next?",
            "options": [
              {"id": "a", "text": "STOMP"},
              {"id": "b", "text": "CLAP"},
              {"id": "c", "text": "SNAP"}
            ],
            "correctOptionId": "b",
            "hint": "The pattern starts over! After TAP comes..."
          },
          {
            "id": "rp-mc2",
            "prompt": "What is a rhythm pattern?",
            "options": [
              {"id": "a", "text": "Sounds that repeat in the same order"},
              {"id": "b", "text": "A very loud noise"},
              {"id": "c", "text": "Playing one note forever"}
            ],
            "correctOptionId": "a",
            "hint": "Patterns repeat the same sounds over and over."
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
-- MUSIC LESSON 4: Move to the Beat
-- Module: Beat & Rhythm
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0004-4000-8000-000000000001',
  '10000001-0401-4000-8000-000000000001',
  4,
  'Move to the Beat!',
  'Match your movements to fast and slow tempos -- march, tiptoe, and dance!',
  'Time to get moving! Chip wants to dance, and Chip needs YOUR help to pick the right moves! When music is fast, we move fast. When music is slow, we move slow. Let''s match our moves to the music!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY[
    'b4d766ce-039e-4ff7-b041-3251899bbc02',
    '2916c645-669a-4cc1-8a62-801eb7979bf2'
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
            "id": "mb-1",
            "prompt": "The music is playing really fast! Which movement matches?",
            "options": [
              {"id": "a", "text": "Running and jumping"},
              {"id": "b", "text": "Sitting very still"},
              {"id": "c", "text": "Tiptoeing slowly"}
            ],
            "correctOptionId": "a",
            "hint": "Fast music means fast movements!"
          },
          {
            "id": "mb-2",
            "prompt": "The music is slow and gentle. Which movement matches?",
            "options": [
              {"id": "a", "text": "Jumping up and down"},
              {"id": "b", "text": "Swaying slowly side to side"},
              {"id": "c", "text": "Spinning really fast"}
            ],
            "correctOptionId": "b",
            "hint": "Slow music means slow, calm movements."
          },
          {
            "id": "mb-3",
            "prompt": "A marching song plays. How would you move?",
            "options": [
              {"id": "a", "text": "March with big steps: LEFT, RIGHT, LEFT, RIGHT"},
              {"id": "b", "text": "Lie down on the floor"},
              {"id": "c", "text": "Wiggle your fingers"}
            ],
            "correctOptionId": "a",
            "hint": "Marching means stepping with a strong, steady beat!"
          },
          {
            "id": "mb-4",
            "prompt": "The tempo suddenly changes from slow to fast! What should you do?",
            "options": [
              {"id": "a", "text": "Keep moving slowly"},
              {"id": "b", "text": "Stop moving completely"},
              {"id": "c", "text": "Speed up your movements to match!"}
            ],
            "correctOptionId": "c",
            "hint": "When the music speeds up, your body speeds up too!"
          },
          {
            "id": "mb-5",
            "prompt": "Which animal moves like slow music?",
            "options": [
              {"id": "a", "text": "A snail sliding along"},
              {"id": "b", "text": "A cheetah running"},
              {"id": "c", "text": "A frog jumping fast"}
            ],
            "correctOptionId": "a",
            "hint": "Think about which animal takes its time."
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
-- MUSIC LESSON 5: Long and Short Sounds
-- Module: Beat & Rhythm
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0005-4000-8000-000000000001',
  '10000001-0401-4000-8000-000000000001',
  5,
  'Long and Short Sounds',
  'Discover the difference between long sounds that stretch out and short sounds that are quick!',
  'Chip just learned something amazing! Some sounds last a loooong time, like a church bell ringing. And some sounds are super quick, like a woodpecker tapping. Let''s sort sounds into long and short!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['2916c645-669a-4cc1-8a62-801eb7979bf2']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each sound to whether it is LONG or SHORT!",
        "pairs": [
          {"id": "ls-1", "left": {"id": "ls-1-l", "text": "A big bell ringing: BONNNNNG"},    "right": {"id": "ls-1-r", "text": "Long sound"}},
          {"id": "ls-2", "left": {"id": "ls-2-l", "text": "A quick hand clap"},               "right": {"id": "ls-2-r", "text": "Short sound"}},
          {"id": "ls-3", "left": {"id": "ls-3-l", "text": "A whistle blowing: TWEEEEET"},     "right": {"id": "ls-3-r", "text": "Long sound"}},
          {"id": "ls-4", "left": {"id": "ls-4-l", "text": "A snap of your fingers"},          "right": {"id": "ls-4-r", "text": "Short sound"}},
          {"id": "ls-5", "left": {"id": "ls-5-l", "text": "A cat''s long meow: MEOOOOW"},    "right": {"id": "ls-5-r", "text": "Long sound"}},
          {"id": "ls-6", "left": {"id": "ls-6-l", "text": "A woodpecker tapping: TAP TAP"},   "right": {"id": "ls-6-r", "text": "Short sound"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ls-mc1",
            "prompt": "Which of these is a LONG sound?",
            "options": [
              {"id": "a", "text": "A balloon popping"},
              {"id": "b", "text": "A fire truck siren going WHEEEE"},
              {"id": "c", "text": "A quick knock on a door"}
            ],
            "correctOptionId": "b",
            "hint": "A siren keeps going and going -- that''s a long sound!"
          },
          {
            "id": "ls-mc2",
            "prompt": "Which of these is a SHORT sound?",
            "options": [
              {"id": "a", "text": "A dog''s quick bark: WOOF!"},
              {"id": "b", "text": "A train whistle: WOOOOO"},
              {"id": "c", "text": "A wolf howling: AROOOOO"}
            ],
            "correctOptionId": "a",
            "hint": "One quick bark is over really fast!"
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
-- MUSIC LESSON 6: High and Low Sounds
-- Module: Pitch & Dynamics
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0006-4000-8000-000000000001',
  '10000001-0402-4000-8000-000000000001',
  1,
  'High and Low Sounds',
  'Learn to tell the difference between high sounds and low sounds all around you!',
  'Hey friend! Chip here! Did you know sounds can be HIGH like a tiny bird tweeting, or LOW like a big bear growling? Let''s explore high and low sounds and see if you can tell them apart!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['53ecce78-d8e7-4fe1-a478-97bc343eae9a']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each sound to HIGH or LOW!",
        "pairs": [
          {"id": "hl-1", "left": {"id": "hl-1-l", "text": "A tiny bird singing: tweet tweet!"}, "right": {"id": "hl-1-r", "text": "High sound"}},
          {"id": "hl-2", "left": {"id": "hl-2-l", "text": "A big bear growling: GRRRR"},       "right": {"id": "hl-2-r", "text": "Low sound"}},
          {"id": "hl-3", "left": {"id": "hl-3-l", "text": "A baby kitten meowing"},            "right": {"id": "hl-3-r", "text": "High sound"}},
          {"id": "hl-4", "left": {"id": "hl-4-l", "text": "Thunder rumbling in the sky"},      "right": {"id": "hl-4-r", "text": "Low sound"}},
          {"id": "hl-5", "left": {"id": "hl-5-l", "text": "A tiny whistle blowing"},           "right": {"id": "hl-5-r", "text": "High sound"}},
          {"id": "hl-6", "left": {"id": "hl-6-l", "text": "A big tuba playing: BWOMMM"},      "right": {"id": "hl-6-r", "text": "Low sound"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "hl-mc1",
            "prompt": "A mouse squeaks. Is that a high sound or a low sound?",
            "options": [
              {"id": "a", "text": "High sound"},
              {"id": "b", "text": "Low sound"},
              {"id": "c", "text": "No sound at all"}
            ],
            "correctOptionId": "a",
            "hint": "Mice are tiny and make tiny, high squeaky sounds!"
          },
          {
            "id": "hl-mc2",
            "prompt": "Which instrument makes a LOW sound?",
            "options": [
              {"id": "a", "text": "A tiny triangle"},
              {"id": "b", "text": "A big bass drum"},
              {"id": "c", "text": "A small flute"}
            ],
            "correctOptionId": "b",
            "hint": "Big instruments usually make lower sounds."
          },
          {
            "id": "hl-mc3",
            "prompt": "When you hum really high, your voice sounds like...",
            "options": [
              {"id": "a", "text": "A rumbling truck"},
              {"id": "b", "text": "A singing bird"},
              {"id": "c", "text": "A banging drum"}
            ],
            "correctOptionId": "b",
            "hint": "Birds sing high, sweet notes -- just like your high hum!"
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
-- MUSIC LESSON 7: Loud and Soft
-- Module: Pitch & Dynamics
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0007-4000-8000-000000000001',
  '10000001-0402-4000-8000-000000000001',
  2,
  'Loud and Soft',
  'Explore dynamics -- how music can be loud like a lion or soft like a whisper!',
  'Shhh... can you hear that? Some sounds are very soft, like a whisper. And some sounds are VERY LOUD, like a drum! Musicians call this DYNAMICS. Let''s learn when music is loud and when it''s soft!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['ec739ad0-4922-47e9-99bb-6f0bd476281f']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each sound to LOUD or SOFT!",
        "pairs": [
          {"id": "ds-1", "left": {"id": "ds-1-l", "text": "A lion roaring: ROARRR!"},           "right": {"id": "ds-1-r", "text": "Loud"}},
          {"id": "ds-2", "left": {"id": "ds-2-l", "text": "A butterfly landing on a flower"},    "right": {"id": "ds-2-r", "text": "Soft"}},
          {"id": "ds-3", "left": {"id": "ds-3-l", "text": "Fireworks exploding: BOOM BANG!"},    "right": {"id": "ds-3-r", "text": "Loud"}},
          {"id": "ds-4", "left": {"id": "ds-4-l", "text": "A secret whisper to a friend"},      "right": {"id": "ds-4-r", "text": "Soft"}},
          {"id": "ds-5", "left": {"id": "ds-5-l", "text": "A big drum: BANG BANG BANG!"},        "right": {"id": "ds-5-r", "text": "Loud"}},
          {"id": "ds-6", "left": {"id": "ds-6-l", "text": "Rain drops gently tapping a window"}, "right": {"id": "ds-6-r", "text": "Soft"}}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "ds-mc1",
            "prompt": "What is the musical word for how loud or soft music is?",
            "options": [
              {"id": "a", "text": "Tempo"},
              {"id": "b", "text": "Dynamics"},
              {"id": "c", "text": "Rhythm"}
            ],
            "correctOptionId": "b",
            "hint": "It starts with the letter D!"
          },
          {
            "id": "ds-mc2",
            "prompt": "You are in a library. Should you play music loud or soft?",
            "options": [
              {"id": "a", "text": "Very loud so everyone can hear!"},
              {"id": "b", "text": "Very soft so you don''t disturb others"},
              {"id": "c", "text": "You can''t play music anywhere"}
            ],
            "correctOptionId": "b",
            "hint": "Libraries are quiet places!"
          },
          {
            "id": "ds-mc3",
            "prompt": "At a birthday party, the music is usually...",
            "options": [
              {"id": "a", "text": "Loud and fun!"},
              {"id": "b", "text": "Silent"},
              {"id": "c", "text": "Soft like a whisper"}
            ],
            "correctOptionId": "a",
            "hint": "Parties are exciting and full of energy!"
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
-- MUSIC LESSON 8: Sounds Around Us
-- Module: Pitch & Dynamics
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0008-4000-8000-000000000001',
  '10000001-0402-4000-8000-000000000001',
  3,
  'Sounds Around Us',
  'Listen to the world! Learn about the different sounds you hear every day.',
  'Chip loves listening! The world is full of sounds -- birds singing, cars honking, leaves rustling! Every sound is different. Some are high, some are low, some are loud, and some are soft. Let''s explore the sounds around us!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY[
    '53ecce78-d8e7-4fe1-a478-97bc343eae9a',
    'ec739ad0-4922-47e9-99bb-6f0bd476281f'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about everyday sounds!",
        "cards": [
          {
            "id": "fc-birds",
            "front": "Birds Singing",
            "back": "Birds make HIGH and SOFT sounds. They tweet and chirp to talk to each other!"
          },
          {
            "id": "fc-thunder",
            "front": "Thunder",
            "back": "Thunder makes a LOW and LOUD rumbling sound. It happens when lightning heats the air super fast!"
          },
          {
            "id": "fc-rain",
            "front": "Rain on a Roof",
            "back": "Rain makes a SOFT tapping sound. It can be fast or slow depending on how hard it rains!"
          },
          {
            "id": "fc-horn",
            "front": "Car Horn",
            "back": "A car horn is LOUD and HIGH! Drivers honk to say ''watch out!'' It gets your attention fast."
          },
          {
            "id": "fc-wind",
            "front": "Wind Blowing",
            "back": "Wind can be SOFT like a gentle breeze or LOUD like a big storm. It makes a whooshing sound!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each everyday sound to where you hear it!",
        "pairs": [
          {"id": "sau-1", "left": {"id": "sau-1-l", "text": "Moo! Moo!"},           "right": {"id": "sau-1-r", "text": "A farm"}},
          {"id": "sau-2", "left": {"id": "sau-2-l", "text": "Honk! Beep beep!"},     "right": {"id": "sau-2-r", "text": "A busy street"}},
          {"id": "sau-3", "left": {"id": "sau-3-l", "text": "Splash! Splash!"},      "right": {"id": "sau-3-r", "text": "A swimming pool"}},
          {"id": "sau-4", "left": {"id": "sau-4-l", "text": "Woof! Woof!"},          "right": {"id": "sau-4-r", "text": "A dog park"}},
          {"id": "sau-5", "left": {"id": "sau-5-l", "text": "Ring ring ring!"},       "right": {"id": "sau-5-r", "text": "A school bell"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- MUSIC LESSON 9: Do Re Mi
-- Module: Pitch & Dynamics
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-0009-4000-8000-000000000001',
  '10000001-0402-4000-8000-000000000001',
  4,
  'Do Re Mi',
  'Meet the first three musical notes -- Do, Re, and Mi! They are the beginning of a musical ladder.',
  'Chip is so excited! Today we''re learning our very first musical NOTES! Notes have special names. The first three are Do, Re, and Mi. They go from low to high, like climbing up stairs. Let''s meet them!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['abc35276-0980-4e76-8f7f-0045e02c89af']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to meet the first three musical notes!",
        "cards": [
          {
            "id": "fc-do",
            "front": "DO (doh)",
            "back": "Do is the LOWEST of the three notes. It''s like the bottom step of a staircase. Sing it low: Dooooo!"
          },
          {
            "id": "fc-re",
            "front": "RE (ray)",
            "back": "Re is the MIDDLE note. It''s one step higher than Do. Sing it a little higher: Reeeee!"
          },
          {
            "id": "fc-mi",
            "front": "MI (mee)",
            "back": "Mi is the HIGHEST of the three. It''s one step higher than Re. Sing it up high: Miiiiii!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "drm-1",
            "prompt": "Which note is the LOWEST?",
            "options": [
              {"id": "a", "text": "Do"},
              {"id": "b", "text": "Re"},
              {"id": "c", "text": "Mi"}
            ],
            "correctOptionId": "a",
            "hint": "It''s at the bottom of the musical stairs!"
          },
          {
            "id": "drm-2",
            "prompt": "Which note is the HIGHEST of the three?",
            "options": [
              {"id": "a", "text": "Do"},
              {"id": "b", "text": "Re"},
              {"id": "c", "text": "Mi"}
            ],
            "correctOptionId": "c",
            "hint": "It''s at the top of the musical stairs!"
          },
          {
            "id": "drm-3",
            "prompt": "What order do the first three notes go in, from low to high?",
            "options": [
              {"id": "a", "text": "Mi, Re, Do"},
              {"id": "b", "text": "Do, Re, Mi"},
              {"id": "c", "text": "Re, Do, Mi"}
            ],
            "correctOptionId": "b",
            "hint": "Start at the bottom and climb up: Do... Re... Mi!"
          },
          {
            "id": "drm-4",
            "prompt": "The notes Do, Re, Mi are like...",
            "options": [
              {"id": "a", "text": "Colors in a rainbow"},
              {"id": "b", "text": "Steps going up a staircase"},
              {"id": "c", "text": "Letters in your name"}
            ],
            "correctOptionId": "b",
            "hint": "Each note goes a little higher, like climbing stairs!"
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
-- MUSIC LESSON 10: Musical Patterns
-- Module: Pitch & Dynamics
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000004-000a-4000-8000-000000000001',
  '10000001-0402-4000-8000-000000000001',
  5,
  'Musical Patterns',
  'Find repeating patterns in music using notes and rhythms -- AB, ABB, and more!',
  'Chip LOVES patterns! In music, patterns are everywhere! A pattern is when something repeats: like Do-Mi-Do-Mi or Clap-Clap-Stomp, Clap-Clap-Stomp. Let''s find and finish some musical patterns!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY[
    '2c5d3229-8f71-4ebd-94bc-cc30753cea03',
    'abc35276-0980-4e76-8f7f-0045e02c89af'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "mp-seq1",
            "prompt": "Put the notes in order: Do - Mi - Do - Mi",
            "items": [
              {"id": "s1", "text": "Do"},
              {"id": "s2", "text": "Mi"},
              {"id": "s3", "text": "Do"},
              {"id": "s4", "text": "Mi"}
            ]
          },
          {
            "id": "mp-seq2",
            "prompt": "Put the rhythm in order: CLAP - CLAP - REST - CLAP - CLAP - REST",
            "items": [
              {"id": "s1", "text": "CLAP"},
              {"id": "s2", "text": "CLAP"},
              {"id": "s3", "text": "REST"},
              {"id": "s4", "text": "CLAP"},
              {"id": "s5", "text": "CLAP"},
              {"id": "s6", "text": "REST"}
            ]
          },
          {
            "id": "mp-seq3",
            "prompt": "Put the notes in order: Do - Re - Mi - Do - Re - Mi",
            "items": [
              {"id": "s1", "text": "Do"},
              {"id": "s2", "text": "Re"},
              {"id": "s3", "text": "Mi"},
              {"id": "s4", "text": "Do"},
              {"id": "s5", "text": "Re"},
              {"id": "s6", "text": "Mi"}
            ]
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "mp-fib1",
            "sentence": "The pattern is: Do - Mi - Do - ___",
            "correctAnswer": "Mi",
            "hint": "The pattern goes Do, Mi, Do, then what?",
            "acceptableAnswers": ["mi", "MI"]
          },
          {
            "id": "mp-fib2",
            "sentence": "The pattern is: CLAP - CLAP - STOMP - CLAP - CLAP - ___",
            "correctAnswer": "STOMP",
            "hint": "The pattern repeats: CLAP, CLAP, then what?",
            "acceptableAnswers": ["stomp", "Stomp"]
          },
          {
            "id": "mp-fib3",
            "sentence": "An AB pattern goes: A, B, A, B, A, ___",
            "correctAnswer": "B",
            "hint": "After A always comes...",
            "acceptableAnswers": ["b"]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- #########################################################################
--  ART LESSONS (8 lessons, Band 1)
-- #########################################################################


-- =========================================================================
-- ART LESSON 1: Rainbow Colors
-- Module: Colors & Shapes
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0001-4000-8000-000000000001',
  '10000001-0501-4000-8000-000000000001',
  1,
  'Rainbow Colors!',
  'Learn all the colors of the rainbow and find them in the world around you!',
  'Wow, look at that! Chip sees a rainbow! Rainbows have special colors that always go in the same order. Let''s learn all the beautiful colors of the rainbow together!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['61a387e3-6e45-4ca1-8080-a6a79cb84774']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to see a rainbow color and where to find it!",
        "cards": [
          {
            "id": "fc-red",
            "front": {"text": "RED", "emoji": "🔴"},
            "back": {"text": "Red is bright and bold! Find it on fire trucks 🚒, apples 🍎, and ladybugs 🐞"},
            "color": "#EF4444"
          },
          {
            "id": "fc-orange",
            "front": {"text": "ORANGE", "emoji": "🟠"},
            "back": {"text": "Orange is warm and happy! Find it on oranges 🍊, pumpkins 🎃, and goldfish 🐠"},
            "color": "#F97316"
          },
          {
            "id": "fc-yellow",
            "front": {"text": "YELLOW", "emoji": "🟡"},
            "back": {"text": "Yellow is sunny and cheerful! Find it on the sun ☀️, bananas 🍌, and school buses 🚌"},
            "color": "#EAB308"
          },
          {
            "id": "fc-green",
            "front": {"text": "GREEN", "emoji": "🟢"},
            "back": {"text": "Green is the color of nature! Find it on grass 🌿, leaves 🍃, and frogs 🐸"},
            "color": "#22C55E"
          },
          {
            "id": "fc-blue",
            "front": {"text": "BLUE", "emoji": "🔵"},
            "back": {"text": "Blue is cool and calm! Find it in the sky 🌤️, the ocean 🌊, and blueberries 🫐"},
            "color": "#3B82F6"
          },
          {
            "id": "fc-purple",
            "front": {"text": "PURPLE", "emoji": "🟣"},
            "back": {"text": "Purple is magical and special! Find it on grapes 🍇, eggplants 🍆, and butterflies 🦋"},
            "color": "#A855F7"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each color to something that is that color!",
        "pairs": [
          {"id": "rc-1", "left": {"id": "rc-1-l", "text": "🔴 Red"},    "right": {"id": "rc-1-r", "text": "🚒 Fire truck"}},
          {"id": "rc-2", "left": {"id": "rc-2-l", "text": "🟠 Orange"}, "right": {"id": "rc-2-r", "text": "🎃 Pumpkin"}},
          {"id": "rc-3", "left": {"id": "rc-3-l", "text": "🟡 Yellow"}, "right": {"id": "rc-3-r", "text": "☀️ The sun"}},
          {"id": "rc-4", "left": {"id": "rc-4-l", "text": "🟢 Green"},  "right": {"id": "rc-4-r", "text": "🐸 A frog"}},
          {"id": "rc-5", "left": {"id": "rc-5-l", "text": "🔵 Blue"},   "right": {"id": "rc-5-r", "text": "🌊 The ocean"}},
          {"id": "rc-6", "left": {"id": "rc-6-l", "text": "🟣 Purple"}, "right": {"id": "rc-6-r", "text": "🍇 Grapes"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- ART LESSON 2: Shapes Everywhere
-- Module: Colors & Shapes
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0002-4000-8000-000000000001',
  '10000001-0501-4000-8000-000000000001',
  2,
  'Shapes Everywhere!',
  'Meet the four basic shapes: circle, square, triangle, and rectangle!',
  'Chip sees shapes EVERYWHERE! The wheels on a bus are circles, a window is a rectangle, and a slice of pizza is a triangle! Let''s learn all about shapes and find them in the world!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['f62fc0f2-6185-4612-87b1-765639c358a9']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about a basic shape!",
        "cards": [
          {
            "id": "fc-circle",
            "front": "CIRCLE",
            "back": "A circle is perfectly round with no corners at all! Think of a ball, a cookie, or the moon."
          },
          {
            "id": "fc-square",
            "front": "SQUARE",
            "back": "A square has 4 equal sides and 4 corners! Think of a window, a cracker, or a block."
          },
          {
            "id": "fc-triangle",
            "front": "TRIANGLE",
            "back": "A triangle has 3 sides and 3 corners! Think of a slice of pizza, a roof, or a yield sign."
          },
          {
            "id": "fc-rectangle",
            "front": "RECTANGLE",
            "back": "A rectangle has 4 sides and 4 corners, but two sides are longer! Think of a door, a book, or a phone."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each shape to something that looks like it!",
        "pairs": [
          {"id": "se-1", "left": {"id": "se-1-l", "text": "Circle"},    "right": {"id": "se-1-r", "text": "A clock on the wall"}},
          {"id": "se-2", "left": {"id": "se-2-l", "text": "Square"},    "right": {"id": "se-2-r", "text": "A cheese cracker"}},
          {"id": "se-3", "left": {"id": "se-3-l", "text": "Triangle"},  "right": {"id": "se-3-r", "text": "A slice of pizza"}},
          {"id": "se-4", "left": {"id": "se-4-l", "text": "Rectangle"}, "right": {"id": "se-4-r", "text": "A door"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- ART LESSON 3: My Favorite Colors
-- Module: Colors & Shapes
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0003-4000-8000-000000000001',
  '10000001-0501-4000-8000-000000000001',
  3,
  'My Favorite Colors',
  'Test how well you know your colors by identifying them in fun challenges!',
  'Pop quiz time! Chip wants to see how many colors you know. Don''t worry -- this is going to be super fun! Let''s see if you can spot the right colors. Ready? Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY[
    '61a387e3-6e45-4ca1-8080-a6a79cb84774',
    'c879ab2b-decb-4881-9c04-b0f777a5eceb'
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
            "id": "mc-c1",
            "prompt": "What color is a banana?",
            "options": [
              {"id": "a", "text": "Blue"},
              {"id": "b", "text": "Yellow"},
              {"id": "c", "text": "Green"}
            ],
            "correctOptionId": "b",
            "hint": "Think about a ripe banana. It''s bright and sunny!"
          },
          {
            "id": "mc-c2",
            "prompt": "What color is the sky on a sunny day?",
            "options": [
              {"id": "a", "text": "Red"},
              {"id": "b", "text": "Orange"},
              {"id": "c", "text": "Blue"}
            ],
            "correctOptionId": "c",
            "hint": "Look up on a nice day -- what color do you see?"
          },
          {
            "id": "mc-c3",
            "prompt": "What color is grass?",
            "options": [
              {"id": "a", "text": "Green"},
              {"id": "b", "text": "Purple"},
              {"id": "c", "text": "Red"}
            ],
            "correctOptionId": "a",
            "hint": "Think about what the lawn looks like!"
          },
          {
            "id": "mc-c4",
            "prompt": "Which TWO colors mixed together make ORANGE?",
            "options": [
              {"id": "a", "text": "Red and Yellow"},
              {"id": "b", "text": "Blue and Green"},
              {"id": "c", "text": "Purple and White"}
            ],
            "correctOptionId": "a",
            "hint": "One is the color of a fire truck, the other is the color of the sun!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each color to a fruit that is that color!",
        "pairs": [
          {"id": "cf-1", "left": {"id": "cf-1-l", "text": "Red"},    "right": {"id": "cf-1-r", "text": "Strawberry"}},
          {"id": "cf-2", "left": {"id": "cf-2-l", "text": "Yellow"}, "right": {"id": "cf-2-r", "text": "Banana"}},
          {"id": "cf-3", "left": {"id": "cf-3-l", "text": "Orange"}, "right": {"id": "cf-3-r", "text": "Orange"}},
          {"id": "cf-4", "left": {"id": "cf-4-l", "text": "Green"},  "right": {"id": "cf-4-r", "text": "Watermelon (outside)"}},
          {"id": "cf-5", "left": {"id": "cf-5-l", "text": "Purple"}, "right": {"id": "cf-5-r", "text": "Grapes"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- ART LESSON 4: Shapes in Our World
-- Module: Colors & Shapes
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0004-4000-8000-000000000001',
  '10000001-0501-4000-8000-000000000001',
  4,
  'Shapes in Our World',
  'Find shapes hiding in everyday objects all around you!',
  'Guess what, friend? Shapes are HIDING everywhere! A pizza box is a square, a coin is a circle, and a roof is a triangle. Chip is going on a shape hunt -- come along and see how many shapes you can spot!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['f62fc0f2-6185-4612-87b1-765639c358a9']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sw-1",
            "prompt": "What shape is a wheel?",
            "options": [
              {"id": "a", "text": "Square"},
              {"id": "b", "text": "Circle"},
              {"id": "c", "text": "Triangle"}
            ],
            "correctOptionId": "b",
            "hint": "Wheels are round so they can roll!"
          },
          {
            "id": "sw-2",
            "prompt": "What shape is a sandwich cut corner to corner?",
            "options": [
              {"id": "a", "text": "Circle"},
              {"id": "b", "text": "Rectangle"},
              {"id": "c", "text": "Triangle"}
            ],
            "correctOptionId": "c",
            "hint": "When you cut a square from corner to corner, you get two shapes with 3 sides!"
          },
          {
            "id": "sw-3",
            "prompt": "What shape is a picture frame?",
            "options": [
              {"id": "a", "text": "Triangle"},
              {"id": "b", "text": "Circle"},
              {"id": "c", "text": "Rectangle"}
            ],
            "correctOptionId": "c",
            "hint": "Picture frames have 4 sides, and some sides are longer than others!"
          },
          {
            "id": "sw-4",
            "prompt": "What shape is a stop sign?",
            "options": [
              {"id": "a", "text": "Circle"},
              {"id": "b", "text": "It has 8 sides (an octagon!)"},
              {"id": "c", "text": "Square"}
            ],
            "correctOptionId": "b",
            "hint": "Count the sides of a stop sign. There are more than 4!"
          },
          {
            "id": "sw-5",
            "prompt": "How many corners does a circle have?",
            "options": [
              {"id": "a", "text": "4 corners"},
              {"id": "b", "text": "3 corners"},
              {"id": "c", "text": "0 corners -- it''s perfectly round!"}
            ],
            "correctOptionId": "c",
            "hint": "Run your finger around a circle. Do you feel any sharp corners?"
          },
          {
            "id": "sw-6",
            "prompt": "Which shape has the MOST corners: a triangle or a rectangle?",
            "options": [
              {"id": "a", "text": "A triangle (3 corners)"},
              {"id": "b", "text": "A rectangle (4 corners)"},
              {"id": "c", "text": "They have the same number"}
            ],
            "correctOptionId": "b",
            "hint": "Count the corners: triangles have 3, rectangles have 4."
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
-- ART LESSON 5: Types of Lines
-- Module: Lines & Patterns
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0005-4000-8000-000000000001',
  '10000001-0502-4000-8000-000000000001',
  1,
  'Types of Lines',
  'Discover four types of lines: straight, curved, zigzag, and wavy!',
  'Did you know there are different kinds of lines? Chip learned about straight lines, curvy lines, zigzag lines, and wavy lines! They''re all around us. Let''s learn about each one!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['f62fc0f2-6185-4612-87b1-765639c358a9']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about a type of line!",
        "cards": [
          {
            "id": "fc-straight",
            "front": "STRAIGHT LINE",
            "back": "A straight line goes in one direction without bending. Think of a ruler, a pencil, or a table edge!"
          },
          {
            "id": "fc-curved",
            "front": "CURVED LINE",
            "back": "A curved line bends smoothly, like a smile, a rainbow, or the letter C!"
          },
          {
            "id": "fc-zigzag",
            "front": "ZIGZAG LINE",
            "back": "A zigzag line goes back and forth with sharp points, like a lightning bolt or mountain tops!"
          },
          {
            "id": "fc-wavy",
            "front": "WAVY LINE",
            "back": "A wavy line goes up and down smoothly, like ocean waves or a slithering snake!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tl-1",
            "prompt": "A rainbow in the sky is what kind of line?",
            "options": [
              {"id": "a", "text": "Straight"},
              {"id": "b", "text": "Curved"},
              {"id": "c", "text": "Zigzag"}
            ],
            "correctOptionId": "b",
            "hint": "A rainbow bends smoothly across the sky!"
          },
          {
            "id": "tl-2",
            "prompt": "A lightning bolt looks like what kind of line?",
            "options": [
              {"id": "a", "text": "Wavy"},
              {"id": "b", "text": "Straight"},
              {"id": "c", "text": "Zigzag"}
            ],
            "correctOptionId": "c",
            "hint": "Lightning goes back and forth with sharp, pointy turns!"
          },
          {
            "id": "tl-3",
            "prompt": "Ocean waves look like what kind of line?",
            "options": [
              {"id": "a", "text": "Zigzag"},
              {"id": "b", "text": "Straight"},
              {"id": "c", "text": "Wavy"}
            ],
            "correctOptionId": "c",
            "hint": "Waves go up and down smoothly -- not with sharp points."
          },
          {
            "id": "tl-4",
            "prompt": "The edge of a ruler is what kind of line?",
            "options": [
              {"id": "a", "text": "Straight"},
              {"id": "b", "text": "Curved"},
              {"id": "c", "text": "Wavy"}
            ],
            "correctOptionId": "a",
            "hint": "Rulers help you draw lines that don''t bend!"
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
-- ART LESSON 6: Patterns All Around
-- Module: Lines & Patterns
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0006-4000-8000-000000000001',
  '10000001-0502-4000-8000-000000000001',
  2,
  'Patterns All Around',
  'Discover repeating patterns using shapes and colors -- AB, ABC, and more!',
  'Chip found a secret about art: PATTERNS make everything look awesome! A pattern is when something repeats -- like red-blue-red-blue or circle-star-circle-star. Let''s make some patterns!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['6c874342-e04c-4f7a-b9f2-3238236583ce']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pa-1",
            "prompt": "Put these in order to make a pattern: RED - BLUE - RED - BLUE",
            "items": [
              {"id": "s1", "text": "RED"},
              {"id": "s2", "text": "BLUE"},
              {"id": "s3", "text": "RED"},
              {"id": "s4", "text": "BLUE"}
            ]
          },
          {
            "id": "pa-2",
            "prompt": "Put these in order: CIRCLE - STAR - CIRCLE - STAR - CIRCLE - STAR",
            "items": [
              {"id": "s1", "text": "CIRCLE"},
              {"id": "s2", "text": "STAR"},
              {"id": "s3", "text": "CIRCLE"},
              {"id": "s4", "text": "STAR"},
              {"id": "s5", "text": "CIRCLE"},
              {"id": "s6", "text": "STAR"}
            ]
          },
          {
            "id": "pa-3",
            "prompt": "Put these in order: RED - RED - BLUE - RED - RED - BLUE",
            "items": [
              {"id": "s1", "text": "RED"},
              {"id": "s2", "text": "RED"},
              {"id": "s3", "text": "BLUE"},
              {"id": "s4", "text": "RED"},
              {"id": "s5", "text": "RED"},
              {"id": "s6", "text": "BLUE"}
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pa-mc1",
            "prompt": "The pattern is: HEART - STAR - HEART - STAR. What comes next?",
            "options": [
              {"id": "a", "text": "HEART"},
              {"id": "b", "text": "MOON"},
              {"id": "c", "text": "STAR"}
            ],
            "correctOptionId": "a",
            "hint": "The pattern repeats: HEART, STAR, HEART, STAR, then..."
          },
          {
            "id": "pa-mc2",
            "prompt": "What is a pattern?",
            "options": [
              {"id": "a", "text": "Something that happens only once"},
              {"id": "b", "text": "Something that repeats over and over"},
              {"id": "c", "text": "Something that is always the same color"}
            ],
            "correctOptionId": "b",
            "hint": "Think about how red-blue-red-blue keeps going!"
          },
          {
            "id": "pa-mc3",
            "prompt": "Which is an ABC pattern?",
            "options": [
              {"id": "a", "text": "Red - Blue - Red - Blue"},
              {"id": "b", "text": "Red - Blue - Green - Red - Blue - Green"},
              {"id": "c", "text": "Red - Red - Blue - Blue"}
            ],
            "correctOptionId": "b",
            "hint": "An ABC pattern has THREE different things that repeat!"
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
-- ART LESSON 7: Same on Both Sides (Symmetry)
-- Module: Lines & Patterns
-- Widgets: multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0007-4000-8000-000000000001',
  '10000001-0502-4000-8000-000000000001',
  3,
  'Same on Both Sides!',
  'Learn about symmetry -- when something looks the same on both sides, like a butterfly!',
  'Chip has a fun trick! Fold a picture in half -- if both sides match, that''s called SYMMETRY! Butterflies have it, your face has it, and even snowflakes have it! Let''s find out what is symmetrical!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['866e3946-0a02-4486-a1a3-1b337238ab55']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sym-1",
            "prompt": "What does SYMMETRY mean?",
            "options": [
              {"id": "a", "text": "Something is very colorful"},
              {"id": "b", "text": "Both sides look the same when you fold it in half"},
              {"id": "c", "text": "Something is very big"}
            ],
            "correctOptionId": "b",
            "hint": "Think about folding a paper in half. Do both sides match?"
          },
          {
            "id": "sym-2",
            "prompt": "Is a butterfly symmetrical?",
            "options": [
              {"id": "a", "text": "Yes! Both wings look the same."},
              {"id": "b", "text": "No, the wings are different."},
              {"id": "c", "text": "Only if it''s blue."}
            ],
            "correctOptionId": "a",
            "hint": "Look at a butterfly''s wings. The left side matches the right side!"
          },
          {
            "id": "sym-3",
            "prompt": "Which of these is symmetrical?",
            "options": [
              {"id": "a", "text": "A heart shape"},
              {"id": "b", "text": "The letter J"},
              {"id": "c", "text": "A cloud"}
            ],
            "correctOptionId": "a",
            "hint": "Fold a heart in half down the middle. Do both sides match?"
          },
          {
            "id": "sym-4",
            "prompt": "If you draw a line down the middle of your face, is it almost symmetrical?",
            "options": [
              {"id": "a", "text": "No, faces are not symmetrical at all"},
              {"id": "b", "text": "Yes! You have one eye, one ear, and half a nose on each side."},
              {"id": "c", "text": "Only grown-ups have symmetrical faces"}
            ],
            "correctOptionId": "b",
            "hint": "Look in a mirror! Is the left side of your face similar to the right?"
          },
          {
            "id": "sym-5",
            "prompt": "Which letter is symmetrical?",
            "options": [
              {"id": "a", "text": "The letter A"},
              {"id": "b", "text": "The letter R"},
              {"id": "c", "text": "The letter G"}
            ],
            "correctOptionId": "a",
            "hint": "Draw a line down the middle of each letter. Which one has matching sides?"
          },
          {
            "id": "sym-6",
            "prompt": "A snowflake is symmetrical. What does that mean?",
            "options": [
              {"id": "a", "text": "It''s very cold"},
              {"id": "b", "text": "It''s white"},
              {"id": "c", "text": "Its parts match on every side"}
            ],
            "correctOptionId": "c",
            "hint": "Snowflakes look the same no matter which way you fold them!"
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
-- ART LESSON 8: Shapes Make Pictures
-- Module: Lines & Patterns
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b1000005-0008-4000-8000-000000000001',
  '10000001-0502-4000-8000-000000000001',
  4,
  'Shapes Make Pictures!',
  'Learn how to combine simple shapes to draw things like houses, robots, and animals!',
  'Here''s a cool art secret: you can draw ANYTHING by putting shapes together! A house is a square with a triangle on top. A robot is rectangles stacked up. Let''s see what shapes make when you put them together!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY[
    'f62fc0f2-6185-4612-87b1-765639c358a9',
    'c879ab2b-decb-4881-9c04-b0f777a5eceb'
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
            "id": "sp-1",
            "prompt": "To draw a simple HOUSE, which shapes do you need?",
            "options": [
              {"id": "a", "text": "A square (walls) + a triangle (roof)"},
              {"id": "b", "text": "Two circles"},
              {"id": "c", "text": "A zigzag line"}
            ],
            "correctOptionId": "a",
            "hint": "Think about it: the bottom part is boxy, and the top part is pointy!"
          },
          {
            "id": "sp-2",
            "prompt": "To draw a SUN, what shape is the main part?",
            "options": [
              {"id": "a", "text": "A square"},
              {"id": "b", "text": "A triangle"},
              {"id": "c", "text": "A circle with lines around it"}
            ],
            "correctOptionId": "c",
            "hint": "The sun is round, with lines sticking out like rays!"
          },
          {
            "id": "sp-3",
            "prompt": "To draw a simple TREE, you could use...",
            "options": [
              {"id": "a", "text": "A rectangle (trunk) + a circle (leaves)"},
              {"id": "b", "text": "Two triangles"},
              {"id": "c", "text": "A wavy line"}
            ],
            "correctOptionId": "a",
            "hint": "A tree has a straight, tall trunk and a round, fluffy top!"
          },
          {
            "id": "sp-4",
            "prompt": "To draw a CAR, what shapes could you use?",
            "options": [
              {"id": "a", "text": "Only triangles"},
              {"id": "b", "text": "A rectangle (body) + circles (wheels)"},
              {"id": "c", "text": "A circle and a star"}
            ],
            "correctOptionId": "b",
            "hint": "The car body is long and boxy, and the wheels are round!"
          },
          {
            "id": "sp-5",
            "prompt": "An ice cream cone uses which two shapes?",
            "options": [
              {"id": "a", "text": "A triangle (cone) + a circle (scoop)"},
              {"id": "b", "text": "Two rectangles"},
              {"id": "c", "text": "A square and a star"}
            ],
            "correctOptionId": "a",
            "hint": "The bottom is pointy, and the ice cream on top is round!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each picture to the shapes that make it!",
        "pairs": [
          {"id": "smp-1", "left": {"id": "smp-1-l", "text": "A house"},        "right": {"id": "smp-1-r", "text": "Square + Triangle"}},
          {"id": "smp-2", "left": {"id": "smp-2-l", "text": "A snowman"},       "right": {"id": "smp-2-r", "text": "Three circles"}},
          {"id": "smp-3", "left": {"id": "smp-3-l", "text": "A lollipop"},      "right": {"id": "smp-3-r", "text": "Circle + Rectangle"}},
          {"id": "smp-4", "left": {"id": "smp-4-l", "text": "A kite"},          "right": {"id": "smp-4-r", "text": "Diamond + Lines"}},
          {"id": "smp-5", "left": {"id": "smp-5-l", "text": "A robot"},         "right": {"id": "smp-5-r", "text": "Rectangles + Squares"}}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
