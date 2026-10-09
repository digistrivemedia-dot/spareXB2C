import { Skeleton } from "@/components/ui/skeleton";

/** Matches the order page: title, status timeline, items and the two detail cards. */
export default function OrderDetailsLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your order">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-8 w-72 max-w-full" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
