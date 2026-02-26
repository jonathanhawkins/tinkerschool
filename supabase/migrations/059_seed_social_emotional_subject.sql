-- =============================================================================
-- TinkerSchool -- Seed Social-Emotional Learning Subject
-- =============================================================================
-- Adds a new subject "Feelings & Friends" (Social-Emotional Learning) with
-- 8 Pre-K-aligned skills based on CASEL (Collaborative for Academic, Social,
-- and Emotional Learning) framework.
--
-- Learn about emotions, kindness, sharing, and being a good friend.
--
-- UUID scheme:
--   Subject: 00000000-0000-4000-8000-000000000008 (8th subject)
--   Skills:  80000000-000N-4000-8000-000000000001 (prefix 80, Pre-K grade 000000)
--
-- Depends on: 002_tinkerschool_multi_subject.sql (subjects, skills tables)
-- =============================================================================


-- =========================================================================
-- 1. SUBJECT
-- =========================================================================
INSERT INTO public.subjects (id, slug, name, display_name, color, icon, sort_order)
VALUES
  ('00000000-0000-4000-8000-000000000008', 'social_emotional', 'Feelings & Friends', 'Social-Emotional', '#F472B6', 'heart-handshake', 8);


-- =========================================================================
-- 2. SKILLS (CASEL-aligned, Pre-K level)
-- =========================================================================
INSERT INTO public.skills (id, subject_id, slug, name, description, standard_code, sort_order)
VALUES
  ('80000000-0001-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'naming_emotions',              'Naming Emotions',                  'Identify and name basic emotions (happy, sad, angry, scared, surprised)',                     'CASEL: Self-Awareness',     1),
  ('80000000-0002-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'recognizing_emotions_others',  'Recognizing Emotions in Others',   'Look at faces and body language to tell how someone feels',                                   'CASEL: Social Awareness',   2),
  ('80000000-0003-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'calm_down_strategies',         'Calm-Down Strategies',             'Practice breathing, counting to 5, or squeeze and release to manage big feelings',           'CASEL: Self-Management',    3),
  ('80000000-0004-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'taking_turns',                 'Taking Turns',                     'Practice waiting and sharing through structured games',                                       'CASEL: Relationship Skills', 4),
  ('80000000-0005-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'asking_for_help',              'Asking for Help',                  'Know when and how to ask a grown-up or friend for help',                                      'CASEL: Relationship Skills', 5),
  ('80000000-0006-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'kindness_actions',             'Kindness Actions',                 'Identify kind actions like sharing, comforting, and helping',                                 'CASEL: Social Awareness',   6),
  ('80000000-0007-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'following_routines',           'Following Routines',               'Understand and follow simple daily routines',                                                 'CASEL: Self-Management',    7),
  ('80000000-0008-4000-8000-000000000001', '00000000-0000-4000-8000-000000000008', 'expressing_needs',             'Expressing Needs',                 'Use words to say what you need instead of crying or acting out',                              'CASEL: Self-Management',    8);
