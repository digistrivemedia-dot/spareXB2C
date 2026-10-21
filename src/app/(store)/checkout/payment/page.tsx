import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { getSession } from "@/features/auth/session";
import { getOrder } from "@/features/orders/api";
import { OrderNotFound } from "@/features/orders/components/OrderNotFound";
import { PaymentRetry } from "@/features/payments/components/PaymentRetry";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Payment",
  // A payment page is personal; keep it out of search results.
  robots: { index: false },
};

export default async function PaymentPage({ searchParams }: PageProps<"/checkout/payment">) {
  const orderId = getSearchParam(await searchParams, "order");
  if (!(await getSession())) redirect(`/login?next=/checkout/payment?order=${orderId ?? ""}`);
  const order = orderId ? await getOrder(orderId) : null;
  // A message rather than a 404: the page itself exists, only the order in the link doesn't.
  if (!order) return <OrderNotFound />;
  // Paid already (for example in another tab), or no longer payable.
  if (order.payment.status === "paid") redirect(`/checkout/success?order=${order.id}`);
  if (order.status !== "payment-pending") redirect(`/account/orders/${order.id}`);

  return (
    <Container className="py-8 lg:py-12">
      <PaymentRetry order={order} />
    </Container>
  );
}
