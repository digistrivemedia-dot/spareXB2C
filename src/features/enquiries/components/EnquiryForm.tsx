"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { type PickedPhoto, PhotoUpload } from "@/components/ui/PhotoUpload";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { SelectField } from "@/components/ui/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { TextField } from "@/components/ui/TextField";
import { sendEnquiryAction } from "@/features/enquiries/actions";
import { enquirySchema, type EnquiryValues } from "@/features/enquiries/schema";
import { savePickedPhotos } from "@/features/uploads/save-photos";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";

const reasons = [
  {
    value: "vehicle-not-listed",
    title: "My vehicle isn't in the list",
    text: "We'll check which parts we can get for it.",
  },
  {
    value: "part-not-found",
    title: "I can't find a part that fits",
    text: "We'll find it, or tell you when it's in stock.",
  },
] as const;

type EnquiryFormProps = {
  vehicles: MyVehicle[];
  /** From the link that brought the customer here, e.g. the vehicle they were shopping for. */
  defaultValues: EnquiryValues;
};

export function EnquiryForm({ vehicles, defaultValues }: EnquiryFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const form = useForm<EnquiryValues>({ resolver: zodResolver(enquirySchema), defaultValues });
  const [reason, vehicleChoice] = useWatch({
    control: form.control,
    name: ["reason", "vehicleChoice"],
  });
  const { errors, isSubmitting } = form.formState;
  const describesVehicle = reason === "vehicle-not-listed" || vehicleChoice === "other";

  async function onSubmit(values: EnquiryValues) {
    const saved = await savePickedPhotos(photos, "Photo sent with an enquiry");
    if ("error" in saved) return toast.error(saved.error);
    const result = await sendEnquiryAction(values, saved.photos);
    if (!result.ok) return toast.error(result.message);
    toast.success("Enquiry sent", { description: "Our parts team will reply on this page." });
    router.push("/account/enquiries");
  }

  return (
    <Card aria-label="New enquiry" className="max-w-2xl">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
        <Controller
          name="reason"
          control={form.control}
          render={({ field }) => (
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium text-gray-900">
                What do you need help with?
              </legend>
              <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                {reasons.map((option) => (
                  <RadioCard key={option.value} value={option.value} id={`reason-${option.value}`}>
                    <span className="block font-semibold text-gray-900">{option.title}</span>
                    <span className="block text-gray-600">{option.text}</span>
                  </RadioCard>
                ))}
              </RadioGroup>
              <FieldError errors={[errors.reason]} />
            </fieldset>
          )}
        />

        {reason === "part-not-found" && vehicles.length > 0 && (
          <Controller
            name="vehicleChoice"
            control={form.control}
            render={({ field }) => (
              <SelectField
                id="enquiry-vehicle"
                label="Which vehicle is it for?"
                placeholder="Choose a vehicle"
                value={field.value}
                options={[
                  ...vehicles.map((v) => ({ value: v.id, label: getVehicleName(v) })),
                  { value: "other", label: "Another vehicle" },
                ]}
                onChange={field.onChange}
              />
            )}
          />
        )}
        {describesVehicle && (
          <TextField
            label="Your vehicle"
            placeholder="Brand, model and year, e.g. Yamaha RX 100 (1994)"
            error={errors.vehicleDescription?.message}
            {...form.register("vehicleDescription")}
          />
        )}
        <TextField
          label={reason === "part-not-found" ? "Part you need" : "Part you need (optional)"}
          placeholder="e.g. Rear brake pads"
          error={errors.partNeeded?.message}
          {...form.register("partNeeded")}
        />
        <div className="grid gap-2">
          <Label htmlFor="enquiry-message">Anything else we should know? (optional)</Label>
          <Textarea
            id="enquiry-message"
            maxLength={500}
            placeholder="Part numbers, the variant, or what's wrong"
            aria-invalid={Boolean(errors.message)}
            {...form.register("message")}
          />
          <FieldError errors={[errors.message]} />
        </div>
        <PhotoUpload
          id="enquiry-photos"
          label="Photos (optional)"
          hint="A photo of the old part or its label helps us find the right one."
          value={photos}
          onChange={setPhotos}
          maxPhotos={3}
        />
        <Button type="submit" size="lg" disabled={isSubmitting} className="sm:w-fit">
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Button>
      </form>
    </Card>
  );
}
