import type { Banner, BannerPlacement, Coupon, CouponCheck } from "@/features/promotions/types";
import { mockOrders } from "@/mocks/orders";

const banners: Banner[] = [
  {
    id: "bnr-monsoon-brakes",
    title: "Monsoon-ready brakes",
    subtitle: "Brake pads from ₹349, matched to your bike.",
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
    title: "Free pickup & drop on your next service",
    subtitle: "Book online and we'll collect your bike from home.",
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

export const mockPromotions = {
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
