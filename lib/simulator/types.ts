export interface SimulatorCommand {
  type:
    | "drawString"
    | "fillScreen"
    | "drawRect"
    | "fillRect"
    | "drawCircle"
    | "fillCircle"
    | "drawLine"
    | "drawPixel"
    | "sleep"
    | "tone"
    | "setTextColor"
    | "setTextSize"
    | "setLed";
  args: Record<string, unknown>;
}

export interface SimulatorState {
  isRunning: boolean;
  backgroundColor: string;
}

/** Snapshot of what the simulator displayed during a code run */
export interface SimulatorOutput {
  /** All text strings drawn via Lcd.drawString() */
  texts: string[];
  /** Whether Speaker.tone() was called at least once */
  hasBuzzer: boolean;
}

/**
 * M5StickC Plus 2 color constants mapped to CSS hex values.
 * These match the common M5.Lcd color names used in MicroPython.
 */
export const M5_COLORS: Record<string, string> = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF",
  YELLOW: "#FFFF00",
  PURPLE: "#800080",
  ORANGE: "#FFA500",
  CYAN: "#00FFFF",
  MAGENTA: "#FF00FF",
  PINK: "#FFC0CB",
  GRAY: "#808080",
  GREY: "#808080",
  DARKGREY: "#404040",
  DARKGRAY: "#404040",
  LIGHTGREY: "#C0C0C0",
  LIGHTGRAY: "#C0C0C0",
  NAVY: "#000080",
  MAROON: "#800000",
  OLIVE: "#808000",
  TEAL: "#008080",
} as const;

/**
 * M5StickC Plus 2 16-bit RGB565 color values mapped to CSS hex.
 * These are the numeric color constants used in the M5Unified library.
 */
export const M5_COLOR_VALUES: Record<number, string> = {
  0x0000: "#000000", // BLACK
  0xffff: "#FFFFFF", // WHITE
  0xf800: "#FF0000", // RED
  0x07e0: "#00FF00", // GREEN
  0x001f: "#0000FF", // BLUE
  0xffe0: "#FFFF00", // YELLOW
  0x07ff: "#00FFFF", // CYAN
  0xf81f: "#FF00FF", // MAGENTA
  0xfd20: "#FFA500", // ORANGE
  0x8010: "#800080", // PURPLE
  0x7bef: "#808080", // GRAY
} as const;
