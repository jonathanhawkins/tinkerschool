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
  type: "multiple_choice" as const,
  prompt: "Choose the right answer",
  questions: [
    {
      id: "q1",
      prompt: "What is 2 + 2?",
      promptEmoji: "🧮",
      options: [
        { id: "a", text: "Three", emoji: "" },
        { id: "b", text: "Four", emoji: "" },
        { id: "c", text: "Five", emoji: "" },
      ],
      correctOptionId: "b",
      hint: "Count on your fingers!",
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

import { MultipleChoice } from "./multiple-choice";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MultipleChoice", () => {
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
    render(<MultipleChoice />);
    expect(screen.getByText("What is 2 + 2?")).toBeDefined();
  });

  it("renders the prompt emoji", () => {
    render(<MultipleChoice />);
    expect(screen.getByText("🧮")).toBeDefined();
  });

  it("renders all options", () => {
    render(<MultipleChoice />);
    expect(screen.getByText("Three")).toBeDefined();
    expect(screen.getByText("Four")).toBeDefined();
    expect(screen.getByText("Five")).toBeDefined();
  });

  it("calls recordAnswer with correct=true when clicking right answer", () => {
    render(<MultipleChoice />);
    fireEvent.click(screen.getByText("Four"));

    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(mockRecordAnswer).toHaveBeenCalledWith("b", true);
  });

  it("calls recordAnswer with correct=false when clicking wrong answer", () => {
    render(<MultipleChoice />);
    fireEvent.click(screen.getByText("Three"));

    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(mockRecordAnswer).toHaveBeenCalledWith("a", false);
  });

  it("disables options after correct answer", () => {
    mockState.showingFeedback = true;
    mockState.feedbackType = "correct";

    render(<MultipleChoice />);

    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toHaveProperty("disabled", true);
    }
  });

  it("renders ActivityFeedback component", () => {
    render(<MultipleChoice />);
    expect(screen.getByTestId("activity-feedback")).toBeDefined();
  });
});
