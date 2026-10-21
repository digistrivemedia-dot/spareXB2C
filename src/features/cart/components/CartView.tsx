"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { FitWarning } from "@/features/cart/components/FitWarning";
import { MobileCheckoutBar } from "@/features/cart/components/MobileCheckoutBar";
import { selectCoupon, useCartStore } from "@/features/cart/store";
import { getCartTotals } from "@/features/cart/utils";
import type { Coupon } from "@/features/promotions/types";

/** The cart lives in the browser, so it renders once the saved cart has loaded. */
export function CartView({ offers }: { offers: Coupon[] }) {
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore(selectCoupon);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  if (!hasHydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        titleAs="h1"
        title="Your cart is empty"
        description="Find parts that fit your vehicle, from engine oil to brake pads."
      >
        <Button asChild>
          <Link href="/products">Start shopping</Link>
        </Button>
      </EmptyState>
    );
  }

  const totals = getCartTotals(items, coupon);

  return (
    <div className="grid grid-cols-1 gap-6">
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
        Your cart{" "}
        <span className="text-base font-normal text-gray-500 md:text-lg">
          ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
        </span>
      </h1>
      <FitWarning items={items} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card aria-label="Items in your cart" className="lg:col-span-8">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </ul>
        </Card>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <CartSummary totals={totals} offers={offers} />
          </div>
        </div>
      </div>

      <MobileCheckoutBar totalInPaise={totals.totalInPaise} />
    </div>
  );
}
