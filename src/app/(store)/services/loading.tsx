import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the services home: hero, service cards and nearby garages. */
export default function ServicesLoading() {
  return (
    <Container className="grid gap-8 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-72 rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </Container>
  );
}
