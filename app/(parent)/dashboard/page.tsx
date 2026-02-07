import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Clock,
  Flame,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Star,
} from "lucide-react";

import { requireAuth } from "@/lib/auth/require-auth";
import { formatDate } from "@/lib/format-date";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Profile, Progress, UserBadge } from "@/lib/supabase/types";

export default async function ParentDashboardPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch kid profiles in the family
  const { data: kidProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .eq("role", "kid");

  const kids = (kidProfiles ?? []) as Profile[];
  const kidIds = kids.map((k) => k.id);

  // Fetch progress and badges for all kids in the family
  const [progressResult, badgesResult] = await Promise.all([
    kidIds.length > 0
      ? supabase
          .from("progress")
          .select("*")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
    kidIds.length > 0
      ? supabase
          .from("user_badges")
          .select("*, badges(*)")
          .in("profile_id", kidIds)
      : Promise.resolve({ data: [] }),
  ]);

  const allProgress = (progressResult.data ?? []) as Progress[];
  const allUserBadges = (badgesResult.data ?? []) as (UserBadge & { badges: { name: string; icon: string } })[];

  const lessonsCompleted = allProgress.filter(
    (p) => p.status === "completed",
  ).length;
  const badgesEarned = allUserBadges.length;

  // Recent activity: combine completed lessons and earned badges, sort by date
  const recentActivity: ActivityItem[] = [];

  for (const p of allProgress) {
    if (p.status === "completed" && p.completed_at) {
      const kid = kids.find((k) => k.id === p.profile_id);
      recentActivity.push({
        type: "lesson",
        label: "Completed a lesson",
        kidName: kid?.display_name ?? "Unknown",
        date: p.completed_at,
      });
    }
  }

  for (const ub of allUserBadges) {
    const kid = kids.find((k) => k.id === ub.profile_id);
    recentActivity.push({
      type: "badge",
      label: `Earned "${ub.badges.name}"`,
      kidName: kid?.display_name ?? "Unknown",
      date: ub.earned_at,
    });
  }

  // Sort newest first, take top 8
  recentActivity.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const topActivity = recentActivity.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {kids.length > 0
            ? `Tracking progress for ${kids.map((k) => k.display_name).join(", ")}`
            : "No kid profiles found in your family yet."}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={BookOpen}
          label="Lessons Completed"
          value={lessonsCompleted}
          accent="text-chart-1"
          bgAccent="bg-chart-1/10"
        />
        <SummaryCard
          icon={Trophy}
          label="Badges Earned"
          value={badgesEarned}
          accent="text-chart-2"
          bgAccent="bg-chart-2/10"
        />
        <SummaryCard
          icon={Clock}
          label="Time on Platform"
          value="--"
          accent="text-chart-3"
          bgAccent="bg-chart-3/10"
          subtitle="Coming soon"
        />
        <SummaryCard
          icon={Flame}
          label="Active Streak"
          value="--"
          accent="text-chart-4"
          bgAccent="bg-chart-4/10"
          subtitle="Coming soon"
        />
      </div>

      {/* Recent activity + quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="size-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topActivity.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No activity yet. Once your child starts coding, their
                progress will show up here!
              </p>
            ) : (
              <ul className="space-y-3">
                {topActivity.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {item.type === "lesson" ? (
                        <BookOpen className="size-4 text-muted-foreground" />
                      ) : (
                        <Trophy className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.kidName} &middot; {formatDate(item.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-1/10">
                <BarChart3 className="size-5 text-chart-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  Detailed Progress
                </p>
                <p className="text-xs text-muted-foreground">
                  Lesson-by-lesson breakdown
                </p>
              </div>
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard/progress">
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chart-5/10">
                <MessageSquare className="size-5 text-chart-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  AI Chat History
                </p>
                <p className="text-xs text-muted-foreground">
                  Review Chip conversations
                </p>
              </div>
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard/ai-history">
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent: string;
  bgAccent: string;
  subtitle?: string;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
  bgAccent,
  subtitle,
}: SummaryCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-4 py-5">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bgAccent}`}
        >
          <Icon className={`size-5 ${accent}`} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle ?? label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  type: "lesson" | "badge";
  label: string;
  kidName: string;
  date: string;
}
