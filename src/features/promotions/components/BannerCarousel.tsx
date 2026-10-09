"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BannerSlide } from "@/features/promotions/components/BannerSlide";
import type { Banner } from "@/features/promotions/types";
import { cn } from "@/lib/utils";

type BannerCarouselProps = {
  banners: Banner[];
  className?: string;
};

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={className}>
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label="Offers">
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} aria-label={`${index + 1} of ${banners.length}`}>
              <BannerSlide
                banner={banner}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
                isPriority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Bottom-right, clear of the offer text on the left. */}
        <CarouselPrevious className="top-auto right-16 bottom-4 left-auto hidden md:inline-flex" />
        <CarouselNext className="top-auto right-4 bottom-4 hidden md:inline-flex" />
      </Carousel>
      <div className="mt-2 flex justify-center">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Show offer ${index + 1}`}
            aria-current={index === current}
            className="group flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span
              className={cn(
                "h-2 rounded-full transition-all",
                index === current ? "w-6 bg-navy-700" : "w-2 bg-gray-300 group-hover:bg-gray-400",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
