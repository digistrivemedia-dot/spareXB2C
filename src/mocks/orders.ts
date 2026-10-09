import { getDeliveryDate } from "@/features/location/utils";
import type {
  Order,
  OrderGroup,
  OrderItem,
  OrderPricing,
  OrderQuery,
  OrderStatus,
  PlaceOrderInput,
} from "@/features/orders/types";
import { getCouponDiscount } from "@/features/promotions/utils";
import { getBikeName } from "@/features/vehicles/utils";
import { toIndianIsoDate } from "@/lib/format";
import {
  DELIVERY_FEE_IN_PAISE,
  FREE_DELIVERY_THRESHOLD_IN_PAISE,
  INSTALLATION_FEE_IN_PAISE,
} from "@/lib/constants";
import type { Paginated } from "@/lib/types";
import { addresses } from "@/mocks/account";
import { findProductById } from "@/mocks/catalog";
import { mockLocation } from "@/mocks/location";
import { mockPromotions } from "@/mocks/promotions";
import { paginate } from "@/mocks/utils";
import { mockVehicles } from "@/mocks/vehicles";

const photoOf = (productId: string) => findProductById(productId)?.images[0]?.url ?? null;

const [homeAddress, workAddress] = addresses.map(({ id, isDefault, label, ...address }) => address);

function pricing(
  items: OrderItem[],
  couponCode: string | null = null,
  couponDiscountInPaise = 0,
  installationFeeInPaise = 0,
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
    installationFeeInPaise,
    totalInPaise:
      subtotalInPaise - couponDiscountInPaise + installationFeeInPaise + deliveryFeeInPaise,
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
const orders: Order[] = [
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
    bike: null,
    payment: { method: "cod", status: "pending" },
    pricing: pricing(confirmedItems, "KANNALI10", 20000),
    gstin: null,
    cancellationReason: null,
    tracking: null,
    returnableUntil: null,
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
    bike: { id: "bike-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "card", status: "paid" },
    pricing: pricing(shippedItems),
    gstin: null,
    cancellationReason: null,
    tracking: { courier: "Delhivery", trackingNumber: "DLV7781204563" },
    returnableUntil: null,
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
    bike: { id: "bike-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "upi", status: "paid" },
    pricing: pricing(deliveredItems),
    gstin: null,
    cancellationReason: null,
    tracking: { courier: "Blue Dart", trackingNumber: "BD40551289371" },
    returnableUntil: "2026-10-12",
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
    bike: { id: "bike-ktm-duke-200", name: "KTM Duke 200" },
    payment: { method: "upi", status: "refunded" },
    pricing: pricing(cancelledItems),
    gstin: null,
    cancellationReason: "Ordered by mistake: the bulb doesn't fit my KTM Duke 200",
    tracking: null,
    returnableUntil: null,
  },
];

const groupStatuses: Record<Exclude<OrderGroup, "all">, OrderStatus[]> = {
  active: ["placed", "confirmed", "processing", "packed", "shipped", "out-for-delivery"],
  delivered: ["delivered"],
  cancelled: ["cancelled", "return-requested", "returned"],
};

export const mockOrders = {
  async getOrders({ group = "all", page, pageSize }: OrderQuery = {}): Promise<Paginated<Order>> {
    const matching =
      group === "all" ? orders : orders.filter((o) => groupStatuses[group].includes(o.status));
    return paginate(matching, page, pageSize);
  },

  async getOrder(id: string): Promise<Order | null> {
    return orders.find((order) => order.id === id) ?? null;
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

  async requestReturn(id: string, reason: string): Promise<Order | null> {
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = "return-requested";
    order.cancellationReason = reason;
    order.history.push({ status: "return-requested", at: new Date().toISOString() });
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
        imageUrl: product.image?.url ?? null,
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
    const installations = input.lines.filter((line) => line.withInstallation).length;
    const location = await mockLocation.lookupPin(input.deliveryAddress.pin);
    const bike = input.bikeId ? await mockVehicles.getMyBike(input.bikeId) : null;

    const serial = 1204 + orders.length - 4;
    const order: Order = {
      id: `ord-${serial}`,
      number: `KG-${toIndianIsoDate(now).slice(2).replaceAll("-", "")}-${serial}`,
      status: "placed",
      placedAt: now.toISOString(),
      history: [{ status: "placed", at: now.toISOString() }],
      expectedDeliveryOn: toIndianIsoDate(getDeliveryDate(now, location?.deliveryDays ?? 5)),
      items,
      deliveryAddress: input.deliveryAddress,
      billingAddress: input.billingAddress,
      bike: bike ? { id: bike.id, name: getBikeName(bike) } : null,
      payment: {
        method: input.paymentMethod,
        // Demo: online payments succeed straight away; cash is collected on delivery.
        status: input.paymentMethod === "cod" ? "pending" : "paid",
      },
      pricing: pricing(
        items,
        coupon?.code ?? null,
        coupon ? getCouponDiscount(coupon, subtotal) : 0,
        installations * INSTALLATION_FEE_IN_PAISE,
      ),
      gstin: input.gstin,
      cancellationReason: null,
      tracking: null,
      returnableUntil: null,
    };
    orders.unshift(order);
    return order;
  },
};
