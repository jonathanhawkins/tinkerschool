/**
 * Typed lesson content for TinkerSchool curriculum.
 *
 * This file exports structured content for every lesson in the seed data.
 * Each lesson includes:
 *   - story_text: narrative featuring Chip the robot buddy (ages 7-8)
 *   - starter_blocks_xml: minimal Blockly XML to get kids started (NOT the full solution)
 *   - solution_code: valid MicroPython for the M5StickC Plus 2
 *   - hints: three progressively more helpful hints
 *
 * Block types reference the custom blocks defined in lib/blocks/m5stick-blocks.ts:
 *   m5_display_clear, m5_display_text, m5_display_rect, m5_display_circle,
 *   m5_buzzer_tone, m5_buzzer_off, m5_button_pressed, m5_led_set, m5_wait,
 *   m5_read_imu, m5_shake_detected, m5_random_number, m5_display_number
 *
 * Solution code uses the M5StickC Plus 2 MicroPython API:
 *   M5.Lcd.fillScreen(), M5.Lcd.drawString(), M5.Lcd.fillRect(),
 *   M5.Lcd.drawRect(), M5.Lcd.fillCircle(), M5.Lcd.drawCircle(),
 *   M5.Lcd.drawPixel(), M5.Speaker.tone(), M5.Speaker.stop(),
 *   M5.BtnA.isPressed(), M5.BtnB.isPressed(), Power.led(), time.sleep()
 *
 * The wrap-m5stick.ts wrapper prepends standard imports (M5, time, etc.) and
 * appends the `while True: M5.update()` loop, so solution_code here contains
 * only the user-written portion.
 */

import type { LessonHint } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Helper type -- everything the seed needs minus server-generated fields
// ---------------------------------------------------------------------------

export interface LessonContent {
  /** Deterministic UUID matching the seed SQL */
  id: string;
  /** Foreign key to the parent module */
  module_id: string;
  /** Display order within the module */
  order_num: number;
  /** Lesson title shown in the UI */
  title: string;
  /** Short description for the lesson card */
  description: string;
  /** Chip's story narrative kids read before coding */
  story_text: string;
  /** Minimal Blockly XML for the starter workspace (1-2 blocks) */
  starter_blocks_xml: string;
  /** Complete MicroPython solution (user-code portion only) */
  solution_code: string;
  /** Three progressive hints */
  hints: LessonHint[];
}

// ---------------------------------------------------------------------------
// Module IDs (must match seed.sql UUIDs)
// ---------------------------------------------------------------------------

export const MODULE_IDS = {
  B2M1_HELLO_M5STICK: "00000002-0001-4000-8000-000000000001",
  B2M2_DRAWING_FUN: "00000002-0002-4000-8000-000000000001",
  B2M3_SHAKE_AND_COUNT: "00000002-0003-4000-8000-000000000001",
  B2M4_DJ_STICK: "00000002-0004-4000-8000-000000000001",
  B2M5_TILT_GAMES: "00000002-0005-4000-8000-000000000001",
} as const;

// ---------------------------------------------------------------------------
// Band 2, Module 1: "Hello M5Stick!"
// ---------------------------------------------------------------------------

export const b2m1_lesson1_lightItUp: LessonContent = {
  id: "00000002-0001-4000-8001-000000000001",
  module_id: MODULE_IDS.B2M1_HELLO_M5STICK,
  order_num: 1,
  title: "Light It Up",
  description: "Turn on the display and show text on your M5StickC Plus 2.",
  story_text:
    "Chip blinks his tiny eyes open and looks around. Everything is dark! " +
    '"Hey, is anybody there?" he whispers. "It\'s so dark in here... ' +
    "I can't see a thing! Can you help me turn on my screen? " +
    'I bet we can make it glow!" Help Chip light up his display ' +
    "by writing your very first program!",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Hello World!", 10, 50, 0xFFFFFF)`,
  hints: [
    {
      order: 1,
      text: "First, you need to clear the screen. Look for the Display Clear block in the toolbox!",
    },
    {
      order: 2,
      text: 'Now add a Display Text block after the clear block. Type your message where it says "Hello!"',
    },
    {
      order: 3,
      text: 'Connect the Clear Display block to the Display Text block. Set x to 10 and y to 50, then type any message you like!',
    },
  ],
};

