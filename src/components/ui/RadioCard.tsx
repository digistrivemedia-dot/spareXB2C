import { RadioGroupItem } from "@/components/ui/radio-group";

type RadioCardProps = {
  value: string;
  id: string;
  children: React.ReactNode;
};

/** A radio option drawn as a card, for use inside RadioGroup. The whole card is the tap target. */
export function RadioCard({ value, id, children }: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-[[data-state=checked]]:border-navy-700 has-[[data-state=checked]]:bg-navy-50"
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <span className="min-w-0 flex-1 text-sm">{children}</span>
    </label>
  );
}
