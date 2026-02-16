"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useVoice, VoiceProvider, VoiceReadyState } from "@humeai/voice-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, MessageSquare, Mic, MicOff, PhoneOff, Send, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChipChatStore } from "@/lib/stores/chip-chat-store";
import {
  checkVoiceBudget,
  logVoiceSession,
  refreshHumeAccessToken,
  type VoiceBudgetResult,
} from "@/lib/hume/actions";
import { createChipToolCallHandler } from "@/lib/hume/tools";
import type {
  ChipVoiceProps,
  ChipVoiceStatus,
  VoiceAction,
  VoiceLessonContext,
  VoicePageContext,
} from "@/lib/hume/types";
import { voiceBridge } from "@/lib/hume/voice-bridge";
import { buildVoiceSystemPrompt } from "@/lib/hume/voice-prompt";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Hook: subscribe to voiceBridge pathname (replaces usePathname from Next.js)
//
// This component renders in an independent React root that is NOT inside
// Next.js's Router context. We use useSyncExternalStore to subscribe to
// pathname changes relayed through voiceBridge.
//
// All three functions are stable module-level references so React never
// re-subscribes unnecessarily.
// ---------------------------------------------------------------------------

function subscribeToBridgePathname(onStoreChange: () => void): () => void {
  return voiceBridge.subscribe(onStoreChange);
}
function getBridgePathname(): string {
  return voiceBridge.pathname;
}
function getServerPathname(): string {
  return "/";
}

function useVoiceBridgePathname(): string {
  return useSyncExternalStore(
    subscribeToBridgePathname,
    getBridgePathname,
    getServerPathname,
  );
}

// ---------------------------------------------------------------------------
// Hook: subscribe to voiceBridge lesson context
// ---------------------------------------------------------------------------

function subscribeToBridgeLessonContext(onStoreChange: () => void): () => void {
  return voiceBridge.subscribeLessonContext(onStoreChange);
}
function getBridgeLessonContext(): VoiceLessonContext | null {
  return voiceBridge.lessonContext;
}
function getServerLessonContext(): VoiceLessonContext | null {
  return null;
}

function useVoiceBridgeLessonContext(): VoiceLessonContext | null {
  return useSyncExternalStore(
    subscribeToBridgeLessonContext,
    getBridgeLessonContext,
    getServerLessonContext,
  );
}

// ---------------------------------------------------------------------------
// Kid-friendly emotion labels (subset of Hume's 48 emotions)
// ---------------------------------------------------------------------------

const KID_EMOTIONS: Record<string, string> = {
  joy: "Happy",
  excitement: "Excited",
  interest: "Curious",
  confusion: "Confused",
  determination: "Focused",
  amusement: "Having fun",
  calmness: "Calm",
  concentration: "Concentrating",
  contentment: "Content",
  pride: "Proud",
  sadness: "Sad",
  anxiety: "Nervous",
  boredom: "Bored",
  surprise: "Surprised",
  surprisePositive: "Surprised",
  surpriseNegative: "Surprised",
  tiredness: "Tired",
  disappointment: "Disappointed",
};

// ---------------------------------------------------------------------------
// Audio visualizer bars
// ---------------------------------------------------------------------------

interface AudioBarsProps {
  data: number[];
  color: string;
}

