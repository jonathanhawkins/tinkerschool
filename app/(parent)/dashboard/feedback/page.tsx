import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquarePlus,
  ArrowRight,
  Bug,
  Lightbulb,
  MessageSquare,
  Clock,
  CheckCircle2,
  Circle,
  Search,
  ShieldCheck,
} from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FeedbackCategory, FeedbackStatus } from "@/lib/supabase/types";

import { FeedbackForm } from "./feedback-form";
import { getMyFeedback, checkIsSiteAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Feedback | TinkerSchool",
  robots: { index: false, follow: false },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<
  FeedbackCategory,
  { label: string; icon: typeof Bug; color: string; bgColor: string }
> = {
  bug: {
    label: "Bug",
    icon: Bug,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  feature_request: {
    label: "Feature",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  general: {
    label: "General",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
};

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; icon: typeof Circle; className: string }
> = {
  new: {
    label: "New",
    icon: Circle,
    className: "text-muted-foreground",
  },
  in_review: {
    label: "In Review",
    icon: Search,
    className: "text-amber-600",
  },
  planned: {
    label: "Planned",
    icon: Clock,
    className: "text-blue-600",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "text-emerald-600",
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    className: "text-muted-foreground",
  },
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function FeedbackPage() {
  const [myFeedback, isAdmin] = await Promise.all([
    getMyFeedback(),
    checkIsSiteAdmin(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Feedback
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Help us make TinkerSchool better. Report bugs, request features,
              or share your thoughts.
            </p>
          </div>
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl">
              <Link href="/dashboard/feedback/admin">
                <ShieldCheck className="size-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            </Button>
          )}
        </div>
      </FadeIn>

      {/* Feedback form */}
      <FadeIn delay={0.05}>
        <FeedbackForm />
      </FadeIn>

      {/* Previous submissions */}
      {myFeedback.length > 0 && (
        <FadeIn delay={0.1}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquarePlus className="size-4 text-primary" />
                Your Previous Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Stagger>
                <ul className="space-y-3">
                  {myFeedback.map((item) => {
                    const catConfig = CATEGORY_CONFIG[item.category];
                    const statusConfig = STATUS_CONFIG[item.status];
                    const CatIcon = catConfig.icon;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <StaggerItem key={item.id}>
                        <li className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
                          <div
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg",
                              catConfig.bgColor,
                            )}
                          >
                            <CatIcon
                              className={cn("size-4", catConfig.color)}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {item.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="gap-1 rounded-md text-xs"
                              >
                                <StatusIcon
                                  className={cn(
                                    "size-3",
                                    statusConfig.className,
                                  )}
                                />
                                {statusConfig.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                        </li>
                      </StaggerItem>
                    );
                  })}
                </ul>
              </Stagger>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
