import { Skeleton } from "@/components/ui/skeleton";

/** Matches a vehicle page: title, actions, details and documents. */
export default function VehicleLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your vehicle">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
