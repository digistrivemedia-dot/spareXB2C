import type { CartItem } from "@/features/cart/types";
import type { OrderPricing } from "@/features/orders/types";
import type { Coupon } from "@/features/promotions/types";
import { getCouponDiscount } from "@/features/promotions/utils";
import {
  DELIVERY_FEE_IN_PAISE,
  FREE_DELIVERY_THRESHOLD_IN_PAISE,
  INSTALLATION_FEE_IN_PAISE,
} from "@/lib/constants";

/** The order's pricing as it will be charged, plus what the cart needs to explain it. */
export type CartTotals = OrderPricing & {
  itemCount: number;
  /** What the items cost at selling price, before coupon, installation and delivery. */
  subtotalInPaise: number;
  /** How much more to add for free delivery; 0 once it's free. */
  toFreeDeliveryInPaise: number;
};

/** Every number on the cart and checkout summaries. Prices include GST. */
export function getCartTotals(items: CartItem[], coupon: Coupon | null): CartTotals {
  const sum = (value: (item: CartItem) => number) =>
    items.reduce((total, item) => total + value(item), 0);

  const mrpTotalInPaise = sum((item) => item.mrpInPaise * item.quantity);
  const subtotalInPaise = sum((item) => item.priceInPaise * item.quantity);
  const couponDiscountInPaise = coupon ? getCouponDiscount(coupon, subtotalInPaise) : 0;
  // One fitting per part line, however many units (pending client confirmation).
  const installationFeeInPaise =
    items.filter((item) => item.withInstallation).length * INSTALLATION_FEE_IN_PAISE;
  const isFreeDelivery = subtotalInPaise >= FREE_DELIVERY_THRESHOLD_IN_PAISE;
  const deliveryFeeInPaise = items.length > 0 && !isFreeDelivery ? DELIVERY_FEE_IN_PAISE : 0;

  return {
    itemCount: sum((item) => item.quantity),
    mrpTotalInPaise,
    subtotalInPaise,
    productDiscountInPaise: mrpTotalInPaise - subtotalInPaise,
    couponCode: coupon?.code ?? null,
    couponDiscountInPaise,
    installationFeeInPaise,
    deliveryFeeInPaise,
    toFreeDeliveryInPaise: isFreeDelivery ? 0 : FREE_DELIVERY_THRESHOLD_IN_PAISE - subtotalInPaise,
    totalInPaise:
      subtotalInPaise - couponDiscountInPaise + installationFeeInPaise + deliveryFeeInPaise,
  };
}
