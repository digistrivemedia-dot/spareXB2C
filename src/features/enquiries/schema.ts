import { z } from "zod";

const enquiryReasons = ["vehicle-not-listed", "part-not-found"] as const;

/** `vehicleChoice` is one of the customer's vehicle ids, or "other" to describe one. */
export const enquirySchema = z
  .object({
    reason: z.enum(enquiryReasons, { message: "Tell us what you need help with." }),
    vehicleChoice: z.string(),
    vehicleDescription: z.string().trim().max(80, "Keep the vehicle under 80 characters."),
    partNeeded: z.string().trim().max(80, "Keep the part name under 80 characters."),
    message: z.string().trim().max(500, "Keep the message under 500 characters."),
  })
  .superRefine(
    (values, ctx) => {
      const describesVehicle =
        values.reason === "vehicle-not-listed" || values.vehicleChoice === "other";
      if (describesVehicle && values.vehicleDescription.length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Tell us the brand, model and year, like Yamaha RX 100 (1994).",
          path: ["vehicleDescription"],
        });
      }
      if (values.reason === "part-not-found" && values.partNeeded.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Tell us which part you're looking for.",
          path: ["partNeeded"],
        });
      }
    },
    // Run even when another field is missing, so every error shows at once.
    { when: () => true },
  );

export type EnquiryValues = z.input<typeof enquirySchema>;
