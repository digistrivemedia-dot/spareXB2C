import { z } from "zod";

import { returnReasons } from "@/features/returns/utils";

/** `quantities` maps each order item id to how many to return (0 = not returning it). */
export const returnRequestSchema = z
  .object({
    quantities: z.record(z.string(), z.number().int().min(0)),
    reason: z
      .string()
      .refine((value) => returnReasons.includes(value), "Choose why you're returning it."),
    details: z.string().trim().max(300, "Please keep it under 300 characters."),
  })
  .refine((values) => Object.values(values.quantities).some((quantity) => quantity > 0), {
    message: "Choose at least one part to return.",
    path: ["quantities"],
  });

export type ReturnRequestValues = z.infer<typeof returnRequestSchema>;
