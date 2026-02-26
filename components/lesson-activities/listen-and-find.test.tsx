import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockPlay = vi.fn();
const mockSpeak = vi.fn();
const mockStop = vi.fn();
const mockReplay = vi.fn();

let mockState = {
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

const MOCK_ACTIVITY = {
  type: "listen_and_find" as const,
  questions: [
    {
      id: "q1",
      prompt: "Which animal makes this sound?",
      spokenText: "Moo! Which animal says moo?",
      correctOptionId: "cow",
      options: [
        { id: "cow", emoji: "\uD83D\uDC04", label: "Cow" },
        { id: "cat", emoji: "\uD83D\uDC31", label: "Cat" },
        { id: "dog", emoji: "\uD83D\uDC15", label: "Dog" },
      ],
    },
    {
      id: "q2",
      prompt: "Which animal quacks?",
      spokenText: "Quack quack! Which animal says quack?",
      correctOptionId: "duck",
      options: [
        { id: "duck", emoji: "\uD83E\uDD86", label: "Duck" },
        { id: "pig", emoji: "\uD83D\uDC37", label: "Pig" },
        { id: "horse", emoji: "\uD83D\uDC34", label: "Horse" },
      ],
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

vi.mock("@/hooks/use-audio-narration", () => ({
  useAudioNarration: () => ({
    speak: mockSpeak,
    stop: mockStop,
    isSpeaking: false,
    isSupported: true,
    replay: mockReplay,
  }),
}));

vi.mock("@/components/audio-replay-button", () => ({
  AudioReplayButton: ({ text }: { text: string }) => (
    <button data-testid="audio-replay-button" aria-label="Listen to this question">
      {text}
    </button>
  ),
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
        exit: _e,
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
        exit: _e,
        ...rest
      } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        exit: _e,
        ...rest
      } = props;
      return <p {...rest}>{children}</p>;
    },
    span: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        exit: _e,
        ...rest
      } = props;
      return <span {...rest}>{children}</span>;
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { ListenAndFind } from "./listen-and-find";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ListenAndFind", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockState = {
      currentActivityIndex: 0,
      currentQuestionIndex: 0,
      isComplete: false,
      showingFeedback: false,
      feedbackType: "none",
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
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the question prompt", () => {
    render(<ListenAndFind />);
    expect(
      screen.getByText("Which animal makes this sound?"),
    ).toBeDefined();
  });

  it("renders all option labels", () => {
    render(<ListenAndFind />);
    expect(screen.getByText("Cow")).toBeDefined();
    expect(screen.getByText("Cat")).toBeDefined();
    expect(screen.getByText("Dog")).toBeDefined();
  });

  it("renders emojis for each option", () => {
    render(<ListenAndFind />);
    expect(screen.getByText("\uD83D\uDC04")).toBeDefined();
    expect(screen.getByText("\uD83D\uDC31")).toBeDefined();
    expect(screen.getByText("\uD83D\uDC15")).toBeDefined();
  });

  it("renders the AudioReplayButton with spokenText", () => {
    render(<ListenAndFind />);
    const replayBtn = screen.getByTestId("audio-replay-button");
    expect(replayBtn).toBeDefined();
    expect(replayBtn.textContent).toContain(
      "Moo! Which animal says moo?",
    );
  });

  it("auto-plays audio on mount after delay", () => {
    render(<ListenAndFind />);
    expect(mockSpeak).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSpeak).toHaveBeenCalledWith(
      "Moo! Which animal says moo?",
    );
  });

  it("calls recordAnswer with correct=true when clicking right answer", () => {
    render(<ListenAndFind />);

    // Advance past auto-play
    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByLabelText("Cow"));

    expect(mockPlay).toHaveBeenCalledWith("tap");
    expect(mockRecordAnswer).toHaveBeenCalledWith("cow", true);
  });

  it("speaks celebration message on correct selection", () => {
    render(<ListenAndFind />);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    mockSpeak.mockClear();

    fireEvent.click(screen.getByLabelText("Cow"));

    expect(mockSpeak).toHaveBeenCalledWith(
      "That's right! It's a Cow!",
    );
  });

  it("shows encouragement on incorrect selection", () => {
    render(<ListenAndFind />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByLabelText("Cat"));

    expect(screen.getByText("Hmm, listen again!")).toBeDefined();
  });

  it("does not call recordAnswer on incorrect selection", () => {
    render(<ListenAndFind />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByLabelText("Cat"));

    // recordAnswer should NOT be called for wrong answers
    expect(mockRecordAnswer).not.toHaveBeenCalled();
  });

  it("replays audio after incorrect selection", () => {
    render(<ListenAndFind />);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    mockSpeak.mockClear();

    fireEvent.click(screen.getByLabelText("Dog"));

    // Advance past the flash + encouragement delay
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(mockSpeak).toHaveBeenCalledWith(
      "Moo! Which animal says moo?",
    );
  });

  it("renders options with accessible labels", () => {
    render(<ListenAndFind />);

    expect(screen.getByLabelText("Cow")).toBeDefined();
    expect(screen.getByLabelText("Cat")).toBeDefined();
    expect(screen.getByLabelText("Dog")).toBeDefined();
  });

  it("disables options while locked after correct answer", () => {
    render(<ListenAndFind />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByLabelText("Cow"));

    // While celebrating, buttons should be disabled
    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label") !== "Listen to this question",
    );
    for (const btn of buttons) {
      expect(btn).toHaveProperty("disabled", true);
    }
  });
});
