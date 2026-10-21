import { getSession } from "@/features/auth/session";
import { getMyVehicles, getVehicleCatalog } from "@/features/vehicles/api";
import { VehicleSwitcher } from "@/features/vehicles/components/VehicleSwitcher";

export async function HeaderVehicle() {
  const session = await getSession();
  const [catalog, myVehicles] = await Promise.all([
    getVehicleCatalog(),
    session ? getMyVehicles() : [],
  ]);
  return <VehicleSwitcher catalog={catalog} myVehicles={myVehicles} />;
}
