import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function SubjectDetailLoading() {
  return (
    <FadeIn className="mx-auto max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="size-3.5" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Subject header */}
      <div className="flex items-center gap-5">
        <Skeleton className="size-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-sm" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Chat with Chip CTA card */}
      <div className="rounded-2xl border-2 border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-9 w-28 shrink-0 rounded-xl" />
        </div>
      </div>

      {/* Skills section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-24 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Lessons section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Module cards */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 space-y-4"
          >
            {/* Module header */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-4 w-12 shrink-0" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />

            {/* Lesson rows */}
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <Skeleton className="size-7 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Back button */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </FadeIn>
  );
}
