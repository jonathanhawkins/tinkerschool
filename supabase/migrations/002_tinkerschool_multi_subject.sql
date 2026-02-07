-- =============================================================================
-- TinkerSchool — Multi-Subject Evolution Migration
-- =============================================================================
-- Extends the CodeBuddy schema to support TinkerSchool's multi-subject
-- curriculum. Adds subjects, skills, learning profiles, skill proficiency
-- tracking, artifacts (shareable creations), and artifact ratings.
--
-- Also alters existing tables (modules, lessons, chat_sessions) to link
-- into the new subject system.
--
-- Depends on: 001_initial_schema.sql (families, profiles, modules, lessons,
--   chat_sessions, helper functions: requesting_clerk_id(),
--   requesting_family_id(), requesting_user_is_parent(), set_updated_at())
-- =============================================================================


-- =========================================================================
-- TABLE: subjects
-- =========================================================================
CREATE TABLE public.subjects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  name       text NOT NULL,
  display_name text NOT NULL,
  color      text NOT NULL,
  icon       text NOT NULL,
  sort_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Subjects are readable by all authenticated users.
CREATE POLICY "subjects_select_authenticated"
  ON public.subjects
  FOR SELECT
  USING (true);


-- =========================================================================
-- TABLE: skills
-- =========================================================================
CREATE TABLE public.skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id    uuid NOT NULL REFERENCES public.subjects(id),
  slug          text NOT NULL,
  name          text NOT NULL,
  description   text,
  standard_code text,
  sort_order    integer NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject_id, slug)
);

CREATE INDEX idx_skills_subject_id ON public.skills(subject_id);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Skills are readable by all authenticated users.
CREATE POLICY "skills_select_authenticated"
  ON public.skills
  FOR SELECT
  USING (true);


-- =========================================================================
-- TABLE: learning_profiles
-- =========================================================================
CREATE TABLE public.learning_profiles (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id               uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  learning_style           jsonb NOT NULL DEFAULT '{}'::jsonb,
  interests                text[] NOT NULL DEFAULT '{}',
  preferred_session_length integer,
  preferred_encouragement  text NOT NULL DEFAULT 'enthusiastic',
  chip_notes               text,
  updated_at               timestamptz NOT NULL DEFAULT now(),
  created_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_learning_profiles_profile_id ON public.learning_profiles(profile_id);

ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;

-- Kids can read their own learning profile.
CREATE POLICY "learning_profiles_select_own"
  ON public.learning_profiles
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all learning profiles in the family.
CREATE POLICY "learning_profiles_select_family_parent"
  ON public.learning_profiles
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Kids can update their own learning profile.
CREATE POLICY "learning_profiles_update_own"
  ON public.learning_profiles
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Inserts: users can insert their own learning profile.
CREATE POLICY "learning_profiles_insert_own"
  ON public.learning_profiles
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Trigger: auto-update `updated_at`
CREATE TRIGGER trg_learning_profiles_updated_at
  BEFORE UPDATE ON public.learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- =========================================================================
-- TABLE: skill_proficiency
-- =========================================================================
CREATE TABLE public.skill_proficiency (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id       uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  level          text NOT NULL DEFAULT 'not_started'
                   CHECK (level IN ('not_started', 'beginning', 'developing', 'proficient', 'mastered')),
  attempts       integer NOT NULL DEFAULT 0,
  correct        integer NOT NULL DEFAULT 0,
  last_practiced timestamptz,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, skill_id)
);

CREATE INDEX idx_skill_proficiency_profile_id ON public.skill_proficiency(profile_id);
CREATE INDEX idx_skill_proficiency_skill_id ON public.skill_proficiency(skill_id);

ALTER TABLE public.skill_proficiency ENABLE ROW LEVEL SECURITY;

