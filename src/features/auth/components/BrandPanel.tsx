import { BadgeCheck, Bike, Wrench } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Bike,
    title: "Parts that fit your bike",
    text: "Every part is checked against your exact model and year.",
  },
  {
    icon: BadgeCheck,
    title: "Genuine brands, GST invoice",
    text: "Original parts from makers you trust, with a proper bill.",
  },
  {
    icon: Wrench,
    title: "Your bike's service in one place",
    text: "Track services, approve estimates and get reminders.",
  },
];

/** The navy panel beside the login form on wide screens. */
export function BrandPanel({ className }: { className?: string }) {
  return (
    <aside className={cn("flex-col justify-between bg-navy-900 p-10 xl:p-14", className)}>
      <Logo />
      <div>
        <p className="max-w-md text-3xl leading-tight font-semibold text-white">
          Parts that fit. Service you can trust.
        </p>
        <ul className="mt-10 grid gap-6">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-700 text-white">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-white">{title}</span>
                <span className="block text-sm text-gray-300">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-gray-400">Kannali Garage, Whitefield, Bengaluru</p>
    </aside>
  );
}
