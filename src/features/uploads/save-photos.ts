import type { PickedPhoto } from "@/components/ui/PhotoUpload";
import { uploadPhotosAction } from "@/features/uploads/actions";
import type { Photo } from "@/lib/types";

/**
 * Turns the picker's photos into saved ones: new files are uploaded, saved ones are kept.
 * When the upload fails, nothing is saved and the reason comes back as `error`.
 */
export async function savePickedPhotos(
  picked: PickedPhoto[],
  alt: string,
): Promise<{ photos: Photo[] } | { error: string }> {
  const newFiles = picked.flatMap((photo) => (photo.file ? [photo.file] : []));
  let uploaded: string[] = [];
  if (newFiles.length > 0) {
    const formData = new FormData();
    newFiles.forEach((file) => formData.append("files", file));
    const result = await uploadPhotosAction(formData);
    if (!result.ok) return { error: result.message };
    uploaded = result.urls;
  }

  let next = 0;
  return {
    photos: picked.map((photo) => ({
      url: photo.file ? uploaded[next++] : photo.previewUrl,
      alt,
    })),
  };
}
