"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChipChatProps {
  kidName: string;
  age: number;
  band: number;
  currentLesson?: string;
  currentCode?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChipChat({
  kidName,
  age,
  band,
  currentLesson,
  currentCode,
}: ChipChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-buddy",
        body: {
          kidName,
          age,
          band,
          currentLesson,
          currentCode,
        },
      }),
    [kidName, age, band, currentLesson, currentCode]
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

  // -----------------------------------------------------------------------
  // Greeting message (shown when there are no messages yet)
  // -----------------------------------------------------------------------

  const greeting = `Hey ${kidName}! I'm Chip, your coding buddy! What should we build today?`;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden border-primary/20 py-0">
      {/* Messages */}
      <CardContent className="relative min-h-0 flex-1 p-0">
        <div className="absolute inset-0 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-2 p-3">
            {/* Initial greeting from Chip (always shown) */}
            <ChatBubble role="assistant" text={greeting} kidName={kidName} />

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
                />
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

            {/* Error message */}
            {error && (
              <div className="mx-auto max-w-xs rounded-xl bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
                Oops! Chip got a little confused. Try again!
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Input */}
      <CardFooter className="border-t px-3 py-2">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <Input
            name="message"
            placeholder="Ask Chip anything about coding..."
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
}

function ChatBubble({ role, text, kidName }: ChatBubbleProps) {
  const isChip = role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isChip ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar
        size="default"
        className={cn(
          "mt-0.5 shrink-0",
          isChip
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <AvatarFallback
          className={cn(
            isChip
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
            "text-xs font-bold"
          )}
        >
          {isChip ? <Bot className="size-4" /> : <User className="size-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isChip
            ? "rounded-tl-sm bg-primary/10 text-foreground"
            : "rounded-tr-sm bg-secondary/20 text-foreground"
        )}
      >
        {isChip && (
          <span className="mb-0.5 block text-xs font-semibold text-primary">
            Chip
          </span>
        )}
        {!isChip && (
          <span className="mb-0.5 block text-xs font-semibold text-secondary">
            {kidName}
          </span>
        )}
        <span className="whitespace-pre-wrap">{text}</span>
      </div>
    </div>
  );
}
