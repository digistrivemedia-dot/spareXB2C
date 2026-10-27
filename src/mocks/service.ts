import type { Address } from "@/features/account/types";
import { getSession } from "@/features/auth/session";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import type {
  BookServiceInput,
  Garage,
  GarageOption,
  GarageQuery,
  GarageReview,
  GarageReviews,
  JobAddress,
  NextServiceDue,
  PickupDrop,
  ServiceJob,
  ServicePackage,
  ServiceRequest,
  EstimateLine,
  EstimateLineKind,
  ServiceBill,
  ServiceRecord,
  ServiceStage,
  ServiceType,
  Weekday,
} from "@/features/service/types";
import {
  GARAGE_ACCEPT_SECONDS,
  getPickupWindowId,
  getPickupWindows,
} from "@/features/service/utils";
import { getVehicleName } from "@/features/vehicles/utils";
import { toIndianIsoDate } from "@/lib/format";
import { addresses } from "@/mocks/account";
import { mockVehicles } from "@/mocks/vehicles";

// Opening days used by most garages.
const monToSat: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat"];
const everyDay: Weekday[] = [...monToSat, "sun"];

const prices = (general: number, oil: number, brakes: number, wash?: number) => [
  { serviceTypeId: "svc-general", fromPriceInPaise: general * 100 },
  { serviceTypeId: "svc-oil", fromPriceInPaise: oil * 100 },
  { serviceTypeId: "svc-brakes", fromPriceInPaise: brakes * 100 },
  ...(wash ? [{ serviceTypeId: "svc-wash", fromPriceInPaise: wash * 100 }] : []),
];

// Kannali Garage's branches and the partner garages it has approved. Partner names are made up.
const garages: Garage[] = [
  {
    id: "grg-whitefield",
    slug: "kannali-garage-whitefield",
    name: "Kannali Garage, Whitefield",
    isKannaliBranch: true,
    address: "No. 42, ITPL Main Road, near Hope Farm Junction",
    area: "Whitefield",
    city: "Bengaluru",
    pin: "560066",
    phone: "9900011225",
    rating: 4.6,
    reviewCount: 312,
    openingHours: { days: monToSat, opensAt: "09:00", closesAt: "20:00" },
    location: { lat: 12.9698, lng: 77.75 },
    legalName: "Kannali Garage Private Limited",
    gstin: "29AAKCK4821M1Z3",
    vehicleTypes: ["bike", "scooter", "car"],
    about:
      "Kannali Garage's first workshop, with six service bays and a separate car bay. Genuine parts, a written estimate before any extra work, and a GST bill.",
    photos: [
      {
        url: "/images/garages/mechanic-at-work.jpg",
        alt: "A mechanic working in the Whitefield workshop",
      },
      { url: "/images/banners/pickup-drop.jpg", alt: "A motorcycle on the service stand" },
    ],
    services: prices(1299, 699, 499, 349),
  },
  {
    id: "grg-marathahalli",
    slug: "kannali-garage-marathahalli",
    name: "Kannali Garage, Marathahalli",
    isKannaliBranch: true,
    address: "Plot 18, Outer Ring Road, near Kalamandir",
    area: "Marathahalli",
    city: "Bengaluru",
    pin: "560037",
    phone: "9900011226",
    rating: 4.4,
    reviewCount: 178,
    openingHours: { days: monToSat, opensAt: "09:00", closesAt: "20:00" },
    location: { lat: 12.9569, lng: 77.7011 },
    legalName: "Kannali Garage Private Limited",
    gstin: "29AAKCK4821M1Z3",
    vehicleTypes: ["bike", "scooter"],
    about: "A two-wheeler workshop on the Outer Ring Road, quick with oil changes on weekdays.",
    photos: [
      {
        url: "/images/banners/engine-oil-offer.jpg",
        alt: "A scooter engine opened up for service",
      },
    ],
    services: prices(1249, 649, 499, 299),
  },
  {
    id: "grg-indiranagar",
    slug: "kannali-garage-indiranagar",
    name: "Kannali Garage, Indiranagar",
    isKannaliBranch: true,
    address: "No. 7, 100 Feet Road, HAL 2nd Stage",
    area: "Indiranagar",
    city: "Bengaluru",
    pin: "560038",
    phone: "9900011227",
    rating: 4.5,
    reviewCount: 240,
    openingHours: { days: everyDay, opensAt: "09:00", closesAt: "21:00" },
    location: { lat: 12.9719, lng: 77.6412 },
    legalName: "Kannali Garage Private Limited",
    gstin: "29AAKCK4821M1Z3",
    vehicleTypes: ["bike", "scooter", "car"],
    about: "Open every day, including Sundays. Bikes, scooters and cars.",
    photos: [
      { url: "/images/banners/monsoon-brakes.jpg", alt: "A front disc brake being checked" },
    ],
    services: prices(1399, 749, 549, 399),
  },
  {
    id: "grg-sri-ganesh",
    slug: "sri-ganesh-auto-works-koramangala",
    name: "Sri Ganesh Auto Works, Koramangala",
    isKannaliBranch: false,
    address: "No. 21, 5th Cross, 6th Block",
    area: "Koramangala",
    city: "Bengaluru",
    pin: "560034",
    phone: "9900011331",
    rating: 4.3,
    reviewCount: 96,
    openingHours: { days: monToSat, opensAt: "08:30", closesAt: "19:30" },
    location: { lat: 12.9352, lng: 77.6245 },
    legalName: "Sri Ganesh Auto Works",
    gstin: "29BXRPS6612K1ZQ",
    vehicleTypes: ["bike", "scooter"],
    about: "A family-run two-wheeler workshop, a Kannali partner since 2024.",
    photos: [],
    services: prices(1099, 599, 449),
  },
  {
    id: "grg-speedline",
    slug: "speedline-car-care-bellandur",
    name: "Speedline Car Care, Bellandur",
    isKannaliBranch: false,
    address: "Survey No. 12, Outer Ring Road, near Ecospace",
    area: "Bellandur",
    city: "Bengaluru",
    pin: "560103",
    phone: "9900011332",
    rating: 4.7,
    reviewCount: 154,
    openingHours: { days: everyDay, opensAt: "09:00", closesAt: "19:00" },
    location: { lat: 12.9258, lng: 77.6762 },
    legalName: "Speedline Car Care LLP",
    gstin: "29ACKFS9031N1Z8",
    vehicleTypes: ["car"],
    about: "Cars only: periodic service, brakes and a full detailing bay.",
    photos: [],
    services: prices(2999, 1899, 1299, 699),
  },
  {
    id: "grg-hosur-road",
    slug: "hosur-road-commercial-service-electronic-city",
    name: "Hosur Road Commercial Service, Electronic City",
    isKannaliBranch: false,
    address: "Plot 4, Phase 1, Hosur Road",
    area: "Electronic City",
    city: "Bengaluru",
    pin: "560100",
    phone: "9900011333",
    rating: 4.2,
    reviewCount: 61,
    openingHours: { days: monToSat, opensAt: "08:00", closesAt: "20:00" },
    location: { lat: 12.8456, lng: 77.6603 },
    legalName: "Hosur Road Commercial Service",
    gstin: "29ADHPH2275C1Z1",
    vehicleTypes: ["commercial", "car"],
    about: "Pickups, small trucks and three-wheelers, with a bay big enough for loaded vehicles.",
    photos: [],
    services: prices(3499, 2499, 1799),
  },
];

