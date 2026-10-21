export type Address = {
  id: string;
  label: string;
  name: string;
  mobile: string;
  pin: string;
  /** House, building and street. */
  line1: string;
  area: string;
  city: string;
  state: string;
  isDefault: boolean;
};

/** What the address book sends to create or change an address. */
export type AddressInput = Omit<Address, "id">;

/** The profile fields a customer can change. The mobile number is the login, so it isn't one. */
export type ProfileUpdate = {
  name: string;
  email: string | null;
  gstin: string | null;
};

export type DeviceKind = "phone" | "tablet" | "computer";

/** A device the customer is logged in on. */
export type DeviceSession = {
  id: string;
  kind: DeviceKind;
  /** "Chrome on Windows" */
  name: string;
  /** Approximate, from the network: "Bengaluru, Karnataka". */
  location: string;
  signedInAt: string;
  lastActiveAt: string;
  /** The device this request came from. */
  isCurrent: boolean;
};
