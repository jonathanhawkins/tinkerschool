-- =============================================================================
-- TinkerSchool -- Update "Feel the Beat!" lesson for workshop coding support
-- =============================================================================
-- This migration enriches the "Feel the Beat!" music lesson with:
--   1. Starter blocks XML so the Blockly workspace isn't empty
--   2. Solution code showing the expected beat program
--   3. Step-by-step hints guiding the child through building a beat
--   4. Enhanced description explaining the coding activity
--
-- The lesson keeps its interactive quiz content (multiple_choice activities)
-- for the lesson detail page, but now also works as a coding lesson in the
-- Blockly workshop.
-- =============================================================================

UPDATE public.lessons
SET
  -- Enhanced description that explains both the concept AND the coding task
  description = 'Discover what a beat is! A beat is a steady pulse in music -- like a heartbeat. Build a program that makes your M5Stick play a drum beat pattern!',

  -- Starter blocks: A "display text" block showing the lesson title + a single
  -- buzzer tone block to show the child where sounds come from.
  -- This gives them something to see and run immediately.
  starter_blocks_xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="m5_display_text" x="20" y="20"><value name="TEXT"><shadow type="text"><field name="TEXT">Feel the Beat!</field></shadow></value><value name="X"><shadow type="math_number"><field name="NUM">10</field></shadow></value><value name="Y"><shadow type="math_number"><field name="NUM">30</field></shadow></value><field name="COLOR">yellow</field><next><block type="m5_buzzer_tone"><value name="FREQUENCY"><shadow type="math_number"><field name="NUM">200</field></shadow></value><value name="DURATION"><shadow type="math_number"><field name="NUM">150</field></shadow></value></block></next></block></xml>',

  -- Solution code: A complete beat program that plays 4 drum beats in a loop
  -- and displays visual feedback with each beat
  solution_code = 'Lcd.fillScreen(0x000000)
Lcd.setTextColor(0xFFFF00, 0x000000)
Lcd.drawString("Feel the Beat!", 10, 10)
Lcd.setTextColor(0xFFFFFF, 0x000000)
Lcd.drawString("Listen...", 30, 60)
for i in range(4):
    Speaker.tone(200, 150)
    Lcd.fillCircle(67, 140, 30, 0xFF9800)
    Lcd.drawString("BOOM!", 42, 130)
    time.sleep(0.5)
    Lcd.fillCircle(67, 140, 30, 0x000000)
    time.sleep(0.5)',

  -- Step-by-step hints that teach music concepts while guiding block placement
  hints = '[
    {"order": 1, "text": "A beat is a steady pulse -- like your heartbeat! Click the orange Sound tab on the left to find the beat-making blocks."},
    {"order": 2, "text": "Drag the \"play tone\" block into your program. Set the frequency to 200 for a deep drum sound, and the duration to 150 for a quick hit!"},
    {"order": 3, "text": "One beat is lonely! Click Loops and drag a \"repeat\" block. Put your tone block INSIDE the loop. Try repeating 4 times -- that is one measure of music!"},
    {"order": 4, "text": "Beats need SPACE between them! Add a \"wait\" block (from the Wait tab) AFTER your tone. Set it to 0.5 seconds. That is the rest between beats."},
    {"order": 5, "text": "Make it visual! Add a Display block to show \"BOOM!\" each time the beat plays. Now click Run to hear your beat pattern!"}
  ]'::jsonb,

  -- Keep device_required false but mark as simulator_compatible
  simulator_compatible = true

WHERE id = 'b1000004-0001-4000-8000-000000000001';
