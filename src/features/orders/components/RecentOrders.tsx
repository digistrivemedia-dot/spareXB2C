import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import type { Order } from "@/features/orders/types";
import { formatDate, formatPrice } from "@/lib/format";

function describeItems(order: Order): string {
  const [first, ...rest] = order.items;
  return rest.length > 0 ? `${first.name} + ${rest.length} more` : first.name;
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card aria-labelledby="recent-orders-heading">
      <SectionHeader
        id="recent-orders-heading"
        title="Recent orders"
        link={orders.length > 0 ? { href: "/account/orders", label: "View all" } : undefined}
      />
      {orders.length > 0 ? (
        <ul className="-mx-2 divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-3 outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-gray-900">{order.number}</span>
                    <OrderStatusBadge status={order.status} />
                  </span>
                  <span className="mt-1 block truncate text-sm text-gray-600">
                    {describeItems(order)}
                  </span>
                  <span className="block text-xs text-gray-500">
                    Placed {formatDate(order.placedAt)}
                  </span>
                </span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {formatPrice(order.pricing.totalInPaise)}
                </span>
                <ChevronRight className="size-4 shrink-0 text-gray-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Package}
          titleAs="h3"
          title="No orders yet"
          description="Parts you order will show up here, with live delivery status."
          className="py-6"
        >
          <Button asChild>
            <Link href="/products">Start shopping</Link>
          </Button>
        </EmptyState>
      )}
    </Card>
  );
}
