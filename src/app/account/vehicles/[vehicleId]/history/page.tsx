import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getServiceHistory } from "@/features/service/api";
import { ServiceRecordRow } from "@/features/service/components/ServiceRecordRow";
import { getMyVehicle } from "@/features/vehicles/api";
import { getVehicleName } from "@/features/vehicles/utils";

export const metadata: Metadata = { title: "Service history" };

/** Every finished service for one vehicle, at any garage, newest first. */
export default async function ServiceHistoryPage({
  params,
}: PageProps<"/account/vehicles/[vehicleId]/history">) {
  const { vehicleId } = await params;
  const [vehicle, history] = await Promise.all([
    getMyVehicle(vehicleId),
    getServiceHistory(vehicleId),
  ]);
  if (!vehicle) notFound();
  const name = getVehicleName(vehicle);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[
          { label: "My vehicles", href: "/account/vehicles" },
          { label: name, href: `/account/vehicles/${vehicle.id}` },
          { label: "Service history" },
        ]}
      />
      <PageHeader
        title="Service history"
        description={`Every service on your ${name}, at any garage.`}
        action={
          <Button asChild>
            <Link href={`/services/book?vehicle=${vehicle.id}`}>Book a service</Link>
          </Button>
        }
      />
      {history.length > 0 ? (
        <ol className="grid gap-4">
          {history.map((record) => (
            <li key={record.id}>
              <Card
                aria-label={`${record.serviceType} on ${record.completedOn}`}
                className="grid gap-4"
              >
                <ServiceRecordRow record={record} vehicleName={name} />
                <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/account/services/${record.id}/report`}>Completion report</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/account/services/${record.id}/bill`}>Bill</Link>
                  </Button>
                  {!record.isRated && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/account/services/${record.id}`}>Rate this visit</Link>
                    </Button>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Finished services and their bills show here, whichever garage did the work."
        >
          <Button asChild>
            <Link href={`/services/book?vehicle=${vehicle.id}`}>Book a service</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
