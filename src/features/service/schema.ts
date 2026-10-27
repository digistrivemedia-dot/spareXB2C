import { z } from "zod";

export const visitReviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a star rating.").max(5),
  comment: z.string().trim().max(500, "Please keep it under 500 characters."),
});

export type VisitReviewValues = z.infer<typeof visitReviewSchema>;

export const bookingSchema = z
  .object({
    vehicleId: z.string().min(1, "Choose the vehicle to service."),
    packageId: z.string().min(1).nullable(),
    garage: z.discriminatedUnion("mode", [
      z.object({ mode: z.literal("best") }),
      z.object({ mode: z.literal("chosen"), garageId: z.string().min(1, "Choose a garage.") }),
    ]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
    notes: z.string().trim().max(300, "Please keep notes under 300 characters."),
    pickupDrop: z
      .object({
        windowId: z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, "Choose a pickup time."),
        pickupAddressId: z.string().min(1, "Choose the pickup address."),
        dropAddressId: z.string().min(1, "Choose the drop address."),
      })
      .nullable(),
  })
  // Without a package, the note is how the garage knows what to look at.
  .refine((booking) => booking.packageId !== null || booking.notes.length > 0, {
    message: "Tell us what's wrong with the vehicle.",
    path: ["notes"],
  });
