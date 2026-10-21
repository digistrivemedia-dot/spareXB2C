import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/features/cart/types";
import type { ProductSummary } from "@/features/catalog/types";
import type { Coupon } from "@/features/promotions/types";
import { features } from "@/lib/config";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";

type CartState = {
  items: CartItem[];
  /** A coupon the server accepted; its discount is worked out from the current subtotal. */
  coupon: Coupon | null;
  /** False until the saved cart has been read from localStorage. */
  hasHydrated: boolean;
  addItem: (product: ProductSummary, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clear: () => void;
};

function toCartItem(product: ProductSummary, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brandName: product.brand.name,
    imageUrl: product.image?.url ?? null,
    priceInPaise: product.priceInPaise,
    mrpInPaise: product.mrpInPaise,
    stockQuantity: product.stockQuantity,
    fitment: product.fitment,
    quantity,
  };
}

/** Quantities stay between 1 and what's in stock, never more than the per-item limit. */
function clampQuantity(quantity: number, stockQuantity: number): number {
  return Math.min(Math.max(quantity, 1), stockQuantity, MAX_QUANTITY_PER_ITEM);
}

function updateItem(items: CartItem[], productId: string, changes: Partial<CartItem>): CartItem[] {
  return items.map((item) => (item.productId === productId ? { ...item, ...changes } : item));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      hasHydrated: false,
      addItem: (product, quantity = 1) =>
        set(({ items }) => {
          const existing = items.find((item) => item.productId === product.id);
          if (!existing) {
            const firstQuantity = clampQuantity(quantity, product.stockQuantity);
            return { items: [...items, toCartItem(product, firstQuantity)] };
          }
          return {
            items: updateItem(items, product.id, {
              quantity: clampQuantity(existing.quantity + quantity, existing.stockQuantity),
            }),
          };
        }),
      setQuantity: (productId, quantity) =>
        set(({ items }) => {
          const item = items.find((i) => i.productId === productId);
          if (!item) return {};
          return {
            items: updateItem(items, productId, {
              quantity: clampQuantity(quantity, item.stockQuantity),
            }),
          };
        }),
      removeItem: (productId) =>
        set(({ items }) => ({ items: items.filter((item) => item.productId !== productId) })),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      clear: () => set({ items: [], coupon: null }),
    }),
    {
      name: "kg-cart",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
      partialize: ({ items, coupon }) => ({ items, coupon }),
      onRehydrateStorage: () => () => useCartStore.setState({ hasHydrated: true }),
    },
  ),
);

/** The applied coupon, or none while coupons are switched off (a saved one is then ignored). */
export const selectCoupon = (state: CartState) => (features.coupons ? state.coupon : null);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
