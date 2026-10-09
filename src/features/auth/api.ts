import type { OtpRequest, OtpVerification } from "@/features/auth/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockAuth } from "@/mocks/auth";

const useMock = dataSource.auth === "mock";

/** Sends a one-time code by SMS to this 10-digit mobile number. */
export function requestOtp(mobile: string): Promise<OtpRequest> {
  return useMock ? mockAuth.requestOtp(mobile) : apiClient.post("/auth/otp", { mobile });
}

/** Null when the code is wrong or expired (or a new customer gave no name). */
export function verifyOtp(
  mobile: string,
  otp: string,
  name: string | null,
): Promise<OtpVerification | null> {
  return useMock
    ? mockAuth.verifyOtp(mobile, name)
    : orNull(apiClient.post("/auth/otp/verify", { mobile, otp, name }));
}
