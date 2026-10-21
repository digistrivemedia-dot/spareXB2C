import type {
  Category,
  PartBrand,
  Product,
  ProductFacets,
  ProductQuery,
  ProductSummary,
  RelatedProducts,
} from "@/features/catalog/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { mockCatalog } from "@/mocks/catalog";

const useMock = dataSource.catalog === "mock";

export function getCategories(): Promise<Category[]> {
  return useMock ? mockCatalog.getCategories() : apiClient.get("/categories");
}

export function getBrands(): Promise<PartBrand[]> {
  return useMock ? mockCatalog.getBrands() : apiClient.get("/brands");
}

// The API takes the query flat: lists comma-separated, the vehicle as three fields.
function toApiQuery({ ids, brand, fits, ...rest }: ProductQuery) {
  return {
    ...rest,
    ids: ids?.join(","),
    brand: brand?.join(","),
    fitsModel: fits?.modelId,
    fitsVariant: fits?.variantId,
    fitsYear: fits?.year,
  };
}

export function getProducts(query: ProductQuery = {}): Promise<Paginated<ProductSummary>> {
  return useMock ? mockCatalog.getProducts(query) : apiClient.get("/products", toApiQuery(query));
}

export function getProductFacets(query: ProductQuery = {}): Promise<ProductFacets> {
  return useMock
    ? mockCatalog.getProductFacets(query)
    : apiClient.get("/products/facets", toApiQuery(query));
}

export function getProduct(slug: string): Promise<Product | null> {
  return useMock ? mockCatalog.getProduct(slug) : orNull(apiClient.get(`/products/${slug}`));
}

export function getRelatedProducts(productId: string): Promise<RelatedProducts | null> {
  return useMock
    ? mockCatalog.getRelatedProducts(productId)
    : orNull(apiClient.get(`/products/${productId}/related`));
}
