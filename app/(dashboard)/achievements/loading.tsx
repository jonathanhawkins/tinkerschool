import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function AchievementsLoading() {
  return (
    <FadeIn className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-8 space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Summary progress bar */}
      <div className="mb-8">
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 space-y-3"
          >
            {/* Badge header */}
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>

            {/* Badge description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            {/* Progress toward threshold */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
