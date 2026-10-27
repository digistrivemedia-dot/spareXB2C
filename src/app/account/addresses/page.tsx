import { MapPinHouse, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAddresses } from "@/features/account/api";
import { AddressCard } from "@/features/account/components/AddressCard";

export const metadata: Metadata = { title: "Your addresses" };

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[{ label: "My account", href: "/account/settings" }, { label: "Addresses" }]}
      />
      <PageHeader
        title="Your addresses"
        description="Choose one at checkout. Your default address is picked for you."
        action={
          addresses.length > 0 && (
            <Button asChild>
              <Link href="/account/addresses/new">
                <Plus aria-hidden />
                Add address
              </Link>
            </Button>
          )
        }
      />
      {addresses.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id}>
              <AddressCard address={address} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={MapPinHouse}
          title="No saved addresses yet"
          description="Save your home or work address once, and checkout fills it in for you."
        >
          <Button asChild>
            <Link href="/account/addresses/new">Add an address</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
