"use client";

import { listGaragesAction } from "@/features/service/actions";
import { useFavouriteGaragesStore } from "@/features/service/favourites-store";
import { useData } from "@/lib/use-data";

/** The customer's favourite garages, best rated first. Un-favouriting hides one straight away. */
export function useFavouriteGarages() {
  const ids = useFavouriteGaragesStore((state) => state.ids);
  const hasHydrated = useFavouriteGaragesStore((state) => state.hasHydrated);
  const key = hasHydrated && ids.length > 0 ? [...ids].sort().join(",") : null;
  const result = useData(key, () => listGaragesAction({ ids, sort: "rating" }));
  const garages = result.data?.filter((garage) => ids.includes(garage.id)) ?? [];

  return {
    /** Still reading the saved list or loading the garages. */
    isLoading: !hasHydrated || result.status === "loading",
    isError: result.status === "error",
    retry: result.retry,
    garages,
  };
}
