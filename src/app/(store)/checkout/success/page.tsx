import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ClearCart } from "@/features/cart/components/ClearCart";
import { OrderConfirmation } from "@/features/checkout/components/OrderConfirmation";
import { getOrder } from "@/features/orders/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Order placed",
  // A confirmation is personal; keep it out of search results.
  robots: { index: false },
};

export default async function OrderSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const orderId = getSearchParam(await searchParams, "order");
  const order = orderId ? await getOrder(orderId) : null;
  if (!order) notFound();

  return (
    <Container className="py-8 lg:py-12">
      <ClearCart />
      <OrderConfirmation order={order} />
    </Container>
  );
}
