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
import { getBikeName, getBikePartsHref } from "@/features/vehicles/utils";

const RAIL_SIZE = 10;

/** "For your KTM Duke 200": parts that fit the selected bike. Hidden until a bike is selected. */
export function BikeProductRail() {
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const query = useMemo<ProductQuery | null>(
    () =>
      selectedBike && {
        fits: {
          modelId: selectedBike.modelId,
          variantId: selectedBike.variantId,
          year: selectedBike.year,
        },
        sort: "relevance",
        pageSize: RAIL_SIZE,
      },
    [selectedBike],
  );
  const products = useProducts(query);

  if (!selectedBike) return null;

  const bikeName = getBikeName(selectedBike);
  const allPartsHref = getBikePartsHref(selectedBike);

  return (
    <Section
      id="for-your-bike"
      title={`For your ${bikeName}`}
      link={{ href: allPartsHref, label: "View all" }}
    >
      {products.status === "loading" && <ProductRailSkeleton />}
      {products.status === "error" && <ErrorState onRetry={products.retry} titleAs="h3" />}
      {products.status === "success" &&
        (products.data.items.length > 0 ? (
          <ProductRail products={products.data.items} label={`Parts for your ${bikeName}`} />
        ) : (
          <EmptyState
            icon={SearchX}
            titleAs="h3"
            title={`No parts for your ${bikeName} yet`}
            description="We're adding parts for more bikes every week. Meanwhile, browse universal parts and accessories."
          >
            <Button asChild variant="secondary">
              <Link href="/products">Browse all parts</Link>
            </Button>
          </EmptyState>
        ))}
    </Section>
  );
}
