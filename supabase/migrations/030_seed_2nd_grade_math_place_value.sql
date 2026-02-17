-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Math: Place Value & Comparing
-- =============================================================================
-- 6 browser-only interactive lessons for 2nd grade (Band 2, ages 7-8):
--   - Hundreds, Tens, and Ones
--   - Expanded Form
--   - Reading Big Numbers
--   - Comparing 3-Digit Numbers
--   - Ordering Numbers to 1000
--   - Mental Math +10, +100
--
-- Widget types used: number_bond, fill_in_blank, matching_pairs, flash_card,
--   multiple_choice, sequence_order, number_line
--
-- Depends on:
--   - 002_tinkerschool_multi_subject.sql (subjects, skills, modules tables)
--   - 019_seed_2nd_grade_math_problemsolving.sql (established 2nd-grade Math subject + skills 1-6)
--
-- Subject ID:
--   Math: 71c781e1-71c9-455e-8e18-aea0676b490a
--
-- Module ID:
--   Place Value & Comparing: 10000002-0106-4000-8000-000000000001
--
-- Skill IDs:
--   Place Value to 1000:       20000001-0007-4000-8000-000000000001
--   Comparing 3-Digit Numbers: 20000001-0008-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 0. PREREQUISITES: Subject, Module, Skills
-- =========================================================================

-- 0a. Subject (ON CONFLICT for idempotency)
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('71c781e1-71c9-455e-8e18-aea0676b490a', 'math_g2', 'Number World G2', 'Math', '#3B82F6', 'calculator', 8)
ON CONFLICT (id) DO NOTHING;

-- 0b. Module
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0106-4000-8000-000000000001', 2, 20, 'Place Value & Comparing', 'Master hundreds, tens, and ones! Read, write, and compare numbers all the way to 1000!', 'calculator', '71c781e1-71c9-455e-8e18-aea0676b490a')
ON CONFLICT (id) DO NOTHING;

