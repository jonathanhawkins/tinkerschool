-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Music & Art Interactive Lessons
-- =============================================================================
-- 10 browser-only interactive lessons: 5 Music + 5 Art
-- Target audience: 2nd graders (ages 7-8)
-- All lessons use interactive widget types (no device required)
--
-- Subject IDs:
--   Music: 87ee4010-8b16-4f55-9627-b1961a87e726
--   Art:   5a848c8e-f476-4cd5-8d04-c67492961bc8
--
-- Module IDs:
--   Instruments & Notation:  10000002-0404-4000-8000-000000000001
--   Color Theory & Design:   10000002-0504-4000-8000-000000000001
--
-- Music Skill IDs:
--   Instrument families: 20000004-0001-4000-8000-000000000001
--   Music notation:      20000004-0002-4000-8000-000000000001
--   Rests/silence:       20000004-0003-4000-8000-000000000001
--
-- Art Skill IDs:
--   Primary/secondary:   20000005-0001-4000-8000-000000000001
--   Elements of design:  20000005-0002-4000-8000-000000000001
--   Famous artists:      20000005-0003-4000-8000-000000000001
-- =============================================================================


-- =========================================================================
-- MUSIC LESSON 1: Meet the Instrument Families!
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0001-4000-8000-000000000001',
  '10000002-0404-4000-8000-000000000001',
  1,
  'Meet the Instrument Families!',
  'Discover the four families of instruments and which instruments belong to each one.',
  'Hey there, music explorer! Chip here! Did you know that instruments live in families, just like people do? There are FOUR big instrument families, and each one makes sound in a different way. Let''s meet them all!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about the instrument families!",
        "cards": [
          {
            "id": "fc-strings",
            "front": "Strings Family",
            "back": "Strings make sound when you pluck, strum, or use a bow! Examples: violin, guitar, cello, harp"
          },
          {
            "id": "fc-woodwinds",
            "front": "Woodwinds Family",
            "back": "Woodwinds make sound when you blow air through them! Examples: flute, clarinet, saxophone, oboe"
          },
          {
            "id": "fc-brass",
            "front": "Brass Family",
            "back": "Brass instruments are shiny metal and you buzz your lips to play them! Examples: trumpet, trombone, tuba, French horn"
          },
          {
            "id": "fc-percussion",
            "front": "Percussion Family",
            "back": "Percussion instruments make sound when you hit, shake, or scrape them! Examples: drums, xylophone, tambourine, maracas"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each instrument to its family!",
        "pairs": [
          { "id": "mp1", "left": "Violin", "right": "Strings" },
          { "id": "mp2", "left": "Trumpet", "right": "Brass" },
          { "id": "mp3", "left": "Flute", "right": "Woodwinds" },
          { "id": "mp4", "left": "Drums", "right": "Percussion" },
          { "id": "mp5", "left": "Guitar", "right": "Strings" },
          { "id": "mp6", "left": "Tuba", "right": "Brass" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which instrument family makes sound by blowing air?",
            "options": [
              { "id": "a", "text": "Strings" },
              { "id": "b", "text": "Woodwinds" },
              { "id": "c", "text": "Percussion" },
              { "id": "d", "text": "Brass" }
            ],
            "correctOptionId": "b",
            "hint": "Think about instruments like the flute and clarinet -- what do you do to play them?"
          },
          {
            "id": "mc2",
            "prompt": "A tambourine belongs to which instrument family?",
            "options": [
              { "id": "a", "text": "Strings" },
              { "id": "b", "text": "Brass" },
              { "id": "c", "text": "Percussion" },
              { "id": "d", "text": "Woodwinds" }
            ],
            "correctOptionId": "c",
            "hint": "You shake a tambourine! Which family includes instruments you hit or shake?"
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
-- MUSIC LESSON 2: Musical Notes
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0002-4000-8000-000000000001',
  '10000002-0404-4000-8000-000000000001',
  2,
  'Musical Notes',
  'Learn about the different types of notes and how many beats each one gets.',
  'Time to learn about musical notes! Notes tell musicians how LONG to play a sound. Some notes are long and slow, and some are short and quick. Let''s discover them together!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip to learn how many beats each note gets!",
        "cards": [
          {
            "id": "fc-whole",
            "front": "Whole Note",
            "back": "A whole note lasts 4 beats. It looks like an empty circle. Hold the sound for a long time: 1-2-3-4!"
          },
          {
            "id": "fc-half",
            "front": "Half Note",
            "back": "A half note lasts 2 beats. It looks like an empty circle with a stick (stem). Hold for: 1-2!"
          },
          {
            "id": "fc-quarter",
            "front": "Quarter Note",
            "back": "A quarter note lasts 1 beat. It looks like a filled-in circle with a stem. One quick beat: 1!"
          },
          {
            "id": "fc-eighth",
            "front": "Eighth Note",
            "back": "An eighth note lasts half a beat. It looks like a quarter note with a flag on top. Super quick!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "How many beats does a whole note get?",
            "options": [
              { "id": "a", "text": "1 beat" },
              { "id": "b", "text": "2 beats" },
              { "id": "c", "text": "3 beats" },
              { "id": "d", "text": "4 beats" }
            ],
            "correctOptionId": "d",
            "hint": "A WHOLE note takes up a WHOLE measure -- that''s 4 beats!"
          },
          {
            "id": "mc2",
            "prompt": "How many beats does a half note get?",
            "options": [
              { "id": "a", "text": "4 beats" },
              { "id": "b", "text": "2 beats" },
              { "id": "c", "text": "1 beat" },
              { "id": "d", "text": "Half a beat" }
            ],
            "correctOptionId": "b",
            "hint": "It''s called a HALF note because it''s half of a whole note. Half of 4 is..."
          },
          {
            "id": "mc3",
            "prompt": "Which note is the shortest?",
            "options": [
              { "id": "a", "text": "Whole note" },
              { "id": "b", "text": "Half note" },
              { "id": "c", "text": "Quarter note" },
              { "id": "d", "text": "Eighth note" }
            ],
            "correctOptionId": "d",
            "hint": "The eighth note has a little flag and it goes by super fast!"
          },
          {
            "id": "mc4",
            "prompt": "How many quarter notes fit in the same time as one whole note?",
            "options": [
              { "id": "a", "text": "2" },
              { "id": "b", "text": "3" },
              { "id": "c", "text": "4" },
              { "id": "d", "text": "8" }
            ],
            "correctOptionId": "c",
            "hint": "A whole note = 4 beats. A quarter note = 1 beat. So 4 quarter notes = 1 whole note!"
          },
          {
            "id": "mc5",
            "prompt": "Which note looks like an empty circle with a stem?",
            "options": [
              { "id": "a", "text": "Whole note" },
              { "id": "b", "text": "Half note" },
              { "id": "c", "text": "Quarter note" },
              { "id": "d", "text": "Eighth note" }
            ],
            "correctOptionId": "b",
            "hint": "The whole note has no stem. The half note is the one with an open circle AND a stem!"
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
-- MUSIC LESSON 3: Rests and Silence
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0003-4000-8000-000000000001',
  '10000002-0404-4000-8000-000000000001',
  3,
  'Rests and Silence',
  'Learn about rests -- the silent moments in music that are just as important as the notes!',
  'Shh! Chip has a secret to tell you... silence is part of music too! Rests are like invisible notes -- they tell you when to be quiet. Without rests, music would be one big never-ending sound!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Learn about the different types of rests!",
        "cards": [
          {
            "id": "fc-whole-rest",
            "front": "Whole Rest",
            "back": "A whole rest means 4 beats of silence. It looks like a little hat hanging from a line. Shhh for 1-2-3-4!"
          },
          {
            "id": "fc-half-rest",
            "front": "Half Rest",
            "back": "A half rest means 2 beats of silence. It looks like a little hat sitting ON a line. Quiet for 1-2!"
          },
          {
            "id": "fc-quarter-rest",
            "front": "Quarter Rest",
            "back": "A quarter rest means 1 beat of silence. It looks like a zigzag squiggle. Quick pause!"
          },
          {
            "id": "fc-eighth-rest",
            "front": "Eighth Rest",
            "back": "An eighth rest means half a beat of silence. It looks like the number 7. A tiny pause!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each rest to how many beats of silence it gets!",
        "pairs": [
          { "id": "mp1", "left": "Whole Rest", "right": "4 beats of silence" },
          { "id": "mp2", "left": "Half Rest", "right": "2 beats of silence" },
          { "id": "mp3", "left": "Quarter Rest", "right": "1 beat of silence" },
          { "id": "mp4", "left": "Eighth Rest", "right": "Half a beat of silence" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What does a rest in music tell you to do?",
            "options": [
              { "id": "a", "text": "Play louder" },
              { "id": "b", "text": "Be silent" },
              { "id": "c", "text": "Play faster" },
              { "id": "d", "text": "Clap your hands" }
            ],
            "correctOptionId": "b",
            "hint": "When you see a rest, you take a break from making sound!"
          },
          {
            "id": "mc2",
            "prompt": "Which rest gives you the longest silence?",
            "options": [
              { "id": "a", "text": "Eighth rest" },
              { "id": "b", "text": "Quarter rest" },
              { "id": "c", "text": "Half rest" },
              { "id": "d", "text": "Whole rest" }
            ],
            "correctOptionId": "d",
            "hint": "Just like notes, the WHOLE rest is the longest -- 4 beats of quiet!"
          },
          {
            "id": "mc3",
            "prompt": "Why are rests important in music?",
            "options": [
              { "id": "a", "text": "They make music boring" },
              { "id": "b", "text": "They give music space to breathe and create rhythm" },
              { "id": "c", "text": "They are mistakes" },
              { "id": "d", "text": "They mean the music is over" }
            ],
            "correctOptionId": "b",
            "hint": "Imagine talking without ever pausing -- rests give music breathing room!"
          },
          {
            "id": "mc4",
            "prompt": "How many beats of silence does a quarter rest get?",
            "options": [
              { "id": "a", "text": "4 beats" },
              { "id": "b", "text": "2 beats" },
              { "id": "c", "text": "1 beat" },
              { "id": "d", "text": "Half a beat" }
            ],
            "correctOptionId": "c",
            "hint": "A quarter rest matches a quarter note -- just 1 beat!"
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
-- MUSIC LESSON 4: Loud and Soft (Dynamics)
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0004-4000-8000-000000000001',
  '10000002-0404-4000-8000-000000000001',
  4,
  'Loud and Soft (Dynamics)',
  'Discover dynamics -- the musical words for loud and soft! Learn to order sounds from a whisper to a roar.',
  'Have you ever whispered a secret? Or cheered really loud at a game? Music does that too! Musicians use special Italian words to say how loud or soft to play. Let''s learn these cool words!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip to learn the dynamics from softest to loudest!",
        "cards": [
          {
            "id": "fc-pp",
            "front": "pp (pianissimo)",
            "back": "Very very soft! Like a tiny mouse tiptoeing. Pianissimo means \"very soft\" in Italian."
          },
          {
            "id": "fc-p",
            "front": "p (piano)",
            "back": "Soft and gentle, like a whisper. Piano means \"soft\" in Italian. (Yes, the instrument is named after this!)"
          },
          {
            "id": "fc-mp",
            "front": "mp (mezzo piano)",
            "back": "Medium soft -- like your normal talking voice but a little quieter. Mezzo means \"medium.\""
          },
          {
            "id": "fc-mf",
            "front": "mf (mezzo forte)",
            "back": "Medium loud -- like your regular talking voice. This is the most common dynamic!"
          },
          {
            "id": "fc-f",
            "front": "f (forte)",
            "back": "Loud and strong! Like cheering for your favorite team. Forte means \"strong\" in Italian."
          },
          {
            "id": "fc-ff",
            "front": "ff (fortissimo)",
            "back": "Very very loud! Like thunder rumbling. Fortissimo means \"very strong\" in Italian."
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Put these dynamics in order from SOFTEST to LOUDEST!",
            "items": [
              { "id": "i-pp", "text": "pp (pianissimo)" },
              { "id": "i-p", "text": "p (piano)" },
              { "id": "i-mp", "text": "mp (mezzo piano)" },
              { "id": "i-mf", "text": "mf (mezzo forte)" },
              { "id": "i-f", "text": "f (forte)" },
              { "id": "i-ff", "text": "ff (fortissimo)" }
            ],
            "correctOrder": ["i-pp", "i-p", "i-mp", "i-mf", "i-f", "i-ff"],
            "hint": "Start with the softest (pp = very very soft) and end with the loudest (ff = very very loud)!"
          },
          {
            "id": "seq2",
            "prompt": "Put these sounds in order from SOFTEST to LOUDEST!",
            "items": [
              { "id": "i-whisper", "text": "Whispering a secret" },
              { "id": "i-talk", "text": "Talking to a friend" },
              { "id": "i-sing", "text": "Singing a song" },
              { "id": "i-cheer", "text": "Cheering at a game" }
            ],
            "correctOrder": ["i-whisper", "i-talk", "i-sing", "i-cheer"],
            "hint": "Think about how loud each one is -- start with the quietest!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What does ''forte'' mean in music?",
            "options": [
              { "id": "a", "text": "Soft" },
              { "id": "b", "text": "Fast" },
              { "id": "c", "text": "Loud/Strong" },
              { "id": "d", "text": "Slow" }
            ],
            "correctOptionId": "c",
            "hint": "Forte comes from Italian. Think of a fort -- big and strong!"
          },
          {
            "id": "mc2",
            "prompt": "What does ''piano'' mean as a dynamic marking?",
            "options": [
              { "id": "a", "text": "The keyboard instrument" },
              { "id": "b", "text": "Soft" },
              { "id": "c", "text": "Loud" },
              { "id": "d", "text": "Medium" }
            ],
            "correctOptionId": "b",
            "hint": "The piano instrument was actually named because it could play soft AND loud!"
          },
          {
            "id": "mc3",
            "prompt": "Which dynamic is louder: mf or mp?",
            "options": [
              { "id": "a", "text": "mp (mezzo piano)" },
              { "id": "b", "text": "They are the same" },
              { "id": "c", "text": "mf (mezzo forte)" },
              { "id": "d", "text": "Neither -- they are both silent" }
            ],
            "correctOptionId": "c",
            "hint": "Mezzo forte has ''forte'' (loud) in it, so it''s the louder one!"
          },
          {
            "id": "mc4",
            "prompt": "What language do most musical terms come from?",
            "options": [
              { "id": "a", "text": "Spanish" },
              { "id": "b", "text": "French" },
              { "id": "c", "text": "Italian" },
              { "id": "d", "text": "German" }
            ],
            "correctOptionId": "c",
            "hint": "Pianissimo, forte, fortissimo -- these all come from the country shaped like a boot!"
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
-- MUSIC LESSON 5: Musical Patterns
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0005-4000-8000-000000000001',
  '10000002-0404-4000-8000-000000000001',
  5,
  'Musical Patterns',
  'Find and complete rhythm patterns! Music is full of repeating patterns, just like math.',
  'Chip loves patterns! Clap-clap-snap, clap-clap-snap -- did you hear the pattern? Music is made of patterns too! Rhythms repeat, melodies repeat, and finding patterns is the secret to being a great musician!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0002-4000-8000-000000000001']::uuid[],
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
            "prompt": "Put this rhythm pattern in the right order: Quarter, Quarter, Half!",
            "items": [
              { "id": "i1", "text": "Quarter Note (1 beat)" },
              { "id": "i2", "text": "Quarter Note (1 beat)" },
              { "id": "i3", "text": "Half Note (2 beats)" }
            ],
            "correctOrder": ["i1", "i2", "i3"],
            "hint": "This pattern goes: short, short, long! Two quick beats then one held beat."
          },
          {
            "id": "seq2",
            "prompt": "Arrange these to make 4 beats: Eighth, Eighth, Quarter, Half",
            "items": [
              { "id": "i1", "text": "Eighth Note (half beat)" },
              { "id": "i2", "text": "Eighth Note (half beat)" },
              { "id": "i3", "text": "Quarter Note (1 beat)" },
              { "id": "i4", "text": "Half Note (2 beats)" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4"],
            "hint": "Go from shortest to longest! Half + half + 1 + 2 = 4 beats total."
          },
          {
            "id": "seq3",
            "prompt": "Order these note types from SHORTEST to LONGEST!",
            "items": [
              { "id": "i-eighth", "text": "Eighth Note" },
              { "id": "i-quarter", "text": "Quarter Note" },
              { "id": "i-half", "text": "Half Note" },
              { "id": "i-whole", "text": "Whole Note" }
            ],
            "correctOrder": ["i-eighth", "i-quarter", "i-half", "i-whole"],
            "hint": "Eighth is the quickest, then quarter, then half, then whole is the longest!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "A whole note gets ___ beats.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "The whole note fills up a whole measure in 4/4 time!"
          },
          {
            "id": "fb2",
            "prompt": "Two half notes equal ___ whole note(s).",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "Each half note = 2 beats. Two of them = 2 + 2 = 4 beats = 1 whole note!"
          },
          {
            "id": "fb3",
            "prompt": "A quarter note + a quarter note + a ___ note = 4 beats.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "half",
                "acceptableAnswers": ["half", "Half"]
              }
            ],
            "hint": "1 beat + 1 beat + ? = 4 beats. You need 2 more beats. Which note lasts 2 beats?"
          },
          {
            "id": "fb4",
            "prompt": "Four ___ notes fit in the same time as one whole note.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "quarter",
                "acceptableAnswers": ["quarter", "Quarter"]
              }
            ],
            "hint": "A whole note = 4 beats. What note equals 1 beat each?"
          },
          {
            "id": "fb5",
            "prompt": "The word ''forte'' means ___ in music.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "loud",
                "acceptableAnswers": ["loud", "Loud", "strong", "Strong"]
              }
            ],
            "hint": "Remember from the dynamics lesson? Forte means loud or strong!"
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
-- ART LESSON 1: Primary Colors
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0001-4000-8000-000000000001',
  '10000002-0504-4000-8000-000000000001',
  1,
  'Primary Colors',
  'Meet the three primary colors -- red, blue, and yellow! These special colors can make ALL other colors.',
  'Welcome to art class! Chip is SO excited! Did you know there are three SUPER special colors that can make every other color in the rainbow? They''re called primary colors, and they''re like the superheroes of the color world!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which of these is NOT a primary color?",
            "options": [
              { "id": "a", "text": "Red" },
              { "id": "b", "text": "Green" },
              { "id": "c", "text": "Blue" },
              { "id": "d", "text": "Yellow" }
            ],
            "correctOptionId": "b",
            "hint": "The three primary colors are red, blue, and yellow. Green is made by mixing two of them!"
          },
          {
            "id": "mc2",
            "prompt": "Why are primary colors special?",
            "options": [
              { "id": "a", "text": "They are the brightest colors" },
              { "id": "b", "text": "They cannot be made by mixing other colors" },
              { "id": "c", "text": "They are only used in paintings" },
              { "id": "d", "text": "They are the rarest colors" }
            ],
            "correctOptionId": "b",
            "hint": "You can mix primary colors to make other colors, but you can''t mix anything to make a primary color!"
          },
          {
            "id": "mc3",
            "prompt": "How many primary colors are there?",
            "options": [
              { "id": "a", "text": "2" },
              { "id": "b", "text": "3" },
              { "id": "c", "text": "4" },
              { "id": "d", "text": "7" }
            ],
            "correctOptionId": "b",
            "hint": "Count them: red, blue, yellow!"
          },
          {
            "id": "mc4",
            "prompt": "What do you get when you mix red and blue?",
            "options": [
              { "id": "a", "text": "Green" },
              { "id": "b", "text": "Orange" },
              { "id": "c", "text": "Purple" },
              { "id": "d", "text": "Brown" }
            ],
            "correctOptionId": "c",
            "hint": "Think of grapes and plums -- what color are they?"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "Red + Blue = ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Purple",
                "acceptableAnswers": ["Purple", "purple", "violet", "Violet"]
              }
            ],
            "hint": "Mix red and blue paint together -- what color do you see?"
          },
          {
            "id": "fb2",
            "prompt": "Red + Yellow = ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Orange",
                "acceptableAnswers": ["Orange", "orange"]
              }
            ],
            "hint": "Think of the color of a sunset or a juicy citrus fruit!"
          },
          {
            "id": "fb3",
            "prompt": "Blue + Yellow = ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Green",
                "acceptableAnswers": ["Green", "green"]
              }
            ],
            "hint": "Think of grass and leaves -- what color are they?"
          },
          {
            "id": "fb4",
            "prompt": "The three primary colors are red, blue, and ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "yellow",
                "acceptableAnswers": ["yellow", "Yellow"]
              }
            ],
            "hint": "It''s the color of the sun and bananas!"
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
-- ART LESSON 2: Color Mixing Magic
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0002-4000-8000-000000000001',
  '10000002-0504-4000-8000-000000000001',
  2,
  'Color Mixing Magic',
  'Mix primary colors to create secondary colors! Discover the magic of orange, green, and purple.',
  'Time for some color magic! When you mix two primary colors together, you get a brand new color called a secondary color. It''s like a magic trick -- let''s see what happens when colors combine!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match the color mix to what it makes!",
        "pairs": [
          { "id": "mp1", "left": "Red + Yellow", "right": "Orange" },
          { "id": "mp2", "left": "Blue + Yellow", "right": "Green" },
          { "id": "mp3", "left": "Red + Blue", "right": "Purple" },
          { "id": "mp4", "left": "Red + White", "right": "Pink" },
          { "id": "mp5", "left": "Blue + White", "right": "Light Blue" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What are the three SECONDARY colors?",
            "options": [
              { "id": "a", "text": "Red, Blue, Yellow" },
              { "id": "b", "text": "Orange, Green, Purple" },
              { "id": "c", "text": "Pink, Brown, Gray" },
              { "id": "d", "text": "Black, White, Gray" }
            ],
            "correctOptionId": "b",
            "hint": "Secondary colors are MADE by mixing two primary colors. Think about what you just matched!"
          },
          {
            "id": "mc2",
            "prompt": "Which two colors do you mix to make green?",
            "options": [
              { "id": "a", "text": "Red + Blue" },
              { "id": "b", "text": "Red + Yellow" },
              { "id": "c", "text": "Blue + Yellow" },
              { "id": "d", "text": "Red + White" }
            ],
            "correctOptionId": "c",
            "hint": "Think about the sky (blue) and the sun (yellow) -- together they make the color of grass!"
          },
          {
            "id": "mc3",
            "prompt": "What happens when you add white to a color?",
            "options": [
              { "id": "a", "text": "It gets darker" },
              { "id": "b", "text": "It gets lighter" },
              { "id": "c", "text": "It turns gray" },
              { "id": "d", "text": "Nothing changes" }
            ],
            "correctOptionId": "b",
            "hint": "White makes things lighter! Red + white = pink, blue + white = light blue."
          },
          {
            "id": "mc4",
            "prompt": "To make orange, you mix red with which color?",
            "options": [
              { "id": "a", "text": "Blue" },
              { "id": "b", "text": "Green" },
              { "id": "c", "text": "Purple" },
              { "id": "d", "text": "Yellow" }
            ],
            "correctOptionId": "d",
            "hint": "Orange is warm like the sun -- and the sun is yellow!"
          },
          {
            "id": "mc5",
            "prompt": "Why is purple called a SECONDARY color?",
            "options": [
              { "id": "a", "text": "Because it is the second-best color" },
              { "id": "b", "text": "Because it is made by mixing two primary colors" },
              { "id": "c", "text": "Because it was discovered second" },
              { "id": "d", "text": "Because it comes second in the rainbow" }
            ],
            "correctOptionId": "b",
            "hint": "Secondary colors come SECOND -- they are created by mixing two PRIMARY colors!"
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
-- ART LESSON 3: Warm and Cool Colors
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0003-4000-8000-000000000001',
  '10000002-0504-4000-8000-000000000001',
  3,
  'Warm and Cool Colors',
  'Sort colors into warm and cool groups! Learn how colors can make us feel warm or cool.',
  'Brrr! Or should Chip say... ahhhh! Colors can feel WARM like a cozy campfire or COOL like a refreshing splash in a pool. Let''s find out which colors are warm and which are cool!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0001-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip to learn about warm and cool colors!",
        "cards": [
          {
            "id": "fc-warm",
            "front": "Warm Colors",
            "back": "Red, Orange, and Yellow are warm colors! They remind us of fire, sunshine, and autumn leaves. Warm colors feel energetic and cozy."
          },
          {
            "id": "fc-cool",
            "front": "Cool Colors",
            "back": "Blue, Green, and Purple are cool colors! They remind us of water, trees, and the night sky. Cool colors feel calm and peaceful."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Sort each color into Warm or Cool!",
        "pairs": [
          { "id": "mp1", "left": "Red", "right": "Warm" },
          { "id": "mp2", "left": "Blue", "right": "Cool" },
          { "id": "mp3", "left": "Yellow", "right": "Warm" },
          { "id": "mp4", "left": "Green", "right": "Cool" },
          { "id": "mp5", "left": "Orange", "right": "Warm" },
          { "id": "mp6", "left": "Purple", "right": "Cool" }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which group of colors reminds you of fire and sunshine?",
            "options": [
              { "id": "a", "text": "Cool colors" },
              { "id": "b", "text": "Warm colors" },
              { "id": "c", "text": "Dark colors" },
              { "id": "d", "text": "Light colors" }
            ],
            "correctOptionId": "b",
            "hint": "Fire is hot and warm! The colors of fire (red, orange, yellow) are called warm colors."
          },
          {
            "id": "mc2",
            "prompt": "An artist wants to paint a calm ocean scene. Which colors should they use?",
            "options": [
              { "id": "a", "text": "Red and orange" },
              { "id": "b", "text": "Yellow and red" },
              { "id": "c", "text": "Blue and green" },
              { "id": "d", "text": "Orange and yellow" }
            ],
            "correctOptionId": "c",
            "hint": "The ocean is calm and peaceful. Cool colors (blue and green) feel relaxing!"
          },
          {
            "id": "mc3",
            "prompt": "Which of these is a COOL color?",
            "options": [
              { "id": "a", "text": "Red" },
              { "id": "b", "text": "Orange" },
              { "id": "c", "text": "Yellow" },
              { "id": "d", "text": "Purple" }
            ],
            "correctOptionId": "d",
            "hint": "Purple is like the cool night sky! It belongs to the cool color family."
          },
          {
            "id": "mc4",
            "prompt": "If you painted a picture of autumn leaves, which type of colors would you mostly use?",
            "options": [
              { "id": "a", "text": "Cool colors (blue, green, purple)" },
              { "id": "b", "text": "Warm colors (red, orange, yellow)" },
              { "id": "c", "text": "Only black and white" },
              { "id": "d", "text": "Only green" }
            ],
            "correctOptionId": "b",
            "hint": "Think about fall leaves -- they turn red, orange, and yellow. Those are all warm colors!"
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
-- ART LESSON 4: Elements of Art
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0004-4000-8000-000000000001',
  '10000002-0504-4000-8000-000000000001',
  4,
  'Elements of Art',
  'Discover the building blocks of all art: line, shape, color, texture, and space!',
  'Every awesome drawing, painting, and sculpture is made from the same building blocks! Chip calls them the Elements of Art. Once you know them, you''ll start seeing them EVERYWHERE. Ready to become an art detective?',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0002-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about the Elements of Art!",
        "cards": [
          {
            "id": "fc-line",
            "front": "LINE",
            "back": "A line is a mark that moves from one point to another. Lines can be straight, curved, zigzag, wavy, thick, or thin! Every drawing starts with a line."
          },
          {
            "id": "fc-shape",
            "front": "SHAPE",
            "back": "A shape is a flat area with edges. Circles, squares, triangles, and stars are all shapes! When lines connect, they make shapes."
          },
          {
            "id": "fc-color",
            "front": "COLOR",
            "back": "Color is what we see when light bounces off things. Colors have three parts: hue (the name, like red), value (light or dark), and intensity (bright or dull)."
          },
          {
            "id": "fc-texture",
            "front": "TEXTURE",
            "back": "Texture is how something feels (or looks like it would feel). Art can look rough, smooth, bumpy, fuzzy, or prickly -- even on a flat piece of paper!"
          },
          {
            "id": "fc-space",
            "front": "SPACE",
            "back": "Space is the area around and inside things in art. Positive space is where the subject is. Negative space is the empty area around it."
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which element of art is made when a line connects back to itself?",
            "options": [
              { "id": "a", "text": "Color" },
              { "id": "b", "text": "Shape" },
              { "id": "c", "text": "Texture" },
              { "id": "d", "text": "Space" }
            ],
            "correctOptionId": "b",
            "hint": "When you draw a line that goes around and meets itself, you get a circle, square, or triangle -- that''s a shape!"
          },
          {
            "id": "mc2",
            "prompt": "You draw a fluffy cat with soft-looking fur. Which element of art does the fur show?",
            "options": [
              { "id": "a", "text": "Line" },
              { "id": "b", "text": "Shape" },
              { "id": "c", "text": "Texture" },
              { "id": "d", "text": "Space" }
            ],
            "correctOptionId": "c",
            "hint": "The fur looks soft and fluffy -- that''s how it would FEEL if you touched it. That''s texture!"
          },
          {
            "id": "mc3",
            "prompt": "A zigzag, a curve, and a straight mark are all examples of ___.",
            "options": [
              { "id": "a", "text": "Lines" },
              { "id": "b", "text": "Shapes" },
              { "id": "c", "text": "Colors" },
              { "id": "d", "text": "Textures" }
            ],
            "correctOptionId": "a",
            "hint": "These are all marks that move from one point to another -- just different types of the same element!"
          },
          {
            "id": "mc4",
            "prompt": "The empty background around a drawing of a tree is called ___.",
            "options": [
              { "id": "a", "text": "Texture" },
              { "id": "b", "text": "Negative space" },
              { "id": "c", "text": "Color" },
              { "id": "d", "text": "Shape" }
            ],
            "correctOptionId": "b",
            "hint": "The empty area around and between objects in art is called negative space!"
          },
          {
            "id": "mc5",
            "prompt": "How many main elements of art did we learn about?",
            "options": [
              { "id": "a", "text": "3" },
              { "id": "b", "text": "4" },
              { "id": "c", "text": "5" },
              { "id": "d", "text": "7" }
            ],
            "correctOptionId": "c",
            "hint": "Count them: line, shape, color, texture, space!"
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
-- ART LESSON 5: Famous Artists for Kids
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0005-4000-8000-000000000001',
  '10000002-0504-4000-8000-000000000001',
  5,
  'Famous Artists for Kids',
  'Meet five amazing artists from around the world and discover what makes their art special!',
  'Chip has been visiting art museums (well, virtual ones!) and found some AMAZING artists to tell you about! These artists created incredible art that people still love today. Let''s meet them!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip to meet these famous artists!",
        "cards": [
          {
            "id": "fc-monet",
            "front": "Claude Monet (France)",
            "back": "Monet loved painting outdoors! He painted the same garden pond with water lilies over and over in different light. He used soft, blurry brushstrokes to show how light changes. His style is called Impressionism."
          },
          {
            "id": "fc-vangogh",
            "front": "Vincent van Gogh (Netherlands)",
            "back": "Van Gogh painted with thick, swirly brushstrokes and bold colors. His most famous painting, The Starry Night, shows a magical night sky with swirling stars. He painted over 900 paintings in just 10 years!"
          },
          {
            "id": "fc-kahlo",
            "front": "Frida Kahlo (Mexico)",
            "back": "Frida painted colorful self-portraits (pictures of herself!) that told stories about her life and her Mexican heritage. She often included animals, flowers, and bright colors from Mexican folk art."
          },
          {
            "id": "fc-kusama",
            "front": "Yayoi Kusama (Japan)",
            "back": "Kusama is known as the Princess of Polka Dots! She covers everything -- rooms, sculptures, pumpkins -- with colorful dots. Her infinity rooms use mirrors so the dots seem to go on forever!"
          },
          {
            "id": "fc-mondrian",
            "front": "Piet Mondrian (Netherlands)",
            "back": "Mondrian painted with only straight lines and primary colors (red, blue, yellow) plus black, white, and gray. His art looks like a colorful grid! His style shows that simple shapes can be beautiful."
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which artist is known as the Princess of Polka Dots?",
            "options": [
              { "id": "a", "text": "Frida Kahlo" },
              { "id": "b", "text": "Claude Monet" },
              { "id": "c", "text": "Yayoi Kusama" },
              { "id": "d", "text": "Piet Mondrian" }
            ],
            "correctOptionId": "c",
            "hint": "This Japanese artist covers everything in dots -- rooms, pumpkins, sculptures!"
          },
          {
            "id": "mc2",
            "prompt": "Vincent van Gogh is famous for painting which night scene?",
            "options": [
              { "id": "a", "text": "Water Lilies" },
              { "id": "b", "text": "The Starry Night" },
              { "id": "c", "text": "Polka Dot Room" },
              { "id": "d", "text": "The Red Grid" }
            ],
            "correctOptionId": "b",
            "hint": "His most famous painting shows a magical sky full of swirling stars!"
          },
          {
            "id": "mc3",
            "prompt": "Which artist only used straight lines and primary colors?",
            "options": [
              { "id": "a", "text": "Claude Monet" },
              { "id": "b", "text": "Frida Kahlo" },
              { "id": "c", "text": "Vincent van Gogh" },
              { "id": "d", "text": "Piet Mondrian" }
            ],
            "correctOptionId": "d",
            "hint": "This artist made art that looks like a colorful grid with red, blue, and yellow rectangles!"
          },
          {
            "id": "mc4",
            "prompt": "Frida Kahlo was from which country?",
            "options": [
              { "id": "a", "text": "France" },
              { "id": "b", "text": "Japan" },
              { "id": "c", "text": "Mexico" },
              { "id": "d", "text": "Netherlands" }
            ],
            "correctOptionId": "c",
            "hint": "Frida included bright colors and folk art from her home country in Central America!"
          },
          {
            "id": "mc5",
            "prompt": "Claude Monet loved to paint outdoors. What was his favorite subject?",
            "options": [
              { "id": "a", "text": "Self-portraits" },
              { "id": "b", "text": "Polka dots" },
              { "id": "c", "text": "Straight lines" },
              { "id": "d", "text": "Water lilies and gardens" }
            ],
            "correctOptionId": "d",
            "hint": "Monet had a beautiful garden with a pond -- he painted it again and again!"
          },
          {
            "id": "mc6",
            "prompt": "Which artist painted colorful self-portraits (pictures of herself)?",
            "options": [
              { "id": "a", "text": "Yayoi Kusama" },
              { "id": "b", "text": "Frida Kahlo" },
              { "id": "c", "text": "Piet Mondrian" },
              { "id": "d", "text": "Claude Monet" }
            ],
            "correctOptionId": "b",
            "hint": "This Mexican artist told stories about her life through paintings of herself!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
