import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookServiceLoading() {
  return (
    <Container className="grid max-w-3xl gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-80 rounded-xl" />
    </Container>
  );
}
