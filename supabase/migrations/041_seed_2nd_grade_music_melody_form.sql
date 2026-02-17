-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Music: Melody & Form Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - High and Low on the Staff
--   - Do Re Mi Fa Sol
--   - AB Song Form
--   - ABA Song Form
--   - Compose Your Own Melody
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
--   Melody & Form: 10000002-0406-4000-8000-000000000001
--
-- Skill IDs:
--   Musical Form (AB, ABA):  20000004-0007-4000-8000-000000000001
--   Melody & Pitch:          20000004-0008-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Music subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Music 2nd Grade: Musical Form & Melody/Pitch
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000004-0007-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'musical_form', 'Musical Form (AB, ABA)', 'Recognize and describe contrasting sections (AB) and return-of-A forms (ABA) in simple songs', 'MU:Re7.2.2a', 7),
  ('20000004-0008-4000-8000-000000000001', '87ee4010-8b16-4f55-9627-b1961a87e726', 'melody_pitch', 'Melody & Pitch', 'Identify high and low pitches, sing and notate simple solfege patterns (Do Re Mi Fa Sol)', 'MU:Pr4.2.2a', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Music: Melody & Form)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0406-4000-8000-000000000001', 2, 31, 'Melody & Form', 'Explore high and low notes, learn Do Re Mi, and discover how songs are built with sections!', 'music', '87ee4010-8b16-4f55-9627-b1961a87e726')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- MUSIC LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: High and Low on the Staff
