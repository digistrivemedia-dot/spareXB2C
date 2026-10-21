import { Gauge } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SetDefaultVehicleButton } from "@/features/vehicles/components/SetDefaultVehicleButton";
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import {
  documentLabels,
  documentStatusLabels,
  documentStatusTones,
  formatPlate,
  getVehicleName,
  vehicleTypes,
} from "@/features/vehicles/utils";
import { formatKm } from "@/lib/format";

/** One vehicle on "My vehicles": photo, plate, odometer and any papers that need attention. */
export function VehicleListCard({ vehicle }: { vehicle: MyVehicle }) {
  const name = getVehicleName(vehicle);
  const typeLabel = vehicleTypes.find((t) => t.value === vehicle.type)?.label;
  const needsAttention = vehicle.documents.filter((d) => d.status !== "ok");

  return (
    <article
      aria-labelledby={`vehicle-${vehicle.id}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <VehiclePhoto
        vehicle={vehicle}
        sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
        className="rounded-none"
      />
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`vehicle-${vehicle.id}`} className="text-lg font-semibold text-gray-900">
            <Link href={`/account/vehicles/${vehicle.id}`} className="hover:text-navy-700">
              {name}
            </Link>
          </h2>
          {vehicle.isDefault && <StatusBadge tone="info">Default</StatusBadge>}
        </div>
        <p className="text-sm text-gray-600">
          {typeLabel} · {vehicle.variantName} · {vehicle.year}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
          <span className="font-semibold tracking-wide">
            {formatPlate(vehicle.registrationNumber)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="size-4 text-gray-500" aria-hidden />
            <span className="tabular-nums">{formatKm(vehicle.odometerKm)}</span>
          </span>
        </p>
        {needsAttention.length > 0 && (
          <ul aria-label="Papers to look at" className="flex flex-wrap gap-2">
            {needsAttention.map((document) => (
              <li key={document.kind}>
                <StatusBadge tone={documentStatusTones[document.status]}>
                  {documentLabels[document.kind]}: {documentStatusLabels[document.status]}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-200 pt-4">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/account/vehicles/${vehicle.id}`}>View details</Link>
          </Button>
          {!vehicle.isDefault && (
            <SetDefaultVehicleButton vehicleId={vehicle.id} vehicleName={name} />
          )}
        </div>
      </div>
    </article>
  );
}