function AudioBars({ data, color }: AudioBarsProps) {
  const barCount = 16;
  const bars: number[] = [];

  if (data.length === 0) {
    for (let i = 0; i < barCount; i++) bars.push(2);
  } else {
    const step = Math.max(1, Math.floor(data.length / barCount));
    for (let i = 0; i < barCount; i++) {
      const idx = Math.min(i * step, data.length - 1);
      const val = Math.max(2, Math.min(28, (data[idx] ?? 0) * 28));
      bars.push(val);
    }
  }

  return (
    <>
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn("w-1.5 rounded-full transition-all duration-75", color)}
          style={{ height: `${height}px` }}
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Text fallback chat (used when voice budget is exhausted)
// ---------------------------------------------------------------------------

interface TextFallbackChatProps {
  pageContext?: VoicePageContext;
  lessonContext: VoiceLessonContext | null;
  pathname: string;
}

function TextFallbackChat({ pageContext, lessonContext, pathname }: TextFallbackChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine current subject from pathname or lesson context
  const currentSubject = lessonContext?.subjectSlug ?? undefined;
  const currentLesson = lessonContext?.title ?? undefined;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-buddy",
        body: {
          kidName: pageContext?.childName ?? "",
          age: pageContext?.age ?? 7,
          band: 2,
          currentSubject,
          currentLesson,
        },
      }),
    [pageContext?.childName, pageContext?.age, currentSubject, currentLesson],
  );

  const {
    messages: chatMessages,
    sendMessage,
    status: chatStatus,
  } = useChat({
    transport,
    onError() {
      // Error surfaced via the `error` field
    },
  });

  const isSending = chatStatus === "submitted" || chatStatus === "streaming";

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatStatus]);

  function getMessageText(
    parts: Array<{ type: string; text?: string }>,
  ): string {
    return parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("message") as string).trim();
    if (!text || isSending) return;

    sendMessage({ text });
    form.reset();
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-2.5">
        {/* Welcome message */}
        {chatMessages.length === 0 && (
          <div className="max-w-[90%] rounded-xl rounded-tl-sm bg-primary/10 px-2.5 py-2 text-[13px] leading-snug text-foreground">
            <span className="mb-0.5 block text-[11px] font-semibold opacity-60">
              Chip
            </span>
            {`Hey${pageContext?.childName ? ` ${pageContext.childName}` : ""}! My voice is resting, but you can still type to chat with me!`}
          </div>
        )}

        {chatMessages.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {chatMessages.map((msg) => {
              const isChip = msg.role === "assistant";
              const text = getMessageText(msg.parts);
              if (!text) return null;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[88%] rounded-xl px-2.5 py-1.5 text-[13px] leading-snug",
                    isChip
                      ? "self-start rounded-tl-sm bg-primary/10 text-foreground"
                      : "self-end rounded-tr-sm bg-secondary/20 text-foreground",
                  )}
                >
                  <span className="mb-0.5 block text-[10px] font-semibold opacity-50">
                    {isChip ? "Chip" : "You"}
                  </span>
                  {text}
                </div>
              );
            })}
            <div ref={scrollRef} className="h-px" />
          </div>
        )}
      </div>

      {/* Text input */}
      <div className="shrink-0 border-t border-border/50 px-3.5 py-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            name="message"
            type="text"
            placeholder="Type a message to Chip..."
            autoComplete="off"
            className="h-9 flex-1 rounded-xl border border-border bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSending}
            className="size-9 shrink-0 rounded-xl"
            aria-label="Send message"
          >
            <Send className="size-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAB inner UI (must be inside VoiceProvider)
// ---------------------------------------------------------------------------

interface FabUIProps {
  accessToken: string;
  configId?: string;
  pageContext?: VoicePageContext;
  providerError?: string | null;
  onClearProviderError?: () => void;
  /** Route prefixes where the FAB should be hidden (VoiceProvider stays mounted). */
  hideOnRoutes?: string[];
}

