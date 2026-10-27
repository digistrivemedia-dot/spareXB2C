import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Logo } from "@/components/layout/Logo";
import { getSession } from "@/features/auth/session";
import { BrandPanel } from "@/features/auth/components/BrandPanel";
import { LoginChooser } from "@/features/auth/components/LoginChooser";
import { safeNextPath } from "@/features/auth/utils";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Customers log in or sign up with their mobile number. Business members log in to SpareX Business.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = getSearchParam(await searchParams, "next") ?? null;
  if (await getSession()) redirect(safeNextPath(next));

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <BrandPanel className="hidden lg:flex" />
      <main className="flex flex-col">
        <div className="bg-navy-900 px-4 py-4 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
          <div className="w-full max-w-sm">
            <LoginChooser next={next} />
          </div>
        </div>
      </main>
    </div>
  );
}
