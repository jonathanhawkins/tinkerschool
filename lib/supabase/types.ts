// =============================================================================
// Database Types for TinkerSchool Supabase Schema
// =============================================================================
// These types mirror the Supabase schema and are used by all Supabase clients.
// After schema changes, regenerate with:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
// =============================================================================

// ---------------------------------------------------------------------------
// Enum types
// ---------------------------------------------------------------------------

export type ProfileRole = "parent" | "kid";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type SkillLevel =
  | "not_started"
  | "beginning"
  | "developing"
  | "proficient"
  | "mastered";

export type LessonType = "interactive" | "quiz" | "creative" | "capstone";

export type ArtifactType =
  | "web_widget"
  | "device_program"
  | "hybrid"
  | "printable"
  | "audio";

export type DifficultyLevel = "seed" | "sprout" | "bloom" | "flourish";

export type SubjectSlug =
  | "math"
  | "reading"
  | "science"
  | "music"
  | "art"
  | "problem_solving"
  | "coding"
  | "social_emotional";

export type DeviceMode = "usb" | "wifi" | "simulator" | "none";

export type AdventureStatus = "pending" | "completed";

export type FeedbackCategory = "bug" | "feature_request" | "general";

export type FeedbackStatus =
  | "new"
  | "in_review"
  | "planned"
  | "resolved"
  | "closed";

export type NotificationType =
  | "lesson_completed"
  | "badge_earned"
  | "streak_milestone"
  | "level_up"
  | "system";

// ---------------------------------------------------------------------------
// Row types (what you get back from a SELECT)
// ---------------------------------------------------------------------------

export type SubscriptionTier = "free" | "supporter";

export interface Family {
  id: string;
  clerk_org_id: string;
  name: string;
  coppa_consent_given: boolean;
  coppa_consent_at: string | null;
  coppa_consent_ip: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  clerk_id: string;
  family_id: string;
  display_name: string;
  avatar_id: string;
  role: ProfileRole;
  grade_level: number | null;
  current_band: number;
  device_mode: DeviceMode;
  pin_hash: string | null;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  xp: number;
  level: number;
  created_at: string;
}

export interface Module {
  id: string;
  band: number;
  order_num: number;
  title: string;
  description: string;
  icon: string;
  subject_id: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  order_num: number;
  title: string;
  description: string;
  story_text: string | null;
  starter_blocks_xml: string | null;
  solution_code: string | null;
  hints: LessonHint[];
  subject_id: string | null;
  skills_covered: string[];
  lesson_type: LessonType;
  device_required: boolean;
  device_features: string[];
  simulator_support: boolean;
  simulator_compatible: boolean;
  estimated_minutes: number;
  content: Record<string, unknown>;
  created_at: string;
}

export interface LessonHint {
  order: number;
  text: string;
}

export interface Project {
  id: string;
  profile_id: string;
  family_id: string;
  title: string;
  blocks_xml: string | null;
  python_code: string;
  lesson_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  profile_id: string;
  lesson_id: string;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  attempts: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: string;
  threshold: number;
  [key: string]: unknown;
}

export interface UserBadge {
  id: string;
  profile_id: string;
  badge_id: string;
  earned_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  profile_id: string;
  lesson_id: string | null;
  subject_id: string | null;
  messages: ChatMessage[];
  created_at: string;
}

export interface DeviceSession {
  id: string;
  profile_id: string;
  device_type: string;
  connected_at: string;
  disconnected_at: string | null;
}

export interface Subject {
  id: string;
  slug: SubjectSlug;
  name: string;
  display_name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  subject_id: string;
  slug: string;
  name: string;
  description: string | null;
  standard_code: string | null;
  sort_order: number;
  created_at: string;
}

export interface LearningProfile {
  id: string;
  profile_id: string;
  learning_style: Record<string, number>;
  interests: string[];
  preferred_session_length: number | null;
  preferred_encouragement: string;
  chip_notes: string | null;
  updated_at: string;
  created_at: string;
}

