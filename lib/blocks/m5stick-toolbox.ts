/**
 * Blockly toolbox configuration for Band 2 (Builder level).
 *
 * Categories include both custom M5Stick blocks and standard Blockly
 * built-in blocks (logic, loops, math, variables).
 *
 * The colour values here use Blockly's hue-based colour system (0-360) for
 * built-in categories, and hex strings for custom categories.
 */

import type { utils as BlocklyUtils } from "blockly/core";

/**
 * Toolbox definition for the Blockly workspace.
 *
 * react-blockly expects `Blockly.utils.toolbox.ToolboxDefinition`.
 */
export const m5stickToolbox: BlocklyUtils.toolbox.ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    // ------------------------------------------------------------------
    // Custom M5Stick categories
    // ------------------------------------------------------------------
    {
      kind: "category",
      name: "Display",
      colour: "#9C27B0",
      contents: [
        {
          kind: "block",
          type: "m5_display_text",
          inputs: {
            TEXT: {
              shadow: {
                type: "text",
                fields: { TEXT: "Hello!" },
              },
            },
            X: {
              shadow: {
                type: "math_number",
                fields: { NUM: 0 },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: { NUM: 0 },
              },
            },
          },
        },
        {
          kind: "block",
          type: "m5_display_clear",
        },
        {
          kind: "block",
          type: "m5_display_rect",
          inputs: {
            X: {
              shadow: {
                type: "math_number",
                fields: { NUM: 0 },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: { NUM: 0 },
              },
            },
            WIDTH: {
              shadow: {
                type: "math_number",
                fields: { NUM: 40 },
              },
            },
            HEIGHT: {
              shadow: {
                type: "math_number",
                fields: { NUM: 20 },
              },
            },
          },
        },
        {
          kind: "block",
          type: "m5_display_circle",
          inputs: {
            X: {
              shadow: {
                type: "math_number",
                fields: { NUM: 67 },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: { NUM: 60 },
              },
            },
            RADIUS: {
              shadow: {
                type: "math_number",
                fields: { NUM: 20 },
              },
            },
          },
        },
        {
          kind: "block",
          type: "m5_display_number",
          inputs: {
            NUMBER: {
              shadow: {
                type: "math_number",
                fields: { NUM: 42 },
              },
            },
            X: {
              shadow: {
                type: "math_number",
                fields: { NUM: 30 },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: { NUM: 60 },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Sound",
      colour: "#FF9800",
      contents: [
        {
          kind: "block",
          type: "m5_buzzer_tone",
          inputs: {
            FREQUENCY: {
              shadow: {
                type: "math_number",
                fields: { NUM: 440 },
              },
            },
            DURATION: {
              shadow: {
                type: "math_number",
                fields: { NUM: 500 },
              },
            },
          },
        },
        {
          kind: "block",
          type: "m5_buzzer_off",
        },
      ],
    },
    {
      kind: "category",
      name: "Buttons",
      colour: "#4CAF50",
      contents: [
        {
          kind: "block",
          type: "m5_button_pressed",
        },
      ],
    },
    {
      kind: "category",
      name: "LED",
      colour: "#F44336",
      contents: [
        {
          kind: "block",
          type: "m5_led_set",
        },
      ],
    },
    {
      kind: "category",
      name: "Sensors",
      colour: "#00BCD4",
      contents: [
        {
          kind: "block",
          type: "m5_read_imu",
        },
        {
          kind: "block",
          type: "m5_shake_detected",
        },
      ],
    },

    // ------------------------------------------------------------------
    // Separator between custom and built-in categories
    // ------------------------------------------------------------------
    { kind: "sep" },

    // ------------------------------------------------------------------
    // Built-in Blockly categories
    // ------------------------------------------------------------------
    {
      kind: "category",
      name: "Logic",
      colour: "210",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_negate" },
        { kind: "block", type: "logic_boolean" },
      ],
    },
    {
      kind: "category",
      name: "Loops",
      colour: "120",
      contents: [
        { kind: "block", type: "controls_repeat_ext",
          inputs: {
            TIMES: {
              shadow: {
                type: "math_number",
                fields: { NUM: 10 },
              },
            },
          },
        },
        { kind: "block", type: "controls_whileUntil" },
        { kind: "block", type: "controls_for" },
      ],
    },
    {
      kind: "category",
      name: "Math",
      colour: "230",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "math_random_int" },
        {
          kind: "block",
          type: "m5_random_number",
          inputs: {
            MIN: {
              shadow: {
                type: "math_number",
                fields: { NUM: 1 },
              },
            },
            MAX: {
              shadow: {
                type: "math_number",
                fields: { NUM: 6 },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Variables",
      colour: "330",
      custom: "VARIABLE",
    },

    // ------------------------------------------------------------------
    // Wait category (custom)
    // ------------------------------------------------------------------
    {
      kind: "category",
      name: "Wait",
      colour: "#9E9E9E",
      contents: [
        {
          kind: "block",
          type: "m5_wait",
          inputs: {
            SECONDS: {
              shadow: {
                type: "math_number",
                fields: { NUM: 1 },
              },
            },
          },
        },
      ],
    },
  ],
};
