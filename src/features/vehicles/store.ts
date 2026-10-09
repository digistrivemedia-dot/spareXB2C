import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SelectedBike } from "@/features/vehicles/types";

type VehicleState = {
  selectedBike: SelectedBike | null;
  /** False until the saved bike has been read from localStorage; avoids flashing "Select your bike". */
  hasHydrated: boolean;
  /** The header's bike selector dialog, so any "Select your bike" prompt on the page can open it. */
  isSelectorOpen: boolean;
  selectBike: (bike: SelectedBike) => void;
  setSelectorOpen: (open: boolean) => void;
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      selectedBike: null,
      hasHydrated: false,
      isSelectorOpen: false,
      selectBike: (bike) => set({ selectedBike: bike }),
      setSelectorOpen: (open) => set({ isSelectorOpen: open }),
    }),
    {
      name: "kg-selected-bike",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
      partialize: ({ selectedBike }) => ({ selectedBike }),
      onRehydrateStorage: () => () => useVehicleStore.setState({ hasHydrated: true }),
    },
  ),
);
