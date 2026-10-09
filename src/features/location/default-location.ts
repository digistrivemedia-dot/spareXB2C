import { getAddresses } from "@/features/account/api";
import { getSession } from "@/features/auth/session";
import { lookupPin } from "@/features/location/api";
import type { PinLocation } from "@/features/location/types";

/** Where to deliver until the customer picks a PIN: their default address, or nothing for guests. */
export async function getDefaultLocation(): Promise<PinLocation | null> {
  if (!(await getSession())) return null;
  const defaultAddress = (await getAddresses()).find((address) => address.isDefault);
  return defaultAddress ? lookupPin(defaultAddress.pin) : null;
}
