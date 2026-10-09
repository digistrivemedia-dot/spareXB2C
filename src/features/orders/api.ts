import type { Order, OrderQuery, PlaceOrderInput } from "@/features/orders/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { mockOrders } from "@/mocks/orders";

const useMock = dataSource.orders === "mock";

export function getOrders(query: OrderQuery = {}): Promise<Paginated<Order>> {
  return useMock ? mockOrders.getOrders(query) : apiClient.get("/me/orders", query);
}

export function getOrder(id: string): Promise<Order | null> {
  return useMock ? mockOrders.getOrder(id) : orNull(apiClient.get(`/me/orders/${id}`));
}

export function placeOrder(input: PlaceOrderInput): Promise<Order> {
  return useMock ? mockOrders.placeOrder(input) : apiClient.post("/me/orders", input);
}

export function cancelOrder(id: string, reason: string): Promise<Order | null> {
  return useMock
    ? mockOrders.cancelOrder(id, reason)
    : orNull(apiClient.post(`/me/orders/${id}/cancel`, { reason }));
}

export function requestReturn(id: string, reason: string): Promise<Order | null> {
  return useMock
    ? mockOrders.requestReturn(id, reason)
    : orNull(apiClient.post(`/me/orders/${id}/return`, { reason }));
}
