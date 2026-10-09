import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/session";

/** Renders its children only for a signed-in customer; guests go to the login page. */
export async function SessionGate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return children;
}
