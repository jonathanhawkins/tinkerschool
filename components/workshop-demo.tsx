"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Blocks,
  Eye,
  Monitor,
  Volume2,
  Lightbulb,
  Activity,
  Zap,
  MousePointer2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DemoBlock {
  id: string;
  label: string;
  color: string;
  fields?: Array<{ label: string; value: string; fieldColor?: string }>;
}

interface ChatMessage {
  text: string;
  isChip: boolean;
}

interface DemoPhase {
  /** Blocks visible in the workspace */
  blocks: DemoBlock[];
  /** Simulator screen state */
  simulator: "off" | "hello" | "running";
  /** Chat messages to display */
  chat: ChatMessage;
  /** Python code lines visible */
  pythonLines: string[];
  /** Which tab is active */
  activeTab: "blocks" | "python";
  /** Show cursor clicking run */
  showRunClick: boolean;
  /** Duration in ms before advancing */
  duration: number;
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DISPLAY_BLOCK_COLOR = "#9C27B0";
const DEMO_BLOCKS: Record<string, DemoBlock> = {
  clear: {
    id: "clear",
    label: "clear display",
    color: DISPLAY_BLOCK_COLOR,
    fields: [{ label: "", value: "black", fieldColor: "#1C1917" }],
  },
  displayText: {
    id: "displayText",
    label: "display text",
    color: DISPLAY_BLOCK_COLOR,
    fields: [
      { label: "", value: '"Hello!"', fieldColor: "#7B1FA2" },
      { label: "x", value: "10" },
      { label: "y", value: "30" },
    ],
  },
};

const TOOLBOX_CATEGORIES = [
  { name: "Display", color: "#9C27B0", icon: Monitor },
  { name: "Sound", color: "#FF9800", icon: Volume2 },
  { name: "LED", color: "#F44336", icon: Lightbulb },
  { name: "Sensors", color: "#00BCD4", icon: Activity },
  { name: "Logic", color: "#5B80A5", icon: Blocks },
  { name: "Loops", color: "#5BA55B", icon: Zap },
];

const PHASES: DemoPhase[] = [
  // Phase 0: Empty workspace, Chip asks a question
  {
    blocks: [],
    simulator: "off",
    chat: { text: "We want the screen to say Hello -- what do you think we need first?", isChip: true },
    pythonLines: [],
    activeTab: "blocks",
    showRunClick: false,
    duration: 2200,
  },
  // Phase 1: Kid dragged clear block (answered Chip's question)
  {
    blocks: [DEMO_BLOCKS.clear],
    simulator: "off",
    chat: { text: "Nice pick! Now what block could put words on the display?", isChip: true },
    pythonLines: ["Lcd.clear(0x000000)"],
    activeTab: "blocks",
    showRunClick: false,
    duration: 2200,
  },
  // Phase 2: Kid added display text block
  {
    blocks: [DEMO_BLOCKS.clear, DEMO_BLOCKS.displayText],
    simulator: "off",
    chat: { text: "Ooh, looking good! How do you think we test if it works?", isChip: true },
    pythonLines: ["Lcd.clear(0x000000)", 'Lcd.print("Hello!", 10, 30, 0xFFFFFF)'],
    activeTab: "blocks",
    showRunClick: false,
    duration: 2000,
  },
  // Phase 3: Python peek -- Chip sparks curiosity
  {
    blocks: [DEMO_BLOCKS.clear, DEMO_BLOCKS.displayText],
    simulator: "off",
    chat: { text: "Psst -- wanna see something cool? Look what's hiding behind those blocks!", isChip: true },
    pythonLines: ["Lcd.clear(0x000000)", 'Lcd.print("Hello!", 10, 30, 0xFFFFFF)'],
    activeTab: "python",
    showRunClick: false,
    duration: 2200,
  },
  // Phase 4: Back to blocks, run
  {
    blocks: [DEMO_BLOCKS.clear, DEMO_BLOCKS.displayText],
    simulator: "running",
    chat: { text: "Running your code...", isChip: true },
    pythonLines: ["Lcd.clear(0x000000)", 'Lcd.print("Hello!", 10, 30, 0xFFFFFF)'],
    activeTab: "blocks",
    showRunClick: true,
    duration: 1500,
  },
  // Phase 5: Simulator shows result -- Chip asks discovery question
  {
    blocks: [DEMO_BLOCKS.clear, DEMO_BLOCKS.displayText],
    simulator: "hello",
    chat: { text: "It worked! What do you think happens if you change the numbers after x and y?", isChip: true },
    pythonLines: ["Lcd.clear(0x000000)", 'Lcd.print("Hello!", 10, 30, 0xFFFFFF)'],
    activeTab: "blocks",
    showRunClick: false,
    duration: 3000,
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Fake browser window chrome with three dots */
function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
        {/* Window dots */}
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#FF5F57]" />
          <div className="size-3 rounded-full bg-[#FEBC2E]" />
          <div className="size-3 rounded-full bg-[#28C840]" />
        </div>
        {/* URL bar */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-1 text-xs text-muted-foreground">
            <svg
              className="size-3 text-muted-foreground/60"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 1a4.5 4.5 0 0 0-4.5 4.5V7H2.5A1.5 1.5 0 0 0 1 8.5v5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 7H12V5.5A4.5 4.5 0 0 0 8 1Zm3 6V5.5a3 3 0 1 0-6 0V7h6Z"
                clipRule="evenodd"
              />
            </svg>
            <span>tinkerschool.ai/workshop</span>
          </div>
        </div>
        {/* Spacer for symmetry */}
        <div className="w-[52px]" />
      </div>
      {/* Content area */}
      <div className="bg-background">{children}</div>
    </div>
  );
}

/** Mini toolbox sidebar */
function Toolbox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 border-r border-border bg-muted/40 py-2",
        className
      )}
    >
      {TOOLBOX_CATEGORIES.map((cat) => (
        <div
          key={cat.name}
          className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent sm:text-xs"
        >
          <div
            className="size-2 shrink-0 rounded-sm"
            style={{ backgroundColor: cat.color }}
          />
          <span className="hidden sm:inline">{cat.name}</span>
        </div>
      ))}
    </div>
  );
}

