import { Hammer } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Stands in for sections outside the current build, so no link is ever dead. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <EmptyState
      icon={Hammer}
      titleAs="h1"
      title={`${title} is coming soon`}
      description="We're building this part of Kannali Garage. Meanwhile, you can shop parts that fit your bike."
    >
      <Button asChild>
        <Link href="/products">Shop parts</Link>
      </Button>
      <Button asChild variant="secondary">
        <Link href="/">Go to home</Link>
      </Button>
    </EmptyState>
  );
}
