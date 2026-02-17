-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Music: Rhythm Creation & Performance Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Clap the Pattern
--   - Write Your Own Rhythm
--   - Rhythm + Math: Counting Beats
--   - Body Percussion Band
--   - Concert Time! (capstone)
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: matching_pairs, sequence_order, flash_card,
--                    multiple_choice, fill_in_blank
--
-- Subject ID:
--   Music: 87ee4010-8b16-4f55-9627-b1961a87e726
--
-- Module ID:
--   Rhythm Creation & Performance: 10000002-0407-4000-8000-000000000001
--
-- Skill IDs:
--   Rhythm Patterns:         20000004-0009-4000-8000-000000000001
--   Music+Math Connections:  20000004-000a-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Music subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Music 2nd Grade: Rhythm Patterns & Music+Math Connections
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000004-0009-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'rhythm_patterns', 'Rhythm Patterns', 'Create, perform, and notate simple rhythm patterns using quarter notes, eighth notes, half notes, and rests', 'MU:Cr1.1.2a', 9),
  ('20000004-000a-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'music_math_connections', 'Music+Math Connections', 'Connect musical note values to fractions and addition, understanding that beats can be counted and divided mathematically', 'MU:Cn10.0.2a', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Music: Rhythm Creation & Performance)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0407-4000-8000-000000000001', 2, 32, 'Rhythm Creation & Performance', 'Create your own rhythms, connect beats to math, and perform in a body percussion concert!', 'music', '87ee4010-8b16-4f55-9627-b1961a87e726')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MUSIC LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Clap the Pattern
