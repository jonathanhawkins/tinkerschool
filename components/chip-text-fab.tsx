"use client";

/**
 * ChipTextFab -- Always-visible floating action button for text chat with Chip.
 *
 * This component provides a text-based chat with Chip that works on EVERY
 * dashboard page, regardless of whether the Hume voice API is configured.
 * It renders as a floating button in the bottom-right corner that opens
 * a slide-up chat panel.
 *
 * Key design decisions:
 * - Works without any third-party API keys (just needs /api/ai-buddy)
 * - 56px touch target for kids (exceeds 44px minimum)
 * - Proactive nudge system: Chip can pop up with encouraging messages
 * - Coexists with the voice FAB: if voice FAB is present, this hides itself
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Send, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChipTextFabProps {
  kidName: string;
  age: number;
  band: number;
}

// ---------------------------------------------------------------------------
// Nudge system: allows external code to trigger a proactive Chip message
// ---------------------------------------------------------------------------

type NudgeCallback = (message: string) => void;

let _nudgeCallback: NudgeCallback | null = null;
let _pendingNudge: string | null = null;

/**
 * Trigger a proactive nudge from Chip. Call this from anywhere (e.g.,
 * after a lesson completion) to make Chip pop up with an encouraging message.
 *
 * If the FAB hasn't mounted yet, the nudge is queued and delivered once it
 * registers. The queue holds at most one message (latest wins).
 *
 * The nudge will auto-dismiss after 6 seconds if the user doesn't interact.
 */
