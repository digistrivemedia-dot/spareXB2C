"use client";

import { useEffect } from "react";

import { useSidebarStore } from "@/components/layout/sidebar-store";
import { useCartStore } from "@/features/cart/store";
import { useLocationStore } from "@/features/location/store";
import { useFavouriteGaragesStore } from "@/features/service/favourites-store";
import { useVehicleStore } from "@/features/vehicles/store";
import { useWishlistStore } from "@/features/wishlist/store";

/** Loads the persisted stores from localStorage after the first render, so it matches the server HTML. */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useVehicleStore.persist.rehydrate();
    void useLocationStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
    void useFavouriteGaragesStore.persist.rehydrate();
    void useSidebarStore.persist.rehydrate();
  }, []);

  return null;
}
