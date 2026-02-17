-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Art: Art & Feelings Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Color and Mood
--   - Happy Art vs Calm Art
--   - Meet Mondrian
--   - Meet Kandinsky
--   - My Feelings Artwork
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: matching_pairs, multiple_choice, flash_card, fill_in_blank
--
-- Subject ID:
--   Art: 5a848c8e-f476-4cd5-8d04-c67492961bc8
--
-- Module ID:
--   Art & Feelings: 10000002-0507-4000-8000-000000000001
--
-- Skill IDs:
--   Color & Mood:    20000005-0007-4000-8000-000000000001
--   Famous Artists:  20000005-0008-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             020_seed_2nd_grade_music_art.sql (Art subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Art 2nd Grade: Color & Mood, Famous Artists
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000005-0007-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'color_mood', 'Color & Mood', 'Identify how colors can express emotions and moods in artwork', 'VA:Re8.1.2a', 7),
  ('20000005-0008-4000-8000-000000000001', '5a848c8e-f476-4cd5-8d04-c67492961bc8', 'famous_artists_feelings', 'Famous Artists', 'Recognize the styles of famous artists (Mondrian, Kandinsky) and describe how their art makes us feel', 'VA:Re7.1.2a', 8)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Art: Art & Feelings)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0507-4000-8000-000000000001', 2, 34, 'Art & Feelings', 'Explore how colors and art express emotions! Meet famous artists and create your own feelings artwork.', 'palette', '5a848c8e-f476-4cd5-8d04-c67492961bc8')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- ART LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Color and Mood
