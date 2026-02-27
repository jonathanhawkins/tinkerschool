import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Log | Parent Dashboard",
  robots: { index: false, follow: false },
};

import {
  Activity,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Flame,
  Trophy,
  Rocket,
  LayoutDashboard,
  Cpu,
  Sparkles,
  Send,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { formatDate } from "@/lib/format-date";
import type { Profile } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Event display configuration
// ---------------------------------------------------------------------------

interface EventDisplay {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}

const EVENT_CONFIG: Record<string, EventDisplay> = {
  onboarding_complete: {
    icon: Rocket,
    label: "Onboarding Complete",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  lesson_started: {
    icon: BookOpen,
    label: "Lesson Started",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  lesson_completed: {
    icon: GraduationCap,
    label: "Lesson Completed",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  chip_chat_opened: {
    icon: MessageCircle,
    label: "Chat with Chip",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  chip_message_sent: {
    icon: Send,
    label: "Message to Chip",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  parent_dashboard_viewed: {
    icon: LayoutDashboard,
    label: "Parent Dashboard Viewed",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  daily_adventure_started: {
    icon: Sparkles,
    label: "Daily Adventure Started",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  badge_earned: {
    icon: Trophy,
    label: "Badge Earned",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  streak_continued: {
    icon: Flame,
    label: "Streak Continued",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  device_connected: {
    icon: Cpu,
    label: "Device Connected",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
};

const DEFAULT_EVENT_DISPLAY: EventDisplay = {
  icon: Activity,
  label: "Event",
  color: "text-muted-foreground",
  bgColor: "bg-muted",
};

function getEventDisplay(eventName: string): EventDisplay {
  return EVENT_CONFIG[eventName] ?? {
    ...DEFAULT_EVENT_DISPLAY,
    label: eventName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

// ---------------------------------------------------------------------------
// Format event data into a readable summary string
// ---------------------------------------------------------------------------

function formatEventContext(
  eventName: string,
  eventData: Record<string, unknown> | null,
): string | null {
  if (!eventData) return null;

  const parts: string[] = [];

  if (eventData.subject && typeof eventData.subject === "string") {
    parts.push(eventData.subject);
  }

  if (eventData.score !== undefined && eventData.score !== null) {
    parts.push(`Score: ${eventData.score}%`);
  }

  if (eventData.streak_length !== undefined) {
    parts.push(`${eventData.streak_length} days`);
  }

  if (eventData.badge_name && typeof eventData.badge_name === "string") {
    parts.push(eventData.badge_name);
  }

  if (eventData.connection_mode && typeof eventData.connection_mode === "string") {
    parts.push(eventData.connection_mode === "usb-serial" ? "USB" : "WiFi");
  }

  if (eventData.grade_level !== undefined) {
    const grade = Number(eventData.grade_level);
    if (grade === -1) parts.push("Pre-K");
    else if (grade === 0) parts.push("Kindergarten");
    else parts.push(`Grade ${grade}`);
  }

  return parts.length > 0 ? parts.join(" \u00b7 ") : null;
}

// ---------------------------------------------------------------------------
// Format relative time
// ---------------------------------------------------------------------------

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoString);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function EventsPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch kid profiles in the family for display names
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_id")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const kids = (kidProfiles ?? []) as Pick<Profile, "id" | "display_name" | "avatar_id">[];
  const kidMap = new Map(kids.map((k) => [k.id, k.display_name]));

  // Fetch recent events for the family (last 200)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: events } = await (supabase.from("user_events") as any)
    .select("*")
    .eq("family_id", profile.family_id)
    .order("created_at", { ascending: false })
    .limit(200);

  interface EventRow {
    id: string;
    profile_id: string;
    family_id: string;
    event_name: string;
    event_data: Record<string, unknown> | null;
    created_at: string;
  }

  const allEvents = (events ?? []) as EventRow[];

  // Calculate summary stats
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = allEvents.filter((e) => e.created_at.slice(0, 10) === today);
  const totalEvents = allEvents.length;
  const uniqueEventTypes = new Set(allEvents.map((e) => e.event_name)).size;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Event Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A chronological stream of family activity for alpha testing insights.
          </p>
        </div>
      </FadeIn>

      {/* Summary stats */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-semibold text-foreground">
                {todayEvents.length}
              </p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-semibold text-foreground">
                {totalEvents}
              </p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-semibold text-foreground">
                {uniqueEventTypes}
              </p>
              <p className="text-xs text-muted-foreground">Event Types</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Event stream */}
      <FadeIn delay={0.1}>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Activity className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No events recorded yet. Events will appear here as your family uses TinkerSchool.
                </p>
              </div>
            ) : (
              <Stagger className="space-y-2">
                {allEvents.map((event) => {
                  const display = getEventDisplay(event.event_name);
                  const Icon = display.icon;
                  const kidName = kidMap.get(event.profile_id);
                  const isParentEvent = event.profile_id === profile.id;
                  const actorName = isParentEvent ? "You" : kidName ?? "Unknown";
                  const contextStr = formatEventContext(event.event_name, event.event_data);

                  return (
                    <StaggerItem key={event.id}>
                      <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/30">
                        {/* Event icon */}
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${display.bgColor}`}
                        >
                          <Icon className={`size-4 ${display.color}`} />
                        </div>

                        {/* Event details */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {display.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {actorName}
                            {contextStr ? ` \u00b7 ${contextStr}` : ""}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeTime(event.created_at)}
                        </span>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
