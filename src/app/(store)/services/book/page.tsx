import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { getAddresses } from "@/features/account/api";
import { getSession } from "@/features/auth/session";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarages, getServiceSlots, getServiceTypes } from "@/features/service/api";
import { BookingWizard } from "@/features/service/components/BookingWizard";
import { getMyBikes } from "@/features/vehicles/api";

export const metadata: Metadata = {
  title: "Book a service",
  description: "Book a service at Kannali Garage, with free pickup and drop.",
};

export default async function BookServicePage() {
  // Bookings belong to the customer's bikes, so guests log in first.
  if (!(await getSession())) redirect("/login?next=/services/book");

  const location = await getDefaultLocation();
  const [bikes, serviceTypes, garages, addresses] = await Promise.all([
    getMyBikes(),
    getServiceTypes(),
    getGarages(location?.pin ?? null),
    getAddresses(),
  ]);
  const slots = await Promise.all(garages.map((garage) => getServiceSlots(garage.id)));
  const slotsByGarage = Object.fromEntries(
    garages.map((garage, index) => [garage.id, slots[index]]),
  );

  return (
    <Container className="grid max-w-3xl grid-cols-1 gap-6 py-6 lg:py-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Book a service</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Takes about a minute. Free pickup and drop across Bengaluru.
        </p>
      </div>
      <BookingWizard
        bikes={bikes}
        serviceTypes={serviceTypes}
        garages={garages}
        slotsByGarage={slotsByGarage}
        addresses={addresses}
      />
    </Container>
  );
}
