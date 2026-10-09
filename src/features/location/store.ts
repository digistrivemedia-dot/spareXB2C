import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PinLocation } from "@/features/location/types";

type LocationState = {
  location: PinLocation | null;
  setLocation: (location: PinLocation) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
    }),
    {
      name: "kg-delivery-location",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
    },
  ),
);
