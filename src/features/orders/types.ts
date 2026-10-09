import type { Address } from "@/features/account/types";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "return-requested"
  | "returned";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type OrderItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  imageUrl: string | null;
  quantity: number;
  unitPriceInPaise: number;
  unitMrpInPaise: number;
};

export type OrderPricing = {
  mrpTotalInPaise: number;
  productDiscountInPaise: number;
  couponCode: string | null;
  couponDiscountInPaise: number;
  deliveryFeeInPaise: number;
  installationFeeInPaise: number;
  totalInPaise: number;
};

export type OrderEvent = {
  status: OrderStatus;
  at: string;
};

/** An address as printed on an order: a snapshot, unaffected by later edits to the address book. */
export type OrderAddress = Omit<Address, "id" | "isDefault" | "label">;

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  placedAt: string;
  /** Every status the order has reached, oldest first. */
  history: OrderEvent[];
  expectedDeliveryOn: string | null;
  items: OrderItem[];
  deliveryAddress: OrderAddress;
  billingAddress: OrderAddress;
  /** The customer's bike the parts are for, when they chose one at checkout. */
  bike: { id: string; name: string } | null;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
  };
  pricing: OrderPricing;
  gstin: string | null;
  /** Why it was cancelled or returned. */
  cancellationReason: string | null;
  tracking: { courier: string; trackingNumber: string } | null;
  /** Last day a return can be requested (ISO date); set once delivered, per the return policy. */
  returnableUntil: string | null;
};

/** The tabs on the orders page. */
export type OrderGroup = "all" | "active" | "delivered" | "cancelled";

export type OrderQuery = {
  group?: OrderGroup;
  page?: number;
  pageSize?: number;
};

/** What checkout sends. The server prices the items itself; the cart's prices are only a preview. */
export type PlaceOrderInput = {
  lines: { productId: string; quantity: number; withInstallation: boolean }[];
  couponCode: string | null;
  deliveryAddress: OrderAddress;
  billingAddress: OrderAddress;
  gstin: string | null;
  bikeId: string | null;
  paymentMethod: PaymentMethod;
};
