import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for a booking page and its job card, estimate, report and payment pages. */
export function ServiceJobSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}
