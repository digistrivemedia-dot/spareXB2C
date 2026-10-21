import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ServiceJob } from "@/features/service/types";
import { serviceStageLabel, serviceStageTone } from "@/features/service/utils";
import { formatDay } from "@/lib/format";

type ServiceJobCardProps = {
  job: ServiceJob;
  vehicleName: string;
};

/** A booking or a service in progress; the whole card opens its details. */
export function ServiceJobCard({ job, vehicleName }: ServiceJobCardProps) {
  return (
    <Link
      href={`/account/services/${job.id}`}
      className="grid gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm outline-none hover:border-navy-200 focus-visible:ring-3 focus-visible:ring-ring/50 md:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-gray-900">
          {job.serviceType} · {vehicleName}
        </h3>
        <StatusBadge tone={serviceStageTone[job.stage]}>{serviceStageLabel[job.stage]}</StatusBadge>
      </div>
      <p className="text-sm text-gray-600">
        {job.garage.name} · {formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`))} ·{" "}
        {job.jobCardNumber}
      </p>
      <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-navy-700">
        View details
        <ChevronRight className="size-4" aria-hidden />
      </span>
    </Link>
  );
}
