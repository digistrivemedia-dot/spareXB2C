"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import {
  addMyVehicle,
  getMyVehicle,
  removeMyVehicle,
  setDefaultVehicle,
  updateMyVehicle,
  updateOdometer,
} from "@/features/vehicles/api";
import {
  vehicleDetailsSchema,
  type VehicleDetailsValues,
  type OdometerFormValues,
  odometerSchema,
  vehicleEditSchema,
  type VehicleEditValues,
} from "@/features/vehicles/schema";
import type { DocumentKind, MyVehicle, VehicleRef } from "@/features/vehicles/types";
import type { ActionResult, Photo } from "@/lib/types";

export async function updateOdometerAction(
  vehicleId: string,
  values: OdometerFormValues,
): Promise<ActionResult> {
  const vehicle = (await getSession()) ? await getMyVehicle(vehicleId) : null;
  if (!vehicle)
    return { ok: false, message: "We couldn't find this vehicle. Please refresh and try again." };

  const parsed = odometerSchema(vehicle.odometerKm).safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  await updateOdometer(vehicleId, Number(parsed.data.km));
  refresh();
  return { ok: true };
}

export async function addVehicleAction(
  ref: VehicleRef,
  details: VehicleDetailsValues,
): Promise<{ ok: true; vehicle: MyVehicle } | { ok: false; message: string }> {
  if (!(await getSession()))
    return { ok: false, message: "Please log in again to add your vehicle." };
  const parsed = vehicleDetailsSchema.safeParse(details);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const vehicle = await addMyVehicle({
    ...ref,
    registrationNumber: parsed.data.registrationNumber || null,
    odometerKm: Number(parsed.data.odometerKm || 0),
  });
  return { ok: true, vehicle };
}

/** Saves the edit page: registration, photos (already uploaded) and the three documents. */
export async function updateVehicleAction(
  vehicleId: string,
  values: VehicleEditValues,
  photos: Photo[],
  documentPhotos: Record<DocumentKind, Photo | null>,
): Promise<ActionResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };
  const parsed = vehicleEditSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { registrationNumber, ...documents } = parsed.data;
  const kinds: DocumentKind[] = ["insurance", "puc", "rc"];
  const saved = await updateMyVehicle(vehicleId, {
    registrationNumber: registrationNumber || null,
    photos,
    documents: kinds.map((kind) => ({
      kind,
      number: documents[kind].number || null,
      provider: kind === "insurance" ? documents[kind].provider || null : null,
      expiresOn: documents[kind].expiresOn || null,
      photo: documentPhotos[kind],
    })),
  });
  if (!saved) return { ok: false, message: "This vehicle was removed. Please refresh." };
  refresh();
  return { ok: true };
}

export async function setDefaultVehicleAction(vehicleId: string): Promise<ActionResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };
  await setDefaultVehicle(vehicleId);
  refresh();
  return { ok: true };
}

export async function removeVehicleAction(vehicleId: string): Promise<ActionResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };
  await removeMyVehicle(vehicleId);
  return { ok: true };
}
