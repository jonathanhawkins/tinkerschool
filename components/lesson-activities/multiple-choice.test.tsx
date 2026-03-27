import fs from "fs";
import path from "path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import type { LessonActivityConfig, MultipleChoiceContent } from "@/lib/activities/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRecordAnswer = vi.fn();
const mockPlay = vi.fn();

function createMockActivity() {
  return {
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
}

function stripMotionProps(props: Record<string, unknown>) {
  const rest = { ...props };
  delete rest.initial;
  delete rest.animate;
  delete rest.transition;
  delete rest.whileHover;
  delete rest.whileTap;
  return rest;
}

function loadPreKLessonContent(title: string): LessonActivityConfig {
  const migrationPath = path.resolve(
    process.cwd(),
    "supabase/migrations/079_redesign_prek_curriculum.sql",
  );
  const migration = fs.readFileSync(migrationPath, "utf-8");
  const lessonBlock = migration
    .split("INSERT INTO public.lessons")
    .find((block) => block.includes(`\n  '${title}',`));

  if (!lessonBlock) {
    throw new Error(`Could not find seeded lesson titled "${title}"`);
  }

  const contentMatch = lessonBlock.match(/'(\{"voice_led"[\s\S]*?\})'::jsonb/);
  if (!contentMatch) {
    throw new Error(`Could not parse lesson content for "${title}"`);
  }

  return JSON.parse(contentMatch[1].replace(/''/g, "'")) as LessonActivityConfig;
}

function loadPreKMultipleChoiceActivity(title: string): MultipleChoiceContent {
  const lesson = loadPreKLessonContent(title);
  const activity = lesson.activities.find((step) => step.type === "multiple_choice");

  if (!activity || activity.type !== "multiple_choice") {
    throw new Error(`Lesson "${title}" does not contain a multiple_choice activity`);
  }

  return activity;
}

function isVisualOnlyOptionText(text: string): boolean {
  const trimmed = text.trim();
  return (
    trimmed.length > 0 &&
    /[\p{Extended_Pictographic}\p{So}]/u.test(trimmed) &&
    !/[\p{L}\p{N}]/u.test(trimmed)
  );
}

let mockState = {
  currentActivityIndex: 0,
  currentQuestionIndex: 0,
  isComplete: false,
  showingFeedback: false,
  feedbackType: "none" as string,
  metrics: { totalQuestions: 0, correctFirstTry: 0, correctTotal: 0, totalTimeMs: 0, hintsUsed: 0, score: 0, answers: [] },
  hasPassed: false,
};

let mockActivity = createMockActivity();

vi.mock("@/lib/activities/activity-context", () => ({
  useActivity: () => ({
    currentActivity: mockActivity,
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
      return <div {...stripMotionProps(props)}>{children}</div>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      return <button {...stripMotionProps(props)}>{children}</button>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      return <p {...stripMotionProps(props)}>{children}</p>;
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
    mockActivity = createMockActivity();
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

  it("keeps emoji-only text options centered", () => {
    mockActivity.questions[0].options = [
      { id: "a", text: "⭕" },
      { id: "b", text: "⬛" },
    ];

    render(<MultipleChoice isPreK />);

    expect(screen.getByText("⭕")).toHaveClass("text-center");
    expect(screen.getByText("⭕")).toHaveClass("text-3xl");
    expect(screen.getByText("⭕")).not.toHaveClass("flex-1");
    expect(screen.getByText("⬛")).toHaveClass("text-center");
    expect(screen.getByText("⬛")).toHaveClass("text-3xl");
    expect(screen.getByText("⬛")).not.toHaveClass("flex-1");
  });

  it.each([
    "Which One Is Different?",
    "Circle!",
    "Circles and Squares",
    "What Color? Red!",
    "Red and Blue",
    "Triangles!",
  ])("keeps seeded Pre-K lesson %s visually centered", (title) => {
    mockActivity = loadPreKMultipleChoiceActivity(title);

    mockActivity.questions.forEach((question, index) => {
      mockState.currentQuestionIndex = index;

      const view = render(<MultipleChoice isPreK />);
      const buttons = screen.getAllByRole("button");

      question.options.forEach((option, optionIndex) => {
        expect(buttons[optionIndex]).toHaveClass("justify-center");

        if (!option.text) return;

        const label = within(buttons[optionIndex]).getByText(option.text);
        expect(label).toHaveClass("text-center");
        expect(label).not.toHaveClass("flex-1");

        if (!option.emoji && isVisualOnlyOptionText(option.text)) {
          expect(label).toHaveClass("text-3xl");
        }
      });

      view.unmount();
      cleanup();
    });
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

  // ---------------------------------------------------------------------------
  // Pre-K mode tests
  // ---------------------------------------------------------------------------

  describe("isPreK mode", () => {
    it("renders all options (up to 3) in Pre-K mode", () => {
      render(<MultipleChoice isPreK />);
      expect(screen.getByText("Three")).toBeDefined();
      expect(screen.getByText("Four")).toBeDefined();
      expect(screen.getByText("Five")).toBeDefined();
    });

    it("does not call recordAnswer on wrong answer in Pre-K mode", () => {
      render(<MultipleChoice isPreK />);
      fireEvent.click(screen.getByText("Three"));

      expect(mockPlay).toHaveBeenCalledWith("tap");
      // Pre-K: wrong answers should NOT call recordAnswer
      expect(mockRecordAnswer).not.toHaveBeenCalled();
    });

    it("shows gentle hint on wrong answer in Pre-K mode", () => {
      render(<MultipleChoice isPreK />);
      fireEvent.click(screen.getByText("Three"));

      expect(screen.getByText("Hmm, try this one!")).toBeDefined();
    });

    it("still calls recordAnswer on correct answer in Pre-K mode", () => {
      render(<MultipleChoice isPreK />);
      fireEvent.click(screen.getByText("Four"));

      expect(mockRecordAnswer).toHaveBeenCalledWith("b", true);
    });
  });
});
