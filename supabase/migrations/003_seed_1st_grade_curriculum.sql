-- =============================================================================
-- TinkerSchool -- Seed 1st Grade Curriculum
-- =============================================================================
-- Seeds the initial TinkerSchool 1st grade curriculum data:
--   - 7 subjects (Math, Reading, Science, Music, Art, Problem Solving, Coding)
--   - 10 skills per subject (70 total)
--   - 7 modules (one per subject, band=1)
--   - 12 TinkerSchool-specific badges
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills tables,
--   modules.subject_id column)
--
-- All UUIDs are deterministic and hex-only (0-9, a-f).
-- =============================================================================


-- =========================================================================
-- 1. SUBJECTS
-- =========================================================================
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'math',            'Number World',   'Math',            '#3B82F6', 'calculator',    1),
  ('00000000-0000-4000-8000-000000000002', 'reading',         'Word World',     'Reading',         '#22C55E', 'book-open',     2),
  ('00000000-0000-4000-8000-000000000003', 'science',         'Discovery Lab',  'Science',         '#F97316', 'flask-conical', 3),
  ('00000000-0000-4000-8000-000000000004', 'music',           'Sound Studio',   'Music',           '#A855F7', 'music',         4),
  ('00000000-0000-4000-8000-000000000005', 'art',             'Pixel Studio',   'Art',             '#EC4899', 'palette',       5),
  ('00000000-0000-4000-8000-000000000006', 'problem_solving', 'Puzzle Lab',     'Problem Solving', '#EAB308', 'puzzle',        6),
  ('00000000-0000-4000-8000-000000000007', 'coding',          'Code Lab',       'Coding',          '#14B8A6', 'code',          7);


-- =========================================================================
-- 2. SKILLS
-- =========================================================================

