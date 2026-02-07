"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "xterm/css/xterm.css";

import type { WebSerialManager } from "@/lib/serial/web-serial";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebTerminalProps {
  /** Optional serial manager to connect terminal to device I/O */
  serialManager?: WebSerialManager | null;
  /** Additional CSS class */
  className?: string;
}

export interface WebTerminalHandle {
  /** Clear the terminal buffer and reset the viewport */
  clear(): void;
  /** Write text directly to the terminal (bypasses serial) */
  write(data: string): void;
  /** Focus the terminal input */
  focus(): void;
}

// ---------------------------------------------------------------------------
// Kid-friendly terminal theme -- dark purple/navy bg, bright green/cyan text
// ---------------------------------------------------------------------------

const TERMINAL_THEME = {
  background: "#1a1035",
  foreground: "#a5f3c4",
  cursor: "#67e8f9",
  cursorAccent: "#1a1035",
  selectionBackground: "#7c3aed44",
  selectionForeground: "#f0fdf4",
  black: "#1a1035",
  red: "#f87171",
  green: "#4ade80",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  magenta: "#c084fc",
  cyan: "#22d3ee",
  white: "#f0fdf4",
  brightBlack: "#4a3570",
  brightRed: "#fca5a5",
  brightGreen: "#86efac",
  brightYellow: "#fde68a",
  brightBlue: "#93c5fd",
  brightMagenta: "#d8b4fe",
  brightCyan: "#67e8f9",
  brightWhite: "#ffffff",
} as const;

const WELCOME_MESSAGE = [
  "\x1b[1;36m",
  "  ____          _      ____            _     _       \r\n",
  " / ___|___   __| | ___| __ ) _   _  __| | __| |_   _ \r\n",
  "| |   / _ \\ / _` |/ _ \\  _ \\| | | |/ _` |/ _` | | | |\r\n",
  "| |__| (_) | (_| |  __/ |_) | |_| | (_| | (_| | |_| |\r\n",
  " \\____\\___/ \\__,_|\\___|____/ \\__,_|\\__,_|\\__,_|\\__, |\r\n",
  "                                                |___/ \r\n",
  "\x1b[0m\r\n",
  "\x1b[33mConnect your M5Stick to use the terminal!\x1b[0m\r\n",
  "\x1b[90mTip: Plug in the USB cable and click \x1b[97mConnect Device\x1b[90m above.\x1b[0m\r\n",
  "\r\n",
].join("");

const CONNECTED_MESSAGE = [
  "\r\n",
  "\x1b[1;32mM5Stick connected!\x1b[0m Ready to go.\r\n",
  "\x1b[90mType commands or flash code from the editor.\x1b[0m\r\n",
  "\r\n",
].join("");

const DISCONNECTED_MESSAGE = [
  "\r\n",
  "\x1b[1;33mM5Stick disconnected.\x1b[0m\r\n",
  "\r\n",
].join("");

// ---------------------------------------------------------------------------
// Helper: bind serial manager callbacks to the terminal instance.
// Returns a teardown function that restores the previous callbacks.
// ---------------------------------------------------------------------------

function bindSerialToTerminal(
  serial: WebSerialManager,
  terminal: Terminal,
): () => void {
  const prevOnData = serial.onData;
  const prevOnConnect = serial.onConnect;
  const prevOnDisconnect = serial.onDisconnect;

  serial.onData = (data: string) => {
    terminal.write(data);
    prevOnData?.(data);
  };

  serial.onConnect = () => {
    terminal.write(CONNECTED_MESSAGE);
    prevOnConnect?.();
  };

  serial.onDisconnect = () => {
    terminal.write(DISCONNECTED_MESSAGE);
    prevOnDisconnect?.();
  };

  return () => {
    serial.onData = prevOnData;
    serial.onConnect = prevOnConnect;
    serial.onDisconnect = prevOnDisconnect;
  };
}

// ---------------------------------------------------------------------------
// WebTerminal component
// ---------------------------------------------------------------------------

