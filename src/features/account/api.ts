import type { Address, AddressInput, DeviceSession, ProfileUpdate } from "@/features/account/types";
import type { User } from "@/features/auth/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockAccount } from "@/mocks/account";

const useMock = dataSource.account === "mock";

export function updateProfile(update: ProfileUpdate): Promise<User> {
  return useMock ? mockAccount.updateProfile(update) : apiClient.patch("/me", update);
}

/** Saved addresses, the default first. */
export function getAddresses(): Promise<Address[]> {
  return useMock ? mockAccount.getAddresses() : apiClient.get("/me/addresses");
}

export function getAddress(id: string): Promise<Address | null> {
  return useMock ? mockAccount.getAddress(id) : orNull(apiClient.get(`/me/addresses/${id}`));
}

/** Making an address the default takes the default off the others. */
export function createAddress(input: AddressInput): Promise<Address> {
  return useMock ? mockAccount.createAddress(input) : apiClient.post("/me/addresses", input);
}

export function updateAddress(id: string, input: AddressInput): Promise<Address | null> {
  return useMock
    ? mockAccount.updateAddress(id, input)
    : orNull(apiClient.put(`/me/addresses/${id}`, input));
}

/** Deleting the default makes the next address the default. */
export function deleteAddress(id: string): Promise<void> {
  return useMock ? mockAccount.deleteAddress(id) : apiClient.delete(`/me/addresses/${id}`);
}

/** Devices the customer is logged in on, this one first. */
export function getDeviceSessions(): Promise<DeviceSession[]> {
  return useMock ? mockAccount.getDeviceSessions() : apiClient.get("/me/sessions");
}

export function logOutDevice(id: string): Promise<void> {
  return useMock ? mockAccount.logOutDevice(id) : apiClient.delete(`/me/sessions/${id}`);
}

export function logOutOtherDevices(): Promise<void> {
  return useMock ? mockAccount.logOutOtherDevices() : apiClient.delete("/me/sessions/others");
}
