import type { ServiceRecord } from "@/features/service/types";
import { formatDate, formatKm, formatPrice } from "@/lib/format";

type ServiceRecordRowProps = {
  record: ServiceRecord;
  vehicleName: string;
};

/** One finished service: when, where, what was done and what it cost. */
export function ServiceRecordRow({ record, vehicleName }: ServiceRecordRowProps) {
  return (
    <div className="grid gap-1 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-gray-900">
          {record.serviceType} · {vehicleName}
        </p>
        <p className="font-semibold text-gray-900 tabular-nums">
          {formatPrice(record.billTotalInPaise)}
        </p>
      </div>
      <p className="text-gray-600">
        {formatDate(record.completedOn)} · {record.garage.name} · {formatKm(record.odometerKm)}
      </p>
      <p className="text-gray-700">{record.workDone.join(", ")}</p>
      <p className="text-xs text-gray-500">Bill {record.billNumber}</p>
    </div>
  );
}
