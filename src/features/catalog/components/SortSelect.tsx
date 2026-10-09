"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ProductFilters, sortOptions } from "@/features/catalog/filters";
import type { ProductSort } from "@/features/catalog/types";
import { useFilterNavigation } from "@/features/catalog/useFilterNavigation";

export function SortSelect({ filters }: { filters: ProductFilters }) {
  const id = useId();
  const { apply } = useFilterNavigation(filters);

  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor={id}
        className="sr-only font-normal whitespace-nowrap text-gray-600 sm:not-sr-only"
      >
        Sort by
      </Label>
      <Select value={filters.sort} onValueChange={(sort) => apply({ sort: sort as ProductSort })}>
        <SelectTrigger id={id} className="w-44 sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
