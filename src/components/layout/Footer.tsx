import { Clock, Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { features } from "@/lib/config";
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile } from "@/lib/format";
import { footerNav } from "@/lib/navigation";

const paymentMethods = [
  "UPI",
  "Visa",
  "Mastercard",
  "RuPay",
  "Net banking",
  "Wallets",
  ...(features.cashOnDelivery ? ["Cash on delivery"] : []),
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-sm text-gray-300 print:hidden">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 lg:grid-cols-5 lg:py-12">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm">
            {SITE_NAME} services bikes, scooters, cars and commercial vehicles across Bengaluru.
            SpareX is our parts store: genuine brands, checked to fit your vehicle.
          </p>
          <ul className="mt-5 grid gap-3">
            <li>
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Phone className="size-4" aria-hidden />
                {formatMobile(SUPPORT_PHONE)}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Mail className="size-4" aria-hidden />
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="size-4" aria-hidden />
              {SUPPORT_HOURS}
            </li>
          </ul>
        </div>

        {footerNav.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="font-semibold text-white">{section.title}</h2>
            <ul className="mt-4 grid gap-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-navy-800">
        <Container className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs font-semibold text-white">We accept</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <li
                  key={method}
                  className="rounded-full border border-navy-700 px-3 py-1 text-xs font-medium text-gray-200"
                >
                  {method}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-400">© {SITE_NAME}. All prices include GST.</p>
        </Container>
      </div>
    </footer>
  );
}
