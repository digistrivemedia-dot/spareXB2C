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

/** Optional: an empty box is fine, but anything typed must look like a real plate. */
const registrationSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, "").toUpperCase())
  .refine(
    (value) => value === "" || REGISTRATION_PATTERN.test(value),
    "Enter the number as on the plate, like KA 03 MX 4521, or leave it empty.",
  );

export const vehicleDetailsSchema = z.object({
  registrationNumber: registrationSchema,
  odometerKm: z
    .string()
    .trim()
    .regex(/^\d{0,6}$/, "Enter the reading in km, using numbers only."),
});

export type VehicleDetailsValues = z.input<typeof vehicleDetailsSchema>;

// Policy and certificate numbers vary by insurer and state, so only the length is checked.
const documentNumber = z.string().trim().max(40, "That number looks too long. Please check it.");

const documentSchema = z.object({
  number: documentNumber,
  provider: z.string().trim().max(60, "Keep the company name under 60 characters."),
  expiresOn: z.union([z.literal(""), z.iso.date("Choose the expiry date.")]),
});

/** The vehicle edit page. Photos are handled outside the schema (files can't be validated by zod here). */
export const vehicleEditSchema = z.object({
  registrationNumber: registrationSchema,
  insurance: documentSchema,
  puc: documentSchema,
  rc: documentSchema,
});

export type VehicleEditValues = z.input<typeof vehicleEditSchema>;
