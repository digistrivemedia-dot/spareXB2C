"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { Address } from "@/features/account/types";
import { useCartStore } from "@/features/cart/store";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import type { MyBike } from "@/features/vehicles/types";

type CheckoutViewProps = {
  addresses: Address[];
  bikes: MyBike[];
};

/** Waits for the saved cart, then shows the form, or a way back to shopping if it's empty. */
export function CheckoutView({ addresses, bikes }: CheckoutViewProps) {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const isEmpty = useCartStore((state) => state.items.length === 0);

  if (!hasHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-12" aria-busy="true" aria-label="Loading checkout">
        <div className="grid gap-6 lg:col-span-8">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl lg:col-span-4" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add some parts to your cart, then come back to check out."
      >
        <Button asChild>
          <Link href="/products">Start shopping</Link>
        </Button>
      </EmptyState>
    );
  }

  return <CheckoutForm addresses={addresses} bikes={bikes} />;
}
