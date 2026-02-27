-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Music Lessons (Band 1, Ages 5-6)
-- =============================================================================
-- 5 interactive lessons for Kindergarten Music "Music Makers" module.
-- Aligned to National Core Arts Standards (NCAS) Music K
--
-- Module ID: 00000001-0041-4000-8000-000000000001
-- Subject ID: 00000000-0000-4000-8000-000000000004
--
-- Lesson UUIDs: c1000004-0001 through c1000004-0005
-- =============================================================================


-- =========================================================================
-- MUSIC LESSON 1: Feel the Beat!
-- Skills: Steady Beat, Body Percussion
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000004-0001-4000-8000-000000000001',
  '00000001-0041-4000-8000-000000000001',
  1,
  'Feel the Beat!',
  'Clap along to a steady beat! Your hands, feet, and body can make music!',
  'Music has a BEAT \u2014 like a heartbeat that keeps going! Clap with Chip: clap, clap, clap, clap! Can you keep it steady, not too fast and not too slow?',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000100-0001-4000-8000-000000000001',
    '40000100-0005-4000-8000-000000000001'
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
            "id": "beat-1",
            "prompt": "A steady beat sounds like:",
            "promptEmoji": "\ud83e\udd41",
            "options": [
              {"id": "a", "text": "Clap - Clap - Clap - Clap (same speed)", "emoji": "\ud83d\udc4f"},
              {"id": "b", "text": "Clap-ClapClap - Clap (different speeds)", "emoji": "\ud83e\udd14"}
            ],
            "correctOptionId": "a",
            "hint": "Steady means the same speed every time, like a clock: tick, tick, tick!"
          },
          {
            "id": "beat-2",
            "prompt": "Your heartbeat is a type of...",
            "promptEmoji": "\u2764\ufe0f",
            "options": [
              {"id": "a", "text": "Steady beat", "emoji": "\ud83e\udd41"},
              {"id": "b", "text": "Color", "emoji": "\ud83c\udfa8"},
              {"id": "c", "text": "Shape", "emoji": "\ud83d\udfe2"}
            ],
            "correctOptionId": "a",
            "hint": "Put your hand on your chest \u2014 feel that? Thump, thump, thump!"
          },
          {
            "id": "beat-3",
            "prompt": "Which body part can you use to keep a beat?",
            "promptEmoji": "\ud83e\uddd1",
            "options": [
              {"id": "a", "text": "Hands (clap!)", "emoji": "\ud83d\udc4f"},
              {"id": "b", "text": "Feet (stomp!)", "emoji": "\ud83e\uddb6"},
              {"id": "c", "text": "Both!", "emoji": "\ud83c\udf1f"}
            ],
            "correctOptionId": "c",
            "hint": "You can make beats with your hands, feet, knees, and more!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Practice body percussion together! Try these patterns: 1) Clap a steady beat while walking. 2) Pat your knees to a beat. 3) Stomp your feet like a marching band! Take turns being the beat leader.",
        "parentTip": "Keeping a steady beat is a foundational music skill. Play a favorite song and clap along. If your child speeds up or slows down, that''s normal \u2014 it takes practice!",
        "completionPrompt": "Did you clap and stomp to a steady beat?",
        "illustration": "\ud83d\udc4f"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 2: Loud and Soft
-- Skills: Loud and Soft (Dynamics)
-- Widgets: multiple_choice + drag_to_sort
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000004-0002-4000-8000-000000000001',
  '00000001-0041-4000-8000-000000000001',
  2,
  'Loud and Soft',
  'Music can be LOUD like thunder or soft like a whisper! Explore dynamics!',
  'Shhh... can you hear that? That''s a soft sound. Now... BOOM! That''s a LOUD sound! In music, we call loud and soft sounds DYNAMICS. Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000100-0002-4000-8000-000000000001'
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
            "id": "sort-loud-soft",
            "prompt": "Sort these sounds! Are they LOUD or SOFT?",
            "buckets": [
              {"id": "loud", "label": "Loud", "emoji": "\ud83d\udd0a"},
              {"id": "soft", "label": "Soft", "emoji": "\ud83e\udd2b"}
            ],
            "items": [
              {"id": "thunder", "label": "Thunder", "emoji": "\u26a1", "correctBucket": "loud"},
              {"id": "whisper", "label": "Whisper", "emoji": "\ud83e\udd2b", "correctBucket": "soft"},
              {"id": "drum", "label": "Drum bang", "emoji": "\ud83e\udd41", "correctBucket": "loud"},
              {"id": "lullaby", "label": "Lullaby", "emoji": "\ud83c\udf19", "correctBucket": "soft"},
              {"id": "siren", "label": "Fire truck", "emoji": "\ud83d\ude92", "correctBucket": "loud"}
            ],
            "hint": "Loud sounds are BIG and strong. Soft sounds are quiet and gentle."
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "dyn-1",
            "prompt": "When would you use a SOFT voice?",
            "promptEmoji": "\ud83e\udd2b",
            "options": [
              {"id": "a", "text": "At a library", "emoji": "\ud83d\udcda"},
              {"id": "b", "text": "At a soccer game", "emoji": "\u26bd"},
              {"id": "c", "text": "At a parade", "emoji": "\ud83c\udf89"}
            ],
            "correctOptionId": "a",
            "hint": "Libraries are quiet places! We use soft, gentle voices there."
          },
          {
            "id": "dyn-2",
            "prompt": "Musicians call LOUD sounds...",
            "promptEmoji": "\ud83c\udfb6",
            "options": [
              {"id": "a", "text": "Forte (means loud!)", "emoji": "\ud83d\udd0a"},
              {"id": "b", "text": "Piano (means soft!)", "emoji": "\ud83e\udd2b"}
            ],
            "correctOptionId": "a",
            "hint": "Forte is a special music word that means LOUD!"
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
-- MUSIC LESSON 3: Fast and Slow
-- Skills: Fast and Slow (Tempo)
-- Widgets: multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000004-0003-4000-8000-000000000001',
  '00000001-0041-4000-8000-000000000001',
  3,
  'Fast and Slow',
  'Music can race like a cheetah or move slowly like a turtle! Explore tempo!',
  'Some music is super FAST \u2014 like a race car zooming! And some music is really SLOW \u2014 like a sleepy turtle walking. The speed of music is called TEMPO. Let''s try it!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000100-0003-4000-8000-000000000001'
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
            "id": "tempo-1",
            "prompt": "Which animal moves at a FAST tempo?",
            "promptEmoji": "\ud83c\udfb5",
            "options": [
              {"id": "a", "text": "Cheetah", "emoji": "\ud83d\udc06"},
              {"id": "b", "text": "Turtle", "emoji": "\ud83d\udc22"},
              {"id": "c", "text": "Snail", "emoji": "\ud83d\udc0c"}
            ],
            "correctOptionId": "a",
            "hint": "Fast tempo = quick, like a running cheetah!"
          },
          {
            "id": "tempo-2",
            "prompt": "A lullaby usually has a _____ tempo.",
            "promptEmoji": "\ud83c\udf19",
            "options": [
              {"id": "a", "text": "Fast", "emoji": "\ud83d\udc06"},
              {"id": "b", "text": "Slow", "emoji": "\ud83d\udc22"}
            ],
            "correctOptionId": "b",
            "hint": "Lullabies help you sleep \u2014 are they fast or slow and gentle?"
          },
          {
            "id": "tempo-3",
            "prompt": "When we speed up clapping, the tempo gets...",
            "promptEmoji": "\ud83d\udc4f",
            "options": [
              {"id": "a", "text": "Faster", "emoji": "\u23e9"},
              {"id": "b", "text": "Slower", "emoji": "\u23ea"},
              {"id": "c", "text": "Louder", "emoji": "\ud83d\udd0a"}
            ],
            "correctOptionId": "a",
            "hint": "Tempo is about speed, not volume! Going quicker = faster tempo."
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Play a tempo game! Clap slowly like a turtle, then speed up like a cheetah! March around the room: slow march, then fast march. Sing a familiar song (like ''Twinkle Twinkle'') slowly, then again very fast \u2014 silly and fun!",
        "parentTip": "Tempo awareness helps kids develop self-regulation (controlling speed). Try ''freeze dance'' \u2014 play music and freeze when it stops. Vary the tempo between rounds!",
        "completionPrompt": "Did you try clapping and moving at different tempos?",
        "illustration": "\ud83c\udfb5"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);


