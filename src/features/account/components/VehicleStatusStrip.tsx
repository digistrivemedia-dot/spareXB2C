import Link from "next/link";

import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import type { NextServiceDue } from "@/features/service/types";
import { reminderTone } from "@/features/service/utils";
import type { MyVehicle } from "@/features/vehicles/types";
import {
  documentLabels,
  documentStatusLabels,
  documentStatusTones,
} from "@/features/vehicles/utils";
import { formatDate, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";

type StatusItem = {
  key: string;
  title: string;
  label: string;
  tone: StatusTone;
  value: React.ReactNode;
};

const boxByTone: Record<StatusTone, string> = {
  success: "border-gray-200 bg-white",
  warning: "border-warning-500 bg-warning-50",
  danger: "border-danger-600 bg-danger-50",
  info: "border-gray-200 bg-white",
  neutral: "border-dashed border-gray-300 bg-white",
};

type VehicleStatusStripProps = {
  vehicle: MyVehicle;
  nextService: NextServiceDue | null;
};

/** Next service, insurance, PUC and RC, each coloured by how urgent it is. */
export function VehicleStatusStrip({ vehicle, nextService }: VehicleStatusStripProps) {
  const editHref = `/account/vehicles/${vehicle.id}/edit`;
  const items: StatusItem[] = [
    ...(nextService
      ? [
          {
            key: "service",
            title: "Next service",
            label: { ok: "On track", "due-soon": "Due soon", overdue: "Overdue" }[
              nextService.status
            ],
            tone: reminderTone[nextService.status],
            value: `${formatDate(nextService.dueOn)} or ${formatKm(nextService.dueAtKm)}`,
          },
        ]
      : []),
    ...vehicle.documents.map((document) => ({
      key: document.kind,
      title: documentLabels[document.kind],
      label: documentStatusLabels[document.status],
      tone: documentStatusTones[document.status],
      value: document.expiresOn ? (
        [document.provider, `till ${formatDate(document.expiresOn)}`].filter(Boolean).join(" · ")
      ) : (
        <Link href={editHref} className="font-semibold text-navy-700 hover:underline">
          Add expiry date
        </Link>
      ),
    })),
  ];

  return (
    <ul aria-label="Vehicle status" className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.key}
          className={cn("flex flex-col gap-1.5 rounded-lg border p-3", boxByTone[item.tone])}
        >
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {item.title}
          </span>
          <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
          <span className="text-xs text-gray-700 first-letter:uppercase">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
