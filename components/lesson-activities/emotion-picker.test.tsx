import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockNextQuestion = vi.fn();
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
  type: "emotion_picker" as const,
  questions: [
    {
      id: "q1",
      scenario: "The puppy is lost and can't find its way home.",
      scenarioEmoji: "🐶",
      validEmotions: ["sad", "scared"],
      options: [
        { emotion: "happy", emoji: "😊", label: "Happy" },
        { emotion: "sad", emoji: "😢", label: "Sad" },
        { emotion: "angry", emoji: "😠", label: "Angry" },
        { emotion: "scared", emoji: "😨", label: "Scared" },
        { emotion: "surprised", emoji: "😲", label: "Surprised" },
      ],
    },
    {
      id: "q2",
      scenario: "You got a surprise birthday party!",
      scenarioEmoji: "🎂",
      validEmotions: ["happy", "surprised"],
      options: [
        { emotion: "happy", emoji: "😊", label: "Happy" },
        { emotion: "sad", emoji: "😢", label: "Sad" },
        { emotion: "angry", emoji: "😠", label: "Angry" },
        { emotion: "scared", emoji: "😨", label: "Scared" },
        { emotion: "surprised", emoji: "😲", label: "Surprised" },
      ],
    },
  ],
};

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: MOCK_ACTIVITY,
    state: mockState,
    recordAnswer: mockRecordAnswer,
    nextQuestion: mockNextQuestion,
    subjectColor: "#EC4899",
  }),
}));

vi.mock("@/lib/activities/use-sound", () => ({
  useSound: () => ({ play: mockPlay }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, whileHover: _wh, whileTap: _wt, exit: _e, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, whileHover: _wh, whileTap: _wt, exit: _e, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, transition: _t, exit: _e, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { EmotionPicker } from "./emotion-picker";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("EmotionPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
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
    vi.useRealTimers();
  });

  it("renders the scenario text", () => {
    render(<EmotionPicker />);
    expect(screen.getByText("The puppy is lost and can't find its way home.")).toBeDefined();
  });

  it("renders the scenario emoji", () => {
    render(<EmotionPicker />);
    expect(screen.getByText("🐶")).toBeDefined();
  });

  it("renders all emotion options", () => {
    render(<EmotionPicker />);
    expect(screen.getByText("Happy")).toBeDefined();
    expect(screen.getByText("Sad")).toBeDefined();
    expect(screen.getByText("Angry")).toBeDefined();
    expect(screen.getByText("Scared")).toBeDefined();
    expect(screen.getByText("Surprised")).toBeDefined();
  });

  it("renders emotion emojis", () => {
    render(<EmotionPicker />);
    expect(screen.getByText("😊")).toBeDefined();
    expect(screen.getByText("😢")).toBeDefined();
    expect(screen.getByText("😠")).toBeDefined();
    expect(screen.getByText("😨")).toBeDefined();
    expect(screen.getByText("😲")).toBeDefined();
  });

  it("renders the helper prompt text", () => {
    render(<EmotionPicker />);
    expect(screen.getByText("How does this make you feel?")).toBeDefined();
  });

  it("calls recordAnswer with correct=true when selecting a valid emotion", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Sad"));

    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(mockPlay).toHaveBeenCalledWith("correct");
    expect(mockRecordAnswer).toHaveBeenCalledWith("sad", true);
  });

  it("calls recordAnswer with correct=false when selecting an invalid emotion", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Angry"));

    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(mockRecordAnswer).toHaveBeenCalledWith("angry", false);
  });

  it("shows celebration message after selecting a valid emotion", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Sad"));

    expect(screen.getByTestId("celebration-message")).toBeDefined();
  });

  it("shows encouragement message (not 'wrong') after selecting an invalid emotion", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Angry"));

    const encouragement = screen.getByTestId("encouragement-message");
    expect(encouragement).toBeDefined();
    // Verify it does NOT contain "wrong", "incorrect", "no", or "bad"
    const text = encouragement.textContent ?? "";
    expect(text.toLowerCase()).not.toContain("wrong");
    expect(text.toLowerCase()).not.toContain("incorrect");
    expect(text.toLowerCase()).not.toContain("bad");
  });

  it("auto-advances to next question after valid selection", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Scared"));

    // Advance timers past the auto-advance delay (1800ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNextQuestion).toHaveBeenCalledTimes(1);
  });

  it("does not auto-advance after an invalid selection", () => {
    render(<EmotionPicker />);
    fireEvent.click(screen.getByLabelText("Happy"));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockNextQuestion).not.toHaveBeenCalled();
  });

  it("accepts multiple valid emotions for the same scenario", () => {
    render(<EmotionPicker />);

    // Both "sad" and "scared" are valid for this scenario
    fireEvent.click(screen.getByLabelText("Scared"));
    expect(mockRecordAnswer).toHaveBeenCalledWith("scared", true);
    expect(mockPlay).toHaveBeenCalledWith("correct");
  });

  it("has accessible role group for emotion choices", () => {
    render(<EmotionPicker />);
    expect(screen.getByRole("group", { name: "emotion choices" })).toBeDefined();
  });

  it("has aria-labels on all emotion buttons", () => {
    render(<EmotionPicker />);
    for (const label of ["Happy", "Sad", "Angry", "Scared", "Surprised"]) {
      expect(screen.getByLabelText(label)).toBeDefined();
    }
  });
});
