import { Skeleton } from "@/components/ui/skeleton";

/** Matches a return page: title, status, progress, parts, pickup and refund. */
export default function ReturnLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
