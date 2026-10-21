"use client";

import { useFormContext } from "react-hook-form";

import { type PickedPhoto, PhotoUpload } from "@/components/ui/PhotoUpload";
import { TextField } from "@/components/ui/TextField";
import type { VehicleEditValues } from "@/features/vehicles/schema";
import type { DocumentKind } from "@/features/vehicles/types";
import { documentLabels } from "@/features/vehicles/utils";

// What each paper asks for: the RC's number is the plate, and only insurance has a company.
const fieldsByKind: Record<
  DocumentKind,
  { numberLabel: string | null; hasProvider: boolean; expiryLabel: string }
> = {
  insurance: { numberLabel: "Policy number", hasProvider: true, expiryLabel: "Valid till" },
  puc: { numberLabel: "Certificate number", hasProvider: false, expiryLabel: "Valid till" },
  rc: { numberLabel: null, hasProvider: false, expiryLabel: "Registration valid till" },
};

type DocumentFieldsProps = {
  kind: DocumentKind;
  photo: PickedPhoto[];
  onPhotoChange: (photo: PickedPhoto[]) => void;
};

/** One paper's details on the vehicle edit page. Every field is optional. */
export function DocumentFields({ kind, photo, onPhotoChange }: DocumentFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<VehicleEditValues>();
  const fields = fieldsByKind[kind];
  const fieldErrors = errors[kind];

  return (
    <fieldset className="grid gap-4 border-t border-gray-200 pt-5">
      <legend className="float-left mb-1 text-base font-semibold text-gray-900">
        {documentLabels[kind]}
      </legend>
      <div className="clear-both grid gap-4 sm:grid-cols-2">
        {fields.hasProvider && (
          <TextField
            label="Insurance company"
            placeholder="e.g. ICICI Lombard"
            error={fieldErrors?.provider?.message}
            {...register(`${kind}.provider`)}
          />
        )}
        {fields.numberLabel && (
          <TextField
            label={fields.numberLabel}
            error={fieldErrors?.number?.message}
            {...register(`${kind}.number`)}
          />
        )}
        <TextField
          label={fields.expiryLabel}
          type="date"
          hint="We'll remind you before it runs out."
          error={fieldErrors?.expiresOn?.message}
          {...register(`${kind}.expiresOn`)}
        />
      </div>
      <PhotoUpload
        id={`${kind}-photo`}
        label={`Photo of the ${documentLabels[kind]} (optional)`}
        value={photo}
        onChange={onPhotoChange}
        maxPhotos={1}
      />
    </fieldset>
  );
}
