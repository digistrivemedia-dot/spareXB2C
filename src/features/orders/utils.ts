import type { StatusTone } from "@/components/ui/StatusBadge";
import type { Step } from "@/components/ui/Stepper";
import type {
  Order,
  OrderAddress,
  OrderGroup,
  OrderStatus,
  PaymentMethod,
} from "@/features/orders/types";
import { formatDateTime } from "@/lib/format";

export const orderStatusLabel: Record<OrderStatus, string> = {
  "payment-pending": "Payment pending",
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const orderStatusTone: Record<OrderStatus, StatusTone> = {
  "payment-pending": "warning",
  placed: "info",
  confirmed: "info",
  processing: "info",
  packed: "info",
  shipped: "info",
  "out-for-delivery": "info",
  delivered: "success",
  cancelled: "danger",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit or debit card",
  netbanking: "Net banking",
  wallet: "Wallet",
  cod: "Cash on delivery",
};

/** "UPI", "Cash on delivery", or "Online payment" before the customer has paid. */
export function getPaymentLabel(payment: Order["payment"]): string {
  return payment.method ? paymentMethodLabel[payment.method] : "Online payment";
}

export const orderTabs: { group: OrderGroup; label: string }[] = [
  { group: "all", label: "All" },
  { group: "active", label: "Active" },
  { group: "delivered", label: "Delivered" },
  { group: "cancelled", label: "Cancelled & returns" },
];

const deliveryFlow: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
];

/** Timeline steps with the time each was reached. Cancelled and returned orders show what actually happened. */
export function getOrderProgress(order: Order): { steps: Step[]; activeStep: number } {
  const reachedAt = (status: OrderStatus) =>
    order.history.findLast((event) => event.status === status)?.at;

  if (!deliveryFlow.includes(order.status)) {
    const steps = order.history.map((event) => ({
      label: orderStatusLabel[event.status],
      detail: formatDateTime(event.at),
    }));
    return { steps, activeStep: steps.length };
  }

  const steps = deliveryFlow.map((status) => {
    const at = reachedAt(status);
    return { label: orderStatusLabel[status], detail: at ? formatDateTime(at) : undefined };
  });
  const reached = deliveryFlow.indexOf(order.status);
  return { steps, activeStep: order.status === "delivered" ? steps.length : reached + 1 };
}

// Until the courier has it. Unpaid orders can be cancelled too, so they don't linger.
const cancellableStatuses: OrderStatus[] = [
  "payment-pending",
  "placed",
  "confirmed",
  "processing",
  "packed",
];

export function canCancel(order: Order): boolean {
  return cancellableStatuses.includes(order.status);
}

/** Units of each item not already in an open or completed return. Rejected returns don't count. */
export function getReturnableQuantities(order: Order): Record<string, number> {
  const taken = (itemId: string) =>
    order.returns
      .filter((r) => r.status !== "rejected")
      .flatMap((r) => r.items)
      .filter((line) => line.orderItemId === itemId)
      .reduce((sum, line) => sum + line.quantity, 0);
  return Object.fromEntries(order.items.map((item) => [item.id, item.quantity - taken(item.id)]));
}

/** Delivered, inside the return window, with something left to return. `today` is "YYYY-MM-DD" in India. */
export function canReturn(order: Order, today: string): boolean {
  const hasItemsLeft = Object.values(getReturnableQuantities(order)).some((qty) => qty > 0);
  return (
    order.status === "delivered" &&
    order.returnableUntil !== null &&
    today <= order.returnableUntil &&
    hasItemsLeft
  );
}

export const cancelReasons = [
  "Ordered by mistake",
  "The part doesn't fit my vehicle",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Other",
];

export function isSameAddress(a: OrderAddress, b: OrderAddress): boolean {
  return (Object.keys(a) as (keyof OrderAddress)[]).every((key) => a[key] === b[key]);
}
