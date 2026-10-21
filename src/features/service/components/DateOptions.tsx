import { OptionTile } from "@/components/ui/OptionTile";
import { formatDay } from "@/lib/format";

type DateOptionsProps = {
  /** "YYYY-MM-DD" days the garage takes bookings. */
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
};

/** The days the garage is open over the next two weeks. There are no time slots. */
export function DateOptions({ dates, selected, onSelect }: DateOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {dates.map((date) => (
        <OptionTile
          key={date}
          isSelected={date === selected}
          onClick={() => onSelect(date)}
          className="items-center text-center"
        >
          <span className="font-semibold text-gray-900">
            {formatDay(new Date(`${date}T12:00:00+05:30`))}
          </span>
        </OptionTile>
      ))}
    </div>
  );
}
