import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/features/catalog/components/ProductImage";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import type { Order } from "@/features/orders/types";
import { formatDate, formatPrice } from "@/lib/format";

const MAX_THUMBNAILS = 4;

/** One order in the list; the whole card opens the order. */
export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const extra = order.items.length - MAX_THUMBNAILS;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-navy-200">
      <Link
        href={`/account/orders/${order.id}`}
        className="grid gap-3 rounded-xl p-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-900">{order.number}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-600">
          Placed {formatDate(order.placedAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
          {order.status !== "delivered" && order.expectedDeliveryOn && (
            <> · Arriving by {formatDate(order.expectedDeliveryOn)}</>
          )}
        </p>
        <div className="flex items-center justify-between gap-4">
          <ul className="flex items-center gap-2" aria-label="Items">
            {order.items.slice(0, MAX_THUMBNAILS).map((item) => (
              <li key={item.id} className="w-12 sm:w-14">
                <ProductImage
                  image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
                  sizes="56px"
                  className="border border-gray-200"
                />
                <span className="sr-only">{item.name}</span>
              </li>
            ))}
            {extra > 0 && <li className="text-sm font-medium text-gray-600">+{extra} more</li>}
          </ul>
          <span className="flex items-center gap-2 font-semibold text-gray-900 tabular-nums">
            {formatPrice(order.pricing.totalInPaise)}
            <ChevronRight className="size-4 text-gray-400" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
