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
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockService } from "@/mocks/service";

const useMock = dataSource.service === "mock";

export function getMyGarage(): Promise<Garage> {
  return useMock ? mockService.getMyGarage() : apiClient.get("/me/garage");
}

/** The service currently in progress for this bike, or null when there is none. */
export function getActiveServiceJob(bikeId: string): Promise<ServiceJob | null> {
  return useMock
    ? mockService.getActiveServiceJob(bikeId)
    : orNull(apiClient.get(`/me/bikes/${bikeId}/service-job`));
}

export function getServiceHistory(bikeId: string): Promise<ServiceRecord[]> {
  return useMock
    ? mockService.getServiceHistory(bikeId)
    : apiClient.get(`/me/bikes/${bikeId}/service-history`);
}

export function getBikeReminders(bikeId: string): Promise<BikeReminders | null> {
  return useMock
    ? mockService.getBikeReminders(bikeId)
    : orNull(apiClient.get(`/me/bikes/${bikeId}/reminders`));
}

/** The customer's answer to an estimate for extra work. */
export function decideEstimate(
  jobId: string,
  decision: "approved" | "declined",
): Promise<ServiceJob | null> {
  return useMock
    ? mockService.decideEstimate(jobId, decision)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/estimate/decision`, { decision }));
}

export async function rateServiceVisit(
  recordId: string,
  review: { rating: number; comment: string },
): Promise<boolean> {
  if (useMock) return mockService.rateServiceVisit(recordId);
  return (await orNull(apiClient.post(`/me/service-records/${recordId}/review`, review))) !== null;
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return useMock ? mockService.getServiceTypes() : apiClient.get("/service-types");
}

/** Garages nearest first, with distances from this PIN. */
export function getGarages(pin: string | null): Promise<GarageOption[]> {
  return useMock ? mockService.getGarages() : apiClient.get("/garages", { pin });
}

export function getServiceSlots(garageId: string): Promise<ServiceDay[]> {
  return useMock
    ? mockService.getServiceSlots(garageId)
    : apiClient.get(`/garages/${garageId}/slots`);
}

export function bookService(input: BookServiceInput): Promise<ServiceJob | null> {
  return useMock
    ? mockService.bookService(input)
    : orNull(apiClient.post("/me/service-bookings", input));
}
