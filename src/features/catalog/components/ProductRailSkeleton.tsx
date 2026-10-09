import { Skeleton } from "@/components/ui/skeleton";

/** Matches ProductRail: as many card shapes as fit on screen. */
export function ProductRailSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex shrink-0 basis-5/11 flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:basis-1/3 md:basis-1/4 xl:basis-1/5"
        >
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-1/2 rounded-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
