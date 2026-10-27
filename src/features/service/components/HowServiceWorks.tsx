import { CalendarCheck, ClipboardCheck, IndianRupee, Wrench } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book a day",
    text: "Choose your vehicle, the service, a garage near you and a day. Nothing to pay now.",
  },
  {
    icon: Wrench,
    title: "Garage confirms",
    text: "The garage accepts your booking. Bring your vehicle in, or choose free pick and drop.",
  },
  {
    icon: ClipboardCheck,
    title: "Approve any extra work",
    text: "If the mechanic finds more to fix, you approve each item first. No surprises.",
  },
  {
    icon: IndianRupee,
    title: "Pay after the work",
    text: "Pay online or at the garage, with a GST bill in the garage's name.",
  },
];

export function HowServiceWorks() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ icon: Icon, title, text }, index) => (
        <li
          key={title}
          className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900">
              {index + 1}. {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
