-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Coding Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Coding "Code Explorers" module.
-- Aligned to CSTA K-2 (1A) Computer Science Standards
--
-- Module ID: 00000001-0071-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000007
--
-- Lesson UUIDs: c1000007-0001 through c1000007-0005
-- =============================================================================


-- =========================================================================
-- CODING LESSON 1: Step by Step!
-- Skills: Step-by-Step Instructions, Simple Sequences
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000007-0001-4000-8000-000000000001',
  '00000001-0071-4000-8000-000000000001',
  1,
  'Step by Step!',
  'Learn to give instructions in the right order! First this, then that!',
  'Chip wants to make a peanut butter sandwich, but Chip needs YOUR help! You have to tell Chip EVERY step, in the RIGHT order. That''s what coders do -- they write step-by-step instructions called an ALGORITHM!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000100-0001-4000-8000-000000000001',
    '70000100-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "sandwich-steps",
            "prompt": "Put the steps in order to make a sandwich!",
            "items": [
              {"id": "bread", "text": "Get two slices of bread", "emoji": "\ud83c\udf5e", "correctPosition": 1},
              {"id": "spread", "text": "Spread peanut butter", "emoji": "\ud83e\udd5c", "correctPosition": 2},
              {"id": "close", "text": "Put the slices together", "emoji": "\ud83e\udd6a", "correctPosition": 3}
            ],
            "hint": "First you need bread, then you spread, then you close it up!"
          },
          {
            "id": "plant-steps",
            "prompt": "Put the steps in order to grow a plant!",
            "items": [
              {"id": "dig", "text": "Dig a hole", "emoji": "\ud83e\udea3", "correctPosition": 1},
              {"id": "seed", "text": "Drop in the seed", "emoji": "\ud83c\udf31", "correctPosition": 2},
              {"id": "water", "text": "Water it", "emoji": "\ud83d\udca7", "correctPosition": 3}
            ],
            "hint": "First dig, then plant the seed, then give it water!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "algo-1",
            "prompt": "What is an algorithm?",
            "promptEmoji": "\ud83e\udd16",
            "options": [
              {"id": "a", "text": "Step-by-step instructions", "emoji": "\ud83d\udccb"},
              {"id": "b", "text": "A type of robot", "emoji": "\ud83e\udd16"},
              {"id": "c", "text": "A kind of food", "emoji": "\ud83c\udf55"}
            ],
            "correctOptionId": "a",
            "hint": "An algorithm tells someone (or a computer) what to do, step by step!"
          },
          {
            "id": "algo-2",
            "prompt": "You want to brush your teeth. What should happen FIRST?",
            "promptEmoji": "\ud83e\udea5",
            "options": [
              {"id": "a", "text": "Brush your teeth", "emoji": "\ud83e\udea5"},
              {"id": "b", "text": "Put toothpaste on the brush", "emoji": "\ud83e\udee7"},
              {"id": "c", "text": "Rinse your mouth", "emoji": "\ud83d\udca6"}
            ],
            "correctOptionId": "b",
            "hint": "Before you can brush, you need toothpaste on the brush!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 2: Left, Right, Up, Down!
-- Skills: Directions (Left/Right/Up/Down), Step-by-Step Instructions
-- Widgets: sequence_order + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000007-0002-4000-8000-000000000001',
  '00000001-0071-4000-8000-000000000001',
  2,
  'Left, Right, Up, Down!',
  'Guide Chip through a maze using direction words! Go left, right, up, and down!',
  'Oh no! Chip is lost in a maze and needs to get to the treasure! You can help by giving DIRECTIONS. Tell Chip to go LEFT, RIGHT, UP, or DOWN. Be careful -- the order matters!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000100-0002-4000-8000-000000000001',
    '70000100-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "dir-1",
            "prompt": "Chip is facing right. The treasure is to the right. Which way should Chip go?",
            "promptEmoji": "\ud83e\udd16",
            "options": [
              {"id": "a", "text": "Go Right", "emoji": "\u27a1\ufe0f"},
              {"id": "b", "text": "Go Left", "emoji": "\u2b05\ufe0f"},
              {"id": "c", "text": "Go Up", "emoji": "\u2b06\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "The treasure is to the RIGHT, so Chip should go..."
          },
          {
            "id": "dir-2",
            "prompt": "Chip wants to reach a star ABOVE. Which direction?",
            "promptEmoji": "\u2b50",
            "options": [
              {"id": "a", "text": "Down", "emoji": "\u2b07\ufe0f"},
              {"id": "b", "text": "Up", "emoji": "\u2b06\ufe0f"},
              {"id": "c", "text": "Left", "emoji": "\u2b05\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "The star is above Chip, so Chip needs to go..."
          },
          {
            "id": "dir-3",
            "prompt": "Chip needs to go RIGHT then UP to reach the cookie. What are the 2 steps?",
            "promptEmoji": "\ud83c\udf6a",
            "options": [
              {"id": "a", "text": "Right, then Up", "emoji": "\u27a1\ufe0f\u2b06\ufe0f"},
              {"id": "b", "text": "Up, then Right", "emoji": "\u2b06\ufe0f\u27a1\ufe0f"},
              {"id": "c", "text": "Left, then Down", "emoji": "\u2b05\ufe0f\u2b07\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "First go RIGHT, then go UP. The order matters!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "maze-path",
            "prompt": "Guide Chip to the treasure! Put the directions in order: Right, Right, Down",
            "items": [
              {"id": "right1", "text": "Go Right", "emoji": "\u27a1\ufe0f", "correctPosition": 1},
              {"id": "right2", "text": "Go Right", "emoji": "\u27a1\ufe0f", "correctPosition": 2},
              {"id": "down1", "text": "Go Down", "emoji": "\u2b07\ufe0f", "correctPosition": 3}
            ],
            "hint": "Chip needs to go right twice, then down once!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play ''Robot Walk''! One person is the ''robot'' (walks only when given commands) and the other is the ''programmer.'' The programmer says: ''Go forward 3 steps, turn left, go forward 2 steps'' and the robot follows EXACTLY. Take turns! Try navigating to a toy or a doorway.",
        "parentTip": "This is called ''unplugged coding'' -- it teaches sequencing and directional thinking without any screen. Emphasize that the robot can ONLY do what the programmer says, just like a real computer.",
        "completionPrompt": "Did you play Robot Walk together?",
        "illustration": "\ud83e\udd16"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 3: Spot the Bug!
-- Skills: Finding & Fixing Mistakes (Debugging), Simple Sequences
-- Widgets: multiple_choice + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000007-0003-4000-8000-000000000001',
  '00000001-0071-4000-8000-000000000001',
  3,
  'Spot the Bug!',
  'Uh oh -- Chip made some mistakes! Can you find and fix them?',
  'Even the best coders make mistakes! In coding, a mistake is called a BUG, and finding and fixing it is called DEBUGGING. Chip tried to follow some instructions, but something went wrong. Can you spot the bug?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000100-0004-4000-8000-000000000001',
    '70000100-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "bug-1",
            "prompt": "Chip tried to make cereal:\n1. Pour milk \ud83e\udd5b\n2. Get a bowl \ud83c\udf7c\n3. Add cereal \ud83e\udd63\nWhat''s the bug?",
            "promptEmoji": "\ud83d\udc1b",
            "options": [
              {"id": "a", "text": "Get the bowl FIRST!", "emoji": "\ud83c\udf7c"},
              {"id": "b", "text": "Don''t use milk", "emoji": "\u274c"},
              {"id": "c", "text": "Nothing is wrong", "emoji": "\u2705"}
            ],
            "correctOptionId": "a",
            "hint": "Can you pour milk if you don''t have a bowl yet? The steps are in the wrong order!"
          },
          {
            "id": "bug-2",
            "prompt": "Chip tried to get dressed:\n1. Put on shoes \ud83d\udc5f\n2. Put on socks \ud83e\udde6\nWhat''s the bug?",
            "promptEmoji": "\ud83d\udc1b",
            "options": [
              {"id": "a", "text": "Socks go BEFORE shoes!", "emoji": "\ud83e\udde6"},
              {"id": "b", "text": "You don''t need socks", "emoji": "\u274c"},
              {"id": "c", "text": "Nothing is wrong", "emoji": "\u2705"}
            ],
            "correctOptionId": "a",
            "hint": "Can you put shoes on FIRST and then socks? That doesn''t work! Socks come first."
          },
          {
            "id": "bug-3",
            "prompt": "What is a BUG in coding?",
            "promptEmoji": "\ud83d\udc1b",
            "options": [
              {"id": "a", "text": "A real insect in the computer", "emoji": "\ud83e\udeb2"},
              {"id": "b", "text": "A mistake in the instructions", "emoji": "\ud83d\udcdd"},
              {"id": "c", "text": "A type of game", "emoji": "\ud83c\udfae"}
            ],
            "correctOptionId": "b",
            "hint": "A bug is when something goes wrong in the instructions. Debugging means fixing it!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "fix-cereal",
            "prompt": "Fix the bug! Put the cereal steps in the RIGHT order:",
            "items": [
              {"id": "bowl", "text": "Get a bowl", "emoji": "\ud83c\udf7c", "correctPosition": 1},
              {"id": "cereal", "text": "Add cereal", "emoji": "\ud83e\udd63", "correctPosition": 2},
              {"id": "milk", "text": "Pour milk", "emoji": "\ud83e\udd5b", "correctPosition": 3}
            ],
            "hint": "First the bowl, then the cereal, then the milk!"
          },
          {
            "id": "fix-dressed",
            "prompt": "Fix the bug! What order should Chip get dressed?",
            "items": [
              {"id": "socks", "text": "Put on socks", "emoji": "\ud83e\udde6", "correctPosition": 1},
              {"id": "shoes", "text": "Put on shoes", "emoji": "\ud83d\udc5f", "correctPosition": 2},
              {"id": "tie", "text": "Tie the laces", "emoji": "\ud83e\udd7e", "correctPosition": 3}
            ],
            "hint": "Socks first, then shoes, then tie them!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 4: Repeat After Me!
-- Skills: Repeating Actions (Loops), Expressing Ideas
-- Widgets: multiple_choice + tap_and_reveal + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000007-0004-4000-8000-000000000001',
  '00000001-0071-4000-8000-000000000001',
  4,
  'Repeat After Me!',
  'Some things happen over and over! Learn about loops -- the coder''s shortcut!',
  'Chip noticed something cool: some instructions happen OVER AND OVER! Like clapping your hands 5 times. Instead of saying "clap, clap, clap, clap, clap," a coder says "clap 5 TIMES!" That''s called a LOOP!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000100-0005-4000-8000-000000000001',
    '70000100-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "loop-1",
            "prompt": "Which one uses a LOOP?",
            "promptEmoji": "\ud83d\udd01",
            "options": [
              {"id": "a", "text": "Jump 1 time", "emoji": "1\ufe0f\u20e3"},
              {"id": "b", "text": "Jump 5 times", "emoji": "\ud83d\udd01"},
              {"id": "c", "text": "Sit down", "emoji": "\ud83e\uddd1\u200d\ud83e\uddbd"}
            ],
            "correctOptionId": "b",
            "hint": "A loop repeats something more than once. Which one repeats?"
          },
          {
            "id": "loop-2",
            "prompt": "Chip wants to say ''Beep!'' 3 times. How should a coder write that?",
            "promptEmoji": "\ud83e\udd16",
            "options": [
              {"id": "a", "text": "Say Beep, Say Beep, Say Beep", "emoji": "\ud83d\udcdd"},
              {"id": "b", "text": "Repeat 3 times: Say Beep", "emoji": "\ud83d\udd01"},
              {"id": "c", "text": "Both work, but B is shorter!", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "Both give the same result, but loops are a shortcut! Less writing, same action!"
          },
          {
            "id": "loop-3",
            "prompt": "Which is a loop in real life?",
            "promptEmoji": "\ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Eating lunch once", "emoji": "\ud83c\udf54"},
              {"id": "b", "text": "Your heart beating all day", "emoji": "\u2764\ufe0f"},
              {"id": "c", "text": "Opening a door", "emoji": "\ud83d\udeaa"}
            ],
            "correctOptionId": "b",
            "hint": "Your heart beats over and over and over -- it never stops! That''s a loop!"
          },
          {
            "id": "loop-4",
            "prompt": "What does ''Repeat 4 times: Hop'' mean?",
            "promptEmoji": "\ud83d\udc30",
            "options": [
              {"id": "a", "text": "Hop, hop, hop, hop", "emoji": "\ud83d\udc30"},
              {"id": "b", "text": "Hop once", "emoji": "1\ufe0f\u20e3"},
              {"id": "c", "text": "Don''t hop", "emoji": "\u274c"}
            ],
            "correctOptionId": "a",
            "hint": "Repeat 4 times means do it 4 times! Hop, hop, hop, hop!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "tap_and_reveal",
        "prompt": "Tap each card to learn about loops!",
        "cards": [
          {
            "id": "loop-word",
            "front": "What is a loop?",
            "frontEmoji": "\ud83d\udd01",
            "back": "A LOOP repeats the same thing over and over!",
            "backEmoji": "\ud83c\udf1f"
          },
          {
            "id": "loop-example",
            "front": "Loop example",
            "frontEmoji": "\ud83d\udca1",
            "back": "''Repeat 3 times: Clap'' means clap, clap, clap!",
            "backEmoji": "\ud83d\udc4f"
          },
          {
            "id": "loop-life",
            "front": "Loops in real life?",
            "frontEmoji": "\ud83c\udf0d",
            "back": "Walking is a loop: step, step, step! Breathing is a loop too!",
            "backEmoji": "\ud83d\udeb6"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play ''Loop Dance!'' Call out moves like ''Repeat 4 times: spin!'' or ''Repeat 2 times: jump and clap!'' Take turns being the programmer and the dancer. Try making longer loops: ''Repeat 3 times: stomp, stomp, clap!''",
        "parentTip": "Loops are one of the most important concepts in programming. By connecting it to physical movement, kids internalize the idea that loops are just repeated actions. Emphasize the pattern: how many times + what to repeat.",
        "completionPrompt": "Did you play Loop Dance together?",
        "illustration": "\ud83d\udd01"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- CODING LESSON 5: What Do Computers Do?
-- Skills: What Computers Do, Input and Output
-- Widgets: matching_pairs + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000007-0005-4000-8000-000000000001',
  '00000001-0071-4000-8000-000000000001',
  5,
  'What Do Computers Do?',
  'Computers are everywhere! Learn what goes IN and what comes OUT!',
  'Did you know computers are all around you? Tablets, phones, and even Chip are computers! Computers take something IN (that''s called INPUT) and give something OUT (that''s called OUTPUT). Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000100-0006-4000-8000-000000000001',
    '70000100-0007-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "computer-1",
            "prompt": "Which of these is a computer?",
            "promptEmoji": "\ud83d\udcbb",
            "options": [
              {"id": "a", "text": "A tablet", "emoji": "\ud83d\udcf1"},
              {"id": "b", "text": "A phone", "emoji": "\ud83d\udcf1"},
              {"id": "c", "text": "All of these!", "emoji": "\ud83c\udf1f"}
            ],
            "correctOptionId": "c",
            "hint": "Tablets, phones, laptops -- they are ALL computers! Computers come in many shapes."
          },
          {
            "id": "input-1",
            "prompt": "When you press a letter on a keyboard, what is the INPUT?",
            "promptEmoji": "\u2328\ufe0f",
            "options": [
              {"id": "a", "text": "The letter appears on screen", "emoji": "\ud83d\udcbb"},
              {"id": "b", "text": "Pressing the key", "emoji": "\ud83d\udd24"},
              {"id": "c", "text": "The keyboard turns off", "emoji": "\u274c"}
            ],
            "correctOptionId": "b",
            "hint": "INPUT is what goes IN. You press the key -- that''s the input!"
          },
          {
            "id": "output-1",
            "prompt": "When you press a letter, the letter appears on screen. What is the OUTPUT?",
            "promptEmoji": "\ud83d\udcbb",
            "options": [
              {"id": "a", "text": "The letter on the screen", "emoji": "\ud83d\udcbb"},
              {"id": "b", "text": "Pressing the key", "emoji": "\u2328\ufe0f"},
              {"id": "c", "text": "The mouse", "emoji": "\ud83d\uddb1\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "OUTPUT is what comes OUT. The letter appearing on screen is what you get back!"
          },
          {
            "id": "io-2",
            "prompt": "You say ''Hey Siri.'' That is the INPUT. What is the OUTPUT?",
            "promptEmoji": "\ud83c\udf99\ufe0f",
            "options": [
              {"id": "a", "text": "Siri talks back to you!", "emoji": "\ud83d\udd0a"},
              {"id": "b", "text": "The phone turns off", "emoji": "\ud83d\udcf4"},
              {"id": "c", "text": "Nothing happens", "emoji": "\ud83e\udd37"}
            ],
            "correctOptionId": "a",
            "hint": "You talk IN, Siri talks OUT! Your voice is input, Siri''s response is output."
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match the INPUT with its OUTPUT!",
        "pairs": [
          {
            "id": "io-keyboard",
            "left": {"text": "Press a key", "emoji": "\u2328\ufe0f"},
            "right": {"text": "Letter appears", "emoji": "\ud83d\udcdd"}
          },
          {
            "id": "io-doorbell",
            "left": {"text": "Push doorbell", "emoji": "\ud83d\udece\ufe0f"},
            "right": {"text": "Ding dong!", "emoji": "\ud83d\udd14"}
          },
          {
            "id": "io-lightswitch",
            "left": {"text": "Flip the switch", "emoji": "\ud83e\ude94"},
            "right": {"text": "Light turns on", "emoji": "\ud83d\udca1"}
          }
        ],
        "hint": "Think about what you DO (input) and what HAPPENS (output)!"
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Go on a ''Computer Hunt'' around the house! Find things that have a computer inside: microwave, TV remote, washing machine, thermostat, car. For each one, ask: ''What is the INPUT (what do you do)?'' and ''What is the OUTPUT (what happens)?'' Example: Microwave -- input: press buttons, output: food gets hot!",
        "parentTip": "This helps kids understand that computers aren''t just laptops and phones. Identifying input/output in everyday devices builds computational thinking. Don''t worry about being technically precise -- the goal is to see the pattern: something goes IN, something comes OUT.",
        "completionPrompt": "Did you find computers around the house?",
        "illustration": "\ud83d\udcbb"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
