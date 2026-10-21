import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the categories page: breadcrumb, title and the category grid. */
export default function CategoriesLoading() {
  return (
    <Container className="grid gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl md:h-32" />
        ))}
      </div>
    </Container>
  );
}
