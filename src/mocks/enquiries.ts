import type { Enquiry, EnquiryInput } from "@/features/enquiries/types";
import { getVehicleName } from "@/features/vehicles/utils";
import { mockVehicles } from "@/mocks/vehicles";

const enquiries: Enquiry[] = [
  {
    id: "enq-1023",
    number: "ENQ-1023",
    reason: "vehicle-not-listed",
    vehicle: { id: null, name: "Yamaha RX 100 (1994)" },
    partNeeded: "Carburettor repair kit",
    message: "Restoring my father's RX 100. The idle is rough and the float bowl leaks.",
    photos: [],
    status: "open",
    reply: null,
    createdAt: "2026-10-18T20:05:00+05:30",
  },
  {
    id: "enq-1017",
    number: "ENQ-1017",
    reason: "part-not-found",
    vehicle: { id: "vehicle-maruti-swift", name: "Maruti Suzuki Swift" },
    partNeeded: "Cabin air filter",
    message: "The AC smells musty. Is there a cabin filter for the 2022 VXi?",
    photos: [],
    status: "answered",
    reply: {
      text: "Yes. The Bosch cabin filter for your Swift is being added to SpareX this week. We'll add a link here as soon as it's in stock. Until then, Kannali Garage Whitefield has it at the counter.",
      at: "2026-10-09T11:40:00+05:30",
    },
    createdAt: "2026-10-08T17:20:00+05:30",
  },
];

// Demo data lives in memory, so new enquiries last until the server restarts.
export const mockEnquiries = {
  async getEnquiries(): Promise<Enquiry[]> {
    return [...enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async sendEnquiry(input: EnquiryInput): Promise<Enquiry> {
    const vehicle = input.vehicleId ? await mockVehicles.getMyVehicle(input.vehicleId) : null;
    const serial = 1024 + enquiries.length - 2;
    const enquiry: Enquiry = {
      id: `enq-${serial}`,
      number: `ENQ-${serial}`,
      reason: input.reason,
      vehicle: vehicle
        ? { id: vehicle.id, name: getVehicleName(vehicle) }
        : { id: null, name: input.vehicleDescription ?? "Not given" },
      partNeeded: input.partNeeded,
      message: input.message,
      photos: input.photos,
      status: "open",
      reply: null,
      createdAt: new Date().toISOString(),
    };
    enquiries.push(enquiry);
    return enquiry;
  },
};
