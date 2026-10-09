import { formatPrice } from "@/lib/format";
import { getDiscountPercent } from "@/lib/price";
import { cn } from "@/lib/utils";

type PriceProps = {
  priceInPaise: number;
  mrpInPaise: number;
  size?: "default" | "lg";
  className?: string;
};

/** Selling price, with MRP struck through and % off when discounted. */
export function Price({ priceInPaise, mrpInPaise, size = "default", className }: PriceProps) {
  const discount = getDiscountPercent(priceInPaise, mrpInPaise);

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-semibold text-gray-900 tabular-nums",
          size === "lg" ? "text-2xl md:text-3xl" : "text-base",
        )}
      >
        {formatPrice(priceInPaise)}
      </span>
      {discount > 0 && (
        <>
          <span className="text-sm text-gray-500 tabular-nums">
            <span className="sr-only">MRP </span>
            <s>{formatPrice(mrpInPaise)}</s>
          </span>
          <span className="text-sm font-semibold text-success-700">{discount}% off</span>
        </>
      )}
    </p>
  );
}
