import type { Address } from "@/features/account/types";
import type { VehicleType } from "@/features/vehicles/types";
import type { Photo } from "@/lib/types";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** A service at one garage, at that garage's own starting price. */
export type GarageService = {
  serviceTypeId: string;
  fromPriceInPaise: number;
};

/** An approved garage: a Kannali Garage branch, or a partner garage Kannali has checked. */
export type Garage = {
  id: string;
  /** For the profile URL: /services/garages/kannali-garage-whitefield */
  slug: string;
  name: string;
  isKannaliBranch: boolean;
  address: string;
  area: string;
  city: string;
  pin: string;
  phone: string;
  rating: number;
  reviewCount: number;
  openingHours: {
    days: Weekday[];
    /** 24-hour "HH:mm", India Standard Time. */
    opensAt: string;
    closesAt: string;
  };
  location: { lat: number; lng: number };
  /** Printed on the garage's bills, which are in its own name. */
  legalName: string;
  gstin: string;
  /** The kinds of vehicle the garage works on. */
  vehicleTypes: VehicleType[];
  about: string;
  photos: Photo[];
  services: GarageService[];
};

/** A customer's rating of a garage after a visit. Customers rate garages, not products. */
export type GarageReview = {
  id: string;
  garageId: string;
  authorName: string;
  rating: number;
  comment: string;
  /** What was serviced, e.g. "Honda Activa 6G". */
  vehicleName: string;
  createdAt: string;
};

export type GarageReviews = {
  /** Number of ratings per star, index 0 = 1 star … index 4 = 5 stars. */
  distribution: [number, number, number, number, number];
  latest: GarageReview[];
};

/** What the garage list can be narrowed and sorted by. */
export type GarageQuery = {
  /** Only these garages, e.g. the customer's favourites. */
  ids?: string[];
  /** Distances are measured from this PIN; without one, garages are sorted by rating. */
  pin?: string;
  serviceTypeId?: string;
  vehicleType?: VehicleType;
  /** Only garages open on this day ("YYYY-MM-DD"). */
  openOn?: string;
  minRating?: number;
  openOnSunday?: boolean;
  sort?: "distance" | "rating";
};

export type ReminderStatus = "ok" | "due-soon" | "overdue";

/** When the next service is due: by this date or at this reading, whichever comes first. */
export type NextServiceDue = {
  vehicleId: string;
  dueOn: string;
  dueAtKm: number;
  status: ReminderStatus;
};

/** The stages a customer sees, in order. "picked-up" and "out-for-drop" only happen with pick and drop. */
export type ServiceStage =
  /** Sent to the garage, which accepts or declines it. */
  | "requested"
  | "booked"
  /** The garage's staff collected the vehicle and are taking it to the garage. */
  | "picked-up"
  | "inspected"
  | "awaiting-approval"
  | "in-service"
  | "ready"
  /** The garage's staff are bringing the vehicle back. */
  | "out-for-drop"
  | "delivered"
  | "declined"
  | "cancelled";

/** What the mechanic found when checking the vehicle in. */
export type InspectionFinding = {
  id: string;
  area: string;
  finding: string;
  severity: "ok" | "attention" | "urgent";
};

/** The job card: the vehicle's condition when the garage took it in (C35). */
export type CheckIn = {
  at: string;
  odometerKm: number;
  fuelLevel: string;
  /** What the customer told the garage, in their words. */
  customerConcerns: string;
  advisorName: string;
  findings: InspectionFinding[];
  photos: Photo[];
};

export type EstimateLineKind = "labour" | "parts" | "consumables";

/** One item of work; the customer approves or declines each one. */
export type EstimateLine = {
  id: string;
  kind: EstimateLineKind;
  description: string;
  amountInPaise: number;
  decision: "pending" | "approved" | "declined";
};

/** The garage's price for the booked work, or for extra work it found later. */
export type Estimate = {
  id: string;
  kind: "booked-work" | "extra-work";
  createdAt: string;
  /** When the customer answered; null while it waits for them. */
  decidedAt: string | null;
  /** Why the garage recommends this work. */
  note: string;
  lines: EstimateLine[];
};

/** What the garage did, written up when the vehicle is ready (C37). */
export type CompletionReport = {
  completedAt: string;
  odometerKm: number;
  workDone: string[];
  partsUsed: { name: string; quantity: number; amountInPaise: number }[];
  mechanicNotes: string;
  nextService: { dueOn: string; dueAtKm: number };
};

/** The garage's GST bill, in its own name (C39), and how it was paid (C38). */
export type ServiceBill = {
  number: string;
  issuedAt: string;
  garage: { legalName: string; address: string; gstin: string };
  lines: { description: string; kind: EstimateLineKind; amountInPaise: number }[];
  /** The GST already included in the total. */
  gstInPaise: number;
  totalInPaise: number;
  payment: {
    status: "unpaid" | "paid";
    /** "at-garage" once the customer chooses to pay at the counter, before it's paid. */
    method: "online" | "at-garage" | null;
    paidAt: string | null;
    reference: string | null;
  };
};

