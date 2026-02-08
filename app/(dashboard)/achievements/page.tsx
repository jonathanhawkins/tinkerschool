import type { Metadata } from "next";

import { requireAuth } from "@/lib/auth/require-auth";

export const metadata: Metadata = { title: "Achievements" };
import { BadgeIcon } from "@/lib/badge-icons";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Badge as BadgeRow, UserBadge } from "@/lib/supabase/types";

export default async function AchievementsPage() {
  const { profile, supabase } = await requireAuth();

  // Fetch all badges and the user's earned badges in parallel
  const [badgesResult, userBadgesResult] = await Promise.all([
    supabase.from("badges").select("*"),
    supabase
      .from("user_badges")
      .select("*, badges(*)")
      .eq("profile_id", profile.id),
  ]);

  const allBadges = (badgesResult.data ?? []) as BadgeRow[];
  const userBadges = (userBadgesResult.data ?? []) as UserBadge[];

  // Build a set of earned badge IDs for quick lookup
  const earnedBadgeMap = new Map<string, UserBadge>(
    userBadges.map((ub) => [ub.badge_id, ub]),
  );

  const earnedCount = earnedBadgeMap.size;
  const totalCount = allBadges.length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Achievements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You have earned{" "}
            <span className="font-semibold text-primary">
              {earnedCount} of {totalCount}
            </span>{" "}
            badges! Keep coding to unlock them all.
          </p>
        </div>
      </FadeIn>

      {/* Summary progress */}
      <FadeIn delay={0.05}>
        <div className="mb-8">
          <Progress
            value={totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}
            className="h-3"
          />
        </div>
      </FadeIn>

      {/* Badge grid */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allBadges.map((badge) => {
          const earned = earnedBadgeMap.get(badge.id);
          return (
            <StaggerItem key={badge.id}>
              <BadgeCard badge={badge} earnedAt={earned?.earned_at} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BadgeCardProps {
  badge: BadgeRow;
  earnedAt?: string;
}

function BadgeCard({ badge, earnedAt }: BadgeCardProps) {
  const isEarned = Boolean(earnedAt);
  const threshold = badge.criteria.threshold;

  return (
    <Card
      className={cn(
        "rounded-2xl transition-shadow",
        isEarned
          ? "border-primary/30 shadow-[0_0_12px_-3px] shadow-primary/20"
          : "opacity-60 grayscale",
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl",
              isEarned
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <BadgeIcon name={badge.icon} className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{badge.name}</CardTitle>
            {isEarned && earnedAt ? (
              <p className="text-xs text-primary">
                Earned {formatDate(earnedAt)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Keep coding to earn this!
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        <p className="text-sm text-muted-foreground">{badge.description}</p>

        {/* Progress toward threshold */}
        {threshold > 1 && !isEarned && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>0 / {threshold}</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