const [garage] = garages;

const reviews: GarageReview[] = [
  {
    id: "grv-1",
    garageId: "grg-whitefield",
    authorName: "Karthik S.",
    rating: 5,
    comment:
      "Sent me the estimate on WhatsApp before replacing the pads. No surprises in the bill.",
    vehicleName: "KTM Duke 200",
    createdAt: "2026-10-02T18:20:00+05:30",
  },
  {
    id: "grv-2",
    garageId: "grg-whitefield",
    authorName: "Pooja N.",
    rating: 4,
    comment: "Good service, ready on time. Waiting area could be cooler.",
    vehicleName: "Honda Activa 6G",
    createdAt: "2026-09-21T12:05:00+05:30",
  },
  {
    id: "grv-3",
    garageId: "grg-whitefield",
    authorName: "Rahul P.",
    rating: 5,
    comment: "Fixed a brake noise two other places couldn't find.",
    vehicleName: "Maruti Suzuki Swift",
    createdAt: "2026-09-03T17:40:00+05:30",
  },
  {
    id: "grv-4",
    garageId: "grg-marathahalli",
    authorName: "Deepa V.",
    rating: 4,
    comment: "Oil change done in 40 minutes while I waited.",
    vehicleName: "TVS Jupiter",
    createdAt: "2026-10-05T10:15:00+05:30",
  },
  {
    id: "grv-5",
    garageId: "grg-marathahalli",
    authorName: "Arun K.",
    rating: 5,
    comment: "Honest advice: told me the chain still had life in it.",
    vehicleName: "Bajaj Pulsar 150",
    createdAt: "2026-09-18T16:30:00+05:30",
  },
  {
    id: "grv-6",
    garageId: "grg-indiranagar",
    authorName: "Sneha M.",
    rating: 5,
    comment: "Open on Sunday, which is the only day I can come.",
    vehicleName: "Royal Enfield Classic 350",
    createdAt: "2026-10-12T11:50:00+05:30",
  },
  {
    id: "grv-7",
    garageId: "grg-indiranagar",
    authorName: "Vikram R.",
    rating: 4,
    comment: "Slightly pricier, but the work is careful.",
    vehicleName: "Hyundai i20",
    createdAt: "2026-09-28T19:00:00+05:30",
  },
  {
    id: "grv-8",
    garageId: "grg-sri-ganesh",
    authorName: "Mohammed I.",
    rating: 4,
    comment: "Friendly mechanics and fair prices.",
    vehicleName: "Honda Shine 125",
    createdAt: "2026-10-01T09:30:00+05:30",
  },
  {
    id: "grv-9",
    garageId: "grg-speedline",
    authorName: "Ananya G.",
    rating: 5,
    comment: "Car came back cleaner than I've ever seen it.",
    vehicleName: "Tata Nexon",
    createdAt: "2026-10-09T15:10:00+05:30",
  },
  {
    id: "grv-10",
    garageId: "grg-hosur-road",
    authorName: "Suresh B.",
    rating: 4,
    comment: "They had the clutch plate in stock for my Ace. Back on the road the same day.",
    vehicleName: "Tata Ace Gold",
    createdAt: "2026-09-30T13:25:00+05:30",
  },
];

// Where each known PIN is, for distances. The backend will use real geocoding.
const pinCoordinates: Record<string, { lat: number; lng: number }> = {
  "560066": { lat: 12.9698, lng: 77.75 },
  "560037": { lat: 12.9569, lng: 77.7011 },
  "560103": { lat: 12.9258, lng: 77.6762 },
  "560048": { lat: 12.9887, lng: 77.6895 },
  "560038": { lat: 12.9719, lng: 77.6412 },
  "560034": { lat: 12.9352, lng: 77.6245 },
  "560102": { lat: 12.9116, lng: 77.6474 },
  "560076": { lat: 12.9166, lng: 77.6101 },
  "560041": { lat: 12.9308, lng: 77.5838 },
  "560100": { lat: 12.8456, lng: 77.6603 },
  "560024": { lat: 13.0358, lng: 77.597 },
  "560001": { lat: 12.9756, lng: 77.6066 },
  "562125": { lat: 12.86, lng: 77.786 },
};

