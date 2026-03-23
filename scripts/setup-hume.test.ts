import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Tests that the Hume EVI config in setup-hume.ts has on_new_chat DISABLED.
 *
 * Per Hume docs (https://dev.hume.ai/docs/speech-to-speech-evi/configuration/event-messages):
 * - When on_new_chat.enabled is true, EVI auto-speaks (ignores lesson context)
 * - When on_new_chat.enabled is false, EVI stays silent until triggered
 *
 * We disable on_new_chat because Hume's auto-greeting ignores sessionSettings
 * and always says a generic "I'm Chip" intro. Instead, the client sends a
 * lesson-aware opening via sendAssistantInput after connecting.
 */
describe("Hume EVI config (setup-hume.ts)", () => {
  const source = readFileSync(
    resolve(__dirname, "setup-hume.ts"),
    "utf-8",
  );

  it("has on_new_chat disabled so client controls the opening", () => {
    expect(source).toContain("on_new_chat");
    expect(source).toMatch(/on_new_chat:\s*\{[^}]*enabled:\s*false/s);
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
