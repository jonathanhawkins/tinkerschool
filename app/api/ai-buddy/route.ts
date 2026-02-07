import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";

import { getChipSystemPrompt } from "@/lib/ai/chip-system-prompt";
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
    currentLesson,
    currentCode,
    chatSessionId,
  } = parsed;

  // 4. Build system prompt
  const systemPrompt = getChipSystemPrompt({
    childName: kidName,
    age,
    gradeLevel: band, // Legacy: band maps roughly to grade level
    currentLesson,
    currentCode,
  });

  // 5. Log conversation for debugging
  console.log(
    `[ai-buddy] userId=${userId} kidName=${kidName} age=${age} band=${band} messageCount=${messages.length}`
  );

  // 6. Extract the latest user message text for persistence
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

  // 7. Convert UI messages to model messages and stream
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 300,
    temperature: 0.7,
    async onFinish({ text }) {
      // 8. Persist the conversation after streaming completes
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
