import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Garage, ServiceType } from "@/features/service/types";
import { getGaragePrice } from "@/features/service/utils";
import { formatPrice } from "@/lib/format";

type GarageServicesCardProps = {
  garage: Garage;
  serviceTypes: ServiceType[];
};

/** The services this garage offers, at its own starting prices, each bookable. */
export function GarageServicesCard({ garage, serviceTypes }: GarageServicesCardProps) {
  const offered = serviceTypes.flatMap((type) => {
    const price = getGaragePrice(garage, type.id);
    return price === null ? [] : [{ type, price }];
  });

  return (
    <Card aria-labelledby="garage-services-heading">
      <SectionHeader id="garage-services-heading" title="Services and prices" />
      <ul className="divide-y divide-gray-200">
        {offered.map(({ type, price }) => (
          <li
            key={type.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1 basis-56 text-sm">
              <p className="font-semibold text-gray-900">{type.name}</p>
              <p className="text-gray-600">{type.description}</p>
              <p className="text-xs text-gray-500">
                {type.duration} · {type.includes.join(", ")}
              </p>
            </div>
            <p className="font-semibold text-gray-900 tabular-nums">from {formatPrice(price)}</p>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/services/book?garage=${garage.slug}&service=${type.id}`}>Book</Link>
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-gray-500">
        Starting prices, including GST. The garage sends an estimate before any extra work.
      </p>
    </Card>
  );
}
