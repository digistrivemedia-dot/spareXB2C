import type { Fitment } from "@/features/catalog/types";

/** A cart line keeps a snapshot of the product so the cart renders without refetching. */
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  imageUrl: string | null;
  priceInPaise: number;
  mrpInPaise: number;
  stockQuantity: number;
  fitment: Fitment;
  quantity: number;
  isInstallable: boolean;
  /** The customer asked Kannali Garage to fit this part. */
  withInstallation: boolean;
};
