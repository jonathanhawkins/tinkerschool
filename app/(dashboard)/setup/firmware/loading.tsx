import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function FirmwareLoading() {
  return (
    <FadeIn className="mx-auto max-w-2xl space-y-8">
      {/* Back link */}
      <Skeleton className="h-5 w-28" />

      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Firmware version cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
