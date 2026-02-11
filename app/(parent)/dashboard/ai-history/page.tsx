import type { Metadata } from "next";
import { MessageSquare, ShieldCheck, Bot, User, Mic } from "lucide-react";

export const metadata: Metadata = { title: "AI Conversation History" };

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

// voice_sessions may not be in generated types — define inline
interface VoiceSessionRow {
  id: string;
  profile_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
}

export default async function AIHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ kid?: string }>;
}) {
  const { profile, supabase } = await requireAuth();
  const { kid: selectedKidId } = await searchParams;

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const allKids = (kidProfiles ?? []) as Profile[];
  const allKidIds = new Set(allKids.map((k) => k.id));

  // Filter to selected kid if the param is valid, otherwise show all
  const kids =
    selectedKidId && allKidIds.has(selectedKidId)
      ? allKids.filter((k) => k.id === selectedKidId)
      : allKids;
  const kidIds = kids.map((k) => k.id);

  // Fetch chat sessions and voice sessions for all kids in parallel
  let sessions: ChatSession[] = [];
  let voiceSessions: VoiceSessionRow[] = [];

  if (kidIds.length > 0) {
    const [chatResult, voiceResult] = await Promise.all([
      supabase
        .from("chat_sessions")
        .select("*")
        .in("profile_id", kidIds)
        .order("created_at", { ascending: false }),
      supabase
        .from("voice_sessions")
        .select("id, profile_id, started_at, ended_at, duration_seconds")
        .in("profile_id", kidIds)
        .order("started_at", { ascending: false }),
    ]);
    sessions = (chatResult.data ?? []) as ChatSession[];
    voiceSessions = (voiceResult.data ?? []) as VoiceSessionRow[];
  }

  // Build a lookup for kid names
  const kidNameMap = new Map(kids.map((k) => [k.id, k.display_name]));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            AI Conversation History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your child&apos;s text and voice conversations with
            Chip.
          </p>
        </div>
      </FadeIn>

      {/* Safety note */}
      <FadeIn delay={0.05}>
        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 py-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              All of Chip&apos;s text and voice conversations with your
              child are logged here for your review. Chip only discusses
              coding, math, science, and creative projects.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Text chat sessions */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Text Conversations
            </h2>
          </div>

          {sessions.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                  <MessageSquare className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No chat sessions yet. When your child talks to Chip via
                  text, those conversations will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <FadeIn key={session.id}>
                  <ChatSessionCard
                    session={session}
                    kidName={
                      kidNameMap.get(session.profile_id) ?? "Unknown"
                    }
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Voice conversations */}
      <FadeIn delay={0.15}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="size-5 text-violet-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Voice Conversations
            </h2>
          </div>

          {voiceSessions.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Mic className="size-6 text-violet-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No voice sessions yet. When your child talks to Chip
                  using voice, those sessions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {voiceSessions.map((session) => (
                <FadeIn key={session.id}>
                  <VoiceSessionCard
                    session={session}
                    kidName={
                      kidNameMap.get(session.profile_id) ?? "Unknown"
                    }
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
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

// ---------------------------------------------------------------------------
// Voice session card
// ---------------------------------------------------------------------------

interface VoiceSessionCardProps {
  session: VoiceSessionRow;
  kidName: string;
}

function VoiceSessionCard({ session, kidName }: VoiceSessionCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Mic className="size-4 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-sm">{kidName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDate(session.started_at)}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-violet-300 text-xs text-violet-600 dark:border-violet-700 dark:text-violet-400"
          >
            {formatDuration(session.duration_seconds)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <p className="text-xs text-muted-foreground">
          Voice conversation — no transcript available
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (seconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${seconds} sec`;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
