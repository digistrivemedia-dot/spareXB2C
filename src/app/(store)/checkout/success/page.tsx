import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { ClearCart } from "@/features/cart/components/ClearCart";
import { OrderConfirmation } from "@/features/checkout/components/OrderConfirmation";
import { getOrder } from "@/features/orders/api";
import { OrderNotFound } from "@/features/orders/components/OrderNotFound";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Order placed",
  // A confirmation is personal; keep it out of search results.
  robots: { index: false },
};

export default async function OrderSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const orderId = getSearchParam(await searchParams, "order");
  const order = orderId ? await getOrder(orderId) : null;
  // A message rather than a 404: the page itself exists, only the order in the link doesn't.
  if (!order) return <OrderNotFound />;
  // Not paid yet: the customer lands here only by an old link, so send them to pay.
  if (order.status === "payment-pending") redirect(`/checkout/payment?order=${order.id}`);

  return (
    <Container className="py-8 lg:py-12">
      <ClearCart />
      <OrderConfirmation order={order} />
    </Container>
  );
}
