import { MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function GarageNotFound() {
  return (
    <EmptyState
      icon={MapPin}
      titleAs="h1"
      title="We couldn't find this garage"
      description="It may have moved or stopped taking bookings. See the garages near you."
    >
      <Button asChild>
        <Link href="/services/garages">Find a garage</Link>
      </Button>
    </EmptyState>
  );
}
