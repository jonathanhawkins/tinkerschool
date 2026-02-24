/**
 * Chip Memory Synthesizer
 *
 * Every 3rd lesson completion, triggers a Claude Haiku call to produce
 * a concise summary of the child — their strengths, struggles, personality
 * quirks, and learning patterns — and writes it to `learning_profiles.chip_notes`.
 *
 * This gives Chip persistent, evolving memory about each child.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Synthesize every N-th completed lesson. */
const SYNTHESIS_INTERVAL = 3;

/** Max characters for chip_notes (matches column expectations). */
const MAX_NOTES_LENGTH = 500;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatSessionRow {
  messages: { role: string; content: string }[];
}

interface ActivitySessionRow {
  score: number;
  hints_used: number;
  correct_first_try: number;
  total_questions: number;
  time_seconds: number;
  lessons: { title: string; subjects: { display_name: string } | null } | null;
}

interface LearningProfileRow {
  id: string;
  chip_notes: string | null;
  interests: string[];
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Check if synthesis should run (every SYNTHESIS_INTERVAL completions).
 */
export async function shouldSynthesize(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<boolean> {
  const { count } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .eq("status", "completed");

  if (count == null || count === 0) return false;
  return count % SYNTHESIS_INTERVAL === 0;
}

/**
 * Build the synthesis prompt from recent data.
 */
export async function buildSynthesisContext(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<{ prompt: string; learningProfileId: string } | null> {
  // Fetch learning profile, recent chats, and recent activity sessions in parallel
  const [learningProfileResult, chatsResult, sessionsResult] =
    await Promise.all([
      supabase
        .from("learning_profiles")
        .select("id, chip_notes, interests")
        .eq("profile_id", profileId)
        .single() as unknown as Promise<{
        data: LearningProfileRow | null;
        error: unknown;
      }>,

      supabase
        .from("chat_sessions")
        .select("messages")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(5) as unknown as Promise<{
        data: ChatSessionRow[] | null;
        error: unknown;
      }>,

      supabase
        .from("activity_sessions")
        .select(
          "score, hints_used, correct_first_try, total_questions, time_seconds, lessons(title, subjects(display_name))",
        )
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(10) as unknown as Promise<{
        data: ActivitySessionRow[] | null;
        error: unknown;
      }>,
    ]);

  const learningProfile = learningProfileResult.data;
  if (!learningProfile) return null;

  // Build chat excerpt (kid messages only, last 20 messages across sessions)
  const kidMessages: string[] = [];
  if (chatsResult.data) {
    for (const session of chatsResult.data) {
      if (!Array.isArray(session.messages)) continue;
      for (const msg of session.messages) {
        if (msg.role === "user" && kidMessages.length < 20) {
          kidMessages.push(msg.content.slice(0, 200));
        }
      }
    }
  }

  // Build activity summary
  const activityLines: string[] = [];
  if (sessionsResult.data) {
    for (const s of sessionsResult.data) {
      const title = s.lessons?.title ?? "Unknown lesson";
      const subject = s.lessons?.subjects?.display_name ?? "Unknown";
      activityLines.push(
        `${subject} - "${title}": score ${s.score}%, ${s.hints_used} hints, ${s.correct_first_try}/${s.total_questions} first-try, ${s.time_seconds}s`,
      );
    }
  }

  const currentNotes = learningProfile.chip_notes ?? "(no previous notes)";
  const interests = learningProfile.interests?.join(", ") || "(none detected yet)";

  const prompt = `You are an education AI synthesizing observations about a child learner. Write a concise 200-word summary for Chip (the child's AI tutor) to use as memory.

## Previous Notes
${currentNotes}

## Current Interests
${interests}

## Recent Chat Messages (from the child)
${kidMessages.length > 0 ? kidMessages.map((m) => `- "${m}"`).join("\n") : "(no chat data)"}

## Recent Activity Performance
${activityLines.length > 0 ? activityLines.join("\n") : "(no activity data)"}

## Instructions
Write a concise summary covering:
1. Learning strengths and areas needing support
2. Personality traits and communication style observed in chats
3. Engagement patterns (speed, hint usage, persistence)
4. Specific topics/concepts they excel at or struggle with

Rules:
- Max 200 words, plain text, no markdown formatting
- Write in second person ("the child" or "they")
- Be specific and actionable (not generic)
- Preserve important observations from previous notes
- Focus on patterns, not individual incidents`;

  return { prompt, learningProfileId: learningProfile.id };
}

/**
 * Run the full chip notes synthesis pipeline.
 *
 * 1. Check if it's time to synthesize
 * 2. Gather recent data
 * 3. Call Claude Haiku for synthesis
 * 4. Write to learning_profiles.chip_notes
 */
export async function synthesizeChipNotes(
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<void> {
  // Check if it's time to synthesize
  const shouldRun = await shouldSynthesize(supabase, profileId);
  if (!shouldRun) return;

  // Build context
  const context = await buildSynthesisContext(supabase, profileId);
  if (!context) return;

  // Call Claude Haiku via AI SDK (consistent with the rest of the codebase)
  const { text } = await generateText({
    model: anthropic("claude-haiku-4-5-20251001"),
    prompt: context.prompt,
    maxTokens: 300,
  });

  if (!text) return;

  const notes = text.slice(0, MAX_NOTES_LENGTH);

  // Write to learning_profiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("learning_profiles") as any)
    .update({ chip_notes: notes, updated_at: new Date().toISOString() })
    .eq("id", context.learningProfileId);
}
