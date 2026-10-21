import { Skeleton } from "@/components/ui/skeleton";

/** Matches the enquiry form. */
export default function NewEnquiryLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-140 max-w-2xl rounded-xl" />
    </div>
  );
}