export const b2m1_lesson2_colorMyWorld: LessonContent = {
  id: "00000002-0001-4000-8002-000000000001",
  module_id: MODULE_IDS.B2M1_HELLO_M5STICK,
  order_num: 2,
  title: "Color My World",
  description: "Draw colored shapes on the display using rectangles and circles.",
  story_text:
    "Chip is bouncing up and down with excitement. " +
    '"Wow, you turned on the screen! That was amazing! ' +
    "But it's a bit boring with just words, don't you think? " +
    "I LOVE colors! Red, blue, green -- all of them! " +
    "Can you help me paint some shapes on my tiny screen? " +
    'Let\'s make it look like a rainbow party!" Time to become a digital artist!',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.fillRect(10, 10, 50, 50, 0xFF0000)
M5.Lcd.fillRect(70, 10, 50, 50, 0x0000FF)
M5.Lcd.fillCircle(67, 100, 25, 0x00FF00)`,
  hints: [
    {
      order: 1,
      text: "Start by clearing the screen with a dark background. Then look in the Display category for shape blocks!",
    },
    {
      order: 2,
      text: "Drag out a Draw Rectangle block. You need to set x, y, width, and height numbers. Try x=10, y=10, width=50, height=50!",
    },
    {
      order: 3,
      text: "Add a rectangle with x=10, y=10, width=50, height=50 in red. Then add another rectangle and a circle with different colors!",
    },
  ],
};

export const b2m1_lesson3_buttonMagic: LessonContent = {
  id: "00000002-0001-4000-8003-000000000001",
  module_id: MODULE_IDS.B2M1_HELLO_M5STICK,
  order_num: 3,
  title: "Button Magic",
  description: "React to button presses to make things happen on screen.",
  story_text:
    "Chip is poking at the two little buttons on the M5Stick. " +
    '"Hey, what do these clicky things do? ' +
    "I pressed one and nothing happened! That's no fun at all. " +
    "I bet YOU can make them do something awesome. " +
    "What if pressing Button A made the screen turn red, " +
    "and Button B made it turn blue? That would be SO COOL!\" " +
    "Let's wire up the buttons to make Chip happy!",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Press a button!", 10, 50, 0xFFFFFF)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        M5.Lcd.fillScreen(0xFF0000)
        M5.Lcd.drawString("Button A!", 20, 100, 0xFFFFFF)
    if M5.BtnB.isPressed():
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString("Button B!", 20, 100, 0xFFFFFF)
    time.sleep(0.1)`,
  hints: [
    {
      order: 1,
      text: "You need a Forever loop to keep checking the buttons. Look in the Loops category for one!",
    },
    {
      order: 2,
      text: 'Inside the loop, add an If block from Logic. Then put a "Button A pressed?" block from the Buttons category as the condition.',
    },
    {
      order: 3,
      text: "Put a Clear Display (red) and Display Text block inside the If for Button A. Then add another If block for Button B with blue!",
    },
  ],
};

export const b2m1_lesson4_beepBoop: LessonContent = {
  id: "00000002-0001-4000-8004-000000000001",
  module_id: MODULE_IDS.B2M1_HELLO_M5STICK,
  order_num: 4,
  title: "Beep Boop",
  description: "Make the buzzer play tones and musical notes.",
  story_text:
    "Chip is humming to himself. Well, trying to -- but no sound comes out! " +
    '"I have a tiny speaker inside me, but I don\'t know how to use it! ' +
    "Can you help me make some sounds? I want to play music! " +
    "Maybe we could play a little song -- like do, re, mi! " +
    "Different numbers make different notes. Big numbers are high and squeaky, " +
    'small numbers are low and rumbly. Let\'s make some noise!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
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
</xml>`,
  solution_code: `# Play "do re mi" - three notes!
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
M5.Lcd.drawString("Music time!", 10, 50, 0xFFFF00)`,
  hints: [
    {
      order: 1,
      text: "Open the Sound category and drag out a Play Tone block. The first number is how high or low the sound is!",
    },
    {
      order: 2,
      text: "To play more than one note, add a Wait block between each Play Tone block so the notes don't all happen at once. Try 0.6 seconds!",
    },
    {
      order: 3,
      text: "Use these numbers for a musical scale: 262 (do), 294 (re), 330 (mi), 349 (fa), 392 (so). Put a Wait block after each tone!",
    },
  ],
};

export const b2m1_lesson5_ledLightShow: LessonContent = {
  id: "00000002-0001-4000-8005-000000000001",
  module_id: MODULE_IDS.B2M1_HELLO_M5STICK,
  order_num: 5,
  title: "LED Light Show",
  description: "Control the built-in LED to create a colorful light show.",
  story_text:
    "Chip gasps. \"Did you know I have a secret light hidden inside me? " +
    "It's called an LED and it can glow in different colors! " +
    "Red... green... blue... it's like a tiny traffic light! " +
    "But right now it's turned off and I feel kind of dim. " +
    "Can you make it blink and change colors? " +
    "Let's put on a LIGHT SHOW! We can make it flash " +
    'red, then green, then blue, over and over. Disco time!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_led_set" x="20" y="20">
    <field name="COLOR">red</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
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
M5.Lcd.drawString("Show over!", 15, 50, 0xFFFFFF)`,
  hints: [
    {
      order: 1,
      text: "Find the LED category and drag out a Set LED block. Pick a color and see what happens! Then add a Wait block after it.",
    },
    {
      order: 2,
      text: 'To make it blink, set the LED to a color, wait, then set it to a different color. Try red, wait, green, wait, blue, wait! You can use a "repeat" loop to do it more than once.',
    },
    {
      order: 3,
      text: "Use a Repeat loop set to 3 times. Inside, put: Set LED red, Wait 0.5 sec, Set LED green, Wait 0.5 sec, Set LED blue, Wait 0.5 sec. End with Set LED off!",
    },
  ],
};

// ---------------------------------------------------------------------------
// Band 2, Module 2: "Drawing Fun!"
// ---------------------------------------------------------------------------

