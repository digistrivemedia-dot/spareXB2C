import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { ProductSummary } from "@/features/catalog/types";

/** Product cards in 2, 3 or 4 columns depending on screen width. */
export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
