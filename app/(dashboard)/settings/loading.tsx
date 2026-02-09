import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function SettingsLoading() {
  return (
    <FadeIn className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Your Account card */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
          </div>
        </div>
      </div>

      {/* Learner Profiles card */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Kid profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/40 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-4 shrink-0" />
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device card */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-4 shrink-0" />
              <div className="flex flex-1 items-center justify-between gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
          <Skeleton className="h-px w-full" />
          <div className="flex items-start gap-3 pt-1">
            <Skeleton className="mt-0.5 size-4 shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* About card */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-4 shrink-0" />
              <div className="flex flex-1 items-center justify-between gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-4 shrink-0" />
              <div className="flex flex-1 items-center justify-between gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Parent Dashboard link */}
      <Skeleton className="h-14 w-full rounded-2xl" />
    </FadeIn>
  );
}
