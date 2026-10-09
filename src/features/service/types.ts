export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Garage = {
  id: string;
  name: string;
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
};

export type ReminderStatus = "ok" | "due-soon" | "overdue";

export type BikeReminders = {
  bikeId: string;
  nextService: { dueOn: string; dueAtKm: number; status: ReminderStatus };
  insurance: { expiresOn: string; provider: string; status: ReminderStatus };
  puc: { expiresOn: string; status: ReminderStatus };
  rc: { expiresOn: string; status: ReminderStatus };
};

/** The five stages a customer sees, in order. */
export type ServiceStage =
  "booked" | "inspected" | "awaiting-approval" | "in-service" | "ready" | "delivered";

export type EstimateLine = {
  id: string;
  kind: "labour" | "parts" | "consumables";
  description: string;
  amountInPaise: number;
};

export type Estimate = {
  id: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  /** Why the garage recommends this work. */
  note: string;
  lines: EstimateLine[];
  totalInPaise: number;
};

export type ServiceJob = {
  id: string;
  jobCardNumber: string;
  bikeId: string;
  garage: Pick<Garage, "id" | "name" | "phone">;
  serviceType: string;
  stage: ServiceStage;
  history: { stage: ServiceStage; at: string }[];
  isPickupAndDrop: boolean;
  estimate: Estimate | null;
  expectedReadyAt: string | null;
};

export type ServiceRecord = {
  id: string;
  bikeId: string;
  garage: Pick<Garage, "id" | "name">;
  serviceType: string;
  completedOn: string;
  odometerKm: number;
  workDone: string[];
  billNumber: string;
  billTotalInPaise: number;
};

export type ServiceType = {
  id: string;
  name: string;
  description: string;
  fromPriceInPaise: number;
  /** How long the bike stays at the garage, e.g. "3–4 hours". */
  duration: string;
  includes: string[];
};

/** A garage in the booking list, with its distance from the customer's PIN. */
export type GarageOption = Garage & { distanceKm: number };

export type ServiceDay = {
  /** "YYYY-MM-DD" in India. */
  date: string;
  slots: { time: string; isAvailable: boolean }[];
};

export type BookServiceInput = {
  bikeId: string;
  serviceTypeId: string;
  garageId: string;
  date: string;
  time: string;
  /** Saved address to collect the bike from, or null to drop it at the garage. */
  pickupAddressId: string | null;
  notes: string;
};
