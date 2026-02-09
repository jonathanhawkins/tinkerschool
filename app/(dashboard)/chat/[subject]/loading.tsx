import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function SubjectChatLoading() {
  return (
    <FadeIn className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="size-3.5" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-4">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-16 w-3/4 rounded-2xl" />
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-1/2 rounded-2xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-12 w-2/3 rounded-2xl" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-full" />
      </div>
    </FadeIn>
  );
}
