import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function SubjectsLoading() {
  return (
    <FadeIn className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-5 w-56" />
      </div>

      {/* Subject cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border border-l-4 bg-card p-6 space-y-4"
          >
            <div className="flex items-start gap-4">
              {/* Icon circle */}
              <Skeleton className="size-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="mt-1 size-4" />
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="ml-auto h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
