import { Skeleton } from "@/components/ui/skeleton";

/** Matches the cart: item rows on the left, the order summary on the right. */
export function CartSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading your cart">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="size-20 shrink-0 rounded-lg sm:size-24" />
              <div className="grid flex-1 content-start gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-36 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl lg:col-span-4" />
      </div>
    </div>
  );
}
