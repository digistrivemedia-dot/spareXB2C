"use client";

import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/features/cart/store";
import type { CartItem } from "@/features/cart/types";
import { ProductFitBadge } from "@/features/catalog/components/ProductFitBadge";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import { useWishlistStore } from "@/features/wishlist/store";
import { INSTALLATION_FEE_IN_PAISE, MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export function CartItemRow({ item }: { item: CartItem }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const setInstallation = useCartStore((state) => state.setInstallation);
  const removeItem = useCartStore((state) => state.removeItem);
  const addToWishlist = useWishlistStore((state) => state.add);
  const href = `/products/${item.slug}`;

  function remove() {
    removeItem(item.productId);
    toast.success("Removed from cart", { description: item.name });
  }

  function moveToWishlist() {
    addToWishlist(item.productId);
    removeItem(item.productId);
    toast.success("Moved to your wishlist", { description: item.name });
  }

  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
      <Link href={href} tabIndex={-1} aria-hidden className="w-20 shrink-0 sm:w-24">
        <ProductImage
          image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
          sizes="96px"
          className="border border-gray-200"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              {item.brandName}
            </p>
            <h3 className="text-sm font-medium text-gray-900 md:text-base">
              <Link href={href} className="line-clamp-2 hover:text-navy-700 hover:underline">
                {item.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 font-semibold text-gray-900 tabular-nums">
            {formatPrice(item.priceInPaise * item.quantity)}
          </p>
        </div>

        <Price priceInPaise={item.priceInPaise} mrpInPaise={item.mrpInPaise} />
        <ProductFitBadge fitment={item.fitment} />

        {item.withInstallation && (
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
            + Installation at Kannali Garage{" "}
            <span className="font-semibold tabular-nums">
              {formatPrice(INSTALLATION_FEE_IN_PAISE)}
            </span>
            <Button variant="link" size="sm" onClick={() => setInstallation(item.productId, false)}>
              Remove installation
            </Button>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <QuantityStepper
            value={item.quantity}
            max={Math.min(item.stockQuantity, MAX_QUANTITY_PER_ITEM)}
            onChange={(quantity) => setQuantity(item.productId, quantity)}
            label={item.name}
          />
          <Button variant="link" size="sm" onClick={moveToWishlist}>
            Move to wishlist
          </Button>
          <Button variant="link" size="sm" onClick={remove}>
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
