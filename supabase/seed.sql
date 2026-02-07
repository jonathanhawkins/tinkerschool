-- =============================================================================
-- CodeBuddy — Seed Data
-- =============================================================================
-- Seeds the curriculum for Band 2 Module 1 ("Hello M5Stick!"), Module 2
-- ("Drawing Fun!"), Module 3 ("Shake & Count!"), Module 4 ("DJ Stick!"),
-- Module 5 ("Tilt Games!"), and starter badges.
-- Run with: npx supabase db reset (applies migrations then seed)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Band 2, Module 1: Hello M5Stick!
-- ---------------------------------------------------------------------------
INSERT INTO public.modules (id, band, order_num, title, description, icon)
VALUES (
  '00000002-0001-4000-8000-000000000001',
  2,
  1,
  'Hello M5Stick!',
  'Meet your M5StickC Plus 2! Learn to light up the display, draw colorful shapes, make buttons do cool things, play music, and put on a light show.',
  'monitor'
);

-- Lesson 1: Light It Up
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0001-4000-8001-000000000001',
  '00000002-0001-4000-8000-000000000001',
  1,
  'Light It Up',
  'Turn on the display and show text on your M5StickC Plus 2.',
  'Chip blinks his tiny eyes open and looks around. Everything is dark! "Hey, is anybody there?" he whispers. "It''s so dark in here... I can''t see a thing! Can you help me turn on my screen? I bet we can make it glow!" Help Chip light up his display by writing your very first program!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Hello World!", 10, 50, 0xFFFFFF)',
  '[
    {"order": 1, "text": "First, you need to clear the screen. Look for the Display Clear block in the toolbox!"},
    {"order": 2, "text": "Now add a Display Text block after the clear block. Type your message where it says \"Hello!\""},
    {"order": 3, "text": "Connect the Clear Display block to the Display Text block. Set x to 10 and y to 50, then type any message you like!"}
  ]'::jsonb
);

-- Lesson 2: Color My World
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0001-4000-8002-000000000001',
  '00000002-0001-4000-8000-000000000001',
  2,
  'Color My World',
  'Draw colored shapes on the display using rectangles and circles.',
  'Chip is bouncing up and down with excitement. "Wow, you turned on the screen! That was amazing! But it''s a bit boring with just words, don''t you think? I LOVE colors! Red, blue, green -- all of them! Can you help me paint some shapes on my tiny screen? Let''s make it look like a rainbow party!" Time to become a digital artist!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.fillRect(10, 10, 50, 50, 0xFF0000)
M5.Lcd.fillRect(70, 10, 50, 50, 0x0000FF)
M5.Lcd.fillCircle(67, 100, 25, 0x00FF00)',
  '[
    {"order": 1, "text": "Start by clearing the screen with a dark background. Then look in the Display category for shape blocks!"},
    {"order": 2, "text": "Drag out a Draw Rectangle block. You need to set x, y, width, and height numbers. Try x=10, y=10, width=50, height=50!"},
    {"order": 3, "text": "Add a rectangle with x=10, y=10, width=50, height=50 in red. Then add another rectangle and a circle with different colors!"}
  ]'::jsonb
);

-- Lesson 3: Button Magic
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0001-4000-8003-000000000001',
  '00000002-0001-4000-8000-000000000001',
  3,
  'Button Magic',
  'React to button presses to make things happen on screen.',
  'Chip is poking at the two little buttons on the M5Stick. "Hey, what do these clicky things do? I pressed one and nothing happened! That''s no fun at all. I bet YOU can make them do something awesome. What if pressing Button A made the screen turn red, and Button B made it turn blue? That would be SO COOL!" Let''s wire up the buttons to make Chip happy!',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Press a button!", 10, 50, 0xFFFFFF)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        M5.Lcd.fillScreen(0xFF0000)
        M5.Lcd.drawString("Button A!", 20, 100, 0xFFFFFF)
    if M5.BtnB.isPressed():
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString("Button B!", 20, 100, 0xFFFFFF)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "You need a Forever loop to keep checking the buttons. Look in the Loops category for one!"},
    {"order": 2, "text": "Inside the loop, add an If block from Logic. Then put a \"Button A pressed?\" block from the Buttons category as the condition."},
    {"order": 3, "text": "Put a Clear Display (red) and Display Text block inside the If for Button A. Then add another If block for Button B with blue!"}
  ]'::jsonb
);

