-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Problem Solving: Patterns & Data
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - L1: Growing Patterns (sequence_order + fill_in_blank)
--   - L2: Complex Patterns (sequence_order + multiple_choice)
--   - L3: Reading Picture Graphs (multiple_choice + fill_in_blank)
--   - L4: Collecting Data (multiple_choice + matching_pairs)
--   - L5: Data Detectives (multiple_choice + fill_in_blank)
--
-- Widget types used: sequence_order, fill_in_blank, multiple_choice, matching_pairs
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 019_seed_2nd_grade_math_problemsolving.sql (established Problem Solving subject)
--
-- Cross-subject with Math.
--
-- Subject ID:
--   Problem Solving: f4c1f559-85c6-412e-a788-d6efc8bf4c9d
--
-- Module ID:
--   Patterns & Data: 10000002-0606-4000-8000-000000000001
--
-- Skill IDs:
--   Data & Graphs:                20000006-0007-4000-8000-000000000001
--   Estimation & Reasonableness:  20000006-0008-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Subject, Module, Skills
-- =========================================================================

-- 0a. Subject (ON CONFLICT for idempotency)
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'problem_solving_g2', 'Puzzle Lab G2', 'Problem Solving', '#EAB308', 'puzzle', 13)
ON CONFLICT (id) DO NOTHING;

