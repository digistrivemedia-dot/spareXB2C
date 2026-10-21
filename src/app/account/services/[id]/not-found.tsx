import { Wrench } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ServiceJobNotFound() {
  return (
    <EmptyState
      icon={Wrench}
      titleAs="h1"
      title="We couldn't find this booking"
      description="Your bookings and past services are listed in My services."
    >
      <Button asChild>
        <Link href="/account/services">Go to my services</Link>
      </Button>
    </EmptyState>
  );
}