/** Where the garage collects or returns the vehicle: a copy of the saved address at booking time. */
export type JobAddress = Pick<
  Address,
  "label" | "name" | "mobile" | "line1" | "area" | "city" | "pin"
>;

/** Free pick and drop: the garage's own staff collect the vehicle on the booked day and bring it back. */
export type PickupDrop = {
  /** Pickup window on the booked day, 24-hour "HH:mm", India Standard Time. */
  window: { from: string; to: string };
  pickupAddress: JobAddress;
  dropAddress: JobAddress;
  /** The garage owner, technician or helper doing the pickup; null until the garage assigns someone. */
  staff: { name: string; phone: string } | null;
};

export type ServiceJob = {
  id: string;
  jobCardNumber: string;
  vehicleId: string;
  garage: Pick<Garage, "id" | "slug" | "name" | "phone">;
  serviceType: string;
  stage: ServiceStage;
  history: { stage: ServiceStage; at: string }[];
  /** The day the customer brings the vehicle in ("YYYY-MM-DD"). There are no time slots. */
  scheduledOn: string;
  /** What the customer wrote when booking. */
  notes: string;
  /** Null when the customer brings the vehicle in themselves. */
  pickupDrop: PickupDrop | null;
  /** Why the garage declined, or why the customer cancelled. */
  closedReason: string | null;
  checkIn: CheckIn | null;
  /** Oldest first. */
  estimates: Estimate[];
  expectedReadyAt: string | null;
  completion: CompletionReport | null;
  bill: ServiceBill | null;
  /** The customer's rating of the garage for this visit. */
  review: { rating: number; comment: string; at: string } | null;
};

/** A finished service, as listed in a vehicle's history. `id` is the job's id. */
export type ServiceRecord = {
  id: string;
  vehicleId: string;
  garage: Pick<Garage, "id" | "slug" | "name">;
  serviceType: string;
  completedOn: string;
  odometerKm: number;
  workDone: string[];
  billNumber: string;
  billTotalInPaise: number;
  isRated: boolean;
};

export type ServiceType = {
  id: string;
  name: string;
  description: string;
  fromPriceInPaise: number;
  /** How long the vehicle stays at the garage, e.g. "3–4 hours". */
  duration: string;
  includes: string[];
};

/** A garage in a list, with its distance from the customer's PIN (null without a PIN). */
export type GarageOption = Garage & { distanceKm: number | null };

/**
 * A service package the admin sets for particular vehicle models, at one price at every garage.
 * Parts or work beyond the package come as an estimate for the customer's approval.
 */
export type ServicePackage = {
  id: string;
  name: string;
  description: string;
  priceInPaise: number;
  /** How long the vehicle stays at the garage, e.g. "3–4 hours". */
  duration: string;
  includes: string[];
  /** Catalog model ids (e.g. "ktm-duke-200") the package is for. */
  modelIds: string[];
  /** The regular service at the maker's interval: what the home page suggests when the next service is due. */
  isRoutine: boolean;
};

/**
 * How the garage is picked: "best" lets Kannali assign the best garage that's free, by its own criteria;
 * "chosen" is a garage the customer picked (a favourite or from the list).
 */
export type GarageChoice = { mode: "best" } | { mode: "chosen"; garageId: string };

/** Nothing is paid when booking. The request goes to garages one by one until one accepts. */
export type BookServiceInput = {
  vehicleId: string;
  /** Null when the customer describes a problem instead; the garage quotes after inspecting. */
  packageId: string | null;
  garage: GarageChoice;
  /** "YYYY-MM-DD". */
  date: string;
  /** Required when there is no package: what's wrong with the vehicle. */
  notes: string;
  /** Null when the customer brings the vehicle in. Addresses are ids from the customer's address book. */
  pickupDrop: {
    /** "09:00-12:00", one of the pickup windows. */
    windowId: string;
    pickupAddressId: string;
    dropAddressId: string;
  } | null;
};

/**
 * A booking on its way to a garage, like a ride request: each garage in turn gets a few seconds to accept
 * (`GARAGE_ACCEPT_SECONDS`), then it moves on to the next. The job exists once a garage accepts.
 */
export type ServiceRequest = {
  id: string;
  status: "searching" | "accepted" | "no-garage" | "cancelled";
  /** Which garage is being asked now (1-based), out of how many. */
  attempt: number;
  totalGarages: number;
  /** The garage being asked, or the one that accepted. Null when none is left. */
  garage: Pick<Garage, "id" | "name"> | null;
  /** When the current garage's time to accept runs out (ISO), while searching. */
  expiresAt: string | null;
  job: ServiceJob | null;
};
