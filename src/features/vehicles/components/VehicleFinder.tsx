"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { VehiclePicker } from "@/features/vehicles/components/VehiclePicker";
import { useVehicleStore } from "@/features/vehicles/store";
import type { VehicleCatalog, VehicleRef } from "@/features/vehicles/types";
import { getBikeName, getBikePartsHref } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

const promises = [
  "Fit checked for over 20 popular bikes and scooters",
  "Genuine brands with a GST invoice",
  "Free delivery on orders above ₹499",
];

type VehicleFinderProps = {
  catalog: VehicleCatalog;
  className?: string;
};

/** Home page hero: pick a bike and jump to the parts that fit it. */
export function VehicleFinder({ catalog, className }: VehicleFinderProps) {
  const router = useRouter();
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const selectBike = useVehicleStore((state) => state.selectBike);

  function findParts(vehicle: VehicleRef) {
    selectBike({ ...vehicle, myBikeId: null });
    router.push(getBikePartsHref(vehicle));
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6",
        className,
      )}
    >
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Parts that fit your bike</h1>
      <p className="mt-2 text-sm text-gray-600 md:text-base">
        Choose your bike once. Every part will show whether it fits.
      </p>
      {selectedBike && (
        <Link
          href={getBikePartsHref(selectedBike)}
          className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-navy-50 px-4 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-100"
        >
          <span>Shop parts for your {getBikeName(selectedBike)}</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link>
      )}
      <div className="mt-5">
        <VehiclePicker catalog={catalog} submitLabel="Find parts" onSubmit={findParts} />
      </div>
      <ul className="mt-5 grid gap-2 border-t border-gray-200 pt-4 text-sm text-gray-700 lg:mt-auto">
        {promises.map((promise) => (
          <li key={promise} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-success-700" aria-hidden />
            {promise}
          </li>
        ))}
      </ul>
    </div>
  );
}
