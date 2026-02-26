-- =============================================================================
-- TinkerSchool -- Seed Pre-K Skills (Ages 3-5)
-- =============================================================================
-- Adds Pre-K readiness skills for all 7 existing subjects:
--   - Math (8 skills)
--   - Reading (8 skills)
--   - Science (8 skills)
--   - Music (6 skills)
--   - Art (6 skills)
--   - Problem Solving (6 skills)
--   - Coding (6 skills)
--   Total: 48 skills
--
-- UUID scheme: subject prefix (10-70) + grade indicator 000000 (Pre-K)
--   e.g. 10000000-0001-4000-8000-000000000001 = Math Pre-K skill 1
--   (vs  10000001-0001-... = Math 1st grade skill 1)
--
-- Depends on: 003_seed_1st_grade_curriculum.sql (subjects table seeded)
-- =============================================================================


-- =========================================================================
-- 1. Math Pre-K Skills (subject: 00000000-0000-4000-8000-000000000001)
--    Aligned to Head Start Early Learning Outcomes Framework (HSELOF)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('10000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_rote_counting_10',      'Rote Counting to 10',       'Count aloud from 1 to 10 in sequence',                               'HSELOF: Math-1',     1),
  ('10000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_one_to_one_counting',   'One-to-One Counting',       'Touch and count objects up to 5 (age 3) or up to 10 (age 4)',        'HSELOF: Math-2',     2),
  ('10000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_number_recognition_5',  'Number Recognition 1-5',    'Recognize written numerals 1 through 5',                             'HSELOF: Math-3',     3),
  ('10000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_shape_recognition',     'Shape Recognition',         'Identify circles, squares, and triangles',                           'CC.K.G.A.2 readiness', 4),
  ('10000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_size_comparison',       'Size Comparison',           'Compare big/small, tall/short, long/short',                          'HSELOF: Math-6',     5),
  ('10000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_simple_patterns',       'Simple Patterns',           'Identify and extend AB patterns',                                    'HSELOF: Math-7',     6),
  ('10000000-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_sorting_attribute',     'Sorting by Attribute',      'Sort objects by one attribute (color, shape, or size)',               'HSELOF: Math-5',     7),
  ('10000000-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'prek_more_and_less',         'More and Less',             'Compare groups to identify which has more or fewer',                 'HSELOF: Math-4',     8);


-- =========================================================================
-- 2. Reading Pre-K Skills (subject: 00000000-0000-4000-8000-000000000002)
--    Aligned to HSELOF Literacy & Language domains
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_book_awareness',          'Book Awareness',              'Hold a book correctly; understand front/back, top/bottom',                'HSELOF: Lit-1',   1),
  ('20000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_letter_recognition',      'Letter Recognition (A-Z)',    'Recognize uppercase letters by sight',                                    'HSELOF: Lit-3',   2),
  ('20000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_beginning_sounds',        'Beginning Sound Awareness',   'Identify the first sound in a word',                                      'HSELOF: Lit-4',   3),
  ('20000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_rhyme_recognition',       'Rhyme Recognition',           'Identify words that rhyme',                                               'HSELOF: Lit-5',   4),
  ('20000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_vocabulary_building',     'Vocabulary Building',         'Learn new words through context and pictures',                            'HSELOF: Lang-3',  5),
  ('20000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_listening_comprehension', 'Listening Comprehension',     'Answer simple questions about a read-aloud story',                        'HSELOF: Lit-2',   6),
  ('20000000-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_syllable_awareness',      'Syllable Awareness',          'Clap out syllables in familiar words',                                    'HSELOF: Lit-6',   7),
  ('20000000-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'prek_name_recognition',        'Name Recognition',            'Recognize own written name',                                              'HSELOF: Lit-7',   8);


-- =========================================================================
-- 3. Science Pre-K Skills (subject: 00000000-0000-4000-8000-000000000003)
--    Aligned to HSELOF Science domain + NGSS readiness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('30000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_using_senses',         'Using Senses',              'Describe objects using the five senses',                                 'NGSS: PS-ETS1 readiness', 1),
  ('30000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_nature_observation',   'Nature Observation',        'Observe and describe plants, animals, and weather',                      'HSELOF: Sci-1',           2),
  ('30000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_cause_and_effect',     'Cause and Effect',          'Predict what happens when you do something',                             'HSELOF: Sci-2',           3),
  ('30000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_living_nonliving',     'Living vs. Non-Living',     'Sort things into living and non-living',                                  'HSELOF: Sci-3',           4),
  ('30000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_weather_awareness',    'Weather Awareness',         'Describe today''s weather',                                              'NGSS: K-ESS2 readiness',  5),
  ('30000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_animal_sounds_homes',  'Animal Sounds and Homes',   'Match animals to their sounds and habitats',                             'HSELOF: Sci-4',           6),
  ('30000000-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_sink_or_float',        'Sink or Float',             'Predict and test whether objects sink or float',                         'HSELOF: Sci-5',           7),
  ('30000000-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'prek_plant_growth',         'Plant Growth',              'Understand that plants need water and light to grow',                    'NGSS: K-LS1 readiness',   8);


-- =========================================================================
-- 4. Music Pre-K Skills (subject: 00000000-0000-4000-8000-000000000004)
--    Aligned to National Core Arts Standards (NCAS) readiness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('40000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_singing_along',       'Singing Along',         'Sing simple songs and nursery rhymes',                   'NCAS: Cr1 readiness',  1),
  ('40000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_loud_and_soft',       'Loud and Soft',         'Distinguish between loud and quiet sounds',              'NCAS: Re7 readiness',  2),
  ('40000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_fast_and_slow',       'Fast and Slow',         'Distinguish between fast and slow rhythms',              'NCAS: Re7 readiness',  3),
  ('40000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_keeping_a_beat',      'Keeping a Beat',        'Clap, stomp, or tap along to a steady beat',             'NCAS: Pr4 readiness',  4),
  ('40000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_sound_exploration',   'Sound Exploration',     'Identify everyday sounds',                               'NCAS: Re7 readiness',  5),
  ('40000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'prek_musical_movement',    'Musical Movement',      'Move body to music',                                     'NCAS: Pr6 readiness',  6);


-- =========================================================================
-- 5. Art Pre-K Skills (subject: 00000000-0000-4000-8000-000000000005)
--    Aligned to National Core Arts Standards (NCAS) readiness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('50000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_color_naming',        'Color Naming',          'Identify and name primary and secondary colors',                    'NCAS: Cr1 readiness',  1),
  ('50000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_shape_drawing',       'Shape Drawing',         'Draw or trace circles, lines, and simple shapes',                   'NCAS: Cr2 readiness',  2),
  ('50000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_color_mixing',        'Color Mixing',          'Discover what happens when two colors mix',                         'NCAS: Cr2 readiness',  3),
  ('50000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_texture_awareness',   'Texture Awareness',     'Describe textures (smooth, rough, bumpy, soft)',                    'NCAS: Re7 readiness',  4),
  ('50000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_free_drawing',        'Free Drawing',          'Express ideas through open-ended drawing',                          'NCAS: Cr1 readiness',  5),
  ('50000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'prek_pattern_making',      'Pattern Making',        'Create simple visual patterns with stamps or shapes',               'NCAS: Cr2 readiness',  6);


-- =========================================================================
-- 6. Problem Solving Pre-K Skills (subject: 00000000-0000-4000-8000-000000000006)
--    Aligned to ISTE Computational Thinking readiness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('60000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_shape_sorting',         'Shape Sorting',           'Sort objects by shape, then by color, then by size',              'ISTE: CT readiness',  1),
  ('60000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_simple_puzzles',        'Simple Puzzles',          'Complete 4 to 8 piece puzzles',                                   'ISTE: CT readiness',  2),
  ('60000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_ab_patterns',           'AB Patterns',             'Recognize and extend alternating patterns',                       'ISTE: CT readiness',  3),
  ('60000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_what_comes_next',       'What Comes Next',         'Predict the next item in a sequence',                             'ISTE: CT readiness',  4),
  ('60000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_odd_one_out',           'Odd One Out',             'Identify which item does not belong in a group',                  'ISTE: CT readiness',  5),
  ('60000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'prek_following_directions',  'Following Directions',    'Follow 2-step verbal instructions in order',                      'ISTE: CT readiness',  6);


-- =========================================================================
-- 7. Coding Pre-K Skills (subject: 00000000-0000-4000-8000-000000000007)
--    Aligned to CSTA K-12 CS Framework readiness
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('70000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_sequencing',             'Sequencing',                  'Put 2 to 3 picture cards in the right order',                  'CSTA: 1A readiness',  1),
  ('70000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_cause_and_effect',       'Cause and Effect',            'Predict what a button press will do',                          'CSTA: 1A readiness',  2),
  ('70000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_simple_directions',      'Simple Directions',           'Give and follow directional instructions',                     'CSTA: 1A readiness',  3),
  ('70000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_repeating_patterns',     'Repeating Patterns',          'Identify when something repeats',                              'CSTA: 1A readiness',  4),
  ('70000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_input_output',           'Matching Input to Output',    'Connect an action to its result',                              'CSTA: 1A readiness',  5),
  ('70000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'prek_problem_decomposition',  'Problem Decomposition',       'Break a task into 2 simple steps',                             'CSTA: 1A readiness',  6);
