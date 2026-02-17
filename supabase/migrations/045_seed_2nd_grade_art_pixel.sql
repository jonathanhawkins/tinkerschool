-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Art: Pixel Art & Digital Creation Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - What Are Pixels?
--   - My First Pixel Art: Simple Shapes
--   - Pixel Art Animals
--   - Pixel Art with Coordinates
--   - My Pixel Masterpiece
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: flash_card, multiple_choice, fill_in_blank, matching_pairs, sequence_order
--
-- Subject ID:
--   Art: 5a848c8e-f476-4cd5-8d04-c67492961bc8
--
-- Module ID:
--   Pixel Art & Digital Creation: 10000002-0508-4000-8000-000000000001
--
-- Skill IDs:
--   Pixel Art Creation:           20000005-0009-4000-8000-000000000001
--   Self-Expression Through Art:  20000005-000a-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Art subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Art 2nd Grade: Pixel Art Creation, Self-Expression Through Art
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000005-0009-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'pixel_art_creation', 'Pixel Art Creation', 'Create simple images using a pixel grid, understanding that digital images are made of tiny colored squares', 'VA:Cr1.1.2a', 9),
  ('20000005-000a-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'self_expression_art', 'Self-Expression Through Art', 'Use artistic choices (color, composition, subject) to express personal ideas and interests in original artwork', 'VA:Cn10.1.2a', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Art: Pixel Art & Digital Creation)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0508-4000-8000-000000000001', 2, 35, 'Pixel Art & Digital Creation', 'Discover how digital images are made of tiny colored squares called pixels! Design your own pixel art creations.', 'grid-3x3', '5a848c8e-f476-4cd5-8d04-c67492961bc8')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- ART LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: What Are Pixels?
