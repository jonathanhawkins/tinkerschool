/**
 * Custom Blockly block definitions for M5StickC Plus 2.
 *
 * Each block has:
 *   1. A visual definition registered via `Blockly.Blocks[name]`
 *   2. A Python generator function that emits valid MicroPython for the device.
 *
 * MicroPython APIs used (UIFlow2):
 *   - Lcd       (display drawing, via `from M5 import *`)
 *   - Speaker   (buzzer/tone, via `from M5 import *`)
 *   - BtnA / BtnB (buttons, via `from M5 import *`)
 *   - Power.setLed (single-color LED brightness)
 *   - Imu.getAccel (accelerometer)
 *   - time.sleep (wait)
 */

import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import type { Block } from "blockly/core";
import type { PythonGenerator } from "blockly/python";

// ---------------------------------------------------------------------------
// Color constants for block categories
// ---------------------------------------------------------------------------

const DISPLAY_COLOR = "#9C27B0"; // purple
const SOUND_COLOR = "#FF9800"; // orange
const BUTTON_COLOR = "#4CAF50"; // green
const LED_COLOR = "#F44336"; // red
const WAIT_COLOR = "#9E9E9E"; // gray
const SENSOR_COLOR = "#00BCD4"; // teal
const MATH_EXT_COLOR = "#7B68EE"; // medium slate blue (math extensions)

// ---------------------------------------------------------------------------
// Color map helpers – shared between block definitions and generators
// ---------------------------------------------------------------------------

/** LCD color constants used by the M5StickC Plus 2 display. */
const LCD_COLOR_MAP: Record<string, string> = {
  white: "0xFFFFFF",
  red: "0xFF0000",
  green: "0x00FF00",
  blue: "0x0000FF",
  yellow: "0xFFFF00",
  purple: "0xFF00FF",
  black: "0x000000",
};

/** LED brightness values for Power.setLed() on the M5StickC Plus 2.
 *  The device has a single-color red LED (not RGB). */
const LED_BRIGHTNESS_MAP: Record<string, string> = {
  on: "255",
  off: "0",
};

// =========================================================================
// DISPLAY BLOCKS
// =========================================================================

// ---- m5_display_text ----------------------------------------------------

