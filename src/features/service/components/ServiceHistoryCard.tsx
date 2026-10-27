import { History } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ServiceRecord } from "@/features/service/types";
import { formatDate, formatKm, formatPrice } from "@/lib/format";

type ServiceHistoryCardProps = {
  vehicleId: string;
  /** Newest first, from any garage. */
  records: ServiceRecord[];
  /** For the "this year" summary. */
  year: number;
};

/** The vehicle's recent services across all garages as a timeline, with this year's count and spend. */
export function ServiceHistoryCard({ vehicleId, records, year }: ServiceHistoryCardProps) {
  const thisYear = records.filter((r) => r.completedOn.startsWith(String(year)));
  const spentThisYear = thisYear.reduce((sum, r) => sum + r.billTotalInPaise, 0);

  return (
    <Card aria-labelledby="service-history-heading" className="grid grid-cols-1 content-start">
      <SectionHeader
        id="service-history-heading"
        title="Service history"
        link={
          records.length > 0
            ? { href: `/account/vehicles/${vehicleId}/history`, label: "See all" }
            : undefined
        }
      />
      {records.length > 0 ? (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Services in {year}</dt>
              <dd className="text-lg font-semibold text-gray-900 tabular-nums">
                {thisYear.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Spent in {year}</dt>
              <dd className="text-lg font-semibold text-gray-900 tabular-nums">
                {formatPrice(spentThisYear)}
              </dd>
            </div>
          </dl>
          <ol className="grid grid-cols-1">
            {records.slice(0, 3).map((record) => (
              <li
                key={record.id}
                className="relative pl-6 before:absolute before:top-3 before:bottom-0 before:left-1 before:w-px before:bg-gray-200 last:before:hidden"
              >
                <span
                  className="absolute top-1.5 left-0 size-2.5 rounded-full border-2 border-navy-600 bg-white"
                  aria-hidden
                />
                <Link
                  href={`/account/services/${record.id}`}
                  className="-mx-2 block rounded-lg px-2 pb-3 text-sm hover:bg-gray-50"
                >
                  <span className="flex flex-wrap justify-between gap-x-3">
                    <span className="font-semibold text-gray-900">{record.serviceType}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatPrice(record.billTotalInPaise)}
                    </span>
                  </span>
                  <span className="block text-gray-600">
                    {formatDate(record.completedOn)} · {formatKm(record.odometerKm)} ·{" "}
                    {record.garage.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {record.workDone.join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <History className="size-4" aria-hidden />
          Services at any garage show here.
        </p>
      )}
    </Card>
  );
}
