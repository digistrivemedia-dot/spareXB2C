"use server";

import { refresh } from "next/cache";

import {
  createAddress,
  deleteAddress,
  getAddress,
  logOutDevice,
  logOutOtherDevices,
  updateAddress,
  updateProfile,
} from "@/features/account/api";
import {
  type AddressFormValues,
  addressFormSchema,
  profileSchema,
  type ProfileValues,
} from "@/features/account/schema";
import { getSession } from "@/features/auth/session";
import type { ActionResult } from "@/lib/types";

const LOGGED_OUT: ActionResult = { ok: false, message: "Please log in again to continue." };

export async function updateProfileAction(values: ProfileValues): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { name, email, gstin } = parsed.data;
  await updateProfile({ name, email: email || null, gstin: gstin || null });
  refresh();
  return { ok: true };
}

/** Adds an address, or changes the one with this id. */
export async function saveAddressAction(
  id: string | null,
  values: AddressFormValues,
): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  const parsed = addressFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { label, address, isDefault } = parsed.data;
  const input = { label, isDefault, ...address };
  const saved = id ? await updateAddress(id, input) : await createAddress(input);
  if (!saved) return { ok: false, message: "This address was removed. Please add it again." };
  return { ok: true };
}

export async function setDefaultAddressAction(id: string): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  const address = await getAddress(id);
  if (!address) return { ok: false, message: "This address was removed. Please refresh." };

  await updateAddress(id, { ...address, isDefault: true });
  refresh();
  return { ok: true };
}

export async function deleteAddressAction(id: string): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  await deleteAddress(id);
  refresh();
  return { ok: true };
}

export async function logOutDeviceAction(id: string): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  await logOutDevice(id);
  refresh();
  return { ok: true };
}

export async function logOutOtherDevicesAction(): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  await logOutOtherDevices();
  refresh();
  return { ok: true };
}
