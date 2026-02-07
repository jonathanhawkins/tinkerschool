import { describe, it, expect } from "vitest";

import { M5_COLORS, M5_COLOR_VALUES } from "./types";

describe("M5_COLORS", () => {
  it("maps WHITE to #FFFFFF", () => {
    expect(M5_COLORS.WHITE).toBe("#FFFFFF");
  });

  it("maps BLACK to #000000", () => {
    expect(M5_COLORS.BLACK).toBe("#000000");
  });

  it("maps RED to #FF0000", () => {
    expect(M5_COLORS.RED).toBe("#FF0000");
  });

  it("maps GREEN to #00FF00", () => {
    expect(M5_COLORS.GREEN).toBe("#00FF00");
  });

  it("maps BLUE to #0000FF", () => {
    expect(M5_COLORS.BLUE).toBe("#0000FF");
  });

  it("maps YELLOW to #FFFF00", () => {
    expect(M5_COLORS.YELLOW).toBe("#FFFF00");
  });

  it("maps CYAN to #00FFFF", () => {
    expect(M5_COLORS.CYAN).toBe("#00FFFF");
  });

  it("maps ORANGE to #FFA500", () => {
    expect(M5_COLORS.ORANGE).toBe("#FFA500");
  });

  it("maps PURPLE to #800080", () => {
    expect(M5_COLORS.PURPLE).toBe("#800080");
  });

  it("maps MAGENTA to #FF00FF", () => {
    expect(M5_COLORS.MAGENTA).toBe("#FF00FF");
  });

  it("treats GRAY and GREY as the same color", () => {
    expect(M5_COLORS.GRAY).toBe(M5_COLORS.GREY);
    expect(M5_COLORS.GRAY).toBe("#808080");
  });

  it("treats DARKGRAY and DARKGREY as the same color", () => {
    expect(M5_COLORS.DARKGRAY).toBe(M5_COLORS.DARKGREY);
    expect(M5_COLORS.DARKGRAY).toBe("#404040");
  });

  it("treats LIGHTGRAY and LIGHTGREY as the same color", () => {
    expect(M5_COLORS.LIGHTGRAY).toBe(M5_COLORS.LIGHTGREY);
    expect(M5_COLORS.LIGHTGRAY).toBe("#C0C0C0");
  });

  it("contains all expected named colors", () => {
    const expectedNames = [
      "WHITE",
      "BLACK",
      "RED",
      "GREEN",
      "BLUE",
      "YELLOW",
      "PURPLE",
      "ORANGE",
      "CYAN",
      "MAGENTA",
      "PINK",
      "GRAY",
      "GREY",
      "DARKGREY",
      "DARKGRAY",
      "LIGHTGREY",
      "LIGHTGRAY",
      "NAVY",
      "MAROON",
      "OLIVE",
      "TEAL",
    ];

    for (const name of expectedNames) {
      expect(M5_COLORS[name], `Missing color: ${name}`).toBeDefined();
    }
  });
});

describe("M5_COLOR_VALUES", () => {
  it("maps RGB565 BLACK (0x0000) to #000000", () => {
    expect(M5_COLOR_VALUES[0x0000]).toBe("#000000");
  });

  it("maps RGB565 WHITE (0xFFFF) to #FFFFFF", () => {
    expect(M5_COLOR_VALUES[0xffff]).toBe("#FFFFFF");
  });

  it("maps RGB565 RED (0xF800) to #FF0000", () => {
    expect(M5_COLOR_VALUES[0xf800]).toBe("#FF0000");
  });

  it("maps RGB565 GREEN (0x07E0) to #00FF00", () => {
    expect(M5_COLOR_VALUES[0x07e0]).toBe("#00FF00");
  });

  it("maps RGB565 BLUE (0x001F) to #0000FF", () => {
    expect(M5_COLOR_VALUES[0x001f]).toBe("#0000FF");
  });

  it("maps RGB565 YELLOW (0xFFE0) to #FFFF00", () => {
    expect(M5_COLOR_VALUES[0xffe0]).toBe("#FFFF00");
  });

  it("maps RGB565 CYAN (0x07FF) to #00FFFF", () => {
    expect(M5_COLOR_VALUES[0x07ff]).toBe("#00FFFF");
  });

  it("maps RGB565 MAGENTA (0xF81F) to #FF00FF", () => {
    expect(M5_COLOR_VALUES[0xf81f]).toBe("#FF00FF");
  });

  it("maps RGB565 ORANGE (0xFD20) to #FFA500", () => {
    expect(M5_COLOR_VALUES[0xfd20]).toBe("#FFA500");
  });

  it("maps RGB565 PURPLE (0x8010) to #800080", () => {
    expect(M5_COLOR_VALUES[0x8010]).toBe("#800080");
  });

  it("maps RGB565 GRAY (0x7BEF) to #808080", () => {
    expect(M5_COLOR_VALUES[0x7bef]).toBe("#808080");
  });

  it("contains all expected RGB565 entries", () => {
    const expectedKeys = [
      0x0000, 0xffff, 0xf800, 0x07e0, 0x001f, 0xffe0, 0x07ff, 0xf81f,
      0xfd20, 0x8010, 0x7bef,
    ];

    for (const key of expectedKeys) {
      expect(
        M5_COLOR_VALUES[key],
        `Missing RGB565 value: 0x${key.toString(16)}`
      ).toBeDefined();
    }
  });
});
