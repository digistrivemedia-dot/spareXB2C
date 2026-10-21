"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteAddressAction, setDefaultAddressAction } from "@/features/account/actions";
import type { Address } from "@/features/account/types";

/** "Set as default" (for the others) and "Delete", each telling the customer how it went. */
export function AddressActions({ address }: { address: Address }) {
  const [isSettingDefault, startSettingDefault] = useTransition();

  function setDefault() {
    startSettingDefault(async () => {
      const result = await setDefaultAddressAction(address.id);
      if (result.ok) toast.success(`${address.label} is now your default address`);
      else toast.error(result.message);
    });
  }

  async function remove() {
    const result = await deleteAddressAction(address.id);
    if (!result.ok) {
      toast.error(result.message);
      return false;
    }
    toast.success("Address deleted");
  }

  return (
    <>
      {!address.isDefault && (
        <Button variant="ghost" size="sm" onClick={setDefault} disabled={isSettingDefault}>
          {isSettingDefault ? "Saving…" : "Set as default"}
        </Button>
      )}
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="sm" className="ml-auto">
            <Trash2 aria-hidden />
            Delete
          </Button>
        }
        title={`Delete your ${address.label.toLowerCase()} address?`}
        description={`${address.line1}, ${address.area}. You can add it again later.`}
        confirmLabel="Delete address"
        tone="destructive"
        onConfirm={remove}
      />
    </>
  );
}
