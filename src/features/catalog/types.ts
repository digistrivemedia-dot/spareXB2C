import type { VehicleRef, VehicleType } from "@/features/vehicles/types";

export type Category = {
  id: string;
  slug: string;
  name: string;
};

export type PartBrand = {
  id: string;
  slug: string;
  name: string;
};

/** A model the part fits. `variantIds: null` means every variant of that model. */
export type FitmentVehicle = {
  modelId: string;
  brandName: string;
  modelName: string;
  variantIds: string[] | null;
  years: number[];
};

/** Universal parts fit any model of the listed types, e.g. a helmet fits every bike and scooter. */
export type Fitment =
  | { kind: "universal"; vehicleTypes: VehicleType[] }
  | { kind: "specific"; vehicles: FitmentVehicle[] };

export type FitStatus = "fits" | "universal" | "no-fit";

export type ProductImage = {
  url: string;
  alt: string;
};

/** What listings and rails return. */
export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: PartBrand;
  category: Category;
  partNumber: string;
  sku: string;
  priceInPaise: number;
  mrpInPaise: number;
  stockQuantity: number;
  image: ProductImage | null;
  fitment: Fitment;
  isGenuine: boolean;
  warrantyMonths: number | null;
  createdAt: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

/** What the product page returns. */
export type Product = ProductSummary & {
  images: ProductImage[];
  description: string;
  highlights: string[];
  specs: ProductSpec[];
};

/** Rails on the product page, worked out by the backend. */
export type RelatedProducts = {
  boughtTogether: ProductSummary[];
  similar: ProductSummary[];
};

export type ProductSort =
  "relevance" | "price-asc" | "price-desc" | "newest" | "discount" | "popular";

export type FacetCount = {
  slug: string;
  name: string;
  count: number;
};

/** How many results each category and brand would give with the other filters applied. */
export type ProductFacets = {
  categories: FacetCount[];
  brands: FacetCount[];
};

/** Every filter the listing understands. Prices are in paise, like everywhere else in the API. */
export type ProductQuery = {
  /** Only these products, e.g. the customer's saved items or a shelf picked in the admin panel. */
  ids?: string[];
  q?: string;
  category?: string;
  brand?: string[];
  /** Only parts that fit this vehicle (universal parts included). */
  fits?: Pick<VehicleRef, "type" | "modelId" | "variantId" | "year">;
  minPriceInPaise?: number;
  maxPriceInPaise?: number;
  inStock?: boolean;
  minDiscountPercent?: number;
  hasWarranty?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};