Blockly.Blocks["m5_display_text"] = {
  init(this: Block) {
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField("display text");
    this.appendValueInput("X")
      .setCheck("Number")
      .appendField("x");
    this.appendValueInput("Y")
      .setCheck("Number")
      .appendField("y");
    this.appendDummyInput()
      .appendField("color")
      .appendField(
        new Blockly.FieldDropdown([
          ["white", "white"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"],
          ["yellow", "yellow"],
          ["purple", "purple"],
        ]),
        "COLOR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(DISPLAY_COLOR);
    this.setTooltip("Show text on the display at the given position.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_display_text"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const text =
    generator.valueToCode(block, "TEXT", Order.ATOMIC) || '""';
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const color = block.getFieldValue("COLOR") as string;
  const colorCode = LCD_COLOR_MAP[color] ?? "0xFFFFFF";
  return `Lcd.setTextColor(${colorCode}, 0x000000)\nLcd.drawString(${text}, ${x}, ${y})\n`;
};

// ---- m5_display_clear ---------------------------------------------------

Blockly.Blocks["m5_display_clear"] = {
  init(this: Block) {
    this.appendDummyInput()
      .appendField("clear display")
      .appendField(
        new Blockly.FieldDropdown([
          ["black", "black"],
          ["white", "white"],
        ]),
        "COLOR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(DISPLAY_COLOR);
    this.setTooltip("Clear the entire display with a color.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_display_clear"] = function (
  block: Block
): string {
  const color = block.getFieldValue("COLOR") as string;
  const colorCode = LCD_COLOR_MAP[color] ?? "0x000000";
  return `Lcd.fillScreen(${colorCode})\n`;
};

// ---- m5_display_rect ----------------------------------------------------

Blockly.Blocks["m5_display_rect"] = {
  init(this: Block) {
    this.appendValueInput("X")
      .setCheck("Number")
      .appendField("draw rectangle x");
    this.appendValueInput("Y")
      .setCheck("Number")
      .appendField("y");
    this.appendValueInput("WIDTH")
      .setCheck("Number")
      .appendField("width");
    this.appendValueInput("HEIGHT")
      .setCheck("Number")
      .appendField("height");
    this.appendDummyInput()
      .appendField("color")
      .appendField(
        new Blockly.FieldDropdown([
          ["white", "white"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"],
          ["yellow", "yellow"],
          ["purple", "purple"],
        ]),
        "COLOR"
      )
      .appendField("fill?")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "FILL");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(DISPLAY_COLOR);
    this.setTooltip("Draw a rectangle on the display.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_display_rect"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const w = generator.valueToCode(block, "WIDTH", Order.ATOMIC) || "10";
  const h = generator.valueToCode(block, "HEIGHT", Order.ATOMIC) || "10";
  const color = block.getFieldValue("COLOR") as string;
  const colorCode = LCD_COLOR_MAP[color] ?? "0xFFFFFF";
  const fill = block.getFieldValue("FILL") === "TRUE";
  const fn = fill ? "fillRect" : "drawRect";
  return `Lcd.${fn}(${x}, ${y}, ${w}, ${h}, ${colorCode})\n`;
};

// ---- m5_display_circle --------------------------------------------------

Blockly.Blocks["m5_display_circle"] = {
  init(this: Block) {
    this.appendValueInput("X")
      .setCheck("Number")
      .appendField("draw circle x");
    this.appendValueInput("Y")
      .setCheck("Number")
      .appendField("y");
    this.appendValueInput("RADIUS")
      .setCheck("Number")
      .appendField("radius");
    this.appendDummyInput()
      .appendField("color")
      .appendField(
        new Blockly.FieldDropdown([
          ["white", "white"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"],
          ["yellow", "yellow"],
          ["purple", "purple"],
        ]),
        "COLOR"
      )
      .appendField("fill?")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "FILL");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(DISPLAY_COLOR);
    this.setTooltip("Draw a circle on the display.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_display_circle"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const r = generator.valueToCode(block, "RADIUS", Order.ATOMIC) || "10";
  const color = block.getFieldValue("COLOR") as string;
  const colorCode = LCD_COLOR_MAP[color] ?? "0xFFFFFF";
  const fill = block.getFieldValue("FILL") === "TRUE";
  const fn = fill ? "fillCircle" : "drawCircle";
  return `Lcd.${fn}(${x}, ${y}, ${r}, ${colorCode})\n`;
};

// =========================================================================
// BUZZER / SOUND BLOCKS
// =========================================================================

// ---- m5_buzzer_tone -----------------------------------------------------

Blockly.Blocks["m5_buzzer_tone"] = {
  init(this: Block) {
    this.appendValueInput("FREQUENCY")
      .setCheck("Number")
      .appendField("play tone frequency");
    this.appendValueInput("DURATION")
      .setCheck("Number")
      .appendField("duration (ms)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(SOUND_COLOR);
    this.setTooltip("Play a tone through the buzzer.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_buzzer_tone"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const freq =
    generator.valueToCode(block, "FREQUENCY", Order.ATOMIC) || "440";
  const dur =
    generator.valueToCode(block, "DURATION", Order.ATOMIC) || "500";
  return `Speaker.tone(${freq}, ${dur})\n`;
};

// ---- m5_buzzer_off ------------------------------------------------------

Blockly.Blocks["m5_buzzer_off"] = {
  init(this: Block) {
    this.appendDummyInput().appendField("stop buzzer");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(SOUND_COLOR);
    this.setTooltip("Stop the buzzer.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_buzzer_off"] = function (): string {
  return "Speaker.end()\n";
};

// =========================================================================
// BUTTON BLOCKS
// =========================================================================

// ---- m5_button_pressed --------------------------------------------------

Blockly.Blocks["m5_button_pressed"] = {
  init(this: Block) {
    this.appendDummyInput()
      .appendField("button")
      .appendField(
        new Blockly.FieldDropdown([
          ["A", "A"],
          ["B", "B"],
        ]),
        "BUTTON"
      )
      .appendField("pressed?");
    this.setOutput(true, "Boolean");
    this.setColour(BUTTON_COLOR);
    this.setTooltip("Check if a button is currently pressed.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_button_pressed"] = function (
  block: Block
): [string, number] {
  const button = block.getFieldValue("BUTTON") as string;
  const btnName = button === "A" ? "BtnA" : "BtnB";
  return [`${btnName}.isPressed()`, Order.FUNCTION_CALL];
};

// =========================================================================
// LED BLOCK
// =========================================================================

// ---- m5_led_set ---------------------------------------------------------

Blockly.Blocks["m5_led_set"] = {
  init(this: Block) {
    this.appendDummyInput()
      .appendField("set LED")
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "on"],
          ["off", "off"],
        ]),
        "COLOR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(LED_COLOR);
    this.setTooltip("Turn the built-in red LED on or off.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_led_set"] = function (
  block: Block
): string {
  const color = block.getFieldValue("COLOR") as string;
  const brightness = LED_BRIGHTNESS_MAP[color] ?? "0";
  return `Power.setLed(${brightness})\n`;
};

// =========================================================================
// WAIT BLOCK
// =========================================================================

// ---- m5_wait ------------------------------------------------------------

Blockly.Blocks["m5_wait"] = {
  init(this: Block) {
    this.appendValueInput("SECONDS")
      .setCheck("Number")
      .appendField("wait");
    this.appendDummyInput().appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(WAIT_COLOR);
    this.setTooltip("Pause execution for a number of seconds.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_wait"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const seconds =
    generator.valueToCode(block, "SECONDS", Order.ATOMIC) || "1";
  return `time.sleep(${seconds})\n`;
};

// =========================================================================
// SENSOR BLOCKS
// =========================================================================

// ---- m5_read_imu --------------------------------------------------------

Blockly.Blocks["m5_read_imu"] = {
  init(this: Block) {
    this.appendDummyInput()
      .appendField("read tilt")
      .appendField(
        new Blockly.FieldDropdown([
          ["X", "X"],
          ["Y", "Y"],
          ["Z", "Z"],
        ]),
        "AXIS"
      );
    this.setOutput(true, "Number");
    this.setColour(SENSOR_COLOR);
    this.setTooltip(
      "Read the tilt sensor. Returns how much the device is tilted on the chosen axis."
    );
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_read_imu"] = function (
  block: Block
): [string, number] {
  const axis = block.getFieldValue("AXIS") as string;
  const index = axis === "X" ? 0 : axis === "Y" ? 1 : 2;
  return [`Imu.getAccel()[${index}]`, Order.FUNCTION_CALL];
};

// ---- m5_shake_detected --------------------------------------------------

Blockly.Blocks["m5_shake_detected"] = {
  init(this: Block) {
    this.appendDummyInput().appendField("device shaken?");
    this.setOutput(true, "Boolean");
    this.setColour(SENSOR_COLOR);
    this.setTooltip("Check if the device was just shaken.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_shake_detected"] = function (): [string, number] {
  return ["shake_detected()", Order.FUNCTION_CALL];
};

// =========================================================================
// MATH EXTENSION BLOCKS
// =========================================================================

// ---- m5_random_number ---------------------------------------------------

Blockly.Blocks["m5_random_number"] = {
  init(this: Block) {
    this.appendValueInput("MIN")
      .setCheck("Number")
      .appendField("random number from");
    this.appendValueInput("MAX")
      .setCheck("Number")
      .appendField("to");
    this.setOutput(true, "Number");
    this.setColour(MATH_EXT_COLOR);
    this.setTooltip("Pick a random number between min and max.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_random_number"] = function (
  block: Block,
  generator: PythonGenerator
): [string, number] {
  const min = generator.valueToCode(block, "MIN", Order.ATOMIC) || "1";
  const max = generator.valueToCode(block, "MAX", Order.ATOMIC) || "6";
  return [`random.randint(${min}, ${max})`, Order.FUNCTION_CALL];
};

// =========================================================================
// ADDITIONAL DISPLAY BLOCKS
// =========================================================================

// ---- m5_display_number --------------------------------------------------

Blockly.Blocks["m5_display_number"] = {
  init(this: Block) {
    this.appendValueInput("NUMBER")
      .setCheck("Number")
      .appendField("display number");
    this.appendValueInput("X")
      .setCheck("Number")
      .appendField("x");
    this.appendValueInput("Y")
      .setCheck("Number")
      .appendField("y");
    this.appendDummyInput()
      .appendField("color")
      .appendField(
        new Blockly.FieldDropdown([
          ["white", "white"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"],
          ["yellow", "yellow"],
          ["purple", "purple"],
        ]),
        "COLOR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(DISPLAY_COLOR);
    this.setTooltip("Show a number on the display.");
    this.setHelpUrl("");
  },
};

pythonGenerator.forBlock["m5_display_number"] = function (
  block: Block,
  generator: PythonGenerator
): string {
  const number =
    generator.valueToCode(block, "NUMBER", Order.ATOMIC) || "0";
  const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
  const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
  const color = block.getFieldValue("COLOR") as string;
  const colorCode = LCD_COLOR_MAP[color] ?? "0xFFFFFF";
  return `Lcd.setTextColor(${colorCode}, 0x000000)\nLcd.drawString(str(${number}), ${x}, ${y})\n`;
};

// =========================================================================
// Exports
// =========================================================================

/**
 * List of all custom M5Stick block type names.
 * Useful for verifying registration or building toolbox definitions.
 */
export const M5_BLOCK_TYPES = [
  "m5_display_text",
  "m5_display_clear",
  "m5_display_rect",
  "m5_display_circle",
  "m5_buzzer_tone",
  "m5_buzzer_off",
  "m5_button_pressed",
  "m5_led_set",
  "m5_wait",
  "m5_read_imu",
  "m5_shake_detected",
  "m5_random_number",
  "m5_display_number",
] as const;

export type M5BlockType = (typeof M5_BLOCK_TYPES)[number];

/**
 * Re-export the configured pythonGenerator so that the editor component can
 * import it from one place without needing a separate `blockly/python` import.
 */
export { pythonGenerator };
