import type { OrderAddress } from "@/features/orders/types";
import type { Photo } from "@/lib/types";

/** Requested → approved (or rejected) → picked up → refunded. The team moves it on in the admin panel. */
export type ReturnStatus = "requested" | "approved" | "rejected" | "picked-up" | "refunded";

export type ReturnItem = {
  orderItemId: string;
  name: string;
  brandName: string;
  imageUrl: string | null;
  quantity: number;
  unitPriceInPaise: number;
};

export type ReturnEvent = {
  status: ReturnStatus;
  at: string;
};

export type ReturnRequest = {
  id: string;
  /** "RET-1002" */
  number: string;
  orderId: string;
  orderNumber: string;
  items: ReturnItem[];
  reason: string;
  details: string;
  photos: Photo[];
  status: ReturnStatus;
  /** Every status reached, oldest first. */
  history: ReturnEvent[];
  pickupAddress: OrderAddress;
  /** The day the courier collects the parts; set when the return is approved. */
  pickupOn: string | null;
  /** Why the team said no; only for rejected returns. */
  rejectionReason: string | null;
  refund: {
    amountInPaise: number;
    /** Where the money goes back, e.g. "UPI". */
    to: string;
    /** The payment gateway's refund reference, once refunded. */
    reference: string | null;
  };
  /** Issued with the refund, as the GST record of the return. */
  creditNote: { number: string; issuedAt: string } | null;
  createdAt: string;
};

/** What the customer sends. The server works out the refund from the order's prices. */
export type ReturnInput = {
  orderId: string;
  items: { orderItemId: string; quantity: number }[];
  reason: string;
  details: string;
  photos: Photo[];
};
