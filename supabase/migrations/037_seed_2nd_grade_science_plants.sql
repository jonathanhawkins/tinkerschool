-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Science: Plants & Ecosystems
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - What Do Plants Need?
--   - Seed Travelers
--   - Pollination Partners
--   - Life Cycle: Butterfly
--   - Habitat Homes
--
-- Also seeds the module and skills required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: multiple_choice, matching_pairs, sequence_order, flash_card
--
-- Subject ID:
--   Science (2nd grade): 9e6554ec-668a-4d27-b66d-412f4ce05d6d
--
-- Module ID:
--   Plants & Ecosystems: 10000002-0306-4000-8000-000000000001
--
-- Skill IDs:
--   What Plants Need:        20000003-0007-4000-8000-000000000001
--   Seeds & Pollination:     20000003-0008-4000-8000-000000000001
--   Habitats & Biodiversity: 20000003-0009-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             018_seed_2nd_grade_reading_science.sql (Science subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILLS -- Science 2nd Grade: Plants & Ecosystems (prefix: 20000003)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000003-0007-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'what_plants_need',        'What Plants Need',          'Identify what plants need to grow: sunlight, water, air, and nutrients from soil',  '2-LS2-1', 7),
  ('20000003-0008-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'seeds_pollination',       'Seeds & Pollination',       'Describe how seeds are dispersed and how pollination helps plants reproduce',       '2-LS2-2', 8),
  ('20000003-0009-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'habitats_biodiversity',   'Habitats & Biodiversity',   'Compare different habitats and explain how animals are suited to where they live',  '2-LS4-1', 9)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Science: Plants & Ecosystems)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0306-4000-8000-000000000001', 2, 27, 'Plants & Ecosystems', 'Discover what plants need to grow, how seeds travel, and the amazing world of habitats!', 'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: What Do Plants Need?
-- Module: Plants & Ecosystems | Skill: What Plants Need
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0010-4000-8000-000000000001',
  '10000002-0306-4000-8000-000000000001',
  1,
  'What Do Plants Need?',
  'Discover the four things every plant needs to grow big and strong!',
  'Chip is planting a garden today! But wait -- what does a plant actually NEED to be happy and healthy? Plants can''t go to the fridge for a snack like we can. They need four special things from nature: sunlight, water, air, and nutrients from the soil. Let''s find out what each part of a plant does!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0007-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "wpn-1",
            "prompt": "Which of these does a plant need to grow? \ud83c\udf31",
            "options": [
              {"id": "a", "text": "Sunlight", "emoji": "\u2600\ufe0f"},
              {"id": "b", "text": "A television", "emoji": "\ud83d\udcfa"},
              {"id": "c", "text": "A pillow", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Plants love something bright and warm that comes from the sky every day!"
          },
          {
            "id": "wpn-2",
            "prompt": "What do plants drink to stay alive? \ud83d\udca7",
            "options": [
              {"id": "a", "text": "Juice", "emoji": "\ud83e\uddc3"},
              {"id": "b", "text": "Water", "emoji": "\ud83d\udca7"},
              {"id": "c", "text": "Milk", "emoji": "\ud83e\udd5b"}
            ],
            "correctOptionId": "b",
            "hint": "When it rains, plants are so happy! They drink this from the ground through their roots."
          },
          {
            "id": "wpn-3",
            "prompt": "Plants breathe in a gas from the air. What is it called? \ud83c\udf2c\ufe0f",
            "options": [
              {"id": "a", "text": "Oxygen", "emoji": ""},
              {"id": "b", "text": "Carbon dioxide", "emoji": "\ud83c\udf2c\ufe0f"},
              {"id": "c", "text": "Helium", "emoji": "\ud83c\udf88"}
            ],
            "correctOptionId": "b",
            "hint": "We breathe OUT this gas, and plants breathe it IN! It starts with a C."
          },
          {
            "id": "wpn-4",
            "prompt": "Where do plants get nutrients (plant food) from? \ud83c\udf3e",
            "options": [
              {"id": "a", "text": "The soil", "emoji": "\ud83e\udeb4"},
              {"id": "b", "text": "The clouds", "emoji": "\u2601\ufe0f"},
              {"id": "c", "text": "The moon", "emoji": "\ud83c\udf19"}
            ],
            "correctOptionId": "a",
            "hint": "Roots grow down into the ground to soak up minerals and nutrients from the dirt!"
          },
          {
            "id": "wpn-5",
            "prompt": "Which of these is NOT something a plant needs? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Water", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "Sunlight", "emoji": "\u2600\ufe0f"},
              {"id": "c", "text": "A hat", "emoji": "\ud83e\udde2"}
            ],
            "correctOptionId": "c",
            "hint": "Two of these are real plant needs. One is something a person wears -- plants don''t wear clothes!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each plant part to its job! \ud83c\udf3f",
        "pairs": [
          {
            "id": "wpn-p1",
            "left": {"id": "roots", "text": "Roots", "emoji": "\ud83e\udeb4"},
            "right": {"id": "water-job", "text": "Soak up water from the soil", "emoji": "\ud83d\udca7"}
          },
          {
            "id": "wpn-p2",
            "left": {"id": "leaves", "text": "Leaves", "emoji": "\ud83c\udf43"},
            "right": {"id": "sunlight-job", "text": "Catch sunlight to make food", "emoji": "\u2600\ufe0f"}
          },
          {
            "id": "wpn-p3",
            "left": {"id": "stem", "text": "Stem", "emoji": "\ud83c\udf3e"},
            "right": {"id": "transport-job", "text": "Carry water up to the leaves", "emoji": "\u2b06\ufe0f"}
          },
          {
            "id": "wpn-p4",
            "left": {"id": "flower", "text": "Flower", "emoji": "\ud83c\udf3a"},
            "right": {"id": "seed-job", "text": "Make seeds for new plants", "emoji": "\ud83c\udf31"}
          }
        ],
        "hint": "Roots are underground and drink water. Leaves are flat and catch sunshine. The stem is like a straw going up. Flowers make seeds!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Seed Travelers
-- Module: Plants & Ecosystems | Skill: Seeds & Pollination
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0011-4000-8000-000000000001',
  '10000002-0306-4000-8000-000000000001',
  2,
  'Seed Travelers',
  'Find out how seeds hitch rides on the wind, water, and animals to travel the world!',
  'Chip found a dandelion puff and blew on it -- WHOOSH! All the little seeds floated away on the wind! Seeds are amazing travelers. Some fly on the breeze, some float on water, some hitch rides on animal fur, and some get eaten by birds and dropped far away. Let''s follow seeds on their incredible journeys!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each seed to HOW it travels! \ud83c\udf0d\u2728",
        "pairs": [
          {
            "id": "st-p1",
            "left": {"id": "dandelion", "text": "Dandelion seed", "emoji": "\ud83c\udf3c"},
            "right": {"id": "wind", "text": "Blown by the wind", "emoji": "\ud83c\udf2c\ufe0f"}
          },
          {
            "id": "st-p2",
            "left": {"id": "coconut", "text": "Coconut", "emoji": "\ud83e\udd65"},
            "right": {"id": "water", "text": "Floats on water", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "st-p3",
            "left": {"id": "burr", "text": "Burr seed", "emoji": "\ud83e\udea4"},
            "right": {"id": "animal-fur", "text": "Sticks to animal fur", "emoji": "\ud83d\udc3e"}
          },
          {
            "id": "st-p4",
            "left": {"id": "berry", "text": "Berry seed", "emoji": "\ud83c\udf53"},
            "right": {"id": "eaten", "text": "Eaten by animals and dropped", "emoji": "\ud83d\udc26"}
          },
          {
            "id": "st-p5",
            "left": {"id": "maple", "text": "Maple seed (helicopter)", "emoji": "\ud83c\udf41"},
            "right": {"id": "wind2", "text": "Spins on the wind", "emoji": "\ud83c\udf00"}
          }
        ],
        "hint": "Dandelion puffs float on air, coconuts can float on the ocean, burrs are sticky and grab onto fur, berries get eaten, and maple seeds spin like tiny helicopters!"
      },
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn how seeds travel! \ud83c\udf31\u2708\ufe0f",
        "cards": [
          {
            "id": "st-fc1",
            "front": {"text": "Wind Travelers", "emoji": "\ud83c\udf2c\ufe0f"},
            "back": {"text": "Dandelions have fluffy parachutes and maple seeds have wings that spin like helicopters. The wind carries them far away!", "emoji": "\ud83c\udf3c"}
          },
          {
            "id": "st-fc2",
            "front": {"text": "Water Travelers", "emoji": "\ud83c\udf0a"},
            "back": {"text": "Coconuts have a hard, waterproof shell. They can float across the ocean to a new beach and grow into a palm tree!", "emoji": "\ud83e\udd65"}
          },
          {
            "id": "st-fc3",
            "front": {"text": "Animal Hitchhikers", "emoji": "\ud83d\udc3e"},
            "back": {"text": "Burr seeds have tiny hooks that grab onto animal fur or your socks! The animal carries them to a new spot.", "emoji": "\ud83e\uddf6"}
          },
          {
            "id": "st-fc4",
            "front": {"text": "Eaten & Dropped", "emoji": "\ud83d\udc26"},
            "back": {"text": "Birds and animals eat yummy berries. The seeds inside pass through their tummy and get dropped in a new place with built-in fertilizer!", "emoji": "\ud83c\udf53"}
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Pollination Partners
-- Module: Plants & Ecosystems | Skill: Seeds & Pollination
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0012-4000-8000-000000000001',
  '10000002-0306-4000-8000-000000000001',
  3,
  'Pollination Partners',
  'Meet the busy bees and other pollinators that help flowers make seeds!',
  'Buzz buzz! Chip met a friendly bee in the garden today. Did you know bees are SUPER important helpers for flowers? When a bee visits a flower to drink sweet nectar, yellow powder called pollen sticks to its fuzzy body. Then the bee flies to another flower and delivers the pollen. This is called POLLINATION, and it helps flowers make seeds for new plants!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0008-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pp-seq-1",
            "prompt": "Put the pollination steps in the correct order! \ud83d\udc1d\ud83c\udf3a",
            "items": [
              {"id": "step1", "text": "A bee visits a flower to drink nectar", "emoji": "\ud83d\udc1d", "correctPosition": 1},
              {"id": "step2", "text": "Pollen sticks to the bee''s fuzzy body", "emoji": "\ud83d\udfe1", "correctPosition": 2},
              {"id": "step3", "text": "The bee flies to a different flower", "emoji": "\u2708\ufe0f", "correctPosition": 3},
              {"id": "step4", "text": "Pollen rubs off onto the new flower", "emoji": "\ud83c\udf3c", "correctPosition": 4},
              {"id": "step5", "text": "The flower can now make seeds!", "emoji": "\ud83c\udf31", "correctPosition": 5}
            ],
            "hint": "First the bee lands on a flower and drinks. Pollen sticks to it. Then it flies to a NEW flower and the pollen rubs off. Now that flower can make seeds!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each pollinator to the kind of flowers it visits! \ud83c\udf3b",
        "pairs": [
          {
            "id": "pp-p1",
            "left": {"id": "bee", "text": "Honeybee", "emoji": "\ud83d\udc1d"},
            "right": {"id": "bright-flowers", "text": "Bright, colorful flowers", "emoji": "\ud83c\udf3b"}
          },
          {
            "id": "pp-p2",
            "left": {"id": "butterfly", "text": "Butterfly", "emoji": "\ud83e\udd8b"},
            "right": {"id": "flat-flowers", "text": "Flat flowers it can land on", "emoji": "\ud83c\udf38"}
          },
          {
            "id": "pp-p3",
            "left": {"id": "hummingbird", "text": "Hummingbird", "emoji": "\ud83d\udc26"},
            "right": {"id": "tube-flowers", "text": "Tube-shaped flowers (red/orange)", "emoji": "\ud83c\udf3a"}
          },
          {
            "id": "pp-p4",
            "left": {"id": "bat", "text": "Bat", "emoji": "\ud83e\udd87"},
            "right": {"id": "night-flowers", "text": "Flowers that bloom at night", "emoji": "\ud83c\udf19"}
          }
        ],
        "hint": "Bees love bright colors! Butterflies need a flat place to land. Hummingbirds poke their long beaks into tube-shaped flowers. Bats come out at night!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Life Cycle: Butterfly
-- Module: Plants & Ecosystems | Skills: Seeds & Pollination + Habitats
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0013-4000-8000-000000000001',
  '10000002-0306-4000-8000-000000000001',
  4,
  'Life Cycle: Butterfly',
  'Watch the incredible transformation from tiny egg to beautiful butterfly!',
  'Chip found a tiny egg on a leaf, no bigger than a pinhead! Over the next few weeks, it will go through one of the most AMAZING transformations in nature. First it hatches into a hungry caterpillar that eats and eats. Then it wraps itself in a chrysalis and something magical happens inside. Finally, out comes a beautiful butterfly with colorful wings! Let''s explore each stage!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0008-4000-8000-000000000001', '20000003-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "blc-seq-1",
            "prompt": "Put the butterfly life cycle in the correct order! \ud83e\udd8b\u2728",
            "items": [
              {"id": "egg", "text": "Egg on a leaf", "emoji": "\ud83e\udd5a", "correctPosition": 1},
              {"id": "caterpillar", "text": "Caterpillar (larva)", "emoji": "\ud83d\udc1b", "correctPosition": 2},
              {"id": "chrysalis", "text": "Chrysalis (pupa)", "emoji": "\ud83e\udea6", "correctPosition": 3},
              {"id": "butterfly", "text": "Adult Butterfly", "emoji": "\ud83e\udd8b", "correctPosition": 4}
            ],
            "hint": "It starts as a tiny egg, then hatches into a caterpillar. The caterpillar wraps up in a chrysalis, and finally a butterfly comes out!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each stage to what happens during it! \ud83d\udd0d",
        "pairs": [
          {
            "id": "blc-p1",
            "left": {"id": "egg-stage", "text": "Egg", "emoji": "\ud83e\udd5a"},
            "right": {"id": "egg-desc", "text": "Tiny and laid on a leaf by the mother", "emoji": "\ud83c\udf3f"}
          },
          {
            "id": "blc-p2",
            "left": {"id": "caterpillar-stage", "text": "Caterpillar", "emoji": "\ud83d\udc1b"},
            "right": {"id": "caterpillar-desc", "text": "Eats lots of leaves and grows bigger", "emoji": "\ud83c\udf43"}
          },
          {
            "id": "blc-p3",
            "left": {"id": "chrysalis-stage", "text": "Chrysalis", "emoji": "\ud83e\udea6"},
            "right": {"id": "chrysalis-desc", "text": "Body transforms inside a hard shell", "emoji": "\u2728"}
          },
          {
            "id": "blc-p4",
            "left": {"id": "butterfly-stage", "text": "Butterfly", "emoji": "\ud83e\udd8b"},
            "right": {"id": "butterfly-desc", "text": "Flies, drinks nectar, and lays new eggs", "emoji": "\ud83c\udf3a"}
          }
        ],
        "hint": "The egg is tiny and on a leaf. The caterpillar eats like crazy! The chrysalis is where the big change happens. The butterfly flies and starts the cycle again!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Habitat Homes
-- Module: Plants & Ecosystems | Skill: Habitats & Biodiversity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0014-4000-8000-000000000001',
  '10000002-0306-4000-8000-000000000001',
  5,
  'Habitat Homes',
  'Explore four amazing habitats and match animals to their perfect homes!',
  'Chip is going on a world adventure! Every animal lives in a special place called a HABITAT -- it has the right food, water, and shelter for them to survive. Polar bears love the freezing Arctic, clownfish swim in warm ocean coral reefs, monkeys swing through steamy rainforests, and camels walk across hot, dry deserts. Let''s explore these amazing places and find out who lives where!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-0009-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each animal to the habitat where it lives! \ud83c\udf0d\ud83d\udc3e",
        "pairs": [
          {
            "id": "hh-p1",
            "left": {"id": "polar-bear", "text": "Polar Bear", "emoji": "\ud83d\udc3b\u200d\u2744\ufe0f"},
            "right": {"id": "arctic", "text": "Arctic (freezing cold, ice and snow)", "emoji": "\u2744\ufe0f"}
          },
          {
            "id": "hh-p2",
            "left": {"id": "clownfish", "text": "Clownfish", "emoji": "\ud83d\udc20"},
            "right": {"id": "ocean", "text": "Ocean (coral reef, warm water)", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "hh-p3",
            "left": {"id": "monkey", "text": "Monkey", "emoji": "\ud83d\udc12"},
            "right": {"id": "rainforest", "text": "Rainforest (warm, wet, tall trees)", "emoji": "\ud83c\udf34"}
          },
          {
            "id": "hh-p4",
            "left": {"id": "camel", "text": "Camel", "emoji": "\ud83d\udc2b"},
            "right": {"id": "desert", "text": "Desert (hot, dry, sandy)", "emoji": "\ud83c\udfdc\ufe0f"}
          },
          {
            "id": "hh-p5",
            "left": {"id": "penguin", "text": "Penguin", "emoji": "\ud83d\udc27"},
            "right": {"id": "antarctic", "text": "Antarctica (icy, cold ocean shores)", "emoji": "\ud83e\uddca"}
          }
        ],
        "hint": "Think about what each animal needs! Polar bears need cold and ice. Clownfish need warm water and coral. Monkeys need trees to swing from. Camels can go a long time without water in the hot desert!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "hh-mc-1",
            "prompt": "Which habitat is hot and dry with very little rain? \u2600\ufe0f",
            "options": [
              {"id": "a", "text": "Rainforest", "emoji": "\ud83c\udf34"},
              {"id": "b", "text": "Desert", "emoji": "\ud83c\udfdc\ufe0f"},
              {"id": "c", "text": "Ocean", "emoji": "\ud83c\udf0a"}
            ],
            "correctOptionId": "b",
            "hint": "This place is full of sand and gets very little rain. It can be VERY hot during the day!"
          },
          {
            "id": "hh-mc-2",
            "prompt": "Why do polar bears have thick, white fur? \ud83d\udc3b\u200d\u2744\ufe0f",
            "options": [
              {"id": "a", "text": "To stay warm and blend in with the snow", "emoji": "\u2744\ufe0f"},
              {"id": "b", "text": "To look pretty", "emoji": ""},
              {"id": "c", "text": "To swim faster", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "The Arctic is FREEZING cold! Animals there need to stay warm and hide from predators in the snow."
          },
          {
            "id": "hh-mc-3",
            "prompt": "What makes the rainforest special? \ud83c\udf3f",
            "options": [
              {"id": "a", "text": "It is very dry", "emoji": ""},
              {"id": "b", "text": "It is warm and gets lots of rain", "emoji": "\ud83c\udf27\ufe0f"},
              {"id": "c", "text": "It is always frozen", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The name gives a big clue! RAIN-forest. It rains a lot there, and it is warm and green!"
          },
          {
            "id": "hh-mc-4",
            "prompt": "How does a camel survive in the desert? \ud83d\udc2b",
            "options": [
              {"id": "a", "text": "It can store water and go days without drinking", "emoji": "\ud83d\udca7"},
              {"id": "b", "text": "It hides underground", "emoji": ""},
              {"id": "c", "text": "It only comes out at night", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Camels are amazing! Their humps store fat for energy, and their bodies are great at saving water."
          },
          {
            "id": "hh-mc-5",
            "prompt": "Which word means the place where an animal naturally lives? \ud83c\udfe0",
            "options": [
              {"id": "a", "text": "Habitat", "emoji": "\ud83c\udf0d"},
              {"id": "b", "text": "Weather", "emoji": "\u26c5"},
              {"id": "c", "text": "Season", "emoji": "\ud83c\udf42"}
            ],
            "correctOptionId": "a",
            "hint": "It sounds like the word \"habit\" with \"at\" on the end. It means an animal''s natural home!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
