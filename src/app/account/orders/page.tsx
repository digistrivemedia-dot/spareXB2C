import { Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { TabLinks } from "@/components/ui/TabLinks";
import { getOrders } from "@/features/orders/api";
import { OrderCard } from "@/features/orders/components/OrderCard";
import type { OrderGroup } from "@/features/orders/types";
import { orderTabs } from "@/features/orders/utils";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = { title: "My orders" };

const PAGE_SIZE = 10;

const emptyCopy: Record<OrderGroup, string> = {
  all: "Parts you order will show up here, with live delivery status.",
  active: "You have no orders on the way right now.",
  delivered: "Orders show up here once they're delivered.",
  cancelled: "You haven't cancelled or returned any orders.",
};

function ordersHref(group: OrderGroup, page = 1): string {
  const params = new URLSearchParams();
  if (group !== "all") params.set("tab", group);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/account/orders?${query}` : "/account/orders";
}

export default async function OrdersPage({ searchParams }: PageProps<"/account/orders">) {
  const params = await searchParams;
  const tab = orderTabs.find((t) => t.group === getSearchParam(params, "tab"))?.group ?? "all";
  const page = Math.max(Number(getSearchParam(params, "page")) || 1, 1);
  const orders = await getOrders({ group: tab, page, pageSize: PAGE_SIZE });

  return (
    <div className="grid grid-cols-1 gap-6">
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">My orders</h1>
      <TabLinks
        label="Order status"
        tabs={orderTabs.map(({ group, label }) => ({
          href: ordersHref(group),
          label,
          isActive: group === tab,
        }))}
      />
      {orders.items.length > 0 ? (
        <>
          <ul className="grid gap-4">
            {orders.items.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
          <Pagination
            page={orders.page}
            totalPages={Math.ceil(orders.total / orders.pageSize)}
            hrefForPage={(p) => ordersHref(tab, p)}
          />
        </>
      ) : (
        <EmptyState icon={Package} title="No orders here" description={emptyCopy[tab]}>
          <Button asChild>
            <Link href="/products">Shop parts</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
