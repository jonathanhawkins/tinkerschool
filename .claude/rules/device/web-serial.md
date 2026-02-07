---
paths:
  - "lib/serial/**/*.ts"
  - "app/**/device-panel*"
---

# M5StickC Plus 2 Device Communication

## Hardware
- Device: M5StickC Plus 2 (ESP32-PICO-V3-02)
- USB chip: CH9102 -- filter IDs: vendor `0x1A86`, product `0x55D4` (CH9102F) or `0x55D3` (CH9102X)
- Baud rate: 115200, 8N1, no flow control
- Display: 1.14" TFT 135x240, ST7789V2 driver
- Sensors: MPU6886 (6-axis IMU), microphone, IR transmitter
- I/O: Button A, Button B, buzzer, LED, HAT connector (I2C/GPIO)

## Web Serial API
- Requires Chrome/Edge 89+. Always check `WebSerialManager.isSupported()` before attempting connection.
- `navigator.serial.requestPort()` requires a user gesture (button click) -- never call it on page load.
- Use `M5STICK_FILTERS` array with CH9102 vendor/product IDs for port selection dialog.
- All serial code is client-only -- always in `"use client"` components loaded via `dynamic()` with `ssr: false`.
- Handle disconnects gracefully -- the USB cable can be unplugged at any time.

## MicroPython REPL Protocol
- **Ctrl-A (0x01):** Enter raw REPL mode (machine-friendly, no echo)
- **Ctrl-B (0x02):** Exit raw REPL, return to normal REPL
- **Ctrl-C (0x03):** Interrupt running program (send twice to be sure)
- **Ctrl-D (0x04):** Soft reset / execute code in raw REPL mode
- **Ctrl-E (0x05):** Enter paste mode (for uploading large code blocks)
- To upload code: interrupt -> raw REPL -> paste mode -> send code -> execute -> exit raw REPL
- To write `main.py`: use raw REPL to execute a `open('main.py', 'w').write(code)` command

## Code Upload Flow (One-Click Flash)
1. Interrupt any running program (Ctrl-C x2)
2. Enter raw REPL (Ctrl-A)
3. Enter paste mode (Ctrl-E)
4. Send the MicroPython code line by line
5. Execute (Ctrl-D)
6. Optionally persist as main.py for auto-run on boot

## Firmware Flashing
- Use esptool-js for full MicroPython firmware flashing from the browser.
- Verify firmware SHA-256 hash before flashing.
- Show clear progress indicator during flash (~30 seconds).
- If flash fails: provide recovery instructions (hold GPIO0/power button to enter bootloader).

## Error Handling
- Show kid-friendly error messages: "Hmm, I can't find your M5Stick. Is it plugged in?"
- If browser doesn't support Web Serial: "This works best in Chrome! Let's use the simulator for now."
- If device is busy/locked: "Your M5Stick is busy. Let's try pressing the reset button!"
- Always provide a simulator fallback so learning can continue without the physical device.

## Browser Compatibility
- Chrome 89+ / Edge 89+: Full support (Web Serial + USB)
- Firefox / Safari: Simulator-only mode (no device connection)
- Display clear messaging about browser requirements during onboarding.
