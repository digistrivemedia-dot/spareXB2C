import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      toggle: (productId) =>
        set(({ productIds }) => ({
          productIds: productIds.includes(productId)
            ? productIds.filter((id) => id !== productId)
            : [...productIds, productId],
        })),
      add: (productId) =>
        set(({ productIds }) => ({
          productIds: productIds.includes(productId) ? productIds : [...productIds, productId],
        })),
    }),
    // Rehydrated on the client by StoreHydration, so server and first client render match.
    { name: "kg-wishlist", skipHydration: true },
  ),
);
