"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { type PickedPhoto, PhotoUpload } from "@/components/ui/PhotoUpload";
import { TextField } from "@/components/ui/TextField";
import { savePickedPhotos } from "@/features/uploads/save-photos";
import { updateVehicleAction } from "@/features/vehicles/actions";
import { DocumentFields } from "@/features/vehicles/components/DocumentFields";
import { vehicleEditSchema, type VehicleEditValues } from "@/features/vehicles/schema";
import type { DocumentKind, MyVehicle } from "@/features/vehicles/types";
import { documentLabels, getVehicleName } from "@/features/vehicles/utils";
import { formatRegistration } from "@/lib/format";
import type { Photo } from "@/lib/types";

const kinds: DocumentKind[] = ["insurance", "puc", "rc"];

const toPicked = (photos: Photo[]): PickedPhoto[] =>
  photos.map((photo) => ({ previewUrl: photo.url, file: null }));

function toFormValues(vehicle: MyVehicle): VehicleEditValues {
  const document = (kind: DocumentKind) => {
    const saved = vehicle.documents.find((d) => d.kind === kind);
    return {
      number: saved?.number ?? "",
      provider: saved?.provider ?? "",
      expiresOn: saved?.expiresOn ?? "",
    };
  };
  return {
    registrationNumber: vehicle.registrationNumber
      ? formatRegistration(vehicle.registrationNumber)
      : "",
    insurance: document("insurance"),
    puc: document("puc"),
    rc: document("rc"),
  };
}

/** Number plate, photos and papers. Photos upload first, then everything is saved together. */
export function VehicleEditForm({ vehicle }: { vehicle: MyVehicle }) {
  const router = useRouter();
  const name = getVehicleName(vehicle);
  const detailHref = `/account/vehicles/${vehicle.id}`;
  const form = useForm<VehicleEditValues>({
    resolver: zodResolver(vehicleEditSchema),
    defaultValues: toFormValues(vehicle),
  });
  const [photos, setPhotos] = useState(() => toPicked(vehicle.photos));
  const documentPhoto = (kind: DocumentKind) => {
    const photo = vehicle.documents.find((d) => d.kind === kind)?.photo;
    return toPicked(photo ? [photo] : []);
  };
  const [documentPhotos, setDocumentPhotos] = useState(() => ({
    insurance: documentPhoto("insurance"),
    puc: documentPhoto("puc"),
    rc: documentPhoto("rc"),
  }));

  async function onSubmit(values: VehicleEditValues) {
    const savedPhotos = await savePickedPhotos(photos, `${name} photo`);
    if ("error" in savedPhotos) return toast.error(savedPhotos.error);

    const savedDocumentPhotos: Record<DocumentKind, Photo | null> = {
      insurance: null,
      puc: null,
      rc: null,
    };
    // One at a time, so a failed upload stops before anything is saved.
    for (const kind of kinds) {
      const saved = await savePickedPhotos(
        documentPhotos[kind],
        `${documentLabels[kind]}, ${name}`,
      );
      if ("error" in saved) return toast.error(saved.error);
      savedDocumentPhotos[kind] = saved.photos[0] ?? null;
    }

    const result = await updateVehicleAction(
      vehicle.id,
      values,
      savedPhotos.photos,
      savedDocumentPhotos,
    );
    if (!result.ok) return toast.error(result.message);
    toast.success("Vehicle details saved");
    router.push(detailHref);
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <Card aria-label={`Edit ${name}`} className="max-w-3xl">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
          <TextField
            label="Number plate (optional)"
            placeholder="KA 03 MX 4521"
            autoComplete="off"
            className="uppercase"
            hint="Leave it empty if your vehicle doesn't have a plate yet."
            error={errors.registrationNumber?.message}
            {...form.register("registrationNumber")}
          />
          <PhotoUpload
            id="vehicle-photos"
            label="Photos of your vehicle (optional)"
            hint="The first photo shows on your dashboard. Up to 4 photos."
            value={photos}
            onChange={setPhotos}
          />
          {kinds.map((kind) => (
            <DocumentFields
              key={kind}
              kind={kind}
              photo={documentPhotos[kind]}
              onPhotoChange={(photo) => setDocumentPhotos({ ...documentPhotos, [kind]: photo })}
            />
          ))}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href={detailHref}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
