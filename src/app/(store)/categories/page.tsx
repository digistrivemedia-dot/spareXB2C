import { MessageSquareText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { getCategories, getProductFacets } from "@/features/catalog/api";
import { CategoryGrid } from "@/features/catalog/components/CategoryGrid";

export const metadata: Metadata = {
  title: "All categories",
  description:
    "Engine oil, brakes, batteries, tyres and more, for bikes, scooters, cars and commercial vehicles.",
};

export default async function CategoriesPage() {
  const [categories, facets] = await Promise.all([getCategories(), getProductFacets()]);
  const counts = Object.fromEntries(facets.categories.map((facet) => [facet.slug, facet.count]));

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All categories" }]} />
      <PageHeader
        title="All categories"
        description="Choose a category. With your vehicle selected, you'll see only the parts that fit."
      />
      <CategoryGrid categories={categories} counts={counts} />
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-sm text-gray-700 md:text-base">
          Can&apos;t find the part you need? Our parts team can help.
        </p>
        <Button asChild variant="secondary">
          <Link href="/account/enquiries/new?reason=part-not-found">
            <MessageSquareText aria-hidden />
            Send an enquiry
          </Link>
        </Button>
      </div>
    </Container>
  );
}