/** A single fake Blockly block */
function FakeBlock({
  block,
  index,
  animate,
}: {
  block: DemoBlock;
  index: number;
  animate: boolean;
}) {
  return (
    <motion.div
      layout
      initial={animate ? { opacity: 0, x: -60, scale: 0.85 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: animate ? 0.1 : 0,
      }}
      className="flex items-center gap-1"
    >
      {/* Notch connector (top of block) */}
      {index > 0 && (
        <div className="absolute -top-[3px] left-6 h-[3px] w-5 rounded-b" style={{ backgroundColor: block.color }} />
      )}
      <div
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm sm:text-xs"
        style={{ backgroundColor: block.color }}
      >
        <span>{block.label}</span>
        {block.fields?.map((field, i) => (
          <span key={i} className="flex items-center gap-0.5">
            {field.label && (
              <span className="text-white/70">{field.label}</span>
            )}
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{
                backgroundColor: field.fieldColor ?? "rgba(255,255,255,0.2)",
              }}
            >
              {field.value}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/** Fake workspace area with blocks */
function BlockWorkspace({
  blocks,
  showDots,
}: {
  blocks: DemoBlock[];
  showDots: boolean;
}) {
  return (
    <div className="relative flex-1 overflow-hidden bg-muted p-4">
      {/* Grid dots background */}
      {showDots && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {/* Blocks */}
      <div className="relative flex flex-col gap-1">
        <AnimatePresence mode="popLayout">
          {blocks.map((block, i) => (
            <FakeBlock key={block.id} block={block} index={i} animate={true} />
          ))}
        </AnimatePresence>

        {/* Empty state placeholder */}
        {blocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-2 py-8 text-center"
          >
            <Blocks className="size-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground/50">
              Drag blocks here
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Fake Python code view */
function PythonView({ lines }: { lines: string[] }) {
  return (
    <div className="flex-1 overflow-hidden bg-[#1e1e2e] p-3">
      {/* File header */}
      <div className="mb-2 flex items-center gap-2 text-[10px] text-white/40">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-red-400/60" />
          <span className="size-2 rounded-full bg-yellow-400/60" />
          <span className="size-2 rounded-full bg-green-400/60" />
        </div>
        <span>generated-code.py</span>
      </div>
      {/* Code lines */}
      <div className="flex flex-col gap-0.5 font-mono text-[10px] sm:text-xs">
        {/* Import header - always shown */}
        <div className="text-[#CE9178]">
          <span className="text-[#C586C0]">from</span>{" "}
          <span className="text-[#4EC9B0]">M5</span>{" "}
          <span className="text-[#C586C0]">import</span>{" "}
          <span className="text-[#DCDCAA]">*</span>
        </div>
        <div className="h-2" />
        <AnimatePresence mode="popLayout">
          {lines.map((line, i) => (
            <motion.div
              key={`${line}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="text-[#D4D4D4]"
            >
              {colorizeCode(line)}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="mt-1 inline-block h-3 w-1.5 bg-[#AEAFAD]"
        />
      </div>
    </div>
  );
}

/** Simple syntax-coloring for the demo Python lines */
function colorizeCode(line: string): React.ReactNode {
  // Colorize Lcd.method calls
  if (line.startsWith("Lcd.")) {
    const dotIdx = line.indexOf("(");
    const method = line.slice(0, dotIdx);
    const args = line.slice(dotIdx);
    return (
      <>
        <span className="text-[#4EC9B0]">{method}</span>
        <span className="text-[#D4D4D4]">{args}</span>
      </>
    );
  }
  return <span>{line}</span>;
}

/** Mini M5Stick simulator mockup */
function MiniSimulator({
  state,
  showRunClick,
}: {
  state: "off" | "hello" | "running";
  showRunClick: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Device frame */}
      <div className="relative flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] p-2 shadow-lg"
        style={{ width: 96, border: "1.5px solid #3a3a40" }}
      >
        {/* LED */}
        <div
          className={cn(
            "absolute top-1.5 right-2 size-1.5 rounded-full transition-colors duration-300",
            state === "running"
              ? "bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.6)]"
              : state === "hello"
                ? "bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.4)]"
                : "bg-green-600/60"
          )}
        />
        {/* Screen */}
        <div
          className="flex items-center justify-center overflow-hidden rounded-md bg-black"
          style={{ width: 72, height: 128 }}
        >
          <AnimatePresence mode="wait">
            {state === "off" && (
              <motion.div
                key="off"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="text-[8px] text-zinc-600">M5StickC</div>
              </motion.div>
            )}
            {state === "running" && (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-center"
              >
                <div className="text-[8px] font-mono text-green-400">Running...</div>
              </motion.div>
            )}
            {state === "hello" && (
              <motion.div
                key="hello"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <p className="text-sm font-bold text-white">Hello!</p>
                <p className="mt-1 text-[7px] text-white/60">TinkerSchool</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Buttons */}
        <div className="mt-1.5 flex gap-3">
          <div className="size-4 rounded-full bg-[#404048] shadow-inner" />
          <div className="size-4 rounded-full bg-[#404048] shadow-inner" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <motion.button
          className={cn(
            "relative flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-colors",
            state === "running"
              ? "bg-primary/60"
              : "bg-primary hover:bg-primary/90"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-2.5" aria-hidden="true">
            <path d="M3 2.5a.75.75 0 0 1 1.145-.638l9 5.5a.75.75 0 0 1 0 1.276l-9 5.5A.75.75 0 0 1 3 13.5v-11Z" />
          </svg>
          Run
          {/* Animated cursor clicking the run button */}
          {showRunClick && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, 0], y: [-10, 0, 0, 0], scale: [1, 1, 0.9, 1] }}
              transition={{ duration: 1.2, times: [0, 0.3, 0.5, 1] }}
              className="absolute -right-3 -top-3"
            >
              <MousePointer2 className="size-4 text-foreground drop-shadow" />
            </motion.div>
          )}
        </motion.button>
        <button
          className="flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground shadow-sm"
          tabIndex={-1}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-2.5" aria-hidden="true">
            <rect x="3" y="3" width="10" height="10" rx="1" />
          </svg>
          Stop
        </button>
      </div>
    </div>
  );
}

/** Chip chat message bubble */
function ChipMessage({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      key={message.text}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2"
    >
      <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
        <Image
          src="/images/chip.png"
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-full object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="rounded-xl rounded-tl-sm bg-primary/10 px-3 py-1.5 text-[10px] leading-relaxed text-foreground sm:text-xs">
        {message.text}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WorkshopDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const phase = PHASES[phaseIndex];

  // Auto-advance through phases when visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [phaseIndex, isVisible, phase.duration, prefersReducedMotion]);

  // Intersection observer to start animation only when visible
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // For reduced motion: show the final "Hello!" state
  if (prefersReducedMotion) {
    const staticPhase = PHASES[PHASES.length - 1];
    return (
      <div className="mx-auto w-full max-w-4xl">
        <BrowserChrome>
          <StaticDemoContent phase={staticPhase} />
        </BrowserChrome>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-4xl">
      <BrowserChrome>
        {/* Workshop header bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
          <h3 className="text-xs font-semibold text-foreground sm:text-sm">
            Hello World
          </h3>
          {/* Tabs */}
          <div className="ml-auto flex items-center rounded-lg bg-muted p-0.5">
            <button
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors sm:text-xs",
                phase.activeTab === "blocks"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Blocks className="size-3" />
              <span className="hidden sm:inline">Blocks</span>
            </button>
            <button
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors sm:text-xs",
                phase.activeTab === "python"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Eye className="size-3" />
              <span className="hidden sm:inline">Python</span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex" style={{ minHeight: 280 }}>
          {/* Left: Toolbox + Workspace/Python */}
          <div className="flex flex-1 min-w-0">
            {/* Toolbox (only visible in blocks mode) */}
            {phase.activeTab === "blocks" && (
              <Toolbox className="w-16 shrink-0 sm:w-24" />
            )}

            {/* Workspace or Python view */}
            <AnimatePresence mode="wait">
              {phase.activeTab === "blocks" ? (
                <motion.div
                  key="blocks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-1 min-w-0"
                >
                  <BlockWorkspace blocks={phase.blocks} showDots={true} />
                </motion.div>
              ) : (
                <motion.div
                  key="python"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-1 min-w-0"
                >
                  <PythonView lines={phase.pythonLines} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Simulator */}
          <div className="flex w-[120px] shrink-0 flex-col items-center justify-center border-l border-border bg-muted/20 p-2 sm:w-[140px]">
            <p className="mb-2 text-[10px] font-semibold text-muted-foreground">
              Simulator
            </p>
            <MiniSimulator
              state={phase.simulator}
              showRunClick={phase.showRunClick}
            />
          </div>
        </div>

        {/* Bottom: Chip Chat */}
        <div className="border-t border-border px-3 py-2 sm:px-4">
          <AnimatePresence mode="wait">
            <ChipMessage key={phase.chat.text} message={phase.chat} />
          </AnimatePresence>
        </div>

        {/* Phase progress dots */}
        <div className="flex items-center justify-center gap-1.5 border-t border-border/50 py-2">
          {PHASES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhaseIndex(i)}
              className={cn(
                "flex size-6 items-center justify-center rounded-full transition-all duration-300",
              )}
              aria-label={`Go to step ${i + 1}`}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-all duration-300",
                  i === phaseIndex
                    ? "scale-125 bg-primary"
                    : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
      </BrowserChrome>
    </div>
  );
}

/** Static version for reduced motion */
function StaticDemoContent({ phase }: { phase: DemoPhase }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
        <h3 className="text-xs font-semibold text-foreground sm:text-sm">
          Hello World
        </h3>
        <div className="ml-auto flex items-center rounded-lg bg-muted p-0.5">
          <div className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-[10px] font-medium text-foreground shadow-sm sm:text-xs">
            <Blocks className="size-3" />
            <span className="hidden sm:inline">Blocks</span>
          </div>
          <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground sm:text-xs">
            <Eye className="size-3" />
            <span className="hidden sm:inline">Python</span>
          </div>
        </div>
      </div>
      <div className="flex" style={{ minHeight: 280 }}>
        <div className="flex flex-1 min-w-0">
          <Toolbox className="w-16 shrink-0 sm:w-24" />
          <BlockWorkspace blocks={phase.blocks} showDots={true} />
        </div>
        <div className="flex w-[120px] shrink-0 flex-col items-center justify-center border-l border-border bg-muted/20 p-2 sm:w-[140px]">
          <p className="mb-2 text-[10px] font-semibold text-muted-foreground">
            Simulator
          </p>
          <MiniSimulator state={phase.simulator} showRunClick={false} />
        </div>
      </div>
      <div className="border-t border-border px-3 py-2 sm:px-4">
        <ChipMessage message={phase.chat} />
      </div>
    </>
  );
}
