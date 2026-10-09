import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { getSession } from "@/features/auth/session";
import { getBrands, getCategories, getProductFacets, getProducts } from "@/features/catalog/api";
import { ActiveFilterChips } from "@/features/catalog/components/ActiveFilterChips";
import { FitBar } from "@/features/catalog/components/FitBar";
import { MobileFilters } from "@/features/catalog/components/MobileFilters";
import { ProductFilterPanel } from "@/features/catalog/components/ProductFilterPanel";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { SortSelect } from "@/features/catalog/components/SortSelect";
import {
  clearedFilters,
  countActiveFilters,
  getListingTitle,
  parseProductFilters,
  productsHref,
  toProductQuery,
} from "@/features/catalog/filters";
import { getMyBikes, getVehicleCatalog } from "@/features/vehicles/api";
import { parseBikeParam } from "@/features/vehicles/utils";
import type { SearchParams } from "@/lib/search-params";

/** Filters from the URL, plus the category and bike they refer to; shared by the page and its metadata. */
async function resolveListing(searchParams: SearchParams) {
  const filters = parseProductFilters(searchParams);
  const [categories, vehicleCatalog] = await Promise.all([getCategories(), getVehicleCatalog()]);
  const category = categories.find((c) => c.slug === filters.category);
  const fitBike =
    filters.fits && filters.bike ? parseBikeParam(filters.bike, vehicleCatalog) : null;
  return { filters, fitBike, title: getListingTitle(filters, category?.name, fitBike) };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/products">): Promise<Metadata> {
  const { title } = await resolveListing(await searchParams);
  return {
    title,
    description:
      "Genuine bike and scooter parts, each checked against your bike so you know it fits.",
  };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { filters, fitBike, title } = await resolveListing(await searchParams);
  const query = toProductQuery(filters, fitBike);
  const session = await getSession();
  const [results, facets, brands, myBikes] = await Promise.all([
    getProducts(query),
    getProductFacets(query),
    getBrands(),
    session ? getMyBikes() : [],
  ]);
  const isAllParts = !filters.q && !filters.category && !fitBike;
  const totalPages = Math.ceil(results.total / results.pageSize);
  const activeCount = countActiveFilters(filters);
  const first = (results.page - 1) * results.pageSize + 1;
  const last = first + results.items.length - 1;

  return (
    <Container className="grid grid-cols-1 gap-4 py-6 lg:py-8">
      <Breadcrumb
        items={
          isAllParts
            ? [{ label: "Home", href: "/" }, { label: "Parts" }]
            : [
                { label: "Home", href: "/" },
                { label: "Parts", href: "/products" },
                { label: title },
              ]
        }
      />
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {results.total} {results.total === 1 ? "part" : "parts"}
        </p>
      </div>
      <FitBar filters={filters} fitBike={fitBike} myBikes={myBikes} />

      <div className="flex gap-8">
        <aside aria-label="Filters" className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <ProductFilterPanel filters={filters} facets={facets} />
          </div>
        </aside>

        <div className="grid min-w-0 flex-1 grid-cols-1 content-start gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="lg:hidden">
              <MobileFilters
                filters={filters}
                facets={facets}
                activeCount={activeCount}
                resultCount={results.total}
              />
            </div>
            {results.total > 0 && (
              <p className="hidden text-sm text-gray-600 lg:block">
                Showing {first}–{last} of {results.total}
              </p>
            )}
            <SortSelect filters={filters} />
          </div>

          <ActiveFilterChips filters={filters} brands={brands} />

          {results.items.length > 0 ? (
            <>
              <ProductGrid products={results.items} />
              <Pagination
                page={results.page}
                totalPages={totalPages}
                hrefForPage={(page) => productsHref(filters, { page })}
              />
            </>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No parts match these filters"
              description="Try removing a filter, or search for the part by name or part number."
            >
              <Button asChild>
                <Link href={activeCount > 0 ? productsHref(filters, clearedFilters) : "/products"}>
                  {activeCount > 0 ? "Clear filters" : "Browse all parts"}
                </Link>
              </Button>
            </EmptyState>
          )}
        </div>
      </div>
    </Container>
  );
}
