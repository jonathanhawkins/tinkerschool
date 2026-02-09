import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / mascot area */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-16 rounded-2xl" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
