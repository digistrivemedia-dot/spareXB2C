import { CalendarCheck, Wrench } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export function ServiceBand() {
  return (
    <section aria-labelledby="service-band-heading" className="py-6 md:py-8">
      <Container>
        <div className="flex flex-col gap-5 rounded-xl bg-navy-800 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy-700 text-white">
              <Wrench className="size-6" aria-hidden />
            </span>
            <div>
              <h2 id="service-band-heading" className="text-lg font-semibold text-white md:text-xl">
                Service your vehicle at Kannali Garage
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-200 md:text-base">
                <CalendarCheck className="size-4 shrink-0" aria-hidden />
                Choose a garage and a date. Nothing to pay when you book.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="md:shrink-0">
            <Link href="/services/book">Book a service</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
