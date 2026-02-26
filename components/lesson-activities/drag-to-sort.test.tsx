import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockPlay = vi.fn();
const mockDismissFeedback = vi.fn();
const mockNextQuestion = vi.fn();
const mockUseHint = vi.fn();

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
  type: "drag_to_sort" as const,
  questions: [
    {
      id: "q1",
      prompt: "Sort the animals by size!",
      items: [
        { id: "item-1", label: "Elephant", emoji: "\uD83D\uDC18", correctBucket: "big" },
        { id: "item-2", label: "Mouse", emoji: "\uD83D\uDC2D", correctBucket: "small" },
        { id: "item-3", label: "Whale", emoji: "\uD83D\uDC33", correctBucket: "big" },
        { id: "item-4", label: "Ant", emoji: "\uD83D\uDC1C", correctBucket: "small" },
      ],
      buckets: [
        { id: "big", label: "Big Animals", emoji: "\uD83D\uDCAA" },
        { id: "small", label: "Small Animals", emoji: "\uD83D\uDD0D" },
      ],
      hint: "Think about which animals are bigger than you!",
    },
  ],
};

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: MOCK_ACTIVITY,
    state: mockState,
    recordAnswer: mockRecordAnswer,
    dismissFeedback: mockDismissFeedback,
    nextQuestion: mockNextQuestion,
    useHint: mockUseHint,
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
        layout: _l,
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
        layout: _l,
        ...rest
      } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
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

import { DragToSort } from "./drag-to-sort";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DragToSort", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it("renders the question prompt", () => {
    render(<DragToSort />);
    expect(screen.getByText("Sort the animals by size!")).toBeDefined();
  });

  it("renders all draggable items", () => {
    render(<DragToSort />);
    expect(screen.getByText("Elephant")).toBeDefined();
    expect(screen.getByText("Mouse")).toBeDefined();
    expect(screen.getByText("Whale")).toBeDefined();
    expect(screen.getByText("Ant")).toBeDefined();
  });

  it("renders all bucket labels", () => {
    render(<DragToSort />);
    expect(screen.getByText("Big Animals")).toBeDefined();
    expect(screen.getByText("Small Animals")).toBeDefined();
  });

  it("renders bucket emojis", () => {
    render(<DragToSort />);
    // Bucket emojis
    expect(screen.getByText("\uD83D\uDCAA")).toBeDefined();
    expect(screen.getByText("\uD83D\uDD0D")).toBeDefined();
  });

  it("plays tap sound when selecting an item", () => {
    render(<DragToSort />);
    fireEvent.click(screen.getByText("Elephant"));
    expect(mockPlay).toHaveBeenCalledWith("tap");
  });

  it("sorts item into correct bucket via tap-to-select flow", () => {
    render(<DragToSort />);

    // Tap the Elephant item to select it
    fireEvent.click(screen.getByText("Elephant"));
    expect(mockPlay).toHaveBeenCalledWith("tap");

    // Tap the "Big Animals" bucket
    fireEvent.click(screen.getByLabelText("Big Animals bucket"));
    expect(mockPlay).toHaveBeenCalledWith("match");
  });

  it("shows encouragement on incorrect placement, not an error", () => {
    render(<DragToSort />);

    // Select an item
    fireEvent.click(screen.getByText("Elephant"));

    // Tap the wrong bucket
    fireEvent.click(screen.getByLabelText("Small Animals bucket"));

    // Should play incorrect sound (not "error")
    expect(mockPlay).toHaveBeenCalledWith("incorrect");

    // The item should still be in the unsorted area (not removed)
    expect(screen.getByText("Elephant")).toBeDefined();
  });

  it("calls recordAnswer when all items are sorted correctly", () => {
    render(<DragToSort />);

    // Sort all items correctly using tap flow
    // We need to sort them one by one. The items are shuffled, so we just
    // pick them by their labels.
    const items = [
      { label: "Elephant", bucket: "Big Animals bucket" },
      { label: "Mouse", bucket: "Small Animals bucket" },
      { label: "Whale", bucket: "Big Animals bucket" },
      { label: "Ant", bucket: "Small Animals bucket" },
    ];

    for (const { label, bucket } of items) {
      fireEvent.click(screen.getByText(label));
      fireEvent.click(screen.getByLabelText(bucket));
    }

    expect(mockRecordAnswer).toHaveBeenCalledWith("all_sorted", true);
  });

  it("renders drop-here placeholder text in empty buckets", () => {
    render(<DragToSort />);
    const placeholders = screen.getAllByText("Drop items here");
    expect(placeholders.length).toBe(2);
  });

  it("renders the ActivityFeedback component", () => {
    render(<DragToSort />);
    expect(screen.getByTestId("activity-feedback")).toBeDefined();
  });

  it("renders instruction text for interaction", () => {
    render(<DragToSort />);
    expect(
      screen.getByText(
        "Drag each item to the right bucket, or tap to select then tap a bucket!",
      ),
    ).toBeDefined();
  });

  it("handles HTML5 drag-and-drop to correct bucket", () => {
    render(<DragToSort />);

    const elephantButton = screen.getByText("Elephant").closest("button")!;
    const bigBucket = screen.getByLabelText("Big Animals bucket");

    // Simulate HTML5 drag start
    fireEvent.dragStart(elephantButton, {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: "move",
      },
    });

    // Simulate drag over bucket
    fireEvent.dragOver(bigBucket, {
      dataTransfer: { dropEffect: "move" },
    });

    // Simulate drop
    fireEvent.drop(bigBucket, {
      dataTransfer: {
        getData: () => "item-1",
      },
    });

    // Should play match sound for correct drop
    expect(mockPlay).toHaveBeenCalledWith("match");
  });
});
