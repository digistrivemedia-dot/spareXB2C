import { Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Stepper } from "@/components/ui/Stepper";
import { getServiceJob } from "@/features/service/api";
import { CancelBookingDialog } from "@/features/service/components/CancelBookingDialog";
import { RateVisitDialog } from "@/features/service/components/RateVisitDialog";
import { ServiceJobDocuments } from "@/features/service/components/ServiceJobDocuments";
import { ServiceJobNotice } from "@/features/service/components/ServiceJobNotice";
import {
  canCancelBooking,
  getServiceProgress,
  serviceStageLabel,
  serviceStageTone,
} from "@/features/service/utils";
import { getMyVehicle } from "@/features/vehicles/api";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";
import { formatDay, formatMobile } from "@/lib/format";

export const metadata: Metadata = { title: "Booking", robots: { index: false } };

export default async function ServiceJobPage({ params }: PageProps<"/account/services/[id]">) {
  const job = await getServiceJob((await params).id);
  if (!job) notFound();
  const vehicle = await getMyVehicle(job.vehicleId);
  const isClosed = job.stage === "declined" || job.stage === "cancelled";
  const canRate = job.stage === "delivered" && !job.review && job.completion;
  const { steps, activeStep } = getServiceProgress(job);
  const rows = [
    {
      label: "Vehicle",
      value: vehicle
        ? `${getVehicleName(vehicle)} · ${formatPlate(vehicle.registrationNumber)}`
        : "Removed vehicle",
    },
    { label: "Service", value: job.serviceType },
    { label: "Day", value: formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`)) },
    ...(job.notes ? [{ label: "Your note", value: job.notes }] : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[{ label: "My services", href: "/account/services" }, { label: job.jobCardNumber }]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{job.serviceType}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {job.jobCardNumber} ·{" "}
            <Link
              href={`/services/garages/${job.garage.slug}`}
              className="font-semibold text-navy-700 hover:underline"
            >
              {job.garage.name}
            </Link>
          </p>
        </div>
        <StatusBadge tone={serviceStageTone[job.stage]}>{serviceStageLabel[job.stage]}</StatusBadge>
      </div>

      <ServiceJobNotice job={job} />

      {!isClosed && (
        <Card aria-labelledby="job-progress-heading">
          <SectionHeader id="job-progress-heading" title="Progress" />
          <Stepper
            steps={steps}
            activeStep={activeStep}
            activeTone={job.stage === "awaiting-approval" ? "attention" : "progress"}
            label="Service progress"
          />
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card aria-labelledby="job-details-heading" className="grid content-start gap-4">
          <SectionHeader id="job-details-heading" title="Booking" />
          <dl className="grid gap-3 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-0.5">
                <dt className="text-gray-500">{row.label}</dt>
                <dd className="font-medium text-gray-900">{row.value}</dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="secondary" size="sm" className="w-fit">
            <a href={`tel:+91${job.garage.phone}`}>
              <Phone aria-hidden />
              Call the garage · {formatMobile(job.garage.phone)}
            </a>
          </Button>
        </Card>
        <ServiceJobDocuments job={job} />
      </div>

      {(canRate || canCancelBooking(job)) && (
        <div className="flex flex-wrap gap-3">
          {canRate && job.completion && (
            <RateVisitDialog
              jobId={job.id}
              garageName={job.garage.name}
              visitDate={job.completion.completedAt}
            />
          )}
          {canCancelBooking(job) && <CancelBookingDialog jobId={job.id} />}
        </div>
      )}
    </div>
  );
}
