"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { getChipVoiceInitialData } from "@/lib/hume/actions";
import { voiceBridge } from "@/lib/hume/voice-bridge";

/**
 * Global Chip voice coordinator that persists across page navigations.
 *
 * Lives in the ROOT layout (app/layout.tsx). This component does NOT
 * render the voice UI itself. Instead it:
 *
 * 1. Fetches the initial Hume access token + page context (once).
 *
 * 2. Mounts the voice UI (VoiceProvider + FAB) into a **separate React
 *    root** that is completely independent of Next.js's component tree.
 *    This guarantees VoiceProvider never unmounts during navigation,
 *    because it lives outside the tree that Next.js reconciles.
 *
 * 3. Bridges navigation state to the voice root via `voiceBridge`:
 *    - Syncs the current pathname so the FAB knows which route it is on
 *    - Provides router.push so Chip can navigate the user to pages
 *
 * This component renders nothing visible -- all UI is in the voice root.
 */
export default function ChipVoiceGlobal() {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useRef(false);

  // Bridge the Next.js router to the voice root so Chip can navigate.
  // We update the handler on every render because router may change
  // identity, but voiceBridge.setNavigateHandler is cheap (just a ref).
  useEffect(() => {
    voiceBridge.setNavigateHandler((path: string) => {
      router.push(path);
    });
  }, [router]);

  // Sync pathname changes to the voice bridge
  useEffect(() => {
    voiceBridge.setPathname(pathname);
  }, [pathname]);

  // Mount the independent voice root once
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    getChipVoiceInitialData()
      .then(async (data) => {
        if (!data) return;

        // Dynamically import the mount function (browser-only)
        const { mountVoiceRoot } = await import("@/lib/hume/voice-root");
        await mountVoiceRoot(data);
      })
      .catch((err) => {
        console.error("[ChipVoiceGlobal] Failed to mount voice root:", err);
      });
  }, []);

  // This component renders nothing -- the voice UI lives in its own root
  return null;
}
