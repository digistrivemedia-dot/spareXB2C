import { z } from "zod";

export const pinSchema = z.object({
  pin: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code, like 560066."),
});

export type PinFormValues = z.infer<typeof pinSchema>;
