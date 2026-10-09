import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

const itemClass =
  "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-10 md:min-w-10";

/** Page numbers around the current page, with the first and last always shown. */
function visiblePages(page: number, totalPages: number): (number | "gap")[] {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  return pages.flatMap((p, index) =>
    index > 0 && p - pages[index - 1] > 1 ? ["gap" as const, p] : [p],
  );
}

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={hrefForPage(page - 1)}
          className={cn(itemClass, "border-gray-300 bg-white text-gray-900 hover:bg-gray-50")}
        >
          <ChevronLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
          <span className="sr-only sm:hidden">Previous page</span>
        </Link>
      )}
      {visiblePages(page, totalPages).map((p, index) =>
        p === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-gray-500" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(
              itemClass,
              p === page
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={hrefForPage(page + 1)}
          className={cn(itemClass, "border-gray-300 bg-white text-gray-900 hover:bg-gray-50")}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sr-only sm:hidden">Next page</span>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
