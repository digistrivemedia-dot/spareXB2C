import { Clock, CircleX, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { Order } from "@/features/orders/types";
import { RetryPaymentButton } from "@/features/payments/components/RetryPaymentButton";
import { SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile, formatPrice } from "@/lib/format";

/** An order waiting for its online payment: why the last try failed, and a way to pay again. */
export function PaymentRetry({ order }: { order: Order }) {
  const hasFailed = order.payment.status === "failed";
  const Icon = hasFailed ? CircleX : Clock;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto grid w-full max-w-xl gap-6">
      <Card
        aria-labelledby="payment-heading"
        className="grid justify-items-center gap-4 py-8 text-center"
      >
        <Icon
          className={hasFailed ? "size-14 text-danger-700" : "size-14 text-warning-700"}
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 id="payment-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
          {hasFailed ? "Your payment didn't go through" : "Complete your payment"}
        </h1>
        {order.payment.failureReason && (
          <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
            {order.payment.failureReason}
          </p>
        )}
        <p className="max-w-md text-sm text-gray-600">
          Your order is saved and will be placed as soon as you pay. No money was taken; if your
          bank did take any, it goes back to your account automatically.
        </p>
        <div className="grid w-full max-w-sm gap-3">
          <RetryPaymentButton orderId={order.id} amountInPaise={order.pricing.totalInPaise} />
          <Button asChild variant="secondary" size="lg">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </div>
      </Card>

      <Card aria-label="Order" className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Order</span>
          <span className="font-semibold text-gray-900">{order.number}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-semibold text-gray-900 tabular-nums">
            {formatPrice(order.pricing.totalInPaise)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Deliver to</span>
          <span className="text-right text-gray-900">
            {order.deliveryAddress.area}, {order.deliveryAddress.city}
          </span>
        </div>
      </Card>

      <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-gray-600">
        <Phone className="size-4" aria-hidden />
        Problem paying? Call us on
        <a href={`tel:+91${SUPPORT_PHONE}`} className="font-semibold text-navy-700 hover:underline">
          {formatMobile(SUPPORT_PHONE)}
        </a>
      </p>
    </div>
  );
}
