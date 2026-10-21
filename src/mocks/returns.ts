import type { OrderReturnSummary } from "@/features/orders/types";
import { getPaymentLabel } from "@/features/orders/utils";
import type { ReturnInput, ReturnRequest } from "@/features/returns/types";
import { getRefundAmount } from "@/features/returns/utils";
import { addresses } from "@/mocks/account";
import { findProductById } from "@/mocks/catalog";
import { mockOrders } from "@/mocks/orders";

const { id, isDefault, label, ...homeAddress } = addresses[0];
const photoOf = (productId: string) => findProductById(productId)?.images[0]?.url ?? null;

const returns: ReturnRequest[] = [
  {
    id: "ret-1002",
    number: "RET-1002",
    orderId: "ord-1204",
    orderNumber: "KG-261011-1204",
    items: [
      {
        orderItemId: "itm-1204-1",
        name: "KTM Genuine Front Brake Pad Set (Duke 200 / RC 200)",
        brandName: "KTM",
        imageUrl: photoOf("prd-006"),
        quantity: 1,
        unitPriceInPaise: 115000,
      },
    ],
    reason: "Received the wrong part",
    details: "The box says RC 390. My bike is a Duke 200.",
    photos: [
      { url: "/images/products/brakes-1.jpg", alt: "Brake pads received, with the box label" },
    ],
    status: "approved",
    history: [
      { status: "requested", at: "2026-10-16T20:12:00+05:30" },
      { status: "approved", at: "2026-10-17T10:30:00+05:30" },
    ],
    pickupAddress: homeAddress,
    pickupOn: "2026-10-22",
    rejectionReason: null,
    refund: { amountInPaise: 115000, to: "UPI", reference: null },
    creditNote: null,
    createdAt: "2026-10-16T20:12:00+05:30",
  },
  {
    id: "ret-1001",
    number: "RET-1001",
    orderId: "ord-1124",
    orderNumber: "KG-260925-1124",
    items: [
      {
        orderItemId: "itm-1124-1",
        name: "Motul 7100 4T 10W-50 Fully Synthetic Engine Oil (1 L)",
        brandName: "Motul",
        imageUrl: photoOf("prd-001"),
        quantity: 1,
        unitPriceInPaise: 89900,
      },
    ],
    reason: "Received a damaged part",
    details: "One bottle was leaking from the cap when it arrived.",
    photos: [{ url: "/images/products/engine-oil-2.jpg", alt: "Leaking oil bottle" }],
    status: "refunded",
    history: [
      { status: "requested", at: "2026-09-28T09:15:00+05:30" },
      { status: "approved", at: "2026-09-28T12:40:00+05:30" },
      { status: "picked-up", at: "2026-09-30T11:05:00+05:30" },
      { status: "refunded", at: "2026-10-02T16:20:00+05:30" },
    ],
    pickupAddress: homeAddress,
    pickupOn: "2026-09-30",
    rejectionReason: null,
    refund: { amountInPaise: 89900, to: "UPI", reference: "RFND-26100211042" },
    creditNote: { number: "CN-2610-0004", issuedAt: "2026-10-02T16:20:00+05:30" },
    createdAt: "2026-09-28T09:15:00+05:30",
  },
];

// Demo data lives in memory, so new returns last until the server restarts.
export const mockReturns = {
  async getReturn(returnId: string): Promise<ReturnRequest | null> {
    return returns.find((r) => r.id === returnId) ?? null;
  },

  async getReturnSummaries(orderId: string): Promise<OrderReturnSummary[]> {
    return returns
      .filter((r) => r.orderId === orderId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => ({
        id: r.id,
        number: r.number,
        status: r.status,
        items: r.items.map(({ orderItemId, quantity }) => ({ orderItemId, quantity })),
        createdAt: r.createdAt,
      }));
  },

  // Prices the return from the order, as the backend will.
  async requestReturn(input: ReturnInput): Promise<ReturnRequest> {
    const order = await mockOrders.getOrder(input.orderId);
    if (!order) throw new Error("We couldn't find this order.");
    const items = input.items.flatMap(({ orderItemId, quantity }) => {
      const item = order.items.find((i) => i.id === orderItemId);
      if (!item || quantity <= 0) return [];
      const { name, brandName, imageUrl, unitPriceInPaise } = item;
      return [{ orderItemId, name, brandName, imageUrl, quantity, unitPriceInPaise }];
    });
    const now = new Date().toISOString();
    const serial = 1001 + returns.length;
    const request: ReturnRequest = {
      id: `ret-${serial}`,
      number: `RET-${serial}`,
      orderId: order.id,
      orderNumber: order.number,
      items,
      reason: input.reason,
      details: input.details,
      photos: input.photos,
      status: "requested",
      history: [{ status: "requested", at: now }],
      pickupAddress: order.deliveryAddress,
      pickupOn: null,
      rejectionReason: null,
      refund: {
        amountInPaise: getRefundAmount(items),
        to: getPaymentLabel(order.payment),
        reference: null,
      },
      creditNote: null,
      createdAt: now,
    };
    returns.push(request);
    return request;
  },
};