-- Kids can read their own skill proficiency.
CREATE POLICY "skill_proficiency_select_own"
  ON public.skill_proficiency
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all skill proficiency in the family.
CREATE POLICY "skill_proficiency_select_family_parent"
  ON public.skill_proficiency
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Kids can insert their own skill proficiency rows.
CREATE POLICY "skill_proficiency_insert_own"
  ON public.skill_proficiency
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can update their own skill proficiency rows.
CREATE POLICY "skill_proficiency_update_own"
  ON public.skill_proficiency
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Trigger: auto-update `updated_at`
CREATE TRIGGER trg_skill_proficiency_updated_at
  BEFORE UPDATE ON public.skill_proficiency
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- =========================================================================
-- TABLE: artifacts
-- =========================================================================
CREATE TABLE public.artifacts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  description       text,
  type              text NOT NULL
                      CHECK (type IN ('web_widget', 'device_program', 'hybrid', 'printable', 'audio')),
  subject_id        uuid REFERENCES public.subjects(id),
  skill_ids         uuid[] NOT NULL DEFAULT '{}',
  grade_level       integer,
  tags              text[] NOT NULL DEFAULT '{}',
  content           jsonb NOT NULL,
  device_required   boolean NOT NULL DEFAULT false,
  difficulty        text
                      CHECK (difficulty IN ('seed', 'sprout', 'bloom', 'flourish')),
  created_by        uuid REFERENCES public.profiles(id),
  created_by_chip   boolean NOT NULL DEFAULT false,
  source_profile_id uuid REFERENCES public.profiles(id),
  rating_avg        decimal(3,2) NOT NULL DEFAULT 0,
  rating_count      integer NOT NULL DEFAULT 0,
  is_public         boolean NOT NULL DEFAULT true,
  family_id         uuid REFERENCES public.families(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_artifacts_subject_id ON public.artifacts(subject_id);
CREATE INDEX idx_artifacts_created_by ON public.artifacts(created_by);
CREATE INDEX idx_artifacts_family_id ON public.artifacts(family_id);
CREATE INDEX idx_artifacts_source_profile_id ON public.artifacts(source_profile_id);
CREATE INDEX idx_artifacts_is_public ON public.artifacts(is_public);

ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

-- Public artifacts are readable by all authenticated users.
CREATE POLICY "artifacts_select_public"
  ON public.artifacts
  FOR SELECT
  USING (is_public = true);

-- Family artifacts are readable by family members.
CREATE POLICY "artifacts_select_family"
  ON public.artifacts
  FOR SELECT
  USING (
    family_id = requesting_family_id()
  );

-- Authenticated users can insert artifacts.
CREATE POLICY "artifacts_insert_authenticated"
  ON public.artifacts
  FOR INSERT
  WITH CHECK (
    created_by IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Users can update their own artifacts.
CREATE POLICY "artifacts_update_own"
  ON public.artifacts
  FOR UPDATE
  USING (
    created_by IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can update any artifact in the family.
CREATE POLICY "artifacts_update_family_parent"
  ON public.artifacts
  FOR UPDATE
  USING (
    family_id = requesting_family_id()
    AND requesting_user_is_parent()
  );

-- Trigger: auto-update `updated_at`
CREATE TRIGGER trg_artifacts_updated_at
  BEFORE UPDATE ON public.artifacts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- =========================================================================
-- TABLE: artifact_ratings
-- =========================================================================
CREATE TABLE public.artifact_ratings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id uuid NOT NULL REFERENCES public.artifacts(id) ON DELETE CASCADE,
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating      integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artifact_id, profile_id)
);

CREATE INDEX idx_artifact_ratings_artifact_id ON public.artifact_ratings(artifact_id);
CREATE INDEX idx_artifact_ratings_profile_id ON public.artifact_ratings(profile_id);

ALTER TABLE public.artifact_ratings ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all ratings.
CREATE POLICY "artifact_ratings_select_authenticated"
  ON public.artifact_ratings
  FOR SELECT
  USING (true);

-- Users can insert their own ratings.
CREATE POLICY "artifact_ratings_insert_own"
  ON public.artifact_ratings
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Users can update their own ratings.
CREATE POLICY "artifact_ratings_update_own"
  ON public.artifact_ratings
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );


-- =========================================================================
-- ALTER: modules — add subject_id
-- =========================================================================
ALTER TABLE public.modules
  ADD COLUMN subject_id uuid REFERENCES public.subjects(id);

CREATE INDEX idx_modules_subject_id ON public.modules(subject_id);


-- =========================================================================
-- ALTER: lessons — add multi-subject columns
-- =========================================================================
ALTER TABLE public.lessons
  ADD COLUMN subject_id uuid REFERENCES public.subjects(id);

ALTER TABLE public.lessons
  ADD COLUMN skills_covered uuid[] NOT NULL DEFAULT '{}';

ALTER TABLE public.lessons
  ADD COLUMN lesson_type text NOT NULL DEFAULT 'interactive'
    CHECK (lesson_type IN ('interactive', 'quiz', 'creative', 'capstone'));

ALTER TABLE public.lessons
  ADD COLUMN device_required boolean NOT NULL DEFAULT false;

ALTER TABLE public.lessons
  ADD COLUMN device_features text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.lessons
  ADD COLUMN simulator_support boolean NOT NULL DEFAULT true;

ALTER TABLE public.lessons
  ADD COLUMN estimated_minutes integer NOT NULL DEFAULT 15;

ALTER TABLE public.lessons
  ADD COLUMN content jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX idx_lessons_subject_id ON public.lessons(subject_id);


-- =========================================================================
-- ALTER: chat_sessions — add subject context
-- =========================================================================
ALTER TABLE public.chat_sessions
  ADD COLUMN subject_id uuid REFERENCES public.subjects(id);

CREATE INDEX idx_chat_sessions_subject_id ON public.chat_sessions(subject_id);