-- Module: Art & Feelings | Skill: Color & Mood
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000b-4000-8000-000000000001',
  '10000002-0507-4000-8000-000000000001',
  1,
  'Color and Mood',
  'Discover how colors can make us feel different emotions! Red feels energetic, blue feels calm, and yellow feels happy.',
  'Hey art explorer! Chip here! Did you know that colors aren''t just pretty to look at -- they can actually change how you FEEL? Some colors make you feel excited and full of energy, while others make you feel calm and peaceful. Let''s explore the amazing connection between colors and feelings!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each color to the feeling it often creates!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "red", "text": "Red", "emoji": "\ud83d\udd34"},
            "right": {"id": "energetic", "text": "Energetic & Exciting", "emoji": "\u26a1"}
          },
          {
            "id": "p2",
            "left": {"id": "blue", "text": "Blue", "emoji": "\ud83d\udd35"},
            "right": {"id": "calm", "text": "Calm & Peaceful", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "p3",
            "left": {"id": "yellow", "text": "Yellow", "emoji": "\ud83d\udfe1"},
            "right": {"id": "happy", "text": "Happy & Cheerful", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "p4",
            "left": {"id": "green", "text": "Green", "emoji": "\ud83d\udfe2"},
            "right": {"id": "relaxed", "text": "Relaxed & Natural", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "p5",
            "left": {"id": "orange", "text": "Orange", "emoji": "\ud83d\udfe0"},
            "right": {"id": "playful", "text": "Playful & Warm", "emoji": "\ud83c\udf1e"}
          },
          {
            "id": "p6",
            "left": {"id": "purple", "text": "Purple", "emoji": "\ud83d\udfe3"},
            "right": {"id": "mysterious", "text": "Mysterious & Magical", "emoji": "\u2728"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "An artist wants to paint a picture that feels exciting and full of energy. Which color would work BEST?",
            "options": [
              { "id": "a", "text": "Light blue" },
              { "id": "b", "text": "Bright red" },
              { "id": "c", "text": "Soft gray" },
              { "id": "d", "text": "Pale green" }
            ],
            "correctOptionId": "b",
            "hint": "Think about what color a fire truck is -- red is bold, exciting, and full of energy!"
          },
          {
            "id": "mc2",
            "prompt": "Which color would help make a painting feel calm and peaceful, like the ocean?",
            "options": [
              { "id": "a", "text": "Bright red" },
              { "id": "b", "text": "Neon yellow" },
              { "id": "c", "text": "Soft blue" },
              { "id": "d", "text": "Hot pink" }
            ],
            "correctOptionId": "c",
            "hint": "Think about the color of a calm sea or a clear sky -- it makes you feel relaxed!"
          },
          {
            "id": "mc3",
            "prompt": "A painting uses lots of bright yellow and orange. How does it probably make people feel?",
            "options": [
              { "id": "a", "text": "Sad and gloomy" },
              { "id": "b", "text": "Scared and worried" },
              { "id": "c", "text": "Happy and warm" },
              { "id": "d", "text": "Sleepy and tired" }
            ],
            "correctOptionId": "c",
            "hint": "Yellow and orange are like sunshine! They make us feel cheerful and warm."
          },
          {
            "id": "mc4",
            "prompt": "Why do artists choose certain colors for their paintings?",
            "options": [
              { "id": "a", "text": "Because those are the only colors they have" },
              { "id": "b", "text": "To create a mood or feeling for the viewer" },
              { "id": "c", "text": "Because their teacher told them to" },
              { "id": "d", "text": "Colors don''t matter in art" }
            ],
            "correctOptionId": "b",
            "hint": "Artists are very thoughtful about color! They pick colors to make you FEEL something when you look at their art."
          },
          {
            "id": "mc5",
            "prompt": "Which color often makes people feel mysterious or magical?",
            "options": [
              { "id": "a", "text": "Brown" },
              { "id": "b", "text": "White" },
              { "id": "c", "text": "Purple" },
              { "id": "d", "text": "Gray" }
            ],
            "correctOptionId": "c",
            "hint": "Think about wizard hats and fairy tale magic -- what color do you imagine?"
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
-- LESSON 2: Happy Art vs Calm Art
-- Module: Art & Feelings | Skill: Color & Mood
-- Widgets: multiple_choice + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000c-4000-8000-000000000001',
  '10000002-0507-4000-8000-000000000001',
  2,
  'Happy Art vs Calm Art',
  'Compare artwork that feels happy and joyful with artwork that feels calm and quiet. Learn to spot the differences!',
  'Chip has been looking at SO much art lately! Some paintings make Chip want to dance around, and others make Chip feel like taking a cozy nap. Today we''re going to learn how to tell if artwork feels HAPPY and bouncy or CALM and quiet. The secret is in the colors, shapes, and lines!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "A painting has bright yellow sunflowers, swirly orange lines, and big bouncy shapes. This painting probably feels...",
            "options": [
              { "id": "a", "text": "Sad and lonely" },
              { "id": "b", "text": "Happy and energetic" },
              { "id": "c", "text": "Scary and dark" },
              { "id": "d", "text": "Boring and quiet" }
            ],
            "correctOptionId": "b",
            "hint": "Bright colors, swirly lines, and bouncy shapes all feel energetic and joyful!"
          },
          {
            "id": "mc2",
            "prompt": "A painting has soft blue and green colors, smooth wavy lines, and gentle shapes. This painting probably feels...",
            "options": [
              { "id": "a", "text": "Angry and loud" },
              { "id": "b", "text": "Excited and wild" },
              { "id": "c", "text": "Calm and peaceful" },
              { "id": "d", "text": "Confused and messy" }
            ],
            "correctOptionId": "c",
            "hint": "Cool colors and smooth, gentle shapes create a relaxing, peaceful feeling."
          },
          {
            "id": "mc3",
            "prompt": "Which type of lines make artwork feel more ENERGETIC?",
            "options": [
              { "id": "a", "text": "Smooth, straight horizontal lines" },
              { "id": "b", "text": "Zigzag and swirly lines" },
              { "id": "c", "text": "Very thin, barely visible lines" },
              { "id": "d", "text": "No lines at all" }
            ],
            "correctOptionId": "b",
            "hint": "Zigzag lines feel like lightning and swirly lines feel like dancing -- both are full of energy!"
          },
          {
            "id": "mc4",
            "prompt": "An artist wants to make a calm painting of a lake at sunset. What should they use?",
            "options": [
              { "id": "a", "text": "Bright neon colors and sharp zigzag lines" },
              { "id": "b", "text": "Only black and white with thick lines" },
              { "id": "c", "text": "Soft warm and cool colors with smooth, gentle lines" },
              { "id": "d", "text": "Lots of tiny dots in random places" }
            ],
            "correctOptionId": "c",
            "hint": "A calm sunset needs gentle colors and smooth lines -- nothing too wild or sharp!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each art description to the mood it creates!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "bright-swirl", "text": "Bright colors & swirly lines", "emoji": "\ud83c\udf00"},
            "right": {"id": "happy", "text": "Happy & Energetic", "emoji": "\ud83d\ude04"}
          },
          {
            "id": "p2",
            "left": {"id": "soft-wave", "text": "Soft blues & wavy lines", "emoji": "\ud83c\udf0a"},
            "right": {"id": "calm", "text": "Calm & Peaceful", "emoji": "\ud83d\ude0c"}
          },
          {
            "id": "p3",
            "left": {"id": "warm-big", "text": "Warm reds & big bold shapes", "emoji": "\u2764\ufe0f"},
            "right": {"id": "excited", "text": "Excited & Passionate", "emoji": "\ud83d\udd25"}
          },
          {
            "id": "p4",
            "left": {"id": "dark-sharp", "text": "Dark colors & sharp angles", "emoji": "\ud83d\udd3a"},
            "right": {"id": "serious", "text": "Serious & Dramatic", "emoji": "\ud83c\udfad"}
          },
          {
            "id": "p5",
            "left": {"id": "pastel-round", "text": "Pastel colors & round shapes", "emoji": "\ud83e\udee7"},
            "right": {"id": "gentle", "text": "Gentle & Dreamy", "emoji": "\u2601\ufe0f"}
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
-- LESSON 3: Meet Mondrian
-- Module: Art & Feelings | Skill: Famous Artists
-- Widgets: flash_card + matching_pairs
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000d-4000-8000-000000000001',
  '10000002-0507-4000-8000-000000000001',
  3,
  'Meet Mondrian',
  'Meet Piet Mondrian, the artist who made beautiful art with just straight lines, rectangles, and primary colors!',
  'Chip found an artist who ONLY uses straight lines and a few colors -- and his art is AMAZING! His name is Piet Mondrian, and he proved that you don''t need complicated drawings to make something beautiful. Just lines, rectangles, and primary colors. Let''s explore his world of geometric art!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about Piet Mondrian and his art!",
        "cards": [
          {
            "id": "fc-who",
            "front": {"text": "Who was Piet Mondrian?", "emoji": "\ud83c\udfa8"},
            "back": {"text": "Piet Mondrian (1872-1944) was a Dutch artist who believed that the simplest shapes and colors could make the most powerful art. He moved from the Netherlands to Paris and later to New York City!", "emoji": "\ud83c\uddf3\ud83c\uddf1"}
          },
          {
            "id": "fc-style",
            "front": {"text": "What does Mondrian''s art look like?", "emoji": "\ud83d\uddbc\ufe0f"},
            "back": {"text": "Mondrian''s famous paintings are made of straight black lines that create rectangles. He filled some rectangles with red, blue, or yellow, and left others white. It looks like a colorful grid!", "emoji": "\ud83d\udfe5"}
          },
          {
            "id": "fc-lines",
            "front": {"text": "Why only straight lines?", "emoji": "\ud83d\udccf"},
            "back": {"text": "Mondrian believed straight lines -- horizontal and vertical -- were the most pure and balanced. He never used diagonal or curvy lines in his famous grid paintings! He wanted perfect order and harmony.", "emoji": "\u2696\ufe0f"}
          },
          {
            "id": "fc-colors",
            "front": {"text": "Why only primary colors?", "emoji": "\ud83d\udd34\ud83d\udd35\ud83d\udfe1"},
            "back": {"text": "Mondrian used only red, blue, and yellow (the primary colors) plus black, white, and gray. He thought these were the most basic, essential colors. Simple but powerful!", "emoji": "\ud83c\udfa8"}
          },
          {
            "id": "fc-feeling",
            "front": {"text": "How does Mondrian''s art make people feel?", "emoji": "\ud83d\ude0c"},
            "back": {"text": "Mondrian''s art feels organized, balanced, and calm. The straight lines and clean shapes create a feeling of order and harmony. Some people also think it looks fun -- like a colorful puzzle!", "emoji": "\ud83e\udde9"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each fact about Mondrian to the correct answer!",
        "pairs": [
          {
            "id": "p1",
            "left": {"id": "lines", "text": "Types of lines Mondrian used", "emoji": "\ud83d\udccf"},
            "right": {"id": "straight", "text": "Only straight lines", "emoji": "\u2796"}
          },
          {
            "id": "p2",
            "left": {"id": "shapes", "text": "Shapes in his paintings", "emoji": "\u2b1c"},
            "right": {"id": "rectangles", "text": "Rectangles", "emoji": "\ud83d\udfe5"}
          },
          {
            "id": "p3",
            "left": {"id": "colors", "text": "Colors he used", "emoji": "\ud83c\udfa8"},
            "right": {"id": "primary", "text": "Red, Blue, Yellow + Black & White", "emoji": "\ud83d\udd34\ud83d\udd35\ud83d\udfe1"}
          },
          {
            "id": "p4",
            "left": {"id": "country", "text": "Country he was from", "emoji": "\ud83c\uddf3\ud83c\uddf1"},
            "right": {"id": "netherlands", "text": "The Netherlands", "emoji": "\ud83c\udf37"}
          },
          {
            "id": "p5",
            "left": {"id": "mood", "text": "How his art feels", "emoji": "\ud83d\ude0c"},
            "right": {"id": "balanced", "text": "Balanced & Organized", "emoji": "\u2696\ufe0f"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What kind of lines did Mondrian use in his famous grid paintings?",
            "options": [
              { "id": "a", "text": "Curvy, wavy lines" },
              { "id": "b", "text": "Only straight lines" },
              { "id": "c", "text": "Zigzag lines" },
              { "id": "d", "text": "Dotted lines" }
            ],
            "correctOptionId": "b",
            "hint": "Mondrian believed straight lines were the most pure -- no curves allowed!"
          },
          {
            "id": "mc2",
            "prompt": "Which colors did Mondrian use in his famous paintings?",
            "options": [
              { "id": "a", "text": "All the colors of the rainbow" },
              { "id": "b", "text": "Only green and purple" },
              { "id": "c", "text": "Red, blue, yellow, black, and white" },
              { "id": "d", "text": "Only black and white" }
            ],
            "correctOptionId": "c",
            "hint": "He used the three PRIMARY colors plus black and white -- just five colors total!"
          },
          {
            "id": "mc3",
            "prompt": "What shape appears most in Mondrian''s art?",
            "options": [
              { "id": "a", "text": "Circles" },
              { "id": "b", "text": "Triangles" },
              { "id": "c", "text": "Stars" },
              { "id": "d", "text": "Rectangles" }
            ],
            "correctOptionId": "d",
            "hint": "When straight lines cross each other horizontally and vertically, they create this four-sided shape!"
          },
          {
            "id": "mc4",
            "prompt": "What can we learn from Mondrian''s art?",
            "options": [
              { "id": "a", "text": "Art must be complicated to be beautiful" },
              { "id": "b", "text": "Simple shapes and colors can make powerful art" },
              { "id": "c", "text": "You need lots of different colors" },
              { "id": "d", "text": "Only famous artists can make good art" }
            ],
            "correctOptionId": "b",
            "hint": "Mondrian showed the whole world that SIMPLE can be AMAZING!"
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
-- LESSON 4: Meet Kandinsky
-- Module: Art & Feelings | Skill: Famous Artists
-- Widgets: flash_card + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000e-4000-8000-000000000001',
  '10000002-0507-4000-8000-000000000001',
  4,
  'Meet Kandinsky',
  'Meet Wassily Kandinsky, the artist who painted music! He used colorful circles, shapes, and wild lines to show how sounds and feelings look.',
  'Chip just discovered something WILD! There was an artist named Wassily Kandinsky who said he could SEE music as colors and shapes! When he heard a trumpet, he saw bright yellow. When he heard a cello, he saw deep blue. He turned sounds and feelings into amazing abstract art. Let''s explore his colorful world!',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about Wassily Kandinsky!",
        "cards": [
          {
            "id": "fc-who",
            "front": {"text": "Who was Wassily Kandinsky?", "emoji": "\ud83c\udfa8"},
            "back": {"text": "Wassily Kandinsky (1866-1944) was a Russian artist who is often called the father of abstract art. He was one of the first artists to paint pictures that didn''t look like real things -- just shapes, colors, and lines!", "emoji": "\ud83c\uddf7\ud83c\uddfa"}
          },
          {
            "id": "fc-circles",
            "front": {"text": "Kandinsky loved CIRCLES!", "emoji": "\u2b55"},
            "back": {"text": "Circles were Kandinsky''s favorite shape! He painted many artworks full of colorful, overlapping circles of different sizes. He called the circle the most peaceful shape because it has no corners or sharp edges.", "emoji": "\ud83d\udfe2\ud83d\udd35\ud83d\udd34"}
          },
          {
            "id": "fc-music",
            "front": {"text": "Painting music?!", "emoji": "\ud83c\udfb5"},
            "back": {"text": "Kandinsky believed colors and shapes could be like music! He gave his paintings musical names like ''Composition'' and ''Improvisation.'' He said looking at a painting should feel like listening to a song.", "emoji": "\ud83c\udfb6"}
          },
          {
            "id": "fc-colors",
            "front": {"text": "Kandinsky''s color feelings", "emoji": "\ud83c\udf08"},
            "back": {"text": "Kandinsky gave every color a feeling! Yellow was exciting like a trumpet blast. Blue was deep and calm like a cello. Red was strong and confident. Green was peaceful and still.", "emoji": "\ud83c\udfa8"}
          },
          {
            "id": "fc-abstract",
            "front": {"text": "What is abstract art?", "emoji": "\ud83e\udee8"},
            "back": {"text": "Abstract art doesn''t try to look like real things (like a house or a dog). Instead, it uses colors, shapes, and lines to express FEELINGS and IDEAS. Kandinsky helped invent this style!", "emoji": "\ud83d\udcad"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "What was Kandinsky''s favorite shape?",
            "options": [
              { "id": "a", "text": "Squares" },
              { "id": "b", "text": "Triangles" },
              { "id": "c", "text": "Circles" },
              { "id": "d", "text": "Stars" }
            ],
            "correctOptionId": "c",
            "hint": "He painted LOTS of these round shapes -- he called them the most peaceful shape!"
          },
          {
            "id": "mc2",
            "prompt": "Kandinsky is often called the father of what kind of art?",
            "options": [
              { "id": "a", "text": "Portrait art" },
              { "id": "b", "text": "Abstract art" },
              { "id": "c", "text": "Landscape art" },
              { "id": "d", "text": "Comic art" }
            ],
            "correctOptionId": "b",
            "hint": "His art doesn''t look like real things -- it uses shapes and colors to show feelings and ideas!"
          },
          {
            "id": "mc3",
            "prompt": "How is Kandinsky''s art DIFFERENT from Mondrian''s art?",
            "options": [
              { "id": "a", "text": "Kandinsky used lots of curvy shapes; Mondrian used only straight lines" },
              { "id": "b", "text": "They are exactly the same" },
              { "id": "c", "text": "Mondrian used more colors than Kandinsky" },
              { "id": "d", "text": "Kandinsky only used black and white" }
            ],
            "correctOptionId": "a",
            "hint": "Remember Mondrian''s straight lines and rectangles? Kandinsky was the opposite -- circles, curves, and wild lines!"
          },
          {
            "id": "mc4",
            "prompt": "What special thing could Kandinsky do when he heard music?",
            "options": [
              { "id": "a", "text": "He could play every instrument" },
              { "id": "b", "text": "He could see colors and shapes in his mind" },
              { "id": "c", "text": "He could make the music louder" },
              { "id": "d", "text": "He could write the notes down" }
            ],
            "correctOptionId": "b",
            "hint": "When Kandinsky heard sounds, his brain turned them into colors and shapes -- that''s why he ''painted music''!"
          },
          {
            "id": "mc5",
            "prompt": "According to Kandinsky, yellow felt like which instrument?",
            "options": [
              { "id": "a", "text": "A quiet violin" },
              { "id": "b", "text": "A deep cello" },
              { "id": "c", "text": "A loud trumpet" },
              { "id": "d", "text": "A soft flute" }
            ],
            "correctOptionId": "c",
            "hint": "Yellow is bright and exciting -- just like the bold, brassy sound of this instrument!"
          },
          {
            "id": "mc6",
            "prompt": "What does ABSTRACT art show?",
            "options": [
              { "id": "a", "text": "Only photographs of real places" },
              { "id": "b", "text": "Feelings and ideas using shapes, colors, and lines" },
              { "id": "c", "text": "Only pictures of people" },
              { "id": "d", "text": "Only words and letters" }
            ],
            "correctOptionId": "b",
            "hint": "Abstract art doesn''t copy real things -- it expresses feelings through colors and shapes!"
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
-- LESSON 5: My Feelings Artwork
-- Module: Art & Feelings | Skill: Color & Mood
-- Widgets: multiple_choice + fill_in_blank
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000006-000f-4000-8000-000000000001',
  '10000002-0507-4000-8000-000000000001',
  5,
  'My Feelings Artwork',
  'Plan your very own artwork that expresses a feeling! Choose colors, shapes, and lines to show an emotion.',
  'Now it''s YOUR turn to be the artist! Chip wants you to plan an amazing artwork that shows a FEELING. You get to pick the emotion, choose the colors, decide on shapes and lines, and plan it all out. Every real artist starts with a plan -- and that''s exactly what we''re going to do! Ready to create something wonderful?',
  NULL, NULL,
  '[]'::jsonb,
  '5a848c8e-f476-4cd5-8d04-c67492961bc8',
  ARRAY['20000005-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "mc1",
            "prompt": "If you wanted to make art about feeling JOYFUL, which colors would be the best choice?",
            "options": [
              { "id": "a", "text": "Dark gray and black" },
              { "id": "b", "text": "Bright yellow, orange, and pink" },
              { "id": "c", "text": "Only white" },
              { "id": "d", "text": "Dark brown and dark green" }
            ],
            "correctOptionId": "b",
            "hint": "Joyful feelings are bright and warm -- like sunshine colors!"
          },
          {
            "id": "mc2",
            "prompt": "Which shapes would BEST show a feeling of calmness?",
            "options": [
              { "id": "a", "text": "Sharp zigzag shapes" },
              { "id": "b", "text": "Smooth circles and gentle waves" },
              { "id": "c", "text": "Spiky triangles pointing everywhere" },
              { "id": "d", "text": "Tiny dots in messy patterns" }
            ],
            "correctOptionId": "b",
            "hint": "Calm feelings are smooth and gentle -- no sharp edges or wild patterns!"
          },
          {
            "id": "mc3",
            "prompt": "You want to paint excitement! Which lines would show that feeling?",
            "options": [
              { "id": "a", "text": "Slow, straight horizontal lines" },
              { "id": "b", "text": "No lines at all" },
              { "id": "c", "text": "Bold, swirly, zigzag lines going in many directions" },
              { "id": "d", "text": "One single thin line" }
            ],
            "correctOptionId": "c",
            "hint": "Excitement is wild and full of energy! The lines should show that movement and action!"
          },
          {
            "id": "mc4",
            "prompt": "An artist like Kandinsky would say that a painting about PEACEFULNESS should have...",
            "options": [
              { "id": "a", "text": "Bright red zigzags and sharp triangles" },
              { "id": "b", "text": "Soft blues and greens with gentle circles" },
              { "id": "c", "text": "Neon colors flashing everywhere" },
              { "id": "d", "text": "Only straight black lines" }
            ],
            "correctOptionId": "b",
            "hint": "Remember what Kandinsky said about blue? It feels deep and calm, like a cello!"
          },
          {
            "id": "mc5",
            "prompt": "What is the FIRST step when planning your own feelings artwork?",
            "options": [
              { "id": "a", "text": "Grab any random colors and start painting" },
              { "id": "b", "text": "Copy someone else''s painting exactly" },
              { "id": "c", "text": "Choose the feeling you want to express" },
              { "id": "d", "text": "Use only one color" }
            ],
            "correctOptionId": "c",
            "hint": "Before you pick colors or shapes, you need to know WHAT feeling you want to show!"
          }
        ]
      },
      {
        "type": "fill_in_blank",
        "questions": [
          {
            "id": "fb1",
            "prompt": "To show a happy feeling, I would use bright ___ and warm colors.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "yellow",
                "acceptableAnswers": ["yellow", "Yellow", "orange", "Orange", "colors", "Colors"]
              }
            ],
            "hint": "Think of the color of sunshine -- it''s the happiest color!"
          },
          {
            "id": "fb2",
            "prompt": "Kandinsky''s favorite shape was the ___.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "circle",
                "acceptableAnswers": ["circle", "Circle"]
              }
            ],
            "hint": "This round shape has no corners -- Kandinsky called it the most peaceful shape!"
          },
          {
            "id": "fb3",
            "prompt": "Mondrian used only ___ lines in his famous paintings.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "straight",
                "acceptableAnswers": ["straight", "Straight"]
              }
            ],
            "hint": "No curves, no zigzags -- just perfectly horizontal and vertical lines!"
          },
          {
            "id": "fb4",
            "prompt": "Art that uses shapes and colors to express feelings instead of showing real things is called ___ art.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "abstract",
                "acceptableAnswers": ["abstract", "Abstract"]
              }
            ],
            "hint": "Kandinsky helped invent this style of art. It starts with the letter A!"
          },
          {
            "id": "fb5",
            "prompt": "The color ___ often makes people feel calm and peaceful, like looking at the ocean.",
            "blanks": [
              {
                "id": "b1",
                "correctAnswer": "blue",
                "acceptableAnswers": ["blue", "Blue"]
              }
            ],
            "hint": "Think about the color of the sky on a clear day or a calm sea!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
