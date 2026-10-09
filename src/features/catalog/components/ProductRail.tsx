"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { ProductSummary } from "@/features/catalog/types";

/** A swipeable row of product cards; arrows on larger screens. */
export function ProductRail({ products, label }: { products: ProductSummary[]; label: string }) {
  return (
    <Carousel opts={{ align: "start" }} aria-label={label}>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-5/11 sm:basis-1/3 md:basis-1/4 xl:basis-1/5"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden md:inline-flex" />
      <CarouselNext className="-right-4 hidden md:inline-flex" />
    </Carousel>
  );
}
