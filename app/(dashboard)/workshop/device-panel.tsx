"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Usb, Wifi, WifiOff } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import type { DeviceTransport, TransportType } from "@/lib/serial/device-transport";
import { isTransportAvailable } from "@/lib/serial/device-transport";
import type { ConnectionStatus } from "@/lib/serial/types";
import { MicroPythonREPL } from "@/lib/serial/micropython-repl";
import { WebSerialManager } from "@/lib/serial/web-serial";
import { WebREPLManager } from "@/lib/serial/webrepl-client";
import { recordDeviceFlash } from "./actions";

// ---------------------------------------------------------------------------
// Storage key for persisting WiFi IP address
// ---------------------------------------------------------------------------

const WIFI_IP_KEY = "tinkerschool-wifi-ip";

function getSavedIP(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(WIFI_IP_KEY) ?? "";
}

function saveIP(ip: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(WIFI_IP_KEY, ip);
  }
}

// ---------------------------------------------------------------------------
// Kid-friendly error messages
// ---------------------------------------------------------------------------

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  switch (message) {
    case "WEB_SERIAL_NOT_SUPPORTED":
      return "This browser can't use USB. Try connecting over WiFi instead!";
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

  // WiFi-specific errors
  if (/WEBREPL_CONNECT_TIMEOUT/i.test(message)) {
    return "Could not reach your M5Stick over WiFi. Make sure it's turned on and on the same WiFi network!";
  }
  if (/WEBREPL_CONNECTION_FAILED/i.test(message)) {
    return "WiFi connection failed. Check the IP address and make sure WebREPL is enabled on your M5Stick!";
  }
  if (/WEBREPL_AUTH_FAILED/i.test(message)) {
    return "Wrong WiFi password! The default password is 'tinkerschool'.";
  }
  if (/WEBREPL_AUTH_TIMEOUT/i.test(message)) {
    return "WiFi connected but authentication timed out. Is WebREPL running on your M5Stick?";
  }

  // Catch-all heuristics
  if (/no.*device/i.test(message) || /not found/i.test(message)) {
    return "Hmm, I can't find your M5Stick! Make sure it's plugged in or connected to WiFi.";
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
  // Refs keep the transport/repl alive across renders
  const transportRef = useRef<DeviceTransport | null>(null);
  const replRef = useRef<MicroPythonREPL | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isFlashing, setIsFlashing] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // Connection mode: USB or WiFi
  const hasUSB = isTransportAvailable("usb-serial");
  const hasWiFi = isTransportAvailable("wifi-webrepl");
  const [connectionMode, setConnectionMode] = useState<TransportType>(
    hasUSB ? "usb-serial" : "wifi-webrepl",
  );

  // WiFi IP address input
  const [wifiIP, setWifiIP] = useState(getSavedIP);
  const [showWifiHelp, setShowWifiHelp] = useState(false);

  // ------------------------------------------------------------------
  // Transport factory
  // ------------------------------------------------------------------

  const createTransport = useCallback(
    (mode: TransportType): DeviceTransport => {
      if (mode === "usb-serial") {
        return new WebSerialManager();
      }
      return new WebREPLManager({ host: wifiIP });
    },
    [wifiIP],
  );

  const wireCallbacks = useCallback((transport: DeviceTransport) => {
    transport.onConnect = () => {
      setStatus("connected");
      setError(null);
    };
    transport.onDisconnect = () => {
      setStatus("disconnected");
    };
    transport.onError = (err) => {
      setError(friendlyError(err));
    };
    transport.onData = (data) => {
      setOutput((prev) => {
        const next = prev + data;
        return next.length > 4_000 ? next.slice(-4_000) : next;
      });
    };
  }, []);

  const getTransport = useCallback((): DeviceTransport => {
    if (!transportRef.current) {
      transportRef.current = createTransport(connectionMode);
      wireCallbacks(transportRef.current);
    }
    return transportRef.current;
  }, [connectionMode, createTransport, wireCallbacks]);

  const getRepl = useCallback((): MicroPythonREPL => {
    if (!replRef.current) {
      replRef.current = new MicroPythonREPL(getTransport());
    }
    return replRef.current;
  }, [getTransport]);

  // Reset transport when connection mode changes
  useEffect(() => {
    if (transportRef.current?.connected) {
      transportRef.current.disconnect();
    }
    transportRef.current = null;
    replRef.current = null;
    setStatus("disconnected");
    setError(null);
    setOutput("");
  }, [connectionMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      transportRef.current?.disconnect();
    };
  }, []);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const handleConnect = useCallback(async () => {
    setError(null);
    setStatus("connecting");

    // For WiFi, validate and save the IP for next time
    if (connectionMode === "wifi-webrepl") {
      const ip = wifiIP.trim();
      if (!ip) {
        setError("Enter your M5Stick's IP address first!");
        setStatus("disconnected");
        return;
      }
      if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
        setError("That doesn't look like an IP address. It should be numbers and dots, like 192.168.1.42");
        setStatus("disconnected");
        return;
      }
      saveIP(ip);
    }

    try {
      // Create fresh transport with latest settings
      transportRef.current = createTransport(connectionMode);
      wireCallbacks(transportRef.current);
      replRef.current = new MicroPythonREPL(transportRef.current);

      await transportRef.current.connect();
    } catch (err) {
      setStatus("disconnected");
      setError(friendlyError(err));
    }
  }, [connectionMode, wifiIP, createTransport, wireCallbacks]);

  const handleDisconnect = useCallback(async () => {
    try {
      await transportRef.current?.disconnect();
    } catch (err) {
      setError(friendlyError(err));
    }
  }, []);

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
        const flashResult = await recordDeviceFlash(connectionMode);
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
  }, [code, connectionMode, getRepl]);

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
            ? `Connected via ${connectionMode === "usb-serial" ? "USB" : "WiFi"}!`
            : "Connect your M5Stick to send code."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4 pb-3">

        {/* Connection mode picker -- only shown when both are available */}
        {hasUSB && hasWiFi && !isConnected && (
          <div className="flex gap-1.5">
            <Button
              variant={connectionMode === "usb-serial" ? "default" : "outline"}
              size="sm"
              onClick={() => setConnectionMode("usb-serial")}
              className="flex-1 gap-1.5 rounded-xl"
            >
              <Usb className="size-4" />
              USB
            </Button>
            <Button
              variant={connectionMode === "wifi-webrepl" ? "default" : "outline"}
              size="sm"
              onClick={() => setConnectionMode("wifi-webrepl")}
              className="flex-1 gap-1.5 rounded-xl"
            >
              <Wifi className="size-4" />
              WiFi
            </Button>
          </div>
        )}

        {/* WiFi-only badge for tablets */}
        {!hasUSB && hasWiFi && !isConnected && (
          <div className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs text-muted-foreground">
            <Wifi className="size-4 shrink-0" />
            <span>
              On this device, connect over WiFi. Make sure your M5Stick has WebREPL enabled!
            </span>
          </div>
        )}

        {/* WiFi IP input + help guide */}
        {connectionMode === "wifi-webrepl" && !isConnected && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="M5Stick IP (e.g. 192.168.1.42)"
                value={wifiIP}
                onChange={(e) => setWifiIP(e.target.value)}
                className="flex-1 rounded-xl text-sm"
                inputMode="decimal"
                autoComplete="off"
              />
            </div>

            {/* Expandable WiFi help */}
            <button
              onClick={() => setShowWifiHelp((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {showWifiHelp ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
              How do I find my M5Stick&apos;s IP?
            </button>

            {showWifiHelp && (
              <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                <ol className="list-inside list-decimal space-y-1.5">
                  <li>Turn on your M5Stick -- the IP shows on screen at startup</li>
                  <li>Both devices must be on the <span className="font-semibold">same WiFi network</span></li>
                  <li>Type the IP address above (numbers and dots only)</li>
                  <li>Default WebREPL password: <span className="font-mono font-semibold">tinkerschool</span></li>
                </ol>
                <p className="mt-2 text-muted-foreground/80">
                  Tip: You can also find the IP in your router&apos;s connected devices list.
                </p>
              </div>
            )}
          </div>
        )}

        {/* No connection available */}
        {!hasUSB && !hasWiFi && (
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            <WifiOff className="size-4 shrink-0" />
            <span>
              This browser can't connect to devices. Use the simulator to test your code!
            </span>
          </div>
        )}

        {/* Action buttons */}
        {(hasUSB || hasWiFi) && (
          <div className="flex flex-wrap items-center gap-2">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                size="sm"
                className="touch-manipulation rounded-xl"
              >
                {isConnecting
                  ? "Connecting..."
                  : connectionMode === "wifi-webrepl"
                    ? "Connect WiFi"
                    : "Connect USB"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  size="sm"
                  className="touch-manipulation rounded-xl"
                >
                  Disconnect
                </Button>

                <Button
                  onClick={handleFlash}
                  disabled={isFlashing || !code.trim()}
                  size="sm"
                  className="touch-manipulation rounded-xl"
                >
                  {isFlashing ? "Sending..." : "Flash Code"}
                </Button>

                <Button
                  onClick={handleStop}
                  variant="destructive"
                  size="sm"
                  className="touch-manipulation rounded-xl"
                >
                  Stop
                </Button>
              </>
            )}
          </div>
        )}

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
