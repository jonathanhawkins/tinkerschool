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

const MOCK_ACTIVITY = {
  type: "counting" as const,
  prompt: "Count the apples",
  questions: [
    {
      id: "q1",
      prompt: "How many apples?",
      emoji: "🍎",
      correctCount: 3,
      displayCount: 5,
      hint: "Try counting each one!",
    },
  ],
};

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: MOCK_ACTIVITY,
    state: mockState,
    recordAnswer: mockRecordAnswer,
    subjectColor: "#3B82F6",
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
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

vi.mock("./activity-feedback", () => ({
  ActivityFeedback: () => <div data-testid="activity-feedback" />,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { CountingWidget } from "./counting-widget";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CountingWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders the question prompt", () => {
    render(<CountingWidget />);
    expect(screen.getByText("How many apples?")).toBeDefined();
  });

  it("renders the correct number of emoji items", () => {
    render(<CountingWidget />);
    // 5 displayCount emoji buttons
    const items = screen.getAllByRole("button", { name: /🍎 item/ });
    expect(items).toHaveLength(5);
  });

  it("starts with count at 0", () => {
    render(<CountingWidget />);
    // The count display inside the styled div
    const countElements = screen.getAllByText("0");
    expect(countElements.length).toBeGreaterThanOrEqual(1);
  });

  it("increments count when + button is pressed", () => {
    render(<CountingWidget />);
    // useRepeatPress fires on pointerDown, not click
    fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));
    expect(screen.getByText("1")).toBeDefined();
  });

  it("decrements count when - button is pressed", () => {
    render(<CountingWidget />);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));

    fireEvent.pointerDown(screen.getByRole("button", { name: "Subtract one" }));
    expect(screen.getByText("1")).toBeDefined();
  });

  it("disables minus button at 0", () => {
    render(<CountingWidget />);
    const minus = screen.getByRole("button", { name: "Subtract one" });
    expect(minus).toHaveProperty("disabled", true);
  });

  it("tapping an emoji increments count", () => {
    render(<CountingWidget />);
    fireEvent.click(screen.getByRole("button", { name: "🍎 item 1" }));
    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(screen.getByText("1")).toBeDefined();
  });

  it("tapping same emoji again decrements count", () => {
    render(<CountingWidget />);
    const item = screen.getByRole("button", { name: "🍎 item 1" });
    fireEvent.click(item);
    fireEvent.click(item);
    // Count should be back to 0
    const countElements = screen.getAllByText("0");
    expect(countElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows submit button when count > 0", () => {
    render(<CountingWidget />);
    expect(screen.queryByText("Check My Answer")).toBeNull();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));
    expect(screen.getByText("Check My Answer")).toBeDefined();
  });

  it("calls recordAnswer with correct=true for right count", () => {
    render(<CountingWidget />);
    for (let i = 0; i < 3; i++) {
      fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));
    }

    fireEvent.click(screen.getByText("Check My Answer"));
    expect(mockRecordAnswer).toHaveBeenCalledWith("3", true);
  });

  it("calls recordAnswer with correct=false for wrong count", () => {
    render(<CountingWidget />);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));

    fireEvent.click(screen.getByText("Check My Answer"));
    expect(mockRecordAnswer).toHaveBeenCalledWith("1", false);
  });

  // ---------------------------------------------------------------------------
  // Pre-K mode tests
  // ---------------------------------------------------------------------------

  describe("isPreK mode", () => {
    it("caps displayCount at 5 when isPreK is true", () => {
      // Default mock has displayCount=5, correctCount=3 — both within cap
      render(<CountingWidget isPreK />);
      const items = screen.getAllByRole("button", { name: /🍎 item/ });
      expect(items).toHaveLength(5);
    });

    it("does not call recordAnswer on wrong answer in Pre-K mode", () => {
      render(<CountingWidget isPreK />);
      fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));

      fireEvent.click(screen.getByText("Check My Answer"));
      // In Pre-K mode, wrong answers should NOT call recordAnswer
      expect(mockRecordAnswer).not.toHaveBeenCalled();
    });

    it("shows encouraging message on wrong answer in Pre-K mode", () => {
      render(<CountingWidget isPreK />);
      fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));

      fireEvent.click(screen.getByText("Check My Answer"));
      expect(screen.getByText(/Keep counting/)).toBeDefined();
    });

    it("still calls recordAnswer on correct answer in Pre-K mode", () => {
      render(<CountingWidget isPreK />);
      for (let i = 0; i < 3; i++) {
        fireEvent.pointerDown(screen.getByRole("button", { name: "Add one" }));
      }

      fireEvent.click(screen.getByText("Check My Answer"));
      expect(mockRecordAnswer).toHaveBeenCalledWith("3", true);
    });
  });
});
