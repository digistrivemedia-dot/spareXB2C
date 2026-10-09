import { z } from "zod";

import { formatKm } from "@/lib/format";

/** A new odometer reading can't be lower than the last one. */
export function odometerSchema(currentKm: number) {
  return z.object({
    km: z
      .string()
      .trim()
      .regex(/^\d{1,6}$/, "Enter the reading in km, using numbers only.")
      .refine((value) => Number(value) >= currentKm, {
        message: `The new reading can't be lower than ${formatKm(currentKm)}.`,
      }),
  });
}

export type OdometerFormValues = z.infer<ReturnType<typeof odometerSchema>>;

// Standard plates (KA 03 MX 4521) and Bharat series plates (22 BH 1234 AB), spaces ignored.
const REGISTRATION_PATTERN = /^([A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}|\d{2}BH\d{4}[A-Z]{1,2})$/;

export const bikeDetailsSchema = z.object({
  registrationNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, "").toUpperCase())
    .refine(
      (value) => REGISTRATION_PATTERN.test(value),
      "Enter the number as on the plate, like KA 03 MX 4521.",
    ),
  odometerKm: z
    .string()
    .trim()
    .regex(/^\d{0,6}$/, "Enter the reading in km, using numbers only."),
});

export type BikeDetailsValues = z.input<typeof bikeDetailsSchema>;
