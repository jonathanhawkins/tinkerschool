-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Coding: Creative Projects Module (Capstone)
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Digital Pet
--   - Reaction Timer
--   - Secret Message
--   - Simon Says
--   - My Invention
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, matching_pairs, sequence_order, fill_in_blank
--
-- Subject ID:
--   Coding: 99c7ad43-0481-46b3-ace1-b88f90e6e070
--
-- Module ID:
--   Creative Projects: 10000002-0713-4000-8000-000000000001
--
-- Skill IDs:
--   Debugging:               20000007-0009-4000-8000-000000000001 (sort_order: 9)
--   Sequences & Order:       20000007-0001-4000-8000-000000000001 (sort_order: 1)
--   Display Text & Graphics: 20000007-0002-4000-8000-000000000001 (sort_order: 2)
--
-- Lesson IDs:
--   Digital Pet:      b2000007-0015-4000-8000-000000000001
--   Reaction Timer:   b2000007-0016-4000-8000-000000000001
--   Secret Message:   b2000007-0017-4000-8000-000000000001
--   Simon Says:       b2000007-0018-4000-8000-000000000001
--   My Invention:     b2000007-0019-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             025_seed_1st_grade_problemsolving_coding.sql (Coding subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Coding 2nd Grade: Debugging, Sequences & Order,
--                                 Display Text & Graphics
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000007-0009-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'debugging', 'Debugging', 'Find and fix mistakes in code by reading carefully and testing step by step', 'CSTA-1B-AP-11', 9),
  ('20000007-0001-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'sequences_order', 'Sequences & Order', 'Arrange instructions in the correct order so a program runs properly', 'CSTA-1A-AP-09', 1),
  ('20000007-0002-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'display_text_graphics', 'Display Text & Graphics', 'Use code to show text, pictures, and colors on a screen', 'CSTA-1A-AP-10', 2)
ON CONFLICT ON CONSTRAINT skills_subject_id_slug_key DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Coding: Creative Projects -- Capstone)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0713-4000-8000-000000000001', 2, 41, 'Creative Projects', 'Combine everything you''ve learned to build amazing programs! Create a digital pet, a reaction timer, a secret message encoder, and more.', 'sparkles', '99c7ad43-0481-46b3-ace1-b88f90e6e070')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- CODING LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Digital Pet
-- Module: Creative Projects | Skills: Sequences & Order, Display Text & Graphics
-- Widgets: multiple_choice + matching_pairs + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0015-4000-8000-000000000001',
  '10000002-0713-4000-8000-000000000001',
  1,
  'Digital Pet',
  'Create a simple pet with needs like feeding and playing! Watch its mood change based on how you care for it.',
  'Chip is SO excited for this one! We''re going to build a DIGITAL PET that lives inside your device! Your pet will have feelings -- it can be happy, hungry, or bored. You''ll use buttons to feed it and play with it, and its face will change to show how it feels. It''s like having a tiny friend in your pocket! Let''s bring our pet to life!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0001-4000-8000-000000000001','20000007-0002-4000-8000-000000000001']::uuid[],
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
            "prompt": "Your digital pet is hungry! What should happen when you press the FEED button?",
            "promptEmoji": "🐱",
            "options": [
              {"id": "a", "text": "The pet goes to sleep", "emoji": "😴"},
              {"id": "b", "text": "The pet''s hunger goes down and it shows a happy face", "emoji": "😊"},
              {"id": "c", "text": "The pet disappears from the screen", "emoji": "👻"},
              {"id": "d", "text": "Nothing happens", "emoji": "❓"}
            ],
            "correctOptionId": "b",
            "hint": "When you eat food, you stop being hungry and feel better! Your pet works the same way."
          },
          {
            "id": "mc2",
            "prompt": "What is a VARIABLE in our pet program?",
            "promptEmoji": "📦",
            "options": [
              {"id": "a", "text": "A box that stores information, like how hungry the pet is", "emoji": "📦"},
              {"id": "b", "text": "A type of pet food", "emoji": "🍖"},
              {"id": "c", "text": "The color of the screen", "emoji": "🎨"},
              {"id": "d", "text": "A button on the device", "emoji": "🔘"}
            ],
            "correctOptionId": "a",
            "hint": "A variable is like a labeled box -- it holds a value that can change. We use one to track the pet''s mood!"
          },
          {
            "id": "mc3",
            "prompt": "Your pet has been waiting a long time without food or play. What mood should it show?",
            "promptEmoji": "⏰",
            "options": [
              {"id": "a", "text": "Super happy with a big smile", "emoji": "😁"},
              {"id": "b", "text": "Sad or upset because it needs attention", "emoji": "😢"},
              {"id": "c", "text": "It doesn''t matter -- moods never change", "emoji": "😐"},
              {"id": "d", "text": "Excited and jumping around", "emoji": "🤩"}
            ],
            "correctOptionId": "b",
            "hint": "If nobody feeds or plays with a pet for a long time, it gets sad. Our program checks how long it''s been!"
          },
          {
            "id": "mc4",
            "prompt": "Which coding concept helps the pet check IF it is hungry?",
            "promptEmoji": "🤔",
            "options": [
              {"id": "a", "text": "A loop -- it repeats forever", "emoji": "🔄"},
              {"id": "b", "text": "A conditional -- IF hungry THEN show sad face", "emoji": "🔀"},
              {"id": "c", "text": "A variable -- it stores a number", "emoji": "📦"},
              {"id": "d", "text": "A display -- it shows text on screen", "emoji": "📺"}
            ],
            "correctOptionId": "b",
            "hint": "We need to CHECK something and then DO something based on the answer. That''s an IF statement!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each pet mood to what the screen should display!",
        "pairs": [
          {
            "id": "pair1",
            "left": {"id": "l1", "text": "Happy pet", "emoji": "😊"},
            "right": {"id": "r1", "text": "Big smiley face on screen", "emoji": "😃"}
          },
          {
            "id": "pair2",
            "left": {"id": "l2", "text": "Hungry pet", "emoji": "🍽️"},
            "right": {"id": "r2", "text": "Sad face with open mouth", "emoji": "😮"}
          },
          {
            "id": "pair3",
            "left": {"id": "l3", "text": "Bored pet", "emoji": "😑"},
            "right": {"id": "r3", "text": "Sleepy face with ZZZ", "emoji": "😴"}
          },
          {
            "id": "pair4",
            "left": {"id": "l4", "text": "Just fed", "emoji": "🍖"},
            "right": {"id": "r4", "text": "Heart eyes face", "emoji": "😍"}
          },
          {
            "id": "pair5",
            "left": {"id": "l5", "text": "Just played", "emoji": "🎮"},
            "right": {"id": "r5", "text": "Excited bouncing face", "emoji": "🤩"}
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put the steps in order to make the digital pet respond to the FEED button!",
        "items": [
          {"id": "s1", "text": "Wait for the player to press Button A (Feed)", "emoji": "🔘", "correctPosition": 1},
          {"id": "s2", "text": "Check: Is the pet hungry?", "emoji": "🤔", "correctPosition": 2},
          {"id": "s3", "text": "If yes, reduce the hunger number", "emoji": "📉", "correctPosition": 3},
          {"id": "s4", "text": "Change the pet''s face to happy", "emoji": "😊", "correctPosition": 4},
          {"id": "s5", "text": "Display the new face on screen", "emoji": "📺", "correctPosition": 5}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Reaction Timer
-- Module: Creative Projects | Skills: Sequences & Order, Display Text & Graphics
-- Widgets: multiple_choice + fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0016-4000-8000-000000000001',
  '10000002-0713-4000-8000-000000000001',
  2,
  'Reaction Timer',
  'Measure how fast you can press a button after seeing "GO!" on the screen. Can you beat your best time?',
  'Hey speedster! Chip has a challenge for you -- how FAST are your reflexes? We''re going to build a reaction timer game! The screen will say "WAIT..." and then suddenly flash "GO!" -- and you have to press the button as FAST as you can! The program will measure exactly how long it took you in milliseconds. That''s thousandths of a second! Ready to test your speed?',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0001-4000-8000-000000000001','20000007-0002-4000-8000-000000000001']::uuid[],
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
            "prompt": "In our reaction timer, what should the screen show FIRST?",
            "promptEmoji": "📺",
            "options": [
              {"id": "a", "text": "GO!", "emoji": "🟢"},
              {"id": "b", "text": "WAIT...", "emoji": "🔴"},
              {"id": "c", "text": "Your score", "emoji": "🏆"},
              {"id": "d", "text": "Nothing at all", "emoji": "⬛"}
            ],
            "correctOptionId": "b",
            "hint": "The player needs to wait before they can react. First we show them to get ready!"
          },
          {
            "id": "mc2",
            "prompt": "Why does the program wait a RANDOM amount of time before showing GO?",
            "promptEmoji": "🎲",
            "options": [
              {"id": "a", "text": "Because the device is slow", "emoji": "🐌"},
              {"id": "b", "text": "So the player can''t just guess when to press", "emoji": "🤫"},
              {"id": "c", "text": "Because random numbers are fun", "emoji": "🎉"},
              {"id": "d", "text": "It doesn''t matter when GO appears", "emoji": "🤷"}
            ],
            "correctOptionId": "b",
            "hint": "If GO always appeared after the same time, you could just count and press early. Random keeps it fair!"
          },
          {
            "id": "mc3",
            "prompt": "A variable stores the time when GO appeared, and another stores when the button was pressed. How do we find the reaction time?",
            "promptEmoji": "🧮",
            "options": [
              {"id": "a", "text": "Add the two times together", "emoji": "➕"},
              {"id": "b", "text": "Subtract: button time minus GO time", "emoji": "➖"},
              {"id": "c", "text": "Multiply the two times", "emoji": "✖️"},
              {"id": "d", "text": "Just use the button time", "emoji": "⏱️"}
            ],
            "correctOptionId": "b",
            "hint": "Reaction time is how long BETWEEN the two events. Subtracting gives us the difference!"
          },
          {
            "id": "mc4",
            "prompt": "What should happen if someone presses the button BEFORE ''GO!'' appears?",
            "promptEmoji": "🚫",
            "options": [
              {"id": "a", "text": "Count it as a super fast time", "emoji": "⚡"},
              {"id": "b", "text": "Show ''Too early! Try again'' and restart", "emoji": "🔄"},
              {"id": "c", "text": "End the game forever", "emoji": "❌"},
              {"id": "d", "text": "Ignore the button press completely", "emoji": "😶"}
            ],
            "correctOptionId": "b",
            "hint": "Pressing before GO is cheating! A good program catches this and gives a friendly do-over."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "The reaction timer measures time in ___, which are thousandths of a second.",
            "correctAnswer": "milliseconds",
            "acceptableAnswers": ["milliseconds", "Milliseconds", "ms"],
            "hint": "Milli means one-thousandth. A second has 1000 of these!",
            "wordBank": ["milliseconds", "minutes", "hours", "meters"]
          },
          {
            "id": "f2",
            "template": "To make the wait time different each round, we use a ___ number.",
            "correctAnswer": "random",
            "acceptableAnswers": ["random", "Random"],
            "hint": "This type of number is unpredictable -- you never know what it will be!",
            "wordBank": ["random", "same", "big", "small"]
          },
          {
            "id": "f3",
            "template": "We store the start time and end time in ___ so we can subtract them later.",
            "correctAnswer": "variables",
            "acceptableAnswers": ["variables", "Variables", "a variable", "variable"],
            "hint": "These are like labeled boxes that hold values in our program!",
            "wordBank": ["variables", "buttons", "screens", "colors"]
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put the reaction timer steps in the correct order!",
        "items": [
          {"id": "s1", "text": "Display WAIT... on the screen", "emoji": "🔴", "correctPosition": 1},
          {"id": "s2", "text": "Wait a random amount of time", "emoji": "⏳", "correctPosition": 2},
          {"id": "s3", "text": "Display GO! and save the start time", "emoji": "🟢", "correctPosition": 3},
          {"id": "s4", "text": "Wait for the player to press the button", "emoji": "🔘", "correctPosition": 4},
          {"id": "s5", "text": "Calculate reaction time and show the result", "emoji": "🏆", "correctPosition": 5}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Secret Message
-- Module: Creative Projects | Skills: Display Text & Graphics, Debugging
-- Widgets: matching_pairs + fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0017-4000-8000-000000000001',
  '10000002-0713-4000-8000-000000000001',
  3,
  'Secret Message',
  'Encode and decode secret messages using a simple code! Press a button to reveal the hidden message.',
  'Psssst! Chip has a SECRET to tell you! Did you know that people have been sending hidden messages for THOUSANDS of years? Spies, kings, and even kids have used secret codes! Today we''re going to build a program that can ENCODE a message (turn it into a secret code) and DECODE it (turn it back to normal). Press Button A to see the secret, press Button B to hide it again!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0002-4000-8000-000000000001','20000007-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "In our simple code, each letter shifts forward by 1! Match the coded letter to the real letter.",
        "pairs": [
          {
            "id": "pair1",
            "left": {"id": "l1", "text": "B (coded)", "emoji": "🔒"},
            "right": {"id": "r1", "text": "A (real)", "emoji": "🔓"}
          },
          {
            "id": "pair2",
            "left": {"id": "l2", "text": "D (coded)", "emoji": "🔒"},
            "right": {"id": "r2", "text": "C (real)", "emoji": "🔓"}
          },
          {
            "id": "pair3",
            "left": {"id": "l3", "text": "I (coded)", "emoji": "🔒"},
            "right": {"id": "r3", "text": "H (real)", "emoji": "🔓"}
          },
          {
            "id": "pair4",
            "left": {"id": "l4", "text": "J (coded)", "emoji": "🔒"},
            "right": {"id": "r4", "text": "I (real)", "emoji": "🔓"}
          },
          {
            "id": "pair5",
            "left": {"id": "l5", "text": "Q (coded)", "emoji": "🔒"},
            "right": {"id": "r5", "text": "P (real)", "emoji": "🔓"}
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "Turning a normal message into a secret code is called ___.",
            "correctAnswer": "encoding",
            "acceptableAnswers": ["encoding", "Encoding", "encode", "Encode"],
            "hint": "This word starts with E and means putting a message INTO code!",
            "wordBank": ["encoding", "deleting", "printing", "copying"]
          },
          {
            "id": "f2",
            "template": "Turning a secret code back into a normal message is called ___.",
            "correctAnswer": "decoding",
            "acceptableAnswers": ["decoding", "Decoding", "decode", "Decode"],
            "hint": "This word starts with D and means taking a message OUT of code!",
            "wordBank": ["decoding", "breaking", "hiding", "reading"]
          },
          {
            "id": "f3",
            "template": "If each letter shifts forward by 1, the coded word for HI is ___.",
            "correctAnswer": "IJ",
            "acceptableAnswers": ["IJ", "ij", "Ij"],
            "hint": "H becomes I (one letter forward) and I becomes J (one letter forward)!",
            "wordBank": ["IJ", "GH", "HI", "JK"]
          },
          {
            "id": "f4",
            "template": "We use a ___ to store whether the message is showing the coded or decoded version.",
            "correctAnswer": "variable",
            "acceptableAnswers": ["variable", "Variable"],
            "hint": "It''s like a box that remembers which state the message is in right now!",
            "wordBank": ["variable", "button", "screen", "letter"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "In our program, Button A decodes the secret message. What should Button B do?",
            "promptEmoji": "🔘",
            "options": [
              {"id": "a", "text": "Turn off the device", "emoji": "⚫"},
              {"id": "b", "text": "Encode the message back to the secret version", "emoji": "🔒"},
              {"id": "c", "text": "Delete the message forever", "emoji": "🗑️"},
              {"id": "d", "text": "Make the text bigger", "emoji": "🔍"}
            ],
            "correctOptionId": "b",
            "hint": "If Button A reveals the secret, Button B should hide it again!"
          },
          {
            "id": "mc2",
            "prompt": "Your coded message shows ''IFMMP'' but should say ''HELLO''. Each letter shifted forward by 1. Is the code working correctly?",
            "promptEmoji": "🐛",
            "options": [
              {"id": "a", "text": "No, the code is broken", "emoji": "❌"},
              {"id": "b", "text": "Yes! H→I, E→F, L→M, L→M, O→P -- that''s correct!", "emoji": "✅"},
              {"id": "c", "text": "Only some letters are right", "emoji": "🤷"},
              {"id": "d", "text": "There''s no way to tell", "emoji": "❓"}
            ],
            "correctOptionId": "b",
            "hint": "Check each letter: H+1=I, E+1=F, L+1=M, L+1=M, O+1=P. Does IFMMP match?"
          },
          {
            "id": "mc3",
            "prompt": "Why is it important to TEST your secret message program?",
            "promptEmoji": "🧪",
            "options": [
              {"id": "a", "text": "Testing is not important for simple programs", "emoji": "🚫"},
              {"id": "b", "text": "To make sure encoding and decoding give back the original message", "emoji": "✅"},
              {"id": "c", "text": "Only professional programmers need to test", "emoji": "👔"},
              {"id": "d", "text": "The device tests itself automatically", "emoji": "🤖"}
            ],
            "correctOptionId": "b",
            "hint": "If you encode a message and then decode it, you should get the SAME message back. Testing checks this!"
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
-- LESSON 4: Simon Says
-- Module: Creative Projects | Skills: Sequences & Order, Debugging
-- Widgets: sequence_order + multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0018-4000-8000-000000000001',
  '10000002-0713-4000-8000-000000000001',
  4,
  'Simon Says',
  'Remember and repeat a sequence of beeps and lights! The pattern gets longer each round -- how far can you go?',
  'Time for a memory challenge! Chip LOVES this game! Simon Says is a classic -- the device plays a pattern of beeps and lights, and YOU have to repeat it back using the buttons. Each round, the pattern gets ONE note longer! It starts easy: beep! But soon it''s beep-boop-beep-boop-beep! Your program needs to remember the whole sequence and check if the player gets it right. Let''s build it!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0001-4000-8000-000000000001','20000007-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "prompt": "Put the Simon Says game steps in the correct order!",
        "items": [
          {"id": "s1", "text": "The program creates a random sequence of tones", "emoji": "🎵", "correctPosition": 1},
          {"id": "s2", "text": "The device plays the tone sequence for the player", "emoji": "🔊", "correctPosition": 2},
          {"id": "s3", "text": "The player repeats the sequence using buttons", "emoji": "🔘", "correctPosition": 3},
          {"id": "s4", "text": "The program checks if the player got it right", "emoji": "✅", "correctPosition": 4},
          {"id": "s5", "text": "If correct, add one more tone and repeat!", "emoji": "➕", "correctPosition": 5}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "In Simon Says, the pattern gets longer each round. What coding concept stores the growing list of tones?",
            "promptEmoji": "📋",
            "options": [
              {"id": "a", "text": "A single variable that holds one number", "emoji": "1️⃣"},
              {"id": "b", "text": "A list (or array) that can hold many items", "emoji": "📋"},
              {"id": "c", "text": "The screen display", "emoji": "📺"},
              {"id": "d", "text": "A button press", "emoji": "🔘"}
            ],
            "correctOptionId": "b",
            "hint": "We need to store a SEQUENCE of tones -- that means a list that keeps growing!"
          },
          {
            "id": "mc2",
            "prompt": "The player presses: beep, boop, beep. But the correct pattern was: beep, beep, boop. What happened?",
            "promptEmoji": "🐛",
            "options": [
              {"id": "a", "text": "The player got it right!", "emoji": "🎉"},
              {"id": "b", "text": "The player made a mistake -- the ORDER was wrong", "emoji": "🔀"},
              {"id": "c", "text": "The device is broken", "emoji": "💥"},
              {"id": "d", "text": "It doesn''t matter what order you press", "emoji": "🤷"}
            ],
            "correctOptionId": "b",
            "hint": "In Simon Says, the ORDER matters! The same notes in a different order is still wrong."
          },
          {
            "id": "mc3",
            "prompt": "What should the program do when the player makes a mistake?",
            "promptEmoji": "❌",
            "options": [
              {"id": "a", "text": "Immediately turn off the device", "emoji": "⚫"},
              {"id": "b", "text": "Show the score, play a sad sound, and offer to try again", "emoji": "🔄"},
              {"id": "c", "text": "Pretend the mistake didn''t happen", "emoji": "🙈"},
              {"id": "d", "text": "Delete the whole game", "emoji": "🗑️"}
            ],
            "correctOptionId": "b",
            "hint": "Good games are kind when you lose! Show the score and let the player try again."
          },
          {
            "id": "mc4",
            "prompt": "Each round adds a new random tone to the sequence. What coding concept repeats this process?",
            "promptEmoji": "🔄",
            "options": [
              {"id": "a", "text": "A loop -- it keeps going round after round", "emoji": "🔄"},
              {"id": "b", "text": "A display block -- it shows text", "emoji": "📺"},
              {"id": "c", "text": "A variable -- it stores a number", "emoji": "📦"},
              {"id": "d", "text": "Nothing -- each round is coded separately", "emoji": "📝"}
            ],
            "correctOptionId": "a",
            "hint": "The game repeats: play pattern → get input → check → add tone → repeat. That''s a loop!"
          },
          {
            "id": "mc5",
            "prompt": "How does the program know which button the player pressed?",
            "promptEmoji": "🔘",
            "options": [
              {"id": "a", "text": "It reads the player''s mind", "emoji": "🧠"},
              {"id": "b", "text": "An event detects which button was pressed", "emoji": "👆"},
              {"id": "c", "text": "The player tells the computer with their voice", "emoji": "🗣️"},
              {"id": "d", "text": "The program just guesses", "emoji": "🎲"}
            ],
            "correctOptionId": "b",
            "hint": "Events are how programs notice things happening -- like a button being pressed!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each Simon Says game feature to the coding concept it uses!",
        "pairs": [
          {
            "id": "pair1",
            "left": {"id": "l1", "text": "Storing the tone pattern", "emoji": "📋"},
            "right": {"id": "r1", "text": "List (array)", "emoji": "📝"}
          },
          {
            "id": "pair2",
            "left": {"id": "l2", "text": "Playing each round again", "emoji": "🔄"},
            "right": {"id": "r2", "text": "Loop", "emoji": "🔁"}
          },
          {
            "id": "pair3",
            "left": {"id": "l3", "text": "Checking if the answer is correct", "emoji": "✅"},
            "right": {"id": "r3", "text": "Conditional (IF statement)", "emoji": "🔀"}
          },
          {
            "id": "pair4",
            "left": {"id": "l4", "text": "Detecting a button press", "emoji": "🔘"},
            "right": {"id": "r4", "text": "Event", "emoji": "👆"}
          },
          {
            "id": "pair5",
            "left": {"id": "l5", "text": "Keeping track of the score", "emoji": "🏆"},
            "right": {"id": "r5", "text": "Variable", "emoji": "📦"}
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
-- LESSON 5: My Invention
-- Module: Creative Projects | Skills: Sequences & Order, Display Text & Graphics, Debugging
-- Widgets: multiple_choice + fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0019-4000-8000-000000000001',
  '10000002-0713-4000-8000-000000000001',
  5,
  'My Invention',
  'Design your very own program from scratch! Combine variables, loops, events, and display to create something amazing.',
  'THIS IS IT! The big finale! Chip is SO proud of everything you''ve learned. You know about variables, loops, conditionals, events, display, debugging, and SO much more! Now it''s time to put it ALL together and invent YOUR OWN program! Maybe it''s a game, a tool, a musical instrument, or something nobody has ever thought of before. The only limit is your imagination! Let''s plan your masterpiece!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0001-4000-8000-000000000001','20000007-0002-4000-8000-000000000001','20000007-0009-4000-8000-000000000001']::uuid[],
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
            "prompt": "What is the FIRST step when creating your own program?",
            "promptEmoji": "💡",
            "options": [
              {"id": "a", "text": "Start dragging blocks randomly and hope it works", "emoji": "🎲"},
              {"id": "b", "text": "Plan what your program will do before you start coding", "emoji": "📝"},
              {"id": "c", "text": "Copy someone else''s program exactly", "emoji": "📋"},
              {"id": "d", "text": "Ask the computer to write it for you", "emoji": "🤖"}
            ],
            "correctOptionId": "b",
            "hint": "Every great invention starts with a plan! Think about what you want to build first."
          },
          {
            "id": "mc2",
            "prompt": "You want your invention to keep track of a score. Which coding concept do you need?",
            "promptEmoji": "🏆",
            "options": [
              {"id": "a", "text": "A variable to store the score number", "emoji": "📦"},
              {"id": "b", "text": "A loop that runs once", "emoji": "🔄"},
              {"id": "c", "text": "Just display the number 0 forever", "emoji": "0️⃣"},
              {"id": "d", "text": "You can''t track scores in code", "emoji": "🚫"}
            ],
            "correctOptionId": "a",
            "hint": "A variable is perfect for storing a number that changes -- like a score going up!"
          },
          {
            "id": "mc3",
            "prompt": "Your invention plays a sound when Button A is pressed. Which TWO concepts are you using?",
            "promptEmoji": "🔊",
            "options": [
              {"id": "a", "text": "Events (button press) and output (play sound)", "emoji": "👆🔊"},
              {"id": "b", "text": "Loops and variables", "emoji": "🔄📦"},
              {"id": "c", "text": "Just a display block", "emoji": "📺"},
              {"id": "d", "text": "Only a variable", "emoji": "📦"}
            ],
            "correctOptionId": "a",
            "hint": "The button press is an EVENT, and the sound is OUTPUT. Two concepts working together!"
          },
          {
            "id": "mc4",
            "prompt": "Your program doesn''t work on the first try. What should you do?",
            "promptEmoji": "🐛",
            "options": [
              {"id": "a", "text": "Give up -- it''s too hard", "emoji": "😞"},
              {"id": "b", "text": "Delete everything and start over from scratch", "emoji": "🗑️"},
              {"id": "c", "text": "Debug! Read the code step by step to find the mistake", "emoji": "🔍"},
              {"id": "d", "text": "Blame the device for being broken", "emoji": "💢"}
            ],
            "correctOptionId": "c",
            "hint": "Real programmers debug all the time! Read each step carefully to find where things go wrong."
          },
          {
            "id": "mc5",
            "prompt": "What makes a program GREAT?",
            "promptEmoji": "⭐",
            "options": [
              {"id": "a", "text": "Using as many blocks as possible", "emoji": "🧱"},
              {"id": "b", "text": "Making it do what YOU imagined, and it''s fun or useful", "emoji": "🌟"},
              {"id": "c", "text": "Copying exactly what a famous programmer made", "emoji": "📋"},
              {"id": "d", "text": "Using only one type of block", "emoji": "1️⃣"}
            ],
            "correctOptionId": "b",
            "hint": "The best programs are ones that do what the creator imagined! Your ideas are what make it special."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "Before coding, I should make a ___ for what my program will do.",
            "correctAnswer": "plan",
            "acceptableAnswers": ["plan", "Plan", "design", "Design"],
            "hint": "This is the first step before you start building anything!",
            "wordBank": ["plan", "mess", "guess", "copy"]
          },
          {
            "id": "f2",
            "template": "To store information that changes, like a score, I use a ___.",
            "correctAnswer": "variable",
            "acceptableAnswers": ["variable", "Variable"],
            "hint": "It''s like a labeled box that holds a value that can go up or down!",
            "wordBank": ["variable", "button", "screen", "speaker"]
          },
          {
            "id": "f3",
            "template": "When my code has a mistake, I need to ___ it by reading the code carefully.",
            "correctAnswer": "debug",
            "acceptableAnswers": ["debug", "Debug", "fix", "Fix"],
            "hint": "This word means finding and fixing errors. It starts with D!",
            "wordBank": ["debug", "delete", "ignore", "restart"]
          },
          {
            "id": "f4",
            "template": "If I want something to happen again and again, I use a ___.",
            "correctAnswer": "loop",
            "acceptableAnswers": ["loop", "Loop"],
            "hint": "This coding concept repeats instructions over and over like a circle!",
            "wordBank": ["loop", "stop", "sound", "color"]
          },
          {
            "id": "f5",
            "template": "To check IF something is true and then do something, I use a ___.",
            "correctAnswer": "conditional",
            "acceptableAnswers": ["conditional", "Conditional", "if statement", "If statement", "if", "If"],
            "hint": "IF this is true, THEN do that. This is called a... it starts with C!",
            "wordBank": ["conditional", "variable", "loop", "display"]
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put the steps for creating your own invention in the correct order!",
        "items": [
          {"id": "s1", "text": "Think of an idea and plan what it will do", "emoji": "💡", "correctPosition": 1},
          {"id": "s2", "text": "Decide which coding concepts you need (variables, loops, events, etc.)", "emoji": "🧩", "correctPosition": 2},
          {"id": "s3", "text": "Build the program step by step using blocks", "emoji": "🧱", "correctPosition": 3},
          {"id": "s4", "text": "Test the program and debug any mistakes", "emoji": "🐛", "correctPosition": 4},
          {"id": "s5", "text": "Share your invention and celebrate!", "emoji": "🎉", "correctPosition": 5}
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