export const b2m2_lesson1_pixelArt: LessonContent = {
  id: "00000002-0002-4000-8001-000000000001",
  module_id: MODULE_IDS.B2M2_DRAWING_FUN,
  order_num: 1,
  title: "Pixel Art",
  description: "Draw individual pixels to make simple images on the tiny screen.",
  story_text:
    "Chip squints at the screen. \"Did you know this screen is made of " +
    "teeny tiny dots called pixels? Each one can be any color! " +
    "It's like having a super tiny piece of graph paper. " +
    "If you color in the right dots, you can draw anything -- " +
    "a heart, a star, even a little smiley face! " +
    "Let's start small and draw a simple picture using just dots. " +
    'I want to see a heart! Can you make one for me?"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Pixel Heart!", 20, 10, 0xFFFFFF)

# Draw a pixel-art heart using small filled rectangles as "big pixels"
# Each "pixel" is 10x10 so it's visible on the small screen
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
M5.Lcd.fillRect(47, 90, p, p, 0xFF0000)`,
  hints: [
    {
      order: 1,
      text: "Start with a Clear Display block to make the background black. Then use Draw Rectangle blocks to draw small squares -- those are your pixels!",
    },
    {
      order: 2,
      text: "Make each rectangle small (like 10 wide and 10 tall) and pick a color. Place them next to each other by changing the x and y numbers by 10 each time.",
    },
    {
      order: 3,
      text: "To make a heart: put two red squares at the top for the bumps, then make each row below a little wider, then narrower toward the bottom. Use width=10, height=10 for each pixel!",
    },
  ],
};

export const b2m2_lesson2_shapePainter: LessonContent = {
  id: "00000002-0002-4000-8002-000000000001",
  module_id: MODULE_IDS.B2M2_DRAWING_FUN,
  order_num: 2,
  title: "Shape Painter",
  description: "Combine rectangles and circles to make pictures.",
  story_text:
    "Chip claps his hands. \"Those pixels were awesome, but you know what? " +
    "We have SHAPE superpowers too! We can draw big rectangles and circles " +
    "in one go -- no need to place each pixel! " +
    "I dare you to draw a picture using just shapes. " +
    "Maybe a house? A rectangle for the walls, a triangle... " +
    "well, we don't have triangles yet, but we can fake it! " +
    "Or how about a robot face? Rectangles for the head, " +
    'circles for the eyes! Let\'s get creative!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_rect" x="20" y="60">
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
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)

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

M5.Lcd.drawString("I'm a robot!", 20, 150, 0xFFFFFF)`,
  hints: [
    {
      order: 1,
      text: "The starter gives you a head shape. Now add circles for eyes! Look for the Draw Circle block in the Display category.",
    },
    {
      order: 2,
      text: "For the eyes, put two circles inside the yellow rectangle. Try x=47, y=70, radius=12 for the left eye, and x=87, y=70 for the right eye!",
    },
    {
      order: 3,
      text: "Add blue circles for eyes (radius 12), tiny black circles inside for pupils (radius 5), a red rectangle for the mouth (x=40, y=105, width=55, height=12), and a green rectangle on top for the antenna!",
    },
  ],
};

