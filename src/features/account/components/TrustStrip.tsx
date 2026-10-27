import { BadgeCheck, ClipboardCheck, type LucideIcon, Radar, Truck } from "lucide-react";

type TrustPoint = { icon: LucideIcon; title: string; detail: string };

/** Only what the product already does; warranty or rating claims wait for the client (decision.md S12). */
const points: TrustPoint[] = [
  { icon: BadgeCheck, title: "Genuine parts", detail: "Checked to fit your vehicle" },
  { icon: Truck, title: "Free pick and drop", detail: "From your saved address" },
  { icon: ClipboardCheck, title: "Upfront estimates", detail: "No extra work without your OK" },
  { icon: Radar, title: "Live tracking", detail: "Every step of your service" },
];

/** Why customers can trust Kannali Garage, in one quiet row at the end of the home page. */
export function TrustStrip() {
  return (
    <section aria-label="Why Kannali Garage">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-gray-200 bg-white p-4 md:p-5 lg:grid-cols-4">
        {points.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
              <Icon className="size-4.5" aria-hidden />
            </span>
            <span className="min-w-0 text-sm">
              <span className="block font-semibold text-gray-900">{title}</span>
              <span className="block text-gray-500">{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
