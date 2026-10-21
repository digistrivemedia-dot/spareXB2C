import { Skeleton } from "@/components/ui/skeleton";

/** Matches "My services": title, bookings and past services. */
export default function MyServicesLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your services">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
