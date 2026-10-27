"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { ProductGridSkeleton } from "@/features/catalog/components/ProductGridSkeleton";
import type { ProductQuery } from "@/features/catalog/types";
import { useProducts } from "@/features/catalog/useProducts";
import { useWishlistStore } from "@/features/wishlist/store";

/** The parts the customer saved with the heart, saved in this browser for now. */
export function SavedItems() {
  const productIds = useWishlistStore((state) => state.ids);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);
  // Fetched once the saved list loads. Un-saving only hides the card, so the grid doesn't reload.
  const query = useMemo<ProductQuery | null>(() => {
    const ids = hasHydrated ? useWishlistStore.getState().ids : [];
    return ids.length > 0 ? { ids, pageSize: 100 } : null;
  }, [hasHydrated]);
  const products = useProducts(query);
  const visible = products.data?.items.filter((p) => productIds.includes(p.id)) ?? [];

  if (!hasHydrated || products.status === "loading") return <ProductGridSkeleton />;
  if (products.status === "error") return <ErrorState onRetry={products.retry} />;
  if (visible.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing saved yet"
        description="Tap the heart on any part to keep it here for later."
      >
        <Button asChild>
          <Link href="/products">Browse parts</Link>
        </Button>
      </EmptyState>
    );
  }
  return (
    <div className="grid gap-4">
      <p className="text-sm text-gray-600">
        {visible.length} saved {visible.length === 1 ? "part" : "parts"}
      </p>
      <ProductGrid products={visible} />
    </div>
  );
}
