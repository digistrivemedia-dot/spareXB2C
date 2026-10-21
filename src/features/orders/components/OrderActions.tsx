import { CircleHelp, FileText, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CancelOrderDialog } from "@/features/orders/components/CancelOrderDialog";
import type { Order } from "@/features/orders/types";
import { canCancel, canReturn } from "@/features/orders/utils";
import { formatDate } from "@/lib/format";

type OrderActionsProps = {
  order: Order;
  /** The date in India, "YYYY-MM-DD", to check the return window. */
  today: string;
};

/** What the customer can do with this order right now. */
export function OrderActions({ order, today }: OrderActionsProps) {
  const hasInvoice = order.status !== "cancelled" && order.status !== "payment-pending";

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        {hasInvoice && (
          <Button asChild variant="secondary">
            <Link href={`/account/orders/${order.id}/invoice`}>
              <FileText aria-hidden />
              Download invoice
            </Link>
          </Button>
        )}
        {canCancel(order) && <CancelOrderDialog orderId={order.id} orderNumber={order.number} />}
        {canReturn(order, today) && (
          <Button asChild variant="secondary">
            <Link href={`/account/orders/${order.id}/return`}>
              <RotateCcw aria-hidden />
              Return items
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link href="/account/help">
            <CircleHelp aria-hidden />
            Need help?
          </Link>
        </Button>
      </div>
      {order.status === "delivered" && order.returnableUntil && (
        <p className="text-sm text-gray-600">
          {today > order.returnableUntil
            ? `The return window closed on ${formatDate(order.returnableUntil)}.`
            : `Returns accepted until ${formatDate(order.returnableUntil)}.`}
        </p>
      )}
    </div>
  );
}
