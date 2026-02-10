"use client";

import { useVoice, VoiceProvider, VoiceReadyState } from "@humeai/voice-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mic, MicOff, PhoneOff, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { refreshHumeAccessToken } from "@/lib/hume/actions";
import { createChipToolCallHandler } from "@/lib/hume/tools";
import type {
  ChipVoiceProps,
  ChipVoiceStatus,
  VoiceAction,
  VoicePageContext,
} from "@/lib/hume/types";
import { buildVoiceSystemPrompt } from "@/lib/hume/voice-prompt";
import { cn } from "@/lib/utils";

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
// FAB inner UI (must be inside VoiceProvider)
// ---------------------------------------------------------------------------

interface FabUIProps {
  accessToken: string;
  configId?: string;
  pageContext?: VoicePageContext;
}

function FabUI({ accessToken, configId, pageContext }: FabUIProps) {
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
    isSocketError,
    isAudioError,
    sendSessionSettings,
    chatMetadata,
  } = useVoice();

  const pathname = usePathname();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  // Auto-open panel for new users on first mount.
  // The FAB lives in the layout so it only mounts once per page load.
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (!isNewUser || hasAutoOpened.current) return;
    hasAutoOpened.current = true;

    // Short delay so the page renders first, then Chip pops up
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [isNewUser]);

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

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        fabRef.current &&
        !fabRef.current.contains(target)
      ) {
        if (readyState === VoiceReadyState.OPEN) {
          disconnect();
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, readyState, disconnect]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (readyState === VoiceReadyState.OPEN) {
          disconnect();
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, readyState, disconnect]);

  // Build system prompt from page context + current pathname
  const systemPrompt = useMemo(() => {
    if (!pageContext) return undefined;
    return buildVoiceSystemPrompt(pageContext, pathname);
  }, [pageContext, pathname]);

  // Update Chip's context mid-session when the user navigates to a new page
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    if (status !== "connected" || !systemPrompt) return;

    sendSessionSettings({ systemPrompt });
  }, [pathname, status, systemPrompt, sendSessionSettings]);

  // Connect handler — fetches a fresh token, then connects with page-aware prompt.
  // If we have a previous `chatGroupId`, pass it as `resumedChatGroupId` so Hume
  // continues from the prior conversation context instead of starting fresh.
  const tokenRef = useRef(accessToken);
  const handleConnect = useCallback(async () => {
    setConnectError(null);
    setIsAttemptingConnect(true);
    try {
      // Fetch a fresh token to avoid expired-token failures on long sessions
      const freshToken = await refreshHumeAccessToken();
      if (freshToken) {
        tokenRef.current = freshToken;
      }

      await connect({
        auth: { type: "accessToken", value: tokenRef.current },
        configId,
        resumedChatGroupId: chatGroupIdRef.current ?? undefined,
        sessionSettings: systemPrompt
          ? { type: "session_settings" as const, systemPrompt }
          : undefined,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setConnectError(msg);
    } finally {
      setIsAttemptingConnect(false);
    }
  }, [connect, accessToken, configId, systemPrompt]);

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

  // Status text
  const statusText = useMemo(() => {
    if (status === "connecting") {
      return readyState === VoiceReadyState.IDLE
        ? "Allow your microphone to talk to Chip!"
        : "Chip is waking up...";
    }
    if (status === "idle") return "Tap to start talking to Chip!";
    if (isPlaying) return "Chip is talking...";
    if (isMuted) return "Mic is off";
    return "Chip is listening...";
  }, [status, readyState, isPlaying, isMuted]);

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
      // When closing the panel, disconnect active voice session
      if (prev && readyState === VoiceReadyState.OPEN) {
        disconnect();
      }
      return !prev;
    });
  }, [readyState, disconnect]);

  return (
    <>
      {/* Expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
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
            className="fixed right-6 bottom-24 z-50 w-80 max-w-[calc(100vw-3rem)] sm:w-96"
          >
            <Card className="flex max-h-[min(60vh,420px)] flex-col gap-0 overflow-hidden rounded-2xl border-primary/20 py-0 shadow-lg">
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
                {/* Header: avatar + status + close */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center overflow-hidden rounded-full",
                        status === "connected" &&
                          "ring-[3px] ring-primary/50 ring-offset-2",
                      )}
                    >
                      <Image
                        src="/images/chip.png"
                        alt="Chip"
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                    </div>
                    {status === "connected" && (
                      <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Chip
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {statusText}
                    </span>
                  </div>

                  {/* Emotion badge */}
                  {topEmotion && status === "connected" && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {topEmotion}
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleOpen}
                    className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                    aria-label="Close Chip voice panel"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>

                {/* Audio visualizer */}
                {status === "connected" && (
                  <div
                    className="flex h-8 items-end justify-center gap-[2px]"
                    aria-hidden="true"
                  >
                    <AudioBars
                      data={isPlaying ? fft : micFft}
                      color={isPlaying ? "bg-primary" : "bg-primary/60"}
                    />
                  </div>
                )}

                {/* Welcome bubble (visible until voice messages arrive) */}
                {status !== "connected" && chatMessages.length === 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-primary/10 px-3 py-2 text-sm leading-relaxed text-foreground">
                      <span className="mb-0.5 block text-xs font-semibold opacity-70">
                        Chip
                      </span>
                      {isNewUser
                        ? `Hey${pageContext?.childName ? ` ${pageContext.childName}` : ""}! I'm Chip, your learning buddy! Tap the mic and let's get started!`
                        : `Hey${pageContext?.childName ? ` ${pageContext.childName}` : ""}! Tap the mic to talk to me!`}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                {chatMessages.length > 0 && (
                  <ScrollArea className="max-h-48 min-h-0 flex-1">
                    <div className="flex flex-col gap-2 pr-3">
                      {chatMessages.map((msg, i) => {
                        const isChip = msg.type === "assistant_message";
                        const content = msg.message?.content ?? "";
                        if (!content) return null;

                        return (
                          <div
                            key={i}
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                              isChip
                                ? "self-start rounded-tl-sm bg-primary/10 text-foreground"
                                : "self-end rounded-tr-sm bg-secondary/20 text-foreground",
                            )}
                          >
                            <span className="mb-0.5 block text-xs font-semibold opacity-70">
                              {isChip ? "Chip" : "You"}
                            </span>
                            {content}
                          </div>
                        );
                      })}
                      <div ref={scrollAnchorRef} className="h-px" />
                    </div>
                  </ScrollArea>
                )}

                {/* Error state */}
                {(isError || connectError) && (
                  <div className="rounded-xl bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    {isMicrophoneError
                      ? "Chip needs your microphone! Please allow mic access and try again."
                      : isSocketError
                        ? "Chip can't connect right now. Check your internet and try again!"
                        : isAudioError
                          ? "Chip can't play audio right now. Try again!"
                          : connectError
                            ? `Connection error: ${connectError}`
                            : "Chip can't hear you right now. Try the text chat instead!"}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-2.5">
                  {status === "idle" ? (
                    <Button
                      className="size-11 rounded-full"
                      onClick={handleConnect}
                      aria-label="Start voice chat with Chip"
                    >
                      <Mic className="size-5" />
                    </Button>
                  ) : status === "connecting" ? (
                    <Button
                      className="size-11 rounded-full bg-primary/80"
                      onClick={() => {
                        disconnect();
                        setIsAttemptingConnect(false);
                      }}
                      aria-label="Cancel connecting"
                    >
                      <Mic className="size-5 animate-pulse motion-reduce:animate-none" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={isMuted ? "outline" : "default"}
                        className="size-11 rounded-full"
                        onClick={handleToggleMic}
                        aria-label={
                          isMuted ? "Unmute microphone" : "Mute microphone"
                        }
                      >
                        {isMuted ? (
                          <MicOff className="size-5" />
                        ) : (
                          <Mic className="size-5" />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        className="size-11 rounded-full"
                        onClick={disconnect}
                        aria-label="End voice chat"
                      >
                        <PhoneOff className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
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
          "fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-none",
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
            <Image
              src="/images/chip.png"
              alt="Chip"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            {/* Green dot when connected */}
            {status === "connected" && (
              <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-primary bg-emerald-500" />
            )}
          </div>
        )}
      </motion.button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export — wraps FabUI with VoiceProvider + navigation handler
// ---------------------------------------------------------------------------

export default function ChipVoiceFab({
  accessToken,
  configId,
  pageContext,
}: ChipVoiceProps) {
  const router = useRouter();
  const prefersReducedMotionOuter = useReducedMotion();

  // Handle voice actions dispatched by Chip's tool calls
  const handleAction = useCallback(
    (action: VoiceAction) => {
      switch (action.type) {
        case "navigate":
          if (action.path) {
            router.push(action.path);
          }
          break;
        case "celebrate":
          if (!prefersReducedMotionOuter) {
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
    },
    [router, prefersReducedMotionOuter],
  );

  const handleToolCall = useMemo(
    () => createChipToolCallHandler(handleAction),
    [handleAction],
  );

  return (
    <VoiceProvider
      onToolCall={handleToolCall}
      clearMessagesOnDisconnect={false}
      messageHistoryLimit={50}
    >
      <FabUI
        accessToken={accessToken}
        configId={configId}
        pageContext={pageContext}
      />
    </VoiceProvider>
  );
}
