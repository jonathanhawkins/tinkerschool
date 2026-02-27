-- =============================================================================
-- TinkerSchool -- Fix Pre-K Seed Data (Band 0, Ages 3-5)
-- =============================================================================
-- Replaces broken migrations 058-064 which used hardcoded UUIDs that don't
-- match production. This migration uses dynamic lookups by slug/name.
--
-- Creates:
--   1. Social-Emotional subject (if missing)
--   2. 48 Pre-K skills (8 subjects x 6-8 skills)
--   3. 8 Pre-K modules (one per subject)
--   4. 10 Pre-K badges
--   5. 40 Pre-K lessons (8 subjects x 5 lessons)
--
-- All inserts use ON CONFLICT DO NOTHING for idempotency.
-- All FK references use dynamic subqueries instead of hardcoded UUIDs.
-- =============================================================================


-- =========================================================================
-- STEP 1: Create Social-Emotional Subject (if not exists)
-- =========================================================================
INSERT INTO public.subjects (slug, name, display_name, color, icon, sort_order)
VALUES ('social_emotional', 'Feelings & Friends', 'Social-Emotional', '#F472B6', 'heart-handshake', 8)
ON CONFLICT (slug) DO NOTHING;


-- =========================================================================
-- STEP 2: Pre-K Skills (48 total)
-- Uses (subject_id, slug) unique constraint for ON CONFLICT
-- =========================================================================

-- Math Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_rote_counting_10',      'Rote Counting to 10',       'Count aloud from 1 to 10 in sequence',                               'HSELOF: Math-1',     1),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_one_to_one_counting',   'One-to-One Counting',       'Touch and count objects up to 5 (age 3) or up to 10 (age 4)',        'HSELOF: Math-2',     2),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_number_recognition_5',  'Number Recognition 1-5',    'Recognize written numerals 1 through 5',                             'HSELOF: Math-3',     3),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_shape_recognition',     'Shape Recognition',         'Identify circles, squares, and triangles',                           'CC.K.G.A.2 readiness', 4),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_size_comparison',       'Size Comparison',           'Compare big/small, tall/short, long/short',                          'HSELOF: Math-6',     5),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_simple_patterns',       'Simple Patterns',           'Identify and extend AB patterns',                                    'HSELOF: Math-7',     6),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_sorting_attribute',     'Sorting by Attribute',      'Sort objects by one attribute (color, shape, or size)',               'HSELOF: Math-5',     7),
  ((SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1), 'prek_more_and_less',         'More and Less',             'Compare groups to identify which has more or fewer',                 'HSELOF: Math-4',     8)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Reading Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_book_awareness',          'Book Awareness',              'Hold a book correctly; understand front/back, top/bottom',                'HSELOF: Lit-1',   1),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_letter_recognition',      'Letter Recognition (A-Z)',    'Recognize uppercase letters by sight',                                    'HSELOF: Lit-3',   2),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_beginning_sounds',        'Beginning Sound Awareness',   'Identify the first sound in a word',                                      'HSELOF: Lit-4',   3),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_rhyme_recognition',       'Rhyme Recognition',           'Identify words that rhyme',                                               'HSELOF: Lit-5',   4),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_vocabulary_building',     'Vocabulary Building',         'Learn new words through context and pictures',                            'HSELOF: Lang-3',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_listening_comprehension', 'Listening Comprehension',     'Answer simple questions about a read-aloud story',                        'HSELOF: Lit-2',   6),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_syllable_awareness',      'Syllable Awareness',          'Clap out syllables in familiar words',                                    'HSELOF: Lit-6',   7),
  ((SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1), 'prek_name_recognition',        'Name Recognition',            'Recognize own written name',                                              'HSELOF: Lit-7',   8)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Science Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_using_senses',         'Using Senses',              'Describe objects using the five senses',                                 'NGSS: PS-ETS1 readiness', 1),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_nature_observation',   'Nature Observation',        'Observe and describe plants, animals, and weather',                      'HSELOF: Sci-1',           2),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_cause_and_effect',     'Cause and Effect',          'Predict what happens when you do something',                             'HSELOF: Sci-2',           3),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_living_nonliving',     'Living vs. Non-Living',     'Sort things into living and non-living',                                  'HSELOF: Sci-3',           4),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_weather_awareness',    'Weather Awareness',         'Describe today''s weather',                                              'NGSS: K-ESS2 readiness',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_animal_sounds_homes',  'Animal Sounds and Homes',   'Match animals to their sounds and habitats',                             'HSELOF: Sci-4',           6),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_sink_or_float',        'Sink or Float',             'Predict and test whether objects sink or float',                         'HSELOF: Sci-5',           7),
  ((SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1), 'prek_plant_growth',         'Plant Growth',              'Understand that plants need water and light to grow',                    'NGSS: K-LS1 readiness',   8)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Music Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_singing_along',       'Singing Along',         'Sing simple songs and nursery rhymes',                   'NCAS: Cr1 readiness',  1),
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_loud_and_soft',       'Loud and Soft',         'Distinguish between loud and quiet sounds',              'NCAS: Re7 readiness',  2),
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_fast_and_slow',       'Fast and Slow',         'Distinguish between fast and slow rhythms',              'NCAS: Re7 readiness',  3),
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_keeping_a_beat',      'Keeping a Beat',        'Clap, stomp, or tap along to a steady beat',             'NCAS: Pr4 readiness',  4),
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_sound_exploration',   'Sound Exploration',     'Identify everyday sounds',                               'NCAS: Re7 readiness',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1), 'prek_musical_movement',    'Musical Movement',      'Move body to music',                                     'NCAS: Pr6 readiness',  6)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Art Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_color_naming',        'Color Naming',          'Identify and name primary and secondary colors',                    'NCAS: Cr1 readiness',  1),
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_shape_drawing',       'Shape Drawing',         'Draw or trace circles, lines, and simple shapes',                   'NCAS: Cr2 readiness',  2),
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_color_mixing',        'Color Mixing',          'Discover what happens when two colors mix',                         'NCAS: Cr2 readiness',  3),
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_texture_awareness',   'Texture Awareness',     'Describe textures (smooth, rough, bumpy, soft)',                    'NCAS: Re7 readiness',  4),
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_free_drawing',        'Free Drawing',          'Express ideas through open-ended drawing',                          'NCAS: Cr1 readiness',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1), 'prek_pattern_making',      'Pattern Making',        'Create simple visual patterns with stamps or shapes',               'NCAS: Cr2 readiness',  6)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Problem Solving Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_shape_sorting',         'Shape Sorting',           'Sort objects by shape, then by color, then by size',              'ISTE: CT readiness',  1),
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_simple_puzzles',        'Simple Puzzles',          'Complete 4 to 8 piece puzzles',                                   'ISTE: CT readiness',  2),
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_ab_patterns',           'AB Patterns',             'Recognize and extend alternating patterns',                       'ISTE: CT readiness',  3),
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_what_comes_next',       'What Comes Next',         'Predict the next item in a sequence',                             'ISTE: CT readiness',  4),
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_odd_one_out',           'Odd One Out',             'Identify which item does not belong in a group',                  'ISTE: CT readiness',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1), 'prek_following_directions',  'Following Directions',    'Follow 2-step verbal instructions in order',                      'ISTE: CT readiness',  6)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Coding Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_sequencing',             'Sequencing',                  'Put 2 to 3 picture cards in the right order',                  'CSTA: 1A readiness',  1),
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_cause_and_effect',       'Cause and Effect',            'Predict what a button press will do',                          'CSTA: 1A readiness',  2),
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_simple_directions',      'Simple Directions',           'Give and follow directional instructions',                     'CSTA: 1A readiness',  3),
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_repeating_patterns',     'Repeating Patterns',          'Identify when something repeats',                              'CSTA: 1A readiness',  4),
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_input_output',           'Matching Input to Output',    'Connect an action to its result',                              'CSTA: 1A readiness',  5),
  ((SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1), 'prek_problem_decomposition',  'Problem Decomposition',       'Break a task into 2 simple steps',                             'CSTA: 1A readiness',  6)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Social-Emotional Pre-K Skills
INSERT INTO public.skills (subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'naming_emotions',              'Naming Emotions',                  'Identify and name basic emotions (happy, sad, angry, scared, surprised)',                     'CASEL: Self-Awareness',     1),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'recognizing_emotions_others',  'Recognizing Emotions in Others',   'Look at faces and body language to tell how someone feels',                                   'CASEL: Social Awareness',   2),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'calm_down_strategies',         'Calm-Down Strategies',             'Practice breathing, counting to 5, or squeeze and release to manage big feelings',           'CASEL: Self-Management',    3),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'taking_turns',                 'Taking Turns',                     'Practice waiting and sharing through structured games',                                       'CASEL: Relationship Skills', 4),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'asking_for_help',              'Asking for Help',                  'Know when and how to ask a grown-up or friend for help',                                      'CASEL: Relationship Skills', 5),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'kindness_actions',             'Kindness Actions',                 'Identify kind actions like sharing, comforting, and helping',                                 'CASEL: Social Awareness',   6),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'following_routines',           'Following Routines',               'Understand and follow simple daily routines',                                                 'CASEL: Self-Management',    7),
  ((SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1), 'expressing_needs',             'Expressing Needs',                 'Use words to say what you need instead of crying or acting out',                              'CASEL: Self-Management',    8)
ON CONFLICT (subject_id, slug) DO NOTHING;


