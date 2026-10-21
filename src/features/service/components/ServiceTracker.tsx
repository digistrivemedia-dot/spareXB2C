import { MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stepper } from "@/components/ui/Stepper";
import type { ServiceJob } from "@/features/service/types";
import { getServiceProgress } from "@/features/service/utils";
import { formatDateTime, formatDay } from "@/lib/format";

/** Live progress of the service in the garage right now. */
export function ServiceTracker({ job }: { job: ServiceJob }) {
  const { steps, activeStep } = getServiceProgress(job);
  const isWaitingForCustomer = job.stage === "awaiting-approval";
  const isRequested = job.stage === "requested";

  return (
    <Card aria-labelledby="service-tracker-heading">
      <SectionHeader
        id="service-tracker-heading"
        title={isRequested ? "Booking sent" : "Service in progress"}
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-700">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-4 text-gray-500" aria-hidden />
          {job.garage.name} · {job.serviceType}
        </p>
        {isRequested && (
          <p>
            Waiting for the garage to confirm{" "}
            <span className="font-semibold text-gray-900">
              {formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`))}
            </span>
          </p>
        )}
        {job.expectedReadyAt && (
          <p>
            Expected ready by{" "}
            <span className="font-semibold text-gray-900">
              {formatDateTime(job.expectedReadyAt)}
            </span>
          </p>
        )}
      </div>

      <Stepper
        steps={steps}
        activeStep={activeStep}
        activeTone={isWaitingForCustomer ? "attention" : "progress"}
        label="Service progress"
      />

      <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/account/services/${job.id}`}>View job card · {job.jobCardNumber}</Link>
        </Button>
      </div>
    </Card>
  );
}
