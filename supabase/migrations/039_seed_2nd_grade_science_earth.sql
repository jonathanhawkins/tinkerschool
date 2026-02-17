-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Science: Earth & Land Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Mountains, Valleys & Plains
--   - Rivers, Lakes & Oceans
--   - Slow Changes: Erosion & Weathering
--   - Fast Changes: Earthquakes & Volcanoes
--   - Protecting Our Land
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: flash_card, matching_pairs, multiple_choice, sequence_order
--
-- Subject ID:
--   Science (2nd grade): 9e6554ec-668a-4d27-b66d-412f4ce05d6d
--
-- Module ID:
--   Earth & Land: 10000002-0308-4000-8000-000000000001
--
-- Skill IDs:
--   Landforms & Water Bodies: 20000003-000b-4000-8000-000000000001
--   Slow & Fast Earth Changes: 20000003-000c-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             018_seed_2nd_grade_reading_science.sql (Science subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Science 2nd Grade: Earth & Land (prefix: 20000003)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000003-000b-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'landforms_water_bodies',   'Landforms & Water Bodies',    'Identify and describe common landforms and bodies of water including mountains, valleys, plains, rivers, lakes, and oceans', '2-ESS2-2', 10),
  ('20000003-000c-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'slow_fast_earth_changes',  'Slow & Fast Earth Changes',   'Compare events that happen slowly (erosion, weathering) with events that happen quickly (earthquakes, volcanoes)',           '2-ESS1-1', 11)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Science: Earth & Land)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0308-4000-8000-000000000001', 2, 29, 'Earth & Land', 'Explore mountains, rivers, and oceans! Discover how Earth changes slowly and quickly!', 'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SCIENCE LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Mountains, Valleys & Plains
-- Module: Earth & Land | Skill: Landforms & Water Bodies
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-001a-4000-8000-000000000001',
  '10000002-0308-4000-8000-000000000001',
  1,
  'Mountains, Valleys & Plains',
  'Learn about the amazing shapes of Earth''s surface -- from tall mountains to flat plains!',
  'Pack your hiking boots -- Chip is going on a geography adventure! Earth''s surface isn''t all the same. Some parts are SUPER tall like mountains, some are low and flat like plains, and some are tucked between hills like valleys. Each landform is special and different animals and plants live in each one. Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000b-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about landforms on Earth! \ud83c\udf0d",
        "cards": [
          {
            "id": "mvp-fc-1",
            "front": {"text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"},
            "back": {"text": "A very tall, rocky landform that rises high above the land around it. Mountains can have snow on top and animals like mountain goats live there!", "emoji": "\u26f0\ufe0f"}
          },
          {
            "id": "mvp-fc-2",
            "front": {"text": "Valley", "emoji": "\ud83c\udf3e"},
            "back": {"text": "A low area of land between hills or mountains. Rivers often flow through valleys, and many farms are found in valleys because the soil is rich!", "emoji": "\ud83c\udf3e"}
          },
          {
            "id": "mvp-fc-3",
            "front": {"text": "Plain", "emoji": "\ud83c\udf3f"},
            "back": {"text": "A large, flat area of land that stretches far and wide. Plains are great for farming and you can see for miles! Prairies are a type of plain.", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "mvp-fc-4",
            "front": {"text": "Hill", "emoji": "\u26f0\ufe0f"},
            "back": {"text": "A raised area of land that is shorter than a mountain. Hills have gentle slopes and rounded tops -- perfect for rolling down!", "emoji": "\ud83c\udf04"}
          },
          {
            "id": "mvp-fc-5",
            "front": {"text": "Canyon", "emoji": "\ud83c\udfdc\ufe0f"},
            "back": {"text": "A deep, narrow valley with steep sides, carved by a river over millions of years. The Grand Canyon is a famous one!", "emoji": "\ud83c\udfdc\ufe0f"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each landform to its description! \ud83e\udde9",
        "pairs": [
          {
            "id": "mvp-p1",
            "left": {"id": "mountain", "text": "Mountain", "emoji": "\ud83c\udfd4\ufe0f"},
            "right": {"id": "tall_land", "text": "Tall rocky landform", "emoji": "\u26f0\ufe0f"}
          },
          {
            "id": "mvp-p2",
            "left": {"id": "valley", "text": "Valley", "emoji": "\ud83c\udf3e"},
            "right": {"id": "low_between", "text": "Low area between mountains", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "mvp-p3",
            "left": {"id": "plain", "text": "Plain", "emoji": "\ud83c\udf3f"},
            "right": {"id": "flat_land", "text": "Large flat area of land", "emoji": "\ud83c\udf3e"}
          },
          {
            "id": "mvp-p4",
            "left": {"id": "hill", "text": "Hill", "emoji": "\u26f0\ufe0f"},
            "right": {"id": "short_mtn", "text": "Shorter than a mountain", "emoji": "\ud83d\udfe2"}
          },
          {
            "id": "mvp-p5",
            "left": {"id": "canyon", "text": "Canyon", "emoji": "\ud83c\udfdc\ufe0f"},
            "right": {"id": "deep_valley", "text": "Deep valley with steep sides", "emoji": "\ud83c\udfdc\ufe0f"}
          }
        ],
        "hint": "Think about each landform''s shape! Mountains are tall, valleys are low, plains are flat, hills are shorter than mountains, and canyons are deep and narrow."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Rivers, Lakes & Oceans
-- Module: Earth & Land | Skill: Landforms & Water Bodies
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-001b-4000-8000-000000000001',
  '10000002-0308-4000-8000-000000000001',
  2,
  'Rivers, Lakes & Oceans',
  'Explore the amazing bodies of water on Earth -- from tiny streams to giant oceans!',
  'Splash! Chip is exploring bodies of water today! Did you know that water covers MORE than half of Earth''s surface? There are rushing rivers, calm lakes, salty oceans, and bubbly streams. Each body of water is different, and each one is home to special plants and animals. Let''s dive in!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000b-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each body of water to its description! \ud83c\udf0a",
        "pairs": [
          {
            "id": "rlo-p1",
            "left": {"id": "river", "text": "River", "emoji": "\ud83c\udf0a"},
            "right": {"id": "flowing_water", "text": "Flowing water that moves to the sea", "emoji": "\u27a1\ufe0f"}
          },
          {
            "id": "rlo-p2",
            "left": {"id": "lake", "text": "Lake", "emoji": "\ud83d\udef6"},
            "right": {"id": "still_water", "text": "Still water surrounded by land", "emoji": "\ud83c\udfde\ufe0f"}
          },
          {
            "id": "rlo-p3",
            "left": {"id": "ocean", "text": "Ocean", "emoji": "\ud83c\udf0d"},
            "right": {"id": "huge_salty", "text": "Huge body of salty water", "emoji": "\ud83e\uddac"}
          },
          {
            "id": "rlo-p4",
            "left": {"id": "stream", "text": "Stream", "emoji": "\ud83d\udca7"},
            "right": {"id": "small_river", "text": "A small, narrow river", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "rlo-p5",
            "left": {"id": "pond", "text": "Pond", "emoji": "\ud83d\udc38"},
            "right": {"id": "small_lake", "text": "A small, shallow lake", "emoji": "\ud83c\udf3f"}
          }
        ],
        "hint": "Rivers FLOW and move toward the ocean. Lakes are surrounded by land and stay still. Oceans are HUGE and salty. Streams are like baby rivers. Ponds are like baby lakes!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "rlo-mc-1",
            "prompt": "Which body of water is the BIGGEST? \ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Pond", "emoji": "\ud83d\udc38"},
              {"id": "b", "text": "Lake", "emoji": "\ud83d\udef6"},
              {"id": "c", "text": "Ocean", "emoji": "\ud83c\udf0d"}
            ],
            "correctOptionId": "c",
            "hint": "This body of water is SO big that it covers most of Earth''s surface! It''s salty too."
          },
          {
            "id": "rlo-mc-2",
            "prompt": "What kind of water do oceans have? \ud83e\uddac",
            "options": [
              {"id": "a", "text": "Fresh water (not salty)", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "Salt water (salty)", "emoji": "\ud83e\uddc2"},
              {"id": "c", "text": "Fizzy water (bubbly)", "emoji": "\ud83e\udef7"}
            ],
            "correctOptionId": "b",
            "hint": "If you''ve been to the beach, you might have tasted the water. It''s salty!"
          },
          {
            "id": "rlo-mc-3",
            "prompt": "Where does a river usually end up? \ud83c\udf0a",
            "options": [
              {"id": "a", "text": "It stops in a mountain", "emoji": "\ud83c\udfd4\ufe0f"},
              {"id": "b", "text": "It flows into the ocean or a lake", "emoji": "\ud83c\udf0d"},
              {"id": "c", "text": "It goes underground forever", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Rivers flow downhill and keep going until they reach a bigger body of water!"
          },
          {
            "id": "rlo-mc-4",
            "prompt": "Which body of water is surrounded by land on ALL sides? \ud83c\udfde\ufe0f",
            "options": [
              {"id": "a", "text": "River", "emoji": "\ud83c\udf0a"},
              {"id": "b", "text": "Ocean", "emoji": "\ud83c\udf0d"},
              {"id": "c", "text": "Lake", "emoji": "\ud83d\udef6"}
            ],
            "correctOptionId": "c",
            "hint": "This body of water sits in the middle of the land. You can walk all the way around it!"
          },
          {
            "id": "rlo-mc-5",
            "prompt": "How many oceans does Earth have? \ud83c\udf0e",
            "options": [
              {"id": "a", "text": "2", "emoji": ""},
              {"id": "b", "text": "5", "emoji": "\u2728"},
              {"id": "c", "text": "10", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Pacific, Atlantic, Indian, Southern, and Arctic -- count them up!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Slow Changes: Erosion & Weathering
-- Module: Earth & Land | Skill: Slow & Fast Earth Changes
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-001c-4000-8000-000000000001',
  '10000002-0308-4000-8000-000000000001',
  3,
  'Slow Changes: Erosion & Weathering',
  'Discover how wind, water, and ice slowly change the shape of Earth over a long time!',
  'Chip just learned something mind-blowing! Earth''s surface is ALWAYS changing, but some changes happen so slowly that you can''t even see them! Wind blows tiny bits of rock away. Water wears down mountains over millions of years. Ice cracks rocks apart. These slow changes are called EROSION and WEATHERING. Let''s watch Earth change in slow motion!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "sc-seq-1",
            "prompt": "Put these steps of river erosion in order! How does a river carve a canyon? \ud83c\udf0a\ud83c\udfdc\ufe0f",
            "items": [
              {"id": "rain", "text": "Rain falls on the land", "emoji": "\ud83c\udf27\ufe0f", "correctPosition": 1},
              {"id": "stream", "text": "Water forms a stream", "emoji": "\ud83d\udca7", "correctPosition": 2},
              {"id": "carries", "text": "Water carries away tiny rocks and soil", "emoji": "\ud83e\udea8", "correctPosition": 3},
              {"id": "deeper", "text": "The stream cuts deeper over time", "emoji": "\u23f3", "correctPosition": 4},
              {"id": "canyon", "text": "A canyon forms after millions of years", "emoji": "\ud83c\udfdc\ufe0f", "correctPosition": 5}
            ],
            "hint": "Start with rain! Then water collects, picks up rocks and dirt, cuts deeper and deeper, and after a VERY long time, a canyon forms!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "sc-mc-1",
            "prompt": "What is WEATHERING? \ud83e\udea8",
            "options": [
              {"id": "a", "text": "When rocks break down into smaller pieces", "emoji": "\u2728"},
              {"id": "b", "text": "When it rains outside", "emoji": "\ud83c\udf27\ufe0f"},
              {"id": "c", "text": "When a volcano erupts", "emoji": "\ud83c\udf0b"}
            ],
            "correctOptionId": "a",
            "hint": "Weathering is about rocks breaking apart! Wind, water, and ice slowly break rocks into smaller and smaller pieces."
          },
          {
            "id": "sc-mc-2",
            "prompt": "What is EROSION? \ud83c\udf0a",
            "options": [
              {"id": "a", "text": "When new mountains form", "emoji": "\ud83c\udfd4\ufe0f"},
              {"id": "b", "text": "When broken rock and soil are carried away", "emoji": "\u2728"},
              {"id": "c", "text": "When it snows", "emoji": "\u2744\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Erosion is when wind or water MOVES broken pieces of rock and soil to a new place!"
          },
          {
            "id": "sc-mc-3",
            "prompt": "How long does it take for a river to carve a deep canyon? \u23f3",
            "options": [
              {"id": "a", "text": "A few days", "emoji": ""},
              {"id": "b", "text": "One year", "emoji": ""},
              {"id": "c", "text": "Millions of years", "emoji": "\u2728"}
            ],
            "correctOptionId": "c",
            "hint": "This is a VERY slow process. Think about the biggest number!"
          },
          {
            "id": "sc-mc-4",
            "prompt": "Which of these can cause weathering? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Wind blowing sand against rocks", "emoji": "\ud83c\udf2c\ufe0f"},
              {"id": "b", "text": "A kid drawing a picture", "emoji": "\ud83c\udfa8"},
              {"id": "c", "text": "A bird singing a song", "emoji": "\ud83d\udc26"}
            ],
            "correctOptionId": "a",
            "hint": "Weathering is caused by natural forces. Which option involves a force of nature acting on rocks?"
          },
          {
            "id": "sc-mc-5",
            "prompt": "Is erosion a SLOW change or a FAST change? \ud83d\udc22",
            "options": [
              {"id": "a", "text": "Slow -- it takes a very long time", "emoji": "\ud83d\udc22"},
              {"id": "b", "text": "Fast -- it happens in seconds", "emoji": "\u26a1"},
              {"id": "c", "text": "It never happens", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Think about how long it takes a river to carve a canyon. Is that fast or slow?"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Fast Changes: Earthquakes & Volcanoes
-- Module: Earth & Land | Skill: Slow & Fast Earth Changes
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-001d-4000-8000-000000000001',
  '10000002-0308-4000-8000-000000000001',
  4,
  'Fast Changes: Earthquakes & Volcanoes',
  'Learn about Earth''s powerful quick changes -- earthquakes shake the ground and volcanoes erupt with lava!',
  'Whoa, hold on tight! Chip is learning about Earth''s FASTEST and most POWERFUL changes! Unlike erosion that takes millions of years, earthquakes can shake the ground in SECONDS, and volcanoes can shoot lava into the sky in MINUTES! These fast changes can reshape the land very quickly. Let''s find out how they work!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about Earth''s fast changes! \ud83c\udf0b",
        "cards": [
          {
            "id": "fc-fc-1",
            "front": {"text": "Earthquake", "emoji": "\ud83c\udf0d"},
            "back": {"text": "A sudden shaking of the ground caused by rocks deep underground moving and shifting. Earthquakes can crack roads and knock down buildings!", "emoji": "\ud83c\udf0d"}
          },
          {
            "id": "fc-fc-2",
            "front": {"text": "Volcano", "emoji": "\ud83c\udf0b"},
            "back": {"text": "An opening in Earth''s surface where hot melted rock (lava), ash, and gases escape from deep inside Earth. When a volcano erupts, it can build new land!", "emoji": "\ud83c\udf0b"}
          },
          {
            "id": "fc-fc-3",
            "front": {"text": "Landslide", "emoji": "\u26f0\ufe0f"},
            "back": {"text": "When rocks, mud, and soil slide quickly down a hillside. Heavy rain or earthquakes can trigger landslides!", "emoji": "\u26f0\ufe0f"}
          },
          {
            "id": "fc-fc-4",
            "front": {"text": "Flood", "emoji": "\ud83c\udf0a"},
            "back": {"text": "When water covers land that is usually dry. Heavy rain or melting snow can cause rivers to overflow their banks!", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "fc-fc-5",
            "front": {"text": "Lava", "emoji": "\ud83d\udd25"},
            "back": {"text": "Hot melted rock that flows out of a volcano. When lava cools down, it turns into new rock and can even create new islands!", "emoji": "\ud83d\udd25"}
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "fc-mc-1",
            "prompt": "What causes an earthquake? \ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Wind blowing very hard", "emoji": "\ud83c\udf2c\ufe0f"},
              {"id": "b", "text": "Rocks deep underground moving and shifting", "emoji": "\u2728"},
              {"id": "c", "text": "Rain falling on the ground", "emoji": "\ud83c\udf27\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Earthquakes happen because of what''s going on DEEP below the ground. Giant pieces of rock move and bump into each other!"
          },
          {
            "id": "fc-mc-2",
            "prompt": "What comes out of a volcano when it erupts? \ud83c\udf0b",
            "options": [
              {"id": "a", "text": "Water and fish", "emoji": "\ud83d\udc1f"},
              {"id": "b", "text": "Hot lava, ash, and gases", "emoji": "\u2728"},
              {"id": "c", "text": "Snow and ice", "emoji": "\u2744\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Volcanoes are VERY hot inside! Think about what kind of super-hot stuff would come out."
          },
          {
            "id": "fc-mc-3",
            "prompt": "Are earthquakes and volcanoes SLOW or FAST changes? \u26a1",
            "options": [
              {"id": "a", "text": "Slow -- they take millions of years", "emoji": "\ud83d\udc22"},
              {"id": "b", "text": "Fast -- they can happen in minutes or seconds", "emoji": "\u26a1"},
              {"id": "c", "text": "They never really change anything", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Unlike erosion, these events happen VERY quickly! An earthquake can last just seconds!"
          },
          {
            "id": "fc-mc-4",
            "prompt": "What can happen when lava from a volcano cools down? \ud83d\udd25\u2192\ud83e\udea8",
            "options": [
              {"id": "a", "text": "It turns into new rock", "emoji": "\u2728"},
              {"id": "b", "text": "It disappears completely", "emoji": ""},
              {"id": "c", "text": "It turns into water", "emoji": "\ud83d\udca7"}
            ],
            "correctOptionId": "a",
            "hint": "Lava is melted rock. When it cools down, it hardens back into rock -- brand new rock!"
          },
          {
            "id": "fc-mc-5",
            "prompt": "Which is a SLOW Earth change and which is a FAST Earth change? \ud83d\udc22\u26a1",
            "options": [
              {"id": "a", "text": "Erosion is slow, earthquakes are fast", "emoji": "\u2728"},
              {"id": "b", "text": "Earthquakes are slow, erosion is fast", "emoji": ""},
              {"id": "c", "text": "Both are fast", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Erosion takes millions of years (slow like a turtle). Earthquakes happen in seconds (fast like lightning)!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Protecting Our Land
-- Module: Earth & Land | Skill: Landforms & Water Bodies + Slow & Fast Earth Changes
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-001e-4000-8000-000000000001',
  '10000002-0308-4000-8000-000000000001',
  5,
  'Protecting Our Land',
  'Learn how people help protect Earth''s land, water, and animals!',
  'Chip has a big heart and wants to help protect our planet! Earth''s land and water are precious, and people can do lots of things to take care of them. We can plant trees to stop erosion, keep rivers clean, protect animal homes, and recycle to reduce waste. Let''s become Earth protectors together!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000b-4000-8000-000000000001', '20000003-000c-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pl-mc-1",
            "prompt": "Why do people plant trees on hillsides? \ud83c\udf33",
            "options": [
              {"id": "a", "text": "To make the hill taller", "emoji": ""},
              {"id": "b", "text": "To hold the soil in place and prevent erosion", "emoji": "\u2728"},
              {"id": "c", "text": "To block the sunshine", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Tree roots grab onto the soil like little fingers. They hold the dirt in place so rain doesn''t wash it away!"
          },
          {
            "id": "pl-mc-2",
            "prompt": "What happens when too many trees are cut down? \ud83e\udeb5",
            "options": [
              {"id": "a", "text": "The soil washes away more easily", "emoji": "\u2728"},
              {"id": "b", "text": "More mountains form", "emoji": ""},
              {"id": "c", "text": "Nothing changes", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Without tree roots holding the soil, rain and wind can carry the dirt away. That''s erosion!"
          },
          {
            "id": "pl-mc-3",
            "prompt": "What is one way YOU can help protect Earth? \ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Throw trash on the ground", "emoji": ""},
              {"id": "b", "text": "Pick up litter and recycle", "emoji": "\u267b\ufe0f"},
              {"id": "c", "text": "Waste water by leaving the tap on", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Earth protectors keep our land clean! Which choice helps keep our planet healthy?"
          },
          {
            "id": "pl-mc-4",
            "prompt": "Why are national parks important? \ud83c\udfde\ufe0f",
            "options": [
              {"id": "a", "text": "They protect land, water, and animals from being harmed", "emoji": "\u2728"},
              {"id": "b", "text": "They are places to build new buildings", "emoji": ""},
              {"id": "c", "text": "They make earthquakes stop", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "National parks are special places where nature is kept safe so animals and plants can thrive!"
          },
          {
            "id": "pl-mc-5",
            "prompt": "Keeping rivers and lakes clean helps ___ \ud83d\udca7",
            "options": [
              {"id": "a", "text": "Fish, plants, and people who need clean water", "emoji": "\u2728"},
              {"id": "b", "text": "Make the water turn into lava", "emoji": ""},
              {"id": "c", "text": "Nothing at all", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Animals drink from rivers and lakes, fish live in them, and people need clean water too!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each problem with the solution that helps protect Earth! \ud83c\udf0d\u2764\ufe0f",
        "pairs": [
          {
            "id": "pl-p1",
            "left": {"id": "erosion_prob", "text": "Soil washing away", "emoji": "\ud83c\udf0a"},
            "right": {"id": "plant_trees", "text": "Plant trees to hold the soil", "emoji": "\ud83c\udf33"}
          },
          {
            "id": "pl-p2",
            "left": {"id": "dirty_water", "text": "Dirty rivers and lakes", "emoji": "\ud83e\udda0"},
            "right": {"id": "dont_litter", "text": "Don''t throw trash in water", "emoji": "\ud83d\udeab"}
          },
          {
            "id": "pl-p3",
            "left": {"id": "animals_lose", "text": "Animals losing their homes", "emoji": "\ud83d\udc3b"},
            "right": {"id": "protect_hab", "text": "Create nature parks and reserves", "emoji": "\ud83c\udfde\ufe0f"}
          },
          {
            "id": "pl-p4",
            "left": {"id": "too_much_trash", "text": "Too much trash on land", "emoji": "\ud83d\uddd1\ufe0f"},
            "right": {"id": "recycle", "text": "Reduce, reuse, and recycle", "emoji": "\u267b\ufe0f"}
          }
        ],
        "hint": "Think about what causes each problem, then find the action that fixes it! Trees stop erosion, keeping water clean helps fish, parks protect animals, and recycling reduces trash."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