export const b2m2_lesson3_animationStation: LessonContent = {
  id: "00000002-0002-4000-8003-000000000001",
  module_id: MODULE_IDS.B2M2_DRAWING_FUN,
  order_num: 3,
  title: "Animation Station",
  description: "Use loops to create simple animations on the screen.",
  story_text:
    "Chip's eyes go wide. \"You know what's even cooler than a picture? " +
    "A picture that MOVES! That's called animation! " +
    "Cartoons work by showing lots of pictures really fast. " +
    "We can do the same thing! Draw something, wait a tiny bit, " +
    "erase it, draw it somewhere new -- WHOOSH, it's moving! " +
    "Let's make a ball that bounces across the screen. " +
    "We'll use a special LOOP that repeats our code over and over. " +
    'Ready? Let\'s bring our screen to life!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
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
M5.Lcd.drawString("Hooray!", 40, 160, 0xFFFF00)`,
  hints: [
    {
      order: 1,
      text: "An animation needs a loop! Find the Repeat block in the Loops category. Inside the loop, draw a circle, wait, then clear the screen.",
    },
    {
      order: 2,
      text: "To make the ball move, you need to change where you draw it each time. Instead of erasing the whole screen, draw a black circle where the old ball was, then draw a green circle at the new spot.",
    },
    {
      order: 3,
      text: "Use a Repeat loop set to 25 times. Inside: draw a black circle at the old position to erase it, then draw a green circle 5 pixels to the right. Add a Wait of 0.1 seconds so you can see it move!",
    },
  ],
};

// ---------------------------------------------------------------------------
// Band 2, Module 3: "Shake & Count!"
// ---------------------------------------------------------------------------

export const b2m3_lesson1_shakeItUp: LessonContent = {
  id: "00000002-0003-4000-8001-000000000001",
  module_id: MODULE_IDS.B2M3_SHAKE_AND_COUNT,
  order_num: 1,
  title: "Shake It Up!",
  description: "Use the shake sensor to detect when you shake the device.",
  story_text:
    "Chip is wiggling around. \"Whoa, wait a second... I just felt something! " +
    "I think I have a sensor inside me that can feel when I MOVE! " +
    "It's like having a tummy that feels butterflies! " +
    "Try shaking me -- go ahead, give me a good wiggle! " +
    "I bet we can make something happen on my screen when you shake me. " +
    "Like a message that says SHAKE! every time you do it! " +
    'This is going to be SO much fun! Ready? Shake shake shake!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Shake me!", 20, 50, 0xFFFFFF)

while True:
    M5.update()
    if shake_detected():
        M5.Lcd.fillScreen(0xFFFF00)
        M5.Lcd.drawString("SHAKE!", 30, 100, 0xFF0000)
        time.sleep(0.5)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shake me!", 20, 50, 0xFFFFFF)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "You need a Forever loop to keep checking if the device was shaken. Look in the Loops category!",
    },
    {
      order: 2,
      text: 'Inside the loop, add an If block. For the condition, look in the Sensors category for the "Shake Detected?" block!',
    },
    {
      order: 3,
      text: 'Put a Clear Display (yellow) and Display Text "SHAKE!" inside the If block. Add a Wait of 0.5 seconds, then clear back to black so it flashes each time you shake!',
    },
  ],
};

export const b2m3_lesson2_countingShakes: LessonContent = {
  id: "00000002-0003-4000-8002-000000000001",
  module_id: MODULE_IDS.B2M3_SHAKE_AND_COUNT,
  order_num: 2,
  title: "Counting Shakes",
  description: "Use a variable to count how many times you shake the device.",
  story_text:
    "Chip is thinking hard. \"Okay, so I can FEEL shakes now -- that's awesome! " +
    "But I want to know HOW MANY times you shake me. " +
    "Like, was that 5 shakes? Or 10? Or a MILLION? " +
    "We need something called a VARIABLE. " +
    "It's like a little box that holds a number for us. " +
    "Every time you shake me, we add 1 to the box! " +
    "Then we can show the number on my screen. " +
    "Ready to count? Let's see how high you can go!\"",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">Shake me!</field>
          </shadow>
        </value>
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">20</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">30</field>
          </shadow>
        </value>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Shake me!", 20, 30, 0xFFFFFF)

count = 0

while True:
    M5.update()
    if shake_detected():
        count = count + 1
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shakes:", 20, 30, 0xFFFFFF)
        M5.Lcd.drawString(str(count), 50, 80, 0x00FF00)
        time.sleep(0.3)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "First, you need a variable to keep count! Go to the Variables category and create a new variable called \"count\". Set it to 0 before the loop starts.",
    },
    {
      order: 2,
      text: "Inside the loop, add an If block with \"Shake Detected?\" as the condition. When shaken, change the count variable by 1!",
    },
    {
      order: 3,
      text: "After changing count by 1, clear the display and use a Display Number block to show the count on screen. Add a short Wait of 0.3 seconds so it doesn't count too fast!",
    },
  ],
};

export const b2m3_lesson3_diceRoller: LessonContent = {
  id: "00000002-0003-4000-8003-000000000001",
  module_id: MODULE_IDS.B2M3_SHAKE_AND_COUNT,
  order_num: 3,
  title: "Dice Roller",
  description: "Shake the device to roll a random number like a dice!",
  story_text:
    "Chip is bouncing with excitement. \"I want to play a board game, " +
    "but oh no -- I can't find the dice anywhere! " +
    "Wait... I have an idea! What if YOU could turn me into a dice? " +
    "Every time you shake me, I show a random number from 1 to 6! " +
    "It's like magic but it's actually MATH! " +
    "There's a special trick called RANDOM that picks a surprise number. " +
    "You never know what you'll get! " +
    "Shake me and let's see what number pops up! Game on!\"",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">Shake to roll!</field>
          </shadow>
        </value>
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">30</field>
          </shadow>
        </value>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Shake to roll!", 10, 30, 0xFFFFFF)

while True:
    M5.update()
    if shake_detected():
        roll = random.randint(1, 6)
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString(str(roll), 50, 80, 0xFFFFFF)
        M5.Speaker.tone(800, 200)
        time.sleep(0.3)
        M5.Speaker.stop()
        time.sleep(1.0)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Shake to roll!", 10, 30, 0xFFFFFF)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "You need a Forever loop with an If block checking for shakes -- just like the last lesson! But this time, instead of counting, we'll pick a random number.",
    },
    {
      order: 2,
      text: "Look in the Math category for the Random Number block. Set the minimum to 1 and the maximum to 6 -- just like a real dice!",
    },
    {
      order: 3,
      text: "When shaken: save a random number (1-6) in a variable, clear the screen to blue, display the number big in the center, and play a short beep! Wait 1 second, then reset the screen.",
    },
  ],
};

export const b2m3_lesson4_magic8Ball: LessonContent = {
  id: "00000002-0003-4000-8004-000000000001",
  module_id: MODULE_IDS.B2M3_SHAKE_AND_COUNT,
  order_num: 4,
  title: "Magic 8-Ball",
  description: "Shake to get a random fortune! Combine random numbers with messages.",
  story_text:
    "Chip puts on a tiny wizard hat. \"Greetings, young one! " +
    "I am Chip the Magnificent, the all-knowing fortune teller! " +
    "Ask me any question, then give me a shake, " +
    "and I shall reveal the answer! Will it be YES? Will it be NO? " +
    "Maybe... DEFINITELY! Or perhaps... ASK AGAIN LATER! " +
    "I have 8 different answers hiding inside me. " +
    "Which one will YOU get? There's only one way to find out... " +
    'Shake me and discover your fortune!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">Ask a question...</field>
          </shadow>
        </value>
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Ask a question...", 5, 50, 0xFFFFFF)
M5.Lcd.drawString("Then shake me!", 10, 80, 0xCCCCCC)

while True:
    M5.update()
    if shake_detected():
        answer = random.randint(0, 7)
        M5.Speaker.tone(600, 300)
        time.sleep(0.4)
        M5.Speaker.stop()

        if answer == 0:
            M5.Lcd.fillScreen(0x00FF00)
            M5.Lcd.drawString("YES!", 40, 80, 0xFFFFFF)
        elif answer == 1:
            M5.Lcd.fillScreen(0xFF0000)
            M5.Lcd.drawString("NO WAY!", 25, 80, 0xFFFFFF)
        elif answer == 2:
            M5.Lcd.fillScreen(0x0000FF)
            M5.Lcd.drawString("MAYBE...", 20, 80, 0xFFFFFF)
        elif answer == 3:
            M5.Lcd.fillScreen(0xFFFF00)
            M5.Lcd.drawString("DEFINITELY!", 5, 80, 0x000000)
        elif answer == 4:
            M5.Lcd.fillScreen(0xFF00FF)
            M5.Lcd.drawString("ASK AGAIN", 10, 80, 0xFFFFFF)
        elif answer == 5:
            M5.Lcd.fillScreen(0x00FFFF)
            M5.Lcd.drawString("YOU BET!", 20, 80, 0x000000)
        elif answer == 6:
            M5.Lcd.fillScreen(0xFF8800)
            M5.Lcd.drawString("NOT SURE", 15, 80, 0xFFFFFF)
        else:
            M5.Lcd.fillScreen(0x8800FF)
            M5.Lcd.drawString("TRY LATER", 10, 80, 0xFFFFFF)

        time.sleep(2.0)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Ask a question...", 5, 50, 0xFFFFFF)
        M5.Lcd.drawString("Then shake me!", 10, 80, 0xCCCCCC)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "Start like the Dice Roller: a Forever loop that checks for shakes. But this time, pick a random number from 0 to 7 (that's 8 different answers!).",
    },
    {
      order: 2,
      text: "Use an If/Else If chain to check what number was picked. For each number (0, 1, 2...), show a different answer and background color!",
    },
    {
      order: 3,
      text: "For each answer: clear the screen to a fun color, then display the fortune text. Try: YES! (green), NO WAY! (red), MAYBE... (blue), DEFINITELY! (yellow), and more. Wait 2 seconds, then reset!",
    },
  ],
};

// ---------------------------------------------------------------------------
// Band 2, Module 4: "DJ Stick!"
// ---------------------------------------------------------------------------

export const b2m4_lesson1_myFirstPiano: LessonContent = {
  id: "00000002-0004-4000-8001-000000000001",
  module_id: MODULE_IDS.B2M4_DJ_STICK,
  order_num: 1,
  title: "My First Piano",
  description: "Turn buttons into piano keys that play different notes!",
  story_text:
    "Chip starts humming a tune. \"La la laaaa... oh! I just had the BEST idea! " +
    "What if we turned my buttons into PIANO KEYS? " +
    "Button A could play one note, and Button B plays a different one! " +
    "That way I can make REAL music! " +
    "Low notes have small numbers like 262, and high notes have big numbers like 330. " +
    "Each number makes a different sound -- it's like magic! " +
    "Press my buttons and let's hear what I sound like as a piano! " +
    'I bet I sound amazing! Ready, maestro?"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">Press buttons!</field>
          </shadow>
        </value>
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <field name="COLOR">white</field>
      </block>
    </next>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Press buttons!", 10, 50, 0xFFFFFF)
M5.Lcd.drawString("A = C note", 20, 100, 0x00FF00)
M5.Lcd.drawString("B = E note", 20, 130, 0x0000FF)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        M5.Speaker.tone(262, 300)
        M5.Lcd.fillScreen(0x00FF00)
        M5.Lcd.drawString("C note!", 30, 80, 0xFFFFFF)
        time.sleep(0.35)
        M5.Speaker.stop()
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Press buttons!", 10, 50, 0xFFFFFF)
    if M5.BtnB.isPressed():
        M5.Speaker.tone(330, 300)
        M5.Lcd.fillScreen(0x0000FF)
        M5.Lcd.drawString("E note!", 30, 80, 0xFFFFFF)
        time.sleep(0.35)
        M5.Speaker.stop()
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Press buttons!", 10, 50, 0xFFFFFF)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "You need a Forever loop with two If blocks inside -- one for Button A and one for Button B. Check the Buttons category!",
    },
    {
      order: 2,
      text: "Inside each If block, use a Play Tone block from the Sound category. Try 262 for Button A (that's the C note) and 330 for Button B (that's the E note)!",
    },
    {
      order: 3,
      text: "For each button: play the tone (262 or 330), change the screen color, show which note is playing, wait 0.35 seconds, then clear back. Don't forget to stop the buzzer!",
    },
  ],
};

export const b2m4_lesson2_songPlayer: LessonContent = {
  id: "00000002-0004-4000-8002-000000000001",
  module_id: MODULE_IDS.B2M4_DJ_STICK,
  order_num: 2,
  title: "Song Player",
  description: "Program a sequence of notes to play a famous melody!",
  story_text:
    "Chip is tapping his feet. \"Playing one note at a time is fun, " +
    "but you know what's even BETTER? Playing a whole SONG! " +
    "Do you know Twinkle Twinkle Little Star? " +
    "It goes: C C G G A A G -- that's just 7 notes! " +
    "Each note is a number: C is 262, G is 392, A is 440. " +
    "If we play them in order with little pauses between, " +
    "it sounds like a real song! " +
    "Let's program the melody and have a concert! Maestro, begin!\"",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_buzzer_tone" x="20" y="20">
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
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Twinkle Twinkle", 5, 20, 0xFFFF00)

# C C G G A A G
M5.Lcd.drawString("C", 55, 80, 0x00FF00)
M5.Speaker.tone(262, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("C", 55, 80, 0x00FF00)
M5.Speaker.tone(262, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("G", 55, 80, 0x0000FF)
M5.Speaker.tone(392, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("G", 55, 80, 0x0000FF)
M5.Speaker.tone(392, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("A", 55, 80, 0xFF0000)
M5.Speaker.tone(440, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("A", 55, 80, 0xFF0000)
M5.Speaker.tone(440, 400)
time.sleep(0.5)

M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("G", 55, 80, 0xFFFF00)
M5.Speaker.tone(392, 800)
time.sleep(1.0)

M5.Speaker.stop()
M5.Lcd.fillRect(0, 70, 135, 30, 0x000000)
M5.Lcd.drawString("Bravo!", 35, 120, 0xFFFFFF)`,
  hints: [
    {
      order: 1,
      text: "Start with the C note (262) that's already in your starter block. Now add a Wait block after it, then another Play Tone block for the next note!",
    },
    {
      order: 2,
      text: "The melody is: C C G G A A G. In numbers that's: 262, 262, 392, 392, 440, 440, 392. Put a Wait of 0.5 seconds between each note!",
    },
    {
      order: 3,
      text: "Chain all 7 tone blocks with waits between them. For each note, add a Display Text block to show the note name (C, G, or A). Make the last G note longer (800ms) for a grand finish!",
    },
  ],
};

