import { useRef } from "react";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** One box per digit: typing moves forward, Backspace moves back, and pasting fills every box. */
export function OtpInput({ value, onChange, length = 6, invalid, autoFocus }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  function setFrom(index: number, typed: string) {
    const clean = typed.replace(/\D/g, "");
    if (!clean) return;
    const next = (value.slice(0, index) + clean).slice(0, length);
    onChange(next);
    inputs.current[Math.min(next.length, length - 1)]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    const removeAt = digits[index] ? index : index - 1;
    if (removeAt < 0) return;
    onChange(value.slice(0, removeAt));
    inputs.current[removeAt]?.focus();
  }

  return (
    <div role="group" aria-label={`${length}-digit code`} className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => setFrom(index, event.target.value.slice(-1))}
          onPaste={(event) => {
            event.preventDefault();
            setFrom(0, event.clipboardData.getData("text"));
          }}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid}
          className={cn(
            "size-12 rounded-lg border bg-white text-center text-xl font-semibold text-gray-900 tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            invalid ? "border-destructive" : "border-input",
          )}
        />
      ))}
    </div>
  );
}
