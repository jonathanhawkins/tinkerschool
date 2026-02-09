import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function SetupLoading() {
  return (
    <FadeIn className="mx-auto max-w-2xl space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Setup steps card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Firmware link */}
      <Skeleton className="mx-auto h-16 w-full rounded-2xl" />
    </FadeIn>
  );
}
