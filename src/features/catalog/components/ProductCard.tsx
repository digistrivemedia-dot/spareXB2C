import Link from "next/link";

import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { ProductFitBadge } from "@/features/catalog/components/ProductFitBadge";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import type { ProductSummary } from "@/features/catalog/types";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product }: { product: ProductSummary }) {
  const href = `/products/${product.slug}`;
  const { stockQuantity } = product;

  return (
    <article className="relative flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <WishlistButton
        productId={product.id}
        productName={product.name}
        className="absolute top-2 right-2 z-10"
      />
      <Link href={href} tabIndex={-1} aria-hidden>
        <ProductImage
          image={product.image}
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 45vw"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {product.brand.name}
          {product.isGenuine && <span className="text-navy-700"> · Genuine</span>}
        </p>
        <h3 className="text-sm leading-snug font-medium text-gray-900">
          <Link href={href} className="line-clamp-2 hover:text-navy-700 hover:underline">
            {product.name}
          </Link>
        </h3>
        <Rating average={product.rating.average} count={product.rating.count} />
        <Price priceInPaise={product.priceInPaise} mrpInPaise={product.mrpInPaise} />
        <ProductFitBadge fitment={product.fitment} />
        {stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD && (
          <p className="text-xs font-semibold text-warning-700">Only {stockQuantity} left</p>
        )}
      </div>

      <AddToCartButton product={product} className="mt-1 w-full" />
    </article>
  );
}
