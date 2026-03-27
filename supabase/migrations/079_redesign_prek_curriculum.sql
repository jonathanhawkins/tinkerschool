-- =============================================================================
-- TinkerSchool Pre-K Curriculum Seed (Voice-First, Absolute Basics)
-- 48 lessons across 8 subjects for ages 3-5
-- Generated from production database backup
-- =============================================================================

-- Delete existing Pre-K lessons before re-seeding
DELETE FROM public.lessons
WHERE module_id IN (
  SELECT id FROM public.modules WHERE band = 0
);

-- === READING ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  1,
  'A is for Apple',
  'Learn the letter A!',
  'A says ''aaa'' like in APPLE! Can you say ''aaa''?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"a1","prompt":"Which starts with A?","options":[{"id":"opt_0","text":"Apple","emoji":"🍎"},{"id":"opt_1","text":"Dog","emoji":"🐶"}],"correctOptionId":"opt_0","hint":"APPLE starts with A!"},{"id":"a2","prompt":"Which starts with A?","options":[{"id":"opt_0","text":"Ant","emoji":"🐜"},{"id":"opt_1","text":"Cat","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"ANT starts with A!"},{"id":"a3","prompt":"What sound does A make?","options":[{"id":"opt_0","text":"Aaa"},{"id":"opt_1","text":"Buh"}],"correctOptionId":"opt_0","hint":"A says \"aaa\"!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find things that start with A. Draw a big letter A together.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🍎"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  2,
  'B is for Bear',
  'Learn the letter B!',
  'B says ''buh'' like in BEAR!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"b1","prompt":"Which starts with B?","options":[{"id":"opt_0","text":"Bear","emoji":"🐻"},{"id":"opt_1","text":"Cat","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"BEAR starts with B!"},{"id":"b2","prompt":"Which starts with B?","options":[{"id":"opt_0","text":"Apple","emoji":"🍎"},{"id":"opt_1","text":"Banana","emoji":"🍌"}],"correctOptionId":"opt_1","hint":"BANANA starts with B!"},{"id":"b3","prompt":"Does APPLE start with A or B?","options":[{"id":"opt_0","text":"A"},{"id":"opt_1","text":"B"}],"correctOptionId":"opt_0","hint":"Apple starts with A!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find things that start with B: ball, book, bed, box!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐻"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  3,
  'C is for Cat',
  'Learn the letter C!',
  'C says ''kuh'' like in CAT! Meow!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"c1","prompt":"Which starts with C?","options":[{"id":"opt_0","text":"Cat","emoji":"🐱"},{"id":"opt_1","text":"Dog","emoji":"🐶"}],"correctOptionId":"opt_0","hint":"CAT starts with C!"},{"id":"c2","prompt":"Which starts with C?","options":[{"id":"opt_0","text":"Cupcake","emoji":"🧁"},{"id":"opt_1","text":"Apple","emoji":"🍎"}],"correctOptionId":"opt_0","hint":"CUPCAKE starts with C!"},{"id":"c3","prompt":"What letter does BEAR start with?","options":[{"id":"opt_0","text":"A"},{"id":"opt_1","text":"B"},{"id":"opt_2","text":"C"}],"correctOptionId":"opt_1","hint":"Bear starts with B!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Review A, B, C with objects. Sing \"A-B-C\" slowly.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐱"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  4,
  'Sing the ABCs!',
  'Sing the alphabet!',
  'Let''s sing the ABC song together!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"flash_card","cards":[{"id":"abc1","back":"Sing: A, B, C!","front":"🎵 A B C"},{"id":"abc2","back":"Sing: D, E, F, G!","front":"🎵 D E F G"},{"id":"abc3","back":"Sing: H, I, J, K!","front":"🎵 H I J K"},{"id":"abc4","back":"Sing: L, M, N, O, P!","front":"🎵 L M N O P"}],"prompt":"Flip each card to learn!"},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sing the full ABC song together! Repeat daily!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🎵"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  5,
  'What Starts With...?',
  'Match sounds to letters!',
  'I''ll say a word, you tell me the letter!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"sw1","prompt":"What does APPLE start with?","options":[{"id":"opt_0","text":"A"},{"id":"opt_1","text":"B"}],"correctOptionId":"opt_0","hint":"Apple starts with A!"},{"id":"sw2","prompt":"What does BALL start with?","options":[{"id":"opt_0","text":"A"},{"id":"opt_1","text":"B"}],"correctOptionId":"opt_1","hint":"Ball starts with B!"},{"id":"sw3","prompt":"What does CAR start with?","options":[{"id":"opt_0","text":"B"},{"id":"opt_1","text":"C"}],"correctOptionId":"opt_1","hint":"Car starts with C!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play I Spy with beginning sounds!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔤"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  6,
  'Rhyme Time!',
  'Words that sound the same!',
  'Cat and hat RHYME! They sound the same at the end!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"rh1","prompt":"What rhymes with CAT?","options":[{"id":"opt_0","text":"Hat","emoji":"🎩"},{"id":"opt_1","text":"Dog","emoji":"🐶"}],"correctOptionId":"opt_0","hint":"Cat and HAT rhyme!"},{"id":"rh2","prompt":"What rhymes with STAR?","options":[{"id":"opt_0","text":"Car","emoji":"🚗"},{"id":"opt_1","text":"Fish","emoji":"🐟"}],"correctOptionId":"opt_0","hint":"Star and CAR rhyme!"},{"id":"rh3","prompt":"What rhymes with DOG?","options":[{"id":"opt_0","text":"Frog","emoji":"🐸"},{"id":"opt_1","text":"Cat","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"Dog and FROG rhyme!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Make up silly rhymes! Read Dr. Seuss books.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🎤"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  7,
  'D, E, F',
  'Three more letters!',
  'D is for DOG! E is for ELEPHANT! F is for FISH!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"d1","prompt":"Which starts with D?","options":[{"id":"opt_0","text":"Dog","emoji":"🐶"},{"id":"opt_1","text":"Cat","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"DOG starts with D!"},{"id":"e1","prompt":"Which starts with E?","options":[{"id":"opt_0","text":"Apple","emoji":"🍎"},{"id":"opt_1","text":"Elephant","emoji":"🐘"}],"correctOptionId":"opt_1","hint":"ELEPHANT starts with E!"},{"id":"f1","prompt":"Which starts with F?","options":[{"id":"opt_0","text":"Fish","emoji":"🐟"},{"id":"opt_1","text":"Bear","emoji":"🐻"}],"correctOptionId":"opt_0","hint":"FISH starts with F!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Practice D, E, F with objects. Draw these letters together.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐶"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1) LIMIT 1),
  8,
  'Story Time with Chip',
  'Listen to a story!',
  'Once upon a time, there was a little bunny who loved to hop. The bunny hopped to the garden and found a big red flower!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"st1","prompt":"What animal was in the story?","options":[{"id":"opt_0","text":"Bunny","emoji":"🐰"},{"id":"opt_1","text":"Dog","emoji":"🐶"}],"correctOptionId":"opt_0","hint":"A little BUNNY!"},{"id":"st2","prompt":"Where did the bunny go?","options":[{"id":"opt_0","text":"Garden","emoji":"🌺"},{"id":"opt_1","text":"House","emoji":"🏠"}],"correctOptionId":"opt_0","hint":"The GARDEN!"},{"id":"st3","prompt":"What did the bunny find?","options":[{"id":"opt_0","text":"A flower","emoji":"🌺"},{"id":"opt_1","text":"An apple","emoji":"🍎"}],"correctOptionId":"opt_0","hint":"A big red FLOWER!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Read a picture book together. Ask \"What happened?\" after each page.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"📖"}'::jsonb
);

