import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Compact "Book a service" promo for the home hero: the photo on top, the message in the bottom half. */
export function ServiceBookingCard() {
  return (
    <section
      aria-labelledby="hero-service-heading"
      className="relative flex min-h-52 flex-col justify-end overflow-hidden rounded-xl bg-navy-900"
    >
      <Image
        src="/images/garages/mechanic-at-work.jpg"
        alt=""
        fill
        sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
      {/* Clear at the top so the photo shows, solid navy behind the text for contrast. */}
      <div className="absolute inset-0 bg-linear-to-b from-navy-900/0 from-20% via-navy-900/50 to-navy-900 to-85%" />
      <div className="relative flex flex-wrap items-end justify-between gap-3 p-5">
        <div className="min-w-0 flex-1 basis-48">
          <h2 id="hero-service-heading" className="text-lg font-semibold text-white">
            Car giving you trouble?
          </h2>
          <p className="mt-1 text-sm text-gray-200">Noises, brakes or a regular service.</p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/services/book">Book a service</Link>
        </Button>
      </div>
    </section>
  );
}
