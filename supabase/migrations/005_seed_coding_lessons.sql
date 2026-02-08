-- =============================================================================
-- TinkerSchool -- Seed 5 Coding Lessons for Band 2 (Builder, Grade 2-3)
-- =============================================================================
-- Seeds 5 interactive coding lessons that progress from simple display output
-- to sensor-based conditionals. Designed for Cassidy (age 7) using Blockly
-- blocks on the M5StickC Plus 2.
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (additional lesson columns)
--   - 003_seed_1st_grade_curriculum.sql  (subjects, skills, modules)
--
-- References:
--   - Coding subject:  00000000-0000-4000-8000-000000000007
--   - Code Lab module: 00000001-0007-4000-8000-000000000001
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- Lesson 1: Hello, Chip!
-- Concept: Display text on screen. First program ever.
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a0000001-0001-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  1,
  'Hello, Chip!',
  'Write your very first program! Learn how to display text on the M5Stick screen.',
  'Chip just woke up on the M5Stick and is SO excited to meet you! But there''s a problem -- the screen is blank and Chip can''t say hello. Can you help Chip introduce himself by writing text on the screen? Let''s make Chip''s first words appear!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Hello!", 10, 60)
Lcd.setTextColor(0x00FF00, 0x000000)
Lcd.drawString("I''m Chip!", 10, 80)',
  '[
    {"order": 1, "text": "Look in the Display category on the left. Can you find the ''display text'' block?"},
    {"order": 2, "text": "Drag a ''display text'' block and connect it below the ''clear display'' block. Type \"Hello!\" in the text spot."},
    {"order": 3, "text": "Add another ''display text'' block below! Type \"I''m Chip!\" and try changing the color to green. Set the y position to 80 so it shows on a new line."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY['70000001-0003-4000-8000-000000000001']::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  10,
  '{"band": 2, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 2: Rainbow Name
-- Concept: Multiple display text blocks with different colors
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a0000001-0002-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  2,
  'Rainbow Name',
  'Make your name look amazing by displaying each letter in a different color! Practice using multiple display blocks in sequence.',
  'Chip thinks your name is the COOLEST name ever and wants to make it look extra special on the screen. What if each letter was a different color -- like a rainbow? Red, green, blue, yellow -- the more colors the better! Can you make your name shine?',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFF0000, 0x000000)
Lcd.drawString("C", 10, 40)
Lcd.setTextColor(0x00FF00, 0x000000)
Lcd.drawString("A", 30, 60)
Lcd.setTextColor(0x0000FF, 0x000000)
Lcd.drawString("S", 50, 80)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("S", 70, 100)',
  '[
    {"order": 1, "text": "Use multiple ''display text'' blocks -- one for each letter of your name. Stack them below the ''clear display'' block."},
    {"order": 2, "text": "Change the color dropdown on each ''display text'' block to a different color. Try red, green, blue, and yellow!"},
    {"order": 3, "text": "Move each letter to a different y position so they don''t overlap. Try 40, 60, 80, 100 for the y values, and increase x too (10, 30, 50, 70) for a diagonal rainbow!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000001-0003-4000-8000-000000000001',
    '70000001-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display}',
  true,
  10,
  '{"band": 2, "difficulty": "beginner"}'::jsonb
);


-- =========================================================================
-- Lesson 3: Beep Boop Band
-- Concept: Playing sounds with the buzzer, sequencing
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a0000001-0003-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  3,
  'Beep Boop Band',
  'Start a band with Chip! Learn to play tones with different frequencies to create a simple melody.',
  'Chip LOVES music and wants to start a band -- the Beep Boop Band! The M5Stick has a tiny buzzer inside that can play different sounds. Low numbers make deep sounds (like a tuba), and high numbers make squeaky sounds (like a whistle). Can you teach the M5Stick to play a little song? Each note needs two things: how high or low it sounds (frequency) and how long to play it (duration).',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_buzzer_tone" x="20" y="20">
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
</xml>',
  'Speaker.tone(262, 500)
time.sleep(0.5)
Speaker.tone(294, 500)
time.sleep(0.5)
Speaker.tone(330, 500)
time.sleep(0.5)
Speaker.tone(262, 500)
time.sleep(0.5)
Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Music!", 30, 60)',
  '[
    {"order": 1, "text": "You already have one note (262 = Middle C). Add more ''play tone'' blocks from the Sound category after the wait block. Try 294 for D, 330 for E!"},
    {"order": 2, "text": "Always put a ''wait'' block between notes so they don''t all play at once. 0.5 seconds is a good gap."},
    {"order": 3, "text": "Try adding a ''clear display'' and ''display text'' block at the end to show \"Music!\" on screen when your song finishes!"}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000001-0002-4000-8000-000000000001',
    '70000001-0009-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer}',
  true,
  15,
  '{"band": 2, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 4: Shake It Up!