-- Lesson 4: Beep Boop
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0001-4000-8004-000000000001',
  '00000002-0001-4000-8000-000000000001',
  4,
  'Beep Boop',
  'Make the buzzer play tones and musical notes.',
  'Chip is humming to himself. Well, trying to -- but no sound comes out! "I have a tiny speaker inside me, but I don''t know how to use it! Can you help me make some sounds? I want to play music! Maybe we could play a little song -- like do, re, mi! Different numbers make different notes. Big numbers are high and squeaky, small numbers are low and rumbly. Let''s make some noise!"',
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
  </block>
</xml>',
  '# Play "do re mi" - three notes!
M5.Speaker.tone(262, 500)   # C note (do)
time.sleep(0.6)
M5.Speaker.tone(294, 500)   # D note (re)
time.sleep(0.6)
M5.Speaker.tone(330, 500)   # E note (mi)
time.sleep(0.6)
M5.Speaker.tone(349, 500)   # F note (fa)
time.sleep(0.6)
M5.Speaker.tone(392, 800)   # G note (so) - hold it longer!
time.sleep(1.0)

M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Music time!", 10, 50, 0xFFFF00)',
  '[
    {"order": 1, "text": "Open the Sound category and drag out a Play Tone block. The first number is how high or low the sound is!"},
    {"order": 2, "text": "To play more than one note, add a Wait block between each Play Tone block so the notes don''t all happen at once. Try 0.6 seconds!"},
    {"order": 3, "text": "Use these numbers for a musical scale: 262 (do), 294 (re), 330 (mi), 349 (fa), 392 (so). Put a Wait block after each tone!"}
  ]'::jsonb
);

-- Lesson 5: LED Light Show
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0001-4000-8005-000000000001',
  '00000002-0001-4000-8000-000000000001',
  5,
  'LED Light Show',
  'Control the built-in LED to create a colorful light show.',
  'Chip gasps. "Did you know I have a secret light hidden inside me? It''s called an LED and it can glow in different colors! Red... green... blue... it''s like a tiny traffic light! But right now it''s turned off and I feel kind of dim. Can you make it blink and change colors? Let''s put on a LIGHT SHOW! We can make it flash red, then green, then blue, over and over. Disco time!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_led_set" x="20" y="20">
    <field name="COLOR">red</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Light show!", 10, 50, 0xFFFFFF)

# Blink through colors
for i in range(3):
    Power.led(255, 0, 0)
    M5.Lcd.fillScreen(0xFF0000)
    time.sleep(0.5)
    Power.led(0, 255, 0)
    M5.Lcd.fillScreen(0x00FF00)
    time.sleep(0.5)
    Power.led(0, 0, 255)
    M5.Lcd.fillScreen(0x0000FF)
    time.sleep(0.5)

