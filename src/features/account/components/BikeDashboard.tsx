import { getCategories, getProducts } from "@/features/catalog/api";
import { BikePartsSection } from "@/features/account/components/BikePartsSection";
import { QuickActions } from "@/features/account/components/QuickActions";
import { getBanners } from "@/features/promotions/api";
import { BannerSlide } from "@/features/promotions/components/BannerSlide";
import {
  getActiveServiceJob,
  getBikeReminders,
  getMyGarage,
  getServiceHistory,
} from "@/features/service/api";
import { EstimateBanner } from "@/features/service/components/EstimateBanner";
import { LastServiceCard } from "@/features/service/components/LastServiceCard";
import { MyGarageCard } from "@/features/service/components/MyGarageCard";
import { ReminderStrip } from "@/features/service/components/ReminderStrip";
import { ServiceTracker } from "@/features/service/components/ServiceTracker";
import { BikeCard } from "@/features/vehicles/components/BikeCard";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";

type BikeDashboardProps = {
  bike: MyBike;
  bikes: MyBike[];
  /** Category slug chosen in "Parts for your bike". */
  partsCategory: string | undefined;
};

/** Everything about one bike, in the order the customer needs it: what needs them first. */
export async function BikeDashboard({ bike, bikes, partsCategory }: BikeDashboardProps) {
  const [reminders, activeJob, history, garage, banners, categories, parts] = await Promise.all([
    getBikeReminders(bike.id),
    getActiveServiceJob(bike.id),
    getServiceHistory(bike.id),
    getMyGarage(),
    getBanners("account"),
    getCategories(),
    getProducts({
      fits: { modelId: bike.modelId, variantId: bike.variantId, year: bike.year },
      category: partsCategory,
      sort: "relevance",
      pageSize: 10,
    }),
  ]);
  const pendingEstimate = activeJob?.estimate?.status === "pending" ? activeJob.estimate : null;
  const lastVisit = history[0] ?? null;
  const promo = banners[0];

  return (
    <>
      {activeJob && pendingEstimate && (
        <EstimateBanner
          jobId={activeJob.id}
          bikeName={getBikeName(bike)}
          estimate={pendingEstimate}
        />
      )}

      <BikeCard bike={bike} bikes={bikes}>
        {reminders && <ReminderStrip reminders={reminders} />}
      </BikeCard>

      <QuickActions bike={bike} />

      {activeJob && <ServiceTracker job={activeJob} />}

      {promo && <BannerSlide banner={promo} sizes="(min-width: 1024px) 900px, 100vw" />}

      <BikePartsSection
        bike={bike}
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
