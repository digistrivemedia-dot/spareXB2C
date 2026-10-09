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
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  "return-requested": "Return requested",
  returned: "Returned",
};

export const orderStatusTone: Record<OrderStatus, StatusTone> = {
  placed: "info",
  confirmed: "info",
  processing: "info",
  packed: "info",
  shipped: "info",
  "out-for-delivery": "info",
  delivered: "success",
  cancelled: "danger",
  "return-requested": "warning",
  returned: "neutral",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit or debit card",
  netbanking: "Net banking",
  wallet: "Wallet",
  cod: "Cash on delivery",
};

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

// Once packed, the parcel is with the courier team, so it can no longer be stopped from the app.
const cancellableStatuses: OrderStatus[] = ["placed", "confirmed", "processing"];

export function canCancel(order: Order): boolean {
  return cancellableStatuses.includes(order.status);
}

/** `today` is the date in India, "YYYY-MM-DD". */
export function canReturn(order: Order, today: string): boolean {
  return (
    order.status === "delivered" && order.returnableUntil !== null && today <= order.returnableUntil
  );
}

export const cancelReasons = [
  "Ordered by mistake",
  "The part doesn't fit my bike",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Other",
];

export const returnReasons = [
  "The part doesn't fit my bike",
  "Received a damaged part",
  "Received the wrong part",
  "Part is missing from the box",
  "Other",
];

export function isSameAddress(a: OrderAddress, b: OrderAddress): boolean {
  return (Object.keys(a) as (keyof OrderAddress)[]).every((key) => a[key] === b[key]);
}
