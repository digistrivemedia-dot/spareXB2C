type PriceRowProps = {
  label: string;
  value: string;
  /** Savings show in green. */
  tone?: "saving";
};

/** One label and amount in a price breakdown (inside a <dl>). */
export function PriceRow({ label, value, tone }: PriceRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-700">{label}</dt>
      <dd
        className={tone === "saving" ? "font-medium text-success-700 tabular-nums" : "tabular-nums"}
      >
        {value}
      </dd>
    </div>
  );
}
