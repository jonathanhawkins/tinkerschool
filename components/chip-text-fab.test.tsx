import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _f, priority: _p, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

// Mock framer-motion
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
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock @ai-sdk/react useChat
const mockSendMessage = vi.fn();
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => ({
    messages: [],
    sendMessage: mockSendMessage,
    status: "ready",
    error: null,
  })),
}));

// Mock ai DefaultChatTransport
vi.mock("ai", async () => {
  const MockTransport = vi.fn(function (this: unknown, opts: unknown) {
    Object.assign(this as Record<string, unknown>, opts);
  });
  return { DefaultChatTransport: MockTransport };
});

// Mock voice bridge with controllable lesson context
let mockLessonContext: unknown = null;
const mockSubscribeLessonContext = vi.fn((_cb: () => void) => () => {});

vi.mock("@/lib/hume/voice-bridge", () => ({
  voiceBridge: {
    get lessonContext() {
      return mockLessonContext;
    },
    subscribeLessonContext: (...args: unknown[]) =>
      mockSubscribeLessonContext(...(args as [() => void])),
  },
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { ChipTextFab } from "./chip-text-fab";
import { DefaultChatTransport } from "ai";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ChipTextFab", () => {
  const defaultProps = {
    kidName: "Cassidy",
    age: 7,
    band: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLessonContext = null;
  });

  afterEach(() => {
    cleanup();
  });

  // -----------------------------------------------------------------------
  // Greeting context
  // -----------------------------------------------------------------------

  describe("greeting message", () => {
    it("shows generic greeting when no lesson context is available", () => {
      render(<ChipTextFab {...defaultProps} />);
      // Open the chat panel
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      expect(
        screen.getByText(
          "Hey Cassidy! I'm Chip, your learning buddy! What would you like to explore today?",
        ),
      ).toBeDefined();
    });

    it("shows no greeting when lesson context is available", () => {
      mockLessonContext = {
        lessonId: "abc-123",
        title: "Which One Is Different?",
        description: "Find the odd one out",
        storyText: null,
        subjectName: "Math",
        subjectSlug: "math",
        subjectColor: "#3B82F6",
        lessonType: "interactive",
        estimatedMinutes: 10,
        skillsCovered: ["pattern recognition"],
        activities: [],
        codingHints: [],
        isInteractive: true,
      };

      render(<ChipTextFab {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      // No greeting bubble on lesson pages — Chip should just be ready to help
      expect(screen.queryByText(/I'm Chip/)).toBeNull();
      expect(screen.queryByText(/Need any help/)).toBeNull();
      // But the header shows the lesson name
      expect(screen.getByText(/Helping with Which One Is Different/)).toBeDefined();
    });

    it("hides greeting and shows lesson in header when context arrives", () => {
      // Start without lesson context
      const { rerender } = render(<ChipTextFab {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      expect(
        screen.getByText(/What would you like to explore today/),
      ).toBeDefined();

      // Simulate lesson context becoming available
      mockLessonContext = {
        lessonId: "def-456",
        title: "Counting Apples",
        description: "Count fruit",
        storyText: null,
        subjectName: "Math",
        subjectSlug: "math",
        subjectColor: "#3B82F6",
        lessonType: "interactive",
        estimatedMinutes: 5,
        skillsCovered: ["counting"],
        activities: [],
        codingHints: [],
        isInteractive: true,
      };

      // Re-render to pick up context change
      rerender(<ChipTextFab {...defaultProps} />);

      // Greeting is removed, header shows lesson context
      expect(screen.queryByText(/What would you like to explore/)).toBeNull();
      expect(screen.getByText(/Helping with Counting Apples/)).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Placeholder text
  // -----------------------------------------------------------------------

  describe("input placeholder", () => {
    it("shows generic placeholder without lesson context", () => {
      render(<ChipTextFab {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      const input = screen.getByPlaceholderText("Ask Chip anything...");
      expect(input).toBeDefined();
    });

    it("shows lesson-specific placeholder with lesson context", () => {
      mockLessonContext = {
        lessonId: "abc-123",
        title: "Which One Is Different?",
        description: "Find the odd one out",
        storyText: null,
        subjectName: "Math",
        subjectSlug: "math",
        subjectColor: "#3B82F6",
        lessonType: "interactive",
        estimatedMinutes: 10,
        skillsCovered: [],
        activities: [],
        codingHints: [],
        isInteractive: true,
      };

      render(<ChipTextFab {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      const input = screen.getByPlaceholderText(
        "Ask about Which One Is Different?...",
      );
      expect(input).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // Transport includes lesson context
  // -----------------------------------------------------------------------

  describe("chat transport", () => {
    it("creates transport without lesson fields when no context", () => {
      render(<ChipTextFab {...defaultProps} />);

      expect(DefaultChatTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          api: "/api/ai-buddy",
          body: expect.objectContaining({
            kidName: "Cassidy",
            age: 7,
            band: 2,
            currentSubject: undefined,
            currentLesson: undefined,
            currentLessonId: undefined,
          }),
        }),
      );
    });

    it("creates transport with lesson fields when context is available", () => {
      mockLessonContext = {
        lessonId: "abc-123",
        title: "Which One Is Different?",
        description: "Find the odd one out",
        storyText: null,
        subjectName: "Math",
        subjectSlug: "math",
        subjectColor: "#3B82F6",
        lessonType: "interactive",
        estimatedMinutes: 10,
        skillsCovered: [],
        activities: [],
        codingHints: [],
        isInteractive: true,
      };

      render(<ChipTextFab {...defaultProps} />);

      expect(DefaultChatTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          api: "/api/ai-buddy",
          body: expect.objectContaining({
            kidName: "Cassidy",
            age: 7,
            band: 2,
            currentSubject: "math",
            currentLesson: "Which One Is Different?",
            currentLessonId: "abc-123",
          }),
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // FAB interaction basics
  // -----------------------------------------------------------------------

  describe("FAB interaction", () => {
    it("opens chat panel when FAB is clicked", () => {
      render(<ChipTextFab {...defaultProps} />);

      // Panel should not be visible initially
      expect(screen.queryByText(/I'm Chip/)).toBeNull();

      // Click the FAB
      fireEvent.click(screen.getByLabelText("Chat with Chip"));

      // Panel should now show the greeting
      expect(screen.getByText(/I'm Chip/)).toBeDefined();
    });

    it("closes chat panel when close button is clicked", () => {
      render(<ChipTextFab {...defaultProps} />);

      // Open the panel
      fireEvent.click(screen.getByLabelText("Chat with Chip"));
      expect(screen.getByText(/I'm Chip/)).toBeDefined();

      // Close via the X button in the header (first match; the FAB is the second)
      const closeButtons = screen.getAllByLabelText("Close Chip chat");
      fireEvent.click(closeButtons[0]);

      // Greeting should no longer be visible
      expect(screen.queryByText(/I'm Chip/)).toBeNull();
    });
  });
});
