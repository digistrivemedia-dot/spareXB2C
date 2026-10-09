import type { Address } from "@/features/account/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockAccount } from "@/mocks/account";

const useMock = dataSource.account === "mock";

export function getAddresses(): Promise<Address[]> {
  return useMock ? mockAccount.getAddresses() : apiClient.get("/me/addresses");
}
