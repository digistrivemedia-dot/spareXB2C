import { RotateCcw, XCircle } from "lucide-react";

import type { Order } from "@/features/orders/types";
import { paymentMethodLabel } from "@/features/orders/utils";
import { formatPrice } from "@/lib/format";

/** Explains a cancelled order or a pending return, including what happens to the money. */
export function OrderStatusNotice({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    const refund =
      order.payment.status === "refunded"
        ? `${formatPrice(order.pricing.totalInPaise)} is refunded to your ${paymentMethodLabel[order.payment.method]} account within 5–7 working days.`
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

  if (order.status === "return-requested") {
    return (
      <div
        role="status"
        className="flex gap-3 rounded-xl border border-warning-500 bg-warning-50 p-4 text-sm"
      >
        <RotateCcw className="mt-0.5 size-5 shrink-0 text-warning-700" aria-hidden />
        <div>
          <p className="font-semibold text-gray-900">Return requested</p>
          {order.cancellationReason && (
            <p className="text-gray-700">Reason: {order.cancellationReason}</p>
          )}
          <p className="text-gray-700">
            We&apos;ll call you to arrange the pickup. Your refund starts once the parts are
            checked.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
