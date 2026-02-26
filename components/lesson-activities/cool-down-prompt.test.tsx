import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => <img src={src} alt={alt} {...props} />,
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

import { CoolDownPrompt } from "./cool-down-prompt";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CoolDownPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the 'Quick Break Time!' heading", () => {
    render(<CoolDownPrompt onContinue={vi.fn()} />);
    expect(screen.getByText("Quick Break Time!")).toBeDefined();
  });

  it("renders the 'I'm Ready!' button", () => {
    render(<CoolDownPrompt onContinue={vi.fn()} />);
    expect(screen.getByText("I'm Ready!")).toBeDefined();
  });

  it("renders a suggestion text based on seed prop", () => {
    render(<CoolDownPrompt onContinue={vi.fn()} seed={0} />);
    // seed=0 => index 0 => "Count 5 things in your room!"
    expect(screen.getByText("Count 5 things in your room!")).toBeDefined();
  });

  it("different seed values produce different suggestions", () => {
    const { unmount } = render(
      <CoolDownPrompt onContinue={vi.fn()} seed={0} />,
    );
    const textSeed0 = screen.getByText("Count 5 things in your room!");
    expect(textSeed0).toBeDefined();
    unmount();

    render(<CoolDownPrompt onContinue={vi.fn()} seed={1} />);
    // seed=1 => index 1 => "Stand up and stretch like a cat!"
    expect(
      screen.getByText("Stand up and stretch like a cat!"),
    ).toBeDefined();
    expect(screen.queryByText("Count 5 things in your room!")).toBeNull();
  });

  it("same seed always produces the same suggestion (deterministic)", () => {
    const { unmount } = render(
      <CoolDownPrompt onContinue={vi.fn()} seed={3} />,
    );
    // seed=3 => index 3 => "Touch your toes, then reach for the sky!"
    expect(
      screen.getByText("Touch your toes, then reach for the sky!"),
    ).toBeDefined();
    unmount();

    // Re-render with the same seed
    render(<CoolDownPrompt onContinue={vi.fn()} seed={3} />);
    expect(
      screen.getByText("Touch your toes, then reach for the sky!"),
    ).toBeDefined();
  });

  it("calls onContinue when button is clicked", () => {
    const onContinue = vi.fn();
    render(<CoolDownPrompt onContinue={onContinue} />);

    fireEvent.click(screen.getByText("I'm Ready!"));

    // The handler uses a 300ms setTimeout before calling onContinue
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("renders the Chip mascot image", () => {
    render(<CoolDownPrompt onContinue={vi.fn()} />);
    const chipImage = screen.getByAltText("Chip");
    expect(chipImage).toBeDefined();
    expect(chipImage.getAttribute("src")).toBe("/images/chip.png");
  });

  it("renders the sub-text about moving body", () => {
    render(<CoolDownPrompt onContinue={vi.fn()} />);
    expect(
      screen.getByText("Let's move our body before the next activity"),
    ).toBeDefined();
  });

  it("wraps around to first suggestion when seed exceeds array length", () => {
    // There are 8 suggestions, so seed=8 should wrap to index 0
    render(<CoolDownPrompt onContinue={vi.fn()} seed={8} />);
    expect(screen.getByText("Count 5 things in your room!")).toBeDefined();
  });

  it("handles negative seed values via Math.abs", () => {
    // Math.abs(-2) % 8 = 2 => "Clap your hands 10 times!"
    render(<CoolDownPrompt onContinue={vi.fn()} seed={-2} />);
    expect(screen.getByText("Clap your hands 10 times!")).toBeDefined();
  });
});
