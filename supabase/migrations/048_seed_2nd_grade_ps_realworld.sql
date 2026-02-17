-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Problem Solving: Real-World Problem Solving
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Break It Down
--   - Is That Reasonable?
--   - Planning a Party
--   - Building a Robot
--   - Puzzle Challenge!
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: sequence_order, matching_pairs, multiple_choice,
--                    fill_in_blank
--
-- Subject ID:
--   Problem Solving: f4c1f559-85c6-412e-a788-d6efc8bf4c9d
--
-- Module ID:
--   Real-World Problem Solving: 10000002-0611-4000-8000-000000000001
--
-- Skill IDs:
--   Problem Decomposition:       20000006-0009-4000-8000-000000000001
--   Estimation & Reasonableness: 20000006-0008-4000-8000-000000000001
--
-- Lesson IDs:
--   Break It Down:       b2000006-0019-4000-8000-000000000001
--   Is That Reasonable?: b2000006-001a-4000-8000-000000000001
--   Planning a Party:    b2000006-001b-4000-8000-000000000001
--   Building a Robot:    b2000006-001c-4000-8000-000000000001
--   Puzzle Challenge!:   b2000006-001d-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Problem Solving 2nd Grade: Problem Decomposition,
--    Estimation & Reasonableness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000006-0009-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'problem_decomposition', 'Problem Decomposition', 'Break a large problem or task into smaller, manageable steps', 'CCSS.MP.1', 9),
  ('20000006-0008-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'estimation_reasonableness', 'Estimation & Reasonableness', 'Estimate answers and evaluate whether a result makes sense', 'CCSS.MP.2', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Problem Solving: Real-World Problem Solving)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0611-4000-8000-000000000001', 2, 38, 'Real-World Problem Solving', 'Tackle big problems by breaking them into small steps! Learn to estimate, plan, and check your answers.', 'lightbulb', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- PROBLEM SOLVING LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Break It Down
-- Module: Real-World Problem Solving | Skill: Problem Decomposition
-- Widgets: sequence_order + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0019-4000-8000-000000000001',
  '10000002-0611-4000-8000-000000000001',
  1,
  'Break It Down',
  'Decompose a big task into small steps. Learn the secret superpower of breaking problems into pieces!',
  'Hey there, problem solver! Chip here! Did you know that even the BIGGEST problems can be solved if you break them into tiny pieces? Imagine trying to eat a whole pizza in one bite -- that''s impossible! But one slice at a time? Easy! Today we''re going to learn how to take BIG tasks and break them into small, simple steps. This is called DECOMPOSITION, and it''s a superpower that real engineers and scientists use every day!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "prompt": "Put the steps for making a peanut butter and jelly sandwich in the right order!",
        "items": [
          {"id": "s1", "text": "Get two slices of bread", "emoji": "🍞", "correctPosition": 1},
          {"id": "s2", "text": "Spread peanut butter on one slice", "emoji": "🥜", "correctPosition": 2},
          {"id": "s3", "text": "Spread jelly on the other slice", "emoji": "🍇", "correctPosition": 3},
          {"id": "s4", "text": "Press the two slices together", "emoji": "🥪", "correctPosition": 4},
          {"id": "s5", "text": "Cut the sandwich in half", "emoji": "🔪", "correctPosition": 5}
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each big task to its FIRST small step!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "clean-room", "text": "Clean your room", "emoji": "🧹"},
            "right": {"id": "pick-up", "text": "Pick up toys off the floor", "emoji": "🧸"}
          },
          {
            "id": "p2",
            "left": {"id": "plant-garden", "text": "Plant a garden", "emoji": "🌱"},
            "right": {"id": "dig-hole", "text": "Dig a hole in the soil", "emoji": "🕳️"}
          },
          {
            "id": "p3",
            "left": {"id": "build-lego", "text": "Build a LEGO castle", "emoji": "🏰"},
            "right": {"id": "sort-pieces", "text": "Sort the pieces by color", "emoji": "🔵"}
          },
          {
            "id": "p4",
            "left": {"id": "get-dressed", "text": "Get ready for school", "emoji": "🎒"},
            "right": {"id": "wake-up", "text": "Wake up and get out of bed", "emoji": "⏰"}
          },
          {
            "id": "p5",
            "left": {"id": "bake-cookies", "text": "Bake cookies", "emoji": "🍪"},
            "right": {"id": "gather-ingredients", "text": "Gather all the ingredients", "emoji": "🥚"}
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "You want to draw a picture of a house. Put the steps in order!",
        "items": [
          {"id": "s1", "text": "Draw a big square for the walls", "emoji": "⬜", "correctPosition": 1},
          {"id": "s2", "text": "Add a triangle roof on top", "emoji": "🔺", "correctPosition": 2},
          {"id": "s3", "text": "Draw a door in the middle", "emoji": "🚪", "correctPosition": 3},
          {"id": "s4", "text": "Add windows on each side", "emoji": "🪟", "correctPosition": 4},
          {"id": "s5", "text": "Color in your house", "emoji": "🎨", "correctPosition": 5}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What does it mean to DECOMPOSE a problem?",
            "promptEmoji": "🤔",
            "options": [
              {"id": "a", "text": "Throw the problem away", "emoji": "🗑️"},
              {"id": "b", "text": "Break it into smaller, easier steps", "emoji": "✂️"},
              {"id": "c", "text": "Ask someone else to do it", "emoji": "🙋"},
              {"id": "d", "text": "Do it all at once really fast", "emoji": "💨"}
            ],
            "correctOptionId": "b",
            "hint": "Think about cutting a pizza into slices -- you break the big thing into smaller pieces!"
          },
          {
            "id": "mc2",
            "prompt": "Why is breaking a big task into steps helpful?",
            "promptEmoji": "💡",
            "options": [
              {"id": "a", "text": "It makes the task take longer", "emoji": "⏳"},
              {"id": "b", "text": "Each small step is easier to do", "emoji": "✅"},
              {"id": "c", "text": "It makes the task harder", "emoji": "😰"},
              {"id": "d", "text": "You don''t have to finish it", "emoji": "🚫"}
            ],
            "correctOptionId": "b",
            "hint": "Small steps are much easier than one giant leap!"
          },
          {
            "id": "mc3",
            "prompt": "A scientist needs to build a rocket. What should they do FIRST?",
            "promptEmoji": "🚀",
            "options": [
              {"id": "a", "text": "Build the whole rocket in one day", "emoji": "😵"},
              {"id": "b", "text": "Give up because it''s too hard", "emoji": "😞"},
              {"id": "c", "text": "Break the project into smaller parts like engine, body, and nose cone", "emoji": "📋"},
              {"id": "d", "text": "Paint the rocket first", "emoji": "🎨"}
            ],
            "correctOptionId": "c",
            "hint": "Even rockets are built one piece at a time! Break it down into parts."
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
-- LESSON 2: Is That Reasonable?
-- Module: Real-World Problem Solving | Skill: Estimation & Reasonableness
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-001a-4000-8000-000000000001',
  '10000002-0611-4000-8000-000000000001',
  2,
  'Is That Reasonable?',
  'Estimate and check if answers make sense. Learn to spot silly answers and find ones that are just right!',
  'Chip has a riddle for you! If someone told you there are 500 kids in your classroom, would that sound RIGHT? Of course not -- that''s way too many! Being a great problem solver means checking if your answer MAKES SENSE. Today we''re going to practice estimating -- that means making smart guesses -- and figuring out if answers are reasonable. Let''s become answer detectives!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0008-4000-8000-000000000001']::uuid[],
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
            "prompt": "About how many fingers does a person have?",
            "promptEmoji": "🖐️",
            "options": [
              {"id": "a", "text": "2 fingers", "emoji": "✌️"},
              {"id": "b", "text": "10 fingers", "emoji": "🖐️"},
              {"id": "c", "text": "50 fingers", "emoji": "😲"},
              {"id": "d", "text": "100 fingers", "emoji": "🤯"}
            ],
            "correctOptionId": "b",
            "hint": "Count on both hands! 5 on one hand plus 5 on the other."
          },
          {
            "id": "mc2",
            "prompt": "Sam says his dog weighs 1,000 pounds. Is that reasonable?",
            "promptEmoji": "🐕",
            "options": [
              {"id": "a", "text": "Yes, dogs are really heavy", "emoji": "✅"},
              {"id": "b", "text": "No way! That''s heavier than a horse!", "emoji": "🐴"},
              {"id": "c", "text": "Maybe if it''s a really big dog", "emoji": "🤷"},
              {"id": "d", "text": "Dogs don''t weigh anything", "emoji": "🪶"}
            ],
            "correctOptionId": "b",
            "hint": "Most dogs weigh between 10 and 100 pounds. 1,000 pounds is way too heavy -- that''s like a small car!"
          },
          {
            "id": "mc3",
            "prompt": "About how long does it take to brush your teeth?",
            "promptEmoji": "🪥",
            "options": [
              {"id": "a", "text": "1 second", "emoji": "⚡"},
              {"id": "b", "text": "2 minutes", "emoji": "⏱️"},
              {"id": "c", "text": "2 hours", "emoji": "😴"},
              {"id": "d", "text": "1 whole day", "emoji": "📅"}
            ],
            "correctOptionId": "b",
            "hint": "Dentists say you should brush for about 2 minutes -- not too short and not too long!"
          },
          {
            "id": "mc4",
            "prompt": "Lily counted 3 apples in one bag and 4 apples in another bag. She says she has 34 apples total. Is that reasonable?",
            "promptEmoji": "🍎",
            "options": [
              {"id": "a", "text": "Yes, that sounds right", "emoji": "✅"},
              {"id": "b", "text": "No, 3 + 4 = 7, not 34", "emoji": "❌"},
              {"id": "c", "text": "Maybe she found more bags", "emoji": "🤔"},
              {"id": "d", "text": "Apples can''t be counted", "emoji": "🚫"}
            ],
            "correctOptionId": "b",
            "hint": "3 plus 4 is 7. The answer 34 is WAY too big -- something went wrong!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "A 2nd grader is about ___ feet tall.",
            "correctAnswer": "4",
            "acceptableAnswers": ["4", "four", "3", "three"],
            "hint": "Think about how tall you are -- you''re not as tall as a grown-up yet!",
            "wordBank": ["2", "4", "10", "20"]
          },
          {
            "id": "f2",
            "template": "There are about ___ kids in a classroom.",
            "correctAnswer": "25",
            "acceptableAnswers": ["25", "twenty-five", "20", "twenty", "30", "thirty"],
            "hint": "Think about your own class. Is it closer to 5 kids or 500 kids?",
            "wordBank": ["3", "25", "200", "500"]
          },
          {
            "id": "f3",
            "template": "If you have 5 cookies and eat 2, you have ___ cookies left.",
            "correctAnswer": "3",
            "acceptableAnswers": ["3", "three"],
            "hint": "Start with 5 and take away 2. Count what''s left!",
            "wordBank": ["1", "3", "7", "10"]
          },
          {
            "id": "f4",
            "template": "A school bus can hold about ___ kids.",
            "correctAnswer": "40",
            "acceptableAnswers": ["40", "forty", "50", "fifty", "30", "thirty"],
            "hint": "A bus has lots of seats, but not hundreds -- think about how many rows there are.",
            "wordBank": ["5", "40", "500", "1000"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc5",
            "prompt": "What does ESTIMATE mean?",
            "promptEmoji": "🧠",
            "options": [
              {"id": "a", "text": "To guess without thinking at all", "emoji": "🎲"},
              {"id": "b", "text": "To make a smart guess using what you know", "emoji": "💡"},
              {"id": "c", "text": "To copy someone else''s answer", "emoji": "📋"},
              {"id": "d", "text": "To count every single thing perfectly", "emoji": "🔢"}
            ],
            "correctOptionId": "b",
            "hint": "An estimate isn''t a wild guess -- you use what you already know to figure out a close answer!"
          },
          {
            "id": "mc6",
            "prompt": "Why should you check if your answer is reasonable?",
            "promptEmoji": "🔍",
            "options": [
              {"id": "a", "text": "To waste time", "emoji": "⏳"},
              {"id": "b", "text": "Because the teacher said so", "emoji": "👩‍🏫"},
              {"id": "c", "text": "To catch mistakes before they cause problems", "emoji": "🎯"},
              {"id": "d", "text": "You don''t need to check answers", "emoji": "🚫"}
            ],
            "correctOptionId": "c",
            "hint": "Checking your work helps you find mistakes early -- like a detective solving a case!"
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
-- LESSON 3: Planning a Party
-- Module: Real-World Problem Solving | Skill: Problem Decomposition
-- Widgets: fill_in_blank + multiple_choice + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-001b-4000-8000-000000000001',
  '10000002-0611-4000-8000-000000000001',
  3,
  'Planning a Party',
  'Use your problem-solving skills to plan an awesome birthday party step by step!',
  'Guess what? Chip''s friend is having a birthday party, and WE get to help plan it! But wait -- planning a party is a BIG job. There are snacks to get, decorations to put up, games to plan, and invitations to send. If we try to do everything at once, it''ll be a mess! Let''s use our decomposition skills to break the party planning into easy steps. Ready to party plan like a pro?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "prompt": "Put the party planning steps in a good order!",
        "items": [
          {"id": "s1", "text": "Choose a date and time", "emoji": "📅", "correctPosition": 1},
          {"id": "s2", "text": "Send invitations to friends", "emoji": "💌", "correctPosition": 2},
          {"id": "s3", "text": "Buy snacks and a birthday cake", "emoji": "🎂", "correctPosition": 3},
          {"id": "s4", "text": "Put up decorations", "emoji": "🎈", "correctPosition": 4},
          {"id": "s5", "text": "Enjoy the party!", "emoji": "🥳", "correctPosition": 5}
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "If 8 friends are coming and each gets 2 slices of pizza, we need ___ slices total.",
            "correctAnswer": "16",
            "acceptableAnswers": ["16", "sixteen"],
            "hint": "8 friends times 2 slices each -- count by 2s!",
            "wordBank": ["8", "10", "16", "20"]
          },
          {
            "id": "f2",
            "template": "We need ___ party hats if 10 kids are coming to the party.",
            "correctAnswer": "10",
            "acceptableAnswers": ["10", "ten"],
            "hint": "Each kid needs one hat. How many kids are coming?",
            "wordBank": ["5", "10", "15", "20"]
          },
          {
            "id": "f3",
            "template": "The party starts at 2:00 and lasts 2 hours. It ends at ___:00.",
            "correctAnswer": "4",
            "acceptableAnswers": ["4", "four", "4:00"],
            "hint": "Start at 2 o''clock and add 2 more hours.",
            "wordBank": ["3", "4", "5", "6"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "You need to plan games for the party. What''s the BEST first step?",
            "promptEmoji": "🎮",
            "options": [
              {"id": "a", "text": "Buy every game at the store", "emoji": "🛒"},
              {"id": "b", "text": "Make a list of fun games your friends like", "emoji": "📝"},
              {"id": "c", "text": "Play all the games by yourself first", "emoji": "🎯"},
              {"id": "d", "text": "Skip the games and just eat cake", "emoji": "🎂"}
            ],
            "correctOptionId": "b",
            "hint": "Good planners start with a list! Think about what your friends enjoy."
          },
          {
            "id": "mc2",
            "prompt": "You forgot to buy balloons! The party is in 1 hour. What''s the BEST solution?",
            "promptEmoji": "😱",
            "options": [
              {"id": "a", "text": "Cancel the whole party", "emoji": "❌"},
              {"id": "b", "text": "Cry about it", "emoji": "😢"},
              {"id": "c", "text": "Use paper decorations you already have instead", "emoji": "🎨"},
              {"id": "d", "text": "Pretend it''s not a party", "emoji": "😐"}
            ],
            "correctOptionId": "c",
            "hint": "Good problem solvers find a different way when the first plan doesn''t work!"
          },
          {
            "id": "mc3",
            "prompt": "Why does making a checklist help when planning a party?",
            "promptEmoji": "✅",
            "options": [
              {"id": "a", "text": "It doesn''t help at all", "emoji": "🚫"},
              {"id": "b", "text": "So you can check off each step and not forget anything", "emoji": "📋"},
              {"id": "c", "text": "Because checklists are fun to draw", "emoji": "🎨"},
              {"id": "d", "text": "Only grown-ups use checklists", "emoji": "👨"}
            ],
            "correctOptionId": "b",
            "hint": "A checklist helps you keep track of what you''ve done and what still needs to be done!"
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
-- LESSON 4: Building a Robot
-- Module: Real-World Problem Solving | Skill: Problem Decomposition
-- Widgets: sequence_order + fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-001c-4000-8000-000000000001',
  '10000002-0611-4000-8000-000000000001',
  4,
  'Building a Robot',
  'Plan how to build a robot step by step! Break down a big engineering project into small pieces.',
  'Chip is SO excited about this one -- because today we''re planning how to build a ROBOT! Now, you can''t just stick some parts together and hope it works. Real engineers plan every step carefully. They figure out what parts they need, what order to put them together, and test everything along the way. Let''s think like engineers and plan our robot build step by step!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "prompt": "Put the robot-building steps in the right order!",
        "items": [
          {"id": "s1", "text": "Draw a plan of what the robot will look like", "emoji": "📐", "correctPosition": 1},
          {"id": "s2", "text": "Gather all the parts you need", "emoji": "🔩", "correctPosition": 2},
          {"id": "s3", "text": "Build the robot body", "emoji": "🤖", "correctPosition": 3},
          {"id": "s4", "text": "Add the arms and legs", "emoji": "🦾", "correctPosition": 4},
          {"id": "s5", "text": "Test if the robot works", "emoji": "✅", "correctPosition": 5}
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "Before building, an engineer first makes a ___ to show what the robot will look like.",
            "correctAnswer": "plan",
            "acceptableAnswers": ["plan", "Plan", "drawing", "Drawing", "design", "Design"],
            "hint": "You draw this on paper before you start building. It shows your idea!",
            "wordBank": ["plan", "mess", "guess", "wish"]
          },
          {
            "id": "f2",
            "template": "A robot needs ___ parts: a body, arms, legs, and a head.",
            "correctAnswer": "4",
            "acceptableAnswers": ["4", "four"],
            "hint": "Count them: body, arms, legs, head. That''s how many main parts?",
            "wordBank": ["2", "4", "6", "10"]
          },
          {
            "id": "f3",
            "template": "After building the robot, you should ___ it to make sure it works.",
            "correctAnswer": "test",
            "acceptableAnswers": ["test", "Test", "try", "Try", "check", "Check"],
            "hint": "You need to see if everything works correctly. What do scientists do after building something?",
            "wordBank": ["test", "hide", "paint", "sell"]
          },
          {
            "id": "f4",
            "template": "If something doesn''t work, you go back and ___ it.",
            "correctAnswer": "fix",
            "acceptableAnswers": ["fix", "Fix", "repair", "Repair", "change", "Change"],
            "hint": "When something is broken, you make it better. What''s the word?",
            "wordBank": ["fix", "break", "throw", "ignore"]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "Your robot''s arm falls off during testing. What should you do?",
            "promptEmoji": "🦾",
            "options": [
              {"id": "a", "text": "Throw the whole robot away", "emoji": "🗑️"},
              {"id": "b", "text": "Figure out WHY it fell off and fix that part", "emoji": "🔧"},
              {"id": "c", "text": "Pretend the robot doesn''t need arms", "emoji": "😅"},
              {"id": "d", "text": "Give up and watch TV", "emoji": "📺"}
            ],
            "correctOptionId": "b",
            "hint": "Engineers don''t give up! They find the problem and fix it -- that''s called debugging!"
          },
          {
            "id": "mc2",
            "prompt": "Why do engineers build robots ONE STEP at a time instead of all at once?",
            "promptEmoji": "🤖",
            "options": [
              {"id": "a", "text": "Because they''re slow", "emoji": "🐌"},
              {"id": "b", "text": "So they can test each part and catch mistakes early", "emoji": "🎯"},
              {"id": "c", "text": "Because they only have one hand", "emoji": "🤚"},
              {"id": "d", "text": "They don''t -- they build everything at once", "emoji": "💥"}
            ],
            "correctOptionId": "b",
            "hint": "If you test each step, you can find and fix problems before they get bigger!"
          },
          {
            "id": "mc3",
            "prompt": "Which is NOT a real step in building a robot?",
            "promptEmoji": "❌",
            "options": [
              {"id": "a", "text": "Drawing a plan", "emoji": "📐"},
              {"id": "b", "text": "Gathering the parts", "emoji": "🔩"},
              {"id": "c", "text": "Wishing really hard that it works", "emoji": "🌟"},
              {"id": "d", "text": "Testing the robot", "emoji": "✅"}
            ],
            "correctOptionId": "c",
            "hint": "Planning, gathering, building, and testing are all real steps. But hoping isn''t a step!"
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
-- LESSON 5: Puzzle Challenge!
-- Module: Real-World Problem Solving | Skills: Problem Decomposition +
--   Estimation & Reasonableness
-- Widgets: multiple_choice + fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-001d-4000-8000-000000000001',
  '10000002-0611-4000-8000-000000000001',
  5,
  'Puzzle Challenge!',
  'Put all your problem-solving skills together in this capstone challenge! Decompose, estimate, and solve!',
  'It''s CHALLENGE TIME! Chip is SO proud of everything you''ve learned. You can break big problems into small steps, estimate answers, check if things are reasonable, and plan like an engineer! Now let''s put ALL those skills together in one epic puzzle challenge. Show Chip what an amazing problem solver you are!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0009-4000-8000-000000000001', '20000006-0008-4000-8000-000000000001']::uuid[],
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
            "prompt": "You need to clean the whole house before grandma visits. What''s the BEST strategy?",
            "promptEmoji": "🏠",
            "options": [
              {"id": "a", "text": "Try to clean every room at the same time", "emoji": "😵‍💫"},
              {"id": "b", "text": "Break it into rooms and clean one room at a time", "emoji": "📋"},
              {"id": "c", "text": "Hide the mess under the bed", "emoji": "🛏️"},
              {"id": "d", "text": "Tell grandma not to come", "emoji": "📵"}
            ],
            "correctOptionId": "b",
            "hint": "Decomposition! Break the big task (whole house) into smaller tasks (one room at a time)."
          },
          {
            "id": "mc2",
            "prompt": "Tom says he read 200 books yesterday. Is that reasonable?",
            "promptEmoji": "📚",
            "options": [
              {"id": "a", "text": "Yes, if he reads fast", "emoji": "⚡"},
              {"id": "b", "text": "No, that''s way too many for one day", "emoji": "❌"},
              {"id": "c", "text": "Yes, books are short", "emoji": "📖"},
              {"id": "d", "text": "Maybe if they were picture books", "emoji": "🖼️"}
            ],
            "correctOptionId": "b",
            "hint": "Even if a book takes only 15 minutes, 200 books would take over 2 days of nonstop reading!"
          },
          {
            "id": "mc3",
            "prompt": "You''re lost in a big corn maze. What problem-solving strategy should you use?",
            "promptEmoji": "🌽",
            "options": [
              {"id": "a", "text": "Run as fast as you can in any direction", "emoji": "🏃"},
              {"id": "b", "text": "Sit down and cry", "emoji": "😢"},
              {"id": "c", "text": "Pick one path, try it, and if it''s wrong go back and try another", "emoji": "🗺️"},
              {"id": "d", "text": "Close your eyes and walk straight", "emoji": "😵"}
            ],
            "correctOptionId": "c",
            "hint": "Try one path at a time. If it doesn''t work, go back and try a different one -- that''s step-by-step problem solving!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "f1",
            "template": "Breaking a big problem into smaller pieces is called ___.",
            "correctAnswer": "decomposition",
            "acceptableAnswers": ["decomposition", "Decomposition", "breaking it down", "decomposing"],
            "hint": "This big word starts with D and means splitting something into parts!",
            "wordBank": ["decomposition", "estimation", "multiplication", "imagination"]
          },
          {
            "id": "f2",
            "template": "Making a smart guess about an answer is called making an ___.",
            "correctAnswer": "estimate",
            "acceptableAnswers": ["estimate", "Estimate", "estimation", "Estimation"],
            "hint": "This word starts with E and means a close-enough guess!",
            "wordBank": ["estimate", "exact", "error", "example"]
          },
          {
            "id": "f3",
            "template": "If an answer doesn''t make sense, it is NOT ___.",
            "correctAnswer": "reasonable",
            "acceptableAnswers": ["reasonable", "Reasonable"],
            "hint": "This word means the answer makes sense and sounds right. It starts with R!",
            "wordBank": ["reasonable", "purple", "funny", "loud"]
          },
          {
            "id": "f4",
            "template": "A baker needs 3 eggs per cake. To bake 4 cakes, she needs ___ eggs.",
            "correctAnswer": "12",
            "acceptableAnswers": ["12", "twelve"],
            "hint": "3 eggs for each cake, and there are 4 cakes. 3 + 3 + 3 + 3 = ?",
            "wordBank": ["7", "12", "34", "43"]
          }
        ]
      },
      {
        "type": "sequence_order",
        "prompt": "You want to learn how to ride a bike. Put the steps in order!",
        "items": [
          {"id": "s1", "text": "Put on your helmet", "emoji": "⛑️", "correctPosition": 1},
          {"id": "s2", "text": "Practice balancing while someone holds the bike", "emoji": "🤝", "correctPosition": 2},
          {"id": "s3", "text": "Try pedaling slowly with help", "emoji": "🚲", "correctPosition": 3},
          {"id": "s4", "text": "Practice riding on your own", "emoji": "💪", "correctPosition": 4},
          {"id": "s5", "text": "Ride around the neighborhood!", "emoji": "🏘️", "correctPosition": 5}
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc4",
            "prompt": "You solved a math problem and got the answer 3,000. The problem was 15 + 12. Is your answer reasonable?",
            "promptEmoji": "🔢",
            "options": [
              {"id": "a", "text": "Yes, that''s correct", "emoji": "✅"},
              {"id": "b", "text": "No, 15 + 12 should be close to 27, not 3,000", "emoji": "🎯"},
              {"id": "c", "text": "Maybe, numbers are tricky", "emoji": "🤷"},
              {"id": "d", "text": "You need a calculator to know", "emoji": "🧮"}
            ],
            "correctOptionId": "b",
            "hint": "15 + 12 is about 27. The answer 3,000 is WAY too big -- that''s not reasonable!"
          },
          {
            "id": "mc5",
            "prompt": "What makes someone a GREAT problem solver?",
            "promptEmoji": "🌟",
            "options": [
              {"id": "a", "text": "Never making any mistakes", "emoji": "🚫"},
              {"id": "b", "text": "Always asking someone else for the answer", "emoji": "🙋"},
              {"id": "c", "text": "Breaking problems into steps, estimating, and checking answers", "emoji": "🧠"},
              {"id": "d", "text": "Giving up quickly when things are hard", "emoji": "😤"}
            ],
            "correctOptionId": "c",
            "hint": "Great problem solvers use ALL the strategies we learned: decompose, estimate, and check!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
