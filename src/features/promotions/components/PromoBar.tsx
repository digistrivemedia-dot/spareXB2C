import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Banner } from "@/features/promotions/types";

/** An admin banner as one slim row: photo, offer and button. For pages where a full banner is too much. */
export function PromoBar({ banner }: { banner: Banner }) {
  return (
    <section
      aria-label="Offer"
      className="flex items-stretch overflow-hidden rounded-xl bg-navy-900 shadow-sm"
    >
      <div className="relative w-24 shrink-0 sm:w-44">
        <Image
          src={banner.image.url}
          alt={banner.image.alt}
          fill
          sizes="(min-width: 640px) 176px, 96px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="font-semibold text-white">{banner.title}</p>
          <p className="text-sm text-gray-300">{banner.subtitle}</p>
        </div>
        <Button asChild size="sm" className="w-fit shrink-0">
          <Link href={banner.href}>{banner.ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
