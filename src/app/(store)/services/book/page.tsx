import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getAddresses } from "@/features/account/api";
import { getSession } from "@/features/auth/session";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarage, getServicePackages } from "@/features/service/api";
import { BookingWizard } from "@/features/service/components/BookingWizard";
import { getMyVehicles } from "@/features/vehicles/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Book a service",
  description:
    "Pick a package for your vehicle, a day and free pick and drop. Nothing to pay when you book.",
};

/** Links can fill in steps: `vehicle` (a saved vehicle id), `package` (one of its packages) and `garage` (a slug). */
export default async function BookServicePage({ searchParams }: PageProps<"/services/book">) {
  const params = await searchParams;
  // Bookings belong to the customer's vehicles, so guests log in first.
  if (!(await getSession())) redirect("/login?next=/services/book");

  const location = await getDefaultLocation();
  const garageSlug = getSearchParam(params, "garage");
  const [vehicles, addresses, garage] = await Promise.all([
    getMyVehicles(),
    getAddresses(),
    garageSlug ? getGarage(garageSlug, location?.pin) : null,
  ]);
  const packagesByVehicle = Object.fromEntries(
    await Promise.all(
      vehicles.map(async (v) => [v.id, await getServicePackages(v.modelId)] as const),
    ),
  );
  const vehicleId = getSearchParam(params, "vehicle");
  const packageId = getSearchParam(params, "package");

  return (
    <Container className="grid max-w-3xl grid-cols-1 gap-6 py-6 lg:py-8">
      <PageHeader
        title="Book a service"
        description="Takes about a minute. Nothing to pay when you book."
      />
      <BookingWizard
        vehicles={vehicles}
        packagesByVehicle={packagesByVehicle}
        addresses={addresses}
        pin={location?.pin ?? null}
        initial={{
          vehicleId: vehicles.some((v) => v.id === vehicleId) ? vehicleId : undefined,
          // Only a package for that vehicle, e.g. "Book this service" on the home page.
          packageId: packagesByVehicle[vehicleId ?? ""]?.some((p) => p.id === packageId)
            ? packageId
            : undefined,
          garage: garage ?? undefined,
        }}
      />
    </Container>
  );
}
