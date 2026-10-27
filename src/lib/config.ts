type DataSource = "mock" | "api";

/**
 * Where each feature gets its data. Switch one feature at a time to "api" as the backend ships it;
 * nothing outside that feature's api.ts needs to change.
 */
export const dataSource = {
  auth: "mock",
  account: "mock",
  catalog: "mock",
  content: "mock",
  location: "mock",
  orders: "mock",
  payments: "mock",
  enquiries: "mock",
  promotions: "mock",
  returns: "mock",
  service: "mock",
  uploads: "mock",
  vehicles: "mock",
} as const satisfies Record<string, DataSource>;

/** Features built but switched off until the client confirms them for launch. */
export const features = {
  coupons: false,
  cashOnDelivery: false,
} as const;

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** SpareX Business (B2B) login. Business members are sent here from the login page's Business tab. */
export const b2bLoginUrl =
  process.env.NEXT_PUBLIC_B2B_LOGIN_URL ?? "https://spare-x-b2b.vercel.app/login";
