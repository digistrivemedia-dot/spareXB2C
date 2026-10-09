import { LockKeyhole } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CartItem } from "@/features/cart/types";
import type { CartTotals } from "@/features/cart/utils";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import { OrderPriceSummary } from "@/features/orders/components/OrderPriceSummary";
import { formatPrice } from "@/lib/format";

type CheckoutSummaryProps = {
  items: CartItem[];
  totals: CartTotals;
  formId: string;
  isPlacing: boolean;
};

export function CheckoutSummary({ items, totals, formId, isPlacing }: CheckoutSummaryProps) {
  return (
    <Card aria-labelledby="checkout-summary-heading" className="grid gap-5">
      <SectionHeader
        id="checkout-summary-heading"
        title="Order summary"
        link={{ href: "/cart", label: "Edit cart" }}
      />
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 text-sm">
            <ProductImage
              image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
              sizes="48px"
              className="w-12 shrink-0 border border-gray-200"
            />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 text-gray-900">{item.name}</span>
              <span className="text-gray-500">Qty {item.quantity}</span>
            </span>
            <span className="font-semibold text-gray-900 tabular-nums">
              {formatPrice(item.priceInPaise * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <OrderPriceSummary pricing={totals} itemCount={totals.itemCount} />
      <Button
        type="submit"
        form={formId}
        size="lg"
        disabled={isPlacing}
        className="hidden lg:inline-flex"
      >
        <LockKeyhole aria-hidden />
        {isPlacing ? "Placing your order…" : `Place order · ${formatPrice(totals.totalInPaise)}`}
      </Button>
      <p className="text-xs text-gray-500">
        By placing the order you agree to our{" "}
        <Link href="/policies/terms" className="underline">
          terms of use
        </Link>{" "}
        and{" "}
        <Link href="/policies/returns" className="underline">
          returns policy
        </Link>
        .
      </p>
    </Card>
  );
}
