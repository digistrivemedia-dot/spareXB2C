"use client";

import Link from "next/link";

import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehiclePartsHref, toSelectedVehicle } from "@/features/vehicles/utils";

type ShopForVehicleLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "onClick"> & {
  vehicle: MyVehicle;
};

/** Opens the parts that fit this vehicle and makes it the shop's selected vehicle, so every fit badge matches. */
export function ShopForVehicleLink({ vehicle, ...props }: ShopForVehicleLinkProps) {
  const selectVehicle = useVehicleStore((state) => state.selectVehicle);
  return (
    <Link
      href={getVehiclePartsHref(vehicle)}
      onClick={() => selectVehicle(toSelectedVehicle(vehicle))}
      {...props}
    />
  );
}
