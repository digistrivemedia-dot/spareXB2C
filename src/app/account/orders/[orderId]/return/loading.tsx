import { Skeleton } from "@/components/ui/skeleton";

/** Matches the return form: title and its three cards. */
export default function ReturnRequestLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}
