import { CalendarClock, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getServiceJob } from "@/features/service/api";
import { JobPageHeader } from "@/features/service/components/JobPageHeader";
import { formatDate, formatDateTime, formatKm, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Completion report", robots: { index: false } };

/** What the garage did, the parts it fitted, and when the vehicle needs its next service. */
export default async function CompletionReportPage({
  params,
}: PageProps<"/account/services/[id]/report">) {
  const job = await getServiceJob((await params).id);
  if (!job?.completion) notFound();
  const report = job.completion;

  return (
    <div className="grid grid-cols-1 gap-6">
      <JobPageHeader
        job={job}
        title="Completion report"
        description={`Finished ${formatDateTime(report.completedAt)} · ${formatKm(report.odometerKm)}`}
        action={
          job.bill && (
            <Button asChild variant="secondary">
              <Link href={`/account/services/${job.id}/bill`}>View bill</Link>
            </Button>
          )
        }
      />

      <Card aria-labelledby="work-done-heading">
        <SectionHeader id="work-done-heading" title="Work done" />
        <ul className="grid gap-2 text-sm text-gray-700">
          {report.workDone.map((work) => (
            <li key={work} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden />
              {work}
            </li>
          ))}
        </ul>
        {report.mechanicNotes && (
          <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Mechanic&apos;s note: </span>
            {report.mechanicNotes}
          </p>
        )}
      </Card>

      {report.partsUsed.length > 0 && (
        <Card aria-labelledby="parts-used-heading">
          <SectionHeader id="parts-used-heading" title="Parts used" />
          <ul className="divide-y divide-gray-200 text-sm">
            {report.partsUsed.map((part) => (
              <li key={part.name} className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
                <span className="text-gray-900">
                  {part.name} <span className="text-gray-500">× {part.quantity}</span>
                </span>
                <span className="tabular-nums">{formatPrice(part.amountInPaise)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card aria-label="Next service" className="flex items-start gap-3">
        <CalendarClock className="mt-0.5 size-6 shrink-0 text-navy-700" aria-hidden />
        <div className="text-sm">
          <p className="font-semibold text-gray-900">Next service</p>
          <p className="text-gray-700">
            By {formatDate(report.nextService.dueOn)} or at {formatKm(report.nextService.dueAtKm)},
            whichever comes first.
          </p>
        </div>
      </Card>
    </div>
  );
}
