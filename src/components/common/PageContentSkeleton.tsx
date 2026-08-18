import { Skeleton } from "../ui/skeleton";

interface PageContentSkeletonProps {
  cards?: number;
}

export const PageContentSkeleton = ({ cards = 3 }: PageContentSkeletonProps) => (
  <div role="status" aria-label="Loading page content" aria-live="polite" className="space-y-6">
    <span className="sr-only">Loading page content…</span>

    <div className="space-y-2">
      <Skeleton className="h-8 w-48 max-w-2/3" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }, (_, index) => (
        <div key={index} className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
          <Skeleton className="mt-5 h-8 w-24" />
          <Skeleton className="mt-3 h-3.5 w-36 max-w-full" />
        </div>
      ))}
    </div>

    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
