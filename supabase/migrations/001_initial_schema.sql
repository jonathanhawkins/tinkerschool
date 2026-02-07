-- =============================================================================
-- CodeBuddy — Initial Schema Migration
-- =============================================================================
-- Creates all core tables, enables RLS, and installs RLS policies.
--
-- Auth model:
--   Clerk manages authentication. Every Clerk user has a matching row in
--   `profiles` keyed by `clerk_id`. Families map to Clerk Organizations via
--   `clerk_org_id`.
--
-- RLS convention:
--   Policies reference `auth.jwt() ->> 'sub'` as the current Clerk user id
--   and compare against `profiles.clerk_id`. Until Clerk JWT integration is
--   wired up, server-side queries use the service-role key (bypasses RLS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: create an immutable function that extracts the Clerk user id
-- from the Supabase JWT so RLS policies stay readable.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION requesting_clerk_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::json ->> 'sub',
    ''
  );
$$;

-- ---------------------------------------------------------------------------
-- Helper: look up the family_id for the current requesting user.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION requesting_family_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT family_id
  FROM public.profiles
  WHERE clerk_id = requesting_clerk_id()
  LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- Helper: check if the requesting user is a parent.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION requesting_user_is_parent()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE clerk_id = requesting_clerk_id()
      AND role = 'parent'
  );
$$;

-- =========================================================================
-- TABLE: families
-- =========================================================================
CREATE TABLE public.families (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id text NOT NULL UNIQUE,
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Members of a family can read their own family row.
CREATE POLICY "family_select_own"
  ON public.families
  FOR SELECT
  USING (id = requesting_family_id());

-- Only parents can update their family name.
CREATE POLICY "family_update_parent"
  ON public.families
  FOR UPDATE
  USING (id = requesting_family_id() AND requesting_user_is_parent());

-- =========================================================================
-- TABLE: profiles
-- =========================================================================
CREATE TABLE public.profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id     text NOT NULL UNIQUE,
  family_id    uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_id    text NOT NULL DEFAULT 'default',
  role         text NOT NULL CHECK (role IN ('parent', 'kid')),
  grade_level  int,
  current_band int NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_clerk_id ON public.profiles(clerk_id);
CREATE INDEX idx_profiles_family_id ON public.profiles(family_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kids can read their own profile.
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (clerk_id = requesting_clerk_id());

-- Parents can read all profiles in their family.
CREATE POLICY "profiles_select_family_parent"
  ON public.profiles
  FOR SELECT
  USING (
    family_id = requesting_family_id()
    AND requesting_user_is_parent()
  );

-- Users can update their own profile.
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (clerk_id = requesting_clerk_id());

-- Parents can update any profile in the family (e.g. manage kid accounts).
CREATE POLICY "profiles_update_family_parent"
  ON public.profiles
  FOR UPDATE
  USING (
    family_id = requesting_family_id()
    AND requesting_user_is_parent()
  );

-- Profile inserts are done via the admin client (Clerk webhook), so no
-- INSERT policy is needed for regular users.

-- =========================================================================
-- TABLE: modules (curriculum)
-- =========================================================================
CREATE TABLE public.modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band        int NOT NULL,
  order_num   int NOT NULL,
  title       text NOT NULL,
  description text NOT NULL,
  icon        text NOT NULL DEFAULT 'book',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (band, order_num)
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Curriculum modules are publicly readable by any authenticated user.
CREATE POLICY "modules_select_authenticated"
  ON public.modules
  FOR SELECT
  USING (true);

-- =========================================================================
-- TABLE: lessons
-- =========================================================================
CREATE TABLE public.lessons (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id         uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  order_num         int NOT NULL,
  title             text NOT NULL,
  description       text NOT NULL,
  story_text        text,
  starter_blocks_xml text,
  solution_code     text,
  hints             jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, order_num)
);

CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Lessons are publicly readable by any authenticated user.
CREATE POLICY "lessons_select_authenticated"
  ON public.lessons
  FOR SELECT
  USING (true);

-- =========================================================================
-- TABLE: projects
-- =========================================================================
CREATE TABLE public.projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id   uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title       text NOT NULL,
  blocks_xml  text,
  python_code text NOT NULL DEFAULT '',
  lesson_id   uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  is_public   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_profile_id ON public.projects(profile_id);
CREATE INDEX idx_projects_family_id ON public.projects(family_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Kids can read their own projects.
CREATE POLICY "projects_select_own"
  ON public.projects
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all projects in the family.
CREATE POLICY "projects_select_family_parent"
  ON public.projects
  FOR SELECT
  USING (
    family_id = requesting_family_id()
    AND requesting_user_is_parent()
  );

-- Anyone authenticated can read public projects (gallery).
CREATE POLICY "projects_select_public"
  ON public.projects
  FOR SELECT
  USING (is_public = true);

-- Kids can insert their own projects.
CREATE POLICY "projects_insert_own"
  ON public.projects
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can update their own projects.
CREATE POLICY "projects_update_own"
  ON public.projects
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can delete their own projects.
CREATE POLICY "projects_delete_own"
  ON public.projects
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- =========================================================================
-- TABLE: progress
-- =========================================================================
CREATE TABLE public.progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'not_started'
                 CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at   timestamptz,
  completed_at timestamptz,
  attempts     int NOT NULL DEFAULT 0,
  UNIQUE (profile_id, lesson_id)
);

CREATE INDEX idx_progress_profile_id ON public.progress(profile_id);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Kids can read their own progress.
CREATE POLICY "progress_select_own"
  ON public.progress
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all progress in the family.
CREATE POLICY "progress_select_family_parent"
  ON public.progress
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Kids can insert their own progress rows.
CREATE POLICY "progress_insert_own"
  ON public.progress
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can update their own progress rows.
CREATE POLICY "progress_update_own"
  ON public.progress
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- =========================================================================
-- TABLE: badges
-- =========================================================================
CREATE TABLE public.badges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text NOT NULL,
  icon        text NOT NULL DEFAULT 'star',
  criteria    jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Badges are publicly readable.
CREATE POLICY "badges_select_authenticated"
  ON public.badges
  FOR SELECT
  USING (true);

-- =========================================================================
-- TABLE: user_badges
-- =========================================================================
CREATE TABLE public.user_badges (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, badge_id)
);

