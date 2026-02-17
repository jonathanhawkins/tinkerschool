-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Coding: Loops & Patterns Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Repeat After Me
--   - Looping Lights
--   - Musical Loops
--   - Count with Loops
--   - Pattern Maker
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, sequence_order, fill_in_blank, matching_pairs
--
-- Subject ID:
--   Coding: 99c7ad43-0481-46b3-ace1-b88f90e6e070
--
-- Module ID:
--   Loops & Patterns: 10000002-0710-4000-8000-000000000001
--
-- Skill IDs:
--   Loops (Repeat):  20000007-0003-4000-8000-000000000001
--   Animation:       20000007-000a-4000-8000-000000000001
--
-- Lesson IDs:
--   1. Repeat After Me:  b2000007-0006-4000-8000-000000000001
--   2. Looping Lights:   b2000007-0007-4000-8000-000000000001
--   3. Musical Loops:    b2000007-0008-4000-8000-000000000001
--   4. Count with Loops: b2000007-0009-4000-8000-000000000001
--   5. Pattern Maker:    b2000007-000a-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             025_seed_1st_grade_problemsolving_coding.sql (Coding subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Coding 2nd Grade: Loops (Repeat), Animation
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000007-0003-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'loops_repeat', 'Loops (Repeat)', 'Understand that loops repeat a set of instructions multiple times to avoid writing the same code over and over', 'CSTA-1B-AP-10', 3),
  ('20000007-000a-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'animation', 'Animation', 'Use loops and timing to create simple animations and repeating visual patterns on a device display', 'CSTA-1B-AP-12', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Coding: Loops & Patterns)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0710-4000-8000-000000000001', 2, 38, 'Loops & Patterns', 'Learn how loops repeat code so you don''t have to! Make blinking lights, repeating melodies, and colorful patterns.', 'repeat', '99c7ad43-0481-46b3-ace1-b88f90e6e070')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- CODING LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Repeat After Me
