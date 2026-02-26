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
  type: "trace_shape" as const,
  questions: [
    {
      id: "q1",
      prompt: "Trace the triangle!",
      shape: "triangle",
    },
    {
      id: "q2",
      prompt: "Trace the letter A!",
      shape: "A",
      traceColor: "#EF4444",
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
    path: (props: Record<string, unknown>) => {
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        ...rest
      } = props;
      return <path {...rest} />;
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { TraceShape } from "./trace-shape";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a mock PointerEvent with clientX/clientY.
 * We also mock the SVG's getBoundingClientRect so the pointer-to-SVG
 * coordinate conversion works correctly in tests.
 */
function setupSvgBounds(svg: Element) {
  // Mock a 200x200 pixel SVG at position (0, 0) so that
  // clientX/clientY map 1:1 to SVG coordinates.
  vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    top: 0,
    left: 0,
    right: 200,
    bottom: 200,
    toJSON: () => ({}),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TraceShape", () => {
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
    render(<TraceShape />);
    expect(screen.getByText("Trace the triangle!")).toBeDefined();
  });

  it("renders the instruction text", () => {
    render(<TraceShape />);
    expect(screen.getByText("Follow the dots with your finger!")).toBeDefined();
  });

  it("renders checkpoint dots for the shape", () => {
    render(<TraceShape />);
    // Triangle has checkpoints rendered as circles
    const checkpoints = screen.getAllByTestId(/^checkpoint-/);
    expect(checkpoints.length).toBeGreaterThan(0);
  });

  it("renders start indicator dot when no checkpoints hit", () => {
    render(<TraceShape />);
    expect(screen.getByTestId("start-dot")).toBeDefined();
    expect(screen.getByTestId("start-pulse")).toBeDefined();
  });

  it("marks checkpoints as hit when pointer moves near them", () => {
    render(<TraceShape />);
    const svg = screen.getByRole("img");
    setupSvgBounds(svg);

    // The triangle starts at (100, 20). Fire pointer events near that point.
    fireEvent.pointerDown(svg, { clientX: 100, clientY: 20 });
    fireEvent.pointerMove(svg, { clientX: 100, clientY: 20 });

    // At least one checkpoint should now be hit
    const hitCheckpoints = screen.getAllByTestId(/^checkpoint-/).filter(
      (el) => el.getAttribute("data-hit") === "true",
    );
    expect(hitCheckpoints.length).toBeGreaterThan(0);
    expect(mockPlay).toHaveBeenCalledWith("tap");
  });

  it("calls recordAnswer after all checkpoints are hit", () => {
    vi.useFakeTimers();
    render(<TraceShape />);
    const svg = screen.getByRole("img");
    setupSvgBounds(svg);

    // Get all checkpoint positions from the rendered elements
    const checkpoints = screen.getAllByTestId(/^checkpoint-/);

    // Start tracing
    fireEvent.pointerDown(svg, { clientX: 100, clientY: 20 });

    // Move through all checkpoint positions by reading their cx/cy attrs
    for (const cp of checkpoints) {
      const cx = Number(cp.getAttribute("cx"));
      const cy = Number(cp.getAttribute("cy"));
      fireEvent.pointerMove(svg, { clientX: cx, clientY: cy });
    }

    fireEvent.pointerUp(svg);

    // Verify celebration appeared
    expect(mockPlay).toHaveBeenCalledWith("correct");

    // Advance past the auto-advance timer (1500ms)
    vi.advanceTimersByTime(1600);
    expect(mockRecordAnswer).toHaveBeenCalledWith("triangle", true);

    vi.useRealTimers();
  });

  it("resets checkpoints when Try Again is clicked", () => {
    render(<TraceShape />);
    const svg = screen.getByRole("img");
    setupSvgBounds(svg);

    // Hit at least one checkpoint
    fireEvent.pointerDown(svg, { clientX: 100, clientY: 20 });
    fireEvent.pointerMove(svg, { clientX: 100, clientY: 20 });
    fireEvent.pointerUp(svg);

    // Verify at least one is hit
    const hitBefore = screen.getAllByTestId(/^checkpoint-/).filter(
      (el) => el.getAttribute("data-hit") === "true",
    );
    expect(hitBefore.length).toBeGreaterThan(0);

    // Click Try Again
    const retryButton = screen.getByText("Try Again");
    fireEvent.click(retryButton);

    // All checkpoints should be reset
    const hitAfter = screen.getAllByTestId(/^checkpoint-/).filter(
      (el) => el.getAttribute("data-hit") === "true",
    );
    expect(hitAfter.length).toBe(0);
  });

  it("shows progress bar with correct values", () => {
    render(<TraceShape />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar.getAttribute("aria-valuenow")).toBe("0");
    expect(progressBar.getAttribute("aria-valuemin")).toBe("0");
    expect(progressBar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("renders the SVG with touch-action: none to prevent scroll", () => {
    render(<TraceShape />);
    const svg = screen.getByRole("img");
    expect(svg.style.touchAction).toBe("none");
  });
});
