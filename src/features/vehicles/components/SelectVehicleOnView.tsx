"use client";

import { useEffect } from "react";

import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle } from "@/features/vehicles/types";
import { toSelectedVehicle } from "@/features/vehicles/utils";

/**
 * Makes the vehicle on screen the shop's vehicle, so every fit badge on the page (and in the shop
 * afterwards) is about the vehicle the customer is looking at. Renders nothing.
 */
export function SelectVehicleOnView({ vehicle }: { vehicle: MyVehicle }) {
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const selectedId = useVehicleStore((state) => state.selectedVehicle?.myVehicleId);
  const selectVehicle = useVehicleStore((state) => state.selectVehicle);

  useEffect(() => {
    // Wait for the saved choice to load, or it would overwrite this one.
    if (hasHydrated && selectedId !== vehicle.id) selectVehicle(toSelectedVehicle(vehicle));
  }, [hasHydrated, selectedId, vehicle, selectVehicle]);

  return null;
}
