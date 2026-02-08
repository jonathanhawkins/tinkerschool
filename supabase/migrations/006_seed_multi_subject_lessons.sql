-- =============================================================================
-- TinkerSchool -- Seed 5 Math Lessons for Band 1 (Explorer, Grade 1)
-- =============================================================================
-- Seeds 5 interactive math lessons that progress from simple counting to
-- sensor-based addition. Designed for Cassidy (age 7) using the M5StickC
-- Plus 2 device to make math tangible, visual, and FUN.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Math subject:         00000000-0000-4000-8000-000000000001
--   - Number World module:  00000001-0001-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Counting Beeps!
-- Concept: Count from 1 to 10 on the screen, with a beep for each number.
-- Skills: Counting to 120, Number Recognition
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0001-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  1,
  'Counting Beeps!',
  'Count from 1 to 10 on the M5Stick screen with a fun beep for each number!',
  'Hey there, friend! It''s me, Chip! I have a really cool idea. What if we could make the M5Stick COUNT for us? Like, it shows the number 1 on the screen and goes BEEP! Then it shows 2 and goes BEEP! All the way up to 10! Each number gets its own beep -- how fun is that? I bet you can already count to 10 super fast, but can you teach the M5Stick to do it too? The screen will show each number nice and big so everyone can see. And the beeps will get a little higher each time -- like climbing stairs made of sound! Ready to count? Let''s go!',
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
  Lcd.drawString(str(i), 55, 50)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Counting!", 25, 100)
  Speaker.tone(200 + i * 80, 300)
  time.sleep(1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("10!", 50, 50)
Lcd.drawString("Great job!", 15, 90)
Speaker.tone(880, 500)',
  '[
    {"order": 1, "text": "We need to show numbers 1 through 10 on the screen. Look for a loop block that can count up!"},
    {"order": 2, "text": "Inside the loop, use a ''clear display'' block and a ''display text'' block. Put the loop counter number in the text so it shows 1, then 2, then 3..."},
    {"order": 3, "text": "Add a ''play tone'' block inside the loop so each number gets a beep. Then add a ''wait'' block (1 second) so you have time to see each number. After the loop, add a ''display text'' block that says \"Great job!\""}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0001-4000-8000-000000000001',
    '10000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: Number Catcher
-- Concept: Random numbers appear. Press Button A if > 5, Button B if < 5.
-- Skills: Number Recognition, Counting to 120
-- Difficulty: Beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0002-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  2,
  'Number Catcher',
  'A random number pops up on screen. Is it bigger or smaller than 5? Press the right button to catch it!',
  'Chip here with a super fun game! Numbers are going to pop up on the M5Stick screen -- but they are SNEAKY numbers! Some are BIG (bigger than 5) and some are SMALL (smaller than 5). Your job is to CATCH them! If the number is bigger than 5, quick -- press Button A! If it is smaller than 5, press Button B! If you get it right, you will hear a happy beep and see a star! If you get it wrong, that''s totally okay -- the M5Stick will show you the right answer so you can learn. You get 5 rounds to play. Can you catch them all? I believe in you!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <field name="TEXT">Number Catcher!</field>
        <field name="X">10</field>
        <field name="Y">60</field>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>',
  'import time
import random
score = 0
for r in range(5):
  n = random.randint(1, 9)
  while n == 5:
    n = random.randint(1, 9)
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString(str(n), 60, 30)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: > 5", 10, 100)
  Lcd.drawString("B: < 5", 10, 120)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      if n > 5:
        score = score + 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("YES!", 45, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("Nope!", 40, 50)
        Lcd.drawString(str(n) + " < 5", 40, 80)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    if BtnB.isPressed():
      if n < 5:
        score = score + 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("YES!", 45, 50)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("Nope!", 40, 50)
        Lcd.drawString(str(n) + " > 5", 40, 80)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(1.5)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString("Score:", 30, 40)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString(str(score) + " / 5", 40, 70)
if score >= 4:
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("Amazing!", 25, 110)
  Speaker.tone(660, 200)
  time.sleep(0.3)
  Speaker.tone(880, 400)',
  '[
    {"order": 1, "text": "First, we need a random number to appear on the screen. Look for a block that picks a random number between 1 and 9."},
    {"order": 2, "text": "Now add button checks! Use an ''if'' block: IF Button A is pressed AND the number is bigger than 5, show \"YES!\" and play a happy beep. Do the same for Button B when the number is smaller than 5."},
    {"order": 3, "text": "Wrap the whole thing in a loop that runs 5 times for 5 rounds. Keep a score variable that goes up by 1 for each correct answer. At the end, show the final score on the screen!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0002-4000-8000-000000000001',
    '10000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Add It Up!
-- Concept: Two random numbers (1-5) shown as addition problem. Pick answer.
-- Skills: Addition within 10, Number Recognition
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0003-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  3,
  'Add It Up!',
  'Solve addition problems on the M5Stick! Two numbers appear and you pick the correct sum using the buttons.',
  'Guess what, friend? It''s MATH GAME TIME! Here is how it works. The M5Stick is going to show you two numbers, like 3 + 2. Then it will show you two answers to pick from -- one is right and one is wrong. You press Button A for the first answer or Button B for the second answer. If you pick the right one, you get a GOLD STAR and a happy sound! You get 5 math problems to solve. Do not worry if you get one wrong -- the M5Stick will show you the right answer so you learn. I bet you are going to be a math superstar! The numbers go from 1 to 5, so the biggest answer you could get is 10. You totally got this!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random
score = 0
for r in range(5):
  a = random.randint(1, 5)
  b = random.randint(1, 5)
  answer = a + b
  wrong = answer + random.choice([-1, 1, -2, 2])
  if wrong < 0:
    wrong = answer + 2
  if wrong == answer:
    wrong = answer + 1
  if random.randint(0, 1) == 0:
    opt_a = answer
    opt_b = wrong
  else:
    opt_a = wrong
    opt_b = answer
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0x3B82F6, 0x000000)
  Lcd.drawString(str(a) + " + " + str(b) + " = ?", 15, 20)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A: " + str(opt_a), 15, 70)
  Lcd.drawString("B: " + str(opt_b), 15, 100)
  waiting = True
  while waiting:
    if BtnA.isPressed():
      if opt_a == answer:
        score = score + 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("Correct!", 20, 50)
        Lcd.drawString(str(a) + "+" + str(b) + "=" + str(answer), 20, 80)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("Not quite!", 10, 50)
        Lcd.drawString(str(a) + "+" + str(b) + "=" + str(answer), 20, 80)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(2)
    if BtnB.isPressed():
      if opt_b == answer:
        score = score + 1
        Lcd.fillScreen(0x003300)
        Lcd.setTextColor(0x22C55E, 0x003300)
        Lcd.drawString("Correct!", 20, 50)
        Lcd.drawString(str(a) + "+" + str(b) + "=" + str(answer), 20, 80)
        Speaker.tone(880, 300)
      else:
        Lcd.fillScreen(0x330000)
        Lcd.setTextColor(0xEF4444, 0x330000)
        Lcd.drawString("Not quite!", 10, 50)
        Lcd.drawString(str(a) + "+" + str(b) + "=" + str(answer), 20, 80)
        Speaker.tone(220, 300)
      waiting = False
      time.sleep(2)
    time.sleep(0.1)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Done!", 40, 20)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString(str(score) + " / 5", 45, 60)
if score == 5:
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("PERFECT!", 25, 100)
  Speaker.tone(523, 200)
  time.sleep(0.2)
  Speaker.tone(659, 200)
  time.sleep(0.2)
  Speaker.tone(784, 400)
elif score >= 3:
  Lcd.setTextColor(0x22C55E, 0x000000)
  Lcd.drawString("Great job!", 15, 100)',
  '[
    {"order": 1, "text": "Start by picking two random numbers between 1 and 5. Then add them together to get the right answer. Store it in a variable!"},
    {"order": 2, "text": "Show the math problem on the screen (like \"3 + 2 = ?\") and two answer choices. One should be the right answer and one should be wrong. Use buttons to let the player pick!"},
    {"order": 3, "text": "Check if the button press matches the correct answer. If yes, add 1 to the score and show \"Correct!\" with a happy beep. If no, show the right answer so they can learn. Wrap everything in a loop for 5 rounds, then show the final score!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0003-4000-8000-000000000001',
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
-- Lesson 4: Shape Builder
-- Concept: Draw 2D shapes on screen (circle, square, triangle). Count sides.
-- Skills: 2D Shapes and Attributes, Counting to 120
-- Difficulty: Intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0004-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  4,
  'Shape Builder',
  'Draw colorful shapes on the M5Stick screen and learn how many sides each one has!',
  'Chip LOVES shapes! Circles, squares, triangles -- they are EVERYWHERE! Did you know that a square has 4 sides, a triangle has 3 sides, and a circle has... ZERO sides? That is because a circle is one smooth curve all the way around -- so cool! Today we are going to draw shapes on the M5Stick screen and label each one. First, draw a big colorful circle. Then draw a square. Then draw a triangle using lines. Under each shape, we will write its name and how many sides it has. It is like building a mini shape museum right on your M5Stick! Press Button A to see the next shape. Ready to be a Shape Builder? Let''s draw!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("Shape Builder!", 5, 10)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Press A: next", 10, 220)
time.sleep(2)

Lcd.fillScreen(0x000000)
Lcd.fillCircle(67, 80, 40, 0xEF4444)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Circle", 35, 140)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("0 sides", 30, 165)
Lcd.drawString("(1 curve!)", 20, 190)
while not BtnA.isPressed():
  time.sleep(0.1)
time.sleep(0.3)

Lcd.fillScreen(0x000000)
Lcd.fillRect(27, 40, 80, 80, 0x3B82F6)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Square", 35, 140)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("4 sides", 30, 165)
Lcd.drawString("All equal!", 20, 190)
while not BtnA.isPressed():
  time.sleep(0.1)
time.sleep(0.3)

Lcd.fillScreen(0x000000)
Lcd.drawLine(67, 40, 27, 120, 0x22C55E)
Lcd.drawLine(27, 120, 107, 120, 0x22C55E)
Lcd.drawLine(107, 120, 67, 40, 0x22C55E)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Triangle", 25, 140)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("3 sides", 30, 165)
while not BtnA.isPressed():
  time.sleep(0.1)
time.sleep(0.3)

Lcd.fillScreen(0x000000)
Lcd.fillRect(27, 40, 80, 50, 0xA855F7)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Rectangle", 20, 110)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("4 sides", 30, 135)
Lcd.drawString("2 long 2 short", 5, 160)
while not BtnA.isPressed():
  time.sleep(0.1)
time.sleep(0.3)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("You learned", 10, 50)
Lcd.drawString("4 shapes!", 20, 80)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Shape Master!", 5, 120)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 400)',
  '[
    {"order": 1, "text": "Start by clearing the screen. Then use the ''draw circle'' block to draw a big circle in the middle. Under it, add text that says \"Circle\" and \"0 sides\"."},
    {"order": 2, "text": "After the circle, add a ''wait for Button A'' so the player can press A to see the next shape. Then clear the screen again and draw a square using ''draw rectangle'' (make the width and height the same number!)."},
    {"order": 3, "text": "For the triangle, you need 3 ''draw line'' blocks to make 3 sides. Connect the end of each line to the start of the next one. Add a rectangle too (width and height are different numbers). End with a celebration message!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0007-4000-8000-000000000001',
    '10000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Shake Counter
-- Concept: Shake the M5Stick to add 1 to a counter. Reach 10 to celebrate!
-- Skills: Addition within 10, Counting to 120, Number Patterns
-- Difficulty: Advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a1000001-0005-4000-8000-000000000001',
  '00000001-0001-4000-8000-000000000001',
  5,
  'Shake Counter',
  'Shake the M5Stick to count up by ones! Each shake adds 1. Reach 10 for a big celebration!',
  'Okay friend, this is the COOLEST thing ever! You know how the M5Stick can feel when you shake it? Well, today we are going to use that SUPERPOWER to do math! Every time you shake the M5Stick, the number on the screen goes up by ONE. Shake! Now it says 1. Shake again! Now it says 2. The LED light will blink every time you shake it, and you will hear a little beep. Keep shaking until you reach 10! When you get to 10, get ready for the BIGGEST celebration ever -- flashing lights, happy sounds, and a huge "YOU DID IT!" on the screen! It is like addition with your whole body. Every shake is +1. Can you shake your way to 10? Let''s find out!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="variables_set" x="20" y="20">
    <field name="VAR">count</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
    <next>
      <block type="controls_whileUntil">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </value>
      </block>
    </next>
  </block>
</xml>',
  'import time
count = 0
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x3B82F6, 0x000000)
Lcd.drawString("Shake Counter", 5, 10)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Shake me!", 20, 60)
Lcd.drawString("Count: 0", 25, 100)
Lcd.drawString("Goal: 10", 25, 130)

while count < 10:
  acc = Imu.getAccel()
  x = acc[0]
  y = acc[1]
  z = acc[2]
  force = x*x + y*y + z*z
  if force > 2.5:
    count = count + 1
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x3B82F6, 0x000000)
    Lcd.drawString("Shake Counter", 5, 10)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString(str(count), 55, 55)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Count: " + str(count), 20, 100)
    left = 10 - count
    Lcd.drawString(str(left) + " more!", 25, 130)
    pct = int(count * 120 / 10)
    Lcd.fillRect(7, 165, pct, 15, 0x22C55E)
    Lcd.drawRect(7, 165, 120, 15, 0xFFFFFF)
    Power.setLed(255)
    Speaker.tone(300 + count * 60, 150)
    time.sleep(0.3)
    Power.setLed(0)
    time.sleep(0.3)
  time.sleep(0.05)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("YOU DID IT!", 10, 30)
Lcd.setTextColor(0x22C55E, 0x000000)
Lcd.drawString("10 shakes!", 15, 65)
Lcd.setTextColor(0xEC4899, 0x000000)
Lcd.drawString("Math star!", 15, 100)
for i in range(5):
  Power.setLed(255)
  Speaker.tone(600 + i * 100, 150)
  time.sleep(0.2)
  Power.setLed(0)
  time.sleep(0.2)
Power.setLed(0)',
  '[
    {"order": 1, "text": "You already have a ''count'' variable set to 0 and a loop. Inside the loop, read the accelerometer sensor to detect shaking. Check if the shaking force is strong enough!"},
    {"order": 2, "text": "When a shake is detected, add 1 to the count variable (count = count + 1). Then update the screen to show the new count. Turn on the LED and play a beep so the player knows it worked!"},
    {"order": 3, "text": "Change the loop to stop when count reaches 10. After the loop ends, show a big celebration! Clear the screen, display \"YOU DID IT!\", flash the LED 5 times, and play a victory melody with increasing tones. Add a progress bar too: draw a filled rectangle whose width grows with each shake!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000001-0003-4000-8000-000000000001',
    '10000001-0001-4000-8000-000000000001',
    '10000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,buzzer,led}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- =============================================================================
-- TinkerSchool -- Seed 5 Reading Lessons for Band 1 (Explorer, Grade K-1)
-- =============================================================================
-- Seeds 5 interactive reading/literacy lessons that progress from letter
-- recognition to rhyming word identification. Designed for Cassidy (age 7)
-- using Blockly blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Reading subject:     00000000-0000-4000-8000-000000000002
--   - Word World module:   00000001-0002-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Letter Parade!
-- Concept: Display letters A-E one at a time, press button to advance.
-- Skills: Consonant Sounds, Short Vowel Sounds
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0001-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  1,
  'Letter Parade!',
  'Display big colorful letters A through E on screen and press a button to see the next one. Learn to recognize letters!',
  'Hey there, reader! It''s me, Chip! I have a SUPER fun idea. Let''s throw a LETTER PARADE on your M5Stick screen! We''ll show the letters A, B, C, D, and E -- one at a time, nice and BIG so you can really see them. Every time you press Button A, the next letter marches onto the screen like it''s in a parade! And guess what? Each letter gets its own special color AND a little beep to say hello. A is for AMAZING, B is for BRILLIANT, C is for COOL... ready to start the parade? Let''s GO!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

letters = ["A", "B", "C", "D", "E"]
colors = [0xFF0000, 0x00FF00, 0x3B82F6, 0xFFFF00, 0xFF00FF]
index = 0

Lcd.fillScreen(0x000000)
Lcd.setTextColor(colors[0], 0x000000)
Lcd.drawString("A", 50, 50)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Press A: next", 10, 120)

while True:
  if BtnA.isPressed():
    index = index + 1
    if index >= 5:
      index = 0
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(colors[index], 0x000000)
    Lcd.drawString(letters[index], 50, 50)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Press A: next", 10, 120)
    Speaker.tone(440 + index * 100, 200)
    time.sleep(0.4)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Start by clearing the screen to black and using a ''display text'' block to show the letter A nice and big in the middle of the screen."},
    {"order": 2, "text": "We need a loop that keeps checking if Button A is pressed. When it is, we show the next letter! Try putting an ''if button pressed'' block inside a ''repeat forever'' loop."},
    {"order": 3, "text": "Use a variable called ''index'' that starts at 0 and goes up by 1 each time Button A is pressed. Use it to pick which letter and color to show. Add a ''play tone'' block so each letter makes a beep! Reset index to 0 when it reaches 5 so the parade loops around."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0001-4000-8000-000000000001',
    '20000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: Vowel Spotter
-- Concept: Display random letters, classify as vowel or consonant.
-- Skills: Short Vowel Sounds, Consonant Sounds
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0002-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  2,
  'Vowel Spotter',
  'Random letters appear on screen. Press Button A if it is a vowel, Button B if it is a consonant. Score points!',
  'Chip has a challenge for you! Did you know that the alphabet has TWO kinds of letters? There are VOWELS -- A, E, I, O, and U -- and CONSONANTS -- all the other letters like B, C, D, F, and more. Vowels are super special because every single word needs at least one! Here''s the game: I''ll flash a random letter on the screen. If it''s a VOWEL, press Button A really fast! If it''s a CONSONANT, press Button B! You get a point for every right answer, and I''ll keep score. Think you can get them ALL right? I believe in you! Let''s play Vowel Spotter!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text" x="20" y="60">
        <field name="TEXT">Vowel Spotter!</field>
        <field name="X">10</field>
        <field name="Y">60</field>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>',
  'import time
import random

vowels = ["A", "E", "I", "O", "U"]
all_letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
               "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
               "U", "V", "W", "X", "Y", "Z"]
score = 0
rounds = 0

while rounds < 10:
  letter = all_letters[random.randint(0, 25)]
  is_vowel = letter in vowels

  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString(letter, 55, 40)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A=Vowel B=Not", 5, 100)
  Lcd.drawString("Score: " + str(score), 20, 120)

  answered = False
  while not answered:
    if BtnA.isPressed():
      if is_vowel:
        score = score + 1
        Lcd.fillScreen(0x004400)
        Lcd.setTextColor(0x00FF00, 0x004400)
        Lcd.drawString("YES!", 45, 60)
        Speaker.tone(880, 200)
      else:
        Lcd.fillScreen(0x440000)
        Lcd.setTextColor(0xFF0000, 0x440000)
        Lcd.drawString("Nope!", 40, 60)
        Speaker.tone(220, 300)
      answered = True
    if BtnB.isPressed():
      if not is_vowel:
        score = score + 1
        Lcd.fillScreen(0x004400)
        Lcd.setTextColor(0x00FF00, 0x004400)
        Lcd.drawString("YES!", 45, 60)
        Speaker.tone(880, 200)
      else:
        Lcd.fillScreen(0x440000)
        Lcd.setTextColor(0xFF0000, 0x440000)
        Lcd.drawString("Nope!", 40, 60)
        Speaker.tone(220, 300)
      answered = True
    time.sleep(0.1)

  rounds = rounds + 1
  time.sleep(1)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Done!", 40, 40)
Lcd.drawString("Score: " + str(score) + "/10", 15, 70)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 400)',
  '[
    {"order": 1, "text": "First, make a list of the 5 vowels: A, E, I, O, U. Then pick a random letter from the whole alphabet and show it on screen. Can you find the ''random'' block in the Math category?"},
    {"order": 2, "text": "Inside your loop, use an ''if'' block to check which button was pressed. If Button A was pressed AND the letter is a vowel, that''s a correct answer! Add 1 to the score. Same idea for Button B and consonants."},
    {"order": 3, "text": "Check if the letter is a vowel by seeing if it''s in your vowels list. Show a green screen and happy beep for correct answers, red screen and low beep for wrong ones. After 10 rounds, show the final score!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0002-4000-8000-000000000001',
    '20000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Word Builder
-- Concept: Display 3 letters (C-A-T) blending together, press button to
--          reveal the word. Practice CVC blending.
-- Skills: Blending CVC Words, Consonant Sounds
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0003-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  3,
  'Word Builder',
  'Watch 3 letters slide together to build a word! Practice blending letter sounds like C-A-T into CAT.',
  'Okay, this is SO cool! Did you know that when you put letter sounds together, they make WORDS? Like when you say "cuh... aah... tuh" really fast, it becomes CAT! That''s called BLENDING, and it''s like a superpower for reading. Your M5Stick is going to show you 3 letters, one at a time. First you''ll see each letter by itself with its own sound. Then -- WHOOSH -- they slide together and make a whole word! Press Button A to blend the next word. We have C-A-T, D-O-G, B-U-S, H-A-T, and R-U-N. Five words to build! Ready to become a Word Builder? Let''s do it!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <field name="TEXT">Word Builder!</field>
        <field name="X">10</field>
        <field name="Y">60</field>
        <field name="COLOR">green</field>
      </block>
    </next>
  </block>
</xml>',
  'import time

words = [
  ["C", "A", "T"],
  ["D", "O", "G"],
  ["B", "U", "S"],
  ["H", "A", "T"],
  ["R", "U", "N"]
]

colors = [0xFF0000, 0x00FF00, 0x3B82F6]
word_index = 0

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x00FF00, 0x000000)
Lcd.drawString("Word Builder!", 10, 50)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Press A: start", 10, 80)

while True:
  if BtnA.isPressed():
    w = words[word_index]

    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(colors[0], 0x000000)
    Lcd.drawString(w[0], 20, 50)
    Speaker.tone(330, 200)
    time.sleep(0.8)

    Lcd.setTextColor(colors[1], 0x000000)
    Lcd.drawString(w[1], 55, 50)
    Speaker.tone(440, 200)
    time.sleep(0.8)

    Lcd.setTextColor(colors[2], 0x000000)
    Lcd.drawString(w[2], 90, 50)
    Speaker.tone(550, 200)
    time.sleep(1)

    Lcd.fillScreen(0x000044)
    Lcd.setTextColor(0xFFFF00, 0x000044)
    full_word = w[0] + w[1] + w[2]
    Lcd.drawString(full_word, 35, 40)
    Lcd.setTextColor(0xFFFFFF, 0x000044)
    Lcd.drawString(">> " + full_word + "! <<", 20, 75)
    Speaker.tone(660, 150)
    time.sleep(0.15)
    Speaker.tone(880, 300)
    time.sleep(1.5)

    word_index = word_index + 1
    if word_index >= 5:
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x00FF00, 0x003300)
      Lcd.drawString("All done!", 25, 40)
      Lcd.drawString("Great job!", 20, 70)
      Speaker.tone(523, 150)
      time.sleep(0.15)
      Speaker.tone(659, 150)
      time.sleep(0.15)
      Speaker.tone(784, 400)
      word_index = 0
      time.sleep(2)

    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Press A: next", 10, 60)
    time.sleep(0.3)

  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Start by making a list of words. Each word is 3 letters. Try showing the first letter on the left side of the screen, then wait a moment before showing the second letter in the middle."},
    {"order": 2, "text": "Show each of the 3 letters one at a time with a short pause and a beep between them. Use different colors for each letter so kids can see them separately. Then clear the screen and show all 3 letters together as one word!"},
    {"order": 3, "text": "Use a variable called ''word_index'' to track which word to show. Each time Button A is pressed, show the next word. After all 5 words, show a ''Great job!'' message with a happy tune, then reset word_index to 0 so it can loop again."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0003-4000-8000-000000000001',
    '20000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Sight Word Flash!
-- Concept: Flash sight words on screen like flashcards. Shake to shuffle.
-- Skills: Sight Words (Tier 1), Reading Comprehension
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0004-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  4,
  'Sight Word Flash!',
  'Flashcards on your M5Stick! See sight words like THE, AND, IS, IT, TO. Press Button A for next word. Shake to shuffle the order!',
  'Get ready for FLASHCARD FUN! There are some words that pop up ALL the time when you read books. Words like THE, AND, IS, IT, and TO. They''re called SIGHT WORDS because you want to know them by SIGHT -- zoom, you see it, you know it, no sounding out needed! Your M5Stick is going to become a super cool flashcard machine. Press Button A to flip to the next word. But here''s the really fun part -- if you SHAKE the M5Stick, it SHUFFLES all the words into a new random order! It''s like a magic trick! How fast can you read all the words? Ready, set, READ!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <field name="TEXT">Sight Words!</field>
        <field name="X">10</field>
        <field name="Y">30</field>
        <field name="COLOR">yellow</field>
      </block>
    </next>
  </block>
</xml>',
  'import time
import random

words = ["the", "and", "is", "it", "to",
         "in", "he", "was", "for", "on"]
index = 0

bg_colors = [0x000044, 0x004400, 0x440000, 0x440044, 0x004444,
             0x444400, 0x002244, 0x220044, 0x442200, 0x004422]

def show_word():
  Lcd.fillScreen(bg_colors[index])
  Lcd.setTextColor(0xFFFFFF, bg_colors[index])
  Lcd.drawString(str(index + 1) + "/10", 5, 5)
  Lcd.setTextColor(0xFFFF00, bg_colors[index])
  Lcd.drawString(words[index], 30, 50)
  Lcd.setTextColor(0xFFFFFF, bg_colors[index])
  Lcd.drawString("A=Next Shake=Mix", 2, 120)

show_word()

while True:
  if BtnA.isPressed():
    index = index + 1
    if index >= 10:
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x00FF00, 0x003300)
      Lcd.drawString("You read", 25, 40)
      Lcd.drawString("all 10!", 30, 65)
      Speaker.tone(523, 150)
      time.sleep(0.15)
      Speaker.tone(659, 150)
      time.sleep(0.15)
      Speaker.tone(784, 400)
      time.sleep(2)
      index = 0
    show_word()
    Speaker.tone(600, 100)
    time.sleep(0.3)

  accel = Imu.getAccel()
  shake = abs(accel[0]) + abs(accel[1]) + abs(accel[2])
  if shake > 2.5:
    for i in range(9, 0, -1):
      j = random.randint(0, i)
      words[i], words[j] = words[j], words[i]
    index = 0
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF00FF, 0x000000)
    Lcd.drawString("Shuffled!", 25, 55)
    Speaker.tone(440, 100)
    time.sleep(0.1)
    Speaker.tone(660, 100)
    time.sleep(0.1)
    Speaker.tone(880, 100)
    time.sleep(0.8)
    show_word()

  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Start by making a list of sight words like ''the'', ''and'', ''is'', ''it'', ''to''. Use a variable called ''index'' to remember which word you are showing. Display the current word nice and big on screen!"},
    {"order": 2, "text": "Put a ''forever'' loop that checks if Button A was pressed. When it is, add 1 to the index and show the next word. When you reach the end of the list, show a ''great job'' message and go back to the beginning."},
    {"order": 3, "text": "For the shuffle: read the accelerometer with ''get acceleration''. Add up the x, y, and z values. If the total is more than 2.5, that means a shake! When shaken, mix up the word order using random swaps, reset the index to 0, show ''Shuffled!'' briefly, then show the first word in the new order."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0004-4000-8000-000000000001',
    '20000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,imu}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Rhyme Time!
-- Concept: Display a word and 3 options. Pick which ones rhyme. Multiple
--          rounds with scoring. Capstone lesson.
-- Skills: Rhyming Words, Word Families
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a2000001-0005-4000-8000-000000000001',
  '00000001-0002-4000-8000-000000000001',
  5,
  'Rhyme Time!',
  'A word appears with two choices. Which one rhymes? Press Button A or B to pick! Multiple rounds with a final score. Capstone reading lesson!',
  'Welcome to RHYME TIME -- the ultimate word game! Rhyming is when words sound the same at the end, like CAT and HAT, or FUN and RUN. Being good at rhyming is like having a SECRET CODE for reading because it helps you figure out new words super fast! Here''s how the game works: I''ll show you a word at the top of the screen. Then you''ll see TWO choices below it. One of them RHYMES with the top word, and one does NOT. Press Button A to pick the LEFT word, or Button B to pick the RIGHT word. You get 8 rounds, and I''ll keep score the whole time. Can you get a perfect score? I think you CAN! This is our biggest reading challenge yet. Let''s do this, word champion!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="m5_display_clear">
        <field name="COLOR">black</field>
      </block>
    </statement>
  </block>
</xml>',
  'import time
import random

rounds = [
  ["cat", "bat", "dog", 0],
  ["fun", "run", "big", 0],
  ["top", "hop", "red", 0],
  ["bed", "red", "cup", 0],
  ["pig", "dig", "sun", 0],
  ["man", "can", "hit", 0],
  ["pot", "hot", "web", 0],
  ["bug", "rug", "pen", 0]
]

for r in rounds:
  if random.randint(0, 1) == 1:
    r[1], r[2] = r[2], r[1]
    r[3] = 1

score = 0
current = 0

def show_round():
  r = rounds[current]
  Lcd.fillScreen(0x000022)
  Lcd.setTextColor(0xFFFF00, 0x000022)
  Lcd.drawString("Rhyme Time!", 20, 5)
  Lcd.setTextColor(0xFFFFFF, 0x000022)
  Lcd.drawString(str(current + 1) + "/8", 100, 5)

  Lcd.fillRect(20, 30, 95, 35, 0x000066)
  Lcd.setTextColor(0x00FFFF, 0x000066)
  Lcd.drawString(r[0], 45, 38)

  Lcd.fillRect(5, 85, 60, 30, 0x004400)
  Lcd.setTextColor(0x00FF00, 0x004400)
  Lcd.drawString(r[1], 15, 90)

  Lcd.fillRect(70, 85, 60, 30, 0x440000)
  Lcd.setTextColor(0xFF6666, 0x440000)
  Lcd.drawString(r[2], 80, 90)

  Lcd.setTextColor(0xFFFFFF, 0x000022)
  Lcd.drawString("A=Left  B=Right", 5, 125)

show_round()

while current < 8:
  r = rounds[current]
  correct_btn = r[3]

  if BtnA.isPressed():
    if correct_btn == 0:
      score = score + 1
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x00FF00, 0x003300)
      Lcd.drawString("Correct!", 25, 50)
      Lcd.drawString(r[0] + " + " + r[1], 20, 80)
      Speaker.tone(880, 200)
    else:
      Lcd.fillScreen(0x330000)
      Lcd.setTextColor(0xFF4444, 0x330000)
      Lcd.drawString("Not quite!", 20, 50)
      Lcd.drawString(r[0] + " + " + r[2], 20, 80)
      Speaker.tone(220, 300)
    current = current + 1
    time.sleep(1.2)
    if current < 8:
      show_round()
    time.sleep(0.3)

  if BtnB.isPressed():
    if correct_btn == 1:
      score = score + 1
      Lcd.fillScreen(0x003300)
      Lcd.setTextColor(0x00FF00, 0x003300)
      Lcd.drawString("Correct!", 25, 50)
      Lcd.drawString(r[0] + " + " + r[2], 20, 80)
      Speaker.tone(880, 200)
    else:
      Lcd.fillScreen(0x330000)
      Lcd.setTextColor(0xFF4444, 0x330000)
      Lcd.drawString("Not quite!", 20, 50)
      Lcd.drawString(r[0] + " + " + r[1], 20, 80)
      Speaker.tone(220, 300)
    current = current + 1
    time.sleep(1.2)
    if current < 8:
      show_round()
    time.sleep(0.3)

  time.sleep(0.1)

