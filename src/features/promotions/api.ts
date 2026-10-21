import type {
  Banner,
  BannerPlacement,
  Coupon,
  CouponCheck,
  HomeFeatures,
} from "@/features/promotions/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockPromotions } from "@/mocks/promotions";

const useMock = dataSource.promotions === "mock";

export function getBanners(placement: BannerPlacement): Promise<Banner[]> {
  return useMock ? mockPromotions.getBanners(placement) : apiClient.get("/banners", { placement });
}

/** Featured categories, product shelves and vehicle brands for the shop home. */
export function getHomeFeatures(): Promise<HomeFeatures> {
  return useMock ? mockPromotions.getHomeFeatures() : apiClient.get("/home/features");
}

export function getCoupons(): Promise<Coupon[]> {
  return useMock ? mockPromotions.getCoupons() : apiClient.get("/coupons");
}

/** Whether this customer can use a coupon code. Minimum order value is checked in the cart, as it changes. */
export function checkCoupon(code: string): Promise<CouponCheck> {
  return useMock ? mockPromotions.checkCoupon(code) : apiClient.post("/me/coupons/check", { code });
}
