type DataSource = "mock" | "api";

/**
 * Where each feature gets its data. Switch one feature at a time to "api" as the backend ships it;
 * nothing outside that feature's api.ts needs to change.
 */
export const dataSource = {
  auth: "mock",
  account: "mock",
  catalog: "mock",
  location: "mock",
  orders: "mock",
  promotions: "mock",
  service: "mock",
  vehicles: "mock",
} as const satisfies Record<string, DataSource>;

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
