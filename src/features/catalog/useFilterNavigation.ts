import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { type ProductFilters, productsHref } from "@/features/catalog/filters";

/** Applies a filter change by navigating to the new URL, which re-renders the listing on the server. */
export function useFilterNavigation(filters: ProductFilters) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function apply(changes: Partial<ProductFilters>) {
    startTransition(() => router.push(productsHref(filters, changes), { scroll: false }));
  }

  return { apply, isPending };
}
