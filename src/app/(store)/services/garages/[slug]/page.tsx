import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { Rating } from "@/components/ui/Rating";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDefaultLocation } from "@/features/location/default-location";
import { getGarage, getGarageReviews, getServiceTypes } from "@/features/service/api";
import { FavouriteGarageButton } from "@/features/service/components/FavouriteGarageButton";
import { GarageInfoCard } from "@/features/service/components/GarageInfoCard";
import { GarageReviewsCard } from "@/features/service/components/GarageReviewsCard";
import { GarageServicesCard } from "@/features/service/components/GarageServicesCard";

export async function generateMetadata({
  params,
}: PageProps<"/services/garages/[slug]">): Promise<Metadata> {
  const garage = await getGarage((await params).slug);
  return garage ? { title: garage.name, description: garage.about } : { title: "Garage not found" };
}

export default async function GaragePage({ params }: PageProps<"/services/garages/[slug]">) {
  const [{ slug }, location] = await Promise.all([params, getDefaultLocation()]);
  const garage = await getGarage(slug, location?.pin);
  if (!garage) notFound();
  const [reviews, serviceTypes] = await Promise.all([
    getGarageReviews(garage.id),
    getServiceTypes(),
  ]);

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <Breadcrumb
        items={[
          { label: "Services", href: "/services" },
          { label: "Garages", href: "/services/garages" },
          { label: garage.name },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{garage.name}</h1>
            <StatusBadge tone={garage.isKannaliBranch ? "info" : "neutral"}>
              {garage.isKannaliBranch ? "Kannali branch" : "Partner garage"}
            </StatusBadge>
          </div>
          <Rating average={garage.rating} count={garage.reviewCount} />
        </div>
        <div className="flex items-center gap-3">
          <FavouriteGarageButton
            garageId={garage.id}
            garageName={garage.name}
            className="border border-gray-200"
          />
          <Button asChild size="lg">
            <Link href={`/services/book?garage=${garage.slug}`}>Book a service here</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="grid gap-6 lg:col-span-2">
          {garage.photos.length > 0 ? (
            <ImageViewer photos={garage.photos} label={`Photos of ${garage.name}`} />
          ) : (
            <div className="flex aspect-16/6 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <Wrench className="size-12" strokeWidth={1.5} aria-hidden />
            </div>
          )}
          <GarageServicesCard garage={garage} serviceTypes={serviceTypes} />
          {reviews && <GarageReviewsCard garage={garage} reviews={reviews} />}
        </div>
        <div className="lg:sticky lg:top-24">
          <GarageInfoCard garage={garage} />
        </div>
      </div>
    </Container>
  );
}
