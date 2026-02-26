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
  type: "sequence_order" as const,
  questions: [
    {
      id: "q1",
      prompt: "Put the numbers in order",
      items: [
        { id: "i1", text: "One", emoji: "1️⃣", correctPosition: 1 },
        { id: "i2", text: "Two", emoji: "2️⃣", correctPosition: 2 },
        { id: "i3", text: "Three", emoji: "3️⃣", correctPosition: 3 },
        { id: "i4", text: "Four", emoji: "4️⃣", correctPosition: 4 },
        { id: "i5", text: "Five", emoji: "5️⃣", correctPosition: 5 },
      ],
      hint: "Start from the smallest number!",
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

// Mock framer-motion including Reorder components
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
  Reorder: {
    Group: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { axis: _axis, values: _values, onReorder: _onReorder, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    Item: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { value: _value, whileDrag: _wd, ...rest } = props;
      return <div {...rest}>{children}</div>;
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

import { SequenceOrder } from "./sequence-order";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SequenceOrder", () => {
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
    render(<SequenceOrder />);
    expect(screen.getByText("Put the numbers in order")).toBeDefined();
  });

  it("renders all 5 items in normal mode", () => {
    render(<SequenceOrder />);
    expect(screen.getByText("One")).toBeDefined();
    expect(screen.getByText("Two")).toBeDefined();
    expect(screen.getByText("Three")).toBeDefined();
    expect(screen.getByText("Four")).toBeDefined();
    expect(screen.getByText("Five")).toBeDefined();
  });

  it("shows the Check Order button", () => {
    render(<SequenceOrder />);
    expect(screen.getByText("Check Order")).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Interaction tests
  // ---------------------------------------------------------------------------

  describe("interactions", () => {
    it("clicking Check Order with correct sequence calls recordAnswer(correct=true)", () => {
      // Mock Math.random to return 0.9, which keeps Fisher-Yates array in original order
      // (j === i at each step), so items stay as [One, Two, Three, Four, Five] = correct
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);
      render(<SequenceOrder />);
      randomSpy.mockRestore();

      fireEvent.click(screen.getByText("Check Order"));

      expect(mockRecordAnswer).toHaveBeenCalledTimes(1);
      // The answer string is the comma-joined text of items in current order
      expect(mockRecordAnswer).toHaveBeenCalledWith(
        "One,Two,Three,Four,Five",
        true,
      );
    });

    it("clicking Check Order with wrong sequence calls recordAnswer(correct=false)", () => {
      // Mock Math.random to return 0 — produces a deterministic wrong order
      // Fisher-Yates with random()=0: each step swaps current with index 0
      // Result: [Two, Three, Four, Five, One] (not the correct order)
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
      render(<SequenceOrder />);
      randomSpy.mockRestore();

      fireEvent.click(screen.getByText("Check Order"));

      expect(mockRecordAnswer).toHaveBeenCalledTimes(1);
      expect(mockRecordAnswer).toHaveBeenCalledWith(
        "Two,Three,Four,Five,One",
        false,
      );
    });

    it("tap-to-swap: tapping two items swaps their positions", () => {
      // Keep items in original correct order
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);
      render(<SequenceOrder />);
      randomSpy.mockRestore();

      // The Reorder.Item mock renders as <div> with onClick.
      // Items are rendered in order: One(0), Two(1), Three(2), Four(3), Five(4)
      // Tapping "One" then "Five" should swap them.
      fireEvent.click(screen.getByText("One"));
      expect(mockPlay).toHaveBeenCalledWith("tap");
      fireEvent.click(screen.getByText("Five"));

      // Now click Check Order — order should be Five,Two,Three,Four,One (wrong)
      fireEvent.click(screen.getByText("Check Order"));
      expect(mockRecordAnswer).toHaveBeenCalledWith(
        "Five,Two,Three,Four,One",
        false,
      );
    });

    it("tapping the same item twice deselects it (no swap)", () => {
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);
      render(<SequenceOrder />);
      randomSpy.mockRestore();

      // Tap "One" to select, then tap "One" again to deselect
      fireEvent.click(screen.getByText("One"));
      fireEvent.click(screen.getByText("One"));

      // Order should remain correct — clicking Check Order should succeed
      fireEvent.click(screen.getByText("Check Order"));
      expect(mockRecordAnswer).toHaveBeenCalledWith(
        "One,Two,Three,Four,Five",
        true,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Pre-K mode tests
  // ---------------------------------------------------------------------------

  describe("isPreK mode", () => {
    it("limits to 3 items in Pre-K mode", () => {
      render(<SequenceOrder isPreK />);
      expect(screen.getByText("One")).toBeDefined();
      expect(screen.getByText("Two")).toBeDefined();
      expect(screen.getByText("Three")).toBeDefined();
      // Fourth and fifth items should not be rendered
      expect(screen.queryByText("Four")).toBeNull();
      expect(screen.queryByText("Five")).toBeNull();
    });

    it("still shows the Check Order button in Pre-K mode", () => {
      render(<SequenceOrder isPreK />);
      expect(screen.getByText("Check Order")).toBeDefined();
    });

    it("wrong sequence in Pre-K shows encouraging message, does NOT call recordAnswer", () => {
      // Use Math.random = 0 to get a wrong order for Pre-K (3 items)
      // Pre-K slices to first 3 items: [One, Two, Three]
      // Fisher-Yates with random()=0:
      //   i=2: j=0, swap [2,0] -> [Three, Two, One]
      //   i=1: j=0, swap [1,0] -> [Two, Three, One]
      // Result: [Two, Three, One] (not correct order One,Two,Three)
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
      render(<SequenceOrder isPreK />);
      randomSpy.mockRestore();

      fireEvent.click(screen.getByText("Check Order"));

      // Pre-K incorrect path: does NOT call recordAnswer
      expect(mockRecordAnswer).not.toHaveBeenCalled();
      // Plays "tap" sound for the gentle feedback
      expect(mockPlay).toHaveBeenCalledWith("tap");
      // Shows encouraging hint message
      expect(
        screen.getByText(/almost there/i),
      ).toBeDefined();
    });

    it("correct sequence in Pre-K still calls recordAnswer", () => {
      // Keep items in correct order
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);
      render(<SequenceOrder isPreK />);
      randomSpy.mockRestore();

      fireEvent.click(screen.getByText("Check Order"));

      expect(mockRecordAnswer).toHaveBeenCalledTimes(1);
      expect(mockRecordAnswer).toHaveBeenCalledWith("One,Two,Three", true);
    });
  });
});