Lcd.fillScreen(0x000044)
Lcd.setTextColor(0xFFFF00, 0x000044)
Lcd.drawString("Rhyme Time!", 20, 15)
Lcd.setTextColor(0xFFFFFF, 0x000044)
Lcd.drawString("Score:", 35, 50)
Lcd.setTextColor(0x00FF00, 0x000044)
Lcd.drawString(str(score) + " / 8", 35, 75)
if score >= 7:
  Lcd.setTextColor(0xFFFF00, 0x000044)
  Lcd.drawString("AMAZING!", 30, 105)
elif score >= 5:
  Lcd.setTextColor(0x00FFFF, 0x000044)
  Lcd.drawString("Great job!", 25, 105)
else:
  Lcd.setTextColor(0xFFFFFF, 0x000044)
  Lcd.drawString("Keep trying!", 15, 105)
Speaker.tone(523, 150)
time.sleep(0.15)
Speaker.tone(659, 150)
time.sleep(0.15)
Speaker.tone(784, 150)
time.sleep(0.15)
Speaker.tone(1047, 400)',
  '[
    {"order": 1, "text": "Start by making a list of rounds. Each round has the main word, the rhyming word, and a non-rhyming word. Show the main word at the top of the screen and the two choices below it."},
    {"order": 2, "text": "Use a loop that checks for Button A or Button B presses. If the player picks the rhyming word, add 1 to the score, show a green ''Correct!'' screen and play a happy beep. If they pick wrong, show ''Not quite!'' and reveal the correct answer."},
    {"order": 3, "text": "Before the game starts, randomly swap the left and right choices so the rhyming word isn''t always on the same side. Use a variable to track which button (A or B) is the correct one. After all 8 rounds, show the final score and a different message for 7-8 (AMAZING!), 5-6 (Great job!), or less (Keep trying!)."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000002',
  ARRAY[
    '20000001-0005-4000-8000-000000000001',
    '20000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- =============================================================================
-- TinkerSchool -- Seed 5 Science Lessons for Band 1 (Explorer, Grade 1)
-- =============================================================================
-- Seeds 5 interactive science lessons that progress from shake-based sound
-- exploration to tilt-based measurement and observation. Designed for Cassidy
-- (age 7) using Blockly blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Science subject:      00000000-0000-4000-8000-000000000003
--   - Discovery Lab module: 00000001-0003-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Sound Shaker!
-- Concept: Shake the M5Stick to make sounds. Harder shake = louder/higher.
-- Skills: Sound and Vibration, Volume and Pitch
-- Difficulty: beginner (10 min)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0001-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  1,
  'Sound Shaker!',
  'Shake the M5Stick to make different sounds! Harder shaking makes higher and louder tones.',
  'Hey there, scientist! Chip has a super cool question for you -- did you know that ALL sounds come from things SHAKING? When you talk, tiny parts in your throat shake back and forth really fast. When you bang a drum, the top of the drum shakes! That shaking is called vibration. Your M5Stick has a special sensor inside that can feel when YOU shake it. So here is our experiment: let''s make the M5Stick play sounds when you shake it! If you shake it a LITTLE bit, it will make a low, quiet sound. If you shake it a LOT, it will make a high, loud sound -- just like how shaking something faster makes a higher sound! Ready to be a sound scientist? Let''s go!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="variables_set">
        <field name="VAR">shake</field>
      </block>
    </statement>
  </block>
</xml>',
  'import math
import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("Sound Shaker!", 10, 10)

while True:
  accel = Imu.getAccel()
  shake = math.sqrt(accel[0]**2 + accel[1]**2 + accel[2]**2)
  level = int(min(shake * 300, 2000))
  if shake > 1.2:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00FF00, 0x000000)
    Lcd.drawString("SHAKE!", 30, 60)
    Lcd.drawString("Pitch: " + str(level), 10, 100)
    Speaker.tone(level, 200)
    Power.setLed(255)
  else:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Shake me!", 20, 60)
    Lcd.drawString("Gentle...", 25, 100)
    Power.setLed(0)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "The ''shake'' variable needs a value! Look in the Sensors category for a block that reads the motion sensor. That tells us how much the M5Stick is moving."},
    {"order": 2, "text": "Add an ''if'' block inside the loop. If the shake number is BIG (greater than 1.2), play a sound! Use a ''play tone'' block from the Sound category. Try setting the frequency to the shake value times 300."},
    {"order": 3, "text": "Inside the ''if'' block: add ''clear display'', ''display text'' showing \"SHAKE!\", a ''play tone'' block, and ''set LED on''. In the ''else'' section: show \"Shake me!\" on screen and turn the LED off. Add a ''wait 0.1 seconds'' at the end so it runs smoothly."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0001-4000-8000-000000000001',
    '30000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,imu}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: High Low Explorer
-- Concept: Button A = high pitch, Button B = low pitch. Display frequency.
-- Skills: Volume and Pitch, Scientific Observation
-- Difficulty: beginner (10 min)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0002-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  2,
  'High Low Explorer',
  'Press buttons to explore high and low pitch sounds. See the frequency numbers change on screen!',
  'OK scientist, time for another experiment! You know how a baby bird makes a tiny high ''TWEET'' sound, but a big bear makes a deep low ''GROWL''? That''s because of something called PITCH. High pitch means things are vibrating super duper fast. Low pitch means things are vibrating slooowly. Your M5Stick has two buttons -- Button A on the front and Button B on the side. Let''s turn them into a pitch explorer! When you press Button A, you''ll hear a HIGH sound like a bird chirping. When you press Button B, you''ll hear a LOW sound like a bear growling. And the COOLEST part? The screen will show you the frequency number -- that''s the science word for how fast the sound is vibrating! Higher number means higher sound. Let''s explore!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="controls_if">
        <mutation elseif="0" else="0"></mutation>
      </block>
    </statement>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("High Low", 20, 10)
Lcd.drawString("Explorer!", 18, 30)

while True:
  if BtnA.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF0000, 0x000000)
    Lcd.drawString("HIGH Pitch!", 10, 40)
    Lcd.drawString("Freq: 880 Hz", 5, 70)
    Lcd.drawString("Fast vibrate!", 5, 100)
    Lcd.fillCircle(67, 170, 30, 0xFF0000)
    Speaker.tone(880, 300)
    time.sleep(0.3)
  elif BtnB.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x0000FF, 0x000000)
    Lcd.drawString("LOW Pitch!", 10, 40)
    Lcd.drawString("Freq: 220 Hz", 5, 70)
    Lcd.drawString("Slow vibrate!", 5, 100)
    Lcd.fillCircle(67, 170, 30, 0x0000FF)
    Speaker.tone(220, 300)
    time.sleep(0.3)
  else:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Press A or B", 5, 60)
    Lcd.drawString("A = HIGH", 20, 90)
    Lcd.drawString("B = LOW", 25, 110)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Find the ''button A pressed?'' block in the Sensors category. Drag it into the diamond shape on the ''if'' block. This checks if someone is pressing Button A!"},
    {"order": 2, "text": "Inside the ''if'' section, add a ''play tone'' block with frequency 880 for a HIGH sound. Then add a ''display text'' block to show \"HIGH Pitch!\" on screen. Click the gear icon on the ''if'' block to add an ''else if'' section for Button B with frequency 220."},
    {"order": 3, "text": "For Button A (high): set text color to red, display \"HIGH Pitch!\" and \"Freq: 880 Hz\", play tone at 880. For Button B (low): set text color to blue, display \"LOW Pitch!\" and \"Freq: 220 Hz\", play tone at 220. Add an ''else'' that shows \"Press A or B\". Don''t forget a short wait at the end!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0002-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,buttons}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Weather Station
-- Concept: Display weather icons, press buttons to record observations.
-- Skills: Weather Observation, Scientific Observation
-- Difficulty: intermediate (15 min)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0003-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  3,
  'Weather Station',
  'Build a weather station! Use buttons to record sunny, cloudy, or rainy weather with fun icons.',
  'Guess what, scientist? Real scientists look out the window every single day and write down what the weather is like. It''s called making an OBSERVATION -- that means paying really close attention and writing down what you see. Today we are going to build our very own weather station on the M5Stick! Here is how it works: you press Button A to switch between three kinds of weather -- sunny, cloudy, and rainy. Each one gets its own picture on the screen! A bright yellow circle for sunny, a grey puffy shape for cloudy, and blue lines for rainy. When you find the right weather, press Button B to RECORD it! The screen will save your observation just like a real weather journal. Scientists do this every day so they can see patterns -- like how it rains more in spring! Ready to observe the weather like a pro?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="variables_set" x="20" y="20">
    <field name="VAR">weather</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>
</xml>',
  'import time

weather = 0
names = ["Sunny", "Cloudy", "Rainy"]
recorded = ""

def draw_weather():
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xF97316, 0x000000)
  Lcd.drawString("Weather Station", 2, 5)
  if weather == 0:
    Lcd.fillCircle(67, 90, 30, 0xFFFF00)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("Sunny", 40, 135)
  elif weather == 1:
    Lcd.fillRect(27, 70, 80, 40, 0x808080)
    Lcd.fillCircle(37, 70, 20, 0x808080)
    Lcd.fillCircle(87, 70, 20, 0x808080)
    Lcd.fillCircle(62, 60, 22, 0x808080)
    Lcd.setTextColor(0xAAAAAA, 0x000000)
    Lcd.drawString("Cloudy", 35, 135)
  else:
    Lcd.fillRect(27, 60, 80, 30, 0x808080)
    Lcd.drawLine(40, 100, 35, 130, 0x3B82F6)
    Lcd.drawLine(55, 100, 50, 130, 0x3B82F6)
    Lcd.drawLine(70, 100, 65, 130, 0x3B82F6)
    Lcd.drawLine(85, 100, 80, 130, 0x3B82F6)
    Lcd.setTextColor(0x3B82F6, 0x000000)
    Lcd.drawString("Rainy", 40, 135)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A:Next  B:Save", 2, 160)
  if recorded != "":
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("Saved: " + recorded, 5, 185)

