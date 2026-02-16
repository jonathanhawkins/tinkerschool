import { describe, it, expect, beforeEach } from "vitest";

import { useTutorialProgress } from "./use-tutorial-progress";

// ---------------------------------------------------------------------------
// useTutorialProgress (zustand store)
// ---------------------------------------------------------------------------
// We test the store by calling its actions directly (getState/setState).
// Zustand stores are plain objects, no React rendering needed for unit tests.
// ---------------------------------------------------------------------------

describe("useTutorialProgress", () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useTutorialProgress.setState({
      blocklyTutorialComplete: false,
      codingWalkthroughSeen: false,
      conceptsSeen: [],
      codingLessonsOpened: 0,
    });
  });

  // ---- Initial state -------------------------------------------------------

  it("has correct initial state", () => {
    const state = useTutorialProgress.getState();
    expect(state.blocklyTutorialComplete).toBe(false);
    expect(state.codingWalkthroughSeen).toBe(false);
    expect(state.conceptsSeen).toEqual([]);
    expect(state.codingLessonsOpened).toBe(0);
  });

  // ---- completeBlocklyTutorial ---------------------------------------------

  it("marks Blockly tutorial as complete", () => {
    useTutorialProgress.getState().completeBlocklyTutorial();
    expect(useTutorialProgress.getState().blocklyTutorialComplete).toBe(true);
  });

  // ---- markCodingWalkthroughSeen -------------------------------------------

  it("marks coding walkthrough as seen", () => {
    useTutorialProgress.getState().markCodingWalkthroughSeen();
    expect(useTutorialProgress.getState().codingWalkthroughSeen).toBe(true);
  });

  // ---- markConceptSeen -----------------------------------------------------

  it("adds a concept to the seen list", () => {
    useTutorialProgress.getState().markConceptSeen("loops");
    expect(useTutorialProgress.getState().conceptsSeen).toContain("loops");
  });

  it("does not add duplicate concepts", () => {
    const { markConceptSeen } = useTutorialProgress.getState();
    markConceptSeen("display");
    markConceptSeen("display");
    markConceptSeen("display");
    expect(useTutorialProgress.getState().conceptsSeen).toEqual(["display"]);
  });

  it("tracks multiple different concepts", () => {
    const { markConceptSeen } = useTutorialProgress.getState();
    markConceptSeen("display");
    markConceptSeen("loops");
    markConceptSeen("sound");
    const seen = useTutorialProgress.getState().conceptsSeen;
    expect(seen).toContain("display");
    expect(seen).toContain("loops");
    expect(seen).toContain("sound");
    expect(seen).toHaveLength(3);
  });

  // ---- hasSeenConcept ------------------------------------------------------

  it("returns true for a seen concept", () => {
    useTutorialProgress.getState().markConceptSeen("variables");
    expect(useTutorialProgress.getState().hasSeenConcept("variables")).toBe(
      true,
    );
  });

  it("returns false for an unseen concept", () => {
    expect(useTutorialProgress.getState().hasSeenConcept("logic")).toBe(false);
  });

  // ---- incrementCodingLessons ----------------------------------------------

  it("increments coding lessons opened count", () => {
    useTutorialProgress.getState().incrementCodingLessons();
    expect(useTutorialProgress.getState().codingLessonsOpened).toBe(1);
  });

  it("increments multiple times", () => {
    const { incrementCodingLessons } = useTutorialProgress.getState();
    incrementCodingLessons();
    incrementCodingLessons();
    incrementCodingLessons();
    expect(useTutorialProgress.getState().codingLessonsOpened).toBe(3);
  });

  // ---- resetTutorialProgress -----------------------------------------------

  it("resets all tutorial progress", () => {
    const state = useTutorialProgress.getState();
    state.completeBlocklyTutorial();
    state.markCodingWalkthroughSeen();
    state.markConceptSeen("loops");
    state.markConceptSeen("display");
    state.incrementCodingLessons();

    // Verify state is modified
    expect(useTutorialProgress.getState().blocklyTutorialComplete).toBe(true);
    expect(useTutorialProgress.getState().conceptsSeen.length).toBe(2);

    // Reset
    useTutorialProgress.getState().resetTutorialProgress();

    const reset = useTutorialProgress.getState();
    expect(reset.blocklyTutorialComplete).toBe(false);
    expect(reset.codingWalkthroughSeen).toBe(false);
    expect(reset.conceptsSeen).toEqual([]);
    expect(reset.codingLessonsOpened).toBe(0);
  });
});