-- === MUSIC ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1) LIMIT 1),
  1,
  'Clap Clap Clap!',
  'Clap a steady beat!',
  'Let''s make music with our hands! CLAP! CLAP! CLAP!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"cl1","prompt":"What do we clap with?","options":[{"id":"opt_0","text":"Hands","emoji":"👏"},{"id":"opt_1","text":"Feet","emoji":"👣"}],"correctOptionId":"opt_0","hint":"We clap with our HANDS!"},{"id":"cl2","prompt":"Can you make music by clapping?","options":[{"id":"opt_0","text":"Yes!","emoji":"👏"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"Yes! Clapping is music!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Clap along to a favorite song together!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"👏"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1) LIMIT 1),
  2,
  'Loud and Quiet',
  'Learn loud and quiet!',
  'Some sounds are LOUD like a drum! Some are QUIET like a whisper!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"lq1","prompt":"Is a whisper LOUD or QUIET?","options":[{"id":"opt_0","text":"Quiet","emoji":"🤫"},{"id":"opt_1","text":"Loud","emoji":"🔊"}],"correctOptionId":"opt_0","hint":"A whisper is QUIET!"},{"id":"lq2","prompt":"Is a drum LOUD or QUIET?","options":[{"id":"opt_0","text":"Quiet","emoji":"🤫"},{"id":"opt_1","text":"Loud","emoji":"🥁"}],"correctOptionId":"opt_1","hint":"A drum is LOUD!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Make loud and quiet sounds. Stomp loudly, then tiptoe quietly.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔊"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1) LIMIT 1),
  3,
  'Animal Sounds Song',
  'Sing about animals!',
  'Old MacDonald had a farm! And on his farm he had a cow — MOO!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"as1","prompt":"What does the cow say in the song?","options":[{"id":"opt_0","text":"Moo!","emoji":"🐮"},{"id":"opt_1","text":"Woof!","emoji":"🐶"}],"correctOptionId":"opt_0","hint":"MOO!"},{"id":"as2","prompt":"What does the duck say?","options":[{"id":"opt_0","text":"Quack!","emoji":"🦆"},{"id":"opt_1","text":"Meow!","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"QUACK!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sing Old MacDonald together! Add new animals each time.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🎶"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1) LIMIT 1),
  4,
  'Fast and Slow',
  'Learn about tempo!',
  'Music can be FAST like a bunny or SLOW like a turtle!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"fs1","prompt":"A bunny hops...","options":[{"id":"opt_0","text":"Fast!","emoji":"🐰"},{"id":"opt_1","text":"Slow","emoji":"🐢"}],"correctOptionId":"opt_0","hint":"A bunny hops FAST!"},{"id":"fs2","prompt":"A turtle walks...","options":[{"id":"opt_0","text":"Fast","emoji":"🐰"},{"id":"opt_1","text":"Slow!","emoji":"🐢"}],"correctOptionId":"opt_1","hint":"A turtle walks SLOW!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Move to fast music then slow music!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐢"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1) LIMIT 1),
  5,
  'Dance Party!',
  'Move to music!',
  'DANCE PARTY! Wiggle, jump, spin!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"dp1","prompt":"What do you do at a dance party?","options":[{"id":"opt_0","text":"Dance!","emoji":"💃"},{"id":"opt_1","text":"Sleep","emoji":"😴"}],"correctOptionId":"opt_0","hint":"You DANCE!"},{"id":"dp2","prompt":"Can you dance to music?","options":[{"id":"opt_0","text":"Yes!","emoji":"💃"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"Everyone can dance!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Put on music and have a dance party together!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"💃"}'::jsonb
);

