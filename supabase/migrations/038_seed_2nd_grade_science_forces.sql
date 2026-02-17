-- =============================================================================
-- TinkerSchool -- Seed 2nd Grade Science: Forces & Motion Module
-- =============================================================================
-- 5 browser-only interactive lessons for 2nd grade (Band 2):
--   - Push and Pull
--   - Bigger Push, Bigger Change
--   - Friction: Slippery vs Sticky
--   - Simple Machines Around Us
--   - Gravity: What Goes Up...
--
-- Also seeds the module and skill required by these lessons.
-- All use ON CONFLICT (id) DO NOTHING for idempotent re-runs.
--
-- Widget types used: matching_pairs, multiple_choice, sequence_order, flash_card
--
-- Subject ID:
--   Science (2nd grade): 9e6554ec-668a-4d27-b66d-412f4ce05d6d
--
-- Module ID:
--   Forces & Motion: 10000002-0307-4000-8000-000000000001
--
-- Skill ID:
--   Push and Pull Forces: 20000003-000a-4000-8000-000000000001
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills, modules)
--             018_seed_2nd_grade_reading_science.sql (Science subject row)
-- =============================================================================


-- =========================================================================
-- 1. SKILL -- Science 2nd Grade: Push and Pull Forces
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000003-000a-4000-8000-000000000001', '9e6554ec-668a-4d27-b66d-412f4ce05d6d', 'push_pull_forces', 'Push and Pull Forces', 'Investigate how pushes, pulls, friction, gravity, and simple machines affect the motion of objects', '2-PS1-2', 10)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 2. MODULE (Band 2 Science: Forces & Motion)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('10000002-0307-4000-8000-000000000001', 2, 28, 'Forces & Motion', 'Discover the invisible forces all around you! Push, pull, friction, and gravity make the world move!', 'flask-conical', '9e6554ec-668a-4d27-b66d-412f4ce05d6d')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SCIENCE LESSONS (5 lessons)
-- =============================================================================


