"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, User, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAudioNarration } from "@/hooks/use-audio-narration";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChipChatProps {
  kidName: string;
  age: number;
  band: number;
  currentSubject?: string;
  currentLesson?: string;
  currentLessonId?: string;
  currentCode?: string;
}

// ---------------------------------------------------------------------------
// Subject display names for greeting/placeholder
// ---------------------------------------------------------------------------

const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  math: "Math",
  reading: "Reading",
  science: "Science",
  music: "Music",
  art: "Art",
  problem_solving: "Problem Solving",
  coding: "Coding",
};

// ---------------------------------------------------------------------------
// Pre-K quick-reply buttons (tap instead of typing)
// ---------------------------------------------------------------------------

const PREK_QUICK_REPLIES = [
  { emoji: "👋", text: "Hi Chip!" },
  { emoji: "❓", text: "Help me!" },
  { emoji: "🎉", text: "I did it!" },
  { emoji: "🔄", text: "Say it again!" },
  { emoji: "👍", text: "Yes!" },
  { emoji: "👎", text: "No!" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChipChat({
  kidName,
  age,
  band,
  currentSubject,
  currentLesson,
  currentLessonId,
  currentCode,
}: ChipChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPreK = band === 0;

  // TTS for Pre-K auto-speak
  const { speak, isSpeaking, isSupported: ttsSupported } = useAudioNarration({
    rate: 0.85,
    pitch: 1.1,
    enabled: isPreK,
  });

  // Track the last message we auto-spoke to avoid repeating
  const lastSpokenMsgId = useRef<string>("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-buddy",
        body: {
          kidName,
          age,
          band,
          currentSubject,
          currentLesson,
          currentLessonId,
          currentCode,
        },
      }),
    [kidName, age, band, currentSubject, currentLesson, currentLessonId, currentCode]
  );

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
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

  // Pre-K: Auto-speak Chip's latest response when streaming completes
  useEffect(() => {
    if (!isPreK || !ttsSupported) return;
    if (status !== "ready" || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "assistant") return;

    const msgText = getMessageText(
      lastMsg.parts as Array<{ type: string; text?: string }>
    );
    if (!msgText || lastSpokenMsgId.current === lastMsg.id) return;

    lastSpokenMsgId.current = lastMsg.id;

    // Strip the [Parent: ...] bracket text from spoken version
    const spokenText = msgText.replace(/\[Parent:.*?\]/gi, "").trim();
    if (spokenText) {
      speak(spokenText);
    }
  }, [messages, status, isPreK, ttsSupported, speak]);

  // Pre-K: Auto-speak the greeting on mount
  const hasSpokenGreeting = useRef(false);
  useEffect(() => {
    if (!isPreK || !ttsSupported || hasSpokenGreeting.current) return;
    if (messages.length > 0) return; // Don't speak greeting if messages exist

    hasSpokenGreeting.current = true;
    const timer = setTimeout(() => {
      const spokenGreeting = isPreK
        ? `Hi ${kidName}! I'm Chip! Tap a button to talk to me!`
        : "";
      if (spokenGreeting) speak(spokenGreeting);
    }, 800);
    return () => clearTimeout(timer);
  }, [isPreK, ttsSupported, kidName, messages.length, speak]);

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  /**
   * Extract the text content from a UIMessage's parts array.
   */
  function getMessageText(
    parts: Array<{ type: string; text?: string }>
  ): string {
    return parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }

  /**
   * Handle form submission -- send the user's message.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("message") as string).trim();
    if (!text || isLoading) return;

    sendMessage({ text });
    form.reset();
  }

  /**
   * Handle Pre-K quick reply tap
   */
  function handleQuickReply(text: string) {
    if (isLoading) return;
    sendMessage({ text });
  }

  // -----------------------------------------------------------------------
  // Subject-aware greeting and placeholder
  // -----------------------------------------------------------------------

  const subjectName = currentSubject
    ? SUBJECT_DISPLAY_NAMES[currentSubject] ?? currentSubject
    : null;

  const greeting = isPreK
    ? `Hi ${kidName}! I'm Chip, your robot friend! Tap a button to talk to me!`
    : currentLesson && subjectName
      ? `Hey ${kidName}! I see you're working on "${currentLesson}" in ${subjectName}. Need any help?`
      : subjectName
        ? `Hey ${kidName}! Ready to explore some ${subjectName} together? What would you like to work on?`
        : `Hey ${kidName}! I'm Chip, your learning buddy! What would you like to explore today?`;

  const placeholder = currentLesson
    ? `Ask about ${currentLesson}...`
    : subjectName
      ? `Ask Chip about ${subjectName}...`
      : "Ask Chip anything about learning...";

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden border-primary/20 py-0">
      {/* Messages */}
      <CardContent className="relative min-h-0 flex-1 p-0">
        <div className="absolute inset-0 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-2 p-3">
            {/* Initial greeting from Chip (only shown before any AI messages) */}
            {messages.length === 0 && (
              <ChatBubble
                role="assistant"
                text={greeting}
                kidName={kidName}
                isPreK={isPreK}
                onSpeak={isPreK && ttsSupported ? speak : undefined}
              />
            )}

            {/* Conversation messages */}
            {messages.map((msg) => {
              const text = getMessageText(
                msg.parts as Array<{ type: string; text?: string }>
              );
              if (!text) return null;

              return (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  text={text}
                  kidName={kidName}
                  isPreK={isPreK}
                  onSpeak={
                    isPreK && ttsSupported && msg.role === "assistant"
                      ? speak
                      : undefined
                  }
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

            {/* Error message */}
            {error && (
              <div className="mx-auto max-w-xs rounded-xl bg-destructive/10 px-4 py-2 text-center text-base text-destructive">
                Oops! Chip got a little confused. Try again!
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Input -- Pre-K gets large tap buttons, older kids get text input */}
      <CardFooter className="border-t px-3 py-2">
        {isPreK ? (
          <div className="flex w-full flex-wrap gap-2">
            {PREK_QUICK_REPLIES.map((reply) => (
              <Button
                key={reply.text}
                type="button"
                variant="outline"
                size="lg"
                disabled={isLoading}
                onClick={() => handleQuickReply(reply.text)}
                className="flex-1 basis-[calc(33%-0.5rem)] gap-1.5 rounded-xl text-base touch-manipulation"
              >
                <span className="text-xl">{reply.emoji}</span>
                <span className="text-sm">{reply.text}</span>
              </Button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              name="message"
              placeholder={placeholder}
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
        )}
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Chat bubble sub-component
// ---------------------------------------------------------------------------

interface ChatBubbleProps {
  role: string;
  text: string;
  kidName: string;
  isPreK?: boolean;
  /** If provided, shows a speaker button to replay this message */
  onSpeak?: (text: string) => void;
}

function ChatBubble({ role, text, kidName, isPreK = false, onSpeak }: ChatBubbleProps) {
  const isChip = role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isChip ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      {isChip ? (
        <div className="mt-0.5 shrink-0">
          <Image
            src="/images/chip.png"
            alt="Chip"
            width={isPreK ? 40 : 32}
            height={isPreK ? 40 : 32}
            className={cn(
              "rounded-full object-cover shadow-sm",
              isPreK ? "size-10" : "size-8",
            )}
          />
        </div>
      ) : (
        <Avatar
          size="default"
          className="mt-0.5 shrink-0 bg-secondary text-secondary-foreground"
        >
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-base leading-relaxed",
          isChip
            ? "rounded-tl-sm bg-primary/10 text-foreground"
            : "rounded-tr-sm bg-secondary/20 text-foreground"
        )}
      >
        {isChip && (
          <span className="mb-0.5 block text-sm font-semibold text-primary">
            Chip
          </span>
        )}
        {!isChip && (
          <span className="mb-0.5 block text-sm font-semibold text-secondary">
            {kidName}
          </span>
        )}
        <span className="whitespace-pre-wrap">{text}</span>

        {/* Pre-K: Replay speaker button for Chip messages */}
        {onSpeak && isChip && (
          <button
            type="button"
            onClick={() => {
              // Strip [Parent: ...] from spoken text
              const spokenText = text.replace(/\[Parent:.*?\]/gi, "").trim();
              if (spokenText) onSpeak(spokenText);
            }}
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 touch-manipulation"
            aria-label="Hear Chip say this again"
          >
            <Volume2 className="size-3.5" />
            Hear again
          </button>
        )}
      </div>
    </div>
  );
}
