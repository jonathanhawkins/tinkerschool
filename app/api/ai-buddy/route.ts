import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";

import { getChipSystemPrompt } from "@/lib/ai/chip-system-prompt";
import type { ChipContext } from "@/lib/ai/chip-system-prompt";
import { evaluateBadges } from "@/lib/badges/evaluate-badges";
import { checkAiBuddyRateLimit } from "@/lib/rate-limit";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isValidUUID } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Request body schema & validation constants
// ---------------------------------------------------------------------------

/** Known subject slugs — reject unknown values to prevent prompt injection. */
const VALID_SUBJECTS = new Set([
  "math", "reading", "science", "music", "art", "problem_solving", "coding",
]);

/** Max length limits to prevent cost amplification and prompt injection. */
const MAX_LESSON_LENGTH = 200;
const MAX_CODE_LENGTH = 10_000;
const MAX_MESSAGES = 50;

interface AiBuddyRequestBody {
  messages: UIMessage[];
  kidName: string;
  age: number;
  band: number;
  currentSubject?: string;
  currentLesson?: string;
  currentCode?: string;
  chatSessionId?: string;
}

/**
 * Validate the incoming request body and return a typed result or null.
 */
function parseRequestBody(body: unknown): AiBuddyRequestBody | null {
  if (typeof body !== "object" || body === null) return null;

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.messages) || b.messages.length > MAX_MESSAGES) return null;
  if (typeof b.kidName !== "string" || b.kidName.length === 0) return null;
  if (typeof b.age !== "number" || b.age < 4 || b.age > 14) return null;
  if (typeof b.band !== "number" || b.band < 1 || b.band > 5) return null;

  // Validate currentSubject against whitelist (prevents prompt injection
  // via arbitrary strings being interpolated into the system prompt)
  const rawSubject = typeof b.currentSubject === "string" ? b.currentSubject : undefined;
  const currentSubject = rawSubject && VALID_SUBJECTS.has(rawSubject) ? rawSubject : undefined;

  // Truncate currentLesson and currentCode to prevent cost amplification
  const rawLesson = typeof b.currentLesson === "string" ? b.currentLesson : undefined;
  const currentLesson = rawLesson ? rawLesson.slice(0, MAX_LESSON_LENGTH) : undefined;

  const rawCode = typeof b.currentCode === "string" ? b.currentCode : undefined;
  const currentCode = rawCode ? rawCode.slice(0, MAX_CODE_LENGTH) : undefined;

  return {
    messages: b.messages as UIMessage[],
    kidName: b.kidName,
    age: b.age,
    band: b.band,
    currentSubject,
    currentLesson,
    currentCode,
    chatSessionId:
      typeof b.chatSessionId === "string" && isValidUUID(b.chatSessionId)
        ? b.chatSessionId
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// Chat persistence helpers
// ---------------------------------------------------------------------------

interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

/**
 * Persist the conversation to the chat_sessions table.
 * Creates a new session or appends to an existing one.
 * Runs fire-and-forget so it doesn't block the response.
 */
async function persistChat(
  clerkId: string,
  userMessage: string,
  assistantMessage: string,
  chatSessionId: string | undefined,
  lessonId: string | undefined,
): Promise<string | null> {
  try {
    const supabase = createAdminSupabaseClient();

    // Resolve the kid profile for chat session storage.
    // Chat sessions belong to the kid, not the parent.
    const { data: authProfile } = (await supabase
      .from("profiles")
      .select("id, family_id, role")
      .eq("clerk_id", clerkId)
      .single()) as { data: { id: string; family_id: string; role: string } | null };

    if (!authProfile) return null;

    let profile = authProfile;
    if (authProfile.role === "parent") {
      const { data: kids } = (await supabase
        .from("profiles")
        .select("id, family_id, role")
        .eq("family_id", authProfile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1)) as { data: typeof authProfile[] | null };
      if (kids?.[0]) {
        profile = kids[0];
      }
    }

    const now = new Date().toISOString();
    const newMessages: StoredMessage[] = [
      { role: "user", content: userMessage, timestamp: now },
      { role: "assistant", content: assistantMessage, timestamp: now },
    ];

    if (chatSessionId) {
      // Append to existing session
      const { data: existing } = (await supabase
        .from("chat_sessions")
        .select("id, messages")
        .eq("id", chatSessionId)
        .eq("profile_id", profile.id)
        .single()) as {
        data: { id: string; messages: StoredMessage[] } | null;
      };

      if (existing) {
        const updatedMessages = [...(existing.messages || []), ...newMessages];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("chat_sessions") as any)
          .update({ messages: updatedMessages })
          .eq("id", existing.id);

        return existing.id;
      }
    }

    // Create a new session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted } = await (supabase.from("chat_sessions") as any)
      .insert({
        profile_id: profile.id,
        lesson_id: lessonId || null,
        messages: newMessages,
      })
      .select("id")
      .single();

    // Evaluate badges after creating a new chat session (for "Chip's Friend"
    // badge and similar). Uses the admin client since this runs in a
    // fire-and-forget context outside the user's request scope.
    if (inserted?.id) {
      try {
        await evaluateBadges(supabase, profile.id);
      } catch (badgeErr) {
        console.error(
          "[ai-buddy] Badge evaluation failed:",
          badgeErr instanceof Error ? badgeErr.message : "unknown error",
        );
      }
    }

    return inserted?.id ?? null;
  } catch (err) {
    console.error("[ai-buddy] Failed to persist chat:", err instanceof Error ? err.message : "unknown error");
    return null;
  }
}