Power.led(0, 0, 0)
M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Show over!", 15, 50, 0xFFFFFF)',
  '[
    {"order": 1, "text": "Find the LED category and drag out a Set LED block. Pick a color and see what happens! Then add a Wait block after it."},
    {"order": 2, "text": "To make it blink, set the LED to a color, wait, then set it to a different color. Try red, wait, green, wait, blue, wait! You can use a \"repeat\" loop to do it more than once."},
    {"order": 3, "text": "Use a Repeat loop set to 3 times. Inside, put: Set LED red, Wait 0.5 sec, Set LED green, Wait 0.5 sec, Set LED blue, Wait 0.5 sec. End with Set LED off!"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Band 2, Module 2: Drawing Fun!
-- ---------------------------------------------------------------------------
INSERT INTO public.modules (id, band, order_num, title, description, icon)
VALUES (
  '00000002-0002-4000-8000-000000000001',
  2,
  2,
  'Drawing Fun!',
  'Become a digital artist! Draw pixel art, combine shapes to make pictures, and create animations that move across the screen.',
  'paintbrush'
);

-- Lesson 1: Pixel Art
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0002-4000-8001-000000000001',
  '00000002-0002-4000-8000-000000000001',
  1,
  'Pixel Art',
  'Draw individual pixels to make simple images on the tiny screen.',
  'Chip squints at the screen. "Did you know this screen is made of teeny tiny dots called pixels? Each one can be any color! It''s like having a super tiny piece of graph paper. If you color in the right dots, you can draw anything -- a heart, a star, even a little smiley face! Let''s start small and draw a simple picture using just dots. I want to see a heart! Can you make one for me?"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Pixel Heart!", 20, 10, 0xFFFFFF)

# Draw a pixel-art heart using small filled rectangles as "big pixels"
# Each "pixel" is 10x10 so it is visible on the small screen
p = 10  # pixel size

# Row 1 - two bumps
M5.Lcd.fillRect(27, 40, p, p, 0xFF0000)
M5.Lcd.fillRect(37, 40, p, p, 0xFF0000)
M5.Lcd.fillRect(57, 40, p, p, 0xFF0000)
M5.Lcd.fillRect(67, 40, p, p, 0xFF0000)

# Row 2 - wider
M5.Lcd.fillRect(17, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(27, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(37, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(47, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(57, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(67, 50, p, p, 0xFF0000)
M5.Lcd.fillRect(77, 50, p, p, 0xFF0000)

# Row 3 - full width
M5.Lcd.fillRect(17, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(27, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(37, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(47, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(57, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(67, 60, p, p, 0xFF0000)
M5.Lcd.fillRect(77, 60, p, p, 0xFF0000)

# Row 4 - narrowing
M5.Lcd.fillRect(27, 70, p, p, 0xFF0000)
M5.Lcd.fillRect(37, 70, p, p, 0xFF0000)
M5.Lcd.fillRect(47, 70, p, p, 0xFF0000)
M5.Lcd.fillRect(57, 70, p, p, 0xFF0000)
M5.Lcd.fillRect(67, 70, p, p, 0xFF0000)

# Row 5 - narrowing more
M5.Lcd.fillRect(37, 80, p, p, 0xFF0000)
M5.Lcd.fillRect(47, 80, p, p, 0xFF0000)
M5.Lcd.fillRect(57, 80, p, p, 0xFF0000)

# Row 6 - point
M5.Lcd.fillRect(47, 90, p, p, 0xFF0000)',
  '[
    {"order": 1, "text": "Start with a Clear Display block to make the background black. Then use Draw Rectangle blocks to draw small squares -- those are your pixels!"},
    {"order": 2, "text": "Make each rectangle small (like 10 wide and 10 tall) and pick a color. Place them next to each other by changing the x and y numbers by 10 each time."},
    {"order": 3, "text": "To make a heart: put two red squares at the top for the bumps, then make each row below a little wider, then narrower toward the bottom. Use width=10, height=10 for each pixel!"}
  ]'::jsonb
);

-- Lesson 2: Shape Painter
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0002-4000-8002-000000000001',
  '00000002-0002-4000-8000-000000000001',
  2,
  'Shape Painter',
  'Combine rectangles and circles to make pictures.',
  'Chip claps his hands. "Those pixels were awesome, but you know what? We have SHAPE superpowers too! We can draw big rectangles and circles in one go -- no need to place each pixel! I dare you to draw a picture using just shapes. Maybe a house? A rectangle for the walls, a triangle... well, we don''t have triangles yet, but we can fake it! Or how about a robot face? Rectangles for the head, circles for the eyes! Let''s get creative!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_rect">
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">20</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">40</field>
          </shadow>
        </value>
        <value name="WIDTH">
          <shadow type="math_number">
            <field name="NUM">95</field>
          </shadow>
        </value>
        <value name="HEIGHT">
          <shadow type="math_number">
            <field name="NUM">95</field>
          </shadow>
        </value>
        <field name="COLOR">yellow</field>
        <field name="FILL">TRUE</field>
      </block>
    </next>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)

# Robot face!
# Head - big yellow rectangle
M5.Lcd.fillRect(20, 40, 95, 95, 0xFFFF00)

# Eyes - two blue circles
M5.Lcd.fillCircle(47, 70, 12, 0x0000FF)
M5.Lcd.fillCircle(87, 70, 12, 0x0000FF)

# Pupils - small black circles
M5.Lcd.fillCircle(47, 70, 5, 0x000000)
M5.Lcd.fillCircle(87, 70, 5, 0x000000)

# Mouth - red rectangle
M5.Lcd.fillRect(40, 105, 55, 12, 0xFF0000)

# Antenna - small rectangle on top
M5.Lcd.fillRect(62, 20, 10, 20, 0x00FF00)
M5.Lcd.fillCircle(67, 18, 6, 0xFF0000)

M5.Lcd.drawString("I''m a robot!", 20, 150, 0xFFFFFF)',
  '[
    {"order": 1, "text": "The starter gives you a head shape. Now add circles for eyes! Look for the Draw Circle block in the Display category."},
    {"order": 2, "text": "For the eyes, put two circles inside the yellow rectangle. Try x=47, y=70, radius=12 for the left eye, and x=87, y=70 for the right eye!"},
    {"order": 3, "text": "Add blue circles for eyes (radius 12), tiny black circles inside for pupils (radius 5), a red rectangle for the mouth (x=40, y=105, width=55, height=12), and a green rectangle on top for the antenna!"}
  ]'::jsonb
);

-- Lesson 3: Animation Station
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0002-4000-8003-000000000001',
  '00000002-0002-4000-8000-000000000001',
  3,
  'Animation Station',
  'Use loops to create simple animations on the screen.',
  'Chip''s eyes go wide. "You know what''s even cooler than a picture? A picture that MOVES! That''s called animation! Cartoons work by showing lots of pictures really fast. We can do the same thing! Draw something, wait a tiny bit, erase it, draw it somewhere new -- WHOOSH, it''s moving! Let''s make a ball that bounces across the screen. We''ll use a special LOOP that repeats our code over and over. Ready? Let''s bring our screen to life!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Bouncing ball!", 15, 10, 0xFFFFFF)

# Animate a ball moving across the screen
x = 10
for i in range(25):
    # Erase old ball
    M5.Lcd.fillCircle(x, 120, 12, 0x000000)
    # Move ball to the right
    x = x + 5
    # Draw new ball
    M5.Lcd.fillCircle(x, 120, 12, 0x00FF00)
    time.sleep(0.1)

# Ball reached the end!
M5.Lcd.drawString("Hooray!", 40, 160, 0xFFFF00)',
  '[
    {"order": 1, "text": "An animation needs a loop! Find the Repeat block in the Loops category. Inside the loop, draw a circle, wait, then clear the screen."},
    {"order": 2, "text": "To make the ball move, you need to change where you draw it each time. Instead of erasing the whole screen, draw a black circle where the old ball was, then draw a green circle at the new spot."},
    {"order": 3, "text": "Use a Repeat loop set to 25 times. Inside: draw a black circle at the old position to erase it, then draw a green circle 5 pixels to the right. Add a Wait of 0.1 seconds so you can see it move!"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Band 2, Module 3: Shake & Count!
-- ---------------------------------------------------------------------------
INSERT INTO public.modules (id, band, order_num, title, description, icon)
VALUES (
  '00000002-0003-4000-8000-000000000001',
  2,
  3,
  'Shake & Count!',
  'Discover the motion sensor inside your M5Stick! Detect shakes, count things, roll dice, and build a Magic 8-Ball that predicts the future!',
  'vibrate'
);

-- Lesson 1: Shake It Up!
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0003-4000-8001-000000000001',
  '00000002-0003-4000-8000-000000000001',
  1,
  'Shake It Up!',
  'Detect shakes with the motion sensor and react on screen.',
  'Chip discovers he can feel movement! "Whoa, something is tingling inside me! I think I have a motion sensor -- it''s like a tiny brain that feels when I move! Can you shake me and see what happens? I bet we can make the screen say something when you shake me! Like a magic trick!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Shake me!", 20, 50, 0xFFFFFF)

while True:
    M5.update()
    if shake_detected():
        M5.Lcd.fillScreen(0xFF00FF)
        M5.Lcd.drawString("SHAKEN!", 25, 60, 0xFFFFFF)
        M5.Speaker.tone(880, 200)
        time.sleep(0.5)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shake me!", 20, 50, 0xFFFFFF)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "Look in the Sensors category for the Shake Detected block. This checks if the M5Stick has been shaken!"},
    {"order": 2, "text": "Put the Shake Detected block inside a Forever loop with an If block. When a shake is detected, change the screen color and show a message!"},
    {"order": 3, "text": "Inside the If block: clear the screen with a fun color, show \"SHAKEN!\", play a tone (880), and wait 0.5 seconds. Then reset the screen back to the starting message!"}
  ]'::jsonb
);

-- Lesson 2: Counting Shakes
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0003-4000-8002-000000000001',
  '00000002-0003-4000-8000-000000000001',
  2,
  'Counting Shakes',
  'Use a variable to count how many times the M5Stick is shaken.',
  'Chip wants to keep score! "That was SO fun! But wait -- how many times did you shake me? I lost count! I bet you can teach me to COUNT my shakes. We''ll need a special thing called a variable -- it''s like a box that remembers a number for us!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
count = 0
M5.Lcd.drawString("Shakes: 0", 20, 60, 0x00FF00)

while True:
    M5.update()
    if shake_detected():
        count = count + 1
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shakes:", 30, 40, 0xFFFFFF)
        M5.Lcd.drawString(str(count), 50, 80, 0x00FF00)
        M5.Speaker.tone(660, 100)
        time.sleep(0.3)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "You need a variable to keep score! Go to the Variables category and create a new variable called \"count\". Set it to 0 at the start."},
    {"order": 2, "text": "Inside your Forever loop, when a shake is detected, use the Change Variable block to add 1 to your count variable."},
    {"order": 3, "text": "After changing the count, clear the screen and display the count number. Use a Display Text block to show \"Shakes:\" and another to show the count value!"}
  ]'::jsonb
);

-- Lesson 3: Dice Roller
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0003-4000-8003-000000000001',
  '00000002-0003-4000-8000-000000000001',
  3,
  'Dice Roller',
  'Shake to roll a random number from 1 to 6 like a real dice.',
  'Chip wants to play a board game! "I love board games but there''s one problem -- I can''t find the dice! Wait... what if YOU turn me into a dice? Shake me and I''ll show a random number from 1 to 6! It''s like MAGIC but it''s actually MATH!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Shake to roll!", 10, 50, 0xFFFFFF)

while True:
    M5.update()
    if shake_detected():
        roll = random.randint(1, 6)
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString(str(roll), 55, 50, 0xFFFFFF)
        M5.Speaker.tone(440, 300)
        time.sleep(1.0)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shake to roll!", 10, 50, 0xFFFFFF)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "You need a random number! Look in the Math category for a Random Integer block. Set it to pick between 1 and 6."},
    {"order": 2, "text": "When you detect a shake, save the random number in a variable called \"roll\", then display it on the screen nice and big!"},
    {"order": 3, "text": "Inside the If shake block: set roll to random 1-6, clear screen blue, show the roll number, play a tone, wait 1 second, then reset the screen to show \"Shake to roll!\" again."}
  ]'::jsonb
);

