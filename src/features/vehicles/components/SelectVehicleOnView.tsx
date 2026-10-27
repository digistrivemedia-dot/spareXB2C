"use client";

import { useEffect } from "react";

import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle } from "@/features/vehicles/types";
import { toSelectedVehicle } from "@/features/vehicles/utils";

/**
 * Makes the vehicle on screen the shop's vehicle, so every fit badge on the page (and in the shop
 * afterwards) is about the vehicle the customer is looking at. Runs when the page's vehicle changes, not
 * when the header switcher does (that navigates here with the new vehicle). Renders nothing.
 */
export function SelectVehicleOnView({ vehicle }: { vehicle: MyVehicle }) {
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);

  useEffect(() => {
    // Wait for the saved choice to load, or it would overwrite this one.
    if (!hasHydrated) return;
    const { selectedVehicle, selectVehicle } = useVehicleStore.getState();
    if (selectedVehicle?.myVehicleId !== vehicle.id) selectVehicle(toSelectedVehicle(vehicle));
  }, [hasHydrated, vehicle]);

  return null;
}
