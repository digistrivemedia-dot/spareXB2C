import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Banner } from "@/features/promotions/types";

type BannerSlideProps = {
  banner: Banner;
  sizes: string;
  /** Load straight away; for the first banner above the fold. */
  isPriority?: boolean;
};

/** Photo banner, 4:3 on phones and 16:6 from tablets up, with the offer over a navy fade. */
export function BannerSlide({ banner, sizes, isPriority = false }: BannerSlideProps) {
  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-navy-900 sm:aspect-16/6">
      <Image
        src={banner.image.url}
        alt={banner.image.alt}
        fill
        sizes={sizes}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/60 to-navy-900/0 sm:bg-linear-to-r sm:via-navy-900/80" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:inset-y-0 sm:right-auto sm:max-w-sm sm:justify-center sm:p-8">
        <p className="text-xl leading-tight font-bold text-white md:text-2xl">{banner.title}</p>
        <p className="text-sm text-gray-100 md:text-base">{banner.subtitle}</p>
        <Button asChild size="sm" className="mt-2">
          <Link href={banner.href}>{banner.ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
