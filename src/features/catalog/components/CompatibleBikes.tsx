import { Globe } from "lucide-react";

import type { Fitment } from "@/features/catalog/types";
import { formatYears } from "@/features/catalog/utils";
import type { VehicleCatalog } from "@/features/vehicles/types";

type CompatibleBikesProps = {
  fitment: Fitment;
  /** For variant names; fitment carries only variant ids. */
  catalog: VehicleCatalog;
};

/** Every bike the part fits, grouped by brand, with variants and model years. */
export function CompatibleBikes({ fitment, catalog }: CompatibleBikesProps) {
  if (fitment.kind === "universal") {
    return (
      <p className="flex items-center gap-2 text-sm text-gray-700">
        <Globe className="size-5 text-info-700" aria-hidden />
        Universal fit: suitable for most bikes and scooters.
      </p>
    );
  }

  const brands = [...new Set(fitment.vehicles.map((vehicle) => vehicle.brandName))];
  const variantNames = (modelId: string, variantIds: string[]) =>
    catalog.models
      .find((model) => model.id === modelId)
      ?.variants.filter((variant) => variantIds.includes(variant.id))
      .map((variant) => variant.name)
      .join(", ");

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {brands.map((brand) => (
        <section key={brand} aria-label={brand}>
          <h3 className="font-semibold text-gray-900">{brand}</h3>
          <ul className="mt-2 grid gap-2 text-sm">
            {fitment.vehicles
              .filter((vehicle) => vehicle.brandName === brand)
              .map((vehicle) => (
                <li
                  key={vehicle.modelId}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <span className="font-medium text-gray-900">{vehicle.modelName}</span>
                  <span className="block text-gray-600">
                    {vehicle.variantIds
                      ? variantNames(vehicle.modelId, vehicle.variantIds)
                      : "All variants"}{" "}
                    · {formatYears(vehicle.years)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
