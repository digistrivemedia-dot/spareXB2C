import { z } from "zod";

/** Used for both cancelling an order and asking for a return. */
export const orderChangeSchema = z.object({
  reason: z.string().min(1, "Choose a reason."),
  details: z.string().trim().max(300, "Please keep it under 300 characters."),
});

export type OrderChangeValues = z.infer<typeof orderChangeSchema>;
