import type {
  BikeReminders,
  BookServiceInput,
  Garage,
  GarageOption,
  ServiceDay,
  ServiceJob,
  ServiceRecord,
  ServiceType,
} from "@/features/service/types";
import { toIndianIsoDate } from "@/lib/format";

const garage: Garage = {
  id: "grg-whitefield",
  name: "Kannali Garage, Whitefield",
  address: "No. 42, ITPL Main Road, near Hope Farm Junction",
  area: "Whitefield",
  city: "Bengaluru",
  pin: "560066",
  phone: "9900011225",
  rating: 4.6,
  reviewCount: 312,
  openingHours: {
    days: ["mon", "tue", "wed", "thu", "fri", "sat"],
    opensAt: "09:00",
    closesAt: "20:00",
  },
  location: { lat: 12.9698, lng: 77.75 },
};

const garageRef = { id: garage.id, name: garage.name };

// The backend works distances out from the customer's PIN; the demo uses fixed ones from Whitefield.
const garageOptions: GarageOption[] = [
  { ...garage, distanceKm: 1.2 },
  {
    ...garage,
    id: "grg-marathahalli",
    name: "Kannali Garage, Marathahalli",
    address: "Plot 18, Outer Ring Road, near Kalamandir",
    area: "Marathahalli",
    pin: "560037",
    phone: "9900011226",
    rating: 4.4,
    reviewCount: 178,
    location: { lat: 12.9569, lng: 77.7011 },
    distanceKm: 6.8,
  },
  {
    ...garage,
    id: "grg-indiranagar",
    name: "Kannali Garage, Indiranagar",
    address: "No. 7, 100 Feet Road, HAL 2nd Stage",
    area: "Indiranagar",
    pin: "560038",
    phone: "9900011227",
    rating: 4.5,
    reviewCount: 240,
    location: { lat: 12.9719, lng: 77.6412 },
    distanceKm: 11.3,
  },
];

const serviceTypes: ServiceType[] = [
  {
    id: "svc-general",
    name: "General service",
    description: "The full periodic service your bike needs every 3,000–4,000 km.",
    fromPriceInPaise: 129900,
    duration: "3–4 hours",
    includes: [
      "Engine oil and filter change",
      "Air filter clean",
      "Chain clean and lube",
      "20-point check",
    ],
  },
  {
    id: "svc-oil",
    name: "Engine oil change",
    description: "Fresh oil and a new oil filter, done while you wait.",
    fromPriceInPaise: 69900,
    duration: "45 minutes",
    includes: ["Engine oil of your choice", "Oil filter", "Oil level and leak check"],
  },
  {
    id: "svc-brakes",
    name: "Brake service",
    description: "Pads or shoes checked, cleaned and adjusted; replaced if worn.",
    fromPriceInPaise: 49900,
    duration: "1–2 hours",
    includes: ["Pad and disc check", "Brake fluid top-up", "Cable adjustment"],
  },
  {
    id: "svc-wash",
    name: "Water wash and polish",
    description: "Foam wash, chain lube and a polish that lasts.",
    fromPriceInPaise: 34900,
    duration: "1 hour",
    includes: ["Foam wash", "Polish", "Chain lube"],
  },
];

const SLOT_TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const activeJobs: ServiceJob[] = [
  {
    id: "job-2026-1187",
    jobCardNumber: "JC-2026-1187",
    bikeId: "bike-ktm-duke-200",
    garage: { ...garageRef, phone: garage.phone },
    serviceType: "Brake and clutch check",
    stage: "awaiting-approval",
    history: [
      { stage: "booked", at: "2026-10-07T10:15:00+05:30" },
      { stage: "inspected", at: "2026-10-08T11:40:00+05:30" },
      { stage: "awaiting-approval", at: "2026-10-08T12:05:00+05:30" },
    ],
    isPickupAndDrop: true,
    estimate: {
      id: "est-2026-1187",
      status: "pending",
      createdAt: "2026-10-08T12:05:00+05:30",
      note: "Front brake pads are down to 2 mm and the clutch cable is fraying near the lever. We recommend replacing both today.",
      lines: [
        {
          id: "est-1187-1",
          kind: "labour",
          description: "Front brake pad replacement",
          amountInPaise: 35000,
        },
        {
          id: "est-1187-2",
          kind: "labour",
          description: "Clutch cable replacement and adjustment",
          amountInPaise: 20000,
        },
        {
          id: "est-1187-3",
          kind: "parts",
          description: "KTM genuine front brake pad set",
          amountInPaise: 115000,
        },
        {
          id: "est-1187-4",
          kind: "parts",
          description: "KTM genuine clutch cable",
          amountInPaise: 38900,
        },
        {
          id: "est-1187-5",
          kind: "consumables",
          description: "Brake fluid DOT 4 (top-up)",
          amountInPaise: 24000,
        },
        {
          id: "est-1187-6",
          kind: "consumables",
          description: "Cleaning and greasing",
          amountInPaise: 12100,
        },
      ],
      totalInPaise: 245000,
    },
    expectedReadyAt: "2026-10-09T18:00:00+05:30",
  },
];

