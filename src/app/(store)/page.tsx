import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getCategories, getProducts } from "@/features/catalog/api";
import { BikeProductRail } from "@/features/catalog/components/BikeProductRail";
import { CategoryGrid } from "@/features/catalog/components/CategoryGrid";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import { TopDealsCard } from "@/features/catalog/components/TopDealsCard";
import { getBanners } from "@/features/promotions/api";
import { BannerCarousel } from "@/features/promotions/components/BannerCarousel";
import { PromoStrip } from "@/features/promotions/components/PromoStrip";
import { TrustStrip } from "@/features/promotions/components/TrustStrip";
import { ServiceBand } from "@/features/service/components/ServiceBand";
import { ServiceBookingCard } from "@/features/service/components/ServiceBookingCard";
import { getVehicleCatalog } from "@/features/vehicles/api";
import { BikeBrandGrid } from "@/features/vehicles/components/BikeBrandGrid";
import { VehicleFinder } from "@/features/vehicles/components/VehicleFinder";

export default async function HomePage() {
  const [heroBanners, stripBanners, categories, vehicleCatalog, bestSellers, topDeals] =
    await Promise.all([
      getBanners("home-hero"),
      getBanners("home-strip"),
      getCategories(),
      getVehicleCatalog(),
      getProducts({ sort: "popular", pageSize: 10 }),
      getProducts({ sort: "discount", inStock: true, pageSize: 2 }),
    ]);

  return (
    <>
      <Container className="grid gap-6 py-6 lg:grid-cols-12 lg:py-8">
        <VehicleFinder catalog={vehicleCatalog} className="lg:col-span-5" />
        <div className="grid content-start gap-4 lg:col-span-7">
          <BannerCarousel banners={heroBanners} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ServiceBookingCard />
            <TopDealsCard products={topDeals.items} />
          </div>
        </div>
      </Container>

      <Section id="categories" title="Shop by category">
        <CategoryGrid categories={categories} />
      </Section>

      <BikeProductRail />

      <PromoStrip banners={stripBanners} />

      <Section id="bike-brands" title="Shop by bike brand">
        <BikeBrandGrid catalog={vehicleCatalog} />
      </Section>

      <Section
        id="best-sellers"
        title="Best sellers"
        link={{ href: "/products", label: "View all" }}
      >
        <ProductRail products={bestSellers.items} label="Best sellers" />
      </Section>

      <ServiceBand />

      <TrustStrip />
    </>
  );
}
