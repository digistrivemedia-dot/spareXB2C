import { MessageSquareText, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { clearedFilters, type ProductFilters, productsHref } from "@/features/catalog/filters";
import type { MyVehicle, VehicleRef } from "@/features/vehicles/types";
import { getVehicleName, isSameVehicle } from "@/features/vehicles/utils";

type ListingEmptyStateProps = {
  filters: ProductFilters;
  fitVehicle: VehicleRef | null;
  /** Filters "Clear filters" would remove; 0 means only the search, category or vehicle narrow it. */
  activeCount: number;
  categoryName: string | undefined;
  myVehicles: MyVehicle[];
};

/** Why nothing is listed, and the most useful next step: clear filters, see all, or ask us. */
export function ListingEmptyState({
  filters,
  fitVehicle,
  activeCount,
  categoryName,
  myVehicles,
}: ListingEmptyStateProps) {
  if (activeCount > 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No parts match these filters"
        description="Try removing a filter, or search for the part by name or part number."
      >
        <Button asChild>
          <Link href={productsHref(filters, clearedFilters)}>Clear filters</Link>
        </Button>
      </EmptyState>
    );
  }

  // Nothing to clear: the vehicle or the search itself finds nothing, so the parts team can help.
  const savedVehicle = fitVehicle && myVehicles.find((v) => isSameVehicle(v, fitVehicle));
  const enquiry = new URLSearchParams({ reason: "part-not-found" });
  if (savedVehicle) enquiry.set("vehicle", savedVehicle.id);
  else if (fitVehicle)
    enquiry.set("describe", `${getVehicleName(fitVehicle)} (${fitVehicle.year})`);
  const part = filters.q ?? categoryName;
  if (part) enquiry.set("part", part);

  const forVehicle = fitVehicle ? ` for your ${getVehicleName(fitVehicle)}` : "";
  const title = filters.q
    ? `No parts match “${filters.q}”${forVehicle}`
    : `No ${categoryName?.toLowerCase() ?? "parts"}${forVehicle} yet`;

  return (
    <EmptyState
      icon={SearchX}
      title={title}
      description="Tell us what you need and our parts team will find it, or let you know when it's in stock."
    >
      <Button asChild>
        <Link href={`/account/enquiries/new?${enquiry}`}>
          <MessageSquareText aria-hidden />
          Send an enquiry
        </Link>
      </Button>
      <Button asChild variant="secondary">
        <Link
          href={
            fitVehicle
              ? productsHref(filters, { vehicle: undefined, fits: false, showAll: true })
              : "/products"
          }
        >
          {fitVehicle ? "Show all parts" : "Browse all parts"}
        </Link>
      </Button>
    </EmptyState>
  );
}
