import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for a printable page (invoice, credit note) while it loads. */
export function PrintableDocumentSkeleton() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-128 rounded-xl" />
    </div>
  );
}
