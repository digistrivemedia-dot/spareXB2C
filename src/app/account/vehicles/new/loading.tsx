import { Skeleton } from "@/components/ui/skeleton";

export default function AddVehicleLoading() {
  return (
    <div className="grid max-w-2xl gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