-- Lesson 4: Magic 8-Ball
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0003-4000-8004-000000000001',
  '00000002-0003-4000-8000-000000000001',
  4,
  'Magic 8-Ball',
  'Build a fortune-telling Magic 8-Ball that gives random answers when shaken.',
  'Chip wants to predict the future! "I''ve always wanted to be a fortune teller! You know those Magic 8-Balls? Ask a question, shake, and get an answer! We can use random numbers to pick a different answer each time. Shake me and I''ll tell your FORTUNE!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000080)
M5.Lcd.drawString("Ask me", 30, 40, 0xFFFFFF)
M5.Lcd.drawString("anything!", 25, 65, 0xFFFFFF)

while True:
    M5.update()
    if shake_detected():
        answer = random.randint(1, 6)
        M5.Lcd.fillScreen(0x800080)
        if answer == 1:
            M5.Lcd.drawString("Yes!", 45, 60, 0x00FF00)
        if answer == 2:
            M5.Lcd.drawString("No way!", 35, 60, 0xFF0000)
        if answer == 3:
            M5.Lcd.drawString("Maybe...", 30, 60, 0xFFFF00)
        if answer == 4:
            M5.Lcd.drawString("Ask again!", 20, 60, 0x00FFFF)
        if answer == 5:
            M5.Lcd.drawString("Totally!", 30, 60, 0x00FF00)
        if answer == 6:
            M5.Lcd.drawString("Nope!", 40, 60, 0xFF0000)
        M5.Speaker.tone(220, 500)
        time.sleep(2.0)
        M5.Lcd.fillScreen(0x000080)
        M5.Lcd.drawString("Ask me", 30, 40, 0xFFFFFF)
        M5.Lcd.drawString("anything!", 25, 65, 0xFFFFFF)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "Start with a mystery-looking screen! Use a dark blue background and show \"Ask me anything!\" to invite questions."},
    {"order": 2, "text": "When shaken, pick a random number 1 to 6. Use If blocks to show a different answer for each number -- like \"Yes!\", \"No way!\", or \"Maybe...\""},
    {"order": 3, "text": "Add 6 If blocks, one for each answer (1=Yes!, 2=No way!, 3=Maybe..., 4=Ask again!, 5=Totally!, 6=Nope!). Play a spooky low tone (220) and wait 2 seconds before resetting!"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Band 2, Module 4: DJ Stick!
-- ---------------------------------------------------------------------------
INSERT INTO public.modules (id, band, order_num, title, description, icon)
VALUES (
  '00000002-0004-4000-8000-000000000001',
  2,
  4,
  'DJ Stick!',
  'Turn your M5Stick into a musical instrument! Play piano notes with buttons, program songs, and create awesome sound effects!',
  'music'
);

-- Lesson 1: My First Piano
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0004-4000-8001-000000000001',
  '00000002-0004-4000-8000-000000000001',
  1,
  'My First Piano',
  'Use the two buttons to play different musical notes like a tiny piano.',
  'Chip wants to be a musician! "I''ve been watching music videos and I REALLY want to play piano! I have two buttons and a speaker -- that''s almost like a piano, right? If Button A plays one note and Button B plays another, we can make music! Let''s rock!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Piano!", 35, 20, 0xFFFFFF)
M5.Lcd.drawString("A = Do", 20, 80, 0xFF0000)
M5.Lcd.drawString("B = Mi", 20, 110, 0x0000FF)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        M5.Speaker.tone(262, 300)
        M5.Lcd.fillScreen(0xFF0000)
        M5.Lcd.drawString("Do!", 50, 60, 0xFFFFFF)
        time.sleep(0.3)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Piano!", 35, 20, 0xFFFFFF)
    if M5.BtnB.isPressed():
        M5.Speaker.tone(330, 300)
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString("Mi!", 50, 60, 0xFFFFFF)
        time.sleep(0.3)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Piano!", 35, 20, 0xFFFFFF)
    time.sleep(0.05)',
  '[
    {"order": 1, "text": "Start with a Forever loop and check for button presses inside it. Use If blocks with \"Button A pressed?\" and \"Button B pressed?\" conditions."},
    {"order": 2, "text": "When Button A is pressed, play a tone at 262 (that''s the note Do!). When Button B is pressed, play a tone at 330 (that''s Mi!)."},
    {"order": 3, "text": "Make it visual too! When A is pressed, turn the screen red and show \"Do!\". When B is pressed, turn it blue and show \"Mi!\". Add a short wait (0.3s) after each note."}
  ]'::jsonb
);

