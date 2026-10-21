import { Skeleton } from "@/components/ui/skeleton";

/** Matches the service history: title and a card per service. */
export default function ServiceHistoryLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}
