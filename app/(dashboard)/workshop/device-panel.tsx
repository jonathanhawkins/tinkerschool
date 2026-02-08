"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  BadgeCelebration,
  type EarnedBadge,
} from "@/components/badge-celebration";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConnectionStatus } from "@/lib/serial/types";
import { MicroPythonREPL } from "@/lib/serial/micropython-repl";
import { WebSerialManager } from "@/lib/serial/web-serial";
import { recordDeviceFlash } from "./actions";

// ---------------------------------------------------------------------------
// Kid-friendly error messages
// ---------------------------------------------------------------------------

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  switch (message) {
    case "WEB_SERIAL_NOT_SUPPORTED":
      return "This browser can't talk to your M5Stick. Try using Chrome!";
    case "NO_DEVICE_SELECTED":
      return "You didn't pick a device. Click Connect and choose your M5Stick from the list!";
    case "PORT_ALREADY_IN_USE":
      return "Someone else is talking to your M5Stick! Close any other programs using it.";
    case "PORT_OPEN_FAILED":
    case "PORT_NOT_WRITABLE":
      return "Hmm, I can't find your M5Stick! Make sure it's plugged in with the USB cable.";
    case "NOT_CONNECTED":
      return "Your M5Stick isn't connected yet. Click the Connect button first!";
    default:
      break;
  }

  // Catch-all heuristics for common browser-level messages
  if (/no.*device/i.test(message) || /not found/i.test(message)) {
    return "Hmm, I can't find your M5Stick! Make sure it's plugged in with the USB cable.";
  }

  if (/already.*open/i.test(message) || /in use/i.test(message)) {
    return "Someone else is talking to your M5Stick! Close any other programs using it.";
  }

  if (/raw REPL/i.test(message) || /MicroPython/i.test(message)) {
    return "Your M5Stick isn't responding. The factory firmware may be blocking the REPL. Try: Hold Button A while plugging in the USB cable, wait for the startup menu, then try Flash Code again.";
  }

  return `Something went wrong: ${message}`;
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; icon: string; variant: "default" | "secondary" | "outline" }
> = {
  disconnected: {
    label: "Not Connected",
    icon: "\uD83D\uDD34", // red circle
    variant: "outline",
  },
  connecting: {
    label: "Connecting...",
    icon: "\uD83D\uDFE1", // yellow circle
    variant: "secondary",
  },
  connected: {
    label: "Connected",
    icon: "\uD83D\uDFE2", // green circle
    variant: "default",
  },
};

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

interface DevicePanelProps {
  /** The Python code that will be sent to the device when "Flash Code" is clicked. */
  code?: string;
}

// ---------------------------------------------------------------------------
// DevicePanel
// ---------------------------------------------------------------------------

export default function DevicePanel({ code = "" }: DevicePanelProps) {
  // Refs keep the manager/repl alive across renders without causing re-renders
  const serialRef = useRef<WebSerialManager | null>(null);
  const replRef = useRef<MicroPythonREPL | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isFlashing, setIsFlashing] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // Lazily create the serial manager so it only exists on the client
  const getSerial = useCallback(() => {
    if (!serialRef.current) {
      serialRef.current = new WebSerialManager();

      serialRef.current.onConnect = () => {
        setStatus("connected");
        setError(null);
      };

      serialRef.current.onDisconnect = () => {
        setStatus("disconnected");
      };

      serialRef.current.onError = (err) => {
        setError(friendlyError(err));
      };

      serialRef.current.onData = (data) => {
        setOutput((prev) => {
          // Keep buffer from growing unbounded (last 4 000 chars)
          const next = prev + data;
          return next.length > 4_000 ? next.slice(-4_000) : next;
        });
      };
    }
    return serialRef.current;
  }, []);

  const getRepl = useCallback(() => {
    if (!replRef.current) {
      replRef.current = new MicroPythonREPL(getSerial());
    }
    return replRef.current;
  }, [getSerial]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      serialRef.current?.disconnect();
    };
  }, []);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const handleConnect = useCallback(async () => {
    setError(null);
    setStatus("connecting");

    try {
      await getSerial().connect();
      // Status is set to "connected" by the onConnect callback
    } catch (err) {
      setStatus("disconnected");
      setError(friendlyError(err));
    }
  }, [getSerial]);

  const handleDisconnect = useCallback(async () => {
    try {
      await getSerial().disconnect();
    } catch (err) {
      setError(friendlyError(err));
    }
  }, [getSerial]);

  const handleFlash = useCallback(async () => {
    if (!code.trim()) {
      setError("There's no code to send! Write some code first.");
      return;
    }

    setIsFlashing(true);
    setError(null);
    setOutput("");

    try {
      const result = await getRepl().executeCode(code);
      setOutput(result);

      // Record the successful flash server-side for badge tracking
      try {
        const flashResult = await recordDeviceFlash("usb-serial");
        if (flashResult.newBadges && flashResult.newBadges.length > 0) {
          setEarnedBadges(flashResult.newBadges);
        }
      } catch (err) {
        console.error("[device-panel] Failed to record flash:", err);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsFlashing(false);
    }
  }, [code, getRepl]);

  const handleStop = useCallback(async () => {
    setError(null);
    setOutput((prev) => prev + "\n--- Sending interrupt (Ctrl-C) ---\n");
    try {
      await getRepl().interrupt();
      setOutput((prev) => prev + "--- Interrupt sent ---\n");
    } catch (err) {
      setError(friendlyError(err));
    }
  }, [getRepl]);

  // ------------------------------------------------------------------
  // Derived state
  // ------------------------------------------------------------------

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const statusConfig = STATUS_CONFIG[status];
  const browserSupported = WebSerialManager.isSupported();

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <Card className="rounded-2xl">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">{statusConfig.icon}</span>
          <CardTitle className="text-sm font-bold">My M5Stick</CardTitle>
          <Badge variant={statusConfig.variant} className="ml-auto">
            {statusConfig.label}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {isConnected
            ? "Ready to go!"
            : "Plug in your M5Stick and click Connect."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4 pb-3">

        {/* Browser support warning */}
        {!browserSupported && (
          <p className="text-sm text-destructive">
            This browser can&apos;t talk to your M5Stick. Try using Chrome!
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={!browserSupported || isConnecting}
              size="sm"
            >
              {isConnecting ? "Connecting..." : "Connect Device"}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
              >
                Disconnect
              </Button>

              <Button
                onClick={handleFlash}
                disabled={isFlashing || !code.trim()}
                size="sm"
              >
                {isFlashing ? "Sending..." : "Flash Code"}
              </Button>

              <Button
                onClick={handleStop}
                variant="destructive"
                size="sm"
              >
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Device output -- always visible when connected */}
        {isConnected && (
          <div className="max-h-40 overflow-y-auto rounded-xl bg-muted p-3">
            <pre className="whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground">
              {output || "Waiting for device output..."}
            </pre>
          </div>
        )}
      </CardContent>

      {/* Badge celebration toast */}
      {earnedBadges.length > 0 && (
        <BadgeCelebration
          badges={earnedBadges}
          onDismiss={() => setEarnedBadges([])}
        />
      )}
    </Card>
  );
}
