import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedIdsState = {
  ids: string[];
  /** False until the saved list has been read from localStorage. */
  hasHydrated: boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
};

/**
 * Things the customer saved with a heart (parts, garages), kept in this browser under `storageKey` until the
 * backend stores them. Rehydrated on the client by StoreHydration, so server and first client render match.
 */
export function createSavedIdsStore(storageKey: string) {
  const useStore = create<SavedIdsState>()(
    persist(
      (set) => ({
        ids: [],
        hasHydrated: false,
        toggle: (id) =>
          set(({ ids }) => ({
            ids: ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id],
          })),
        add: (id) => set(({ ids }) => ({ ids: ids.includes(id) ? ids : [...ids, id] })),
      }),
      {
        name: storageKey,
        skipHydration: true,
        partialize: ({ ids }) => ({ ids }),
        onRehydrateStorage: () => () => useStore.setState({ hasHydrated: true }),
      },
    ),
  );
  return useStore;
}
