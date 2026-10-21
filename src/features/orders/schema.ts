import { z } from "zod";

/** Cancelling an order: a reason, and optional details. */
export const orderChangeSchema = z.object({
  reason: z.string().min(1, "Choose a reason."),
  details: z.string().trim().max(300, "Please keep it under 300 characters."),
});

export type OrderChangeValues = z.infer<typeof orderChangeSchema>;
