/**
 * Firmware-related constants for M5StickC Plus 2.
 */

/** The version bundled in public/firmware/ and used by default. */
export const RECOMMENDED_VERSION = "2.4.1";

/** Path to the bundled firmware file in public/. */
export const BUNDLED_FIRMWARE_PATH = "/firmware/uiflow2-stickcplus2-v2.4.1.bin";

/** GitHub repo for UIFlow2 MicroPython releases. */
export const GITHUB_REPO = "m5stack/uiflow-micropython";

/** Regex to match M5StickC Plus 2 firmware assets in release files. */
export const ASSET_PATTERN = /stickcplus2.*\.bin$/i;

/** Flash configuration for M5StickC Plus 2 (ESP32-PICO-V3-02). */
export const FLASH_CONFIG = {
  address: 0x0,
  flashSize: "8MB" as const,
  flashMode: "qio" as const,
  flashFreq: "80m" as const,
  flashBaud: 460800,
  romBaud: 115200,
} as const;

/** USB vendor/product IDs for CH9102 chip on M5StickC Plus 2. */
export const USB_FILTERS = [
  { usbVendorId: 0x1a86, usbProductId: 0x55d4 },
  { usbVendorId: 0x1a86, usbProductId: 0x55d3 },
] as const;
