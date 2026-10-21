import { Car, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMyVehicles } from "@/features/vehicles/api";
import { VehicleListCard } from "@/features/vehicles/components/VehicleListCard";

export const metadata: Metadata = { title: "My vehicles" };

export default async function MyVehiclesPage() {
  const vehicles = await getMyVehicles();

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="My vehicles"
        description="Parts that fit, papers and service history for each of your vehicles."
        action={
          vehicles.length > 0 && (
            <Button asChild>
              <Link href="/account/vehicles/new">
                <Plus aria-hidden />
                Add vehicle
              </Link>
            </Button>
          )
        }
      />
      {vehicles.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleListCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Car}
          title="No vehicles yet"
          description="Add your bike, scooter, car or commercial vehicle to see parts that fit it."
        >
          <Button asChild>
            <Link href="/account/vehicles/new">Add a vehicle</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
