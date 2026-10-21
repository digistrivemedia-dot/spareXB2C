import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the order confirmation: the thank-you card and the order details. */
export default function OrderSuccessLoading() {
  return (
    <Container className="py-8 lg:py-12" aria-busy="true" aria-label="Loading">
      <div className="mx-auto grid max-w-2xl gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </Container>
  );
}
