import { Card } from "@/components/ui/Card";

type CheckoutStepProps = {
  number: number;
  title: string;
  /** Short note next to the title, e.g. "Optional". */
  note?: string;
  children: React.ReactNode;
};

/** One numbered section of the checkout page. */
export function CheckoutStep({ number, title, note, children }: CheckoutStepProps) {
  const headingId = `checkout-step-${number}`;
  return (
    <Card aria-labelledby={headingId}>
      <h2 id={headingId} className="flex items-center gap-3 text-lg font-semibold text-gray-900">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm text-white"
          aria-hidden
        >
          {number}
        </span>
        {title}
        {note && <span className="text-sm font-normal text-gray-500">{note}</span>}
      </h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
