"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import { bookService, decideEstimate, rateServiceVisit } from "@/features/service/api";
import {
  bookingSchema,
  visitReviewSchema,
  type VisitReviewValues,
} from "@/features/service/schema";
import type { BookServiceInput, ServiceJob } from "@/features/service/types";
import type { ActionResult } from "@/lib/types";

const SIGNED_OUT: ActionResult = { ok: false, message: "Please log in again to continue." };

export async function decideEstimateAction(
  jobId: string,
  decision: "approved" | "declined",
): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;

  const job = await decideEstimate(jobId, decision);
  if (!job)
    return { ok: false, message: "This estimate is no longer open. Please refresh the page." };

  refresh();
  return { ok: true };
}

export async function rateServiceVisitAction(
  recordId: string,
  values: VisitReviewValues,
): Promise<ActionResult> {
  if (!(await getSession())) return SIGNED_OUT;

  const parsed = visitReviewSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const saved = await rateServiceVisit(recordId, parsed.data);
  return saved
    ? { ok: true }
    : { ok: false, message: "We couldn't save your rating. Please try again." };
}

export async function bookServiceAction(
  input: BookServiceInput,
): Promise<{ ok: true; job: ServiceJob } | { ok: false; message: string }> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to book." };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const job = await bookService(parsed.data);
  return job
    ? { ok: true, job }
    : { ok: false, message: "That slot isn't available any more. Please pick another." };
}
