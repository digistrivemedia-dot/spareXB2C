import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Matches ProductGrid while products load. */
export function ProductGridSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 content-start gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="grid gap-2 rounded-xl border border-gray-200 bg-white p-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