/** Straight-line distance in km, to one decimal. */
function distanceKm(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)) * 10) / 10;
}

function withDistance(garage: Garage, pin: string | undefined): GarageOption {
  const from = pin ? pinCoordinates[pin] : undefined;
  return { ...garage, distanceKm: from ? distanceKm(from, garage.location) : null };
}

/** A believable spread of stars that matches the garage's average and count. */
function ratingDistribution({ rating, reviewCount }: Garage): GarageReviews["distribution"] {
  const shift = rating - 4.3;
  const weights = [
    0.03 - shift * 0.05,
    0.04 - shift * 0.1,
    0.1 - shift * 0.2,
    0.28,
    0.55 + shift * 0.35,
  ].map((w) => Math.max(w, 0.01));
  const total = weights.reduce((sum, w) => sum + w, 0);
  const counts = weights.map((w) => Math.round((w / total) * reviewCount));
  counts[4] += reviewCount - counts.reduce((sum, c) => sum + c, 0);
  return [counts[0], counts[1], counts[2], counts[3], counts[4]];
}

const serviceTypeDetails: Omit<ServiceType, "fromPriceInPaise">[] = [
  {
    id: "svc-general",
    name: "General service",
    description: "The full periodic service your vehicle needs every few thousand km.",
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
    duration: "45 minutes",
    includes: ["Engine oil of your choice", "Oil filter", "Oil level and leak check"],
  },
  {
    id: "svc-brakes",
    name: "Brake service",
    description: "Pads or shoes checked, cleaned and adjusted; replaced if worn.",
    duration: "1–2 hours",
    includes: ["Pad and disc check", "Brake fluid top-up", "Cable adjustment"],
  },
  {
    id: "svc-wash",
    name: "Water wash and polish",
    description: "Foam wash and a polish that lasts.",
    duration: "1 hour",
    includes: ["Foam wash", "Polish", "Interior wipe or chain lube"],
  },
];

// "From" prices are the lowest any garage charges.
const serviceTypes: ServiceType[] = serviceTypeDetails.map((type) => ({
  ...type,
  fromPriceInPaise: Math.min(
    ...garages
      .flatMap((g) => g.services.filter((s) => s.serviceTypeId === type.id))
      .map((s) => s.fromPriceInPaise),
  ),
}));

// Packages the admin sets per vehicle model, one price at every garage. Demo packages for the demo vehicles.
const servicePackages: ServicePackage[] = [
  {
    id: "pkg-duke-200-periodic",
    name: "Periodic service",
    description: "The 5,000 km service KTM recommends for the Duke 200.",
    priceInPaise: 2499_00,
    duration: "3–4 hours",
    includes: [
      "Motul 10W-50 engine oil",
      "Oil filter",
      "Air filter clean",
      "Chain clean and lube",
      "Brake check",
      "30-point check",
    ],
    modelIds: ["ktm-duke-200"],
    isRoutine: true,
  },
  {
    id: "pkg-duke-200-oil",
    name: "Oil and filter change",
    description: "Fresh fully synthetic oil and a genuine KTM oil filter.",
    priceInPaise: 1399_00,
    duration: "1 hour",
    includes: ["Motul 10W-50 engine oil", "KTM oil filter", "Leak check"],
    modelIds: ["ktm-duke-200"],
    isRoutine: false,
  },
  {
    id: "pkg-duke-200-brakes",
    name: "Brake care",
    description: "Front and rear brakes cleaned, checked and bled.",
    priceInPaise: 899_00,
    duration: "1–2 hours",
    includes: ["Pad check and clean", "Brake fluid top-up", "Disc check"],
    modelIds: ["ktm-duke-200"],
    isRoutine: false,
  },
  {
    id: "pkg-activa-6g-periodic",
    name: "Periodic service",
    description: "The 3,000 km service Honda recommends for the Activa 6G.",
    priceInPaise: 999_00,
    duration: "2–3 hours",
    includes: ["Engine oil", "Air filter clean", "Spark plug check", "Brake adjustment", "Wash"],
    modelIds: ["honda-activa-6g"],
    isRoutine: true,
  },
  {
    id: "pkg-activa-6g-oil",
    name: "Oil change",
    description: "Fresh engine oil, done while you wait.",
    priceInPaise: 549_00,
    duration: "45 minutes",
    includes: ["Honda engine oil", "Oil level and leak check"],
    modelIds: ["honda-activa-6g"],
    isRoutine: false,
  },
  {
    id: "pkg-swift-periodic",
    name: "Periodic service",
    description: "The 10,000 km service Maruti recommends for the Swift.",
    priceInPaise: 4999_00,
    duration: "5–6 hours",
    includes: [
      "Engine oil and oil filter",
      "Air filter",
      "AC filter clean",
      "Brake check",
      "Wheel alignment check",
      "Car wash",
    ],
    modelIds: ["maruti-swift"],
    isRoutine: true,
  },
  {
    id: "pkg-swift-ac",
    name: "AC care",
    description: "AC gas check and top-up, cooling coil and filter cleaned.",
    priceInPaise: 1999_00,
    duration: "2–3 hours",
    includes: ["AC gas check and top-up", "Cooling coil clean", "Cabin filter clean"],
    modelIds: ["maruti-swift"],
    isRoutine: false,
  },
];

/** Which garage accepts in the demo, and how far into its turn. */
const DEMO_ACCEPT_AFTER_MS = 2000;

type StoredRequest = {
  id: string;
  input: BookServiceInput;
  createdAt: number;
  /** In the order they are asked. */
  candidateIds: string[];
  /** Index of the garage that accepts in the demo, or -1 when none does. */
  acceptIndex: number;
  isCancelled: boolean;
  job: ServiceJob | null;
};

const requests: StoredRequest[] = [];

const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const BOOKING_DAYS_AHEAD = 14;