-- -------------------------------------------------------------------------
-- 2a. Math Skills (subject prefix: 10)
--     Aligned to Common Core Grade 1
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('10000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'counting_to_120',       'Counting to 120',                 'Count to 120, starting at any number less than 120',                 '1.NBT.A.1', 1),
  ('10000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'number_recognition',    'Number Recognition',               'Read and write numerals and represent a number of objects',          '1.NBT.A.1', 2),
  ('10000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'addition_within_10',    'Addition within 10',               'Add within 10 using objects, drawings, and equations',               '1.OA.A.1',  3),
  ('10000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'subtraction_within_10', 'Subtraction within 10',            'Subtract within 10 using objects, drawings, and equations',          '1.OA.A.1',  4),
  ('10000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'place_value_tens_ones', 'Place Value (Tens and Ones)',       'Understand that two-digit numbers are composed of tens and ones',    '1.NBT.B.2', 5),
  ('10000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'addition_within_20',    'Addition within 20',               'Add within 20 using strategies such as counting on and making 10',   '1.OA.C.6',  6),
  ('10000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'shapes_2d',             '2D Shapes and Attributes',         'Distinguish between defining attributes of shapes',                  '1.G.A.1',   7),
  ('10000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'measuring_lengths',     'Measuring Lengths',                'Order three objects by length and compare lengths indirectly',       '1.MD.A.1',  8),
  ('10000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'telling_time_hours',    'Telling Time (Hours)',             'Tell and write time in hours using analog and digital clocks',       '1.MD.B.3',  9),
  ('10000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'number_patterns',       'Number Patterns',                  'Determine the unknown number in addition and subtraction equations', '1.OA.C.5',  10);

-- -------------------------------------------------------------------------
-- 2b. Reading Skills (subject prefix: 20)
--     Aligned to Common Core ELA Grade 1
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('20000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'phonics_consonants',     'Consonant Sounds',          'Identify and produce consonant sounds in words',                   'RF.1.2',   1),
  ('20000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'phonics_vowels',         'Short Vowel Sounds',        'Identify and produce short vowel sounds in words',                 'RF.1.2',   2),
  ('20000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'blending_cvc',           'Blending CVC Words',        'Blend consonant-vowel-consonant sounds to read simple words',      'RF.1.2.B', 3),
  ('20000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'sight_words_tier1',      'Sight Words (Tier 1)',      'Recognize and read common high-frequency sight words',             'RF.1.3.G', 4),
  ('20000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'rhyming_words',          'Rhyming Words',             'Recognize and produce rhyming words',                              'RF.1.2.A', 5),
  ('20000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'spelling_common',        'Spelling Common Words',     'Spell untaught words phonetically using phonemic awareness',       'L.1.2.D',  6),
  ('20000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'sentence_structure',     'Sentence Structure',        'Produce and expand complete simple and compound sentences',        'L.1.1.J',  7),
  ('20000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'story_sequencing',       'Story Sequencing',          'Retell stories with key details in correct sequence',              'RL.1.2',   8),
  ('20000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'reading_comprehension',  'Reading Comprehension',     'Ask and answer questions about key details in a text',             'RL.1.1',   9),
  ('20000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'word_families',          'Word Families',             'Decode words using common spelling patterns and word families',    'RF.1.3',   10);

-- -------------------------------------------------------------------------
-- 2c. Science Skills (subject prefix: 30)
--     Aligned to NGSS Grade 1
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('30000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'sound_vibration',          'Sound and Vibration',          'Plan and conduct investigations to show that vibrating materials make sound', '1-PS4-1',  1),
  ('30000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'volume_pitch',             'Volume and Pitch',             'Investigate how different vibrations produce different sounds',               '1-PS4-1',  2),
  ('30000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'light_shadow',             'Light and Shadows',            'Plan and conduct investigations to determine the effect of light on objects', '1-PS4-2',  3),
  ('30000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'plant_parts',              'Plant Parts and Needs',        'Understand that plants have external parts that help them survive and grow',  '1-LS1-1',  4),
  ('30000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'animal_needs',             'Animal Needs and Homes',       'Understand that animals have body parts that help them survive',              '1-LS1-1',  5),
  ('30000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'weather_observation',      'Weather Observation',          'Use simple tools to observe and record local weather conditions',            '1-ESS1',   6),
  ('30000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'sky_patterns',             'Sky Patterns (Sun/Moon)',       'Use observations of the sun, moon, and stars to describe predictable patterns', '1-ESS1-1', 7),
  ('30000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'heredity_traits',          'Parent-Offspring Traits',      'Make observations to construct evidence that young plants and animals resemble their parents', '1-LS3-1', 8),
  ('30000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'habitat_design',           'Habitat Design',               'Design a solution to a human problem by mimicking how plants and animals survive', '1-LS1-2', 9),
  ('30000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 'scientific_observation',   'Scientific Observation',       'Use senses and simple tools to make observations and gather information',     NULL,       10);

-- -------------------------------------------------------------------------
-- 2d. Music Skills (subject prefix: 40)
--     Aligned to National Core Arts Standards
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('40000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'note_names',                  'Musical Note Names (Do Re Mi)', 'Identify and use solfege note names (Do, Re, Mi, Fa, Sol, La, Ti)',  NULL, 1),
  ('40000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'pitch_high_low',              'High and Low Pitch',            'Distinguish between high and low pitched sounds',                    NULL, 2),
  ('40000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'steady_beat',                 'Keeping a Steady Beat',         'Maintain a steady beat using body percussion or instruments',        NULL, 3),
  ('40000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'pattern_recognition_music',   'Musical Pattern Recognition',   'Identify and create repeating musical patterns',                     NULL, 4),
  ('40000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'tempo_fast_slow',             'Fast and Slow (Tempo)',         'Identify and demonstrate fast and slow tempos in music',             NULL, 5),
  ('40000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'dynamics_loud_soft',          'Loud and Soft (Dynamics)',       'Identify and demonstrate loud and soft dynamics in music',           NULL, 6),
  ('40000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'simple_composition',          'Simple Composition (4 notes)',  'Create a simple musical composition using up to 4 notes',           NULL, 7),
  ('40000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'rhythm_notation',             'Basic Rhythm Notation',         'Read and write basic rhythm patterns using simple notation',         NULL, 8),
  ('40000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'music_math_connection',       'Music-Math Patterns',           'Explore connections between musical patterns and mathematical concepts', NULL, 9),
  ('40000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'performance',                 'Musical Performance',           'Perform a simple musical piece for an audience',                     NULL, 10);

-- -------------------------------------------------------------------------
-- 2e. Art Skills (subject prefix: 50)
--     Aligned to National Core Arts Standards
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('50000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'pixel_basics',        'Understanding Pixels',        'Understand that digital images are made of tiny colored squares called pixels', NULL, 1),
  ('50000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'color_mixing_rgb',    'Color Mixing (RGB)',          'Mix colors using the RGB color model on digital displays',                     NULL, 2),
  ('50000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'basic_shapes_art',    'Shapes and Lines in Art',     'Use basic shapes and lines as building blocks for artistic compositions',      NULL, 3),
  ('50000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'pattern_creation',    'Creating Patterns',           'Design and create repeating visual patterns using shapes and colors',          NULL, 4),
  ('50000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'symmetry',            'Symmetry in Art',             'Identify and create symmetrical designs in art and nature',                    NULL, 5),
  ('50000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'pixel_art_creation',  'Pixel Art Creation',          'Create pixel art images on the M5Stick display using small filled rectangles', NULL, 6),
  ('50000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'animation_basics',    'Animation Basics (Frames)',   'Understand how animation works by creating a sequence of frames',              NULL, 7),
  ('50000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'color_mood',          'Color and Mood',              'Explore how different colors can express different moods and feelings',        NULL, 8),
  ('50000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'coordinates_art',     'Coordinates in Art',          'Use x and y coordinates to position elements in digital artwork',             NULL, 9),
  ('50000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000005', 'creative_expression', 'Creative Expression',         'Express personal ideas and stories through original digital artwork',          NULL, 10);

-- -------------------------------------------------------------------------
-- 2f. Problem Solving Skills (subject prefix: 60)
--     Aligned to ISTE Standards
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('60000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'pattern_recognition',       'Pattern Recognition',       'Identify repeating patterns in numbers, shapes, and everyday life',              NULL, 1),
  ('60000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'sequencing',                'Event Sequencing',          'Arrange events or steps in a logical order',                                     NULL, 2),
  ('60000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'classification',            'Classification and Sorting', 'Group objects by shared attributes and explain sorting rules',                   NULL, 3),
  ('60000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'cause_effect',              'Cause and Effect',          'Identify cause-and-effect relationships in simple scenarios',                    NULL, 4),
  ('60000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'decomposition',             'Problem Decomposition',     'Break a large problem into smaller, manageable parts',                           NULL, 5),
  ('60000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'spatial_reasoning',         'Spatial Reasoning',         'Reason about shapes, positions, and spatial relationships',                      NULL, 6),
  ('60000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'algorithmic_thinking',      'Step-by-Step Instructions', 'Create and follow precise step-by-step instructions to complete a task',         NULL, 7),
  ('60000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'logical_reasoning',         'Logical Reasoning',         'Use if-then reasoning to draw conclusions from given information',               NULL, 8),
  ('60000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'creative_problem_solving',  'Creative Problem Solving',  'Generate multiple possible solutions to an open-ended problem',                  NULL, 9),
  ('60000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000006', 'puzzle_solving',            'Puzzle Solving',            'Apply strategies to solve age-appropriate logic and spatial puzzles',            NULL, 10);

-- -------------------------------------------------------------------------
-- 2g. Coding Skills (subject prefix: 70)
--     Aligned to CSTA/ISTE Standards
-- -------------------------------------------------------------------------
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('70000001-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'what_is_computer',       'What is a Computer?',             'Identify what a computer is and describe its basic components',       '1A-CS-01',  1),
  ('70000001-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'instructions_sequence',  'Instructions and Sequence',       'Understand that computers follow instructions in a specific order',   '1A-AP-09',  2),
  ('70000001-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'text_display',           'Displaying Text and Graphics',    'Write code to display text and simple graphics on a screen',          '1A-AP-10',  3),
  ('70000001-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'loops_patterns',         'Loops and Patterns',              'Use loops to repeat instructions and create patterns efficiently',    '1A-AP-10',  4),
  ('70000001-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'sensor_input',           'Sensor Input',                    'Use sensor data as input to control program behavior',                '1A-AP-09',  5),
  ('70000001-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'conditionals_basic',     'Basic Conditionals',              'Use if-then statements to make programs respond to different conditions', '1A-AP-10', 6),
  ('70000001-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'events_randomness',      'Events and Randomness',           'Use events and random numbers to add variety and interactivity',      '1A-AP-11',  7),
  ('70000001-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'animation_coding',       'Animation with Code',             'Create simple animations by changing display output in a loop',       '1A-AP-10',  8),
  ('70000001-0009-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'creative_coding',        'Creative Coding',                 'Combine coding concepts to create an original interactive project',   '1A-AP-15',  9),
  ('70000001-000a-4000-8000-000000000001', '00000000-0000-4000-8000-000000000007', 'presenting_projects',    'Presenting Projects',             'Share and explain a coding project to others',                        '1A-AP-14',  10);


-- =========================================================================
-- 3. MODULES (one per subject, band=1 for 1st grade)
-- =========================================================================
INSERT INTO public.modules (id, band, order_num, title, description, icon, subject_id)
VALUES
  ('00000001-0001-4000-8000-000000000001', 1, 1, 'Number World: Grade 1',      'Explore counting, addition, subtraction, shapes, and patterns through interactive lessons on your M5Stick.',          'calculator',    '00000000-0000-4000-8000-000000000001'),
  ('00000001-0002-4000-8000-000000000001', 1, 2, 'Word World: Grade 1',        'Learn letter sounds, sight words, rhyming, and reading comprehension through fun word games and stories.',             'book-open',     '00000000-0000-4000-8000-000000000002'),
  ('00000001-0003-4000-8000-000000000001', 1, 3, 'Discovery Lab: Grade 1',     'Investigate sound, light, plants, animals, and weather through hands-on science experiments with your device.',         'flask-conical', '00000000-0000-4000-8000-000000000003'),
  ('00000001-0004-4000-8000-000000000001', 1, 4, 'Sound Studio: Grade 1',      'Discover musical notes, rhythm, tempo, and dynamics by turning your M5Stick into a musical instrument.',               'music',         '00000000-0000-4000-8000-000000000004'),
  ('00000001-0005-4000-8000-000000000001', 1, 5, 'Pixel Studio: Grade 1',      'Create pixel art, explore color mixing, symmetry, and animation on your tiny digital canvas.',                        'palette',       '00000000-0000-4000-8000-000000000005'),
  ('00000001-0006-4000-8000-000000000001', 1, 6, 'Puzzle Lab: Grade 1',        'Build critical thinking skills through patterns, sequencing, sorting, logic puzzles, and creative problem solving.',   'puzzle',        '00000000-0000-4000-8000-000000000006'),
  ('00000001-0007-4000-8000-000000000001', 1, 7, 'Code Lab: Grade 1',          'Start your coding journey! Learn what computers do, write your first programs, and create interactive projects.',      'code',          '00000000-0000-4000-8000-000000000007');


-- =========================================================================
-- 4. BADGES (TinkerSchool-specific)
-- =========================================================================
INSERT INTO public.badges (id, name, description, icon, criteria)
VALUES
  (
    '00000000-0000-4000-b001-000000000001',
    'Welcome to TinkerSchool',
    'You logged in for the first time! Your learning adventure begins now!',
    'door-open',
    '{"type": "first_login", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000002',
    'First Lesson',
    'You completed your very first lesson! Every expert was once a beginner.',
    'book-check',
    '{"type": "lesson_complete", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000003',
    'Math Explorer',
    'You completed your first math lesson! Numbers are your new best friends.',
    'calculator',
    '{"type": "subject_lesson_complete", "subject": "math", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000004',
    'Word Wizard',
    'You completed your first reading lesson! Words are powerful magic.',
    'book-open',
    '{"type": "subject_lesson_complete", "subject": "reading", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000005',
    'Science Scout',
    'You completed your first science lesson! Curiosity is your superpower.',
    'flask-conical',
    '{"type": "subject_lesson_complete", "subject": "science", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000006',
    'Music Maker',
    'You completed your first music lesson! Let the rhythm move you.',
    'music',
    '{"type": "subject_lesson_complete", "subject": "music", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000007',
    'Pixel Artist',
    'You completed your first art lesson! Every pixel tells a story.',
    'palette',
    '{"type": "subject_lesson_complete", "subject": "art", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000008',
    'Puzzle Master',
    'You completed your first problem solving lesson! Your brain is getting stronger.',
    'puzzle',
    '{"type": "subject_lesson_complete", "subject": "problem_solving", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-000000000009',
    'Code Cadet',
    'You completed your first coding lesson! You are officially a coder.',
    'code',
    '{"type": "subject_lesson_complete", "subject": "coding", "threshold": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-00000000000a',
    'Cross-Subject Star',
    'You completed a lesson in 3 or more subjects! You are a well-rounded learner.',
    'star',
    '{"type": "cross_subject", "threshold": 3}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-00000000000b',
    'First Week Champion',
    'You completed 5 lessons in your first week! What an incredible start.',
    'trophy',
    '{"type": "weekly_lessons", "threshold": 5, "week": 1}'::jsonb
  ),
  (
    '00000000-0000-4000-b001-00000000000c',
    'Device Flash Hero',
    'You flashed code to your M5StickC Plus 2! Hardware programming unlocked.',
    'zap',
    '{"type": "device_flash", "threshold": 1}'::jsonb
  );
