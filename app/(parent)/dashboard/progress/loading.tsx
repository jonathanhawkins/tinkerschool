import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function ProgressLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Module cards */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card"
          >
            {/* Module header */}
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Lesson rows */}
            <div className="px-6 pb-6">
              <div className="divide-y divide-border rounded-xl border">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
                    <Skeleton className="h-3 w-16 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
