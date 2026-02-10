import { describe, it, expect, vi } from "vitest";

import { createChipToolCallHandler } from "./tools";
import type { VoiceAction } from "./types";

function createMockSend() {
  return {
    success: vi.fn(),
    error: vi.fn(),
  };
}

function createMessage(name: string, parameters: string) {
  return { name, parameters } as { name: string; parameters: string };
}

describe("createChipToolCallHandler", () => {
  describe("navigate tool", () => {
    it("dispatches a navigate action and returns success", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(createMessage("navigate", JSON.stringify({ path: "/home" })), send);

      expect(onAction).toHaveBeenCalledOnce();
      expect(onAction).toHaveBeenCalledWith({ type: "navigate", path: "/home" });
      expect(send.success).toHaveBeenCalledWith({ status: "navigating", path: "/home" });
      expect(send.error).not.toHaveBeenCalled();
    });

    it("navigates to /subjects/math", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(
        createMessage("navigate", JSON.stringify({ path: "/subjects/math" })),
        send,
      );

      expect(onAction).toHaveBeenCalledWith({ type: "navigate", path: "/subjects/math" });
      expect(send.success).toHaveBeenCalledWith({
        status: "navigating",
        path: "/subjects/math",
      });
    });

    it("navigates to /workshop", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(
        createMessage("navigate", JSON.stringify({ path: "/workshop" })),
        send,
      );

      expect(onAction).toHaveBeenCalledWith({ type: "navigate", path: "/workshop" });
      expect(send.success).toHaveBeenCalledWith({
        status: "navigating",
        path: "/workshop",
      });
    });
  });

  describe("highlight_element tool", () => {
    it("returns not_available and does not dispatch an action", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(
        createMessage(
          "highlight_element",
          JSON.stringify({ target: "#save-button" }),
        ),
        send,
      );

      expect(onAction).not.toHaveBeenCalled();
      expect(send.success).toHaveBeenCalledWith({
        status: "not_available",
        message:
          "Visual highlighting is not supported yet. Describe what you want the child to look at instead.",
      });
      expect(send.error).not.toHaveBeenCalled();
    });
  });

  describe("show_celebration tool", () => {
    it("dispatches a celebrate action and returns success", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(createMessage("show_celebration", "{}"), send);

      expect(onAction).toHaveBeenCalledOnce();
      expect(onAction).toHaveBeenCalledWith({ type: "celebrate" });
      expect(send.success).toHaveBeenCalledWith({ status: "celebration_triggered" });
      expect(send.error).not.toHaveBeenCalled();
    });
  });

  describe("show_hint tool", () => {
    it("returns not_available and does not dispatch an action", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(
        createMessage("show_hint", JSON.stringify({ text: "Try the blue block!" })),
        send,
      );

      expect(onAction).not.toHaveBeenCalled();
      expect(send.success).toHaveBeenCalledWith({
        status: "not_available",
        message:
          "Hint overlay is not supported yet. Say the hint aloud to the child instead.",
      });
      expect(send.error).not.toHaveBeenCalled();
    });
  });

  describe("unknown tool", () => {
    it("returns an error for an unregistered tool name", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(createMessage("do_something_else", "{}"), send);

      expect(onAction).not.toHaveBeenCalled();
      expect(send.error).toHaveBeenCalledWith({
        error: "Unknown tool",
        code: "unknown_tool",
        level: "warn",
        content: 'Tool "do_something_else" is not registered.',
      });
      expect(send.success).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("returns an error when parameters contain malformed JSON", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(createMessage("navigate", "this is not json"), send);

      expect(onAction).not.toHaveBeenCalled();
      expect(send.error).toHaveBeenCalledOnce();
      expect(send.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Tool call failed",
          code: "tool_error",
          level: "warn",
        }),
      );
      expect(send.error.mock.calls[0][0].content).toContain(
        'Error processing tool "navigate"',
      );
      expect(send.success).not.toHaveBeenCalled();
    });

    it("returns an error when parameters is an empty string", async () => {
      const onAction = vi.fn<(action: VoiceAction) => void>();
      const handler = createChipToolCallHandler(onAction);
      const send = createMockSend();

      await handler(createMessage("navigate", ""), send);

      expect(onAction).not.toHaveBeenCalled();
      expect(send.error).toHaveBeenCalledOnce();
      expect(send.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Tool call failed",
          code: "tool_error",
          level: "warn",
          content: expect.stringContaining('Error processing tool "navigate"'),
        }),
      );
      expect(send.success).not.toHaveBeenCalled();
    });
  });
});
