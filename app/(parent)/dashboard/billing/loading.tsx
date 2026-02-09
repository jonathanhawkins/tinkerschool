import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function BillingLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Pricing cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="space-y-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-9 w-16" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
