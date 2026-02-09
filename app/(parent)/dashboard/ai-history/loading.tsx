import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function AIHistoryLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Safety note card */}
      <div className="rounded-2xl border border-border bg-card py-4 px-6">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 size-5 shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Chat session cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card"
          >
            {/* Session header */}
            <div className="p-6 pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8 shrink-0 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-5 w-24 shrink-0 rounded-full" />
              </div>
            </div>

            {/* Session content */}
            <div className="p-6 space-y-3">
              {/* First message preview */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              {/* Conversation excerpt */}
              <div className="space-y-2 rounded-xl bg-muted/30 p-3">
                {/* Bot message */}
                <div className="flex gap-2">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <Skeleton className="h-8 w-3/4 rounded-xl" />
                </div>
                {/* User message */}
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-6 w-1/2 rounded-xl" />
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                </div>
                {/* Bot message */}
                <div className="flex gap-2">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <Skeleton className="h-10 w-2/3 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
