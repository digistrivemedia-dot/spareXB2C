"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/lib/types";

type ImageViewerProps = {
  photos: Photo[];
  /** What the photos are of, e.g. "Inspection photos"; names the list for screen readers. */
  label: string;
};

/** A grid of thumbnails; tapping one opens it full size, with swipe or arrows to see the rest. */
export function ImageViewer({ photos, label }: ImageViewerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((photo, index) => (
          <li key={photo.url}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Open photo ${index + 1}: ${photo.alt}`}
              className="relative block aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 outline-none hover:border-gray-400 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Image
                src={photo.url}
                alt=""
                fill
                sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 33vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="gap-3 p-4 sm:max-w-3xl">
          {openIndex !== null && <ViewerSlides photos={photos} startIndex={openIndex} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ViewerSlides({ photos, startIndex }: { photos: Photo[]; startIndex: number }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <DialogTitle className="pr-10 text-base">
        Photo {current + 1} of {photos.length}
      </DialogTitle>
      <Carousel opts={{ startIndex }} setApi={setApi} aria-label="Photos">
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem key={photo.url} aria-label={`${index + 1} of ${photos.length}`}>
              <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-900">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {photos.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      <DialogDescription>{photos[current]?.alt}</DialogDescription>
    </>
  );
}
