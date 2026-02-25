"use client";

import { useTransition, useState } from "react";
import {
  Bug,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Lightbulb,
  Loader2,
  MessageSquare,
  Search,
  Save,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedbackCategory, FeedbackStatus } from "@/lib/supabase/types";

import { updateFeedback } from "../actions";
import type { FeedbackWithProfile } from "../actions";

// ---------------------------------------------------------------------------
// Config maps
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<
  FeedbackCategory,
  { label: string; icon: typeof Bug; color: string; bgColor: string }
> = {
  bug: {
    label: "Bug Report",
    icon: Bug,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  feature_request: {
    label: "Feature Request",
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
  { label: string; icon: typeof Circle; color: string }
> = {
  new: { label: "New", icon: Circle, color: "text-muted-foreground" },
  in_review: { label: "In Review", icon: Search, color: "text-amber-600" },
  planned: { label: "Planned", icon: Clock, color: "text-blue-600" },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    color: "text-muted-foreground",
  },
};

const ALL_CATEGORIES: FeedbackCategory[] = [
  "bug",
  "feature_request",
  "general",
];
const ALL_STATUSES: FeedbackStatus[] = [
  "new",
  "in_review",
  "planned",
  "resolved",
  "closed",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Admin Client Component
// ---------------------------------------------------------------------------

interface FeedbackAdminClientProps {
  initialFeedback: FeedbackWithProfile[];
}

export function FeedbackAdminClient({
  initialFeedback,
}: FeedbackAdminClientProps) {
  const [feedback] = useState(initialFeedback);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter feedback
  const filtered = feedback.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  // Count stats
  const stats = {
    total: feedback.length,
    new: feedback.filter((f) => f.status === "new").length,
    inReview: feedback.filter((f) => f.status === "in_review").length,
    bugs: feedback.filter((f) => f.category === "bug").length,
    features: feedback.filter((f) => f.category === "feature_request").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="New" value={stats.new} accent="text-primary" />
        <StatCard label="In Review" value={stats.inReview} accent="text-amber-600" />
        <StatCard label="Bugs" value={stats.bugs} accent="text-red-600" />
        <StatCard label="Features" value={stats.features} accent="text-amber-600" />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ALL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </CardContent>
      </Card>

      {/* Feedback list */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <MessageSquare className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No feedback matching the current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <FeedbackItem
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="py-3 text-center">
        <p className={cn("text-2xl font-semibold", accent ?? "text-foreground")}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Individual feedback item
// ---------------------------------------------------------------------------

interface FeedbackItemProps {
  item: FeedbackWithProfile;
  isExpanded: boolean;
  onToggle: () => void;
}

function FeedbackItem({ item, isExpanded, onToggle }: FeedbackItemProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<FeedbackStatus>(
    item.status,
  );
  const [adminNotes, setAdminNotes] = useState(item.admin_notes ?? "");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const catConfig = CATEGORY_CONFIG[item.category];
  const statusConfig = STATUS_CONFIG[currentStatus];
  const CatIcon = catConfig.icon;
  const StatusIcon = statusConfig.icon;

  function handleSave() {
    setSaveMessage(null);
    startTransition(async () => {
      const result = await updateFeedback({
        feedbackId: item.id,
        status: currentStatus,
        adminNotes,
      });

      if (result.success) {
        setSaveMessage("Saved!");
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        setSaveMessage(result.error ?? "Failed to save.");
      }
    });
  }

  return (
    <Card className="rounded-2xl">
      {/* Summary row (always visible) */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/30"
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            catConfig.bgColor,
          )}
        >
          <CatIcon className={cn("size-4", catConfig.color)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {item.title}
            </p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.profiles.display_name} ({item.profiles.role}) &middot;{" "}
            {formatDate(item.created_at)}
          </p>
        </div>

        <Badge variant="secondary" className="shrink-0 gap-1 rounded-md text-xs">
          <StatusIcon className={cn("size-3", statusConfig.color)} />
          {statusConfig.label}
        </Badge>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <CardContent className="space-y-4 border-t pt-4">
          {/* Description */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
              {item.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {item.page_url && (
              <div>
                <span className="font-medium">Page: </span>
                <span className="break-all">{item.page_url}</span>
              </div>
            )}
            {item.user_agent && (
              <div>
                <span className="font-medium">Browser: </span>
                <span className="line-clamp-1">{item.user_agent}</span>
              </div>
            )}
          </div>

          {/* Admin controls */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Admin Controls
            </p>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                value={currentStatus}
                onValueChange={(val) =>
                  setCurrentStatus(val as FeedbackStatus)
                }
              >
                <SelectTrigger className="w-[160px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Admin Notes
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this feedback..."
                rows={3}
                maxLength={2000}
                className="rounded-lg"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="gap-2 rounded-xl"
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                Save Changes
              </Button>
              {saveMessage && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    saveMessage === "Saved!"
                      ? "text-emerald-600"
                      : "text-red-600",
                  )}
                >
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
