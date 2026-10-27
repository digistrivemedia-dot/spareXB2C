import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionTile } from "@/components/ui/OptionTile";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import type { Address } from "@/features/account/types";
import type { BookServiceInput, Garage } from "@/features/service/types";
import { formatPickupWindow, getPickupWindowId, getPickupWindows } from "@/features/service/utils";

/** What the customer has picked so far on this step. */
export type PickupDropDraft = {
  mode: "bring-in" | "pickup-drop" | null;
  windowId: string;
  pickupAddressId: string;
  /** Drop back at the pickup address; otherwise at `dropAddressId`. */
  dropAtPickup: boolean;
  dropAddressId: string;
};

export function emptyPickupDropDraft(addresses: Address[]): PickupDropDraft {
  const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
  return {
    mode: null,
    windowId: "",
    pickupAddressId: preferred?.id ?? "",
    dropAtPickup: true,
    dropAddressId: "",
  };
}

/**
 * The booking's pick and drop, once the step is complete: null to bring the vehicle in,
 * undefined while something is still missing.
 */
export function toPickupDropInput(
  draft: PickupDropDraft,
): BookServiceInput["pickupDrop"] | undefined {
  if (draft.mode === "bring-in") return null;
  if (draft.mode !== "pickup-drop") return undefined;
  const dropAddressId = draft.dropAtPickup ? draft.pickupAddressId : draft.dropAddressId;
  if (!draft.windowId || !draft.pickupAddressId || !dropAddressId) return undefined;
  return { windowId: draft.windowId, pickupAddressId: draft.pickupAddressId, dropAddressId };
}

type PickupDropStepProps = {
  /** Null when Kannali assigns the garage. */
  garage: Garage | null;
  addresses: Address[];
  draft: PickupDropDraft;
  onChange: (draft: PickupDropDraft) => void;
};

function AddressOptions({
  name,
  addresses,
  value,
  onChange,
}: {
  name: string;
  addresses: Address[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid gap-2 sm:grid-cols-2">
      {addresses.map((address) => (
        <RadioCard key={address.id} value={address.id} id={`${name}-${address.id}`}>
          <span className="block font-semibold text-gray-900">{address.label}</span>
          <span className="block text-gray-700">
            {address.line1}, {address.area}, {address.city} {address.pin}
          </span>
        </RadioCard>
      ))}
    </RadioGroup>
  );
}

/** Free pick and drop (offered first), or bring the vehicle in. */
export function PickupDropStep({ garage, addresses, draft, onChange }: PickupDropStepProps) {
  const windows = getPickupWindows(garage);
  const update = (change: Partial<PickupDropDraft>) => onChange({ ...draft, ...change });

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <OptionTile
          isSelected={draft.mode === "pickup-drop"}
          onClick={() => update({ mode: "pickup-drop" })}
        >
          <span className="flex items-center gap-2 font-semibold text-gray-900">
            Pick and drop
            <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-700">
              Free
            </span>
          </span>
          <span className="text-gray-600">
            Someone from the garage collects your vehicle and brings it back.
          </span>
        </OptionTile>
        <OptionTile
          isSelected={draft.mode === "bring-in"}
          onClick={() => update({ mode: "bring-in" })}
        >
          <span className="font-semibold text-gray-900">I&apos;ll bring it in</span>
          <span className="text-gray-600">Any time during the garage&apos;s hours that day.</span>
        </OptionTile>
      </div>

      {draft.mode === "pickup-drop" &&
        (addresses.length === 0 ? (
          <div className="grid justify-items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p>Add your address first, so the garage knows where to pick up the vehicle.</p>
            <Button asChild variant="secondary" size="sm">
              <Link href="/account/addresses/new">Add an address</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            <fieldset className="grid gap-3">
              <legend className="mb-3 text-sm font-semibold text-gray-900">Pickup time</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {windows.map((window) => {
                  const id = getPickupWindowId(window);
                  return (
                    <OptionTile
                      key={id}
                      isSelected={draft.windowId === id}
                      onClick={() => update({ windowId: id })}
                      className="items-center text-center"
                    >
                      <span className="font-semibold text-gray-900">
                        {formatPickupWindow(window)}
                      </span>
                    </OptionTile>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="mb-3 text-sm font-semibold text-gray-900">Pick up from</legend>
              <AddressOptions
                name="pickup"
                addresses={addresses}
                value={draft.pickupAddressId}
                onChange={(id) => update({ pickupAddressId: id })}
              />
            </fieldset>

            <div className="grid gap-3">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-900">
                <Checkbox
                  checked={draft.dropAtPickup}
                  onCheckedChange={(state) => update({ dropAtPickup: state === true })}
                />
                Drop it back at the same address
              </label>
              {!draft.dropAtPickup && (
                <fieldset className="grid gap-3">
                  <legend className="mb-3 text-sm font-semibold text-gray-900">Drop at</legend>
                  <AddressOptions
                    name="drop"
                    addresses={addresses}
                    value={draft.dropAddressId}
                    onChange={(id) => update({ dropAddressId: id })}
                  />
                </fieldset>
              )}
            </div>
            <p className="text-xs text-gray-500">
              You&apos;ll see the name and number of the person picking up once the garage confirms.
              Need another address?{" "}
              <Link href="/account/addresses/new" className="font-semibold text-navy-700">
                Add one
              </Link>
              .
            </p>
          </div>
        ))}
    </div>
  );
}
