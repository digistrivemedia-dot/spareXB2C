import type { Address } from "@/features/account/types";
import type { ReturnStatus } from "@/features/returns/types";

export type OrderStatus =
  /** Created at checkout, waiting for the online payment to go through. */
  | "payment-pending"
  | "placed"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/** How the customer chose to pay at checkout: online (Razorpay) or cash on delivery. */
export type PaymentMode = "online" | "cod";

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
  /** The customer's vehicle the parts are for, when they chose one at checkout. */
  vehicle: { id: string; name: string } | null;
  payment: {
    /** "cod", or how the customer paid online; null until an online payment goes through. */
    method: PaymentMethod | null;
    status: PaymentStatus;
    /** Why the last online attempt failed, shown on the retry page. */
    failureReason: string | null;
  };
  pricing: OrderPricing;
  gstin: string | null;
  /** Why it was cancelled. */
  cancellationReason: string | null;
  tracking: { courier: string; trackingNumber: string } | null;
  /** Last day a return can be requested (ISO date); set once delivered, per the return policy. */
  returnableUntil: string | null;
  /** Returns asked for on this order, newest first. */
  returns: OrderReturnSummary[];
};

/** A return as listed on its order; the full details are on the return itself. */
export type OrderReturnSummary = {
  id: string;
  number: string;
  status: ReturnStatus;
  items: { orderItemId: string; quantity: number }[];
  createdAt: string;
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
  lines: { productId: string; quantity: number }[];
  couponCode: string | null;
  deliveryAddress: OrderAddress;
  billingAddress: OrderAddress;
  gstin: string | null;
  vehicleId: string | null;
  paymentMode: PaymentMode;
};
