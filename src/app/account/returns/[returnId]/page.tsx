import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Stepper } from "@/components/ui/Stepper";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { getReturn } from "@/features/returns/api";
import { ReturnRefundCard } from "@/features/returns/components/ReturnRefundCard";
import { ReturnStatusNotice } from "@/features/returns/components/ReturnStatusNotice";
import { getReturnProgress, returnStatusLabel, returnStatusTone } from "@/features/returns/utils";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Return status", robots: { index: false } };

export default async function ReturnPage({ params }: PageProps<"/account/returns/[returnId]">) {
  const request = await getReturn((await params).returnId);
  if (!request) notFound();
  const { steps, activeStep } = getReturnProgress(request);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[
          { label: "Orders", href: "/account/orders" },
          { label: request.orderNumber, href: `/account/orders/${request.orderId}` },
          { label: request.number },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Return {request.number}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Asked on {formatDate(request.createdAt)} · Order{" "}
            <Link
              href={`/account/orders/${request.orderId}`}
              className="font-semibold text-navy-700 hover:underline"
            >
              {request.orderNumber}
            </Link>
          </p>
        </div>
        <StatusBadge tone={returnStatusTone[request.status]}>
          {returnStatusLabel[request.status]}
        </StatusBadge>
      </div>

      <ReturnStatusNotice request={request} />

      <Card aria-labelledby="return-progress-heading">
        <SectionHeader id="return-progress-heading" title="Progress" />
        <Stepper steps={steps} activeStep={activeStep} label="Return progress" />
      </Card>

      <Card aria-labelledby="return-items-heading" className="grid gap-4">
        <SectionHeader id="return-items-heading" title="Parts" />
        <ul className="divide-y divide-gray-200">
          {request.items.map((item) => (
            <li
              key={item.orderItemId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <ProductImage
                image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
                sizes="56px"
                className="w-14 shrink-0 border border-gray-200"
              />
              <p className="min-w-0 flex-1 text-sm">
                <span className="line-clamp-2 font-medium text-gray-900">{item.name}</span>
                <span className="text-gray-600">
                  {formatPrice(item.unitPriceInPaise)} × {item.quantity}
                </span>
              </p>
              <p className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(item.unitPriceInPaise * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="grid gap-1 border-t border-gray-200 pt-4 text-sm">
          <p>
            <span className="font-semibold text-gray-900">Reason: </span>
            <span className="text-gray-700">{request.reason}</span>
          </p>
          {request.details && <p className="text-gray-700">{request.details}</p>}
        </div>
        {request.photos.length > 0 && (
          <ImageViewer photos={request.photos} label={`Photos sent with ${request.number}`} />
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card aria-labelledby="pickup-heading" className="grid content-start gap-3">
          <SectionHeader id="pickup-heading" title="Pickup" />
          <OrderAddress address={request.pickupAddress} />
          <p className="text-sm text-gray-700">
            {request.pickupOn
              ? `Pickup day: ${formatDate(request.pickupOn)}`
              : "We'll confirm the pickup day once the return is approved."}
          </p>
        </Card>
        <ReturnRefundCard request={request} />
      </div>
    </div>
  );
}
