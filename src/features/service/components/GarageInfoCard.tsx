import { Clock, MapPin, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { GarageOption } from "@/features/service/types";
import { formatDistance, formatOpeningHours } from "@/features/service/utils";
import { describeVehicleTypes } from "@/features/vehicles/utils";
import { formatMobile } from "@/lib/format";

/** Address, hours and what the garage works on, with Call and Directions. */
export function GarageInfoCard({ garage }: { garage: GarageOption }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${garage.location.lat},${garage.location.lng}`;

  return (
    <Card aria-label="Visiting the garage" className="grid gap-4 text-sm text-gray-700">
      <p className="flex gap-2">
        <MapPin className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
        <span>
          {garage.address}, {garage.area}, {garage.city} {garage.pin}
          {garage.distanceKm !== null && (
            <span className="block text-gray-500">
              {formatDistance(garage.distanceKm)} from you
            </span>
          )}
        </span>
      </p>
      <p className="flex gap-2">
        <Clock className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
        {formatOpeningHours(garage.openingHours)}
      </p>
      <p className="first-letter:uppercase">
        Works on {describeVehicleTypes(garage.vehicleTypes)}.
      </p>
      <p>{garage.about}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm">
          <a href={`tel:+91${garage.phone}`}>
            <Phone aria-hidden />
            Call {formatMobile(garage.phone)}
          </a>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <a href={directions} target="_blank" rel="noreferrer">
            <Navigation aria-hidden />
            Directions
          </a>
        </Button>
      </div>
    </Card>
  );
}
