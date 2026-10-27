import { CalendarPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { NextServiceDue, ServicePackage, ServiceRecord } from "@/features/service/types";
import { getServiceDueProgress } from "@/features/service/utils";
import { formatDate, formatKm, formatPrice } from "@/lib/format";

/** Past this share of the service interval, the ring turns orange. */
const DUE_SOON_PERCENT = 85;

type ServiceHealthCardProps = {
  vehicleId: string;
  odometerKm: number;
  nextService: NextServiceDue | null;
  lastVisit: ServiceRecord | null;
  /** The model's routine package, suggested for the next service; null until the admin sets one. */
  duePackage: ServicePackage | null;
  today: Date;
};

/**
 * How close the next service is (a ring of the interval used), the last visit, the package due next, and one
 * button to book it.
 */
export function ServiceHealthCard({
  vehicleId,
  odometerKm,
  nextService,
  lastVisit,
  duePackage,
  today,
}: ServiceHealthCardProps) {
  const due = nextService && getServiceDueProgress(nextService, odometerKm, lastVisit, today);

  return (
    <Card aria-labelledby="service-health-heading" className="flex flex-col gap-3.5">
      <h2 id="service-health-heading" className="text-lg font-semibold text-gray-900">
        Service health
      </h2>

      <div className="flex items-center gap-5">
        {nextService && due ? (
          <>
            <ProgressRing
              percent={due.percent}
              label="Service interval used"
              barClassName={
                due.percent >= DUE_SOON_PERCENT ? "stroke-orange-600" : "stroke-success-600"
              }
              className="size-24"
            >
              <span className="block text-lg font-bold text-gray-900 tabular-nums">
                {due.kmLeft.toLocaleString("en-IN")}
              </span>
              <span className="block text-xs text-gray-500">km left</span>
            </ProgressRing>
            <p className="text-sm text-gray-600">
              <span className="block font-semibold text-gray-900">Next service</span>
              in <span className="font-semibold text-gray-900">{due.daysLeft} days</span>
              <span className="block text-xs text-gray-500">
                <span className="whitespace-nowrap">by {formatDate(nextService.dueOn)}</span>{" "}
                <span className="whitespace-nowrap">or {formatKm(nextService.dueAtKm)}</span>
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            <span className="block font-semibold text-gray-900">Next service</span>
            Shows here after the first service with us.
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-3 text-sm">
        {lastVisit ? (
          <>
            <p className="text-gray-500">
              Last service{" "}
              <span className="font-semibold text-gray-900">
                {formatDate(lastVisit.completedOn)} · {formatPrice(lastVisit.billTotalInPaise)}
              </span>
            </p>
            <p className="truncate text-gray-600">{lastVisit.garage.name}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 font-semibold text-navy-700">
              <Link href={`/account/services/${lastVisit.id}/bill`} className="hover:underline">
                View bill
              </Link>
              {!lastVisit.isRated && (
                <Link href={`/account/services/${lastVisit.id}`} className="hover:underline">
                  Rate your visit
                </Link>
              )}
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Last service <span className="text-gray-600">none yet</span>
          </p>
        )}
      </div>

      <div className="mt-auto grid gap-3">
        {duePackage && (
          <p className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
            <span className="min-w-0">
              <span className="block text-xs text-gray-500">Due next</span>
              <span className="block truncate font-semibold text-gray-900">{duePackage.name}</span>
            </span>
            <span className="font-semibold text-gray-900 tabular-nums">
              {formatPrice(duePackage.priceInPaise)}
            </span>
          </p>
        )}
        <Button asChild className="w-full">
          <Link
            href={`/services/book?vehicle=${vehicleId}${duePackage ? `&package=${duePackage.id}` : ""}`}
          >
            <CalendarPlus aria-hidden />
            {duePackage ? "Book this service" : "Book a service"}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
