import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Tests that the Hume EVI config in setup-hume.ts has on_new_chat enabled
 * with EMPTY text so EVI infers what to say from the system prompt.
 *
 * Per Hume docs (https://dev.hume.ai/docs/speech-to-speech-evi/configuration/event-messages):
 * - When on_new_chat.enabled is true and text is provided, EVI speaks it verbatim
 * - When on_new_chat.enabled is true and text is EMPTY, EVI infers from context
 * - When on_new_chat.enabled is false, EVI does NOT speak at all (bad for Pre-K)
 *
 * We use enabled: true with empty text because:
 * 1. Chip needs to speak first (especially Pre-K kids who can't read)
 * 2. The system prompt is lesson-aware and tells Chip to jump straight into
 *    lesson content ("Do NOT introduce yourself", "talk about THIS lesson")
 * 3. With empty text, EVI infers its opening from the system prompt, making
 *    the greeting contextual to whatever page/lesson the kid is on
 */
describe("Hume EVI config (setup-hume.ts)", () => {
  const source = readFileSync(
    resolve(__dirname, "setup-hume.ts"),
    "utf-8",
  );

  it("has on_new_chat enabled so Chip speaks first", () => {
    expect(source).toContain("on_new_chat");
    expect(source).toMatch(/on_new_chat:\s*\{[^}]*enabled:\s*true/s);
  });

  it("has empty on_new_chat text so EVI infers from system prompt", () => {
    // text must be "" so Hume uses the lesson-aware system prompt, not a hardcoded greeting
    expect(source).toMatch(/on_new_chat:\s*\{[^}]*text:\s*""\s*,?\s*\}/s);
  });

  it("base prompt instructs EVI not to self-introduce", () => {
    // The base CHIP_VOICE_PROMPT must tell EVI to follow sessionSettings
    // and NOT say "I'm Chip" or "learning buddy" as an opening
    expect(source).toMatch(/Do NOT introduce yourself/i);
    expect(source).toContain("Do NOT introduce yourself");
    expect(source).toContain("sessionSettings");
  });

  it("does not have a hardcoded on_new_chat greeting", () => {
    expect(source).not.toMatch(
      /on_new_chat:\s*\{[^}]*text:\s*"[^"]+I'm Chip/s,
    );
    expect(source).not.toMatch(
      /on_new_chat:\s*\{[^}]*text:\s*"[^"]+learning buddy/s,
    );
  });
});
