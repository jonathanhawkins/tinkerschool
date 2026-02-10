"use client";

import dynamic from "next/dynamic";

import type { ChipVoiceProps } from "@/lib/hume/types";

const ChipVoiceFab = dynamic(() => import("./chip-voice-fab"), {
  ssr: false,
  loading: () => <FabSkeleton />,
});

/**
 * Client wrapper that dynamic-imports ChipVoiceFab with ssr:false.
 * The parent server component fetches the access token and passes it in.
 */
export default function ChipVoiceFabWrapper(props: ChipVoiceProps) {
  return <ChipVoiceFab {...props} />;
}

function FabSkeleton() {
  return (
    <div className="fixed right-6 bottom-6 z-50 size-14 animate-pulse rounded-full bg-primary/20" />
  );
}
