import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getAddresses } from "@/features/account/api";
import { AddressForm } from "@/features/account/components/AddressForm";

export const metadata: Metadata = { title: "Add an address" };

export default async function NewAddressPage() {
  const addresses = await getAddresses();

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title="Add an address" />
      <AddressForm isFirst={addresses.length === 0} />
    </div>
  );
}
