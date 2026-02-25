import { Skeleton } from "@/components/ui/skeleton";

export default function AdventureLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* Story text skeleton */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* Progress bar skeleton */}
      <Skeleton className="h-6 w-full rounded-lg" />

      {/* Activity widget skeleton */}
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}
