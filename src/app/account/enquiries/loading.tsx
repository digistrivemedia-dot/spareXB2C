import { Skeleton } from "@/components/ui/skeleton";

/** Matches "My enquiries": title and enquiry cards. */
export default function EnquiriesLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your enquiries">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 2 }, (_, index) => (
        <Skeleton key={index} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}