-- 0b. Module
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0606-4000-8000-000000000001', 2, 37, 'Patterns & Data', 'Discover growing patterns, decode complex sequences, read picture graphs, collect data, and become a data detective!', 'puzzle', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000006-0007-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'data_graphs',                'Data & Graphs',                'Read and interpret picture graphs and bar graphs to answer questions',              'ISTE 5a', 7),
  ('20000006-0008-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'estimation_reasonableness',   'Estimation & Reasonableness',  'Use estimation to check whether answers make sense and are reasonable',             'MP.2',    8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Growing Patterns
-- Module: Patterns & Data
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000b-4000-8000-000000000001',
  '10000002-0606-4000-8000-000000000001',
  1,
  'Growing Patterns',
  'Find the rule in growing patterns! Numbers that get bigger each time follow a secret rule.',
  'Hey superstar! Chip found something amazing -- numbers that GROW! Some patterns get bigger and bigger by following a secret rule. Like 1, 3, 5, 7... see how each number is 2 more than the last? Let''s crack the code of growing patterns!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "gp-so1",
            "prompt": "Put these numbers in order to make a growing pattern that adds 2 each time!",
            "items": [
              {"id": "i1", "text": "1", "emoji": "\ud83d\udd22", "correctPosition": 1},
              {"id": "i2", "text": "3", "emoji": "\ud83d\udd22", "correctPosition": 2},
              {"id": "i3", "text": "5", "emoji": "\ud83d\udd22", "correctPosition": 3},
              {"id": "i4", "text": "7", "emoji": "\ud83d\udd22", "correctPosition": 4},
              {"id": "i5", "text": "9", "emoji": "\ud83d\udd22", "correctPosition": 5}
            ],
            "hint": "Start with the smallest number and add 2 each time: 1, 3, 5, 7, 9!"
          },
          {
            "id": "gp-so2",
            "prompt": "Arrange these numbers to show a pattern that adds 5 each time!",
            "items": [
              {"id": "i1", "text": "5", "emoji": "\ud83d\udd22", "correctPosition": 1},
              {"id": "i2", "text": "10", "emoji": "\ud83d\udd22", "correctPosition": 2},
              {"id": "i3", "text": "15", "emoji": "\ud83d\udd22", "correctPosition": 3},
              {"id": "i4", "text": "20", "emoji": "\ud83d\udd22", "correctPosition": 4}
            ],
            "hint": "Count by 5s! 5, 10, 15, 20. Each number is 5 more than the last."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "gp-fb1",
            "prompt": "1, 3, 5, 7, ___. What comes next? (Adding 2 each time)",
            "blanks": [{ "id": "b1", "correctAnswer": "9", "acceptableAnswers": ["9"] }],
            "hint": "7 plus 2 equals..."
          },
          {
            "id": "gp-fb2",
            "prompt": "2, 4, 6, 8, ___. What comes next? (Adding 2 each time)",
            "blanks": [{ "id": "b1", "correctAnswer": "10", "acceptableAnswers": ["10"] }],
            "hint": "8 plus 2 equals..."
          },
          {
            "id": "gp-fb3",
            "prompt": "10, 20, 30, ___. What comes next? (Adding 10 each time)",
            "blanks": [{ "id": "b1", "correctAnswer": "40", "acceptableAnswers": ["40"] }],
            "hint": "30 plus 10 equals..."
          },
          {
            "id": "gp-fb4",
            "prompt": "3, 6, 9, ___. What comes next? (Adding 3 each time)",
            "blanks": [{ "id": "b1", "correctAnswer": "12", "acceptableAnswers": ["12"] }],
            "hint": "9 plus 3 equals..."
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
-- LESSON 2: Complex Patterns (ABC, AABB)
-- Module: Patterns & Data
-- Widgets: sequence_order + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000c-4000-8000-000000000001',
  '10000002-0606-4000-8000-000000000001',
  2,
  'Complex Patterns',
  'Decode tricky repeating patterns like ABC and AABB! Multiple elements repeat together.',
  'Chip noticed something cool -- some patterns use MORE than two things! Like clap-snap-stomp, clap-snap-stomp. That is an ABC pattern! And some go clap-clap-snap-snap. That is an AABB pattern! Let''s become pattern masters!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "cp-so1",
            "prompt": "Put these in order to continue the ABC pattern: circle, star, heart, circle, star, ___",
            "items": [
              {"id": "i1", "text": "Heart", "emoji": "\u2764\ufe0f", "correctPosition": 1},
              {"id": "i2", "text": "Circle", "emoji": "\u26aa", "correctPosition": 2},
              {"id": "i3", "text": "Star", "emoji": "\u2b50", "correctPosition": 3}
            ],
            "hint": "The pattern is A-B-C: circle, star, heart. After heart, the pattern repeats: heart, circle, star!"
          },
          {
            "id": "cp-so2",
            "prompt": "Continue the AABB pattern: red, red, blue, blue, red, red, ___",
            "items": [
              {"id": "i1", "text": "Blue", "emoji": "\ud83d\udd35", "correctPosition": 1},
              {"id": "i2", "text": "Blue", "emoji": "\ud83d\udd35", "correctPosition": 2},
              {"id": "i3", "text": "Red", "emoji": "\ud83d\udd34", "correctPosition": 3},
              {"id": "i4", "text": "Red", "emoji": "\ud83d\udd34", "correctPosition": 4}
            ],
            "hint": "AABB means two of the same, then two of the other. After red-red comes blue-blue, then red-red again!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cp-mc1",
            "prompt": "What type of pattern is this? Sun, Moon, Star, Sun, Moon, Star",
            "options": [
              {"id": "a", "text": "AB pattern"},
              {"id": "b", "text": "ABC pattern"},
              {"id": "c", "text": "AABB pattern"},
              {"id": "d", "text": "ABBA pattern"}
            ],
            "correctOptionId": "b",
            "hint": "Three different things repeat: Sun(A), Moon(B), Star(C). That is an ABC pattern!"
          },
          {
            "id": "cp-mc2",
            "prompt": "What type of pattern is this? Clap, Clap, Stomp, Stomp, Clap, Clap, Stomp, Stomp",
            "options": [
              {"id": "a", "text": "AB pattern"},
              {"id": "b", "text": "ABC pattern"},
              {"id": "c", "text": "AABB pattern"},
              {"id": "d", "text": "AAB pattern"}
            ],
            "correctOptionId": "c",
            "hint": "Two claps then two stomps -- that is two A''s then two B''s: AABB!"
          },
          {
            "id": "cp-mc3",
            "prompt": "What comes next? Triangle, Triangle, Circle, Triangle, Triangle, Circle, ___",
            "options": [
              {"id": "a", "text": "Circle"},
              {"id": "b", "text": "Triangle"},
              {"id": "c", "text": "Square"},
              {"id": "d", "text": "Star"}
            ],
            "correctOptionId": "b",
            "hint": "The pattern is AAB: triangle, triangle, circle. It starts over with triangle!"
          },
          {
            "id": "cp-mc4",
            "prompt": "Which group of shapes follows an ABBA pattern?",
            "options": [
              {"id": "a", "text": "Red, Blue, Red, Blue"},
              {"id": "b", "text": "Red, Blue, Blue, Red"},
              {"id": "c", "text": "Red, Red, Blue, Blue"},
              {"id": "d", "text": "Red, Blue, Red, Red"}
            ],
            "correctOptionId": "b",
            "hint": "ABBA means: first thing, second thing, second thing, first thing. Like a mirror!"
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
-- LESSON 3: Reading Picture Graphs
-- Module: Patterns & Data
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000d-4000-8000-000000000001',
  '10000002-0606-4000-8000-000000000001',
  3,
  'Reading Picture Graphs',
  'Learn to read picture graphs and answer questions about the data! Each picture stands for one thing.',
  'Chip made a picture graph of favorite fruits in class! A picture graph uses little pictures to show information. Each picture means one vote. By counting the pictures, you can answer all kinds of questions. Let''s read some picture graphs!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0007-4000-8000-000000000001', '20000006-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pg-mc1",
            "prompt": "Favorite Fruits: Apple has 5 pictures, Banana has 3 pictures, Grape has 4 pictures. Which fruit got the MOST votes?",
            "options": [
              {"id": "a", "text": "Apple"},
              {"id": "b", "text": "Banana"},
              {"id": "c", "text": "Grape"},
              {"id": "d", "text": "They are all the same"}
            ],
            "correctOptionId": "a",
            "hint": "Count the pictures: Apple has 5, which is the most!"
          },
          {
            "id": "pg-mc2",
            "prompt": "Favorite Fruits: Apple has 5 pictures, Banana has 3 pictures, Grape has 4 pictures. Which fruit got the FEWEST votes?",
            "options": [
              {"id": "a", "text": "Apple"},
              {"id": "b", "text": "Banana"},
              {"id": "c", "text": "Grape"},
              {"id": "d", "text": "They are all the same"}
            ],
            "correctOptionId": "b",
            "hint": "Banana has only 3 pictures -- that is the fewest!"
          },
          {
            "id": "pg-mc3",
            "prompt": "Favorite Pets: Dog has 6 pictures, Cat has 4 pictures, Fish has 2 pictures. How many MORE kids chose Dog than Fish?",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "4"},
              {"id": "c", "text": "6"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "b",
            "hint": "Dog has 6 and Fish has 2. The difference is 6 minus 2 = 4!"
          },
          {
            "id": "pg-mc4",
            "prompt": "Favorite Colors: Red has 3 pictures, Blue has 5 pictures, Green has 3 pictures. How many kids voted in total?",
            "options": [
              {"id": "a", "text": "8"},
              {"id": "b", "text": "10"},
              {"id": "c", "text": "11"},
              {"id": "d", "text": "13"}
            ],
            "correctOptionId": "c",
            "hint": "Add them all up: 3 + 5 + 3 = 11 kids voted!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "pg-fb1",
            "prompt": "Favorite Seasons: Spring has 4 votes, Summer has 7 votes, Fall has 3 votes, Winter has 2 votes. How many votes total? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "16", "acceptableAnswers": ["16"] }],
            "hint": "Add all the votes: 4 + 7 + 3 + 2 = ..."
          },
          {
            "id": "pg-fb2",
            "prompt": "Favorite Seasons: Spring has 4, Summer has 7, Fall has 3, Winter has 2. How many MORE votes did Summer get than Winter? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5"] }],
            "hint": "Summer has 7 and Winter has 2. The difference is 7 minus 2 = ..."
          },
          {
            "id": "pg-fb3",
            "prompt": "Favorite Snacks: Chips has 5 votes, Cookies has 8 votes, Fruit has 6 votes. How many FEWER votes did Chips get than Cookies? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "3", "acceptableAnswers": ["3"] }],
            "hint": "Cookies has 8 and Chips has 5. The difference is 8 minus 5 = ..."
          },
          {
            "id": "pg-fb4",
            "prompt": "Favorite Snacks: Chips has 5, Cookies has 8, Fruit has 6. If 2 more kids voted for Fruit, how many votes would Fruit have? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "Fruit has 6 votes now. 6 plus 2 more = ..."
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
-- LESSON 4: Collecting Data
-- Module: Patterns & Data
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000e-4000-8000-000000000001',
  '10000002-0606-4000-8000-000000000001',
  4,
  'Collecting Data',
  'Learn how to gather and organize information! Ask questions, collect answers, and sort them into groups.',
  'Chip wants to know what everyone''s favorite ice cream flavor is! To find out, we need to COLLECT DATA. That means asking a question, writing down the answers, and organizing them. Let''s learn how to be awesome data collectors!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0007-4000-8000-000000000001', '20000006-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cd-mc1",
            "prompt": "Which is a good survey question to collect data about your classmates?",
            "options": [
              {"id": "a", "text": "What is your favorite sport?"},
              {"id": "b", "text": "Do you like stuff?"},
              {"id": "c", "text": "Tell me everything about yourself."},
              {"id": "d", "text": "Are you nice?"}
            ],
            "correctOptionId": "a",
            "hint": "A good survey question is clear and specific. Asking about a favorite sport gives a clear answer!"
          },
          {
            "id": "cd-mc2",
            "prompt": "Chip asked 10 friends their favorite color. 4 said blue, 3 said red, 2 said green, 1 said yellow. What is the best way to show this data?",
            "options": [
              {"id": "a", "text": "Write a long story about it"},
              {"id": "b", "text": "Make a picture graph or tally chart"},
              {"id": "c", "text": "Just remember it in your head"},
              {"id": "d", "text": "Draw a picture of a rainbow"}
            ],
            "correctOptionId": "b",
            "hint": "A picture graph or tally chart organizes the data so everyone can see it clearly!"
          },
          {
            "id": "cd-mc3",
            "prompt": "Tally marks: IIII means 4, IIII with a line through means 5. How many does IIII II mean?",
            "options": [
              {"id": "a", "text": "5"},
              {"id": "b", "text": "6"},
              {"id": "c", "text": "7"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "IIII with a cross line = 5, plus II = 2 more. 5 + 2 = 7!"
          },
          {
            "id": "cd-mc4",
            "prompt": "You want to find out what game your class likes best. What should you do FIRST?",
            "options": [
              {"id": "a", "text": "Make a graph right away"},
              {"id": "b", "text": "Ask everyone which game they like best"},
              {"id": "c", "text": "Pick your own favorite game"},
              {"id": "d", "text": "Count to 100"}
            ],
            "correctOptionId": "b",
            "hint": "First you need to COLLECT the data by asking the question! Then you can organize it."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each data collection step to what you do!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "step1", "text": "Step 1: Ask a Question", "emoji": "\u2753"},
            "right": {"id": "ask", "text": "What is your favorite animal?", "emoji": "\ud83d\udc3e"}
          },
          {
            "id": "p2",
            "left": {"id": "step2", "text": "Step 2: Collect Answers", "emoji": "\ud83d\udcdd"},
            "right": {"id": "collect", "text": "Write down what each person says", "emoji": "\u270f\ufe0f"}
          },
          {
            "id": "p3",
            "left": {"id": "step3", "text": "Step 3: Organize Data", "emoji": "\ud83d\udcca"},
            "right": {"id": "organize", "text": "Use tally marks or a chart", "emoji": "\ud83d\udccb"}
          },
          {
            "id": "p4",
            "left": {"id": "step4", "text": "Step 4: Show Data", "emoji": "\ud83d\udcc8"},
            "right": {"id": "show", "text": "Make a picture graph", "emoji": "\ud83c\udfa8"}
          },
          {
            "id": "p5",
            "left": {"id": "step5", "text": "Step 5: Answer Questions", "emoji": "\ud83d\udca1"},
            "right": {"id": "answer", "text": "Which animal got the most votes?", "emoji": "\ud83c\udfc6"}
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
-- LESSON 5: Data Detectives
-- Module: Patterns & Data
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000f-4000-8000-000000000001',
  '10000002-0606-4000-8000-000000000001',
  5,
  'Data Detectives',
  'Draw conclusions from data! Look at the numbers and figure out what they are telling you.',
  'You are now a Data Detective! Chip has been collecting all kinds of data, and now it is YOUR job to figure out what the data is telling us. Look at the numbers, find patterns, and make smart conclusions. Let''s solve some data mysteries!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0007-4000-8000-000000000001', '20000006-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "dd-mc1",
            "prompt": "Chip counted birds at the park: Monday 3, Tuesday 5, Wednesday 7, Thursday 9. What pattern do you see?",
            "options": [
              {"id": "a", "text": "The numbers go down by 2"},
              {"id": "b", "text": "The numbers go up by 2"},
              {"id": "c", "text": "The numbers stay the same"},
              {"id": "d", "text": "The numbers go up by 3"}
            ],
            "correctOptionId": "b",
            "hint": "3, 5, 7, 9 -- each day has 2 MORE birds than the day before!"
          },
          {
            "id": "dd-mc2",
            "prompt": "Lunchbox data: 12 kids brought sandwiches, 5 brought salad, 8 brought pasta. What can you conclude?",
            "options": [
              {"id": "a", "text": "Most kids brought salad"},
              {"id": "b", "text": "Most kids brought pasta"},
              {"id": "c", "text": "Most kids brought sandwiches"},
              {"id": "d", "text": "Everyone brought the same thing"}
            ],
            "correctOptionId": "c",
            "hint": "Sandwiches had 12 votes, which is the most. Most kids prefer sandwiches!"
          },
          {
            "id": "dd-mc3",
            "prompt": "Chip tracked sunny days: January had 10, February had 12, March had 15. What will probably happen in April?",
            "options": [
              {"id": "a", "text": "Fewer sunny days than March"},
              {"id": "b", "text": "About the same or more sunny days"},
              {"id": "c", "text": "No sunny days at all"},
              {"id": "d", "text": "Exactly 10 sunny days"}
            ],
            "correctOptionId": "b",
            "hint": "The number of sunny days is going UP each month: 10, 12, 15. The pattern suggests April will have about the same or more!"
          },
          {
            "id": "dd-mc4",
            "prompt": "Recess votes: Kickball got 9, Tag got 7, Jump Rope got 4. Is it reasonable to say that most kids prefer Kickball or Tag?",
            "options": [
              {"id": "a", "text": "Yes, 9 + 7 = 16 out of 20 kids chose those two"},
              {"id": "b", "text": "No, Jump Rope is the most popular"},
              {"id": "c", "text": "No, everyone likes the same game"},
              {"id": "d", "text": "We cannot tell from this data"}
            ],
            "correctOptionId": "a",
            "hint": "Kickball (9) and Tag (7) together are 16 out of 20 total votes. That is most kids!"
          },
          {
            "id": "dd-mc5",
            "prompt": "Plant height data: Week 1 it was 2 inches, Week 2 it was 4 inches, Week 3 it was 6 inches. How tall will it probably be in Week 4?",
            "options": [
              {"id": "a", "text": "6 inches"},
              {"id": "b", "text": "7 inches"},
              {"id": "c", "text": "8 inches"},
              {"id": "d", "text": "10 inches"}
            ],
            "correctOptionId": "c",
            "hint": "The plant grows 2 inches each week: 2, 4, 6... so Week 4 should be 6 + 2 = 8 inches!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "dd-fb1",
            "prompt": "Book data: Chip read 3 books in January, 5 in February, and 7 in March. If the pattern continues, how many books will Chip read in April? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "9", "acceptableAnswers": ["9"] }],
            "hint": "The pattern adds 2 each month: 3, 5, 7... so next is 7 + 2 = ..."
          },
          {
            "id": "dd-fb2",
            "prompt": "Weather data: It rained 2 days in Week 1, 4 days in Week 2, and 1 day in Week 3. How many rainy days total? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "7", "acceptableAnswers": ["7"] }],
            "hint": "Add them up: 2 + 4 + 1 = ..."
          },
          {
            "id": "dd-fb3",
            "prompt": "Sticker chart: Emma earned 4 stickers on Monday, 6 on Tuesday, and 8 on Wednesday. She earns 2 more each day. How many on Thursday? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "10", "acceptableAnswers": ["10"] }],
            "hint": "8 plus 2 more equals..."
          },
          {
            "id": "dd-fb4",
            "prompt": "Snack survey: 15 kids were asked their favorite snack. Crackers got 6 votes and Fruit got 4 votes. How many votes did the OTHER snacks get altogether? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5"] }],
            "hint": "15 total minus 6 minus 4 = ..."
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