// ---------------------------------------------------------------------------
// Personalization data fetchers
// ---------------------------------------------------------------------------

interface LearningProfileRow {
  learning_style: Record<string, number>;
  interests: string[];
  preferred_encouragement: string;
  chip_notes: string | null;
}

interface SkillProficiencyRow {
  level: string;
  skills: { slug: string } | null;
}

interface ProgressRow {
  lessons: { title: string } | null;
}

/**
 * Fetch the child's learning profile, skill proficiency, and recent lessons
 * from Supabase. Returns data suitable for the ChipContext interface.
 *
 * Uses the admin client (bypasses RLS) since the API route already verifies
 * the user is authenticated via Clerk.
 */
async function fetchPersonalizationData(clerkId: string): Promise<{
  /** Server-verified profile fields (never trust client-supplied values) */
  displayName?: string;
  gradeLevel?: number;
  currentBand?: number;
  subscriptionTier?: string;
  learningProfile?: ChipContext["learningProfile"];
  skillProficiency?: Record<string, string>;
  recentLessons?: string[];
}> {
  try {
    const supabase = createAdminSupabaseClient();

    // Look up the authenticated user's profile
    const { data: authProfile } = (await supabase
      .from("profiles")
      .select("id, display_name, grade_level, current_band, family_id, role")
      .eq("clerk_id", clerkId)
      .single()) as { data: { id: string; display_name: string; grade_level: number | null; current_band: number; family_id: string; role: string } | null };

    if (!authProfile) return {};

    // If the authenticated user is a parent, resolve to the first kid profile
    // so Chip addresses the kid by name with correct grade/band info.
    let profile = authProfile;
    if (authProfile.role === "parent") {
      const { data: kids } = (await supabase
        .from("profiles")
        .select("id, display_name, grade_level, current_band, family_id, role")
        .eq("family_id", authProfile.family_id)
        .eq("role", "kid")
        .order("created_at")
        .limit(1)) as { data: typeof authProfile[] | null };
      if (kids?.[0]) {
        profile = kids[0];
      }
    }

    // Fetch family subscription tier
    const { data: family } = (await supabase
      .from("families")
      .select("subscription_tier")
      .eq("id", profile.family_id)
      .single()) as { data: { subscription_tier: string } | null };

    // Fetch learning profile, skill proficiency, and recent lessons in parallel
    const [learningProfileResult, skillResult, progressResult] =
      await Promise.all([
        // Learning profile
        supabase
          .from("learning_profiles")
          .select(
            "learning_style, interests, preferred_encouragement, chip_notes"
          )
          .eq("profile_id", profile.id)
          .single() as unknown as Promise<{ data: LearningProfileRow | null; error: unknown }>,

        // Skill proficiency with skill slugs
        supabase
          .from("skill_proficiencies")
          .select("level, skills(slug)")
          .eq("profile_id", profile.id)
          .neq("level", "not_started") as unknown as Promise<{
          data: SkillProficiencyRow[] | null;
          error: unknown;
        }>,

        // Recent completed lessons (last 5)
        supabase
          .from("progress")
          .select("lessons(title)")
          .eq("profile_id", profile.id)
          .eq("status", "completed")
          .order("updated_at", { ascending: false })
          .limit(5) as unknown as Promise<{
          data: ProgressRow[] | null;
          error: unknown;
        }>,
      ]);

    const result: {
      displayName?: string;
      gradeLevel?: number;
      currentBand?: number;
      subscriptionTier?: string;
      learningProfile?: ChipContext["learningProfile"];
      skillProficiency?: Record<string, string>;
      recentLessons?: string[];
    } = {
      displayName: profile.display_name,
      gradeLevel: profile.grade_level ?? undefined,
      currentBand: profile.current_band,
      subscriptionTier: family?.subscription_tier ?? "free",
    };

    // Parse learning profile
    if (learningProfileResult.data) {
      const lp = learningProfileResult.data;
      result.learningProfile = {
        learningStyle:
          typeof lp.learning_style === "object" && lp.learning_style !== null
            ? (lp.learning_style as Record<string, number>)
            : {},
        interests: Array.isArray(lp.interests) ? lp.interests : [],
        preferredEncouragement: lp.preferred_encouragement ?? "enthusiastic",
        chipNotes: lp.chip_notes ?? "",
      };
    }

    // Parse skill proficiency into a slug -> level map
    if (skillResult.data && skillResult.data.length > 0) {
      const proficiency: Record<string, string> = {};
      for (const row of skillResult.data) {
        const slug =
          row.skills && typeof row.skills === "object"
            ? (row.skills as { slug: string }).slug
            : null;
        if (slug) {
          proficiency[slug] = row.level;
        }
      }
      if (Object.keys(proficiency).length > 0) {
        result.skillProficiency = proficiency;
      }
    }

    // Parse recent lessons into title array
    if (progressResult.data && progressResult.data.length > 0) {
      const titles = progressResult.data
        .map((row) =>
          row.lessons && typeof row.lessons === "object"
            ? (row.lessons as { title: string }).title
            : null
        )
        .filter((t): t is string => t !== null);
      if (titles.length > 0) {
        result.recentLessons = titles;
      }
    }

    return result;
  } catch (err) {
    console.error("[ai-buddy] Failed to fetch personalization data:", err instanceof Error ? err.message : "unknown error");
    return {};
  }
}

