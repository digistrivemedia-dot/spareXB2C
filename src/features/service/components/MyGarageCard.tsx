import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RateVisitDialog } from "@/features/service/components/RateVisitDialog";
import type { Garage, ServiceRecord } from "@/features/service/types";
import { formatOpeningHours } from "@/features/service/utils";

type MyGarageCardProps = {
  garage: Garage;
  /** The visit the customer can rate; none before their first service. */
  lastVisit: ServiceRecord | null;
};

export function MyGarageCard({ garage, lastVisit }: MyGarageCardProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${garage.location.lat},${garage.location.lng}`;

  return (
    <Card aria-labelledby="my-garage-heading" className="flex flex-col">
      <SectionHeader id="my-garage-heading" title="My garage" />
      <Link
        href={`/services/garages/${garage.slug}`}
        className="font-semibold text-gray-900 hover:text-navy-700 hover:underline"
      >
        {garage.name}
      </Link>
      <Rating average={garage.rating} count={garage.reviewCount} className="mt-1" />
      <ul className="mt-3 grid gap-2 text-sm text-gray-700">
        <li className="flex gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
          {garage.address}, {garage.area}, {garage.city} {garage.pin}
        </li>
        <li className="flex gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
          {formatOpeningHours(garage.openingHours)}
        </li>
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-200 pt-4">
        <Button asChild variant="secondary" size="sm">
          <a href={`tel:+91${garage.phone}`}>
            <Phone aria-hidden />
            Call
          </a>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation aria-hidden />
            Directions
            <span className="sr-only">(opens Google Maps)</span>
          </a>
        </Button>
        {lastVisit && !lastVisit.isRated && (
          <RateVisitDialog
            jobId={lastVisit.id}
            garageName={garage.name}
            visitDate={lastVisit.completedOn}
          />
        )}
      </div>
    </Card>
  );
}
