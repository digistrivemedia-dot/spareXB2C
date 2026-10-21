import { getDeliveryDate } from "@/features/location/utils";
import type {
  Order,
  OrderGroup,
  OrderItem,
  OrderPricing,
  OrderQuery,
  OrderStatus,
  PaymentMethod,
  PlaceOrderInput,
} from "@/features/orders/types";
import { getCouponDiscount } from "@/features/promotions/utils";
import { getVehicleName } from "@/features/vehicles/utils";
import { DELIVERY_FEE_IN_PAISE, FREE_DELIVERY_THRESHOLD_IN_PAISE } from "@/lib/constants";
import { toIndianIsoDate } from "@/lib/format";
import type { Paginated } from "@/lib/types";
import { addresses } from "@/mocks/account";
import { findProductById } from "@/mocks/catalog";
import { mockLocation } from "@/mocks/location";
import { mockPromotions } from "@/mocks/promotions";
import { mockReturns } from "@/mocks/returns";
import { paginate } from "@/mocks/utils";
import { mockVehicles } from "@/mocks/vehicles";

const photoOf = (productId: string) => findProductById(productId)?.images[0]?.url ?? null;

const [homeAddress, workAddress] = addresses.map(({ id, isDefault, label, ...address }) => address);

function pricing(
  items: OrderItem[],
  couponCode: string | null = null,
  couponDiscountInPaise = 0,
): OrderPricing {
  const mrpTotalInPaise = items.reduce((sum, item) => sum + item.unitMrpInPaise * item.quantity, 0);
  const subtotalInPaise = items.reduce(
    (sum, item) => sum + item.unitPriceInPaise * item.quantity,
    0,
  );
  const deliveryFeeInPaise =
    subtotalInPaise >= FREE_DELIVERY_THRESHOLD_IN_PAISE ? 0 : DELIVERY_FEE_IN_PAISE;

  return {
    mrpTotalInPaise,
    productDiscountInPaise: mrpTotalInPaise - subtotalInPaise,
    couponCode,
    couponDiscountInPaise,
    deliveryFeeInPaise,
    totalInPaise: subtotalInPaise - couponDiscountInPaise + deliveryFeeInPaise,
  };
}

const deliveredItems: OrderItem[] = [
  {
    id: "itm-1124-1",
    productId: "prd-001",
    slug: "motul-7100-10w50-1l",
    name: "Motul 7100 4T 10W-50 Fully Synthetic Engine Oil (1 L)",
    brandName: "Motul",
    imageUrl: photoOf("prd-001"),
    quantity: 2,
    unitPriceInPaise: 89900,
    unitMrpInPaise: 98000,
  },
  {
    id: "itm-1124-2",
    productId: "prd-018",
    slug: "ktm-oil-filter-duke-rc",
    name: "KTM Genuine Oil Filter (Duke 200 / 390, RC 200)",
    brandName: "KTM",
    imageUrl: photoOf("prd-018"),
    quantity: 1,
    unitPriceInPaise: 28900,
    unitMrpInPaise: 32000,
  },
];

const shippedItems: OrderItem[] = [
  {
    id: "itm-1187-1",
    productId: "prd-024",
    slug: "mrf-revz-fc-110-70-r17-front",
    name: "MRF Revz-FC 110/70 R17 Tubeless Front Tyre",
    brandName: "MRF",
    imageUrl: photoOf("prd-024"),
    quantity: 1,
    unitPriceInPaise: 289000,
    unitMrpInPaise: 320000,
  },
];

