"use client";

import Link from "next/link";

import { useVehicleStore } from "@/features/vehicles/store";
import type { MyBike } from "@/features/vehicles/types";
import { getBikePartsHref, toSelectedBike } from "@/features/vehicles/utils";

type ShopForBikeLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "onClick"> & {
  bike: MyBike;
};

/** Opens the parts that fit this bike and makes it the shop's selected bike, so every fit badge matches. */
export function ShopForBikeLink({ bike, ...props }: ShopForBikeLinkProps) {
  const selectBike = useVehicleStore((state) => state.selectBike);
  return (
    <Link
      href={getBikePartsHref(bike)}
      onClick={() => selectBike(toSelectedBike(bike))}
      {...props}
    />
  );
}
