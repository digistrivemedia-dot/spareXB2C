import { z } from "zod";

export const mobileSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter your 10-digit mobile number."),
});

export type MobileValues = z.infer<typeof mobileSchema>;

/** `isNewUser` comes from the OTP request: new customers also give their name. */
export function otpSchema(isNewUser: boolean) {
  return z.object({
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from the SMS."),
    name: isNewUser
      ? z.string().trim().min(2, "Tell us your name, so we know what to call you.")
      : z.string(),
  });
}

export type OtpValues = z.infer<ReturnType<typeof otpSchema>>;
