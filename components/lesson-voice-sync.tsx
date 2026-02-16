"use client";

/**
 * Pushes lesson context into the voice bridge on mount and clears it on
 * unmount so that Chip (running in an independent React root) knows what
 * lesson the kid is on and can act as a real teacher.
 *
 * Renders nothing — purely a side-effect component.
 */

import { useEffect } from "react";

import type { VoiceLessonContext } from "@/lib/hume/types";
import { voiceBridge } from "@/lib/hume/voice-bridge";

interface LessonVoiceSyncProps {
  lessonContext: VoiceLessonContext;
}

export function LessonVoiceSync({ lessonContext }: LessonVoiceSyncProps) {
  useEffect(() => {
    voiceBridge.setLessonContext(lessonContext);
    return () => {
      voiceBridge.setLessonContext(null);
    };
  }, [lessonContext]);

  return null;
}