export const b2m4_lesson3_soundEffects: LessonContent = {
  id: "00000002-0004-4000-8003-000000000001",
  module_id: MODULE_IDS.B2M4_DJ_STICK,
  order_num: 3,
  title: "Sound Effects Machine",
  description: "Use loops to create rising and falling sound effects with buttons!",
  story_text:
    "Chip jumps up and down. \"You know those cool sounds in video games? " +
    "Like when you grab a power-up and it goes bweee-OOP! " +
    "Or when you fall in a pit and it goes wooooo-OP! " +
    "Those are made by playing notes that go UP or DOWN really fast! " +
    "We can use a LOOP to play lots of beeps, " +
    "each one a little higher or lower than the last. " +
    "Button A = POWER UP! Button B = POWER DOWN! " +
    "Let's make the coolest sound effects ever!\"",
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Sound FX!", 20, 30, 0xFFFFFF)
M5.Lcd.drawString("A = Power Up", 10, 80, 0x00FF00)
M5.Lcd.drawString("B = Power Down", 5, 110, 0xFF0000)

while True:
    M5.update()
    if M5.BtnA.isPressed():
        # Power up! Rising frequency
        freq = 200
        for i in range(7):
            M5.Speaker.tone(freq, 100)
            M5.Lcd.fillScreen(0x000000 + (i * 0x003300))
            M5.Lcd.drawString("POWER UP!", 15, 80, 0xFFFFFF)
            time.sleep(0.12)
            freq = freq + 100
        M5.Speaker.stop()
        time.sleep(0.3)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Sound FX!", 20, 30, 0xFFFFFF)
    if M5.BtnB.isPressed():
        # Power down! Falling frequency
        freq = 800
        for i in range(7):
            M5.Speaker.tone(freq, 100)
            M5.Lcd.fillScreen(0x000000 + (i * 0x330000))
            M5.Lcd.drawString("POWER DOWN!", 5, 80, 0xFFFFFF)
            time.sleep(0.12)
            freq = freq - 100
        M5.Speaker.stop()
        time.sleep(0.3)
        M5.Lcd.fillScreen(0x000000)
        M5.Lcd.drawString("Sound FX!", 20, 30, 0xFFFFFF)
    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "Start with a Forever loop checking both buttons. For Button A, you'll need a Repeat loop INSIDE the If block to play several beeps going up!",
    },
    {
      order: 2,
      text: "For the power-up sound: create a variable called \"freq\" and set it to 200. In a Repeat loop (7 times), play a tone at freq, then add 100 to freq. Each beep gets higher!",
    },
    {
      order: 3,
      text: "For Button A: start freq at 200, loop 7 times adding 100 each time (200, 300, 400...). For Button B: start at 800 and subtract 100 each time (800, 700, 600...). Change the screen color each loop too!",
    },
  ],
};

