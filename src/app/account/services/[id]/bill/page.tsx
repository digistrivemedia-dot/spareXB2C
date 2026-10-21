import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { getSession } from "@/features/auth/session";
import { getServiceJob } from "@/features/service/api";
import { estimateLineKindLabel } from "@/features/service/utils";
import { getMyVehicle } from "@/features/vehicles/api";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";
import { formatDate, formatKm, formatMobile, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Service bill", robots: { index: false } };

/** The garage's printable GST bill, in its own name; "Download" uses the browser's Save as PDF. */
export default async function ServiceBillPage({
  params,
}: PageProps<"/account/services/[id]/bill">) {
  const job = await getServiceJob((await params).id);
  if (!job?.bill) notFound();
  const [session, vehicle] = await Promise.all([getSession(), getMyVehicle(job.vehicleId)]);
  const { bill } = job;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/account/services/${job.id}`}
          className="text-sm font-semibold text-navy-700 hover:underline"
        >
          <ChevronLeft className="inline size-4 align-text-bottom" aria-hidden />
          Back to the booking
        </Link>
        <PrintButton label="Print or save as PDF" />
      </div>

      <Card aria-label="Tax invoice" className="grid gap-6 print:border-0 print:shadow-none">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="text-sm text-gray-700">
            <p className="text-lg font-semibold text-gray-900">{bill.garage.legalName}</p>
            <p className="max-w-xs">{bill.garage.address}</p>
            <p>GSTIN: {bill.garage.gstin}</p>
          </div>
          <div className="text-sm text-gray-700 sm:text-right">
            <h1 className="text-xl font-semibold text-gray-900">Tax invoice</h1>
            <p>Bill no. {bill.number}</p>
            <p>Date {formatDate(bill.issuedAt)}</p>
            <p>Job card {job.jobCardNumber}</p>
          </div>
        </div>

        <div className="grid gap-6 text-sm text-gray-700 sm:grid-cols-2">
          <div>
            <h2 className="mb-1 font-semibold text-gray-900">Billed to</h2>
            {session && (
              <>
                <p>{session.user.name}</p>
                <p>{formatMobile(session.user.mobile)}</p>
                {session.user.gstin && <p>GSTIN: {session.user.gstin}</p>}
              </>
            )}
          </div>
          {vehicle && (
            <div>
              <h2 className="mb-1 font-semibold text-gray-900">Vehicle</h2>
              <p>
                {getVehicleName(vehicle)} {vehicle.variantName} ({vehicle.year})
              </p>
              <p>{formatPlate(vehicle.registrationNumber)}</p>
              {job.completion && <p>Odometer {formatKm(job.completion.odometerKm)}</p>}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-md text-sm">
            <caption className="sr-only">Work and parts</caption>
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Description
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Type
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bill.lines.map((line) => (
                <tr key={line.description}>
                  <td className="py-2 pr-3 text-gray-900">{line.description}</td>
                  <td className="py-2 pr-3 text-gray-600">{estimateLineKindLabel[line.kind]}</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatPrice(line.amountInPaise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-1 text-sm sm:ml-auto sm:w-80">
          <div className="flex justify-between gap-4 text-gray-700">
            <span>Includes GST (18%)</span>
            <span className="tabular-nums">{formatPrice(bill.gstInPaise)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(bill.totalInPaise)}</span>
          </div>
          <p className="text-xs text-gray-500">
            {bill.payment.status === "paid"
              ? `Paid ${bill.payment.method === "online" ? "online" : "at the garage"}${bill.payment.paidAt ? ` on ${formatDate(bill.payment.paidAt)}` : ""}.`
              : "Not paid yet."}
          </p>
        </div>
      </Card>
    </div>
  );
}
