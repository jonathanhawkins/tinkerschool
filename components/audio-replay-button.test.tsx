import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSpeak = vi.fn();
const mockStop = vi.fn();
const mockReplay = vi.fn();

let mockIsSpeaking = false;
let mockIsSupported = true;

vi.mock("@/hooks/use-audio-narration", () => ({
  useAudioNarration: vi.fn(() => ({
    speak: mockSpeak,
    stop: mockStop,
    isSpeaking: mockIsSpeaking,
    isSupported: mockIsSupported,
    replay: mockReplay,
  })),
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
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { AudioReplayButton } from "./audio-replay-button";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AudioReplayButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsSpeaking = false;
    mockIsSupported = true;
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the button when isSupported=true and enabled=true", () => {
    render(<AudioReplayButton text="How many apples?" />);
    expect(
      screen.getByLabelText("Listen to this question"),
    ).toBeDefined();
  });

  it("returns null when isSupported=false", () => {
    mockIsSupported = false;
    const { container } = render(
      <AudioReplayButton text="How many apples?" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when enabled=false", () => {
    const { container } = render(
      <AudioReplayButton text="How many apples?" enabled={false} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("calls speak(text) when clicked", () => {
    render(<AudioReplayButton text="How many apples?" />);
    fireEvent.click(screen.getByLabelText("Listen to this question"));
    expect(mockSpeak).toHaveBeenCalledWith("How many apples?");
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it("shows 'Listen to this question' aria-label when not speaking", () => {
    mockIsSpeaking = false;
    render(<AudioReplayButton text="Count the stars" />);
    expect(
      screen.getByLabelText("Listen to this question"),
    ).toBeDefined();
  });

  it("shows 'Speaking...' aria-label when isSpeaking=true", () => {
    mockIsSpeaking = true;
    render(<AudioReplayButton text="Count the stars" />);
    expect(screen.getByLabelText("Speaking...")).toBeDefined();
  });

  it("renders sm size with the correct class", () => {
    render(<AudioReplayButton text="Hello" size="sm" />);
    const button = screen.getByLabelText("Listen to this question");
    expect(button.className).toContain("size-9");
  });

  it("renders md size (default) with the correct class", () => {
    render(<AudioReplayButton text="Hello" />);
    const button = screen.getByLabelText("Listen to this question");
    expect(button.className).toContain("size-11");
  });

  it("renders lg size with the correct class", () => {
    render(<AudioReplayButton text="Hello" size="lg" />);
    const button = screen.getByLabelText("Listen to this question");
    expect(button.className).toContain("size-14");
  });

  it("passes additional className to the button", () => {
    render(
      <AudioReplayButton text="Hello" className="mt-2" />,
    );
    const button = screen.getByLabelText("Listen to this question");
    expect(button.className).toContain("mt-2");
  });

  it("renders the button with type='button'", () => {
    render(<AudioReplayButton text="Hello" />);
    const button = screen.getByLabelText("Listen to this question");
    expect(button.getAttribute("type")).toBe("button");
  });
});
