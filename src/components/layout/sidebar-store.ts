import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarState = {
  /** Icons only, to give the page more room. Remembered on this device. */
  isCollapsed: boolean;
  toggle: () => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set(({ isCollapsed }) => ({ isCollapsed: !isCollapsed })),
    }),
    {
      name: "kg-sidebar",
      // Rehydrated on the client by StoreHydration, so server and first client render match.
      skipHydration: true,
    },
  ),
);
