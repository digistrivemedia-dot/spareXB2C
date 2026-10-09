import { Bike, Gauge } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { MyBikeTabs } from "@/features/vehicles/components/MyBikeTabs";
import { OdometerDialog } from "@/features/vehicles/components/OdometerDialog";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { formatKm, formatRegistration } from "@/lib/format";

type BikeCardProps = {
  bike: MyBike;
  bikes: MyBike[];
  /** The bike's status strip (service, insurance, PUC, RC). */
  children?: React.ReactNode;
};

export function BikeCard({ bike, bikes, children }: BikeCardProps) {
  const name = getBikeName(bike);

  return (
    <Card aria-labelledby="bike-card-heading" className="grid grid-cols-1 gap-5">
      <MyBikeTabs bikes={bikes} currentBikeId={bike.id} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative flex aspect-4/3 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400 sm:w-56">
          {bike.imageUrl ? (
            <Image
              src={bike.imageUrl}
              alt={`${name} photo`}
              fill
              sizes="(min-width: 640px) 224px, 100vw"
              className="object-cover"
            />
          ) : (
            <Bike className="size-12" strokeWidth={1.5} aria-hidden />
          )}
        </div>

        <div className="grid gap-3">
          <div>
            <h2 id="bike-card-heading" className="text-xl font-semibold text-gray-900 md:text-2xl">
              {name}
            </h2>
            <p className="text-sm text-gray-500">
              {bike.variantName} · {bike.year}
            </p>
          </div>
          <p className="w-fit rounded-md border-2 border-gray-900 bg-white px-2.5 py-1 text-sm font-bold tracking-wider text-gray-900">
            <span className="sr-only">Registration number </span>
            {formatRegistration(bike.registrationNumber)}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
            <Gauge className="size-4 text-gray-500" aria-hidden />
            <span>
              Odometer{" "}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatKm(bike.odometerKm)}
              </span>
            </span>
            <OdometerDialog
              bikeId={bike.id}
              bikeName={name}
              currentKm={bike.odometerKm}
              updatedAt={bike.odometerUpdatedAt}
            />
          </div>
        </div>
      </div>

      {children}
    </Card>
  );
}
