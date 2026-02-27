-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Art Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Art "Art Adventures" module.
-- Aligned to National Core Arts Standards (NCAS) Visual Arts K
--
-- Module ID: 00000001-0051-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000005
--
-- Lesson UUIDs: c1000005-0001 through c1000005-0005
-- =============================================================================


-- =========================================================================
-- ART LESSON 1: The Color Rainbow
-- Skills: Primary Colors, Mixing Colors
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000005-0001-4000-8000-000000000001',
  '00000001-0051-4000-8000-000000000001',
  1,
  'The Color Rainbow',
  'Meet the primary colors: red, yellow, and blue! Mix them to make new colors!',
  'Chip LOVES colors! There are three super special colors called PRIMARY colors \u2014 red, yellow, and blue. When you mix them together, MAGIC happens! New colors appear!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000100-0001-4000-8000-000000000001',
    '50000100-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Meet the primary colors! These are the building blocks of ALL colors!",
        "cards": [
          {
            "id": "color-red",
            "front": {"text": "Primary Color #1", "emoji": "\ud83d\udfe5"},
            "back": {"text": "RED!\nLike apples and fire trucks", "emoji": "\ud83c\udf4e"},
            "color": "#EF4444"
          },
          {
            "id": "color-yellow",
            "front": {"text": "Primary Color #2", "emoji": "\ud83d\udfe8"},
            "back": {"text": "YELLOW!\nLike the sun and bananas", "emoji": "\ud83c\udf1e"},
            "color": "#EAB308"
          },
          {
            "id": "color-blue",
            "front": {"text": "Primary Color #3", "emoji": "\ud83d\udfe6"},
            "back": {"text": "BLUE!\nLike the sky and ocean", "emoji": "\ud83c\udf0a"},
            "color": "#3B82F6"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mix-1",
            "prompt": "Red + Yellow = what color?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Orange", "emoji": "\ud83d\udfe7"},
              {"id": "b", "text": "Green", "emoji": "\ud83d\udfe9"},
              {"id": "c", "text": "Purple", "emoji": "\ud83d\udfe3"}
            ],
            "correctOptionId": "a",
            "hint": "Think of the color of a sunset \u2014 red and yellow make..."
          },
          {
            "id": "mix-2",
            "prompt": "Blue + Yellow = what color?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Orange", "emoji": "\ud83d\udfe7"},
              {"id": "b", "text": "Green", "emoji": "\ud83d\udfe9"},
              {"id": "c", "text": "Pink", "emoji": "\ud83e\ude77"}
            ],
            "correctOptionId": "b",
            "hint": "Like grass and leaves! Blue + yellow = ..."
          },
          {
            "id": "mix-3",
            "prompt": "Red + Blue = what color?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "Green", "emoji": "\ud83d\udfe9"},
              {"id": "b", "text": "Yellow", "emoji": "\ud83d\udfe8"},
              {"id": "c", "text": "Purple", "emoji": "\ud83d\udfe3"}
            ],
            "correctOptionId": "c",
            "hint": "Think of grapes! Red + blue = ..."
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 2: Lines, Lines, Lines!
-- Skills: Types of Lines, Shapes in Art
-- Widgets: tap_and_reveal + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000005-0002-4000-8000-000000000001',
  '00000001-0051-4000-8000-000000000001',
  2,
  'Lines, Lines, Lines!',
  'Straight, wavy, zigzag, and curvy! Lines are the building blocks of art!',
  'Artists use LINES to draw everything! There are so many cool types of lines \u2014 straight ones, wavy ones like the ocean, zigzag ones like lightning, and curvy ones like a snake! Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000100-0003-4000-8000-000000000001',
    '50000100-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "line-types",
            "prompt": "Tap each card to discover a type of line!",
            "mode": "explore",
            "gridCols": 2,
            "items": [
              {
                "id": "straight",
                "coverEmoji": "\ud83c\udfa8",
                "revealEmoji": "\u2796",
                "revealLabel": "Straight Line - like a ruler!"
              },
              {
                "id": "wavy",
                "coverEmoji": "\ud83c\udfa8",
                "revealEmoji": "\u3030\ufe0f",
                "revealLabel": "Wavy Line - like ocean waves!"
              },
              {
                "id": "zigzag",
                "coverEmoji": "\ud83c\udfa8",
                "revealEmoji": "\u26a1",
                "revealLabel": "Zigzag Line - like lightning!"
              },
              {
                "id": "curvy",
                "coverEmoji": "\ud83c\udfa8",
                "revealEmoji": "\ud83c\udf00",
                "revealLabel": "Curvy Line - like a snail shell!"
              }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "line-mc-1",
            "prompt": "Ocean waves look like what type of line?",
            "promptEmoji": "\ud83c\udf0a",
            "options": [
              {"id": "a", "text": "Straight", "emoji": "\u2796"},
              {"id": "b", "text": "Wavy", "emoji": "\u3030\ufe0f"},
              {"id": "c", "text": "Zigzag", "emoji": "\u26a1"}
            ],
            "correctOptionId": "b",
            "hint": "Waves go up and down smoothly \u2014 that''s a wavy line!"
          },
          {
            "id": "line-mc-2",
            "prompt": "What shapes can you make with straight lines?",
            "promptEmoji": "\ud83d\udcdc",
            "options": [
              {"id": "a", "text": "Triangles & squares", "emoji": "\ud83d\udd3a\ud83d\udfe7"},
              {"id": "b", "text": "Circles", "emoji": "\ud83d\udfe2"},
              {"id": "c", "text": "Clouds", "emoji": "\u2601\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Triangles have 3 straight sides, squares have 4!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Draw all four types of lines on paper! Straight, wavy, zigzag, and curvy. Then try drawing a picture using ONLY lines \u2014 a house (straight lines), waves (wavy lines), mountains (zigzag lines).",
        "parentTip": "Line awareness is a foundational drawing skill. Point out lines in the environment: fence (straight), river (curvy), mountain range (zigzag). This builds observation skills.",
        "completionPrompt": "Did you draw different types of lines together?",
        "illustration": "\u270f\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 3: Draw Yourself!
-- Skills: Self-Portrait, Exploring Art Materials
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000005-0003-4000-8000-000000000001',
  '00000001-0051-4000-8000-000000000001',
  3,
  'Draw Yourself!',
  'Create a self-portrait! What makes YOU special? Draw it!',
  'Chip thinks YOU are amazing! Every person looks different and special. Today we''re going to draw a picture of YOU \u2014 it''s called a self-portrait! Think about your face: your eyes, nose, mouth, and hair!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000100-0005-4000-8000-000000000001',
    '50000100-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "portrait-1",
            "prompt": "A self-portrait is a picture of...",
            "promptEmoji": "\ud83d\uddbc\ufe0f",
            "options": [
              {"id": "a", "text": "Yourself!", "emoji": "\ud83e\uddd1"},
              {"id": "b", "text": "A cat", "emoji": "\ud83d\udc31"},
              {"id": "c", "text": "A tree", "emoji": "\ud83c\udf33"}
            ],
            "correctOptionId": "a",
            "hint": "Self means YOU! A self-portrait is a drawing of yourself."
          },
          {
            "id": "portrait-2",
            "prompt": "What shape is a face usually closest to?",
            "promptEmoji": "\ud83d\ude0a",
            "options": [
              {"id": "a", "text": "Circle or oval", "emoji": "\ud83d\udfe2"},
              {"id": "b", "text": "Square", "emoji": "\ud83d\udfe7"},
              {"id": "c", "text": "Triangle", "emoji": "\ud83d\udd3a"}
            ],
            "correctOptionId": "a",
            "hint": "Look in a mirror \u2014 your face is kind of round!"
          },
          {
            "id": "portrait-3",
            "prompt": "What parts go on a face?",
            "promptEmoji": "\ud83d\ude42",
            "options": [
              {"id": "a", "text": "Eyes, nose, mouth, ears", "emoji": "\ud83d\udc41\ufe0f"},
              {"id": "b", "text": "Wheels and windows", "emoji": "\ud83d\ude97"},
              {"id": "c", "text": "Leaves and branches", "emoji": "\ud83c\udf3f"}
            ],
            "correctOptionId": "a",
            "hint": "Touch your face! Feel your eyes, nose, mouth, and ears!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Draw a self-portrait together! Give your child a mirror, paper, and crayons. Guide them: ''Start with a circle for your face. Where do your eyes go? Your nose? Your mouth? Don''t forget your hair!'' Let them add details like freckles, glasses, or a favorite hat.",
        "parentTip": "Self-portraits are a core kindergarten art activity (NCAS VA:Cr1.1.K). Don''t correct proportions \u2014 at this age, large heads and stick bodies are developmentally normal. Focus on including recognizable features.",
        "completionPrompt": "Did you draw a self-portrait together?",
        "illustration": "\ud83d\uddbc\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 4: Art Around Us
-- Skills: Art in Our World, Choosing Favorite Art
-- Widgets: tap_and_reveal + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000005-0004-4000-8000-000000000001',
  '00000001-0051-4000-8000-000000000001',
  4,
  'Art Around Us',
  'Art is everywhere! Find art at home, at school, and in nature!',
  'Chip sees art EVERYWHERE \u2014 on walls, on clothes, in parks! Art isn''t just in museums. Your t-shirt has art on it! The pattern on your blanket is art! Let''s find art all around!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000100-0007-4000-8000-000000000001',
    '50000100-0008-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "art-around",
            "prompt": "Tap to find art hiding in everyday places!",
            "mode": "explore",
            "gridCols": 2,
            "items": [
              {
                "id": "art-clothes",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83d\udc55",
                "revealLabel": "Patterns on clothes!"
              },
              {
                "id": "art-nature",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf3b",
                "revealLabel": "Colors in flowers!"
              },
              {
                "id": "art-buildings",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udfe0",
                "revealLabel": "Shapes in buildings!"
              },
              {
                "id": "art-food",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf70",
                "revealLabel": "Decorations on cakes!"
              }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "art-mc-1",
            "prompt": "Which of these is a place where you can see LOTS of art?",
            "promptEmoji": "\ud83d\uddbc\ufe0f",
            "options": [
              {"id": "a", "text": "An art museum", "emoji": "\ud83c\udfdb\ufe0f"},
              {"id": "b", "text": "A parking lot", "emoji": "\ud83c\udd7f\ufe0f"},
              {"id": "c", "text": "A gas station", "emoji": "\u26fd"}
            ],
            "correctOptionId": "a",
            "hint": "Museums are special places that show paintings, sculptures, and more!"
          },
          {
            "id": "art-mc-2",
            "prompt": "Why do people make art?",
            "promptEmoji": "\ud83c\udfa8",
            "options": [
              {"id": "a", "text": "To express feelings and tell stories", "emoji": "\u2764\ufe0f"},
              {"id": "b", "text": "To make things messy", "emoji": "\ud83e\uddf9"},
              {"id": "c", "text": "Because they have to", "emoji": "\ud83d\ude10"}
            ],
            "correctOptionId": "a",
            "hint": "Art helps people share how they feel and what they imagine!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- ART LESSON 5: Shape Art
-- Skills: Shapes in Art, Exploring Art Materials
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000005-0005-4000-8000-000000000001',
  '00000001-0051-4000-8000-000000000001',
  5,
  'Shape Art',
  'Create amazing pictures using only shapes! A house, a robot, a flower \u2014 all from shapes!',
  'Did you know you can draw ANYTHING using shapes? A house is a square with a triangle on top! A snowman is circles stacked up! Let''s make shape art!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000005',
  ARRAY[
    '50000100-0004-4000-8000-000000000001',
    '50000100-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "shape-art-1",
            "prompt": "To draw a house, you need a square and a...",
            "promptEmoji": "\ud83c\udfe0",
            "options": [
              {"id": "a", "text": "Triangle (for the roof!)", "emoji": "\ud83d\udd3a"},
              {"id": "b", "text": "Circle", "emoji": "\ud83d\udfe2"},
              {"id": "c", "text": "Star", "emoji": "\u2b50"}
            ],
            "correctOptionId": "a",
            "hint": "Look at a house \u2014 the roof is shaped like a triangle!"
          },
          {
            "id": "shape-art-2",
            "prompt": "A snowman is made of stacked...",
            "promptEmoji": "\u26c4",
            "options": [
              {"id": "a", "text": "Squares", "emoji": "\ud83d\udfe7"},
              {"id": "b", "text": "Circles", "emoji": "\ud83d\udfe2"},
              {"id": "c", "text": "Triangles", "emoji": "\ud83d\udd3a"}
            ],
            "correctOptionId": "b",
            "hint": "Snowballs are round! Stack three round shapes to make a snowman."
          },
          {
            "id": "shape-art-3",
            "prompt": "The sun in a drawing usually starts with a...",
            "promptEmoji": "\u2600\ufe0f",
            "options": [
              {"id": "a", "text": "Circle (with lines for rays!)", "emoji": "\ud83d\udfe2"},
              {"id": "b", "text": "Square", "emoji": "\ud83d\udfe7"},
              {"id": "c", "text": "Rectangle", "emoji": "\ud83d\udfe6"}
            ],
            "correctOptionId": "a",
            "hint": "The sun is round! Draw a circle and add lines sticking out for rays!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Make shape art together! Cut out circles, squares, triangles, and rectangles from colored paper. Glue them onto a big sheet to create pictures: a robot (rectangles + circles), a cat (triangles for ears, circle for face), a train (rectangles + circles for wheels).",
        "parentTip": "Shape collage is great for fine motor skills (cutting, gluing) and spatial awareness. Let your child decide what to create \u2014 open-ended creativity is the goal (NCAS VA:Cr1.2.K).",
        "completionPrompt": "Did you make shape art together?",
        "illustration": "\u2702\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
