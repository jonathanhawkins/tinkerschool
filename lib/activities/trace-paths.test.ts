import { describe, it, expect } from "vitest";

import { getTracePath, getAvailableShapes } from "./trace-paths";

// ---------------------------------------------------------------------------
// getTracePath
// ---------------------------------------------------------------------------

describe("getTracePath", () => {
  it('returns data with path, checkpoints, and startPoint for "circle"', () => {
    const result = getTracePath("circle");
    expect(result).toBeDefined();
    expect(result!.path).toBeTruthy();
    expect(result!.checkpoints.length).toBeGreaterThan(0);
    expect(result!.startPoint).toHaveProperty("x");
    expect(result!.startPoint).toHaveProperty("y");
  });

  it('returns data for "square"', () => {
    const result = getTracePath("square");
    expect(result).toBeDefined();
    expect(result!.path).toBeTruthy();
    expect(result!.checkpoints.length).toBeGreaterThan(0);
    expect(result!.startPoint).toHaveProperty("x");
    expect(result!.startPoint).toHaveProperty("y");
  });

  it('returns data for "triangle"', () => {
    const result = getTracePath("triangle");
    expect(result).toBeDefined();
    expect(result!.path).toBeTruthy();
    expect(result!.checkpoints.length).toBeGreaterThan(0);
    expect(result!.startPoint).toHaveProperty("x");
    expect(result!.startPoint).toHaveProperty("y");
  });

  it('returns letter data for "A"', () => {
    const result = getTracePath("A");
    expect(result).toBeDefined();
    expect(result!.path).toBeTruthy();
    expect(result!.checkpoints.length).toBeGreaterThan(0);
  });

  it('normalizes lowercase "a" to uppercase "A"', () => {
    const lowercase = getTracePath("a");
    const uppercase = getTracePath("A");
    expect(lowercase).toBeDefined();
    expect(uppercase).toBeDefined();
    expect(lowercase).toEqual(uppercase);
  });

  it('normalizes lowercase "z" to uppercase "Z"', () => {
    const lowercase = getTracePath("z");
    const uppercase = getTracePath("Z");
    expect(lowercase).toBeDefined();
    expect(lowercase).toEqual(uppercase);
  });

  it('returns number data for "1"', () => {
    const result = getTracePath("1");
    expect(result).toBeDefined();
    expect(result!.path).toBeTruthy();
    expect(result!.checkpoints.length).toBeGreaterThan(0);
  });

  it("returns undefined for an unknown shape", () => {
    const result = getTracePath("unknown");
    expect(result).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    const result = getTracePath("");
    expect(result).toBeUndefined();
  });

  it("each trace path has non-empty checkpoints array", () => {
    const shapes = getAvailableShapes();
    for (const shape of shapes) {
      const data = getTracePath(shape);
      expect(data).toBeDefined();
      expect(data!.checkpoints.length).toBeGreaterThan(0);
    }
  });

  it("each trace path has a valid startPoint with x and y", () => {
    const shapes = getAvailableShapes();
    for (const shape of shapes) {
      const data = getTracePath(shape);
      expect(data).toBeDefined();
      expect(typeof data!.startPoint.x).toBe("number");
      expect(typeof data!.startPoint.y).toBe("number");
    }
  });
});

// ---------------------------------------------------------------------------
// getAvailableShapes
// ---------------------------------------------------------------------------

describe("getAvailableShapes", () => {
  it('includes "circle", "square", and "triangle"', () => {
    const shapes = getAvailableShapes();
    expect(shapes).toContain("circle");
    expect(shapes).toContain("square");
    expect(shapes).toContain("triangle");
  });

  it("includes all uppercase letters A-Z", () => {
    const shapes = getAvailableShapes();
    for (let code = 65; code <= 90; code++) {
      expect(shapes).toContain(String.fromCharCode(code));
    }
  });

  it("includes digits 0-9", () => {
    const shapes = getAvailableShapes();
    for (let d = 0; d <= 9; d++) {
      expect(shapes).toContain(String(d));
    }
  });

  it("returns 39 total entries (3 shapes + 26 letters + 10 digits)", () => {
    const shapes = getAvailableShapes();
    expect(shapes).toHaveLength(39);
  });
});
