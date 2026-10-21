import { Skeleton } from "@/components/ui/skeleton";

/** Matches "My vehicles": title and a grid of vehicle cards. */
export default function MyVehiclesLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your vehicles">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="h-112 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
