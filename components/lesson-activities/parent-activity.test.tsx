import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockPlay = vi.fn();

const mockState = {
  currentActivityIndex: 0,
  currentQuestionIndex: 0,
  isComplete: false,
  showingFeedback: false,
  feedbackType: "none" as string,
  metrics: {
    totalQuestions: 0,
    correctFirstTry: 0,
    correctTotal: 0,
    totalTimeMs: 0,
    hintsUsed: 0,
    score: 0,
    answers: [],
  },
  hasPassed: false,
};

const MOCK_ACTIVITY_WITH_TIP = {
  type: "parent_activity" as const,
  prompt: "Off-Screen Fun!",
  instructions: "Count 5 toys around the room with your child.",
  parentTip: "Let your child point to each toy as they count.",
  completionPrompt: "Did you count your toys together?",
  illustration: "🧸",
};

const MOCK_ACTIVITY_NO_TIP = {
  type: "parent_activity" as const,
  prompt: "Let's Explore!",
  instructions: "Go outside and find 3 different leaves.",
  completionPrompt: "Did you find your leaves?",
};

// Mutable ref so individual tests can swap the activity
let currentMockActivity: Record<string, unknown> = MOCK_ACTIVITY_WITH_TIP;

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: currentMockActivity,
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
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        whileHover: _wh,
        whileTap: _wt,
        ...rest
      } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        whileHover: _wh,
        whileTap: _wt,
        ...rest
      } = props;
      return <button {...rest}>{children}</button>;
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { ParentActivity } from "./parent-activity";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ParentActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentMockActivity = MOCK_ACTIVITY_WITH_TIP;
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the prompt title", () => {
    render(<ParentActivity />);
    expect(screen.getByText("Off-Screen Fun!")).toBeDefined();
  });

  it("renders the instructions", () => {
    render(<ParentActivity />);
    expect(
      screen.getByText("Count 5 toys around the room with your child."),
    ).toBeDefined();
  });

  it("renders the completion prompt", () => {
    render(<ParentActivity />);
    expect(
      screen.getByText("Did you count your toys together?"),
    ).toBeDefined();
  });

  it("renders the 'We did it!' button", () => {
    render(<ParentActivity />);
    expect(screen.getByText("We did it!")).toBeDefined();
  });

  it("renders the illustration emoji", () => {
    render(<ParentActivity />);
    expect(screen.getByText("🧸")).toBeDefined();
  });

  it("renders the parentTip when provided", () => {
    render(<ParentActivity />);
    expect(screen.getByText("Parent Tip")).toBeDefined();
    expect(
      screen.getByText(
        "Let your child point to each toy as they count.",
      ),
    ).toBeDefined();
  });

  it("calls recordAnswer and plays sound when 'We did it!' is clicked", () => {
    render(<ParentActivity />);
    fireEvent.click(screen.getByText("We did it!"));

    expect(mockPlay).toHaveBeenCalledWith("complete");
    expect(mockRecordAnswer).toHaveBeenCalledWith("completed", true);
  });

  it("shows 'Great job!' after completion", () => {
    render(<ParentActivity />);
    fireEvent.click(screen.getByText("We did it!"));

    expect(screen.getByText("Great job!")).toBeDefined();
  });

  it("hides 'We did it!' button after completion", () => {
    render(<ParentActivity />);
    fireEvent.click(screen.getByText("We did it!"));

    expect(screen.queryByText("We did it!")).toBeNull();
  });

  it("does not render parentTip when not provided", () => {
    currentMockActivity = MOCK_ACTIVITY_NO_TIP;
    render(<ParentActivity />);
    expect(screen.queryByText("Parent Tip")).toBeNull();
  });
});
