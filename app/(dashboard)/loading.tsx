import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Welcome header skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>

      {/* Continue learning card skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Section title skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />

        {/* Module cards grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 space-y-5"
            >
              {/* Module header */}
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>

              {/* Lesson rows */}
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  >
                    <Skeleton className="size-7 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>

              {/* Progress footer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3"
            >
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}
