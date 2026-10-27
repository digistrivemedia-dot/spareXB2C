"use client";

import { CalendarPlus, ChevronRight, Clock, Navigation, Phone, Star, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Garage } from "@/features/service/types";
import { useFavouriteGarages } from "@/features/service/useFavouriteGarages";
import { formatOpeningHours } from "@/features/service/utils";

type GarageRowProps = {
  garage: Pick<Garage, "slug" | "name" | "rating" | "area" | "photos">;
  vehicleId: string;
};

function GarageRow({ garage, vehicleId }: GarageRowProps) {
  const photo = garage.photos[0];
  return (
    <li className="flex items-center gap-3">
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
        {photo ? (
          <Image src={photo.url} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <Wrench className="size-4" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <Link
          href={`/services/garages/${garage.slug}`}
          className="block truncate font-semibold text-gray-900 hover:text-navy-700"
        >
          {garage.name}
        </Link>
        <span className="flex items-center gap-1 text-gray-600">
          <Star className="size-3.5 shrink-0 fill-warning-500 text-warning-500" aria-hidden />
          <span className="truncate">
            {garage.rating.toFixed(1)} · {garage.area}
          </span>
        </span>
      </span>
      <Link
        href={`/services/book?garage=${garage.slug}&vehicle=${vehicleId}`}
        className="shrink-0 text-sm font-semibold text-navy-700 hover:underline"
      >
        Book
      </Link>
    </li>
  );
}

type YourGarageCardProps = {
  vehicleId: string;
  /** Where this vehicle was last serviced, or Kannali's main branch until then. */
  garage: Garage;
};

/** The vehicle's usual garage up top with Call, Directions and Book; the customer's other favourites below. */
export function YourGarageCard({ vehicleId, garage }: YourGarageCardProps) {
  const { isLoading, garages: favourites } = useFavouriteGarages();
  const others = favourites.filter((g) => g.id !== garage.id).slice(0, 2);
  const photo = garage.photos[0];
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${garage.location.lat},${garage.location.lng}`;

  return (
    <Card
      aria-labelledby="your-garage-heading"
      className="grid grid-cols-1 content-start gap-4 overflow-hidden p-0 md:p-0"
    >
      <div className="relative aspect-16/9 bg-navy-800">
        {photo && (
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(min-width: 1280px) 400px, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy-800 shadow-sm">
          Your garage
        </span>
      </div>

      <div className="grid gap-3 px-4 md:px-5">
        <div>
          <h2 id="your-garage-heading" className="font-semibold text-gray-900">
            <Link href={`/services/garages/${garage.slug}`} className="hover:text-navy-700">
              {garage.name}
            </Link>
          </h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <Star className="size-4 fill-warning-500 text-warning-500" aria-hidden />
            <span className="font-semibold text-gray-900">{garage.rating.toFixed(1)}</span>
            <span>({garage.reviewCount} reviews)</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="size-4 shrink-0 text-gray-500" aria-hidden />
            {formatOpeningHours(garage.openingHours)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild size="sm" className="col-span-2">
            <Link href={`/services/book?garage=${garage.slug}&vehicle=${vehicleId}`}>
              <CalendarPlus aria-hidden />
              Book here
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={`tel:+91${garage.phone}`}>
              <Phone aria-hidden />
              Call
            </a>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={directions} target="_blank" rel="noreferrer">
              <Navigation aria-hidden />
              Directions
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 border-t border-gray-200 px-4 py-4 md:px-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Favourite garages</h3>
          <Link
            href="/account/garages"
            className="inline-flex items-center text-sm font-semibold text-navy-700 hover:underline"
          >
            See all
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 rounded-lg" />
        ) : others.length > 0 ? (
          <ul className="grid gap-3">
            {others.map((favourite) => (
              <GarageRow key={favourite.id} garage={favourite} vehicleId={vehicleId} />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">
            Tap the heart on any garage to keep it here for quick booking.
          </p>
        )}
      </div>
    </Card>
  );
}
