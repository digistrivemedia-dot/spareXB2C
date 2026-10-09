import { z } from "zod";

const rupees = z
  .string()
  .trim()
  .regex(/^\d{0,6}$/, "Use whole rupees, numbers only.");

export const priceRangeSchema = z
  .object({ min: rupees, max: rupees })
  .refine(({ min, max }) => !min || !max || Number(min) <= Number(max), {
    message: "Minimum can't be more than the maximum.",
    path: ["max"],
  });

export type PriceRangeValues = z.infer<typeof priceRangeSchema>;
