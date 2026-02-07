"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  HardDrive,
  Loader2,
  Package,
  PlugZap,
  RefreshCw,
  Star,
  Usb,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FirmwareCatalog, FirmwareRelease } from "@/lib/firmware/types";
import {
  BUNDLED_FIRMWARE_PATH,
  FLASH_CONFIG,
  USB_FILTERS,
} from "@/lib/firmware/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FlashStep =
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

interface FirmwareBrowserProps {
  catalog: FirmwareCatalog;
}

export default function FirmwareBrowser({ catalog }: FirmwareBrowserProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(
    () => catalog.releases.find((r) => r.isRecommended)?.version ?? catalog.releases[0]?.version ?? ""
  );
  const [step, setStep] = useState<FlashStep>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const selectedRelease = catalog.releases.find(
    (r) => r.version === selectedVersion
  );

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg]);
    setTimeout(() => {
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    }, 50);
  }, []);

  const handleFlash = useCallback(async () => {
    if (!selectedRelease) return;

    setStep("downloading");
    setProgress(0);
    setError(null);
    setLogs([]);

    try {
      // 1. Download firmware
      const downloadUrl = selectedRelease.isBundled
        ? BUNDLED_FIRMWARE_PATH
        : selectedRelease.downloadUrl;

      addLog(`Downloading UIFlow2 v${selectedRelease.version} firmware...`);
      addLog(`Source: ${selectedRelease.isBundled ? "Local (bundled)" : "GitHub"}`);

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download firmware: ${response.status}`);
      }

      const firmwareBlob = await response.arrayBuffer();
      const sizeMB = (firmwareBlob.byteLength / (1024 * 1024)).toFixed(1);
      addLog(`Firmware downloaded (${sizeMB} MB / ${firmwareBlob.byteLength} bytes)`);

      if (firmwareBlob.byteLength < 4_000_000) {
        throw new Error(
          `Firmware too small (${sizeMB} MB). Expected ~8 MB. Download may have been truncated.`
        );
      }

      const firmwareData = arrayBufferToBinaryString(firmwareBlob);

      // 2. Connect via Web Serial
      setStep("connecting");
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
      addLog("Erasing flash... (this takes ~10 seconds)");
      await loader.eraseFlash();
      addLog("Flash erased!");

      // 4. Flash firmware
      setStep("flashing");
      addLog(`Writing UIFlow2 v${selectedRelease.version} firmware...`);

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
        },
      });

      addLog("Firmware written successfully!");

      // 5. Reset device
      addLog("Resetting device...");
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (loader as any).after_flash(true);
      } catch {
        await transport.setDTR(false);
        await new Promise((r) => setTimeout(r, 100));
        await transport.setDTR(true);
      }
      await transport.disconnect();

      setStep("done");
      setProgress(100);
      addLog(`Done! Your M5StickC Plus 2 is now running UIFlow2 v${selectedRelease.version}.`);
      addLog("You can close this page and go to the Workshop to start coding!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStep("error");
      addLog(`Error: ${msg}`);
    }
  }, [selectedRelease, addLog]);

  const isActive = step !== "idle" && step !== "done" && step !== "error";

  return (
    <div className="space-y-6">
      {/* Download Mode Instructions */}
      <Card className="rounded-2xl border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-amber-800 dark:text-amber-200">
            <AlertTriangle className="size-5" />
            Before Flashing: Enter Download Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
          <ol className="list-inside list-decimal space-y-1">
            <li><strong>Unplug</strong> your M5StickC Plus 2</li>
            <li><strong>Hold Button A</strong> (the big front button with "M5")</li>
            <li><strong>While holding</strong>, plug in the USB cable</li>
            <li><strong>Keep holding</strong> for 2 seconds, then release</li>
            <li>The screen should be <strong>blank/dark</strong></li>
          </ol>
        </CardContent>
      </Card>

      {/* Version Selector */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="size-5 text-primary" />
            Select Firmware Version
          </CardTitle>
          <CardDescription>
            Choose a UIFlow2 firmware version to flash. The recommended version
            is tested and known to work with TinkerSchool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {catalog.releases.map((release) => (
              <VersionRow
                key={release.version}
                release={release}
                selected={selectedVersion === release.version}
                disabled={isActive}
                onSelect={() => setSelectedVersion(release.version)}
              />
            ))}
          </div>
          {catalog.releases.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No firmware versions found. Check your internet connection.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Flash Action */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlugZap className="size-5 text-primary" />
            Flash Firmware
          </CardTitle>
          {selectedRelease && (
            <CardDescription>
              UIFlow2 v{selectedRelease.version} ({formatSize(selectedRelease.size)})
              {selectedRelease.isBundled && " - Local copy, no download needed"}
            </CardDescription>
          )}
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
                Firmware flashed successfully! Go to the{" "}
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
              disabled={isActive || !selectedRelease}
              className="gap-2"
            >
              {isActive ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Flashing...
                </>
              ) : step === "done" ? (
                <>
                  <RefreshCw className="size-4" />
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
                  Flash v{selectedVersion}
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
// Sub-components
// ---------------------------------------------------------------------------

interface VersionRowProps {
  release: FirmwareRelease;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

function VersionRow({ release, selected, disabled, onSelect }: VersionRowProps) {
  const date = new Date(release.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:bg-muted/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-primary" : "border-muted-foreground/30"
        }`}
      >
        {selected && <div className="size-2 rounded-full bg-primary" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">v{release.version}</span>
          {release.isRecommended && (
            <Badge variant="default" className="gap-1 text-[10px] px-1.5 py-0">
              <Star className="size-2.5" />
              Recommended
            </Badge>
          )}
          {release.isBundled && (
            <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
              <HardDrive className="size-2.5" />
              Bundled
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {date} &middot; {formatSize(release.size)}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(0)} KB`;
}

/** Convert an ArrayBuffer to a binary string (esptool-js expects bstr). */
function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 8192) {
    const slice = bytes.subarray(i, Math.min(i + 8192, bytes.length));
    chunks.push(String.fromCharCode(...slice));
  }
  return chunks.join("");
}
