-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Coding: Events & Conditionals Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Button Press Events
--   - If-Then Magic
--   - If-Else Choice
--   - Tilt Controller
--   - Hot or Cold?
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, matching_pairs, fill_in_blank, sequence_order
--
-- Subject ID:
--   Coding: 99c7ad43-0481-46b3-ace1-b88f90e6e070
--
-- Module ID:
--   Events & Conditionals: 10000002-0711-4000-8000-000000000001
--
-- Skill IDs:
--   Events (Button Input):   20000007-0004-4000-8000-000000000001
--   Conditionals (If-Then):  20000007-0005-4000-8000-000000000001
--   Sensor Input (IMU):      20000007-0007-4000-8000-000000000001
--
-- Lesson IDs:
--   1. Button Press Events:  b2000007-000b-4000-8000-000000000001
--   2. If-Then Magic:        b2000007-000c-4000-8000-000000000001
--   3. If-Else Choice:       b2000007-000d-4000-8000-000000000001
--   4. Tilt Controller:      b2000007-000e-4000-8000-000000000001
--   5. Hot or Cold?:         b2000007-000f-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Coding 2nd Grade: Events, Conditionals, Sensor Input
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000007-0004-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'events_button_input', 'Events (Button Input)', 'Understand that pressing a button triggers an event that makes something happen in a program', 'CSTA:1B-AP-12', 4),
  ('20000007-0005-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'conditionals_if_then', 'Conditionals (If-Then)', 'Use if-then and if-else logic to make programs choose between different actions', 'CSTA:1B-AP-10', 5),
  ('20000007-0007-4000-8000-000000000001', '99c7ad43-0481-46b3-ace1-b88f90e6e070', 'sensor_input_imu', 'Sensor Input (IMU)', 'Use tilt and motion sensor data as input to control program behavior', 'CSTA:1B-CS-02', 7)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Coding: Events & Conditionals)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0711-4000-8000-000000000001', 2, 39, 'Events & Conditionals', 'Learn how buttons and sensors make things happen! Discover if-then logic and build a tilt-controlled game.', 'zap', '99c7ad43-0481-46b3-ace1-b88f90e6e070')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- CODING LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Button Press Events
