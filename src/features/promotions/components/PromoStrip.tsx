import { Container } from "@/components/layout/Container";
import { BannerSlide } from "@/features/promotions/components/BannerSlide";
import type { Banner } from "@/features/promotions/types";

/** Two banners side by side on wide screens; stacked below that so the 16:6 banners keep room for their text. */
export function PromoStrip({ banners }: { banners: Banner[] }) {
  return (
    <section aria-label="More offers" className="py-6 md:py-8">
      <Container className="grid gap-4 xl:grid-cols-2">
        {banners.map((banner) => (
          <BannerSlide key={banner.id} banner={banner} sizes="(min-width: 1280px) 50vw, 100vw" />
        ))}
      </Container>
    </section>
  );
}
