-- =============================================================================
-- TinkerSchool -- Band 1 Curriculum Expansion (Lessons 6-10 per subject)
-- =============================================================================
-- Adds 30 new lessons across 6 subjects (Math, Reading, Science, Music, Art,
-- Problem Solving) to expand Band 1 from 5 to 10 lessons each.
--
-- Depends on: 006_seed_multi_subject_lessons.sql (original 30 lessons)
-- =============================================================================


-- =========================================================================
-- MATH LESSON 6: Even or Odd?
-- Display numbers 1-10 and label each as even or odd.
-- Skills: Counting (0001), Number Patterns (000a)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0006-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  6,
  'Even or Odd?',
  'Display numbers 1-10 and label each as even or odd on the M5Stick screen!',
  'Hey friend! Did you know every number is either EVEN or ODD? Even numbers you can split into two equal groups, and odd numbers always have one left over. Let''s teach the M5Stick to figure it out for us!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
Lcd.fillScreen(0x000000)
for i in range(1, 11):
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(str(i), 60, 30)
  if i % 2 == 0:
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("EVEN", 45, 80)
    Speaker.tone(660, 200)
  else:
    Lcd.setTextColor(0xF97316, 0x000000)
    Lcd.drawString("ODD", 50, 80)
    Speaker.tone(440, 200)
  time.sleep(1.2)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("All done!", 20, 50)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Use a loop to go through numbers 1 to 10. Display each number on the screen."},
    {"order": 2, "text": "Use an if-block to check if the number is even. A number is even if dividing by 2 has no remainder."},
    {"order": 3, "text": "Show \"EVEN\" or \"ODD\" below the number in different colors. Add a beep for each one!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0001-4000-8000-000000000001',
    '10000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- MATH LESSON 7: Skip Counter
-- Count by 2s to 20 on screen with beeps.
-- Skills: Counting (0001), Addition within 20 (0006)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0007-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  7,
  'Skip Counter',
  'Count by 2s all the way to 20! Watch the numbers skip across the screen with beeps.',
  'Chip here! Counting by 1s is cool, but counting by 2s is like TURBO counting! We skip every other number: 2, 4, 6, 8... all the way to 20. Let''s make the M5Stick do skip counting with sounds!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Skip by 2s!", 15, 20)
time.sleep(1)
for i in range(2, 21, 2):
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(str(i), 55, 40)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Skip count!", 20, 100)
  Speaker.tone(300 + i * 30, 250)
  time.sleep(1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Skip counting!", 5, 50)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "Use a loop that starts at 2 and goes to 20, stepping by 2 each time."},
    {"order": 2, "text": "Display each number big on the screen and play a beep that gets higher."},
    {"order": 3, "text": "After the loop, show a celebration message!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0001-4000-8000-000000000001',
    '10000001-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- MATH LESSON 8: Subtraction Hero
-- Show subtraction problems, use buttons to pick the answer.
-- Skills: Subtraction within 10 (0004), Number Recognition (0002)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0008-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  8,
  'Subtraction Hero',
  'Solve subtraction problems on the M5Stick! Pick the right answer with the buttons.',
  'Time to become a Subtraction Hero! I''ll show you problems like 8 - 3, and you pick the answer with the buttons. Get ready to save the day with MATH POWER!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random
score = 0
for r in range(5):
  a = random.randint(5, 10)
  b = random.randint(1, a - 1)
  answer = a - b
  wrong = answer + random.choice([-1, 1])
  if wrong < 0:
    wrong = answer + 1
  if random.randint(0, 1) == 0:
    opt_a, opt_b = answer, wrong
  else:
    opt_a, opt_b = wrong, answer
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(str(a) + " - " + str(b) + " = ?", 15, 20)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: " + str(opt_a), 15, 70)
  Lcd.drawString("B: " + str(opt_b), 15, 100)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      if opt_a == answer:
        score += 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("Correct!", 25, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("It was " + str(answer), 10, 50)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    if BtnB.isPressed():
      if opt_b == answer:
        score += 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("Correct!", 25, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("It was " + str(answer), 10, 50)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Score: " + str(score) + "/5", 20, 50)
Speaker.tone(660, 300)',
  '[
    {"order": 1, "text": "Pick two random numbers where the first is bigger. Subtract them to get the answer."},
    {"order": 2, "text": "Show the problem and two choices on screen. Use buttons A and B to let the player pick."},
    {"order": 3, "text": "Check the answer, keep score, and show the final score after 5 rounds!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0004-4000-8000-000000000001',
    '10000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- MATH LESSON 9: Shape Sorter
-- Display shape names and count their sides with beeps.
-- Skills: 2D Shapes (0007), Counting (0001)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0009-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  9,
  'Shape Sorter',
  'Learn about shapes! See each shape name and count its sides with matching beeps.',
  'Let''s explore SHAPES! A triangle has 3 sides, a square has 4, and a pentagon has 5. The M5Stick will show each shape and beep once for every side. Can you count along?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
shapes = [("Triangle", 3, 0xEF4444),
          ("Square", 4, 0x3B82F6),
          ("Pentagon", 5, 0x22C55E),
          ("Hexagon", 6, 0xA855F7)]
for name, sides, color in shapes:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(color, 0x000000)
  Lcd.drawString(name, 20, 30)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(str(sides) + " sides", 30, 70)
  for s in range(sides):
    Speaker.tone(500 + s * 100, 200)
    time.sleep(0.4)
  time.sleep(1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Shape expert!", 10, 50)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Make a list of shapes with their names and number of sides."},
    {"order": 2, "text": "Loop through each shape. Display the name and side count in a fun color."},
    {"order": 3, "text": "Play one beep for each side of the shape, then move to the next shape!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0007-4000-8000-000000000001',
    '10000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- MATH LESSON 10: Number Bonds
-- Find pairs that add to 10 using buttons. 5 rounds with score.
-- Skills: Addition within 10 (0003), Number Patterns (000a)
-- Difficulty: Advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-000a-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  10,
  'Number Bonds',
  'Find the missing number that makes 10! Use the buttons to pick the right partner.',
  'Number bonds are like best friends that add up to 10! If I say 7, you say 3 because 7 + 3 = 10. Let''s play 5 rounds and see how many you can get right!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random
score = 0
for r in range(5):
  n = random.randint(1, 9)
  answer = 10 - n
  wrong = answer + random.choice([-2, -1, 1, 2])
  if wrong < 1 or wrong > 9 or wrong == answer:
    wrong = answer + 1 if answer < 9 else answer - 1
  if random.randint(0, 1) == 0:
    opt_a, opt_b = answer, wrong
  else:
    opt_a, opt_b = wrong, answer
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(str(n) + " + ? = 10", 15, 20)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: " + str(opt_a), 15, 70)
  Lcd.drawString("B: " + str(opt_b), 15, 100)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      if opt_a == answer:
        score += 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString(str(n) + "+" + str(answer) + "=10", 15, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("It was " + str(answer), 10, 50)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    if BtnB.isPressed():
      if opt_b == answer:
        score += 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString(str(n) + "+" + str(answer) + "=10", 15, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("It was " + str(answer), 10, 50)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Score: " + str(score) + "/5", 20, 40)
if score >= 4:
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("Bond master!", 15, 80)
Speaker.tone(660, 400)',
  '[
    {"order": 1, "text": "Pick a random number from 1-9. The answer is 10 minus that number!"},
    {"order": 2, "text": "Show the problem like \"7 + ? = 10\" with two choices. One right, one wrong."},
    {"order": 3, "text": "Use buttons to pick, check the answer, keep score for 5 rounds!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0003-4000-8000-000000000001',
    '10000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);


-- =========================================================================
-- READING LESSON 6: Spelling Bee
-- Show words letter by letter with beeps, then the full word.
-- Skills: Spelling (0006), Phonics Consonants (0001)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0006-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  6,
  'Spelling Bee',
  'Watch words appear letter by letter on the M5Stick, then see the full word!',
  'Welcome to the Spelling Bee! I''ll show you words one letter at a time. Watch carefully as each letter pops up with a beep. Then the whole word appears like magic!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
words = ["cat", "dog", "sun", "hat", "bed"]
for word in words:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("Spell it!", 25, 20)
  for i, letter in enumerate(word):
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString(letter, 30 + i * 25, 60)
    Speaker.tone(400 + i * 100, 200)
    time.sleep(0.6)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(word.upper(), 40, 110)
  Speaker.tone(880, 300)
  time.sleep(1.5)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Great speller!", 10, 50)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "Make a list of simple 3-letter words like cat, dog, and sun."},
    {"order": 2, "text": "Loop through each word. Inside, loop through each letter and display it one at a time with a beep."},
    {"order": 3, "text": "After all letters are shown, display the full word. Then move to the next word!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0006-4000-8000-000000000001',
    '20000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- READING LESSON 7: Sentence Builder
-- Display words one at a time to build a sentence.
-- Skills: Sentence Structure (0007), Sight Words (0004)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0007-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  7,
  'Sentence Builder',
  'Build sentences word by word on the M5Stick screen! Watch each word appear.',
  'Let''s build sentences together! Words will pop up one at a time, and then you''ll see the whole sentence. It''s like building with word blocks!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
sentences = [
  ["The", "cat", "sat."],
  ["I", "can", "run."],
  ["We", "like", "fun."]
]
for words in sentences:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xA855F7, 0x000000)
  Lcd.drawString("Build it!", 25, 15)
  for i, w in enumerate(words):
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString(w, 15 + i * 40, 55)
    Speaker.tone(500 + i * 150, 200)
    time.sleep(0.8)
  full = " ".join(words)
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString(full, 10, 100)
  Speaker.tone(880, 300)
  time.sleep(2)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Nice sentences!", 5, 50)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "Make a list of short sentences split into individual words."},
    {"order": 2, "text": "Show each word one at a time across the screen with a beep."},
    {"order": 3, "text": "After all words appear, show the complete sentence at the bottom!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0007-4000-8000-000000000001',
    '20000001-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- READING LESSON 8: Story Sequencer
-- Show story events, use buttons to pick correct order.
-- Skills: Story Sequencing (0008), Reading Comprehension (0009)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0008-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  8,
  'Story Sequencer',
  'Put story events in the right order! Read each event and use buttons to pick what comes first.',
  'Stories have a beginning, middle, and end. I''ll show you some mixed-up events, and you put them in order! Press A for the first one and B for the second.',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
score = 0
stories = [
  ("Wake up", "Eat food", 0),
  ("Get egg", "See chick", 0),
  ("Plant seed", "See flower", 0)
]
for first, second, _ in stories:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString("What is first?", 10, 15)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: " + second, 10, 55)
  Lcd.drawString("B: " + first, 10, 85)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      Lcd.fillScreen(0x330000)
      Lcd.setTextColor(0xEF4444, 0x330000)
      Lcd.drawString("Try again!", 20, 50)
      Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    if BtnB.isPressed():
      score += 1
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x22C55E, 0x003300)
      Lcd.drawString("Right!", 40, 50)
      Speaker.tone(880, 300)
      waiting = False
      time.sleep(1.5)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Score: " + str(score) + "/3", 20, 50)
Speaker.tone(660, 400)',
  '[
    {"order": 1, "text": "Create pairs of events where one clearly happens before the other."},
    {"order": 2, "text": "Show two events on screen and ask which comes first. Use buttons to pick."},
    {"order": 3, "text": "Check if the player picked the right order. Keep score!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0008-4000-8000-000000000001',
    '20000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- READING LESSON 9: Word Family Fun
-- Display word families (-at, -an, -it) with color coding.
-- Skills: Word Families (000a), Blending CVC (0003)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0009-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  9,
  'Word Family Fun',
  'Explore word families! See how changing the first letter makes new words that rhyme.',
  'Word families are groups of words that rhyme! The -at family has cat, bat, and hat. They all end the same way. Let''s explore three word families on the M5Stick!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
families = [
  ("-at", ["cat", "bat", "hat"], 0xEF4444),
  ("-an", ["can", "fan", "man"], 0x3B82F6),
  ("-it", ["sit", "bit", "hit"], 0x22C55E)
]
for ending, words, color in families:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(color, 0x000000)
  Lcd.drawString(ending + " family", 15, 15)
  for i, w in enumerate(words):
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString(w, 20, 50 + i * 25)
    Speaker.tone(400 + i * 100, 200)
    time.sleep(0.7)
  time.sleep(1.5)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Word families!", 10, 50)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "Create groups of words that share the same ending, like -at, -an, and -it."},
    {"order": 2, "text": "Show the family name in color, then display each word below it with a beep."},
    {"order": 3, "text": "Pause between families so the reader can see the pattern!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-000a-4000-8000-000000000001',
    '20000001-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- READING LESSON 10: Reading Quiz
-- Show short sentences, answer comprehension questions with buttons.
-- Skills: Reading Comprehension (0009), Sight Words (0004)
-- Difficulty: Advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-000a-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  10,
  'Reading Quiz',
  'Read short sentences and answer questions about them! Use the buttons to pick your answer.',
  'Let''s test your reading skills! I''ll show you a sentence, then ask a question about it. Read carefully and pick the right answer. You''ve got this!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
score = 0
quiz = [
  ("The cat is red.", "What color?", "red", "blue"),
  ("I see two dogs.", "How many?", "two", "one"),
  ("She can run fast.", "What can she do?", "run", "sit")
]
for sentence, question, right, wrong in quiz:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(sentence, 5, 15)
  time.sleep(2)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString(question, 5, 45)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: " + right, 10, 80)
  Lcd.drawString("B: " + wrong, 10, 105)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      score += 1
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x22C55E, 0x003300)
      Lcd.drawString("Correct!", 25, 50)
      Speaker.tone(880, 300)
      waiting = False
      time.sleep(1.5)
    if BtnB.isPressed():
      Lcd.fillScreen(0x330000)
      Lcd.setTextColor(0xEF4444, 0x330000)
      Lcd.drawString("It was: " + right, 5, 50)
      Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Score: " + str(score) + "/3", 20, 40)
if score == 3:
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("Perfect!", 30, 80)
Speaker.tone(660, 400)',
  '[
    {"order": 1, "text": "Create short sentences with a question and two answer choices for each."},
    {"order": 2, "text": "Show the sentence first, pause so the reader can read it, then show the question and choices."},
    {"order": 3, "text": "Use buttons to pick answers. Keep score and show results at the end!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0009-4000-8000-000000000001',
    '20000001-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 6: Plant Watcher
-- Show stages of plant growth with delays and beeps.
-- Skills: Plant Parts (0004), Scientific Observation (000a)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0006-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  6,
  'Plant Watcher',
  'Watch a plant grow on the M5Stick screen! See it go from seed to flower.',
  'Plants start as tiny seeds and grow into beautiful flowers! Let''s watch the whole journey on the M5Stick. Each stage gets its own color and sound!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
stages = [
  ("1. Seed", "Under the soil", 0x8B4513),
  ("2. Sprout", "Pushing up!", 0x22C55E),
  ("3. Plant", "Leaves grow!", 0x16A34A),
  ("4. Flower", "So pretty!", 0xEC4899)
]
for name, desc, color in stages:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(color, 0x000000)
  Lcd.drawString(name, 20, 30)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(desc, 15, 70)
  Speaker.tone(300 + stages.index((name, desc, color)) * 150, 300)
  time.sleep(2)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("It grew!", 30, 50)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "List the four stages of plant growth: seed, sprout, plant, flower."},
    {"order": 2, "text": "Show each stage name and a short description in a matching color."},
    {"order": 3, "text": "Play a sound that gets higher with each stage and pause between them!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0004-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 7: Animal Match
-- Display animal names and what they need to survive.
-- Skills: Animal Needs (0005), Scientific Observation (000a)
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0007-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  7,
  'Animal Match',
  'Learn what animals need to survive! See each animal and what keeps it alive.',
  'Every animal needs something special to live! Fish need water, birds need air to fly. Let''s explore what different animals need on the M5Stick!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
animals = [
  ("Fish", "Needs: Water", 0x3B82F6),
  ("Bird", "Needs: Air", 0x22C55E),
  ("Bear", "Needs: Food", 0x8B4513),
  ("Fox", "Needs: Shelter", 0xF97316)
]
for name, need, color in animals:
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(color, 0x000000)
  Lcd.drawString(name, 40, 30)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(need, 15, 75)
  Speaker.tone(500, 200)
  time.sleep(2)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("All animals", 15, 30)
Lcd.drawString("need care!", 20, 60)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Make a list of animals and what they need: water, air, food, or shelter."},
    {"order": 2, "text": "Display each animal name in a unique color with its need below."},
    {"order": 3, "text": "Add a pause between animals so you can read each one!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0005-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 8: Push and Pull
-- Use tilt sensor (IMU) to demonstrate forces.
-- Skills: Scientific Observation (000a), Sound & Vibration (0001)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0008-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  8,
  'Push and Pull',
  'Tilt the M5Stick to explore pushes and pulls! The screen shows the force direction.',
  'Forces are pushes and pulls that make things move! Tilt the M5Stick forward for a PUSH and backward for a PULL. The screen will show which force you''re making!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Tilt me!", 25, 50)
time.sleep(2)
for i in range(30):
  acc = Imu.getAccel()
  x = acc[0]
  Lcd.fillScreen(0x000000)
  if x > 0.3:
    Lcd.setTextColor(0xEF4444, 0x000000)
    Lcd.drawString("PUSH! >>", 25, 40)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Force: forward", 5, 80)
    Speaker.tone(600, 100)
  elif x < -0.3:
    Lcd.setTextColor(0x3B82F6, 0x000000)
    Lcd.drawString("<< PULL!", 25, 40)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Force: backward", 5, 80)
    Speaker.tone(300, 100)
  else:
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("Balanced", 25, 40)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("No force", 25, 80)
  time.sleep(0.5)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Force fun!", 20, 50)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Read the tilt sensor (accelerometer) to detect which way the device is tilted."},
    {"order": 2, "text": "If tilted forward, show \"PUSH!\" in red. If tilted back, show \"PULL!\" in blue."},
    {"order": 3, "text": "If the device is flat, show \"Balanced\". Play different sounds for each direction!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-000a-4000-8000-000000000001',
    '30000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 9: Water Cycle
-- Display the 4 stages of the water cycle with descriptions.
-- Skills: Weather (0006), Scientific Observation (000a)
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0009-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  9,
  'Water Cycle',
  'Follow water on its amazing journey! See all 4 stages of the water cycle on screen.',
  'Water goes on an incredible trip! It evaporates up, forms clouds, falls as rain, and collects again. Let''s watch the whole water cycle on the M5Stick!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
stages = [
  ("Evaporation", "Water rises up!", 0xEF4444),
  ("Condensation", "Clouds form!", 0xFFFFFF),
  ("Precipitation", "Rain falls!", 0x3B82F6),
  ("Collection", "Water gathers!", 0x22C55E)
]
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Water Cycle", 15, 50)
Speaker.tone(440, 300)
time.sleep(1.5)
for i, (name, desc, color) in enumerate(stages):
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(color, 0x000000)
  Lcd.drawString(str(i + 1) + ". " + name, 5, 25)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(desc, 15, 65)
  Speaker.tone(400 + i * 100, 250)
  time.sleep(2.5)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString("It repeats!", 15, 40)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("forever!", 30, 70)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "List the 4 stages: evaporation, condensation, precipitation, collection."},
    {"order": 2, "text": "Show each stage with a number, name, and short description in a unique color."},
    {"order": 3, "text": "End with a message about how the cycle repeats forever!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0006-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 10: Five Senses Lab
-- Use device sensors to explore the five senses.
-- Skills: Scientific Observation (000a), Sound & Vibration (0001)
-- Difficulty: Advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-000a-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  10,
  'Five Senses Lab',
  'Explore your senses with the M5Stick! See, hear, and feel with the device sensors.',
  'We use five senses to explore the world: sight, hearing, touch, smell, and taste! The M5Stick can help us with three of them. Let''s experiment!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("5 Senses Lab", 10, 50)
Speaker.tone(440, 300)
time.sleep(2)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString("1. SIGHT", 25, 20)
Lcd.setTextColor(0xEF4444, 0x000000)
Lcd.drawString("See colors!", 20, 55)
Lcd.fillScreen(0xEF4444)
time.sleep(1)
Lcd.fillScreen(0x3B82F6)
time.sleep(1)
Lcd.fillScreen(0x22C55E)
time.sleep(1)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xA855F7, 0x000000)
Lcd.drawString("2. HEARING", 20, 20)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Hear sounds!", 15, 55)
Speaker.tone(262, 300)
time.sleep(0.5)
Speaker.tone(523, 300)
time.sleep(0.5)
Speaker.tone(784, 400)
time.sleep(1)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("3. TOUCH", 25, 20)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Tilt me!", 30, 55)
for t in range(10):
  acc = Imu.getAccel()
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xF97316, 0x000000)
  Lcd.drawString("TOUCH", 35, 20)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  if acc[0] > 0.3:
    Lcd.drawString("Tilted right!", 10, 60)
  elif acc[0] < -0.3:
    Lcd.drawString("Tilted left!", 15, 60)
  else:
    Lcd.drawString("Flat!", 40, 60)
  time.sleep(0.5)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("3 senses used!", 5, 40)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Great science!", 10, 75)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "Start with SIGHT: flash different colors on the screen so your eyes can see them."},
    {"order": 2, "text": "Next is HEARING: play different tones so your ears can hear high and low sounds."},
    {"order": 3, "text": "Finally TOUCH: read the tilt sensor so the device responds to movement. Show a summary at the end!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-000a-4000-8000-000000000001',
    '30000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- Part 2: Music, Art, Problem Solving lessons (6-10 each)


-- =========================================================================
-- MUSIC Lesson 6: Volume Control
-- Play tones at different volumes. Display Soft, Medium, Loud! labels.
-- Skills: dynamics, pitch
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0006-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  6,
  'Volume Control',
  'Play a scale at different volumes -- soft, medium, and loud -- and see the labels on screen!',
  'Hey friend! Chip wants to show you something cool about VOLUME. Music can be whisper-quiet or super loud, and musicians call that DYNAMICS. Let''s play notes that get louder and louder and watch the labels change on screen!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xA855F7, 0x000000)
Lcd.drawString("Volume!", 30, 10)

notes = [262, 294, 330, 349, 392, 440]
labels = ["Soft", "Soft", "Medium", "Medium", "Loud!", "Loud!"]
colors = [0x444444, 0x666666, 0xAAAA00, 0xCCCC00, 0xFF4400, 0xFF0000]

for i in range(6):
  Lcd.fillRect(0, 40, 135, 60, 0x000000)
  Lcd.setTextColor(colors[i], 0x000000)
  Lcd.drawString(labels[i], 40, 60)
  dur = 200 + i * 50
  Speaker.tone(notes[i], dur)
  time.sleep(0.5)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Great ears!", 20, 60)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Start by clearing the screen and adding a title. Then use a loop to play 6 different notes."},
    {"order": 2, "text": "For each note, show a label like Soft, Medium, or Loud! on screen before playing the tone."},
    {"order": 3, "text": "Use notes 262, 294, 330, 349, 392, 440 going up the scale. Show Soft for the first two, Medium for the next two, and Loud! for the last two."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0006-4000-8000-000000000001',
    '40000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- MUSIC Lesson 7: Tempo Racer
-- Play notes fast then slow. Display "Fast!" then "Slow!".
-- Skills: tempo, steady_beat
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0007-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  7,
  'Tempo Racer',
  'Play the same 4 notes fast, then slow. Hear how tempo changes the feel of music!',
  'Chip wants to race with music! TEMPO means how fast or slow music goes. Let''s play the same four notes twice -- once super speedy and once nice and slow -- so you can hear the difference!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

notes = [262, 330, 392, 523]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFF4400, 0x000000)
Lcd.drawString("Fast!", 40, 50)

for n in notes:
  Speaker.tone(n, 100)
  time.sleep(0.15)

time.sleep(0.8)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString("Slow!", 40, 50)

for n in notes:
  Speaker.tone(n, 500)
  time.sleep(0.6)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Tempo!", 35, 50)
Lcd.drawString("Fast & Slow!", 15, 80)
Speaker.tone(880, 300)',
  '[
    {"order": 1, "text": "First, play 4 notes really fast with short durations (100ms each) and short waits (0.15s)."},
    {"order": 2, "text": "Then play the SAME 4 notes slowly with longer durations (500ms each) and longer waits (0.6s)."},
    {"order": 3, "text": "Use notes 262, 330, 392, 523. Show \"Fast!\" in orange before the fast round and \"Slow!\" in blue before the slow round."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0005-4000-8000-000000000001',
    '40000001-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- MUSIC Lesson 8: Echo Echo
-- Play a 3-note pattern, display notes, then replay. Show "Echo!".
-- Skills: pattern_music, rhythm_notation
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0008-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  8,
  'Echo Echo',
  'Play a 3-note pattern, see the note names, then hear the echo play it back!',
  'Have you ever shouted in a cave and heard your voice come back? That''s an ECHO! Chip wants to play a musical echo game. We''ll play 3 notes, show their names, then replay the same pattern like an echo bouncing back!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

notes = [262, 330, 392]
names = ["C", "E", "G"]
colors = [0xFF0000, 0x00FF00, 0x0000FF]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Listen!", 30, 10)

for i in range(3):
  Lcd.setTextColor(colors[i], 0x000000)
  Lcd.drawString(names[i], 20 + i * 40, 50)
  Speaker.tone(notes[i], 400)
  time.sleep(0.5)

time.sleep(0.8)

Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Echo!", 35, 90)

for i in range(3):
  Speaker.tone(notes[i], 400)
  time.sleep(0.5)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("C - E - G", 25, 50)
Lcd.drawString("Echo done!", 20, 80)
Speaker.tone(523, 300)',
  '[
    {"order": 1, "text": "Pick 3 notes to play: C (262), E (330), and G (392). Play each one with a short pause between them."},
    {"order": 2, "text": "Show each note name on screen in a different color as it plays. Then add a pause before the echo."},
    {"order": 3, "text": "After showing \"Echo!\" on screen, replay the same 3 notes in the same order. That is your echo!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0004-4000-8000-000000000001',
    '40000001-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- MUSIC Lesson 9: Rhythm Math
-- Count beats 1-2-3-4 with tones, 4 measures.
-- Skills: music_math, steady_beat
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0009-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  9,
  'Rhythm Math',
  'Count beats 1-2-3-4 with tones and numbers on screen. Play 4 measures like a real musician!',
  'Did you know music and math are best friends? Musicians count beats -- 1, 2, 3, 4 -- over and over to keep time. Let''s build a beat counter that shows the numbers AND plays a tone on every beat for 4 whole measures!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xA855F7, 0x000000)
Lcd.drawString("Rhythm Math!", 15, 10)

for measure in range(1, 5):
  for beat in range(1, 5):
    Lcd.fillRect(0, 40, 135, 80, 0x000000)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("M" + str(measure), 10, 50)
    col = 0xFF0000 if beat == 1 else 0x00AAFF
    Lcd.setTextColor(col, 0x000000)
    Lcd.drawString(str(beat), 60, 70)
    freq = 440 if beat == 1 else 330
    Speaker.tone(freq, 150)
    time.sleep(0.4)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("16 beats!", 25, 50)
Lcd.drawString("4 x 4 = 16", 20, 80)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Use two loops: an outer loop for 4 measures and an inner loop counting 1-2-3-4 for beats."},
    {"order": 2, "text": "Show the measure number and beat number on screen. Play a tone on each beat with a 0.4 second wait."},
    {"order": 3, "text": "Make beat 1 special -- show it in red and play a higher tone (440) so you can hear the start of each measure. Other beats use 330."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0009-4000-8000-000000000001',
    '40000001-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- MUSIC Lesson 10: Mini Concert
-- Play a short melody (Mary Had a Little Lamb) with notes on screen.
-- Skills: performance, composition
-- Difficulty: advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-000a-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  10,
  'Mini Concert',
  'Play a real melody on the M5Stick! See each note on screen as your device performs a mini concert.',
  'It''s CONCERT TIME! Chip is so excited because you''ve learned notes, tempo, volume, and rhythm. Now let''s put it all together and play a real melody. Your M5Stick is about to be a tiny concert stage!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

melody = [330, 294, 262, 294, 330, 330, 330,
          294, 294, 294, 330, 392, 392,
          330, 294, 262, 294, 330, 330, 330,
          330, 294, 294, 330, 294, 262]
names = ["E","D","C","D","E","E","E",
         "D","D","D","E","G","G",
         "E","D","C","D","E","E","E",
         "E","D","D","E","D","C"]
durs = [400,400,400,400,400,400,800,
        400,400,800,400,400,800,
        400,400,400,400,400,400,400,
        400,400,400,400,400,800]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Mini Concert", 15, 10)
time.sleep(1)

for i in range(len(melody)):
  Lcd.fillRect(0, 40, 135, 50, 0x000000)
  Lcd.setTextColor(0x00FFAA, 0x000000)
  Lcd.drawString(names[i], 55, 55)
  Speaker.tone(melody[i], durs[i])
  time.sleep(durs[i] / 1000.0 + 0.05)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Bravo!", 35, 50)
Lcd.drawString(str(len(melody)) + " notes!", 30, 80)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 500)',
  '[
    {"order": 1, "text": "A melody is just a list of notes played in order. Start with the notes E, D, C, D, E, E, E."},
    {"order": 2, "text": "Use a loop to go through each note. Show the note name on screen and play the tone for each one."},
    {"order": 3, "text": "Some notes are longer than others -- the last note of each phrase should be held longer (800ms vs 400ms). End with a celebratory \"Bravo!\" message."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-000a-4000-8000-000000000001',
    '40000001-0007-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);


-- =========================================================================
-- ART Lesson 6: Pixel Portrait
-- Draw a simple smiley face using rectangles and circles.
-- Skills: pixel_art, pixels
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0006-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  6,
  'Pixel Portrait',
  'Draw a smiley face on the M5Stick screen using circles and rectangles!',
  'Let''s make pixel art of a smiley face! We''ll use circles for the eyes and head, and a little arc for the smile. It''s like building a face out of tiny colored dots -- that''s what pixel art is all about!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)

Lcd.fillCircle(67, 80, 45, 0xFFFF00)
Lcd.fillCircle(50, 70, 6, 0x000000)
Lcd.fillCircle(84, 70, 6, 0x000000)
Lcd.fillRect(48, 95, 38, 4, 0x000000)
Lcd.fillRect(44, 91, 4, 4, 0x000000)
Lcd.fillRect(86, 91, 4, 4, 0x000000)

Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Smiley!", 35, 140)
Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("Pixel Art!", 25, 160)',
  '[
    {"order": 1, "text": "Start with a big yellow circle in the center of the screen for the face. Try x=67, y=80, radius=45."},
    {"order": 2, "text": "Add two small black circles for eyes. Put one at x=50, y=70 and one at x=84, y=70 with radius 6."},
    {"order": 3, "text": "Make a mouth using a black rectangle at y=95. Add small squares at the corners to make it look like a smile!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0006-4000-8000-000000000001',
    '50000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- ART Lesson 7: Mood Colors
-- Show colors and mood words. Cycle through 4 color-mood pairs.
-- Skills: color_mood, color_mixing
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0007-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  7,
  'Mood Colors',
  'Fill the screen with different colors and see how each one makes you feel!',
  'Did you know colors can make you FEEL things? Red feels excited, blue feels calm, yellow feels happy! Let''s cycle through mood colors on screen and see the feeling words change with each one.',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

colors = [0xFF0000, 0x0000FF, 0xFFFF00, 0x00AA00]
moods = ["Excited!", "Calm", "Happy!", "Peaceful"]
text_colors = [0xFFFFFF, 0xFFFFFF, 0x000000, 0xFFFFFF]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Mood Colors!", 15, 60)
time.sleep(1)

for i in range(4):
  Lcd.fillScreen(colors[i])
  Lcd.setTextColor(text_colors[i], colors[i])
  Lcd.drawString(moods[i], 30, 60)
  Speaker.tone(262 + i * 60, 200)
  time.sleep(1.5)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("Colors have", 15, 50)
Lcd.drawString("feelings!", 25, 70)',
  '[
    {"order": 1, "text": "Make a list of 4 colors and 4 mood words that match them. Red = Excited, Blue = Calm, etc."},
    {"order": 2, "text": "Use a loop to fill the whole screen with each color and show the mood word on top."},
    {"order": 3, "text": "Add a short pause (1.5 seconds) between each color so you have time to feel the mood. Use white text on dark colors and black text on yellow!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0008-4000-8000-000000000001',
    '50000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- ART Lesson 8: Pattern Tiles
-- Create a checkerboard pattern with nested loops.
-- Skills: pattern_creation, pixels
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0008-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  8,
  'Pattern Tiles',
  'Use nested loops to draw a colorful checkerboard pattern on the screen!',
  'Checkerboards are one of the coolest patterns in art -- two colors taking turns in a grid! Let''s use loops inside loops to draw a checkerboard. The M5Stick will figure out which squares to color all by itself!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)

size = 27
for row in range(8):
  for col in range(5):
    if (row + col) % 2 == 0:
      color = 0xFF00FF
    else:
      color = 0x00FFFF
    Lcd.fillRect(col * size, row * size, size, size, color)

Lcd.setTextColor(0x000000, 0xFF00FF)
Lcd.drawString("Pattern!", 25, 110)',
  '[
    {"order": 1, "text": "A checkerboard alternates two colors. If the row plus column is even, use one color. If odd, use the other color."},
    {"order": 2, "text": "Use two loops: one for rows (0 to 7) and one for columns (0 to 4). Draw a filled rectangle at each position."},
    {"order": 3, "text": "Each tile is 27 pixels wide. Multiply col times 27 for x position and row times 27 for y position. Use (row + col) % 2 to alternate colors!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0004-4000-8000-000000000001',
    '50000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- ART Lesson 9: Coordinate Canvas
-- Draw shapes at specific x,y positions with labels.
-- Skills: coordinates, shapes_art
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0009-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  9,
  'Coordinate Canvas',
  'Place shapes at exact x,y coordinates on the screen and label each position!',
  'Every spot on the screen has an address made of two numbers: x (left-right) and y (up-down). Let''s draw shapes at specific coordinates and label where they are -- like a treasure map for art!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Coord Canvas", 10, 5)

Lcd.fillCircle(30, 50, 12, 0xFF0000)
Lcd.setTextColor(0xFF0000, 0x000000)
Lcd.drawString("(30,50)", 5, 70)

Lcd.fillRect(75, 40, 20, 20, 0x00FF00)
Lcd.setTextColor(0x00FF00, 0x000000)
Lcd.drawString("(75,40)", 65, 70)

Lcd.fillCircle(50, 120, 15, 0x0000FF)
Lcd.setTextColor(0x0000FF, 0x000000)
Lcd.drawString("(50,120)", 20, 145)

Lcd.fillRect(90, 110, 25, 25, 0xFFFF00)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("(90,110)", 75, 145)

Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("4 shapes!", 25, 180)',
  '[
    {"order": 1, "text": "Pick 4 spots on the screen by choosing x and y numbers. x goes left-right (0 to 135), y goes up-down (0 to 240)."},
    {"order": 2, "text": "Draw a shape at each spot -- try circles and rectangles. Use different colors for each one."},
    {"order": 3, "text": "Label each shape with its coordinates using drawString. Write the x,y values below each shape so you can see where it is!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0009-4000-8000-000000000001',
    '50000001-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- ART Lesson 10: Art Gallery
-- Mini slideshow of 4 art screens, auto-advance with beeps.
-- Skills: creative_expression, color_mood
-- Difficulty: advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-000a-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  10,
  'Art Gallery',
  'Create a mini art slideshow! Four colorful screens auto-advance like a gallery tour.',
  'Welcome to YOUR art gallery! Real galleries show paintings one at a time as you walk through. Let''s make a slideshow of 4 art screens with different colors and themes. Each one will auto-advance with a beep!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

titles = ["Sunset", "Ocean", "Forest", "Night"]
bgs = [0xFF4400, 0x0044AA, 0x006600, 0x110022]
fgs = [0xFFFF00, 0x00FFFF, 0x88FF88, 0xFFFFFF]
details = ["Warm glow", "Deep blue", "Green life", "Starlight"]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Art Gallery", 15, 60)
Lcd.drawString("4 paintings", 15, 85)
Speaker.tone(440, 200)
time.sleep(1.5)

for i in range(4):
  Lcd.fillScreen(bgs[i])
  Lcd.setTextColor(fgs[i], bgs[i])
  Lcd.drawString(titles[i], 30, 40)
  Lcd.drawString(details[i], 20, 70)
  num = str(i + 1) + " of 4"
  Lcd.drawString(num, 35, 110)
  Speaker.tone(330 + i * 80, 200)
  time.sleep(2)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("The End!", 30, 50)
Lcd.drawString("Great gallery!", 10, 80)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 400)',
  '[
    {"order": 1, "text": "Plan 4 art screens with different themes. Pick a background color and title for each one."},
    {"order": 2, "text": "Use a loop to show each screen. Fill the background, draw the title and a detail line, then wait 2 seconds before advancing."},
    {"order": 3, "text": "Add a beep when each painting appears (Speaker.tone). Show \"1 of 4\", \"2 of 4\", etc. so viewers know which painting they are on!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-000a-4000-8000-000000000001',
    '50000001-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING Lesson 6: Maze Navigator
-- Follow step-by-step directions. Display arrows.
-- Skills: sequencing, algorithmic_thinking
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0006-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  6,
  'Maze Navigator',
  'Follow step-by-step arrow directions to escape the maze!',
  'Chip is stuck in a maze! To get out, you need to follow directions one step at a time. That''s called an ALGORITHM -- a list of steps in the right order. Let''s display each direction and guide Chip to freedom!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

steps = ["Up", "Up", "Right", "Right", "Down", "Left", "Down", "Down"]
arrows = ["^", "^", ">", ">", "v", "<", "v", "v"]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Maze Time!", 20, 10)
time.sleep(1)

for i in range(len(steps)):
  Lcd.fillRect(0, 40, 135, 80, 0x000000)
  Lcd.setTextColor(0x00FFAA, 0x000000)
  num = "Step " + str(i + 1)
  Lcd.drawString(num, 20, 45)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(arrows[i] + " " + steps[i], 30, 75)
  Speaker.tone(400 + i * 40, 150)
  time.sleep(1)

Lcd.fillScreen(0x003300)
Lcd.setTextColor(0x22C55E, 0x003300)
Lcd.drawString("You escaped!", 10, 50)
Lcd.drawString("8 steps!", 30, 80)
Speaker.tone(880, 300)
time.sleep(0.3)
Speaker.tone(1100, 400)',
  '[
    {"order": 1, "text": "Make a list of directions: Up, Up, Right, Right, Down, Left, Down, Down. These are the steps to escape!"},
    {"order": 2, "text": "Use a loop to show each step one at a time. Display the step number and the direction with an arrow symbol."},
    {"order": 3, "text": "Add a beep for each step and a 1-second pause. At the end, show \"You escaped!\" with a celebration sound!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0002-4000-8000-000000000001',
    '60000001-0007-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING Lesson 7: Number Detective
-- Guess a mystery number with clues.
-- Skills: logical_reasoning, pattern_recognition
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0007-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  7,
  'Number Detective',
  'Read the clues and figure out the mystery number! Use logic to narrow it down.',
  'Put on your detective hat! Chip is thinking of a secret number and will give you 3 clues. Use LOGIC to figure out which number fits ALL the clues. Only one number works -- can you find it?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Mystery Number", 5, 10)
time.sleep(1)

clues = ["I am > 3", "I am < 7", "I am odd"]
for i in range(3):
  Lcd.setTextColor(0x00AAFF, 0x000000)
  txt = "Clue " + str(i + 1) + ":"
  Lcd.drawString(txt, 10, 40 + i * 30)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(clues[i], 10, 55 + i * 30)
  Speaker.tone(330 + i * 100, 200)
  time.sleep(1.5)

time.sleep(1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("The answer is", 10, 40)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("5!", 55, 70)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("> 3, < 7, odd", 10, 100)
Lcd.drawString("= only 5!", 25, 120)
Speaker.tone(880, 300)
time.sleep(0.3)
Speaker.tone(1100, 400)',
  '[
    {"order": 1, "text": "Show 3 clues one at a time: \"I am > 3\", \"I am < 7\", \"I am odd\". Pause between each one."},
    {"order": 2, "text": "Think about which numbers are greater than 3 AND less than 7. That gives you 4, 5, 6. Now which of those is odd?"},
    {"order": 3, "text": "The answer is 5! It is greater than 3, less than 7, and odd. Show the answer with a big celebration!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0008-4000-8000-000000000001',
    '60000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING Lesson 8: Code Cracker
-- Match symbols to letters. Decode a secret word.
-- Skills: pattern_recognition, decomposition
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0008-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  8,
  'Code Cracker',
  'Learn a secret code where A=1, B=2, C=3. Decode a mystery word!',
  'Spies use secret codes to hide messages! Let''s learn a simple code where each letter equals a number: A=1, B=2, C=3. Chip has a coded message for you to CRACK. Can you figure out the secret word?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Code Cracker!", 10, 10)
time.sleep(1)

Lcd.setTextColor(0x00AAFF, 0x000000)
Lcd.drawString("The Code:", 10, 35)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("A=1 B=2 C=3", 10, 55)
Speaker.tone(330, 150)
time.sleep(1.5)

Lcd.setTextColor(0xFF4400, 0x000000)
Lcd.drawString("Secret:", 10, 80)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("3 - 1 - 2", 10, 100)
Speaker.tone(440, 150)
time.sleep(2)

code = [3, 1, 2]
letters = ["C", "A", "B"]
result = ""
for i in range(3):
  result = result + letters[i]
  Lcd.fillRect(0, 120, 135, 30, 0x000000)
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString(result, 40, 125)
  Speaker.tone(500 + i * 100, 200)
  time.sleep(0.8)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("CAB!", 45, 50)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Code cracked!", 10, 80)
Speaker.tone(880, 300)
time.sleep(0.3)
Speaker.tone(1100, 400)',
  '[
    {"order": 1, "text": "First show the code key: A=1, B=2, C=3. This tells you which number means which letter."},
    {"order": 2, "text": "Show the secret message: 3 - 1 - 2. Now use the code key to figure out each letter. 3 = C, 1 = A, 2 = B."},
    {"order": 3, "text": "Build the word letter by letter on screen: first C, then CA, then CAB. The secret word is CAB!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0001-4000-8000-000000000001',
    '60000001-0005-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING Lesson 9: Balance Game
-- Compare two numbers, display Heavy/Light/Balanced.
-- Skills: logical_reasoning, cause_effect
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0009-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  9,
  'Balance Game',
  'Compare numbers on a balance scale! Figure out which side is heavier or if they are equal.',
  'Imagine a seesaw with numbers on each side! If one side has a bigger number, that side goes DOWN because it''s heavier. Let''s build a balance game that compares numbers and shows which side wins!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

pairs = [[8, 3], [5, 5], [2, 7], [6, 4]]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Balance Game!", 10, 10)
time.sleep(1)

for p in pairs:
  Lcd.fillRect(0, 30, 135, 100, 0x000000)
  Lcd.setTextColor(0x00AAFF, 0x000000)
  Lcd.drawString(str(p[0]), 20, 50)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("vs", 55, 50)
  Lcd.setTextColor(0xFF4400, 0x000000)
  Lcd.drawString(str(p[1]), 95, 50)

  Lcd.fillRect(10, 90, 50, 4, 0xFFFFFF)
  Lcd.fillRect(75, 90, 50, 4, 0xFFFFFF)
  Lcd.fillRect(62, 85, 10, 14, 0xFFFFFF)

  if p[0] > p[1]:
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("Left Heavy!", 15, 110)
    Speaker.tone(330, 200)
  elif p[1] > p[0]:
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("Right Heavy!", 10, 110)
    Speaker.tone(550, 200)
  else:
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("Balanced!", 20, 110)
    Speaker.tone(440, 300)
  time.sleep(2)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("4 rounds done!", 5, 60)
Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "Show two numbers on screen with \"vs\" between them. Compare them using if/elif/else."},
    {"order": 2, "text": "If the left number is bigger, show \"Left Heavy!\". If the right is bigger, show \"Right Heavy!\". If they are equal, show \"Balanced!\"."},
    {"order": 3, "text": "Try 4 pairs: [8,3], [5,5], [2,7], [6,4]. Draw a simple scale shape using rectangles and play different tones for each result!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0008-4000-8000-000000000001',
    '60000001-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  12,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- PROBLEM SOLVING Lesson 10: Logic Links
-- If-then chains. Pick weather with buttons, see the result.
-- Skills: logical_reasoning, creative_problem_solving
-- Difficulty: advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-000a-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  10,
  'Logic Links',
  'Use if-then logic chains! Pick the weather with buttons and see what activity Chip recommends.',
  'Chip makes decisions using IF-THEN logic every day! IF it is sunny THEN go to the park. IF it is rainy THEN read a book. Press the buttons to pick the weather and see the logic chain in action!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Logic Links!", 15, 10)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("IF...THEN...", 15, 35)
time.sleep(1.5)

rounds = 0
while rounds < 3:
  Lcd.fillRect(0, 55, 135, 185, 0x000000)
  Lcd.setTextColor(0x00AAFF, 0x000000)
  Lcd.drawString("Pick weather:", 10, 60)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString("A = Sunny", 10, 85)
  Lcd.setTextColor(0x8888FF, 0x000000)
  Lcd.drawString("B = Rainy", 10, 105)

  waiting = True
  while waiting:
    if BtnA.isPressed():
      Lcd.fillRect(0, 55, 135, 185, 0x000000)
      Lcd.setTextColor(0xFFFF00, 0x000000)
      Lcd.drawString("IF sunny", 15, 65)
      Lcd.setTextColor(0x22C55E, 0x000000)
      Lcd.drawString("THEN park!", 15, 90)
      Lcd.fillCircle(67, 150, 20, 0xFFFF00)
      Speaker.tone(660, 200)
      rounds = rounds + 1
      waiting = False
      time.sleep(2)
    if BtnB.isPressed():
      Lcd.fillRect(0, 55, 135, 185, 0x000000)
      Lcd.setTextColor(0x8888FF, 0x000000)
      Lcd.drawString("IF rainy", 15, 65)
      Lcd.setTextColor(0x22C55E, 0x000000)
      Lcd.drawString("THEN book!", 15, 90)
      Lcd.fillRect(45, 130, 40, 50, 0x8B4513)
      Speaker.tone(440, 200)
      rounds = rounds + 1
      waiting = False
      time.sleep(2)
    time.sleep(0.05)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("Logic master!", 10, 50)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("3 decisions!", 15, 80)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 400)',
  '[
    {"order": 1, "text": "Show two choices: Button A for Sunny and Button B for Rainy. Wait for the player to press one."},
    {"order": 2, "text": "IF Button A (Sunny): show \"IF sunny THEN park!\" with a sun circle. IF Button B (Rainy): show \"IF rainy THEN book!\" with a book rectangle."},
    {"order": 3, "text": "Let the player make 3 choices using a counter. After 3 rounds, show \"Logic master!\" to celebrate. Each IF-THEN is a logic link!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0008-4000-8000-000000000001',
    '60000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,buttons}',
  true,
  15,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
