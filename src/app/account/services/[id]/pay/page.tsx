import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { PriceRow } from "@/components/ui/PriceRow";
import { getServiceJob } from "@/features/service/api";
import { JobPageHeader } from "@/features/service/components/JobPageHeader";
import { ServicePaymentOptions } from "@/features/service/components/ServicePaymentOptions";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Pay for your service", robots: { index: false } };

export default async function ServicePaymentPage({
  params,
}: PageProps<"/account/services/[id]/pay">) {
  const job = await getServiceJob((await params).id);
  if (!job?.bill) notFound();
  const { bill } = job;
  const isPaid = bill.payment.status === "paid";

  return (
    <div className="grid grid-cols-1 gap-6">
      <JobPageHeader job={job} title={isPaid ? "Payment" : "Pay for your service"} />

      <Card aria-label="Bill summary" className="grid max-w-2xl gap-5">
        <dl className="grid gap-2 text-sm">
          {bill.lines.map((line) => (
            <PriceRow
              key={line.description}
              label={line.description}
              value={formatPrice(line.amountInPaise)}
            />
          ))}
          <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(bill.totalInPaise)}</dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500">
          Includes {formatPrice(bill.gstInPaise)} GST. The bill is in {bill.garage.legalName}&apos;s
          name.{" "}
          <Link
            href={`/account/services/${job.id}/bill`}
            className="font-semibold text-navy-700 hover:underline"
          >
            View the bill
          </Link>
        </p>

        {isPaid ? (
          <p className="flex items-start gap-2 rounded-lg bg-success-50 p-3 text-sm text-success-700">
            <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              Paid {bill.payment.method === "online" ? "online" : "at the garage"}
              {bill.payment.paidAt && ` on ${formatDateTime(bill.payment.paidAt)}`}
              {bill.payment.reference && ` · Ref. ${bill.payment.reference}`}
            </span>
          </p>
        ) : (
          <ServicePaymentOptions jobId={job.id} bill={bill} />
        )}
      </Card>

      {isPaid && (
        <Button asChild variant="secondary" className="w-fit">
          <Link href={`/account/services/${job.id}`}>Back to the booking</Link>
        </Button>
      )}
    </div>
  );
}