-- Lesson 2: Song Player
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0004-4000-8002-000000000001',
  '00000002-0004-4000-8000-000000000001',
  2,
  'Song Player',
  'Program a sequence of notes to play Twinkle Twinkle Little Star.',
  'Chip learned single notes! "One note is fun but a SONG is better! Do you know ''Twinkle Twinkle Little Star''? The first part goes: do do so so la la so! Each note is just a number. Let''s program the whole first line!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Twinkle", 30, 30, 0xFFFF00)
M5.Lcd.drawString("Twinkle!", 25, 60, 0xFFFF00)
time.sleep(1.0)

# Twinkle Twinkle Little Star
M5.Lcd.fillScreen(0x000080)
M5.Lcd.drawString("C", 60, 60, 0xFFFFFF)
M5.Speaker.tone(262, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x000080)
M5.Lcd.drawString("C", 60, 60, 0xFFFFFF)
M5.Speaker.tone(262, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x800080)
M5.Lcd.drawString("G", 60, 60, 0xFFFFFF)
M5.Speaker.tone(392, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x800080)
M5.Lcd.drawString("G", 60, 60, 0xFFFFFF)
M5.Speaker.tone(392, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x008000)
M5.Lcd.drawString("A", 60, 60, 0xFFFFFF)
M5.Speaker.tone(440, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x008000)
M5.Lcd.drawString("A", 60, 60, 0xFFFFFF)
M5.Speaker.tone(440, 400)
time.sleep(0.5)
M5.Lcd.fillScreen(0x800000)
M5.Lcd.drawString("G", 60, 60, 0xFFFFFF)
M5.Speaker.tone(392, 800)
time.sleep(1.0)

