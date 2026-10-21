import { Bike } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Greeting } from "@/features/account/components/Greeting";
import { VehicleDashboard } from "@/features/account/components/VehicleDashboard";
import { getSession } from "@/features/auth/session";
import { getOrders } from "@/features/orders/api";
import { RecentOrders } from "@/features/orders/components/RecentOrders";
import { getMyVehicles } from "@/features/vehicles/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = { title: "My vehicle dashboard" };

export default async function AccountHomePage({ searchParams }: PageProps<"/account">) {
  const params = await searchParams;
  const [session, vehicles, recentOrders] = await Promise.all([
    getSession(),
    getMyVehicles(),
    getOrders({ pageSize: 2 }),
  ]);
  // The account layout already guards this; checking here keeps `session` non-null below.
  if (!session) redirect("/login");

  const vehicle =
    vehicles.find((b) => b.id === getSearchParam(params, "vehicle")) ??
    vehicles.find((b) => b.isDefault) ??
    vehicles[0];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Greeting name={session.user.name} />

      {vehicle ? (
        <VehicleDashboard
          vehicle={vehicle}
          vehicles={vehicles}
          partsCategory={getSearchParam(params, "parts")}
        />
      ) : (
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
      )}

      <RecentOrders orders={recentOrders.items} />
    </div>
  );
}