// ---------------------------------------------------------------------------
// Band 2, Module 5: "Tilt Games!"
// ---------------------------------------------------------------------------

export const b2m5_lesson1_tiltOMeter: LessonContent = {
  id: "00000002-0005-4000-8001-000000000001",
  module_id: MODULE_IDS.B2M5_TILT_GAMES,
  order_num: 1,
  title: "Tilt-o-Meter",
  description: "Read tilt sensor values and display which way the device is tilting!",
  story_text:
    "Chip wobbles back and forth. \"Whoooa! Did you know I can feel which way " +
    "I'm tilting? It's like standing on a seesaw! " +
    "When I tilt LEFT, I feel a number going one way, " +
    "and when I tilt RIGHT, the number goes the other way! " +
    "It's my special tilt sensor -- also called an IMU. " +
    "Fancy name, right? Let's make a program that shows " +
    "the tilt numbers on my screen! Tilt me left, tilt me right, " +
    'and watch the numbers change! Science is SO cool!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Tilt-o-Meter!", 10, 10, 0xFFFFFF)

while True:
    M5.update()
    tilt_x = Imu.read_accel()[0]

    M5.Lcd.fillRect(0, 50, 135, 190, 0x000000)

    M5.Lcd.drawString("Tilt: " + str(round(tilt_x, 1)), 10, 60, 0x00FFFF)

    if tilt_x < -0.3:
        M5.Lcd.fillRect(0, 120, 135, 40, 0x0000FF)
        M5.Lcd.drawString("LEFT!", 35, 130, 0xFFFFFF)
    elif tilt_x > 0.3:
        M5.Lcd.fillRect(0, 120, 135, 40, 0xFF0000)
        M5.Lcd.drawString("RIGHT!", 30, 130, 0xFFFFFF)
    else:
        M5.Lcd.fillRect(0, 120, 135, 40, 0x00FF00)
        M5.Lcd.drawString("LEVEL!", 30, 130, 0x000000)

    time.sleep(0.1)`,
  hints: [
    {
      order: 1,
      text: "You need a Forever loop that reads the tilt sensor on every pass. Look in the Sensors category for the Read IMU block and pick the X axis!",
    },
    {
      order: 2,
      text: "Save the tilt reading in a variable. Then use a Display Number block to show it on screen. Clear the display area each time so the old number disappears!",
    },
    {
      order: 3,
      text: "Add If/Else If blocks: if tilt is less than -0.3, show \"LEFT!\" on a blue background. If greater than 0.3, show \"RIGHT!\" on red. Otherwise show \"LEVEL!\" on green. This way you can see which way you're tilting!",
    },
  ],
};

export const b2m5_lesson2_balanceGame: LessonContent = {
  id: "00000002-0005-4000-8002-000000000001",
  module_id: MODULE_IDS.B2M5_TILT_GAMES,
  order_num: 2,
  title: "Balance Game",
  description: "Keep a ball centered on screen by carefully tilting the device!",
  story_text:
    "Chip has a big green ball on his screen. \"Oh no! This ball keeps rolling around! " +
    "When I tilt one way, it slides over. When I tilt the other way, it slides back! " +
    "Can you hold me REALLY steady and keep the ball in the middle? " +
    "It's like balancing a marble on a plate! " +
    "If the ball gets too close to the edge, it turns RED -- danger zone! " +
    "But if you keep it in the center, it stays GREEN -- safe! " +
    "How long can you keep it balanced? " +
    'This is my favorite game! Steady hands, steady hands..."',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
    <next>
      <block type="m5_display_circle">
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">67</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">120</field>
          </shadow>
        </value>
        <value name="RADIUS">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <field name="COLOR">green</field>
        <field name="FILL">TRUE</field>
      </block>
    </next>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Balance!", 30, 10, 0xFFFFFF)

ball_x = 67

while True:
    M5.update()
    tilt_x = Imu.read_accel()[0]

    # Erase old ball
    M5.Lcd.fillCircle(int(ball_x), 120, 12, 0x000000)

    # Move ball based on tilt
    ball_x = ball_x + tilt_x * 10

    # Keep ball on screen
    if ball_x < 12:
        ball_x = 12
    if ball_x > 123:
        ball_x = 123

    # Color based on position (red near edges, green in center)
    if ball_x < 25 or ball_x > 110:
        color = 0xFF0000
    else:
        color = 0x00FF00

    # Draw ball at new position
    M5.Lcd.fillCircle(int(ball_x), 120, 12, color)

    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "Create a variable called \"ball_x\" and set it to 67 (the center of the screen). In a Forever loop, read the X tilt and add it to ball_x to move the ball!",
    },
    {
      order: 2,
      text: "Each loop: erase the old ball (draw a black circle at the old position), update ball_x based on tilt, then draw a new green circle at the new position!",
    },
    {
      order: 3,
      text: "Add If blocks to stop the ball at the edges (if ball_x < 12, set it to 12; if ball_x > 123, set it to 123). Change the ball color to red when it's near the edges (below 25 or above 110)!",
    },
  ],
};

export const b2m5_lesson3_tiltMaze: LessonContent = {
  id: "00000002-0005-4000-8003-000000000001",
  module_id: MODULE_IDS.B2M5_TILT_GAMES,
  order_num: 3,
  title: "Tilt Maze",
  description: "Guide a dot through a maze by tilting the device to reach the goal!",
  story_text:
    "Chip looks worried. \"Oh no, I'm stuck in a MAZE! " +
    "There are walls everywhere and I need to find the exit! " +
    "The exit is the GREEN square over there -- can you see it? " +
    "If you tilt me carefully, I can slide through the gaps. " +
    "But watch out for the walls! They're the red rectangles. " +
    "You need to tilt left and right AND up and down " +
    "to guide me through! It's like being a hamster in a maze, " +
    'but way more fun! Help me escape! You can do it!"',
  starter_blocks_xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="m5_display_clear" x="20" y="20">
    <field name="COLOR">black</field>
  </block>
</xml>`,
  solution_code: `M5.Lcd.fillScreen(0x000000)
M5.Lcd.drawString("Tilt Maze!", 20, 5, 0xFFFFFF)

# Draw walls (red rectangles)
M5.Lcd.fillRect(40, 40, 5, 80, 0xFF0000)
M5.Lcd.fillRect(80, 80, 5, 100, 0xFF0000)
M5.Lcd.fillRect(0, 140, 60, 5, 0xFF0000)

# Draw goal (green square)
M5.Lcd.fillRect(110, 200, 20, 20, 0x00FF00)

# Player position
px = 10
py = 30

while True:
    M5.update()
    tilt_x = Imu.read_accel()[0]
    tilt_y = Imu.read_accel()[1]

    # Erase old position
    M5.Lcd.fillCircle(int(px), int(py), 5, 0x000000)

    # Move based on tilt
    px = px + tilt_x * 5
    py = py + tilt_y * 5

    # Keep on screen
    if px < 5:
        px = 5
    if px > 130:
        px = 130
    if py < 25:
        py = 25
    if py > 235:
        py = 235

    # Draw player
    M5.Lcd.fillCircle(int(px), int(py), 5, 0xFFFF00)

    # Check if reached goal
    if px > 110 and py > 200:
        M5.Lcd.fillScreen(0x00FF00)
        M5.Lcd.drawString("YOU WIN!", 20, 100, 0xFFFFFF)
        M5.Speaker.tone(880, 500)
        time.sleep(2.0)
        M5.Speaker.stop()
        break

    # Redraw walls (in case ball erased part)
    M5.Lcd.fillRect(40, 40, 5, 80, 0xFF0000)
    M5.Lcd.fillRect(80, 80, 5, 100, 0xFF0000)
    M5.Lcd.fillRect(0, 140, 60, 5, 0xFF0000)

    time.sleep(0.05)`,
  hints: [
    {
      order: 1,
      text: "First draw the maze walls using red rectangles, and a green square for the goal. Then make two variables: px and py for the player's position!",
    },
    {
      order: 2,
      text: "In a Forever loop, read BOTH the X and Y tilt. Add X tilt to px and Y tilt to py. Erase the old dot (black circle), then draw a new yellow dot at the new position!",
    },
    {
      order: 3,
      text: "Add If blocks to keep the dot on screen (clamp px between 5 and 130, py between 25 and 235). Then check if px > 110 and py > 200 -- that means the player reached the goal! Show \"YOU WIN!\" and play a victory beep!",
    },
  ],
};

