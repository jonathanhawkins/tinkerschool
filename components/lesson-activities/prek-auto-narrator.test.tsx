import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

import { PreKAutoNarrator } from "./prek-auto-narrator";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
// PreKAutoNarrator is a no-op stub kept so existing call sites don't break.
// Auto-narration was removed to avoid burning voice/TTS tokens on every page
// load and question change. Narration is now user-initiated via the Chip icon.
// ---------------------------------------------------------------------------

describe("PreKAutoNarrator", () => {
  it("renders nothing (no visible DOM)", () => {
    const { container } = render(<PreKAutoNarrator enabled />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when disabled", () => {
    const { container } = render(<PreKAutoNarrator enabled={false} />);
    expect(container.innerHTML).toBe("");
  });
});
