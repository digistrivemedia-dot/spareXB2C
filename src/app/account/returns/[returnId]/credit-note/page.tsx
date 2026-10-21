import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { getOrder } from "@/features/orders/api";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { getReturn } from "@/features/returns/api";
import { SELLER } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Credit note", robots: { index: false } };

/** A printable credit note for a refunded return; "Download" uses the browser's Save as PDF. */
export default async function CreditNotePage({
  params,
}: PageProps<"/account/returns/[returnId]/credit-note">) {
  const request = await getReturn((await params).returnId);
  const order = request && (await getOrder(request.orderId));
  if (!request?.creditNote || !order) notFound();

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/account/returns/${request.id}`}
          className="text-sm font-semibold text-navy-700 hover:underline"
        >
          <ChevronLeft className="inline size-4 align-text-bottom" aria-hidden />
          Back to return
        </Link>
        <PrintButton label="Print or save as PDF" />
      </div>

      <Card aria-label="Credit note" className="grid gap-6 print:border-0 print:shadow-none">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="text-sm text-gray-700">
            <p className="text-lg font-semibold text-gray-900">{SELLER.name}</p>
            <p className="max-w-xs">{SELLER.address}</p>
            <p>GSTIN: {SELLER.gstin}</p>
          </div>
          <div className="text-sm text-gray-700 sm:text-right">
            <h1 className="text-xl font-semibold text-gray-900">Credit note</h1>
            <p>Credit note no. {request.creditNote.number}</p>
            <p>Date {formatDate(request.creditNote.issuedAt)}</p>
            <p>Against invoice {order.number}</p>
            <p>Return {request.number}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold text-gray-900">Issued to</h2>
          <OrderAddress address={order.billingAddress} />
          {order.gstin && <p className="mt-1 text-sm text-gray-700">GSTIN: {order.gstin}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-md text-sm">
            <caption className="sr-only">Returned items</caption>
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Item returned
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
              {request.items.map((item) => (
                <tr key={item.orderItemId}>
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

        <div className="grid gap-1 text-sm sm:ml-auto sm:w-80">
          <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
            <span>Total credited</span>
            <span className="tabular-nums">{formatPrice(request.refund.amountInPaise)}</span>
          </div>
          <p className="text-xs text-gray-500">
            Prices include GST. Refunded to {request.refund.to}
            {request.refund.reference && `, reference ${request.refund.reference}`}.
          </p>
        </div>
      </Card>
    </div>
  );
}
