import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for the help pages while the questions load. */
export function HelpCentreSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading help">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
