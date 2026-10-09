import { getSession } from "@/features/auth/session";
import { BikeSwitcher } from "@/features/vehicles/components/BikeSwitcher";
import { getMyBikes, getVehicleCatalog } from "@/features/vehicles/api";

export async function HeaderBike() {
  const session = await getSession();
  const [catalog, myBikes] = await Promise.all([getVehicleCatalog(), session ? getMyBikes() : []]);
  return <BikeSwitcher catalog={catalog} myBikes={myBikes} />;
}
