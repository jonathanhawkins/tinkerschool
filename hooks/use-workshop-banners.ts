"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WorkshopBannersState {
  /** Whether the lesson story banner has been dismissed */
  storyDismissed: boolean;
  /** Whether the simulator encouragement banner has been dismissed */
  simBannerDismissed: boolean;

  /** Dismiss the lesson story banner (persisted) */
  dismissStory: () => void;
  /** Dismiss the simulator encouragement banner (persisted) */
  dismissSimBanner: () => void;
  /** Reset both banners to visible (e.g. user wants to see tips again) */
  resetBanners: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useWorkshopBanners = create<WorkshopBannersState>()(
  persist(
    (set) => ({
      storyDismissed: false,
      simBannerDismissed: false,

      dismissStory: () => set({ storyDismissed: true }),
      dismissSimBanner: () => set({ simBannerDismissed: true }),
      resetBanners: () => set({ storyDismissed: false, simBannerDismissed: false }),
    }),
    {
      name: "tinkerschool-workshop-banners",
    },
  ),
);
