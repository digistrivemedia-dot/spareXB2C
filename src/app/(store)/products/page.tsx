import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { getSession } from "@/features/auth/session";
import { getBrands, getCategories, getProductFacets, getProducts } from "@/features/catalog/api";
import { ActiveFilterChips } from "@/features/catalog/components/ActiveFilterChips";
import { FitBar } from "@/features/catalog/components/FitBar";
import { ListingEmptyState } from "@/features/catalog/components/ListingEmptyState";
import { MobileFilters } from "@/features/catalog/components/MobileFilters";
import { ProductFilterPanel } from "@/features/catalog/components/ProductFilterPanel";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { SortSelect } from "@/features/catalog/components/SortSelect";
import {
  countActiveFilters,
  getListingTitle,
  parseProductFilters,
  productsHref,
  toProductQuery,
} from "@/features/catalog/filters";
import { getMyVehicles, getVehicleCatalog } from "@/features/vehicles/api";
import { parseVehicleParam } from "@/features/vehicles/utils";
import type { SearchParams } from "@/lib/search-params";

/** Filters from the URL, plus the category and vehicle they refer to; shared by the page and its metadata. */
async function resolveListing(searchParams: SearchParams) {
  const filters = parseProductFilters(searchParams);
  const [categories, vehicleCatalog] = await Promise.all([getCategories(), getVehicleCatalog()]);
  const category = categories.find((c) => c.slug === filters.category);
  const fitVehicle =
    filters.fits && filters.vehicle ? parseVehicleParam(filters.vehicle, vehicleCatalog) : null;
  return {
    filters,
    fitVehicle,
    categoryName: category?.name,
    title: getListingTitle(filters, category?.name, fitVehicle),
  };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/products">): Promise<Metadata> {
  const { title } = await resolveListing(await searchParams);
  return {
    title,
    description:
      "Genuine parts for bikes, scooters, cars and commercial vehicles, each checked against your vehicle so you know it fits.",
  };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { filters, fitVehicle, categoryName, title } = await resolveListing(await searchParams);
  const query = toProductQuery(filters, fitVehicle);
  const session = await getSession();
  const [results, facets, brands, myVehicles, withoutFit] = await Promise.all([
    getProducts(query),
    getProductFacets(query),
    getBrands(),
    session ? getMyVehicles() : [],
    // Only the count is needed: how many matching parts the fit filter hides.
    fitVehicle ? getProducts({ ...query, fits: undefined, pageSize: 1 }) : null,
  ]);
  const hiddenCount = withoutFit ? withoutFit.total - results.total : 0;
  const isAllParts = !filters.q && !filters.category && !fitVehicle;
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
      <FitBar
        filters={filters}
        fitVehicle={fitVehicle}
        hiddenCount={hiddenCount}
        myVehicles={myVehicles}
      />

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
            <ListingEmptyState
              filters={filters}
              fitVehicle={fitVehicle}
              activeCount={activeCount}
              categoryName={categoryName}
              myVehicles={myVehicles}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
