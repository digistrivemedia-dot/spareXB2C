/** One titled block in the filter panel. */
export function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-1 border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">
      <legend className="mb-2 text-sm font-semibold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );
}