const confirmedItems: OrderItem[] = [
  {
    id: "itm-1203-1",
    productId: "prd-037",
    slug: "steelbird-sba-7-7wings-full-face-helmet",
    name: "Steelbird SBA-7 7Wings Full Face Helmet (ISI, Matt Black)",
    brandName: "Steelbird",
    imageUrl: photoOf("prd-037"),
    quantity: 1,
    unitPriceInPaise: 159900,
    unitMrpInPaise: 189900,
  },
  {
    id: "itm-1203-2",
    productId: "prd-035",
    slug: "uno-minda-mobile-holder-usb-charger",
    name: "Uno Minda Bike Mobile Holder with USB Fast Charger",
    brandName: "Uno Minda",
    imageUrl: photoOf("prd-035"),
    quantity: 1,
    unitPriceInPaise: 84900,
    unitMrpInPaise: 109900,
  },
];

const cancelledItems: OrderItem[] = [
  {
    id: "itm-1096-1",
    productId: "prd-028",
    slug: "philips-ultinon-essential-led-hs1",
    name: "Philips Ultinon Essential LED HS1 Headlight Bulb",
    brandName: "Philips",
    imageUrl: photoOf("prd-028"),
    quantity: 1,
    unitPriceInPaise: 114900,
    unitMrpInPaise: 139900,
  },
];

// Demo data lives in memory: placed orders are kept until the server restarts.
const recentlyDeliveredItems: OrderItem[] = [
  {
    id: "itm-1204-1",
    productId: "prd-006",
    slug: "ktm-front-brake-pads-duke-200-rc-200",
    name: "KTM Genuine Front Brake Pad Set (Duke 200 / RC 200)",
    brandName: "KTM",
    imageUrl: photoOf("prd-006"),
    quantity: 1,
    unitPriceInPaise: 115000,
    unitMrpInPaise: 125000,
  },
  {
    id: "itm-1204-2",
    productId: "prd-016",
    slug: "motul-c2-chain-lube-road-150ml",
    name: "Motul C2 Chain Lube Road (150 ml)",
    brandName: "Motul",
    imageUrl: photoOf("prd-016"),
    quantity: 2,
    unitPriceInPaise: 39900,
    unitMrpInPaise: 45000,
  },
];