CREATE INDEX idx_user_badges_profile_id ON public.user_badges(profile_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Kids can see their own badges.
CREATE POLICY "user_badges_select_own"
  ON public.user_badges
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can see badges for the whole family.
CREATE POLICY "user_badges_select_family_parent"
  ON public.user_badges
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Badge inserts are handled by server-side logic (admin client).

-- =========================================================================
-- TABLE: chat_sessions
-- =========================================================================
CREATE TABLE public.chat_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id  uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  messages   jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_sessions_profile_id ON public.chat_sessions(profile_id);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Kids can read their own chat sessions.
CREATE POLICY "chat_sessions_select_own"
  ON public.chat_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all chat sessions in the family (for review).
CREATE POLICY "chat_sessions_select_family_parent"
  ON public.chat_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Kids can insert their own chat sessions.
CREATE POLICY "chat_sessions_insert_own"
  ON public.chat_sessions
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can update their own chat sessions (append messages).
CREATE POLICY "chat_sessions_update_own"
  ON public.chat_sessions
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- =========================================================================
-- TABLE: device_sessions
-- =========================================================================
CREATE TABLE public.device_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_type     text NOT NULL,
  connected_at    timestamptz NOT NULL DEFAULT now(),
  disconnected_at timestamptz
);

CREATE INDEX idx_device_sessions_profile_id ON public.device_sessions(profile_id);

ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Kids can read their own device sessions.
CREATE POLICY "device_sessions_select_own"
  ON public.device_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Parents can read all device sessions in the family.
CREATE POLICY "device_sessions_select_family_parent"
  ON public.device_sessions
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE family_id = requesting_family_id()
    )
    AND requesting_user_is_parent()
  );

-- Kids can insert their own device sessions.
CREATE POLICY "device_sessions_insert_own"
  ON public.device_sessions
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- Kids can update their own device sessions (set disconnected_at).
CREATE POLICY "device_sessions_update_own"
  ON public.device_sessions
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = requesting_clerk_id()
    )
  );

-- =========================================================================
-- Trigger: auto-update `updated_at` on projects
-- =========================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