const serviceRecords: ServiceRecord[] = [
  {
    id: "svc-2026-0912",
    bikeId: "bike-ktm-duke-200",
    garage: garageRef,
    serviceType: "General service",
    completedOn: "2026-09-10",
    odometerKm: 18000,
    workDone: [
      "Engine oil changed (Motul 7100 10W-50)",
      "Oil filter replaced",
      "Air filter cleaned",
      "Chain cleaned, lubricated and adjusted",
      "Brakes and lights checked",
    ],
    billNumber: "KG/INV/2026/0912",
    billTotalInPaise: 318000,
  },
  {
    id: "svc-2026-0318",
    bikeId: "bike-ktm-duke-200",
    garage: garageRef,
    serviceType: "General service",
    completedOn: "2026-03-14",
    odometerKm: 14950,
    workDone: [
      "Engine oil changed",
      "Oil filter replaced",
      "Spark plug replaced",
      "Chain lubricated",
    ],
    billNumber: "KG/INV/2026/0318",
    billTotalInPaise: 264000,
  },
  {
    id: "svc-2026-0802",
    bikeId: "bike-honda-activa-6g",
    garage: garageRef,
    serviceType: "General service",
    completedOn: "2026-08-02",
    odometerKm: 21800,
    workDone: [
      "Engine oil changed",
      "Air filter replaced",
      "Brake shoes adjusted",
      "Battery checked",
    ],
    billNumber: "KG/INV/2026/0802",
    billTotalInPaise: 129000,
  },
];

const reminders: BikeReminders[] = [
  {
    bikeId: "bike-ktm-duke-200",
    nextService: { dueOn: "2026-12-10", dueAtKm: 21000, status: "ok" },
    insurance: {
      expiresOn: "2026-12-15",
      provider: "ICICI Lombard",
      status: "ok",
    },
    puc: { expiresOn: "2026-10-20", status: "due-soon" },
    rc: { expiresOn: "2038-03-14", status: "ok" },
  },
  {
    bikeId: "bike-honda-activa-6g",
    nextService: { dueOn: "2026-11-02", dueAtKm: 24800, status: "ok" },
    insurance: {
      expiresOn: "2026-09-30",
      provider: "Bajaj Allianz",
      status: "overdue",
    },
    puc: { expiresOn: "2027-01-12", status: "ok" },
    rc: { expiresOn: "2036-07-21", status: "ok" },
  },
];

export const mockService = {
  async getMyGarage(): Promise<Garage> {
    return garage;
  },

  async getServiceTypes(): Promise<ServiceType[]> {
    return serviceTypes;
  },

  async getGarages(): Promise<GarageOption[]> {
    return garageOptions;
  },

  // The next six working days from tomorrow. Some slots are taken, varying by garage and day.
  async getServiceSlots(garageId: string): Promise<ServiceDay[]> {
    const garageIndex = garageOptions.findIndex((g) => g.id === garageId);
    const days: ServiceDay[] = [];
    for (let offset = 1; days.length < 6; offset += 1) {
      const date = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
      if (date.getUTCDay() === 0) continue;
      days.push({
        date: toIndianIsoDate(date),
        slots: SLOT_TIMES.map((time, slotIndex) => ({
          time,
          isAvailable: (offset + slotIndex + garageIndex) % 4 !== 0,
        })),
      });
    }
    return days;
  },

  async bookService(input: BookServiceInput): Promise<ServiceJob | null> {
    const chosenGarage = garageOptions.find((g) => g.id === input.garageId);
    const serviceType = serviceTypes.find((t) => t.id === input.serviceTypeId);
    if (!chosenGarage || !serviceType) return null;

    const serial = 1187 + activeJobs.length;
    const job: ServiceJob = {
      id: `job-2026-${serial}`,
      jobCardNumber: `JC-2026-${serial}`,
      bikeId: input.bikeId,
      garage: { id: chosenGarage.id, name: chosenGarage.name, phone: chosenGarage.phone },
      serviceType: serviceType.name,
      stage: "booked",
      history: [{ stage: "booked", at: new Date().toISOString() }],
      isPickupAndDrop: input.pickupAddressId !== null,
      estimate: null,
      expectedReadyAt: `${input.date}T${input.time}:00+05:30`,
    };
    activeJobs.push(job);
    return job;
  },

  async getActiveServiceJob(bikeId: string): Promise<ServiceJob | null> {
    return activeJobs.find((job) => job.bikeId === bikeId) ?? null;
  },

  async getServiceHistory(bikeId: string): Promise<ServiceRecord[]> {
    return serviceRecords
      .filter((record) => record.bikeId === bikeId)
      .sort((a, b) => b.completedOn.localeCompare(a.completedOn));
  },

  async getBikeReminders(bikeId: string): Promise<BikeReminders | null> {
    return reminders.find((reminder) => reminder.bikeId === bikeId) ?? null;
  },

  // Demo data lives in memory, so decisions last until the server restarts.
  async decideEstimate(
    jobId: string,
    decision: "approved" | "declined",
  ): Promise<ServiceJob | null> {
    const job = activeJobs.find((j) => j.id === jobId);
    if (!job?.estimate) return null;
    const at = new Date().toISOString();
    job.estimate.status = decision;
    // Either way the garage carries on: with the extra work if approved, without it if declined.
    job.stage = "in-service";
    job.history.push({ stage: "in-service", at });
    return job;
  },

  async rateServiceVisit(recordId: string): Promise<boolean> {
    return serviceRecords.some((record) => record.id === recordId);
  },
};
