import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/features/catalog/components/ProductImage";
import type { ProductSummary } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";
import { getDiscountPercent } from "@/lib/price";

/** The biggest discounts right now, as compact rows for the home hero. */
export function TopDealsCard({ products }: { products: ProductSummary[] }) {
  return (
    <section
      aria-labelledby="top-deals-heading"
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="top-deals-heading" className="font-semibold text-gray-900">
          Top deals today
        </h2>
        <Link
          href="/products?sort=discount"
          className="inline-flex items-center text-sm font-semibold text-navy-700 hover:underline"
        >
          View all
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
      <ul className="grid gap-2">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-3 rounded-lg p-1 outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ProductImage
                image={product.image}
                sizes="56px"
                className="w-14 shrink-0 border border-gray-200"
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm font-medium text-gray-900">
                  {product.name}
                </span>
                <span className="flex items-baseline gap-2 text-sm">
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatPrice(product.priceInPaise)}
                  </span>
                  <span className="font-semibold text-success-700">
                    {getDiscountPercent(product.priceInPaise, product.mrpInPaise)}% off
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
