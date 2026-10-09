"use client";

import { FitBadge } from "@/components/ui/FitBadge";
import type { Fitment } from "@/features/catalog/types";
import { getFitStatus } from "@/features/catalog/utils";
import { useVehicleStore } from "@/features/vehicles/store";
import { getBikeName } from "@/features/vehicles/utils";

/** Fit for the customer's selected bike. With no bike, a prompt that opens the bike selector. */
export function ProductFitBadge({ fitment }: { fitment: Fitment }) {
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const openSelector = useVehicleStore((state) => state.setSelectorOpen);

  if (!hasHydrated) {
    return <span className="block h-6 w-36 animate-pulse rounded-full bg-gray-100" aria-hidden />;
  }

  if (!selectedBike) {
    return (
      <button
        type="button"
        onClick={() => openSelector(true)}
        className="w-fit rounded-full text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <FitBadge status="unknown" />
      </button>
    );
  }

  return (
    <FitBadge status={getFitStatus(fitment, selectedBike)} bikeName={getBikeName(selectedBike)} />
  );
}
