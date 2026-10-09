import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductRailSkeleton } from "@/features/catalog/components/ProductRailSkeleton";

/** Matches the home page: hero, category grid and a product rail. */
export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Container className="grid gap-6 py-6 lg:grid-cols-12 lg:py-8">
        <Skeleton className="h-96 rounded-xl lg:col-span-5 lg:h-auto" />
        <div className="grid gap-4 lg:col-span-7">
          <Skeleton className="aspect-4/3 rounded-xl sm:aspect-16/6" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        </div>
      </Container>
      <Container className="py-6 md:py-8">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl md:h-28" />
          ))}
        </div>
      </Container>
      <Container className="py-6 md:py-8">
        <Skeleton className="mb-4 h-6 w-48" />
        <ProductRailSkeleton />
      </Container>
    </div>
  );
}
