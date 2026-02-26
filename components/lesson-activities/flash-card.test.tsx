import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

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
  type: "flash_card" as const,
  prompt: "Learn the colors!",
  cards: [
    {
      id: "c1",
      front: { text: "RED", emoji: "🔴" },
      back: { text: "Rojo", emoji: "🇪🇸" },
      color: "#EF4444",
    },
    {
      id: "c2",
      front: { text: "BLUE", emoji: "🔵" },
      back: { text: "Azul", emoji: "🇪🇸" },
      color: "#3B82F6",
    },
  ],
};

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: MOCK_ACTIVITY,
    state: mockState,
    recordAnswer: mockRecordAnswer,
    nextQuestion: mockNextQuestion,
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
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { FlashCard } from "./flash-card";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FlashCard", () => {
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
    vi.useRealTimers();
    cleanup();
  });

  it("renders the prompt", () => {
    render(<FlashCard />);
    expect(screen.getByText("Learn the colors!")).toBeDefined();
  });

  it("renders the card front text", () => {
    render(<FlashCard />);
    expect(screen.getByText("RED")).toBeDefined();
  });

  it("shows flip instruction", () => {
    render(<FlashCard />);
    expect(screen.getByText("Tap the card to flip it!")).toBeDefined();
  });

  it("flips the card on click and shows Next Card button", () => {
    render(<FlashCard />);
    const card = screen.getByRole("button", { name: /Card front/ });
    fireEvent.click(card);
    expect(mockPlay).toHaveBeenCalledWith("flip");
    // After flipping, the Next Card button should appear
    expect(screen.getByText("Next Card")).toBeDefined();
  });

  it("calls recordAnswer and nextQuestion on Next Card click", () => {
    render(<FlashCard />);
    const card = screen.getByRole("button", { name: /Card front/ });
    fireEvent.click(card);

    fireEvent.click(screen.getByText("Next Card"));
    expect(mockRecordAnswer).toHaveBeenCalledWith("seen", true);
    expect(mockNextQuestion).toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Pre-K mode tests
  // ---------------------------------------------------------------------------

  describe("isPreK mode", () => {
    it("shows auto-advance message after flipping in Pre-K mode", () => {
      render(<FlashCard isPreK />);
      const card = screen.getByRole("button", { name: /Card front/ });
      fireEvent.click(card);

      expect(screen.getByText(/Auto-advancing/)).toBeDefined();
    });

    it("auto-advances after 3 seconds in Pre-K mode", () => {
      render(<FlashCard isPreK />);
      const card = screen.getByRole("button", { name: /Card front/ });
      fireEvent.click(card);

      // Advance timers by 3 seconds
      vi.advanceTimersByTime(3000);

      // Should have auto-called recordAnswer and nextQuestion
      expect(mockRecordAnswer).toHaveBeenCalledWith("seen", true);
      expect(mockNextQuestion).toHaveBeenCalled();
    });

    it("does not auto-advance in normal mode", () => {
      render(<FlashCard />);
      const card = screen.getByRole("button", { name: /Card front/ });
      fireEvent.click(card);

      vi.advanceTimersByTime(5000);

      // Should NOT have auto-called
      expect(mockRecordAnswer).not.toHaveBeenCalled();
    });

    it("still allows manual Next Card in Pre-K mode", () => {
      render(<FlashCard isPreK />);
      const card = screen.getByRole("button", { name: /Card front/ });
      fireEvent.click(card);

      // Click Next Card before auto-advance
      fireEvent.click(screen.getByText("Next Card"));
      expect(mockRecordAnswer).toHaveBeenCalledWith("seen", true);
    });
  });
});
