import type { Metadata } from "next";

import { AddBikeWizard } from "@/features/vehicles/components/AddBikeWizard";
import { getVehicleCatalog } from "@/features/vehicles/api";

export const metadata: Metadata = { title: "Add a bike" };

export default async function AddBikePage() {
  const catalog = await getVehicleCatalog();
  return (
    <div className="grid max-w-2xl grid-cols-1 gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Add a bike</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Add your bike once to get parts that fit, service reminders and history.
        </p>
      </div>
      <AddBikeWizard catalog={catalog} />
    </div>
  );
}
