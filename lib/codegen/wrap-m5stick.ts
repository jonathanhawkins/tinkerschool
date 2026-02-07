/**
 * Wraps Blockly-generated Python code with the M5StickC Plus 2 boilerplate
 * required for a complete, runnable MicroPython program.
 *
 * The wrapper:
 *   1. Imports core M5 modules and `time` (needed by the wait block).
 *   2. Calls `M5.begin()` to initialise hardware.
 *   3. Inserts the user-generated code.
 *   4. Enters the main `while True: M5.update()` loop that keeps the
 *      device responsive to button presses and other events.
 */

/**
 * Wrap generated Python code with the M5StickC Plus 2 MicroPython
 * boilerplate so it can be flashed directly to the device.
 *
 * @param generatedCode - Python code produced by the Blockly Python generator.
 * @returns A complete MicroPython program string ready for the device.
 */
export function wrapM5StickCode(generatedCode: string): string {
  const trimmed = generatedCode.trimEnd();

  return `import os, sys, io
import M5
from M5 import *
import time
import random

M5.begin()

_last_accel = (0, 0, 0)
def shake_detected():
    global _last_accel
    a = Imu.getAccel()
    diff = abs(a[0] - _last_accel[0]) + abs(a[1] - _last_accel[1]) + abs(a[2] - _last_accel[2])
    _last_accel = a
    return diff > 1.5

# --- Your Code ---
${trimmed}

# --- End Your Code ---
while True:
    M5.update()
`;
}
