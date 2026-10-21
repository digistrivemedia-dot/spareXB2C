import { CalendarPlus, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getServiceHistory, getServiceJobs } from "@/features/service/api";
import { ServiceJobCard } from "@/features/service/components/ServiceJobCard";
import { ServiceRecordRow } from "@/features/service/components/ServiceRecordRow";
import { getMyVehicles } from "@/features/vehicles/api";
import { getVehicleName } from "@/features/vehicles/utils";

export const metadata: Metadata = { title: "My services" };

export default async function MyServicesPage() {
  const [jobs, history, vehicles] = await Promise.all([
    getServiceJobs(),
    getServiceHistory(),
    getMyVehicles(),
  ]);
  const vehicleName = (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    return vehicle ? getVehicleName(vehicle) : "Removed vehicle";
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="My services"
        description="Your bookings, services in progress and past visits, for all your vehicles."
        action={
          <Button asChild>
            <Link href="/services/book">
              <CalendarPlus aria-hidden />
              Book a service
            </Link>
          </Button>
        }
      />

      <section aria-labelledby="current-services-heading" className="grid gap-3">
        <h2
          id="current-services-heading"
          className="text-lg font-semibold text-gray-900 md:text-xl"
        >
          Bookings and services in progress
        </h2>
        {jobs.length > 0 ? (
          <ul className="grid gap-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <ServiceJobCard job={job} vehicleName={vehicleName(job.vehicleId)} />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <EmptyState
              icon={Wrench}
              titleAs="h3"
              title="Nothing booked right now"
              description="Book a service and follow it here, from the garage confirming to ready to collect."
              className="py-8"
            />
          </Card>
        )}
      </section>

      <Card aria-labelledby="past-services-heading">
        <SectionHeader id="past-services-heading" title="Past services" />
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {history.map((record) => (
              <li key={record.id}>
                <Link
                  href={`/account/services/${record.id}`}
                  className="block rounded-lg py-4 outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <ServiceRecordRow record={record} vehicleName={vehicleName(record.vehicleId)} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">Your finished services and bills will show here.</p>
        )}
      </Card>
    </div>
  );
}
