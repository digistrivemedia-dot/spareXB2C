import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2" aria-busy="true" aria-label="Loading">
      <Skeleton className="hidden rounded-none lg:block" />
      <div className="flex items-center justify-center px-4">
        <div className="grid w-full max-w-sm gap-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
