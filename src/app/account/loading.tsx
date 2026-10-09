import { Skeleton } from "@/components/ui/skeleton";
import { ProductRailSkeleton } from "@/features/catalog/components/ProductRailSkeleton";

/** Matches the bike dashboard: greeting, bike card, quick actions, tracker and cards. */
export default function AccountLoading() {
  return (
    <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading">
      <div className="grid gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <div className="grid gap-5 rounded-xl border border-gray-200 bg-white p-4 md:p-6">
        <Skeleton className="h-9 w-72 max-w-full rounded-full" />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="aspect-4/3 w-full rounded-lg sm:w-56" />
          <div className="grid flex-1 content-center gap-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-14 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-xl" />
      <ProductRailSkeleton />
    </div>
  );
}
