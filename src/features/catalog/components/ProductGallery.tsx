"use client";

import Image from "next/image";
import { useState } from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import type { ProductImage as ProductImageData } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

const mainSizes = "(min-width: 1024px) 480px, 100vw";

/** Main photo with thumbnails from tablets up; a swipeable carousel on phones. */
export function ProductGallery({ images, name }: { images: ProductImageData[]; name: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length <= 1) {
    return (
      <ProductImage
        image={images[0] ?? null}
        sizes={mainSizes}
        isPriority
        className="rounded-xl border border-gray-200"
      />
    );
  }

  return (
    <div>
      <Carousel aria-label={`Photos of ${name}`} className="md:hidden">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.url} aria-label={`${index + 1} of ${images.length}`}>
              <ProductImage
                image={image}
                sizes="100vw"
                isPriority={index === 0}
                className="rounded-xl border border-gray-200"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="hidden gap-3 md:grid">
        <ProductImage
          image={images[selected]}
          sizes={mainSizes}
          isPriority
          className="rounded-xl border border-gray-200"
        />
        <ul className="flex gap-2" aria-label="Choose a photo">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={index === selected}
                aria-label={`Show photo ${index + 1}`}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === selected ? "border-navy-700" : "border-gray-200 hover:border-gray-400",
                )}
              >
                <Image src={image.url} alt="" fill sizes="64px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
