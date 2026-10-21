"use client";

import { Bike, CircleCheck, CircleX, Globe } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Fitment } from "@/features/catalog/types";
import { getFitStatus } from "@/features/catalog/utils";
import { useVehicleStore } from "@/features/vehicles/store";
import {
  describeVehicleTypes,
  getVehicleName,
  getVehiclePartsHref,
} from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

type FitmentBoxProps = {
  fitment: Fitment;
  categorySlug: string;
};

const boxClass = "flex gap-3 rounded-xl border-2 p-4";

/** The product page's answer to "will this fit my vehicle?", as clearly as possible. */
export function FitmentBox({ fitment, categorySlug }: FitmentBoxProps) {
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const openSelector = useVehicleStore((state) => state.setSelectorOpen);
  const changeVehicle = (
    <Button variant="link" size="sm" onClick={() => openSelector(true)}>
      Change vehicle
    </Button>
  );

  if (!hasHydrated) {
    return <div className="h-20 animate-pulse rounded-xl bg-gray-100" aria-hidden />;
  }

  // A universal part only needs no check when it suits the selected vehicle's type (or none is selected).
  if (
    fitment.kind === "universal" &&
    (!selectedVehicle || getFitStatus(fitment, selectedVehicle) === "universal")
  ) {
    return (
      <div className={cn(boxClass, "border-info-700/30 bg-info-50")}>
        <Globe className="mt-0.5 size-6 shrink-0 text-info-700" aria-hidden />
        <div>
          <p className="font-semibold text-info-700">Universal fit</p>
          <p className="text-sm text-gray-700">
            Fits most {describeVehicleTypes(fitment.vehicleTypes)}. No need to check your model.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedVehicle) {
    return (
      <div className={cn(boxClass, "items-center border-gray-200 bg-white")}>
        <Bike className="size-6 shrink-0 text-navy-700" aria-hidden />
        <p className="flex-1 text-sm text-gray-700">
          Select your vehicle to check if this part fits.
        </p>
        <Button variant="secondary" size="sm" onClick={() => openSelector(true)}>
          Select your vehicle
        </Button>
      </div>
    );
  }

  const vehicleName = getVehicleName(selectedVehicle);
  const vehicleDetails = `${vehicleName} ${selectedVehicle.variantName} (${selectedVehicle.year})`;

  if (getFitStatus(fitment, selectedVehicle) === "fits") {
    return (
      <div className={cn(boxClass, "border-success-600 bg-success-50")}>
        <CircleCheck className="mt-0.5 size-6 shrink-0 text-success-700" aria-hidden />
        <div className="flex-1">
          <p className="font-semibold text-success-700">Fits your {vehicleName}</p>
          <p className="text-sm text-gray-700">Checked against your {vehicleDetails}.</p>
        </div>
        {changeVehicle}
      </div>
    );
  }

  return (
    <div className={cn(boxClass, "border-danger-600 bg-danger-50")}>
      <CircleX className="mt-0.5 size-6 shrink-0 text-danger-700" aria-hidden />
      <div className="flex-1">
        <p className="font-semibold text-danger-700">Doesn&apos;t fit your {vehicleName}</p>
        <p className="text-sm text-gray-700">
          This part isn&apos;t made for your {vehicleDetails}.{" "}
          <Link
            href={`${getVehiclePartsHref(selectedVehicle)}&category=${categorySlug}`}
            className="font-semibold text-navy-700 underline-offset-4 hover:underline"
          >
            See parts that fit
          </Link>
        </p>
      </div>
      {changeVehicle}
    </div>
  );
}
