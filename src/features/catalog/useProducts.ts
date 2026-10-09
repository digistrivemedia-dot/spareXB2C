import { useEffect, useState } from "react";

import { getProducts } from "@/features/catalog/api";
import type { ProductQuery, ProductSummary } from "@/features/catalog/types";
import type { Paginated } from "@/lib/types";

type Result = {
  query: ProductQuery;
  attempt: number;
  data?: Paginated<ProductSummary>;
};

type UseProducts =
  | { status: "idle" | "loading" | "error"; data?: undefined; retry: () => void }
  | { status: "success"; data: Paginated<ProductSummary>; retry: () => void };

/**
 * Products for a query only the browser knows (e.g. the selected bike, kept in localStorage).
 * Pass a memoised query, or null to skip. Server components call getProducts directly instead.
 */
export function useProducts(query: ProductQuery | null): UseProducts {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!query) return;
    let isCurrent = true;
    getProducts(query).then(
      (data) => isCurrent && setResult({ query, attempt, data }),
      () => isCurrent && setResult({ query, attempt }),
    );
    return () => {
      isCurrent = false;
    };
  }, [query, attempt]);

  const retry = () => setAttempt((n) => n + 1);

  if (!query) return { status: "idle", retry };
  if (result?.query !== query || result.attempt !== attempt) return { status: "loading", retry };
  if (result.data) return { status: "success", data: result.data, retry };
  return { status: "error", retry };
}
