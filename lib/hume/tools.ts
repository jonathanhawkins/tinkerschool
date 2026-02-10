/**
 * Tool call handler for Chip Voice (Hume EVI).
 *
 * When Chip's LLM decides to highlight a UI element, show a celebration,
 * or display a hint, Hume dispatches a tool call over the WebSocket.
 * This handler processes the call client-side and returns a result so
 * the LLM can continue the conversation.
 */
import type { ToolCallHandler } from "@humeai/voice-react";

import type { VoiceAction } from "./types";

/**
 * Creates a ToolCallHandler that dispatches VoiceActions via the
 * provided callback. Each tool registered in the Hume EVI config
 * maps to a VoiceAction type.
 */
export function createChipToolCallHandler(
  onAction: (action: VoiceAction) => void
): ToolCallHandler {
  return async (message, send) => {
    const { name, parameters } = message;

    try {
      switch (name) {
        case "navigate": {
          const params = JSON.parse(parameters) as { path?: string };
          const path = params.path;
          if (!path || typeof path !== "string" || !path.startsWith("/")) {
            return send.error({
              error: "Invalid path",
              code: "invalid_params",
              level: "warn",
              content: `Navigate tool requires a valid path starting with "/". Got: ${JSON.stringify(path)}`,
            });
          }
          onAction({ type: "navigate", path });
          return send.success({ status: "navigating", path });
        }

        case "highlight_element": {
          // UI highlighting is not yet implemented — tell the LLM so
          // it doesn't claim it highlighted something.
          return send.success({
            status: "not_available",
            message: "Visual highlighting is not supported yet. Describe what you want the child to look at instead.",
          });
        }

        case "show_celebration": {
          onAction({ type: "celebrate" });
          return send.success({ status: "celebration_triggered" });
        }

        case "show_hint": {
          // Hint overlay is not yet implemented — tell the LLM to
          // say the hint in conversation instead.
          return send.success({
            status: "not_available",
            message: "Hint overlay is not supported yet. Say the hint aloud to the child instead.",
          });
        }

        default:
          return send.error({
            error: "Unknown tool",
            code: "unknown_tool",
            level: "warn",
            content: `Tool "${name}" is not registered.`,
          });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return send.error({
        error: "Tool call failed",
        code: "tool_error",
        level: "warn",
        content: `Error processing tool "${name}": ${msg}`,
      });
    }
  };
}
