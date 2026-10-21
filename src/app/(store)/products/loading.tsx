import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/features/catalog/components/ProductGridSkeleton";

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
        <ProductGridSkeleton className="flex-1" />
      </div>
    </Container>
  );
}