// ---------------------------------------------------------------------------
// POST /api/ai-buddy
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // 1. Authenticate
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Fetch personalization data (includes tier) before rate limiting
  //    so we can apply the correct tier-based limit.
  const personalization = await fetchPersonalizationData(userId);
  const tier = (personalization.subscriptionTier === "supporter" ? "supporter" : "free") as import("@/lib/stripe/config").SubscriptionTier;

  // 3. Rate limit (distributed via Upstash Redis, tier-aware)
  const { limited, remaining } = await checkAiBuddyRateLimit(userId, tier);
  if (limited) {
    return new Response(
      JSON.stringify({
        error:
          "Chip needs a little rest! You've sent a lot of messages. Try again in a bit.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  }

  // 4. Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = parseRequestBody(body);

  if (!parsed) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const {
    messages,
    currentSubject,
    currentLesson,
    currentCode,
    chatSessionId,
  } = parsed;

  // 4. Use personalization data fetched above (step 2) for verified profile fields.
  // SECURITY: kidName, age, band are fetched server-side from the
  // authenticated user's profile — never trust client-supplied values.

  // Use server-verified values, falling back to safe defaults
  const verifiedName = personalization.displayName ?? "Friend";
  const verifiedBand = personalization.currentBand ?? 2;
  // Approximate age from grade level (grade + 5), defaulting to 7
  const verifiedAge = personalization.gradeLevel != null
    ? personalization.gradeLevel + 5
    : 7;

  // 5. Build system prompt with full personalization context
  const systemPrompt = getChipSystemPrompt({
    childName: verifiedName,
    age: verifiedAge,
    gradeLevel: verifiedBand,
    currentSubject,
    currentLesson,
    currentCode,
    learningProfile: personalization.learningProfile,
    skillProficiency: personalization.skillProficiency,
    recentLessons: personalization.recentLessons,
  });

  // 6. Log conversation for debugging (no child PII for COPPA compliance)
  console.log(
    `[ai-buddy] userId=${userId} band=${verifiedBand} subject=${currentSubject ?? "none"} messageCount=${messages.length} personalized=${!!personalization.learningProfile}`
  );

  // 7. Extract the latest user message text for persistence
  const latestUserMessage = messages
    .filter((m) => m.role === "user")
    .pop();
  const userText =
    latestUserMessage?.parts
      ?.filter(
        (p: { type: string; text?: string }) =>
          p.type === "text" && typeof p.text === "string"
      )
      .map((p: { type: string; text?: string }) => p.text)
      .join("") ?? "";

  // 8. Select model based on family tier (uses `tier` from step 2)
  // TODO: When fine-tuned Chip model is ready, free tier uses it instead of Sonnet.
  // For now, both tiers use Claude Sonnet — the tier check is scaffolded for the switch.
  const modelId = "claude-sonnet-4-5-20250929";

  // 9. Convert UI messages to model messages and stream
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic(modelId),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 300,
    temperature: 0.7,
    async onFinish({ text }) {
      // 9. Persist the conversation after streaming completes
      if (userText && text) {
        await persistChat(
          userId,
          userText,
          text,
          chatSessionId,
          currentLesson,
        );
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
