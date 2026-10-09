import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/features/orders/types";
import { orderStatusLabel, orderStatusTone } from "@/features/orders/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge tone={orderStatusTone[status]}>{orderStatusLabel[status]}</StatusBadge>;
}
