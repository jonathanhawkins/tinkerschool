"use client";

// =============================================================================
// PreKAutoNarrator - Placeholder for Pre-K narration (now user-initiated)
// =============================================================================
// Auto-narration has been disabled to avoid burning voice/TTS tokens.
// Narration is now triggered only when the user taps the Chip icon or
// "Hear Again" button. This component is kept as a no-op so existing
// <PreKAutoNarrator enabled={isPreK} /> call sites don't break.
// =============================================================================

interface PreKAutoNarratorProps {
  /** Only active when true */
  enabled: boolean;
}

export function PreKAutoNarrator(_props: PreKAutoNarratorProps) {
  return null;
}
