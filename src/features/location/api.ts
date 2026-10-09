import type { PinLocation } from "@/features/location/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockLocation } from "@/mocks/location";

const useMock = dataSource.location === "mock";

/** Area, city and delivery details for a PIN code, or null when the PIN is unknown. */
export function lookupPin(pin: string): Promise<PinLocation | null> {
  return useMock ? mockLocation.lookupPin(pin) : orNull(apiClient.get(`/pincodes/${pin}`));
}
