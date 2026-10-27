"use server";

import { refresh } from "next/cache";

import { getAddress } from "@/features/account/api";
import { getSession } from "@/features/auth/session";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import {
  cancelBooking,
  cancelServiceRequest,
  choosePayAtGarage,
  confirmServicePayment,
  decideEstimate,
  getBookableDates,
  getGarage,
  getGarages,
  getServiceJob,
  getServicePackages,
  getServiceRequest,
  rateServiceVisit,
  requestService,
  startServicePayment,
} from "@/features/service/api";
import {
  bookingSchema,
  visitReviewSchema,
  type VisitReviewValues,
} from "@/features/service/schema";
import type {
  BookServiceInput,
  GarageOption,
  GarageQuery,
  ServiceRequest,
} from "@/features/service/types";
import {
  canCancelBooking,
  cancelBookingReasons,
  getPickupWindowId,
  getPickupWindows,
} from "@/features/service/utils";
import { getMyVehicle } from "@/features/vehicles/api";
import type { ActionResult } from "@/lib/types";

const SIGNED_OUT = { ok: false, message: "Please log in again to continue." } as const;

// The booking wizard runs in the browser, so it loads garages and days through the server.
export async function listGaragesAction(query: GarageQuery): Promise<GarageOption[]> {
  return getGarages(query);
}

export async function listBookableDatesAction(garageId: string | null): Promise<string[]> {
  return getBookableDates(garageId);
}

export async function decideEstimateAction(
  jobId: string,
  estimateId: string,
  approvedLineIds: string[],
): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const job = await decideEstimate(jobId, estimateId, approvedLineIds);
  if (!job) {
    return { ok: false, message: "This estimate is no longer open. Please refresh the page." };
  }
  refresh();
  return { ok: true };
}

export async function cancelBookingAction(jobId: string, reason: string): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;
  if (!cancelBookingReasons.includes(reason)) return { ok: false, message: "Choose a reason." };
  const job = await getServiceJob(jobId);
  if (!job || !canCancelBooking(job)) {
    return { ok: false, message: "The work has started, so please call the garage to change it." };
  }
  await cancelBooking(jobId, reason);
  refresh();
  return { ok: true };
}

export async function payAtGarageAction(jobId: string): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const job = await choosePayAtGarage(jobId);
  if (!job) return { ok: false, message: "This bill is already paid." };
  refresh();
  return { ok: true };
}

export async function startServicePaymentAction(
  jobId: string,
): Promise<{ ok: true; session: PaymentSession } | { ok: false; message: string }> {
  if (!(await getSession())) return SIGNED_OUT;
  const session = await startServicePayment(jobId);
  return session
    ? { ok: true, session }
    : { ok: false, message: "This bill is already paid, or isn't ready yet." };
}

export async function confirmServicePaymentAction(
  jobId: string,
  proof: PaymentProof,
): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const job = await confirmServicePayment(jobId, proof);
  if (!job)
    return { ok: false, message: "We couldn't confirm your payment. If money was taken, call us." };
  refresh();
  return { ok: true };
}

export async function rateServiceVisitAction(
  jobId: string,
  values: VisitReviewValues,
): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const parsed = visitReviewSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const job = await rateServiceVisit(jobId, parsed.data);
  if (!job) return { ok: false, message: "You've already rated this visit." };
  refresh();
  return { ok: true };
}

type RequestResult = { ok: true; request: ServiceRequest } | { ok: false; message: string };

/** Checks the booking, then sends it out to garages. The wizard then follows it with `getServiceRequestAction`. */
export async function requestServiceAction(input: BookServiceInput): Promise<RequestResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to book." };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { vehicleId, packageId, date } = parsed.data;
  const garageId = parsed.data.garage.mode === "chosen" ? parsed.data.garage.garageId : null;
  const [vehicle, garage, openDates] = await Promise.all([
    getMyVehicle(vehicleId),
    garageId ? getGarage(garageId) : null,
    getBookableDates(garageId),
  ]);
  if (!vehicle) return { ok: false, message: "Please choose the vehicle again." };
  if (packageId) {
    const packages = await getServicePackages(vehicle.modelId);
    if (!packages.some((p) => p.id === packageId)) {
      return { ok: false, message: "That package isn't available for your vehicle." };
    }
  }
  if (garageId && (!garage || !garage.vehicleTypes.includes(vehicle.type))) {
    return { ok: false, message: "This garage doesn't work on your vehicle. Please pick another." };
  }
  if (!openDates.includes(date)) {
    return { ok: false, message: "That day isn't open for booking. Please pick another." };
  }

  if (parsed.data.pickupDrop) {
    const { windowId, pickupAddressId, dropAddressId } = parsed.data.pickupDrop;
    if (!getPickupWindows(garage).map(getPickupWindowId).includes(windowId)) {
      return { ok: false, message: "Please choose one of the pickup times." };
    }
    const [pickupAddress, dropAddress] = await Promise.all([
      getAddress(pickupAddressId),
      getAddress(dropAddressId),
    ]);
    if (!pickupAddress || !dropAddress) {
      return { ok: false, message: "Please choose the pickup and drop addresses again." };
    }
  }

  const request = await requestService(parsed.data);
  return request
    ? { ok: true, request }
    : { ok: false, message: "We couldn't send this booking. Please try again." };
}

export async function getServiceRequestAction(requestId: string): Promise<RequestResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const request = await getServiceRequest(requestId);
  if (!request) return { ok: false, message: "We lost track of this booking. Please try again." };
  // A garage accepted: the new booking shows on the account pages.
  if (request.status === "accepted") refresh();
  return { ok: true, request };
}

export async function cancelServiceRequestAction(requestId: string): Promise<RequestResult> {
  if (!(await getSession())) return SIGNED_OUT;
  const request = await cancelServiceRequest(requestId);
  return request
    ? { ok: true, request }
    : { ok: false, message: "A garage has already accepted it. You can cancel it in My services." };
}
