import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getProducts } from "@/features/catalog/api";
import { CategoryGrid } from "@/features/catalog/components/CategoryGrid";
import { TopDealsCard } from "@/features/catalog/components/TopDealsCard";
import { VehicleProductRail } from "@/features/catalog/components/VehicleProductRail";
import { getBanners, getHomeFeatures } from "@/features/promotions/api";
import { BannerCarousel } from "@/features/promotions/components/BannerCarousel";
import { ProductShelfSection } from "@/features/promotions/components/ProductShelfSection";
import { PromoStrip } from "@/features/promotions/components/PromoStrip";
import { TrustStrip } from "@/features/promotions/components/TrustStrip";
import { ServiceBand } from "@/features/service/components/ServiceBand";
import { ServiceBookingCard } from "@/features/service/components/ServiceBookingCard";
import { getVehicleCatalog } from "@/features/vehicles/api";
import { VehicleBrandGrid } from "@/features/vehicles/components/VehicleBrandGrid";
import { VehicleFinder } from "@/features/vehicles/components/VehicleFinder";

export default async function HomePage() {
  const [heroBanners, stripBanners, features, vehicleCatalog, topDeals] = await Promise.all([
    getBanners("home-hero"),
    getBanners("home-strip"),
    getHomeFeatures(),
    getVehicleCatalog(),
    getProducts({ sort: "discount", inStock: true, pageSize: 2 }),
  ]);
  const [firstShelf, ...otherShelves] = features.shelves;

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

      <Section
        id="categories"
        title="Shop by category"
        link={{ href: "/categories", label: "All categories" }}
      >
        <CategoryGrid categories={features.categories} />
      </Section>

      <VehicleProductRail />

      <PromoStrip banners={stripBanners} />

      {firstShelf && <ProductShelfSection shelf={firstShelf} />}

      <Section id="vehicle-brands" title="Shop by vehicle brand">
        <VehicleBrandGrid brands={features.vehicleBrands} catalog={vehicleCatalog} />
      </Section>

      {otherShelves.map((shelf) => (
        <ProductShelfSection key={shelf.id} shelf={shelf} />
      ))}

      <ServiceBand />

      <TrustStrip />
    </>
  );
}