-- === PROBLEM SOLVING ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1) LIMIT 1),
  1,
  'Which One Is Different?',
  'Find the odd one out!',
  'One of these is DIFFERENT! Can you find it?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"od1","prompt":"Which is different?","options":[{"id":"opt_0","text":"🍎"},{"id":"opt_1","text":"🍎"},{"id":"opt_2","text":"🍌"}],"correctOptionId":"opt_2","hint":"The banana is different!"},{"id":"od2","prompt":"Which is different?","options":[{"id":"opt_0","text":"🐱"},{"id":"opt_1","text":"🐶"},{"id":"opt_2","text":"🐱"}],"correctOptionId":"opt_1","hint":"The dog is different!"},{"id":"od3","prompt":"Which is different?","options":[{"id":"opt_0","text":"🔴"},{"id":"opt_1","text":"🔴"},{"id":"opt_2","text":"🔵"}],"correctOptionId":"opt_2","hint":"The blue one is different!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Line up 3 toys where 2 match. Ask \"which is different?\"","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🤔"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1) LIMIT 1),
  2,
  'First, Then, Last',
  'Put things in order!',
  'FIRST wake up, THEN eat, LAST brush teeth!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"ftl1","prompt":"What do you do FIRST — eat or wake up?","options":[{"id":"opt_0","text":"Wake up","emoji":"🛏️"},{"id":"opt_1","text":"Eat","emoji":"🥣"}],"correctOptionId":"opt_0","hint":"WAKE UP first!"},{"id":"ftl2","prompt":"What comes LAST — brush teeth or wake up?","options":[{"id":"opt_0","text":"Wake up","emoji":"🛏️"},{"id":"opt_1","text":"Brush teeth","emoji":"🪥"}],"correctOptionId":"opt_1","hint":"Brushing teeth comes LAST!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Talk through daily routines in order.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"1️⃣"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1) LIMIT 1),
  3,
  'Sort by Color',
  'Group by color!',
  'SORTING means putting same things TOGETHER!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"sc1","prompt":"Where does 🍎 go?","options":[{"id":"opt_0","text":"Red group","emoji":"🔴"},{"id":"opt_1","text":"Blue group","emoji":"🔵"}],"correctOptionId":"opt_0","hint":"Apple is RED!"},{"id":"sc2","prompt":"Where does 🫐 go?","options":[{"id":"opt_0","text":"Red group","emoji":"🔴"},{"id":"opt_1","text":"Blue group","emoji":"🔵"}],"correctOptionId":"opt_1","hint":"Blueberry is BLUE!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sort real objects by color!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🗂️"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1) LIMIT 1),
  4,
  'What Comes Next?',
  'Simple patterns!',
  'Red, blue, red, blue... what comes NEXT?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"wn1","prompt":"🔴🔵🔴🔵🔴... Next?","options":[{"id":"opt_0","text":"Blue","emoji":"🔵"},{"id":"opt_1","text":"Red","emoji":"🔴"}],"correctOptionId":"opt_0","hint":"Red, blue, red, blue... BLUE!"},{"id":"wn2","prompt":"⭐🌙⭐🌙⭐... Next?","options":[{"id":"opt_0","text":"Star","emoji":"⭐"},{"id":"opt_1","text":"Moon","emoji":"🌙"}],"correctOptionId":"opt_1","hint":"Star, moon, star, moon... MOON!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Make patterns with toys! Ask \"What comes next?\"","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔁"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1) LIMIT 1),
  5,
  'Puzzle Time!',
  'Put pieces together!',
  'Puzzles are fun! Put pieces TOGETHER to make a picture!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"pz1","prompt":"What are puzzles made of?","options":[{"id":"opt_0","text":"Pieces","emoji":"🧩"},{"id":"opt_1","text":"Paint","emoji":"🎨"}],"correctOptionId":"opt_0","hint":"PIECES that fit together!"},{"id":"pz2","prompt":"What do you do with puzzle pieces?","options":[{"id":"opt_0","text":"Put them together!","emoji":"🧩"},{"id":"opt_1","text":"Throw them!","emoji":"🏈"}],"correctOptionId":"opt_0","hint":"Put them TOGETHER!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Do a simple 4-6 piece puzzle together!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🧩"}'::jsonb
);

