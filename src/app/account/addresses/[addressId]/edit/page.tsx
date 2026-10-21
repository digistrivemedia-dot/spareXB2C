import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getAddress } from "@/features/account/api";
import { AddressForm } from "@/features/account/components/AddressForm";

export const metadata: Metadata = { title: "Edit address" };

export default async function EditAddressPage({
  params,
}: PageProps<"/account/addresses/[addressId]/edit">) {
  const address = await getAddress((await params).addressId);
  if (!address) notFound();

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title={`Edit ${address.label.toLowerCase()} address`} />
      <AddressForm address={address} />
    </div>
  );
}
