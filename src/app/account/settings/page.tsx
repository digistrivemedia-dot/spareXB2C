import {
  ChevronRight,
  CircleHelp,
  Headset,
  type LucideIcon,
  MapPinHouse,
  MessageSquareText,
  MonitorSmartphone,
  Phone,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getAddresses, getDeviceSessions } from "@/features/account/api";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { getSession } from "@/features/auth/session";
import { SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile, getInitials } from "@/lib/format";

export const metadata: Metadata = { title: "My account" };

type Row = { href: string; icon: LucideIcon; title: string; text: string };

function RowLink({ href, icon: Icon, title, text }: Row) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg px-2 py-3 outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-semibold text-gray-900">{title}</span>
        <span className="block truncate text-gray-600">{text}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-gray-400" aria-hidden />
    </Link>
  );
}

/** One place for the customer's details, addresses, devices and help. */
export default async function MyAccountPage() {
  // The device list says how long ago each was active, so it is worked out per request.
  await connection();
  const [session, addresses, devices] = await Promise.all([
    getSession(),
    getAddresses(),
    getDeviceSessions(),
  ]);
  if (!session) redirect("/login?next=/account/settings");
  const { user } = session;
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const thisDevice = devices.find((d) => d.isCurrent);
  const initials = getInitials(user.name);

  const accountRows: Row[] = [
    {
      href: "/account/profile",
      icon: UserRound,
      title: "Profile",
      text: [user.email ?? "Add your email", user.gstin && `GSTIN ${user.gstin}`]
        .filter(Boolean)
        .join(" · "),
    },
    {
      href: "/account/addresses",
      icon: MapPinHouse,
      title: "Addresses",
      text: defaultAddress
        ? `${addresses.length} saved · ${defaultAddress.label}: ${defaultAddress.line1}`
        : "Add an address for deliveries and pick and drop",
    },
    {
      href: "/account/devices",
      icon: MonitorSmartphone,
      title: "Logged-in devices",
      text: `${devices.length} ${devices.length === 1 ? "device" : "devices"}${thisDevice ? ` · this one: ${thisDevice.name}` : ""}`,
    },
  ];
  const helpRows: Row[] = [
    {
      href: "/account/help",
      icon: CircleHelp,
      title: "Help and FAQ",
      text: "Orders, returns, services and payments",
    },
    {
      href: "/account/enquiries",
      icon: MessageSquareText,
      title: "My enquiries",
      text: "Parts or vehicles you asked us to find",
    },
    {
      href: "/contact",
      icon: Headset,
      title: "Contact us",
      text: "Write to us or visit",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title="My account" description="Your details, addresses, devices and help." />

      <Card className="flex flex-wrap items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy-700 text-lg font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm whitespace-nowrap text-gray-600">{formatMobile(user.mobile)}</p>
        </div>
        <LogoutButton />
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          aria-labelledby="account-details-heading"
          className="grid grid-cols-1 content-start gap-2"
        >
          <h2 id="account-details-heading" className="text-lg font-semibold text-gray-900">
            Your details
          </h2>
          <ul className="-mx-2 divide-y divide-gray-100">
            {accountRows.map((row) => (
              <li key={row.href}>
                <RowLink {...row} />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          aria-labelledby="account-help-heading"
          className="grid grid-cols-1 content-start gap-2"
        >
          <h2 id="account-help-heading" className="text-lg font-semibold text-gray-900">
            Help and support
          </h2>
          <ul className="-mx-2 divide-y divide-gray-100">
            {helpRows.map((row) => (
              <li key={row.href}>
                <RowLink {...row} />
              </li>
            ))}
          </ul>
          <a
            href={`tel:+91${SUPPORT_PHONE}`}
            className="mt-2 flex items-center gap-3 rounded-lg bg-navy-50 px-4 py-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Phone className="size-5 text-navy-700" aria-hidden />
            <span>
              <span className="block font-semibold text-gray-900">
                Call us · {formatMobile(SUPPORT_PHONE)}
              </span>
              <span className="text-gray-600">{SUPPORT_HOURS}</span>
            </span>
          </a>
        </Card>
      </div>
    </div>
  );
}
