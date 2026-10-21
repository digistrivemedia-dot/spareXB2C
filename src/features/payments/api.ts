import type { Order } from "@/features/orders/types";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockPayments } from "@/mocks/payments";

const useMock = dataSource.payments === "mock";

/** Starts (or restarts) the online payment for an order that isn't paid yet. */
export function startPayment(orderId: string): Promise<PaymentSession | null> {
  return useMock
    ? mockPayments.startPayment(orderId)
    : orNull(apiClient.post(`/me/orders/${orderId}/payment`));
}

/** The server checks Razorpay's signature, marks the order paid and places it. */
export function confirmPayment(orderId: string, proof: PaymentProof): Promise<Order | null> {
  return useMock
    ? mockPayments.confirmPayment(orderId, proof)
    : orNull(apiClient.post(`/me/orders/${orderId}/payment/verify`, proof));
}

/** Records why a payment attempt failed, so the retry page can say it. */
export function reportPaymentFailure(orderId: string, reason: string): Promise<void> {
  return useMock
    ? mockPayments.reportPaymentFailure(orderId, reason)
    : apiClient.post(`/me/orders/${orderId}/payment/failed`, { reason });
}
