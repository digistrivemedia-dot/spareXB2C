import Link from "next/link";

import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { ProductFitBadge } from "@/features/catalog/components/ProductFitBadge";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import type { ProductSummary } from "@/features/catalog/types";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";

const LOW_STOCK_THRESHOLD = 5;

type ProductCardProps = {
  product: ProductSummary;
  /**
   * "compact" drops the fit badge (for rows already filtered to the vehicle) and uses a small cart button.
   */
  variant?: "default" | "compact";
  /** A short label above the name, e.g. "Due at next service". */
  tag?: string;
};

export function ProductCard({ product, variant = "default", tag }: ProductCardProps) {
  const isCompact = variant === "compact";
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
        {tag && (
          <span className="w-fit rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-800">
            {tag}
          </span>
        )}
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {product.brand.name}
          {product.isGenuine && <span className="text-navy-700"> · Genuine</span>}
        </p>
        <h3 className="text-sm leading-snug font-medium text-gray-900">
          <Link href={href} className="line-clamp-2 hover:text-navy-700 hover:underline">
            {product.name}
          </Link>
        </h3>
        {isCompact ? (
          <div className="mt-auto flex items-end justify-between gap-2">
            <Price priceInPaise={product.priceInPaise} mrpInPaise={product.mrpInPaise} />
            <AddToCartButton product={product} size="icon" className="shrink-0" />
          </div>
        ) : (
          <>
            <Price priceInPaise={product.priceInPaise} mrpInPaise={product.mrpInPaise} />
            <ProductFitBadge fitment={product.fitment} />
          </>
        )}
        {stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD && (
          <p className="text-xs font-semibold text-warning-700">Only {stockQuantity} left</p>
        )}
      </div>

      {!isCompact && <AddToCartButton product={product} className="mt-1 w-full" />}
    </article>
  );
}
