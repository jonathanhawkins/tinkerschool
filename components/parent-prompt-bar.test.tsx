import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

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
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Import (after mocks)
// ---------------------------------------------------------------------------

import { ParentPromptBar } from "./parent-prompt-bar";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ParentPromptBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null when isPreK is false", () => {
    const { container } = render(
      <ParentPromptBar isPreK={false} prompt="Say hello!" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when prompt is empty string", () => {
    const { container } = render(
      <ParentPromptBar isPreK={true} prompt="" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders the prompt text when isPreK=true and prompt is provided", () => {
    render(
      <ParentPromptBar
        isPreK={true}
        prompt="Try asking: 'Which one is bigger?'"
      />,
    );
    expect(
      screen.getByText("Try asking: 'Which one is bigger?'"),
    ).toBeDefined();
  });

  it("renders the 'Parent' label badge", () => {
    render(
      <ParentPromptBar isPreK={true} prompt="Count on your fingers!" />,
    );
    expect(screen.getByText("Parent")).toBeDefined();
  });

  it("dismiss button hides the component when clicked", () => {
    render(
      <ParentPromptBar isPreK={true} prompt="Say the numbers out loud!" />,
    );

    // Verify the prompt is visible
    expect(
      screen.getByText("Say the numbers out loud!"),
    ).toBeDefined();

    // Click the dismiss button
    const dismissButton = screen.getByLabelText(
      "Dismiss parent suggestion",
    );
    fireEvent.click(dismissButton);

    // After dismissal, the text should no longer be in the DOM
    expect(
      screen.queryByText("Say the numbers out loud!"),
    ).toBeNull();
  });

  it("passes className to the container", () => {
    const { container } = render(
      <ParentPromptBar
        isPreK={true}
        prompt="Great job!"
        className="mt-4"
      />,
    );

    // The outermost rendered div should contain the custom class
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeDefined();
    expect(wrapper?.className).toContain("mt-4");
  });

  it("renders the dismiss button with correct aria-label", () => {
    render(
      <ParentPromptBar isPreK={true} prompt="Help your child count!" />,
    );
    expect(
      screen.getByLabelText("Dismiss parent suggestion"),
    ).toBeDefined();
  });

  it("returns null when both isPreK is false and prompt is empty", () => {
    const { container } = render(
      <ParentPromptBar isPreK={false} prompt="" />,
    );
    expect(container.innerHTML).toBe("");
  });
});
