import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { getOrder } from "@/features/orders/api";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { OrderPriceSummary } from "@/features/orders/components/OrderPriceSummary";
import { getPaymentLabel } from "@/features/orders/utils";
import { SELLER } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Invoice", robots: { index: false } };

/** A printable invoice; "Download" uses the browser's Save as PDF. */
export default async function InvoicePage({
  params,
}: PageProps<"/account/orders/[orderId]/invoice">) {
  const order = await getOrder((await params).orderId);
  if (!order || order.status === "cancelled") notFound();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/account/orders/${order.id}`}
          className="text-sm font-semibold text-navy-700 hover:underline"
        >
          <ChevronLeft className="inline size-4 align-text-bottom" aria-hidden />
          Back to order
        </Link>
        <PrintButton label="Print or save as PDF" />
      </div>

      <Card aria-label="Tax invoice" className="grid gap-6 print:border-0 print:shadow-none">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="text-sm text-gray-700">
            <p className="text-lg font-semibold text-gray-900">{SELLER.name}</p>
            <p className="max-w-xs">{SELLER.address}</p>
            <p>GSTIN: {SELLER.gstin}</p>
          </div>
          <div className="text-sm text-gray-700 sm:text-right">
            <h1 className="text-xl font-semibold text-gray-900">Tax invoice</h1>
            <p>Invoice no. {order.number}</p>
            <p>Date {formatDate(order.placedAt)}</p>
            <p>Payment: {getPaymentLabel(order.payment)}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-1 text-sm font-semibold text-gray-900">Bill to</h2>
            <OrderAddress address={order.billingAddress} />
            {order.gstin && <p className="mt-1 text-sm text-gray-700">GSTIN: {order.gstin}</p>}
          </div>
          <div>
            <h2 className="mb-1 text-sm font-semibold text-gray-900">Ship to</h2>
            <OrderAddress address={order.deliveryAddress} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-md text-sm">
            <caption className="sr-only">Items</caption>
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Item
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">
                  Qty
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">
                  Rate
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pr-3 text-gray-900">{item.name}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatPrice(item.unitPriceInPaise)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {formatPrice(item.unitPriceInPaise * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:ml-auto sm:w-80">
          <OrderPriceSummary pricing={order.pricing} itemCount={itemCount} />
        </div>
      </Card>
    </div>
  );
}
