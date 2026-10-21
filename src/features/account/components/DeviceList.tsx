import { Monitor, Smartphone, Tablet } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeviceLogOutButton } from "@/features/account/components/DeviceLogOutButton";
import type { DeviceSession } from "@/features/account/types";
import { formatDate, formatDateTime } from "@/lib/format";

const icons = { phone: Smartphone, tablet: Tablet, computer: Monitor };

/** Every device the customer is logged in on, with a way to log out the ones they don't use. */
export function DeviceList({ sessions }: { sessions: DeviceSession[] }) {
  const others = sessions.filter((s) => !s.isCurrent);

  return (
    <Card aria-label="Logged-in devices" className="grid gap-4">
      <ul className="divide-y divide-gray-200">
        {sessions.map((session) => {
          const Icon = icons[session.kind];
          return (
            <li key={session.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
                  {session.name}
                  {session.isCurrent && <StatusBadge tone="success">This device</StatusBadge>}
                </p>
                <p className="text-gray-600">
                  {session.location} ·{" "}
                  {session.isCurrent
                    ? "Active now"
                    : `Last active ${formatDateTime(session.lastActiveAt)}`}
                </p>
                <p className="text-gray-500">Logged in on {formatDate(session.signedInAt)}</p>
              </div>
              {!session.isCurrent && (
                // Phones: under the details, lined up with the text; wider screens: on the right.
                <div className="w-full pl-15 sm:w-auto sm:pl-0">
                  <DeviceLogOutButton session={session} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {others.length > 0 ? (
        <div className="border-t border-gray-200 pt-4">
          <DeviceLogOutButton otherCount={others.length} />
        </div>
      ) : (
        <p className="border-t border-gray-200 pt-4 text-sm text-gray-600">
          You&apos;re only logged in on this device.
        </p>
      )}
    </Card>
  );
}