export function triggerChipNudge(message: string): void {
  if (_nudgeCallback) {
    _nudgeCallback(message);
  } else {
    // FAB not mounted yet — queue the nudge for when it registers
    _pendingNudge = message;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChipTextFab({ kidName, age, band }: ChipTextFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if the Hume voice FAB is present -- if so, hide this one.
  // Uses a MutationObserver to detect when the voice root gains children,
  // since Hume mounts asynchronously and the timing is unpredictable.
  const [humePresent, setHumePresent] = useState(false);
  useEffect(() => {
    const check = () => {
      const voiceRoot = document.getElementById("chip-voice-root");
      // The voice root exists but is empty (0x0 container) when Hume fails.
      // Only consider it "present" if it has actual child content rendered.
      const present = voiceRoot !== null && voiceRoot.children.length > 0;
      setHumePresent(present);
      return { voiceRoot, present };
    };

    const { voiceRoot, present } = check();

    // If already present, no need to observe
    if (present) return;

    // Observe the voice root (or document body if root doesn't exist yet)
    // for child additions that indicate Hume has loaded
    const target = voiceRoot ?? document.body;
    const observer = new MutationObserver(() => {
      const { present: nowPresent } = check();
      if (nowPresent) observer.disconnect();
    });

    observer.observe(target, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Register nudge callback and flush any queued nudge
  useEffect(() => {
    const deliver = (message: string) => {
      setNudgeMessage(message);

      // Clear any existing timer
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }

      // Auto-dismiss after 6 seconds
      nudgeTimerRef.current = setTimeout(() => {
        setNudgeMessage(null);
        nudgeTimerRef.current = null;
      }, 6000);
    };

    _nudgeCallback = deliver;

    // Flush any nudge that arrived before we mounted
    if (_pendingNudge) {
      const queued = _pendingNudge;
      _pendingNudge = null;
      deliver(queued);
    }

    return () => {
      // Only clear if we're still the active callback (avoids strict-mode
      // cleanup racing with new mount's effect)
      if (_nudgeCallback === deliver) {
        _nudgeCallback = null;
      }
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
    };
  }, []);

  // Chat transport
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-buddy",
        body: {
          kidName,
          age,
          band,
        },
      }),
    [kidName, age, band],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError() {
      // Error is surfaced via the `error` field
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation start
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Extract text content from message parts
  function getMessageText(
    parts: Array<{ type: string; text?: string }>,
  ): string {
    return parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }

  // Handle form submission
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("message") as string).trim();
    if (!text || isLoading) return;

    sendMessage({ text });
    form.reset();
  }

  // Handle nudge tap -- opens the chat
  const handleNudgeTap = useCallback(() => {
    setNudgeMessage(null);
    if (nudgeTimerRef.current) {
      clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }
    setIsOpen(true);
  }, []);

  // Toggle panel
  const togglePanel = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        // Opening — clear any active nudge
        setNudgeMessage(null);
        if (nudgeTimerRef.current) {
          clearTimeout(nudgeTimerRef.current);
          nudgeTimerRef.current = null;
        }
      }
      return !prev;
    });
  }, []);

  // If the Hume voice FAB is active, don't render this one
  if (humePresent) return null;

  const greeting = `Hey ${kidName}! I'm Chip, your learning buddy! What would you like to explore today?`;

  return (
    <>
      {/* Nudge speech bubble */}
      <AnimatePresence>
        {nudgeMessage && !isOpen && (
          <motion.button
            key="nudge"
            onClick={handleNudgeTap}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 10, scale: 0.9 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 10, scale: 0.9 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "fixed right-[5.5rem] z-50 max-w-56 cursor-pointer rounded-2xl rounded-br-md border border-primary/30 bg-primary/10 px-3.5 py-2.5 shadow-md text-left",
              "bottom-[1.5rem] lg:bottom-[1.5rem] max-lg:bottom-[calc(56px+1rem)]",
            )}
            aria-label="Chat with Chip"
          >
            <p className="text-sm font-medium leading-snug text-foreground">
              {nudgeMessage}
            </p>
            <p className="mt-1 text-xs text-primary">
              Tap to chat!
            </p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed right-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:right-6 sm:w-96",
              "bottom-24 lg:bottom-24 max-lg:bottom-[calc(56px+5.5rem)]",
            )}
          >
            <Card className="flex max-h-[min(55vh,420px)] flex-col gap-0 overflow-hidden rounded-2xl border-primary/20 py-0 shadow-xl">
              {/* Header */}
              <div className="shrink-0 border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/30">
                    <Image
                      src="/images/chip.png"
                      alt="Chip"
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold leading-tight text-foreground">
                      Chip
                    </span>
                    <span className="text-xs leading-tight text-muted-foreground">
                      Your learning buddy
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePanel}
                    className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                    aria-label="Close Chip chat"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
                <div className="flex flex-col gap-2 p-3">
                  {/* Initial greeting */}
                  {messages.length === 0 && (
                    <ChatBubble
                      role="assistant"
                      text={greeting}
                      kidName={kidName}
                    />
                  )}

                  {/* Conversation */}
                  {messages.map((msg) => {
                    const text = getMessageText(
                      msg.parts as Array<{ type: string; text?: string }>,
                    );
                    if (!text) return null;

                    return (
                      <ChatBubble
                        key={msg.id}
                        role={msg.role}
                        text={text}
                        kidName={kidName}
                      />
                    );
                  })}

                  {/* Typing indicator */}
                  {status === "submitted" && (
                    <div className="flex items-center gap-2 pl-10">
                      <span className="flex gap-1 motion-reduce:animate-none">
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 motion-reduce:animate-pulse [animation-delay:0ms]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 motion-reduce:animate-pulse [animation-delay:150ms]" />
                        <span className="size-2 animate-bounce rounded-full bg-primary/60 motion-reduce:animate-pulse [animation-delay:300ms]" />
                      </span>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mx-auto max-w-xs rounded-xl bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
                      Oops! Chip got a little confused. Try again!
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-border/50 px-3 py-2">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    name="message"
                    type="text"
                    placeholder="Ask Chip anything..."
                    autoComplete="off"
                    disabled={isLoading}
                    className="h-10 flex-1 rounded-full border border-primary/30 bg-accent/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading}
                    className="size-10 shrink-0 rounded-full"
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={togglePanel}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        className={cn(
          "fixed right-4 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-colors sm:right-6",
          "focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
          "bottom-4 lg:bottom-6 max-lg:bottom-[calc(56px+0.75rem)]",
          isOpen
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
        )}
        aria-label={isOpen ? "Close Chip chat" : "Chat with Chip"}
      >
        {/* Notification dot when there's a nudge */}
        {nudgeMessage && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full border-2 border-background bg-emerald-500 animate-pulse motion-reduce:animate-none" />
        )}

        {isOpen ? (
          <X className="size-6" />
        ) : (
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        )}
      </motion.button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Chat bubble sub-component
// ---------------------------------------------------------------------------

interface ChatBubbleProps {
  role: string;
  text: string;
  kidName: string;
}

function ChatBubble({ role, text, kidName }: ChatBubbleProps) {
  const isChip = role === "assistant";

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
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isChip
            ? "bg-primary/10"
            : "bg-secondary/20 text-secondary",
        )}
      >
        {isChip ? (
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={28}
            height={28}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <span>{kidName.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
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
        <span className="whitespace-pre-wrap">{text}</span>
      </div>
    </div>
  );
}
