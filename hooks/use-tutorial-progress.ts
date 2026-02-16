"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Tutorial Progress Store
// ---------------------------------------------------------------------------
// Tracks which tutorial steps and concept introductions a kid has completed.
// Persisted to localStorage so tutorials only show once.
// ---------------------------------------------------------------------------

interface TutorialProgressState {
  /** Whether the Blockly editor walkthrough has been completed */
  blocklyTutorialComplete: boolean;
  /** Whether the coding lesson walkthrough has been seen */
  codingWalkthroughSeen: boolean;
  /** Set of concept IDs that have been introduced (e.g., "loops", "variables") */
  conceptsSeen: string[];
  /** Number of coding lessons opened (to decide when to show hints) */
  codingLessonsOpened: number;

  /** Mark the Blockly tutorial as complete */
  completeBlocklyTutorial: () => void;
  /** Mark the coding walkthrough as seen */
  markCodingWalkthroughSeen: () => void;
  /** Mark a concept as introduced */
  markConceptSeen: (conceptId: string) => void;
  /** Increment coding lessons opened count */
  incrementCodingLessons: () => void;
  /** Check if a concept has been introduced */
  hasSeenConcept: (conceptId: string) => boolean;
  /** Reset all tutorial progress (for testing or re-onboarding) */
  resetTutorialProgress: () => void;
}

export const useTutorialProgress = create<TutorialProgressState>()(
  persist(
    (set, get) => ({
      blocklyTutorialComplete: false,
      codingWalkthroughSeen: false,
      conceptsSeen: [],
      codingLessonsOpened: 0,

      completeBlocklyTutorial: () => set({ blocklyTutorialComplete: true }),
      markCodingWalkthroughSeen: () => set({ codingWalkthroughSeen: true }),
      markConceptSeen: (conceptId: string) =>
        set((state) => ({
          conceptsSeen: state.conceptsSeen.includes(conceptId)
            ? state.conceptsSeen
            : [...state.conceptsSeen, conceptId],
        })),
      incrementCodingLessons: () =>
        set((state) => ({
          codingLessonsOpened: state.codingLessonsOpened + 1,
        })),
      hasSeenConcept: (conceptId: string) =>
        get().conceptsSeen.includes(conceptId),
      resetTutorialProgress: () =>
        set({
          blocklyTutorialComplete: false,
          codingWalkthroughSeen: false,
          conceptsSeen: [],
          codingLessonsOpened: 0,
        }),
    }),
    {
      name: "tinkerschool-tutorial-progress",
    },
  ),
);
