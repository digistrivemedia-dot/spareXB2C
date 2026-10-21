import type { ReturnInput, ReturnRequest } from "@/features/returns/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockReturns } from "@/mocks/returns";

const useMock = dataSource.returns === "mock";

export function getReturn(id: string): Promise<ReturnRequest | null> {
  return useMock ? mockReturns.getReturn(id) : orNull(apiClient.get(`/me/returns/${id}`));
}

/** The server checks the return window and quantities again before accepting it. */
export function requestReturn(input: ReturnInput): Promise<ReturnRequest> {
  return useMock ? mockReturns.requestReturn(input) : apiClient.post("/me/returns", input);
}
