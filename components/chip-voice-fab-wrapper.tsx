"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import type { ChipVoiceProps } from "@/lib/hume/types";

const ChipVoiceFab = dynamic(() => import("./chip-voice-fab"), {
  ssr: false,
  loading: () => <FabSkeleton />,
});

/**
 * Client wrapper that dynamic-imports ChipVoiceFab with ssr:false.
 * The parent server component fetches the access token and passes it in.
 *
 * IMPORTANT: We capture the initial props on first mount and freeze them.
 * On client-side navigations, Next.js re-runs the server layout which
 * produces new prop values (especially `accessToken`). If we passed those
 * through, React would re-render ChipVoiceFab with new props, which can
 * cause VoiceProvider to remount — killing any active WebSocket connection.
 *
 * The access token is refreshed lazily at connect time via the
 * `refreshHumeAccessToken` server action, so the initial token is only a
 * fallback. The `pageContext` contains profile data (child name, progress)
 * that doesn't change between page navigations — the current page is
 * detected client-side via `usePathname()`.
 */
export default function ChipVoiceFabWrapper(props: ChipVoiceProps) {
  const frozenProps = useRef(props);
  return <ChipVoiceFab {...frozenProps.current} />;
}

function FabSkeleton() {
  return (
    <div className="fixed right-6 bottom-6 z-50 size-14 animate-pulse rounded-full bg-primary/20" />
  );
}
