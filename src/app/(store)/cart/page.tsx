import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { CartView } from "@/features/cart/components/CartView";
import { getCoupons } from "@/features/promotions/api";
import { features } from "@/lib/config";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the parts in your cart and check out.",
};

export default async function CartPage() {
  const offers = features.coupons ? await getCoupons() : [];
  return (
    <Container className="py-6 lg:py-8">
      <CartView offers={offers} />
    </Container>
  );
}
