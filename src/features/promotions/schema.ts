import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{4,15}$/, "Enter the code as shown, e.g. KANNALI10."),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
