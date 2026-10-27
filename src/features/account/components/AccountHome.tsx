import { HomeActions } from "@/features/account/components/HomeActions";
import { PartsForVehicleCard } from "@/features/account/components/PartsForVehicleCard";
import { ServiceHealthCard } from "@/features/account/components/ServiceHealthCard";
import { ServiceStatusCard } from "@/features/account/components/ServiceStatusCard";
import { TrustStrip } from "@/features/account/components/TrustStrip";
import { YourVehicleCard } from "@/features/account/components/YourVehicleCard";
import { getCategories, getProducts } from "@/features/catalog/api";
import { RecentOrders } from "@/features/orders/components/RecentOrders";
import type { Order } from "@/features/orders/types";
import { getBanners } from "@/features/promotions/api";
import { PromoBar } from "@/features/promotions/components/PromoBar";
import {
  getActiveServiceJob,
  getGarage,
  getMyGarage,
  getNextServiceDue,
  getServiceHistory,
  getServicePackages,
} from "@/features/service/api";
import { ServiceHistoryCard } from "@/features/service/components/ServiceHistoryCard";
import { YourGarageCard } from "@/features/service/components/YourGarageCard";
import { getServiceDueProgress } from "@/features/service/utils";
import { SelectVehicleOnView } from "@/features/vehicles/components/SelectVehicleOnView";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";
import { formatKm } from "@/lib/format";

type AccountHomeProps = {
  greeting: string;
  vehicle: MyVehicle;
  /** All the customer's vehicles, to switch between. */
  vehicles: MyVehicle[];
  /** The customer's orders, newest first. */
  orders: Order[];
};

/**
 * A logged-in customer's home, for the vehicle picked in the header: the vehicle and its service health, quick actions,
 * the open service, parts that fit, an offer, then history and orders beside their garage. Things that need
 * the customer (estimates, bills) are in the header's notifications, not here.
 */
export async function AccountHome({ greeting, vehicle, vehicles, orders }: AccountHomeProps) {
  const [nextService, activeJob, history, banners, parts, categories, packages] = await Promise.all(
    [
      getNextServiceDue(vehicle.id),
      getActiveServiceJob(vehicle.id),
      getServiceHistory(vehicle.id),
      getBanners("account"),
      getProducts({ fits: vehicle, sort: "relevance", pageSize: 10 }),
      getCategories(),
      getServicePackages(vehicle.modelId),
    ],
  );
  const today = new Date();
  const lastVisit = history[0] ?? null;
  // "Your garage" is where this vehicle was last serviced; Kannali's main branch until then.
  const usualGarage =
    (lastVisit && (await getGarage(lastVisit.garage.slug))) ?? (await getMyGarage());
  const due =
    nextService && getServiceDueProgress(nextService, vehicle.odometerKm, lastVisit, today);
  const promo = banners[0];

  return (
    <>
      <SelectVehicleOnView vehicle={vehicle} />
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{greeting}</h1>
        <p className="mt-1 text-gray-600">
          Here&apos;s your {getVehicleName(vehicle)} at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <YourVehicleCard vehicle={vehicle} vehicles={vehicles} />
        <ServiceHealthCard
          vehicleId={vehicle.id}
          odometerKm={vehicle.odometerKm}
          nextService={nextService}
          lastVisit={lastVisit}
          duePackage={packages.find((p) => p.isRoutine) ?? null}
          today={today}
        />
      </div>

      <HomeActions vehicle={vehicle} />

      <ServiceStatusCard
        vehicleId={vehicle.id}
        job={activeJob}
        nextServiceText={due && `In ${formatKm(due.kmLeft)} or ${due.daysLeft} days`}
      />

      <PartsForVehicleCard
        vehicle={vehicle}
        products={parts.items}
        categories={categories}
        isServiceDue={nextService !== null}
      />

      {promo && <PromoBar banner={promo} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid grid-cols-1 content-start gap-5">
          <ServiceHistoryCard vehicleId={vehicle.id} records={history} year={today.getFullYear()} />
          <RecentOrders orders={orders.slice(0, 2)} />
        </div>
        <YourGarageCard vehicleId={vehicle.id} garage={usualGarage} />
      </div>

      <TrustStrip />
    </>
  );
}
