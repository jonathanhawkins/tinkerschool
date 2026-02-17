-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Problem Solving: Logic & Reasoning
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - L1: If-Then Clue Puzzles
--   - L2: True or False Detectives
--   - L3: What Doesn't Belong?
--   - L4: Mystery Number
--   - L5: Matrix Puzzles
--
-- Widget types used: multiple_choice, fill_in_blank, matching_pairs
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 019_seed_2nd_grade_math_problemsolving.sql (established Problem Solving subject)
--
-- Subject ID:
--   Problem Solving: f4c1f559-85c6-412e-a788-d6efc8bf4c9d
--
-- Module ID:
--   Logic & Reasoning: 10000002-0605-4000-8000-000000000001
--
-- Skill IDs:
--   Logic Puzzles:      20000006-0005-4000-8000-000000000001
--   Pattern Extension:  20000006-0006-4000-8000-000000000001
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
  ('10000002-0605-4000-8000-000000000001', 2, 36, 'Logic & Reasoning', 'Become a logic detective! Use clues, spot patterns, and solve brain-teasing puzzles with Chip.', 'puzzle', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000006-0005-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'logic_puzzles',     'Logic Puzzles',     'Use if-then reasoning and elimination to solve clue-based puzzles',  '1A-AP-11', 5),
  ('20000006-0006-4000-8000-000000000001', 'f4c1f559-85c6-412e-a788-d6efc8bf4c9d', 'pattern_extension', 'Pattern Extension', 'Identify, extend, and apply rules to complete visual and number patterns', 'ISTE 5c', 6)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: If-Then Clue Puzzles
