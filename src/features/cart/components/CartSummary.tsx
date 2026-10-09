"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCartStore } from "@/features/cart/store";
import type { CartTotals } from "@/features/cart/utils";
import { OrderPriceSummary } from "@/features/orders/components/OrderPriceSummary";
import { CouponForm } from "@/features/promotions/components/CouponForm";
import type { Coupon } from "@/features/promotions/types";

type CartSummaryProps = {
  totals: CartTotals;
  offers: Coupon[];
};

export function CartSummary({ totals, offers }: CartSummaryProps) {
  const coupon = useCartStore((state) => state.coupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  return (
    <Card aria-labelledby="cart-summary-heading" className="grid gap-5">
      <SectionHeader id="cart-summary-heading" title="Order summary" />
      <CouponForm
        applied={coupon}
        discountInPaise={totals.couponDiscountInPaise}
        subtotalInPaise={totals.subtotalInPaise}
        offers={offers}
        onApply={applyCoupon}
        onRemove={removeCoupon}
      />
      <OrderPriceSummary
        pricing={totals}
        itemCount={totals.itemCount}
        toFreeDeliveryInPaise={totals.toFreeDeliveryInPaise}
      />
      <Button asChild size="lg" className="hidden lg:inline-flex">
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </Card>
  );
}
