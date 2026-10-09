"use client";

import { ShoppingCart, Wrench, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useAddToCart } from "@/features/cart/useAddToCart";
import type { ProductSummary } from "@/features/catalog/types";
import { INSTALLATION_FEE_IN_PAISE, MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

type PurchasePanelProps = {
  product: ProductSummary;
};

const LOW_STOCK_THRESHOLD = 5;

/** Quantity, installation, Add to cart and Buy now, plus the sticky bar that repeats them on phones. */
export function PurchasePanel({ product }: PurchasePanelProps) {
  const id = useId();
  const router = useRouter();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [withInstallation, setWithInstallation] = useState(false);
  const { stockQuantity } = product;

  if (stockQuantity === 0) {
    return (
      <div className="rounded-lg border border-danger-600 bg-danger-50 p-4 text-sm">
        <p className="font-semibold text-danger-700">Out of stock</p>
        <p className="text-gray-700">
          We&apos;re restocking this part. Please check back in a few days.
        </p>
      </div>
    );
  }

  const add = () => addToCart(product, { quantity, withInstallation });

  function buyNow() {
    if (add()) router.push("/checkout");
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-medium text-gray-700">Quantity</span>
        <QuantityStepper
          value={quantity}
          max={Math.min(stockQuantity, MAX_QUANTITY_PER_ITEM)}
          onChange={setQuantity}
          label={product.name}
        />
        <span
          className={
            stockQuantity <= LOW_STOCK_THRESHOLD
              ? "text-sm font-semibold text-warning-700"
              : "text-sm font-medium text-success-700"
          }
        >
          {stockQuantity <= LOW_STOCK_THRESHOLD ? `Only ${stockQuantity} left` : "In stock"}
        </span>
      </div>

      {product.isInstallable && (
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <Checkbox
            id={`${id}-install`}
            checked={withInstallation}
            onCheckedChange={(state) => setWithInstallation(state === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor={`${id}-install`}
            className="grid flex-1 cursor-pointer gap-0.5 font-normal"
          >
            <span className="flex items-center gap-1.5 font-semibold text-gray-900">
              <Wrench className="size-4 text-navy-700" aria-hidden />
              Add installation at Kannali Garage
              <span className="tabular-nums">+{formatPrice(INSTALLATION_FEE_IN_PAISE)}</span>
            </span>
            <span className="text-sm text-gray-600">
              Our mechanic fits it at the garage, or during your next pickup service.
            </span>
          </Label>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={add}>
          <ShoppingCart aria-hidden />
          Add to cart
        </Button>
        <Button size="lg" variant="secondary" onClick={buyNow}>
          <Zap aria-hidden />
          Buy now
        </Button>
      </div>

      {/* Phones: price and Add to cart stay in reach while scrolling. */}
      <MobileActionBar>
        <Price priceInPaise={product.priceInPaise} mrpInPaise={product.mrpInPaise} />
        <Button onClick={add} className="shrink-0">
          <ShoppingCart aria-hidden />
          Add to cart
        </Button>
      </MobileActionBar>
    </div>
  );
}
