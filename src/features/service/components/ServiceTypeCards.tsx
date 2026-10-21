import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ServiceType } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

/** What customers book most, each with the lowest starting price across garages. */
export function ServiceTypeCards({ types }: { types: ServiceType[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {types.map((type) => (
        <li
          key={type.id}
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5"
        >
          <h3 className="font-semibold text-gray-900">{type.name}</h3>
          <p className="text-sm font-semibold text-orange-800">
            from {formatPrice(type.fromPriceInPaise)}
          </p>
          <p className="flex-1 text-sm text-gray-600">{type.description}</p>
          <p className="text-xs text-gray-500">{type.duration}</p>
          <Button asChild variant="secondary" size="sm" className="mt-2">
            <Link href={`/services/book?service=${type.id}`}>Book {type.name.toLowerCase()}</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
