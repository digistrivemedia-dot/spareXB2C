import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { getServiceJob } from "@/features/service/api";
import { JobPageHeader } from "@/features/service/components/JobPageHeader";
import type { InspectionFinding } from "@/features/service/types";
import { formatDateTime, formatKm } from "@/lib/format";

export const metadata: Metadata = { title: "Job card", robots: { index: false } };

const severity: Record<InspectionFinding["severity"], { label: string; tone: StatusTone }> = {
  urgent: { label: "Needs work now", tone: "danger" },
  attention: { label: "Keep an eye on", tone: "warning" },
  ok: { label: "OK", tone: "success" },
};

/** The vehicle's condition when the garage checked it in, with the mechanic's findings and photos. */
export default async function JobCardPage({
  params,
}: PageProps<"/account/services/[id]/job-card">) {
  const job = await getServiceJob((await params).id);
  if (!job?.checkIn) notFound();
  const { checkIn } = job;
  const facts = [
    { label: "Checked in", value: formatDateTime(checkIn.at) },
    { label: "Odometer", value: formatKm(checkIn.odometerKm) },
    { label: "Fuel", value: checkIn.fuelLevel },
    { label: "Service advisor", value: checkIn.advisorName },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <JobPageHeader job={job} title="Job card" />

      <Card aria-labelledby="check-in-heading" className="grid gap-4">
        <SectionHeader id="check-in-heading" title="Check-in" />
        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-0.5">
              <dt className="text-gray-500">{fact.label}</dt>
              <dd className="font-medium text-gray-900">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <p className="font-semibold text-gray-900">What you told us</p>
          <p className="text-gray-700">{checkIn.customerConcerns}</p>
        </div>
      </Card>

      <Card aria-labelledby="findings-heading">
        <SectionHeader id="findings-heading" title="Inspection" />
        <ul className="divide-y divide-gray-200">
          {checkIn.findings.map((finding) => (
            <li
              key={finding.id}
              className="flex flex-wrap items-start gap-x-4 gap-y-1 py-3 text-sm first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 basis-56">
                <p className="font-semibold text-gray-900">{finding.area}</p>
                <p className="text-gray-700">{finding.finding}</p>
              </div>
              <StatusBadge tone={severity[finding.severity].tone}>
                {severity[finding.severity].label}
              </StatusBadge>
            </li>
          ))}
        </ul>
      </Card>

      {checkIn.photos.length > 0 && (
        <Card aria-labelledby="inspection-photos-heading">
          <SectionHeader id="inspection-photos-heading" title="Inspection photos" />
          <ImageViewer photos={checkIn.photos} label="Inspection photos" />
        </Card>
      )}
    </div>
  );
}
