import { Section } from "@/components/layout/Section";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import type { ProductShelf } from "@/features/promotions/types";

/** A product shelf from the admin panel, as a titled rail with "View all". */
export function ProductShelfSection({ shelf }: { shelf: ProductShelf }) {
  if (shelf.products.length === 0) return null;
  return (
    <Section
      id={shelf.id}
      title={shelf.title}
      link={{ href: shelf.viewAllHref, label: "View all" }}
    >
      <ProductRail products={shelf.products} label={shelf.title} />
    </Section>
  );
}
