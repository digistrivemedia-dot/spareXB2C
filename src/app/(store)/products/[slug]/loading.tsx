import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the product page: gallery on the left, details and buttons on the right. */
export default function ProductLoading() {
  return (
    <Container className="grid gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-64 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <Skeleton className="aspect-square rounded-xl lg:col-span-5" />
        <div className="grid content-start gap-4 lg:col-span-7">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-20 rounded-xl" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    </Container>
  );
}
