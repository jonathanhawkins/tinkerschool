-- =============================================================================
-- TinkerSchool -- Seed Pre-K Math & Social-Emotional Lessons
-- =============================================================================
-- 10 browser-only interactive lessons for Pre-K (Band 0, Ages 3-5):
--   - 5 Math "Counting Corner" lessons
--   - 5 Social-Emotional "Feelings & Friends" lessons
--
-- Widget types used: counting, parent_activity, tap_and_reveal,
--   multiple_choice, drag_to_sort, sequence_order, flash_card,
--   matching_pairs, emotion_picker
--
-- Depends on:
--   - 001_initial_schema.sql (lessons table)
--   - 002_tinkerschool_multi_subject.sql (subject_id, skills_covered, etc.)
--   - 058_seed_prek_skills.sql (Pre-K math skills)
--   - 059_seed_social_emotional_subject.sql (social-emotional subject + skills)
--   - 060_seed_prek_modules.sql (Pre-K modules)
--
-- Subject IDs:
--   Math:              00000000-0000-4000-8000-000000000001
--   Social-Emotional:  00000000-0000-4000-8000-000000000008
--
-- Module IDs:
--   Counting Corner:     00000000-0000-4000-8000-000000000101
--   Feelings & Friends:  00000000-0000-4000-8000-000000000108
--
-- Math Skill IDs:
--   Rote Counting to 10:    10000000-0001-4000-8000-000000000001
--   One-to-One Counting:    10000000-0002-4000-8000-000000000001
--   Number Recognition 1-5: 10000000-0003-4000-8000-000000000001
--   Shape Recognition:      10000000-0004-4000-8000-000000000001
--   Size Comparison:        10000000-0005-4000-8000-000000000001
--   Simple Patterns:        10000000-0006-4000-8000-000000000001
--
-- Social-Emotional Skill IDs:
--   Naming Emotions:              80000000-0001-4000-8000-000000000001
--   Recognizing Emotions Others:  80000000-0002-4000-8000-000000000001
--   Calm-Down Strategies:         80000000-0003-4000-8000-000000000001
--   Taking Turns:                 80000000-0004-4000-8000-000000000001
--   Kindness Actions:             80000000-0006-4000-8000-000000000001
--
-- Math Lesson IDs:    b0000001-0001 through b0000001-0005
-- SEL Lesson IDs:     b0000008-0001 through b0000008-0005
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- *************************************************************************
--
--  PART A: MATH "COUNTING CORNER" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- MATH LESSON 1: How Many Friends?
-- Module: Counting Corner
-- Widgets: counting + parent_activity
-- Skills: Rote Counting, One-to-One Counting
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000001-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  1,
  'How Many Friends?',
  'Count cute animals with Chip! Tap each one to see how many there are.',
  'Hi there, little friend! I''m Chip! Look at all these animal friends who came to play! Can you count them with me? Tap each one!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000000-0001-4000-8000-000000000001',
    '10000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "count-bunnies",
            "prompt": "How many bunnies do you see?",
            "emoji": "\ud83d\udc30",
            "correctCount": 2,
            "displayCount": 2,
            "hint": "Tap each bunny! Count with me: 1... 2!"
          },
          {
            "id": "count-puppies",
            "prompt": "How many puppies are playing?",
            "emoji": "\ud83d\udc36",
            "correctCount": 3,
            "displayCount": 3,
            "hint": "Point to each puppy and count: 1, 2, 3!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Gather stuffed animals and count them together! Start with 3 animals and count them one by one, touching each as you count. Add one more and count again!",
        "parentTip": "Encourage your child to touch each stuffed animal as they count. This builds one-to-one correspondence \u2014 the idea that each object gets exactly one number.",
        "completionPrompt": "Did you count your stuffed animals together?",
        "illustration": "\ud83e\uddf8"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 2: Shapes Are Everywhere!
-- Module: Counting Corner
-- Widgets: tap_and_reveal (explore) + multiple_choice
-- Skills: Shape Recognition
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000001-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  2,
  'Shapes Are Everywhere!',
  'Find shapes hiding behind clouds! Circles, squares, triangles, and more.',
  'Whoa! Chip sees something hiding behind those fluffy clouds! I think they''re SHAPES! Can you tap the clouds to find out what''s hiding? Shapes are all around us!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000000-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "find-shapes",
            "prompt": "Tap the clouds to find the shapes hiding!",
            "mode": "explore",
            "gridCols": 2,
            "items": [
              {
                "id": "shape-circle",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\ud83d\udfe2",
                "revealLabel": "Circle"
              },
              {
                "id": "shape-square",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\ud83d\udfe7",
                "revealLabel": "Square"
              },
              {
                "id": "shape-triangle",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\ud83d\udd3a",
                "revealLabel": "Triangle"
              },
              {
                "id": "shape-star",
                "coverEmoji": "\u2601\ufe0f",
                "revealEmoji": "\u2b50",
                "revealLabel": "Star"
              }
            ]
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "shape-mc-1",
            "prompt": "Which shape is round like a ball?",
            "promptEmoji": "\u26bd",
            "options": [
              {"id": "a", "text": "Circle", "emoji": "\ud83d\udfe2"},
              {"id": "b", "text": "Square", "emoji": "\ud83d\udfe7"}
            ],
            "correctOptionId": "a",
            "hint": "A ball is round \u2014 which shape is round too?"
          },
          {
            "id": "shape-mc-2",
            "prompt": "Which shape has 3 sides?",
            "promptEmoji": "\ud83d\udd3a",
            "options": [
              {"id": "a", "text": "Square", "emoji": "\ud83d\udfe7"},
              {"id": "b", "text": "Triangle", "emoji": "\ud83d\udd3a"}
            ],
            "correctOptionId": "b",
            "hint": "Count the sides: 1, 2, 3! That''s a triangle."
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 3: Big and Small
-- Module: Counting Corner
-- Widgets: drag_to_sort + parent_activity
-- Skills: Size Comparison
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000001-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  3,
  'Big and Small',
  'Sort the animals! Which ones are big and which ones are small?',
  'Hey friend! Chip needs your help! These animals got all mixed up. Can you sort them? Put the BIG animals in one group and the SMALL animals in the other!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000000-0005-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "drag_to_sort",
        "questions": [
          {
            "id": "sort-big-small",
            "prompt": "Sort the animals! Drag each one to the right group.",
            "buckets": [
              {"id": "big", "label": "Big", "emoji": "\ud83d\udc18"},
              {"id": "small", "label": "Small", "emoji": "\ud83d\udc1d"}
            ],
            "items": [
              {"id": "elephant", "label": "Elephant", "emoji": "\ud83d\udc18", "correctBucket": "big"},
              {"id": "mouse", "label": "Mouse", "emoji": "\ud83d\udc2d", "correctBucket": "small"},
              {"id": "bear", "label": "Bear", "emoji": "\ud83d\udc3b", "correctBucket": "big"},
              {"id": "ant", "label": "Ant", "emoji": "\ud83d\udc1c", "correctBucket": "small"}
            ],
            "hint": "An elephant is really big! A mouse is really small!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Go on a size hunt together! Find something bigger than your hand and something smaller than your hand. Then find the biggest thing in the room and the smallest!",
        "parentTip": "Use comparison language: bigger, smaller, taller, shorter. Ask your child to explain why one thing is bigger than another.",
        "completionPrompt": "Did you find big and small things around you?",
        "illustration": "\ud83d\udd0d"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 4: Red Blue Red Blue
-- Module: Counting Corner
-- Widgets: sequence_order + flash_card
-- Skills: Simple Patterns
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000001-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  4,
  'Red Blue Red Blue',
  'Discover patterns! What color comes next?',
  'Look at this, friend! Chip found a pattern: red, blue, red, blue. It keeps going! But oh no \u2014 one piece is missing! Can you figure out what comes next?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000000-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "pattern-rb",
            "prompt": "Put the colors in order to finish the pattern: Red, Blue, ???",
            "items": [
              {"id": "red", "text": "Red", "emoji": "\ud83d\udfe5", "correctPosition": 1},
              {"id": "blue", "text": "Blue", "emoji": "\ud83d\udfe6", "correctPosition": 2},
              {"id": "red2", "text": "Red", "emoji": "\ud83d\udfe5", "correctPosition": 3}
            ],
            "hint": "The pattern goes: red, blue, red, blue. What comes after blue?"
          }
        ]
      },
      {
        "type": "flash_card",
        "prompt": "Let''s learn our colors! Tap to flip each card.",
        "cards": [
          {
            "id": "color-red",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udfe5"},
            "back": {"text": "Red!", "emoji": "\ud83d\udfe5"},
            "color": "#EF4444"
          },
          {
            "id": "color-blue",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udfe6"},
            "back": {"text": "Blue!", "emoji": "\ud83d\udfe6"},
            "color": "#3B82F6"
          },
          {
            "id": "color-yellow",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udfe8"},
            "back": {"text": "Yellow!", "emoji": "\ud83d\udfe8"},
            "color": "#EAB308"
          },
          {
            "id": "color-green",
            "front": {"text": "What color is this?", "emoji": "\ud83d\udfe9"},
            "back": {"text": "Green!", "emoji": "\ud83d\udfe9"},
            "color": "#22C55E"
          }
        ],
        "shuffleCards": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- MATH LESSON 5: Count and Match
-- Module: Counting Corner
-- Widgets: counting + matching_pairs
-- Skills: Number Recognition, One-to-One Counting
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000001-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  5,
  'Count and Match',
  'Count objects and match numbers to groups of dots!',
  'Great job counting, friend! Now Chip has a super fun challenge \u2014 can you count the stars and hearts, and then match numbers to the right group of dots?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000001',
  ARRAY[
    '10000000-0003-4000-8000-000000000001',
    '10000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "counting",
        "questions": [
          {
            "id": "count-stars",
            "prompt": "How many stars do you see?",
            "emoji": "\u2b50",
            "correctCount": 4,
            "displayCount": 4,
            "hint": "Tap each star and count: 1, 2, 3, 4!"
          },
          {
            "id": "count-hearts",
            "prompt": "How many hearts are there?",
            "emoji": "\u2764\ufe0f",
            "correctCount": 5,
            "displayCount": 5,
            "hint": "Count each heart: 1, 2, 3, 4, 5!"
          }
        ]
      },
      {
        "type": "matching_pairs",
        "prompt": "Match each number to the right group of dots!",
        "pairs": [
          {
            "id": "match-1",
            "left": {"id": "num-1", "text": "1", "emoji": "1\ufe0f\u20e3"},
            "right": {"id": "dots-1", "text": "\u25cf", "emoji": "\u26ab"}
          },
          {
            "id": "match-2",
            "left": {"id": "num-2", "text": "2", "emoji": "2\ufe0f\u20e3"},
            "right": {"id": "dots-2", "text": "\u25cf\u25cf", "emoji": "\u26ab\u26ab"}
          },
          {
            "id": "match-3",
            "left": {"id": "num-3", "text": "3", "emoji": "3\ufe0f\u20e3"},
            "right": {"id": "dots-3", "text": "\u25cf\u25cf\u25cf", "emoji": "\u26ab\u26ab\u26ab"}
          }
        ],
        "hint": "Count the dots! How many dots match the number?"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- *************************************************************************
--
--  PART B: SOCIAL-EMOTIONAL "FEELINGS & FRIENDS" LESSONS (5 lessons)
--
-- *************************************************************************


-- =========================================================================
-- SEL LESSON 1: Happy, Sad, Angry
-- Module: Feelings & Friends
-- Widgets: emotion_picker + flash_card
-- Skills: Naming Emotions
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000008-0001-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000108',
  1,
  'Happy, Sad, Angry',
  'Learn about big feelings! How do you feel when different things happen?',
  'Hi friend! Chip wants to talk about FEELINGS today! Sometimes we feel happy, sometimes sad, sometimes angry \u2014 and that''s totally okay! Let''s figure out which feeling goes with each story.',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000008',
  ARRAY[
    '80000000-0001-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "emotion_picker",
        "questions": [
          {
            "id": "ep-present",
            "scenario": "You just got a special present for your birthday!",
            "scenarioEmoji": "\ud83c\udf81",
            "validEmotions": ["happy"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          },
          {
            "id": "ep-toy-broke",
            "scenario": "Oh no! Your favorite toy just broke.",
            "scenarioEmoji": "\ud83e\uddf8",
            "validEmotions": ["sad"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          },
          {
            "id": "ep-snack-taken",
            "scenario": "Someone took your snack without asking!",
            "scenarioEmoji": "\ud83c\udf6a",
            "validEmotions": ["angry"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          }
        ]
      },
      {
        "type": "flash_card",
        "prompt": "Let''s learn the feeling faces! Tap to flip each card.",
        "cards": [
          {
            "id": "face-happy",
            "front": {"text": "What face is this?", "emoji": "\ud83d\ude0a"},
            "back": {"text": "Happy!", "emoji": "\ud83d\ude0a"},
            "color": "#22C55E"
          },
          {
            "id": "face-sad",
            "front": {"text": "What face is this?", "emoji": "\ud83d\ude22"},
            "back": {"text": "Sad", "emoji": "\ud83d\ude22"},
            "color": "#3B82F6"
          },
          {
            "id": "face-angry",
            "front": {"text": "What face is this?", "emoji": "\ud83d\ude20"},
            "back": {"text": "Angry", "emoji": "\ud83d\ude20"},
            "color": "#EF4444"
          },
          {
            "id": "face-scared",
            "front": {"text": "What face is this?", "emoji": "\ud83d\ude28"},
            "back": {"text": "Scared", "emoji": "\ud83d\ude28"},
            "color": "#A855F7"
          }
        ],
        "shuffleCards": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SEL LESSON 2: How Does Teddy Feel?
-- Module: Feelings & Friends
-- Widgets: emotion_picker + parent_activity
-- Skills: Recognizing Emotions in Others
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000008-0002-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000108',
  2,
  'How Does Teddy Feel?',
  'Look at Teddy Bear and figure out how he feels! Can you read his emotions?',
  'This is Chip''s friend, Teddy Bear! Teddy has lots of feelings just like you. Let''s look at what happens to Teddy and figure out how he feels!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000008',
  ARRAY[
    '80000000-0002-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "emotion_picker",
        "questions": [
          {
            "id": "teddy-fell",
            "scenario": "Teddy fell down and bumped his knee.",
            "scenarioEmoji": "\ud83e\uddf8",
            "validEmotions": ["sad"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "scared", "emoji": "\ud83d\ude28", "label": "Scared"}
            ]
          },
          {
            "id": "teddy-hug",
            "scenario": "Teddy got a big warm hug from his friend!",
            "scenarioEmoji": "\ud83e\uddf8",
            "validEmotions": ["happy"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          },
          {
            "id": "teddy-loud",
            "scenario": "Teddy heard a very loud noise! BOOM!",
            "scenarioEmoji": "\ud83d\udca5",
            "validEmotions": ["scared"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "scared", "emoji": "\ud83d\ude28", "label": "Scared"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          },
          {
            "id": "teddy-share",
            "scenario": "Teddy''s friend shared a yummy cookie with him!",
            "scenarioEmoji": "\ud83c\udf6a",
            "validEmotions": ["happy"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Make faces together! Take turns making a happy face, a sad face, a surprised face, and an angry face. Can your child guess which feeling you are showing?",
        "parentTip": "Point out facial clues: ''See how my eyebrows go up when I''m surprised?'' or ''My mouth goes down when I''m sad.'' This builds emotional literacy.",
        "completionPrompt": "Did you make faces and guess feelings together?",
        "illustration": "\ud83d\ude04"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SEL LESSON 3: Breathing Like a Bunny
-- Module: Feelings & Friends
-- Widgets: parent_activity + multiple_choice
-- Skills: Calm-Down Strategies
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000008-0003-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000108',
  3,
  'Breathing Like a Bunny',
  'Learn a special trick to calm down when you have big feelings!',
  'Sometimes we get really BIG feelings \u2014 and that''s okay! Chip learned a super cool trick from a bunny friend: special breathing! Let''s try it together.',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000008',
  ARRAY[
    '80000000-0003-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "parent_activity",
        "prompt": "Bunny Breathing!",
        "instructions": "Practice bunny breathing together! Smell the flower (breathe in slowly through your nose)... Blow out the candle (breathe out slowly through your mouth). Do it 3 times together! Make it fun \u2014 pretend to hold a flower and a candle.",
        "parentTip": "Model the breathing yourself first. Young children learn calming strategies best by copying a trusted adult. You can also try ''hot cocoa breathing'' \u2014 smell the cocoa, blow to cool it down!",
        "completionPrompt": "Did you practice bunny breathing 3 times together?",
        "illustration": "\ud83d\udc30"
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "calm-down-1",
            "prompt": "When we feel angry, what can we do to feel better?",
            "promptEmoji": "\ud83d\ude24",
            "options": [
              {"id": "a", "text": "Take a deep breath", "emoji": "\ud83c\udf2c\ufe0f"},
              {"id": "b", "text": "Throw a toy", "emoji": "\ud83e\uddf8"}
            ],
            "correctOptionId": "a",
            "hint": "Remember bunny breathing! Smelling the flower and blowing out the candle helps us feel calm."
          },
          {
            "id": "calm-down-2",
            "prompt": "What can you do when you feel scared?",
            "promptEmoji": "\ud83d\ude28",
            "options": [
              {"id": "a", "text": "Tell a grown-up", "emoji": "\ud83e\uddd1"},
              {"id": "b", "text": "Hide and cry alone", "emoji": "\ud83d\ude2d"}
            ],
            "correctOptionId": "a",
            "hint": "It''s always okay to ask a grown-up for help when you feel scared!"
          }
        ],
        "shuffleOptions": false
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SEL LESSON 4: Taking Turns
-- Module: Feelings & Friends
-- Widgets: sequence_order + parent_activity
-- Skills: Taking Turns
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000008-0004-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000108',
  4,
  'Taking Turns',
  'Learn how to take turns with friends! First me, then you!',
  'Chip loves playing games with friends! But wait \u2014 everyone wants to go first! That''s where TAKING TURNS helps. Let''s learn the steps!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000008',
  ARRAY[
    '80000000-0004-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "sequence_order",
        "questions": [
          {
            "id": "turns-order",
            "prompt": "Put the turn-taking steps in the right order!",
            "items": [
              {"id": "wait", "text": "Wait for your turn", "emoji": "\u23f3", "correctPosition": 1},
              {"id": "your-turn", "text": "It''s your turn!", "emoji": "\ud83c\udf1f", "correctPosition": 2},
              {"id": "friend-turn", "text": "Now it''s your friend''s turn!", "emoji": "\ud83e\udd1d", "correctPosition": 3}
            ],
            "hint": "First we wait, then we play, then our friend plays!"
          }
        ]
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play a simple game together and practice turn-taking! Try rolling a ball back and forth, stacking blocks one at a time, or playing with a toy. Say ''Your turn!'' and ''My turn!'' each time.",
        "parentTip": "Keep the turns short so your child doesn''t have to wait too long. Praise the waiting: ''Great job waiting for your turn!'' rather than only praising the doing.",
        "completionPrompt": "Did you practice taking turns together?",
        "illustration": "\ud83c\udfb2"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);


-- =========================================================================
-- SEL LESSON 5: Kind Hands
-- Module: Feelings & Friends
-- Widgets: tap_and_reveal (find) + emotion_picker
-- Skills: Kindness Actions
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'b0000008-0005-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000108',
  5,
  'Kind Hands',
  'Discover kind things you can do! Sharing, helping, and hugging make everyone happy.',
  'Chip thinks being kind is AMAZING! Kind hands help, share, and give hugs. Let''s find the kind actions hiding in this picture!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000008',
  ARRAY[
    '80000000-0006-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  8,
  '{
    "activities": [
      {
        "type": "tap_and_reveal",
        "questions": [
          {
            "id": "find-kind",
            "prompt": "Tap to reveal the pictures! Find the kind actions!",
            "mode": "find",
            "targetPrompt": "Find all the kind things you can do!",
            "gridCols": 3,
            "items": [
              {
                "id": "sharing",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83e\udd1d",
                "revealLabel": "Sharing",
                "isTarget": true
              },
              {
                "id": "sleeping",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83d\ude34",
                "revealLabel": "Sleeping",
                "isTarget": false
              },
              {
                "id": "helping",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83e\uddf9",
                "revealLabel": "Helping",
                "isTarget": true
              },
              {
                "id": "eating",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83c\udf54",
                "revealLabel": "Eating",
                "isTarget": false
              },
              {
                "id": "hugging",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83e\udd17",
                "revealLabel": "Hugging",
                "isTarget": true
              },
              {
                "id": "reading",
                "coverEmoji": "\ud83c\udf1f",
                "revealEmoji": "\ud83d\udcda",
                "revealLabel": "Reading",
                "isTarget": false
              }
            ]
          }
        ]
      },
      {
        "type": "emotion_picker",
        "questions": [
          {
            "id": "kind-feel-1",
            "scenario": "You helped your friend pick up their crayons that fell on the floor.",
            "scenarioEmoji": "\ud83d\udd8d\ufe0f",
            "validEmotions": ["happy", "grateful"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "grateful", "emoji": "\ud83e\udd70", "label": "Grateful"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "angry", "emoji": "\ud83d\ude20", "label": "Angry"}
            ]
          },
          {
            "id": "kind-feel-2",
            "scenario": "You shared your favorite toy with your friend who didn''t have one.",
            "scenarioEmoji": "\ud83e\uddf8",
            "validEmotions": ["happy", "grateful"],
            "options": [
              {"emotion": "happy", "emoji": "\ud83d\ude0a", "label": "Happy"},
              {"emotion": "grateful", "emoji": "\ud83e\udd70", "label": "Grateful"},
              {"emotion": "sad", "emoji": "\ud83d\ude22", "label": "Sad"},
              {"emotion": "scared", "emoji": "\ud83d\ude28", "label": "Scared"}
            ]
          }
        ]
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 8
  }'::jsonb
);
