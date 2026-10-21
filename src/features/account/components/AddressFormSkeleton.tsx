import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for the add and edit address pages while they load. */
export function AddressFormSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-120 max-w-2xl rounded-xl" />
    </div>
  );
}
