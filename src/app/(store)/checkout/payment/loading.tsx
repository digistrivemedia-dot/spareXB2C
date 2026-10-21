import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Matches the payment page: the message card and the order card. */
export default function PaymentLoading() {
  return (
    <Container className="py-8 lg:py-12" aria-busy="true" aria-label="Loading">
      <div className="mx-auto grid max-w-xl gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </Container>
  );
}
