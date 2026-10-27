import { ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import type { Category, ProductSummary } from "@/features/catalog/types";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName, getVehiclePartsHref } from "@/features/vehicles/utils";

/**
 * Categories replaced at a routine service, tagged "Due at next service". A fixed list until the admin panel
 * sets it per service package.
 */
const SERVICE_PART_CATEGORIES = ["engine-oil", "filters"];

type PartsForVehicleCardProps = {
  vehicle: MyVehicle;
  products: ProductSummary[];
  categories: Category[];
  /** Tag the parts replaced at a routine service when one is coming up. */
  isServiceDue: boolean;
};

/** SpareX parts that fit the vehicle: category shortcuts over a compact carousel. */
export function PartsForVehicleCard({
  vehicle,
  products,
  categories,
  isServiceDue,
}: PartsForVehicleCardProps) {
  const name = getVehicleName(vehicle);
  const partsHref = getVehiclePartsHref(vehicle);
  const tags = isServiceDue
    ? Object.fromEntries(
        products
          .filter((p) => SERVICE_PART_CATEGORIES.includes(p.category.slug))
          .map((p) => [p.id, "Due at next service"]),
      )
    : undefined;

  return (
    <Card aria-labelledby="vehicle-parts-heading" className="grid grid-cols-1 gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-lg font-bold tracking-tight text-navy-900">
            Spare<span className="text-orange-700">X</span>
            <span className="ml-1.5 text-sm font-medium text-gray-500">by Kannali Garage</span>
          </p>
          <h2 id="vehicle-parts-heading" className="text-sm text-gray-700">
            Parts checked to fit your <span className="font-semibold text-gray-900">{name}</span>
          </h2>
        </div>
        <Link
          href={partsHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"
        >
          View all
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>

      <nav aria-label="Part categories" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`${partsHref}&category=${category.slug}`}
            className="inline-flex h-8 shrink-0 items-center rounded-full border border-gray-200 px-3 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-navy-200 hover:bg-navy-50 hover:text-navy-800"
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {products.length > 0 ? (
        <ProductRail
          products={products}
          label={`Parts for your ${name}`}
          variant="compact"
          tags={tags}
        />
      ) : (
        <EmptyState
          icon={SearchX}
          titleAs="h3"
          title="No parts listed for this vehicle yet"
          description="Send us an enquiry and we'll find the part for you."
          className="py-8"
        />
      )}
    </Card>
  );
}
