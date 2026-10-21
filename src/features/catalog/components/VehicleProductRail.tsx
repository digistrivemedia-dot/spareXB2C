"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import { ProductRailSkeleton } from "@/features/catalog/components/ProductRailSkeleton";
import type { ProductQuery } from "@/features/catalog/types";
import { useProducts } from "@/features/catalog/useProducts";
import { useVehicleStore } from "@/features/vehicles/store";
import { getVehicleName, getVehiclePartsHref } from "@/features/vehicles/utils";

const RAIL_SIZE = 10;

/** "For your KTM Duke 200": parts that fit the selected vehicle. Hidden until a vehicle is selected. */
export function VehicleProductRail() {
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const query = useMemo<ProductQuery | null>(
    () =>
      selectedVehicle && {
        fits: selectedVehicle,
        sort: "relevance",
        pageSize: RAIL_SIZE,
      },
    [selectedVehicle],
  );
  const products = useProducts(query);

  if (!selectedVehicle) return null;

  const vehicleName = getVehicleName(selectedVehicle);
  const allPartsHref = getVehiclePartsHref(selectedVehicle);

  return (
    <Section
      id="for-your-vehicle"
      title={`For your ${vehicleName}`}
      link={{ href: allPartsHref, label: "View all" }}
    >
      {products.status === "loading" && <ProductRailSkeleton />}
      {products.status === "error" && <ErrorState onRetry={products.retry} titleAs="h3" />}
      {products.status === "success" &&
        (products.data.items.length > 0 ? (
          <ProductRail products={products.data.items} label={`Parts for your ${vehicleName}`} />
        ) : (
          <EmptyState
            icon={SearchX}
            titleAs="h3"
            title={`No parts for your ${vehicleName} yet`}
            description="We're adding parts for more vehicles every week. Meanwhile, browse universal parts and accessories."
          >
            <Button asChild variant="secondary">
              <Link href="/products">Browse all parts</Link>
            </Button>
          </EmptyState>
        ))}
    </Section>
  );
}
