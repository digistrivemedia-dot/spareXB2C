import type { Category, ProductSummary } from "@/features/catalog/types";
import type { VehicleBrand } from "@/features/vehicles/types";

export type BannerPlacement = "home-hero" | "home-strip" | "account";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: {
    url: string;
    alt: string;
  };
  placements: BannerPlacement[];
};

export type Coupon = {
  code: string;
  description: string;
  discount:
    | { kind: "percent"; percent: number; maxInPaise: number }
    | { kind: "flat"; amountInPaise: number };
  minOrderInPaise: number;
  isFirstOrderOnly: boolean;
};

/** The server's answer when a customer enters a coupon code. */
export type CouponCheck = { valid: true; coupon: Coupon } | { valid: false; message: string };

/** A row of products on the home page, picked and named in the admin panel. */
export type ProductShelf = {
  id: string;
  title: string;
  /** Where "View all" goes, e.g. a category or a search. */
  viewAllHref: string;
  products: ProductSummary[];
};

/** What the admin panel features on the shop home, in the order chosen there. */
export type HomeFeatures = {
  categories: Category[];
  shelves: ProductShelf[];
  vehicleBrands: VehicleBrand[];
};
