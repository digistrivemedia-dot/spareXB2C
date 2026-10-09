import { CircleHelp, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OrderActionDialog } from "@/features/orders/components/OrderActionDialog";
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
  const hasInvoice = order.status !== "cancelled";

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
        {canCancel(order) && (
          <OrderActionDialog kind="cancel" orderId={order.id} orderNumber={order.number} />
        )}
        {canReturn(order, today) && (
          <OrderActionDialog kind="return" orderId={order.id} orderNumber={order.number} />
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
          {canReturn(order, today)
            ? `Returns accepted until ${formatDate(order.returnableUntil)}.`
            : `The return window closed on ${formatDate(order.returnableUntil)}.`}
        </p>
      )}
    </div>
  );
}