-- === SOCIAL-EMOTIONAL ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1) LIMIT 1),
  1,
  'Happy Face!',
  'Learn about feeling HAPPY!',
  'When something nice happens, you feel HAPPY! What makes YOU happy?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"h1","prompt":"When you get a hug, you feel...","options":[{"id":"opt_0","text":"Happy!","emoji":"😊"},{"id":"opt_1","text":"Sad","emoji":"😢"}],"correctOptionId":"opt_0","hint":"Hugs make us HAPPY!"},{"id":"h2","prompt":"Show me your HAPPY face!","options":[{"id":"opt_0","text":"Smiling!","emoji":"😊"},{"id":"opt_1","text":"Let me try!","emoji":"😊"}],"correctOptionId":"opt_0","hint":"Big smile!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Talk about what makes each family member happy.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"😊"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1) LIMIT 1),
  2,
  'Sad Face',
  'Learn about feeling SAD!',
  'Sometimes we feel SAD. That''s okay! Everyone feels sad sometimes.',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"s1","prompt":"Is it okay to feel sad?","options":[{"id":"opt_0","text":"Yes!","emoji":"💙"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"All feelings are okay!"},{"id":"s2","prompt":"When sad, you can...","options":[{"id":"opt_0","text":"Tell someone","emoji":"🗣️"},{"id":"opt_1","text":"Keep it inside"}],"correctOptionId":"opt_0","hint":"TELL someone!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Talk about times you felt sad and what helped.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"😢"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1) LIMIT 1),
  3,
  'Take a Deep Breath!',
  'Calm down with breathing!',
  'Breathe in like smelling a flower... breathe out like blowing a candle!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"br1","prompt":"When upset, you can...","options":[{"id":"opt_0","text":"Deep breath!","emoji":"🌬️"},{"id":"opt_1","text":"Yell","emoji":"😤"}],"correctOptionId":"opt_0","hint":"DEEP BREATH!"},{"id":"br2","prompt":"Breathe in like smelling a...","options":[{"id":"opt_0","text":"Flower!","emoji":"🌸"},{"id":"opt_1","text":"Sock","emoji":"🧦"}],"correctOptionId":"opt_0","hint":"Smell the flower!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Practice \"smell the flower, blow the candle\" breathing. Do 3 deep breaths.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🌬️"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1) LIMIT 1),
  4,
  'Sharing Is Caring!',
  'Learn about sharing!',
  'SHARING means letting someone else have a turn!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"sh1a","prompt":"Friend wants your toy. What do you do?","options":[{"id":"opt_0","text":"Share!","emoji":"🤝"},{"id":"opt_1","text":"Hide it!","emoji":"🙈"}],"correctOptionId":"opt_0","hint":"SHARE! Take turns!"},{"id":"sh2a","prompt":"How does sharing make people feel?","options":[{"id":"opt_0","text":"Happy!","emoji":"😊"},{"id":"opt_1","text":"Sad","emoji":"😢"}],"correctOptionId":"opt_0","hint":"Sharing makes everyone HAPPY!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Practice sharing during snack time. Say \"Your turn!\" and \"My turn!\"","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🤝"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1) LIMIT 1),
  5,
  'Kind Words',
  'Say kind things!',
  'KIND WORDS make people feel good! Thank you! Great job! I like you!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"kw1","prompt":"Which is a KIND word?","options":[{"id":"opt_0","text":"Thank you!","emoji":"💖"},{"id":"opt_1","text":"Go away!","emoji":"😤"}],"correctOptionId":"opt_0","hint":"\"Thank you\" is KIND!"},{"id":"kw2","prompt":"Do kind words make people feel good?","options":[{"id":"opt_0","text":"Yes!","emoji":"💖"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"YES! Kind words make people HAPPY!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Say \"I love you,\" \"Thank you,\" \"Great job!\" to each family member.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"💖"}'::jsonb
);

-- === MATH ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  1,
  'One!',
  'Learn what ONE means.',
  'Hi friend! Today we learn about ONE! Hold up one finger!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"counting","questions":[{"id":"c1a","hint":"ONE apple!","emoji":"🍎","prompt":"How many apples?","correctCount":1,"displayCount":1},{"id":"c1b","hint":"ONE dog!","emoji":"🐶","prompt":"How many dogs?","correctCount":1,"displayCount":1},{"id":"c1c","hint":"ONE star!","emoji":"⭐","prompt":"How many stars?","correctCount":1,"displayCount":1}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find ONE of things around the house. Say \"ONE!\" each time.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"1️⃣"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  2,
  'One and Two!',
  'Count to two!',
  'You know ONE! Now let''s learn TWO! Hold up two fingers!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"counting","questions":[{"id":"c2a","hint":"ONE... TWO cats!","emoji":"🐱","prompt":"How many cats?","correctCount":2,"displayCount":2},{"id":"c2b","hint":"ONE... TWO hearts!","emoji":"❤️","prompt":"How many hearts?","correctCount":2,"displayCount":2},{"id":"c2c","hint":"Just ONE sun!","emoji":"☀️","prompt":"How many suns?","correctCount":1,"displayCount":1}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Practice ONE and TWO with toys and snacks.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"✌️"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  3,
  'Count to Three!',
  'Count 1, 2, 3!',
  'ONE... TWO... THREE! Let''s practice!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"counting","questions":[{"id":"c3a","hint":"ONE, TWO, THREE fish!","emoji":"🐟","prompt":"How many fish?","correctCount":3,"displayCount":3},{"id":"c3b","hint":"ONE, TWO birds!","emoji":"🐦","prompt":"How many birds?","correctCount":2,"displayCount":2},{"id":"c3c","hint":"ONE, TWO, THREE flowers!","emoji":"🌸","prompt":"How many flowers?","correctCount":3,"displayCount":3}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Count objects up to 3. Touch each one as you count.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"3️⃣"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  4,
  'Circle!',
  'Learn the circle shape!',
  'CIRCLES are round like a ball, like the sun, like a cookie!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"sh1","prompt":"Which is a circle?","options":[{"id":"opt_0","text":"⭕"},{"id":"opt_1","text":"⬛"}],"correctOptionId":"opt_0","hint":"The circle is round!"},{"id":"sh2","prompt":"Which is round?","options":[{"id":"opt_0","text":"🍪"},{"id":"opt_1","text":"📦"}],"correctOptionId":"opt_0","hint":"The cookie is round — a circle!"},{"id":"sh3","prompt":"Which is a circle?","options":[{"id":"opt_0","text":"🔺"},{"id":"opt_1","text":"🔵"}],"correctOptionId":"opt_1","hint":"The blue one is round!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a circle hunt! Find round things: plates, clocks, wheels.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"⭕"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  5,
  'Circles and Squares',
  'Two shapes!',
  'Circles are round. Squares have four equal sides and four corners!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"cs1","prompt":"What shape is a ball?","options":[{"id":"opt_0","text":"Circle","emoji":"⭕"},{"id":"opt_1","text":"Square","emoji":"⬛"}],"correctOptionId":"opt_0","hint":"A ball is round — a CIRCLE!"},{"id":"cs2","prompt":"Which one is a square?","options":[{"id":"opt_0","text":"Circle","emoji":"⭕"},{"id":"opt_1","text":"Square","emoji":"⬛"}],"correctOptionId":"opt_1","hint":"A square has 4 equal sides and 4 corners!"},{"id":"cs3","prompt":"What shape is a plate?","options":[{"id":"opt_0","text":"Circle","emoji":"⭕"},{"id":"opt_1","text":"Square","emoji":"⬛"}],"correctOptionId":"opt_0","hint":"A plate is round — a CIRCLE!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sort household items into circles and squares.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔲"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  6,
  'What Color? Red!',
  'Learn RED!',
  'RED like an apple! RED like a fire truck!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"r1","prompt":"Which is RED?","options":[{"id":"opt_0","text":"🍎"},{"id":"opt_1","text":"🍌"}],"correctOptionId":"opt_0","hint":"The apple is RED!"},{"id":"r2","prompt":"Which is RED?","options":[{"id":"opt_0","text":"🥦"},{"id":"opt_1","text":"🍓"}],"correctOptionId":"opt_1","hint":"The strawberry is RED!"},{"id":"r3","prompt":"Which is RED?","options":[{"id":"opt_0","text":"❤️"},{"id":"opt_1","text":"💙"}],"correctOptionId":"opt_0","hint":"The heart is RED!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a RED hunt around the room!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔴"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  7,
  'Red and Blue',
  'Two colors!',
  'You know RED! Now BLUE — like the sky and ocean!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"rb1","prompt":"What color is the sky?","options":[{"id":"opt_0","text":"Red","emoji":"🔴"},{"id":"opt_1","text":"Blue","emoji":"🔵"}],"correctOptionId":"opt_1","hint":"The sky is BLUE!"},{"id":"rb2","prompt":"What color is a fire truck?","options":[{"id":"opt_0","text":"Red","emoji":"🔴"},{"id":"opt_1","text":"Blue","emoji":"🔵"}],"correctOptionId":"opt_0","hint":"A fire truck is RED!"},{"id":"rb3","prompt":"What color is the ocean?","options":[{"id":"opt_0","text":"Red","emoji":"🔴"},{"id":"opt_1","text":"Blue","emoji":"🔵"}],"correctOptionId":"opt_1","hint":"The ocean is BLUE!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sort crayons or toys into RED and BLUE piles.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔵"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  8,
  'Big and Small',
  'Compare sizes!',
  'An elephant is BIG! A mouse is SMALL!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"bs1","prompt":"Which is BIGGER?","options":[{"id":"opt_0","text":"Elephant","emoji":"🐘"},{"id":"opt_1","text":"Mouse","emoji":"🐭"}],"correctOptionId":"opt_0","hint":"The elephant is BIG!"},{"id":"bs2","prompt":"Which is SMALLER?","options":[{"id":"opt_0","text":"House","emoji":"🏠"},{"id":"opt_1","text":"Teddy","emoji":"🧸"}],"correctOptionId":"opt_1","hint":"The teddy bear is SMALL!"},{"id":"bs3","prompt":"Which is BIGGER?","options":[{"id":"opt_0","text":"Car","emoji":"🚗"},{"id":"opt_1","text":"Bike","emoji":"🚲"}],"correctOptionId":"opt_0","hint":"The car is BIGGER!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Compare sizes of real objects around you.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐘"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  9,
  'Count to Five!',
  'Count 1-5!',
  'Let''s go to FIVE! Show me five fingers!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"counting","questions":[{"id":"c5a","hint":"ONE, TWO, THREE, FOUR!","emoji":"🦋","prompt":"How many butterflies?","correctCount":4,"displayCount":4},{"id":"c5b","hint":"ONE, TWO, THREE, FOUR, FIVE!","emoji":"⭐","prompt":"How many stars?","correctCount":5,"displayCount":5},{"id":"c5c","hint":"ONE, TWO, THREE!","emoji":"🍎","prompt":"How many apples?","correctCount":3,"displayCount":3}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Count fingers and toes! Count snacks before eating.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🖐️"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1) LIMIT 1),
  10,
  'Triangles!',
  'Three sides!',
  'TRIANGLE has THREE sides — like a slice of pizza!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"t1","prompt":"Which is a TRIANGLE?","options":[{"id":"opt_0","text":"🔺"},{"id":"opt_1","text":"⬛"}],"correctOptionId":"opt_0","hint":"The triangle has three sides!"},{"id":"t2","prompt":"How many sides does a triangle have?","options":[{"id":"opt_0","text":"Two"},{"id":"opt_1","text":"Three"}],"correctOptionId":"opt_1","hint":"THREE sides!"},{"id":"t3","prompt":"Which shape is ROUND?","options":[{"id":"opt_0","text":"Circle","emoji":"⭕"},{"id":"opt_1","text":"Triangle","emoji":"🔺"}],"correctOptionId":"opt_0","hint":"The circle is round!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find triangles: pizza slices, roof shapes, hangers.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔺"}'::jsonb
);

