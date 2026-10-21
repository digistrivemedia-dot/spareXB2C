import { Clock, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Order } from "@/features/orders/types";
import { getPaymentLabel } from "@/features/orders/utils";
import { formatPrice } from "@/lib/format";

/** Explains an unpaid or cancelled order, including what happens to the money. */
export function OrderStatusNotice({ order }: { order: Order }) {
  if (order.status === "payment-pending") {
    return (
      <div
        role="status"
        className="flex flex-wrap items-center gap-3 rounded-xl border border-warning-500 bg-warning-50 p-4 text-sm"
      >
        <Clock className="size-5 shrink-0 text-warning-700" aria-hidden />
        <p className="flex-1 text-gray-900">
          <span className="font-semibold">Waiting for payment.</span> The order is placed as soon as
          you pay {formatPrice(order.pricing.totalInPaise)}.
        </p>
        <Button asChild size="sm">
          <Link href={`/checkout/payment?order=${order.id}`}>Complete payment</Link>
        </Button>
      </div>
    );
  }

  if (order.status === "cancelled") {
    const refund =
      order.payment.status === "refunded"
        ? `${formatPrice(order.pricing.totalInPaise)} is refunded to your ${getPaymentLabel(order.payment)} account within 5–7 working days.`
        : "No payment was taken.";
    return (
      <div
        role="status"
        className="flex gap-3 rounded-xl border border-danger-600 bg-danger-50 p-4 text-sm"
      >
        <XCircle className="mt-0.5 size-5 shrink-0 text-danger-700" aria-hidden />
        <div>
          <p className="font-semibold text-danger-700">This order was cancelled</p>
          {order.cancellationReason && (
            <p className="text-gray-700">Reason: {order.cancellationReason}</p>
          )}
          <p className="text-gray-700">{refund}</p>
        </div>
      </div>
    );
  }

  return null;
}