-- =========================================================================
-- MUSIC LESSON 4: Singing Voice vs Talking Voice
-- Skills: Singing Voice, Responding to Music
-- Widgets: multiple_choice + flash_card
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000004-0004-4000-8000-000000000001',
  '00000001-0041-4000-8000-000000000001',
  4,
  'Singing Voice vs Talking Voice',
  'Your voice can TALK and SING! They sound different. Let''s find out how!',
  'Did you know your voice is like a musical instrument? When you talk, your voice stays flat. But when you SING, your voice goes UP and DOWN like a roller coaster! Let''s explore!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000100-0004-4000-8000-000000000001',
    '40000100-0007-4000-8000-000000000001'
  ]::uuid[],
  'interactive',
  false, '{}', true, true,
  10,
  '{
    "activities": [
      {
        "type": "flash_card",
        "prompt": "Learn about the different ways you can use your voice! Tap to flip.",
        "cards": [
          {
            "id": "voice-talk",
            "front": {"text": "Talking Voice", "emoji": "\ud83d\udde3\ufe0f"},
            "back": {"text": "Your talking voice stays about the same \u2014 flat and steady.", "emoji": "\ud83d\udde3\ufe0f"},
            "color": "#3B82F6"
          },
          {
            "id": "voice-sing",
            "front": {"text": "Singing Voice", "emoji": "\ud83c\udfa4"},
            "back": {"text": "Your singing voice goes UP and DOWN \u2014 like a roller coaster!", "emoji": "\ud83c\udfa4"},
            "color": "#A855F7"
          },
          {
            "id": "voice-whisper",
            "front": {"text": "Whispering Voice", "emoji": "\ud83e\udd2b"},
            "back": {"text": "A whisper is super quiet and breathy.", "emoji": "\ud83e\udd2b"},
            "color": "#22C55E"
          },
          {
            "id": "voice-shout",
            "front": {"text": "Shouting Voice", "emoji": "\ud83d\udce2"},
            "back": {"text": "Shouting is very loud! We use it outside, not inside.", "emoji": "\ud83d\udce2"},
            "color": "#EF4444"
          }
        ],
        "shuffleCards": false
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "voice-mc-1",
            "prompt": "When singing, your voice goes...",
            "promptEmoji": "\ud83c\udfa4",
            "options": [
              {"id": "a", "text": "Up and down (high and low)", "emoji": "\ud83c\udfa2"},
              {"id": "b", "text": "Stays the same", "emoji": "\u27a1\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Try singing ''la la la'' \u2014 notice how your voice goes higher and lower!"
          },
          {
            "id": "voice-mc-2",
            "prompt": "How does a happy song make you feel?",
            "promptEmoji": "\ud83c\udfb6",
            "options": [
              {"id": "a", "text": "Joyful and like dancing!", "emoji": "\ud83d\ude03"},
              {"id": "b", "text": "Sleepy", "emoji": "\ud83d\ude34"},
              {"id": "c", "text": "Angry", "emoji": "\ud83d\ude20"}
            ],
            "correctOptionId": "a",
            "hint": "Happy songs with fast beats make us want to move and smile!"
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
-- MUSIC LESSON 5: High and Low Sounds
-- Skills: High and Low Sounds, Musical Ideas
-- Widgets: drag_to_sort + multiple_choice + parent_activity
-- =========================================================================
INSERT INTO public.lessons (
  id, module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  'c1000004-0005-4000-8000-000000000001',
  '00000001-0041-4000-8000-000000000001',
  5,
  'High and Low Sounds',
  'Some sounds are high like a bird, some are low like a bear! Can you tell the difference?',
  'Chip noticed that a little bird goes ''tweet tweet'' (HIGH sound!) and a big bear goes ''ROAR'' (LOW sound!). Sounds can be high or low \u2014 let''s sort them!',
  NULL, NULL,
  '[]'::jsonb,
  '00000000-0000-4000-8000-000000000004',
  ARRAY[
    '40000100-0008-4000-8000-000000000001',
    '40000100-0006-4000-8000-000000000001'
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
            "id": "sort-high-low",
            "prompt": "Sort the sounds! Are they HIGH or LOW?",
            "buckets": [
              {"id": "high", "label": "High Sound", "emoji": "\u2b06\ufe0f"},
              {"id": "low", "label": "Low Sound", "emoji": "\u2b07\ufe0f"}
            ],
            "items": [
              {"id": "bird", "label": "Bird tweet", "emoji": "\ud83d\udc26", "correctBucket": "high"},
              {"id": "bear", "label": "Bear growl", "emoji": "\ud83d\udc3b", "correctBucket": "low"},
              {"id": "whistle", "label": "Whistle", "emoji": "\ud83d\udcef", "correctBucket": "high"},
              {"id": "drum", "label": "Big drum", "emoji": "\ud83e\udd41", "correctBucket": "low"},
              {"id": "mouse", "label": "Mouse squeak", "emoji": "\ud83d\udc2d", "correctBucket": "high"}
            ],
            "hint": "High sounds are tiny and squeaky. Low sounds are big and rumbly!"
          }
        ]
      },
      {
        "type": "multiple_choice",
        "questions": [
          {
            "id": "pitch-1",
            "prompt": "A tiny flute makes a _____ sound.",
            "promptEmoji": "\ud83c\udfb6",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "a",
            "hint": "Small instruments usually make higher sounds!"
          },
          {
            "id": "pitch-2",
            "prompt": "A big tuba makes a _____ sound.",
            "promptEmoji": "\ud83c\udfba",
            "options": [
              {"id": "a", "text": "High", "emoji": "\u2b06\ufe0f"},
              {"id": "b", "text": "Low", "emoji": "\u2b07\ufe0f"}
            ],
            "correctOptionId": "b",
            "hint": "Big instruments usually make lower sounds!"
          }
        ],
        "shuffleOptions": false
      },
      {
        "type": "parent_activity",
        "prompt": "Off-Screen Fun!",
        "instructions": "Explore high and low sounds together! Tap a glass of water with a spoon \u2014 listen to the pitch. Add more water \u2014 does the pitch change? Try tapping different objects and sorting them as high or low.",
        "parentTip": "Pitch discrimination is a key pre-music skill. Fill glasses with different water levels for a simple xylophone! Higher water = lower pitch (counterintuitively).",
        "completionPrompt": "Did you explore high and low sounds at home?",
        "illustration": "\ud83c\udfb6"
      }
    ],
    "passingScore": 60,
    "estimatedMinutes": 10
  }'::jsonb
);
