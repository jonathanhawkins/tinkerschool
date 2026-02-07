import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------------
// Workshop loading skeleton
// ---------------------------------------------------------------------------
// Mirrors the 3-column workshop layout with placeholder panels so the user
// sees a meaningful silhouette while data and client components load.
// ---------------------------------------------------------------------------

export default function WorkshopLoading() {
  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Main content grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px_320px]">
        {/* Editor panel skeleton */}
        <div className="flex flex-col gap-3">
          {/* Tabs */}
          <Skeleton className="h-9 w-52 rounded-lg" />
          {/* Editor area */}
          <Skeleton className="min-h-[480px] flex-1 rounded-2xl" />
        </div>

        {/* Simulator + Device panel skeleton */}
        <div className="flex flex-col gap-4">
          {/* Simulator */}
          <Skeleton className="h-[360px] rounded-2xl" />
          {/* Device */}
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>

        {/* Chat panel skeleton */}
        <div className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-12 w-3/4 rounded-2xl" />
            <Skeleton className="ml-auto h-8 w-1/2 rounded-2xl" />
            <Skeleton className="h-10 w-2/3 rounded-2xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