// ---------------------------------------------------------------------------
// Aggregate exports
// ---------------------------------------------------------------------------

/** All lessons for Band 2, Module 1: "Hello M5Stick!" */
export const BAND2_MODULE1_LESSONS: LessonContent[] = [
  b2m1_lesson1_lightItUp,
  b2m1_lesson2_colorMyWorld,
  b2m1_lesson3_buttonMagic,
  b2m1_lesson4_beepBoop,
  b2m1_lesson5_ledLightShow,
];

/** All lessons for Band 2, Module 2: "Drawing Fun!" */
export const BAND2_MODULE2_LESSONS: LessonContent[] = [
  b2m2_lesson1_pixelArt,
  b2m2_lesson2_shapePainter,
  b2m2_lesson3_animationStation,
];

/** All lessons for Band 2, Module 3: "Shake & Count!" */
export const BAND2_MODULE3_LESSONS: LessonContent[] = [
  b2m3_lesson1_shakeItUp,
  b2m3_lesson2_countingShakes,
  b2m3_lesson3_diceRoller,
  b2m3_lesson4_magic8Ball,
];

/** All lessons for Band 2, Module 4: "DJ Stick!" */
export const BAND2_MODULE4_LESSONS: LessonContent[] = [
  b2m4_lesson1_myFirstPiano,
  b2m4_lesson2_songPlayer,
  b2m4_lesson3_soundEffects,
];

