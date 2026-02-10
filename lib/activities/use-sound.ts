"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getSoundManager, type SoundEffect } from "./sound-manager";

// ---------------------------------------------------------------------------
// useSound - React hook for the SoundManager singleton
// ---------------------------------------------------------------------------
// Subscribes to preference changes (volume, mute) so the UI stays in sync.
// Handles AudioContext initialization on first user interaction automatically.
// ---------------------------------------------------------------------------

/** Snapshot selectors for useSyncExternalStore */
function getVolumeSnapshot(): number {
  return getSoundManager().volume;
}

function getMutedSnapshot(): boolean {
  return getSoundManager().muted;
}

/** Server-side fallback snapshots */
function getServerVolumeSnapshot(): number {
  return 0.5;
}

function getServerMutedSnapshot(): boolean {
  return false;
}

export interface UseSoundReturn {
  /** Play a sound effect by name */
  play: (effect: SoundEffect) => void;
  /** Current volume level (0-1) */
  volume: number;
  /** Whether sound is muted */
  muted: boolean;
  /** Set volume (0-1) */
  setVolume: (v: number) => void;
  /** Toggle mute on/off */
  toggleMute: () => void;
}

export function useSound(): UseSoundReturn {
  const manager = getSoundManager();

  // Subscribe to preference changes via useSyncExternalStore
  const subscribe = useCallback(
    (onStoreChange: () => void) => manager.subscribe(onStoreChange),
    [manager],
  );

  const volume = useSyncExternalStore(
    subscribe,
    getVolumeSnapshot,
    getServerVolumeSnapshot,
  );

  const muted = useSyncExternalStore(
    subscribe,
    getMutedSnapshot,
    getServerMutedSnapshot,
  );

  // Stable callbacks
  const play = useCallback(
    (effect: SoundEffect) => {
      manager.play(effect);
    },
    [manager],
  );

  const setVolume = useCallback(
    (v: number) => {
      manager.setVolume(v);
    },
    [manager],
  );

  const toggleMute = useCallback(() => {
    manager.toggleMute();
  }, [manager]);

  return { play, volume, muted, setVolume, toggleMute };
}