const garageRefOf = (garageId: string) => {
  const g = garages.find((x) => x.id === garageId) ?? garage;
  return { id: g.id, slug: g.slug, name: g.name, phone: g.phone };
};

function billFor(garageId: string, number: string, issuedAt: string, lines: ServiceBill["lines"]) {
  const g = garages.find((x) => x.id === garageId) ?? garage;
  const totalInPaise = lines.reduce((sum, line) => sum + line.amountInPaise, 0);
  return {
    number,
    issuedAt,
    garage: {
      legalName: g.legalName,
      address: `${g.address}, ${g.area}, ${g.city} ${g.pin}`,
      gstin: g.gstin,
    },
    lines,
    // Prices include 18% GST: the tax is 18/118 of the total, to the nearest rupee.
    gstInPaise: Math.round((totalInPaise * 18) / 118 / 100) * 100,
    totalInPaise,
  };
}

const line = (
  id: string,
  kind: EstimateLineKind,
  description: string,
  rupees: number,
  decision: EstimateLine["decision"] = "approved",
): EstimateLine => ({ id, kind, description, amountInPaise: rupees * 100, decision });

function toJobAddress({ label, name, mobile, line1, area, city, pin }: Address): JobAddress {
  return { label, name, mobile, line1, area, city, pin };
}

function isOpenOn(g: Garage, date: string): boolean {
  return g.openingHours.days.includes(weekdays[new Date(`${date}T12:00:00+05:30`).getUTCDay()]);
}

/** The job a garage takes on when it accepts a booking. */
function createJob(input: BookServiceInput, garageId: string, requestedAt: string): ServiceJob {
  const servicePackage = servicePackages.find((p) => p.id === input.packageId);
  let pickupDrop: PickupDrop | null = null;
  if (input.pickupDrop) {
    const { windowId, pickupAddressId, dropAddressId } = input.pickupDrop;
    const pickupAddress = addresses.find((a) => a.id === pickupAddressId) ?? addresses[0];
    const dropAddress = addresses.find((a) => a.id === dropAddressId) ?? pickupAddress;
    const [from, to] = windowId.split("-");
    pickupDrop = {
      window: { from, to },
      pickupAddress: toJobAddress(pickupAddress),
      dropAddress: toJobAddress(dropAddress),
      // The garage assigns someone before the pickup day.
      staff: null,
    };
  }
  const serial = Math.max(...jobs.map((j) => Number(j.id.slice(-4)))) + 1;
  return {
    id: `job-2026-${serial}`,
    jobCardNumber: `JC-2026-${serial}`,
    vehicleId: input.vehicleId,
    garage: garageRefOf(garageId),
    serviceType: servicePackage?.name ?? "Check-up and repair",
    stage: "booked",
    history: [
      { stage: "requested", at: requestedAt },
      { stage: "booked", at: new Date().toISOString() },
    ],
    scheduledOn: input.date,
    notes: input.notes,
    pickupDrop,
    closedReason: null,
    checkIn: null,
    estimates: [],
    expectedReadyAt: null,
    completion: null,
    bill: null,
    review: null,
  };
}

/**
 * Where a request stands, worked out from the time since it was sent: each garage gets its turn of
 * GARAGE_ACCEPT_SECONDS, and the demo's accepting garage says yes a little into its turn.
 */
function toServiceRequest(request: StoredRequest): ServiceRequest {
  const turnMs = GARAGE_ACCEPT_SECONDS * 1000;
  const elapsed = Date.now() - request.createdAt;
  const total = request.candidateIds.length;
  const refOf = (index: number) => {
    const { id, name } = garageRefOf(request.candidateIds[index]);
    return { id, name };
  };
  const base = { id: request.id, totalGarages: total, expiresAt: null, job: null };

  const acceptAt = request.acceptIndex * turnMs + DEMO_ACCEPT_AFTER_MS;
  if (request.job || (!request.isCancelled && request.acceptIndex >= 0 && elapsed >= acceptAt)) {
    if (!request.job) {
      const garageId = request.candidateIds[request.acceptIndex];
      request.job = createJob(request.input, garageId, new Date(request.createdAt).toISOString());
      jobs.push(request.job);
    }
    return {
      ...base,
      status: "accepted",
      attempt: request.acceptIndex + 1,
      garage: refOf(request.acceptIndex),
      job: request.job,
    };
  }
  const index = Math.floor(elapsed / turnMs);
  if (request.isCancelled)
    return { ...base, status: "cancelled", attempt: Math.min(index + 1, total), garage: null };
  if (index >= total) return { ...base, status: "no-garage", attempt: total, garage: null };
  return {
    ...base,
    status: "searching",
    attempt: index + 1,
    garage: refOf(index),
    expiresAt: new Date(request.createdAt + (index + 1) * turnMs).toISOString(),
  };
}

