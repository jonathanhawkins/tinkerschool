import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";

import { getChipSystemPrompt } from "@/lib/ai/chip-system-prompt";
import type { ChipContext } from "@/lib/ai/chip-system-prompt";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 30 messages per hour per user
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 30;

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(userId) ?? { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(userId, entry);
    return true;
  }

  entry.timestamps.push(now);
  rateLimitStore.set(userId, entry);
  return false;
}

// ---------------------------------------------------------------------------
// Request body schema
// ---------------------------------------------------------------------------
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

  if (!Array.isArray(b.messages)) return null;
  if (typeof b.kidName !== "string" || b.kidName.length === 0) return null;
  if (typeof b.age !== "number" || b.age < 4 || b.age > 14) return null;
  if (typeof b.band !== "number" || b.band < 1 || b.band > 5) return null;

  return {
    messages: b.messages as UIMessage[],
    kidName: b.kidName,
    age: b.age,
    band: b.band,
    currentSubject:
      typeof b.currentSubject === "string" ? b.currentSubject : undefined,
    currentLesson:
      typeof b.currentLesson === "string" ? b.currentLesson : undefined,
    currentCode:
      typeof b.currentCode === "string" ? b.currentCode : undefined,
    chatSessionId:
      typeof b.chatSessionId === "string" ? b.chatSessionId : undefined,
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

    // Look up the profile_id for this Clerk user
    const { data: profile } = (await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", clerkId)
      .single()) as { data: { id: string } | null };

    if (!profile) return null;

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

    return inserted?.id ?? null;
  } catch (err) {
    console.error("[ai-buddy] Failed to persist chat:", err);
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
  learningProfile?: ChipContext["learningProfile"];
  skillProficiency?: Record<string, string>;
  recentLessons?: string[];
}> {
  try {
    const supabase = createAdminSupabaseClient();

    // Look up profile_id
    const { data: profile } = (await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", clerkId)
      .single()) as { data: { id: string } | null };

    if (!profile) return {};

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
          .from("skill_proficiency")
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
      learningProfile?: ChipContext["learningProfile"];
      skillProficiency?: Record<string, string>;
      recentLessons?: string[];
    } = {};

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
    console.error("[ai-buddy] Failed to fetch personalization data:", err);
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

  // 2. Rate limit
  if (isRateLimited(userId)) {
    return new Response(
      JSON.stringify({
        error:
          "Chip needs a little rest! You've sent a lot of messages. Try again in a bit.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 3. Parse & validate body
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
    kidName,
    age,
    band,
    currentSubject,
    currentLesson,
    currentCode,
    chatSessionId,
  } = parsed;

  // 4. Fetch personalization data (learning profile, skills, recent lessons)
  const personalization = await fetchPersonalizationData(userId);

  // 5. Build system prompt with full personalization context
  const systemPrompt = getChipSystemPrompt({
    childName: kidName,
    age,
    gradeLevel: band, // Legacy: band maps roughly to grade level
    currentSubject,
    currentLesson,
    currentCode,
    learningProfile: personalization.learningProfile,
    skillProficiency: personalization.skillProficiency,
    recentLessons: personalization.recentLessons,
  });

  // 6. Log conversation for debugging
  console.log(
    `[ai-buddy] userId=${userId} kidName=${kidName} age=${age} band=${band} subject=${currentSubject ?? "none"} messageCount=${messages.length} personalized=${!!personalization.learningProfile}`
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

  // 8. Convert UI messages to model messages and stream
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
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
