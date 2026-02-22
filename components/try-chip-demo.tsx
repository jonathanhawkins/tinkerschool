"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, ArrowRight, Sparkles, Play, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Simulator, type SimulatorHandle } from "@/components/simulator";
import { SimulatorCodeRunner } from "@/lib/simulator/code-runner";
import { BuzzerAudio } from "@/lib/simulator/buzzer-audio";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Starter prompts -- the 3 demo paths
// ---------------------------------------------------------------------------

const STARTER_PROMPTS = [
  {
    label: "Show a greeting",
    message: "I want to make the screen show a fun greeting! Something like Hello World!",
    emoji: "\u2728",
  },
  {
    label: "Count to 10",
    message: "Can you help me make it count from 1 to 10 on the screen?",
    emoji: "\uD83D\uDD22",
  },
  {
    label: "Play a melody",
    message: "I want to play a song! Can you make it play a melody?",
    emoji: "\uD83C\uDFB5",
  },
];

// ---------------------------------------------------------------------------
// Code extraction helper
// ---------------------------------------------------------------------------

/** Extract Python code blocks from a markdown-formatted message. */
function extractCode(text: string): string | null {
  const match = text.match(/```python\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TryChipDemo() {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<SimulatorHandle>(null);
  const codeRunnerRef = useRef<SimulatorCodeRunner | null>(null);
  const buzzerRef = useRef<BuzzerAudio | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [toneActive, setToneActive] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Initialize buzzer on mount
  useEffect(() => {
    buzzerRef.current = new BuzzerAudio();
    return () => buzzerRef.current?.dispose();
  }, []);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/demo-chat" }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onError() {
      // surfaced via the error display
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll chat on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Extract code from latest assistant message
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;

    const text = lastAssistant.parts
      ?.filter((p: { type: string; text?: string }) => p.type === "text")
      .map((p: { type: string; text?: string }) => p.text ?? "")
      .join("") ?? "";

    const code = extractCode(text);
    if (code && code !== lastCode) {
      setLastCode(code);
    }
  }, [messages, lastCode]);

  // Show sign-up CTA after 4+ messages
  useEffect(() => {
    if (messages.length >= 4 && !showSignUp) {
      setShowSignUp(true);
    }
  }, [messages.length, showSignUp]);

  // -----------------------------------------------------------------------
  // Run code in simulator
  // -----------------------------------------------------------------------

  const runCode = useCallback(() => {
    if (!lastCode) return;

    const sim = simulatorRef.current?.getSimulator();
    if (!sim) return;

    // Create runner if needed
    if (!codeRunnerRef.current) {
      codeRunnerRef.current = new SimulatorCodeRunner(sim);
    }
    const runner = codeRunnerRef.current;

    // Wire up tone callback
    runner.onTone = (freq, dur) => {
      buzzerRef.current?.resume();
      buzzerRef.current?.playTone(freq, dur);
      setToneActive(true);
      setTimeout(() => setToneActive(false), dur);
    };

    setIsCodeRunning(true);
    runner
      .run(lastCode)
      .catch(() => {
        // Execution stopped or errored
      })
      .finally(() => {
        setIsCodeRunning(false);
      });
  }, [lastCode]);

  const stopCode = useCallback(() => {
    codeRunnerRef.current?.stop();
    setIsCodeRunning(false);
  }, []);

  // -----------------------------------------------------------------------
  // Chat handlers
  // -----------------------------------------------------------------------

  function handleStarterClick(prompt: string) {
    setHasStarted(true);
    sendMessage({ text: prompt });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("message") as string).trim();
    if (!text || isLoading) return;

    setHasStarted(true);
    sendMessage({ text });
    form.reset();
  }

  function getMessageText(
    parts: Array<{ type: string; text?: string }>,
  ): string {
    return parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }

  /** Strip code blocks from display text for cleaner chat bubbles. */
  function stripCodeBlocks(text: string): string {
    return text.replace(/```python\n[\s\S]*?```/g, "").trim();
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Chat with Chip
            </h3>
            <p className="text-xs text-muted-foreground">
              Your AI learning buddy — no sign-up needed
            </p>
          </div>
          {lastCode && (
            <div className="flex gap-2">
              {isCodeRunning ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5"
                  onClick={stopCode}
                >
                  <Square className="size-3.5" />
                  Stop
                </Button>
              ) : (
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  <Button
                    size="sm"
                    className="rounded-xl gap-1.5"
                    onClick={runCode}
                  >
                    <Play className="size-3.5" />
                    Run Code
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Main area */}
        <div className="flex flex-col md:flex-row md:min-h-[420px]">
          {/* Chat panel */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Messages */}
            <div className="relative min-h-[280px] flex-1 md:min-h-0">
              <div
                className="absolute inset-0 overflow-y-auto p-4"
                ref={scrollRef}
              >
                <div className="flex flex-col gap-3">
                  {/* Welcome state */}
                  {!hasStarted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Chip greeting */}
                      <DemoBubble isChip>
                        Hi there! I'm Chip, your AI learning buddy!
                        Pick something fun to build together — it'll
                        run on a tiny computer simulator right here!
                      </DemoBubble>

                      {/* Starter buttons */}
                      <div className="flex flex-wrap gap-2 pl-10">
                        {STARTER_PROMPTS.map((prompt) => (
                          <motion.button
                            key={prompt.label}
                            whileHover={
                              prefersReducedMotion ? {} : { scale: 1.03, y: -2 }
                            }
                            whileTap={
                              prefersReducedMotion ? {} : { scale: 0.97 }
                            }
                            onClick={() => handleStarterClick(prompt.message)}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border border-primary/30",
                              "bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground",
                              "transition-colors hover:bg-primary/10 hover:border-primary/50",
                            )}
                          >
                            <span>{prompt.emoji}</span>
                            {prompt.label}
                          </motion.button>
                        ))}
                      </div>

                      {/* COPPA privacy notice for demo */}
                      <p className="pl-10 text-[11px] leading-relaxed text-muted-foreground/70">
                        This demo is anonymous. Messages are sent to an AI service
                        for responses and are not saved. Please don&apos;t share
                        personal information like your name or school.
                      </p>
                    </motion.div>
                  )}

                  {/* Conversation */}
                  {messages.map((msg) => {
                    const text = getMessageText(
                      msg.parts as Array<{ type: string; text?: string }>,
                    );
                    if (!text) return null;

                    const isChip = msg.role === "assistant";
                    const displayText = isChip ? stripCodeBlocks(text) : text;
                    if (!displayText) return null;

                    return (
                      <DemoBubble key={msg.id} isChip={isChip}>
                        {displayText}
                      </DemoBubble>
                    );
                  })}

                  {/* Typing indicator */}
                  {status === "submitted" && (
                    <div className="flex items-center gap-2 pl-10">
                      <span className="flex gap-1">
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                      </span>
                    </div>
                  )}

                  {/* Code detected indicator */}
                  {lastCode && status !== "streaming" && status !== "submitted" && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 pl-10"
                      >
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="size-3.5" />
                          Code ready — click Run to see it work!
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Sign up CTA */}
                  {showSignUp && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mx-auto mt-2 flex flex-col items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-center"
                    >
                      <p className="text-sm font-medium text-foreground">
                        Love tinkering with Chip?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sign up free to unlock all 7 subjects, save your
                        projects, and connect a real device!
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full px-6 mt-1"
                      >
                        <Link href="/sign-up">
                          Get Started Free
                          <ArrowRight className="ml-1.5 size-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 py-2.5">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <Input
                  name="message"
                  placeholder={
                    hasStarted
                      ? "Ask Chip anything..."
                      : "Or type your own question..."
                  }
                  autoComplete="off"
                  disabled={isLoading}
                  className="flex-1 rounded-full border-primary/30 bg-accent/50 text-base placeholder:text-muted-foreground/60"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading}
                  className="shrink-0 rounded-full"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Simulator panel */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border bg-muted/20 px-4 py-4 md:w-[200px] md:py-6">
            <p className="mb-2 text-xs font-semibold text-muted-foreground md:mb-3">
              Live Simulator
            </p>
            <div className="scale-[0.85] md:scale-100 origin-top">
              <Simulator
                ref={simulatorRef}
                scale={1.2}
                toneActive={toneActive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat bubble sub-component
// ---------------------------------------------------------------------------

function DemoBubble({
  isChip,
  children,
}: {
  isChip: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isChip ? "flex-row" : "flex-row-reverse",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          isChip ? "bg-primary/10" : "bg-secondary/20",
        )}
      >
        {isChip ? (
          <Image
            src="/images/chip.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
            aria-hidden
          />
        ) : (
          <Bot className="size-4 text-secondary" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isChip
            ? "rounded-tl-sm bg-primary/10 text-foreground"
            : "rounded-tr-sm bg-secondary/20 text-foreground",
        )}
      >
        {isChip && (
          <span className="mb-0.5 block text-xs font-semibold text-primary">
            Chip
          </span>
        )}
        <span className="whitespace-pre-wrap">{children}</span>
      </div>
    </div>
  );
}
