"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { saveAddressAction } from "@/features/account/actions";
import { AddressFields } from "@/features/account/components/AddressFields";
import {
  addressFormSchema,
  type AddressFormValues,
  addressLabels,
  emptyAddressFields,
} from "@/features/account/schema";
import type { Address } from "@/features/account/types";

type AddressFormProps = {
  /** The address being edited; empty for a new one. */
  address?: Address;
  /** A first address always becomes the default, so the choice isn't offered. */
  isFirst?: boolean;
};

function toFormValues(address: Address | undefined, isFirst: boolean): AddressFormValues {
  if (!address) return { label: "Home", address: emptyAddressFields, isDefault: isFirst };
  const { id, label, isDefault, ...fields } = address;
  const knownLabel = addressLabels.find((l) => l === label) ?? "Other";
  return { label: knownLabel, address: fields, isDefault };
}

export function AddressForm({ address, isFirst = false }: AddressFormProps) {
  const router = useRouter();
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: toFormValues(address, isFirst),
  });
  const { errors, isSubmitting } = form.formState;
  // The default can only move by making another address the default, so it's never left without one.
  const canChooseDefault = !isFirst && !address?.isDefault;

  async function onSubmit(values: AddressFormValues) {
    const result = await saveAddressAction(address?.id ?? null, values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(address ? "Address updated" : "Address added");
    router.push("/account/addresses");
  }

  return (
    <Card aria-label={address ? "Edit address" : "New address"} className="max-w-2xl">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
          <Controller
            name="label"
            control={form.control}
            render={({ field }) => (
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium text-gray-900">Save as</legend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-3 gap-2"
                >
                  {addressLabels.map((label) => (
                    <RadioCard key={label} value={label} id={`address-label-${label}`}>
                      {label}
                    </RadioCard>
                  ))}
                </RadioGroup>
                <FieldError errors={[errors.label]} />
              </fieldset>
            )}
          />

          <AddressFields />

          {canChooseDefault && (
            <Controller
              name="isDefault"
              control={form.control}
              render={({ field }) => (
                <div className="flex min-h-11 items-center gap-3">
                  <Checkbox
                    id="address-default"
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(state === true)}
                  />
                  <Label htmlFor="address-default" className="cursor-pointer font-normal">
                    Make this my default address
                  </Label>
                </div>
              )}
            />
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/account/addresses">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save address"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