-- Concept: Reading sensors (IMU/accelerometer), conditionals
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a0000001-0004-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  4,
  'Shake It Up!',
  'Make the M5Stick react when you shake it! Learn about sensors and if-then decisions.',
  'Chip loves to dance and wiggle! Did you know your M5Stick can FEEL when it''s being shaken? It has a tiny sensor inside called an accelerometer -- it''s like a superpower that lets the device know when it''s moving! Can you make the screen change and play a fun sound every time you give it a good shake? When nobody is shaking it, it should show a friendly message asking to be shaken!',
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
  'while True:
  if shake_detected():
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0x00FF00, 0x000000)
    Lcd.drawString("SHAKE!", 30, 60)
    Speaker.tone(880, 200)
    Power.setLed(255)
    time.sleep(0.5)
  else:
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString("Shake me!", 20, 60)
    Power.setLed(0)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "Find the ''device shaken?'' block in the Sensors category. It''s the one that checks if someone just shook the M5Stick!"},
    {"order": 2, "text": "Drag the ''device shaken?'' block into the empty diamond shape on the ''if'' block. This tells the program: IF the device is shaken, THEN do something."},
    {"order": 3, "text": "Put ''clear display'', ''display text'' (with \"SHAKE!\"), and ''play tone'' blocks INSIDE the if block. Click the gear icon on the if block to add an ''else'' section, then add a ''display text'' with \"Shake me!\" there."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000001-0005-4000-8000-000000000001',
    '70000001-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,buzzer,imu,led}',
  true,
  15,
  '{"band": 2, "difficulty": "intermediate"}'::jsonb
);


-- =========================================================================
-- Lesson 5: Night Light
-- Concept: Loops, conditionals, combining LED + display + sensor
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support,
  estimated_minutes, content
) VALUES (
  'a0000001-0005-4000-8000-000000000001',
  '00000001-0007-4000-8000-000000000001',
  5,
  'Night Light',
  'Build a night light that turns on when the M5Stick is tilted! Combine sensors, LED, display, and conditionals into one project.',
  'Chip has a secret -- Chip is a little bit scared of the dark! Can you build a night light to help? Here''s the plan: the M5Stick has a tilt sensor that knows which way it''s pointing. When you tilt the M5Stick face-down (like putting it on a dark table), it should turn on the LED and display a cozy moon and stars. When you tilt it back up, it turns off to save battery. You''ll be combining EVERYTHING you''ve learned -- display, LED, sensors, and if-then logic. Let''s build it!',
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
            <field name="AXIS">Y</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>',
  'while True:
  tilt = Imu.getAccel()[1]
  if tilt > 0.3:
    Power.setLed(255)
    Lcd.fillScreen(0x000000)
    Lcd.setTextColor(0xFFFF00, 0x000000)
    Lcd.drawString("* Moon *", 20, 50)
    Lcd.setTextColor(0xFFFFFF, 0x000000)
    Lcd.drawString(". * . * .", 15, 80)
    Lcd.drawString("  Night  ", 25, 110)
    Lcd.drawString("  Light  ", 25, 130)
    Speaker.tone(440, 100)
    time.sleep(1)
  else:
    Power.setLed(0)
    Lcd.fillScreen(0x000000)
    time.sleep(0.2)',
  '[
    {"order": 1, "text": "The ''tilt'' variable already reads the Y-axis sensor. Now add an ''if'' block below it (inside the loop). You''ll compare the tilt value to a number."},
    {"order": 2, "text": "From the Logic category, drag a ''compare'' block (the one with < > =) into the if diamond. Put the ''tilt'' variable on the left, choose > (greater than), and type 0.3 on the right."},
    {"order": 3, "text": "Inside the ''if'' section: add ''set LED red'', ''clear display'', and ''display text'' blocks to show a cozy night light message. In the ''else'' section: add ''set LED off'' and ''clear display'' to turn everything off."}
  ]'::jsonb,
  '00000000-0000-4000-8000-000000000007',
  ARRAY[
    '70000001-0005-4000-8000-000000000001',
    '70000001-0006-4000-8000-000000000001',
    '70000001-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false,
  '{display,imu,led,buzzer}',
  true,
  20,
  '{"band": 2, "difficulty": "advanced"}'::jsonb
);
