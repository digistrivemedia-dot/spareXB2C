"use server";

import { redirect } from "next/navigation";

import { requestOtp, verifyOtp } from "@/features/auth/api";
import { type MobileValues, mobileSchema, otpSchema, type OtpValues } from "@/features/auth/schema";
import { endSession, startSession } from "@/features/auth/session";
import type { OtpRequest } from "@/features/auth/types";
import { safeNextPath } from "@/features/auth/utils";

type OtpRequestResult = ({ ok: true } & OtpRequest) | { ok: false; message: string };

export async function requestOtpAction(values: MobileValues): Promise<OtpRequestResult> {
  const parsed = mobileSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  return { ok: true, ...(await requestOtp(parsed.data.mobile)) };
}

export async function verifyOtpAction(
  mobile: string,
  isNewUser: boolean,
  values: OtpValues,
  next: string | null,
): Promise<{ ok: false; message: string }> {
  const mobileCheck = mobileSchema.safeParse({ mobile });
  const parsed = otpSchema(isNewUser).safeParse(values);
  if (!mobileCheck.success || !parsed.success) {
    return { ok: false, message: "Please check the code and try again." };
  }

  const result = await verifyOtp(mobile, parsed.data.otp, parsed.data.name || null);
  if (!result)
    return { ok: false, message: "That code didn't work. Check the SMS or resend the code." };

  await startSession(result.token);
  redirect(safeNextPath(next));
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}
