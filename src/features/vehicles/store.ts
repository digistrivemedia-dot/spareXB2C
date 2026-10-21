import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SelectedVehicle } from "@/features/vehicles/types";

type VehicleState = {
  selectedVehicle: SelectedVehicle | null;
  /** False until the saved vehicle has been read from localStorage; avoids flashing "Select your vehicle". */
  hasHydrated: boolean;
  /** The header's vehicle selector dialog, so any "Select your vehicle" prompt on the page can open it. */
  isSelectorOpen: boolean;
  selectVehicle: (vehicle: SelectedVehicle) => void;
  setSelectorOpen: (open: boolean) => void;
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      selectedVehicle: null,
      hasHydrated: false,
      isSelectorOpen: false,
      selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      setSelectorOpen: (open) => set({ isSelectorOpen: open }),
    }),
    {
      name: "kg-selected-vehicle",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
      partialize: ({ selectedVehicle }) => ({ selectedVehicle }),
      onRehydrateStorage: () => () => useVehicleStore.setState({ hasHydrated: true }),
    },
  ),
);
