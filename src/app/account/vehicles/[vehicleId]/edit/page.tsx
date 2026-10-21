import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getMyVehicle } from "@/features/vehicles/api";
import { VehicleEditForm } from "@/features/vehicles/components/VehicleEditForm";
import { getVehicleName } from "@/features/vehicles/utils";

export const metadata: Metadata = { title: "Edit vehicle" };

export default async function EditVehiclePage({
  params,
}: PageProps<"/account/vehicles/[vehicleId]/edit">) {
  const vehicle = await getMyVehicle((await params).vehicleId);
  if (!vehicle) notFound();

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title={`Edit your ${getVehicleName(vehicle)}`}
        description="Add the expiry dates of your papers, and we'll remind you before they run out."
      />
      <VehicleEditForm vehicle={vehicle} />
    </div>
  );
}
