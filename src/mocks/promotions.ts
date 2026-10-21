import type {
  Banner,
  BannerPlacement,
  Coupon,
  CouponCheck,
  HomeFeatures,
} from "@/features/promotions/types";
import { mockCatalog } from "@/mocks/catalog";
import { mockOrders } from "@/mocks/orders";
import { vehicleCatalog } from "@/mocks/vehicles";

const banners: Banner[] = [
  {
    id: "bnr-monsoon-brakes",
    title: "Monsoon-ready brakes",
    subtitle: "Brake pads from ₹349, matched to your vehicle.",
    ctaLabel: "Shop brakes",
    href: "/products?category=brakes",
    image: {
      url: "/images/banners/monsoon-brakes.jpg",
      alt: "Close-up of a motorcycle front disc brake",
    },
    placements: ["home-hero", "home-strip"],
  },
  {
    id: "bnr-engine-oil-offer",
    title: "Flat 10% off engine oils this week",
    subtitle: "Motul, Castrol and Shell. Offer ends Sunday.",
    ctaLabel: "Shop engine oils",
    href: "/products?category=engine-oil",
    image: {
      url: "/images/banners/engine-oil-offer.jpg",
      alt: "A scooter engine opened up for service",
    },
    placements: ["home-hero", "account"],
  },
  {
    id: "bnr-pickup-drop",
    title: "Book your next service online",
    subtitle: "Choose a garage and a date. Nothing to pay when you book.",
    ctaLabel: "Book a service",
    href: "/services/book",
    image: {
      url: "/images/banners/pickup-drop.jpg",
      alt: "A mechanic working on a motorcycle in a garage",
    },
    placements: ["home-hero", "home-strip", "account"],
  },
];

const coupons: Coupon[] = [
  {
    code: "KANNALI10",
    description: "10% off up to ₹200 on orders above ₹999",
    discount: { kind: "percent", percent: 10, maxInPaise: 20000 },
    minOrderInPaise: 99900,
    isFirstOrderOnly: false,
  },
  {
    code: "FIRSTRIDE",
    description: "₹100 off your first order",
    discount: { kind: "flat", amountInPaise: 10000 },
    minOrderInPaise: 0,
    isFirstOrderOnly: true,
  },
];

// What the admin panel would feature on the shop home. Slugs keep the picks readable here.
const featured = {
  categorySlugs: [
    "engine-oil",
    "brakes",
    "batteries",
    "tyres",
    "filters",
    "chain-sprockets",
    "lights-electricals",
    "clutch-cables",
    "accessories",
    "riding-gear",
  ],
  monsoonSlugs: [
    "bosch-front-brake-pads-apache-rtr-160-4v",
    "ktm-front-brake-pads-duke-200-rc-200",
    "bosch-clear-advantage-wiper-24in",
    "tvs-eurogrip-bee-connect-90-100-10",
    "philips-ultinon-essential-led-hs1",
    "bosch-front-brake-pads-swift-baleno",
    "mrf-zlx-185-65-r15",
    "motul-c2-chain-lube-road-150ml",
  ],
  vehicleBrandIds: [
    "honda",
    "hero",
    "bajaj",
    "tvs",
    "royal-enfield",
    "ktm",
    "maruti-suzuki",
    "hyundai",
    "tata",
    "mahindra",
  ],
};

export const mockPromotions = {
  async getHomeFeatures(): Promise<HomeFeatures> {
    const [categories, bestSellers, monsoonProducts] = await Promise.all([
      mockCatalog.getCategories(),
      mockCatalog.getProducts({ sort: "popular", pageSize: 10 }),
      Promise.all(featured.monsoonSlugs.map((slug) => mockCatalog.getProduct(slug))),
    ]);
    const monsoonIds = monsoonProducts.flatMap((product) => (product ? [product.id] : []));
    const monsoon = await mockCatalog.getProducts({ ids: monsoonIds, pageSize: 10 });
    const pick = <T>(items: T[], ids: string[], idOf: (item: T) => string) =>
      ids.flatMap((id) => items.filter((item) => idOf(item) === id));

    return {
      categories: pick(categories, featured.categorySlugs, (c) => c.slug),
      shelves: [
        {
          id: "best-sellers",
          title: "Best sellers",
          viewAllHref: "/products?sort=popular",
          products: bestSellers.items,
        },
        {
          id: "monsoon",
          title: "Monsoon essentials",
          viewAllHref: "/products?category=brakes",
          products: monsoon.items,
        },
      ],
      vehicleBrands: pick(vehicleCatalog.brands, featured.vehicleBrandIds, (b) => b.id),
    };
  },

  async getBanners(placement: BannerPlacement): Promise<Banner[]> {
    return banners.filter((banner) => banner.placements.includes(placement));
  },

  async getCoupons(): Promise<Coupon[]> {
    return coupons;
  },

  // The real check runs on the server against the signed-in customer; the demo customer has past orders.
  async checkCoupon(code: string): Promise<CouponCheck> {
    const coupon = coupons.find((c) => c.code === code.trim().toUpperCase());
    if (!coupon)
      return { valid: false, message: "This code isn't valid. Please check and try again." };

    const { total: pastOrders } = await mockOrders.getOrders();
    if (coupon.isFirstOrderOnly && pastOrders > 0) {
      return { valid: false, message: `${coupon.code} is only for your first order.` };
    }
    return { valid: true, coupon };
  },
};
