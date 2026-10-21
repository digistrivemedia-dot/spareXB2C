import { Skeleton } from "@/components/ui/skeleton";

/** Matches the device list. */
export default function DevicesLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your devices">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}
