import type { Coupon } from "@/features/promotions/types";

/** The coupon's discount on this subtotal; 0 until the minimum order value is reached. */
export function getCouponDiscount(coupon: Coupon, subtotalInPaise: number): number {
  if (subtotalInPaise < coupon.minOrderInPaise) return 0;
  const { discount } = coupon;
  return discount.kind === "percent"
    ? Math.min(Math.round((subtotalInPaise * discount.percent) / 100), discount.maxInPaise)
    : Math.min(discount.amountInPaise, subtotalInPaise);
}
