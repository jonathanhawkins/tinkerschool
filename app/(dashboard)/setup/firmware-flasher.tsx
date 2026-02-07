"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Monitor,
  PlugZap,
  Usb,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BUNDLED_FIRMWARE_PATH,
  FLASH_CONFIG,
  RECOMMENDED_VERSION,
  USB_FILTERS,
} from "@/lib/firmware/constants";

export type FlashStep =
  | "idle"
  | "downloading"
  | "connecting"
  | "erasing"
  | "flashing"
  | "done"
  | "error";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface FirmwareFlasherProps {
  onStepChange?: (step: FlashStep, progress: number) => void;
}

export default function FirmwareFlasher({ onStepChange }: FirmwareFlasherProps) {
  const [step, setStep] = useState<FlashStep>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg]);
    // Auto-scroll
    setTimeout(() => {
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    }, 50);
  }, []);

  const handleFlash = useCallback(async () => {
    setStep("downloading");
    setProgress(0);
    onStepChange?.("downloading", 0);
    setError(null);
    setLogs([]);

    try {
      // 1. Download firmware
      addLog(`Downloading UIFlow2 v${RECOMMENDED_VERSION} firmware...`);
      const response = await fetch(BUNDLED_FIRMWARE_PATH);
      if (!response.ok) {
        throw new Error(`Failed to download firmware: ${response.status}`);
      }
      const firmwareBlob = await response.arrayBuffer();
      const sizeMB = (firmwareBlob.byteLength / (1024 * 1024)).toFixed(1);
      addLog(
        `Firmware downloaded (${sizeMB} MB / ${firmwareBlob.byteLength} bytes)`
      );
      // UIFlow2 combined binary for M5StickC Plus 2 should be exactly 8MB
      if (firmwareBlob.byteLength < 4_000_000) {
        throw new Error(
          `Firmware too small (${sizeMB} MB). Expected ~8 MB. Download may have been truncated.`
        );
      }
      const firmwareData = arrayBufferToBinaryString(firmwareBlob);

      // 2. Connect via Web Serial
      setStep("connecting");
      onStepChange?.("connecting", 0);
      addLog("Select your M5StickC Plus 2 from the serial port dialog...");

      const { ESPLoader, Transport } = await import("esptool-js");

      const serial = navigator.serial;
      if (!serial) {
        throw new Error("Web Serial API not supported. Use Chrome!");
      }

      const port = await serial.requestPort({
        filters: [...USB_FILTERS],
      });

      const transport = new Transport(port, true);

      const terminal = {
        clean: () => {},
        writeLine: (data: string) => addLog(data),
        write: (data: string) => {
          // Filter out noisy progress dots
          if (data.trim() && data !== ".") {
            addLog(data.replace(/\n/g, ""));
          }
        },
      };

      addLog("Connecting to ESP32 bootloader...");
      addLog("(Make sure the device is in download mode: hold Button A while plugging in)");

      const loader = new ESPLoader({
        transport,
        baudrate: FLASH_CONFIG.flashBaud,
        romBaudrate: FLASH_CONFIG.romBaud,
        terminal,
      });

      await loader.main();
      addLog(`Connected! Chip: ${loader.chip.CHIP_NAME}`);

      // 3. Erase flash
      setStep("erasing");
      onStepChange?.("erasing", 0);
      addLog("Erasing flash... (this takes ~10 seconds)");
      await loader.eraseFlash();
      addLog("Flash erased!");

      // 4. Flash firmware
      setStep("flashing");
      onStepChange?.("flashing", 0);
      addLog("Writing UIFlow2 firmware...");

      await loader.writeFlash({
        fileArray: [{ data: firmwareData, address: FLASH_CONFIG.address }],
        flashSize: FLASH_CONFIG.flashSize,
        flashMode: FLASH_CONFIG.flashMode,
        flashFreq: FLASH_CONFIG.flashFreq,
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIdx: number, written: number, total: number) => {
          const pct = Math.round((written / total) * 100);
          setProgress(pct);
          onStepChange?.("flashing", pct);
        },
      });

      addLog("Firmware written successfully!");

      // 5. Reset device
      addLog("Resetting device...");
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- after_flash may not be typed in all esptool-js versions
        await (loader as any).after_flash(true);
      } catch {
        // Some esptool-js versions don't expose after_flash; reset via transport
        await transport.setDTR(false);
        await new Promise((r) => setTimeout(r, 100));
        await transport.setDTR(true);
      }
      await transport.disconnect();

      setStep("done");
      setProgress(100);
      onStepChange?.("done", 100);
      addLog("Done! Your M5StickC Plus 2 is now running UIFlow2 MicroPython.");
      addLog("You can close this page and go to the Workshop to start coding!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStep("error");
      onStepChange?.("error", 0);
      addLog(`Error: ${msg}`);
    }
  }, [addLog, onStepChange]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const isActive = step !== "idle" && step !== "done" && step !== "error";

  return (
    <div className="space-y-6">
      {/* Step 1: USB Driver card */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="size-5 text-primary" />
            Step 1: Install USB Driver
          </CardTitle>
          <CardDescription>
            Your computer needs the CH9102 USB driver to talk to the M5StickC Plus 2. Install the driver for your operating system, then restart your computer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.wch.cn/downloads/CH34XSER_MAC_ZIP.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              macOS Driver
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href="https://www.wch.cn/downloads/CH341SER_EXE.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Windows Driver
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href="https://www.wch.cn/downloads/CH341SER_LINUX_ZIP.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Linux Driver
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            After installing, restart your computer and plug in the M5StickC Plus 2. On macOS, open the CH34xVCPDriver app from Launchpad and click Install.
          </p>
        </CardContent>
      </Card>

      {/* Step 2: Instructions card */}
      <Card className="rounded-2xl border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-amber-800 dark:text-amber-200">
            <AlertTriangle className="size-5" />
            Step 2: Enter Download Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
          <p>
            This will replace the factory firmware with UIFlow2 MicroPython so the
            Workshop can upload code to your device.
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <strong>Unplug</strong> your M5StickC Plus 2
            </li>
            <li>
              <strong>Hold Button A</strong> (the big front button with "M5")
            </li>
            <li>
              <strong>While holding</strong>, plug in the USB cable
            </li>
            <li>
              <strong>Keep holding</strong> for 2 seconds, then release
            </li>
            <li>
              The screen should be <strong>blank/dark</strong> (no demo animation)
            </li>
          </ol>
          <p>
            If the screen still shows the demo, try holding Button A while
            pressing the small reset button on the side instead.
          </p>
        </CardContent>
      </Card>

      {/* Flash action card */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlugZap className="size-5 text-primary" />
            Step 3: Flash MicroPython Firmware
          </CardTitle>
          <CardDescription>
            UIFlow2 v2.4.1 for M5StickC Plus 2
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          {isActive && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {step === "downloading" && "Downloading firmware..."}
                {step === "connecting" && "Connecting to device..."}
                {step === "erasing" && "Erasing flash memory..."}
                {step === "flashing" && `Writing firmware... ${progress}%`}
              </div>
              {step === "flashing" && <Progress value={progress} />}
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <CheckCircle2 className="size-5 shrink-0" />
              <span>
                UIFlow2 firmware flashed successfully! Go to the{" "}
                <a href="/workshop" className="font-medium underline">
                  Workshop
                </a>{" "}
                to start coding.
              </span>
            </div>
          )}

          {/* Error */}
          {step === "error" && error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error.includes("NotFoundError") || error.includes("No port")
                ? "No device selected. Make sure your M5StickC Plus 2 is plugged in and in download mode, then try again."
                : error}
            </div>
          )}

          {/* Log output */}
          {logs.length > 0 && (
            <div
              ref={logRef}
              className="max-h-48 overflow-y-auto rounded-xl bg-muted p-3"
            >
              <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                {logs.join("\n")}
              </pre>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleFlash}
              disabled={isActive}
              className="gap-2"
            >
              {isActive ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Flashing...
                </>
              ) : step === "done" ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Flash Again
                </>
              ) : step === "error" ? (
                <>
                  <Download className="size-4" />
                  Retry
                </>
              ) : (
                <>
                  <Usb className="size-4" />
                  Start Flashing
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an ArrayBuffer to a binary string (esptool-js expects bstr). */
function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  // Process in 8KB chunks to avoid call stack limits with large firmware
  for (let i = 0; i < bytes.length; i += 8192) {
    const slice = bytes.subarray(i, Math.min(i + 8192, bytes.length));
    chunks.push(String.fromCharCode(...slice));
  }
  return chunks.join("");
}
