import type { PaymentMethod } from "@/features/orders/types";

/** Everything the payment window needs for one payment. Our server creates it with Razorpay. */
export type PaymentSession = {
  /** What is being paid for: an order's id, or a service job's id. */
  payableId: string;
  /** Shown in the payment window, e.g. "Order KG-261021-1205". */
  description: string;
  amountInPaise: number;
  /** Razorpay's id for this payment attempt. */
  gatewayOrderId: string;
  /** Razorpay's public key id; safe to send to the browser. */
  keyId: string;
  customer: { name: string; mobile: string; email: string | null };
};

/** What the payment window hands back after a successful payment; our server verifies it. */
export type PaymentProof = {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  signature: string;
  /** Set only by the demo window. The real server reads the method from Razorpay. */
  demoMethod?: PaymentMethod;
};

export type PaymentResult =
  | { status: "paid"; proof: PaymentProof }
  | { status: "failed"; reason: string }
  | { status: "closed" };
