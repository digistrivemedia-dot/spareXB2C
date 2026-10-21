import { PriceRow } from "@/components/ui/PriceRow";
import type { OrderPricing } from "@/features/orders/types";
import { formatPrice } from "@/lib/format";

type OrderPriceSummaryProps = {
  pricing: OrderPricing;
  itemCount: number;
  /** Cart only: how much more to add for free delivery. */
  toFreeDeliveryInPaise?: number;
};

/** The price breakdown used by the cart, checkout, order confirmation and order details. */
export function OrderPriceSummary({
  pricing,
  itemCount,
  toFreeDeliveryInPaise = 0,
}: OrderPriceSummaryProps) {
  const savings = pricing.productDiscountInPaise + pricing.couponDiscountInPaise;

  return (
    <div className="grid gap-3 text-sm">
      <dl className="grid gap-2">
        <PriceRow
          label={`Price (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
          value={formatPrice(pricing.mrpTotalInPaise)}
        />
        {pricing.productDiscountInPaise > 0 && (
          <PriceRow
            label="Discount"
            value={`−${formatPrice(pricing.productDiscountInPaise)}`}
            tone="saving"
          />
        )}
        {pricing.couponDiscountInPaise > 0 && (
          <PriceRow
            label={`Coupon (${pricing.couponCode})`}
            value={`−${formatPrice(pricing.couponDiscountInPaise)}`}
            tone="saving"
          />
        )}
        <PriceRow
          label="Delivery"
          value={
            pricing.deliveryFeeInPaise === 0 ? "Free" : formatPrice(pricing.deliveryFeeInPaise)
          }
          tone={pricing.deliveryFeeInPaise === 0 ? "saving" : undefined}
        />
        <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(pricing.totalInPaise)}</dd>
        </div>
      </dl>
      {toFreeDeliveryInPaise > 0 && (
        <p className="text-gray-600">
          Add {formatPrice(toFreeDeliveryInPaise)} more for free delivery.
        </p>
      )}
      {savings > 0 && (
        <p className="rounded-lg bg-success-50 px-3 py-2 font-semibold text-success-700">
          You save {formatPrice(savings)} on this order
        </p>
      )}
      <p className="text-xs text-gray-500">All prices include GST. Your invoice shows the tax.</p>
    </div>
  );
}
