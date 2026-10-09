"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import { addMyBike, getMyBike, updateOdometer } from "@/features/vehicles/api";
import {
  bikeDetailsSchema,
  type BikeDetailsValues,
  type OdometerFormValues,
  odometerSchema,
} from "@/features/vehicles/schema";
import type { MyBike, VehicleRef } from "@/features/vehicles/types";
import type { ActionResult } from "@/lib/types";

export async function updateOdometerAction(
  bikeId: string,
  values: OdometerFormValues,
): Promise<ActionResult> {
  const bike = (await getSession()) ? await getMyBike(bikeId) : null;
  if (!bike)
    return { ok: false, message: "We couldn't find this bike. Please refresh and try again." };

  const parsed = odometerSchema(bike.odometerKm).safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  await updateOdometer(bikeId, Number(parsed.data.km));
  refresh();
  return { ok: true };
}

export async function addBikeAction(
  vehicle: VehicleRef,
  details: BikeDetailsValues,
): Promise<{ ok: true; bike: MyBike } | { ok: false; message: string }> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to add your bike." };
  const parsed = bikeDetailsSchema.safeParse(details);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const bike = await addMyBike({
    ...vehicle,
    registrationNumber: parsed.data.registrationNumber,
    odometerKm: Number(parsed.data.odometerKm || 0),
  });
  return { ok: true, bike };
}
