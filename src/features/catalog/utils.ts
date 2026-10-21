import type { Fitment, FitStatus } from "@/features/catalog/types";
import type { VehicleRef } from "@/features/vehicles/types";

export function getFitStatus(
  fitment: Fitment,
  vehicle: Pick<VehicleRef, "type" | "modelId" | "variantId" | "year">,
): FitStatus {
  if (fitment.kind === "universal") {
    return fitment.vehicleTypes.includes(vehicle.type) ? "universal" : "no-fit";
  }

  const fits = fitment.vehicles.some(
    (fit) =>
      fit.modelId === vehicle.modelId &&
      fit.years.includes(vehicle.year) &&
      (fit.variantIds === null || fit.variantIds.includes(vehicle.variantId)),
  );
  return fits ? "fits" : "no-fit";
}

/** [2025, 2024, 2023, 2022] → "2022–2025"; gaps are listed: [2025, 2022] → "2022, 2025". */
export function formatYears(years: number[]): string {
  const sorted = [...years].sort((a, b) => a - b);
  const isRange = sorted.every((year, i) => i === 0 || year === sorted[i - 1] + 1);
  return isRange && sorted.length > 1
    ? `${sorted[0]}–${sorted[sorted.length - 1]}`
    : sorted.join(", ");
}
