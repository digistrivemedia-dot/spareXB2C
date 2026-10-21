import { Car } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function VehicleNotFound() {
  return (
    <EmptyState
      icon={Car}
      titleAs="h1"
      title="We couldn't find this vehicle"
      description="It may have been removed from your account."
    >
      <Button asChild>
        <Link href="/account/vehicles">See my vehicles</Link>
      </Button>
    </EmptyState>
  );
}