M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Great song!", 20, 60, 0x00FF00)',
  '[
    {"order": 1, "text": "A song is just notes played one after another! Use Play Tone blocks with Wait blocks between them. C=262, G=392, A=440."},
    {"order": 2, "text": "The pattern for Twinkle Twinkle is: C C G G A A G (hold). Play each note for 400ms with a 0.5 second wait between notes."},
    {"order": 3, "text": "Play tone 262 twice, then 392 twice, then 440 twice, then 392 once (longer, 800ms). Change the screen color for each different note to make it visual!"}
  ]'::jsonb
);

-- Lesson 3: Sound Effects Machine
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0004-4000-8003-000000000001',
  '00000002-0004-4000-8000-000000000001',
  3,
  'Sound Effects Machine',
  'Use loops to create rising and falling sound effects with the buttons.',
  'Chip wants video game sounds! "You know those cool sounds in video games? Like when you get a power-up -- BWEEEOOP! Or when you lose -- bwoooop... Button A can be POWER UP with sounds going higher and higher, and Button B can be POWER DOWN going lower! Let''s make a sound effects machine!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Sound FX!", 25, 30, 0xFFFFFF)
M5.Lcd.drawString("A = Up", 20, 80, 0x00FF00)
M5.Lcd.drawString("B = Down", 20, 110, 0xFF0000)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        for i in range(8):
            M5.Speaker.tone(200 + i * 100, 80)
            M5.Lcd.fillScreen(0x00FF00)
            time.sleep(0.1)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("POWER UP!", 20, 60, 0x00FF00)
        time.sleep(0.5)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Sound FX!", 25, 30, 0xFFFFFF)
    if M5.BtnB.isPressed():
        for i in range(8):
            M5.Speaker.tone(900 - i * 100, 80)
            M5.Lcd.fillScreen(0xFF0000)
            time.sleep(0.1)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("POWER DOWN!", 10, 60, 0xFF0000)
        time.sleep(0.5)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Sound FX!", 25, 30, 0xFFFFFF)
    time.sleep(0.05)',
  '[
    {"order": 1, "text": "A power-up sound goes from low to high! Use a Repeat loop with 8 steps. Each step plays a tone that gets higher."},
    {"order": 2, "text": "Start the tone at 200 and add 100 each time through the loop. So: 200, 300, 400... up to 900! Use a short duration like 80ms for each beep."},
    {"order": 3, "text": "For Button A (power up): loop 8 times playing tone (200 + i*100) for 80ms. For Button B (power down): loop 8 times playing tone (900 - i*100). Flash the screen green or red!"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Band 2, Module 5: Tilt Games!
-- ---------------------------------------------------------------------------
INSERT INTO public.modules (id, band, order_num, title, description, icon)
VALUES (
  '00000002-0005-4000-8000-000000000001',
  2,
  5,
  'Tilt Games!',
  'Use the motion sensor to control what happens on screen! Build a tilt meter, balance a ball, and navigate a simple maze -- all by tilting your M5Stick!',
  'move'
);

-- Lesson 1: Tilt-o-Meter
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0005-4000-8001-000000000001',
  '00000002-0005-4000-8000-000000000001',
  1,
  'Tilt-o-Meter',
  'Read the accelerometer to show which way the M5Stick is tilting.',
  'Chip feels tipsy! "Whoooa, when you tilt me I can FEEL it! My motion sensor tells me which way I''m leaning. It''s like a seesaw! Tilt me left and I feel negative numbers, tilt me right and I feel positive numbers. Can you show my tilt on the screen? It''ll be like a spirit level!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'while True:
    M5.update()
    accel = Imu.read_accel()
    tilt = accel[0]
    M5.Lcd.fillScreen(0x000000)
    M5.Lcd.drawString("Tilt-o-Meter", 15, 10, 0xFFFFFF)
    if tilt > 0.3:
        M5.Lcd.drawString("RIGHT >>", 30, 70, 0x00FF00)
    if tilt < -0.3:
        M5.Lcd.drawString("<< LEFT", 30, 70, 0xFF0000)
    if tilt >= -0.3 and tilt <= 0.3:
        M5.Lcd.drawString("LEVEL!", 35, 70, 0xFFFF00)
    time.sleep(0.1)',
  '[
    {"order": 1, "text": "The tilt sensor is in the Sensors category! Drag out the Read Accelerometer block to get the tilt values."},
    {"order": 2, "text": "The X axis tells you left vs right tilt. Use If blocks to check: if tilt > 0.3 show \"RIGHT\", if tilt < -0.3 show \"LEFT\", otherwise show \"LEVEL!\""},
    {"order": 3, "text": "Put everything in a Forever loop. Each time: clear screen, read accelerometer X value, then use 3 If blocks to show RIGHT (green), LEFT (red), or LEVEL (yellow)!"}
  ]'::jsonb
);

