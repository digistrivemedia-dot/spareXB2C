import { Skeleton } from "@/components/ui/skeleton";

/** Matches the profile form. */
export default function ProfileLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your profile">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-112 max-w-2xl rounded-xl" />
    </div>
  );
}
