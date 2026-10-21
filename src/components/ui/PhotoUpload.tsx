"use client";

import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** A photo in the picker: one already saved (no file), or one just picked, previewed locally. */
export type PickedPhoto = {
  previewUrl: string;
  file: File | null;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

type PhotoUploadProps = {
  id: string;
  label: string;
  /** Shown under the label, e.g. "Show the damage clearly. Up to 4 photos." */
  hint?: string;
  value: PickedPhoto[];
  onChange: (photos: PickedPhoto[]) => void;
  maxPhotos?: number;
  /** A form error for this field, such as "Add at least one photo". */
  error?: string;
};

/** Pick photos from the camera or gallery, see them as thumbnails and remove any before saving. */
export function PhotoUpload({
  id,
  label,
  hint,
  value,
  onChange,
  maxPhotos = 4,
  error,
}: PhotoUploadProps) {
  const [rejection, setRejection] = useState<string | null>(null);
  const message = rejection ?? error;
  const canAddMore = value.length < maxPhotos;

  function add(files: FileList | null) {
    const picked = Array.from(files ?? []);
    const valid = picked.filter(
      (file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_SIZE_MB * 1024 * 1024,
    );
    const room = maxPhotos - value.length;
    const added = valid.slice(0, room);

    if (valid.length < picked.length) {
      setRejection(`Use JPG, PNG or WebP photos up to ${MAX_SIZE_MB} MB each.`);
    } else if (valid.length > room) {
      setRejection(`You can add up to ${maxPhotos} photos.`);
    } else {
      setRejection(null);
    }
    onChange([...value, ...added.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]);
  }

  function remove(photo: PickedPhoto) {
    if (photo.file) URL.revokeObjectURL(photo.previewUrl);
    setRejection(null);
    onChange(value.filter((p) => p !== photo));
  }

  return (
    <div role="group" aria-labelledby={`${id}-label`} className="grid gap-2">
      <div>
        <p id={`${id}-label`} className="text-sm font-medium text-gray-900">
          {label}
        </p>
        {hint && <p className="text-sm text-gray-500">{hint}</p>}
      </div>

      <ul className="grid max-w-lg grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((photo, index) => (
          <li key={photo.previewUrl} className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              <Image
                src={photo.previewUrl}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(min-width: 640px) 25vw, 33vw"
                unoptimized // The customer's own photo (a local preview or an upload), nothing to optimise.
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(photo)}
              aria-label={`Remove photo ${index + 1}`}
              // 44px tap area around a smaller visible circle, so the photo stays visible.
              className="group absolute -top-3 -right-3 flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm group-hover:bg-gray-100">
                <X className="size-4" aria-hidden />
              </span>
            </button>
          </li>
        ))}
        {canAddMore && (
          <li>
            <label
              htmlFor={id}
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-white text-sm font-medium text-navy-700 hover:bg-navy-50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                message ? "border-danger-600" : "border-gray-300",
              )}
            >
              <Camera className="size-6" aria-hidden />
              Add photo
              <input
                id={id}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                className="sr-only"
                aria-describedby={message ? `${id}-error` : undefined}
                onChange={(event) => {
                  add(event.target.files);
                  // Clear it so picking the same photo again still counts as a change.
                  event.target.value = "";
                }}
              />
            </label>
          </li>
        )}
      </ul>

      <p className="text-xs text-gray-500">
        {value.length} of {maxPhotos} {maxPhotos === 1 ? "photo" : "photos"}
      </p>
      {message && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger-700">
          {message}
        </p>
      )}
    </div>
  );
}
