"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilterPanel } from "@/features/catalog/components/ProductFilterPanel";
import type { ProductFilters } from "@/features/catalog/filters";
import type { ProductFacets } from "@/features/catalog/types";

type MobileFiltersProps = {
  filters: ProductFilters;
  facets: ProductFacets;
  activeCount: number;
  resultCount: number;
};

/** "Filters" button opening the filter panel as a bottom sheet, for screens without the sidebar. */
export function MobileFilters({ filters, facets, activeCount, resultCount }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <SlidersHorizontal aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-navy-800 text-xs text-white tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      {/* 85dvh leaves the page visible above the sheet; no spacing token covers a viewport share. */}
      <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-xl">
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">Narrow down the parts list.</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4 py-5">
          <ProductFilterPanel filters={filters} facets={facets} />
        </div>
        <SheetFooter className="border-t border-gray-200">
          <SheetClose asChild>
            <Button size="lg">
              Show {resultCount} {resultCount === 1 ? "part" : "parts"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
