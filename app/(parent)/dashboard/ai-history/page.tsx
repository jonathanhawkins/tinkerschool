import type { Metadata } from "next";
import { MessageSquare, ShieldCheck, Bot, User } from "lucide-react";

export const metadata: Metadata = { title: "AI Chat History" };

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn } from "@/components/motion";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Profile, ChatSession, ChatMessage } from "@/lib/supabase/types";

export default async function AIHistoryPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const kids = (kidProfiles ?? []) as Profile[];
  const kidIds = kids.map((k) => k.id);

  // Fetch chat sessions for all kids
  let sessions: ChatSession[] = [];
  if (kidIds.length > 0) {
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .in("profile_id", kidIds)
      .order("created_at", { ascending: false });
    sessions = (data ?? []) as ChatSession[];
  }

  // Build a lookup for kid names
  const kidNameMap = new Map(kids.map((k) => [k.id, k.display_name]));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            AI Chat History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your child&apos;s conversations with Chip.
          </p>
        </div>
      </FadeIn>

      {/* Safety note */}
      <FadeIn delay={0.05}>
        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 py-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              All of Chip&apos;s conversations with your child are logged
              here for your review. Chip only discusses coding, math,
              science, and creative projects.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
              <MessageSquare className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No chat sessions yet. When your child talks to Chip, those
              conversations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <FadeIn key={session.id}>
              <ChatSessionCard
                session={session}
                kidName={kidNameMap.get(session.profile_id) ?? "Unknown"}
              />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ChatSessionCardProps {
  session: ChatSession;
  kidName: string;
}

function ChatSessionCard({ session, kidName }: ChatSessionCardProps) {
  const messages = session.messages ?? [];
  const messageCount = messages.length;
  const firstUserMessage = messages.find((m) => m.role === "user");
  const preview = firstUserMessage
    ? truncate(firstUserMessage.content, 120)
    : "No messages";

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">{kidName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDate(session.created_at)}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {messageCount} {messageCount === 1 ? "message" : "messages"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {/* First message preview */}
        <p className="text-sm text-muted-foreground">{preview}</p>

        {/* Conversation excerpt (first 4 messages) */}
        {messages.length > 0 && (
          <div className="space-y-2 rounded-xl bg-muted/30 p-3">
            {messages.slice(0, 4).map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {messages.length > 4 && (
              <p className="pt-1 text-center text-xs text-muted-foreground">
                ... and {messages.length - 4} more{" "}
                {messages.length - 4 === 1 ? "message" : "messages"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="size-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 text-xs",
          isUser
            ? "bg-primary/10 text-foreground"
            : "bg-background text-foreground",
        )}
      >
        {truncate(message.content, 200)}
      </div>
      {isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="size-3.5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