function FabUI({ accessToken, configId, pageContext, providerError, onClearProviderError, hideOnRoutes }: FabUIProps) {
  const {
    connect,
    disconnect,
    readyState,
    messages,
    isMuted,
    mute,
    unmute,
    micFft,
    fft,
    isPlaying,
    isError,
    isMicrophoneError,
    sendSessionSettings,
    chatMetadata,
  } = useVoice();

  // Use voiceBridge instead of usePathname (we are outside Next.js Router)
  const pathname = useVoiceBridgePathname();
  const lessonContext = useVoiceBridgeLessonContext();

  // Hide FAB on public routes but keep VoiceProvider mounted so the
  // WebSocket connection survives navigation to/from these routes.
  const isHiddenRoute =
    pathname === "/" ||
    (hideOnRoutes?.some((route) => pathname.startsWith(route)) ?? false);

  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ── Voice budget & session timer ──
  const [voiceBudget, setVoiceBudget] = useState<VoiceBudgetResult | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);
  const hasWarned2MinRef = useRef(false);

  // Refs for values used inside setInterval to avoid stale closures
  const voiceBudgetRef = useRef<VoiceBudgetResult | null>(null);
  const disconnectRef = useRef(disconnect);
  useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);
  useEffect(() => { voiceBudgetRef.current = voiceBudget; }, [voiceBudget]);

  // Persist the chat group ID across reconnects so Chip remembers the
  // conversation when the user disconnects and reconnects (or if the
  // WebSocket drops briefly). Hume's `resumedChatGroupId` parameter
  // tells EVI to continue from the previous chat group's context.
  const chatGroupIdRef = useRef<string | null>(null);

  // Capture the chat group ID whenever chat metadata arrives
  useEffect(() => {
    if (chatMetadata?.chatGroupId) {
      chatGroupIdRef.current = chatMetadata.chatGroupId;
    }
  }, [chatMetadata]);

  // Is this a brand-new user who hasn't started any lessons?
  const isNewUser = pageContext
    ? pageContext.completedLessonCount === 0 && !pageContext.inProgressLesson
    : false;

  // Auto-open panel for new users on first mount — but only if the user
  // hasn't previously dismissed the chat (persisted in Zustand/localStorage).
  const hasDismissedChat = useChipChatStore((s) => s.hasDismissedChat);
  const dismissChat = useChipChatStore((s) => s.dismissChat);
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (!isNewUser || hasAutoOpened.current || hasDismissedChat) return;
    hasAutoOpened.current = true;

    // Short delay so the page renders first, then Chip pops up
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [isNewUser, hasDismissedChat]);

  // Derive status
  const status: ChipVoiceStatus = useMemo(() => {
    if (readyState === VoiceReadyState.OPEN) return "connected";
    if (readyState === VoiceReadyState.CONNECTING || isAttemptingConnect)
      return "connecting";
    return "idle";
  }, [readyState, isAttemptingConnect]);

  // Reset local connecting state when SDK catches up
  useEffect(() => {
    if (
      readyState === VoiceReadyState.OPEN ||
      readyState === VoiceReadyState.CLOSED ||
      isError
    ) {
      setIsAttemptingConnect(false);
    }
    // Clear stale connect errors once the socket opens successfully
    if (readyState === VoiceReadyState.OPEN) {
      setConnectError(null);
    }
  }, [readyState, isError]);

  // Auto-scroll transcript via anchor element at the bottom
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (readyState === VoiceReadyState.OPEN) {
          disconnect();
        }
        dismissChat();
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, readyState, disconnect, dismissChat]);

  // ── Session timer: count seconds while connected ──
  useEffect(() => {
    if (status === "connected" && !sessionTimerRef.current) {
      sessionStartRef.current = Date.now();
      setSessionSeconds(0);
      setBudgetWarning(null);
      hasWarned2MinRef.current = false;

      sessionTimerRef.current = setInterval(() => {
        if (!sessionStartRef.current) return;
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        setSessionSeconds(elapsed);

        // Check remaining budget (read from ref to avoid stale closure)
        const budget = voiceBudgetRef.current;
        if (budget) {
          const remaining = budget.remainingSeconds - elapsed;
          if (remaining <= 0) {
            // Auto-disconnect — out of time
            setBudgetWarning(
              "Chip needs to rest! You\u2019ve used all your voice time for today."
            );
            disconnectRef.current();
          } else if (remaining <= 120 && !hasWarned2MinRef.current) {
            // Warn once when 2 minutes or fewer remain
            hasWarned2MinRef.current = true;
            setBudgetWarning("Chip needs to rest soon \u2014 2 minutes left!");
          }
        }
      }, 1000);
    }

    if (status !== "connected" && sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;

      // Log the session duration (always prefer wall-clock over state)
      const duration = sessionStartRef.current
        ? Math.floor((Date.now() - sessionStartRef.current) / 1000)
        : 0;
      if (duration > 0) {
        logVoiceSession(chatGroupIdRef.current, duration).catch(() => {
          // Fire and forget — don't block the UI
        });
      }
      sessionStartRef.current = null;
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Format seconds as "M:SS"
  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Remaining time display
  const remainingDisplay = useMemo(() => {
    if (!voiceBudget || status !== "connected") return null;
    const remaining = Math.max(0, voiceBudget.remainingSeconds - sessionSeconds);
    return formatTime(remaining);
  }, [voiceBudget, sessionSeconds, status, formatTime]);

  // Build system prompt from page context + current pathname + lesson context
  const systemPrompt = useMemo(() => {
    if (!pageContext) return undefined;
    return buildVoiceSystemPrompt(pageContext, pathname, lessonContext);
  }, [pageContext, pathname, lessonContext]);

  // Update Chip's context mid-session when pathname or lesson context changes
  const prevPathnameRef = useRef(pathname);
  const prevLessonIdRef = useRef(lessonContext?.lessonId ?? null);
  useEffect(() => {
    const lessonId = lessonContext?.lessonId ?? null;
    const pathnameChanged = prevPathnameRef.current !== pathname;
    const lessonChanged = prevLessonIdRef.current !== lessonId;

    if (!pathnameChanged && !lessonChanged) return;
    prevPathnameRef.current = pathname;
    prevLessonIdRef.current = lessonId;

    if (status !== "connected" || !systemPrompt) return;

    sendSessionSettings({ systemPrompt });
  }, [pathname, lessonContext, status, systemPrompt, sendSessionSettings]);

  // Connect handler -- checks voice budget, fetches a fresh token, then connects.
  // If we have a previous `chatGroupId`, pass it as `resumedChatGroupId` so Hume
  // continues from the prior conversation context instead of starting fresh.
  const tokenRef = useRef(accessToken);
  const handleConnect = useCallback(async () => {
    setConnectError(null);
    setBudgetWarning(null);
    onClearProviderError?.();
    setIsAttemptingConnect(true);
    try {
      // Check voice budget before connecting
      const budget = await checkVoiceBudget();
      setVoiceBudget(budget);

      if (!budget.allowed) {
        setBudgetWarning(
          budget.reason ?? "Chip needs to rest! Try again later."
        );
        setIsAttemptingConnect(false);
        return;
      }

      // Fetch a fresh token to avoid expired-token failures on long sessions
      const freshToken = await refreshHumeAccessToken();
      if (freshToken) {
        tokenRef.current = freshToken;
      }

      await connect({
        auth: { type: "accessToken" as const, value: tokenRef.current },
        configId,
        resumedChatGroupId: chatGroupIdRef.current ?? undefined,
        sessionSettings: systemPrompt
          ? { type: "session_settings" as const, systemPrompt }
          : undefined,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ChipVoice] Connect failed:", msg);
      setConnectError(msg);
    } finally {
      setIsAttemptingConnect(false);
    }
  }, [connect, accessToken, configId, systemPrompt, onClearProviderError]);

  // Toggle mic mute
  const handleToggleMic = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);

  // Get top emotion from last user message
  const topEmotion = useMemo(() => {
    const userMessages = messages.filter((m) => m.type === "user_message");
    const last = userMessages[userMessages.length - 1];
    if (!last || last.type !== "user_message") return null;

    const scores = last.models?.prosody?.scores;
    if (!scores) return null;

    let best = "";
    let bestScore = 0;
    for (const [emotion, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        best = emotion;
      }
    }

    if (bestScore < 0.3) return null;
    return KID_EMOTIONS[best] ?? null;
  }, [messages]);

  // Text fallback: active when voice budget is exhausted and not connected
  const textFallbackActive =
    voiceBudget != null && !voiceBudget.allowed && status === "idle";

  // Status text
  const statusText = useMemo(() => {
    if (textFallbackActive) return "Type to chat with Chip!";
    if (status === "connecting") {
      return readyState === VoiceReadyState.IDLE
        ? "Allow your microphone to talk to Chip!"
        : "Chip is waking up...";
    }
    if (status === "idle") return "Tap to start talking to Chip!";
    if (isPlaying) return "Chip is talking...";
    if (isMuted) return "Mic is off";
    return "Chip is listening...";
  }, [status, readyState, isPlaying, isMuted, textFallbackActive]);

  // Filter chat messages for transcript
  const chatMessages = useMemo(
    () =>
      messages.filter(
        (m) => m.type === "user_message" || m.type === "assistant_message",
      ),
    [messages],
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        // Closing — disconnect voice and remember the dismissal
        if (readyState === VoiceReadyState.OPEN) {
          disconnect();
        }
        dismissChat();
      }
      return !prev;
    });
  }, [readyState, disconnect, dismissChat]);

  // Return null for hidden routes -- VoiceProvider (parent) stays alive.
  // Placed after all hooks to satisfy React's Rules of Hooks.
  if (isHiddenRoute) return null;

  return (
    <>
      {/* Expanded panel */}
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
            className="fixed right-6 bottom-24 z-50 w-80 max-w-[calc(100vw-3rem)] sm:w-96 lg:bottom-24 max-lg:bottom-[calc(56px+5.5rem)]"
          >
            <Card className="flex max-h-[min(50vh,360px)] flex-col gap-0 overflow-hidden rounded-2xl border-primary/20 py-0 shadow-lg">
              {/* ── Header (pinned top) ── */}
              <div className="shrink-0 border-b border-border/50 px-3.5 pt-3.5 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center overflow-hidden rounded-full",
                        status === "connected" &&
                          "ring-2 ring-primary/50 ring-offset-1",
                      )}
                    >
                      <img
                        src="/images/chip.png"
                        alt="Chip"
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    </div>
                    {status === "connected" && (
                      <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-[1.5px] border-background bg-emerald-500" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold leading-tight text-foreground">
                      Chip
                    </span>
                    <span className="text-[11px] leading-tight text-muted-foreground">
                      {statusText}
                    </span>
                  </div>

                  {/* Remaining time badge (when connected) */}
                  {remainingDisplay && status === "connected" && (
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                      <Clock className="size-3" />
                      {remainingDisplay}
                    </span>
                  )}

                  {topEmotion && status === "connected" && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {topEmotion}
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleOpen}
                    className="size-6 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                    aria-label="Close Chip voice panel"
                  >
                    <X className="size-3" />
                  </Button>
                </div>

                {/* Audio visualizer */}
                {status === "connected" && (
                  <div
                    className="mt-2 flex h-6 items-end justify-center gap-[2px]"
                    aria-hidden="true"
                  >
                    <AudioBars
                      data={isPlaying ? fft : micFft}
                      color={isPlaying ? "bg-primary" : "bg-primary/60"}
                    />
                  </div>
                )}
              </div>

              {/* ── Text fallback chat (when voice budget exhausted) ── */}
              {textFallbackActive ? (
                <>
                  {/* Budget notice banner */}
                  <div className="shrink-0 px-3.5 pt-2">
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <MessageSquare className="size-3.5 shrink-0" />
                      <span>
                        Voice is resting — type to chat!
                        {voiceBudget?.tier === "free" && (
                          <>
                            {" "}
                            <a
                              href="/dashboard/billing"
                              className="font-medium underline underline-offset-2"
                            >
                              Get more voice time
                            </a>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <TextFallbackChat
                    pageContext={pageContext}
                    lessonContext={lessonContext}
                    pathname={pathname}
                  />
                </>
              ) : (
                <>
                  {/* ── Body (scrollable transcript) ── */}
                  <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-2.5">
                    {/* Welcome bubble (visible until voice messages arrive) */}
                    {status !== "connected" && chatMessages.length === 0 && (
                      <div className="max-w-[90%] rounded-xl rounded-tl-sm bg-primary/10 px-2.5 py-2 text-[13px] leading-snug text-foreground">
                        <span className="mb-0.5 block text-[11px] font-semibold opacity-60">
                          Chip
                        </span>
                        {isNewUser
                          ? `Hey${pageContext?.childName ? ` ${pageContext.childName}` : ""}! I'm Chip, your learning buddy! Tap the mic and let's get started!`
                          : `Hey${pageContext?.childName ? ` ${pageContext.childName}` : ""}! Tap the mic to talk to me!`}
                      </div>
                    )}

                    {/* Transcript messages */}
                    {chatMessages.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {chatMessages.map((msg, i) => {
                          const isChip = msg.type === "assistant_message";
                          const content = msg.message?.content ?? "";
                          if (!content) return null;

                          return (
                            <div
                              key={i}
                              className={cn(
                                "max-w-[88%] rounded-xl px-2.5 py-1.5 text-[13px] leading-snug",
                                isChip
                                  ? "self-start rounded-tl-sm bg-primary/10 text-foreground"
                                  : "self-end rounded-tr-sm bg-secondary/20 text-foreground",
                              )}
                            >
                              <span className="mb-0.5 block text-[10px] font-semibold opacity-50">
                                {isChip ? "Chip" : "You"}
                              </span>
                              {content}
                            </div>
                          );
                        })}
                        <div ref={scrollAnchorRef} className="h-px" />
                      </div>
                    )}

                    {/* Budget warning */}
                    {budgetWarning && (
                      <div className="mt-1 rounded-xl bg-amber-50 px-3 py-2.5 text-center text-[13px] text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                        <p>{budgetWarning}</p>
                        {voiceBudget && !voiceBudget.allowed && voiceBudget.tier === "free" && (
                          <p className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-500/80">
                            Supporters get 30 min/day!{" "}
                            <a
                              href="/dashboard/billing"
                              className="font-medium underline underline-offset-2"
                            >
                              Learn more
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Error state */}
                    {(isError || connectError || providerError) && (
                      <div className="mt-1 rounded-xl bg-destructive/10 px-3 py-2.5 text-center text-[13px] text-destructive">
                        {isMicrophoneError ? (
                          "Chip needs your microphone! Please allow mic access and try again."
                        ) : (
                          <>
                            <p>
                              Oops! Chip can&apos;t talk right now. Please try
                              again later!
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              If this keeps happening, let us know at{" "}
                              <a
                                href="mailto:hello@tinkerschool.ai"
                                className="font-medium text-primary underline underline-offset-2"
                              >
                                hello@tinkerschool.ai
                              </a>
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Footer controls (pinned bottom) ── */}
                  <div className="shrink-0 border-t border-border/50 px-3.5 py-2.5">
                    <div className="flex items-center justify-center gap-2.5">
                      {status === "idle" ? (
                        <Button
                          className="size-10 rounded-full"
                          onClick={handleConnect}
                          aria-label="Start voice chat with Chip"
                        >
                          <Mic className="size-4.5" />
                        </Button>
                      ) : status === "connecting" ? (
                        <Button
                          className="size-10 rounded-full bg-primary/80"
                          onClick={() => {
                            disconnect();
                            setIsAttemptingConnect(false);
                          }}
                          aria-label="Cancel connecting"
                        >
                          <Mic className="size-4.5 animate-pulse motion-reduce:animate-none" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant={isMuted ? "outline" : "default"}
                            className="size-10 rounded-full"
                            onClick={handleToggleMic}
                            aria-label={
                              isMuted ? "Unmute microphone" : "Mute microphone"
                            }
                          >
                            {isMuted ? (
                              <MicOff className="size-4.5" />
                            ) : (
                              <Mic className="size-4.5" />
                            )}
                          </Button>

                          <Button
                            variant="destructive"
                            className="size-10 rounded-full"
                            onClick={disconnect}
                            aria-label="End voice chat"
                          >
                            <PhoneOff className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        ref={fabRef}
        onClick={toggleOpen}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        className={cn(
          "fixed right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
          "bottom-6 lg:bottom-6 max-lg:bottom-[calc(56px+0.75rem)]",
          isOpen
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
        )}
        aria-label={isOpen ? "Close Chip voice panel" : "Talk to Chip"}
      >
        {/* Pulse ring when connected */}
        {status === "connected" && !isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 motion-reduce:hidden" />
        )}

        {isOpen ? (
          <X className="size-6" />
        ) : (
          <div className="relative">
            {/* Plain <img> instead of next/image since we are
                outside the Next.js component tree */}
            <img
              src="/images/chip.png"
              alt="Chip"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            {/* Green dot + time badge when connected */}
            {status === "connected" && (
              <>
                <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-primary bg-emerald-500" />
                {remainingDisplay && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/90 px-1.5 py-px text-[9px] font-semibold tabular-nums text-muted-foreground shadow-sm backdrop-blur">
                    {remainingDisplay}
                  </span>
                )}
              </>
            )}
            {/* Text chat badge when voice budget exhausted */}
            {textFallbackActive && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-amber-400">
                <MessageSquare className="size-2.5 text-amber-900" />
              </span>
            )}
          </div>
        )}
      </motion.button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Routes where the FAB should be hidden (checked inside FabUI so that
// VoiceProvider stays mounted and the WebSocket connection survives).
// ---------------------------------------------------------------------------

const HIDE_ON_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/demo",
  "/privacy",
  "/terms",
  "/support",
];

// ---------------------------------------------------------------------------
// Main export -- wraps FabUI with VoiceProvider + action handler
//
// This component renders inside an INDEPENDENT React root (created by
// voice-root.tsx), NOT inside Next.js's component tree. This means:
//
// - VoiceProvider NEVER unmounts during navigation (the root is permanent)
// - Next.js hooks (usePathname, useRouter) are NOT available here
// - Navigation state comes through voiceBridge instead
// - next/image is replaced with plain <img> tags
//
// Every callback passed to VoiceProvider is stabilized via refs so that
// the provider always receives the same function references.
// ---------------------------------------------------------------------------

export default function ChipVoiceFab({
  accessToken,
  configId,
  pageContext,
}: ChipVoiceProps) {
  const reducedMotionRef = useRef(false);
  reducedMotionRef.current = !!useReducedMotion();

  // Stable action handler -- uses voiceBridge.navigate instead of
  // useRouter (which is not available outside Next.js tree).
  const stableHandleAction = useRef((action: VoiceAction) => {
    switch (action.type) {
      case "navigate":
        if (action.path) {
          voiceBridge.navigate(action.path);
        }
        break;
      case "celebrate":
        if (!reducedMotionRef.current) {
          import("canvas-confetti").then((mod) => {
            const fire = mod.default;
            fire({
              particleCount: 120,
              spread: 80,
              origin: { x: 0.9, y: 0.85 },
              colors: ["#F97316", "#facc15", "#22c55e", "#ec4899"],
            });
          });
        }
        break;
    }
  }).current;

  // Stable tool call handler -- same function reference for the lifetime
  // of the component so VoiceProvider's onToolCall prop never changes.
  const stableToolCallHandler = useMemo(
    () => createChipToolCallHandler(stableHandleAction),
    [stableHandleAction],
  );

  // Surface WebSocket close reasons (e.g. "Exhausted credit balance") as
  // user-visible errors so the UI doesn't silently fail.
  const [providerError, setProviderError] = useState<string | null>(null);

  // Stable close handler -- same function reference forever.
  const stableCloseHandler = useRef(
    (ev: { code: number; reason: string }) => {
      if (ev.reason && ev.code !== 1000) {
        setProviderError(ev.reason);
      }
    },
  ).current;

  // Stable clear callback for FabUI
  const clearProviderError = useRef(() => setProviderError(null)).current;

  return (
    <VoiceProvider
      onToolCall={stableToolCallHandler}
      onClose={stableCloseHandler}
      clearMessagesOnDisconnect={false}
      messageHistoryLimit={50}
    >
      <FabUI
        accessToken={accessToken}
        configId={configId}
        pageContext={pageContext}
        providerError={providerError}
        onClearProviderError={clearProviderError}
        hideOnRoutes={HIDE_ON_ROUTES}
      />
    </VoiceProvider>
  );
}