-- =========================================================================
-- STEP 3: Pre-K Modules (8 total, one per subject)
-- Uses (band, subject_id, order_num) unique constraint for ON CONFLICT
-- =========================================================================
INSERT INTO public.modules (band, order_num, title, description, icon, subject_id)
VALUES
  (0, 1, 'Counting Corner',    'Count, sort, and discover shapes through play.',                'calculator',      (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  (0, 1, 'Story Time',         'Explore letters, rhymes, and stories together.',                'book-open',       (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  (0, 1, 'Wonder Lab',         'Observe nature and discover how things work.',                  'flask-conical',   (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  (0, 1, 'Music Garden',       'Sing, clap, and move to the beat.',                            'music',           (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  (0, 1, 'Color Play',         'Explore colors, shapes, and textures through art.',             'palette',         (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  (0, 1, 'Think & Play',       'Sort, match, and solve simple puzzles.',                        'puzzle',          (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  (0, 1, 'Step by Step',       'Learn sequencing and cause-and-effect through play.',           'code',            (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  (0, 1, 'Feelings & Friends', 'Name emotions, practice kindness, and learn to share.',         'heart-handshake', (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1))
ON CONFLICT (band, subject_id, order_num) DO NOTHING;


-- =========================================================================
-- STEP 4: Pre-K Badges (10 total)
-- Uses (name) unique constraint for ON CONFLICT
-- =========================================================================

-- Milestone badges
INSERT INTO public.badges (name, description, icon, criteria)
VALUES
  ('First Steps!',   'You finished your very first lesson! Every big adventure starts with one small step.', 'footprints', '{"type": "lessons_completed", "threshold": 1, "band": 0, "color": "#F97316"}'::jsonb),
  ('Seedling Star',  'You explored every Pre-K adventure! You are growing so fast!',                         'sprout',     '{"type": "modules_completed", "threshold": 8, "band": 0, "color": "#22C55E"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Subject starter badges (criteria references module by title lookup)
INSERT INTO public.badges (name, description, icon, criteria)
VALUES
  ('Counting Star',   'You finished Counting Corner! You can count on yourself!',               'calculator',      jsonb_build_object('type', 'module_completed', 'module_title', 'Counting Corner',    'band', 0, 'color', '#3B82F6')),
  ('Story Starter',   'You finished Story Time! Every great reader starts here!',               'book-open',       jsonb_build_object('type', 'module_completed', 'module_title', 'Story Time',         'band', 0, 'color', '#22C55E')),
  ('Little Scientist', 'You finished Wonder Lab! You asked great questions!',                   'flask-conical',   jsonb_build_object('type', 'module_completed', 'module_title', 'Wonder Lab',         'band', 0, 'color', '#F97316')),
  ('Music Maker',      'You finished Music Garden! You have a wonderful sense of rhythm!',      'music',           jsonb_build_object('type', 'module_completed', 'module_title', 'Music Garden',       'band', 0, 'color', '#A855F7')),
  ('Color Explorer',   'You finished Color Play! What a creative artist you are!',              'palette',         jsonb_build_object('type', 'module_completed', 'module_title', 'Color Play',         'band', 0, 'color', '#EC4899')),
  ('Puzzle Pro',       'You finished Think & Play! You are a super problem solver!',            'puzzle',          jsonb_build_object('type', 'module_completed', 'module_title', 'Think & Play',       'band', 0, 'color', '#EAB308')),
  ('Code Sprout',      'You finished Step by Step! You are learning to think like a coder!',    'code',            jsonb_build_object('type', 'module_completed', 'module_title', 'Step by Step',       'band', 0, 'color', '#14B8A6')),
  ('Feelings Friend',  'You finished Feelings & Friends! You are a kind and caring friend!',    'heart-handshake', jsonb_build_object('type', 'module_completed', 'module_title', 'Feelings & Friends', 'band', 0, 'color', '#F472B6'))
ON CONFLICT (name) DO NOTHING;


-- =========================================================================
-- STEP 5: Pre-K Lessons
-- Uses (module_id, order_num) unique constraint for ON CONFLICT
-- =========================================================================

-- *************************************************************************
-- MATH LESSONS (5 lessons in "Counting Corner")
-- *************************************************************************

-- Math Lesson 1: How Many Friends?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Counting Corner' AND band = 0),
  1,
  'How Many Friends?',
  'Count cute animals with Chip! Tap each one to see how many there are.',
  'Hi there, little friend! I''m Chip! Look at all these animal friends who came to play! Can you count them with me? Tap each one!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug IN ('prek_rote_counting_10', 'prek_one_to_one_counting') AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"counting","questions":[{"id":"count-bunnies","prompt":"How many bunnies do you see?","emoji":"\ud83d\udc30","correctCount":2,"displayCount":2,"hint":"Tap each bunny! Count with me: 1... 2!"},{"id":"count-puppies","prompt":"How many puppies are playing?","emoji":"\ud83d\udc36","correctCount":3,"displayCount":3,"hint":"Point to each puppy and count: 1, 2, 3!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Gather stuffed animals and count them together! Start with 3 animals and count them one by one, touching each as you count. Add one more and count again!","parentTip":"Encourage your child to touch each stuffed animal as they count. This builds one-to-one correspondence \u2014 the idea that each object gets exactly one number.","completionPrompt":"Did you count your stuffed animals together?","illustration":"\ud83e\uddf8"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Math Lesson 2: Shapes Are Everywhere!
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Counting Corner' AND band = 0),
  2,
  'Shapes Are Everywhere!',
  'Find shapes hiding behind clouds! Circles, squares, triangles, and more.',
  'Whoa! Chip sees something hiding behind those fluffy clouds! I think they''re SHAPES! Can you tap the clouds to find out what''s hiding? Shapes are all around us!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_shape_recognition' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"tap_and_reveal","questions":[{"id":"find-shapes","prompt":"Tap the clouds to find the shapes hiding!","mode":"explore","gridCols":2,"items":[{"id":"shape-circle","coverEmoji":"\u2601\ufe0f","revealEmoji":"\ud83d\udfe2","revealLabel":"Circle"},{"id":"shape-square","coverEmoji":"\u2601\ufe0f","revealEmoji":"\ud83d\udfe7","revealLabel":"Square"},{"id":"shape-triangle","coverEmoji":"\u2601\ufe0f","revealEmoji":"\ud83d\udd3a","revealLabel":"Triangle"},{"id":"shape-star","coverEmoji":"\u2601\ufe0f","revealEmoji":"\u2b50","revealLabel":"Star"}]}]},{"type":"multiple_choice","questions":[{"id":"shape-mc-1","prompt":"Which shape is round like a ball?","promptEmoji":"\u26bd","options":[{"id":"a","text":"Circle","emoji":"\ud83d\udfe2"},{"id":"b","text":"Square","emoji":"\ud83d\udfe7"}],"correctOptionId":"a","hint":"A ball is round \u2014 which shape is round too?"},{"id":"shape-mc-2","prompt":"Which shape has 3 sides?","promptEmoji":"\ud83d\udd3a","options":[{"id":"a","text":"Square","emoji":"\ud83d\udfe7"},{"id":"b","text":"Triangle","emoji":"\ud83d\udd3a"}],"correctOptionId":"b","hint":"Count the sides: 1, 2, 3! That''s a triangle."}],"shuffleOptions":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Math Lesson 3: Big and Small
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Counting Corner' AND band = 0),
  3,
  'Big and Small',
  'Sort the animals! Which ones are big and which ones are small?',
  'Hey friend! Chip needs your help! These animals got all mixed up. Can you sort them? Put the BIG animals in one group and the SMALL animals in the other!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_size_comparison' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"drag_to_sort","questions":[{"id":"sort-big-small","prompt":"Sort the animals! Drag each one to the right group.","buckets":[{"id":"big","label":"Big","emoji":"\ud83d\udc18"},{"id":"small","label":"Small","emoji":"\ud83d\udc1d"}],"items":[{"id":"elephant","label":"Elephant","emoji":"\ud83d\udc18","correctBucket":"big"},{"id":"mouse","label":"Mouse","emoji":"\ud83d\udc2d","correctBucket":"small"},{"id":"bear","label":"Bear","emoji":"\ud83d\udc3b","correctBucket":"big"},{"id":"ant","label":"Ant","emoji":"\ud83d\udc1c","correctBucket":"small"}],"hint":"An elephant is really big! A mouse is really small!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a size hunt together! Find something bigger than your hand and something smaller than your hand. Then find the biggest thing in the room and the smallest!","parentTip":"Use comparison language: bigger, smaller, taller, shorter. Ask your child to explain why one thing is bigger than another.","completionPrompt":"Did you find big and small things around you?","illustration":"\ud83d\udd0d"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Math Lesson 4: Red Blue Red Blue
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Counting Corner' AND band = 0),
  4,
  'Red Blue Red Blue',
  'Discover patterns! What color comes next?',
  'Look at this, friend! Chip found a pattern: red, blue, red, blue. It keeps going! But oh no \u2014 one piece is missing! Can you figure out what comes next?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_simple_patterns' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"pattern-rb","prompt":"Put the colors in order to finish the pattern: Red, Blue, ???","items":[{"id":"red","text":"Red","emoji":"\ud83d\udfe5","correctPosition":1},{"id":"blue","text":"Blue","emoji":"\ud83d\udfe6","correctPosition":2},{"id":"red2","text":"Red","emoji":"\ud83d\udfe5","correctPosition":3}],"hint":"The pattern goes: red, blue, red, blue. What comes after blue?"}]},{"type":"flash_card","prompt":"Let''s learn our colors! Tap to flip each card.","cards":[{"id":"color-red","front":{"text":"What color is this?","emoji":"\ud83d\udfe5"},"back":{"text":"Red!","emoji":"\ud83d\udfe5"},"color":"#EF4444"},{"id":"color-blue","front":{"text":"What color is this?","emoji":"\ud83d\udfe6"},"back":{"text":"Blue!","emoji":"\ud83d\udfe6"},"color":"#3B82F6"},{"id":"color-yellow","front":{"text":"What color is this?","emoji":"\ud83d\udfe8"},"back":{"text":"Yellow!","emoji":"\ud83d\udfe8"},"color":"#EAB308"},{"id":"color-green","front":{"text":"What color is this?","emoji":"\ud83d\udfe9"},"back":{"text":"Green!","emoji":"\ud83d\udfe9"},"color":"#22C55E"}],"shuffleCards":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Math Lesson 5: Count and Match
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Counting Corner' AND band = 0),
  5,
  'Count and Match',
  'Count objects and match numbers to groups of dots!',
  'Great job counting, friend! Now Chip has a super fun challenge \u2014 can you count the stars and hearts, and then match numbers to the right group of dots?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug IN ('prek_number_recognition_5', 'prek_one_to_one_counting') AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Math' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"counting","questions":[{"id":"count-stars","prompt":"How many stars do you see?","emoji":"\u2b50","correctCount":4,"displayCount":4,"hint":"Tap each star and count: 1, 2, 3, 4!"},{"id":"count-hearts","prompt":"How many hearts are there?","emoji":"\u2764\ufe0f","correctCount":5,"displayCount":5,"hint":"Count each heart: 1, 2, 3, 4, 5!"}]},{"type":"matching_pairs","prompt":"Match each number to the right group of dots!","pairs":[{"id":"match-1","left":{"id":"num-1","text":"1","emoji":"1\ufe0f\u20e3"},"right":{"id":"dots-1","text":"\u25cf","emoji":"\u26ab"}},{"id":"match-2","left":{"id":"num-2","text":"2","emoji":"2\ufe0f\u20e3"},"right":{"id":"dots-2","text":"\u25cf\u25cf","emoji":"\u26ab\u26ab"}},{"id":"match-3","left":{"id":"num-3","text":"3","emoji":"3\ufe0f\u20e3"},"right":{"id":"dots-3","text":"\u25cf\u25cf\u25cf","emoji":"\u26ab\u26ab\u26ab"}}],"hint":"Count the dots! How many dots match the number?"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- SOCIAL-EMOTIONAL LESSONS (5 lessons in "Feelings & Friends")
-- *************************************************************************

-- SEL Lesson 1: Happy, Sad, Angry
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Feelings & Friends' AND band = 0),
  1,
  'Happy, Sad, Angry',
  'Learn about big feelings! How do you feel when different things happen?',
  'Hi friend! Chip wants to talk about FEELINGS today! Sometimes we feel happy, sometimes sad, sometimes angry \u2014 and that''s totally okay! Let''s figure out which feeling goes with each story.',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'naming_emotions' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"emotion_picker","questions":[{"id":"ep-present","scenario":"You just got a special present for your birthday!","scenarioEmoji":"\ud83c\udf81","validEmotions":["happy"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]},{"id":"ep-toy-broke","scenario":"Oh no! Your favorite toy just broke.","scenarioEmoji":"\ud83e\uddf8","validEmotions":["sad"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]},{"id":"ep-snack-taken","scenario":"Someone took your snack without asking!","scenarioEmoji":"\ud83c\udf6a","validEmotions":["angry"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]}]},{"type":"flash_card","prompt":"Let''s learn the feeling faces! Tap to flip each card.","cards":[{"id":"face-happy","front":{"text":"What face is this?","emoji":"\ud83d\ude0a"},"back":{"text":"Happy!","emoji":"\ud83d\ude0a"},"color":"#22C55E"},{"id":"face-sad","front":{"text":"What face is this?","emoji":"\ud83d\ude22"},"back":{"text":"Sad","emoji":"\ud83d\ude22"},"color":"#3B82F6"},{"id":"face-angry","front":{"text":"What face is this?","emoji":"\ud83d\ude20"},"back":{"text":"Angry","emoji":"\ud83d\ude20"},"color":"#EF4444"},{"id":"face-scared","front":{"text":"What face is this?","emoji":"\ud83d\ude28"},"back":{"text":"Scared","emoji":"\ud83d\ude28"},"color":"#A855F7"}],"shuffleCards":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- SEL Lesson 2: How Does Teddy Feel?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Feelings & Friends' AND band = 0),
  2,
  'How Does Teddy Feel?',
  'Look at Teddy Bear and figure out how he feels! Can you read his emotions?',
  'This is Chip''s friend, Teddy Bear! Teddy has lots of feelings just like you. Let''s look at what happens to Teddy and figure out how he feels!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'recognizing_emotions_others' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"emotion_picker","questions":[{"id":"teddy-fell","scenario":"Teddy fell down and bumped his knee.","scenarioEmoji":"\ud83e\uddf8","validEmotions":["sad"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"scared","emoji":"\ud83d\ude28","label":"Scared"}]},{"id":"teddy-hug","scenario":"Teddy got a big warm hug from his friend!","scenarioEmoji":"\ud83e\uddf8","validEmotions":["happy"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]},{"id":"teddy-loud","scenario":"Teddy heard a very loud noise! BOOM!","scenarioEmoji":"\ud83d\udca5","validEmotions":["scared"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"scared","emoji":"\ud83d\ude28","label":"Scared"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]},{"id":"teddy-share","scenario":"Teddy''s friend shared a yummy cookie with him!","scenarioEmoji":"\ud83c\udf6a","validEmotions":["happy"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Make faces together! Take turns making a happy face, a sad face, a surprised face, and an angry face. Can your child guess which feeling you are showing?","parentTip":"Point out facial clues: ''See how my eyebrows go up when I''m surprised?'' or ''My mouth goes down when I''m sad.'' This builds emotional literacy.","completionPrompt":"Did you make faces and guess feelings together?","illustration":"\ud83d\ude04"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- SEL Lesson 3: Breathing Like a Bunny
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Feelings & Friends' AND band = 0),
  3,
  'Breathing Like a Bunny',
  'Learn a special trick to calm down when you have big feelings!',
  'Sometimes we get really BIG feelings \u2014 and that''s okay! Chip learned a super cool trick from a bunny friend: special breathing! Let''s try it together.',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'calm_down_strategies' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"parent_activity","prompt":"Bunny Breathing!","instructions":"Practice bunny breathing together! Smell the flower (breathe in slowly through your nose)... Blow out the candle (breathe out slowly through your mouth). Do it 3 times together! Make it fun \u2014 pretend to hold a flower and a candle.","parentTip":"Model the breathing yourself first. Young children learn calming strategies best by copying a trusted adult. You can also try ''hot cocoa breathing'' \u2014 smell the cocoa, blow to cool it down!","completionPrompt":"Did you practice bunny breathing 3 times together?","illustration":"\ud83d\udc30"},{"type":"multiple_choice","questions":[{"id":"calm-down-1","prompt":"When we feel angry, what can we do to feel better?","promptEmoji":"\ud83d\ude24","options":[{"id":"a","text":"Take a deep breath","emoji":"\ud83c\udf2c\ufe0f"},{"id":"b","text":"Throw a toy","emoji":"\ud83e\uddf8"}],"correctOptionId":"a","hint":"Remember bunny breathing! Smelling the flower and blowing out the candle helps us feel calm."},{"id":"calm-down-2","prompt":"What can you do when you feel scared?","promptEmoji":"\ud83d\ude28","options":[{"id":"a","text":"Tell a grown-up","emoji":"\ud83e\uddd1"},{"id":"b","text":"Hide and cry alone","emoji":"\ud83d\ude2d"}],"correctOptionId":"a","hint":"It''s always okay to ask a grown-up for help when you feel scared!"}],"shuffleOptions":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- SEL Lesson 4: Taking Turns
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Feelings & Friends' AND band = 0),
  4,
  'Taking Turns',
  'Learn how to take turns with friends! First me, then you!',
  'Chip loves playing games with friends! But wait \u2014 everyone wants to go first! That''s where TAKING TURNS helps. Let''s learn the steps!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'taking_turns' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"turns-order","prompt":"Put the turn-taking steps in the right order!","items":[{"id":"wait","text":"Wait for your turn","emoji":"\u23f3","correctPosition":1},{"id":"your-turn","text":"It''s your turn!","emoji":"\ud83c\udf1f","correctPosition":2},{"id":"friend-turn","text":"Now it''s your friend''s turn!","emoji":"\ud83e\udd1d","correctPosition":3}],"hint":"First we wait, then we play, then our friend plays!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play a simple game together and practice turn-taking! Try rolling a ball back and forth, stacking blocks one at a time, or playing with a toy. Say ''Your turn!'' and ''My turn!'' each time.","parentTip":"Keep the turns short so your child doesn''t have to wait too long. Praise the waiting: ''Great job waiting for your turn!'' rather than only praising the doing.","completionPrompt":"Did you practice taking turns together?","illustration":"\ud83c\udfb2"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- SEL Lesson 5: Kind Hands
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Feelings & Friends' AND band = 0),
  5,
  'Kind Hands',
  'Discover kind things you can do! Sharing, helping, and hugging make everyone happy.',
  'Chip thinks being kind is AMAZING! Kind hands help, share, and give hugs. Let''s find the kind actions hiding in this picture!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'kindness_actions' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Social-Emotional' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"tap_and_reveal","questions":[{"id":"find-kind","prompt":"Tap to reveal the pictures! Find the kind actions!","mode":"find","targetPrompt":"Find all the kind things you can do!","gridCols":3,"items":[{"id":"sharing","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83e\udd1d","revealLabel":"Sharing","isTarget":true},{"id":"sleeping","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83d\ude34","revealLabel":"Sleeping","isTarget":false},{"id":"helping","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83e\uddf9","revealLabel":"Helping","isTarget":true},{"id":"eating","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83c\udf54","revealLabel":"Eating","isTarget":false},{"id":"hugging","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83e\udd17","revealLabel":"Hugging","isTarget":true},{"id":"reading","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83d\udcda","revealLabel":"Reading","isTarget":false}]}]},{"type":"emotion_picker","questions":[{"id":"kind-feel-1","scenario":"You helped your friend pick up their crayons that fell on the floor.","scenarioEmoji":"\ud83d\udd8d\ufe0f","validEmotions":["happy","grateful"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"grateful","emoji":"\ud83e\udd70","label":"Grateful"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"angry","emoji":"\ud83d\ude20","label":"Angry"}]},{"id":"kind-feel-2","scenario":"You shared your favorite toy with your friend who didn''t have one.","scenarioEmoji":"\ud83e\uddf8","validEmotions":["happy","grateful"],"options":[{"emotion":"happy","emoji":"\ud83d\ude0a","label":"Happy"},{"emotion":"grateful","emoji":"\ud83e\udd70","label":"Grateful"},{"emotion":"sad","emoji":"\ud83d\ude22","label":"Sad"},{"emotion":"scared","emoji":"\ud83d\ude28","label":"Scared"}]}]}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- READING LESSONS (5 lessons in "Story Time")
-- *************************************************************************

-- Reading Lesson 1: Letters All Around
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Story Time' AND band = 0),
  1,
  'Letters All Around',
  'Meet the first five letters of the alphabet! Flip the cards to learn A, B, C, D, and E.',
  'Hi friend! Chip loves letters! Letters are everywhere — on signs, books, and cereal boxes! Let''s flip some cards and learn the first five letters together!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_letter_recognition' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"flash_card","prompt":"Flip each card to learn the letter! Say its name out loud!","cards":[{"id":"letter-a","front":{"text":"What letter is this?","emoji":"\ud83c\udd70\ufe0f"},"back":{"text":"A! A is for Apple! \ud83c\udf4e","emoji":"\ud83c\udf4e"},"color":"#EF4444"},{"id":"letter-b","front":{"text":"What letter is this?","emoji":"\ud83c\udd71\ufe0f"},"back":{"text":"B! B is for Bear! \ud83d\udc3b","emoji":"\ud83d\udc3b"},"color":"#3B82F6"},{"id":"letter-c","front":{"text":"What letter is this?","emoji":"\u00a9\ufe0f"},"back":{"text":"C! C is for Cat! \ud83d\udc31","emoji":"\ud83d\udc31"},"color":"#22C55E"},{"id":"letter-d","front":{"text":"Can you name this letter?"},"back":{"text":"D! D is for Dog! \ud83d\udc36","emoji":"\ud83d\udc36"},"color":"#A855F7"},{"id":"letter-e","front":{"text":"One more! What letter?"},"back":{"text":"E! E is for Elephant! \ud83d\udc18","emoji":"\ud83d\udc18"},"color":"#F97316"}],"shuffleCards":false},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a letter hunt! Walk around your home and find the letter A on a cereal box, book, or sign. Then look for B and C too! Point to each one and say the letter name together.","parentTip":"Focus on uppercase letters first \u2014 they are easier for little ones to recognize. Celebrate each letter found! You can make it a game: ''I spy the letter A!''","completionPrompt":"Did you find letters A, B, and C around the house?","illustration":"\ud83d\udd24"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Reading Lesson 2: Rhyme Time
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Story Time' AND band = 0),
  2,
  'Rhyme Time',
  'Match words that rhyme! Cat and hat, star and car — can you hear which words sound the same?',
  'Listen up, friend! Chip has a game — it''s all about words that sound the SAME at the end! Cat and hat both end with -at! Let''s find more rhyming pairs!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_rhyme_recognition' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"matching_pairs","prompt":"Match the words that rhyme! They sound the same at the end.","pairs":[{"id":"rhyme-cat-hat","left":{"id":"cat","text":"Cat","emoji":"\ud83d\udc31"},"right":{"id":"hat","text":"Hat","emoji":"\ud83c\udfa9"}},{"id":"rhyme-star-car","left":{"id":"star","text":"Star","emoji":"\u2b50"},"right":{"id":"car","text":"Car","emoji":"\ud83d\ude97"}},{"id":"rhyme-fish-dish","left":{"id":"fish","text":"Fish","emoji":"\ud83d\udc1f"},"right":{"id":"dish","text":"Dish","emoji":"\ud83c\udf7d\ufe0f"}}],"hint":"Listen to the end of each word. Cat ends with -at. Which other word ends with -at?"},{"type":"listen_and_find","questions":[{"id":"rhyme-listen-1","prompt":"Which word rhymes with ''ball''?","spokenText":"Ball! Which word rhymes with ball? They sound the same at the end!","correctOptionId":"wall","options":[{"id":"wall","emoji":"\ud83e\uddf1","label":"Wall"},{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"},{"id":"cup","emoji":"\ud83e\udd64","label":"Cup"}]},{"id":"rhyme-listen-2","prompt":"Which word rhymes with ''bug''?","spokenText":"Bug! Which word rhymes with bug?","correctOptionId":"rug","options":[{"id":"sun","emoji":"\u2600\ufe0f","label":"Sun"},{"id":"rug","emoji":"\ud83d\udfe4","label":"Rug"},{"id":"bird","emoji":"\ud83d\udc26","label":"Bird"}]}]}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Reading Lesson 3: What Sound?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Story Time' AND band = 0),
  3,
  'What Sound?',
  'Listen for the first sound in a word! What starts with /b/? What starts with /s/?',
  'Chip has super listening ears today! Every word starts with a special sound. Ball starts with /b/! Sun starts with /s/! Let''s listen carefully and find the right one!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_beginning_sounds' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"listen_and_find","questions":[{"id":"sound-b","prompt":"What starts with the /b/ sound?","spokenText":"Buh! Buh! What starts with the /b/ sound? Listen: /b/ /b/ ball!","correctOptionId":"ball","options":[{"id":"ball","emoji":"\u26bd","label":"Ball"},{"id":"cat","emoji":"\ud83d\udc31","label":"Cat"},{"id":"sun","emoji":"\u2600\ufe0f","label":"Sun"},{"id":"fish","emoji":"\ud83d\udc1f","label":"Fish"}]},{"id":"sound-s","prompt":"What starts with the /s/ sound?","spokenText":"Ssss! Ssss! What starts with the /s/ sound? Listen: /s/ /s/ sun!","correctOptionId":"sun","options":[{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"},{"id":"sun","emoji":"\u2600\ufe0f","label":"Sun"},{"id":"hat","emoji":"\ud83c\udfa9","label":"Hat"},{"id":"tree","emoji":"\ud83c\udf33","label":"Tree"}]},{"id":"sound-m","prompt":"What starts with the /m/ sound?","spokenText":"Mmm! Mmm! What starts with the /m/ sound? Listen: /m/ /m/ moon!","correctOptionId":"moon","options":[{"id":"car","emoji":"\ud83d\ude97","label":"Car"},{"id":"book","emoji":"\ud83d\udcda","label":"Book"},{"id":"moon","emoji":"\ud83c\udf19","label":"Moon"},{"id":"pen","emoji":"\ud83d\udd8a\ufe0f","label":"Pen"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play the /b/ game! Walk around and find things that start with the B sound: ball, book, banana, bed, bear, button! Say each word slowly and emphasize the first sound: /b/ /b/ ball!","parentTip":"Use the letter SOUND, not the letter NAME. Say /b/ (like the start of ''ball''), not ''bee.'' This phonemic awareness is the foundation of reading.","completionPrompt":"Did you find things that start with the /b/ sound?","illustration":"\ud83d\udd0a"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Reading Lesson 4: Trace Your Letters
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Story Time' AND band = 0),
  4,
  'Trace Your Letters',
  'Practice tracing letters with your finger! Then learn five more letters: F, G, H, I, and J.',
  'Time to draw letters, friend! Use your finger to trace along the dotted lines. Then Chip has five MORE letters for you to learn! Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_letter_recognition' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"trace_shape","questions":[{"id":"trace-a","prompt":"Trace the letter A!","shape":"A","strokeColor":"#22C55E","traceColor":"#F97316"},{"id":"trace-b","prompt":"Trace the letter B!","shape":"B","strokeColor":"#3B82F6","traceColor":"#F97316"},{"id":"trace-c","prompt":"Trace the letter C!","shape":"C","strokeColor":"#A855F7","traceColor":"#F97316"}]},{"type":"flash_card","prompt":"Five more letters! Flip each card to learn them!","cards":[{"id":"letter-f","front":{"text":"What letter is this?"},"back":{"text":"F! F is for Fish! \ud83d\udc1f","emoji":"\ud83d\udc1f"},"color":"#3B82F6"},{"id":"letter-g","front":{"text":"What letter is this?"},"back":{"text":"G! G is for Grapes! \ud83c\udf47","emoji":"\ud83c\udf47"},"color":"#A855F7"},{"id":"letter-h","front":{"text":"What letter is this?"},"back":{"text":"H! H is for House! \ud83c\udfe0","emoji":"\ud83c\udfe0"},"color":"#EF4444"},{"id":"letter-i","front":{"text":"What letter is this?"},"back":{"text":"I! I is for Ice cream! \ud83c\udf66","emoji":"\ud83c\udf66"},"color":"#EC4899"},{"id":"letter-j","front":{"text":"What letter is this?"},"back":{"text":"J! J is for Jellyfish! \ud83e\udeb4","emoji":"\ud83e\udeb4"},"color":"#14B8A6"}],"shuffleCards":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Reading Lesson 5: Story Questions
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Story Time' AND band = 0),
  5,
  'Story Questions',
  'Listen to a short story and answer questions about it! Where did the bunny go?',
  'Chip loves story time! Let me tell you a little story, and then you answer some questions about it. Ready? Let''s listen carefully!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_listening_comprehension' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Reading' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"multiple_choice","questions":[{"id":"story-bunny","prompt":"The bunny hopped to the garden. Where did the bunny go?","promptEmoji":"\ud83d\udc30","options":[{"id":"garden","text":"The garden","emoji":"\ud83c\udf3b"},{"id":"store","text":"The store","emoji":"\ud83c\udfea"}],"correctOptionId":"garden","hint":"Listen again: The bunny hopped to the GARDEN."},{"id":"story-bear","prompt":"The bear ate honey and fell asleep. What did the bear eat?","promptEmoji":"\ud83d\udc3b","options":[{"id":"pizza","text":"Pizza","emoji":"\ud83c\udf55"},{"id":"honey","text":"Honey","emoji":"\ud83c\udf6f"}],"correctOptionId":"honey","hint":"The bear ate something sweet \u2014 honey!"},{"id":"story-bird","prompt":"The bird sang a song in the tree. Where was the bird?","promptEmoji":"\ud83d\udc26","options":[{"id":"water","text":"In the water","emoji":"\ud83c\udf0a"},{"id":"tree","text":"In the tree","emoji":"\ud83c\udf33"}],"correctOptionId":"tree","hint":"The bird sang a song in the... tree!"}],"shuffleOptions":false},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Read a favorite book together. After reading, ask your child simple questions: Who was in the story? What happened? Where did they go? Let your child point to the pictures for clues!","parentTip":"Asking ''who, what, where'' questions builds comprehension. Don''t worry about ''right'' answers \u2014 the goal is getting your child to think about the story. Praise any answer that shows they were listening!","completionPrompt":"Did you read a book and talk about the story together?","illustration":"\ud83d\udcd6"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- SCIENCE LESSONS (5 lessons in "Wonder Lab")
-- *************************************************************************

-- Science Lesson 1: Animal Sounds
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Wonder Lab' AND band = 0),
  1,
  'Animal Sounds',
  'Hear an animal sound and find which animal makes it! Moo, meow, woof, quack!',
  'Chip hears something! Is that a cow? A duck? Animals make all kinds of sounds! Listen carefully and tap the animal that makes each sound. Let''s go!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_animal_sounds_homes' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"listen_and_find","questions":[{"id":"sound-cow","prompt":"Which animal says MOO?","spokenText":"Mooooo! Which animal says moo?","correctOptionId":"cow","options":[{"id":"cow","emoji":"\ud83d\udc04","label":"Cow"},{"id":"cat","emoji":"\ud83d\udc31","label":"Cat"},{"id":"duck","emoji":"\ud83e\udd86","label":"Duck"}]},{"id":"sound-cat","prompt":"Which animal says MEOW?","spokenText":"Meow! Meow! Which animal says meow?","correctOptionId":"cat","options":[{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"},{"id":"cat","emoji":"\ud83d\udc31","label":"Cat"},{"id":"cow","emoji":"\ud83d\udc04","label":"Cow"}]},{"id":"sound-dog","prompt":"Which animal says WOOF?","spokenText":"Woof! Woof woof! Which animal says woof?","correctOptionId":"dog","options":[{"id":"duck","emoji":"\ud83e\udd86","label":"Duck"},{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"},{"id":"cat","emoji":"\ud83d\udc31","label":"Cat"}]},{"id":"sound-duck","prompt":"Which animal says QUACK?","spokenText":"Quack quack! Which animal says quack?","correctOptionId":"duck","options":[{"id":"cow","emoji":"\ud83d\udc04","label":"Cow"},{"id":"duck","emoji":"\ud83e\udd86","label":"Duck"},{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Look out the window or go outside! What animals can you see or hear? A bird singing? A dog barking? A squirrel chattering? Name the animals and try to make their sounds together!","parentTip":"If you can''t go outside, flip through a picture book of animals or watch a short nature video. Pause and ask ''What sound does this animal make?'' before revealing it.","completionPrompt":"Did you find animals to see or hear?","illustration":"\ud83d\udc3e"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Science Lesson 2: What's the Weather?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Wonder Lab' AND band = 0),
  2,
  'What''s the Weather?',
  'Is it sunny, rainy, or snowy? Learn about weather and match it to the right clothes!',
  'Chip is looking outside! What''s the weather like today? Is the sun shining? Are there clouds? Let''s learn about different kinds of weather and what to wear!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_weather_awareness' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"multiple_choice","questions":[{"id":"weather-sunny","prompt":"The sun is bright and the sky is blue. What''s the weather?","promptEmoji":"\u2600\ufe0f","options":[{"id":"sunny","text":"Sunny","emoji":"\u2600\ufe0f"},{"id":"rainy","text":"Rainy","emoji":"\ud83c\udf27\ufe0f"},{"id":"snowy","text":"Snowy","emoji":"\u2744\ufe0f"}],"correctOptionId":"sunny","hint":"When the sun is shining bright, we call it a sunny day!"},{"id":"weather-rainy","prompt":"Water is falling from the clouds. What''s the weather?","promptEmoji":"\ud83c\udf27\ufe0f","options":[{"id":"sunny","text":"Sunny","emoji":"\u2600\ufe0f"},{"id":"rainy","text":"Rainy","emoji":"\ud83c\udf27\ufe0f"},{"id":"snowy","text":"Snowy","emoji":"\u2744\ufe0f"}],"correctOptionId":"rainy","hint":"Water falling from the clouds is called rain!"},{"id":"weather-snowy","prompt":"White fluffy flakes are falling and everything is covered in white. What''s the weather?","promptEmoji":"\u2744\ufe0f","options":[{"id":"sunny","text":"Sunny","emoji":"\u2600\ufe0f"},{"id":"rainy","text":"Rainy","emoji":"\ud83c\udf27\ufe0f"},{"id":"snowy","text":"Snowy","emoji":"\u2744\ufe0f"}],"correctOptionId":"snowy","hint":"White fluffy flakes are snowflakes! It''s snowy!"}],"shuffleOptions":false},{"type":"matching_pairs","prompt":"Match the weather to what you should wear!","pairs":[{"id":"weather-rain-gear","left":{"id":"rain","text":"Rain","emoji":"\ud83c\udf27\ufe0f"},"right":{"id":"umbrella","text":"Umbrella","emoji":"\u2602\ufe0f"}},{"id":"weather-sun-gear","left":{"id":"sun","text":"Sunny","emoji":"\u2600\ufe0f"},"right":{"id":"sunglasses","text":"Sunglasses","emoji":"\ud83d\udd76\ufe0f"}},{"id":"weather-snow-gear","left":{"id":"snow","text":"Snow","emoji":"\u2744\ufe0f"},"right":{"id":"mittens","text":"Mittens","emoji":"\ud83e\udde4"}}],"hint":"When it rains, we need an umbrella! When it snows, we need mittens to stay warm!"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Science Lesson 3: Push and Pull
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Wonder Lab' AND band = 0),
  3,
  'Push and Pull',
  'What happens when you push or pull? Tap objects to find out! A ball rolls, a swing moves, a door opens!',
  'Chip is curious! What happens when you PUSH something? What happens when you PULL something? Let''s tap each thing and see what it does!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_cause_and_effect' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"tap_and_reveal","questions":[{"id":"push-pull-explore","prompt":"Tap each object to see what happens when you push or pull it!","mode":"explore","gridCols":3,"items":[{"id":"ball","coverEmoji":"\u26bd","revealEmoji":"\ud83c\udfc3","revealLabel":"Push the ball \u2014 it rolls!"},{"id":"swing","coverEmoji":"\ud83e\udea2","revealEmoji":"\ud83c\udfa0","revealLabel":"Pull the swing \u2014 it moves!"},{"id":"door","coverEmoji":"\ud83d\udeaa","revealEmoji":"\ud83d\udeb6","revealLabel":"Push the door \u2014 it opens!"},{"id":"wagon","coverEmoji":"\ud83d\uded2","revealEmoji":"\ud83c\udfce\ufe0f","revealLabel":"Pull the wagon \u2014 it follows you!"},{"id":"drawer","coverEmoji":"\ud83d\uddc4\ufe0f","revealEmoji":"\ud83d\udce6","revealLabel":"Pull the drawer \u2014 it slides out!"},{"id":"toy-car","coverEmoji":"\ud83d\ude97","revealEmoji":"\ud83d\udca8","revealLabel":"Push the car \u2014 it zooms away!"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Find 3 things you can push and 3 things you can pull! Try pushing a ball, a toy car, and a door. Then try pulling a drawer, a wagon, and a blanket. Talk about what happens each time!","parentTip":"Use the words ''push'' and ''pull'' as your child does each action. Ask: ''What happened when you pushed the ball?'' This builds cause-and-effect thinking.","completionPrompt":"Did you find things to push and pull?","illustration":"\ud83d\udcaa"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Science Lesson 4: My Five Senses
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Wonder Lab' AND band = 0),
  4,
  'My Five Senses',
  'Sort things by the sense you use! Do you see it, hear it, or smell it?',
  'Chip has five super powers — and so do you! Eyes to SEE, ears to HEAR, a nose to SMELL, hands to TOUCH, and a tongue to TASTE! Let''s sort these things by which sense you use!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_using_senses' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"drag_to_sort","questions":[{"id":"senses-sort","prompt":"Sort these things! Do you use your eyes, ears, or nose?","buckets":[{"id":"eyes","label":"Eyes (See)","emoji":"\ud83d\udc40"},{"id":"ears","label":"Ears (Hear)","emoji":"\ud83d\udc42"},{"id":"nose","label":"Nose (Smell)","emoji":"\ud83d\udc43"}],"items":[{"id":"rainbow","label":"Rainbow","emoji":"\ud83c\udf08","correctBucket":"eyes"},{"id":"music","label":"Music","emoji":"\ud83c\udfb5","correctBucket":"ears"},{"id":"flower","label":"Flower","emoji":"\ud83c\udf38","correctBucket":"nose"},{"id":"book","label":"Book","emoji":"\ud83d\udcd6","correctBucket":"eyes"},{"id":"bird-song","label":"Bird Song","emoji":"\ud83d\udc26","correctBucket":"ears"},{"id":"cookie","label":"Cookie","emoji":"\ud83c\udf6a","correctBucket":"nose"}],"hint":"You SEE a rainbow with your eyes. You HEAR music with your ears. You SMELL a flower with your nose!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a senses walk! Walk around the house or outside and take turns naming things: What can you SEE? What can you HEAR? What can you SMELL? What can you TOUCH? Count how many things you find for each sense!","parentTip":"Encourage descriptive words: ''The grass feels soft,'' ''The bird sounds chirpy,'' ''The flower smells sweet.'' This builds vocabulary AND science observation skills at the same time.","completionPrompt":"Did you go on a senses walk together?","illustration":"\ud83c\udf0d"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Science Lesson 5: Living or Not?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Wonder Lab' AND band = 0),
  5,
  'Living or Not?',
  'Is it alive? Sort things into Living and Not Living! Dogs grow, rocks don''t!',
  'Chip has a big question: is that thing ALIVE? Living things grow, eat, and move on their own. A dog is alive! A rock is not. Let''s sort them together!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_living_nonliving' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Science' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"drag_to_sort","questions":[{"id":"living-sort","prompt":"Sort these into Living and Not Living!","buckets":[{"id":"living","label":"Living","emoji":"\ud83c\udf31"},{"id":"not-living","label":"Not Living","emoji":"\ud83e\udea8"}],"items":[{"id":"dog","label":"Dog","emoji":"\ud83d\udc36","correctBucket":"living"},{"id":"rock","label":"Rock","emoji":"\ud83e\udea8","correctBucket":"not-living"},{"id":"tree","label":"Tree","emoji":"\ud83c\udf33","correctBucket":"living"},{"id":"car","label":"Car","emoji":"\ud83d\ude97","correctBucket":"not-living"},{"id":"flower","label":"Flower","emoji":"\ud83c\udf38","correctBucket":"living"},{"id":"ball","label":"Ball","emoji":"\u26bd","correctBucket":"not-living"}],"hint":"Living things grow and need food and water. A dog grows, a tree grows \u2014 they are alive! A rock and a car do not grow."}]},{"type":"tap_and_reveal","questions":[{"id":"find-living","prompt":"Find all the living things hiding in the garden!","mode":"find","targetPrompt":"Find all the living things!","gridCols":3,"items":[{"id":"butterfly","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83e\udd8b","revealLabel":"Butterfly \u2014 living!","isTarget":true},{"id":"bench","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83e\ude91","revealLabel":"Bench \u2014 not living","isTarget":false},{"id":"ladybug","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83d\udc1e","revealLabel":"Ladybug \u2014 living!","isTarget":true},{"id":"watering-can","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83d\udebf","revealLabel":"Watering can \u2014 not living","isTarget":false},{"id":"sunflower","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83c\udf3b","revealLabel":"Sunflower \u2014 living!","isTarget":true},{"id":"garden-gnome","coverEmoji":"\ud83c\udf3f","revealEmoji":"\ud83d\uddff","revealLabel":"Garden gnome \u2014 not living","isTarget":false}]}]}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- CODING LESSONS (5 lessons in "Step by Step")
-- *************************************************************************

-- Coding Lesson 1: First, Then, Last
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Step by Step' AND band = 0),
  1,
  'First, Then, Last',
  'Put picture cards in order! What do you do first, then, and last?',
  'Chip does things in order every day! First wake up, then brush teeth, then eat breakfast! Let''s practice putting things in the right order!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_sequencing' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"morning-routine","prompt":"Put the morning routine in order! What comes first?","items":[{"id":"wake-up","text":"Wake up","emoji":"\ud83c\udf05","correctPosition":1},{"id":"brush-teeth","text":"Brush teeth","emoji":"\ud83e\udea5","correctPosition":2},{"id":"eat-breakfast","text":"Eat breakfast","emoji":"\ud83e\udd63","correctPosition":3}],"hint":"Think about your morning! What do you do first when you open your eyes?"},{"id":"plant-seed","prompt":"How do you grow a plant? Put the steps in order!","items":[{"id":"dig","text":"Dig a hole","emoji":"\ud83d\udd73\ufe0f","correctPosition":1},{"id":"seed","text":"Put in a seed","emoji":"\ud83c\udf31","correctPosition":2},{"id":"water","text":"Water it","emoji":"\ud83d\udca7","correctPosition":3}],"hint":"First you need a hole, then you put the seed in, then you give it water!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Practice sequencing! Act out getting dressed together: first socks, then shoes, then coat! What happens if you try to put on shoes before socks? Talk about why order matters!","parentTip":"Sequencing is the foundation of computational thinking. Use ''first, then, last'' language throughout the day: ''First we wash hands, then we eat, last we clean up.''","completionPrompt":"Did you practice putting things in order together?","illustration":"\ud83d\udc63"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Coding Lesson 2: What Happens Next?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Step by Step' AND band = 0),
  2,
  'What Happens Next?',
  'Tap buttons to see what each one does! Then predict what will happen!',
  'Look at all these buttons! Chip is so curious \u2014 what does each one do? Let''s tap them and find out! Then YOU get to guess what will happen!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_cause_and_effect' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"tap_and_reveal","questions":[{"id":"buttons-explore","prompt":"Tap each button to see what it does!","mode":"explore","gridCols":3,"items":[{"id":"red-btn","coverEmoji":"\ud83d\udd34","revealEmoji":"\ud83d\udd0a","revealLabel":"Red button makes a sound!"},{"id":"blue-btn","coverEmoji":"\ud83d\udd35","revealEmoji":"\ud83d\udca1","revealLabel":"Blue button turns on a light!"},{"id":"green-btn","coverEmoji":"\ud83d\udfe2","revealEmoji":"\ud83c\udf00","revealLabel":"Green button makes it spin!"}]}]},{"type":"multiple_choice","questions":[{"id":"predict-red","prompt":"If you press the red button, what happens?","promptEmoji":"\ud83d\udd34","options":[{"id":"sound","text":"It makes a sound","emoji":"\ud83d\udd0a"},{"id":"light","text":"It turns on a light","emoji":"\ud83d\udca1"}],"correctOptionId":"sound","hint":"Remember what happened when you tapped the red button?"},{"id":"predict-blue","prompt":"If you press the blue button, what happens?","promptEmoji":"\ud83d\udd35","options":[{"id":"spin","text":"It spins","emoji":"\ud83c\udf00"},{"id":"light","text":"It turns on a light","emoji":"\ud83d\udca1"}],"correctOptionId":"light","hint":"Think back \u2014 the blue button made something bright appear!"},{"id":"predict-green","prompt":"If you press the green button, what happens?","promptEmoji":"\ud83d\udfe2","options":[{"id":"sound","text":"It makes a sound","emoji":"\ud83d\udd0a"},{"id":"spin","text":"It spins","emoji":"\ud83c\udf00"}],"correctOptionId":"spin","hint":"The green button made something go round and round!"}],"shuffleOptions":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Coding Lesson 3: Follow the Path
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Step by Step' AND band = 0),
  3,
  'Follow the Path',
  'Help Chip get to the treasure! Put the direction steps in the right order.',
  'Chip sees a treasure chest but doesn''t know how to get there! Can you put the directions in order so Chip can follow the path? Go forward, turn, and stop!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_simple_directions' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"path-treasure","prompt":"Put the directions in order to help Chip reach the treasure!","items":[{"id":"forward","text":"Go forward","emoji":"\u2b06\ufe0f","correctPosition":1},{"id":"turn","text":"Turn right","emoji":"\u27a1\ufe0f","correctPosition":2},{"id":"stop","text":"Stop at the treasure!","emoji":"\ud83c\udfc6","correctPosition":3}],"hint":"First Chip walks forward, then turns, then stops at the treasure!"},{"id":"path-home","prompt":"Help the cat get home! Put the steps in order.","items":[{"id":"walk","text":"Walk forward","emoji":"\ud83d\udc31","correctPosition":1},{"id":"turn-left","text":"Turn left","emoji":"\u2b05\ufe0f","correctPosition":2},{"id":"arrive","text":"Arrive home!","emoji":"\ud83c\udfe0","correctPosition":3}],"hint":"The cat walks, then turns, then arrives at the house!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play Robot! Give your child 2 directions: ''Walk forward. Turn around.'' They follow your instructions like a robot! Then switch \u2014 they give YOU directions. Start simple and add more steps as they get comfortable!","parentTip":"This is ''unplugged coding'' \u2014 giving step-by-step instructions is the same thing as writing a program! Use words like ''forward,'' ''turn,'' ''stop.'' Praise precise directions.","completionPrompt":"Did you play the Robot direction game together?","illustration":"\ud83e\udd16"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Coding Lesson 4: Again and Again
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Step by Step' AND band = 0),
  4,
  'Again and Again',
  'Discover repeating patterns! Clap, stomp, clap, stomp \u2014 what comes next?',
  'Chip found a pattern! Clap, stomp, clap, stomp. It keeps repeating! In coding, when something repeats, we call it a LOOP. Let''s find the pattern and finish it!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_repeating_patterns' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"pattern-clap-stomp","prompt":"The pattern is: clap, stomp, clap, stomp, ???. What comes next? Put them in order!","items":[{"id":"clap1","text":"Clap","emoji":"\ud83d\udc4f","correctPosition":1},{"id":"stomp1","text":"Stomp","emoji":"\ud83e\uddb6","correctPosition":2},{"id":"clap2","text":"Clap","emoji":"\ud83d\udc4f","correctPosition":3}],"hint":"The pattern goes clap, stomp, clap, stomp. After stomp comes... clap again!"},{"id":"pattern-sun-moon","prompt":"Day, night, day, night, ???. What comes next?","items":[{"id":"day1","text":"Day","emoji":"\u2600\ufe0f","correctPosition":1},{"id":"night1","text":"Night","emoji":"\ud83c\udf19","correctPosition":2},{"id":"day2","text":"Day","emoji":"\u2600\ufe0f","correctPosition":3}],"hint":"Day and night keep going back and forth. After night comes... day!"}]},{"type":"flash_card","prompt":"Look at these patterns! Can you say what comes next before flipping?","cards":[{"id":"pattern-ab-1","front":{"text":"\ud83d\udd34\ud83d\udd35\ud83d\udd34\ud83d\udd35 ???","emoji":"\u2753"},"back":{"text":"\ud83d\udd34! The pattern repeats!","emoji":"\ud83d\udd34"},"color":"#EF4444"},{"id":"pattern-ab-2","front":{"text":"\u2b50\ud83c\udf19\u2b50\ud83c\udf19 ???","emoji":"\u2753"},"back":{"text":"\u2b50! Star and moon repeat!","emoji":"\u2b50"},"color":"#EAB308"},{"id":"pattern-ab-3","front":{"text":"\ud83c\udf4e\ud83c\udf4c\ud83c\udf4e\ud83c\udf4c ???","emoji":"\u2753"},"back":{"text":"\ud83c\udf4e! Apple and banana repeat!","emoji":"\ud83c\udf4e"},"color":"#22C55E"},{"id":"pattern-aab","front":{"text":"\ud83d\udc4f\ud83d\udc4f\ud83e\uddb6\ud83d\udc4f\ud83d\udc4f\ud83e\uddb6 ???","emoji":"\u2753"},"back":{"text":"\ud83d\udc4f! Clap clap stomp repeats!","emoji":"\ud83d\udc4f"},"color":"#A855F7"}],"shuffleCards":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Coding Lesson 5: Button Magic
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Step by Step' AND band = 0),
  5,
  'Button Magic',
  'Match each action to what happens! Press a button and the light turns on. Cause and effect!',
  'Everything in coding has a cause and effect! When you press a button, something happens! When you clap, music plays! Let''s match each action to its result!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_input_output' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Coding' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"matching_pairs","prompt":"Match each action to what happens!","pairs":[{"id":"io-button-light","left":{"id":"press-button","text":"Press button","emoji":"\ud83d\udd18"},"right":{"id":"light-on","text":"Light turns on","emoji":"\ud83d\udca1"}},{"id":"io-clap-music","left":{"id":"clap-hands","text":"Clap hands","emoji":"\ud83d\udc4f"},"right":{"id":"music-plays","text":"Music plays","emoji":"\ud83c\udfb5"}},{"id":"io-turn-knob","left":{"id":"turn-knob","text":"Turn knob","emoji":"\ud83c\udf9b\ufe0f"},"right":{"id":"door-opens","text":"Door opens","emoji":"\ud83d\udeaa"}}],"hint":"Think about what happens when you DO something. Pressing a button is the action \u2014 the light turning on is what happens!"},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Explore cause and effect around the house! Press light switches, ring doorbells, turn on water faucets, squeeze a toy. For each one, ask: ''What did you do?'' (the input) and ''What happened?'' (the output).","parentTip":"In coding, we call actions ''inputs'' and results ''outputs.'' You can use those words casually: ''The input was pressing the switch. The output was the light turning on!'' This builds computational thinking naturally.","completionPrompt":"Did you explore cause and effect with buttons and switches?","illustration":"\ud83d\udd2e"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- MUSIC LESSONS (5 lessons in "Music Garden")
-- *************************************************************************

-- Music Lesson 1: Loud and Soft
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Music Garden' AND band = 0),
  1,
  'Loud and Soft',
  'Hear a sound and decide: is it LOUD or SOFT? Thunder booms, whispers hush!',
  'Shhh! Listen closely, friend! Some sounds are LOUD like thunder, and some are soft like a whisper. Chip will play a sound and you pick if it''s loud or soft!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_loud_and_soft' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"listen_and_find","questions":[{"id":"loud-thunder","prompt":"Is this sound loud or soft?","spokenText":"BOOM! Thunder crashes in the sky! Is thunder loud or soft?","correctOptionId":"loud","options":[{"id":"loud","emoji":"\ud83d\udce2","label":"Loud"},{"id":"soft","emoji":"\ud83e\udd2b","label":"Soft"}]},{"id":"soft-whisper","prompt":"Is this sound loud or soft?","spokenText":"Shhhh... a tiny whisper in your ear. Is a whisper loud or soft?","correctOptionId":"soft","options":[{"id":"loud","emoji":"\ud83d\udce2","label":"Loud"},{"id":"soft","emoji":"\ud83e\udd2b","label":"Soft"}]},{"id":"loud-drum","prompt":"Is this sound loud or soft?","spokenText":"BANG BANG BANG! A big drum is playing! Is a drum loud or soft?","correctOptionId":"loud","options":[{"id":"loud","emoji":"\ud83d\udce2","label":"Loud"},{"id":"soft","emoji":"\ud83e\udd2b","label":"Soft"}]},{"id":"soft-rain","prompt":"Is this sound loud or soft?","spokenText":"Pitter patter, pitter patter... gentle rain on the window. Is rain loud or soft?","correctOptionId":"soft","options":[{"id":"loud","emoji":"\ud83d\udce2","label":"Loud"},{"id":"soft","emoji":"\ud83e\udd2b","label":"Soft"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play the Loud and Soft game! Clap loudly, then whisper. Stomp your feet, then tiptoe. Can you make a loud sound with your voice? Now make the softest sound you can!","parentTip":"This activity builds dynamic awareness \u2014 the ability to distinguish volume levels. Try contrasting pairs: loud clap vs. soft clap, stomping vs. tiptoeing, shouting vs. whispering.","completionPrompt":"Did you play the Loud and Soft game together?","illustration":"\ud83d\udd0a"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Music Lesson 2: What's That Sound?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Music Garden' AND band = 0),
  2,
  'What''s That Sound?',
  'Listen to everyday sounds and pick what makes them! Birds, cars, rain, and more.',
  'Chip hears something! What could it be? A bird? A car? Let''s listen to some sounds and find out what makes each one. Put on your listening ears!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_sound_exploration' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"listen_and_find","questions":[{"id":"sound-bird","prompt":"What makes this sound?","spokenText":"Tweet tweet tweet! Chirp chirp! What animal sings like this?","correctOptionId":"bird","options":[{"id":"bird","emoji":"\ud83d\udc26","label":"Bird"},{"id":"car","emoji":"\ud83d\ude97","label":"Car"},{"id":"dog","emoji":"\ud83d\udc36","label":"Dog"}]},{"id":"sound-car","prompt":"What makes this sound?","spokenText":"Beep beep! Honk honk! Vroom vroom! What goes on the road?","correctOptionId":"car","options":[{"id":"bird","emoji":"\ud83d\udc26","label":"Bird"},{"id":"car","emoji":"\ud83d\ude97","label":"Car"},{"id":"rain","emoji":"\ud83c\udf27\ufe0f","label":"Rain"}]},{"id":"sound-rain","prompt":"What makes this sound?","spokenText":"Drip drop drip drop, pitter patter on the roof. What falls from the sky?","correctOptionId":"rain","options":[{"id":"bell","emoji":"\ud83d\udd14","label":"Bell"},{"id":"rain","emoji":"\ud83c\udf27\ufe0f","label":"Rain"},{"id":"cat","emoji":"\ud83d\udc31","label":"Cat"}]},{"id":"sound-doorbell","prompt":"What makes this sound?","spokenText":"Ding dong! Ding dong! Someone is at the door! What made that sound?","correctOptionId":"doorbell","options":[{"id":"doorbell","emoji":"\ud83d\udecf\ufe0f","label":"Doorbell"},{"id":"drum","emoji":"\ud83e\udd41","label":"Drum"},{"id":"bird","emoji":"\ud83d\udc26","label":"Bird"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Close your eyes and listen! What sounds can you hear right now? Count them together! Try to hear at least 3 different sounds. Is it a bird? The fridge humming? Someone talking?","parentTip":"Active listening is a foundational music skill. Try this in different locations \u2014 inside, outside, in the car. Ask: ''Is that sound near or far? High or low?''","completionPrompt":"Did you close your eyes and listen for sounds together?","illustration":"\ud83d\udc42"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Music Lesson 3: Clap the Beat
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Music Garden' AND band = 0),
  3,
  'Clap the Beat',
  'Learn to keep a steady beat! Put clapping patterns in the right order.',
  'Let''s clap together, friend! Music has a beat \u2014 like a heartbeat! Clap, clap, rest, clap, clap, rest. Can you put the pattern in the right order?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_keeping_a_beat' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"beat-pattern-1","prompt":"Put the clapping pattern in order: Clap, Clap, Rest!","items":[{"id":"clap1","text":"Clap!","emoji":"\ud83d\udc4f","correctPosition":1},{"id":"clap2","text":"Clap!","emoji":"\ud83d\udc4f","correctPosition":2},{"id":"rest1","text":"Rest","emoji":"\ud83e\udd2b","correctPosition":3}],"hint":"The pattern goes: clap, clap, then a quiet rest!"},{"id":"beat-pattern-2","prompt":"Now try this pattern: Clap, Rest, Clap, Rest!","items":[{"id":"clap-a","text":"Clap!","emoji":"\ud83d\udc4f","correctPosition":1},{"id":"rest-a","text":"Rest","emoji":"\ud83e\udd2b","correctPosition":2},{"id":"clap-b","text":"Clap!","emoji":"\ud83d\udc4f","correctPosition":3},{"id":"rest-b","text":"Rest","emoji":"\ud83e\udd2b","correctPosition":4}],"hint":"This pattern switches: clap, rest, clap, rest. Like walking!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sing ''Twinkle Twinkle Little Star'' and clap along to the beat together! Try clapping on every word. Then try stomping your feet to the beat instead!","parentTip":"Keeping a steady beat is one of the most important early music skills. Don''t worry about being perfect \u2014 the goal is feeling the pulse of the music. Try different body percussion: clapping, stomping, patting knees.","completionPrompt":"Did you sing and clap to the beat together?","illustration":"\ud83d\udc4f"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Music Lesson 4: Fast and Slow
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Music Garden' AND band = 0),
  4,
  'Fast and Slow',
  'Is the music fast or slow? Rabbits zoom and turtles crawl \u2014 just like music!',
  'Some music is FAST like a bunny hopping, and some is SLOW like a turtle walking. Let''s figure out which is which! Ready, friend?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_fast_and_slow' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"multiple_choice","questions":[{"id":"tempo-rabbit","prompt":"A rabbit hops really quickly! Is the rabbit''s music fast or slow?","promptEmoji":"\ud83d\udc07","options":[{"id":"fast","text":"Fast","emoji":"\ud83d\udc07"},{"id":"slow","text":"Slow","emoji":"\ud83d\udc22"}],"correctOptionId":"fast","hint":"Rabbits hop hop hop really quickly! That''s fast music!"},{"id":"tempo-turtle","prompt":"A turtle walks very slowly. Is the turtle''s music fast or slow?","promptEmoji":"\ud83d\udc22","options":[{"id":"fast","text":"Fast","emoji":"\ud83d\udc07"},{"id":"slow","text":"Slow","emoji":"\ud83d\udc22"}],"correctOptionId":"slow","hint":"Turtles take their time... nice and slow!"},{"id":"tempo-cheetah","prompt":"A cheetah runs super duper fast! Is the cheetah''s music fast or slow?","promptEmoji":"\ud83d\udc06","options":[{"id":"fast","text":"Fast","emoji":"\ud83d\udc06"},{"id":"slow","text":"Slow","emoji":"\ud83d\udc0c"}],"correctOptionId":"fast","hint":"Cheetahs are the fastest animals! Zoom zoom!"},{"id":"tempo-snail","prompt":"A snail moves really, really slowly. Is the snail''s music fast or slow?","promptEmoji":"\ud83d\udc0c","options":[{"id":"fast","text":"Fast","emoji":"\ud83d\udc06"},{"id":"slow","text":"Slow","emoji":"\ud83d\udc0c"}],"correctOptionId":"slow","hint":"Snails are sooo slow. Their music would be slow too!"}],"shuffleOptions":false},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"March fast like a bunny! Now walk slow like a turtle! Try playing fast music and slow music \u2014 dance to each one. How does your body move differently to fast vs. slow music?","parentTip":"Tempo (fast/slow) is a key musical concept. Try humming a familiar song fast, then slow. Ask: ''Which way do you like it better?'' This builds preference and critical listening.","completionPrompt":"Did you march fast and slow like the animals?","illustration":"\ud83d\udc07"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Music Lesson 5: Sing Along!
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Music Garden' AND band = 0),
  5,
  'Sing Along!',
  'Flip through song cards with your favorite nursery rhymes and sing together!',
  'It''s singing time! Chip loves to sing \u2014 even though robots aren''t the best singers! Let''s look at some songs you might know. Flip each card and sing along!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug IN ('prek_singing_along', 'prek_musical_movement') AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Music' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"flash_card","prompt":"Flip each card to see a song! Can you sing it?","cards":[{"id":"song-twinkle","front":{"text":"Do you know this song?","emoji":"\u2b50"},"back":{"text":"Twinkle, Twinkle, Little Star!","emoji":"\u2b50"},"color":"#EAB308"},{"id":"song-macdonald","front":{"text":"Do you know this song?","emoji":"\ud83d\udc04"},"back":{"text":"Old MacDonald Had a Farm!","emoji":"\ud83e\uddab"},"color":"#22C55E"},{"id":"song-spider","front":{"text":"Do you know this song?","emoji":"\ud83d\udd78\ufe0f"},"back":{"text":"Itsy Bitsy Spider!","emoji":"\ud83c\udf27\ufe0f"},"color":"#3B82F6"},{"id":"song-wheels","front":{"text":"Do you know this song?","emoji":"\ud83d\ude8c"},"back":{"text":"The Wheels on the Bus!","emoji":"\ud83d\ude8c"},"color":"#EF4444"}],"shuffleCards":false},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sing one of these songs together! Add hand motions or movements \u2014 twinkling fingers for Twinkle Twinkle, animal sounds for Old MacDonald, climbing fingers for Itsy Bitsy Spider, or rolling arms for Wheels on the Bus!","parentTip":"Singing with hand motions combines music, language, and motor skills. Don''t worry about pitch \u2014 the joy of singing together is what matters most! Let your child pick their favorite song.","completionPrompt":"Did you sing a song together with hand motions?","illustration":"\ud83c\udfb6"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- ART LESSONS (5 lessons in "Color Play")
-- *************************************************************************

-- Art Lesson 1: Name That Color!
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Color Play' AND band = 0),
  1,
  'Name That Color!',
  'Learn the names of colors! Red, blue, yellow, green, orange, and purple.',
  'Colors are EVERYWHERE, friend! Chip sees red apples, blue skies, and yellow suns! Let''s learn the names of all the beautiful colors together!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_color_naming' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"flash_card","prompt":"Flip each card to learn the color name!","cards":[{"id":"color-red","front":{"text":"What color is this?","emoji":"\u2764\ufe0f"},"back":{"text":"Red!","emoji":"\u2764\ufe0f"},"color":"#EF4444"},{"id":"color-blue","front":{"text":"What color is this?","emoji":"\ud83d\udc99"},"back":{"text":"Blue!","emoji":"\ud83d\udc99"},"color":"#3B82F6"},{"id":"color-yellow","front":{"text":"What color is this?","emoji":"\ud83d\udc9b"},"back":{"text":"Yellow!","emoji":"\ud83d\udc9b"},"color":"#EAB308"},{"id":"color-green","front":{"text":"What color is this?","emoji":"\ud83d\udc9a"},"back":{"text":"Green!","emoji":"\ud83d\udc9a"},"color":"#22C55E"},{"id":"color-orange","front":{"text":"What color is this?","emoji":"\ud83e\udde1"},"back":{"text":"Orange!","emoji":"\ud83e\udde1"},"color":"#F97316"},{"id":"color-purple","front":{"text":"What color is this?","emoji":"\ud83d\udc9c"},"back":{"text":"Purple!","emoji":"\ud83d\udc9c"},"color":"#A855F7"}],"shuffleCards":false},{"type":"tap_and_reveal","questions":[{"id":"find-red","prompt":"Find all the RED things!","mode":"find","targetPrompt":"Tap the red ones!","gridCols":3,"items":[{"id":"red-apple","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83c\udf4e","revealLabel":"Red Apple","isTarget":true},{"id":"blue-ball","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83d\udfe6","revealLabel":"Blue Ball","isTarget":false},{"id":"red-heart","coverEmoji":"\ud83c\udf1f","revealEmoji":"\u2764\ufe0f","revealLabel":"Red Heart","isTarget":true},{"id":"green-leaf","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83c\udf4f","revealLabel":"Green Apple","isTarget":false},{"id":"red-strawberry","coverEmoji":"\ud83c\udf1f","revealEmoji":"\ud83c\udf53","revealLabel":"Red Strawberry","isTarget":true},{"id":"yellow-star","coverEmoji":"\ud83c\udf1f","revealEmoji":"\u2b50","revealLabel":"Yellow Star","isTarget":false}]}]}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Art Lesson 2: Draw a Shape
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Color Play' AND band = 0),
  2,
  'Draw a Shape',
  'Trace a circle, a square, and a triangle! Follow the dotted lines with your finger.',
  'Time to draw, friend! Chip loves shapes! Can you trace a circle round and round? Then a square with straight lines? Let''s try together!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_shape_drawing' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"trace_shape","questions":[{"id":"trace-circle","prompt":"Trace the circle! Go round and round!","shape":"circle","strokeColor":"#EC4899","traceColor":"#F97316"},{"id":"trace-square","prompt":"Trace the square! Follow the straight lines!","shape":"square","strokeColor":"#3B82F6","traceColor":"#F97316"},{"id":"trace-triangle","prompt":"Trace the triangle! It has 3 sides!","shape":"triangle","strokeColor":"#22C55E","traceColor":"#F97316"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Draw shapes together! Use crayons, chalk, or even your finger in sand! Try drawing circles, squares, and triangles. Can you find these shapes around the house?","parentTip":"Tracing builds fine motor skills needed for writing. Let your child use thick crayons or markers. Drawing in sand, shaving cream, or finger paint makes it extra fun and sensory-rich!","completionPrompt":"Did you draw shapes together?","illustration":"\u270d\ufe0f"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Art Lesson 3: Mix It Up!
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Color Play' AND band = 0),
  3,
  'Mix It Up!',
  'What happens when you mix two colors? Tap to find out! Red + Blue = ???',
  'Chip has a COLOR SURPRISE for you! When you mix two colors together, they make a BRAND NEW color! Tap each pair to see what happens!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_color_mixing' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"tap_and_reveal","questions":[{"id":"mix-colors","prompt":"Tap each pair to see what new color they make!","mode":"explore","gridCols":3,"items":[{"id":"red-plus-blue","coverEmoji":"\ud83d\udfe5\u2795\ud83d\udfe6","revealEmoji":"\ud83d\udfea","revealLabel":"Red + Blue = Purple!"},{"id":"red-plus-yellow","coverEmoji":"\ud83d\udfe5\u2795\ud83d\udfe8","revealEmoji":"\ud83d\udfe7","revealLabel":"Red + Yellow = Orange!"},{"id":"blue-plus-yellow","coverEmoji":"\ud83d\udfe6\u2795\ud83d\udfe8","revealEmoji":"\ud83d\udfe9","revealLabel":"Blue + Yellow = Green!"}]}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Try color mixing with paint, playdough, or colored water! What happens when you mix red and yellow? Blue and yellow? Red and blue? Let your child predict first, then mix to check!","parentTip":"Color mixing teaches cause and effect and is deeply satisfying for young children. Colored water in clear cups is the easiest setup. Add food coloring to water and let your child pour one into another. The wow factor is huge!","completionPrompt":"Did you try mixing colors together?","illustration":"\ud83c\udfa8"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Art Lesson 4: How Does It Feel?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Color Play' AND band = 0),
  4,
  'How Does It Feel?',
  'Is it smooth or rough? Sort things by how they feel when you touch them!',
  'Touch is amazing, friend! Some things feel smooth like glass, and some feel rough like sandpaper. Let''s sort them! Which group does each one go in?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_texture_awareness' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"drag_to_sort","questions":[{"id":"sort-texture","prompt":"Sort these things! Is it smooth or rough?","buckets":[{"id":"smooth","label":"Smooth","emoji":"\u2728"},{"id":"rough","label":"Rough","emoji":"\ud83e\udea8"}],"items":[{"id":"glass","label":"Glass","emoji":"\ud83e\udea9","correctBucket":"smooth"},{"id":"sandpaper","label":"Sandpaper","emoji":"\ud83d\udfe8","correctBucket":"rough"},{"id":"silk","label":"Silk","emoji":"\ud83e\udde3","correctBucket":"smooth"},{"id":"bark","label":"Tree Bark","emoji":"\ud83c\udf33","correctBucket":"rough"}],"hint":"Glass and silk feel nice and smooth. Sandpaper and tree bark feel bumpy and rough!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Go on a texture hunt! Find something smooth, something rough, something bumpy, and something soft. Touch each one and describe how it feels. Try closing your eyes and guessing just by touch!","parentTip":"Texture awareness builds sensory vocabulary and observation skills \u2014 both important for art and science. Encourage descriptive words beyond just smooth/rough: bumpy, fuzzy, squishy, hard, slimy, silky.","completionPrompt":"Did you go on a texture hunt together?","illustration":"\u270b"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- Art Lesson 5: Free Draw Fun
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Color Play' AND band = 0),
  5,
  'Free Draw Fun',
  'Trace your favorite shapes \u2014 circles, stars, and hearts! Then draw anything you want!',
  'It''s FREE DRAW time! Chip''s favorite! Pick a shape and trace it, or just have fun drawing whatever you imagine! Remember \u2014 there''s no wrong answer in art!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug IN ('prek_free_drawing', 'prek_pattern_making') AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Art' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"trace_shape","questions":[{"id":"trace-circle-free","prompt":"Trace a circle! Round and round!","shape":"circle","strokeColor":"#EC4899","traceColor":"#F97316"},{"id":"trace-star-free","prompt":"Trace a star! Connect the points!","shape":"star","strokeColor":"#EAB308","traceColor":"#F97316"},{"id":"trace-heart-free","prompt":"Trace a heart! Show the love!","shape":"heart","strokeColor":"#EF4444","traceColor":"#F97316"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Draw anything you want! Tell me about your picture when you''re done! There''s no wrong answer in art! Try drawing your favorite animal, your family, or something from your imagination.","parentTip":"Open-ended art builds creativity and confidence. Ask your child to tell you about their drawing rather than guessing what it is. Say ''Tell me about your picture!'' instead of ''What is that?'' to keep it positive.","completionPrompt":"Did you draw something awesome together?","illustration":"\ud83c\udfa8"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;


-- *************************************************************************
-- PROBLEM SOLVING LESSONS (5 lessons in "Think & Play")
-- *************************************************************************

-- PS Lesson 1: Sort It Out
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Think & Play' AND band = 0),
  1,
  'Sort It Out',
  'Sort shapes into groups! Put circles with circles and squares with squares.',
  'Chip''s shapes got all mixed up! Can you help sort them? Put all the circles in one group and all the squares in the other. You''re a sorting superstar!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_shape_sorting' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"drag_to_sort","questions":[{"id":"sort-shapes","prompt":"Sort the shapes! Circles go in one group, squares in the other!","buckets":[{"id":"circles","label":"Circles","emoji":"\ud83d\udfe2"},{"id":"squares","label":"Squares","emoji":"\ud83d\udfe7"}],"items":[{"id":"red-circle","label":"Red Circle","emoji":"\ud83d\udd34","correctBucket":"circles"},{"id":"blue-square","label":"Blue Square","emoji":"\ud83d\udfe6","correctBucket":"squares"},{"id":"green-circle","label":"Green Circle","emoji":"\ud83d\udfe2","correctBucket":"circles"},{"id":"orange-square","label":"Orange Square","emoji":"\ud83d\udfe7","correctBucket":"squares"},{"id":"purple-circle","label":"Purple Circle","emoji":"\ud83d\udfea","correctBucket":"circles"},{"id":"yellow-square","label":"Yellow Square","emoji":"\ud83d\udfe8","correctBucket":"squares"}],"hint":"Look at the shape! Is it round like a ball (circle) or has it got straight sides (square)?"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Sort your toys! Put all the cars together, all the dolls together, all the blocks together. Then try sorting by color \u2014 all the red toys, all the blue toys. How many groups can you make?","parentTip":"Sorting is a foundational thinking skill. Start with one attribute (shape or color), then try two (''big red things'' vs. ''small blue things''). Ask your child to explain WHY each item goes in its group.","completionPrompt":"Did you sort your toys into groups?","illustration":"\ud83e\udde9"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- PS Lesson 2: What's the Pattern?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Think & Play' AND band = 0),
  2,
  'What''s the Pattern?',
  'Red, blue, red, blue \u2014 what comes next? Discover and extend AB patterns!',
  'Look at this, friend! Chip found a PATTERN! Red, blue, red, blue... it keeps going! Patterns are everywhere. Can you figure out what comes next?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_ab_patterns' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"pattern-ab","prompt":"Finish the pattern: Red, Blue, ???","items":[{"id":"red","text":"Red","emoji":"\ud83d\udfe5","correctPosition":1},{"id":"blue","text":"Blue","emoji":"\ud83d\udfe6","correctPosition":2},{"id":"red2","text":"Red","emoji":"\ud83d\udfe5","correctPosition":3}],"hint":"The pattern goes A-B-A-B. Red is A, Blue is B. After blue comes... red again!"}]},{"type":"flash_card","prompt":"Look at these patterns! Tap to flip and see!","cards":[{"id":"pattern-star-moon","front":{"text":"Star, Moon, Star, Moon, ???","emoji":"\u2b50\ud83c\udf19"},"back":{"text":"Star! The pattern repeats!","emoji":"\u2b50"},"color":"#EAB308"},{"id":"pattern-cat-dog","front":{"text":"Cat, Dog, Cat, Dog, ???","emoji":"\ud83d\udc31\ud83d\udc36"},"back":{"text":"Cat! A-B-A-B pattern!","emoji":"\ud83d\udc31"},"color":"#F97316"},{"id":"pattern-big-small","front":{"text":"Big, Small, Big, Small, ???","emoji":"\ud83d\udc18\ud83d\udc1d"},"back":{"text":"Big! The pattern keeps going!","emoji":"\ud83d\udc18"},"color":"#A855F7"}],"shuffleCards":false}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- PS Lesson 3: Which One Is Different?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Think & Play' AND band = 0),
  3,
  'Which One Is Different?',
  'One of these things is not like the others! Can you spot the odd one out?',
  'Hmm, Chip sees something funny! Three things look alike, but one is DIFFERENT. Can you find the one that doesn''t belong? Put on your detective hat!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_odd_one_out' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"multiple_choice","questions":[{"id":"odd-fruits-animal","prompt":"Which one does NOT belong with the others?","promptEmoji":"\ud83e\udd14","options":[{"id":"apple","text":"Apple","emoji":"\ud83c\udf4e"},{"id":"banana","text":"Banana","emoji":"\ud83c\udf4c"},{"id":"dog","text":"Dog","emoji":"\ud83d\udc36"},{"id":"grape","text":"Grapes","emoji":"\ud83c\udf47"}],"correctOptionId":"dog","hint":"Three of these are things you eat. One is an animal!"},{"id":"odd-circles-square","prompt":"Which shape is different from the others?","promptEmoji":"\ud83d\udd0d","options":[{"id":"c1","text":"Circle","emoji":"\ud83d\udd34"},{"id":"c2","text":"Circle","emoji":"\ud83d\udfe2"},{"id":"sq","text":"Square","emoji":"\ud83d\udfe7"},{"id":"c3","text":"Circle","emoji":"\ud83d\udfea"}],"correctOptionId":"sq","hint":"Three are round and one has straight sides!"},{"id":"odd-big-small","prompt":"Which one is NOT like the others?","promptEmoji":"\ud83d\udc40","options":[{"id":"big1","text":"Elephant","emoji":"\ud83d\udc18"},{"id":"big2","text":"Whale","emoji":"\ud83d\udc33"},{"id":"small","text":"Ant","emoji":"\ud83d\udc1c"},{"id":"big3","text":"Bear","emoji":"\ud83d\udc3b"}],"correctOptionId":"small","hint":"Three are very BIG animals. One is very tiny!"}],"shuffleOptions":false},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play Odd One Out at home! Put 3 spoons and 1 fork on the table. Which one is different? Try with toys: 3 cars and 1 doll. 3 red blocks and 1 blue block. Let your child make the groups too!","parentTip":"''Odd one out'' builds classification skills \u2014 the ability to group things by shared attributes. Start with obvious differences (category) then try subtle ones (color, size). Ask: ''Why is that one different?''","completionPrompt":"Did you play Odd One Out together?","illustration":"\ud83d\udd0d"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- PS Lesson 4: What Comes Next?
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Think & Play' AND band = 0),
  4,
  'What Comes Next?',
  'Baby, child, grown-up! Seed, sprout, flower! Put things in order!',
  'Things grow and change, friend! A tiny seed becomes a sprout, then a beautiful flower! Can you put these stories in the right order?',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_what_comes_next' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"seq-grow-up","prompt":"Put these in order: from youngest to oldest!","items":[{"id":"baby","text":"Baby","emoji":"\ud83d\udc76","correctPosition":1},{"id":"child","text":"Child","emoji":"\ud83e\uddd2","correctPosition":2},{"id":"adult","text":"Grown-Up","emoji":"\ud83e\uddd1","correctPosition":3}],"hint":"First we are tiny babies, then we grow into children, then into grown-ups!"},{"id":"seq-plant","prompt":"How does a plant grow? Put these in order!","items":[{"id":"seed","text":"Seed","emoji":"\ud83c\udf31","correctPosition":1},{"id":"sprout","text":"Sprout","emoji":"\ud83c\udf3f","correctPosition":2},{"id":"flower","text":"Flower","emoji":"\ud83c\udf3b","correctPosition":3}],"hint":"First it''s a tiny seed, then a little green sprout, then a beautiful flower!"}]},{"type":"tap_and_reveal","questions":[{"id":"reveal-sequences","prompt":"Tap to reveal what comes next in each story!","mode":"explore","gridCols":3,"items":[{"id":"egg-reveal","coverEmoji":"\ud83e\udd5a\u27a1\ufe0f\u2753","revealEmoji":"\ud83d\udc23","revealLabel":"Egg becomes a Chick!"},{"id":"caterpillar-reveal","coverEmoji":"\ud83d\udc1b\u27a1\ufe0f\u2753","revealEmoji":"\ud83e\udd8b","revealLabel":"Caterpillar becomes a Butterfly!"},{"id":"tadpole-reveal","coverEmoji":"\ud83d\udc20\u27a1\ufe0f\u2753","revealEmoji":"\ud83d\udc38","revealLabel":"Tadpole becomes a Frog!"}]}]}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;

-- PS Lesson 5: Follow the Steps
INSERT INTO public.lessons (
  module_id, order_num, title, description, story_text,
  starter_blocks_xml, solution_code, hints,
  subject_id, skills_covered, lesson_type,
  device_required, device_features, simulator_support, simulator_compatible,
  estimated_minutes, content
) VALUES (
  (SELECT id FROM modules WHERE title = 'Think & Play' AND band = 0),
  5,
  'Follow the Steps',
  'Put instructions in the right order! First this, then that. Step by step!',
  'Chip does things step by step! First you open the box, THEN you take out the toy. First you pick up the crayon, THEN you draw. Let''s practice putting steps in order!',
  NULL, NULL,
  '[]'::jsonb,
  (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1),
  ARRAY(SELECT id FROM skills WHERE slug = 'prek_following_directions' AND subject_id = (SELECT id FROM subjects WHERE display_name = 'Problem Solving' LIMIT 1)),
  'interactive',
  false, '{}', true, true,
  8,
  '{"activities":[{"type":"sequence_order","questions":[{"id":"steps-box","prompt":"Put these steps in order: How do you get a toy from a box?","items":[{"id":"open","text":"Open the box","emoji":"\ud83d\udce6","correctPosition":1},{"id":"take-out","text":"Take out the toy","emoji":"\ud83e\uddf8","correctPosition":2}],"hint":"First you have to open the box, THEN you can take out what''s inside!"},{"id":"steps-draw","prompt":"Put these steps in order: How do you draw a picture?","items":[{"id":"pick-up","text":"Pick up the crayon","emoji":"\ud83d\udd8d\ufe0f","correctPosition":1},{"id":"draw","text":"Draw a circle","emoji":"\u2b55","correctPosition":2}],"hint":"First you need to pick up the crayon, THEN you can draw!"},{"id":"steps-wash","prompt":"Put these steps in order: How do you wash your hands?","items":[{"id":"water","text":"Turn on the water","emoji":"\ud83d\udeb0","correctPosition":1},{"id":"soap","text":"Use soap","emoji":"\ud83e\uddfc","correctPosition":2},{"id":"dry","text":"Dry your hands","emoji":"\ud83e\uddfb","correctPosition":3}],"hint":"First water, then soap to scrub, then dry! Three steps in a row!"}]},{"type":"parent_activity","prompt":"Off-Screen Fun!","instructions":"Play Simon Says with 2 steps! ''Simon says clap your hands AND stomp your feet!'' ''Simon says touch your nose AND jump!'' Start with 2-step instructions and see if your child can follow them in order.","parentTip":"Following multi-step directions is a key school readiness skill. Start with just 2 steps. As your child gets comfortable, try 3 steps. Make it silly and fun \u2014 the sillier the better for engagement!","completionPrompt":"Did you play Simon Says with 2-step instructions?","illustration":"\ud83d\ude4b"}],"passingScore":60,"estimatedMinutes":8}'::jsonb
) ON CONFLICT (module_id, order_num) DO NOTHING;
