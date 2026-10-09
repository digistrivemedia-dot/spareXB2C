import { CircleCheck, CreditCard, MapPin, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { OrderPriceSummary } from "@/features/orders/components/OrderPriceSummary";
import type { Order } from "@/features/orders/types";
import { paymentMethodLabel } from "@/features/orders/utils";
import { formatDate, formatPrice } from "@/lib/format";

/** What the customer sees right after placing an order. */
export function OrderConfirmation({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const address = order.deliveryAddress;
  const isCashOnDelivery = order.payment.method === "cod";

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="flex flex-col items-center text-center">
        <CircleCheck className="size-16 text-success-700" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
          Thank you! Your order is placed
        </h1>
        <p className="mt-1 text-gray-600">
          Order number <span className="font-semibold text-gray-900">{order.number}</span>
        </p>
      </div>

      <Card aria-label="Delivery and payment" className="grid gap-4 text-sm">
        {order.expectedDeliveryOn && (
          <p className="flex gap-3">
            <Truck className="size-5 shrink-0 text-navy-700" aria-hidden />
            <span>
              Expected delivery by{" "}
              <span className="font-semibold text-gray-900">
                {formatDate(order.expectedDeliveryOn)}
              </span>
            </span>
          </p>
        )}
        <p className="flex gap-3">
          <MapPin className="size-5 shrink-0 text-navy-700" aria-hidden />
          <span>
            {address.name}, {address.line1}, {address.area}, {address.city} {address.pin}
          </span>
        </p>
        <p className="flex gap-3">
          <CreditCard className="size-5 shrink-0 text-navy-700" aria-hidden />
          <span>
            {paymentMethodLabel[order.payment.method]}
            {isCashOnDelivery
              ? ` · Pay ${formatPrice(order.pricing.totalInPaise)} when it arrives`
              : " · Paid"}
          </span>
        </p>
        {order.pricing.installationFeeInPaise > 0 && (
          <p className="rounded-lg bg-info-50 p-3 text-info-700">
            We&apos;ll call you to book a slot for installation at Kannali Garage once your parts
            arrive.
          </p>
        )}
      </Card>

      <Card aria-label="Order summary" className="grid gap-4">
        <ul className="grid gap-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-gray-700">
                {item.name} <span className="text-gray-500">× {item.quantity}</span>
              </span>
              <span className="font-medium text-gray-900 tabular-nums">
                {formatPrice(item.unitPriceInPaise * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <OrderPriceSummary pricing={order.pricing} itemCount={itemCount} />
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild size="lg">
          <Link href={`/account/orders/${order.id}`}>View order</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
