import { Skeleton } from "@/components/ui/skeleton";

/** Matches the orders list: title, tabs and order cards. */
export default function OrdersLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your orders">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-12 w-full" />
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}