-- === SCIENCE ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1) LIMIT 1),
  1,
  'Look With Your Eyes!',
  'The sense of SIGHT!',
  'Your eyes help you SEE! Look around — what do you see?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"ey1","prompt":"What do you SEE with?","options":[{"id":"opt_0","text":"Eyes","emoji":"👀"},{"id":"opt_1","text":"Ears","emoji":"👂"}],"correctOptionId":"opt_0","hint":"You SEE with your EYES!"},{"id":"ey2","prompt":"Can you see colors?","options":[{"id":"opt_0","text":"Yes!","emoji":"👀"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"Yes! Your eyes see all the colors!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play \"I Spy\"!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"👀"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1) LIMIT 1),
  2,
  'Listen With Your Ears!',
  'The sense of HEARING!',
  'Shhh... listen! Your EARS help you hear sounds!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"ea1","prompt":"What do you HEAR with?","options":[{"id":"opt_0","text":"Ears","emoji":"👂"},{"id":"opt_1","text":"Eyes","emoji":"👀"}],"correctOptionId":"opt_0","hint":"You HEAR with your EARS!"},{"id":"ea2","prompt":"Can you hear music?","options":[{"id":"opt_0","text":"Yes!","emoji":"🎵"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"Yes! Your ears hear music!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Close eyes and listen for 30 seconds. What sounds do you hear?","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"👂"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1) LIMIT 1),
  3,
  'Animal Friends',
  'Animals and their sounds!',
  'A dog says WOOF! A cat says MEOW! A cow says MOO!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"an1","prompt":"What does a dog say?","options":[{"id":"opt_0","text":"Woof!","emoji":"🐶"},{"id":"opt_1","text":"Meow!","emoji":"🐱"}],"correctOptionId":"opt_0","hint":"WOOF!"},{"id":"an2","prompt":"What does a cat say?","options":[{"id":"opt_0","text":"Moo!","emoji":"🐮"},{"id":"opt_1","text":"Meow!","emoji":"🐱"}],"correctOptionId":"opt_1","hint":"MEOW!"},{"id":"an3","prompt":"What does a cow say?","options":[{"id":"opt_0","text":"Moo!","emoji":"🐮"},{"id":"opt_1","text":"Quack!","emoji":"🦆"}],"correctOptionId":"opt_0","hint":"MOO!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Make animal sounds together! Act like different animals.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🐾"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1) LIMIT 1),
  4,
  'Hot or Cold?',
  'Learn about temperature!',
  'The sun is HOT! Ice cream is COLD!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"hc1","prompt":"Is ice cream HOT or COLD?","options":[{"id":"opt_0","text":"Cold","emoji":"❄️"},{"id":"opt_1","text":"Hot","emoji":"🔥"}],"correctOptionId":"opt_0","hint":"Ice cream is COLD!"},{"id":"hc2","prompt":"Is the sun HOT or COLD?","options":[{"id":"opt_0","text":"Cold","emoji":"❄️"},{"id":"opt_1","text":"Hot","emoji":"☀️"}],"correctOptionId":"opt_1","hint":"The sun is HOT!"},{"id":"hc3","prompt":"Is snow HOT or COLD?","options":[{"id":"opt_0","text":"Cold","emoji":"❄️"},{"id":"opt_1","text":"Hot","emoji":"🔥"}],"correctOptionId":"opt_0","hint":"Snow is COLD!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Touch warm and cold things safely.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🌡️"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1) LIMIT 1),
  5,
  'Rainy Day, Sunny Day',
  'Learn about weather!',
  'When it''s SUNNY the sky is blue! When it''s RAINY we need an umbrella!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"w1","prompt":"When do you need an umbrella?","options":[{"id":"opt_0","text":"Rainy","emoji":"🌧️"},{"id":"opt_1","text":"Sunny","emoji":"☀️"}],"correctOptionId":"opt_0","hint":"You need an umbrella when it RAINS!"},{"id":"w2","prompt":"When can you play outside easily?","options":[{"id":"opt_0","text":"Sunny","emoji":"☀️"},{"id":"opt_1","text":"Rainy","emoji":"🌧️"}],"correctOptionId":"opt_0","hint":"Sunny days are great for playing!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Check weather together each morning.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🌤️"}'::jsonb
);

