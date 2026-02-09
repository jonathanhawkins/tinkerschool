import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function ChatPickerLoading() {
  return (
    <FadeIn className="mx-auto max-w-2xl space-y-6">
      {/* Centered header */}
      <header className="space-y-2 text-center">
        <Skeleton className="mx-auto size-16 rounded-2xl" />
        <Skeleton className="mx-auto h-8 w-44" />
        <Skeleton className="mx-auto h-5 w-64" />
      </header>

      {/* Subject picker grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border border-l-4 bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
