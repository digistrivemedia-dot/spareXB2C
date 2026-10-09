import type { OrderAddress as OrderAddressData } from "@/features/orders/types";
import { formatMobile } from "@/lib/format";

/** An address block as printed on orders and invoices. */
export function OrderAddress({ address }: { address: OrderAddressData }) {
  return (
    <address className="text-sm text-gray-700 not-italic">
      <span className="block font-semibold text-gray-900">{address.name}</span>
      {address.line1}
      <br />
      {address.area}, {address.city} {address.pin}
      <br />
      {address.state}
      <span className="mt-1 block">{formatMobile(address.mobile)}</span>
    </address>
  );
}