-- Module: Rhythm Creation & Performance | Skill: Rhythm Patterns
-- Widgets: sequence_order + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0010-4000-8000-000000000001',
  '10000002-0407-4000-8000-000000000001',
  1,
  'Clap the Pattern',
  'Learn to read and clap simple rhythm patterns! Feel the beat with your hands and body.',
  'Hey rhythm maker! Chip here! Did you know you already make rhythms every day? When you clap your hands, stomp your feet, or tap on a table -- that''s rhythm! Today we''re going to read rhythm patterns and clap them out. Ready? Clap along with Chip!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0009-4000-8000-000000000001']::uuid[],
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
            "prompt": "Put these claps in the right rhythm pattern: CLAP CLAP REST CLAP!",
            "items": [
              { "id": "i-clap1", "text": "\ud83d\udc4f Clap (1 beat)" },
              { "id": "i-clap2", "text": "\ud83d\udc4f Clap (1 beat)" },
              { "id": "i-rest", "text": "\ud83e\udd2b Rest (1 beat of silence)" },
              { "id": "i-clap3", "text": "\ud83d\udc4f Clap (1 beat)" }
            ],
            "correctOrder": ["i-clap1", "i-clap2", "i-rest", "i-clap3"],
            "hint": "The pattern is: clap, clap, shhh, clap! The rest is a moment of silence in the middle."
          },
          {
            "id": "seq2",
            "prompt": "Arrange this 4-beat pattern: CLAP quick-quick CLAP REST",
            "items": [
              { "id": "i-quarter1", "text": "\ud83d\udc4f Quarter note clap (1 beat)" },
              { "id": "i-eighth1", "text": "\ud83d\udc4f\ud83d\udc4f Two quick claps (1 beat total)" },
              { "id": "i-quarter2", "text": "\ud83d\udc4f Quarter note clap (1 beat)" },
              { "id": "i-qrest", "text": "\ud83e\udd2b Quarter rest (1 beat)" }
            ],
            "correctOrder": ["i-quarter1", "i-eighth1", "i-quarter2", "i-qrest"],
            "hint": "Start with one big clap, then two quick claps, then one more big clap, then silence!"
          },
          {
            "id": "seq3",
            "prompt": "Build this pattern from SHORTEST notes to LONGEST: quick-quick, regular clap, long hold!",
            "items": [
              { "id": "i-eighths", "text": "\ud83d\udc4f\ud83d\udc4f Two eighth notes (1 beat total)" },
              { "id": "i-quarter", "text": "\ud83d\udc4f Quarter note (1 beat)" },
              { "id": "i-half", "text": "\ud83d\udc4f\u2014 Half note (2 beats, hold it!)" }
            ],
            "correctOrder": ["i-eighths", "i-quarter", "i-half"],
            "hint": "Go from the quickest sounds to the longest! Two fast claps, one regular clap, then hold for two beats."
          },
          {
            "id": "seq4",
            "prompt": "Put this marching rhythm in order: LEFT RIGHT LEFT RIGHT!",
            "items": [
              { "id": "i-left1", "text": "\ud83e\uddb6 LEFT foot (beat 1)" },
              { "id": "i-right1", "text": "\ud83e\uddb6 RIGHT foot (beat 2)" },
              { "id": "i-left2", "text": "\ud83e\uddb6 LEFT foot (beat 3)" },
              { "id": "i-right2", "text": "\ud83e\uddb6 RIGHT foot (beat 4)" }
            ],
            "correctOrder": ["i-left1", "i-right1", "i-left2", "i-right2"],
            "hint": "Marching goes left-right-left-right, one step per beat! That is a steady rhythm."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each rhythm word to what it means!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "clap", "text": "Clap", "emoji": "\ud83d\udc4f"},
            "right": {"id": "sound", "text": "Make a sound on the beat", "emoji": "\ud83d\udd0a"}
          },
          {
            "id": "p2",
            "left": {"id": "rest", "text": "Rest", "emoji": "\ud83e\udd2b"},
            "right": {"id": "silence", "text": "Stay silent for a beat", "emoji": "\ud83e\udee3"}
          },
          {
            "id": "p3",
            "left": {"id": "quarter-note", "text": "Quarter Note", "emoji": "\ud83c\udfb5"},
            "right": {"id": "1beat", "text": "1 beat long", "emoji": "1\ufe0f\u20e3"}
          },
          {
            "id": "p4",
            "left": {"id": "half-note", "text": "Half Note", "emoji": "\ud83c\udfb6"},
            "right": {"id": "2beats", "text": "2 beats long", "emoji": "2\ufe0f\u20e3"}
          },
          {
            "id": "p5",
            "left": {"id": "eighth-notes", "text": "Two Eighth Notes", "emoji": "\ud83c\udfb5\ud83c\udfb5"},
            "right": {"id": "quickquick", "text": "Two quick sounds in 1 beat", "emoji": "\u26a1"}
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
-- LESSON 2: Write Your Own Rhythm
-- Module: Rhythm Creation & Performance | Skill: Rhythm Patterns
-- Widgets: fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0011-4000-8000-000000000001',
  '10000002-0407-4000-8000-000000000001',
  2,
  'Write Your Own Rhythm',
  'Become a rhythm composer! Learn to write down rhythm patterns using note names and rests.',
  'Chip is giving you a composer''s notebook! Real musicians write their rhythms down so they can remember them and share them with friends. Today YOU get to be the rhythm writer! We''ll use note names to write patterns that add up to exactly 4 beats. It''s like a musical puzzle!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "A quarter note lasts ___ beat(s).",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "Quarter notes get one single beat. Clap once -- that is a quarter note!"
          },
          {
            "id": "fb2",
            "prompt": "A half note lasts ___ beats.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "2",
                "acceptableAnswers": ["2", "two", "Two"]
              }
            ],
            "hint": "A half note is held for two beats. Count: 1-2!"
          },
          {
            "id": "fb3",
            "prompt": "Two eighth notes together last ___ beat(s) total.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "Each eighth note is half a beat. Half + half = 1 whole beat!"
          },
          {
            "id": "fb4",
            "prompt": "In a measure of 4 beats: Quarter + Quarter + ___ = 4 beats.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "half",
                "acceptableAnswers": ["half", "Half", "half note", "Half note", "Half Note"]
              }
            ],
            "hint": "1 beat + 1 beat + ? = 4 beats. You need 2 more beats. Which note lasts 2 beats?"
          },
          {
            "id": "fb5",
            "prompt": "A ___ rest means 1 beat of silence.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "quarter",
                "acceptableAnswers": ["quarter", "Quarter"]
              }
            ],
            "hint": "This rest matches the quarter note -- both last exactly 1 beat!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Build a 4-beat rhythm! Arrange: Quarter, Quarter, Quarter, Quarter Rest",
            "items": [
              { "id": "i-q1", "text": "\ud83d\udc4f Quarter note (1 beat)" },
              { "id": "i-q2", "text": "\ud83d\udc4f Quarter note (1 beat)" },
              { "id": "i-q3", "text": "\ud83d\udc4f Quarter note (1 beat)" },
              { "id": "i-qr", "text": "\ud83e\udd2b Quarter rest (1 beat)" }
            ],
            "correctOrder": ["i-q1", "i-q2", "i-q3", "i-qr"],
            "hint": "Three claps and then silence! 1 + 1 + 1 + 1 = 4 beats."
          },
          {
            "id": "seq2",
            "prompt": "Write this 4-beat rhythm: Half note, then two quick-quick eighth notes, then Quarter note",
            "items": [
              { "id": "i-half", "text": "\ud83d\udc4f\u2014 Half note (2 beats)" },
              { "id": "i-eighths", "text": "\ud83d\udc4f\ud83d\udc4f Two eighth notes (1 beat)" },
              { "id": "i-quarter", "text": "\ud83d\udc4f Quarter note (1 beat)" }
            ],
            "correctOrder": ["i-half", "i-eighths", "i-quarter"],
            "hint": "Start with the long note (2 beats), then two quick notes (1 beat), then one regular note (1 beat). 2 + 1 + 1 = 4!"
          },
          {
            "id": "seq3",
            "prompt": "Arrange this pattern: quick-quick, CLAP, quick-quick, HOLD!",
            "items": [
              { "id": "i-e1", "text": "\ud83d\udc4f\ud83d\udc4f Eighth notes (1 beat)" },
              { "id": "i-q1", "text": "\ud83d\udc4f Quarter note (1 beat)" },
              { "id": "i-e2", "text": "\ud83d\udc4f\ud83d\udc4f Eighth notes (1 beat)" },
              { "id": "i-h", "text": "\ud83d\udc4f\u2014 Half note (hold for 2 beats -- oops, that is 5 beats!)" }
            ],
            "correctOrder": ["i-e1", "i-q1", "i-e2", "i-h"],
            "hint": "The pattern goes: two quick, one regular, two quick, then hold! Can you hear it?"
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
-- LESSON 3: Rhythm + Math: Counting Beats
-- Module: Rhythm Creation & Performance | Skill: Music+Math Connections
-- Widgets: matching_pairs + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0012-4000-8000-000000000001',
  '10000002-0407-4000-8000-000000000001',
  3,
  'Rhythm + Math: Counting Beats',
  'Discover how music and math are best friends! Note values are like fractions -- a whole note is 4 beats, a half note is 2, and a quarter is 1.',
  'Guess what, math whiz? Music IS math! Chip just figured out the secret: notes are like fractions! A whole note is like a whole pizza -- 4 slices (beats). A half note is half the pizza -- 2 slices. And a quarter note? One quarter of the pizza -- just 1 slice! Let''s count some musical math!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each note to how many beats it gets -- think of pizza slices!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "whole", "text": "Whole Note", "emoji": "\ud83c\udfb5"},
            "right": {"id": "4beats", "text": "4 beats (whole pizza)", "emoji": "\ud83c\udf55"}
          },
          {
            "id": "p2",
            "left": {"id": "half", "text": "Half Note", "emoji": "\ud83c\udfb6"},
            "right": {"id": "2beats", "text": "2 beats (half a pizza)", "emoji": "\ud83c\udf55"}
          },
          {
            "id": "p3",
            "left": {"id": "quarter", "text": "Quarter Note", "emoji": "\ud83c\udfb5"},
            "right": {"id": "1beat", "text": "1 beat (one slice)", "emoji": "1\ufe0f\u20e3"}
          },
          {
            "id": "p4",
            "left": {"id": "eighth-pair", "text": "Two Eighth Notes", "emoji": "\ud83c\udfb5\ud83c\udfb5"},
            "right": {"id": "1beat-split", "text": "1 beat split in half", "emoji": "\u2702\ufe0f"}
          },
          {
            "id": "p5",
            "left": {"id": "whole-rest", "text": "Whole Rest", "emoji": "\ud83e\udd2b"},
            "right": {"id": "4silence", "text": "4 beats of silence", "emoji": "\ud83d\ude36"}
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "2 half notes = ___ whole note(s). (2 + 2 = 4 beats!)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "Each half note = 2 beats. Two of them = 2 + 2 = 4 beats. That is the same as 1 whole note!"
          },
          {
            "id": "fb2",
            "prompt": "4 quarter notes = ___ whole note(s). (1 + 1 + 1 + 1 = ?)",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "Each quarter note = 1 beat. Four of them = 4 beats total. That equals 1 whole note!"
          },
          {
            "id": "fb3",
            "prompt": "1 half note + 2 quarter notes = ___ beats total.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "A half note = 2 beats. Each quarter note = 1 beat. So 2 + 1 + 1 = 4 beats!"
          },
          {
            "id": "fb4",
            "prompt": "A quarter note is like 1 slice of a pizza that has ___ slices total.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "A whole note = whole pizza = 4 beats. A quarter note is one quarter, so the pizza has 4 slices!"
          },
          {
            "id": "fb5",
            "prompt": "Half of a quarter note is an ___ note.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "eighth",
                "acceptableAnswers": ["eighth", "Eighth", "8th"]
              }
            ],
            "hint": "If you split a quarter note in half, you get two of these tiny fast notes!"
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
-- LESSON 4: Body Percussion Band
-- Module: Rhythm Creation & Performance | Skill: Rhythm Patterns
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0013-4000-8000-000000000001',
  '10000002-0407-4000-8000-000000000001',
  4,
  'Body Percussion Band',
  'Your body is an instrument! Learn to clap, snap, stomp, and pat your knees to make awesome rhythms.',
  'Chip just discovered something AMAZING -- you don''t need a drum or a xylophone to make music. YOUR BODY is a percussion instrument! You can clap your hands, snap your fingers, stomp your feet, and pat your knees. Put them all together and you have a one-person band! Let''s jam!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0009-4000-8000-000000000001']::uuid[],
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
            "prompt": "Build the body percussion pattern: STOMP CLAP STOMP CLAP!",
            "items": [
              { "id": "i-stomp1", "text": "\ud83e\uddb6 Stomp (beat 1)" },
              { "id": "i-clap1", "text": "\ud83d\udc4f Clap (beat 2)" },
              { "id": "i-stomp2", "text": "\ud83e\uddb6 Stomp (beat 3)" },
              { "id": "i-clap2", "text": "\ud83d\udc4f Clap (beat 4)" }
            ],
            "correctOrder": ["i-stomp1", "i-clap1", "i-stomp2", "i-clap2"],
            "hint": "Alternate between your feet and hands! Stomp-clap-stomp-clap!"
          },
          {
            "id": "seq2",
            "prompt": "Arrange the 4-part body percussion: PAT PAT CLAP SNAP!",
            "items": [
              { "id": "i-pat1", "text": "\ud83e\uddb5 Pat knees (beat 1)" },
              { "id": "i-pat2", "text": "\ud83e\uddb5 Pat knees (beat 2)" },
              { "id": "i-clap", "text": "\ud83d\udc4f Clap hands (beat 3)" },
              { "id": "i-snap", "text": "\ud83e\udd0c Snap fingers (beat 4)" }
            ],
            "correctOrder": ["i-pat1", "i-pat2", "i-clap", "i-snap"],
            "hint": "Start low on your knees, move up to clapping, then snap up high! Pat-pat-clap-snap!"
          },
          {
            "id": "seq3",
            "prompt": "Put these body sounds in order from LOWEST to HIGHEST pitch!",
            "items": [
              { "id": "i-stomp", "text": "\ud83e\uddb6 Stomp feet (deep, low sound)" },
              { "id": "i-pat", "text": "\ud83e\uddb5 Pat knees (medium-low sound)" },
              { "id": "i-clap", "text": "\ud83d\udc4f Clap hands (medium-high sound)" },
              { "id": "i-snap", "text": "\ud83e\udd0c Snap fingers (high, light sound)" }
            ],
            "correctOrder": ["i-stomp", "i-pat", "i-clap", "i-snap"],
            "hint": "Start at the ground (stomps are deep) and work your way up to the lightest sound (finger snaps)!"
          },
          {
            "id": "seq4",
            "prompt": "Build the We Will Rock You rhythm: STOMP STOMP CLAP (rest)!",
            "items": [
              { "id": "i-s1", "text": "\ud83e\uddb6 Stomp (beat 1)" },
              { "id": "i-s2", "text": "\ud83e\uddb6 Stomp (beat 2)" },
              { "id": "i-c", "text": "\ud83d\udc4f Clap (beat 3)" },
              { "id": "i-r", "text": "\ud83e\udd2b Rest (beat 4)" }
            ],
            "correctOrder": ["i-s1", "i-s2", "i-c", "i-r"],
            "hint": "Two stomps, one clap, then silence! BOOM BOOM CLAP (shhh)!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which of these is NOT a body percussion sound?",
            "options": [
              { "id": "a", "text": "Clapping hands" },
              { "id": "b", "text": "Stomping feet" },
              { "id": "c", "text": "Playing a piano" },
              { "id": "d", "text": "Snapping fingers" }
            ],
            "correctOptionId": "c",
            "hint": "Body percussion uses only YOUR BODY to make sounds -- no instruments needed!"
          },
          {
            "id": "mc2",
            "prompt": "What does ''percussion'' mean?",
            "options": [
              { "id": "a", "text": "Singing a song" },
              { "id": "b", "text": "Making sound by hitting, shaking, or scraping" },
              { "id": "c", "text": "Playing very softly" },
              { "id": "d", "text": "Reading musical notes" }
            ],
            "correctOptionId": "b",
            "hint": "Think about drums, claps, and stomps -- percussion is all about striking and tapping!"
          },
          {
            "id": "mc3",
            "prompt": "If you want to make a HIGH body percussion sound, which would you choose?",
            "options": [
              { "id": "a", "text": "Stomping your feet" },
              { "id": "b", "text": "Patting your knees" },
              { "id": "c", "text": "Snapping your fingers" },
              { "id": "d", "text": "Slapping the floor" }
            ],
            "correctOptionId": "c",
            "hint": "Finger snaps make a light, high sound! Sounds higher on your body tend to be higher in pitch."
          },
          {
            "id": "mc4",
            "prompt": "Why is it important to keep a STEADY beat in body percussion?",
            "options": [
              { "id": "a", "text": "It is not important at all" },
              { "id": "b", "text": "So the rhythm sounds organized and you can play with others" },
              { "id": "c", "text": "Because fast is always better" },
              { "id": "d", "text": "So it gets louder" }
            ],
            "correctOptionId": "b",
            "hint": "A steady beat is like a ticking clock -- it keeps everyone together and makes the music sound great!"
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
-- LESSON 5: Concert Time! (Capstone)
-- Module: Rhythm Creation & Performance | Skills: Rhythm Patterns + Music+Math
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-0014-4000-8000-000000000001',
  '10000002-0407-4000-8000-000000000001',
  5,
  'Concert Time!',
  'It''s showtime! Use everything you learned to put on a rhythm concert. Count beats, arrange patterns, and perform!',
  'LADIES AND GENTLEMEN... welcome to the TinkerSchool Rhythm Concert! Chip is SO proud of you! You''ve learned about quarter notes, eighth notes, half notes, rests, body percussion, AND how music connects to math. Now it''s time to put it ALL together for one amazing performance! Take a bow when you''re done -- you earned it!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0009-4000-8000-000000000001', '20000004-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Build a 4-beat concert opening! Arrange: STOMP, CLAP, quick-quick SNAP, REST!",
            "items": [
              { "id": "i-stomp", "text": "\ud83e\uddb6 Stomp (1 beat)" },
              { "id": "i-clap", "text": "\ud83d\udc4f Clap (1 beat)" },
              { "id": "i-snaps", "text": "\ud83e\udd0c\ud83e\udd0c Quick-quick snaps (1 beat)" },
              { "id": "i-rest", "text": "\ud83e\udd2b Rest (1 beat)" }
            ],
            "correctOrder": ["i-stomp", "i-clap", "i-snaps", "i-rest"],
            "hint": "Start big with a stomp, then clap, two quick snaps, and a dramatic pause! 1 + 1 + 1 + 1 = 4 beats."
          },
          {
            "id": "seq2",
            "prompt": "Arrange the concert from start to finish!",
            "items": [
              { "id": "i-intro", "text": "\ud83c\udfac Introduction: Count in (1, 2, 3, 4!)" },
              { "id": "i-verse1", "text": "\ud83c\udfb5 Part A: Stomp-clap pattern" },
              { "id": "i-verse2", "text": "\ud83c\udfb6 Part B: Snap-pat pattern (different!)" },
              { "id": "i-verse3", "text": "\ud83c\udfb5 Part A returns: Stomp-clap pattern again" },
              { "id": "i-bow", "text": "\ud83c\udfad Finale: Big clap and take a bow!" }
            ],
            "correctOrder": ["i-intro", "i-verse1", "i-verse2", "i-verse3", "i-bow"],
            "hint": "A concert starts with a count-in, plays ABA form (same-different-same), and ends with a big finish!"
          },
          {
            "id": "seq3",
            "prompt": "Build a grand finale! Put these from SOFTEST to LOUDEST for a big crescendo ending!",
            "items": [
              { "id": "i-snap", "text": "\ud83e\udd0c Soft finger snap (piano)" },
              { "id": "i-pat", "text": "\ud83e\uddb5 Medium knee pat (mezzo forte)" },
              { "id": "i-clap", "text": "\ud83d\udc4f Loud clap (forte)" },
              { "id": "i-stomp", "text": "\ud83e\uddb6 BIG STOMP (fortissimo!)" }
            ],
            "correctOrder": ["i-snap", "i-pat", "i-clap", "i-stomp"],
            "hint": "Start quiet and get louder! Soft snap, medium pat, loud clap, BIGGEST STOMP! That is a crescendo!"
          },
          {
            "id": "seq4",
            "prompt": "Put these concert rules in the right order!",
            "items": [
              { "id": "i-listen", "text": "\ud83d\udc42 Listen for the count-in" },
              { "id": "i-steady", "text": "\u23f0 Keep a steady beat" },
              { "id": "i-perform", "text": "\ud83c\udfb5 Perform your rhythm pattern" },
              { "id": "i-bow", "text": "\ud83c\udf1f Take a bow at the end!" }
            ],
            "correctOrder": ["i-listen", "i-steady", "i-perform", "i-bow"],
            "hint": "First listen, then find the beat, then play your part, and finish by celebrating!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "In our concert, Part A and Part B make the form ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "ABA",
                "acceptableAnswers": ["ABA", "aba", "A B A"]
              }
            ],
            "hint": "Part A comes first, then Part B in the middle, then Part A returns! That is the musical sandwich form."
          },
          {
            "id": "fb2",
            "prompt": "Getting gradually louder is called a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "crescendo",
                "acceptableAnswers": ["crescendo", "Crescendo"]
              }
            ],
            "hint": "This musical word starts with C and means to gradually get louder. Our grand finale used one!"
          },
          {
            "id": "fb3",
            "prompt": "A measure in 4/4 time has ___ beats.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "The top number in 4/4 tells you how many beats! Four beats per measure."
          },
          {
            "id": "fb4",
            "prompt": "Clapping, stomping, and snapping are all types of body ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "percussion",
                "acceptableAnswers": ["percussion", "Percussion"]
              }
            ],
            "hint": "You make sounds by hitting and tapping your body. That is body ___!"
          },
          {
            "id": "fb5",
            "prompt": "2 quarter notes + 1 half note = ___ beats. That fills a whole measure!",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "Each quarter note = 1 beat. The half note = 2 beats. So 1 + 1 + 2 = ?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
