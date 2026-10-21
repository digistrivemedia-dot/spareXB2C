import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { lookupPin } from "@/features/location/api";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarages, getServiceTypes } from "@/features/service/api";
import { GarageCard } from "@/features/service/components/GarageCard";
import { GarageFilterBar } from "@/features/service/components/GarageFilterBar";
import { parseGarageFilters, toGarageQuery } from "@/features/service/filters";

export const metadata: Metadata = {
  title: "Garages near you",
  description:
    "Kannali Garage branches and approved partner garages, with their prices, hours and ratings.",
};

export default async function GaragesPage({ searchParams }: PageProps<"/services/garages">) {
  const filters = parseGarageFilters(await searchParams);
  const defaultLocation = filters.pin ? null : await getDefaultLocation();
  const query = toGarageQuery(filters, defaultLocation?.pin);
  const [garages, serviceTypes, area] = await Promise.all([
    getGarages(query),
    getServiceTypes(),
    query.pin ? lookupPin(query.pin) : null,
  ]);
  const service = serviceTypes.find((t) => t.id === filters.service);

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: "Garages" }]} />
      <PageHeader
        title="Garages near you"
        description={
          area
            ? `${garages.length} ${garages.length === 1 ? "garage" : "garages"} near ${area.area}, ${area.city} (${area.pin})`
            : "Add your PIN code to see the nearest garages first."
        }
      />
      <GarageFilterBar filters={filters} serviceTypes={serviceTypes} pin={query.pin} />
      {garages.length > 0 ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {garages.map((garage) => (
            <li key={garage.id}>
              <GarageCard garage={garage} serviceTypeId={service?.id} serviceName={service?.name} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No garages match"
          description="Try fewer filters, or another service or vehicle."
        >
          <Button asChild>
            <Link href={query.pin ? `/services/garages?pin=${query.pin}` : "/services/garages"}>
              Clear filters
            </Link>
          </Button>
        </EmptyState>
      )}
    </Container>
  );
}
