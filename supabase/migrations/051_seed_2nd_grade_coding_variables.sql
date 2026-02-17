-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Coding: Variables & Data Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - My Score Counter
--   - Name Tag Maker
--   - Random Surprise
--   - Timer Countdown
--   - High Score Tracker
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, fill_in_blank, matching_pairs, sequence_order
--
-- Subject ID:
--   Coding: 99c7ad43-0481-46b3-ace1-b88f90e6e070
--
-- Module ID:
--   Variables & Data: 10000002-0712-4000-8000-000000000001
--
-- Skill IDs:
--   Variables (Data Storage): 20000007-0006-4000-8000-000000000001
--   Sound & Buzzer:           20000007-0008-4000-8000-000000000001
--
-- Lesson IDs:
--   My Score Counter:    b2000007-0010-4000-8000-000000000001
--   Name Tag Maker:      b2000007-0011-4000-8000-000000000001
--   Random Surprise:     b2000007-0012-4000-8000-000000000001
--   Timer Countdown:     b2000007-0013-4000-8000-000000000001
--   High Score Tracker:  b2000007-0014-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             025_seed_1st_grade_problemsolving_coding.sql (Coding subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Coding 2nd Grade: Variables (Data Storage), Sound & Buzzer
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000007-0006-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'variables_data_storage', 'Variables (Data Storage)', 'Understand that variables are named containers that store and update information in a program', 'CSTA:1B-AP-09', 6),
  ('20000007-0008-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'sound_buzzer', 'Sound & Buzzer', 'Use buzzer and sound commands to create audio feedback in programs', 'CSTA:1B-AP-10', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Coding: Variables & Data)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0712-4000-8000-000000000001', 2, 40, 'Variables & Data', 'Learn about variables -- special containers that store numbers, words, and more! Build counters, name tags, and timers.', 'variable', '99c7ad43-0481-46b3-ace1-b88f90e6e070')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- CODING LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: My Score Counter
