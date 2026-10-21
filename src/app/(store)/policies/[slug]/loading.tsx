import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches a policy page: breadcrumb, title, tabs and the text. */
export default function PolicyLoading() {
  return (
    <Container className="grid gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-112 rounded-xl" />
    </Container>
  );
}
