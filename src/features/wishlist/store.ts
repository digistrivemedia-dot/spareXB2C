import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  /** False until the saved list has been read from localStorage. */
  hasHydrated: boolean;
  toggle: (productId: string) => void;
  add: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      hasHydrated: false,
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
    {
      name: "kg-wishlist",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
      partialize: ({ productIds }) => ({ productIds }),
      onRehydrateStorage: () => () => useWishlistStore.setState({ hasHydrated: true }),
    },
  ),
);
