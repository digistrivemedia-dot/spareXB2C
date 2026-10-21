import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Price } from "@/components/ui/Price";
import { PurchasePanel } from "@/features/cart/components/PurchasePanel";
import { getProduct, getRelatedProducts } from "@/features/catalog/api";
import { FitmentBox } from "@/features/catalog/components/FitmentBox";
import { ProductGallery } from "@/features/catalog/components/ProductGallery";
import { ProductRail } from "@/features/catalog/components/ProductRail";
import { ProductTabs } from "@/features/catalog/components/ProductTabs";
import { DeliveryEstimate } from "@/features/location/components/DeliveryEstimate";
import { getDefaultLocation } from "@/features/location/default-location";
import { getVehicleCatalog } from "@/features/vehicles/api";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Part not found" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const [related, vehicleCatalog, defaultLocation] = await Promise.all([
    getRelatedProducts(product.id),
    getVehicleCatalog(),
    getDefaultLocation(),
  ]);

  return (
    <>
      <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Parts", href: "/products" },
            { label: product.category.name, href: `/products?category=${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </div>

          <div className="grid content-start gap-5 lg:col-span-7">
            <div className="grid gap-2">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                <Link
                  href={`/products?brand=${product.brand.slug}`}
                  className="hover:text-navy-700"
                >
                  {product.brand.name}
                </Link>
                {product.isGenuine && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5 text-xs text-navy-800 normal-case">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    Genuine part
                  </span>
                )}
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{product.name}</h1>
              <p className="text-sm text-gray-500">
                Part no. {product.partNumber} · SKU {product.sku}
              </p>
            </div>

            <div>
              <Price
                priceInPaise={product.priceInPaise}
                mrpInPaise={product.mrpInPaise}
                size="lg"
              />
              <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            <FitmentBox fitment={product.fitment} categorySlug={product.category.slug} />
            <PurchasePanel product={product} />
            <DeliveryEstimate defaultLocation={defaultLocation} />

            <p className="flex items-center gap-2 text-sm text-gray-700">
              <ShieldCheck className="size-5 text-navy-700" aria-hidden />
              {product.warrantyMonths
                ? `${product.warrantyMonths}-month warranty from ${product.brand.name}`
                : "No manufacturer warranty on this part"}
            </p>

            <section aria-labelledby="highlights-heading">
              <h2 id="highlights-heading" className="text-base font-semibold text-gray-900">
                Key highlights
              </h2>
              <ul className="mt-2 grid gap-1.5 text-sm text-gray-700">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <ProductTabs product={product} vehicleCatalog={vehicleCatalog} />
      </Container>

      {related && related.boughtTogether.length > 0 && (
        <Section id="bought-together" title="Frequently bought together">
          <ProductRail products={related.boughtTogether} label="Frequently bought together" />
        </Section>
      )}
      {related && related.similar.length > 0 && (
        <Section
          id="similar-parts"
          title="Similar parts"
          link={{ href: `/products?category=${product.category.slug}`, label: "View all" }}
        >
          <ProductRail products={related.similar} label="Similar parts" />
        </Section>
      )}
    </>
  );
}
