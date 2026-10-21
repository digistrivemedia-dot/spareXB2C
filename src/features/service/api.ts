import type {
  BookServiceInput,
  Garage,
  GarageOption,
  GarageQuery,
  GarageReviews,
  NextServiceDue,
  ServiceJob,
  ServiceRecord,
  ServiceType,
} from "@/features/service/types";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockService } from "@/mocks/service";

const useMock = dataSource.service === "mock";

export function getMyGarage(): Promise<Garage> {
  return useMock ? mockService.getMyGarage() : apiClient.get("/me/garage");
}

/** The service currently in progress for this vehicle, or null when there is none. */
export function getActiveServiceJob(vehicleId: string): Promise<ServiceJob | null> {
  return useMock
    ? mockService.getActiveServiceJob(vehicleId)
    : orNull(apiClient.get(`/me/vehicles/${vehicleId}/service-job`));
}

/** Finished services, newest first: for one vehicle, or all of the customer's vehicles. */
export function getServiceHistory(vehicleId?: string): Promise<ServiceRecord[]> {
  return useMock
    ? mockService.getServiceHistory(vehicleId)
    : apiClient.get("/me/service-history", { vehicleId });
}

/** Bookings not finished yet (open, declined or cancelled), newest first. */
export function getServiceJobs(): Promise<ServiceJob[]> {
  return useMock ? mockService.getServiceJobs() : apiClient.get("/me/service-jobs");
}

export function getNextServiceDue(vehicleId: string): Promise<NextServiceDue | null> {
  return useMock
    ? mockService.getNextServiceDue(vehicleId)
    : orNull(apiClient.get(`/me/vehicles/${vehicleId}/next-service`));
}

/** The customer's answer to an estimate: the lines they approve. The rest are declined. */
export function decideEstimate(
  jobId: string,
  estimateId: string,
  approvedLineIds: string[],
): Promise<ServiceJob | null> {
  return useMock
    ? mockService.decideEstimate(jobId, estimateId, approvedLineIds)
    : orNull(
        apiClient.post(`/me/service-jobs/${jobId}/estimates/${estimateId}/decision`, {
          approvedLineIds,
        }),
      );
}

export function getServiceJob(jobId: string): Promise<ServiceJob | null> {
  return useMock
    ? mockService.getServiceJob(jobId)
    : orNull(apiClient.get(`/me/service-jobs/${jobId}`));
}

export function cancelBooking(jobId: string, reason: string): Promise<ServiceJob | null> {
  return useMock
    ? mockService.cancelBooking(jobId, reason)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/cancel`, { reason }));
}

/** The customer will pay at the garage's counter; the garage marks it paid. */
export function choosePayAtGarage(jobId: string): Promise<ServiceJob | null> {
  return useMock
    ? mockService.choosePayAtGarage(jobId)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/pay-at-garage`));
}

/** Starts an online payment for the job's bill. */
export function startServicePayment(jobId: string): Promise<PaymentSession | null> {
  return useMock
    ? mockService.startServicePayment(jobId)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/payment`));
}

export function confirmServicePayment(
  jobId: string,
  proof: PaymentProof,
): Promise<ServiceJob | null> {
  return useMock
    ? mockService.confirmServicePayment(jobId, proof)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/payment/verify`, proof));
}

/** The customer's rating of the garage, once the vehicle is delivered. */
export function rateServiceVisit(
  jobId: string,
  review: { rating: number; comment: string },
): Promise<ServiceJob | null> {
  return useMock
    ? mockService.rateServiceVisit(jobId, review)
    : orNull(apiClient.post(`/me/service-jobs/${jobId}/review`, review));
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return useMock ? mockService.getServiceTypes() : apiClient.get("/service-types");
}

/** Approved garages, filtered and sorted on the server: nearest first when there's a PIN. */
export function getGarages(query: GarageQuery = {}): Promise<GarageOption[]> {
  return useMock ? mockService.getGarages(query) : apiClient.get("/garages", query);
}

/** One garage by its slug, with its distance from the PIN when given. */
export function getGarage(slug: string, pin?: string): Promise<GarageOption | null> {
  return useMock
    ? mockService.getGarage(slug, pin)
    : orNull(apiClient.get(`/garages/${slug}`, { pin }));
}

export function getGarageReviews(garageId: string): Promise<GarageReviews | null> {
  return useMock
    ? mockService.getGarageReviews(garageId)
    : orNull(apiClient.get(`/garages/${garageId}/reviews`));
}

/** Days ("YYYY-MM-DD") the garage takes bookings: open days in the next two weeks. */
export function getBookableDates(garageId: string): Promise<string[]> {
  return useMock
    ? mockService.getBookableDates(garageId)
    : apiClient.get(`/garages/${garageId}/bookable-dates`);
}

export function bookService(input: BookServiceInput): Promise<ServiceJob | null> {
  return useMock
    ? mockService.bookService(input)
    : orNull(apiClient.post("/me/service-bookings", input));
}