// Demo data lives in memory, so bookings, decisions and payments last until the server restarts.
const jobs: ServiceJob[] = [
  {
    id: "job-2026-1187",
    jobCardNumber: "JC-2026-1187",
    vehicleId: "vehicle-ktm-duke-200",
    garage: garageRefOf("grg-whitefield"),
    serviceType: "Brake service",
    stage: "awaiting-approval",
    history: [
      { stage: "requested", at: "2026-10-06T19:20:00+05:30" },
      { stage: "booked", at: "2026-10-06T19:42:00+05:30" },
      { stage: "inspected", at: "2026-10-08T11:40:00+05:30" },
      { stage: "awaiting-approval", at: "2026-10-08T12:05:00+05:30" },
    ],
    scheduledOn: "2026-10-08",
    notes: "Front brake squeals and the clutch feels hard.",
    pickupDrop: null,
    closedReason: null,
    checkIn: {
      at: "2026-10-08T10:15:00+05:30",
      odometerKm: 18420,
      fuelLevel: "About half",
      customerConcerns: "Front brake squeals and the clutch feels hard.",
      advisorName: "Ravi Kumar",
      findings: [
        {
          id: "f1",
          area: "Front brake pads",
          finding: "Worn to 2 mm; replace now.",
          severity: "urgent",
        },
        {
          id: "f2",
          area: "Clutch cable",
          finding: "Fraying near the lever.",
          severity: "attention",
        },
        {
          id: "f3",
          area: "Brake fluid",
          finding: "Below the mark; top up.",
          severity: "attention",
        },
        {
          id: "f4",
          area: "Tyres",
          finding: "Good tread, pressure set to 29/33 psi.",
          severity: "ok",
        },
        { id: "f5", area: "Chain", finding: "Slack within limit, cleaned.", severity: "ok" },
      ],
      photos: [
        { url: "/images/products/brakes-1.jpg", alt: "Front brake pads, worn to 2 mm" },
        { url: "/images/products/controls-1.jpg", alt: "Clutch cable fraying near the lever" },
      ],
    },
    estimates: [
      {
        id: "est-1187-a",
        kind: "booked-work",
        createdAt: "2026-10-08T10:30:00+05:30",
        decidedAt: "2026-10-08T10:31:00+05:30",
        note: "The brake service you booked.",
        lines: [line("e1", "labour", "Brake service: check, clean and adjust", 499)],
      },
      {
        id: "est-1187-b",
        kind: "extra-work",
        createdAt: "2026-10-08T12:05:00+05:30",
        decidedAt: null,
        note: "Front brake pads are down to 2 mm and the clutch cable is fraying near the lever. We recommend replacing both today.",
        lines: [
          line("e2", "labour", "Front brake pad replacement", 350, "pending"),
          line("e3", "parts", "KTM genuine front brake pad set", 1150, "pending"),
          line("e4", "labour", "Clutch cable replacement and adjustment", 200, "pending"),
          line("e5", "parts", "KTM genuine clutch cable", 389, "pending"),
          line("e6", "consumables", "Brake fluid DOT 4 (top-up)", 240, "pending"),
        ],
      },
    ],
    expectedReadyAt: "2026-10-09T18:00:00+05:30",
    completion: null,
    bill: null,
    review: null,
  },
  {
    id: "job-2026-1179",
    jobCardNumber: "JC-2026-1179",
    vehicleId: "vehicle-maruti-swift",
    garage: garageRefOf("grg-speedline"),
    serviceType: "General service",
    stage: "ready",
    history: [
      { stage: "requested", at: "2026-10-18T09:05:00+05:30" },
      { stage: "booked", at: "2026-10-18T09:30:00+05:30" },
      { stage: "picked-up", at: "2026-10-21T09:35:00+05:30" },
      { stage: "inspected", at: "2026-10-21T10:20:00+05:30" },
      { stage: "in-service", at: "2026-10-21T10:45:00+05:30" },
      { stage: "ready", at: "2026-10-21T16:10:00+05:30" },
    ],
    scheduledOn: "2026-10-21",
    notes: "",
    pickupDrop: {
      window: { from: "09:00", to: "12:00" },
      pickupAddress: toJobAddress(addresses[0]),
      dropAddress: toJobAddress(addresses[0]),
      staff: { name: "Manjunath S", phone: "9900112233" },
    },
    closedReason: null,
    checkIn: {
      at: "2026-10-21T10:05:00+05:30",
      odometerKm: 31260,
      fuelLevel: "Three quarters",
      customerConcerns: "Regular service. AC smells musty.",
      advisorName: "Imran Shaikh",
      findings: [
        { id: "f1", area: "Engine oil", finding: "Due for change.", severity: "attention" },
        {
          id: "f2",
          area: "Cabin filter",
          finding: "Clogged; causing the smell.",
          severity: "attention",
        },
        { id: "f3", area: "Brakes", finding: "Pads at 60%.", severity: "ok" },
      ],
      photos: [],
    },
    estimates: [
      {
        id: "est-1179-a",
        kind: "booked-work",
        createdAt: "2026-10-21T10:30:00+05:30",
        decidedAt: "2026-10-21T10:40:00+05:30",
        note: "The general service you booked, plus a cabin filter for the AC smell.",
        lines: [
          line("e1", "labour", "General service labour", 1200),
          line("e2", "parts", "Engine oil 5W-30 (3.5 L) and oil filter", 2580),
          line("e3", "parts", "Cabin air filter", 650),
          line("e4", "consumables", "Wash, coolant top-up and cleaning", 350),
        ],
      },
    ],
    expectedReadyAt: "2026-10-21T17:00:00+05:30",
    completion: {
      completedAt: "2026-10-21T16:10:00+05:30",
      odometerKm: 31268,
      workDone: [
        "Engine oil and oil filter changed",
        "Cabin air filter replaced (AC smell gone)",
        "Coolant topped up",
        "Exterior wash",
      ],
      partsUsed: [
        { name: "Engine oil 5W-30 (3.5 L)", quantity: 1, amountInPaise: 215000 },
        { name: "Oil filter", quantity: 1, amountInPaise: 43000 },
        { name: "Cabin air filter", quantity: 1, amountInPaise: 65000 },
      ],
      mechanicNotes: "Front pads at 60%; check again at the next service.",
      nextService: { dueOn: "2027-04-21", dueAtKm: 41000 },
    },
    bill: {
      ...billFor("grg-speedline", "SCC/2026-27/0418", "2026-10-21T16:15:00+05:30", [
        { description: "General service labour", kind: "labour", amountInPaise: 120000 },
        {
          description: "Engine oil 5W-30 (3.5 L) and oil filter",
          kind: "parts",
          amountInPaise: 258000,
        },
        { description: "Cabin air filter", kind: "parts", amountInPaise: 65000 },
        {
          description: "Wash, coolant top-up and cleaning",
          kind: "consumables",
          amountInPaise: 35000,
        },
      ]),
      payment: { status: "unpaid", method: null, paidAt: null, reference: null },
    },
    review: null,
  },
  {
    id: "job-2026-1190",
    jobCardNumber: "JC-2026-1190",
    vehicleId: "vehicle-honda-activa-6g",
    garage: garageRefOf("grg-marathahalli"),
    serviceType: "Water wash and polish",
    stage: "declined",
    history: [
      { stage: "requested", at: "2026-10-19T08:10:00+05:30" },
      { stage: "declined", at: "2026-10-19T09:00:00+05:30" },
    ],
    scheduledOn: "2026-10-20",
    notes: "",
    pickupDrop: null,
    closedReason: "We're fully booked for washes that day. Please choose another day.",
    checkIn: null,
    estimates: [],
    expectedReadyAt: null,
    completion: null,
    bill: null,
    review: null,
  },
  {
    id: "job-2026-1150",
    jobCardNumber: "JC-2026-1150",
    vehicleId: "vehicle-ktm-duke-200",
    garage: garageRefOf("grg-whitefield"),
    serviceType: "General service",
    stage: "delivered",
    history: [
      { stage: "booked", at: "2026-09-08T18:00:00+05:30" },
      { stage: "inspected", at: "2026-09-10T09:40:00+05:30" },
      { stage: "in-service", at: "2026-09-10T10:00:00+05:30" },
      { stage: "ready", at: "2026-09-10T14:30:00+05:30" },
      { stage: "delivered", at: "2026-09-10T17:05:00+05:30" },
    ],
    scheduledOn: "2026-09-10",
    notes: "",
    pickupDrop: null,
    closedReason: null,
    checkIn: null,
    estimates: [],
    expectedReadyAt: null,
    completion: {
      completedAt: "2026-09-10T14:30:00+05:30",
      odometerKm: 18000,
      workDone: [
        "Engine oil changed (Motul 7100 10W-50)",
        "Oil filter replaced",
        "Air filter cleaned",
        "Chain cleaned, lubricated and adjusted",
        "Brakes and lights checked",
      ],
      partsUsed: [
        { name: "Motul 7100 10W-50 (1.5 L)", quantity: 1, amountInPaise: 134900 },
        { name: "KTM oil filter", quantity: 1, amountInPaise: 28900 },
      ],
      mechanicNotes: "Front brake pads at 30%; plan to replace within 2,000 km.",
      nextService: { dueOn: "2026-12-10", dueAtKm: 21000 },
    },
    bill: {
      ...billFor("grg-whitefield", "KG/INV/2026/0912", "2026-09-10T14:35:00+05:30", [
        { description: "General service labour", kind: "labour", amountInPaise: 129900 },
        { description: "Motul 7100 10W-50 (1.5 L)", kind: "parts", amountInPaise: 134900 },
        { description: "KTM oil filter", kind: "parts", amountInPaise: 28900 },
        { description: "Chain lube and cleaning", kind: "consumables", amountInPaise: 24300 },
      ]),
      payment: {
        status: "paid",
        method: "online",
        paidAt: "2026-09-10T17:00:00+05:30",
        reference: "pay_P8nX2kq91Rz",
      },
    },
    review: null,
  },
  {
    id: "job-2026-1121",
    jobCardNumber: "JC-2026-1121",
    vehicleId: "vehicle-honda-activa-6g",
    garage: garageRefOf("grg-sri-ganesh"),
    serviceType: "General service",
    stage: "delivered",
    history: [
      { stage: "booked", at: "2026-07-31T20:10:00+05:30" },
      { stage: "in-service", at: "2026-08-02T09:30:00+05:30" },
      { stage: "ready", at: "2026-08-02T13:00:00+05:30" },
      { stage: "delivered", at: "2026-08-02T18:20:00+05:30" },
    ],
    scheduledOn: "2026-08-02",
    notes: "",
    pickupDrop: null,
    closedReason: null,
    checkIn: null,
    estimates: [],
    expectedReadyAt: null,
    completion: {
      completedAt: "2026-08-02T13:00:00+05:30",
      odometerKm: 21800,
      workDone: [
        "Engine oil changed",
        "Air filter replaced",
        "Brake shoes adjusted",
        "Battery checked",
      ],
      partsUsed: [
        { name: "Castrol Activ 4T 10W-30 (0.8 L)", quantity: 1, amountInPaise: 39900 },
        { name: "Air filter", quantity: 1, amountInPaise: 27900 },
      ],
      mechanicNotes: "",
      nextService: { dueOn: "2026-11-02", dueAtKm: 24800 },
    },
    bill: {
      ...billFor("grg-sri-ganesh", "SGA/26/1147", "2026-08-02T13:05:00+05:30", [
        { description: "General service labour", kind: "labour", amountInPaise: 61200 },
        { description: "Castrol Activ 4T 10W-30 (0.8 L)", kind: "parts", amountInPaise: 39900 },
        { description: "Air filter", kind: "parts", amountInPaise: 27900 },
      ]),
      payment: {
        status: "paid",
        method: "at-garage",
        paidAt: "2026-08-02T18:15:00+05:30",
        reference: null,
      },
    },
    review: {
      rating: 4,
      comment: "Friendly mechanics and fair prices.",
      at: "2026-08-03T09:30:00+05:30",
    },
  },
  {
    id: "job-2026-1058",
    jobCardNumber: "JC-2026-1058",
    vehicleId: "vehicle-ktm-duke-200",
    garage: garageRefOf("grg-whitefield"),
    serviceType: "General service",
    stage: "delivered",
    history: [
      { stage: "booked", at: "2026-03-12T11:00:00+05:30" },
      { stage: "in-service", at: "2026-03-14T10:00:00+05:30" },
      { stage: "ready", at: "2026-03-14T15:00:00+05:30" },
      { stage: "delivered", at: "2026-03-14T18:00:00+05:30" },
    ],
    scheduledOn: "2026-03-14",
    notes: "",
    pickupDrop: null,
    closedReason: null,
    checkIn: null,
    estimates: [],
    expectedReadyAt: null,
    completion: {
      completedAt: "2026-03-14T15:00:00+05:30",
      odometerKm: 14950,
      workDone: [
        "Engine oil changed",
        "Oil filter replaced",
        "Spark plug replaced",
        "Chain lubricated",
      ],
      partsUsed: [{ name: "Spark plug", quantity: 1, amountInPaise: 45000 }],
      mechanicNotes: "",
      nextService: { dueOn: "2026-09-14", dueAtKm: 18000 },
    },
    bill: {
      ...billFor("grg-whitefield", "KG/INV/2026/0318", "2026-03-14T15:05:00+05:30", [
        { description: "General service labour", kind: "labour", amountInPaise: 129900 },
        { description: "Engine oil and filter", kind: "parts", amountInPaise: 89100 },
        { description: "Spark plug", kind: "parts", amountInPaise: 45000 },
      ]),
      payment: {
        status: "paid",
        method: "online",
        paidAt: "2026-03-14T17:50:00+05:30",
        reference: "pay_N2kd81LmQa",
      },
    },
    review: { rating: 5, comment: "Quick and tidy work.", at: "2026-03-15T10:00:00+05:30" },
  },
];

