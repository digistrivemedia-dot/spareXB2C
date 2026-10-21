"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import {
  bookService,
  cancelBooking,
  choosePayAtGarage,
  confirmServicePayment,
  decideEstimate,
  getBookableDates,
  getGarage,
  getGarages,
  getServiceJob,
  rateServiceVisit,
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
  ServiceJob,
} from "@/features/service/types";
import { canCancelBooking, cancelBookingReasons, getGaragePrice } from "@/features/service/utils";
import { getMyVehicle } from "@/features/vehicles/api";
import type { ActionResult } from "@/lib/types";

const SIGNED_OUT = { ok: false, message: "Please log in again to continue." } as const;

// The booking wizard runs in the browser, so it loads garages and days through the server.
export async function listGaragesAction(query: GarageQuery): Promise<GarageOption[]> {
  return getGarages(query);
}

export async function listBookableDatesAction(garageId: string): Promise<string[]> {
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

export async function bookServiceAction(
  input: BookServiceInput,
): Promise<{ ok: true; job: ServiceJob } | { ok: false; message: string }> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to book." };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { vehicleId, serviceTypeId, garageId, date } = parsed.data;
  const [vehicle, garage, openDates] = await Promise.all([
    getMyVehicle(vehicleId),
    getGarage(garageId),
    getBookableDates(garageId),
  ]);
  if (!vehicle || !garage)
    return { ok: false, message: "Please choose the vehicle and garage again." };
  if (
    getGaragePrice(garage, serviceTypeId) === null ||
    !garage.vehicleTypes.includes(vehicle.type)
  ) {
    return { ok: false, message: "This garage doesn't do that service for your vehicle." };
  }
  if (!openDates.includes(date)) {
    return {
      ok: false,
      message: "The garage isn't taking bookings that day. Please pick another.",
    };
  }

  const job = await bookService(parsed.data);
  return job
    ? { ok: true, job }
    : { ok: false, message: "We couldn't book this. Please try again." };
}
