import type { Paginated } from "@/lib/types";

const DEFAULT_PAGE_SIZE = 12;

/** Slices a full result set the way the backend will, so the UI gets the same Paginated shape. */
export function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}
