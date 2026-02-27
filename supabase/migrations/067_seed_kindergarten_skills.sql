-- =============================================================================
-- TinkerSchool -- Seed Kindergarten Skills (Band 1, Ages 5-6)
-- =============================================================================
-- Adds Kindergarten-level skills for all 7 core subjects:
--   - Math (10 skills)       -- Common Core K: K.CC, K.OA, K.NBT, K.MD, K.G
--   - Reading (10 skills)    -- Common Core K: RF.K, RL.K, L.K
--   - Science (8 skills)     -- NGSS K: K-PS2, K-PS3, K-LS1, K-ESS2, K-ESS3
--   - Music (8 skills)       -- NCAS Music K: Creating, Performing, Responding
--   - Art (8 skills)         -- NCAS Visual Arts K: Creating, Presenting, Responding
--   - Problem Solving (8 skills) -- Mathematical Practices + ISTE CT
--   - Coding (8 skills)      -- CSTA 1A (K-2)
--   Total: 60 skills
--
-- UUID scheme: subject prefix (1X-7X) with 00000100 for Kindergarten band 1
--   e.g. 10000100-0001-4000-8000-000000000001 = Math K skill 1
--   (vs  10000000-0001-... = Math Pre-K skill 1)
--   (vs  10000001-0001-... = Math 1st grade skill 1, now band 2)
--
-- Depends on:
--   - 003_seed_1st_grade_curriculum.sql (subjects table seeded)
--   - 066_shift_bands_up.sql (bands shifted, band 1 now = Kindergarten)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 1. Math Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000001)
--    Aligned to Common Core K Math: K.CC, K.OA, K.NBT, K.MD, K.G
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('10000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_counting_to_20',         'Counting to 20',                 'Count to 20 and answer "how many?" for up to 20 objects',                    'K.CC.A.1',   1),
  ('10000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_counting_to_100',        'Counting to 100',                'Count to 100 by ones and by tens',                                           'K.CC.A.1',   2),
  ('10000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_write_numbers_0_20',     'Writing Numbers 0-20',           'Write numerals from 0 to 20 and represent a number of objects',              'K.CC.A.3',   3),
  ('10000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_count_objects',          'Counting Objects',               'Count objects in a line, array, or circle using one-to-one correspondence',  'K.CC.B.4',   4),
  ('10000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_compare_numbers',        'Comparing Numbers',              'Compare two numbers between 1 and 10 using greater than, less than, equal',  'K.CC.C.6',   5),
  ('10000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_addition_within_5',      'Addition within 5',              'Represent addition with objects, fingers, and drawings within 5',            'K.OA.A.1',   6),
  ('10000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_subtraction_within_5',   'Subtraction within 5',           'Represent subtraction with objects, fingers, and drawings within 5',         'K.OA.A.1',   7),
  ('10000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_decompose_to_10',        'Decomposing Numbers to 10',      'Decompose numbers up to 10 into pairs in more than one way',                'K.OA.A.3',   8),
  ('10000100-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_2d_shapes',              'Naming 2D Shapes',               'Identify and describe circles, triangles, rectangles, squares, and hexagons', 'K.G.A.2',   9),
  ('10000100-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'k_compare_measurable',     'Comparing & Measuring',          'Directly compare two objects by length, weight, or capacity and describe the difference', 'K.MD.A.2', 10);


-- =========================================================================
-- 2. Reading Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000002)
--    Aligned to Common Core K ELA: RF.K, RL.K, RI.K, L.K, W.K
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_uppercase_letters',      'Uppercase Letter Recognition',   'Recognize and name all 26 uppercase letters of the alphabet',               'RF.K.1.d',   1),
  ('20000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_lowercase_letters',      'Lowercase Letter Recognition',   'Recognize and name all 26 lowercase letters of the alphabet',               'RF.K.1.d',   2),
  ('20000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_letter_sounds',          'Letter-Sound Matching',          'Match consonant and short vowel sounds to their letters',                    'RF.K.3.a',   3),
  ('20000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_rhyming',                'Rhyming Words',                  'Recognize and produce rhyming words',                                        'RF.K.2.a',   4),
  ('20000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_cvc_blending',           'Blending CVC Words',             'Blend sounds together to read consonant-vowel-consonant words (cat, dog)',   'RF.K.2.d',   5),
  ('20000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_sight_words',            'Common Sight Words',             'Read common high-frequency words by sight (the, and, is, it, to, you)',     'RF.K.3.c',   6),
  ('20000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_story_details',          'Story Key Details',              'With prompting, ask and answer questions about key details in a story',      'RL.K.1',     7),
  ('20000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_retelling',              'Retelling Stories',              'With prompting, retell familiar stories including key details',              'RL.K.2',     8),
  ('20000100-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_print_letters',          'Printing Letters',               'Print many upper- and lowercase letters and write first name',               'L.K.1.a',    9),
  ('20000100-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'k_nouns_verbs',            'Nouns and Verbs',                'Use frequently occurring nouns and verbs in speech and writing',             'L.K.1.b',    10);


-- =========================================================================
-- 3. Science Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000003)
--    Aligned to NGSS K: K-PS2, K-PS3, K-LS1, K-ESS2, K-ESS3
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('30000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_pushes_and_pulls',       'Pushes and Pulls',               'Plan and conduct an investigation to compare effects of different pushes and pulls', 'K-PS2-1',   1),
  ('30000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_changing_motion',        'Changing Motion',                'Analyze data to determine if a design solution changes the speed or direction of an object', 'K-PS2-2', 2),
  ('30000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_sunlight_warming',       'Sunlight Warms Things',          'Use tools and materials to design a structure that reduces warming from sunlight', 'K-PS3-1',   3),
  ('30000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_weather_patterns',       'Weather Patterns',               'Use and share observations of local weather conditions to describe patterns over time', 'K-ESS2-1',  4),
  ('30000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_what_plants_need',       'What Plants Need',               'Use observations to describe patterns of what plants need to survive and grow', 'K-LS1-1',    5),
  ('30000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_what_animals_need',      'What Animals Need',              'Use observations to describe patterns of what animals need to survive',      'K-LS1-1',    6),
  ('30000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_where_animals_live',     'Where Animals Live',             'Use a model to represent the relationship between animal needs and where they live', 'K-ESS3-1',  7),
  ('30000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'k_reduce_human_impact',    'Helping Our Earth',              'Communicate solutions that will reduce the impact of humans on land, water, air', 'K-ESS3-3',  8);


-- =========================================================================
-- 4. Music Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000004)
--    Aligned to National Core Arts Standards (NCAS) Music K
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('40000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_steady_beat',            'Steady Beat',                    'Demonstrate a steady beat using body percussion and simple instruments',     'MU:Pr4.2.K', 1),
  ('40000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_loud_soft',              'Loud and Soft (Dynamics)',        'Explore and demonstrate dynamics — loud (forte) and soft (piano)',           'MU:Re7.2.K', 2),
  ('40000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_fast_slow',              'Fast and Slow (Tempo)',           'Explore and demonstrate tempo — fast and slow in music',                     'MU:Re7.2.K', 3),
  ('40000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_singing_voice',          'Singing Voice',                  'Use singing voice versus speaking voice and match simple pitches',           'MU:Pr4.1.K', 4),
  ('40000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_body_percussion',        'Body Percussion',                'Create rhythmic patterns using clapping, stomping, snapping, and patting',   'MU:Cr1.1.K', 5),
  ('40000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_musical_ideas',          'Musical Ideas',                  'Generate musical ideas using voice and instruments for a specific purpose',  'MU:Cr1.1.K', 6),
  ('40000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_respond_to_music',       'Responding to Music',            'Describe how music makes you feel and identify musical contrasts',           'MU:Re7.1.K', 7),
  ('40000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'k_high_low_sounds',        'High and Low Sounds',            'Distinguish between high and low pitched sounds in music',                   'MU:Re7.2.K', 8);


-- =========================================================================
-- 5. Art Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000005)
--    Aligned to National Core Arts Standards (NCAS) Visual Arts K
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('50000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_primary_colors',         'Primary Colors',                 'Identify and name the primary colors: red, yellow, blue',                   'VA:Cr1.1.K', 1),
  ('50000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_mixing_colors',          'Mixing Colors',                  'Explore what happens when two primary colors are mixed together',           'VA:Cr2.1.K', 2),
  ('50000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_types_of_lines',         'Types of Lines',                 'Create and identify different types of lines: straight, wavy, zigzag, curved', 'VA:Cr1.2.K', 3),
  ('50000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_shapes_in_art',          'Shapes in Art',                  'Use basic shapes (circles, squares, triangles) as building blocks in art',  'VA:Cr2.1.K', 4),
  ('50000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_self_portrait',          'Self-Portrait',                  'Create a self-portrait that includes recognizable features',                 'VA:Cr1.1.K', 5),
  ('50000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_explore_materials',      'Exploring Art Materials',        'Engage in exploration and imaginative play with different art materials',    'VA:Cr1.2.K', 6),
  ('50000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_art_in_world',           'Art in Our World',               'Identify uses of art within personal environment (home, school, nature)',    'VA:Re7.1.K', 7),
  ('50000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'k_favorite_artwork',       'Choosing Favorite Art',          'Explain reasons for selecting a preferred artwork',                          'VA:Re9.1.K', 8);


-- =========================================================================
-- 6. Problem Solving Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000006)
--    Aligned to CC Mathematical Practices + ISTE Computational Thinking
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('60000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_ab_patterns',            'AB Patterns',                    'Recognize, describe, and extend simple AB repeating patterns',              'K.CC readiness', 1),
  ('60000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_abc_patterns',           'ABC Patterns',                   'Recognize, describe, and extend ABC and ABB patterns',                      'K.CC readiness', 2),
  ('60000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_sorting_by_attribute',   'Sorting by Attribute',           'Sort objects by color, shape, or size and explain the sorting rule',        'K.MD.B.3',       3),
  ('60000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_what_comes_next',        'What Comes Next?',               'Predict the next element in a sequence or pattern',                         'ISTE: CT',       4),
  ('60000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_odd_one_out',            'Odd One Out',                    'Identify which item does not belong in a group and explain why',            'ISTE: CT',       5),
  ('60000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_classify_and_count',     'Classify and Count',             'Classify objects into categories and count objects in each category',       'K.MD.B.3',       6),
  ('60000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_simple_logic',           'Simple Logic',                   'Use if-then reasoning to solve simple problems (if it rains, we need...)',  'ISTE: CT',       7),
  ('60000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'k_perseverance',           'Sticking With It',               'Practice perseverance when a problem is hard — try different approaches',   'MP.1',           8);


-- =========================================================================
-- 7. Coding Kindergarten Skills (subject: 00000000-0000-4000-8000-000000000007)
--    Aligned to CSTA K-2 (1A) Standards
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('70000100-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_step_by_step',           'Step-by-Step Instructions',      'Create and follow step-by-step instructions to complete a task',            '1A-AP-08',  1),
  ('70000100-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_directions',             'Left, Right, Up, Down',          'Give and follow directional commands (left, right, up, down, forward)',     '1A-AP-08',  2),
  ('70000100-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_simple_sequences',       'Simple Sequences',               'Arrange a set of instructions in the correct order to solve a problem',    '1A-AP-09',  3),
  ('70000100-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_debugging_intro',        'Finding & Fixing Mistakes',      'Identify and correct errors in a simple sequence of instructions',         '1A-AP-11',  4),
  ('70000100-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_repeating_actions',      'Repeating Actions',              'Recognize when an action repeats and describe the pattern',                '1A-AP-10',  5),
  ('70000100-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_what_computers_do',      'What Computers Do',              'Describe how people use computers and technology in daily life',           '1A-CS-01',  6),
  ('70000100-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_input_output',           'Input and Output',               'Identify input (what goes in) and output (what comes out) of a program',   '1A-CS-02',  7),
  ('70000100-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'k_expressing_ideas',       'Expressing Ideas',               'Use drawings or words to describe a simple algorithm or plan',             '1A-AP-12',  8);
