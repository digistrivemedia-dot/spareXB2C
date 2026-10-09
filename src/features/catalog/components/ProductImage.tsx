import { Package } from "lucide-react";
import Image from "next/image";

import type { ProductImage as ProductImageData } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  image: ProductImageData | null;
  /** The `sizes` hint for next/image, matching how wide the image is drawn. */
  sizes: string;
  /** Load straight away; for the main photo above the fold. */
  isPriority?: boolean;
  className?: string;
};

/** Square product photo on white, or a neutral placeholder when there is no photo yet. */
export function ProductImage({ image, sizes, isPriority = false, className }: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg",
        image ? "bg-white" : "bg-gray-100 text-gray-400",
        className,
      )}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : "auto"}
          className="object-contain"
        />
      ) : (
        <Package className="size-1/3" strokeWidth={1.5} aria-hidden />
      )}
    </div>
  );
}
