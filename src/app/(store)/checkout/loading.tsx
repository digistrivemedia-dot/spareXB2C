import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <Container className="grid gap-6 py-6 lg:py-8" aria-busy="true" aria-label="Loading checkout">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="grid gap-6 lg:col-span-8">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl lg:col-span-4" />
      </div>
    </Container>
  );
}
