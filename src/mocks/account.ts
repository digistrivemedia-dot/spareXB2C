import type { Address, AddressInput, DeviceSession, ProfileUpdate } from "@/features/account/types";
import { getSession } from "@/features/auth/session";
import type { User } from "@/features/auth/types";
import { mockAuth } from "@/mocks/auth";

export const addresses: Address[] = [
  {
    id: "adr-home",
    label: "Home",
    name: "Arjun Rao",
    mobile: "9845012345",
    pin: "560066",
    line1: "Flat 304, Sai Krupa Residency, 4th Cross, ITPL Main Road",
    area: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    isDefault: true,
  },
  {
    id: "adr-work",
    label: "Work",
    name: "Arjun Rao",
    mobile: "9845012345",
    pin: "560037",
    line1: "3rd Floor, Orion Business Park, Outer Ring Road",
    area: "Marathahalli",
    city: "Bengaluru",
    state: "Karnataka",
    isDefault: false,
  },
];

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

// The demo can't tell devices apart, so the first one is always "this device".
let deviceSessions: DeviceSession[] = [
  {
    id: "ses-windows-chrome",
    kind: "computer",
    name: "Chrome on Windows",
    location: "Bengaluru, Karnataka",
    signedInAt: "2026-09-02T10:15:00+05:30",
    lastActiveAt: hoursAgo(0),
    isCurrent: true,
  },
  {
    id: "ses-iphone-safari",
    kind: "phone",
    name: "Safari on iPhone",
    location: "Bengaluru, Karnataka",
    signedInAt: "2026-07-18T19:40:00+05:30",
    lastActiveAt: hoursAgo(26),
    isCurrent: false,
  },
  {
    id: "ses-android-tablet",
    kind: "tablet",
    name: "Chrome on Android tablet",
    location: "Mysuru, Karnataka",
    signedInAt: "2026-05-09T08:05:00+05:30",
    lastActiveAt: hoursAgo(24 * 12),
    isCurrent: false,
  },
];

// Demo data lives in memory, so changes last until the server restarts.
function save(id: string, input: AddressInput): Address {
  if (input.isDefault) addresses.forEach((a) => (a.isDefault = false));
  const address = { id, ...input };
  const index = addresses.findIndex((a) => a.id === id);
  if (index === -1) addresses.push(address);
  else addresses[index] = address;
  // The first address is always the default, so checkout has one to pre-select.
  if (!addresses.some((a) => a.isDefault)) addresses[0].isDefault = true;
  return address;
}

export const mockAccount = {
  async updateProfile(update: ProfileUpdate): Promise<User> {
    const session = await getSession();
    if (!session) throw new Error("Not logged in");
    return mockAuth.updateUser({ ...session.user, ...update });
  },

  async getAddresses(): Promise<Address[]> {
    return [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  },

  async getAddress(id: string): Promise<Address | null> {
    return addresses.find((a) => a.id === id) ?? null;
  },

  async createAddress(input: AddressInput): Promise<Address> {
    return save(`adr-${Date.now()}`, input);
  },

  async updateAddress(id: string, input: AddressInput): Promise<Address | null> {
    return addresses.some((a) => a.id === id) ? save(id, input) : null;
  },

  async deleteAddress(id: string): Promise<void> {
    const index = addresses.findIndex((a) => a.id === id);
    if (index === -1) return;
    const [removed] = addresses.splice(index, 1);
    if (removed.isDefault && addresses.length > 0) addresses[0].isDefault = true;
  },

  async getDeviceSessions(): Promise<DeviceSession[]> {
    return deviceSessions.map((s) => (s.isCurrent ? { ...s, lastActiveAt: hoursAgo(0) } : s));
  },

  async logOutDevice(id: string): Promise<void> {
    deviceSessions = deviceSessions.filter((s) => s.id !== id || s.isCurrent);
  },

  async logOutOtherDevices(): Promise<void> {
    deviceSessions = deviceSessions.filter((s) => s.isCurrent);
  },
};
