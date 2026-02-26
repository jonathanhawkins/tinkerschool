import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockPlay = vi.fn();

let mockState = {
  currentActivityIndex: 0,
  currentQuestionIndex: 0,
  isComplete: false,
  showingFeedback: false,
  feedbackType: "none" as string,
  metrics: { totalQuestions: 0, correctFirstTry: 0, correctTotal: 0, totalTimeMs: 0, hintsUsed: 0, score: 0, answers: [] },
  hasPassed: false,
};

const MOCK_EXPLORE_ACTIVITY = {
  type: "tap_and_reveal" as const,
  questions: [
    {
      id: "q1",
      prompt: "Tap to discover what's hiding!",
      mode: "explore" as const,
      gridCols: 3,
      items: [
        { id: "i1", coverEmoji: "☁️", revealEmoji: "🐱", revealLabel: "Cat" },
        { id: "i2", coverEmoji: "☁️", revealEmoji: "🐶", revealLabel: "Dog" },
        { id: "i3", coverEmoji: "🌿", revealEmoji: "🐸", revealLabel: "Frog" },
      ],
    },
  ],
};

const MOCK_FIND_ACTIVITY = {
  type: "tap_and_reveal" as const,
  questions: [
    {
      id: "q2",
      prompt: "Find the hidden animals!",
      mode: "find" as const,
      targetPrompt: "Find all the cats!",
      gridCols: 2,
      items: [
        { id: "i1", coverEmoji: "☁️", revealEmoji: "🐱", revealLabel: "Cat", isTarget: true },
        { id: "i2", coverEmoji: "☁️", revealEmoji: "⭐", revealLabel: "Star", isTarget: false },
        { id: "i3", coverEmoji: "☁️", revealEmoji: "🐱", revealLabel: "Cat", isTarget: true },
        { id: "i4", coverEmoji: "🌿", revealEmoji: "🌺", revealLabel: "Flower", isTarget: false },
      ],
    },
  ],
};

let currentActivity: typeof MOCK_EXPLORE_ACTIVITY | typeof MOCK_FIND_ACTIVITY = MOCK_EXPLORE_ACTIVITY;

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity,
    state: mockState,
    recordAnswer: mockRecordAnswer,
    subjectColor: "#F97316",
  }),
}));

vi.mock("@/lib/activities/use-sound", () => ({
  useSound: () => ({ play: mockPlay }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, whileHover: _wh, whileTap: _wt, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, whileHover: _wh, whileTap: _wt, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, whileHover: _wh, whileTap: _wt, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { TapAndReveal } from "./tap-and-reveal";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TapAndReveal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentActivity = MOCK_EXPLORE_ACTIVITY;
    mockState = {
      currentActivityIndex: 0,
      currentQuestionIndex: 0,
      isComplete: false,
      showingFeedback: false,
      feedbackType: "none",
      metrics: { totalQuestions: 0, correctFirstTry: 0, correctTotal: 0, totalTimeMs: 0, hintsUsed: 0, score: 0, answers: [] },
      hasPassed: false,
    };
  });

  afterEach(() => {
    cleanup();
  });

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  it("renders covered items with cover emojis", () => {
    render(<TapAndReveal />);
    // All 3 items should show their cover emojis
    const clouds = screen.getAllByText("☁️");
    expect(clouds.length).toBe(2); // Two ☁️ covers
    expect(screen.getByText("🌿")).toBeDefined(); // One bush cover
  });

  it("renders the prompt in the heading", () => {
    render(<TapAndReveal />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent).toBe("Tap to discover what's hiding!");
  });

  it("renders explore mode helper text", () => {
    render(<TapAndReveal />);
    expect(screen.getByText("Tap to discover what's hiding!", { selector: "p" })).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Tapping reveals an item
  // -------------------------------------------------------------------------

  it("reveals an item when tapped in explore mode", () => {
    render(<TapAndReveal />);

    // All items should start covered - find the buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);

    // Tap the first item (covered with ☁️)
    fireEvent.click(buttons[0]);

    // Should now show the revealed emoji and label
    expect(screen.getByText("🐱")).toBeDefined();
    expect(screen.getByText("Cat")).toBeDefined();

    // Should play flip sound for explore mode
    expect(mockPlay).toHaveBeenCalledWith("flip");
  });

  it("prevents tapping an already-revealed item", () => {
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    // Clear the mock to check it isn't called again
    mockPlay.mockClear();

    // Tap the same button again - should be disabled
    fireEvent.click(buttons[0]);
    expect(mockPlay).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Explore mode completion
  // -------------------------------------------------------------------------

  it("completes after all items revealed in explore mode", () => {
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");

    // Reveal all 3 items
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    // Should call recordAnswer with all_revealed
    expect(mockRecordAnswer).toHaveBeenCalledWith("all_revealed", true);
    expect(mockPlay).toHaveBeenCalledWith("complete");
  });

  it("shows completion message in explore mode", () => {
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(screen.getByText("You discovered everything!")).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Find mode
  // -------------------------------------------------------------------------

  it("renders target prompt in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);
    expect(screen.getByText("Find all the cats!")).toBeDefined();
  });

  it("plays correct sound when tapping a target in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    // First item is a target (Cat)
    fireEvent.click(buttons[0]);
    expect(mockPlay).toHaveBeenCalledWith("correct");
  });

  it("plays tap sound when tapping a non-target in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    // Second item is not a target (Star)
    fireEvent.click(buttons[1]);
    expect(mockPlay).toHaveBeenCalledWith("tap");
  });

  it("completes after all targets found in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");

    // Reveal both target items (indices 0 and 2)
    fireEvent.click(buttons[0]); // Cat (target)
    fireEvent.click(buttons[2]); // Cat (target)

    expect(mockRecordAnswer).toHaveBeenCalledWith("all_targets_found", true);
    expect(mockPlay).toHaveBeenCalledWith("complete");
  });

  it("shows find mode completion message", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // Cat (target)
    fireEvent.click(buttons[2]); // Cat (target)

    expect(screen.getByText("You found them all!")).toBeDefined();
  });

  it("does not complete if only non-targets are revealed in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");

    // Reveal only non-target items
    fireEvent.click(buttons[1]); // Star (non-target)
    fireEvent.click(buttons[3]); // Flower (non-target)

    expect(mockRecordAnswer).not.toHaveBeenCalled();
  });

  it("shows neutral feedback for non-target reveal in find mode", () => {
    currentActivity = MOCK_FIND_ACTIVITY;
    render(<TapAndReveal />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Star (non-target)

    // Feedback text is split across nodes: "That's a Star! Keep looking!"
    const feedbackParagraph = screen.getByText(/Keep looking/);
    expect(feedbackParagraph).toBeDefined();
    expect(feedbackParagraph.textContent).toContain("Star");
  });
});