draw_weather()

while True:
  if BtnA.isPressed():
    weather = (weather + 1) % 3
    draw_weather()
    Speaker.tone(500, 100)
    time.sleep(0.3)
  if BtnB.isPressed():
    recorded = names[weather]
    draw_weather()
    Lcd.setTextColor(0x22C55E, 0x000000)
    Lcd.drawString("Recorded!", 25, 210)
    Speaker.tone(800, 100)
    time.sleep(0.1)
    Speaker.tone(1000, 100)
    time.sleep(0.5)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "The ''weather'' variable starts at 0 (which means sunny). You need to add a forever loop, and inside it check if Button A is pressed. When it is, change the weather number to the next one (0, 1, 2, then back to 0)."},
    {"order": 2, "text": "Use an ''if'' block to check each weather value. If weather is 0, draw a yellow circle for sun. If weather is 1, draw a grey rectangle for clouds. If weather is 2, draw blue lines for rain. Show the weather name as text too!"},
    {"order": 3, "text": "Add a second ''if'' block for Button B. When pressed, save the current weather name to a ''recorded'' variable and display \"Saved: Sunny\" (or Cloudy or Rainy) in green at the bottom. Play two quick beeps (800 then 1000) to celebrate! Don''t forget the button labels: \"A:Next  B:Save\"."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0006-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Day and Night
-- Concept: Tilt M5Stick to simulate sun moving. Right=day, Left=night.
-- Skills: Sky Patterns (Sun/Moon), Scientific Observation
-- Difficulty: intermediate (15 min)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0004-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  4,
  'Day and Night',
  'Tilt the M5Stick to make the sun rise and set! Watch the screen change from day to night.',
  'Hey scientist, here is something AMAZING -- did you know the reason we have day and night is because the Earth is always slowly spinning? When our side of Earth faces the sun, we get bright daytime. When our side spins away from the sun, it gets dark and we see the moon and stars! Today we are going to build a Day and Night simulator. Here is the fun part: YOUR M5Stick has a tilt sensor inside it! When you tilt it to the RIGHT, the sun will rise and the screen will turn bright yellow -- just like daytime! When you tilt it to the LEFT, the sun goes down and the screen turns dark blue with little stars twinkling. The LED on your M5Stick will even light up during the day and turn off at night, just like the real sun! Tilt it back and forth and watch the whole day happen in your hand!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="variables_set">
        <field name="VAR">tilt</field>
        <value name="VALUE">
          <block type="m5_read_imu">
            <field name="AXIS">X</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>',
  'import time
import random

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("Day & Night", 15, 10)
time.sleep(1)

while True:
  tilt = Imu.getAccel()[0]
  if tilt > 0.3:
    Lcd.fillScreen(0x87CEEB)
    Lcd.fillCircle(67, 50, 25, 0xFFFF00)
    for i in range(8):
      angle = i * 45
      import math
      dx = int(35 * math.cos(math.radians(angle)))
      dy = int(35 * math.sin(math.radians(angle)))
      Lcd.drawLine(67, 50, 67 + dx, 50 + dy, 0xFFFF00)
    Lcd.setTextColor(0x000000, 0x87CEEB)
    Lcd.drawString("Daytime!", 30, 110)
    Lcd.drawString("Sun is up!", 20, 140)
    Lcd.fillRect(0, 190, 135, 50, 0x22C55E)
    Power.setLed(200)
  elif tilt < -0.3:
    Lcd.fillScreen(0x000030)
    Lcd.fillCircle(90, 45, 20, 0xFFFFCC)
    Lcd.fillCircle(100, 38, 18, 0x000030)
    Lcd.fillCircle(20, 30, 1, 0xFFFFFF)
    Lcd.fillCircle(50, 20, 1, 0xFFFFFF)
    Lcd.fillCircle(110, 60, 1, 0xFFFFFF)
    Lcd.fillCircle(30, 70, 2, 0xFFFFFF)
    Lcd.fillCircle(80, 80, 1, 0xFFFFFF)
    Lcd.fillCircle(60, 55, 2, 0xFFFFFF)
    Lcd.setTextColor(0xFFFFFF, 0x000030)
    Lcd.drawString("Nighttime!", 22, 110)
    Lcd.drawString("Moon & stars!", 10, 140)
    Lcd.fillRect(0, 190, 135, 50, 0x001010)
    Power.setLed(0)
  else:
    Lcd.fillScreen(0xFFA500)
    Lcd.fillCircle(67, 80, 22, 0xFFFF00)
    Lcd.setTextColor(0x000000, 0xFFA500)
    Lcd.drawString("Sunset!", 35, 130)
    Lcd.drawString("Tilt me!", 30, 160)
    Power.setLed(100)
  time.sleep(0.15)',
  '[
    {"order": 1, "text": "The ''tilt'' variable already reads the X-axis of the motion sensor. Now add an ''if'' block below it (inside the loop). You need to check if tilt is greater than 0.3 for daytime!"},
    {"order": 2, "text": "When tilt > 0.3 (daytime): fill the screen light blue, draw a yellow circle for the sun, display \"Daytime!\" and turn the LED on. When tilt < -0.3 (nighttime): fill the screen dark blue, draw a crescent moon and white dots for stars, display \"Nighttime!\" and turn the LED off."},
    {"order": 3, "text": "Add an ''else'' section for when the tilt is in the middle (sunset). Fill the screen orange, draw a small sun, and show \"Sunset!\" text. Set the LED to medium brightness (100). Add a short wait (0.15 seconds) at the end of the loop. Try drawing sun rays with lines going outward from the sun circle!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-0007-4000-8000-000000000001',
    '30000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,led}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Tilt Thermometer
-- Concept: Tilt-based visual thermometer. Tilt up=hot(red), down=cool(blue).
-- Skills: Scientific Observation, Weather Observation
-- Difficulty: advanced (20 min)
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a3000001-0005-4000-8000-000000000001',
  '00000001-0003-4000-8000-000000000001',
  5,
  'Tilt Thermometer',
  'Build a thermometer that responds to tilt! Tilt up for hot, tilt down for cold, and watch the temperature change.',
  'Scientist, you are ready for your BIGGEST experiment yet! You know how a thermometer shows the temperature? When it''s hot outside, the red line goes UP. When it''s cold, it goes DOWN. Well, today we are going to build our very own thermometer on the M5Stick -- and it works with TILT! Here is the plan: when you tilt the M5Stick up (like pointing it at the ceiling), the temperature number goes UP and the screen turns RED because it''s getting hotter. When you tilt it down (pointing at the floor), the temperature goes DOWN and the screen turns BLUE because it''s getting cooler. You will see a real thermometer bar that fills up and down, and the exact temperature number on the screen. Real scientists use thermometers to measure temperature every day -- for weather reports, cooking, and even to check if you have a fever! The LED will glow bright when it''s hot and turn off when it''s cold. This is the most advanced science tool you have built yet. Let''s DO this!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="variables_set" x="20" y="20">
    <field name="VAR">temp</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">70</field>
      </block>
    </value>
    <next>
      <block type="controls_whileUntil">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </value>
        <statement name="DO">
          <block type="variables_set">
            <field name="VAR">tilt</field>
            <value name="VALUE">
              <block type="m5_read_imu">
                <field name="AXIS">Y</field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>',
  'import time

temp = 70

while True:
  tilt = Imu.getAccel()[1]
  temp = temp + tilt * 2
  if temp > 120:
    temp = 120
  if temp < 0:
    temp = 0
  temp_int = int(temp)
  bar_height = int((temp / 120) * 160)

  if temp > 85:
    bg = 0xFF0000
    fg = 0xFFFFFF
    bar_color = 0xFF4444
    label = "HOT!"
    led = 255
  elif temp > 60:
    bg = 0xFFA500
    fg = 0x000000
    bar_color = 0xFFAA00
    label = "Warm"
    led = 120
  elif temp > 35:
    bg = 0x00AA00
    fg = 0xFFFFFF
    bar_color = 0x00CC00
    label = "Cool"
    led = 40
  else:
    bg = 0x0000FF
    fg = 0xFFFFFF
    bar_color = 0x4444FF
    label = "COLD!"
    led = 0

  Lcd.fillScreen(bg)
  Lcd.fillRect(10, 10, 30, 160, 0x333333)
  Lcd.fillRect(10, 10 + (160 - bar_height), 30, bar_height, bar_color)
  Lcd.drawRect(10, 10, 30, 160, 0xFFFFFF)
  Lcd.fillCircle(25, 185, 18, bar_color)
  Lcd.drawCircle(25, 185, 18, 0xFFFFFF)
  Lcd.setTextColor(fg, bg)
  Lcd.drawString(str(temp_int) + " F", 55, 30)
  Lcd.drawString(label, 55, 70)
  Lcd.drawString("Tilt to", 55, 120)
  Lcd.drawString("change!", 55, 145)
  Power.setLed(led)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "You already have the ''temp'' variable starting at 70 and the ''tilt'' variable reading the sensor. Now add a math block to change temp: set temp to temp PLUS tilt times 2. This makes tilting up add to the temperature and tilting down subtract from it!"},
    {"order": 2, "text": "Add two ''if'' blocks to keep temp between 0 and 120 (so it doesn''t go crazy). Then draw the thermometer: use ''fill rectangle'' for the tube (tall and thin) and ''fill circle'' for the bulb at the bottom. Make the bar height depend on the temp value."},
    {"order": 3, "text": "Use ''if / else if / else'' to pick colors based on temperature: above 85 = red background with \"HOT!\" text and LED on bright (255). 60-85 = orange background with \"Warm\" text. 35-60 = green background with \"Cool\" text. Below 35 = blue background with \"COLD!\" text and LED off. Display the temperature number with ''display text'' using str(temp) + \" F\"."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000001-000a-4000-8000-000000000001',
    '30000001-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,led}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- =============================================================================
-- TinkerSchool -- Seed 5 Music Lessons for Band 1 (Sound Studio, Grade 1)
-- =============================================================================
-- Seeds 5 interactive music lessons that progress from playing simple notes
-- to composing a first melody. Designed for Cassidy (age 7) using Blockly
-- blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Music subject:       00000000-0000-4000-8000-000000000004
--   - Sound Studio module: 00000001-0004-4000-8000-000000000001
--
-- Note frequencies used (Hz):
--   C4=262, D4=294, E4=330, F4=349, G4=392, A4=440, B4=494, C5=523
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Do Re Mi!
-- Concept: Play the first 3 notes (C, D, E). Learn note names.
--          Display note names on screen as they play.
-- Difficulty: beginner
-- Skills: note_names, pitch_high_low
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0001-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  1,
  'Do Re Mi!',
  'Play your first 3 musical notes -- Do, Re, Mi -- on the M5Stick buzzer and see their names on screen!',
  'Hey Cassidy! Chip here, and guess what? Your M5Stick can play MUSIC! Real notes, just like a piano! Today we are going to learn the very first three notes that every musician learns: Do, Re, and Mi. Singers all over the world use these names! Do sounds like the starting note -- nice and steady. Re goes a tiny bit higher. And Mi goes even higher! Each note has a special number called a frequency. Do is 262, Re is 294, and Mi is 330. The bigger the number, the higher the sound goes! Let''s make your M5Stick sing its very first song. We will play each note AND show its name on the screen so you can see and hear the music at the same time. Ready to be a musician? Let''s go!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_buzzer_tone">
        <value name="FREQUENCY">
          <shadow type="math_number">
            <field name="NUM">262</field>
          </shadow>
        </value>
        <value name="DURATION">
          <shadow type="math_number">
            <field name="NUM">500</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)

Lcd.setTextColor(0xFF0000, 0x000000)
Lcd.drawString("DO", 50, 60)
Speaker.tone(262, 500)
time.sleep(0.6)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x00FF00, 0x000000)
Lcd.drawString("RE", 50, 60)
Speaker.tone(294, 500)
time.sleep(0.6)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x0000FF, 0x000000)
Lcd.drawString("MI", 50, 60)
Speaker.tone(330, 500)
time.sleep(0.6)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Do Re Mi!", 20, 60)',
  '[
    {"order": 1, "text": "You already have one note playing (262 = Do). Can you add a ''display text'' block BEFORE the tone to show the word \"DO\" on screen?"},
    {"order": 2, "text": "Now add a ''wait'' block after the first tone (0.6 seconds), then a ''clear display'', a ''display text'' that says \"RE\", and a ''play tone'' with 294. Do the same for Mi with 330!"},
    {"order": 3, "text": "Here is the full pattern for each note: clear screen, show the note name in a fun color, play the tone, then wait. Do = 262 (red), Re = 294 (green), Mi = 330 (blue). At the end, show \"Do Re Mi!\" in yellow!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0001-4000-8000-000000000001',
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
-- Lesson 2: High and Low
-- Concept: Use Button A for a HIGH note and Button B for a LOW note.
--          See which is which on screen. Explore pitch.
-- Difficulty: beginner
-- Skills: pitch_high_low, note_names
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0002-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  2,
  'High and Low',
  'Press Button A for a HIGH note and Button B for a LOW note. See and hear the difference between high and low pitch!',
  'Chip has a question for you! Have you ever noticed that some sounds are really high -- like a little bird singing -- and some sounds are really LOW -- like a big drum going BOOM? That is called PITCH! High pitch means the sound wiggles super fast, and low pitch means it wiggles nice and slow. Today we are going to turn your M5Stick into a pitch explorer! When you press Button A, it will play a HIGH note way up at the top -- like a tiny whistle. When you press Button B, it will play a LOW note way down at the bottom -- like a big bear growling! The screen will show you which one is playing with cool colors and big words. Press the buttons as fast as you want and listen to the difference. Can you hear how different they sound? Let''s find out!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="controls_if">
      </block>
    </statement>
  </block>
</xml>',
  'import time

while True:
  if BtnA.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00BFFF, 0x000000)
    Lcd.drawString("HIGH!", 40, 30)
    Lcd.fillCircle(67, 100, 25, 0x00BFFF)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("C5 = 523", 30, 150)
    Speaker.tone(523, 300)
    time.sleep(0.4)
  elif BtnB.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF4500, 0x000000)
    Lcd.drawString("LOW!", 45, 30)
    Lcd.fillCircle(67, 100, 40, 0xFF4500)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("C4 = 262", 30, 170)
    Speaker.tone(262, 300)
    time.sleep(0.4)
  time.sleep(0.05)',
  '[
    {"order": 1, "text": "Find the ''button A pressed?'' block in the Sensors category. Drag it into the diamond shape on the ''if'' block inside your loop."},
    {"order": 2, "text": "Inside the ''if'' section, add blocks to: clear the screen, show \"HIGH!\" in blue, and play a tone at 523. Then click the gear on the ''if'' block and add an ''else if'' for Button B with \"LOW!\" and tone 262."},
    {"order": 3, "text": "For Button A (high): clear screen, set text color to blue, draw \"HIGH!\", draw a small circle, show \"C5 = 523\", play tone 523. For Button B (low): clear screen, set text color to orange-red, draw \"LOW!\", draw a bigger circle, show \"C4 = 262\", play tone 262. The big circle for low and small circle for high helps you SEE the difference too!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0002-4000-8000-000000000001',
    '40000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,buttons}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Beat Keeper
-- Concept: Play a steady beat using the buzzer. Display a visual
--          metronome (flashing circle). Count beats.
-- Difficulty: intermediate
-- Skills: steady_beat, tempo_fast_slow
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0003-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  3,
  'Beat Keeper',
  'Build a visual metronome! The M5Stick plays a steady beat while a circle flashes and counts each beat for you.',
  'Clap your hands -- clap, clap, clap, clap! Did you keep them all the same speed? That is called a STEADY BEAT, and it is one of the most important things in ALL of music! Every single song you have ever heard has a beat -- it is like the heartbeat of the music. Drummers, dancers, and singers all need to keep a steady beat. Today we are going to build a METRONOME. That is a fancy word for a beat-keeping machine! Your M5Stick will play a tick sound over and over at the exact same speed. AND it will show a big circle that blinks with every beat, plus a number that counts up so you can see how many beats have gone by. Tick, tick, tick, tick -- perfectly even, like a clock! Can you clap along with your metronome? Let''s build it and find out!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="variables_set" x="20" y="20">
    <field name="VAR">beat</field>
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
    <next>
      <block type="controls_whileUntil">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_boolean">
            <field name="BOOL">TRUE</field>
          </block>
        </value>
      </block>
    </next>
  </block>
</xml>',
  'import time

beat = 0

while True:
  beat = beat + 1

  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Beat Keeper", 15, 10)

  Lcd.fillCircle(67, 100, 30, 0xF97316)
  Lcd.setTextColor(0xFFFFFF, 0xF97316)
  Lcd.drawString(str(beat), 58, 90)

  Speaker.tone(800, 60)
  Power.setLed(200)
  time.sleep(0.15)

  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Beat Keeper", 15, 10)
  Lcd.drawCircle(67, 100, 30, 0xF97316)
  Lcd.setTextColor(0xF97316, 0x000000)
  Lcd.drawString(str(beat), 58, 90)
  Power.setLed(0)

  time.sleep(0.35)

  if beat >= 99:
    beat = 0',
  '[
    {"order": 1, "text": "The beat counter variable is ready. Inside the loop, first add 1 to beat (use a ''change variable'' block). Then add a ''clear display'' block and show the beat number on screen."},
    {"order": 2, "text": "After showing the number, add a ''draw filled circle'' in the center of the screen and a ''play tone'' (try 800 Hz for 60ms -- a short tick!). Then add a ''wait'' block (0.15 seconds), clear the screen again, draw an empty circle, and wait 0.35 seconds. This makes the circle flash!"},
    {"order": 3, "text": "Full pattern inside the loop: add 1 to beat, clear screen, draw title \"Beat Keeper\", draw a filled orange circle at (67,100) with radius 30, show the beat number inside it, play tone 800 for 60ms, turn LED on, wait 0.15s. Then clear screen, draw title again, draw an outline circle (same spot), show beat number, turn LED off, wait 0.35s. Reset beat to 0 when it hits 99."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0003-4000-8000-000000000001',
    '40000001-0005-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,led}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Pattern Player
-- Concept: Play a 4-note repeating pattern (C-E-C-E). Display the
--          pattern visually. Recognize musical patterns.
-- Difficulty: intermediate
-- Skills: pattern_recognition_music, rhythm_notation
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0004-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  4,
  'Pattern Player',
  'Discover musical patterns! Play a repeating 4-note pattern and watch it light up on screen like a mini piano roll.',
  'Chip LOVES patterns! Patterns are everywhere -- stripes on a shirt (red, blue, red, blue), days of the week that repeat, and guess what? Music is FULL of patterns too! When you listen to your favorite song, some parts repeat over and over -- that is a musical pattern! Today we are going to build a Pattern Player. We will pick 4 notes -- Do, Mi, Do, Mi -- and play them in a loop so they repeat like a musical merry-go-round! But here is the really cool part: your M5Stick will show each note as a colored bar on the screen, like a tiny piano roll scrolling by. You will be able to SEE the pattern and HEAR the pattern at the same time! Do is low, Mi is higher, Do is low again, Mi is higher again -- see the pattern? Low, high, low, high! After that, you can try making your own pattern. What about Do, Re, Mi, Re? Or Mi, Mi, Do, Do? The choice is yours!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_buzzer_tone">
        <value name="FREQUENCY">
          <shadow type="math_number">
            <field name="NUM">262</field>
          </shadow>
        </value>
        <value name="DURATION">
          <shadow type="math_number">
            <field name="NUM">400</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>',
  'import time

notes = [
  {"name": "Do", "freq": 262, "color": 0xFF0000, "y": 160},
  {"name": "Mi", "freq": 330, "color": 0x00FF00, "y": 100},
  {"name": "Do", "freq": 262, "color": 0xFF0000, "y": 160},
  {"name": "Mi", "freq": 330, "color": 0x00FF00, "y": 100},
]

for r in range(3):
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Pattern Player", 5, 5)

  for i, note in enumerate(notes):
    x = 10 + i * 32
    Lcd.fillRect(x, note["y"], 28, 40, note["color"])
    Lcd.setTextColor(0xFFFFFF, note["color"])
    Lcd.drawString(note["name"], x + 2, note["y"] + 12)

    Lcd.drawRect(x, note["y"], 28, 40, 0xFFFFFF)
    Speaker.tone(note["freq"], 400)
    time.sleep(0.5)

    Lcd.drawRect(x, note["y"], 28, 40, note["color"])

  time.sleep(0.3)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("Pattern!", 30, 60)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Do Mi Do Mi", 15, 100)
Speaker.tone(392, 600)',
  '[
    {"order": 1, "text": "You have one note (Do = 262) already. Add a wait block (0.5 seconds), then add another tone block for Mi (330). Then add Do and Mi again. That is your pattern: Do, Mi, Do, Mi!"},
    {"order": 2, "text": "Before each tone, add a ''draw filled rectangle'' to show a colored bar. Use red for Do and green for Mi. Put Do bars lower on screen (y=160) and Mi bars higher (y=100) so you can SEE the pitch difference!"},
    {"order": 3, "text": "Full pattern: clear screen, draw title. For each of the 4 notes: draw a colored rectangle (red Do at y=160, green Mi at y=100), show the note name inside it, play the tone for 400ms, wait 0.5s. Put it all inside a repeat loop (3 times) so the pattern keeps going! At the end, show \"Pattern! Do Mi Do Mi\" on screen."}
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
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: My First Song
-- Concept: Compose and play a simple 8-note melody using notes learned.
--          Display each note. Capstone lesson.
-- Difficulty: advanced
-- Skills: simple_composition, performance
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a4000001-0005-4000-8000-000000000001',
  '00000001-0004-4000-8000-000000000001',
  5,
  'My First Song',
  'Compose your very own 8-note melody! Pick your notes, watch them play on a colorful music staff, and perform your first song!',
  'This is it, Cassidy -- the BIG moment! You have learned note names, high and low pitch, steady beats, and musical patterns. Now it is time to put it ALL together and write YOUR VERY OWN SONG! A real composer picks notes, puts them in order, and creates something brand new that nobody has ever heard before. That is exactly what YOU are going to do today! You get to pick 8 notes for your melody. You can use any notes you have learned: Do (262), Re (294), Mi (330), Fa (349), Sol (392) -- that is FIVE different notes to choose from! You could go up like stairs: Do Re Mi Fa Sol. You could go up and down like a roller coaster: Do Mi Sol Mi Do. You could repeat notes like a heartbeat: Do Do Mi Mi Sol Sol Mi Mi. There is no wrong answer -- it is YOUR song, and it is going to be AMAZING! Your M5Stick will show each note on a colorful music display as it plays, with the note name and a star that moves to show where you are in the song. When the song finishes, you will see a celebration screen! Ready to be a composer? Let''s write your first masterpiece!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_buzzer_tone">
        <value name="FREQUENCY">
          <shadow type="math_number">
            <field name="NUM">262</field>
          </shadow>
        </value>
        <value name="DURATION">
          <shadow type="math_number">
            <field name="NUM">400</field>
          </shadow>
        </value>
        <next>
          <block type="m5_wait">
            <value name="SECONDS">
              <shadow type="math_number">
                <field name="NUM">0.5</field>
              </shadow>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>',
  'import time

melody = [
  {"name": "Do",  "freq": 262, "color": 0xFF0000},
  {"name": "Re",  "freq": 294, "color": 0xFF8800},
  {"name": "Mi",  "freq": 330, "color": 0xFFFF00},
  {"name": "Fa",  "freq": 349, "color": 0x00FF00},
  {"name": "Sol", "freq": 392, "color": 0x00BFFF},
  {"name": "Mi",  "freq": 330, "color": 0xFFFF00},
  {"name": "Re",  "freq": 294, "color": 0xFF8800},
  {"name": "Do",  "freq": 262, "color": 0xFF0000},
]

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xF97316, 0x000000)
Lcd.drawString("My First Song", 10, 5)
time.sleep(1)

for i, note in enumerate(melody):
  Lcd.fillScreen(0x000000)

  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("My First Song", 10, 5)

  bar_w = 135 // 8
  for j in range(8):
    bx = j * bar_w
    if j < i:
      Lcd.fillRect(bx, 220, bar_w - 1, 18, 0x444444)
    elif j == i:
      Lcd.fillRect(bx, 220, bar_w - 1, 18, 0xF97316)
    else:
      Lcd.fillRect(bx, 220, bar_w - 1, 18, 0x222222)

  Lcd.fillCircle(67, 110, 40, note["color"])

  Lcd.setTextColor(0x000000, note["color"])
  Lcd.drawString(note["name"], 48, 100)

  num = str(i + 1) + "/8"
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString(num, 50, 30)

  Speaker.tone(note["freq"], 400)
  Power.setLed(150)
  time.sleep(0.2)
  Power.setLed(0)
  time.sleep(0.35)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Bravo!", 35, 50)
Lcd.fillCircle(35, 120, 8, 0xF97316)
Lcd.fillCircle(67, 105, 12, 0xFF0000)
Lcd.fillCircle(100, 120, 8, 0x00FF00)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Great song!", 20, 160)
Speaker.tone(523, 200)
time.sleep(0.2)
Speaker.tone(659, 200)
time.sleep(0.2)
Speaker.tone(784, 500)
time.sleep(1)',
  '[
    {"order": 1, "text": "You have the first note (Do = 262) and a wait block. Now add more ''play tone'' and ''wait'' blocks for the rest of your 8-note melody. Try going up: Re (294), Mi (330), Fa (349), Sol (392)!"},
    {"order": 2, "text": "Before each tone block, add a ''clear display'' and a ''display text'' block to show the note name in a different color. Try making each note a different color like a rainbow! Add a progress counter (like \"3/8\") so you know where you are in the song."},
    {"order": 3, "text": "Here is one great melody to try: Do(262), Re(294), Mi(330), Fa(349), Sol(392), Mi(330), Re(294), Do(262) -- it goes up like stairs and back down! For each note: clear screen, show the title, draw a progress bar at the bottom, draw a big colored circle in the center with the note name, show the count (like \"5/8\"), play the tone for 400ms, flash the LED, wait 0.55s total. At the end, show \"Bravo!\" with colorful circles and play a celebration chord (523, 659, 784)!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000001-0007-4000-8000-000000000001',
    '40000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,led}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- =============================================================================
-- TinkerSchool -- Seed 5 Art Lessons for Band 1 (Explorer, Grade 1)
-- =============================================================================
-- Seeds 5 interactive art lessons that progress from simple pixel drawing
-- to multi-frame animation. Designed for Cassidy (age 7) using Blockly
-- blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Art subject:        00000000-0000-4000-8000-000000000005
--   - Pixel Studio module: 00000001-0005-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Pixel Power!
-- Concept: Draw colored squares (pixels) on the screen using fillRect.
--          Understand what pixels are.
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0001-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  1,
  'Pixel Power!',
  'Draw colored squares on the M5Stick screen and discover what pixels are!',
  'Hey there, artist! Chip here, and I have a SUPER cool secret to share. You know those amazing pictures you see on screens -- like games, cartoons, and photos? They''re ALL made of teeny tiny colored squares called PIXELS! Your M5Stick screen has thousands of them. Today we get to paint our own pixels by telling the screen exactly where to put colored squares. We''ll pick a color, pick a spot, and BOOM -- pixel art! It''s like painting with a magic robot brush. Ready to make your first pixel masterpiece? Let''s go!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.fillRect(20, 30, 20, 20, 0xFF0000)
Lcd.fillRect(50, 30, 20, 20, 0x00FF00)
Lcd.fillRect(80, 30, 20, 20, 0x0000FF)
Lcd.fillRect(20, 60, 20, 20, 0xFFFF00)
Lcd.fillRect(50, 60, 20, 20, 0xFF00FF)
Lcd.fillRect(80, 60, 20, 20, 0x00FFFF)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Pixel Power!", 15, 100)',
  '[
    {"order": 1, "text": "Look in the Display category for a block that draws a filled rectangle. That''s how we make a pixel on screen!"},
    {"order": 2, "text": "Drag a ''fill rectangle'' block below the ''clear display'' block. Set x to 20, y to 30, width to 20, height to 20, and pick a bright color like red."},
    {"order": 3, "text": "Add more ''fill rectangle'' blocks for more pixels! Try x=50 and x=80 to put them side by side. Change the y to 60 for a second row. Pick a different color for each one -- red, green, blue, yellow!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0001-4000-8000-000000000001',
    '50000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: Shape Garden
-- Concept: Draw circles, rectangles, and lines to create a garden scene.
--          Combine shapes into art.
-- Difficulty: beginner
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0002-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  2,
  'Shape Garden',
  'Combine circles, rectangles, and lines to draw a garden scene on the screen!',
  'Chip is dreaming of a beautiful garden! Did you know that EVERYTHING you draw is made of simple shapes? A flower is just a circle with a line underneath. A tree is a circle on top of a rectangle. The sun is a big yellow circle! Today we''re going to be garden artists. We''ll use circles for flowers and the sun, rectangles for stems and the ground, and lines for grass. Your M5Stick is like a tiny canvas, and shapes are your paintbrush. What kind of garden will YOU grow? Let''s find out!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.fillCircle(100, 30, 18, 0xFFFF00)
Lcd.fillRect(0, 200, 135, 40, 0x006400)
Lcd.fillRect(30, 140, 6, 60, 0x008000)
Lcd.fillCircle(33, 130, 15, 0xFF0000)
Lcd.fillRect(80, 150, 6, 50, 0x008000)
Lcd.fillCircle(83, 140, 12, 0xFF69B4)
Lcd.drawLine(55, 200, 65, 180, 0x00FF00)
Lcd.drawLine(65, 200, 55, 180, 0x00FF00)',
  '[
    {"order": 1, "text": "Start by making the sky! After the ''clear display'' block, try drawing a yellow circle for the sun. Look for the ''fill circle'' block in the Display category."},
    {"order": 2, "text": "Add a green rectangle at the bottom of the screen for the ground. Set y to 200, width to 135, and height to 40. Then draw a thin rectangle for a flower stem -- try width=6 and a green color."},
    {"order": 3, "text": "Put a colored circle on top of each stem for the flower head! Try a red circle at x=33, y=130, radius=15 for the first flower. Add a second flower with a pink circle at x=83, y=140. You can also add grass blades using the ''draw line'' block!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0003-4000-8000-000000000001',
    '50000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  12,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Rainbow Stripes
-- Concept: Draw horizontal stripes in rainbow colors. Learn about
--          patterns and color order.
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0003-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  3,
  'Rainbow Stripes',
  'Paint rainbow stripes across the screen! Learn about color patterns and the order of the rainbow.',
  'Guess what, artist? Chip just saw a rainbow after the rain and it was SO PRETTY! Did you know that rainbows always have their colors in the SAME order? Red, orange, yellow, green, blue, and purple -- every single time! That''s called a PATTERN. A pattern is when things repeat in the same order. Today we''re going to paint a rainbow right on our M5Stick screen! Each stripe will be a different color, going from top to bottom. Think of each stripe as a wide rectangle that stretches all the way across. We need SIX stripes for six rainbow colors. Can you figure out the pattern?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_fill_rect">
        <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
        <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
        <value name="W"><shadow type="math_number"><field name="NUM">135</field></shadow></value>
        <value name="H"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
        <field name="COLOR">red</field>
      </block>
    </next>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.fillRect(0, 0, 135, 40, 0xFF0000)
Lcd.fillRect(0, 40, 135, 40, 0xFF8C00)
Lcd.fillRect(0, 80, 135, 40, 0xFFFF00)
Lcd.fillRect(0, 120, 135, 40, 0x00FF00)
Lcd.fillRect(0, 160, 135, 40, 0x0000FF)
Lcd.fillRect(0, 200, 135, 40, 0x8B00FF)
Lcd.setTextColor(0xFFFFFF, 0x0000FF)
Lcd.drawString("Rainbow!", 30, 170)',
  '[
    {"order": 1, "text": "You already have the first red stripe! It goes from left to right (width 135) and is 40 pixels tall. Add another ''fill rectangle'' block for the next color -- orange!"},
    {"order": 2, "text": "Each stripe starts where the last one ended. The first stripe has y=0, so the second stripe should have y=40, the third y=80, and so on. Keep the width at 135 and height at 40 for each one."},
    {"order": 3, "text": "The rainbow order is: Red (0xFF0000), Orange (0xFF8C00), Yellow (0xFFFF00), Green (0x00FF00), Blue (0x0000FF), Purple (0x8B00FF). Add all six stripes! You can also add a ''display text'' block at the end to label your rainbow."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0004-4000-8000-000000000001',
    '50000001-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Mirror Art
-- Concept: Draw a design on the left half, then mirror it on the right.
--          Explore symmetry.
-- Difficulty: intermediate
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0004-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  4,
  'Mirror Art',
  'Create a symmetrical design -- whatever you draw on the left, mirror it on the right!',
  'Chip just discovered something AMAZING! Look at a butterfly -- the left side looks EXACTLY like the right side, just flipped! That''s called SYMMETRY. You can find symmetry everywhere: in faces, snowflakes, hearts, and even buildings! Today we''re going to make Mirror Art. Here''s the trick: the middle of our screen is at x=67. When you draw something on the LEFT side, you need to draw the SAME thing on the RIGHT side, at the same distance from the middle. If you put a red square at x=20 on the left, you mirror it at x=114 on the right. It''s like the screen has an invisible mirror down the middle! Ready to make some symmetrical pixel art?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_draw_line">
        <value name="X1"><shadow type="math_number"><field name="NUM">67</field></shadow></value>
        <value name="Y1"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
        <value name="X2"><shadow type="math_number"><field name="NUM">67</field></shadow></value>
        <value name="Y2"><shadow type="math_number"><field name="NUM">240</field></shadow></value>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.drawLine(67, 0, 67, 240, 0x444444)
Lcd.fillRect(15, 30, 20, 20, 0xFF0000)
Lcd.fillRect(100, 30, 20, 20, 0xFF0000)
Lcd.fillCircle(25, 80, 12, 0x00FF00)
Lcd.fillCircle(110, 80, 12, 0x00FF00)
Lcd.fillRect(10, 110, 25, 15, 0x0000FF)
Lcd.fillRect(100, 110, 25, 15, 0x0000FF)
Lcd.fillCircle(25, 150, 8, 0xFFFF00)
Lcd.fillCircle(110, 150, 8, 0xFFFF00)
Lcd.fillRect(20, 180, 15, 15, 0xFF00FF)
Lcd.fillRect(100, 180, 15, 15, 0xFF00FF)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Symmetry!", 25, 220)',
  '[
    {"order": 1, "text": "The mirror line is already drawn down the middle of the screen. Now add a colored shape on the LEFT side -- try a red square with x=15 and y=30."},
    {"order": 2, "text": "To mirror your red square on the right side, think about distance from the middle line (x=67). The left square at x=15 is 52 pixels from the middle, so the right square goes at x=100. Same y, same size, same color!"},
    {"order": 3, "text": "Keep adding pairs of matching shapes! Try a green circle on the left at x=25, y=80, then mirror it at x=110, y=80. Add blue rectangles, yellow circles -- make sure every shape on the left has a twin on the right!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0005-4000-8000-000000000001',
    '50000001-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  18,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Tiny Animation
-- Concept: Create a simple 3-frame animation (smiley face changing
--          expressions) using a loop. Capstone lesson.
-- Difficulty: advanced
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a5000001-0005-4000-8000-000000000001',
  '00000001-0005-4000-8000-000000000001',
  5,
  'Tiny Animation',
  'Create a 3-frame animation of a smiley face that changes expressions -- your first cartoon!',
  'Oh WOW, are you ready for something REALLY cool? We''re going to make a CARTOON! You know how cartoons on TV look like they''re moving? Here''s the secret: they''re just lots of pictures shown really fast, one after another! Each picture is called a FRAME. When you flip through frames quickly, it looks like magic -- things seem to MOVE! Today we''re going to draw THREE frames of a smiley face. Frame 1: a happy face. Frame 2: a surprised face. Frame 3: a silly face with its tongue out! We show each frame, wait a moment, then show the next one. And we put it all in a LOOP so it keeps going forever -- just like a real cartoon! This is your BIGGEST art project yet. You''ve got this!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO">
      <block type="m5_display_clear">
        <field name="COLOR">black</field>
      </block>
    </statement>
  </block>
</xml>',
  'import time

while True:
  Lcd.fillScreen(0x000000)
  Lcd.fillCircle(67, 100, 50, 0xFFFF00)
  Lcd.fillCircle(50, 85, 6, 0x000000)
  Lcd.fillCircle(84, 85, 6, 0x000000)
  Lcd.fillRect(45, 115, 44, 4, 0x000000)
  Lcd.fillRect(89, 108, 4, 11, 0x000000)
  Lcd.fillRect(45, 108, 4, 11, 0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Happy!", 40, 10)
  time.sleep(1)

  Lcd.fillScreen(0x000000)
  Lcd.fillCircle(67, 100, 50, 0xFFFF00)
  Lcd.fillCircle(50, 82, 8, 0x000000)
  Lcd.fillCircle(84, 82, 8, 0x000000)
  Lcd.fillCircle(67, 120, 12, 0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Surprised!", 25, 10)
  time.sleep(1)

  Lcd.fillScreen(0x000000)
  Lcd.fillCircle(67, 100, 50, 0xFFFF00)
  Lcd.fillCircle(50, 85, 6, 0x000000)
  Lcd.fillCircle(84, 85, 6, 0x000000)
  Lcd.fillRect(45, 115, 44, 4, 0x000000)
  Lcd.fillRect(60, 119, 14, 10, 0xFF0000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("Silly!", 43, 10)
  time.sleep(1)',
  '[
    {"order": 1, "text": "Inside the loop, after ''clear display'', draw a yellow circle for the face. Then add two small black circles for eyes and a rectangle for the mouth. That''s Frame 1 -- the happy face!"},
    {"order": 2, "text": "After your happy face, add a ''wait'' block (1 second). Then add another ''clear display'' and draw the face AGAIN -- but this time make the eyes bigger circles and the mouth a round ''O'' shape (use a circle instead of a rectangle). That''s Frame 2 -- the surprised face!"},
    {"order": 3, "text": "After another ''wait'' block, clear the screen and draw Frame 3 -- the silly face. Use the same face and eyes as Frame 1, but add a small red rectangle below the mouth for a tongue sticking out. Add a final ''wait'' block. The loop will make all three faces repeat like a cartoon!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000001-0007-4000-8000-000000000001',
    '50000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
-- =============================================================================
-- TinkerSchool -- Seed 5 Problem Solving Lessons for Band 1 (Explorer, Grade 1)
-- =============================================================================
-- Seeds 5 interactive problem solving lessons that progress from simple pattern
-- recognition to multi-step treasure navigation. Designed for Cassidy (age 7)
-- using Blockly blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Problem Solving subject: 00000000-0000-4000-8000-000000000006
--   - Puzzle Lab module:       00000001-0006-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Color Pattern!
-- Concept: Recognize an AB-pattern of colors and predict what comes next.
-- Skills: Pattern Recognition, Event Sequencing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0001-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  1,
  'Color Pattern!',
  'Spot the pattern! Watch colors appear and press the right button to guess what comes next.',
  'Hey there, friend! Chip has been painting stripes on the screen -- red, blue, red, blue -- and it is SO MUCH FUN! But oh no, Chip ran out of paint for the last stripe! Can YOU figure out which color comes next? Here is how it works: watch the pattern carefully, then press Button A if you think the next color is RED, or press Button B if you think it is BLUE. Patterns are everywhere -- in rainbows, in songs, even in the way you walk (left, right, left, right). Let''s see how good your pattern eyes are! Ready? Let''s GO!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Color Pattern!", 10, 10)

colors = [0xFF0000, 0x0000FF, 0xFF0000, 0x0000FF]
names = ["RED", "BLUE", "RED", "BLUE"]
y = 40

for i in range(4):
  Lcd.fillRect(10 + i * 30, y, 25, 25, colors[i])
  time.sleep(0.5)

Lcd.fillRect(10 + 4 * 30, y, 25, 25, 0x444444)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("A=RED  B=BLUE", 10, 80)
Lcd.drawString("What comes next?", 10, 100)

answer = 0xFF0000
while True:
  if BtnA.isPressed():
    Lcd.fillRect(10 + 4 * 30, y, 25, 25, 0xFF0000)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00FF00, 0x000000)
    Lcd.drawString("YES! It is RED!", 10, 60)
    Lcd.drawString("Great pattern", 10, 80)
    Lcd.drawString("thinking!", 10, 100)
    Speaker.tone(880, 300)
    time.sleep(0.3)
    Speaker.tone(1100, 400)
    break
  if BtnB.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF6600, 0x000000)
    Lcd.drawString("Hmm, try again!", 10, 60)
    Lcd.drawString("Look: R B R B ?", 10, 80)
    Speaker.tone(200, 300)
    time.sleep(1)
    Lcd.fillScreen(0x000000)
    for i in range(4):
      Lcd.fillRect(10 + i * 30, y, 25, 25, colors[i])
    Lcd.fillRect(10 + 4 * 30, y, 25, 25, 0x444444)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("A=RED  B=BLUE", 10, 80)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Look at the colored boxes on the screen. Do you see a pattern? Which two colors keep taking turns?"},
    {"order": 2, "text": "The pattern goes: red, blue, red, blue. So the colors are taking turns! What color had a turn first? That same color should come back next."},
    {"order": 3, "text": "The answer is RED! Press Button A for red. The pattern is red, blue, red, blue, RED -- it keeps repeating like a song!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0001-4000-8000-000000000001',
    '60000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: What Comes Next?
-- Concept: Sequence of growing shapes -- find the missing item.
-- Skills: Event Sequencing, Pattern Recognition
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0002-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  2,
  'What Comes Next?',
  'Circles are growing! Figure out how big the next one should be and press the right button.',
  'Chip is blowing bubbles today! Look at the screen -- there is a tiny bubble, then a medium bubble, then a bigger bubble. They keep getting BIGGER! But the last bubble popped before Chip could see it. Can you figure out how big it should be? Things that grow follow a pattern, just like how you get a little bit taller every year! Watch the sizes carefully, then press Button A if the next bubble should be BIG or Button B if it should be SMALL. Think about it -- are the bubbles getting bigger or smaller? You are a pattern detective! Let''s solve this mystery!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("What Comes Next?", 5, 5)

sizes = [8, 16, 24]
x_pos = [25, 55, 95]

for i in range(3):
  Lcd.fillCircle(x_pos[i], 70, sizes[i], 0x00AAFF)
  time.sleep(0.6)

Lcd.drawString("?", 125, 62)
Lcd.drawCircle(125, 70, 20, 0x444444)

Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("A=BIG  B=SMALL", 10, 110)

while True:
  if BtnA.isPressed():
    Lcd.fillCircle(125, 70, 32, 0x00AAFF)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00FF00, 0x000000)
    Lcd.drawString("YES! Bigger!", 15, 50)
    Lcd.drawString("They grow:", 15, 70)
    Lcd.drawString("S -> M -> L -> XL", 5, 90)
    Speaker.tone(660, 200)
    time.sleep(0.2)
    Speaker.tone(880, 200)
    time.sleep(0.2)
    Speaker.tone(1100, 400)
    break
  if BtnB.isPressed():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF6600, 0x000000)
    Lcd.drawString("Not quite!", 20, 50)
    Lcd.drawString("The bubbles are", 5, 70)
    Lcd.drawString("getting BIGGER!", 5, 90)
    Speaker.tone(200, 300)
    time.sleep(1.5)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("What Comes Next?", 5, 5)
    for i in range(3):
      Lcd.fillCircle(x_pos[i], 70, sizes[i], 0x00AAFF)
    Lcd.drawCircle(125, 70, 20, 0x444444)
    Lcd.drawString("?", 125, 62)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("A=BIG  B=SMALL", 10, 110)
  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Look at the three circles on the screen. Are they all the same size? How are they different?"},
    {"order": 2, "text": "The circles go small, medium, big -- each one is BIGGER than the last. So would the next circle be even bigger, or would it suddenly get small?"},
    {"order": 3, "text": "The circles are growing! Small, medium, big, so the next one is even BIGGER. Press Button A for BIG. When things keep growing in a pattern, the next one keeps growing too!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0002-4000-8000-000000000001',
    '60000001-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  10,
  '{"band": 1, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Sort It Out!
-- Concept: Classify circles as big or small by pressing buttons.
-- Skills: Classification and Sorting, Logical Reasoning
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0003-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  3,
  'Sort It Out!',
  'Big or small? Look at each circle and sort it into the right group by pressing the correct button.',
  'Chip is cleaning up the Puzzle Lab and there are circles EVERYWHERE -- big ones and small ones all mixed up in a pile! Chip needs your help to sort them. Here is the plan: a circle will appear on the screen. If it is a BIG circle, press Button A to put it in the BIG bucket. If it is a SMALL circle, press Button B to put it in the SMALL bucket. Sorting is a super important skill -- it is like when you put your toys in different bins, or when you sort socks by color! You will sort five circles total. How many can you get right? Chip believes in you! Let''s get sorting!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random

score = 0
total = 5

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Sort It Out!", 20, 10)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Big or Small?", 20, 30)
time.sleep(1.5)

for round in range(total):
  is_big = random.choice([True, False])
  radius = random.randint(28, 38) if is_big else random.randint(6, 14)

  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  num_text = str(round + 1) + " of " + str(total)
  Lcd.drawString(num_text, 45, 5)
  Lcd.fillCircle(67, 90, radius, 0xFF00FF)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString("A=BIG  B=SMALL", 10, 200)

  answered = False
  while not answered:
    if BtnA.isPressed():
      if is_big:
        score = score + 1
        Lcd.setTextColor(0x00FF00, 0x000000)
        Lcd.drawString("Correct! BIG!", 15, 160)
        Speaker.tone(880, 200)
      else:
        Lcd.setTextColor(0xFF0000, 0x000000)
        Lcd.drawString("Oops! SMALL!", 15, 160)
        Speaker.tone(200, 200)
      answered = True
    if BtnB.isPressed():
      if not is_big:
        score = score + 1
        Lcd.setTextColor(0x00FF00, 0x000000)
        Lcd.drawString("Correct! SMALL!", 10, 160)
        Speaker.tone(880, 200)
      else:
        Lcd.setTextColor(0xFF0000, 0x000000)
        Lcd.drawString("Oops! BIG!", 20, 160)
        Speaker.tone(200, 200)
      answered = True
    time.sleep(0.1)
  time.sleep(1)

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0x00FF00, 0x000000)
result = str(score) + " out of " + str(total)
Lcd.drawString("All done!", 30, 40)
Lcd.drawString("You got:", 35, 70)
Lcd.drawString(result, 30, 100)
if score >= 4:
  Lcd.drawString("Amazing sorter!", 10, 140)
  Speaker.tone(660, 200)
  time.sleep(0.2)
  Speaker.tone(880, 200)
  time.sleep(0.2)
  Speaker.tone(1100, 400)
else:
  Lcd.drawString("Good try!", 30, 140)
  Speaker.tone(440, 400)',
  '[
    {"order": 1, "text": "When a circle shows up, look at how big it is. Does it take up a LOT of the screen, or just a tiny bit?"},
    {"order": 2, "text": "If the circle is really big and fills up most of the screen, press Button A for BIG. If it is small and tiny, press Button B for SMALL."},
    {"order": 3, "text": "Here is a trick: if the circle is bigger than your thumb on the screen, it is probably BIG (Button A). If it is smaller than your thumb, it is SMALL (Button B). You can do it!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0003-4000-8000-000000000001',
    '60000001-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Cause and Effect Machine
-- Concept: Explore cause-and-effect by shaking, pressing, and tilting.
-- Skills: Cause and Effect, Logical Reasoning
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0004-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  4,
  'Cause and Effect Machine',
  'Shake it, press it, tilt it! Discover what happens when you do different things to your M5Stick.',
  'Chip built a MAGIC MACHINE and it does something different every time you touch it in a new way! Press Button A -- what happens? Press Button B -- something ELSE happens! Shake the whole thing -- WHOA! And if you tilt it sideways, the LED does something cool too! This is called cause and effect. The CAUSE is what you do (press, shake, tilt). The EFFECT is what happens (colors, sounds, lights). It is like flipping a light switch -- the cause is flipping the switch, and the effect is the light turning on! Try all four actions and see if you can figure out what each one does. You are a scientist now!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_whileUntil" x="20" y="20">
    <field name="MODE">WHILE</field>
    <value name="BOOL">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
  </block>
</xml>',
  'import time

Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Cause & Effect", 10, 10)
Lcd.drawString("Machine!", 30, 30)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Try everything!", 10, 60)
Lcd.drawString("Press A, Press B", 5, 80)
Lcd.drawString("Shake, or Tilt!", 10, 100)

found = [False, False, False, False]
count = 0
time.sleep(2)

while True:
  accel = Imu.getAccel()
  ax = accel[0]
  ay = accel[1]
  az = accel[2]

  shaking = abs(ax) > 1.5 or abs(ay) > 1.5 or abs(az) > 1.5
  tilted = abs(ax) > 0.4

  if BtnA.isPressed():
    Lcd.fillScreen(0xFF0000)
    Lcd.setTextColor(0xFFFFFF, 0xFF0000)
    Lcd.drawString("Button A =", 20, 50)
    Lcd.drawString("RED SCREEN!", 15, 80)
    Speaker.tone(523, 300)
    if not found[0]:
      found[0] = True
      count = count + 1
    time.sleep(0.8)
  elif BtnB.isPressed():
    Lcd.fillScreen(0x0000FF)
    Lcd.setTextColor(0xFFFFFF, 0x0000FF)
    Lcd.drawString("Button B =", 20, 50)
    Lcd.drawString("BLUE + BEEP!", 10, 80)
    Speaker.tone(784, 200)
    time.sleep(0.1)
    Speaker.tone(1046, 300)
    if not found[1]:
      found[1] = True
      count = count + 1
    time.sleep(0.8)
  elif shaking:
    Lcd.fillScreen(0x00FF00)
    Lcd.setTextColor(0x000000, 0x00FF00)
    Lcd.drawString("SHAKE =", 30, 50)
    Lcd.drawString("GREEN PARTY!", 10, 80)
    Speaker.tone(440, 100)
    time.sleep(0.1)
    Speaker.tone(660, 100)
    time.sleep(0.1)
    Speaker.tone(880, 100)
    if not found[2]:
      found[2] = True
      count = count + 1
    time.sleep(0.5)
  elif tilted:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFF00FF, 0x000000)
    Lcd.drawString("TILT =", 35, 50)
    Lcd.drawString("LED ON!", 35, 80)
    Power.setLed(255)
    if not found[3]:
      found[3] = True
      count = count + 1
    time.sleep(0.5)
    Power.setLed(0)
  else:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("Cause & Effect", 10, 10)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    msg = "Found: " + str(count) + " of 4"
    Lcd.drawString(msg, 15, 50)
    Lcd.drawString("Keep trying!", 20, 80)
    Power.setLed(0)

  if count == 4:
    time.sleep(1)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00FF00, 0x000000)
    Lcd.drawString("You found all", 10, 40)
    Lcd.drawString("4 effects!", 25, 60)
    Lcd.drawString("You are a", 25, 90)
    Lcd.drawString("SCIENTIST!", 20, 110)
    Speaker.tone(523, 200)
    time.sleep(0.2)
    Speaker.tone(659, 200)
    time.sleep(0.2)
    Speaker.tone(784, 200)
    time.sleep(0.2)
    Speaker.tone(1046, 500)
    break

  time.sleep(0.15)',
  '[
    {"order": 1, "text": "Try pressing Button A first. What happens to the screen? That is your first cause and effect!"},
    {"order": 2, "text": "Now try Button B -- does it do something different? Then try shaking the M5Stick gently. There are 4 different things to discover!"},
    {"order": 3, "text": "The four actions are: press Button A (red screen), press Button B (blue screen and beep), shake it (green party), and tilt it sideways (LED turns on). Try them all to win!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0004-4000-8000-000000000001',
    '60000001-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer,imu,led}',
  true,
  15,
  '{"band": 1, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Treasure Steps!
-- Concept: Follow step-by-step instructions to navigate to treasure.
--          Capstone lesson combining decomposition, sequencing, and puzzles.
-- Skills: Problem Decomposition, Step-by-Step Instructions, Puzzle Solving
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a6000001-0005-4000-8000-000000000001',
  '00000001-0006-4000-8000-000000000001',
  5,
  'Treasure Steps!',
  'Guide Chip across a grid to find hidden treasure! Break the journey into steps and navigate with buttons.',
  'Chip found a TREASURE MAP! There is a shiny gold star hidden somewhere on the grid, and Chip needs YOUR help to get there. But here is the tricky part -- you can only move one step at a time! Press Button A to move RIGHT and press Button B to move DOWN. You need to think ahead: how many steps right? How many steps down? Big problems are easier when you break them into tiny steps -- that is called problem decomposition, and it is what real explorers and scientists do! The treasure moves to a new spot each time, so every adventure is different. Watch out -- if you go off the edge, you start over! Ready to find the treasure? Let''s GOOOOO!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'import time
import random

grid_size = 4
cell_w = 30
cell_h = 30
offset_x = 7
offset_y = 35
moves = 0

px = 0
py = 0
tx = random.randint(1, grid_size - 1)
ty = random.randint(1, grid_size - 1)
if tx == 0 and ty == 0:
  tx = 2
  ty = 2

def draw_grid():
  Lcd.fillScreen(0x000000)
  Lcd.setTextColor(0xFFFF00, 0x000000)
  Lcd.drawString("Treasure Steps!", 5, 5)
  Lcd.setTextColor(0xAAAAAA, 0x000000)
  step_text = "Moves: " + str(moves)
  Lcd.drawString(step_text, 5, 22)
  for row in range(grid_size):
    for col in range(grid_size):
      x = offset_x + col * cell_w
      y = offset_y + row * cell_h
      Lcd.drawRect(x, y, cell_w, cell_h, 0x333333)
  sx = offset_x + tx * cell_w + 3
  sy = offset_y + ty * cell_h + 3
  Lcd.fillRect(sx, sy, cell_w - 6, cell_h - 6, 0xFFD700)
  Lcd.setTextColor(0x000000, 0xFFD700)
  Lcd.drawString("*", sx + 8, sy + 6)
  cx = offset_x + px * cell_w + 3
  cy = offset_y + py * cell_h + 3
  Lcd.fillRect(cx, cy, cell_w - 6, cell_h - 6, 0x00AAFF)
  Lcd.setTextColor(0xFFFFFF, 0x00AAFF)
  Lcd.drawString("C", cx + 8, cy + 6)
  Lcd.setTextColor(0xFFFFFF, 0x000000)
  Lcd.drawString("A=Right B=Down", 5, offset_y + grid_size * cell_h + 10)

draw_grid()

while True:
  if BtnA.isPressed():
    if px < grid_size - 1:
      px = px + 1
      moves = moves + 1
      Speaker.tone(600, 80)
    else:
      Speaker.tone(200, 150)
    draw_grid()
    time.sleep(0.3)
  if BtnB.isPressed():
    if py < grid_size - 1:
      py = py + 1
      moves = moves + 1
      Speaker.tone(600, 80)
    else:
      Speaker.tone(200, 150)
    draw_grid()
    time.sleep(0.3)

  if px == tx and py == ty:
    time.sleep(0.3)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFD700, 0x000000)
    Lcd.drawString("TREASURE", 25, 30)
    Lcd.drawString("FOUND!", 35, 55)
    Lcd.setTextColor(0x00FF00, 0x000000)
    done_text = "In " + str(moves) + " moves!"
    Lcd.drawString(done_text, 20, 90)
    Lcd.drawString("You broke it", 10, 120)
    Lcd.drawString("into steps!", 15, 140)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Great solving!", 10, 175)
    Speaker.tone(523, 150)
    time.sleep(0.15)
    Speaker.tone(659, 150)
    time.sleep(0.15)
    Speaker.tone(784, 150)
    time.sleep(0.15)
    Speaker.tone(1046, 500)
    break

  time.sleep(0.1)',
  '[
    {"order": 1, "text": "Look at the grid. The blue square (C) is Chip, and the gold square (*) is the treasure. You need to move Chip to the treasure!"},
    {"order": 2, "text": "Button A moves Chip to the RIGHT. Button B moves Chip DOWN. First figure out: does Chip need to go right, or down, or both? Count the squares!"},
    {"order": 3, "text": "Count how many squares the treasure is to the right of Chip -- press Button A that many times. Then count how many squares it is below Chip -- press Button B that many times. Break the path into right-steps and down-steps!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000006',
  ARRAY[
    '60000001-0005-4000-8000-000000000001',
    '60000001-0007-4000-8000-000000000001',
    '60000001-000a-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buttons,buzzer}',
  true,
  20,
  '{"band": 1, "difficulty": "advanced"}'::jsonb
);
