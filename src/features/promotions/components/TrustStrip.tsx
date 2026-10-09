import { BadgeCheck, LockKeyhole, ReceiptText, RotateCcw, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/Container";

const promises = [
  { icon: BadgeCheck, title: "Genuine brands", text: "Original parts from makers you trust" },
  { icon: ShieldCheck, title: "Fit checked for your bike", text: "Every part shows if it fits" },
  { icon: RotateCcw, title: "Easy returns", text: "Simple returns on unused parts" },
  { icon: LockKeyhole, title: "Secure payments", text: "UPI, cards and cash on delivery" },
  { icon: ReceiptText, title: "GST invoice", text: "With every order" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="py-6 md:py-8">
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-5 md:p-6">
          {promises.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-2 text-center last:col-span-2 md:last:col-span-1"
            >
              <Icon className="size-7 text-navy-700" aria-hidden />
              <span className="text-sm font-semibold text-gray-900">{title}</span>
              <span className="text-xs text-gray-500">{text}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
