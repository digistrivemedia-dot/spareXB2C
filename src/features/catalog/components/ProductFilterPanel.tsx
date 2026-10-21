"use client";

import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilterGroup } from "@/features/catalog/components/FilterGroup";
import { FilterOption } from "@/features/catalog/components/FilterOption";
import { PriceFilter } from "@/features/catalog/components/PriceFilter";
import type { ProductFilters } from "@/features/catalog/filters";
import type { ProductFacets } from "@/features/catalog/types";
import { useFilterNavigation } from "@/features/catalog/useFilterNavigation";
import { cn } from "@/lib/utils";

type ProductFilterPanelProps = {
  filters: ProductFilters;
  facets: ProductFacets;
};

const discountOptions = [
  { value: "any", label: "Any discount" },
  { value: "10", label: "10% or more" },
  { value: "20", label: "20% or more" },
];

/** Every filter as a control; each change updates the URL straight away. Used in the sidebar and the mobile sheet. */
export function ProductFilterPanel({ filters, facets }: ProductFilterPanelProps) {
  const id = useId();
  const { apply, isPending } = useFilterNavigation(filters);

  const checkbox = (
    key: string,
    label: string,
    checked: boolean,
    onChange: (on: boolean) => void,
  ) => (
    <FilterOption
      id={`${id}-${key}`}
      label={label}
      control={
        <Checkbox
          id={`${id}-${key}`}
          checked={checked}
          onCheckedChange={(state) => onChange(state === true)}
        />
      }
    />
  );

  return (
    <div
      className={cn("grid gap-5 transition-opacity", isPending && "opacity-60")}
      aria-busy={isPending}
    >
      <FilterGroup title="Category">
        <RadioGroup
          value={filters.category ?? "all"}
          onValueChange={(value) => apply({ category: value === "all" ? undefined : value })}
          className="gap-0"
        >
          <FilterOption
            id={`${id}-cat-all`}
            label="All categories"
            control={<RadioGroupItem id={`${id}-cat-all`} value="all" />}
          />
          {facets.categories.map((category) => (
            <FilterOption
              key={category.slug}
              id={`${id}-cat-${category.slug}`}
              label={category.name}
              count={category.count}
              control={<RadioGroupItem id={`${id}-cat-${category.slug}`} value={category.slug} />}
            />
          ))}
        </RadioGroup>
      </FilterGroup>

      <FilterGroup title="Brand">
        {facets.brands.map((brand) => (
          <FilterOption
            key={brand.slug}
            id={`${id}-brand-${brand.slug}`}
            label={brand.name}
            count={brand.count}
            control={
              <Checkbox
                id={`${id}-brand-${brand.slug}`}
                checked={filters.brands.includes(brand.slug)}
                onCheckedChange={(state) =>
                  apply({
                    brands:
                      state === true
                        ? [...filters.brands, brand.slug]
                        : filters.brands.filter((slug) => slug !== brand.slug),
                  })
                }
              />
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <PriceFilter
          key={`${filters.minPrice}-${filters.maxPrice}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onApply={apply}
        />
      </FilterGroup>

      <FilterGroup title="Availability">
        {checkbox("stock", "In stock only", filters.inStock, (inStock) => apply({ inStock }))}
      </FilterGroup>

      <FilterGroup title="Discount">
        <RadioGroup
          value={filters.minDiscount?.toString() ?? "any"}
          onValueChange={(value) =>
            apply({ minDiscount: value === "any" ? undefined : Number(value) })
          }
          className="gap-0"
        >
          {discountOptions.map((option) => (
            <FilterOption
              key={option.value}
              id={`${id}-discount-${option.value}`}
              label={option.label}
              control={
                <RadioGroupItem id={`${id}-discount-${option.value}`} value={option.value} />
              }
            />
          ))}
        </RadioGroup>
      </FilterGroup>

      <FilterGroup title="Warranty">
        {checkbox("warranty", "With warranty", filters.warranty, (warranty) => apply({ warranty }))}
      </FilterGroup>
    </div>
  );
}
