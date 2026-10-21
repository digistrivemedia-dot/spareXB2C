import { z } from "zod";

export const visitReviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a star rating.").max(5),
  comment: z.string().trim().max(500, "Please keep it under 500 characters."),
});

export type VisitReviewValues = z.infer<typeof visitReviewSchema>;

export const bookingSchema = z.object({
  vehicleId: z.string().min(1, "Choose the vehicle to service."),
  serviceTypeId: z.string().min(1, "Choose a service."),
  garageId: z.string().min(1, "Choose a garage."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  notes: z.string().trim().max(300, "Please keep notes under 300 characters."),
});