export interface SkillProficiency {
  id: string;
  profile_id: string;
  skill_id: string;
  level: SkillLevel;
  attempts: number;
  correct: number;
  last_practiced: string | null;
  updated_at: string;
}

export interface Artifact {
  id: string;
  title: string;
  description: string | null;
  type: ArtifactType;
  subject_id: string | null;
  skill_ids: string[];
  grade_level: number | null;
  tags: string[];
  content: Record<string, unknown>;
  device_required: boolean;
  difficulty: DifficultyLevel | null;
  created_by: string | null;
  created_by_chip: boolean;
  source_profile_id: string | null;
  rating_avg: number;
  rating_count: number;
  is_public: boolean;
  family_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtifactRating {
  id: string;
  artifact_id: string;
  profile_id: string;
  rating: number;
  created_at: string;
}

export interface DailyAdventure {
  id: string;
  profile_id: string;
  subject_id: string;
  skill_ids: string[];
  title: string;
  description: string;
  story_text: string | null;
  content: Record<string, unknown>;
  subject_color: string;
  status: AdventureStatus;
  score: number | null;
  generated_at: string;
  expires_at: string;
  created_at: string;
}

export interface ActivitySession {
  id: string;
  profile_id: string;
  lesson_id: string | null;
  adventure_id: string | null;
  score: number;
  total_questions: number;
  correct_first_try: number;
  correct_total: number;
  time_seconds: number;
  hints_used: number;
  activity_data: unknown[];
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  family_id: string;
  recipient_profile_id: string;
  kid_profile_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  read: boolean;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  profile_id: string;
  family_id: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  status: FeedbackStatus;
  admin_notes: string | null;
  page_url: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserEvent {
  id: string;
  profile_id: string;
  family_id: string;
  event_name: string;
  event_data: Record<string, unknown> | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert types (what you pass to INSERT — omit server-generated fields)
// ---------------------------------------------------------------------------

export interface FamilyInsert {
  id?: string;
  clerk_org_id: string;
  name: string;
  coppa_consent_given?: boolean;
  coppa_consent_at?: string;
  coppa_consent_ip?: string;
  coppa_consent_method?: string;
  coppa_consent_confirmed_at?: string;
  stripe_customer_id?: string;
  subscription_tier?: SubscriptionTier;
  stripe_subscription_id?: string;
  stripe_subscription_status?: string;
  stripe_price_id?: string;
  stripe_current_period_end?: string;
  created_at?: string;
}

export interface ProfileInsert {
  id?: string;
  clerk_id: string;
  family_id: string;
  display_name: string;
  avatar_id: string;
  role: ProfileRole;
  grade_level?: number | null;
  current_band?: number;
  device_mode?: DeviceMode;
  pin_hash?: string | null;
  current_streak?: number;
  longest_streak?: number;
  last_activity_date?: string | null;
  xp?: number;
  level?: number;
  created_at?: string;
}

export interface ModuleInsert {
  id?: string;
  band: number;
  order_num: number;
  title: string;
  description: string;
  icon: string;
  subject_id?: string | null;
  created_at?: string;
}

export interface LessonInsert {
  id?: string;
  module_id: string;
  order_num: number;
  title: string;
  description: string;
  story_text?: string | null;
  starter_blocks_xml?: string | null;
  solution_code?: string | null;
  hints?: LessonHint[];
  subject_id?: string | null;
  skills_covered?: string[];
  lesson_type?: LessonType;
  device_required?: boolean;
  device_features?: string[];
  simulator_support?: boolean;
  simulator_compatible?: boolean;
  estimated_minutes?: number;
  content?: Record<string, unknown>;
  created_at?: string;
}

export interface ProjectInsert {
  id?: string;
  profile_id: string;
  family_id: string;
  title: string;
  blocks_xml?: string | null;
  python_code: string;
  lesson_id?: string | null;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressInsert {
  id?: string;
  profile_id: string;
  lesson_id: string;
  status?: ProgressStatus;
  started_at?: string | null;
  completed_at?: string | null;
  attempts?: number;
}

export interface BadgeInsert {
  id?: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
}

export interface UserBadgeInsert {
  id?: string;
  profile_id: string;
  badge_id: string;
  earned_at?: string;
}

export interface ChatSessionInsert {
  id?: string;
  profile_id: string;
  lesson_id?: string | null;
  subject_id?: string | null;
  messages?: ChatMessage[];
  created_at?: string;
}

export interface DeviceSessionInsert {
  id?: string;
  profile_id: string;
  device_type: string;
  connected_at?: string;
  disconnected_at?: string | null;
}

export interface SubjectInsert {
  id?: string;
  slug: SubjectSlug;
  name: string;
  display_name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at?: string;
}

export interface SkillInsert {
  id?: string;
  subject_id: string;
  slug: string;
  name: string;
  description?: string | null;
  standard_code?: string | null;
  sort_order: number;
  created_at?: string;
}

export interface LearningProfileInsert {
  id?: string;
  profile_id: string;
  learning_style?: Record<string, number>;
  interests?: string[];
  preferred_session_length?: number | null;
  preferred_encouragement?: string;
  chip_notes?: string | null;
  updated_at?: string;
  created_at?: string;
}

export interface SkillProficiencyInsert {
  id?: string;
  profile_id: string;
  skill_id: string;
  level?: SkillLevel;
  attempts?: number;
  correct?: number;
  last_practiced?: string | null;
  updated_at?: string;
}

export interface ArtifactInsert {
  id?: string;
  title: string;
  description?: string | null;
  type: ArtifactType;
  subject_id?: string | null;
  skill_ids?: string[];
  grade_level?: number | null;
  tags?: string[];
  content: Record<string, unknown>;
  device_required?: boolean;
  difficulty?: DifficultyLevel | null;
  created_by?: string | null;
  created_by_chip?: boolean;
  source_profile_id?: string | null;
  rating_avg?: number;
  rating_count?: number;
  is_public?: boolean;
  family_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ArtifactRatingInsert {
  id?: string;
  artifact_id: string;
  profile_id: string;
  rating: number;
  created_at?: string;
}

export interface DailyAdventureInsert {
  id?: string;
  profile_id: string;
  subject_id: string;
  skill_ids?: string[];
  title: string;
  description: string;
  story_text?: string | null;
  content: Record<string, unknown>;
  subject_color?: string;
  status?: AdventureStatus;
  score?: number | null;
  generated_at?: string;
  expires_at?: string;
  created_at?: string;
}

export interface ActivitySessionInsert {
  id?: string;
  profile_id: string;
  lesson_id?: string | null;
  adventure_id?: string | null;
  score: number;
  total_questions: number;
  correct_first_try?: number;
  correct_total?: number;
  time_seconds?: number;
  hints_used?: number;
  activity_data?: unknown[];
  started_at?: string;
  completed_at?: string | null;
  created_at?: string;
}

export interface NotificationInsert {
  id?: string;
  family_id: string;
  recipient_profile_id: string;
  kid_profile_id?: string | null;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  read?: boolean;
  email_sent?: boolean;
  email_sent_at?: string | null;
  created_at?: string;
}

export interface FeedbackInsert {
  id?: string;
  profile_id: string;
  family_id: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  status?: FeedbackStatus;
  admin_notes?: string | null;
  page_url?: string | null;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserEventInsert {
  id?: string;
  profile_id: string;
  family_id: string;
  event_name: string;
  event_data?: Record<string, unknown> | null;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// Update types (all fields optional except id)
// ---------------------------------------------------------------------------

export interface FamilyUpdate {
  clerk_org_id?: string;
  name?: string;
  coppa_consent_given?: boolean;
  coppa_consent_at?: string;
  coppa_consent_ip?: string;
  stripe_customer_id?: string | null;
  subscription_tier?: SubscriptionTier;
  stripe_subscription_id?: string | null;
  stripe_subscription_status?: string | null;
  stripe_price_id?: string | null;
  stripe_current_period_end?: string | null;
}

export interface ProfileUpdate {
  clerk_id?: string;
  family_id?: string;
  display_name?: string;
  avatar_id?: string;
  role?: ProfileRole;
  grade_level?: number | null;
  current_band?: number;
  device_mode?: DeviceMode;
  pin_hash?: string | null;
  current_streak?: number;
  longest_streak?: number;
  last_activity_date?: string | null;
  xp?: number;
  level?: number;
}

export interface ModuleUpdate {
  band?: number;
  order_num?: number;
  title?: string;
  description?: string;
  icon?: string;
  subject_id?: string | null;
}

export interface LessonUpdate {
  module_id?: string;
  order_num?: number;
  title?: string;
  description?: string;
  story_text?: string | null;
  starter_blocks_xml?: string | null;
  solution_code?: string | null;
  hints?: LessonHint[];
  subject_id?: string | null;
  skills_covered?: string[];
  lesson_type?: LessonType;
  device_required?: boolean;
  device_features?: string[];
  simulator_support?: boolean;
  simulator_compatible?: boolean;
  estimated_minutes?: number;
  content?: Record<string, unknown>;
}

export interface ProjectUpdate {
  title?: string;
  blocks_xml?: string | null;
  python_code?: string;
  lesson_id?: string | null;
  is_public?: boolean;
  updated_at?: string;
}

export interface ProgressUpdate {
  status?: ProgressStatus;
  started_at?: string | null;
  completed_at?: string | null;
  attempts?: number;
}

export interface BadgeUpdate {
  name?: string;
  description?: string;
  icon?: string;
  criteria?: BadgeCriteria;
}

export interface UserBadgeUpdate {
  profile_id?: string;
  badge_id?: string;
  earned_at?: string;
}

export interface ChatSessionUpdate {
  messages?: ChatMessage[];
  lesson_id?: string | null;
  subject_id?: string | null;
}

export interface DeviceSessionUpdate {
  device_type?: string;
  disconnected_at?: string | null;
}

export interface SubjectUpdate {
  slug?: SubjectSlug;
  name?: string;
  display_name?: string;
  color?: string;
  icon?: string;
  sort_order?: number;
}

export interface SkillUpdate {
  subject_id?: string;
  slug?: string;
  name?: string;
  description?: string | null;
  standard_code?: string | null;
  sort_order?: number;
}

export interface LearningProfileUpdate {
  learning_style?: Record<string, number>;
  interests?: string[];
  preferred_session_length?: number | null;
  preferred_encouragement?: string;
  chip_notes?: string | null;
  updated_at?: string;
}

export interface SkillProficiencyUpdate {
  level?: SkillLevel;
  attempts?: number;
  correct?: number;
  last_practiced?: string | null;
  updated_at?: string;
}

export interface ArtifactUpdate {
  title?: string;
  description?: string | null;
  type?: ArtifactType;
  subject_id?: string | null;
  skill_ids?: string[];
  grade_level?: number | null;
  tags?: string[];
  content?: Record<string, unknown>;
  device_required?: boolean;
  difficulty?: DifficultyLevel | null;
  created_by?: string | null;
  created_by_chip?: boolean;
  source_profile_id?: string | null;
  rating_avg?: number;
  rating_count?: number;
  is_public?: boolean;
  family_id?: string | null;
  updated_at?: string;
}

export interface ArtifactRatingUpdate {
  artifact_id?: string;
  profile_id?: string;
  rating?: number;
}

export interface DailyAdventureUpdate {
  subject_id?: string;
  skill_ids?: string[];
  title?: string;
  description?: string;
  story_text?: string | null;
  content?: Record<string, unknown>;
  subject_color?: string;
  status?: AdventureStatus;
  score?: number | null;
  expires_at?: string;
}

export interface ActivitySessionUpdate {
  score?: number;
  total_questions?: number;
  correct_first_try?: number;
  correct_total?: number;
  time_seconds?: number;
  hints_used?: number;
  activity_data?: unknown[];
  completed_at?: string | null;
}

export interface NotificationUpdate {
  read?: boolean;
  email_sent?: boolean;
  email_sent_at?: string | null;
}

export interface FeedbackUpdate {
  category?: FeedbackCategory;
  title?: string;
  description?: string;
  status?: FeedbackStatus;
  admin_notes?: string | null;
  page_url?: string | null;
  user_agent?: string | null;
  updated_at?: string;
}

// ---------------------------------------------------------------------------
// Table definition helper — maps table name to Row / Insert / Update shapes
// ---------------------------------------------------------------------------

interface TableDefinition<
  Row,
  Insert = Row,
  Update = Partial<Row>,
> {
  Row: Row;
  Insert: Insert;
  Update: Update;
}

// ---------------------------------------------------------------------------
// Database type — used to parameterise the Supabase client
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      families: TableDefinition<Family, FamilyInsert, FamilyUpdate>;
      profiles: TableDefinition<Profile, ProfileInsert, ProfileUpdate>;
      modules: TableDefinition<Module, ModuleInsert, ModuleUpdate>;
      lessons: TableDefinition<Lesson, LessonInsert, LessonUpdate>;
      projects: TableDefinition<Project, ProjectInsert, ProjectUpdate>;
      progress: TableDefinition<Progress, ProgressInsert, ProgressUpdate>;
      badges: TableDefinition<Badge, BadgeInsert, BadgeUpdate>;
      user_badges: TableDefinition<UserBadge, UserBadgeInsert, UserBadgeUpdate>;
      chat_sessions: TableDefinition<
        ChatSession,
        ChatSessionInsert,
        ChatSessionUpdate
      >;
      device_sessions: TableDefinition<
        DeviceSession,
        DeviceSessionInsert,
        DeviceSessionUpdate
      >;
      subjects: TableDefinition<Subject, SubjectInsert, SubjectUpdate>;
      skills: TableDefinition<Skill, SkillInsert, SkillUpdate>;
      learning_profiles: TableDefinition<
        LearningProfile,
        LearningProfileInsert,
        LearningProfileUpdate
      >;
      skill_proficiencies: TableDefinition<
        SkillProficiency,
        SkillProficiencyInsert,
        SkillProficiencyUpdate
      >;
      artifacts: TableDefinition<Artifact, ArtifactInsert, ArtifactUpdate>;
      artifact_ratings: TableDefinition<
        ArtifactRating,
        ArtifactRatingInsert,
        ArtifactRatingUpdate
      >;
      daily_adventures: TableDefinition<
        DailyAdventure,
        DailyAdventureInsert,
        DailyAdventureUpdate
      >;
      activity_sessions: TableDefinition<
        ActivitySession,
        ActivitySessionInsert,
        ActivitySessionUpdate
      >;
      notifications: TableDefinition<
        Notification,
        NotificationInsert,
        NotificationUpdate
      >;
      feedback: TableDefinition<Feedback, FeedbackInsert, FeedbackUpdate>;
      user_events: TableDefinition<UserEvent, UserEventInsert>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      profile_role: ProfileRole;
      progress_status: ProgressStatus;
      skill_level: SkillLevel;
      lesson_type: LessonType;
      artifact_type: ArtifactType;
      difficulty_level: DifficultyLevel;
      subject_slug: SubjectSlug;
      adventure_status: AdventureStatus;
      notification_type: NotificationType;
      feedback_category: FeedbackCategory;
      feedback_status: FeedbackStatus;
    };
  };
}
