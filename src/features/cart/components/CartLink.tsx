"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { HeaderAction } from "@/components/layout/HeaderAction";
import { selectCartCount, useCartStore } from "@/features/cart/store";

export function CartLink() {
  const count = useCartStore(selectCartCount);

  return (
    <HeaderAction asChild>
      <Link
        href="/cart"
        aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      >
        <span className="relative">
          <ShoppingCart className="size-6" aria-hidden />
          {count > 0 && (
            <span className="absolute -top-2 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-700 px-1 text-xs font-semibold text-white tabular-nums ring-2 ring-navy-800">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
        <span className="hidden xl:inline">Cart</span>
      </Link>
    </HeaderAction>
  );
}