-- =========================================================================
-- LESSON 1: Push and Pull
-- Module: Forces & Motion | Skill: Push and Pull Forces
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0015-4000-8000-000000000001',
  '10000002-0307-4000-8000-000000000001',
  1,
  'Push and Pull',
  'Discover the two forces that make EVERYTHING move -- pushes and pulls!',
  'Whoa, Chip just figured out something HUGE! Everything that moves does so because of a PUSH or a PULL! When you kick a soccer ball, that''s a push -- you move it AWAY from you. When you pull a wagon, that''s a pull -- you bring it TOWARD you. Let''s see if you can tell the difference!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  5,
  '{
    "activities": [
      {
        "type": "matching_pairs",
        "prompt": "Is each action a PUSH or a PULL? Match them up! \ud83d\udcaa",
        "pairs": [
          {
            "id": "pp-1",
            "left": {"id": "kick-ball", "text": "Kicking a ball", "emoji": "\u26bd"},
            "right": {"id": "push1", "text": "Push", "emoji": "\u27a1\ufe0f"}
          },
          {
            "id": "pp-2",
            "left": {"id": "open-door", "text": "Opening a door toward you", "emoji": "\ud83d\udeaa"},
            "right": {"id": "pull1", "text": "Pull", "emoji": "\u2b05\ufe0f"}
          },
          {
            "id": "pp-3",
            "left": {"id": "throw-ball", "text": "Throwing a ball", "emoji": "\ud83c\udfc0"},
            "right": {"id": "push2", "text": "Push", "emoji": "\u27a1\ufe0f"}
          },
          {
            "id": "pp-4",
            "left": {"id": "pull-wagon", "text": "Pulling a wagon", "emoji": "\ud83d\udeb2"},
            "right": {"id": "pull2", "text": "Pull", "emoji": "\u2b05\ufe0f"}
          },
          {
            "id": "pp-5",
            "left": {"id": "push-shopping", "text": "Pushing a shopping cart", "emoji": "\ud83d\uded2"},
            "right": {"id": "push3", "text": "Push", "emoji": "\u27a1\ufe0f"}
          },
          {
            "id": "pp-6",
            "left": {"id": "tug-rope", "text": "Tug of war", "emoji": "\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1"},
            "right": {"id": "pull3", "text": "Pull", "emoji": "\u2b05\ufe0f"}
          }
        ],
        "hint": "Push means you move something AWAY from you. Pull means you bring something TOWARD you! Think about which direction the thing moves."
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pp-mc-1",
            "prompt": "You roll a bowling ball down the lane. Is that a push or a pull? \ud83c\udfb3",
            "options": [
              {"id": "a", "text": "Push", "emoji": "\u27a1\ufe0f"},
              {"id": "b", "text": "Pull", "emoji": "\u2b05\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "You send the ball AWAY from you down the lane. That means it is a push!"
          },
          {
            "id": "pp-mc-2",
            "prompt": "A dog walks you on a leash! The leash tugs you forward. Is that a push or a pull? \ud83d\udc36",
            "options": [
              {"id": "a", "text": "Push", "emoji": "\u27a1\ufe0f"},
              {"id": "b", "text": "Pull", "emoji": "\u2b05\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "The dog is bringing you TOWARD it by tugging the leash. That is a pull!"
          },
          {
            "id": "pp-mc-3",
            "prompt": "What are the TWO main forces that make things move? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Push and Pull", "emoji": "\u2728"},
              {"id": "b", "text": "Spin and Stop", "emoji": ""},
              {"id": "c", "text": "Fast and Slow", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "These two forces are opposites -- one moves things away, one brings things closer!"
          },
          {
            "id": "pp-mc-4",
            "prompt": "A magnet on the fridge holds a picture. Is the magnet pushing or pulling? \ud83e\uddf2",
            "options": [
              {"id": "a", "text": "Pushing", "emoji": ""},
              {"id": "b", "text": "Pulling", "emoji": "\u2728"}
            ],
            "correctOptionId": "b",
            "hint": "The magnet sticks TO the fridge -- it attracts the metal. That is a pull!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 2: Bigger Push, Bigger Change
-- Module: Forces & Motion | Skill: Push and Pull Forces
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0016-4000-8000-000000000001',
  '10000002-0307-4000-8000-000000000001',
  2,
  'Bigger Push, Bigger Change',
  'Find out what happens when you push harder or softer!',
  'Chip has been experimenting! Watch this -- if you give a ball a tiny little push, it barely rolls. But if you give it a BIG push, it zooms across the room! The HARDER you push or pull, the MORE something moves. Let''s explore how the size of a force changes what happens!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "bp-mc-1",
            "prompt": "What happens if you push a toy car HARDER? \ud83d\ude97\ud83d\udca8",
            "options": [
              {"id": "a", "text": "It goes farther and faster", "emoji": "\ud83d\ude80"},
              {"id": "b", "text": "It goes slower", "emoji": ""},
              {"id": "c", "text": "Nothing changes", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "A bigger push means more force! More force = more speed and more distance!"
          },
          {
            "id": "bp-mc-2",
            "prompt": "You give a ball a gentle tap with your finger. What happens? \ud83d\udc46\u26be",
            "options": [
              {"id": "a", "text": "It flies across the room", "emoji": ""},
              {"id": "b", "text": "It rolls just a little bit", "emoji": "\u2728"},
              {"id": "c", "text": "It does not move at all", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A small push gives only a small amount of force. The ball moves, but not very far!"
          },
          {
            "id": "bp-mc-3",
            "prompt": "Two kids push a box. One pushes gently, one pushes HARD. Whose side does the box move toward? \ud83d\udce6",
            "options": [
              {"id": "a", "text": "Toward the gentle push", "emoji": ""},
              {"id": "b", "text": "Toward the hard push", "emoji": "\u2728"},
              {"id": "c", "text": "It does not move", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The bigger force wins! The box moves in the direction of the STRONGER push."
          },
          {
            "id": "bp-mc-4",
            "prompt": "You want to kick a soccer ball really far. What should you do? \u26bd\ud83e\uddb6",
            "options": [
              {"id": "a", "text": "Kick it softly", "emoji": ""},
              {"id": "b", "text": "Kick it hard", "emoji": "\ud83d\udcaa"},
              {"id": "c", "text": "Just look at it", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "A bigger kick means a bigger force. Bigger force = the ball goes farther!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "bp-seq-1",
            "prompt": "Put these pushes in order from LEAST change to MOST change! \ud83d\udcaa",
            "items": [
              {"id": "tap", "text": "Tiny finger tap on a ball", "emoji": "\ud83d\udc46", "correctPosition": 1},
              {"id": "gentle", "text": "Gentle push with one hand", "emoji": "\u270b", "correctPosition": 2},
              {"id": "strong", "text": "Strong push with both hands", "emoji": "\ud83d\udcaa", "correctPosition": 3},
              {"id": "kick", "text": "Running kick with your foot", "emoji": "\ud83e\uddb6", "correctPosition": 4}
            ],
            "hint": "Think about how much force each one uses. A tiny tap is the smallest force. A running kick is the biggest!"
          },
          {
            "id": "bp-seq-2",
            "prompt": "Put these in order: what happens when you push a ball harder and harder? \u26bd",
            "items": [
              {"id": "still", "text": "Ball barely moves", "emoji": "\u23f8\ufe0f", "correctPosition": 1},
              {"id": "slow", "text": "Ball rolls slowly", "emoji": "\ud83d\udc22", "correctPosition": 2},
              {"id": "medium", "text": "Ball rolls across the room", "emoji": "\u27a1\ufe0f", "correctPosition": 3},
              {"id": "fast", "text": "Ball zooms super far", "emoji": "\ud83d\ude80", "correctPosition": 4}
            ],
            "hint": "Start with the smallest push (barely moves) and end with the biggest push (zooms super far)!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 3: Friction: Slippery vs Sticky
-- Module: Forces & Motion | Skill: Push and Pull Forces
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0017-4000-8000-000000000001',
  '10000002-0307-4000-8000-000000000001',
  3,
  'Friction: Slippery vs Sticky',
  'Learn how friction slows things down -- and why some surfaces are slippery and others are sticky!',
  'Whee! Chip just tried sliding on the kitchen floor in socks -- SO slippery! But then Chip tried sliding on the carpet -- NOT slippery at all! That''s because of FRICTION. Friction is a force that slows things down when surfaces rub together. Smooth surfaces have LOW friction (slippery!) and rough surfaces have HIGH friction (sticky!). Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  6,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "fr-mc-1",
            "prompt": "Which surface has MORE friction? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Smooth ice", "emoji": "\u26f8\ufe0f"},
              {"id": "b", "text": "Rough carpet", "emoji": "\u2728"},
              {"id": "c", "text": "Slippery wet floor", "emoji": "\ud83d\udca7"}
            ],
            "correctOptionId": "b",
            "hint": "Rough surfaces grab onto things more. Carpet is bumpy and rough, so it has lots of friction!"
          },
          {
            "id": "fr-mc-2",
            "prompt": "You push a box across a smooth wooden floor, then across grass. Where is it HARDER to push? \ud83d\udce6",
            "options": [
              {"id": "a", "text": "Smooth wooden floor", "emoji": ""},
              {"id": "b", "text": "Grass", "emoji": "\ud83c\udf3f"},
              {"id": "c", "text": "Both are the same", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Grass is rough and bumpy -- it creates more friction, which makes it harder to push the box!"
          },
          {
            "id": "fr-mc-3",
            "prompt": "Why do sneakers have bumpy bottoms? \ud83d\udc5f",
            "options": [
              {"id": "a", "text": "To look cool", "emoji": ""},
              {"id": "b", "text": "To grip the ground with friction", "emoji": "\u2728"},
              {"id": "c", "text": "To make them heavier", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The bumps create more friction so you don''t slip! Friction helps you grip the ground."
          },
          {
            "id": "fr-mc-4",
            "prompt": "What does friction do to a moving object? \ud83d\uded1",
            "options": [
              {"id": "a", "text": "Speeds it up", "emoji": ""},
              {"id": "b", "text": "Slows it down", "emoji": "\u2728"},
              {"id": "c", "text": "Makes it float", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Friction is a force that works AGAINST motion. It rubs and slows things down!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each surface to its friction level! \ud83c\udfaf",
        "pairs": [
          {
            "id": "fr-p1",
            "left": {"id": "ice", "text": "Ice", "emoji": "\ud83e\uddca"},
            "right": {"id": "low1", "text": "Low friction (slippery)", "emoji": "\ud83d\udca8"}
          },
          {
            "id": "fr-p2",
            "left": {"id": "sandpaper", "text": "Sandpaper", "emoji": "\ud83e\uddf1"},
            "right": {"id": "high1", "text": "High friction (grippy)", "emoji": "\u270b"}
          },
          {
            "id": "fr-p3",
            "left": {"id": "grass", "text": "Grass", "emoji": "\ud83c\udf3f"},
            "right": {"id": "medium1", "text": "Medium friction", "emoji": "\ud83d\udc4c"}
          },
          {
            "id": "fr-p4",
            "left": {"id": "wet-tile", "text": "Wet tile floor", "emoji": "\ud83d\udca7"},
            "right": {"id": "low2", "text": "Low friction (slippery)", "emoji": "\ud83d\udca8"}
          },
          {
            "id": "fr-p5",
            "left": {"id": "rubber", "text": "Rubber mat", "emoji": "\ud83e\uddf4"},
            "right": {"id": "high2", "text": "High friction (grippy)", "emoji": "\u270b"}
          }
        ],
        "hint": "Smooth and wet surfaces are slippery (low friction). Rough and bumpy surfaces are grippy (high friction). Grass is in between!"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 6
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 4: Simple Machines Around Us
-- Module: Forces & Motion | Skill: Push and Pull Forces
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0018-4000-8000-000000000001',
  '10000002-0307-4000-8000-000000000001',
  4,
  'Simple Machines Around Us',
  'Learn about ramps, levers, wheels, and pulleys -- the machines hiding in everyday life!',
  'Chip went on a scavenger hunt and found MACHINES everywhere! But these are not big machines with motors -- they are SIMPLE machines that make work easier. A ramp helps you roll heavy things up. A lever helps you lift stuff. A wheel helps things move. A pulley uses a rope to lift things high. Let''s learn about each one!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Flip each card to learn about simple machines! \ud83d\udd27",
        "cards": [
          {
            "id": "sm-fc-1",
            "front": {"text": "Ramp (Inclined Plane)", "emoji": "\ud83d\udea7"},
            "back": {"text": "A flat surface that goes up at an angle. It helps you move heavy things up without lifting them straight up! Example: a wheelchair ramp.", "emoji": "\u267f"}
          },
          {
            "id": "sm-fc-2",
            "front": {"text": "Lever", "emoji": "\u2696\ufe0f"},
            "back": {"text": "A bar that rests on a point (called a fulcrum) and helps you lift heavy things. Push one end down, the other end goes up! Example: a seesaw.", "emoji": "\ud83c\udfa2"}
          },
          {
            "id": "sm-fc-3",
            "front": {"text": "Wheel and Axle", "emoji": "\u2699\ufe0f"},
            "back": {"text": "A wheel that spins around a rod (axle). It helps things roll instead of slide, which is much easier! Example: a bicycle wheel.", "emoji": "\ud83d\udeb2"}
          },
          {
            "id": "sm-fc-4",
            "front": {"text": "Pulley", "emoji": "\ud83e\uddf5"},
            "back": {"text": "A wheel with a rope around it. Pull the rope DOWN to lift something UP! Example: a flagpole -- you pull the rope to raise the flag.", "emoji": "\ud83c\udff3\ufe0f"}
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each simple machine to a real-life example! \ud83c\udfaf",
        "pairs": [
          {
            "id": "sm-p1",
            "left": {"id": "ramp", "text": "Ramp", "emoji": "\ud83d\udea7"},
            "right": {"id": "wheelchair", "text": "Wheelchair ramp at a store", "emoji": "\u267f"}
          },
          {
            "id": "sm-p2",
            "left": {"id": "lever", "text": "Lever", "emoji": "\u2696\ufe0f"},
            "right": {"id": "seesaw", "text": "Seesaw on the playground", "emoji": "\ud83c\udfa2"}
          },
          {
            "id": "sm-p3",
            "left": {"id": "wheel", "text": "Wheel and Axle", "emoji": "\u2699\ufe0f"},
            "right": {"id": "bicycle", "text": "Bicycle", "emoji": "\ud83d\udeb2"}
          },
          {
            "id": "sm-p4",
            "left": {"id": "pulley", "text": "Pulley", "emoji": "\ud83e\uddf5"},
            "right": {"id": "flagpole", "text": "Flagpole to raise a flag", "emoji": "\ud83c\udff3\ufe0f"}
          },
          {
            "id": "sm-p5",
            "left": {"id": "wedge", "text": "Wedge", "emoji": "\ud83d\udd2a"},
            "right": {"id": "doorstop", "text": "Doorstop under a door", "emoji": "\ud83d\udeaa"}
          }
        ],
        "hint": "Think about how each machine works! A ramp goes up at an angle. A lever rocks back and forth on a point. A pulley uses a rope over a wheel."
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- LESSON 5: Gravity: What Goes Up...
-- Module: Forces & Motion | Skill: Push and Pull Forces
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b2000002-0019-4000-8000-000000000001',
  '10000002-0307-4000-8000-000000000001',
  5,
  'Gravity: What Goes Up...',
  'Learn about Earth''s invisible pulling force that keeps everything on the ground!',
  'Chip tried jumping REALLY high today, but kept coming back down! Why? Because of GRAVITY! Gravity is an invisible force that PULLS everything toward the center of the Earth. That is why when you toss a ball up, it always comes back down. Without gravity, we would all float away into space! Let''s learn about this amazing force!',
  NULL, NULL,
  '[]'::jsonb,
  '9e6554ec-668a-4d27-b66d-412f4ce05d6d',
  ARRAY['20000003-000a-4000-8000-000000000001']::uuid[],
  'interactive',
  false, '{}', true, true,
  7,
  '{
    "activities": [
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "gr-mc-1",
            "prompt": "What happens when you drop a ball? \ud83c\udfbe",
            "options": [
              {"id": "a", "text": "It falls down to the ground", "emoji": "\u2b07\ufe0f"},
              {"id": "b", "text": "It floats in the air", "emoji": ""},
              {"id": "c", "text": "It flies up to the sky", "emoji": ""}
            ],
            "correctOptionId": "a",
            "hint": "Gravity pulls everything DOWN toward the ground. The ball falls because gravity is pulling it!"
          },
          {
            "id": "gr-mc-2",
            "prompt": "Why don''t we float away into space? \ud83c\udf0d",
            "options": [
              {"id": "a", "text": "Because we are too heavy", "emoji": ""},
              {"id": "b", "text": "Because gravity pulls us toward Earth", "emoji": "\u2728"},
              {"id": "c", "text": "Because the air pushes us down", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Earth has a special pulling force called gravity. It keeps us on the ground!"
          },
          {
            "id": "gr-mc-3",
            "prompt": "You throw a ball straight up in the air. What does gravity do? \ud83c\udfbe\u2b06\ufe0f",
            "options": [
              {"id": "a", "text": "Pushes the ball higher", "emoji": ""},
              {"id": "b", "text": "Pulls the ball back down", "emoji": "\u2728"},
              {"id": "c", "text": "Nothing -- the ball keeps going up forever", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "Gravity always pulls things DOWN. Even when you throw something up, gravity brings it back!"
          },
          {
            "id": "gr-mc-4",
            "prompt": "Is gravity a push or a pull? \ud83e\udd14",
            "options": [
              {"id": "a", "text": "Push", "emoji": "\u27a1\ufe0f"},
              {"id": "b", "text": "Pull", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Gravity brings things TOWARD the Earth. That is a pull!"
          },
          {
            "id": "gr-mc-5",
            "prompt": "On the Moon, astronauts can jump SUPER high! Why? \ud83c\udf19\ud83d\udc68\u200d\ud83d\ude80",
            "options": [
              {"id": "a", "text": "They are wearing special boots", "emoji": ""},
              {"id": "b", "text": "The Moon has less gravity than Earth", "emoji": "\u2728"},
              {"id": "c", "text": "There is no air on the Moon", "emoji": ""}
            ],
            "correctOptionId": "b",
            "hint": "The Moon is smaller than Earth, so its gravity is weaker. Less gravity = higher jumps!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "gr-seq-1",
            "prompt": "If you drop these objects from the same height, gravity pulls them all down! Put them in order from what you THINK falls fastest to slowest. \u2b07\ufe0f",
            "items": [
              {"id": "bowling", "text": "Heavy bowling ball", "emoji": "\ud83c\udfb3", "correctPosition": 1},
              {"id": "baseball", "text": "Baseball", "emoji": "\u26be", "correctPosition": 2},
              {"id": "tennis", "text": "Tennis ball", "emoji": "\ud83c\udfbe", "correctPosition": 3},
              {"id": "feather", "text": "Feather", "emoji": "\ud83e\udeb6", "correctPosition": 4}
            ],
            "hint": "This is a tricky one! Gravity actually pulls ALL objects at the same speed, but AIR slows down light things like feathers. Without air, they would all fall at the same speed!"
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
