import { cookies } from "next/headers";
import { cache } from "react";

import type { Session } from "@/features/auth/types";
import { ApiError, apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockAuth } from "@/mocks/auth";

const SESSION_COOKIE = "kg_session";
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

/**
 * The signed-in customer, or null for a guest. This file is the only place that knows how sessions
 * work: real auth changes it and nothing else. Cached per request, so every caller shares one lookup.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  if (dataSource.auth === "mock") return mockAuth.getSession(token);

  try {
    return await apiClient.get<Session>("/auth/session", undefined, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/** Signs the customer in on this device. Call only from a server action. */
export async function startSession(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });
}

/** Signs the customer out on this device. Call only from a server action. */
export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
