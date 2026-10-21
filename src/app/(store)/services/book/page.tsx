import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/features/auth/session";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarage, getServiceTypes } from "@/features/service/api";
import { BookingWizard } from "@/features/service/components/BookingWizard";
import { getMyVehicles } from "@/features/vehicles/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Book a service",
  description: "Choose a garage near you and a day. Nothing to pay when you book.",
};

/** Links can fill in steps: `vehicle` (a saved vehicle id), `service` (a service id), `garage` (a slug). */
export default async function BookServicePage({ searchParams }: PageProps<"/services/book">) {
  const params = await searchParams;
  // Bookings belong to the customer's vehicles, so guests log in first.
  if (!(await getSession())) redirect("/login?next=/services/book");

  const location = await getDefaultLocation();
  const garageSlug = getSearchParam(params, "garage");
  const [vehicles, serviceTypes, garage] = await Promise.all([
    getMyVehicles(),
    getServiceTypes(),
    garageSlug ? getGarage(garageSlug, location?.pin) : null,
  ]);
  const vehicleId = getSearchParam(params, "vehicle");
  const serviceTypeId = getSearchParam(params, "service");

  return (
    <Container className="grid max-w-3xl grid-cols-1 gap-6 py-6 lg:py-8">
      <PageHeader
        title="Book a service"
        description="Takes about a minute. Nothing to pay when you book."
      />
      <BookingWizard
        vehicles={vehicles}
        serviceTypes={serviceTypes}
        pin={location?.pin ?? null}
        initial={{
          vehicleId: vehicles.some((v) => v.id === vehicleId) ? vehicleId : undefined,
          serviceTypeId: serviceTypes.some((t) => t.id === serviceTypeId)
            ? serviceTypeId
            : undefined,
          garage: garage ?? undefined,
        }}
      />
    </Container>
  );
}
