import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function ParentDashboardLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-56" />
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card py-5 px-6"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-10" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity + quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity card */}
        <div className="rounded-2xl border border-border bg-card lg:col-span-2">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card py-5 px-6"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