/** All lessons for Band 2, Module 5: "Tilt Games!" */
export const BAND2_MODULE5_LESSONS: LessonContent[] = [
  b2m5_lesson1_tiltOMeter,
  b2m5_lesson2_balanceGame,
  b2m5_lesson3_tiltMaze,
];

/** Every lesson in the seed data, grouped by module */
export const ALL_SEED_LESSONS = {
  b2m1: BAND2_MODULE1_LESSONS,
  b2m2: BAND2_MODULE2_LESSONS,
  b2m3: BAND2_MODULE3_LESSONS,
  b2m4: BAND2_MODULE4_LESSONS,
  b2m5: BAND2_MODULE5_LESSONS,
} as const;

// ---------------------------------------------------------------------------
// Badge content
// ---------------------------------------------------------------------------

export interface BadgeContent {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: { type: string; threshold: number };
}

export const SEED_BADGES: BadgeContent[] = [
  {
    id: "00000000-0000-4000-b000-000000000001",
    name: "First Flash",
    description:
      "You flashed code to your M5Stick for the very first time! Welcome to the world of hardware programming!",
    icon: "zap",
    criteria: { type: "device_flash", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000002",
    name: "Bug Squasher",
    description:
      "You found and fixed your first bug! Every great coder is also a great debugger.",
    icon: "bug",
    criteria: { type: "bug_fix", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000003",
    name: "Creative Coder",
    description:
      "You saved 5 projects! You are building an amazing portfolio of creations.",
    icon: "palette",
    criteria: { type: "projects_saved", threshold: 5 },
  },
  {
    id: "00000000-0000-4000-b000-000000000004",
    name: "Sound Master",
    description:
      "You played 3 different tones on the buzzer! Your M5Stick is practically a musical instrument now!",
    icon: "music",
    criteria: { type: "tones_played", threshold: 3 },
  },
  {
    id: "00000000-0000-4000-b000-000000000005",
    name: "Artist",
    description:
      "You drew 10 shapes on the screen! Picasso would be proud of your tiny masterpieces!",
    icon: "brush",
    criteria: { type: "shapes_drawn", threshold: 10 },
  },
  {
    id: "00000000-0000-4000-b000-000000000006",
    name: "Loop Hero",
    description:
      "You used a loop for the first time! Loops are a coder's superpower -- they save you from typing the same thing over and over!",
    icon: "repeat",
    criteria: { type: "loop_used", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000007",
    name: "Shake Master",
    description:
      "You used the shake sensor! Now your M5Stick can feel your moves!",
    icon: "vibrate",
    criteria: { type: "shake_used", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000008",
    name: "Dice Roller",
    description:
      "You built a dice roller! Board game night will never be the same!",
    icon: "dice",
    criteria: { type: "random_used", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000009",
    name: "Music Maker",
    description:
      "You played a whole song! You're a real composer now!",
    icon: "headphones",
    criteria: { type: "song_played", threshold: 1 },
  },
  {
    id: "00000000-0000-4000-b000-000000000010",
    name: "Tilt Master",
    description:
      "You used the tilt sensor to control the screen! You're gaming like a pro!",
    icon: "move",
    criteria: { type: "tilt_used", threshold: 1 },
  },
];
