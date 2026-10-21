import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarages, getServiceTypes } from "@/features/service/api";
import { GarageCard } from "@/features/service/components/GarageCard";
import { HowServiceWorks } from "@/features/service/components/HowServiceWorks";
import { ServiceTypeCards } from "@/features/service/components/ServiceTypeCards";

export const metadata: Metadata = {
  title: "Vehicle service",
  description:
    "Book a service for your bike, scooter, car or commercial vehicle at a garage near you. Nothing to pay when you book.",
};

const NEARBY_COUNT = 2;

export default async function ServicesPage() {
  const location = await getDefaultLocation();
  const [serviceTypes, garages] = await Promise.all([
    getServiceTypes(),
    getGarages({ pin: location?.pin }),
  ]);

  return (
    <>
      <Container className="py-6 lg:py-8">
        <section
          aria-labelledby="services-hero-heading"
          className="relative overflow-hidden rounded-xl bg-navy-900"
        >
          <Image
            src="/images/garages/mechanic-at-work.jpg"
            alt=""
            fill
            preload
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
          {/* Solid navy behind the text so it stays readable on any photo. */}
          <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-900/85 to-navy-900/30" />
          <div className="relative grid max-w-xl gap-4 p-6 md:p-10">
            <h1
              id="services-hero-heading"
              className="text-2xl font-semibold text-white md:text-4xl"
            >
              Service your vehicle at a garage you can trust
            </h1>
            <p className="text-gray-200 md:text-lg">
              Kannali Garage branches and approved partner garages for bikes, scooters, cars and
              commercial vehicles. Nothing to pay when you book.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/services/book">Book a service</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services/garages">
                  <MapPin aria-hidden />
                  Find a garage
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>

      <Section id="service-types" title="Popular services">
        <ServiceTypeCards types={serviceTypes} />
      </Section>

      <Section
        id="nearby-garages"
        title={location ? `Garages near ${location.area}` : "Top rated garages"}
        link={{ href: "/services/garages", label: "All garages" }}
      >
        <ul className="grid gap-4 lg:grid-cols-2">
          {garages.slice(0, NEARBY_COUNT).map((garage) => (
            <li key={garage.id}>
              <GarageCard garage={garage} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-it-works" title="How it works">
        <HowServiceWorks />
      </Section>
    </>
  );
}
