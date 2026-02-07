---
paths:
  - "lib/blocks/**/*.ts"
  - "app/**/blockly-editor*"
  - "lib/codegen/**/*.ts"
---

# Blockly Block Coding

## Custom Blocks
- All custom M5Stick blocks live in `lib/blocks/m5stick-blocks.ts`.
- Every block needs two definitions:
  1. `Blockly.Blocks['block_name']` -- UI definition (shape, fields, inputs, color, tooltip)
  2. `pythonGenerator.forBlock['block_name']` -- MicroPython code generator
- Block names use prefix `m5_` for all M5Stick-specific blocks (e.g., `m5_set_screen_color`, `m5_buzzer_tone`, `m5_read_imu`).
- Use `Blockly.FieldColour` for color inputs, `Blockly.FieldDropdown` for selections, `appendValueInput` for expression inputs.
- Tooltips are required on every block -- they should be kid-friendly explanations.

## Code Generation
- `pythonGenerator.workspaceToCode(workspace)` produces raw user code.
- Always wrap generated code with `lib/codegen/wrap-m5stick.ts` before flashing to device. This adds M5Stick imports and hardware initialization.
- Generated MicroPython must be valid for the M5StickC Plus 2 MicroPython runtime (UIFlow2-based).

## Toolbox Categories
- M5Stick Display, M5Stick Buzzer, M5Stick Sensors, Logic, Loops, Math, Variables.
- Band 1 (Explorer): simplified toolbox with fewer blocks and pre-built templates.
- Band 2+ (Builder): full toolbox with "peek at Python" toggle.
- Band 3+ (Inventor): direct MicroPython editing via Monaco.

## Integration
- BlocklyEditor is always a `"use client"` component loaded via `dynamic()` with `ssr: false`.
- Workspace state is serialized as XML for saving to Supabase `projects.workspace_xml`.
- One-way code generation: blocks -> Python. Text edits do NOT sync back to blocks.
