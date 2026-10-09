import { Container } from "@/components/layout/Container";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";

export default function CartLoading() {
  return (
    <Container className="py-6 lg:py-8">
      <CartSkeleton />
    </Container>
  );
}
