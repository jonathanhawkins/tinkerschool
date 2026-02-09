import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";

export default function GalleryLoading() {
  return (
    <FadeIn className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-8 space-y-1">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            {/* Project thumbnail placeholder */}
            <Skeleton className="h-32 w-full rounded-xl" />

            {/* Title and description */}
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
