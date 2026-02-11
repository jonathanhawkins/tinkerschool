/**
 * Independent React root for the Chip Voice UI.
 *
 * The VoiceProvider from @humeai/voice-react disconnects its WebSocket
 * whenever the component unmounts (via a useEffect cleanup with [] deps).
 * Next.js App Router can cause client components to remount during
 * navigation due to RSC reconciliation, ClerkProvider re-evaluation,
 * or Turbopack HMR -- all of which would kill the voice connection.
 *
 * This module solves the problem by rendering VoiceProvider in a
 * **completely separate React root** that is attached to a permanent
 * DOM element outside of Next.js's component tree. Since this root is
 * never affected by Next.js navigation or server component re-renders,
 * VoiceProvider never unmounts and the WebSocket connection survives.
 *
 * Communication with the Next.js app happens through `voiceBridge`:
 * - Pathname updates flow from Next.js -> voice root
 * - Navigation requests flow from voice root -> Next.js
 */

"use client";

import { createRoot, type Root } from "react-dom/client";

import type { ChipVoiceProps } from "@/lib/hume/types";

// Module-level singleton state
let voiceRoot: Root | null = null;
let voiceContainer: HTMLElement | null = null;
let isMounted = false;

/**
 * Mount the Chip Voice UI into an independent React root.
 *
 * This function:
 * 1. Creates a persistent <div> in document.body (once)
 * 2. Creates a React root on that <div> (once)
 * 3. Renders ChipVoiceFab with VoiceProvider into it
 *
 * Safe to call multiple times -- subsequent calls are no-ops.
 */
export async function mountVoiceRoot(props: ChipVoiceProps): Promise<void> {
  if (isMounted) return;
  if (typeof window === "undefined") return;

  isMounted = true;

  // Dynamically import the FAB component (browser-only, uses Web Audio etc.)
  const { default: ChipVoiceFab } = await import(
    "@/components/chip-voice-fab"
  );

  // Create a persistent DOM container that lives outside Next.js's tree.
  // During HMR, Turbopack may re-evaluate this module (resetting the
  // module-level vars) while the old container still exists in the DOM.
  // Remove any stale container before creating a fresh one.
  if (!voiceContainer) {
    const existing = document.getElementById("chip-voice-root");
    if (existing) existing.remove();

    voiceContainer = document.createElement("div");
    voiceContainer.id = "chip-voice-root";
    // Ensure it doesn't interfere with layout
    voiceContainer.style.position = "fixed";
    voiceContainer.style.zIndex = "9999";
    voiceContainer.style.top = "0";
    voiceContainer.style.left = "0";
    voiceContainer.style.width = "0";
    voiceContainer.style.height = "0";
    voiceContainer.style.overflow = "visible";
    voiceContainer.style.pointerEvents = "none";
    document.body.appendChild(voiceContainer);
  }

  // Create a separate React root (NOT part of Next.js's root)
  if (!voiceRoot) {
    voiceRoot = createRoot(voiceContainer);
  }

  // Render VoiceProvider + FAB in the independent root.
  // The wrapper div re-enables pointer events for the actual UI elements.
  voiceRoot.render(
    <div style={{ pointerEvents: "auto" }}>
      <ChipVoiceFab {...props} />
    </div>
  );
}

/**
 * Unmount the Chip Voice UI. Only call this on app teardown (rare).
 */
export function unmountVoiceRoot(): void {
  if (voiceRoot) {
    voiceRoot.unmount();
    voiceRoot = null;
  }
  if (voiceContainer) {
    voiceContainer.remove();
    voiceContainer = null;
  }
  isMounted = false;
}
