import { Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stepper } from "@/components/ui/Stepper";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import { getOrder } from "@/features/orders/api";
import { OrderActions } from "@/features/orders/components/OrderActions";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { OrderPriceSummary } from "@/features/orders/components/OrderPriceSummary";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { OrderStatusNotice } from "@/features/orders/components/OrderStatusNotice";
import { getOrderProgress, getPaymentLabel, isSameAddress } from "@/features/orders/utils";
import { OrderReturnsCard } from "@/features/returns/components/OrderReturnsCard";
import { formatDate, formatPrice, toIndianIsoDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/account/orders/[orderId]">): Promise<Metadata> {
  const order = await getOrder((await params).orderId);
  return { title: order ? `Order ${order.number}` : "Order not found" };
}

export default async function OrderDetailsPage({ params }: PageProps<"/account/orders/[orderId]">) {
  const order = await getOrder((await params).orderId);
  if (!order) notFound();
  // "Can I still return this?" depends on today's date, so the page is rendered per request.
  await connection();

  const { steps, activeStep } = getOrderProgress(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const sameBilling = isSameAddress(order.billingAddress, order.deliveryAddress);
  const paymentStatus = {
    paid: "Paid",
    pending:
      order.payment.method === "cod"
        ? `Pay ${formatPrice(order.pricing.totalInPaise)} on delivery`
        : "Not paid yet",
    failed: "Payment failed",
    refunded: "Refunded",
  }[order.payment.status];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[
          { label: "My account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: order.number },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Order {order.number}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Placed {formatDate(order.placedAt)}
            {order.vehicle && ` · For your ${order.vehicle.name}`}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderStatusNotice order={order} />

      <Card aria-labelledby="order-progress-heading">
        <SectionHeader id="order-progress-heading" title="Order status" />
        <Stepper steps={steps} activeStep={activeStep} label="Order progress" />
        {(order.tracking || (order.expectedDeliveryOn && order.status !== "delivered")) && (
          <p className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 text-sm text-gray-700">
            <Truck className="size-5 text-navy-700" aria-hidden />
            {order.expectedDeliveryOn && order.status !== "delivered" && (
              <span>
                Arriving by{" "}
                <span className="font-semibold text-gray-900">
                  {formatDate(order.expectedDeliveryOn)}
                </span>
              </span>
            )}
            {order.tracking && (
              <span>
                · {order.tracking.courier}, tracking no. {order.tracking.trackingNumber}
              </span>
            )}
          </p>
        )}
      </Card>

      <Card aria-labelledby="order-items-heading">
        <SectionHeader id="order-items-heading" title="Items" />
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <ProductImage
                image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
                sizes="64px"
                className="w-16 shrink-0 border border-gray-200"
              />
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {item.brandName}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-2 font-medium text-gray-900 hover:text-navy-700 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-gray-600">
                  {formatPrice(item.unitPriceInPaise)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(item.unitPriceInPaise * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card aria-labelledby="order-address-heading" className="grid content-start gap-4">
          <SectionHeader id="order-address-heading" title="Delivery address" />
          <OrderAddress address={order.deliveryAddress} />
          {!sameBilling && (
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900">Billing address</h3>
              <OrderAddress address={order.billingAddress} />
            </div>
          )}
          {order.gstin && <p className="text-sm text-gray-700">GSTIN: {order.gstin}</p>}
        </Card>
        <Card aria-labelledby="order-payment-heading" className="grid content-start gap-4">
          <SectionHeader id="order-payment-heading" title="Payment" />
          <p className="text-sm text-gray-700">
            {getPaymentLabel(order.payment)} ·{" "}
            <span className="font-semibold text-gray-900">{paymentStatus}</span>
          </p>
          <OrderPriceSummary pricing={order.pricing} itemCount={itemCount} />
        </Card>
      </div>

      <OrderReturnsCard returns={order.returns} />

      <OrderActions order={order} today={toIndianIsoDate(new Date())} />
    </div>
  );
}