-- === CODING ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1) LIMIT 1),
  1,
  'Press the Button!',
  'Cause and effect!',
  'Press a button, something HAPPENS! Press a light switch — light turns on!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"pb1","prompt":"Press a light switch...","options":[{"id":"opt_0","text":"Light turns on!","emoji":"💡"},{"id":"opt_1","text":"Music plays","emoji":"🎵"}],"correctOptionId":"opt_0","hint":"The light turns ON!"},{"id":"pb2","prompt":"Press a doorbell...","options":[{"id":"opt_0","text":"Light turns on","emoji":"💡"},{"id":"opt_1","text":"It rings!","emoji":"🔔"}],"correctOptionId":"opt_1","hint":"The doorbell RINGS!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find buttons around the house! Press them and say what happens.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔘"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1) LIMIT 1),
  2,
  'First This, Then That',
  'Steps in order!',
  'FIRST wash hands, THEN eat. Order matters!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"ft1","prompt":"FIRST wash hands, THEN...","options":[{"id":"opt_0","text":"Eat!","emoji":"🍽️"},{"id":"opt_1","text":"Sleep","emoji":"🛏️"}],"correctOptionId":"opt_0","hint":"First wash, THEN eat!"},{"id":"ft2","prompt":"FIRST socks, THEN...","options":[{"id":"opt_0","text":"Shoes!","emoji":"👟"},{"id":"opt_1","text":"More socks","emoji":"🧦"}],"correctOptionId":"opt_0","hint":"Socks first, THEN shoes!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Give 2-step instructions. Celebrate when followed in order!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"👣"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1) LIMIT 1),
  3,
  'Chip Says!',
  'Follow instructions!',
  'Chip says... touch your nose! Chip says... clap!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"cs1a","prompt":"Chip says CLAP! Did you?","options":[{"id":"opt_0","text":"Yes!","emoji":"👏"},{"id":"opt_1","text":"Let me try!"}],"correctOptionId":"opt_0","hint":"Great clapping!"},{"id":"cs2a","prompt":"Chip says JUMP! Did you?","options":[{"id":"opt_0","text":"Yes!","emoji":"🦘"},{"id":"opt_1","text":"Let me try!"}],"correctOptionId":"opt_0","hint":"Awesome jumping!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play \"Chip Says\"! Take turns giving instructions.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🤖"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1) LIMIT 1),
  4,
  'Again and Again',
  'Learn about loops!',
  'Clap clap clap — that''s REPEATING! We call it a LOOP!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"lo1","prompt":"Clap clap clap — doing it again is a...","options":[{"id":"opt_0","text":"Loop!","emoji":"🔄"},{"id":"opt_1","text":"Stop","emoji":"🛑"}],"correctOptionId":"opt_0","hint":"Again and again is a LOOP!"},{"id":"lo2","prompt":"The sun rises every day. Is that a loop?","options":[{"id":"opt_0","text":"Yes!","emoji":"🔄"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"Yes! Every day — a LOOP!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find loops in daily life! Breathing, day/night, brushing teeth every day.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔄"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1) LIMIT 1),
  5,
  'Make It Happen!',
  'You are a coder!',
  'A CODER gives instructions to make things happen. You''re a coder!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"mi1","prompt":"A coder gives...","options":[{"id":"opt_0","text":"Instructions!","emoji":"📋"},{"id":"opt_1","text":"Hugs!","emoji":"🤗"}],"correctOptionId":"opt_0","hint":"INSTRUCTIONS!"},{"id":"mi2","prompt":"Are you a coder?","options":[{"id":"opt_0","text":"Yes!","emoji":"🌟"},{"id":"opt_1","text":"No"}],"correctOptionId":"opt_0","hint":"YES! You are a coder!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Celebrate! Ask \"What would YOU make if you could code anything?\"","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🌟"}'::jsonb
);

