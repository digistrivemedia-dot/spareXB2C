type StepProgressProps = {
  /** 1-based. */
  current: number;
  total: number;
  title: string;
};

/** "Step 2 of 6 · Brand" with a progress bar, for step-by-step flows. */
export function StepProgress({ current, total, title }: StepProgressProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="grid gap-2">
      <p className="text-sm text-gray-600">
        Step {current} of {total} · <span className="font-semibold text-gray-900">{title}</span>
      </p>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Progress"
        className="h-1.5 overflow-hidden rounded-full bg-gray-200"
      >
        {/* The width is data, so it's passed as a CSS variable. */}
        <div
          className="h-full w-(--progress) rounded-full bg-navy-700 transition-all"
          style={{ "--progress": `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