-- Module: Pixel Art & Digital Creation | Skill: Pixel Art Creation
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0010-4000-8000-000000000001',
  '10000002-0508-4000-8000-000000000001',
  1,
  'What Are Pixels?',
  'Discover that every picture on a screen is made of tiny colored squares called pixels!',
  'Hey there, art explorer! Chip here! Have you ever looked REALLY closely at a TV or tablet screen? If you zoom in super close, you''ll find something amazing -- the picture is made of tiny little colored squares! These squares are called PIXELS, and they''re the building blocks of every digital image. Let''s learn all about them!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about pixels!",
        "cards": [
          {
            "id": "fc-what",
            "front": {"text": "What is a Pixel?", "emoji": "\ud83d\udfe9"},
            "back": {"text": "A pixel is a tiny colored square. It is the smallest piece of a digital image. The word pixel comes from \"picture element\" -- it is one little element of the whole picture!", "emoji": "\ud83d\udd0d"}
          },
          {
            "id": "fc-screen",
            "front": {"text": "Pixels on Your Screen", "emoji": "\ud83d\udcf1"},
            "back": {"text": "Your tablet, phone, and TV screen are all made of millions of tiny pixels! They are so small you usually can not see them, but zoom in close and you will see little colored squares.", "emoji": "\ud83d\udcfa"}
          },
          {
            "id": "fc-together",
            "front": {"text": "How Pixels Make Pictures", "emoji": "\ud83c\uddfa"},
            "back": {"text": "When lots of pixels are put together, each one a different color, they form a picture! It is like a mosaic or a quilt -- lots of tiny pieces make one big image.", "emoji": "\ud83d\uddbc\ufe0f"}
          },
          {
            "id": "fc-art",
            "front": {"text": "What is Pixel Art?", "emoji": "\ud83c\udfa8"},
            "back": {"text": "Pixel art is a style of digital art where you can see each individual pixel. Artists carefully choose the color of every single square to make cool pictures, characters, and scenes!", "emoji": "\u2b1c"}
          },
          {
            "id": "fc-retro",
            "front": {"text": "Pixel Art in Video Games", "emoji": "\ud83c\udfae"},
            "back": {"text": "Old video games from the 1980s and 1990s used pixel art because screens did not have many pixels. Today pixel art is still super popular because it looks fun and charming!", "emoji": "\ud83d\udc7e"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What is a pixel?",
            "options": [
              { "id": "a", "text": "A tiny colored square that makes up digital images" },
              { "id": "b", "text": "A type of paintbrush" },
              { "id": "c", "text": "A kind of crayon" },
              { "id": "d", "text": "A musical note" }
            ],
            "correctOptionId": "a",
            "hint": "Think about what you see if you zoom in REALLY close on a screen -- tiny colored squares!"
          },
          {
            "id": "mc2",
            "prompt": "What does the word 'pixel' come from?",
            "options": [
              { "id": "a", "text": "Pixie dust" },
              { "id": "b", "text": "Picture element" },
              { "id": "c", "text": "Pixel paint" },
              { "id": "d", "text": "Pick and sell" }
            ],
            "correctOptionId": "b",
            "hint": "A pixel is one little ELEMENT of a PICTURE -- put those words together!"
          },
          {
            "id": "mc3",
            "prompt": "How do pixels make a picture?",
            "options": [
              { "id": "a", "text": "One giant pixel shows the whole picture" },
              { "id": "b", "text": "Pixels only make sounds, not pictures" },
              { "id": "c", "text": "Many tiny colored pixels are placed together to form an image" },
              { "id": "d", "text": "Pixels can only be black and white" }
            ],
            "correctOptionId": "c",
            "hint": "Think of a mosaic -- many small pieces come together to create the big picture!"
          },
          {
            "id": "mc4",
            "prompt": "Why did old video games use pixel art?",
            "options": [
              { "id": "a", "text": "Because artists were lazy" },
              { "id": "b", "text": "Because screens did not have many pixels back then" },
              { "id": "c", "text": "Because players did not like colorful art" },
              { "id": "d", "text": "Because pixel art was illegal before 2000" }
            ],
            "correctOptionId": "b",
            "hint": "Old screens were not as powerful as today -- they could only show a small number of pixels!"
          },
          {
            "id": "mc5",
            "prompt": "Which of these devices has a screen made of pixels?",
            "options": [
              { "id": "a", "text": "A paper notebook" },
              { "id": "b", "text": "A wooden table" },
              { "id": "c", "text": "A tablet or phone" },
              { "id": "d", "text": "A chalkboard" }
            ],
            "correctOptionId": "c",
            "hint": "Which one has a glowing screen? Screens are made of tiny pixels!"
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
-- LESSON 2: My First Pixel Art: Simple Shapes
-- Module: Pixel Art & Digital Creation | Skill: Pixel Art Creation
-- Widgets: fill_in_blank + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0011-4000-8000-000000000001',
  '10000002-0508-4000-8000-000000000001',
  2,
  'My First Pixel Art: Simple Shapes',
  'Learn to create simple shapes like hearts and stars on a pixel grid by coloring in the right squares!',
  'Time to start creating! The coolest thing about pixel art is that you build pictures one square at a time. Today we''re going to learn how to draw simple shapes on a grid -- like hearts, stars, and more! Even the most amazing pixel artists started with simple shapes. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "In pixel art, you build pictures by coloring in tiny ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "squares",
                "acceptableAnswers": ["squares", "Squares", "pixels", "Pixels"]
              }
            ],
            "hint": "Pixel art is made of tiny colored shapes that have four equal sides!"
          },
          {
            "id": "fb2",
            "prompt": "A pixel grid is like graph paper with rows and ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "columns",
                "acceptableAnswers": ["columns", "Columns"]
              }
            ],
            "hint": "Rows go across and ___ go up and down!"
          },
          {
            "id": "fb3",
            "prompt": "To make a pixel art heart, you use ___ colored pixels in the shape of a heart.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "red",
                "acceptableAnswers": ["red", "Red", "pink", "Pink"]
              }
            ],
            "hint": "Think about what color hearts usually are -- the color of love!"
          },
          {
            "id": "fb4",
            "prompt": "To make a straight line in pixel art, you color pixels in a ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "row",
                "acceptableAnswers": ["row", "Row", "line", "Line"]
              }
            ],
            "hint": "You put the colored squares next to each other in a horizontal ___!"
          },
          {
            "id": "fb5",
            "prompt": "Pixel art uses a ___ to organize where each colored square goes.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "grid",
                "acceptableAnswers": ["grid", "Grid"]
              }
            ],
            "hint": "It looks like graph paper with squares -- it starts with the letter G!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each pixel art shape to how you would draw it on a grid!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "heart", "text": "Heart", "emoji": "\u2764\ufe0f"},
            "right": {"id": "heart-desc", "text": "Two bumps on top, point at bottom", "emoji": "\ud83d\udccc"}
          },
          {
            "id": "p2",
            "left": {"id": "star", "text": "Star", "emoji": "\u2b50"},
            "right": {"id": "star-desc", "text": "Points sticking out from center", "emoji": "\u2728"}
          },
          {
            "id": "p3",
            "left": {"id": "square", "text": "Square", "emoji": "\ud83d\udfe6"},
            "right": {"id": "square-desc", "text": "Fill in a block of equal rows and columns", "emoji": "\u2b1c"}
          },
          {
            "id": "p4",
            "left": {"id": "circle", "text": "Circle", "emoji": "\u26aa"},
            "right": {"id": "circle-desc", "text": "Round edges using staircase steps", "emoji": "\ud83d\udfe2"}
          },
          {
            "id": "p5",
            "left": {"id": "triangle", "text": "Triangle", "emoji": "\ud83d\udd3a"},
            "right": {"id": "triangle-desc", "text": "Start with one pixel, add more each row", "emoji": "\ud83d\udfd5"}
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
-- LESSON 3: Pixel Art Animals
-- Module: Pixel Art & Digital Creation | Skill: Pixel Art Creation
-- Widgets: fill_in_blank + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0012-4000-8000-000000000001',
  '10000002-0508-4000-8000-000000000001',
  3,
  'Pixel Art Animals',
  'Design a cute animal face using pixel art! Learn how to simplify real animals into pixel grid shapes.',
  'Chip loves animals, and pixel art animals are the CUTEST! Today you''re going to learn how artists turn real animals into adorable pixel art. The trick is to keep it simple -- use just a few colors and focus on the most important features like eyes, ears, and a nose. Let''s create some pixel pets!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "When making a pixel art cat face, the most important features are eyes, ears, nose, and ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "whiskers",
                "acceptableAnswers": ["whiskers", "Whiskers", "mouth", "Mouth"]
              }
            ],
            "hint": "Cats have long thin lines on their cheeks -- what are those called?"
          },
          {
            "id": "fb2",
            "prompt": "A pixel art frog would mainly use the color ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "green",
                "acceptableAnswers": ["green", "Green"]
              }
            ],
            "hint": "Ribbit! What color are most frogs?"
          },
          {
            "id": "fb3",
            "prompt": "To make pixel art eyes, you often use a dark pixel with a ___ pixel inside for the shine.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "white",
                "acceptableAnswers": ["white", "White", "light", "Light"]
              }
            ],
            "hint": "That little bright dot in cartoon eyes that makes them look alive and shiny!"
          },
          {
            "id": "fb4",
            "prompt": "Pixel art works best when you keep your design ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "simple",
                "acceptableAnswers": ["simple", "Simple", "small", "Small"]
              }
            ],
            "hint": "Do not try to draw every tiny detail -- focus on the most important parts. Keep it ___!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What is the FIRST step when making a pixel art animal?",
            "options": [
              { "id": "a", "text": "Add tiny details like fur patterns" },
              { "id": "b", "text": "Start with the basic shape (like the head)" },
              { "id": "c", "text": "Color every single pixel randomly" },
              { "id": "d", "text": "Draw a realistic photograph" }
            ],
            "correctOptionId": "b",
            "hint": "Start BIG and simple! Get the main shape right first, then add details."
          },
          {
            "id": "mc2",
            "prompt": "A pixel art puppy face is 8 pixels wide. How many pixels wide are the two eyes together if each eye is 1 pixel?",
            "options": [
              { "id": "a", "text": "1 pixel" },
              { "id": "b", "text": "2 pixels" },
              { "id": "c", "text": "4 pixels" },
              { "id": "d", "text": "8 pixels" }
            ],
            "correctOptionId": "b",
            "hint": "Each eye is 1 pixel and there are 2 eyes. 1 + 1 = ?"
          },
          {
            "id": "mc3",
            "prompt": "Why do pixel artists use only a few colors for an animal?",
            "options": [
              { "id": "a", "text": "Because they do not like colors" },
              { "id": "b", "text": "Because fewer colors make the art cleaner and easier to read at small sizes" },
              { "id": "c", "text": "Because computers can only show 3 colors" },
              { "id": "d", "text": "Because animals are all the same color" }
            ],
            "correctOptionId": "b",
            "hint": "When pixels are small, too many colors can make things look messy. Simple is better!"
          },
          {
            "id": "mc4",
            "prompt": "Which of these animals would be EASIEST to draw in pixel art?",
            "options": [
              { "id": "a", "text": "A fluffy poodle with curly fur" },
              { "id": "b", "text": "A simple fish with a round body" },
              { "id": "c", "text": "A peacock with detailed feathers" },
              { "id": "d", "text": "A spider with eight tiny legs" }
            ],
            "correctOptionId": "b",
            "hint": "The simplest shapes are the easiest to draw in pixel art! Which animal has the simplest shape?"
          },
          {
            "id": "mc5",
            "prompt": "What makes pixel art animals look CUTE?",
            "options": [
              { "id": "a", "text": "Making them very realistic" },
              { "id": "b", "text": "Using only gray colors" },
              { "id": "c", "text": "Big eyes and simple round shapes" },
              { "id": "d", "text": "Adding lots of text labels" }
            ],
            "correctOptionId": "c",
            "hint": "Think about cartoon characters -- big eyes and round shapes make things look adorable!"
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
-- LESSON 4: Pixel Art with Coordinates
-- Module: Pixel Art & Digital Creation | Skills: Pixel Art Creation + Self-Expression
-- Widgets: fill_in_blank + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0013-4000-8000-000000000001',
  '10000002-0508-4000-8000-000000000001',
  4,
  'Pixel Art with Coordinates',
  'Use x and y coordinates to place pixels in the right spots! Pixel art meets math in this fun crossover lesson.',
  'Guess what? Pixel art and MATH are best friends! Every pixel on a grid has an address, just like every house on a street. We use two numbers called coordinates to say exactly where a pixel goes. The first number (x) tells you how far RIGHT to go, and the second number (y) tells you how far DOWN to go. Let''s use coordinates to make pixel art!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0009-4000-8000-000000000001', '20000005-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "In a pixel grid, the x coordinate tells you how far ___ to go.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "right",
                "acceptableAnswers": ["right", "Right"]
              }
            ],
            "hint": "X goes left and right -- like reading a book, you start at the left and go ___!"
          },
          {
            "id": "fb2",
            "prompt": "The y coordinate tells you how far ___ to go on the grid.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "down",
                "acceptableAnswers": ["down", "Down"]
              }
            ],
            "hint": "Y goes up and down! On a pixel grid, y usually counts downward from the top."
          },
          {
            "id": "fb3",
            "prompt": "The coordinate (3, 1) means go 3 squares right and ___ square(s) down.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "1",
                "acceptableAnswers": ["1", "one", "One"]
              }
            ],
            "hint": "The second number in the coordinate tells you how far down to go!"
          },
          {
            "id": "fb4",
            "prompt": "Two numbers that give the position of a pixel are called ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "coordinates",
                "acceptableAnswers": ["coordinates", "Coordinates"]
              }
            ],
            "hint": "It starts with the letter C -- it is the address of a pixel on the grid!"
          },
          {
            "id": "fb5",
            "prompt": "The pixel at position (1, 1) is in the top-___ corner of the grid.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "left",
                "acceptableAnswers": ["left", "Left"]
              }
            ],
            "hint": "Position (1, 1) means only 1 square right and 1 square down -- that is the corner where you start!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each coordinate to where it is on the grid!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "coord-11", "text": "(1, 1)", "emoji": "\ud83d\udccd"},
            "right": {"id": "pos-topleft", "text": "Top-left area", "emoji": "\u2196\ufe0f"}
          },
          {
            "id": "p2",
            "left": {"id": "coord-51", "text": "(5, 1)", "emoji": "\ud83d\udccd"},
            "right": {"id": "pos-topright", "text": "Top-right area", "emoji": "\u2197\ufe0f"}
          },
          {
            "id": "p3",
            "left": {"id": "coord-15", "text": "(1, 5)", "emoji": "\ud83d\udccd"},
            "right": {"id": "pos-bottomleft", "text": "Bottom-left area", "emoji": "\u2199\ufe0f"}
          },
          {
            "id": "p4",
            "left": {"id": "coord-55", "text": "(5, 5)", "emoji": "\ud83d\udccd"},
            "right": {"id": "pos-bottomright", "text": "Bottom-right area", "emoji": "\u2198\ufe0f"}
          },
          {
            "id": "p5",
            "left": {"id": "coord-33", "text": "(3, 3)", "emoji": "\ud83d\udccd"},
            "right": {"id": "pos-center", "text": "Center of the grid", "emoji": "\ud83c\udfaf"}
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
-- LESSON 5: My Pixel Masterpiece
-- Module: Pixel Art & Digital Creation | Skill: Self-Expression Through Art
-- Widgets: fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0014-4000-8000-000000000001',
  '10000002-0508-4000-8000-000000000001',
  5,
  'My Pixel Masterpiece',
  'Plan and design your very own original pixel art creation! Put everything you learned together in this capstone project.',
  'This is it -- the BIG one! You''ve learned what pixels are, how to draw shapes, how to make animals, and even how to use coordinates. Now Chip wants YOU to plan your very own pixel art masterpiece! Real artists always plan before they create, so let''s think about what you want to make and how you''ll make it. This is YOUR chance to be a pixel art creator!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "Every digital image on a screen is made of tiny colored squares called ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "pixels",
                "acceptableAnswers": ["pixels", "Pixels"]
              }
            ],
            "hint": "These tiny squares are the building blocks of digital images! They start with P."
          },
          {
            "id": "fb2",
            "prompt": "When planning pixel art, you should start with a simple ___ before adding details.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "shape",
                "acceptableAnswers": ["shape", "Shape", "outline", "Outline"]
              }
            ],
            "hint": "Think big first! Get the basic form right, then add the small stuff."
          },
          {
            "id": "fb3",
            "prompt": "The x coordinate tells you how far ___ to go, and the y coordinate tells you how far down.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "right",
                "acceptableAnswers": ["right", "Right"]
              }
            ],
            "hint": "X is the left-right direction. You start on the left and move ___!"
          },
          {
            "id": "fb4",
            "prompt": "Pixel art looks best when you use just a ___ colors to keep it clean.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "few",
                "acceptableAnswers": ["few", "Few", "small number of", "couple"]
              }
            ],
            "hint": "Too many colors makes pixel art messy. Keep it simple with just a ___ carefully chosen colors!"
          },
          {
            "id": "fb5",
            "prompt": "The word pixel comes from the words picture and ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "element",
                "acceptableAnswers": ["element", "Element"]
              }
            ],
            "hint": "A pixel is one small PIECE of a picture. Another word for piece is ___!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Put the steps for creating pixel art in the right order!",
            "items": [
              { "id": "i1", "text": "Choose what you want to draw", "emoji": "\ud83d\udca1", "correctPosition": 1 },
              { "id": "i2", "text": "Pick your grid size", "emoji": "\ud83d\udccf", "correctPosition": 2 },
              { "id": "i3", "text": "Select a few colors to use", "emoji": "\ud83c\udfa8", "correctPosition": 3 },
              { "id": "i4", "text": "Draw the basic shape outline", "emoji": "\u270f\ufe0f", "correctPosition": 4 },
              { "id": "i5", "text": "Fill in colors and add details", "emoji": "\ud83d\udd8c\ufe0f", "correctPosition": 5 },
              { "id": "i6", "text": "Review and fix any pixels that look off", "emoji": "\ud83d\udd0d", "correctPosition": 6 }
            ],
            "hint": "First you plan (what, size, colors), then you draw (outline, fill), then you review!"
          },
          {
            "id": "seq2",
            "prompt": "Put what you learned in this module in order from Lesson 1 to Lesson 5!",
            "items": [
              { "id": "i-pixels", "text": "Learned what pixels are", "emoji": "\ud83d\udfe9", "correctPosition": 1 },
              { "id": "i-shapes", "text": "Drew simple shapes on a grid", "emoji": "\u2b1c", "correctPosition": 2 },
              { "id": "i-animals", "text": "Made pixel art animals", "emoji": "\ud83d\udc3e", "correctPosition": 3 },
              { "id": "i-coords", "text": "Used coordinates to place pixels", "emoji": "\ud83d\udccd", "correctPosition": 4 },
              { "id": "i-master", "text": "Planned your own pixel masterpiece", "emoji": "\ud83c\udfc6", "correctPosition": 5 }
            ],
            "hint": "Think about our journey: first we learned the basics, then shapes, then animals, then coordinates, and now the final project!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
