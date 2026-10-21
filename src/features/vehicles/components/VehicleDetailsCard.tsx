import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OdometerDialog } from "@/features/vehicles/components/OdometerDialog";
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName, vehicleTypes } from "@/features/vehicles/utils";
import { formatKm } from "@/lib/format";

/** Photos and the facts about the vehicle: plate, odometer, type, variant and year. */
export function VehicleDetailsCard({ vehicle }: { vehicle: MyVehicle }) {
  const name = getVehicleName(vehicle);
  const editHref = `/account/vehicles/${vehicle.id}/edit`;
  const rows = [
    { label: "Number plate", value: formatPlate(vehicle.registrationNumber) },
    { label: "Type", value: vehicleTypes.find((t) => t.value === vehicle.type)?.label },
    { label: "Variant", value: vehicle.variantName },
    { label: "Year", value: vehicle.year },
  ];

  return (
    <Card aria-labelledby="details-heading" className="grid gap-5">
      <SectionHeader
        id="details-heading"
        title="Details"
        link={{ href: editHref, label: "Edit" }}
      />
      {vehicle.photos.length > 0 ? (
        <ImageViewer photos={vehicle.photos} label={`Photos of your ${name}`} />
      ) : (
        <div className="grid gap-2 sm:max-w-xs">
          <VehiclePhoto vehicle={vehicle} sizes="320px" />
          <Link href={editHref} className="text-sm font-semibold text-navy-700 hover:underline">
            Add photos
          </Link>
        </div>
      )}
      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-0.5">
            <dt className="text-gray-500">{row.label}</dt>
            <dd className="font-medium text-gray-900">{row.value}</dd>
          </div>
        ))}
        <div className="grid gap-0.5">
          <dt className="text-gray-500">Odometer</dt>
          <dd className="flex flex-wrap items-center gap-x-2 font-medium text-gray-900">
            <span className="tabular-nums">{formatKm(vehicle.odometerKm)}</span>
            <OdometerDialog
              vehicleId={vehicle.id}
              vehicleName={name}
              currentKm={vehicle.odometerKm}
              updatedAt={vehicle.odometerUpdatedAt}
            />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
