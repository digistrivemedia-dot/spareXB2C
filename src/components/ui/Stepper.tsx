import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type Step = {
  label: string;
  /** Shown under the label, e.g. when the step happened. */
  detail?: string;
};

type StepperProps = {
  steps: Step[];
  /** Index of the step in progress. Steps before it are done; steps.length means all done. */
  activeStep: number;
  /** "attention" highlights the active step in the action colour, e.g. when it waits on the customer. */
  activeTone?: "progress" | "attention";
  label: string;
};

/** Progress through ordered steps: vertical on phones, horizontal from tablets up. */
export function Stepper({ steps, activeStep, activeTone = "progress", label }: StepperProps) {
  return (
    <ol aria-label={label} className="flex flex-col md:flex-row">
      {steps.map((step, index) => {
        const isDone = index < activeStep;
        const isActive = index === activeStep;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.label}
            aria-current={isActive ? "step" : undefined}
            className="flex gap-3 md:flex-1 md:flex-col md:items-center md:gap-2"
          >
            {/* Circle with connectors: below it on phones, either side of it from tablets up. */}
            <div className="flex flex-col items-center md:w-full md:flex-row">
              <span
                className={cn(
                  "hidden h-0.5 flex-1 md:block",
                  index === 0 && "invisible",
                  index <= activeStep ? "bg-navy-600" : "bg-gray-200",
                )}
              />
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isDone && "bg-navy-700 text-white",
                  isActive &&
                    (activeTone === "attention"
                      ? "bg-orange-700 text-white ring-4 ring-orange-100"
                      : "bg-navy-700 text-white ring-4 ring-navy-100"),
                  !isDone && !isActive && "border-2 border-gray-300 bg-white text-gray-500",
                )}
              >
                {isDone ? <Check className="size-4" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  "min-h-6 w-0.5 flex-1 md:h-0.5 md:min-h-0 md:w-auto",
                  isLast && "invisible",
                  isDone ? "bg-navy-600" : "bg-gray-200",
                )}
              />
            </div>
            <div className={cn("pt-1 md:px-2 md:pt-0 md:text-center", !isLast && "pb-6 md:pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive && activeTone === "attention" ? "text-orange-800" : "text-gray-900",
                  !isDone && !isActive && "text-gray-500",
                )}
              >
                {step.label}
                <span className="sr-only">
                  {isDone ? " (done)" : isActive ? " (in progress)" : " (not started)"}
                </span>
              </p>
              {step.detail && <p className="mt-0.5 text-xs text-gray-500">{step.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