-- Module: Variables & Data | Skill: Variables (Data Storage)
-- Widgets: multiple_choice + fill_in_blank
-- Device: Display score number; Button A adds 1, screen updates
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0010-4000-8000-000000000001',
  '10000002-0712-4000-8000-000000000001',
  1,
  'My Score Counter',
  'Use a variable to count button presses! Every time you press the button, the score goes up by one.',
  'Hey there, coder! Chip here! Have you ever played a game where you keep score? Like counting how many baskets you make or how many jumping jacks you do? Well, today we''re going to learn about something SUPER important in coding called a VARIABLE. A variable is like a special box with a name on it -- you can put a number inside, take it out, or change it whenever you want! We''re going to make a score counter that goes up every time you press a button. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sc-mc1",
            "prompt": "What is a variable in coding?",
            "promptEmoji": "📦",
            "options": [
              { "id": "a", "text": "A type of computer", "emoji": "💻" },
              { "id": "b", "text": "A named box that stores information", "emoji": "📦" },
              { "id": "c", "text": "A button on the screen", "emoji": "🔘" },
              { "id": "d", "text": "A drawing tool", "emoji": "🖌️" }
            ],
            "correctOptionId": "b",
            "hint": "Think of a box with a label on it -- you can put things inside and take them out!"
          },
          {
            "id": "sc-mc2",
            "prompt": "If a variable called ''score'' starts at 0, and you add 1 three times, what number is in the box now?",
            "promptEmoji": "🔢",
            "options": [
              { "id": "a", "text": "0", "emoji": "0️⃣" },
              { "id": "b", "text": "1", "emoji": "1️⃣" },
              { "id": "c", "text": "3", "emoji": "3️⃣" },
              { "id": "d", "text": "10", "emoji": "🔟" }
            ],
            "correctOptionId": "c",
            "hint": "Start at 0, then: 0 + 1 = 1, 1 + 1 = 2, 2 + 1 = ?"
          },
          {
            "id": "sc-mc3",
            "prompt": "Why do we give variables a NAME like ''score'' instead of just saying ''the number''?",
            "promptEmoji": "🏷️",
            "options": [
              { "id": "a", "text": "Because names make the code easier to understand", "emoji": "✅" },
              { "id": "b", "text": "Because the computer likes names", "emoji": "🤖" },
              { "id": "c", "text": "Because numbers are boring", "emoji": "😴" },
              { "id": "d", "text": "Because you have to", "emoji": "🤷" }
            ],
            "correctOptionId": "a",
            "hint": "If you had 10 boxes, how would you know which one has the score? By reading the name on the box!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "sc-fb1",
            "prompt": "A variable is like a ___ that holds information.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "box",
                "acceptableAnswers": ["box", "Box", "container", "Container"]
              }
            ],
            "hint": "Think of something you put things inside -- it has a label on it!"
          },
          {
            "id": "sc-fb2",
            "prompt": "If score = 5 and we add 1, the new score is ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "6",
                "acceptableAnswers": ["6"]
              }
            ],
            "hint": "5 plus 1 equals..."
          },
          {
            "id": "sc-fb3",
            "prompt": "When we first create a score counter, we usually start it at ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "0",
                "acceptableAnswers": ["0", "zero", "Zero"]
              }
            ],
            "hint": "Before anyone scores any points, the score is..."
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
-- LESSON 2: Name Tag Maker
-- Module: Variables & Data | Skill: Variables (Data Storage)
-- Widgets: fill_in_blank + matching_pairs
-- Device: Display personalized name tag on screen
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0011-4000-8000-000000000001',
  '10000002-0712-4000-8000-000000000001',
  2,
  'Name Tag Maker',
  'Store your name in a variable and display it on screen! Learn that variables can hold words, not just numbers.',
  'Guess what, coder? Variables aren''t just for numbers! They can hold WORDS too! Think about a name tag -- you know, the sticker that says "Hello, my name is..." on it? Well, today we''re going to make a digital name tag! We''ll store your name inside a variable and then display it on the M5Stick screen. The cool part is, you can change the name in the variable and the screen updates automatically. It''s like magic!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "nt-fb1",
            "prompt": "Variables can store numbers AND ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "words",
                "acceptableAnswers": ["words", "Words", "text", "Text", "letters", "Letters", "names", "Names"]
              }
            ],
            "hint": "Think about what you would store in a variable called ''name'' -- it wouldn''t be a number!"
          },
          {
            "id": "nt-fb2",
            "prompt": "A variable called ''name'' that stores ''Cassidy'' is holding a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "word",
                "acceptableAnswers": ["word", "Word", "name", "Name", "text", "Text", "string", "String"]
              }
            ],
            "hint": "''Cassidy'' is not a number -- it''s a..."
          },
          {
            "id": "nt-fb3",
            "prompt": "If we change the ''name'' variable from ''Cassidy'' to ''Chip'', the screen will show ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "Chip",
                "acceptableAnswers": ["Chip", "chip"]
              }
            ],
            "hint": "The screen always shows whatever is stored in the variable right now!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each variable name to what it would store!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "var-name", "text": "name", "emoji": "🏷️"},
            "right": {"id": "val-cassidy", "text": "Cassidy", "emoji": "👧"}
          },
          {
            "id": "p2",
            "left": {"id": "var-age", "text": "age", "emoji": "🎂"},
            "right": {"id": "val-7", "text": "7", "emoji": "7️⃣"}
          },
          {
            "id": "p3",
            "left": {"id": "var-color", "text": "favorite_color", "emoji": "🎨"},
            "right": {"id": "val-purple", "text": "purple", "emoji": "💜"}
          },
          {
            "id": "p4",
            "left": {"id": "var-pet", "text": "pet_name", "emoji": "🐾"},
            "right": {"id": "val-buddy", "text": "Buddy", "emoji": "🐕"}
          },
          {
            "id": "p5",
            "left": {"id": "var-grade", "text": "grade", "emoji": "🏫"},
            "right": {"id": "val-2nd", "text": "2", "emoji": "2️⃣"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "nt-mc1",
            "prompt": "Which of these is the BEST name for a variable that stores someone''s favorite food?",
            "promptEmoji": "🍕",
            "options": [
              { "id": "a", "text": "x", "emoji": "❌" },
              { "id": "b", "text": "favorite_food", "emoji": "✅" },
              { "id": "c", "text": "number7", "emoji": "7️⃣" },
              { "id": "d", "text": "thing", "emoji": "❓" }
            ],
            "correctOptionId": "b",
            "hint": "A good variable name tells you exactly what''s inside -- like a label on a box!"
          },
          {
            "id": "nt-mc2",
            "prompt": "What happens when you change the value inside a variable?",
            "promptEmoji": "🔄",
            "options": [
              { "id": "a", "text": "The old value stays and you get two values", "emoji": "2️⃣" },
              { "id": "b", "text": "The old value is replaced by the new value", "emoji": "✅" },
              { "id": "c", "text": "Nothing happens", "emoji": "😐" },
              { "id": "d", "text": "The variable breaks", "emoji": "💥" }
            ],
            "correctOptionId": "b",
            "hint": "Imagine erasing a name on a whiteboard and writing a new one. The old name is gone!"
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
-- LESSON 3: Random Surprise
-- Module: Variables & Data | Skills: Variables (Data Storage), Sound & Buzzer
-- Widgets: multiple_choice + sequence_order
-- Device: Button press shows random emoji and plays random tone
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0012-4000-8000-000000000001',
  '10000002-0712-4000-8000-000000000001',
  3,
  'Random Surprise',
  'Use a random number stored in a variable to pick a surprise display and sound! Every press is different!',
  'Chip LOVES surprises! What if every time you pressed a button, something DIFFERENT happened? Maybe a star appears, or a heart, or a smiley face -- and you never know which one you''ll get! That''s what RANDOM numbers do in coding. The computer picks a number it can''t even predict, and we store it in a variable. Then we use that number to choose what shows on screen and what sound plays. Let''s build a surprise machine!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0006-4000-8000-000000000001', '20000007-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "rs-mc1",
            "prompt": "What does ''random'' mean in coding?",
            "promptEmoji": "🎲",
            "options": [
              { "id": "a", "text": "The computer always picks the same number", "emoji": "1️⃣" },
              { "id": "b", "text": "The computer picks a number you can''t predict", "emoji": "🎲" },
              { "id": "c", "text": "The computer picks the biggest number", "emoji": "💯" },
              { "id": "d", "text": "The computer turns off", "emoji": "📴" }
            ],
            "correctOptionId": "b",
            "hint": "Random is like rolling a dice -- you never know what number you''ll get!"
          },
          {
            "id": "rs-mc2",
            "prompt": "If a random number picks 1, 2, or 3, and each number shows a different emoji, what stores the picked number?",
            "promptEmoji": "📦",
            "options": [
              { "id": "a", "text": "The screen", "emoji": "📱" },
              { "id": "b", "text": "A variable", "emoji": "📦" },
              { "id": "c", "text": "A button", "emoji": "🔘" },
              { "id": "d", "text": "The buzzer", "emoji": "🔊" }
            ],
            "correctOptionId": "b",
            "hint": "We need a named box to hold the random number so we can check what it is!"
          },
          {
            "id": "rs-mc3",
            "prompt": "You press the button and the random variable picks 2. You press again and it picks 2 again. Is that possible?",
            "promptEmoji": "🤔",
            "options": [
              { "id": "a", "text": "No, random never repeats", "emoji": "❌" },
              { "id": "b", "text": "Yes! Random means any number can come up each time", "emoji": "✅" },
              { "id": "c", "text": "No, it always goes in order: 1, 2, 3", "emoji": "📋" },
              { "id": "d", "text": "Only if the battery is low", "emoji": "🔋" }
            ],
            "correctOptionId": "b",
            "hint": "Random is like flipping a coin -- you can get heads twice in a row!"
          },
          {
            "id": "rs-mc4",
            "prompt": "Why do we store the random number in a variable before using it?",
            "promptEmoji": "💡",
            "options": [
              { "id": "a", "text": "So we can check the number and decide what to do", "emoji": "✅" },
              { "id": "b", "text": "Because the computer forgets numbers", "emoji": "🧠" },
              { "id": "c", "text": "To make the number bigger", "emoji": "📈" },
              { "id": "d", "text": "There is no reason", "emoji": "🤷" }
            ],
            "correctOptionId": "a",
            "hint": "We need to save the number in our box so we can look at it and decide: show a star? A heart? A smiley?"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "rs-so1",
            "prompt": "Put these steps in order to make a random surprise happen when you press a button!",
            "items": [
              {"id": "i1", "text": "Wait for button press", "correctPosition": 1},
              {"id": "i2", "text": "Pick a random number", "correctPosition": 2},
              {"id": "i3", "text": "Store it in a variable", "correctPosition": 3},
              {"id": "i4", "text": "Check what the number is", "correctPosition": 4},
              {"id": "i5", "text": "Show the matching emoji and play a sound", "correctPosition": 5}
            ],
            "hint": "First you wait, then pick a number, save it, look at it, and finally show the result!"
          },
          {
            "id": "rs-so2",
            "prompt": "Put these steps in order to create a variable and give it a random value!",
            "items": [
              {"id": "i1", "text": "Create a variable called ''surprise''", "correctPosition": 1},
              {"id": "i2", "text": "Set ''surprise'' to a random number (1, 2, or 3)", "correctPosition": 2},
              {"id": "i3", "text": "Display the value of ''surprise'' on screen", "correctPosition": 3}
            ],
            "hint": "First create the box, then put a random number in it, then show what''s inside!"
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
-- LESSON 4: Timer Countdown
-- Module: Variables & Data | Skills: Variables (Data Storage), Sound & Buzzer
-- Widgets: fill_in_blank + multiple_choice
-- Device: Display countdown with buzzer beep each second
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0013-4000-8000-000000000001',
  '10000002-0712-4000-8000-000000000001',
  4,
  'Timer Countdown',
  'Build a countdown timer that uses a variable! Watch the number go from 10 down to 0 with a beep each second.',
  'Ready for liftoff? Chip loves countdowns! You know, like when a rocket launches: 10... 9... 8... 7... all the way to ZERO and then BLAST OFF! We''re going to build our own countdown timer using a variable. The variable starts at 10, and every second it goes DOWN by 1. Plus, the buzzer beeps each time the number changes! This is a great way to see how a variable can CHANGE over time. Let''s count down together!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0006-4000-8000-000000000001', '20000007-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "tc-fb1",
            "prompt": "In a countdown timer, the variable starts at 10 and goes ___ by 1 each second.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "down",
                "acceptableAnswers": ["down", "Down"]
              }
            ],
            "hint": "10, 9, 8, 7... the numbers are getting smaller. They are going..."
          },
          {
            "id": "tc-fb2",
            "prompt": "If the timer variable is 7, after subtracting 1 it becomes ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "6",
                "acceptableAnswers": ["6"]
              }
            ],
            "hint": "7 minus 1 equals..."
          },
          {
            "id": "tc-fb3",
            "prompt": "The countdown stops when the timer variable reaches ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "0",
                "acceptableAnswers": ["0", "zero", "Zero"]
              }
            ],
            "hint": "After 1 comes the very last number in a countdown... blast off!"
          },
          {
            "id": "tc-fb4",
            "prompt": "Subtracting 1 from a variable is the ___ of adding 1.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "opposite",
                "acceptableAnswers": ["opposite", "Opposite", "reverse", "Reverse"]
              }
            ],
            "hint": "Adding makes numbers bigger, subtracting makes them smaller. They go in different directions!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tc-mc1",
            "prompt": "What does it mean to ''subtract 1'' from a variable?",
            "promptEmoji": "➖",
            "options": [
              { "id": "a", "text": "Make the number 1 bigger", "emoji": "📈" },
              { "id": "b", "text": "Make the number 1 smaller", "emoji": "📉" },
              { "id": "c", "text": "Delete the variable", "emoji": "🗑️" },
              { "id": "d", "text": "Set the variable to 1", "emoji": "1️⃣" }
            ],
            "correctOptionId": "b",
            "hint": "Subtract means take away. If you have 10 and subtract 1, you get 9!"
          },
          {
            "id": "tc-mc2",
            "prompt": "The timer starts at 10. After 4 seconds of counting down (subtracting 1 each second), what number does the variable show?",
            "promptEmoji": "⏱️",
            "options": [
              { "id": "a", "text": "4", "emoji": "4️⃣" },
              { "id": "b", "text": "14", "emoji": "🔢" },
              { "id": "c", "text": "6", "emoji": "6️⃣" },
              { "id": "d", "text": "0", "emoji": "0️⃣" }
            ],
            "correctOptionId": "c",
            "hint": "Start at 10 and count down 4 times: 10, 9, 8, 7, ..."
          },
          {
            "id": "tc-mc3",
            "prompt": "Why does the buzzer beep each second during the countdown?",
            "promptEmoji": "🔊",
            "options": [
              { "id": "a", "text": "Because the device is broken", "emoji": "🔧" },
              { "id": "b", "text": "To give audio feedback so you can hear the countdown", "emoji": "✅" },
              { "id": "c", "text": "Because buzzers always beep nonstop", "emoji": "🔔" },
              { "id": "d", "text": "To make the timer go faster", "emoji": "⚡" }
            ],
            "correctOptionId": "b",
            "hint": "Sound helps you know something is happening even if you''re not looking at the screen!"
          },
          {
            "id": "tc-mc4",
            "prompt": "A variable that changes from 10 to 0 is an example of a variable that...",
            "promptEmoji": "🔄",
            "options": [
              { "id": "a", "text": "Never changes", "emoji": "🔒" },
              { "id": "b", "text": "Changes over time", "emoji": "✅" },
              { "id": "c", "text": "Stores a word", "emoji": "📝" },
              { "id": "d", "text": "Only holds the number 10", "emoji": "🔟" }
            ],
            "correctOptionId": "b",
            "hint": "The number in the variable goes from 10 all the way down to 0 -- it keeps changing!"
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
-- LESSON 5: High Score Tracker
-- Module: Variables & Data | Skill: Variables (Data Storage)
-- Widgets: multiple_choice + fill_in_blank + sequence_order
-- Device: Display current score vs best score
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-0014-4000-8000-000000000001',
  '10000002-0712-4000-8000-000000000001',
  5,
  'High Score Tracker',
  'Track and compare scores using TWO variables! Learn to compare numbers and update the best score.',
  'You know what makes games EXTRA fun? Trying to beat your best score! Chip once got 15 points in a game, and then tried SO hard to get 16. Today we''re leveling up -- we''re going to use TWO variables at the same time! One variable tracks your CURRENT score, and another variable remembers your BEST score ever. When your current score is higher than your best, the best score updates. This is how real video games work! Pretty cool, right?',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "hs-mc1",
            "prompt": "To track a high score, how many variables do we need?",
            "promptEmoji": "🏆",
            "options": [
              { "id": "a", "text": "One -- just the current score", "emoji": "1️⃣" },
              { "id": "b", "text": "Two -- current score AND best score", "emoji": "✅" },
              { "id": "c", "text": "Ten -- one for each number", "emoji": "🔟" },
              { "id": "d", "text": "Zero -- you don''t need variables", "emoji": "0️⃣" }
            ],
            "correctOptionId": "b",
            "hint": "You need one box for the score right now and another box to remember the best score ever!"
          },
          {
            "id": "hs-mc2",
            "prompt": "Current score is 8 and best score is 5. What should happen?",
            "promptEmoji": "📊",
            "options": [
              { "id": "a", "text": "Nothing changes", "emoji": "😐" },
              { "id": "b", "text": "Best score updates to 8 because 8 is bigger than 5", "emoji": "🏆" },
              { "id": "c", "text": "Current score changes to 5", "emoji": "📉" },
              { "id": "d", "text": "Both scores become 0", "emoji": "0️⃣" }
            ],
            "correctOptionId": "b",
            "hint": "Is 8 bigger than 5? If current score beats the best score, we have a new best score!"
          },
          {
            "id": "hs-mc3",
            "prompt": "Current score is 3 and best score is 10. What should happen?",
            "promptEmoji": "🤔",
            "options": [
              { "id": "a", "text": "Best score changes to 3", "emoji": "3️⃣" },
              { "id": "b", "text": "Current score changes to 10", "emoji": "🔟" },
              { "id": "c", "text": "Best score stays at 10 because 3 is not higher", "emoji": "✅" },
              { "id": "d", "text": "Both variables are deleted", "emoji": "🗑️" }
            ],
            "correctOptionId": "c",
            "hint": "Is 3 bigger than 10? Nope! So the best score doesn''t change -- it keeps the bigger number."
          },
          {
            "id": "hs-mc4",
            "prompt": "What does ''comparing'' two variables mean?",
            "promptEmoji": "⚖️",
            "options": [
              { "id": "a", "text": "Adding them together", "emoji": "➕" },
              { "id": "b", "text": "Checking which one is bigger, smaller, or equal", "emoji": "✅" },
              { "id": "c", "text": "Deleting one of them", "emoji": "🗑️" },
              { "id": "d", "text": "Giving them the same name", "emoji": "🏷️" }
            ],
            "correctOptionId": "b",
            "hint": "Comparing means looking at two things and figuring out how they relate -- is one bigger?"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "hs-fb1",
            "prompt": "If current_score is 12 and best_score is 9, the new best_score becomes ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "12",
                "acceptableAnswers": ["12"]
              }
            ],
            "hint": "12 is bigger than 9, so the best score updates to match the current score!"
          },
          {
            "id": "hs-fb2",
            "prompt": "We use ___ variables to track both the current score and the best score.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "2",
                "acceptableAnswers": ["2", "two", "Two"]
              }
            ],
            "hint": "One for current, one for best -- how many is that?"
          },
          {
            "id": "hs-fb3",
            "prompt": "The best score only changes when the current score is ___ than the best score.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "higher",
                "acceptableAnswers": ["higher", "Higher", "bigger", "Bigger", "greater", "Greater", "more", "More"]
              }
            ],
            "hint": "The best score is the BIGGEST score you''ve ever gotten. A new score has to be even ___!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "hs-so1",
            "prompt": "Put these steps in order to check and update a high score!",
            "items": [
              {"id": "i1", "text": "Player finishes the round and gets a current score", "correctPosition": 1},
              {"id": "i2", "text": "Compare current score to the best score", "correctPosition": 2},
              {"id": "i3", "text": "If current score is higher, update best score", "correctPosition": 3},
              {"id": "i4", "text": "Display both scores on the screen", "correctPosition": 4}
            ],
            "hint": "First get the score, then compare it, update if needed, and finally show both numbers!"
          },
          {
            "id": "hs-so2",
            "prompt": "Put these events in the right order for a game with high score tracking!",
            "items": [
              {"id": "i1", "text": "Set best_score to 0 at the start", "correctPosition": 1},
              {"id": "i2", "text": "Play the game and get 5 points", "correctPosition": 2},
              {"id": "i3", "text": "Best score updates to 5 (5 > 0)", "correctPosition": 3},
              {"id": "i4", "text": "Play again and get 3 points", "correctPosition": 4},
              {"id": "i5", "text": "Best score stays at 5 (3 is not > 5)", "correctPosition": 5}
            ],
            "hint": "Start at 0, then 5 beats 0 so it updates. Then 3 doesn''t beat 5, so it stays!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
