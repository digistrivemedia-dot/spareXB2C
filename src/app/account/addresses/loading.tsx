import { Skeleton } from "@/components/ui/skeleton";

/** Matches the address book: title and a grid of address cards. */
export default function AddressesLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your addresses">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="h-60 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
