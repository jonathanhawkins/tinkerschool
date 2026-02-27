-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Science Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Science "Nature Explorers" module.
-- Aligned to NGSS K: K-PS2, K-PS3, K-LS1, K-ESS2, K-ESS3
--
-- Module ID: 00000001-0031-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000003
--
-- Lesson UUIDs: c1000003-0001 through c1000003-0005
-- =============================================================================


-- =========================================================================
-- SCIENCE LESSON 1: Push It, Pull It!
-- Skills: Pushes and Pulls, Changing Motion
-- Widgets: multiple_choice + drag_to_sort + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000003-0001-4000-8000-000000000001',
  '00000001-0031-4000-8000-000000000001',
  1,
  'Push It, Pull It!',
  'Discover pushes and pulls! Everything that moves needs a push or a pull.',
  'Hey explorer! Chip wants to know \u2014 have you ever pushed a swing or pulled a wagon? Things MOVE because of pushes and pulls! Let''s figure out which is which!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000100-0001-4000-8000-000000000001',
    '30000100-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "sort-push-pull",
            "prompt": "Is it a PUSH or a PULL? Sort each action!",
            "buckets": [
              {"id": "push", "label": "Push", "emoji": "\ud83d\udc49"},
              {"id": "pull", "label": "Pull", "emoji": "\ud83d\udc48"}
            ],
            "items": [
              {"id": "kick-ball", "label": "Kick a ball", "emoji": "\u26bd", "correctBucket": "push"},
              {"id": "open-door", "label": "Open a door", "emoji": "\ud83d\udeaa", "correctBucket": "pull"},
              {"id": "push-swing", "label": "Push a swing", "emoji": "\ud83e\udd38", "correctBucket": "push"},
              {"id": "pull-wagon", "label": "Pull a wagon", "emoji": "\ud83d\udeb2", "correctBucket": "pull"},
              {"id": "throw-ball", "label": "Throw a ball", "emoji": "\ud83c\udfbe", "correctBucket": "push"}
            ],
            "hint": "A PUSH moves things AWAY from you. A PULL brings things TOWARD you!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "force-1",
            "prompt": "A big push makes a ball go _____ than a small push.",
            "promptEmoji": "\u26bd",
            "options": [
              {"id": "a", "text": "Farther", "emoji": "\u27a1\ufe0f"},
              {"id": "b", "text": "Not as far", "emoji": "\u23f9\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Try it! Push something gently, then push harder. Which goes farther?"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Explore pushes and pulls at home! Roll a ball gently, then hard \u2014 what happens? Pull open a drawer. Push a toy car. Ask: ''Was that a push or a pull? What happened?''",
        "parentTip": "The key K-PS2 concept is that pushes and pulls can change the speed AND direction of an object. Try pushing a ball at an angle \u2014 it changes direction!",
        "completionPrompt": "Did you try pushes and pulls together?",
        "illustration": "\ud83d\udcaa"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 2: What''s the Weather?
-- Skills: Weather Patterns
-- Widgets: multiple_choice + tap_and_reveal
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000003-0002-4000-8000-000000000001',
  '00000001-0031-4000-8000-000000000001',
  2,
  'What''s the Weather?',
  'Look outside! Is it sunny, cloudy, rainy, or snowy? Let''s be weather watchers!',
  'Chip loves looking at the sky! The weather changes every day. Sometimes it''s sunny and warm, sometimes it''s cloudy and cool, and sometimes it rains! Let''s learn to describe the weather!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000100-0004-4000-8000-000000000001'
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
            "id": "weather-types",
            "prompt": "Tap each cloud to discover different types of weather!",
            "mode": "explore",
            "gridCols": 2,
            "items": [
              {
                "id": "sunny",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\u2600\ufe0f",
                "revealLabel": "Sunny - warm and bright!"
              },
              {
                "id": "cloudy",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\u26c5",
                "revealLabel": "Cloudy - gray sky!"
              },
              {
                "id": "rainy",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\ud83c\udf27\ufe0f",
                "revealLabel": "Rainy - bring an umbrella!"
              },
              {
                "id": "snowy",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\u2744\ufe0f",
                "revealLabel": "Snowy - cold and white!"
              }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "weather-mc-1",
            "prompt": "What should you wear on a rainy day?",
            "promptEmoji": "\ud83c\udf27\ufe0f",
            "options": [
              {"id": "a", "text": "Raincoat & boots", "emoji": "\ud83e\udde5"},
              {"id": "b", "text": "Swimsuit", "emoji": "\ud83e\ude73"},
              {"id": "c", "text": "Shorts & t-shirt", "emoji": "\ud83d\udc55"}
            ],
            "correctOptionId": "a",
            "hint": "When it rains, we need to stay dry!"
          },
          {
            "id": "weather-mc-2",
            "prompt": "Which season is usually the coldest?",
            "promptEmoji": "\u2744\ufe0f",
            "options": [
              {"id": "a", "text": "Summer", "emoji": "\u2600\ufe0f"},
              {"id": "b", "text": "Winter", "emoji": "\u2744\ufe0f"},
              {"id": "c", "text": "Spring", "emoji": "\ud83c\udf38"}
            ],
            "correctOptionId": "b",
            "hint": "When does it snow? That''s the coldest season!"
          },
          {
            "id": "weather-mc-3",
            "prompt": "Sunlight makes things feel...",
            "promptEmoji": "\u2600\ufe0f",
            "options": [
              {"id": "a", "text": "Warm", "emoji": "\ud83e\udd75"},
              {"id": "b", "text": "Cold", "emoji": "\ud83e\udd76"},
              {"id": "c", "text": "Wet", "emoji": "\ud83d\udca7"}
            ],
            "correctOptionId": "a",
            "hint": "Stand in the sunshine \u2014 how does it feel on your skin?"
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
-- SCIENCE LESSON 3: What Plants Need
-- Skills: What Plants Need
-- Widgets: sequence_order + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000003-0003-4000-8000-000000000001',
  '00000001-0031-4000-8000-000000000001',
  3,
  'What Plants Need',
  'Plants are living things! What do they need to grow big and strong?',
  'Chip found a tiny seed! But how does a seed turn into a big plant? Plants need special things to grow \u2014 let''s find out what they need!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000100-0005-4000-8000-000000000001'
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
            "id": "plant-1",
            "prompt": "What do plants need from the sky?",
            "promptEmoji": "\ud83c\udf31",
            "options": [
              {"id": "a", "text": "Sunlight & Rain", "emoji": "\u2600\ufe0f\ud83c\udf27\ufe0f"},
              {"id": "b", "text": "Toys", "emoji": "\ud83e\uddf8"},
              {"id": "c", "text": "Books", "emoji": "\ud83d\udcda"}
            ],
            "correctOptionId": "a",
            "hint": "Plants drink rain and soak up sunshine to grow!"
          },
          {
            "id": "plant-2",
            "prompt": "Where do plant roots grow?",
            "promptEmoji": "\ud83c\udf3f",
            "options": [
              {"id": "a", "text": "In the air", "emoji": "\ud83c\udf2c\ufe0f"},
              {"id": "b", "text": "In the soil", "emoji": "\ud83e\udeb4"},
              {"id": "c", "text": "On the roof", "emoji": "\ud83c\udfe0"}
            ],
            "correctOptionId": "b",
            "hint": "Roots grow DOWN into the ground to drink water!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "plant-grow",
            "prompt": "Put the plant growth steps in order!",
            "items": [
              {"id": "seed", "text": "Plant a seed", "emoji": "\ud83c\udf30", "correctPosition": 1},
              {"id": "water", "text": "Water it", "emoji": "\ud83d\udca7", "correctPosition": 2},
              {"id": "sprout", "text": "A sprout appears!", "emoji": "\ud83c\udf31", "correctPosition": 3}
            ],
            "hint": "What do you do FIRST? Put the seed in the ground!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Plant a seed together! Use a small cup, soil, and a bean or sunflower seed. Water it, put it near a window, and observe daily. Talk about what the plant needs: sunlight, water, soil.",
        "parentTip": "Bean seeds sprout in 3-5 days \u2014 perfect for kindergarten attention spans! Have your child draw the seed each day to track growth. This builds observation skills (NGSS K-LS1).",
        "completionPrompt": "Did you plant a seed together?",
        "illustration": "\ud83c\udf31"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- SCIENCE LESSON 4: Animals and Their Homes
-- Skills: What Animals Need, Where Animals Live
-- Widgets: matching_pairs + multiple_choice
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000003-0004-4000-8000-000000000001',
  '00000001-0031-4000-8000-000000000001',
  4,
  'Animals and Their Homes',
  'Where do animals live? Match animals to their habitats!',
  'Every animal has a special home! Fish live in water, birds live in nests, and bears live in caves! Can you match each animal to where it lives?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000100-0006-4000-8000-000000000001',
    '30000100-0007-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Match each animal to its home!",
        "pairs": [
          {
            "id": "match-fish",
            "left": {"id": "fish", "text": "Fish", "emoji": "\ud83d\udc1f"},
            "right": {"id": "water", "text": "Water", "emoji": "\ud83c\udf0a"}
          },
          {
            "id": "match-bird",
            "left": {"id": "bird", "text": "Bird", "emoji": "\ud83d\udc26"},
            "right": {"id": "nest", "text": "Nest", "emoji": "\ud83e\udeb9"}
          },
          {
            "id": "match-rabbit",
            "left": {"id": "rabbit", "text": "Rabbit", "emoji": "\ud83d\udc30"},
            "right": {"id": "burrow", "text": "Burrow", "emoji": "\ud83d\udd73\ufe0f"}
          },
          {
            "id": "match-bee",
            "left": {"id": "bee", "text": "Bee", "emoji": "\ud83d\udc1d"},
            "right": {"id": "hive", "text": "Hive", "emoji": "\ud83c\udfda\ufe0f"}
          }
        ],
        "hint": "Think about where each animal sleeps and finds food!"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "animal-need-1",
            "prompt": "What do ALL animals need to live?",
            "promptEmoji": "\ud83d\udc3e",
            "options": [
              {"id": "a", "text": "Food, water, & shelter", "emoji": "\ud83c\udf3f"},
              {"id": "b", "text": "Toys & games", "emoji": "\ud83c\udfae"},
              {"id": "c", "text": "Books & pencils", "emoji": "\ud83d\udcda"}
            ],
            "correctOptionId": "a",
            "hint": "Animals need things to eat, drink, and a safe place to live!"
          },
          {
            "id": "animal-need-2",
            "prompt": "A fish cannot live on land because it needs...",
            "promptEmoji": "\ud83d\udc1f",
            "options": [
              {"id": "a", "text": "Water to breathe", "emoji": "\ud83c\udf0a"},
              {"id": "b", "text": "Sunglasses", "emoji": "\ud83d\udd76\ufe0f"},
              {"id": "c", "text": "A hat", "emoji": "\ud83e\udde2"}
            ],
            "correctOptionId": "a",
            "hint": "Fish breathe through gills, and gills only work in water!"
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
-- SCIENCE LESSON 5: Sunny Days and Shady Spots
-- Skills: Sunlight Warms Things, Helping Our Earth
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000003-0005-4000-8000-000000000001',
  '00000001-0031-4000-8000-000000000001',
  5,
  'Sunny Days and Shady Spots',
  'The sun warms everything it touches! How can we stay cool in the shade?',
  'Chip noticed something cool \u2014 when you stand in the sun, you feel warm! But when you stand in the shade under a tree, you feel cooler! Why is that? Let''s explore sunlight!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000003',
  ARRAY[
    '30000100-0003-4000-8000-000000000001',
    '30000100-0008-4000-8000-000000000001'
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
            "id": "sun-1",
            "prompt": "What does the sun give us?",
            "promptEmoji": "\u2600\ufe0f",
            "options": [
              {"id": "a", "text": "Light and warmth", "emoji": "\ud83c\udf1e"},
              {"id": "b", "text": "Snow", "emoji": "\u2744\ufe0f"},
              {"id": "c", "text": "Rain", "emoji": "\ud83c\udf27\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Feel the sunshine on your face \u2014 it''s warm and bright!"
          },
          {
            "id": "sun-2",
            "prompt": "Which would keep you cooler on a hot day?",
            "promptEmoji": "\ud83e\udd75",
            "options": [
              {"id": "a", "text": "Standing under a tree", "emoji": "\ud83c\udf33"},
              {"id": "b", "text": "Standing in the sun", "emoji": "\u2600\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "The tree blocks the sunlight and makes shade!"
          },
          {
            "id": "sun-3",
            "prompt": "How can we help take care of Earth?",
            "promptEmoji": "\ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Throw trash on the ground", "emoji": "\ud83d\udeae"},
              {"id": "b", "text": "Plant trees and recycle", "emoji": "\ud83c\udf33\u267b\ufe0f"},
              {"id": "c", "text": "Leave lights on all day", "emoji": "\ud83d\udca1"}
            ],
            "correctOptionId": "b",
            "hint": "Trees help clean the air and recycling helps reduce waste!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Do a sun experiment! On a sunny day, put a dark-colored object and a light-colored object in the sun for 10 minutes. Touch them \u2014 which feels warmer? Then feel the same spot in the shade. Talk about how sunlight warms things.",
        "parentTip": "This connects to NGSS K-PS3-1 (sunlight warms objects). You can also explore shadows \u2014 have your child stand in the sun and trace their shadow. Try again in an hour \u2014 did it move?",
        "completionPrompt": "Did you explore sunlight and shade together?",
        "illustration": "\u2600\ufe0f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