/** A delivered job as a line in the vehicle's history. */
function toRecord(job: ServiceJob): ServiceRecord | null {
  if (job.stage !== "delivered" || !job.completion || !job.bill) return null;
  const { id, slug, name } = job.garage;
  return {
    id: job.id,
    vehicleId: job.vehicleId,
    garage: { id, slug, name },
    serviceType: job.serviceType,
    completedOn: job.completion.completedAt.slice(0, 10),
    odometerKm: job.completion.odometerKm,
    workDone: job.completion.workDone,
    billNumber: job.bill.number,
    billTotalInPaise: job.bill.totalInPaise,
    isRated: job.review !== null,
  };
}

const openStages: ServiceStage[] = [
  "requested",
  "booked",
  "picked-up",
  "inspected",
  "awaiting-approval",
  "in-service",
  "ready",
  "out-for-drop",
];

const nextServices: NextServiceDue[] = [
  { vehicleId: "vehicle-ktm-duke-200", dueOn: "2026-12-10", dueAtKm: 21000, status: "ok" },
  { vehicleId: "vehicle-honda-activa-6g", dueOn: "2026-11-02", dueAtKm: 24800, status: "due-soon" },
  { vehicleId: "vehicle-maruti-swift", dueOn: "2027-03-18", dueAtKm: 40000, status: "ok" },
];

