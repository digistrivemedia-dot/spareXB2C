import Link from "next/link";

import { RemovableChip } from "@/components/ui/RemovableChip";
import { clearedFilters, type ProductFilters, productsHref } from "@/features/catalog/filters";
import type { PartBrand } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";

type ActiveFilterChipsProps = {
  filters: ProductFilters;
  brands: PartBrand[];
};

type Chip = { key: string; label: string; without: Partial<ProductFilters> };

function priceLabel(min: number | undefined, max: number | undefined): string {
  const rupees = (value: number) => formatPrice(value * 100);
  if (min && max) return `${rupees(min)} – ${rupees(max)}`;
  return min ? `${rupees(min)} and above` : `Up to ${rupees(max ?? 0)}`;
}

/** Applied filters as removable chips, with "Clear all". Renders nothing when no filter is on. */
export function ActiveFilterChips({ filters, brands }: ActiveFilterChipsProps) {
  const chips: Chip[] = filters.brands.map((slug) => ({
    key: `brand-${slug}`,
    label: brands.find((brand) => brand.slug === slug)?.name ?? slug,
    without: { brands: filters.brands.filter((s) => s !== slug) },
  }));
  if (filters.minPrice || filters.maxPrice) {
    chips.push({
      key: "price",
      label: priceLabel(filters.minPrice, filters.maxPrice),
      without: { minPrice: undefined, maxPrice: undefined },
    });
  }
  if (filters.inStock) chips.push({ key: "stock", label: "In stock", without: { inStock: false } });
  if (filters.minDiscount) {
    chips.push({
      key: "discount",
      label: `${filters.minDiscount}%+ off`,
      without: { minDiscount: undefined },
    });
  }
  if (filters.warranty)
    chips.push({ key: "warranty", label: "With warranty", without: { warranty: false } });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Applied filters" role="group">
      {chips.map((chip) => (
        <RemovableChip
          key={chip.key}
          label={chip.label}
          removeHref={productsHref(filters, chip.without)}
        />
      ))}
      <Link
        href={productsHref(filters, clearedFilters)}
        scroll={false}
        className="inline-flex h-11 items-center px-2 text-sm font-semibold text-navy-700 hover:underline md:h-9"
      >
        Clear all
      </Link>
    </div>
  );
}
