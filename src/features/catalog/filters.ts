import type { ProductQuery, ProductSort } from "@/features/catalog/types";
import type { VehicleRef } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { getSearchParam, type SearchParams } from "@/lib/search-params";

export const PRODUCTS_PAGE_SIZE = 12;

export const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest discount" },
];

/**
 * The product listing's state as it lives in the URL (shareable, and the back button works).
 * Prices are whole rupees here for readable URLs; the API takes paise.
 */
export type ProductFilters = {
  q?: string;
  category?: string;
  brands: string[];
  /** "<variantId>.<year>"; only filters when `fits` is on. */
  bike?: string;
  fits: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  minRating?: number;
  minDiscount?: number;
  warranty: boolean;
  sort: ProductSort;
  page: number;
};

function positiveInt(value: string | undefined): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

export function parseProductFilters(params: SearchParams): ProductFilters {
  const get = (key: string) => getSearchParam(params, key)?.trim() || undefined;
  const sort = sortOptions.find((option) => option.value === get("sort"))?.value ?? "relevance";

  return {
    q: get("q"),
    category: get("category"),
    brands: get("brand")?.split(",").filter(Boolean) ?? [],
    bike: get("bike"),
    fits: get("fits") === "true",
    minPrice: positiveInt(get("minPrice")),
    maxPrice: positiveInt(get("maxPrice")),
    inStock: get("inStock") === "true",
    minRating: positiveInt(get("rating")),
    minDiscount: positiveInt(get("discount")),
    warranty: get("warranty") === "true",
    sort,
    page: positiveInt(get("page")) ?? 1,
  };
}

/**
 * The /products URL for these filters with `changes` applied. Any change other than the page
 * goes back to page 1, so the customer never lands on an empty page.
 */
export function productsHref(
  filters: ProductFilters,
  changes: Partial<ProductFilters> = {},
): string {
  const next = { ...filters, page: 1, ...changes };
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | boolean | undefined) => {
    if (value !== undefined && value !== false && value !== "") params.set(key, String(value));
  };

  set("q", next.q);
  set("category", next.category);
  set("brand", next.brands.join(","));
  set("bike", next.bike);
  set("fits", next.fits && Boolean(next.bike));
  set("minPrice", next.minPrice);
  set("maxPrice", next.maxPrice);
  set("inStock", next.inStock);
  set("rating", next.minRating);
  set("discount", next.minDiscount);
  set("warranty", next.warranty);
  if (next.sort !== "relevance") set("sort", next.sort);
  if (next.page > 1) set("page", next.page);

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

/** The API query for these filters; `bike` is the parsed `bike` param, when fit filtering is on. */
export function toProductQuery(filters: ProductFilters, bike: VehicleRef | null): ProductQuery {
  const toPaise = (rupees: number | undefined) => (rupees === undefined ? undefined : rupees * 100);
  return {
    q: filters.q,
    category: filters.category,
    brand: filters.brands,
    fits: bike ?? undefined,
    minPriceInPaise: toPaise(filters.minPrice),
    maxPriceInPaise: toPaise(filters.maxPrice),
    inStock: filters.inStock,
    minRating: filters.minRating,
    minDiscountPercent: filters.minDiscount,
    hasWarranty: filters.warranty,
    sort: filters.sort,
    page: filters.page,
    pageSize: PRODUCTS_PAGE_SIZE,
  };
}

/** What "Clear all" resets: every filter, but not where the customer is (search, category, bike). */
export const clearedFilters: Partial<ProductFilters> = {
  brands: [],
  minPrice: undefined,
  maxPrice: undefined,
  inStock: false,
  minRating: undefined,
  minDiscount: undefined,
  warranty: false,
};

/** How many filters "Clear all" would remove, for the mobile Filters button. */
export function countActiveFilters(filters: ProductFilters): number {
  return (
    filters.brands.length +
    Number(Boolean(filters.minPrice || filters.maxPrice)) +
    Number(filters.inStock) +
    Number(Boolean(filters.minRating)) +
    Number(Boolean(filters.minDiscount)) +
    Number(filters.warranty)
  );
}

/** "Brakes for KTM Duke 200", "Results for “motul”", "Brakes" or "All parts". */
export function getListingTitle(
  filters: ProductFilters,
  categoryName: string | undefined,
  fitBike: VehicleRef | null,
): string {
  if (fitBike) return `${categoryName ?? "Parts"} for ${getBikeName(fitBike)}`;
  if (filters.q) return `Results for “${filters.q}”`;
  return categoryName ?? "All parts";
}
