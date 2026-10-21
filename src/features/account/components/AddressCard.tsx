import { Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddressActions } from "@/features/account/components/AddressActions";
import type { Address } from "@/features/account/types";
import { formatMobile } from "@/lib/format";

/** One saved address with Edit, Set as default and Delete. */
export function AddressCard({ address }: { address: Address }) {
  return (
    <article
      aria-labelledby={`address-${address.id}`}
      className="flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 id={`address-${address.id}`} className="font-semibold text-gray-900">
          {address.label}
        </h2>
        {address.isDefault && <StatusBadge tone="info">Default</StatusBadge>}
      </div>
      <div className="flex-1 text-sm text-gray-700">
        <p className="font-medium text-gray-900">{address.name}</p>
        <p>{address.line1}</p>
        <p>
          {address.area}, {address.city} {address.pin}
        </p>
        <p>{address.state}</p>
        <p className="mt-2 text-gray-500">{formatMobile(address.mobile)}</p>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/account/addresses/${address.id}/edit`}>
            <Pencil aria-hidden />
            Edit
          </Link>
        </Button>
        <AddressActions address={address} />
      </div>
    </article>
  );
}
