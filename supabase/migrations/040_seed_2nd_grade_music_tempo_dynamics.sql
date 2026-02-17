-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Music: Tempo, Dynamics & Expression Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Fast or Slow? (Tempo)
--   - Loud and Soft (Dynamics)
--   - Getting Louder, Getting Softer
--   - Musical Feelings
--   - Perform with Expression
--
-- Also seeds the module and 3 skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: matching_pairs, multiple_choice, sequence_order, fill_in_blank
--
-- Subject ID:
--   Music: 87ee4010-8b16-4f55-9627-b1961a87e726
--
-- Module ID:
--   Tempo, Dynamics & Expression: 10000002-0405-4000-8000-000000000001
--
-- Skill IDs:
--   Tempo:                    20000004-0004-4000-8000-000000000001
--   Dynamics:                 20000004-0005-4000-8000-000000000001
--   Performance & Expression: 20000004-0006-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Music subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Music 2nd Grade: Tempo, Dynamics, Performance & Expression
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000004-0004-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'tempo', 'Tempo', 'Identify and demonstrate fast (allegro), medium (andante), and slow (adagio) tempos in music', 'MU:Pr4.2.2a', 4),
  ('20000004-0005-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'dynamics', 'Dynamics', 'Identify and demonstrate dynamics from pianissimo to fortissimo including crescendo and decrescendo', 'MU:Pr4.2.2a', 5),
  ('20000004-0006-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'performance_expression', 'Performance & Expression', 'Combine tempo, dynamics, and musical feeling to perform with expression and communicate emotion', 'MU:Pr6.1.2a', 6)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Music: Tempo, Dynamics & Expression)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0405-4000-8000-000000000001', 2, 30, 'Tempo, Dynamics & Expression', 'Control the speed and volume of music! Learn about fast and slow, loud and soft, and how to play with feeling!', 'music', '87ee4010-8b16-4f55-9627-b1961a87e726')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MUSIC LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Fast or Slow? (Tempo)
-- Module: Tempo, Dynamics & Expression | Skill: Tempo
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0006-4000-8000-000000000001',
  '10000002-0405-4000-8000-000000000001',
  1,
  'Fast or Slow? (Tempo)',
  'Discover tempo -- the speed of music! Learn Italian words for fast, medium, and slow.',
  'Hey music explorer! Chip just noticed something cool -- some songs make you want to dance super fast, and others make you want to sway slowly like a tree in the breeze. The SPEED of music has a special name: TEMPO! And musicians use fancy Italian words to describe it. Ready to learn them?',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each tempo word to its meaning! Can you learn these Italian words?",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "allegro", "text": "Allegro", "emoji": "\ud83c\udfc3"},
            "right": {"id": "fast", "text": "Fast", "emoji": "\u26a1"}
          },
          {
            "id": "p2",
            "left": {"id": "andante", "text": "Andante", "emoji": "\ud83d\udeb6"},
            "right": {"id": "walking", "text": "Walking speed", "emoji": "\ud83d\udc63"}
          },
          {
            "id": "p3",
            "left": {"id": "adagio", "text": "Adagio", "emoji": "\ud83d\udc22"},
            "right": {"id": "slow", "text": "Slow", "emoji": "\ud83c\udf19"}
          },
          {
            "id": "p4",
            "left": {"id": "presto", "text": "Presto", "emoji": "\ud83d\ude80"},
            "right": {"id": "very-fast", "text": "Very fast", "emoji": "\ud83d\udca8"}
          },
          {
            "id": "p5",
            "left": {"id": "moderato", "text": "Moderato", "emoji": "\ud83d\udeb4"},
            "right": {"id": "medium", "text": "Medium speed", "emoji": "\u2696\ufe0f"}
          }
        ],
        "hint": "Presto is the fastest -- like a rocket! Adagio is the slowest -- like a turtle. Allegro is fast, moderato is medium, and andante is a comfortable walk."
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "t-mc-1",
            "prompt": "What does TEMPO mean in music? \ud83c\udfb5",
            "options": [
              {"id": "a", "text": "How loud the music is", "emoji": ""},
              {"id": "b", "text": "How fast or slow the music is", "emoji": "\u2728"},
              {"id": "c", "text": "How high or low the notes are", "emoji": ""},
              {"id": "d", "text": "How many instruments are playing", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Tempo is all about SPEED -- think of it like the music''s speedometer!"
          },
          {
            "id": "t-mc-2",
            "prompt": "Which tempo word means SLOW? \ud83d\udc22",
            "options": [
              {"id": "a", "text": "Allegro", "emoji": ""},
              {"id": "b", "text": "Presto", "emoji": ""},
              {"id": "c", "text": "Adagio", "emoji": "\u2728"},
              {"id": "d", "text": "Moderato", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Think of a slow turtle -- adagio means slow and gentle, like taking your time."
          },
          {
            "id": "t-mc-3",
            "prompt": "You''re listening to a lullaby. The music is calm and slow. What tempo is it? \ud83c\udf1c",
            "options": [
              {"id": "a", "text": "Presto (very fast)", "emoji": ""},
              {"id": "b", "text": "Allegro (fast)", "emoji": ""},
              {"id": "c", "text": "Moderato (medium)", "emoji": ""},
              {"id": "d", "text": "Adagio (slow)", "emoji": "\u2728"}
            ],
            "correctOptionId": "d",
            "hint": "Lullabies are slow and gentle to help you fall asleep. That''s adagio!"
          },
          {
            "id": "t-mc-4",
            "prompt": "Which tempo is the FASTEST of all? \ud83d\ude80",
            "options": [
              {"id": "a", "text": "Andante", "emoji": ""},
              {"id": "b", "text": "Moderato", "emoji": ""},
              {"id": "c", "text": "Allegro", "emoji": ""},
              {"id": "d", "text": "Presto", "emoji": "\u2728"}
            ],
            "correctOptionId": "d",
            "hint": "Presto is like a magic word -- things happen super fast! It is the fastest tempo."
          },
          {
            "id": "t-mc-5",
            "prompt": "Andante means music moves at what kind of speed? \ud83d\udeb6",
            "options": [
              {"id": "a", "text": "Running speed", "emoji": ""},
              {"id": "b", "text": "Walking speed", "emoji": "\u2728"},
              {"id": "c", "text": "Sleeping speed", "emoji": ""},
              {"id": "d", "text": "Racing speed", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Andante comes from the Italian word for walking! It is a nice, comfortable pace."
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
-- LESSON 2: Loud and Soft (Dynamics)
-- Module: Tempo, Dynamics & Expression | Skill: Dynamics
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0007-4000-8000-000000000001',
  '10000002-0405-4000-8000-000000000001',
  2,
  'Loud and Soft (Dynamics)',
  'Learn the musical words for loud and soft! Piano means soft and forte means loud.',
  'Psst! Chip wants to tell you a secret... *whisper whisper*... SURPRISE! Did that make you jump? Music does the same thing -- it can whisper softly or SHOUT with excitement! Musicians use special Italian words called DYNAMICS to say how loud or soft to play. Let''s learn them!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "d-mc-1",
            "prompt": "What does PIANO (p) mean in music dynamics? \ud83c\udfb9",
            "options": [
              {"id": "a", "text": "The keyboard instrument", "emoji": ""},
              {"id": "b", "text": "Soft", "emoji": "\u2728"},
              {"id": "c", "text": "Loud", "emoji": ""},
              {"id": "d", "text": "Fast", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "In music dynamics, piano means SOFT! The piano instrument was named because it could play soft AND loud."
          },
          {
            "id": "d-mc-2",
            "prompt": "What does FORTE (f) mean? \ud83d\udce2",
            "options": [
              {"id": "a", "text": "Soft", "emoji": ""},
              {"id": "b", "text": "Slow", "emoji": ""},
              {"id": "c", "text": "Loud and strong", "emoji": "\u2728"},
              {"id": "d", "text": "Fast", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Forte means strong and loud! Think of a fort -- big, strong, and powerful!"
          },
          {
            "id": "d-mc-3",
            "prompt": "A singer whispers the words of a song very gently. Which dynamic marking fits? \ud83e\udd2b",
            "options": [
              {"id": "a", "text": "ff (fortissimo)", "emoji": ""},
              {"id": "b", "text": "f (forte)", "emoji": ""},
              {"id": "c", "text": "p (piano)", "emoji": "\u2728"},
              {"id": "d", "text": "mf (mezzo forte)", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Whispering is very soft -- and piano (p) means soft!"
          },
          {
            "id": "d-mc-4",
            "prompt": "What does the ''mezzo'' part mean in mezzo forte (mf) or mezzo piano (mp)? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Very", "emoji": ""},
              {"id": "b", "text": "Medium / Moderately", "emoji": "\u2728"},
              {"id": "c", "text": "Super", "emoji": ""},
              {"id": "d", "text": "Extremely", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Mezzo is Italian for medium or half. So mezzo forte = medium loud!"
          },
          {
            "id": "d-mc-5",
            "prompt": "Which dynamic marking means VERY VERY loud? \ud83d\udca5",
            "options": [
              {"id": "a", "text": "p (piano)", "emoji": ""},
              {"id": "b", "text": "f (forte)", "emoji": ""},
              {"id": "c", "text": "mf (mezzo forte)", "emoji": ""},
              {"id": "d", "text": "ff (fortissimo)", "emoji": "\u2728"}
            ],
            "correctOptionId": "d",
            "hint": "Fortissimo has two f''s -- double the forte means EXTRA loud, like thunder!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each dynamics word to how loud it is!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "pp", "text": "pp (pianissimo)", "emoji": "\ud83e\udee3"},
            "right": {"id": "very-soft", "text": "Very soft", "emoji": "\ud83d\udc2d"}
          },
          {
            "id": "p2",
            "left": {"id": "piano", "text": "p (piano)", "emoji": "\ud83e\udd2b"},
            "right": {"id": "soft", "text": "Soft", "emoji": "\ud83c\udf43"}
          },
          {
            "id": "p3",
            "left": {"id": "mf", "text": "mf (mezzo forte)", "emoji": "\ud83d\udde3\ufe0f"},
            "right": {"id": "medium-loud", "text": "Medium loud", "emoji": "\ud83d\udcac"}
          },
          {
            "id": "p4",
            "left": {"id": "forte", "text": "f (forte)", "emoji": "\ud83d\udce2"},
            "right": {"id": "loud", "text": "Loud", "emoji": "\ud83d\udd0a"}
          },
          {
            "id": "p5",
            "left": {"id": "ff", "text": "ff (fortissimo)", "emoji": "\ud83d\udca5"},
            "right": {"id": "very-loud", "text": "Very loud", "emoji": "\u26a1"}
          }
        ],
        "hint": "Start with the softest! pp is the tiniest whisper, and ff is the biggest boom. Piano means soft, forte means loud."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Getting Louder, Getting Softer
-- Module: Tempo, Dynamics & Expression | Skill: Dynamics
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0008-4000-8000-000000000001',
  '10000002-0405-4000-8000-000000000001',
  3,
  'Getting Louder, Getting Softer',
  'Ride the dynamics roller coaster! Learn about crescendo and decrescendo.',
  'Buckle up, music friend! Chip is taking you on a dynamics ROLLER COASTER! Sometimes music starts super quiet and gets louder and louder and LOUDER -- that''s called a CRESCENDO! And sometimes it starts loud and gets softer and softer and softer -- that''s a DECRESCENDO! It''s like the music is breathing in and out!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Put these dynamics in order from SOFTEST to LOUDEST! \ud83d\udd09\u27a1\ufe0f\ud83d\udd0a",
            "items": [
              {"id": "i-pp", "text": "pp (pianissimo) -- very very soft"},
              {"id": "i-p", "text": "p (piano) -- soft"},
              {"id": "i-mf", "text": "mf (mezzo forte) -- medium loud"},
              {"id": "i-f", "text": "f (forte) -- loud"},
              {"id": "i-ff", "text": "ff (fortissimo) -- very very loud"}
            ],
            "correctOrder": ["i-pp", "i-p", "i-mf", "i-f", "i-ff"],
            "hint": "Start with the tiniest whisper (pp) and build up to the biggest boom (ff)!"
          },
          {
            "id": "seq2",
            "prompt": "A crescendo goes from soft to loud! Put these in CRESCENDO order! \ud83d\udcc8",
            "items": [
              {"id": "i-mouse", "text": "Tiptoeing mouse"},
              {"id": "i-cat", "text": "Cat purring"},
              {"id": "i-dog", "text": "Dog barking"},
              {"id": "i-lion", "text": "Lion roaring"}
            ],
            "correctOrder": ["i-mouse", "i-cat", "i-dog", "i-lion"],
            "hint": "Crescendo means getting louder! Start with the quietest animal and end with the loudest!"
          },
          {
            "id": "seq3",
            "prompt": "A decrescendo goes from loud to soft! Put these in DECRESCENDO order! \ud83d\udcc9",
            "items": [
              {"id": "i-thunder", "text": "Thunder rumbling"},
              {"id": "i-rain", "text": "Rain pattering"},
              {"id": "i-drip", "text": "Water dripping"},
              {"id": "i-silence", "text": "Quiet stillness"}
            ],
            "correctOrder": ["i-thunder", "i-rain", "i-drip", "i-silence"],
            "hint": "Decrescendo means getting softer! Start with the LOUDEST sound and end with the quietest!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "c-mc-1",
            "prompt": "What is a CRESCENDO? \ud83d\udcc8",
            "options": [
              {"id": "a", "text": "Music getting faster", "emoji": ""},
              {"id": "b", "text": "Music getting louder", "emoji": "\u2728"},
              {"id": "c", "text": "Music getting softer", "emoji": ""},
              {"id": "d", "text": "Music getting slower", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Crescendo means growing -- the sound GROWS louder and louder!"
          },
          {
            "id": "c-mc-2",
            "prompt": "What is a DECRESCENDO? \ud83d\udcc9",
            "options": [
              {"id": "a", "text": "Music getting louder", "emoji": ""},
              {"id": "b", "text": "Music getting faster", "emoji": ""},
              {"id": "c", "text": "Music getting softer", "emoji": "\u2728"},
              {"id": "d", "text": "Music stopping completely", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Decrescendo is the opposite of crescendo -- the sound shrinks and gets softer!"
          },
          {
            "id": "c-mc-3",
            "prompt": "The music starts at pp and ends at ff. What happened? \ud83c\udfb6",
            "options": [
              {"id": "a", "text": "A decrescendo", "emoji": ""},
              {"id": "b", "text": "A crescendo", "emoji": "\u2728"},
              {"id": "c", "text": "The tempo changed", "emoji": ""},
              {"id": "d", "text": "Nothing changed", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "pp is very soft and ff is very loud. Going from soft to loud is a crescendo!"
          },
          {
            "id": "c-mc-4",
            "prompt": "What does the crescendo symbol look like? \ud83d\udc40",
            "options": [
              {"id": "a", "text": "A long line that opens up like this: <", "emoji": "\u2728"},
              {"id": "b", "text": "A circle", "emoji": ""},
              {"id": "c", "text": "A square", "emoji": ""},
              {"id": "d", "text": "A star", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The crescendo symbol starts small and opens wide -- just like the sound getting bigger!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Musical Feelings
-- Module: Tempo, Dynamics & Expression | Skills: Tempo + Dynamics + Expression
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0009-4000-8000-000000000001',
  '10000002-0405-4000-8000-000000000001',
  4,
  'Musical Feelings',
  'Discover how tempo and dynamics work together to create different moods and emotions in music!',
  'Chip just had a big discovery! When you combine tempo (speed) and dynamics (volume) together, music can make you feel SO many different things! Fast and loud music feels exciting and powerful. Slow and soft music feels calm and dreamy. Let''s explore how music makes us FEEL!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0004-4000-8000-000000000001', '20000004-0005-4000-8000-000000000001', '20000004-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each tempo + dynamics combo to the mood it creates!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "fast-loud", "text": "Fast + Loud", "emoji": "\ud83c\udfc3\ud83d\udca5"},
            "right": {"id": "exciting", "text": "Exciting & Powerful", "emoji": "\ud83c\udf89"}
          },
          {
            "id": "p2",
            "left": {"id": "slow-soft", "text": "Slow + Soft", "emoji": "\ud83d\udc22\ud83e\udd2b"},
            "right": {"id": "calm", "text": "Calm & Peaceful", "emoji": "\ud83c\udf19"}
          },
          {
            "id": "p3",
            "left": {"id": "fast-soft", "text": "Fast + Soft", "emoji": "\ud83c\udfc3\ud83e\udd2b"},
            "right": {"id": "sneaky", "text": "Sneaky & Mysterious", "emoji": "\ud83d\udd75\ufe0f"}
          },
          {
            "id": "p4",
            "left": {"id": "slow-loud", "text": "Slow + Loud", "emoji": "\ud83d\udc22\ud83d\udca5"},
            "right": {"id": "dramatic", "text": "Dramatic & Grand", "emoji": "\ud83c\udff0"}
          },
          {
            "id": "p5",
            "left": {"id": "medium-medium", "text": "Medium + Medium", "emoji": "\ud83d\udeb4\ud83d\udcac"},
            "right": {"id": "happy", "text": "Happy & Comfortable", "emoji": "\ud83d\ude0a"}
          }
        ],
        "hint": "Think about how each combo would FEEL! Fast + loud is like a superhero arriving. Slow + soft is like a bedtime story. Fast + soft is like tiptoeing quickly!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "f-mc-1",
            "prompt": "A scary movie scene has music that is slow and very loud. How does it make you feel? \ud83c\udfac",
            "options": [
              {"id": "a", "text": "Sleepy and relaxed", "emoji": ""},
              {"id": "b", "text": "Dramatic and intense", "emoji": "\u2728"},
              {"id": "c", "text": "Silly and giggly", "emoji": ""},
              {"id": "d", "text": "Bored", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Slow + loud makes music feel big, serious, and dramatic -- perfect for intense movie moments!"
          },
          {
            "id": "f-mc-2",
            "prompt": "You want to write a lullaby to help a baby sleep. What tempo and dynamics should you use? \ud83d\udc76",
            "options": [
              {"id": "a", "text": "Presto and fortissimo (very fast, very loud)", "emoji": ""},
              {"id": "b", "text": "Allegro and forte (fast and loud)", "emoji": ""},
              {"id": "c", "text": "Adagio and piano (slow and soft)", "emoji": "\u2728"},
              {"id": "d", "text": "Presto and piano (very fast and soft)", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "To help a baby sleep, you need calm, gentle music. That means slow (adagio) and soft (piano)!"
          },
          {
            "id": "f-mc-3",
            "prompt": "A superhero theme song is usually what tempo and dynamic? \ud83e\uddb8",
            "options": [
              {"id": "a", "text": "Adagio and pianissimo (slow, very soft)", "emoji": ""},
              {"id": "b", "text": "Allegro and forte (fast and loud)", "emoji": "\u2728"},
              {"id": "c", "text": "Andante and piano (walking speed, soft)", "emoji": ""},
              {"id": "d", "text": "Adagio and forte (slow and loud)", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Superheroes are exciting and powerful! They need fast, loud music to match their energy!"
          },
          {
            "id": "f-mc-4",
            "prompt": "A spy is sneaking through a dark building. The music is fast but very quiet. Which mood does this create? \ud83d\udd75\ufe0f",
            "options": [
              {"id": "a", "text": "Relaxing", "emoji": ""},
              {"id": "b", "text": "Boring", "emoji": ""},
              {"id": "c", "text": "Suspenseful and sneaky", "emoji": "\u2728"},
              {"id": "d", "text": "Sad", "emoji": ""}
            ],
            "correctOptionId": "c",
            "hint": "Fast + soft = sneaky! The quick pace builds tension, but the quiet volume keeps things mysterious."
          },
          {
            "id": "f-mc-5",
            "prompt": "Can the SAME song change moods by changing tempo and dynamics? \ud83c\udfb5",
            "options": [
              {"id": "a", "text": "No, a song always stays the same mood", "emoji": ""},
              {"id": "b", "text": "Yes! Changing speed and volume changes the feeling", "emoji": "\u2728"},
              {"id": "c", "text": "Only if you change the notes", "emoji": ""},
              {"id": "d", "text": "Only if you add more instruments", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Absolutely! The same melody played slow and soft feels totally different from fast and loud!"
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
-- LESSON 5: Perform with Expression
-- Module: Tempo, Dynamics & Expression | Skill: Performance & Expression
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000a-4000-8000-000000000001',
  '10000002-0405-4000-8000-000000000001',
  5,
  'Perform with Expression',
  'Put it all together! Learn to read performance instructions and conduct an orchestra with expression.',
  'Chip is SO proud of you! You''ve learned about tempo AND dynamics -- now it''s time to put them TOGETHER and perform with EXPRESSION! Expression means playing music with FEELING. A great musician doesn''t just play the right notes -- they make the music come ALIVE! Today YOU are the conductor!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "You are conducting a song! Put these performance instructions in the right order for a dramatic ending! \ud83c\udfbc",
            "items": [
              {"id": "i-start", "text": "Start at mp (medium soft)"},
              {"id": "i-cresc", "text": "Crescendo -- get louder!"},
              {"id": "i-forte", "text": "Reach forte (loud)"},
              {"id": "i-ritard", "text": "Slow down gradually"},
              {"id": "i-ff-end", "text": "Final note at ff (very loud)!"}
            ],
            "correctOrder": ["i-start", "i-cresc", "i-forte", "i-ritard", "i-ff-end"],
            "hint": "A dramatic ending builds up! Start medium, get louder, reach forte, slow down for drama, then end with a big fortissimo finish!"
          },
          {
            "id": "seq2",
            "prompt": "Put these instructions in order for a gentle lullaby that fades away! \ud83c\udf1c",
            "items": [
              {"id": "i-mp-start", "text": "Begin at mp (medium soft), andante (walking speed)"},
              {"id": "i-piano", "text": "Get softer to p (piano)"},
              {"id": "i-slower", "text": "Slow down to adagio (slow)"},
              {"id": "i-pp-end", "text": "Fade to pp (very soft) and stop"}
            ],
            "correctOrder": ["i-mp-start", "i-piano", "i-slower", "i-pp-end"],
            "hint": "A lullaby should gently fade away! Start medium soft, get softer, slow down, then fade to almost nothing."
          },
          {
            "id": "seq3",
            "prompt": "Order these steps for a march that gets the crowd pumped up! \ud83e\udee1\ud83c\udfba",
            "items": [
              {"id": "i-mf-march", "text": "Start at mf (medium loud), moderato (medium speed)"},
              {"id": "i-faster", "text": "Speed up to allegro (fast)"},
              {"id": "i-louder", "text": "Crescendo to forte (loud)"},
              {"id": "i-big-finish", "text": "ff (very loud) for the grand finale!"}
            ],
            "correctOrder": ["i-mf-march", "i-faster", "i-louder", "i-big-finish"],
            "hint": "A march builds energy! Start at a comfortable level, get faster, get louder, then end with a grand fortissimo finale!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "The Italian word for LOUD in music is ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "forte",
                "acceptableAnswers": ["forte", "Forte"]
              }
            ],
            "hint": "It starts with F and means strong!"
          },
          {
            "id": "fb2",
            "prompt": "The Italian word for SLOW in music is ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "adagio",
                "acceptableAnswers": ["adagio", "Adagio"]
              }
            ],
            "hint": "Think of the tempo word that sounds like a gentle sigh... a-da-gi-o."
          },
          {
            "id": "fb3",
            "prompt": "When music gets gradually LOUDER, it is called a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "crescendo",
                "acceptableAnswers": ["crescendo", "Crescendo"]
              }
            ],
            "hint": "It starts with C and means growing!"
          },
          {
            "id": "fb4",
            "prompt": "When music gets gradually SOFTER, it is called a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "decrescendo",
                "acceptableAnswers": ["decrescendo", "Decrescendo", "diminuendo", "Diminuendo"]
              }
            ],
            "hint": "It is the opposite of crescendo! De- means to take away, so de-crescendo means getting less loud."
          },
          {
            "id": "fb5",
            "prompt": "Playing music with feeling and emotion is called playing with ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "expression",
                "acceptableAnswers": ["expression", "Expression"]
              }
            ],
            "hint": "When you SHOW your feelings, you ___ yourself. The musical version of that word is what we are looking for!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