-- Lesson 2: Balance Game
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0005-4000-8002-000000000001',
  '00000002-0005-4000-8000-000000000001',
  2,
  'Balance Game',
  'Tilt the M5Stick to keep a ball balanced in the center of the screen.',
  'Chip wants to play balance! "I have an idea for a game! There''s a ball on my screen and YOU have to keep it from falling off the edge by tilting me carefully! If you tilt too much, the ball rolls to the side. Can you keep it in the middle? Steady hands!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'ball_x = 67
ball_y = 120

while True:
    M5.update()
    accel = Imu.read_accel()

    M5.Lcd.fillCircle(ball_x, ball_y, 10, 0x000000)

    ball_x = ball_x + int(accel[0] * 5)
    if ball_x < 10:
        ball_x = 10
    if ball_x > 125:
        ball_x = 125

    M5.Lcd.fillScreen(0x000000)
    M5.Lcd.drawString("Balance!", 30, 10, 0xFFFFFF)

    if ball_x < 20 or ball_x > 115:
        M5.Lcd.fillCircle(ball_x, ball_y, 10, 0xFF0000)
    else:
        M5.Lcd.fillCircle(ball_x, ball_y, 10, 0x00FF00)

    time.sleep(0.05)',
  '[
    {"order": 1, "text": "Start with a variable ball_x set to 67 (the middle of the screen). In a Forever loop, read the accelerometer and add the tilt to ball_x."},
    {"order": 2, "text": "Multiply the tilt value by 5 to make the ball move faster. Add boundary checks so ball_x stays between 10 and 125 (the screen edges)."},
    {"order": 3, "text": "Draw the ball as a circle at (ball_x, 120). If ball_x is near the edge (less than 20 or more than 115), make the ball red. Otherwise green. Clear the screen each loop!"}
  ]'::jsonb
);

