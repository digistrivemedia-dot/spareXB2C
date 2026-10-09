import { SearchX } from "lucide-react";

import { ChipLink } from "@/components/ui/ChipLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import type { Category, ProductSummary } from "@/features/catalog/types";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName, getBikePartsHref } from "@/features/vehicles/utils";

type BikePartsSectionProps = {
  bike: MyBike;
  categories: Category[];
  /** Category slug picked with the chips, or undefined for all parts. */
  activeCategory: string | undefined;
  products: ProductSummary[];
};

/** "Parts for your bike" on the dashboard: category chips (kept in the URL) over a product rail. */
export function BikePartsSection({
  bike,
  categories,
  activeCategory,
  products,
}: BikePartsSectionProps) {
  const bikeName = getBikeName(bike);
  const chipHref = (slug?: string) => `/account?bike=${bike.id}${slug ? `&parts=${slug}` : ""}`;

  return (
    <section aria-labelledby="bike-parts-heading">
      <SectionHeader
        id="bike-parts-heading"
        title={`Parts for your ${bikeName}`}
        link={{ href: getBikePartsHref(bike), label: "View all" }}
      />
      <nav aria-label="Part categories" className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        <ChipLink href={chipHref()} isActive={!activeCategory}>
          All parts
        </ChipLink>
        {categories.map((category) => (
          <ChipLink
            key={category.id}
            href={chipHref(category.slug)}
            isActive={category.slug === activeCategory}
          >
            {category.name}
          </ChipLink>
        ))}
      </nav>
      {products.length > 0 ? (
        <ProductRail products={products} label={`Parts for your ${bikeName}`} />
      ) : (
        <EmptyState
          icon={SearchX}
          titleAs="h3"
          title="No parts in this category yet"
          description={`We don't have parts in this category for your ${bikeName} yet. Try another category.`}
          className="py-10"
        />
      )}
    </section>
  );
}
