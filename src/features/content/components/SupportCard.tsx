import { Clock, Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { PolicyLink } from "@/features/content/types";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile } from "@/lib/format";

/** "Still need help?": how to reach us, and the policy pages. */
export function SupportCard({ policies }: { policies: PolicyLink[] }) {
  return (
    <Card aria-labelledby="support-heading" className="grid gap-5">
      <div>
        <h2 id="support-heading" className="text-lg font-semibold text-gray-900">
          Still need help?
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Talk to our team. Keep your order number handy.
        </p>
      </div>
      <div className="grid gap-3">
        <Button asChild>
          <a href={`tel:+91${SUPPORT_PHONE}`}>
            <Phone aria-hidden />
            Call {formatMobile(SUPPORT_PHONE)}
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={`mailto:${SUPPORT_EMAIL}`}>
            <Mail aria-hidden />
            {SUPPORT_EMAIL}
          </a>
        </Button>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="size-4" aria-hidden />
          {SUPPORT_HOURS}
        </p>
      </div>
      <nav aria-labelledby="policies-heading" className="border-t border-gray-200 pt-4">
        <h3 id="policies-heading" className="text-sm font-semibold text-gray-900">
          Our policies
        </h3>
        <ul className="mt-2 grid">
          {policies.map((policy) => (
            <li key={policy.slug}>
              <Link
                href={`/policies/${policy.slug}`}
                className="flex min-h-11 items-center text-sm font-medium text-navy-700 hover:underline"
              >
                {policy.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
}
