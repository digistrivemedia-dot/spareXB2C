import { CalendarPlus, ChevronLeft, History, LayoutDashboard, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getMyVehicle } from "@/features/vehicles/api";
import { RemoveVehicleButton } from "@/features/vehicles/components/RemoveVehicleButton";
import { SetDefaultVehicleButton } from "@/features/vehicles/components/SetDefaultVehicleButton";
import { ShopForVehicleLink } from "@/features/vehicles/components/ShopForVehicleLink";
import { VehicleDetailsCard } from "@/features/vehicles/components/VehicleDetailsCard";
import { VehicleDocumentList } from "@/features/vehicles/components/VehicleDocumentList";
import { getVehicleName } from "@/features/vehicles/utils";

export async function generateMetadata({
  params,
}: PageProps<"/account/vehicles/[vehicleId]">): Promise<Metadata> {
  const vehicle = await getMyVehicle((await params).vehicleId);
  return { title: vehicle ? getVehicleName(vehicle) : "Vehicle not found" };
}

export default async function VehiclePage({ params }: PageProps<"/account/vehicles/[vehicleId]">) {
  const vehicle = await getMyVehicle((await params).vehicleId);
  if (!vehicle) notFound();
  const name = getVehicleName(vehicle);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Link
        href="/account/vehicles"
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        My vehicles
      </Link>
      <PageHeader
        title={name}
        description={`${vehicle.variantName} · ${vehicle.year}`}
        action={vehicle.isDefault && <StatusBadge tone="info">Default vehicle</StatusBadge>}
      />

      <nav aria-label="For this vehicle" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild size="lg">
          <Link href={`/services/book?vehicle=${vehicle.id}`}>
            <CalendarPlus aria-hidden />
            Book a service
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <ShopForVehicleLink vehicle={vehicle}>
            <ShoppingBag aria-hidden />
            Shop parts
          </ShopForVehicleLink>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={`/account/vehicles/${vehicle.id}/history`}>
            <History aria-hidden />
            Service history
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={`/account?vehicle=${vehicle.id}`}>
            <LayoutDashboard aria-hidden />
            Dashboard
          </Link>
        </Button>
      </nav>

      <VehicleDetailsCard vehicle={vehicle} />
      <VehicleDocumentList vehicle={vehicle} />

      <Card aria-label="Manage vehicle" className="flex flex-wrap items-center gap-3">
        {!vehicle.isDefault && (
          <SetDefaultVehicleButton vehicleId={vehicle.id} vehicleName={name} />
        )}
        <div className="ml-auto">
          <RemoveVehicleButton vehicleId={vehicle.id} vehicleName={name} />
        </div>
      </Card>
    </div>
  );
}
