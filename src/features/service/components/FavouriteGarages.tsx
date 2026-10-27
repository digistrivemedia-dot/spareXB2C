"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { GarageCard } from "@/features/service/components/GarageCard";
import { useFavouriteGarages } from "@/features/service/useFavouriteGarages";

/** The garages the customer marked with the heart. */
export function FavouriteGarages() {
  const { isLoading, isError, retry, garages } = useFavouriteGarages();

  if (isLoading) {
    return (
      <div className="grid gap-4" aria-busy="true" aria-label="Loading">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  }
  if (isError) return <ErrorState onRetry={retry} />;
  if (garages.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favourite garages yet"
        description="Tap the heart on any garage to keep it here, ready to book."
      >
        <Button asChild>
          <Link href="/services/garages">Find a garage</Link>
        </Button>
      </EmptyState>
    );
  }
  return (
    <ul className="grid gap-4">
      {garages.map((garage) => (
        <li key={garage.id}>
          <GarageCard garage={garage} />
        </li>
      ))}
    </ul>
  );
}
