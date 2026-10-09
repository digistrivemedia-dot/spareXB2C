"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store";

/** Empties the cart once an order is confirmed. Waits for the saved cart to load, so it isn't restored afterwards. */
export function ClearCart() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    if (hasHydrated) clear();
  }, [hasHydrated, clear]);

  return null;
}