-- === ART ===

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1) LIMIT 1),
  1,
  'My Favorite Color!',
  'Explore colors!',
  'Colors are everywhere! What''s your favorite?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"flash_card","cards":[{"id":"fc1","back":"RED! Like an apple!","front":"🔴"},{"id":"fc2","back":"BLUE! Like the sky!","front":"🔵"},{"id":"fc3","back":"YELLOW! Like the sun!","front":"🟡"},{"id":"fc4","back":"GREEN! Like the grass!","front":"🟢"}],"prompt":"Flip each card to learn!"},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Ask \"What is your favorite color?\" Point to colors around the room.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🌈"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1) LIMIT 1),
  2,
  'Draw a Circle!',
  'Practice drawing!',
  'Go round and round with your finger!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"trace_shape","questions":[{"id":"tc1","shape":"circle","prompt":"Trace the circle!"},{"id":"tc2","shape":"circle","prompt":"Draw another circle!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Draw circles on paper. Turn them into faces!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"⭕"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1) LIMIT 1),
  3,
  'Color Scavenger Hunt',
  'Find colors!',
  'Can you find something RED? BLUE? YELLOW?',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"ch1","prompt":"Can you find something RED?","options":[{"id":"opt_0","text":"Yes!","emoji":"🔴"},{"id":"opt_1","text":"Still looking..."}],"correctOptionId":"opt_0","hint":"Apples and fire trucks are red!"},{"id":"ch2","prompt":"Can you find something BLUE?","options":[{"id":"opt_0","text":"Yes!","emoji":"🔵"},{"id":"opt_1","text":"Still looking..."}],"correctOptionId":"opt_0","hint":"The sky and water are blue!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Walk around finding colors together!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🔍"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1) LIMIT 1),
  4,
  'Smooth and Rough',
  'Feel textures!',
  'SMOOTH like glass, ROUGH like sandpaper!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"multiple_choice","questions":[{"id":"sr1","prompt":"Is glass SMOOTH or ROUGH?","options":[{"id":"opt_0","text":"Smooth","emoji":"✨"},{"id":"opt_1","text":"Rough","emoji":"🪨"}],"correctOptionId":"opt_0","hint":"Glass is SMOOTH!"},{"id":"sr2","prompt":"Is a rock SMOOTH or ROUGH?","options":[{"id":"opt_0","text":"Smooth","emoji":"✨"},{"id":"opt_1","text":"Rough","emoji":"🪨"}],"correctOptionId":"opt_1","hint":"A rock is ROUGH!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Touch different textures together!","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🤚"}'::jsonb
);

INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE band = 0 AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1) LIMIT 1),
  5,
  'Free Draw Time!',
  'Draw anything!',
  'Draw ANYTHING! A house, a flower, a silly monster!',
  NULL, NULL, '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  '{}'::uuid[],
  'interactive',
  false, ARRAY[]::text[], true, true,
  5,
  '{"voice_led":true,"activities":[{"type":"trace_shape","questions":[{"id":"fd1","shape":"circle","prompt":"Warm up — draw a circle!"},{"id":"fd2","shape":"square","prompt":"Now draw a square!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Free drawing time! Ask them to tell you about their drawing.","completionPrompt":"Did you complete the activity together?"}],"hero_emoji":"🎨"}'::jsonb
);
