import { RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOrder } from "@/features/orders/api";
import { canReturn } from "@/features/orders/utils";
import { ReturnForm } from "@/features/returns/components/ReturnForm";
import { formatDate, toIndianIsoDate } from "@/lib/format";

export const metadata: Metadata = { title: "Return items", robots: { index: false } };

export default async function ReturnRequestPage({
  params,
}: PageProps<"/account/orders/[orderId]/return">) {
  const order = await getOrder((await params).orderId);
  if (!order) notFound();
  // Whether the return window is still open depends on today's date.
  await connection();
  const orderHref = `/account/orders/${order.id}`;

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[
          { label: "Orders", href: "/account/orders" },
          { label: order.number, href: orderHref },
          { label: "Return items" },
        ]}
      />
      <PageHeader
        title="Return items"
        description={
          order.returnableUntil
            ? `Order ${order.number} · Returns accepted until ${formatDate(order.returnableUntil)}`
            : `Order ${order.number}`
        }
      />
      {canReturn(order, toIndianIsoDate(new Date())) ? (
        <ReturnForm order={order} />
      ) : (
        <EmptyState
          icon={RotateCcw}
          title="This order can't be returned now"
          description="The return window has closed, or every part is already being returned. Call us if something is wrong."
        >
          <Button asChild>
            <Link href={orderHref}>Back to the order</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
