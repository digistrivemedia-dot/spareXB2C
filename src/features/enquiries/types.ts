import type { Photo } from "@/lib/types";

export type EnquiryReason = "vehicle-not-listed" | "part-not-found";

export type EnquiryStatus = "open" | "answered" | "closed";

/** A question the customer sent to the parts team, with the team's reply once there is one. */
export type Enquiry = {
  id: string;
  /** "ENQ-1024" */
  number: string;
  reason: EnquiryReason;
  /** The customer's saved vehicle (id set), or the vehicle as they described it (id null). */
  vehicle: { id: string | null; name: string };
  partNeeded: string | null;
  message: string;
  photos: Photo[];
  status: EnquiryStatus;
  reply: { text: string; at: string } | null;
  createdAt: string;
};

/** What the customer sends. The server fills in the vehicle's name from its id. */
export type EnquiryInput = {
  reason: EnquiryReason;
  vehicleId: string | null;
  vehicleDescription: string | null;
  partNeeded: string | null;
  message: string;
  photos: Photo[];
};
