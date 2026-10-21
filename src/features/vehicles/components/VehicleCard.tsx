import { ChevronRight, Gauge } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { MyVehicleTabs } from "@/features/vehicles/components/MyVehicleTabs";
import { OdometerDialog } from "@/features/vehicles/components/OdometerDialog";
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";
import { formatKm, formatRegistration } from "@/lib/format";

type VehicleCardProps = {
  vehicle: MyVehicle;
  vehicles: MyVehicle[];
  /** The vehicle's status strip (service, insurance, PUC, RC). */
  children?: React.ReactNode;
};

export function VehicleCard({ vehicle, vehicles, children }: VehicleCardProps) {
  const name = getVehicleName(vehicle);

  return (
    <Card aria-labelledby="vehicle-card-heading" className="grid grid-cols-1 gap-5">
      <MyVehicleTabs vehicles={vehicles} currentVehicleId={vehicle.id} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <VehiclePhoto
          vehicle={vehicle}
          sizes="(min-width: 640px) 224px, 100vw"
          className="w-full sm:w-56"
        />

        <div className="grid gap-3">
          <div>
            <h2
              id="vehicle-card-heading"
              className="text-xl font-semibold text-gray-900 md:text-2xl"
            >
              {name}
            </h2>
            <p className="text-sm text-gray-500">
              {vehicle.variantName} · {vehicle.year}
            </p>
          </div>
          {vehicle.registrationNumber ? (
            <p className="w-fit rounded-md border-2 border-gray-900 bg-white px-2.5 py-1 text-sm font-bold tracking-wider text-gray-900">
              <span className="sr-only">Registration number </span>
              {formatRegistration(vehicle.registrationNumber)}
            </p>
          ) : (
            <Link
              href={`/account/vehicles/${vehicle.id}/edit`}
              className="w-fit text-sm font-semibold text-navy-700 hover:underline"
            >
              Add number plate
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
            <Gauge className="size-4 text-gray-500" aria-hidden />
            <span>
              Odometer{" "}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatKm(vehicle.odometerKm)}
              </span>
            </span>
            <OdometerDialog
              vehicleId={vehicle.id}
              vehicleName={name}
              currentKm={vehicle.odometerKm}
              updatedAt={vehicle.odometerUpdatedAt}
            />
          </div>
          <Link
            href={`/account/vehicles/${vehicle.id}`}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"
          >
            Documents and photos
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {children}
    </Card>
  );
}
