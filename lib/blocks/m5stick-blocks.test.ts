import { describe, it, expect, vi } from "vitest";

// Mock blockly before importing the module under test.
// Blockly requires a full DOM (canvas, SVG) that jsdom cannot provide,
// so we stub out the parts our module touches at import time.
vi.mock("blockly/core", () => {
  return {
    Blocks: {} as Record<string, unknown>,
    FieldDropdown: vi.fn(),
    FieldCheckbox: vi.fn(),
  };
});

vi.mock("blockly/python", () => {
  return {
    pythonGenerator: {
      forBlock: {} as Record<string, unknown>,
    },
    Order: {
      ATOMIC: 0,
      FUNCTION_CALL: 2,
    },
  };
});

// Import after mocks are registered
import { M5_BLOCK_TYPES, pythonGenerator } from "./m5stick-blocks";

describe("M5_BLOCK_TYPES", () => {
  it("is an array with the expected length", () => {
    expect(Array.isArray(M5_BLOCK_TYPES)).toBe(true);
    expect(M5_BLOCK_TYPES.length).toBe(13);
  });

  it("contains all expected display block names", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_display_text");
    expect(M5_BLOCK_TYPES).toContain("m5_display_clear");
    expect(M5_BLOCK_TYPES).toContain("m5_display_rect");
    expect(M5_BLOCK_TYPES).toContain("m5_display_circle");
    expect(M5_BLOCK_TYPES).toContain("m5_display_number");
  });

  it("contains all expected sound block names", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_buzzer_tone");
    expect(M5_BLOCK_TYPES).toContain("m5_buzzer_off");
  });

  it("contains the button block name", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_button_pressed");
  });

  it("contains the LED block name", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_led_set");
  });

  it("contains the wait block name", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_wait");
  });

  it("contains all expected sensor block names", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_read_imu");
    expect(M5_BLOCK_TYPES).toContain("m5_shake_detected");
  });

  it("contains the random number block name", () => {
    expect(M5_BLOCK_TYPES).toContain("m5_random_number");
  });
});

describe("m5stick-blocks module", () => {
  it("can be imported without errors", () => {
    // If we got this far, the import succeeded.
    expect(M5_BLOCK_TYPES).toBeDefined();
  });

  it("re-exports the pythonGenerator", () => {
    expect(pythonGenerator).toBeDefined();
    expect(pythonGenerator.forBlock).toBeDefined();
  });

  it("registers a Python generator for every block type", () => {
    for (const blockType of M5_BLOCK_TYPES) {
      expect(
        pythonGenerator.forBlock[blockType],
        `Missing generator for ${blockType}`
      ).toBeDefined();
    }
  });
});

describe("M5BlockType (compile-time)", () => {
  it("allows valid block type strings", () => {
    // This is a compile-time check -- if the type were wrong, TypeScript would
    // flag it during `tsc --noEmit`. At runtime we just verify the const array
    // entries are strings.
    for (const t of M5_BLOCK_TYPES) {
      expect(typeof t).toBe("string");
    }
  });
});