-- Module: Events & Conditionals | Skill: Events (Button Input)
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000b-4000-8000-000000000001',
  '10000002-0711-4000-8000-000000000001',
  1,
  'Button Press Events',
  'Learn what events are and how pressing a button makes something happen! Button A shows "YES!" and Button B shows "NO!"',
  'Hey there, future coder! Chip here! Have you ever pushed a doorbell and heard it ring? Or pressed a button on a remote and the TV turned on? That''s called an EVENT! When you press a button, something HAPPENS. In coding, we use events all the time -- press a button, and your program does something cool! Today we''re going to learn about button events on our M5StickC Plus 2!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0004-4000-8000-000000000001']::uuid[],
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
            "prompt": "What is an EVENT in coding?",
            "promptEmoji": "🤔",
            "options": [
              { "id": "a", "text": "A birthday party", "emoji": "🎂" },
              { "id": "b", "text": "Something that happens that a program can respond to", "emoji": "⚡" },
              { "id": "c", "text": "A color on the screen", "emoji": "🎨" },
              { "id": "d", "text": "A kind of computer", "emoji": "💻" }
            ],
            "correctOptionId": "b",
            "hint": "Think about pressing a doorbell -- something HAPPENS because of what you did!"
          },
          {
            "id": "mc2",
            "prompt": "You press Button A on the M5StickC Plus 2. The screen shows \"YES!\" What is the EVENT?",
            "promptEmoji": "🔘",
            "options": [
              { "id": "a", "text": "The screen showing YES!", "emoji": "📺" },
              { "id": "b", "text": "The button being pressed", "emoji": "👆" },
              { "id": "c", "text": "The device turning on", "emoji": "🔌" },
              { "id": "d", "text": "The battery charging", "emoji": "🔋" }
            ],
            "correctOptionId": "b",
            "hint": "The event is the ACTION that starts everything -- what did YOU do?"
          },
          {
            "id": "mc3",
            "prompt": "Which of these is a REAL-LIFE example of an event?",
            "promptEmoji": "🌍",
            "options": [
              { "id": "a", "text": "A rock sitting on the ground", "emoji": "🪨" },
              { "id": "b", "text": "Pressing a light switch to turn on a light", "emoji": "💡" },
              { "id": "c", "text": "A cloud floating in the sky", "emoji": "☁️" },
              { "id": "d", "text": "A book on a shelf", "emoji": "📚" }
            ],
            "correctOptionId": "b",
            "hint": "An event is when something is DONE that causes something else to happen!"
          },
          {
            "id": "mc4",
            "prompt": "Why are events important in coding?",
            "promptEmoji": "⭐",
            "options": [
              { "id": "a", "text": "They make computers look pretty", "emoji": "✨" },
              { "id": "b", "text": "They let programs respond when users do things", "emoji": "🎮" },
              { "id": "c", "text": "They make computers run faster", "emoji": "🏃" },
              { "id": "d", "text": "They are not important at all", "emoji": "❌" }
            ],
            "correctOptionId": "b",
            "hint": "Without events, a program can''t react to button presses, touches, or tilt!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each event to what happens next!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "doorbell", "text": "Press doorbell", "emoji": "🔔"},
            "right": {"id": "ring", "text": "Bell rings", "emoji": "🔊"}
          },
          {
            "id": "p2",
            "left": {"id": "btn-a", "text": "Press Button A", "emoji": "🅰️"},
            "right": {"id": "yes", "text": "Screen shows YES!", "emoji": "✅"}
          },
          {
            "id": "p3",
            "left": {"id": "btn-b", "text": "Press Button B", "emoji": "🅱️"},
            "right": {"id": "no", "text": "Screen shows NO!", "emoji": "❌"}
          },
          {
            "id": "p4",
            "left": {"id": "light-switch", "text": "Flip light switch", "emoji": "🔦"},
            "right": {"id": "light-on", "text": "Light turns on", "emoji": "💡"}
          },
          {
            "id": "p5",
            "left": {"id": "remote", "text": "Press remote button", "emoji": "📱"},
            "right": {"id": "tv-on", "text": "TV turns on", "emoji": "📺"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc5",
            "prompt": "The M5StickC Plus 2 has TWO buttons: A and B. We want Button A to show \"YES!\" and Button B to show \"NO!\" How many events do we need?",
            "promptEmoji": "🔢",
            "options": [
              { "id": "a", "text": "One event", "emoji": "1️⃣" },
              { "id": "b", "text": "Two events -- one for each button", "emoji": "2️⃣" },
              { "id": "c", "text": "Three events", "emoji": "3️⃣" },
              { "id": "d", "text": "Zero events", "emoji": "0️⃣" }
            ],
            "correctOptionId": "b",
            "hint": "Each button press is its own event! Button A is one event, Button B is another."
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
-- LESSON 2: If-Then Magic
-- Module: Events & Conditionals | Skill: Conditionals (If-Then)
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000c-4000-8000-000000000001',
  '10000002-0711-4000-8000-000000000001',
  2,
  'If-Then Magic',
  'Discover the magic of if-then! If something happens, then do something else. If Button A is pressed, display a smiley face!',
  'Chip has a magic word for you: IF! Coders use IF all the time. Here''s how it works: IF something is true, THEN something happens. Like in real life -- IF it''s raining, THEN you grab an umbrella! Computers use the same kind of thinking. Let''s learn how to tell our M5StickC Plus 2: IF Button A is pressed, THEN show a smiley face!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0005-4000-8000-000000000001']::uuid[],
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
            "prompt": "What does IF-THEN mean in coding?",
            "promptEmoji": "🧙",
            "options": [
              { "id": "a", "text": "Do two things at the same time", "emoji": "🔄" },
              { "id": "b", "text": "IF something is true, THEN do an action", "emoji": "✨" },
              { "id": "c", "text": "Always do the same thing", "emoji": "🔁" },
              { "id": "d", "text": "Never do anything", "emoji": "🚫" }
            ],
            "correctOptionId": "b",
            "hint": "IF is a question that checks something. If the answer is yes, THEN the action happens!"
          },
          {
            "id": "mc2",
            "prompt": "Which is an IF-THEN statement from real life?",
            "promptEmoji": "🌧️",
            "options": [
              { "id": "a", "text": "I like pizza", "emoji": "🍕" },
              { "id": "b", "text": "The sky is blue", "emoji": "🔵" },
              { "id": "c", "text": "IF it is cold outside, THEN wear a jacket", "emoji": "🧥" },
              { "id": "d", "text": "Cats are fluffy", "emoji": "🐱" }
            ],
            "correctOptionId": "c",
            "hint": "Look for the IF and THEN pattern -- something is checked, and then an action follows!"
          },
          {
            "id": "mc3",
            "prompt": "We write: IF Button A is pressed, THEN show a smiley face 😊. What happens when nobody presses Button A?",
            "promptEmoji": "😊",
            "options": [
              { "id": "a", "text": "The smiley face shows anyway", "emoji": "😊" },
              { "id": "b", "text": "Nothing happens -- the condition is not true", "emoji": "😶" },
              { "id": "c", "text": "The device turns off", "emoji": "📴" },
              { "id": "d", "text": "An error message appears", "emoji": "⚠️" }
            ],
            "correctOptionId": "b",
            "hint": "The IF part checks a condition. If the condition is NOT true, the THEN part doesn''t happen!"
          },
          {
            "id": "mc4",
            "prompt": "In the statement \"IF Button A is pressed, THEN show smiley face,\" what is the CONDITION?",
            "promptEmoji": "🔍",
            "options": [
              { "id": "a", "text": "Show smiley face", "emoji": "😊" },
              { "id": "b", "text": "Button A is pressed", "emoji": "👆" },
              { "id": "c", "text": "The screen turns on", "emoji": "📺" },
              { "id": "d", "text": "The device beeps", "emoji": "🔊" }
            ],
            "correctOptionId": "b",
            "hint": "The CONDITION is the part right after IF -- it''s what the computer checks to see if it''s true!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "template": "IF it is raining, ___ bring an umbrella.",
            "correctAnswer": "then",
            "hint": "An IF statement always has a partner word that means ''do this next''!",
            "wordBank": ["then", "or", "but", "not"]
          },
          {
            "id": "fb2",
            "template": "IF Button A is ___, THEN show a smiley face.",
            "correctAnswer": "pressed",
            "hint": "What do you do to a button to make it work? You push it or...",
            "wordBank": ["pressed", "broken", "colored", "hidden"]
          },
          {
            "id": "fb3",
            "template": "The part after IF is called the ___.",
            "correctAnswer": "condition",
            "hint": "It''s the thing the computer checks to see if it''s true or false!",
            "wordBank": ["condition", "answer", "color", "button"]
          },
          {
            "id": "fb4",
            "template": "IF the ___ is true, THEN the action happens.",
            "correctAnswer": "condition",
            "hint": "This is the test or check that the computer does before taking action!",
            "wordBank": ["condition", "screen", "button", "color"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc5",
            "prompt": "Which IF-THEN would make the M5StickC Plus 2 show a smiley when you press Button A?",
            "promptEmoji": "💻",
            "options": [
              { "id": "a", "text": "IF screen is on, THEN show smiley", "emoji": "📺" },
              { "id": "b", "text": "IF Button A pressed, THEN show smiley", "emoji": "😊" },
              { "id": "c", "text": "IF smiley exists, THEN press button", "emoji": "🔄" },
              { "id": "d", "text": "THEN press button, IF show smiley", "emoji": "❓" }
            ],
            "correctOptionId": "b",
            "hint": "The condition (what we check) comes after IF, and the action comes after THEN!"
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
-- LESSON 3: If-Else Choice
-- Module: Events & Conditionals | Skill: Conditionals (If-Then)
-- Widgets: multiple_choice + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000d-4000-8000-000000000001',
  '10000002-0711-4000-8000-000000000001',
  3,
  'If-Else Choice',
  'Two paths! If one thing is true, do this. Otherwise (else), do that! If tilted left show a left arrow, else show a right arrow.',
  'Hey coder! Remember IF-THEN? Well, Chip has an upgrade for you -- IF-ELSE! Sometimes you want your program to choose between TWO options. Like picking what to wear: IF it''s sunny, wear sunglasses. ELSE (otherwise), bring a raincoat! Now your code can handle BOTH situations. Let''s teach our M5StickC Plus 2 to show different arrows when you tilt it!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0005-4000-8000-000000000001']::uuid[],
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
            "prompt": "What does ELSE mean in an IF-ELSE statement?",
            "promptEmoji": "🔀",
            "options": [
              { "id": "a", "text": "Do nothing", "emoji": "😴" },
              { "id": "b", "text": "Do this if the IF condition is NOT true", "emoji": "🔄" },
              { "id": "c", "text": "Do the same thing again", "emoji": "🔁" },
              { "id": "d", "text": "Stop the program", "emoji": "🛑" }
            ],
            "correctOptionId": "b",
            "hint": "ELSE is like Plan B -- it''s what happens when the IF condition isn''t true!"
          },
          {
            "id": "mc2",
            "prompt": "IF it is sunny, wear sunglasses. ELSE, bring a raincoat. It''s cloudy today. What do you do?",
            "promptEmoji": "☁️",
            "options": [
              { "id": "a", "text": "Wear sunglasses", "emoji": "🕶️" },
              { "id": "b", "text": "Bring a raincoat", "emoji": "🧥" },
              { "id": "c", "text": "Stay home", "emoji": "🏠" },
              { "id": "d", "text": "Do both", "emoji": "🤷" }
            ],
            "correctOptionId": "b",
            "hint": "Is it sunny? No, it''s cloudy! So the IF part is NOT true, which means we follow the ELSE path."
          },
          {
            "id": "mc3",
            "prompt": "IF tilted left, show ⬅️. ELSE, show ➡️. The device is tilted to the RIGHT. What shows on screen?",
            "promptEmoji": "📱",
            "options": [
              { "id": "a", "text": "Left arrow ⬅️", "emoji": "⬅️" },
              { "id": "b", "text": "Right arrow ➡️", "emoji": "➡️" },
              { "id": "c", "text": "Both arrows", "emoji": "↔️" },
              { "id": "d", "text": "Nothing", "emoji": "😶" }
            ],
            "correctOptionId": "b",
            "hint": "Is it tilted LEFT? Nope! So we go to the ELSE path, which shows the right arrow."
          },
          {
            "id": "mc4",
            "prompt": "How is IF-ELSE different from just IF-THEN?",
            "promptEmoji": "🤔",
            "options": [
              { "id": "a", "text": "There is no difference", "emoji": "🟰" },
              { "id": "b", "text": "IF-ELSE gives TWO paths -- one if true, one if false", "emoji": "🔀" },
              { "id": "c", "text": "IF-ELSE is slower", "emoji": "🐢" },
              { "id": "d", "text": "IF-ELSE doesn''t check conditions", "emoji": "❌" }
            ],
            "correctOptionId": "b",
            "hint": "IF-THEN only does something when true. IF-ELSE does one thing when true AND a different thing when false!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put these steps in the correct order for an IF-ELSE program that shows arrows!",
        "items": [
          { "id": "s1", "text": "Check the condition: Is the device tilted left?", "emoji": "🔍", "correctPosition": 1 },
          { "id": "s2", "text": "IF yes (tilted left): Show left arrow ⬅️ on screen", "emoji": "⬅️", "correctPosition": 2 },
          { "id": "s3", "text": "ELSE (not tilted left): Show right arrow ➡️ on screen", "emoji": "➡️", "correctPosition": 3 },
          { "id": "s4", "text": "Wait and check again (loop back to step 1)", "emoji": "🔄", "correctPosition": 4 }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc5",
            "prompt": "A game uses IF-ELSE: IF score > 10, show \"You win!\" ELSE show \"Keep trying!\" Your score is 7. What do you see?",
            "promptEmoji": "🎮",
            "options": [
              { "id": "a", "text": "You win!", "emoji": "🏆" },
              { "id": "b", "text": "Keep trying!", "emoji": "💪" },
              { "id": "c", "text": "Game over", "emoji": "😵" },
              { "id": "d", "text": "Nothing happens", "emoji": "😶" }
            ],
            "correctOptionId": "b",
            "hint": "Is 7 greater than 10? No! So the IF part is false, and we follow the ELSE path."
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
-- LESSON 4: Tilt Controller
-- Module: Events & Conditionals | Skill: Sensor Input (IMU)
-- Widgets: matching_pairs + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000e-4000-8000-000000000001',
  '10000002-0711-4000-8000-000000000001',
  4,
  'Tilt Controller',
  'Use the IMU tilt sensor with conditionals! Tilt the device to move a dot on screen -- left or right!',
  'Whoa, get ready for something AWESOME! Your M5StickC Plus 2 has a secret superpower -- it can feel when you TILT it! There''s a tiny sensor inside called an IMU that knows if you''re tilting left, right, up, or down. It''s like the device has a sense of balance! Today we''re going to combine tilt sensing with IF-ELSE to make a dot move on the screen. Tilt left = dot goes left. Tilt right = dot goes right. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each tilt direction to what happens on screen!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "tilt-left", "text": "Tilt device left", "emoji": "⬅️"},
            "right": {"id": "dot-left", "text": "Dot moves left on screen", "emoji": "🔵"}
          },
          {
            "id": "p2",
            "left": {"id": "tilt-right", "text": "Tilt device right", "emoji": "➡️"},
            "right": {"id": "dot-right", "text": "Dot moves right on screen", "emoji": "🔴"}
          },
          {
            "id": "p3",
            "left": {"id": "sensor", "text": "IMU sensor", "emoji": "📡"},
            "right": {"id": "detects", "text": "Detects tilt and motion", "emoji": "📐"}
          },
          {
            "id": "p4",
            "left": {"id": "flat", "text": "Device held flat", "emoji": "📱"},
            "right": {"id": "center", "text": "Dot stays in the center", "emoji": "⏺️"}
          },
          {
            "id": "p5",
            "left": {"id": "conditional", "text": "IF-ELSE code", "emoji": "💻"},
            "right": {"id": "decides", "text": "Decides which way to move", "emoji": "🔀"}
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "template": "The sensor that detects tilt inside the M5StickC Plus 2 is called the ___.",
            "correctAnswer": "IMU",
            "hint": "It''s a three-letter name! It stands for Inertial Measurement Unit.",
            "wordBank": ["IMU", "GPS", "LED", "USB"]
          },
          {
            "id": "fb2",
            "template": "IF the device tilts left, THEN the dot moves ___.",
            "correctAnswer": "left",
            "hint": "The dot follows the tilt direction!",
            "wordBank": ["left", "up", "down", "backwards"]
          },
          {
            "id": "fb3",
            "template": "To make the dot move based on tilt, we combine ___ data with IF-ELSE code.",
            "correctAnswer": "sensor",
            "hint": "The IMU gives us data from a special device that detects motion...",
            "wordBank": ["sensor", "color", "sound", "button"]
          },
          {
            "id": "fb4",
            "template": "IF tilted right, move dot right. ___ move dot left.",
            "correctAnswer": "ELSE",
            "hint": "When the IF condition is NOT true, we use this word for the other path!",
            "wordBank": ["ELSE", "THEN", "AND", "STOP"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What does the IMU sensor do?",
            "promptEmoji": "📡",
            "options": [
              { "id": "a", "text": "Takes photos", "emoji": "📷" },
              { "id": "b", "text": "Plays music", "emoji": "🎵" },
              { "id": "c", "text": "Detects tilt, rotation, and movement", "emoji": "📐" },
              { "id": "d", "text": "Connects to WiFi", "emoji": "📶" }
            ],
            "correctOptionId": "c",
            "hint": "IMU stands for Inertial Measurement Unit -- it measures how the device moves and tilts!"
          },
          {
            "id": "mc2",
            "prompt": "We want: tilt left = dot left, tilt right = dot right. Which code pattern is correct?",
            "promptEmoji": "💡",
            "options": [
              { "id": "a", "text": "IF tilted left, move dot LEFT. ELSE move dot RIGHT.", "emoji": "✅" },
              { "id": "b", "text": "IF tilted left, move dot RIGHT. ELSE move dot LEFT.", "emoji": "🔄" },
              { "id": "c", "text": "ELSE tilted left, IF move dot LEFT.", "emoji": "❓" },
              { "id": "d", "text": "Move dot LEFT and RIGHT at the same time.", "emoji": "↔️" }
            ],
            "correctOptionId": "a",
            "hint": "When tilted left is TRUE, move left. When it''s NOT true (tilted right), move right!"
          },
          {
            "id": "mc3",
            "prompt": "Your phone has a sensor that rotates the screen when you turn it sideways. What kind of sensor is that?",
            "promptEmoji": "📱",
            "options": [
              { "id": "a", "text": "A camera sensor", "emoji": "📷" },
              { "id": "b", "text": "A tilt/motion sensor (like an IMU)", "emoji": "📐" },
              { "id": "c", "text": "A temperature sensor", "emoji": "🌡️" },
              { "id": "d", "text": "A sound sensor", "emoji": "🔊" }
            ],
            "correctOptionId": "b",
            "hint": "Your phone knows when it''s tilted because it has a motion sensor -- just like the M5StickC Plus 2!"
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
-- LESSON 5: Hot or Cold?
-- Module: Events & Conditionals | Skill: Sensor Input (IMU) + Conditionals
-- Widgets: multiple_choice + fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000007-000f-4000-8000-000000000001',
  '10000002-0711-4000-8000-000000000001',
  5,
  'Hot or Cold?',
  'Build a Hot or Cold game! Use the IMU sensor with conditionals -- tilt toward the target for "WARM!" and away for "COLD!" on screen.',
  'Time for a GAME! Chip loves the game Hot or Cold -- you know, where someone hides something and says "warmer" when you get close and "colder" when you go away? We''re going to build our OWN version! The M5StickC Plus 2 will pick a secret target direction. Tilt TOWARD the target and the screen says "WARM!" Tilt AWAY and it says "COLD!" We''ll use everything we learned -- events, IF-ELSE, and the IMU sensor -- all together! Let''s build it!',
  NULL, NULL,
  '[]'::jsonb,
  '99c7ad43-0481-46b3-ace1-b88f90e6e070',
  ARRAY['20000007-0005-4000-8000-000000000001', '20000007-0007-4000-8000-000000000001']::uuid[],
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
            "prompt": "In our Hot or Cold game, what does the IMU sensor do?",
            "promptEmoji": "🌡️",
            "options": [
              { "id": "a", "text": "Measures the actual temperature", "emoji": "🌡️" },
              { "id": "b", "text": "Detects which direction the device is tilted", "emoji": "📐" },
              { "id": "c", "text": "Changes the screen color", "emoji": "🎨" },
              { "id": "d", "text": "Plays a sound", "emoji": "🔊" }
            ],
            "correctOptionId": "b",
            "hint": "Remember, the IMU senses tilt and motion -- it tells the program which way you''re leaning!"
          },
          {
            "id": "mc2",
            "prompt": "The target is LEFT. You tilt RIGHT. What does the screen say?",
            "promptEmoji": "❄️",
            "options": [
              { "id": "a", "text": "WARM!", "emoji": "🔥" },
              { "id": "b", "text": "COLD!", "emoji": "🥶" },
              { "id": "c", "text": "You win!", "emoji": "🏆" },
              { "id": "d", "text": "Nothing", "emoji": "😶" }
            ],
            "correctOptionId": "b",
            "hint": "You tilted AWAY from the target. In Hot or Cold, going the wrong way means you''re getting COLDER!"
          },
          {
            "id": "mc3",
            "prompt": "The target is LEFT. You tilt LEFT. What does the screen say?",
            "promptEmoji": "🔥",
            "options": [
              { "id": "a", "text": "COLD!", "emoji": "🥶" },
              { "id": "b", "text": "WARM!", "emoji": "🔥" },
              { "id": "c", "text": "Try again", "emoji": "🔄" },
              { "id": "d", "text": "Error", "emoji": "⚠️" }
            ],
            "correctOptionId": "b",
            "hint": "You tilted TOWARD the target! That means you''re going the right way -- getting WARMER!"
          },
          {
            "id": "mc4",
            "prompt": "Which coding concepts are we using in the Hot or Cold game? (Pick the BEST answer)",
            "promptEmoji": "🧩",
            "options": [
              { "id": "a", "text": "Only events", "emoji": "⚡" },
              { "id": "b", "text": "Only sensor input", "emoji": "📡" },
              { "id": "c", "text": "Events + IF-ELSE conditionals + sensor input -- all together!", "emoji": "🌟" },
              { "id": "d", "text": "None of the above", "emoji": "❌" }
            ],
            "correctOptionId": "c",
            "hint": "This game combines EVERYTHING from this module: the tilt event, the IMU sensor data, and IF-ELSE logic!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "template": "IF tilt direction matches the target, THEN show \"___!\" on the screen.",
            "correctAnswer": "WARM",
            "hint": "When you go toward the target in Hot or Cold, you are getting...",
            "wordBank": ["WARM", "COLD", "STOP", "GO"]
          },
          {
            "id": "fb2",
            "template": "IF tilt direction does NOT match the target, ___ show \"COLD!\" on the screen.",
            "correctAnswer": "ELSE",
            "hint": "When the IF condition is false, which keyword do we use for the other path?",
            "wordBank": ["ELSE", "THEN", "IF", "AND"]
          },
          {
            "id": "fb3",
            "template": "The ___ sensor tells the program which direction the device is tilted.",
            "correctAnswer": "IMU",
            "hint": "This three-letter sensor name stands for Inertial Measurement Unit!",
            "wordBank": ["IMU", "LED", "USB", "LCD"]
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "Put the steps of the Hot or Cold game in the right order!",
        "items": [
          { "id": "s1", "text": "The program picks a secret target direction (e.g., LEFT)", "emoji": "🎯", "correctPosition": 1 },
          { "id": "s2", "text": "The IMU sensor reads which way the device is tilted", "emoji": "📐", "correctPosition": 2 },
          { "id": "s3", "text": "IF the tilt matches the target: show \"WARM!\" on screen", "emoji": "🔥", "correctPosition": 3 },
          { "id": "s4", "text": "ELSE (tilt doesn''t match): show \"COLD!\" on screen", "emoji": "🥶", "correctPosition": 4 },
          { "id": "s5", "text": "Loop back and check the tilt again!", "emoji": "🔄", "correctPosition": 5 }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
