import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _f, priority: _p, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

vi.mock("@/hooks/use-audio-narration", () => ({
  useAudioNarration: vi.fn(() => ({
    speak: vi.fn(),
    stop: vi.fn(),
    isSpeaking: false,
    isSupported: false,
    replay: vi.fn(),
  })),
}));

const mockSendMessage = vi.fn();
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => ({
    messages: [],
    sendMessage: mockSendMessage,
    status: "ready",
    error: null,
  })),
}));

vi.mock("ai", async () => {
  const MockTransport = vi.fn(function (this: unknown, opts: unknown) {
    Object.assign(this as Record<string, unknown>, opts);
  });
  return { DefaultChatTransport: MockTransport };
});

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import ChipChat from "./chip-chat";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ChipChat greeting", () => {
  const baseProps = {
    kidName: "Cassidy",
    age: 7,
    band: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows generic greeting with no subject or lesson", () => {
    render(<ChipChat {...baseProps} />);
    expect(
      screen.getByText(
        "Hey Cassidy! I'm Chip, your learning buddy! What would you like to explore today?",
      ),
    ).toBeDefined();
  });

  it("shows subject-only greeting when currentSubject is provided", () => {
    render(<ChipChat {...baseProps} currentSubject="science" />);
    expect(
      screen.getByText(
        "Hey Cassidy! Ready to explore some Science together? What would you like to work on?",
      ),
    ).toBeDefined();
  });

  it("shows lesson-specific greeting when both subject and lesson are provided", () => {
    render(
      <ChipChat
        {...baseProps}
        currentSubject="math"
        currentLesson="Which One Is Different?"
      />,
    );
    expect(
      screen.getByText(
        'Hey Cassidy! I see you\'re working on "Which One Is Different?" in Math. Need any help?',
      ),
    ).toBeDefined();
  });

  it("shows Pre-K greeting for band 0 regardless of lesson context", () => {
    render(
      <ChipChat
        {...baseProps}
        band={0}
        currentSubject="reading"
        currentLesson="Letter A"
      />,
    );
    expect(
      screen.getByText(
        "Hi Cassidy! I'm Chip, your robot friend! Tap a button to talk to me!",
      ),
    ).toBeDefined();
  });

  it("falls back to subject greeting when lesson is provided without subject", () => {
    // currentLesson without currentSubject — subject lookup returns null,
    // so the greeting falls through to the generic one
    render(
      <ChipChat {...baseProps} currentLesson="Counting Apples" />,
    );
    expect(
      screen.getByText(/What would you like to explore today/),
    ).toBeDefined();
  });
});

describe("ChipChat placeholder", () => {
  const baseProps = {
    kidName: "Cassidy",
    age: 7,
    band: 2,
  };

  afterEach(() => {
    cleanup();
  });

  it("shows generic placeholder with no context", () => {
    render(<ChipChat {...baseProps} />);
    expect(
      screen.getByPlaceholderText("Ask Chip anything about learning..."),
    ).toBeDefined();
  });

  it("shows lesson-specific placeholder when lesson is provided", () => {
    render(
      <ChipChat
        {...baseProps}
        currentSubject="math"
        currentLesson="Counting Apples"
      />,
    );
    expect(
      screen.getByPlaceholderText("Ask about Counting Apples..."),
    ).toBeDefined();
  });

  it("shows subject-specific placeholder when only subject is provided", () => {
    render(<ChipChat {...baseProps} currentSubject="science" />);
    expect(
      screen.getByPlaceholderText("Ask Chip about Science..."),
    ).toBeDefined();
  });
});
