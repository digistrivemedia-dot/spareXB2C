import { getSession } from "@/features/auth/session";
import type { Order } from "@/features/orders/types";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import { mockOrders } from "@/mocks/orders";

// No real gateway in the demo: the ids are made up, and the demo window "pays" by calling back.
export const mockPayments = {
  async startPayment(orderId: string): Promise<PaymentSession | null> {
    const [order, session] = await Promise.all([mockOrders.getOrder(orderId), getSession()]);
    if (!order || !session) return null;
    return {
      payableId: orderId,
      description: `Order ${order.number}`,
      amountInPaise: order.pricing.totalInPaise,
      gatewayOrderId: `order_demo_${orderId}_${Date.now()}`,
      keyId: "rzp_test_demo",
      customer: {
        name: session.user.name,
        mobile: session.user.mobile,
        email: session.user.email,
      },
    };
  },

  async confirmPayment(orderId: string, proof: PaymentProof): Promise<Order | null> {
    return mockOrders.markPaid(orderId, proof.demoMethod ?? "upi");
  },

  async reportPaymentFailure(orderId: string, reason: string): Promise<void> {
    await mockOrders.markPaymentFailed(orderId, reason);
  },
};