-- Lesson 3: Tilt Maze
INSERT INTO public.lessons (id, module_id, order_num, title, description, story_text, starter_blocks_xml, solution_code, hints)
VALUES (
  '00000002-0005-4000-8003-000000000001',
  '00000002-0005-4000-8000-000000000001',
  3,
  'Tilt Maze',
  'Navigate a dot through a maze by tilting the M5Stick to reach the goal.',
  'Chip is stuck in a maze! "HELP! I''m trapped in a maze! There are walls everywhere and I need to find the exit! The exit is the green square. Can you tilt me carefully to move the dot through the maze? Don''t hit the walls! This is like a real video game!"',
  '<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>',
  'dot_x = 15
dot_y = 30
goal_x = 100
goal_y = 200

while True:
    M5.update()
    accel = Imu.read_accel()

    M5.Lcd.fillScreen(0x000000)

    # Draw walls
    M5.Lcd.fillRect(0, 80, 90, 8, 0x808080)
    M5.Lcd.fillRect(45, 150, 90, 8, 0x808080)

    # Draw goal
    M5.Lcd.fillRect(goal_x, goal_y, 20, 20, 0x00FF00)

    # Move dot
    dot_x = dot_x + int(accel[0] * 3)
    dot_y = dot_y + int(accel[1] * 3)

    if dot_x < 5:
        dot_x = 5
    if dot_x > 130:
        dot_x = 130
    if dot_y < 5:
        dot_y = 5
    if dot_y > 235:
        dot_y = 235

    # Draw dot
    M5.Lcd.fillCircle(dot_x, dot_y, 5, 0xFFFF00)

    # Check goal
    if dot_x > goal_x and dot_x < goal_x + 20 and dot_y > goal_y and dot_y < goal_y + 20:
        M5.Lcd.fillScreen(0x00FF00)
        M5.Lcd.drawString("YOU WIN!", 25, 60, 0xFFFFFF)
        M5.Speaker.tone(880, 500)
        time.sleep(3.0)
        dot_x = 15
        dot_y = 30

    time.sleep(0.05)',
  '[
    {"order": 1, "text": "You need two variables: dot_x and dot_y for the ball position. Read the accelerometer and use both X and Y values to move the dot in two directions!"},
    {"order": 2, "text": "Draw gray rectangles as walls and a green rectangle as the goal. Move the dot by adding accel[0]*3 to dot_x and accel[1]*3 to dot_y."},
    {"order": 3, "text": "Add boundary checks (5 to 130 for X, 5 to 235 for Y). Check if the dot is inside the green goal square. If it is, show \"YOU WIN!\", play a victory tone, and reset the dot position!"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Badges
-- ---------------------------------------------------------------------------
INSERT INTO public.badges (id, name, description, icon, criteria)
VALUES
  (
    '00000000-0000-4000-b000-000000000001',
    'First Flash',
    'You flashed code to your M5Stick for the very first time! Welcome to the world of hardware programming!',
    'zap',
    '{"type": "device_flash", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000002',
    'Bug Squasher',
    'You found and fixed your first bug! Every great coder is also a great debugger.',
    'bug',
    '{"type": "bug_fix", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000003',
    'Creative Coder',
    'You saved 5 projects! You are building an amazing portfolio of creations.',
    'palette',
    '{"type": "projects_saved", "threshold": 5}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000004',
    'Sound Master',
    'You played 3 different tones on the buzzer! Your M5Stick is practically a musical instrument now!',
    'music',
    '{"type": "tones_played", "threshold": 3}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000005',
    'Artist',
    'You drew 10 shapes on the screen! Picasso would be proud of your tiny masterpieces!',
    'brush',
    '{"type": "shapes_drawn", "threshold": 10}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000006',
    'Loop Hero',
    'You used a loop for the first time! Loops are a coder''s superpower -- they save you from typing the same thing over and over!',
    'repeat',
    '{"type": "loop_used", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000007',
    'Shake Master',
    'You used the shake sensor! Now your M5Stick can feel your moves!',
    'vibrate',
    '{"type": "shake_used", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000008',
    'Dice Roller',
    'You built a dice roller! Board game night will never be the same!',
    'dice',
    '{"type": "random_used", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000009',
    'Music Maker',
    'You played a whole song! You''re a real composer now!',
    'headphones',
    '{"type": "song_played", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b000-000000000010',
    'Tilt Master',
    'You used the tilt sensor to control the screen! You''re gaming like a pro!',
    'move',
    '{"type": "tilt_used", "threshold": 1}'::jsonb
  );
