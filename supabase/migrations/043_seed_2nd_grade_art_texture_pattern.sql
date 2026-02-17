-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Art Module: Texture & Pattern
-- =============================================================================
-- 5 browser-only interactive lessons for Art: Texture & Pattern
-- Target audience: 2nd graders (ages 7-8)
-- All lessons use interactive widget types (no device required)
--
-- Subject ID:
--   Art: 5a848c8e-f476-4cd5-8d04-c67492961bc8
--
-- Module ID:
--   Texture & Pattern: 10000002-0506-4000-8000-000000000001
--
-- Skill IDs:
--   Texture:              20000005-0004-4000-8000-000000000001
--   Pattern & Repetition: 20000005-0005-4000-8000-000000000001
--   Symmetry:             20000005-0006-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Art subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS (Art: Texture, Pattern & Repetition, Symmetry)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000005-0004-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'texture', 'Texture', 'Identify and describe a variety of textures in artwork and the real world, including rough, smooth, bumpy, and soft', 'VA:Cr2.1.2a', 4),
  ('20000005-0005-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'pattern_repetition', 'Pattern & Repetition', 'Recognize, create, and extend repeating patterns (AB, ABB, ABC) using visual elements in art', 'VA:Cr1.2.2a', 5),
  ('20000005-0006-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'symmetry', 'Symmetry', 'Identify and create symmetrical designs where both halves match, using a line of symmetry', 'VA:Cr2.2.2a', 6)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Art: Texture & Pattern)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0506-4000-8000-000000000001', 2, 33, 'Texture & Pattern', 'Explore how things feel and look! Discover textures like rough and smooth, create repeating patterns, and find symmetry all around you!', 'art', '5a848c8e-f476-4cd5-8d04-c67492961bc8')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- ART LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Touch and See: Texture
-- Module: Texture & Pattern | Skill: Texture
-- Widgets: matching_pairs + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0006-4000-8000-000000000001',
  '10000002-0506-4000-8000-000000000001',
  1,
  'Touch and See: Texture',
  'Learn about textures! Discover how things feel -- rough, smooth, bumpy, and soft -- and spot them in art.',
  'Hey artist! Chip has a question for you -- have you ever petted a fluffy cat? Touched a bumpy pinecone? Felt smooth glass? Those feelings have a special art word: TEXTURE! Texture is how something feels when you touch it -- or how it LOOKS like it would feel. Let''s explore textures together!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about different textures!",
        "cards": [
          {
            "id": "fc-rough",
            "front": {"text": "Rough Texture", "emoji": "\ud83e\udea8"},
            "back": {"text": "Rough things feel scratchy and uneven when you touch them! Think of sandpaper, tree bark, or a brick wall. Artists can make rough textures by using thick paint or scratchy lines.", "emoji": "\ud83d\udcc4"}
          },
          {
            "id": "fc-smooth",
            "front": {"text": "Smooth Texture", "emoji": "\u2728"},
            "back": {"text": "Smooth things feel flat and silky with no bumps! Think of glass, a balloon, or a polished stone. Artists can make smooth textures by blending paint gently.", "emoji": "\ud83e\ude9f"}
          },
          {
            "id": "fc-bumpy",
            "front": {"text": "Bumpy Texture", "emoji": "\ud83d\udd35"},
            "back": {"text": "Bumpy things have little hills and valleys you can feel! Think of bubble wrap, a basketball, or a strawberry. Artists can make bumpy textures with dots and small circles.", "emoji": "\ud83d\udfe2"}
          },
          {
            "id": "fc-soft",
            "front": {"text": "Soft Texture", "emoji": "\ud83e\uddf8"},
            "back": {"text": "Soft things feel gentle and squishy! Think of cotton balls, a stuffed animal, or a fluffy cloud. Artists can make soft textures with light, feathery brush strokes.", "emoji": "\u2601\ufe0f"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each object to how it feels! What texture does it have?",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "sandpaper", "text": "Sandpaper", "emoji": "\ud83d\udcc4"},
            "right": {"id": "rough", "text": "Rough", "emoji": "\ud83e\udea8"}
          },
          {
            "id": "p2",
            "left": {"id": "glass", "text": "Glass Window", "emoji": "\ud83e\ude9f"},
            "right": {"id": "smooth", "text": "Smooth", "emoji": "\u2728"}
          },
          {
            "id": "p3",
            "left": {"id": "bubblewrap", "text": "Bubble Wrap", "emoji": "\ud83d\udfe2"},
            "right": {"id": "bumpy", "text": "Bumpy", "emoji": "\ud83d\udd35"}
          },
          {
            "id": "p4",
            "left": {"id": "cottonball", "text": "Cotton Ball", "emoji": "\u2601\ufe0f"},
            "right": {"id": "soft", "text": "Soft", "emoji": "\ud83e\uddf8"}
          },
          {
            "id": "p5",
            "left": {"id": "treebark", "text": "Tree Bark", "emoji": "\ud83c\udf33"},
            "right": {"id": "rough2", "text": "Rough", "emoji": "\ud83e\udea8"}
          },
          {
            "id": "p6",
            "left": {"id": "kitten", "text": "Kitten Fur", "emoji": "\ud83d\udc31"},
            "right": {"id": "soft2", "text": "Soft", "emoji": "\ud83e\uddf8"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What is TEXTURE in art?",
            "options": [
              { "id": "a", "text": "The color of something" },
              { "id": "b", "text": "How something feels or looks like it would feel" },
              { "id": "c", "text": "The shape of something" },
              { "id": "d", "text": "How big something is" }
            ],
            "correctOptionId": "b",
            "hint": "Think about petting a cat versus touching sandpaper -- that FEELING is texture!"
          },
          {
            "id": "mc2",
            "prompt": "Which of these has a SMOOTH texture?",
            "options": [
              { "id": "a", "text": "A pinecone" },
              { "id": "b", "text": "A marble" },
              { "id": "c", "text": "A piece of sandpaper" },
              { "id": "d", "text": "A crumpled paper ball" }
            ],
            "correctOptionId": "b",
            "hint": "Think about which one feels flat and silky with no bumps at all!"
          },
          {
            "id": "mc3",
            "prompt": "Can artists show texture in a painting even though a painting is flat?",
            "options": [
              { "id": "a", "text": "No, paintings are always smooth" },
              { "id": "b", "text": "Yes! Artists can make things LOOK rough, soft, or bumpy" },
              { "id": "c", "text": "Only with special paint" },
              { "id": "d", "text": "Only in sculptures" }
            ],
            "correctOptionId": "b",
            "hint": "Artists are magicians! They can use brush strokes, dots, and lines to make flat paintings LOOK like they have texture."
          },
          {
            "id": "mc4",
            "prompt": "If you wanted to draw a fluffy cloud, which texture would you show?",
            "options": [
              { "id": "a", "text": "Rough" },
              { "id": "b", "text": "Bumpy" },
              { "id": "c", "text": "Soft" },
              { "id": "d", "text": "Prickly" }
            ],
            "correctOptionId": "c",
            "hint": "Clouds look light, fluffy, and gentle -- that''s a soft texture!"
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
-- LESSON 2: Pattern Parade
-- Module: Texture & Pattern | Skill: Pattern & Repetition
-- Widgets: sequence_order + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0007-4000-8000-000000000001',
  '10000002-0506-4000-8000-000000000001',
  2,
  'Pattern Parade',
  'Discover repeating patterns in art! Learn AB, ABB, and ABC patterns and create your own.',
  'Chip LOVES patterns! Look around you -- patterns are EVERYWHERE! Stripes on a shirt, tiles on a floor, spots on a ladybug. A pattern is something that repeats over and over. Today we are going to learn three types of patterns and become pattern experts!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0005-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about different pattern types!",
        "cards": [
          {
            "id": "fc-ab",
            "front": {"text": "AB Pattern", "emoji": "\ud83d\udd34\ud83d\udd35"},
            "back": {"text": "An AB pattern has TWO things that take turns! Like: red-blue-red-blue-red-blue or circle-square-circle-square. Two things repeating forever!", "emoji": "\ud83d\udd01"}
          },
          {
            "id": "fc-abb",
            "front": {"text": "ABB Pattern", "emoji": "\ud83d\udd34\ud83d\udd35\ud83d\udd35"},
            "back": {"text": "An ABB pattern has ONE thing, then TWO of another! Like: clap-stomp-stomp-clap-stomp-stomp or star-heart-heart-star-heart-heart.", "emoji": "\ud83d\udd01"}
          },
          {
            "id": "fc-abc",
            "front": {"text": "ABC Pattern", "emoji": "\ud83d\udd34\ud83d\udd35\ud83d\udfe2"},
            "back": {"text": "An ABC pattern has THREE different things repeating! Like: red-blue-green-red-blue-green or circle-square-triangle-circle-square-triangle.", "emoji": "\ud83d\udd01"}
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Put this AB pattern in the right order!",
            "items": [
              { "id": "i1", "text": "Star" },
              { "id": "i2", "text": "Heart" },
              { "id": "i3", "text": "Star" },
              { "id": "i4", "text": "Heart" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4"],
            "hint": "An AB pattern goes: Star, Heart, Star, Heart -- two things taking turns!"
          },
          {
            "id": "seq2",
            "prompt": "Put this ABB pattern in the right order!",
            "items": [
              { "id": "i1", "text": "Circle" },
              { "id": "i2", "text": "Square" },
              { "id": "i3", "text": "Square" },
              { "id": "i4", "text": "Circle" },
              { "id": "i5", "text": "Square" },
              { "id": "i6", "text": "Square" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4", "i5", "i6"],
            "hint": "ABB means one circle, then TWO squares, then repeat! Circle, Square, Square, Circle, Square, Square."
          },
          {
            "id": "seq3",
            "prompt": "Put this ABC pattern in the right order!",
            "items": [
              { "id": "i1", "text": "Red" },
              { "id": "i2", "text": "Blue" },
              { "id": "i3", "text": "Green" },
              { "id": "i4", "text": "Red" },
              { "id": "i5", "text": "Blue" },
              { "id": "i6", "text": "Green" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4", "i5", "i6"],
            "hint": "ABC has THREE different things: Red, Blue, Green -- then it starts over! Red, Blue, Green."
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "In an AB pattern: red, blue, red, blue, red, ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "blue",
                "acceptableAnswers": ["blue", "Blue"]
              }
            ],
            "hint": "AB means two things take turns. After red always comes..."
          },
          {
            "id": "fb2",
            "prompt": "In an ABB pattern: clap, stomp, stomp, clap, stomp, ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "stomp",
                "acceptableAnswers": ["stomp", "Stomp"]
              }
            ],
            "hint": "ABB means one clap, then TWO stomps. You need one more stomp to finish the set!"
          },
          {
            "id": "fb3",
            "prompt": "In an ABC pattern: circle, triangle, star, circle, triangle, ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "star",
                "acceptableAnswers": ["star", "Star"]
              }
            ],
            "hint": "ABC has three things: circle, triangle, star. After triangle comes..."
          },
          {
            "id": "fb4",
            "prompt": "A pattern is something that ___ over and over.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "repeats",
                "acceptableAnswers": ["repeats", "Repeats", "repeat", "Repeat"]
              }
            ],
            "hint": "Patterns go again and again and again -- they keep doing the same thing!"
          },
          {
            "id": "fb5",
            "prompt": "An AB pattern has ___ things that take turns.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "2",
                "acceptableAnswers": ["2", "two", "Two"]
              }
            ],
            "hint": "A and B -- that''s how many letters? Count them!"
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
-- LESSON 3: Symmetry Butterflies
-- Module: Texture & Pattern | Skill: Symmetry
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0008-4000-8000-000000000001',
  '10000002-0506-4000-8000-000000000001',
  3,
  'Symmetry Butterflies',
  'Discover symmetry -- when both halves of something look the same! Create beautiful symmetrical designs.',
  'Chip just caught a butterfly! Well, not a real one -- a picture of one! And Chip noticed something amazing: if you fold a butterfly in half, BOTH SIDES MATCH! That magic matching is called SYMMETRY. Let''s find symmetry everywhere!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0006-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about symmetry!",
        "cards": [
          {
            "id": "fc-symmetry",
            "front": {"text": "What is Symmetry?", "emoji": "\u2696\ufe0f"},
            "back": {"text": "Symmetry means both sides match! If you fold something in half and the two sides look the same, it is symmetrical. The fold line is called the LINE OF SYMMETRY.", "emoji": "\ud83e\ude9e"}
          },
          {
            "id": "fc-butterfly",
            "front": {"text": "Butterfly Symmetry", "emoji": "\ud83e\udd8b"},
            "back": {"text": "Butterflies are perfectly symmetrical! The left wing has the same colors and patterns as the right wing. Nature is a great artist!", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "fc-line",
            "front": {"text": "Line of Symmetry", "emoji": "\u2702\ufe0f"},
            "back": {"text": "The line of symmetry is like a mirror down the middle. Whatever is on one side appears on the other side too! Some shapes have one line of symmetry, and some have many.", "emoji": "\ud83e\ude9e"}
          },
          {
            "id": "fc-notsym",
            "front": {"text": "Not Symmetrical", "emoji": "\ud83c\udf00"},
            "back": {"text": "Some things are NOT symmetrical -- and that''s cool too! A hand waving, a tree blowing in the wind, or a paint splatter. These are called ASYMMETRICAL.", "emoji": "\ud83c\udfa8"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each thing to whether it is symmetrical or not!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "butterfly", "text": "Butterfly", "emoji": "\ud83e\udd8b"},
            "right": {"id": "sym1", "text": "Symmetrical", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "p2",
            "left": {"id": "heart", "text": "Heart Shape", "emoji": "\u2764\ufe0f"},
            "right": {"id": "sym2", "text": "Symmetrical", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "p3",
            "left": {"id": "cloud", "text": "Cloud", "emoji": "\u2601\ufe0f"},
            "right": {"id": "asym1", "text": "Not Symmetrical", "emoji": "\ud83c\udf00"}
          },
          {
            "id": "p4",
            "left": {"id": "star", "text": "Star", "emoji": "\u2b50"},
            "right": {"id": "sym3", "text": "Symmetrical", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "p5",
            "left": {"id": "splatter", "text": "Paint Splatter", "emoji": "\ud83c\udfa8"},
            "right": {"id": "asym2", "text": "Not Symmetrical", "emoji": "\ud83c\udf00"}
          },
          {
            "id": "p6",
            "left": {"id": "ladybug", "text": "Ladybug", "emoji": "\ud83d\udc1e"},
            "right": {"id": "sym4", "text": "Symmetrical", "emoji": "\u2696\ufe0f"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What does SYMMETRY mean?",
            "options": [
              { "id": "a", "text": "Something is very colorful" },
              { "id": "b", "text": "Both halves look the same when folded" },
              { "id": "c", "text": "Something has lots of shapes" },
              { "id": "d", "text": "Something is very big" }
            ],
            "correctOptionId": "b",
            "hint": "Think about folding a butterfly in half -- what happens?"
          },
          {
            "id": "mc2",
            "prompt": "What is the LINE OF SYMMETRY?",
            "options": [
              { "id": "a", "text": "A line you draw around the outside" },
              { "id": "b", "text": "The fold line where both halves match" },
              { "id": "c", "text": "A line at the bottom of the drawing" },
              { "id": "d", "text": "The longest line in a picture" }
            ],
            "correctOptionId": "b",
            "hint": "Imagine folding paper in half -- that fold is the line of symmetry!"
          },
          {
            "id": "mc3",
            "prompt": "Which letter of the alphabet is SYMMETRICAL?",
            "options": [
              { "id": "a", "text": "F" },
              { "id": "b", "text": "J" },
              { "id": "c", "text": "A" },
              { "id": "d", "text": "G" }
            ],
            "correctOptionId": "c",
            "hint": "Try drawing a line down the middle of each letter. Which one has matching sides?"
          },
          {
            "id": "mc4",
            "prompt": "A butterfly is a great example of symmetry because...",
            "options": [
              { "id": "a", "text": "It can fly" },
              { "id": "b", "text": "Its left and right wings have the same pattern" },
              { "id": "c", "text": "It is very small" },
              { "id": "d", "text": "It is colorful" }
            ],
            "correctOptionId": "b",
            "hint": "Look at a butterfly''s wings -- the left side mirrors the right side!"
          },
          {
            "id": "mc5",
            "prompt": "Something that is NOT symmetrical is called ___.",
            "options": [
              { "id": "a", "text": "Symmetrical" },
              { "id": "b", "text": "Asymmetrical" },
              { "id": "c", "text": "Invisible" },
              { "id": "d", "text": "Colorful" }
            ],
            "correctOptionId": "b",
            "hint": "The prefix ''a'' means ''not.'' So ''a-symmetrical'' means not symmetrical!"
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
-- LESSON 4: Patterns in Nature
-- Module: Texture & Pattern | Skills: Pattern & Repetition, Texture
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-0009-4000-8000-000000000001',
  '10000002-0506-4000-8000-000000000001',
  4,
  'Patterns in Nature',
  'Find amazing patterns in nature! Discover how flowers, shells, snowflakes, and more use patterns and textures.',
  'Chip just came back from an adventure outside and WOW -- nature is the BEST artist! Flowers have patterns, seashells have spirals, snowflakes have symmetry, and leaves have amazing textures. Let''s go on a nature pattern hunt together!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0005-4000-8000-000000000001', '20000005-0004-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to discover patterns in nature!",
        "cards": [
          {
            "id": "fc-flowers",
            "front": {"text": "Flower Patterns", "emoji": "\ud83c\udf3b"},
            "back": {"text": "Flowers have radial patterns -- petals spread out from the center like a sun! Many flowers have 5 or 6 petals arranged in a perfect circle. Sunflowers even have spiral patterns in their seeds!", "emoji": "\ud83c\udf3c"}
          },
          {
            "id": "fc-shells",
            "front": {"text": "Shell Spirals", "emoji": "\ud83d\udc1a"},
            "back": {"text": "Seashells have spiral patterns that swirl around and around, getting bigger as they go! This spiral pattern is found in snail shells, nautilus shells, and even hurricanes!", "emoji": "\ud83c\udf00"}
          },
          {
            "id": "fc-snowflakes",
            "front": {"text": "Snowflake Symmetry", "emoji": "\u2744\ufe0f"},
            "back": {"text": "Every snowflake has SIX arms, and each arm matches the others! Snowflakes are a beautiful example of symmetry in nature. No two snowflakes are exactly alike!", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "fc-leaves",
            "front": {"text": "Leaf Textures", "emoji": "\ud83c\udf43"},
            "back": {"text": "Leaves have wonderful textures! They have veins that branch out like tiny roads. Some leaves are smooth, some are fuzzy, some are waxy, and some have bumpy edges!", "emoji": "\ud83c\udf3f"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each thing in nature to the pattern or texture it shows!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "sunflower", "text": "Sunflower", "emoji": "\ud83c\udf3b"},
            "right": {"id": "spiral", "text": "Spiral Pattern", "emoji": "\ud83c\udf00"}
          },
          {
            "id": "p2",
            "left": {"id": "snowflake", "text": "Snowflake", "emoji": "\u2744\ufe0f"},
            "right": {"id": "sixfold", "text": "6-Part Symmetry", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "p3",
            "left": {"id": "pinecone", "text": "Pinecone", "emoji": "\ud83c\udf32"},
            "right": {"id": "rough", "text": "Rough Texture", "emoji": "\ud83e\udea8"}
          },
          {
            "id": "p4",
            "left": {"id": "zebra", "text": "Zebra", "emoji": "\ud83e\udd93"},
            "right": {"id": "stripes", "text": "Stripe Pattern", "emoji": "\ud83d\udcf6"}
          },
          {
            "id": "p5",
            "left": {"id": "seashell", "text": "Seashell", "emoji": "\ud83d\udc1a"},
            "right": {"id": "spiral2", "text": "Spiral Pattern", "emoji": "\ud83c\udf00"}
          },
          {
            "id": "p6",
            "left": {"id": "rose", "text": "Rose Petal", "emoji": "\ud83c\udf39"},
            "right": {"id": "smooth", "text": "Smooth Texture", "emoji": "\u2728"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "How many arms does every snowflake have?",
            "options": [
              { "id": "a", "text": "4 arms" },
              { "id": "b", "text": "5 arms" },
              { "id": "c", "text": "6 arms" },
              { "id": "d", "text": "8 arms" }
            ],
            "correctOptionId": "c",
            "hint": "Snowflakes always have six arms -- and each arm matches the others!"
          },
          {
            "id": "mc2",
            "prompt": "What kind of pattern does a seashell show?",
            "options": [
              { "id": "a", "text": "Zigzag" },
              { "id": "b", "text": "Spiral" },
              { "id": "c", "text": "Checkerboard" },
              { "id": "d", "text": "Polka dots" }
            ],
            "correctOptionId": "b",
            "hint": "Seashells swirl around and around, getting bigger -- that''s a spiral!"
          },
          {
            "id": "mc3",
            "prompt": "A zebra''s stripes are an example of what?",
            "options": [
              { "id": "a", "text": "A spiral pattern" },
              { "id": "b", "text": "Smooth texture" },
              { "id": "c", "text": "A repeating stripe pattern" },
              { "id": "d", "text": "Symmetry only" }
            ],
            "correctOptionId": "c",
            "hint": "Black stripe, white stripe, black stripe, white stripe -- that''s a repeating pattern!"
          },
          {
            "id": "mc4",
            "prompt": "Why is nature a great place to find art patterns?",
            "options": [
              { "id": "a", "text": "Nature only has one pattern" },
              { "id": "b", "text": "Nature is full of spirals, symmetry, textures, and repeating patterns" },
              { "id": "c", "text": "Nature has no patterns" },
              { "id": "d", "text": "Only flowers have patterns" }
            ],
            "correctOptionId": "b",
            "hint": "Look around! Nature has spirals in shells, symmetry in snowflakes, stripes on zebras, and so much more!"
          },
          {
            "id": "mc5",
            "prompt": "Which part of a leaf creates a branching pattern?",
            "options": [
              { "id": "a", "text": "The color" },
              { "id": "b", "text": "The veins" },
              { "id": "c", "text": "The stem" },
              { "id": "d", "text": "The roots" }
            ],
            "correctOptionId": "b",
            "hint": "Look closely at a leaf -- you will see tiny lines that branch out like roads. Those are veins!"
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
-- LESSON 5: Design Your Own Pattern
-- Module: Texture & Pattern | Skills: Pattern & Repetition, Symmetry
-- Widgets: fill_in_blank + sequence_order
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000a-4000-8000-000000000001',
  '10000002-0506-4000-8000-000000000001',
  5,
  'Design Your Own Pattern',
  'Use everything you have learned about texture, patterns, and symmetry to design your own repeating pattern!',
  'Chip is SO proud of you! You have learned about textures, patterns, and symmetry -- now it is time to put it ALL together! Let''s test your pattern brain and see if you can complete patterns, fix sequences, and think like a real pattern designer!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0005-4000-8000-000000000001', '20000005-0006-4000-8000-000000000001']::uuid[],
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
            "prompt": "Complete the AB pattern: circle, square, circle, square, circle, ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "square",
                "acceptableAnswers": ["square", "Square"]
              }
            ],
            "hint": "AB means two shapes take turns. After circle always comes..."
          },
          {
            "id": "fb2",
            "prompt": "Complete the ABB pattern: star, moon, moon, star, moon, ___",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "moon",
                "acceptableAnswers": ["moon", "Moon"]
              }
            ],
            "hint": "ABB means one star, then TWO moons. You need one more moon!"
          },
          {
            "id": "fb3",
            "prompt": "A design where both halves match is called ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "symmetrical",
                "acceptableAnswers": ["symmetrical", "Symmetrical", "symmetry", "Symmetry", "symmetric", "Symmetric"]
              }
            ],
            "hint": "When you fold something in half and both sides look the same, that''s called..."
          },
          {
            "id": "fb4",
            "prompt": "How something feels when you touch it is called ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "texture",
                "acceptableAnswers": ["texture", "Texture"]
              }
            ],
            "hint": "Rough, smooth, bumpy, soft -- these are all types of..."
          },
          {
            "id": "fb5",
            "prompt": "An ABC pattern has ___ different things that repeat.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "3",
                "acceptableAnswers": ["3", "three", "Three"]
              }
            ],
            "hint": "A, B, C -- count those letters!"
          }
        ]
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "seq1",
            "prompt": "Build an AB pattern with shapes!",
            "items": [
              { "id": "i1", "text": "Triangle" },
              { "id": "i2", "text": "Diamond" },
              { "id": "i3", "text": "Triangle" },
              { "id": "i4", "text": "Diamond" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4"],
            "hint": "AB means two shapes take turns: Triangle, Diamond, Triangle, Diamond!"
          },
          {
            "id": "seq2",
            "prompt": "Build an ABB pattern: one star, then two circles, repeating!",
            "items": [
              { "id": "i1", "text": "Star" },
              { "id": "i2", "text": "Circle" },
              { "id": "i3", "text": "Circle" },
              { "id": "i4", "text": "Star" },
              { "id": "i5", "text": "Circle" },
              { "id": "i6", "text": "Circle" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4", "i5", "i6"],
            "hint": "ABB: Star (A), Circle (B), Circle (B), then repeat! Star, Circle, Circle, Star, Circle, Circle."
          },
          {
            "id": "seq3",
            "prompt": "Build an ABC pattern with textures: rough, smooth, bumpy!",
            "items": [
              { "id": "i1", "text": "Rough" },
              { "id": "i2", "text": "Smooth" },
              { "id": "i3", "text": "Bumpy" },
              { "id": "i4", "text": "Rough" },
              { "id": "i5", "text": "Smooth" },
              { "id": "i6", "text": "Bumpy" }
            ],
            "correctOrder": ["i1", "i2", "i3", "i4", "i5", "i6"],
            "hint": "ABC has three things: Rough, Smooth, Bumpy -- then start over! Rough, Smooth, Bumpy."
          },
          {
            "id": "seq4",
            "prompt": "Put these pattern types in order from SIMPLEST to MOST COMPLEX!",
            "items": [
              { "id": "i-ab", "text": "AB Pattern (2 things)" },
              { "id": "i-abb", "text": "ABB Pattern (1+2 things)" },
              { "id": "i-abc", "text": "ABC Pattern (3 things)" }
            ],
            "correctOrder": ["i-ab", "i-abb", "i-abc"],
            "hint": "Start with the simplest (two things taking turns) and end with the most complex (three different things)!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
