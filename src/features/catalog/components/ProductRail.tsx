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
type ProductRailProps = {
  products: ProductSummary[];
  label: string;
  variant?: "default" | "compact";
  /** Labels over some cards, by product id. */
  tags?: Record<string, string>;
};

export function ProductRail({ products, label, variant = "default", tags }: ProductRailProps) {
  return (
    <Carousel opts={{ align: "start" }} aria-label={label}>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-5/11 sm:basis-1/3 md:basis-1/4 xl:basis-1/5"
          >
            <ProductCard product={product} variant={variant} tag={tags?.[product.id]} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden md:inline-flex" />
      <CarouselNext className="-right-4 hidden md:inline-flex" />
    </Carousel>
  );
}
