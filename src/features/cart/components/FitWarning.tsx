"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItem } from "@/features/cart/types";
import { getFitStatus } from "@/features/catalog/utils";
import { useVehicleStore } from "@/features/vehicles/store";
import { getBikeName } from "@/features/vehicles/utils";

/** Warns before checkout when parts in the cart don't fit the customer's selected bike. */
export function FitWarning({ items }: { items: CartItem[] }) {
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const openSelector = useVehicleStore((state) => state.setSelectorOpen);
  if (!selectedBike) return null;

  const misfits = items.filter((item) => getFitStatus(item.fitment, selectedBike) === "no-fit");
  if (misfits.length === 0) return null;

  const bikeName = getBikeName(selectedBike);
  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-warning-500 bg-warning-50 p-4">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning-700" aria-hidden />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-gray-900">
          {misfits.length === 1
            ? `1 part doesn't fit your ${bikeName}`
            : `${misfits.length} parts don't fit your ${bikeName}`}
        </p>
        <ul className="mt-1 list-disc pl-5 text-gray-700">
          {misfits.map((item) => (
            <li key={item.productId}>{item.name}</li>
          ))}
        </ul>
        <p className="mt-2 text-gray-700">
          Remove them, or change the bike if you&apos;re buying for another one.{" "}
          <Button variant="link" size="sm" onClick={() => openSelector(true)}>
            Change bike
          </Button>
        </p>
      </div>
    </div>
  );
}
