import { getProducts } from "@/features/catalog/api";
import type { ProductQuery, ProductSummary } from "@/features/catalog/types";
import type { Paginated } from "@/lib/types";
import { type DataState, useData } from "@/lib/use-data";

/**
 * Products for a query only the browser knows (e.g. the selected vehicle, kept in localStorage).
 * Pass null to skip. Server components call getProducts directly instead.
 */
export function useProducts(query: ProductQuery | null): DataState<Paginated<ProductSummary>> {
  return useData(query && JSON.stringify(query), () => getProducts(query ?? {}));
}
