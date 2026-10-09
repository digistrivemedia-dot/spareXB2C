import { Truck } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { Address } from "@/features/account/types";

type PickupStepProps = {
  addresses: Address[];
  /** The address to collect from, or null when the customer drops the bike off. */
  addressId: string | null;
  onChange: (addressId: string | null) => void;
};

export function PickupStep({ addresses, addressId, onChange }: PickupStepProps) {
  const defaultAddressId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null;

  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <Truck className="size-6 shrink-0 text-navy-700" aria-hidden />
        <Label htmlFor="pickup-switch" className="grid flex-1 cursor-pointer gap-0.5 font-normal">
          <span className="font-semibold text-gray-900">Free pickup and drop</span>
          <span className="text-sm text-gray-600">
            We collect your bike and bring it back after the service.
          </span>
        </Label>
        <Switch
          id="pickup-switch"
          checked={addressId !== null}
          onCheckedChange={(on) => onChange(on ? defaultAddressId : null)}
          disabled={!defaultAddressId}
        />
      </div>
      {addressId !== null && (
        <RadioGroup
          value={addressId}
          onValueChange={onChange}
          aria-label="Pickup address"
          className="gap-3 sm:grid-cols-2"
        >
          {addresses.map((address) => (
            <RadioCard key={address.id} value={address.id} id={`pickup-${address.id}`}>
              <span className="font-semibold text-gray-900">{address.label}</span>
              <span className="mt-1 block text-gray-700">
                {address.line1}, {address.area}, {address.city} {address.pin}
              </span>
            </RadioCard>
          ))}
        </RadioGroup>
      )}
      {addressId === null && (
        <p className="text-sm text-gray-600">
          You&apos;ll drop the bike at the garage at your chosen time.
        </p>
      )}
    </div>
  );
}
