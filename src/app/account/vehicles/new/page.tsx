import type { Metadata } from "next";

import { getVehicleCatalog } from "@/features/vehicles/api";
import { AddVehicleWizard } from "@/features/vehicles/components/AddVehicleWizard";

export const metadata: Metadata = { title: "Add a vehicle" };

export default async function AddVehiclePage() {
  const catalog = await getVehicleCatalog();
  return (
    <div className="grid max-w-2xl grid-cols-1 gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Add a vehicle</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Add your vehicle once to get parts that fit, service reminders and history.
        </p>
      </div>
      <AddVehicleWizard catalog={catalog} />
    </div>
  );
}
