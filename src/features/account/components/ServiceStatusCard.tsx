import { CalendarPlus, ClipboardList, Phone, Wrench } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Stepper } from "@/components/ui/Stepper";
import type { ServiceJob } from "@/features/service/types";
import {
  getEstimateTotal,
  getPendingEstimate,
  getServiceProgress,
  serviceStageLabel,
  serviceStageTone,
} from "@/features/service/utils";
import { formatDateTime, formatPrice } from "@/lib/format";

type ServiceStatusCardProps = {
  vehicleId: string;
  job: ServiceJob | null;
  /** "In 2,580 km or 44 days", shown when nothing is open. */
  nextServiceText: string | null;
};

/** What the customer can do on this job right now, if anything. */
function getJobAction(job: ServiceJob): { label: string; href: string } | null {
  const base = `/account/services/${job.id}`;
  if (job.stage === "awaiting-approval") {
    const estimate = getPendingEstimate(job);
    const total = estimate ? ` · ${formatPrice(getEstimateTotal(estimate))}` : "";
    return { label: `Review estimate${total}`, href: `${base}/estimate` };
  }
  const isUnpaid = job.bill?.payment.status === "unpaid";
  if ((job.stage === "ready" || job.stage === "out-for-drop") && isUnpaid) {
    return { label: "Pay bill", href: `${base}/pay` };
  }
  return null;
}

/** The open booking: a header line, its progress, and a footer with ready time and contacts. A slim line when nothing is open. */
export function ServiceStatusCard({ vehicleId, job, nextServiceText }: ServiceStatusCardProps) {
  if (!job) {
    return (
      <Card className="flex flex-wrap items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <Wrench className="size-5" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 text-sm text-gray-700">
          <span className="block font-semibold text-gray-900">No service in progress</span>
          {nextServiceText
            ? `Next service ${nextServiceText.toLowerCase()}.`
            : "Book one when you need it."}
        </p>
        <Button asChild variant="secondary" size="sm">
          <Link href={`/services/book?vehicle=${vehicleId}`}>
            <CalendarPlus aria-hidden />
            Book a service
          </Link>
        </Button>
      </Card>
    );
  }

  const { steps, activeStep } = getServiceProgress(job);
  const action = getJobAction(job);

  return (
    <Card aria-labelledby="service-status-heading" className="grid grid-cols-1 gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="service-status-heading"
              className="text-lg font-semibold text-gray-900 md:text-xl"
            >
              Your service
            </h2>
            <StatusBadge tone={serviceStageTone[job.stage]}>
              {serviceStageLabel[job.stage]}
            </StatusBadge>
          </div>
          <p className="text-sm text-gray-600">
            {job.serviceType} · {job.garage.name}
            {job.pickupDrop && " · Pick and drop"}
          </p>
        </div>
        {action && (
          <Button asChild variant="secondary" size="sm">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>

      <Stepper
        steps={steps}
        activeStep={activeStep}
        activeTone={job.stage === "awaiting-approval" ? "attention" : "progress"}
        doneTone="success"
        label="Service progress"
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-200 pt-4 text-sm">
        {job.expectedReadyAt && (
          <p className="mr-auto text-gray-600">
            Expected ready{" "}
            <span className="font-semibold text-gray-900">
              {formatDateTime(job.expectedReadyAt)}
            </span>
          </p>
        )}
        <a
          href={`tel:+91${job.garage.phone}`}
          className="inline-flex items-center gap-1.5 font-semibold text-navy-700 hover:underline"
        >
          <Phone className="size-4" aria-hidden />
          Call garage
        </a>
        <Link
          href={`/account/services/${job.id}/job-card`}
          className="inline-flex items-center gap-1.5 font-semibold text-navy-700 hover:underline"
        >
          <ClipboardList className="size-4" aria-hidden />
          Job card
        </Link>
      </div>
    </Card>
  );
}