-- Module: Melody & Form | Skill: Melody & Pitch
-- Widgets: matching_pairs + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000b-4000-8000-000000000001',
  '10000002-0406-4000-8000-000000000001',
  1,
  'High and Low on the Staff',
  'Learn how notes go up and down on the musical staff -- high notes live at the top and low notes live at the bottom!',
  'Hey, music explorer! Chip just climbed a musical LADDER! Did you know that music goes UP and DOWN, just like climbing stairs? Notes that are HIGH on the staff sound squeaky and bright, and notes that are LOW on the staff sound deep and rumbly. Let''s figure out where all the notes live!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each sound to whether it is HIGH or LOW!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "bird", "text": "Bird chirping", "emoji": "\ud83d\udc26"},
            "right": {"id": "high1", "text": "High", "emoji": "\u2b06\ufe0f"}
          },
          {
            "id": "p2",
            "left": {"id": "thunder", "text": "Thunder rumbling", "emoji": "\u26c8\ufe0f"},
            "right": {"id": "low1", "text": "Low", "emoji": "\u2b07\ufe0f"}
          },
          {
            "id": "p3",
            "left": {"id": "whistle", "text": "Whistle blowing", "emoji": "\ud83c\udfb5"},
            "right": {"id": "high2", "text": "High", "emoji": "\u2b06\ufe0f"}
          },
          {
            "id": "p4",
            "left": {"id": "tuba", "text": "Tuba playing", "emoji": "\ud83c\udfba"},
            "right": {"id": "low2", "text": "Low", "emoji": "\u2b07\ufe0f"}
          },
          {
            "id": "p5",
            "left": {"id": "piccolo", "text": "Piccolo playing", "emoji": "\ud83c\udfb6"},
            "right": {"id": "high3", "text": "High", "emoji": "\u2b06\ufe0f"}
          },
          {
            "id": "p6",
            "left": {"id": "bass-drum", "text": "Bass drum booming", "emoji": "\ud83e\udd41"},
            "right": {"id": "low3", "text": "Low", "emoji": "\u2b07\ufe0f"}
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Put these notes in order from LOWEST to HIGHEST!",
            "items": [
              { "id": "i-bass", "text": "\ud83c\udfb5 Very low bass note" },
              { "id": "i-middle", "text": "\ud83c\udfb5 Middle note" },
              { "id": "i-high", "text": "\ud83c\udfb5 High note" },
              { "id": "i-very-high", "text": "\ud83c\udfb5 Very high squeaky note" }
            ],
            "correctOrder": ["i-bass", "i-middle", "i-high", "i-very-high"],
            "hint": "Start with the deepest, rumbly sound and go up to the squeakiest, brightest sound!"
          },
          {
            "id": "seq2",
            "prompt": "Put these instruments in order from LOWEST sounding to HIGHEST sounding!",
            "items": [
              { "id": "i-tuba", "text": "\ud83c\udfba Tuba" },
              { "id": "i-cello", "text": "\ud83c\udfbb Cello" },
              { "id": "i-trumpet", "text": "\ud83c\udfba Trumpet" },
              { "id": "i-flute", "text": "\ud83c\udfb6 Flute" }
            ],
            "correctOrder": ["i-tuba", "i-cello", "i-trumpet", "i-flute"],
            "hint": "The tuba is the biggest and deepest. The flute is small and makes high sounds!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "On a musical staff, where do HIGH notes live?",
            "options": [
              { "id": "a", "text": "At the bottom" },
              { "id": "b", "text": "At the top" },
              { "id": "c", "text": "In the middle only" },
              { "id": "d", "text": "Off the page" }
            ],
            "correctOptionId": "b",
            "hint": "Just like climbing stairs -- the higher you go, the higher the note sounds!"
          },
          {
            "id": "mc2",
            "prompt": "A mouse squeak is an example of a ___ sound.",
            "options": [
              { "id": "a", "text": "Low" },
              { "id": "b", "text": "Medium" },
              { "id": "c", "text": "High" },
              { "id": "d", "text": "Silent" }
            ],
            "correctOptionId": "c",
            "hint": "Mice make tiny, squeaky sounds that are way up high!"
          },
          {
            "id": "mc3",
            "prompt": "Which word describes how high or low a note sounds?",
            "options": [
              { "id": "a", "text": "Rhythm" },
              { "id": "b", "text": "Pitch" },
              { "id": "c", "text": "Tempo" },
              { "id": "d", "text": "Volume" }
            ],
            "correctOptionId": "b",
            "hint": "This special music word starts with P and tells us if a note is high or low!"
          },
          {
            "id": "mc4",
            "prompt": "When notes go UP on the staff, what happens to the sound?",
            "options": [
              { "id": "a", "text": "It gets softer" },
              { "id": "b", "text": "It gets faster" },
              { "id": "c", "text": "It gets higher" },
              { "id": "d", "text": "It gets louder" }
            ],
            "correctOptionId": "c",
            "hint": "Moving UP on the staff means the pitch goes UP -- the sound gets higher!"
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
-- LESSON 2: Do Re Mi Fa Sol
-- Module: Melody & Form | Skill: Melody & Pitch
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000c-4000-8000-000000000001',
  '10000002-0406-4000-8000-000000000001',
  2,
  'Do Re Mi Fa Sol',
  'Meet the musical staircase -- Do Re Mi Fa Sol! These special syllables help us sing any melody.',
  'Chip is singing up the musical staircase! Do, Re, Mi, Fa, Sol -- each step goes a little higher. Singers all around the world use these special syllable names to learn melodies. You might even know them from a famous song! Let''s climb the staircase together!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn the solfege notes from low to high!",
        "cards": [
          {
            "id": "fc-do",
            "front": "Do (Doh)",
            "back": "Do is the HOME note -- the starting note! It is the lowest note on our solfege staircase. Think of it as the ground floor of a building."
          },
          {
            "id": "fc-re",
            "front": "Re (Ray)",
            "back": "Re is the second step up! It sounds a little higher than Do. Imagine stepping up one stair from the ground floor."
          },
          {
            "id": "fc-mi",
            "front": "Mi (Mee)",
            "back": "Mi is the third step! It sounds bright and cheerful. You are now three stairs up from Do!"
          },
          {
            "id": "fc-fa",
            "front": "Fa (Fah)",
            "back": "Fa is the fourth step. It is just one small step above Mi. Almost halfway up the staircase!"
          },
          {
            "id": "fc-sol",
            "front": "Sol (Soh)",
            "back": "Sol is the fifth step -- strong and bright! Sol and Do are best friends in music. Together they make songs sound complete."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each solfege note to its position on the staircase!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "do", "text": "Do", "emoji": "\ud83c\udfb5"},
            "right": {"id": "home", "text": "Home note (lowest)", "emoji": "\ud83c\udfe0"}
          },
          {
            "id": "p2",
            "left": {"id": "re", "text": "Re", "emoji": "\ud83c\udfb6"},
            "right": {"id": "step2", "text": "Second step up", "emoji": "\ud83d\udc63"}
          },
          {
            "id": "p3",
            "left": {"id": "mi", "text": "Mi", "emoji": "\ud83c\udfb5"},
            "right": {"id": "step3", "text": "Third step up", "emoji": "\u2b50"}
          },
          {
            "id": "p4",
            "left": {"id": "fa", "text": "Fa", "emoji": "\ud83c\udfb6"},
            "right": {"id": "step4", "text": "Fourth step up", "emoji": "\ud83c\udf1f"}
          },
          {
            "id": "p5",
            "left": {"id": "sol", "text": "Sol", "emoji": "\ud83c\udfb5"},
            "right": {"id": "step5", "text": "Fifth step (strong!)", "emoji": "\ud83d\udcaa"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Which solfege note is the HOME note -- the very first and lowest?",
            "options": [
              { "id": "a", "text": "Re" },
              { "id": "b", "text": "Sol" },
              { "id": "c", "text": "Do" },
              { "id": "d", "text": "Mi" }
            ],
            "correctOptionId": "c",
            "hint": "The home note starts the staircase -- it is the very first one: Do!"
          },
          {
            "id": "mc2",
            "prompt": "Put these in order from lowest to highest: Mi, Do, Re. Which comes FIRST?",
            "options": [
              { "id": "a", "text": "Mi" },
              { "id": "b", "text": "Do" },
              { "id": "c", "text": "Re" },
              { "id": "d", "text": "They are all the same" }
            ],
            "correctOptionId": "b",
            "hint": "We always start at the bottom of the staircase. Do is the lowest -- it comes first!"
          },
          {
            "id": "mc3",
            "prompt": "How many solfege notes did we learn in this lesson?",
            "options": [
              { "id": "a", "text": "3" },
              { "id": "b", "text": "4" },
              { "id": "c", "text": "5" },
              { "id": "d", "text": "7" }
            ],
            "correctOptionId": "c",
            "hint": "Count them: Do, Re, Mi, Fa, Sol!"
          },
          {
            "id": "mc4",
            "prompt": "Which solfege note is the HIGHEST we learned?",
            "options": [
              { "id": "a", "text": "Do" },
              { "id": "b", "text": "Fa" },
              { "id": "c", "text": "Mi" },
              { "id": "d", "text": "Sol" }
            ],
            "correctOptionId": "d",
            "hint": "Sol is at the very top of our five-step staircase!"
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
-- LESSON 3: AB Song Form
-- Module: Melody & Form | Skill: Musical Form (AB, ABA)
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000d-4000-8000-000000000001',
  '10000002-0406-4000-8000-000000000001',
  3,
  'AB Song Form',
  'Discover how songs are built with two different sections -- A for the verse and B for the chorus!',
  'Chip just noticed something AWESOME about songs! Most songs have parts that are DIFFERENT from each other. The verse tells the story, and the chorus is the catchy part everyone sings along to! Musicians call the verse "A" and the chorus "B". So a song goes A-B-A-B! It''s like a pattern!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip to learn about the sections of a song!",
        "cards": [
          {
            "id": "fc-section-a",
            "front": "Section A (Verse)",
            "back": "The A section is usually the VERSE. It tells the story and the words often change each time it comes back. Think of it as the part that moves the song forward!"
          },
          {
            "id": "fc-section-b",
            "front": "Section B (Chorus)",
            "back": "The B section is usually the CHORUS. It is the catchy part that stays the SAME every time! This is the part everybody sings along to."
          },
          {
            "id": "fc-ab-form",
            "front": "AB Form",
            "back": "AB form means a song has two different sections. First you hear A (verse), then B (chorus). Some songs repeat the pattern: A-B-A-B! It is like a musical pattern!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "In AB form, what does the letter A usually stand for?",
            "options": [
              { "id": "a", "text": "The chorus" },
              { "id": "b", "text": "The verse" },
              { "id": "c", "text": "The ending" },
              { "id": "d", "text": "The title" }
            ],
            "correctOptionId": "b",
            "hint": "A comes first, just like the verse! The verse tells the story."
          },
          {
            "id": "mc2",
            "prompt": "Which part of a song stays the SAME every time you hear it?",
            "options": [
              { "id": "a", "text": "The verse (A)" },
              { "id": "b", "text": "The introduction" },
              { "id": "c", "text": "The chorus (B)" },
              { "id": "d", "text": "The bridge" }
            ],
            "correctOptionId": "c",
            "hint": "This is the catchy part that everyone sings along to -- it repeats with the same words!"
          },
          {
            "id": "mc3",
            "prompt": "A song goes: Verse, Chorus, Verse, Chorus. What is the pattern?",
            "options": [
              { "id": "a", "text": "A A B B" },
              { "id": "b", "text": "A B A B" },
              { "id": "c", "text": "B A B A" },
              { "id": "d", "text": "A A A A" }
            ],
            "correctOptionId": "b",
            "hint": "Verse = A, Chorus = B. So Verse, Chorus, Verse, Chorus = A B A B!"
          },
          {
            "id": "mc4",
            "prompt": "Why do musicians use letters like A and B for song sections?",
            "options": [
              { "id": "a", "text": "Because music is the same as spelling" },
              { "id": "b", "text": "To show which parts are the same and which are different" },
              { "id": "c", "text": "Because songs only have two notes" },
              { "id": "d", "text": "Because A and B are the only letters in the alphabet" }
            ],
            "correctOptionId": "b",
            "hint": "Using letters helps us see the pattern -- same letters mean the music sounds the same!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each song part to its description!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "section-a", "text": "Section A (Verse)", "emoji": "\ud83d\udcd6"},
            "right": {"id": "story", "text": "Tells the story, words change", "emoji": "\u270d\ufe0f"}
          },
          {
            "id": "p2",
            "left": {"id": "section-b", "text": "Section B (Chorus)", "emoji": "\ud83c\udf89"},
            "right": {"id": "catchy", "text": "Catchy part, words stay the same", "emoji": "\ud83c\udfa4"}
          },
          {
            "id": "p3",
            "left": {"id": "ab-pattern", "text": "AB Form", "emoji": "\ud83c\udfb5"},
            "right": {"id": "two-diff", "text": "Two different sections", "emoji": "\u2702\ufe0f"}
          },
          {
            "id": "p4",
            "left": {"id": "abab-pattern", "text": "ABAB Pattern", "emoji": "\ud83d\udd01"},
            "right": {"id": "repeat", "text": "Verse-Chorus-Verse-Chorus", "emoji": "\ud83c\udfb6"}
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
-- LESSON 4: ABA Song Form
-- Module: Melody & Form | Skill: Musical Form (AB, ABA)
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000e-4000-8000-000000000001',
  '10000002-0406-4000-8000-000000000001',
  4,
  'ABA Song Form',
  'Find the musical sandwich! In ABA form, the first section comes BACK at the end -- like bread on both sides.',
  'Chip found a SANDWICH in music! Not a real sandwich -- a musical one! Some songs start with Section A, go to a different Section B in the middle, and then Section A comes BACK again at the end. A-B-A! It''s like a sandwich: the A is the bread on top and bottom, and B is the yummy filling in the middle!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0007-4000-8000-000000000001']::uuid[],
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
            "prompt": "Put the sections of an ABA song in the right order!",
            "items": [
              { "id": "i-a1", "text": "\ud83c\udfb5 Section A (first time)" },
              { "id": "i-b", "text": "\ud83c\udfb6 Section B (middle, different)" },
              { "id": "i-a2", "text": "\ud83c\udfb5 Section A (comes back!)" }
            ],
            "correctOrder": ["i-a1", "i-b", "i-a2"],
            "hint": "ABA form is like a sandwich -- A is the bread, B is the filling, then A comes back!"
          },
          {
            "id": "seq2",
            "prompt": "Chip is making a musical sandwich! Put the parts in ABA order!",
            "items": [
              { "id": "i-bread-top", "text": "\ud83c\udf5e Top bread (Section A)" },
              { "id": "i-filling", "text": "\ud83e\uddc0 Yummy filling (Section B)" },
              { "id": "i-bread-bottom", "text": "\ud83c\udf5e Bottom bread (Section A returns)" }
            ],
            "correctOrder": ["i-bread-top", "i-filling", "i-bread-bottom"],
            "hint": "A sandwich has bread on top, something different in the middle, and bread again on the bottom!"
          },
          {
            "id": "seq3",
            "prompt": "A song plays: happy melody, sad melody, happy melody again. Put it in order!",
            "items": [
              { "id": "i-happy1", "text": "\ud83d\ude0a Happy melody (A)" },
              { "id": "i-sad", "text": "\ud83d\ude22 Sad melody (B)" },
              { "id": "i-happy2", "text": "\ud83d\ude0a Happy melody returns (A)" }
            ],
            "correctOrder": ["i-happy1", "i-sad", "i-happy2"],
            "hint": "It starts happy, changes to sad in the middle, then the happy melody comes back at the end!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "In ABA form, what happens at the END of the song?",
            "options": [
              { "id": "a", "text": "A brand new section C plays" },
              { "id": "b", "text": "Section B plays again" },
              { "id": "c", "text": "Section A comes BACK" },
              { "id": "d", "text": "The song just stops suddenly" }
            ],
            "correctOptionId": "c",
            "hint": "Look at the letters: A-B-A. The last letter is A -- so Section A returns at the end!"
          },
          {
            "id": "mc2",
            "prompt": "Why is ABA form like a sandwich?",
            "options": [
              { "id": "a", "text": "Because music is made of food" },
              { "id": "b", "text": "Because the same thing (A) is on both sides, with something different (B) in the middle" },
              { "id": "c", "text": "Because you eat while listening to music" },
              { "id": "d", "text": "Because there are three slices of bread" }
            ],
            "correctOptionId": "b",
            "hint": "A sandwich has bread-filling-bread. ABA has A-B-A. The outside parts are the same!"
          },
          {
            "id": "mc3",
            "prompt": "What is the DIFFERENCE between AB form and ABA form?",
            "options": [
              { "id": "a", "text": "AB is louder" },
              { "id": "b", "text": "In ABA, Section A comes back at the end" },
              { "id": "c", "text": "AB has more instruments" },
              { "id": "d", "text": "There is no difference" }
            ],
            "correctOptionId": "b",
            "hint": "AB stops after two sections. ABA brings the first section BACK for a third part!"
          },
          {
            "id": "mc4",
            "prompt": "A lullaby starts gentle, gets a little louder in the middle, then goes back to being gentle. What form is this?",
            "options": [
              { "id": "a", "text": "AB form" },
              { "id": "b", "text": "ABA form" },
              { "id": "c", "text": "BBB form" },
              { "id": "d", "text": "ABC form" }
            ],
            "correctOptionId": "b",
            "hint": "Gentle (A) then different (B) then gentle again (A) = A-B-A!"
          },
          {
            "id": "mc5",
            "prompt": "How many different sections does ABA form have?",
            "options": [
              { "id": "a", "text": "1" },
              { "id": "b", "text": "2" },
              { "id": "c", "text": "3" },
              { "id": "d", "text": "4" }
            ],
            "correctOptionId": "b",
            "hint": "Even though there are THREE parts (A, B, A), there are only TWO different sections -- A and B. The A just repeats!"
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
-- LESSON 5: Compose Your Own Melody
-- Module: Melody & Form | Skills: Melody & Pitch + Musical Form
-- Widgets: fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000005-000f-4000-8000-000000000001',
  '10000002-0406-4000-8000-000000000001',
  5,
  'Compose Your Own Melody',
  'Use everything you learned to build a mini melody! Pick notes, arrange them, and become a real composer.',
  'Chip is SO proud of you! You know about high and low, you can sing Do Re Mi, and you understand how songs are built with sections. Now it''s time to put it all together and become a COMPOSER! A composer is someone who writes music. Let''s write a tiny melody of your very own!',
  NULL, NULL,
  '[]'::jsonb,
  '87ee4010-8b16-4f55-9627-b1961a87e726',
  ARRAY['20000004-0008-4000-8000-000000000001', '20000004-0007-4000-8000-000000000001']::uuid[],
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
            "prompt": "The five solfege notes we learned are Do, Re, Mi, Fa, and ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Sol",
                "acceptableAnswers": ["Sol", "sol", "So", "so", "Soh", "soh"]
              }
            ],
            "hint": "It is the fifth and highest note on our staircase. It starts with S!"
          },
          {
            "id": "fb2",
            "prompt": "A person who writes music is called a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "composer",
                "acceptableAnswers": ["composer", "Composer"]
              }
            ],
            "hint": "This word starts with C and means someone who creates music!"
          },
          {
            "id": "fb3",
            "prompt": "The home note in solfege is called ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Do",
                "acceptableAnswers": ["Do", "do", "Doh", "doh"]
              }
            ],
            "hint": "It is the very first and lowest note. It rhymes with ''go''!"
          },
          {
            "id": "fb4",
            "prompt": "In ABA form, the letter ___ represents the section that comes back at the end.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "A",
                "acceptableAnswers": ["A", "a"]
              }
            ],
            "hint": "Look at A-B-A. Which letter appears at the beginning AND the end?"
          },
          {
            "id": "fb5",
            "prompt": "How high or low a note sounds is called its ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "pitch",
                "acceptableAnswers": ["pitch", "Pitch"]
              }
            ],
            "hint": "This music word starts with P and tells us if a sound is high or low!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Build a melody that goes UP the staircase! Put these solfege notes in order from lowest to highest.",
            "items": [
              { "id": "i-do", "text": "\ud83c\udfb5 Do" },
              { "id": "i-re", "text": "\ud83c\udfb5 Re" },
              { "id": "i-mi", "text": "\ud83c\udfb5 Mi" },
              { "id": "i-sol", "text": "\ud83c\udfb5 Sol" }
            ],
            "correctOrder": ["i-do", "i-re", "i-mi", "i-sol"],
            "hint": "Start at the bottom of the staircase with Do and climb up to Sol!"
          },
          {
            "id": "seq2",
            "prompt": "Now build a melody that goes DOWN! Put these notes from highest to lowest.",
            "items": [
              { "id": "i-sol-d", "text": "\ud83c\udfb5 Sol (highest)" },
              { "id": "i-mi-d", "text": "\ud83c\udfb5 Mi" },
              { "id": "i-re-d", "text": "\ud83c\udfb5 Re" },
              { "id": "i-do-d", "text": "\ud83c\udfb5 Do (lowest)" }
            ],
            "correctOrder": ["i-sol-d", "i-mi-d", "i-re-d", "i-do-d"],
            "hint": "Start at the top with Sol and step down the staircase to Do!"
          },
          {
            "id": "seq3",
            "prompt": "Put together an ABA melody! Arrange these three parts in the right order.",
            "items": [
              { "id": "i-part-a1", "text": "\ud83c\udfb5 Part A: Do Re Mi (going up)" },
              { "id": "i-part-b", "text": "\ud83c\udfb6 Part B: Sol Fa Mi (going down)" },
              { "id": "i-part-a2", "text": "\ud83c\udfb5 Part A returns: Do Re Mi (going up again)" }
            ],
            "correctOrder": ["i-part-a1", "i-part-b", "i-part-a2"],
            "hint": "Remember the musical sandwich! A first, then B in the middle, then A comes back!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "You wrote a melody: Do, Re, Mi, Re, Do. What does this melody do?",
            "options": [
              { "id": "a", "text": "It only goes up" },
              { "id": "b", "text": "It only goes down" },
              { "id": "c", "text": "It goes up and then comes back down" },
              { "id": "d", "text": "It stays on the same note" }
            ],
            "correctOptionId": "c",
            "hint": "Do-Re-Mi goes UP, then Mi-Re-Do goes back DOWN. It is like climbing a hill and coming back!"
          },
          {
            "id": "mc2",
            "prompt": "Which of these would make a good ending note for a melody?",
            "options": [
              { "id": "a", "text": "Do -- the home note" },
              { "id": "b", "text": "Any note that is very loud" },
              { "id": "c", "text": "A rest (silence)" },
              { "id": "d", "text": "The fastest note you can play" }
            ],
            "correctOptionId": "a",
            "hint": "Do is the home note. Ending on Do feels like coming home -- it sounds finished and complete!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
