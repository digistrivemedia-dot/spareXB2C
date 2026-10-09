import type { Banner, BannerPlacement, Coupon, CouponCheck } from "@/features/promotions/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockPromotions } from "@/mocks/promotions";

const useMock = dataSource.promotions === "mock";

export function getBanners(placement: BannerPlacement): Promise<Banner[]> {
  return useMock ? mockPromotions.getBanners(placement) : apiClient.get("/banners", { placement });
}

export function getCoupons(): Promise<Coupon[]> {
  return useMock ? mockPromotions.getCoupons() : apiClient.get("/coupons");
}

/** Whether this customer can use a coupon code. Minimum order value is checked in the cart, as it changes. */
export function checkCoupon(code: string): Promise<CouponCheck> {
  return useMock ? mockPromotions.checkCoupon(code) : apiClient.post("/me/coupons/check", { code });
}
