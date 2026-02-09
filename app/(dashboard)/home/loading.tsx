import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function HomeLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Welcome header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Continue learning card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Explore Subjects section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border border-l-4 bg-card p-5"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Missions section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border border-l-4 bg-card p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  >
                    <Skeleton className="size-7 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>
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

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </FadeIn>
  );
}
