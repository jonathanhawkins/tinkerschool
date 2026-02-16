import { describe, it, expect, beforeEach } from "vitest";
import { useWorkshopBanners } from "./use-workshop-banners";

// ---------------------------------------------------------------------------
// Reset zustand store between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Reset the zustand store to initial state
  useWorkshopBanners.setState({
    storyDismissed: false,
    simBannerDismissed: false,
  });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useWorkshopBanners", () => {
  it("initializes with both banners visible", () => {
    const state = useWorkshopBanners.getState();
    expect(state.storyDismissed).toBe(false);
    expect(state.simBannerDismissed).toBe(false);
  });

  it("dismisses story banner", () => {
    useWorkshopBanners.getState().dismissStory();
    const state = useWorkshopBanners.getState();
    expect(state.storyDismissed).toBe(true);
    expect(state.simBannerDismissed).toBe(false);
  });

  it("dismisses sim banner", () => {
    useWorkshopBanners.getState().dismissSimBanner();
    const state = useWorkshopBanners.getState();
    expect(state.storyDismissed).toBe(false);
    expect(state.simBannerDismissed).toBe(true);
  });

  it("resets both banners", () => {
    useWorkshopBanners.getState().dismissStory();
    useWorkshopBanners.getState().dismissSimBanner();

    useWorkshopBanners.getState().resetBanners();
    const state = useWorkshopBanners.getState();
    expect(state.storyDismissed).toBe(false);
    expect(state.simBannerDismissed).toBe(false);
  });
});
