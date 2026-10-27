import type { Notification } from "@/features/notifications/types";
import type { Order } from "@/features/orders/types";
import type { ServiceJob } from "@/features/service/types";
import { getEstimateTotal, getPendingEstimate } from "@/features/service/utils";
import { formatPrice } from "@/lib/format";

/** What a service job needs from the customer, or news about it; null when there is nothing to say. */
function getJobNotification(job: ServiceJob, vehicleName: string): Notification | null {
  const base = `/account/services/${job.id}`;
  const estimate = getPendingEstimate(job);
  if (job.stage === "awaiting-approval" && estimate) {
    return {
      id: `job-${job.id}-estimate`,
      title: `Approve extra work on your ${vehicleName}`,
      detail: `${estimate.lines.length} items · ${formatPrice(getEstimateTotal(estimate))} · ${job.garage.name}`,
      href: `${base}/estimate`,
      needsAction: true,
    };
  }
  if (job.bill?.payment.status === "unpaid" && job.bill.payment.method !== "at-garage") {
    return {
      id: `job-${job.id}-bill`,
      title: `Pay the service bill for your ${vehicleName}`,
      detail: `${formatPrice(job.bill.totalInPaise)} · ${job.garage.name}`,
      href: `${base}/pay`,
      needsAction: true,
    };
  }
  if (job.stage === "out-for-drop") {
    return {
      id: `job-${job.id}-drop`,
      title: `Your ${vehicleName} is on its way back`,
      detail: job.garage.name,
      href: base,
      needsAction: false,
    };
  }
  return null;
}

function getOrderNotification(order: Order): Notification | null {
  const href = `/account/orders/${order.id}`;
  if (order.status === "payment-pending") {
    return {
      id: `order-${order.id}-payment`,
      title: "Complete payment for your order",
      detail: `${order.number} · ${formatPrice(order.pricing.totalInPaise)}`,
      href: `/checkout/payment?order=${order.id}`,
      needsAction: true,
    };
  }
  if (order.status === "out-for-delivery" || order.status === "shipped") {
    return {
      id: `order-${order.id}-${order.status}`,
      title: order.status === "shipped" ? "Your order has shipped" : "Your order arrives today",
      detail: order.number,
      href,
      needsAction: false,
    };
  }
  return null;
}

/**
 * The customer's notifications from their open services and orders, things to do first. Paperwork
 * reminders (PUC, insurance) are left out until the client decides how to send them.
 */
export function getNotifications(
  jobs: ServiceJob[],
  orders: Order[],
  vehicleNames: Map<string, string>,
): Notification[] {
  const notifications = [
    ...jobs.map((job) => getJobNotification(job, vehicleNames.get(job.vehicleId) ?? "vehicle")),
    ...orders.map(getOrderNotification),
  ].filter((notification) => notification !== null);
  return notifications.sort((a, b) => Number(b.needsAction) - Number(a.needsAction));
}