-- Module: Logic & Reasoning
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0006-4000-8000-000000000001',
  '10000002-0605-4000-8000-000000000001',
  1,
  'If-Then Clue Puzzles',
  'Use clues to crack the case! If something is true, then what must follow?',
  'Detective Chip reporting for duty! Today we are solving If-Then clue puzzles. Here is how it works: I give you a RULE and a CLUE, and you figure out the answer. For example, IF it is sunny THEN we wear sunglasses. It IS sunny today -- so what do we wear? Sunglasses! Let''s crack some cases!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "it-mc1",
            "prompt": "Rule: IF an animal has feathers, THEN it is a bird. A robin has feathers. What is a robin?",
            "options": [
              {"id": "a", "text": "A fish"},
              {"id": "b", "text": "A bird"},
              {"id": "c", "text": "A reptile"},
              {"id": "d", "text": "A mammal"}
            ],
            "correctOptionId": "b",
            "hint": "The rule says: feathers = bird. A robin has feathers, so a robin is a bird!"
          },
          {
            "id": "it-mc2",
            "prompt": "Rule: IF you eat all your veggies, THEN you get dessert. Sam ate all his veggies. What happens? \ud83e\udd66\ud83c\udf70",
            "options": [
              {"id": "a", "text": "Sam goes to bed"},
              {"id": "b", "text": "Sam gets dessert"},
              {"id": "c", "text": "Sam eats more veggies"},
              {"id": "d", "text": "Nothing happens"}
            ],
            "correctOptionId": "b",
            "hint": "The IF-THEN rule says veggies = dessert. Sam ate veggies, so Sam gets dessert!"
          },
          {
            "id": "it-mc3",
            "prompt": "Rule: IF it is a triangle, THEN it has 3 sides. This shape is a triangle. How many sides does it have? \ud83d\udd3a",
            "options": [
              {"id": "a", "text": "2 sides"},
              {"id": "b", "text": "3 sides"},
              {"id": "c", "text": "4 sides"},
              {"id": "d", "text": "5 sides"}
            ],
            "correctOptionId": "b",
            "hint": "Triangle = 3 sides. That is the rule!"
          },
          {
            "id": "it-mc4",
            "prompt": "Clue 1: The mystery pet is NOT a cat. Clue 2: The mystery pet can fly. What is the mystery pet? \ud83d\udd0e",
            "options": [
              {"id": "a", "text": "A cat \ud83d\udc31"},
              {"id": "b", "text": "A dog \ud83d\udc36"},
              {"id": "c", "text": "A parrot \ud83e\udd9c"},
              {"id": "d", "text": "A fish \ud83d\udc1f"}
            ],
            "correctOptionId": "c",
            "hint": "It is NOT a cat. It CAN fly. Dogs and fish cannot fly. A parrot can fly!"
          },
          {
            "id": "it-mc5",
            "prompt": "Clue 1: It is round. Clue 2: You can eat it. Clue 3: It is orange. What is it? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "A basketball \ud83c\udfc0"},
              {"id": "b", "text": "An orange \ud83c\udf4a"},
              {"id": "c", "text": "A banana \ud83c\udf4c"},
              {"id": "d", "text": "A globe \ud83c\udf0e"}
            ],
            "correctOptionId": "b",
            "hint": "Round + edible + orange colored. A basketball is not edible. A banana is not round. It is an orange!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "it-fb1",
            "prompt": "Rule: IF a number is even, THEN it ends in 0, 2, 4, 6, or 8. The number 16 is even. It ends in ___.",
            "blanks": [{ "id": "b1", "correctAnswer": "6", "acceptableAnswers": ["6"] }],
            "hint": "Look at the last digit of 16. What number is it?"
          },
          {
            "id": "it-fb2",
            "prompt": "Clue: Chip is thinking of a shape with 4 equal sides and 4 corners. It is a ___.",
            "blanks": [{ "id": "b1", "correctAnswer": "square", "acceptableAnswers": ["square", "Square", "SQUARE"] }],
            "hint": "4 equal sides and 4 corners. It is not a rectangle because all sides are EQUAL."
          },
          {
            "id": "it-fb3",
            "prompt": "Rule: IF it is a vowel, THEN it is A, E, I, O, or U. The letter E is a ___.",
            "blanks": [{ "id": "b1", "correctAnswer": "vowel", "acceptableAnswers": ["vowel", "Vowel", "VOWEL"] }],
            "hint": "E is in the list A, E, I, O, U. So E is a..."
          },
          {
            "id": "it-fb4",
            "prompt": "Clue 1: I have 8 legs. Clue 2: I spin webs. I am a ___.",
            "blanks": [{ "id": "b1", "correctAnswer": "spider", "acceptableAnswers": ["spider", "Spider", "SPIDER"] }],
            "hint": "8 legs + webs. What creepy-crawly makes webs?"
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
-- LESSON 2: True or False Detectives
-- Module: Logic & Reasoning
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0007-4000-8000-000000000001',
  '10000002-0605-4000-8000-000000000001',
  2,
  'True or False Detectives',
  'Put on your detective hat! Decide if each statement is true or false.',
  'Chip loves playing True or False! Some statements are TRUE -- they are correct facts. Other statements are FALSE -- they are wrong or silly. Your job is to be a detective and figure out which is which. Think carefully before you decide!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "tf-mc1",
            "prompt": "True or False: All squares have 4 sides. \u2b1b",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "a",
            "hint": "A square always has 4 equal sides. That is what makes it a square!"
          },
          {
            "id": "tf-mc2",
            "prompt": "True or False: Fish can breathe on land. \ud83d\udc1f",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "b",
            "hint": "Fish breathe underwater using gills. They cannot breathe on land!"
          },
          {
            "id": "tf-mc3",
            "prompt": "True or False: 5 + 3 = 9 \ud83e\udde0",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "b",
            "hint": "Count it out: 5 + 3 = 8, not 9. This statement is false!"
          },
          {
            "id": "tf-mc4",
            "prompt": "True or False: The Sun is a star. \u2b50",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "a",
            "hint": "The Sun is the closest star to Earth. It is a giant ball of hot gas!"
          },
          {
            "id": "tf-mc5",
            "prompt": "True or False: A circle has corners. \u2b55",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "b",
            "hint": "A circle is perfectly round with no corners at all!"
          },
          {
            "id": "tf-mc6",
            "prompt": "True or False: Ice is frozen water. \ud83e\uddca",
            "options": [
              {"id": "a", "text": "True \u2705"},
              {"id": "b", "text": "False \u274c"}
            ],
            "correctOptionId": "a",
            "hint": "When water gets very cold it freezes and becomes ice. True!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each statement to whether it is TRUE or FALSE! \ud83d\udd0e",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "cats", "text": "Cats have whiskers", "emoji": "\ud83d\udc31"},
            "right": {"id": "true1", "text": "TRUE", "emoji": "\u2705"}
          },
          {
            "id": "p2",
            "left": {"id": "birds", "text": "Birds have 6 legs", "emoji": "\ud83d\udc26"},
            "right": {"id": "false1", "text": "FALSE", "emoji": "\u274c"}
          },
          {
            "id": "p3",
            "left": {"id": "water", "text": "Water is wet", "emoji": "\ud83d\udca7"},
            "right": {"id": "true2", "text": "TRUE", "emoji": "\u2705"}
          },
          {
            "id": "p4",
            "left": {"id": "rocks", "text": "Rocks are soft", "emoji": "\ud83e\udea8"},
            "right": {"id": "false2", "text": "FALSE", "emoji": "\u274c"}
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
-- LESSON 3: What Doesn't Belong?
-- Module: Logic & Reasoning
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0008-4000-8000-000000000001',
  '10000002-0605-4000-8000-000000000001',
  3,
  'What Doesn''t Belong?',
  'Spot the odd one out! Find the item that breaks the pattern.',
  'Chip is playing a sorting game! In each group, most items share something in common -- but ONE item does NOT belong. Your job is to find the sneaky item that does not fit. Look at size, shape, color, or what things DO. Ready to spot the odd one out?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0005-4000-8000-000000000001', '20000006-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wdb-mc1",
            "prompt": "Which one does NOT belong? \ud83c\udf4e \ud83c\udf4c \ud83c\udf53 \ud83d\ude97",
            "options": [
              {"id": "a", "text": "Apple \ud83c\udf4e"},
              {"id": "b", "text": "Banana \ud83c\udf4c"},
              {"id": "c", "text": "Strawberry \ud83c\udf53"},
              {"id": "d", "text": "Car \ud83d\ude97"}
            ],
            "correctOptionId": "d",
            "hint": "Three of these are fruits that you can eat. A car is NOT a fruit!"
          },
          {
            "id": "wdb-mc2",
            "prompt": "Which one does NOT belong? 2, 4, 7, 8 \ud83d\udd22",
            "options": [
              {"id": "a", "text": "2"},
              {"id": "b", "text": "4"},
              {"id": "c", "text": "7"},
              {"id": "d", "text": "8"}
            ],
            "correctOptionId": "c",
            "hint": "2, 4, and 8 are all EVEN numbers. 7 is the only ODD number!"
          },
          {
            "id": "wdb-mc3",
            "prompt": "Which one does NOT belong? \ud83d\udc36 \ud83d\udc31 \ud83d\udc20 \ud83d\udc39",
            "options": [
              {"id": "a", "text": "Dog \ud83d\udc36"},
              {"id": "b", "text": "Cat \ud83d\udc31"},
              {"id": "c", "text": "Tropical fish \ud83d\udc20"},
              {"id": "d", "text": "Hamster \ud83d\udc39"}
            ],
            "correctOptionId": "c",
            "hint": "Dogs, cats, and hamsters all have fur and live on land. A fish lives in water!"
          },
          {
            "id": "wdb-mc4",
            "prompt": "Which one does NOT belong? \u25b6\ufe0f \u25a0\ufe0f \u2b50 \u25cf",
            "options": [
              {"id": "a", "text": "Triangle \u25b6\ufe0f"},
              {"id": "b", "text": "Square \u25a0\ufe0f"},
              {"id": "c", "text": "Star \u2b50"},
              {"id": "d", "text": "Circle \u25cf"}
            ],
            "correctOptionId": "c",
            "hint": "Triangle, square, and circle are basic shapes. A star has points -- it is a special shape!"
          },
          {
            "id": "wdb-mc5",
            "prompt": "Which one does NOT belong? Red, Blue, Happy, Green \ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Red"},
              {"id": "b", "text": "Blue"},
              {"id": "c", "text": "Happy"},
              {"id": "d", "text": "Green"}
            ],
            "correctOptionId": "c",
            "hint": "Red, Blue, and Green are all colors. Happy is a feeling, not a color!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each group to the item that does NOT belong in it! \ud83d\udd0d",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "fruit-group", "text": "Apple, Grape, Hammer, Banana", "emoji": "\ud83c\udf4e"},
            "right": {"id": "hammer", "text": "Hammer (not a fruit!)", "emoji": "\ud83d\udd28"}
          },
          {
            "id": "p2",
            "left": {"id": "animal-group", "text": "Lion, Tiger, Table, Bear", "emoji": "\ud83e\udd81"},
            "right": {"id": "table", "text": "Table (not an animal!)", "emoji": "\ud83e\udeb5"}
          },
          {
            "id": "p3",
            "left": {"id": "number-group", "text": "10, 20, 35, 40", "emoji": "\ud83d\udd22"},
            "right": {"id": "thirtyfive", "text": "35 (not a multiple of 10!)", "emoji": "\u2753"}
          },
          {
            "id": "p4",
            "left": {"id": "body-group", "text": "Hand, Foot, Book, Elbow", "emoji": "\u270b"},
            "right": {"id": "book", "text": "Book (not a body part!)", "emoji": "\ud83d\udcda"}
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
-- LESSON 4: Mystery Number
-- Module: Logic & Reasoning
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-0009-4000-8000-000000000001',
  '10000002-0605-4000-8000-000000000001',
  4,
  'Mystery Number',
  'Use clues to figure out the secret number! Think like a detective.',
  'Chip has locked a secret number inside a puzzle box! To open it, you need to read the clues and figure out what the number is. Each clue narrows it down. By the end, only ONE number fits all the clues. Can you crack the code?',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0005-4000-8000-000000000001', '20000006-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "mn-fb1",
            "prompt": "Clue 1: I am between 1 and 10. Clue 2: I am even. Clue 3: I am greater than 6. What am I? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "Even numbers between 1 and 10: 2, 4, 6, 8, 10. Greater than 6: 8 and 10. Between 1 and 10 means not 10. It is 8!"
          },
          {
            "id": "mn-fb2",
            "prompt": "Clue 1: I am less than 20. Clue 2: I am odd. Clue 3: My digits add up to 8. What am I? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "17", "acceptableAnswers": ["17"] }],
            "hint": "Odd numbers under 20 where digits add to 8: 1+7=8. The answer is 17!"
          },
          {
            "id": "mn-fb3",
            "prompt": "Clue 1: I am a single digit. Clue 2: I am odd. Clue 3: I am greater than 4 and less than 8. What am I? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5", "7"] }],
            "hint": "Single digit, odd, between 4 and 8: that gives us 5 and 7. Try 5!"
          },
          {
            "id": "mn-fb4",
            "prompt": "Clue 1: I am a two-digit number. Clue 2: Both my digits are the same. Clue 3: I am less than 30. What am I? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "11", "acceptableAnswers": ["11", "22"] }],
            "hint": "Two-digit numbers with same digits under 30: 11 and 22. Try 11!"
          },
          {
            "id": "mn-fb5",
            "prompt": "Clue 1: I am between 10 and 20. Clue 2: I am even. Clue 3: You say me when you count by 5s. What am I? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "10", "acceptableAnswers": ["10", "20"] }],
            "hint": "Between 10 and 20, even, AND in the count-by-5s list (5, 10, 15, 20). Even ones: 10 and 20!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mn-mc1",
            "prompt": "Clue 1: I have 4 legs. Clue 2: I say ''meow.'' Clue 3: I am a pet. What am I? \ud83d\udd0e",
            "options": [
              {"id": "a", "text": "Dog \ud83d\udc36"},
              {"id": "b", "text": "Cat \ud83d\udc31"},
              {"id": "c", "text": "Fish \ud83d\udc1f"},
              {"id": "d", "text": "Parrot \ud83e\udd9c"}
            ],
            "correctOptionId": "b",
            "hint": "4 legs + meow + pet = cat!"
          },
          {
            "id": "mn-mc2",
            "prompt": "I am a coin. I am worth more than a nickel but less than a quarter. What coin am I? \ud83e\ude99",
            "options": [
              {"id": "a", "text": "Penny (1\u00a2)"},
              {"id": "b", "text": "Nickel (5\u00a2)"},
              {"id": "c", "text": "Dime (10\u00a2)"},
              {"id": "d", "text": "Quarter (25\u00a2)"}
            ],
            "correctOptionId": "c",
            "hint": "More than 5 cents, less than 25 cents. That is 10 cents -- a dime!"
          },
          {
            "id": "mn-mc3",
            "prompt": "Clue 1: I am a day of the week. Clue 2: I start with the letter T. Clue 3: I come right after Monday. What day am I? \ud83d\udcc5",
            "options": [
              {"id": "a", "text": "Thursday"},
              {"id": "b", "text": "Tuesday"},
              {"id": "c", "text": "Saturday"},
              {"id": "d", "text": "Wednesday"}
            ],
            "correctOptionId": "b",
            "hint": "Starts with T and comes after Monday. Monday, then... Tuesday!"
          },
          {
            "id": "mn-mc4",
            "prompt": "Clue 1: I am a shape. Clue 2: I have no corners. Clue 3: I look like a ball from the front. What am I? \ud83d\udcac",
            "options": [
              {"id": "a", "text": "Square"},
              {"id": "b", "text": "Triangle"},
              {"id": "c", "text": "Circle"},
              {"id": "d", "text": "Rectangle"}
            ],
            "correctOptionId": "c",
            "hint": "No corners and looks like a ball. That is a circle!"
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
-- LESSON 5: Matrix Puzzles
-- Module: Logic & Reasoning
-- Widgets: fill_in_blank + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000004-000a-4000-8000-000000000001',
  '10000002-0605-4000-8000-000000000001',
  5,
  'Matrix Puzzles',
  'Complete the grid! Figure out the rule for each row and column to fill in the missing piece.',
  'Chip found a mysterious puzzle grid! It is like a mini treasure map with rows and columns. Each row follows a RULE, and each column follows a RULE too. Your job is to find the pattern and fill in the missing piece. Think about what changes across each row and what changes down each column!',
  NULL, NULL,
  '[]'::jsonb,
  'f4c1f559-85c6-412e-a788-d6efc8bf4c9d',
  ARRAY['20000006-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "mx-fb1",
            "prompt": "Grid puzzle! Row 1: 1, 2. Row 2: 3, ___. Rule: each row goes up by 1, each column goes up by 2.",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "Row 2 starts at 3 and goes up by 1. So 3, 4! Or: column 2 is 2, and 2+2=4!"
          },
          {
            "id": "mx-fb2",
            "prompt": "Grid puzzle! Row 1: \u2b50, \u2b50\u2b50. Row 2: \u2b50\u2b50\u2b50, ___. How many stars go in the blank? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "4", "acceptableAnswers": ["4"] }],
            "hint": "Row 1 goes 1 star, 2 stars. Row 2 goes 3 stars, then? Each row adds 1 more star. 3+1=4!"
          },
          {
            "id": "mx-fb3",
            "prompt": "Grid puzzle! Row 1: 2, 4. Row 2: 6, ___. Rule: rows go up by 2, columns go up by 4.",
            "blanks": [{ "id": "b1", "correctAnswer": "8", "acceptableAnswers": ["8"] }],
            "hint": "Row 2 starts at 6, goes up by 2: 6, 8! Or: column 2 is 4, plus 4 = 8!"
          },
          {
            "id": "mx-fb4",
            "prompt": "Grid puzzle! Row 1: 5, 10. Row 2: 15, ___. Rule: rows go up by 5, columns go up by 10.",
            "blanks": [{ "id": "b1", "correctAnswer": "20", "acceptableAnswers": ["20"] }],
            "hint": "Row 2: 15 + 5 = 20. Or column 2: 10 + 10 = 20. Both rules give 20!"
          },
          {
            "id": "mx-fb5",
            "prompt": "Grid puzzle! Row 1: A, B. Row 2: C, ___. The letters go in order! What letter fills the blank?",
            "blanks": [{ "id": "b1", "correctAnswer": "D", "acceptableAnswers": ["D", "d"] }],
            "hint": "A, B, C, ___. The alphabet goes A B C D! The missing letter is D."
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each grid rule to its missing piece! \ud83e\udde9",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "grid1", "text": "Row: \ud83d\udd34\ud83d\udd35 | \ud83d\udfe2 ___", "emoji": "\ud83e\udde9"},
            "right": {"id": "ans1", "text": "Yellow \ud83d\udfe1 (colors change each cell)", "emoji": "\ud83d\udfe1"}
          },
          {
            "id": "p2",
            "left": {"id": "grid2", "text": "Row 1: 10, 20 | Row 2: 30, ___", "emoji": "\ud83d\udd22"},
            "right": {"id": "ans2", "text": "40 (count by 10s)", "emoji": "\u2705"}
          },
          {
            "id": "p3",
            "left": {"id": "grid3", "text": "Row 1: \u25cb, \u25a1 | Row 2: \u25b3, ___", "emoji": "\ud83d\udd36"},
            "right": {"id": "ans3", "text": "Diamond \u25c7 (shapes change each cell)", "emoji": "\u25c7"}
          },
          {
            "id": "p4",
            "left": {"id": "grid4", "text": "Row 1: 1, 3 | Row 2: 5, ___", "emoji": "\ud83d\udcaf"},
            "right": {"id": "ans4", "text": "7 (odd numbers: +2 each)", "emoji": "\ud83c\udf1f"}
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
