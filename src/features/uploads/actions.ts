"use server";

import { getSession } from "@/features/auth/session";
import { uploadPhoto } from "@/features/uploads/api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

type UploadResult = { ok: true; urls: string[] } | { ok: false; message: string };

/** Uploads the photos in `files`, checking each again on the server. */
export async function uploadPhotosAction(formData: FormData): Promise<UploadResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };

  const files = formData.getAll("files").filter((value) => value instanceof File);
  if (files.some((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_BYTES)) {
    return { ok: false, message: "Use JPG, PNG or WebP photos up to 5 MB each." };
  }
  return { ok: true, urls: await Promise.all(files.map(uploadPhoto)) };
}