export const WebTerminal = forwardRef<WebTerminalHandle, WebTerminalProps>(
  function WebTerminal({ serialManager, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const inputDisposableRef = useRef<{ dispose(): void } | null>(null);
    const serialUnbindRef = useRef<(() => void) | null>(null);
    const hasShownWelcomeRef = useRef(false);
    const prevConnectedRef = useRef(false);

    // ---- Clear helper -------------------------------------------------------

    const clearTerminal = useCallback(() => {
      const term = terminalRef.current;
      if (!term) return;
      term.clear();
      term.write("\x1b[H\x1b[2J");
    }, []);

    // ---- Imperative handle --------------------------------------------------

    useImperativeHandle(
      ref,
      () => ({
        clear: clearTerminal,
        write(data: string) {
          terminalRef.current?.write(data);
        },
        focus() {
          terminalRef.current?.focus();
        },
      }),
      [clearTerminal],
    );

    // ---- Terminal initialization ---------------------------------------------

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const terminal = new Terminal({
        fontSize: 15,
        fontFamily: "var(--font-geist-mono), 'Cascadia Code', 'Fira Code', Menlo, monospace",
        lineHeight: 1.35,
        cursorBlink: true,
        cursorStyle: "bar",
        theme: TERMINAL_THEME,
        scrollback: 1000,
        convertEol: true,
        allowTransparency: true,
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);
      terminal.open(container);

      // Initial fit after rendering
      requestAnimationFrame(() => {
        fitAddon.fit();
      });

      terminalRef.current = terminal;
      fitAddonRef.current = fitAddon;

      // Show welcome message on first mount
      if (!hasShownWelcomeRef.current) {
        terminal.write(WELCOME_MESSAGE);
        hasShownWelcomeRef.current = true;
      }

      // ---- ResizeObserver for auto-fit ------------------------------------

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          fitAddon.fit();
        });
      });
      resizeObserver.observe(container);

      // ---- Cleanup --------------------------------------------------------

      return () => {
        resizeObserver.disconnect();
        webLinksAddon.dispose();
        fitAddon.dispose();
        terminal.dispose();
        terminalRef.current = null;
        fitAddonRef.current = null;
      };
    }, []);

    // ---- Serial manager binding ---------------------------------------------

    useEffect(() => {
      const terminal = terminalRef.current;

      // Tear down any previous bindings from the prior serial manager
      if (inputDisposableRef.current) {
        inputDisposableRef.current.dispose();
        inputDisposableRef.current = null;
      }
      if (serialUnbindRef.current) {
        serialUnbindRef.current();
        serialUnbindRef.current = null;
      }

      if (!terminal || !serialManager) return;

      // Pipe keyboard input from terminal -> serial device
      const inputDisposable = terminal.onData((data: string) => {
        if (serialManager.connected) {
          serialManager.write(data).catch(() => {
            // Write failures are handled by the serial manager's onError
          });
        }
      });
      inputDisposableRef.current = inputDisposable;

      // Pipe serial data from device -> terminal display (+ connect/disconnect)
      const unbind = bindSerialToTerminal(serialManager, terminal);
      serialUnbindRef.current = unbind;

      // Show connection state transition message on initial bind
      const isConnected = serialManager.connected;
      if (isConnected && !prevConnectedRef.current) {
        terminal.write(CONNECTED_MESSAGE);
      } else if (!isConnected && prevConnectedRef.current) {
        terminal.write(DISCONNECTED_MESSAGE);
      }
      prevConnectedRef.current = isConnected;

      return () => {
        inputDisposable.dispose();
        inputDisposableRef.current = null;
        unbind();
        serialUnbindRef.current = null;
      };
    }, [serialManager]);

    // ---- Render -------------------------------------------------------------

    return (
      <div
        ref={containerRef}
        className={cn(
          "min-h-0 flex-1 overflow-hidden rounded-lg",
          className,
        )}
        role="log"
        aria-label="Device terminal"
        aria-live="polite"
      />
    );
  },
);
