"use server";

import { getSession } from "@/features/auth/session";
import { sendEnquiry } from "@/features/enquiries/api";
import { enquirySchema, type EnquiryValues } from "@/features/enquiries/schema";
import type { ActionResult, Photo } from "@/lib/types";

export async function sendEnquiryAction(
  values: EnquiryValues,
  photos: Photo[],
): Promise<ActionResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };
  const parsed = enquirySchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { reason, vehicleChoice, vehicleDescription, partNeeded, message } = parsed.data;
  const usesSavedVehicle = reason === "part-not-found" && vehicleChoice !== "other";
  await sendEnquiry({
    reason,
    vehicleId: usesSavedVehicle ? vehicleChoice : null,
    vehicleDescription: usesSavedVehicle ? null : vehicleDescription,
    partNeeded: partNeeded || null,
    message,
    photos,
  });
  return { ok: true };
}
