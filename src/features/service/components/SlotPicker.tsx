import { OptionTile } from "@/components/ui/OptionTile";
import type { ServiceDay } from "@/features/service/types";
import { formatTime } from "@/features/service/utils";
import { formatDay } from "@/lib/format";
import { cn } from "@/lib/utils";

type SlotPickerProps = {
  days: ServiceDay[];
  date: string;
  time: string;
  onChange: (date: string, time: string) => void;
};

const dayLabel = (date: string) => formatDay(new Date(`${date}T12:00:00+05:30`));

/** Pick a day, then one of its free time slots. Taken slots are shown but can't be chosen. */
export function SlotPicker({ days, date, time, onChange }: SlotPickerProps) {
  const day = days.find((d) => d.date === date) ?? days[0];

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Day" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            aria-pressed={d.date === day.date}
            onClick={() => onChange(d.date, "")}
            className={cn(
              "h-11 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              d.date === day.date
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            {dayLabel(d.date)}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label={`Time on ${dayLabel(day.date)}`}
        className="grid grid-cols-3 gap-2"
      >
        {day.slots.map((slot) => (
          <OptionTile
            key={slot.time}
            isSelected={day.date === date && slot.time === time}
            disabled={!slot.isAvailable}
            onClick={() => onChange(day.date, slot.time)}
            className="items-center text-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="font-semibold text-gray-900">{formatTime(slot.time)}</span>
            {!slot.isAvailable && <span className="text-xs text-gray-500">Full</span>}
          </OptionTile>
        ))}
      </div>
    </div>
  );
}
