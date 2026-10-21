import { Clock, MapPin, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/Rating";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { GarageOption } from "@/features/service/types";
import { formatDistance, formatOpeningHours, getGaragePrice } from "@/features/service/utils";
import { describeVehicleTypes } from "@/features/vehicles/utils";
import { formatPrice } from "@/lib/format";

type GarageCardProps = {
  garage: GarageOption;
  /** The service the customer filtered by, to show this garage's price for it. */
  serviceTypeId?: string;
  serviceName?: string;
};

/** One garage in a list: photo, rating, distance, hours, what it works on, and its price. */
export function GarageCard({ garage, serviceTypeId, serviceName }: GarageCardProps) {
  const photo = garage.photos[0];
  const href = `/services/garages/${garage.slug}`;
  const servicePrice = serviceTypeId ? getGaragePrice(garage, serviceTypeId) : null;
  const lowestPrice = Math.min(...garage.services.map((s) => s.fromPriceInPaise));
  const vehicles = describeVehicleTypes(garage.vehicleTypes);
  const bookHref = `/services/book?garage=${garage.slug}${serviceTypeId ? `&service=${serviceTypeId}` : ""}`;

  return (
    <article
      aria-labelledby={`garage-${garage.id}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:flex-row"
    >
      <div className="relative flex aspect-4/3 shrink-0 items-center justify-center bg-gray-100 text-gray-400 sm:w-56">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(min-width: 640px) 224px, 100vw"
            className="object-cover"
          />
        ) : (
          <Wrench className="size-1/4" strokeWidth={1.5} aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`garage-${garage.id}`} className="text-lg font-semibold text-gray-900">
            <Link href={href} className="hover:text-navy-700">
              {garage.name}
            </Link>
          </h2>
          <StatusBadge tone={garage.isKannaliBranch ? "info" : "neutral"}>
            {garage.isKannaliBranch ? "Kannali branch" : "Partner garage"}
          </StatusBadge>
        </div>
        <Rating average={garage.rating} count={garage.reviewCount} />
        <p className="flex items-start gap-1.5 text-sm text-gray-700">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
          <span>
            {garage.area}
            {garage.distanceKm !== null && ` · ${formatDistance(garage.distanceKm)} away`}
          </span>
        </p>
        <p className="flex items-start gap-1.5 text-sm text-gray-700">
          <Clock className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden />
          {formatOpeningHours(garage.openingHours)}
        </p>
        <p className="text-sm text-gray-600 first-letter:uppercase">{vehicles}</p>
        <p className="text-sm font-semibold text-orange-800">
          {servicePrice !== null
            ? `${serviceName ?? "Service"} from ${formatPrice(servicePrice)}`
            : `Services from ${formatPrice(lowestPrice)}`}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button asChild size="sm">
            <Link href={bookHref}>Book here</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href={href}>View garage</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
