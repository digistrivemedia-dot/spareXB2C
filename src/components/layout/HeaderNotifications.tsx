import { getSession } from "@/features/auth/session";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { getNotifications } from "@/features/notifications/utils";
import { getOrders } from "@/features/orders/api";
import { getServiceJobs } from "@/features/service/api";
import { getMyVehicles } from "@/features/vehicles/api";
import { getVehicleName } from "@/features/vehicles/utils";

/** The notifications bell, for logged-in customers only. */
export async function HeaderNotifications() {
  const session = await getSession();
  if (!session) return null;

  const [jobs, orders, vehicles] = await Promise.all([
    getServiceJobs(),
    getOrders({ pageSize: 50 }),
    getMyVehicles(),
  ]);
  const vehicleNames = new Map(vehicles.map((v) => [v.id, getVehicleName(v)]));
  return <NotificationBell notifications={getNotifications(jobs, orders.items, vehicleNames)} />;
}
