import { QuickActions } from "@/features/account/components/QuickActions";
import { VehicleStatusStrip } from "@/features/account/components/VehicleStatusStrip";
import { VehiclePartsSection } from "@/features/account/components/VehiclePartsSection";
import { getCategories, getProducts } from "@/features/catalog/api";
import { getBanners } from "@/features/promotions/api";
import { BannerSlide } from "@/features/promotions/components/BannerSlide";
import {
  getActiveServiceJob,
  getGarage,
  getMyGarage,
  getNextServiceDue,
  getServiceHistory,
} from "@/features/service/api";
import { EstimateBanner } from "@/features/service/components/EstimateBanner";
import { LastServiceCard } from "@/features/service/components/LastServiceCard";
import { MyGarageCard } from "@/features/service/components/MyGarageCard";
import { ServiceTracker } from "@/features/service/components/ServiceTracker";
import { getPendingEstimate } from "@/features/service/utils";
import { SelectVehicleOnView } from "@/features/vehicles/components/SelectVehicleOnView";
import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";

type VehicleDashboardProps = {
  vehicle: MyVehicle;
  vehicles: MyVehicle[];
  /** Category slug chosen in "Parts for your vehicle". */
  partsCategory: string | undefined;
};

/** Everything about one vehicle, in the order the customer needs it: what needs them first. */
export async function VehicleDashboard({
  vehicle,
  vehicles,
  partsCategory,
}: VehicleDashboardProps) {
  const [nextService, activeJob, history, banners, categories, parts] = await Promise.all([
    getNextServiceDue(vehicle.id),
    getActiveServiceJob(vehicle.id),
    getServiceHistory(vehicle.id),
    getBanners("account"),
    getCategories(),
    getProducts({
      fits: vehicle,
      category: partsCategory,
      sort: "relevance",
      pageSize: 10,
    }),
  ]);
  const pendingEstimate = activeJob ? getPendingEstimate(activeJob) : null;
  const lastVisit = history[0] ?? null;
  // "My garage" is where this vehicle was last serviced; Kannali's main branch until then.
  const garage = (lastVisit && (await getGarage(lastVisit.garage.slug))) ?? (await getMyGarage());
  const promo = banners[0];

  return (
    <>
      <SelectVehicleOnView vehicle={vehicle} />
      {activeJob && pendingEstimate && (
        <EstimateBanner
          jobId={activeJob.id}
          vehicleName={getVehicleName(vehicle)}
          estimate={pendingEstimate}
        />
      )}

      <VehicleCard vehicle={vehicle} vehicles={vehicles}>
        <VehicleStatusStrip vehicle={vehicle} nextService={nextService} />
      </VehicleCard>

      <QuickActions vehicle={vehicle} />

      {activeJob && <ServiceTracker job={activeJob} />}

      {promo && <BannerSlide banner={promo} sizes="(min-width: 1024px) 900px, 100vw" />}

      <VehiclePartsSection
        vehicle={vehicle}
        categories={categories}
        activeCategory={partsCategory}
        products={parts.items}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <LastServiceCard record={lastVisit} />
        <MyGarageCard garage={garage} lastVisit={lastVisit} />
      </div>
    </>
  );
}
