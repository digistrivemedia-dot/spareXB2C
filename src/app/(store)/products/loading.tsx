import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the product listing: title, fit bar, filter sidebar and a grid of cards. */
export default function ProductsLoading() {
  return (
    <Container className="grid gap-4 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-12 rounded-xl" />
      <div className="flex gap-8">
        <Skeleton className="hidden h-128 w-64 shrink-0 rounded-xl lg:block" />
        <div className="grid flex-1 grid-cols-2 content-start gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="grid gap-2 rounded-xl border border-gray-200 bg-white p-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