export const mockService = {
  async getMyGarage(): Promise<Garage> {
    return garage;
  },

  async getServiceTypes(): Promise<ServiceType[]> {
    return serviceTypes;
  },

  async getGarages({
    ids,
    pin,
    serviceTypeId,
    vehicleType,
    minRating,
    openOnSunday,
    openOn,
    sort = "distance",
  }: GarageQuery = {}): Promise<GarageOption[]> {
    const matching = garages
      .filter(
        (g) =>
          (!ids || ids.includes(g.id)) &&
          (!serviceTypeId || g.services.some((s) => s.serviceTypeId === serviceTypeId)) &&
          (!vehicleType || g.vehicleTypes.includes(vehicleType)) &&
          (minRating === undefined || g.rating >= minRating) &&
          (!openOnSunday || g.openingHours.days.includes("sun")) &&
          (!openOn || isOpenOn(g, openOn)),
      )
      .map((g) => withDistance(g, pin));
    // Without a known PIN there are no distances, so the best rated come first.
    const byDistance = (a: GarageOption, b: GarageOption) =>
      (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
    const byRating = (a: GarageOption, b: GarageOption) => b.rating - a.rating;
    return matching.sort(sort === "rating" || !pin ? byRating : byDistance);
  },

  async getGarage(slug: string, pin?: string): Promise<GarageOption | null> {
    const found = garages.find((g) => g.slug === slug || g.id === slug);
    return found ? withDistance(found, pin) : null;
  },

  async getGarageReviews(garageId: string): Promise<GarageReviews | null> {
    const found = garages.find((g) => g.id === garageId);
    if (!found) return null;
    return {
      distribution: ratingDistribution(found),
      latest: reviews
        .filter((r) => r.garageId === garageId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  // The next two weeks, from tomorrow, on the days the garage (or, without one, any garage) is open.
  async getBookableDates(garageId: string | null): Promise<string[]> {
    const open = garageId ? garages.filter((g) => g.id === garageId) : garages;
    const dates: string[] = [];
    for (let offset = 1; offset <= BOOKING_DAYS_AHEAD; offset += 1) {
      const date = toIndianIsoDate(new Date(Date.now() + offset * 24 * 60 * 60 * 1000));
      if (open.some((g) => isOpenOn(g, date))) dates.push(date);
    }
    return dates;
  },

  async getServicePackages(modelId: string): Promise<ServicePackage[]> {
    return servicePackages.filter((p) => p.modelIds.includes(modelId));
  },

  async requestService(input: BookServiceInput): Promise<ServiceRequest | null> {
    const vehicle = await mockVehicles.getMyVehicle(input.vehicleId);
    if (!vehicle) return null;
    const pickupPin = addresses.find((a) => a.id === input.pickupDrop?.pickupAddressId)?.pin;
    // Garages that can take it: work on this vehicle, open that day, and (with pick and drop) at that time.
    const able = (
      await mockService.getGarages({ vehicleType: vehicle.type, pin: pickupPin, sort: "rating" })
    )
      .filter((g) => isOpenOn(g, input.date))
      .filter(
        (g) =>
          !input.pickupDrop ||
          getPickupWindows(g).map(getPickupWindowId).includes(input.pickupDrop.windowId),
      );
    // "Best" is rating first, then distance; a chosen garage is asked first, then the best of the rest.
    const best = able.sort(
      (a, b) => b.rating - a.rating || (a.distanceKm ?? 0) - (b.distanceKm ?? 0),
    );
    const chosenId = input.garage.mode === "chosen" ? input.garage.garageId : null;
    const candidateIds = [
      ...(chosenId ? [chosenId] : []),
      ...best.map((g) => g.id).filter((id) => id !== chosenId),
    ].slice(0, 3);
    const request: StoredRequest = {
      id: `req-${Date.now()}`,
      input,
      createdAt: Date.now(),
      candidateIds,
      // Demo: a chosen garage accepts; with "best", the first garage lets it pass and the second accepts.
      acceptIndex: Math.min(chosenId ? 0 : 1, candidateIds.length - 1),
      isCancelled: false,
      job: null,
    };
    requests.push(request);
    return toServiceRequest(request);
  },

  async getServiceRequest(requestId: string): Promise<ServiceRequest | null> {
    const request = requests.find((r) => r.id === requestId);
    return request ? toServiceRequest(request) : null;
  },

  async cancelServiceRequest(requestId: string): Promise<ServiceRequest | null> {
    const request = requests.find((r) => r.id === requestId);
    if (!request || request.job) return null;
    request.isCancelled = true;
    return toServiceRequest(request);
  },

  async getServiceJob(jobId: string): Promise<ServiceJob | null> {
    return jobs.find((job) => job.id === jobId) ?? null;
  },

  /** The latest booking or service still open for this vehicle. */
  async getActiveServiceJob(vehicleId: string): Promise<ServiceJob | null> {
    return (
      jobs
        .filter((job) => job.vehicleId === vehicleId && openStages.includes(job.stage))
        .sort((a, b) => b.history[0].at.localeCompare(a.history[0].at))[0] ?? null
    );
  },

  /** Everything not finished: open bookings and services, and declined or cancelled ones. */
  async getServiceJobs(): Promise<ServiceJob[]> {
    return jobs
      .filter((job) => job.stage !== "delivered")
      .sort((a, b) => b.history[0].at.localeCompare(a.history[0].at));
  },

  async getServiceHistory(vehicleId?: string): Promise<ServiceRecord[]> {
    return jobs
      .filter((job) => !vehicleId || job.vehicleId === vehicleId)
      .flatMap((job) => toRecord(job) ?? [])
      .sort((a, b) => b.completedOn.localeCompare(a.completedOn));
  },

  async getNextServiceDue(vehicleId: string): Promise<NextServiceDue | null> {
    return nextServices.find((due) => due.vehicleId === vehicleId) ?? null;
  },

  async cancelBooking(jobId: string, reason: string): Promise<ServiceJob | null> {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return null;
    job.stage = "cancelled";
    job.closedReason = reason;
    job.history.push({ stage: "cancelled", at: new Date().toISOString() });
    return job;
  },

  // The garage carries on with what was approved; declined items aren't done.
  async decideEstimate(
    jobId: string,
    estimateId: string,
    approvedLineIds: string[],
  ): Promise<ServiceJob | null> {
    const job = jobs.find((j) => j.id === jobId);
    const estimate = job?.estimates.find((e) => e.id === estimateId);
    if (!job || !estimate || estimate.decidedAt) return null;
    const at = new Date().toISOString();
    estimate.lines.forEach(
      (l) => (l.decision = approvedLineIds.includes(l.id) ? "approved" : "declined"),
    );
    estimate.decidedAt = at;
    if (job.stage === "awaiting-approval") {
      job.stage = "in-service";
      job.history.push({ stage: "in-service", at });
    }
    return job;
  },

  async choosePayAtGarage(jobId: string): Promise<ServiceJob | null> {
    const job = jobs.find((j) => j.id === jobId);
    if (!job?.bill || job.bill.payment.status === "paid") return null;
    job.bill.payment.method = "at-garage";
    return job;
  },

  async startServicePayment(jobId: string): Promise<PaymentSession | null> {
    const job = jobs.find((j) => j.id === jobId);
    const session = await getSession();
    if (!job?.bill || job.bill.payment.status === "paid" || !session) return null;
    return {
      payableId: jobId,
      description: `${job.garage.name} · Bill ${job.bill.number}`,
      amountInPaise: job.bill.totalInPaise,
      gatewayOrderId: `order_demo_${jobId}_${Date.now()}`,
      keyId: "rzp_test_demo",
      customer: { name: session.user.name, mobile: session.user.mobile, email: session.user.email },
    };
  },

  async confirmServicePayment(jobId: string, proof: PaymentProof): Promise<ServiceJob | null> {
    const job = jobs.find((j) => j.id === jobId);
    if (!job?.bill) return null;
    job.bill.payment = {
      status: "paid",
      method: "online",
      paidAt: new Date().toISOString(),
      reference: proof.gatewayPaymentId,
    };
    return job;
  },

  async rateServiceVisit(
    jobId: string,
    review: { rating: number; comment: string },
  ): Promise<ServiceJob | null> {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.stage !== "delivered" || job.review) return null;
    const [session, vehicle] = await Promise.all([
      getSession(),
      mockVehicles.getMyVehicle(job.vehicleId),
    ]);
    const at = new Date().toISOString();
    job.review = { ...review, at };
    reviews.push({
      id: `grv-${reviews.length + 1}`,
      garageId: job.garage.id,
      authorName: session?.user.name ?? "Customer",
      rating: review.rating,
      comment: review.comment,
      vehicleName: vehicle ? getVehicleName(vehicle) : "",
      createdAt: at,
    });
    return job;
  },
};
