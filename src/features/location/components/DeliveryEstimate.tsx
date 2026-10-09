"use client";

import { Truck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PinForm } from "@/features/location/components/PinForm";
import { useLocationStore } from "@/features/location/store";
import type { PinLocation } from "@/features/location/types";
import { getDeliveryDate } from "@/features/location/utils";
import { FREE_DELIVERY_THRESHOLD_IN_PAISE } from "@/lib/constants";
import { formatDay, formatPrice } from "@/lib/format";
import { useIsClient } from "@/lib/use-is-client";

/** "Delivery by Tue, 14 Oct" for the customer's PIN, with a way to check another PIN. */
export function DeliveryEstimate({ defaultLocation }: { defaultLocation: PinLocation | null }) {
  const location = useLocationStore((state) => state.location) ?? defaultLocation;
  const [isEditing, setIsEditing] = useState(false);
  // The date depends on today in the browser, so it's only worked out after hydration.
  const isClient = useIsClient();

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <Truck className="mt-0.5 size-5 shrink-0 text-navy-700" aria-hidden />
      {location && !isEditing ? (
        <div className="grid flex-1 gap-1 text-sm">
          <p className="text-gray-900">
            Delivery by{" "}
            <span className="font-semibold">
              {isClient && location.deliveryDays !== null
                ? formatDay(getDeliveryDate(new Date(), location.deliveryDays))
                : "…"}
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-x-2 text-gray-600">
            To {location.area}, {location.city} {location.pin}
            <Button variant="link" size="sm" onClick={() => setIsEditing(true)}>
              Change
            </Button>
          </p>
          <p className="text-xs text-gray-500">
            Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD_IN_PAISE)}
          </p>
        </div>
      ) : (
        <div className="grid flex-1 gap-2">
          <p className="text-sm font-semibold text-gray-900">Check delivery date</p>
          <PinForm submitLabel="Check" onSaved={() => setIsEditing(false)} />
        </div>
      )}
    </div>
  );
}
