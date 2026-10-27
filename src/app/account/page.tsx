import { Bike } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AccountHome } from "@/features/account/components/AccountHome";
import { getGreeting } from "@/features/account/greeting";
import { getSession } from "@/features/auth/session";
import { getOrders } from "@/features/orders/api";
import { RecentOrders } from "@/features/orders/components/RecentOrders";
import { getMyVehicles } from "@/features/vehicles/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = { title: "Home" };

/** A logged-in customer's home (/ sends them here). */
export default async function AccountHomePage({ searchParams }: PageProps<"/account">) {
  const params = await searchParams;
  const [session, vehicles, orders] = await Promise.all([
    getSession(),
    getMyVehicles(),
    getOrders({ pageSize: 50 }),
  ]);
  // The account layout already guards this; checking here keeps `session` non-null below.
  if (!session) redirect("/login");
  const greeting = await getGreeting(session.user.name);

  const vehicle =
    vehicles.find((v) => v.id === getSearchParam(params, "vehicle")) ??
    vehicles.find((v) => v.isDefault) ??
    vehicles[0];

  if (!vehicle) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">{greeting}</h1>
        <Card>
          <EmptyState
            icon={Bike}
            title="Add your first vehicle"
            description="See service reminders, track services and shop parts that fit, all in one place."
            className="py-8"
          >
            <Button asChild>
              <Link href="/account/vehicles/new">Add a vehicle</Link>
            </Button>
          </EmptyState>
        </Card>
        <RecentOrders orders={orders.items.slice(0, 3)} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      <AccountHome
        greeting={greeting}
        vehicle={vehicle}
        vehicles={vehicles}
        orders={orders.items}
      />
    </div>
  );
}
