import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the garage list: title, filters and garage cards. */
export default function GaragesLoading() {
  return (
    <Container className="grid gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading garages">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-48 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-56 rounded-xl" />
        ))}
      </div>
    </Container>
  );
}