const orders: Order[] = [
  {
    id: "ord-1204",
    number: "KG-261011-1204",
    status: "delivered",
    placedAt: "2026-10-11T19:10:00+05:30",
    history: [
      { status: "placed", at: "2026-10-11T19:10:00+05:30" },
      { status: "confirmed", at: "2026-10-11T19:14:00+05:30" },
      { status: "processing", at: "2026-10-12T09:30:00+05:30" },
      { status: "packed", at: "2026-10-12T14:05:00+05:30" },
      { status: "shipped", at: "2026-10-12T18:40:00+05:30" },
      { status: "out-for-delivery", at: "2026-10-13T08:20:00+05:30" },
      { status: "delivered", at: "2026-10-13T12:55:00+05:30" },
    ],
    expectedDeliveryOn: "2026-10-13",
    items: recentlyDeliveredItems,
    deliveryAddress: homeAddress,
    billingAddress: homeAddress,
    vehicle: { id: "vehicle-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "upi", status: "paid", failureReason: null },
    pricing: pricing(recentlyDeliveredItems),
    gstin: null,
    cancellationReason: null,
    tracking: { courier: "Delhivery", trackingNumber: "DLV7781209941" },
    returnableUntil: "2026-10-28",
    returns: [],
  },
  {
    id: "ord-1203",
    number: "KG-261008-1203",
    status: "confirmed",
    placedAt: "2026-10-08T09:42:00+05:30",
    history: [
      { status: "placed", at: "2026-10-08T09:42:00+05:30" },
      { status: "confirmed", at: "2026-10-08T09:48:00+05:30" },
    ],
    expectedDeliveryOn: "2026-10-12",
    items: confirmedItems,
    deliveryAddress: homeAddress,
    billingAddress: homeAddress,
    vehicle: null,
    payment: { method: "upi", status: "paid", failureReason: null },
    pricing: pricing(confirmedItems),
    gstin: null,
    cancellationReason: null,
    tracking: null,
    returnableUntil: null,
    returns: [],
  },
  {
    id: "ord-1187",
    number: "KG-261005-1187",
    status: "shipped",
    placedAt: "2026-10-05T20:15:00+05:30",
    history: [
      { status: "placed", at: "2026-10-05T20:15:00+05:30" },
      { status: "confirmed", at: "2026-10-05T20:21:00+05:30" },
      { status: "processing", at: "2026-10-06T10:05:00+05:30" },
      { status: "packed", at: "2026-10-06T16:40:00+05:30" },
      { status: "shipped", at: "2026-10-07T11:30:00+05:30" },
    ],
    expectedDeliveryOn: "2026-10-10",
    items: shippedItems,
    deliveryAddress: workAddress,
    billingAddress: homeAddress,
    vehicle: { id: "vehicle-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "card", status: "paid", failureReason: null },
    pricing: pricing(shippedItems),
    gstin: null,
    cancellationReason: null,
    tracking: { courier: "Delhivery", trackingNumber: "DLV7781204563" },
    returnableUntil: null,
    returns: [],
  },
  {
    id: "ord-1124",
    number: "KG-260925-1124",
    status: "delivered",
    placedAt: "2026-09-25T08:30:00+05:30",
    history: [
      { status: "placed", at: "2026-09-25T08:30:00+05:30" },
      { status: "confirmed", at: "2026-09-25T08:34:00+05:30" },
      { status: "processing", at: "2026-09-25T11:00:00+05:30" },
      { status: "packed", at: "2026-09-25T15:20:00+05:30" },
      { status: "shipped", at: "2026-09-26T10:10:00+05:30" },
      { status: "out-for-delivery", at: "2026-09-27T08:05:00+05:30" },
      { status: "delivered", at: "2026-09-27T13:47:00+05:30" },
    ],
    expectedDeliveryOn: "2026-09-27",
    items: deliveredItems,
    deliveryAddress: homeAddress,
    billingAddress: homeAddress,
    vehicle: { id: "vehicle-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "upi", status: "paid", failureReason: null },
    pricing: pricing(deliveredItems),
    gstin: null,
    cancellationReason: null,
    tracking: { courier: "Blue Dart", trackingNumber: "BD40551289371" },
    returnableUntil: "2026-10-12",
    returns: [],
  },
  {
    id: "ord-1096",
    number: "KG-260920-1096",
    status: "cancelled",
    placedAt: "2026-09-20T13:05:00+05:30",
    history: [
      { status: "placed", at: "2026-09-20T13:05:00+05:30" },
      { status: "confirmed", at: "2026-09-20T13:09:00+05:30" },
      { status: "cancelled", at: "2026-09-20T18:22:00+05:30" },
    ],
    expectedDeliveryOn: null,
    items: cancelledItems,
    deliveryAddress: homeAddress,
    billingAddress: homeAddress,
    vehicle: { id: "vehicle-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "upi", status: "refunded", failureReason: null },
    pricing: pricing(cancelledItems),
    gstin: null,
    cancellationReason: "Ordered by mistake: the bulb doesn't fit my KTM Duke 200",
    tracking: null,
    returnableUntil: null,
    returns: [],
  },
];

const groupStatuses: Record<Exclude<OrderGroup, "all">, OrderStatus[]> = {
  active: [
    "payment-pending",
    "placed",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out-for-delivery",
  ],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};

// Returns live with the returns demo data; each order shows a summary of its own.
async function withReturns(order: Order): Promise<Order> {
  return { ...order, returns: await mockReturns.getReturnSummaries(order.id) };
}

export const mockOrders = {
  async getOrders({ group = "all", page, pageSize }: OrderQuery = {}): Promise<Paginated<Order>> {
    const all = await Promise.all(orders.map(withReturns));
    // "Cancelled & returns" also lists delivered orders that have a return.
    const matching =
      group === "all"
        ? all
        : all.filter(
            (o) =>
              groupStatuses[group].includes(o.status) ||
              (group === "cancelled" && o.returns.length > 0),
          );
    return paginate(matching, page, pageSize);
  },

  async getOrder(id: string): Promise<Order | null> {
    const order = orders.find((o) => o.id === id);
    return order ? withReturns(order) : null;
  },

  // Demo data lives in memory, so cancellations and returns last until the server restarts.
  async cancelOrder(id: string, reason: string): Promise<Order | null> {
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    const at = new Date().toISOString();
    order.status = "cancelled";
    order.cancellationReason = reason;
    order.history.push({ status: "cancelled", at });
    order.expectedDeliveryOn = null;
    if (order.payment.status === "paid") order.payment.status = "refunded";
    return order;
  },

  // Prices each line from the catalogue, as the backend will: the cart's prices are only a preview.
  async placeOrder(input: PlaceOrderInput): Promise<Order> {
    const now = new Date();
    const items: OrderItem[] = input.lines.map((line, index) => {
      const product = findProductById(line.productId);
      if (!product) throw new Error("A part in your cart is no longer sold. Please remove it.");
      if (line.quantity > product.stockQuantity) {
        throw new Error(
          `Only ${product.stockQuantity} of ${product.name} left. Please update your cart.`,
        );
      }
      return {
        id: `itm-${orders.length + 1}-${index + 1}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brandName: product.brand.name,
        imageUrl: product.images[0]?.url ?? null,
        quantity: line.quantity,
        unitPriceInPaise: product.priceInPaise,
        unitMrpInPaise: product.mrpInPaise,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.unitPriceInPaise * item.quantity, 0);
    const couponCheck = input.couponCode
      ? await mockPromotions.checkCoupon(input.couponCode)
      : null;
    const coupon = couponCheck?.valid ? couponCheck.coupon : null;
    const location = await mockLocation.lookupPin(input.deliveryAddress.pin);
    const vehicle = input.vehicleId ? await mockVehicles.getMyVehicle(input.vehicleId) : null;

    const serial = Math.max(...orders.map((o) => Number(o.id.replace("ord-", "")))) + 1;
    const isCashOnDelivery = input.paymentMode === "cod";
    // An online order is only placed once its payment goes through (see markPaid).
    const status = isCashOnDelivery ? "placed" : "payment-pending";
    const order: Order = {
      id: `ord-${serial}`,
      number: `KG-${toIndianIsoDate(now).slice(2).replaceAll("-", "")}-${serial}`,
      status,
      placedAt: now.toISOString(),
      history: [{ status, at: now.toISOString() }],
      expectedDeliveryOn: toIndianIsoDate(getDeliveryDate(now, location?.deliveryDays ?? 5)),
      items,
      deliveryAddress: input.deliveryAddress,
      billingAddress: input.billingAddress,
      vehicle: vehicle ? { id: vehicle.id, name: getVehicleName(vehicle) } : null,
      payment: {
        method: isCashOnDelivery ? "cod" : null,
        status: "pending",
        failureReason: null,
      },
      pricing: pricing(
        items,
        coupon?.code ?? null,
        coupon ? getCouponDiscount(coupon, subtotal) : 0,
      ),
      gstin: input.gstin,
      cancellationReason: null,
      tracking: null,
      returnableUntil: null,
      returns: [],
    };
    orders.unshift(order);
    return order;
  },

  async markPaid(id: string, method: PaymentMethod): Promise<Order | null> {
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    if (order.status === "payment-pending") {
      order.status = "placed";
      order.history.push({ status: "placed", at: new Date().toISOString() });
    }
    order.payment = { method, status: "paid", failureReason: null };
    return order;
  },

  async markPaymentFailed(id: string, reason: string): Promise<Order | null> {
    const order = orders.find((o) => o.id === id);
    if (!order || order.payment.status === "paid") return order ?? null;
    order.payment = { ...order.payment, status: "failed", failureReason: reason };
    return order;
  },
};
