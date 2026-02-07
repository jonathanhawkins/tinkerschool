"use client";

import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TerminalSquare, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WebTerminalHandle } from "@/components/web-terminal";
import type { WebSerialManager } from "@/lib/serial/web-serial";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dynamic import -- xterm.js needs the DOM
// ---------------------------------------------------------------------------

const WebTerminal = dynamic(
  () => import("@/components/web-terminal").then((mod) => mod.WebTerminal),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="min-h-[200px] flex-1 rounded-lg" />
    ),
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TerminalPanelProps {
  /** The shared WebSerialManager instance for device I/O */
  serialManager?: WebSerialManager | null;
  /** Whether the serial connection is currently active */
  isConnected?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

// ---------------------------------------------------------------------------
// TerminalPanel
// ---------------------------------------------------------------------------

export default function TerminalPanel({
  serialManager,
  isConnected = false,
  className,
}: TerminalPanelProps) {
  const terminalRef = useRef<WebTerminalHandle>(null);

  const handleClear = useCallback(() => {
    terminalRef.current?.clear();
  }, []);

  return (
    <motion.div {...fadeIn}>
      <Card className={cn("flex flex-col rounded-2xl", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TerminalSquare className="size-4 text-muted-foreground" />
            Terminal
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "outline"}
              className="text-[11px]"
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Clear terminal"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </motion.div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex min-h-[200px] flex-1 flex-col">
          <WebTerminal
            ref={terminalRef}
            serialManager={serialManager}
            className="flex-1"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
