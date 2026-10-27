import { createSavedIdsStore } from "@/lib/saved-ids-store";

/** Saved parts: product ids. */
export const useWishlistStore = createSavedIdsStore("kg-saved-parts");