-- Module: Loops & Patterns | Skill: Loops (Repeat)
-- Widgets: multiple_choice + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0006-4000-8000-000000000001',
  '10000002-0710-4000-8000-000000000001',
  1,
  'Repeat After Me',
  'Use a loop to repeat a display action instead of writing the same code over and over!',
  'Hey coder! Chip here! Imagine you wanted to say "Hello!" on your M5Stick screen 5 times. Would you write the SAME line of code 5 times? That sounds boring AND tiring! What if Chip told you there''s a magic trick in coding called a LOOP that says "do this thing again and again"? Let''s learn how loops save us tons of work!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "You want to display \"Hello!\" on the screen 5 times. Without a loop, how many lines of code would you need to write?",
            "promptEmoji": "\ud83d\udcbb",
            "options": [
              { "id": "a", "text": "1 line", "emoji": "1\ufe0f\u20e3" },
              { "id": "b", "text": "3 lines", "emoji": "3\ufe0f\u20e3" },
              { "id": "c", "text": "5 lines", "emoji": "5\ufe0f\u20e3" },
              { "id": "d", "text": "10 lines", "emoji": "\ud83d\udd1f" }
            ],
            "correctOptionId": "c",
            "hint": "Without a loop, you need to write the same line once for each time you want it to happen!"
          },
          {
            "id": "mc2",
            "prompt": "What does a LOOP do in coding?",
            "promptEmoji": "\ud83d\udd01",
            "options": [
              { "id": "a", "text": "Deletes your code", "emoji": "\u274c" },
              { "id": "b", "text": "Repeats code multiple times", "emoji": "\ud83d\udd04" },
              { "id": "c", "text": "Makes the screen bigger", "emoji": "\ud83d\udda5\ufe0f" },
              { "id": "d", "text": "Turns off the device", "emoji": "\ud83d\udd0c" }
            ],
            "correctOptionId": "b",
            "hint": "A loop is like saying \"do this again\" -- it REPEATS the code inside it!"
          },
          {
            "id": "mc3",
            "prompt": "Which is BETTER: writing \"display Hello\" 5 separate times, or using a loop that repeats it 5 times?",
            "promptEmoji": "\ud83e\udd14",
            "options": [
              { "id": "a", "text": "Writing it 5 times -- more code is always better!", "emoji": "\ud83d\udcdd" },
              { "id": "b", "text": "Using a loop -- it is shorter and easier to change!", "emoji": "\u2b50" },
              { "id": "c", "text": "It does not matter at all", "emoji": "\ud83e\udd37" },
              { "id": "d", "text": "Neither -- you can only display it once", "emoji": "1\ufe0f\u20e3" }
            ],
            "correctOptionId": "b",
            "hint": "Loops make code shorter AND easier to change. Want 100 times instead of 5? Just change one number!"
          },
          {
            "id": "mc4",
            "prompt": "A loop says \"repeat 3 times: beep\". How many beeps will you hear?",
            "promptEmoji": "\ud83d\udd0a",
            "options": [
              { "id": "a", "text": "1 beep", "emoji": "\ud83d\udd08" },
              { "id": "b", "text": "2 beeps", "emoji": "\ud83d\udd09" },
              { "id": "c", "text": "3 beeps", "emoji": "\ud83d\udd0a" },
              { "id": "d", "text": "0 beeps", "emoji": "\ud83d\udd07" }
            ],
            "correctOptionId": "c",
            "hint": "The loop says repeat 3 times, so the beep happens 3 times!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put these steps in order to display \"Hello!\" 5 times using a loop!",
        "items": [
          {"id": "i1", "text": "Start the program", "emoji": "\ud83d\udcbb", "correctPosition": 1},
          {"id": "i2", "text": "Begin a loop that repeats 5 times", "emoji": "\ud83d\udd01", "correctPosition": 2},
          {"id": "i3", "text": "Display \"Hello!\" on the screen", "emoji": "\ud83d\udcf1", "correctPosition": 3},
          {"id": "i4", "text": "The loop goes back to repeat", "emoji": "\ud83d\udd04", "correctPosition": 4},
          {"id": "i5", "text": "Loop is done after 5 times -- program ends", "emoji": "\u2705", "correctPosition": 5}
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "What happens inside this loop? Put the steps in order: \"repeat 3 times: show smiley, wait, clear screen\"",
        "items": [
          {"id": "i1", "text": "Show a smiley face on the screen", "emoji": "\ud83d\ude0a", "correctPosition": 1},
          {"id": "i2", "text": "Wait for 1 second", "emoji": "\u23f3", "correctPosition": 2},
          {"id": "i3", "text": "Clear the screen", "emoji": "\ud83e\uddf9", "correctPosition": 3},
          {"id": "i4", "text": "Go back and repeat (until done 3 times)", "emoji": "\ud83d\udd04", "correctPosition": 4}
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "A loop lets you ___ code without writing it over and over.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "repeat",
                "acceptableAnswers": ["repeat", "Repeat", "reuse", "Reuse"]
              }
            ],
            "hint": "Loops do the same thing again and again -- they RE____ code!"
          },
          {
            "id": "fb2",
            "prompt": "\"Repeat 5 times: show Hello\" will display Hello exactly ___ times.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "5",
                "acceptableAnswers": ["5", "five", "Five"]
              }
            ],
            "hint": "The loop says repeat 5 times -- so that is exactly how many!"
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
-- LESSON 2: Looping Lights
-- Module: Loops & Patterns | Skill: Loops (Repeat), Animation
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0007-4000-8000-000000000001',
  '10000002-0710-4000-8000-000000000001',
  2,
  'Looping Lights',
  'Use a loop to blink an LED on and off -- no more writing the same code 10 times!',
  'Chip has a bright idea -- literally! You know the LED light on your M5Stick? What if we made it blink on and off like a firefly? We could write "LED on, wait, LED off, wait" ten times... OR we could use a LOOP and write it just ONCE! Let''s make some looping lights!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0003-4000-8000-000000000001', '20000007-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "To make an LED blink, what two things do you need to repeat?",
            "promptEmoji": "\ud83d\udca1",
            "options": [
              { "id": "a", "text": "Turn LED on, then turn LED off", "emoji": "\ud83d\udca1" },
              { "id": "b", "text": "Turn LED on, then delete the code", "emoji": "\u274c" },
              { "id": "c", "text": "Turn LED off, then turn it off again", "emoji": "\ud83d\udd0c" },
              { "id": "d", "text": "Wait, then wait some more", "emoji": "\u23f3" }
            ],
            "correctOptionId": "a",
            "hint": "Blinking means the light goes ON then OFF, ON then OFF -- two actions that repeat!"
          },
          {
            "id": "mc2",
            "prompt": "Why do we add a \"wait\" between turning the LED on and off?",
            "promptEmoji": "\u23f0",
            "options": [
              { "id": "a", "text": "The code needs a break", "emoji": "\ud83d\ude34" },
              { "id": "b", "text": "So we can actually SEE the blink -- without waiting it happens too fast!", "emoji": "\ud83d\udc41\ufe0f" },
              { "id": "c", "text": "The LED will break without waiting", "emoji": "\ud83d\udca5" },
              { "id": "d", "text": "Waiting makes the LED brighter", "emoji": "\u2728" }
            ],
            "correctOptionId": "b",
            "hint": "Computers are SUPER fast! Without a wait, the light turns on and off so quickly you can''t even see it!"
          },
          {
            "id": "mc3",
            "prompt": "A loop says: \"repeat 10 times: LED on, wait, LED off, wait\". How many times will the LED blink?",
            "promptEmoji": "\ud83d\udd22",
            "options": [
              { "id": "a", "text": "1 time", "emoji": "1\ufe0f\u20e3" },
              { "id": "b", "text": "5 times", "emoji": "5\ufe0f\u20e3" },
              { "id": "c", "text": "10 times", "emoji": "\ud83d\udd1f" },
              { "id": "d", "text": "20 times", "emoji": "\ud83d\udcaf" }
            ],
            "correctOptionId": "c",
            "hint": "Each time through the loop, the LED goes on then off -- that is 1 blink. The loop repeats 10 times!"
          },
          {
            "id": "mc4",
            "prompt": "You want the LED to blink FASTER. What should you change?",
            "promptEmoji": "\u26a1",
            "options": [
              { "id": "a", "text": "Make the wait time SHORTER", "emoji": "\ud83c\udfc3" },
              { "id": "b", "text": "Make the wait time LONGER", "emoji": "\ud83d\udc22" },
              { "id": "c", "text": "Remove the loop", "emoji": "\u274c" },
              { "id": "d", "text": "Add more LEDs", "emoji": "\ud83d\udca1\ud83d\udca1" }
            ],
            "correctOptionId": "a",
            "hint": "Shorter waits mean less time between on and off -- the blinking speeds up!"
          },
          {
            "id": "mc5",
            "prompt": "Without a loop, how many lines would you need to blink an LED 10 times? (Each blink needs: LED on, wait, LED off, wait)",
            "promptEmoji": "\ud83d\udcdd",
            "options": [
              { "id": "a", "text": "4 lines", "emoji": "4\ufe0f\u20e3" },
              { "id": "b", "text": "10 lines", "emoji": "\ud83d\udd1f" },
              { "id": "c", "text": "20 lines", "emoji": "\ud83d\ude31" },
              { "id": "d", "text": "40 lines", "emoji": "\ud83e\udd2f" }
            ],
            "correctOptionId": "d",
            "hint": "Each blink is 4 lines (on, wait, off, wait). 10 blinks times 4 lines each = 40 lines! Loops are way better!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "To make the LED blink, we turn it ___, wait, then turn it off.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "on",
                "acceptableAnswers": ["on", "On", "ON"]
              }
            ],
            "hint": "First the light goes ___ (it lights up!), then we wait, then it goes off."
          },
          {
            "id": "fb2",
            "prompt": "A loop that says \"repeat 10 times\" will run the code inside it ___ times.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "10",
                "acceptableAnswers": ["10", "ten", "Ten"]
              }
            ],
            "hint": "The number after \"repeat\" tells the loop exactly how many times to go!"
          },
          {
            "id": "fb3",
            "prompt": "We add a ___ between turning the LED on and off so we can see the blink.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "wait",
                "acceptableAnswers": ["wait", "Wait", "pause", "Pause", "delay", "Delay"]
              }
            ],
            "hint": "Without this, the computer goes too fast and we can''t see the light change!"
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
-- LESSON 3: Musical Loops
-- Module: Loops & Patterns | Skill: Loops (Repeat), Animation
-- Widgets: matching_pairs + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0008-4000-8000-000000000001',
  '10000002-0710-4000-8000-000000000001',
  3,
  'Musical Loops',
  'Use a loop to play a repeating melody -- make your M5Stick sing the same tune over and over!',
  'Chip LOVES music! Have you ever noticed that songs repeat parts over and over? The chorus comes back again and again! That''s just like a LOOP in coding! Today we''re going to use a loop to play a 4-note melody that repeats 3 times on the M5Stick buzzer. Let''s make some music with loops!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0003-4000-8000-000000000001', '20000007-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each music idea to how it works with loops in coding!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "chorus", "text": "A song chorus that repeats", "emoji": "\ud83c\udfb5"},
            "right": {"id": "loop", "text": "Like a loop in coding", "emoji": "\ud83d\udd01"}
          },
          {
            "id": "p2",
            "left": {"id": "notes", "text": "Play 4 notes, then play them again", "emoji": "\ud83c\udfb6"},
            "right": {"id": "repeat2", "text": "A loop that repeats 2 times", "emoji": "2\ufe0f\u20e3"}
          },
          {
            "id": "p3",
            "left": {"id": "clap3", "text": "Clap-clap-clap, clap-clap-clap, clap-clap-clap", "emoji": "\ud83d\udc4f"},
            "right": {"id": "repeat3", "text": "A loop that repeats 3 times", "emoji": "3\ufe0f\u20e3"}
          },
          {
            "id": "p4",
            "left": {"id": "forever", "text": "An alarm that never stops ringing", "emoji": "\ud83d\udea8"},
            "right": {"id": "infinite", "text": "A loop that repeats forever", "emoji": "\u267e\ufe0f"}
          },
          {
            "id": "p5",
            "left": {"id": "once", "text": "A doorbell that dings once", "emoji": "\ud83d\udeaa"},
            "right": {"id": "noloop", "text": "No loop needed -- just one time", "emoji": "1\ufe0f\u20e3"}
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put these steps in order to play a 4-note melody 3 times using a loop!",
        "items": [
          {"id": "i1", "text": "Start the program", "emoji": "\ud83d\udcbb", "correctPosition": 1},
          {"id": "i2", "text": "Begin a loop: repeat 3 times", "emoji": "\ud83d\udd01", "correctPosition": 2},
          {"id": "i3", "text": "Play note 1 (Do)", "emoji": "\ud83c\udfb5", "correctPosition": 3},
          {"id": "i4", "text": "Play note 2 (Re), note 3 (Mi), note 4 (Fa)", "emoji": "\ud83c\udfb6", "correctPosition": 4},
          {"id": "i5", "text": "Loop goes back and plays the melody again", "emoji": "\ud83d\udd04", "correctPosition": 5},
          {"id": "i6", "text": "After 3 times, the loop ends", "emoji": "\u2705", "correctPosition": 6}
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "A melody has 3 notes: beep-boop-bop. Put them in order to play the melody TWICE!",
        "items": [
          {"id": "i1", "text": "Beep", "emoji": "\ud83d\udd0a", "correctPosition": 1},
          {"id": "i2", "text": "Boop", "emoji": "\ud83c\udfb5", "correctPosition": 2},
          {"id": "i3", "text": "Bop", "emoji": "\ud83c\udfb6", "correctPosition": 3},
          {"id": "i4", "text": "Beep (loop starts over!)", "emoji": "\ud83d\udd04", "correctPosition": 4},
          {"id": "i5", "text": "Boop", "emoji": "\ud83c\udfb5", "correctPosition": 5},
          {"id": "i6", "text": "Bop (loop done!)", "emoji": "\u2705", "correctPosition": 6}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "A loop plays a 4-note melody 3 times. How many total notes will you hear?",
            "promptEmoji": "\ud83c\udfb5",
            "options": [
              { "id": "a", "text": "3 notes", "emoji": "3\ufe0f\u20e3" },
              { "id": "b", "text": "4 notes", "emoji": "4\ufe0f\u20e3" },
              { "id": "c", "text": "7 notes", "emoji": "7\ufe0f\u20e3" },
              { "id": "d", "text": "12 notes", "emoji": "\ud83c\udfb6" }
            ],
            "correctOptionId": "d",
            "hint": "4 notes played 3 times: 4 + 4 + 4 = 12 notes total!"
          },
          {
            "id": "mc2",
            "prompt": "How is a song chorus like a loop?",
            "promptEmoji": "\ud83c\udfa4",
            "options": [
              { "id": "a", "text": "Both play once and never come back", "emoji": "\ud83d\udc4b" },
              { "id": "b", "text": "Both repeat the same thing multiple times", "emoji": "\ud83d\udd01" },
              { "id": "c", "text": "Both are always silent", "emoji": "\ud83e\udd2b" },
              { "id": "d", "text": "They have nothing in common", "emoji": "\ud83e\udd37" }
            ],
            "correctOptionId": "b",
            "hint": "A chorus comes back again and again in a song, just like a loop repeats code!"
          },
          {
            "id": "mc3",
            "prompt": "You want the melody to play 5 times instead of 3. What do you change in the loop?",
            "promptEmoji": "\ud83d\udd27",
            "options": [
              { "id": "a", "text": "Add more notes to the melody", "emoji": "\ud83c\udfb6" },
              { "id": "b", "text": "Delete the loop", "emoji": "\u274c" },
              { "id": "c", "text": "Change the repeat number from 3 to 5", "emoji": "5\ufe0f\u20e3" },
              { "id": "d", "text": "Make the notes louder", "emoji": "\ud83d\udd0a" }
            ],
            "correctOptionId": "c",
            "hint": "The number in the loop controls how many times it repeats. Just change that one number!"
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
-- LESSON 4: Count with Loops
-- Module: Loops & Patterns | Skill: Loops (Repeat)
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0009-4000-8000-000000000001',
  '10000002-0710-4000-8000-000000000001',
  4,
  'Count with Loops',
  'Display numbers 1 to 10 using a loop and a counting variable -- let the loop do the counting!',
  'Here''s a cool trick, coder! Loops can COUNT for you! Imagine you have a little box called a VARIABLE. The box starts with the number 1 inside it. Each time the loop repeats, the number goes up by 1. So it counts 1, 2, 3, 4... all the way to 10! The loop does all the work. Let''s try it!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0003-4000-8000-000000000001']::uuid[],
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
            "prompt": "A variable is like a ___ that holds a number or word inside it.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "box",
                "acceptableAnswers": ["box", "Box", "container", "Container"]
              }
            ],
            "hint": "Think of something you can put things inside -- like a treasure chest or a little ___!"
          },
          {
            "id": "fb2",
            "prompt": "If a variable starts at 1 and the loop adds 1 each time, after 3 loops the variable equals ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "4",
                "acceptableAnswers": ["4", "four", "Four"]
              }
            ],
            "hint": "Start at 1, then add 1 three times: 1 + 1 = 2, 2 + 1 = 3, 3 + 1 = ___"
          },
          {
            "id": "fb3",
            "prompt": "To count from 1 to 10, the loop needs to repeat ___ times.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "10",
                "acceptableAnswers": ["10", "ten", "Ten"]
              }
            ],
            "hint": "We need to display each number from 1 to 10. That is 10 numbers, so 10 repeats!"
          },
          {
            "id": "fb4",
            "prompt": "Each time through the loop, the counter variable goes up by ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "We are counting 1, 2, 3, 4... each number is just 1 more than the last!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What is a VARIABLE in coding?",
            "promptEmoji": "\ud83d\udce6",
            "options": [
              { "id": "a", "text": "A type of loop", "emoji": "\ud83d\udd01" },
              { "id": "b", "text": "A named box that stores a value (like a number)", "emoji": "\ud83d\udce6" },
              { "id": "c", "text": "A button on the M5Stick", "emoji": "\ud83d\udd18" },
              { "id": "d", "text": "A way to delete code", "emoji": "\u274c" }
            ],
            "correctOptionId": "b",
            "hint": "Think of a variable as a labeled box. You give it a name and put a value inside!"
          },
          {
            "id": "mc2",
            "prompt": "A loop counts from 1 to 10 and displays each number. What will the screen show LAST?",
            "promptEmoji": "\ud83d\udcf1",
            "options": [
              { "id": "a", "text": "1", "emoji": "1\ufe0f\u20e3" },
              { "id": "b", "text": "5", "emoji": "5\ufe0f\u20e3" },
              { "id": "c", "text": "9", "emoji": "9\ufe0f\u20e3" },
              { "id": "d", "text": "10", "emoji": "\ud83d\udd1f" }
            ],
            "correctOptionId": "d",
            "hint": "The loop starts at 1 and counts up. The very LAST number before it stops is..."
          },
          {
            "id": "mc3",
            "prompt": "A variable named \"count\" starts at 1. The loop adds 2 each time. After 3 loops, what is \"count\"?",
            "promptEmoji": "\u2795",
            "options": [
              { "id": "a", "text": "3", "emoji": "3\ufe0f\u20e3" },
              { "id": "b", "text": "5", "emoji": "5\ufe0f\u20e3" },
              { "id": "c", "text": "6", "emoji": "6\ufe0f\u20e3" },
              { "id": "d", "text": "7", "emoji": "7\ufe0f\u20e3" }
            ],
            "correctOptionId": "d",
            "hint": "Start at 1. Add 2: now it is 3. Add 2 more: now it is 5. Add 2 more: now it is 7!"
          },
          {
            "id": "mc4",
            "prompt": "Why is using a loop with a counter variable better than writing display(1), display(2), display(3)... all the way to display(10)?",
            "promptEmoji": "\ud83d\udcaa",
            "options": [
              { "id": "a", "text": "It is not better -- writing each line is easier", "emoji": "\ud83d\udcdd" },
              { "id": "b", "text": "The loop is shorter and you can easily change how high it counts", "emoji": "\u2b50" },
              { "id": "c", "text": "Loops make the numbers bigger", "emoji": "\ud83d\udcc8" },
              { "id": "d", "text": "You can only display numbers with loops", "emoji": "\ud83d\udd22" }
            ],
            "correctOptionId": "b",
            "hint": "With a loop, counting to 100 is just as easy as counting to 10 -- change one number!"
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
-- LESSON 5: Pattern Maker
-- Module: Loops & Patterns | Skill: Loops (Repeat), Animation
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000a-4000-8000-000000000001',
  '10000002-0710-4000-8000-000000000001',
  5,
  'Pattern Maker',
  'Use a loop to draw a repeating color pattern across the M5Stick screen -- stripes, stripes, stripes!',
  'Time to make ART with code! Chip wants to fill the M5Stick screen with colorful stripes. We''ll draw a red stripe, then a blue stripe, then a green stripe -- and then do it all over again using a LOOP! The loop will repeat our 3-color pattern across the whole screen. It''s like a rainbow factory powered by loops!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0003-4000-8000-000000000001', '20000007-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "prompt": "Put these steps in order to draw repeating red-blue-green stripes using a loop!",
        "items": [
          {"id": "i1", "text": "Start the program", "emoji": "\ud83d\udcbb", "correctPosition": 1},
          {"id": "i2", "text": "Begin a loop: repeat 4 times", "emoji": "\ud83d\udd01", "correctPosition": 2},
          {"id": "i3", "text": "Draw a RED stripe", "emoji": "\ud83d\udfe5", "correctPosition": 3},
          {"id": "i4", "text": "Draw a BLUE stripe", "emoji": "\ud83d\udfe6", "correctPosition": 4},
          {"id": "i5", "text": "Draw a GREEN stripe", "emoji": "\ud83d\udfe9", "correctPosition": 5},
          {"id": "i6", "text": "Move to the next position and loop again", "emoji": "\ud83d\udd04", "correctPosition": 6}
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "You see this pattern on screen: red, blue, red, blue, red, blue. What happened in the code? Put the loop steps in order!",
        "items": [
          {"id": "i1", "text": "Set loop to repeat 3 times", "emoji": "\ud83d\udd01", "correctPosition": 1},
          {"id": "i2", "text": "Draw a red stripe", "emoji": "\ud83d\udfe5", "correctPosition": 2},
          {"id": "i3", "text": "Draw a blue stripe", "emoji": "\ud83d\udfe6", "correctPosition": 3},
          {"id": "i4", "text": "Loop repeats until done", "emoji": "\u2705", "correctPosition": 4}
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "To change from red-blue stripes to red-blue-yellow stripes, what order do you put the drawing steps?",
        "items": [
          {"id": "i1", "text": "Draw RED", "emoji": "\ud83d\udfe5", "correctPosition": 1},
          {"id": "i2", "text": "Draw BLUE", "emoji": "\ud83d\udfe6", "correctPosition": 2},
          {"id": "i3", "text": "Draw YELLOW", "emoji": "\ud83d\udfe8", "correctPosition": 3}
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "A loop that draws red-blue-green stripes 4 times will make ___ total stripes.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "12",
                "acceptableAnswers": ["12", "twelve", "Twelve"]
              }
            ],
            "hint": "3 colors drawn 4 times: 3 + 3 + 3 + 3 = ___"
          },
          {
            "id": "fb2",
            "prompt": "A pattern that goes red, blue, red, blue, red, blue uses a loop that repeats ___ times.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "3",
                "acceptableAnswers": ["3", "three", "Three"]
              }
            ],
            "hint": "Count how many times you see the red-blue pair: red-blue (1), red-blue (2), red-blue (3)!"
          },
          {
            "id": "fb3",
            "prompt": "To change the pattern colors, you change the code INSIDE the ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "loop",
                "acceptableAnswers": ["loop", "Loop"]
              }
            ],
            "hint": "The repeating part of the code lives inside this thing that starts with L!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "You see this pattern on the screen: red, green, red, green, red, green, red, green. The loop repeats how many times?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              { "id": "a", "text": "2 times", "emoji": "2\ufe0f\u20e3" },
              { "id": "b", "text": "4 times", "emoji": "4\ufe0f\u20e3" },
              { "id": "c", "text": "8 times", "emoji": "8\ufe0f\u20e3" },
              { "id": "d", "text": "1 time", "emoji": "1\ufe0f\u20e3" }
            ],
            "correctOptionId": "b",
            "hint": "The pattern is red-green. Count the pairs: red-green appears 4 times!"
          },
          {
            "id": "mc2",
            "prompt": "What makes loops PERFECT for drawing patterns?",
            "promptEmoji": "\u2728",
            "options": [
              { "id": "a", "text": "Patterns repeat, and loops repeat -- they are a perfect match!", "emoji": "\ud83e\udde9" },
              { "id": "b", "text": "Loops can only draw patterns, nothing else", "emoji": "\ud83d\udcdd" },
              { "id": "c", "text": "You cannot make patterns without loops", "emoji": "\u274c" },
              { "id": "d", "text": "Loops make the colors brighter", "emoji": "\ud83c\udf08" }
            ],
            "correctOptionId": "a",
            "hint": "Patterns are all about repetition, and that is exactly what loops do best!"
          },
          {
            "id": "mc3",
            "prompt": "You want wider stripes. What should you change?",
            "promptEmoji": "\u2194\ufe0f",
            "options": [
              { "id": "a", "text": "Change the stripe width inside the loop", "emoji": "\ud83d\udccf" },
              { "id": "b", "text": "Add more loops", "emoji": "\ud83d\udd01" },
              { "id": "c", "text": "Use fewer colors", "emoji": "\ud83c\udfa8" },
              { "id": "d", "text": "Delete the loop", "emoji": "\u274c" }
            ],
            "correctOptionId": "a",
            "hint": "The width of each stripe is set inside the loop. Make it bigger for wider stripes!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