-- 0c. Skills
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000001-0007-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'place_value_1000',   'Place Value to 1000',       'Understand that the three digits of a three-digit number represent hundreds, tens, and ones', '2.NBT.A.1', 7),
  ('20000001-0008-4000-8000-000000000001', '71c781e1-71c9-455e-8e18-aea0676b490a', 'comparing_3_digit',  'Comparing 3-Digit Numbers', 'Compare two three-digit numbers using >, =, and < symbols',                                   '2.NBT.A.4', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 1: Hundreds, Tens, and Ones
-- Module: Place Value & Comparing
-- Widgets: number_bond + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0010-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  1,
  'Hundreds, Tens, and Ones',
  'Break apart 3-digit numbers into hundreds, tens, and ones! Every digit has a special place.',
  'Hey there, superstar! Chip here with a BIG idea! Numbers have a secret code. In the number 347, the 3 means three HUNDREDS (that''s like 3 big boxes of 100), the 4 means four TENS (like 4 bags of 10), and the 7 means seven ONES (7 loose ones). Let''s crack the code together!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "number_bond",
        "questions": [
          {
            "id": "pv1-nb1",
            "prompt": "Break apart 347 into hundreds, tens, and ones! What is the hundreds part?",
            "whole": 347,
            "part1": null,
            "part2": 47,
            "hint": "The 3 in 347 is in the hundreds place. 3 hundreds = 300!"
          },
          {
            "id": "pv1-nb2",
            "prompt": "Break apart 582! What is the hundreds part?",
            "whole": 582,
            "part1": null,
            "part2": 82,
            "hint": "The 5 in 582 is in the hundreds place. 5 hundreds = 500!"
          },
          {
            "id": "pv1-nb3",
            "prompt": "Break apart 215! The tens and ones part together is ___.",
            "whole": 215,
            "part1": 200,
            "part2": null,
            "hint": "215 minus 200 equals 15. The tens and ones part is 15!"
          },
          {
            "id": "pv1-nb4",
            "prompt": "Break apart 736! What is the hundreds part?",
            "whole": 736,
            "part1": null,
            "part2": 36,
            "hint": "The 7 in 736 is in the hundreds place. 7 hundreds = 700!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "pv1-fb1",
            "prompt": "In the number 463, the digit 4 is in the ___ place.",
            "blanks": [{ "id": "b1", "correctAnswer": "hundreds", "acceptableAnswers": ["hundreds", "Hundreds", "hundred", "Hundred"] }],
            "hint": "The first digit (on the left) in a 3-digit number is the hundreds place!"
          },
          {
            "id": "pv1-fb2",
            "prompt": "In the number 829, the digit 2 is in the ___ place.",
            "blanks": [{ "id": "b1", "correctAnswer": "tens", "acceptableAnswers": ["tens", "Tens", "ten", "Ten"] }],
            "hint": "The middle digit in a 3-digit number is the tens place!"
          },
          {
            "id": "pv1-fb3",
            "prompt": "In the number 156, the digit 6 is in the ___ place.",
            "blanks": [{ "id": "b1", "correctAnswer": "ones", "acceptableAnswers": ["ones", "Ones", "one", "One"] }],
            "hint": "The last digit (on the right) in a 3-digit number is the ones place!"
          },
          {
            "id": "pv1-fb4",
            "prompt": "The number 503 has ___ hundreds, 0 tens, and 3 ones.",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5", "five", "Five"] }],
            "hint": "The first digit tells you how many hundreds. What is the first digit of 503?"
          },
          {
            "id": "pv1-fb5",
            "prompt": "The number 271 has 2 hundreds, ___ tens, and 1 one.",
            "blanks": [{ "id": "b1", "correctAnswer": "7", "acceptableAnswers": ["7", "seven", "Seven"] }],
            "hint": "The middle digit tells you how many tens. What is the middle digit of 271?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Expanded Form
-- Module: Place Value & Comparing
-- Widgets: fill_in_blank + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0011-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  2,
  'Expanded Form',
  'Stretch numbers out into expanded form! Write 347 as 300 + 40 + 7.',
  'Chip learned a cool trick called EXPANDED FORM! You take a number and stretch it out to show each part. It''s like taking apart a Lego tower to see all the pieces: 347 becomes 300 + 40 + 7. Each piece is a different size -- hundreds, tens, and ones. Let''s stretch some numbers!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "ef-fb1",
            "prompt": "Write 347 in expanded form: 300 + ___ + 7",
            "blanks": [{ "id": "b1", "correctAnswer": "40", "acceptableAnswers": ["40"] }],
            "hint": "The 4 is in the tens place. 4 tens = 40!"
          },
          {
            "id": "ef-fb2",
            "prompt": "Write 629 in expanded form: ___ + 20 + 9",
            "blanks": [{ "id": "b1", "correctAnswer": "600", "acceptableAnswers": ["600"] }],
            "hint": "The 6 is in the hundreds place. 6 hundreds = 600!"
          },
          {
            "id": "ef-fb3",
            "prompt": "Write 185 in expanded form: 100 + 80 + ___",
            "blanks": [{ "id": "b1", "correctAnswer": "5", "acceptableAnswers": ["5"] }],
            "hint": "The 5 is in the ones place. 5 ones = 5!"
          },
          {
            "id": "ef-fb4",
            "prompt": "What number is 400 + 50 + 3? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "453", "acceptableAnswers": ["453"] }],
            "hint": "Put the pieces back together! 400 + 50 + 3 = ?"
          },
          {
            "id": "ef-fb5",
            "prompt": "What number is 700 + 10 + 8? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "718", "acceptableAnswers": ["718"] }],
            "hint": "7 hundreds, 1 ten, 8 ones. Write them all together!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each number to its expanded form! \ud83e\udde9",
        "pairs": [
          { "id": "p1", "left": "256", "right": "200 + 50 + 6" },
          { "id": "p2", "left": "491", "right": "400 + 90 + 1" },
          { "id": "p3", "left": "830", "right": "800 + 30 + 0" },
          { "id": "p4", "left": "615", "right": "600 + 10 + 5" },
          { "id": "p5", "left": "307", "right": "300 + 0 + 7" }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Reading Big Numbers
-- Module: Place Value & Comparing
-- Widgets: flash_card + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0012-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  3,
  'Reading Big Numbers',
  'Learn to read and write number words for 3-digit numbers! Say them like a pro.',
  'Chip wants to read numbers like a champion! Did you know you can write 256 as "two hundred fifty-six"? It''s like telling a story about the number -- first you say the hundreds, then the tens, then the ones. Let''s practice reading big numbers out loud!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to see how to read the number!",
        "cards": [
          {
            "id": "fc-256",
            "front": "256",
            "back": "Two hundred fifty-six. Say the hundreds first (two hundred), then the rest (fifty-six)!"
          },
          {
            "id": "fc-410",
            "front": "410",
            "back": "Four hundred ten. When there are 0 ones, you just skip the ones part!"
          },
          {
            "id": "fc-803",
            "front": "803",
            "back": "Eight hundred three. When there are 0 tens, you skip right from hundreds to ones!"
          },
          {
            "id": "fc-999",
            "front": "999",
            "back": "Nine hundred ninety-nine. This is the biggest 3-digit number! One more and you reach 1,000!"
          },
          {
            "id": "fc-100",
            "front": "100",
            "back": "One hundred. The very first 3-digit number! It has 1 hundred, 0 tens, and 0 ones."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "rbn-fb1",
            "prompt": "Write the number for: three hundred twenty-four = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "324", "acceptableAnswers": ["324"] }],
            "hint": "Three hundred = 300, twenty = 20, four = 4. Put them together: 324!"
          },
          {
            "id": "rbn-fb2",
            "prompt": "Write the number for: five hundred sixty-one = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "561", "acceptableAnswers": ["561"] }],
            "hint": "Five hundred = 500, sixty = 60, one = 1. Together: 561!"
          },
          {
            "id": "rbn-fb3",
            "prompt": "Write the number for: seven hundred eight = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "708", "acceptableAnswers": ["708"] }],
            "hint": "Seven hundred = 700, eight = 8. No tens! So it is 708."
          },
          {
            "id": "rbn-fb4",
            "prompt": "Write the number for: nine hundred forty = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "940", "acceptableAnswers": ["940"] }],
            "hint": "Nine hundred = 900, forty = 40. No ones! So it is 940."
          },
          {
            "id": "rbn-fb5",
            "prompt": "What number comes right AFTER 999? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "1000", "acceptableAnswers": ["1000", "1,000"] }],
            "hint": "999 + 1 = ? You need a 4-digit number now!"
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
-- LESSON 4: Comparing 3-Digit Numbers
-- Module: Place Value & Comparing
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0013-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  4,
  'Comparing 3-Digit Numbers',
  'Which number is bigger? Use >, =, and < to compare 3-digit numbers!',
  'Time for a game, superstar! Chip calls it the Alligator Game! The alligator is ALWAYS hungry and its mouth opens toward the BIGGER number. 451 > 415 means 451 is greater. 415 < 451 means 415 is less. And if two numbers are the same, we use the equals sign: 300 = 300. Let''s play!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "cmp-mc1",
            "prompt": "Which number is GREATER: 451 or 415? \ud83d\udc0a",
            "options": [
              {"id": "a", "text": "451"},
              {"id": "b", "text": "415"},
              {"id": "c", "text": "They are equal"}
            ],
            "correctOptionId": "a",
            "hint": "Both start with 4 hundreds. Compare the tens: 5 tens vs 1 ten. 5 tens is more, so 451 is greater!"
          },
          {
            "id": "cmp-mc2",
            "prompt": "Which number is LESS: 672 or 762? \ud83d\udc0a",
            "options": [
              {"id": "a", "text": "672"},
              {"id": "b", "text": "762"},
              {"id": "c", "text": "They are equal"}
            ],
            "correctOptionId": "a",
            "hint": "Compare hundreds first: 6 hundreds vs 7 hundreds. 6 is less than 7, so 672 is less!"
          },
          {
            "id": "cmp-mc3",
            "prompt": "Which symbol goes between 389 ___ 398?",
            "options": [
              {"id": "a", "text": "> (greater than)"},
              {"id": "b", "text": "< (less than)"},
              {"id": "c", "text": "= (equal to)"}
            ],
            "correctOptionId": "b",
            "hint": "Both have 3 hundreds. Compare tens: 8 tens vs 9 tens. 8 is less than 9, so 389 < 398!"
          },
          {
            "id": "cmp-mc4",
            "prompt": "Which symbol goes between 500 ___ 500?",
            "options": [
              {"id": "a", "text": "> (greater than)"},
              {"id": "b", "text": "< (less than)"},
              {"id": "c", "text": "= (equal to)"}
            ],
            "correctOptionId": "c",
            "hint": "The numbers are exactly the same! When two numbers are the same, we use the equals sign."
          },
          {
            "id": "cmp-mc5",
            "prompt": "Which is greater: 299 or 300? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "299"},
              {"id": "b", "text": "300"},
              {"id": "c", "text": "They are equal"}
            ],
            "correctOptionId": "b",
            "hint": "Compare hundreds: 2 hundreds vs 3 hundreds. 3 hundreds is more, so 300 > 299!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "cmp-fb1",
            "prompt": "Fill in the symbol: 634 ___ 643 (type >, <, or =)",
            "blanks": [{ "id": "b1", "correctAnswer": "<", "acceptableAnswers": ["<"] }],
            "hint": "Same hundreds (6). Compare tens: 3 tens vs 4 tens. 3 < 4, so 634 < 643!"
          },
          {
            "id": "cmp-fb2",
            "prompt": "Fill in the symbol: 851 ___ 815 (type >, <, or =)",
            "blanks": [{ "id": "b1", "correctAnswer": ">", "acceptableAnswers": [">"] }],
            "hint": "Same hundreds (8). Compare tens: 5 tens vs 1 ten. 5 > 1, so 851 > 815!"
          },
          {
            "id": "cmp-fb3",
            "prompt": "Fill in the symbol: 777 ___ 777 (type >, <, or =)",
            "blanks": [{ "id": "b1", "correctAnswer": "=", "acceptableAnswers": ["="] }],
            "hint": "Both numbers are exactly the same! 777 equals 777."
          },
          {
            "id": "cmp-fb4",
            "prompt": "Fill in the symbol: 199 ___ 200 (type >, <, or =)",
            "blanks": [{ "id": "b1", "correctAnswer": "<", "acceptableAnswers": ["<"] }],
            "hint": "Compare hundreds: 1 hundred vs 2 hundreds. 1 < 2, so 199 < 200!"
          },
          {
            "id": "cmp-fb5",
            "prompt": "Fill in the symbol: 905 ___ 895 (type >, <, or =)",
            "blanks": [{ "id": "b1", "correctAnswer": ">", "acceptableAnswers": [">"] }],
            "hint": "Compare hundreds: 9 hundreds vs 8 hundreds. 9 > 8, so 905 > 895!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Ordering Numbers to 1000
-- Module: Place Value & Comparing
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0014-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  5,
  'Ordering Numbers to 1000',
  'Put 3-digit numbers in order from least to greatest! Organize the number parade.',
  'Chip is organizing a Number Parade! But the numbers are all mixed up and need to march in order from SMALLEST to BIGGEST. Can you help line them up? Remember: compare the hundreds first, then tens, then ones. Let''s get this parade started!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0007-4000-8000-000000000001', '20000001-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "ord-so1",
            "prompt": "Put these numbers in order from LEAST to GREATEST!",
            "items": [
              {"id": "i1", "text": "325"},
              {"id": "i2", "text": "253"},
              {"id": "i3", "text": "532"}
            ],
            "correctOrder": ["i2", "i1", "i3"],
            "hint": "Compare the hundreds first! 253 has 2 hundreds, 325 has 3 hundreds, 532 has 5 hundreds."
          },
          {
            "id": "ord-so2",
            "prompt": "Put these numbers in order from LEAST to GREATEST!",
            "items": [
              {"id": "i1", "text": "487"},
              {"id": "i2", "text": "478"},
              {"id": "i3", "text": "748"},
              {"id": "i4", "text": "874"}
            ],
            "correctOrder": ["i2", "i1", "i3", "i4"],
            "hint": "All start differently or same hundreds? 478 and 487 both have 4 hundreds. Compare their tens: 7 tens vs 8 tens!"
          },
          {
            "id": "ord-so3",
            "prompt": "Put these numbers in order from LEAST to GREATEST!",
            "items": [
              {"id": "i1", "text": "910"},
              {"id": "i2", "text": "109"},
              {"id": "i3", "text": "901"},
              {"id": "i4", "text": "190"}
            ],
            "correctOrder": ["i2", "i4", "i3", "i1"],
            "hint": "Compare hundreds first! 109 and 190 have 1 hundred. 901 and 910 have 9 hundreds. Then compare tens within each group!"
          },
          {
            "id": "ord-so4",
            "prompt": "Number Parade! Line up from LEAST to GREATEST!",
            "items": [
              {"id": "i1", "text": "555"},
              {"id": "i2", "text": "505"},
              {"id": "i3", "text": "550"},
              {"id": "i4", "text": "500"}
            ],
            "correctOrder": ["i4", "i2", "i3", "i1"],
            "hint": "They all have 5 hundreds! Compare tens: 500 has 0 tens, 505 has 0 tens, 550 has 5 tens, 555 has 5 tens. Then check ones!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "ord-fb1",
            "prompt": "What is the SMALLEST 3-digit number you can make with 4, 7, and 2? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "247", "acceptableAnswers": ["247"] }],
            "hint": "Put the smallest digit in the hundreds place! The smallest digit is 2."
          },
          {
            "id": "ord-fb2",
            "prompt": "What is the BIGGEST 3-digit number you can make with 4, 7, and 2? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "742", "acceptableAnswers": ["742"] }],
            "hint": "Put the biggest digit in the hundreds place! The biggest digit is 7."
          },
          {
            "id": "ord-fb3",
            "prompt": "Which number comes BETWEEN 399 and 401? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "400", "acceptableAnswers": ["400"] }],
            "hint": "399, ___, 401. What is 399 + 1?"
          },
          {
            "id": "ord-fb4",
            "prompt": "Which number comes BETWEEN 549 and 551? ___",
            "blanks": [{ "id": "b1", "correctAnswer": "550", "acceptableAnswers": ["550"] }],
            "hint": "549, ___, 551. What is 549 + 1?"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 6: Mental Math +10, +100
-- Module: Place Value & Comparing
-- Widgets: number_line + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000003-0015-4000-8000-000000000001',
  '10000002-0106-4000-8000-000000000001',
  6,
  'Mental Math +10, +100',
  'Use place value to add and subtract 10 or 100 in your head! Chip''s mental math superpower.',
  'Chip has a SUPERPOWER and wants to share it with you! When you add 10, only the TENS digit changes. When you add 100, only the HUNDREDS digit changes. The other digits stay the same! It''s like magic, but it''s really place value. Let''s train your brain!',
  NULL, NULL,
  '[]'::jsonb,
  '71c781e1-71c9-455e-8e18-aea0676b490a',
  ARRAY['20000001-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "number_line",
        "questions": [
          {
            "id": "mm-nl1",
            "prompt": "Start at 356. Add 10! Where do you land? \ud83e\udde0",
            "min": 300,
            "max": 500,
            "startPosition": 356,
            "correctEndPosition": 366,
            "operation": "add",
            "hint": "When you add 10, only the tens digit changes! 356 + 10 = 366."
          },
          {
            "id": "mm-nl2",
            "prompt": "Start at 356. Add 100! Where do you land? \ud83d\ude80",
            "min": 300,
            "max": 600,
            "startPosition": 356,
            "correctEndPosition": 456,
            "operation": "add",
            "hint": "When you add 100, only the hundreds digit changes! 356 + 100 = 456."
          },
          {
            "id": "mm-nl3",
            "prompt": "Start at 482. Subtract 10! Where do you land?",
            "min": 400,
            "max": 550,
            "startPosition": 482,
            "correctEndPosition": 472,
            "operation": "subtract",
            "hint": "Subtracting 10 makes the tens digit go down by 1. 482 - 10 = 472."
          },
          {
            "id": "mm-nl4",
            "prompt": "Start at 715. Subtract 100! Where do you land?",
            "min": 500,
            "max": 800,
            "startPosition": 715,
            "correctEndPosition": 615,
            "operation": "subtract",
            "hint": "Subtracting 100 makes the hundreds digit go down by 1. 715 - 100 = 615."
          },
          {
            "id": "mm-nl5",
            "prompt": "Start at 290. Add 10! Where do you land? \ud83c\udf1f",
            "min": 200,
            "max": 400,
            "startPosition": 290,
            "correctEndPosition": 300,
            "operation": "add",
            "hint": "290 + 10 = 300! The tens digit rolls over from 9 to 0 and the hundreds go up by 1."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "mm-fb1",
            "prompt": "423 + 10 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "433", "acceptableAnswers": ["433"] }],
            "hint": "Adding 10 changes only the tens digit. 2 tens becomes 3 tens!"
          },
          {
            "id": "mm-fb2",
            "prompt": "423 + 100 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "523", "acceptableAnswers": ["523"] }],
            "hint": "Adding 100 changes only the hundreds digit. 4 hundreds becomes 5 hundreds!"
          },
          {
            "id": "mm-fb3",
            "prompt": "678 - 10 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "668", "acceptableAnswers": ["668"] }],
            "hint": "Subtracting 10 changes only the tens digit. 7 tens becomes 6 tens!"
          },
          {
            "id": "mm-fb4",
            "prompt": "678 - 100 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "578", "acceptableAnswers": ["578"] }],
            "hint": "Subtracting 100 changes only the hundreds digit. 6 hundreds becomes 5 hundreds!"
          },
          {
            "id": "mm-fb5",
            "prompt": "590 + 10 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "600", "acceptableAnswers": ["600"] }],
            "hint": "590 + 10 = 600! The tens roll over from 9 to 0 and the hundreds go up by 1."
          },
          {
            "id": "mm-fb6",
            "prompt": "900 + 100 = ___",
            "blanks": [{ "id": "b1", "correctAnswer": "1000", "acceptableAnswers": ["1000", "1,000"] }],
            "hint": "900 + 100 = 1000! You just reached one thousand!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
