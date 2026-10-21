import Link from "next/link";

import type { VehicleBrand, VehicleCatalog } from "@/features/vehicles/types";

type VehicleBrandGridProps = {
  brands: VehicleBrand[];
  /** For the model names under each brand. */
  catalog: VehicleCatalog;
};

/** Text tiles per vehicle brand (no third-party logos), each listing its models. */
export function VehicleBrandGrid({ brands, catalog }: VehicleBrandGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {brands.map((brand) => {
        const models = catalog.models.filter((model) => model.brandId === brand.id);
        return (
          <li key={brand.id}>
            <Link
              href={`/products?q=${encodeURIComponent(brand.name)}`}
              className="flex h-full flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors outline-none hover:border-navy-200 hover:bg-navy-50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-base font-semibold text-navy-800">{brand.name}</span>
              <span className="line-clamp-2 text-xs text-gray-500">
                {models.map((model) => model.name).join(" · ")}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
