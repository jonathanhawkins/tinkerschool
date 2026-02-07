import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="size-3.5" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      {/* Story card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>

      {/* Starter blocks card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Hints card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-muted/30 p-3">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
