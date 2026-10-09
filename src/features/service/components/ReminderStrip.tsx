import { StatusBadge } from "@/components/ui/StatusBadge";
import type { BikeReminders } from "@/features/service/types";
import { getReminderItems, reminderTone } from "@/features/service/utils";
import { cn } from "@/lib/utils";

/** Next service, insurance, PUC and RC, each coloured by how urgent it is. */
export function ReminderStrip({ reminders }: { reminders: BikeReminders }) {
  return (
    <ul aria-label="Bike status" className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {getReminderItems(reminders).map((item) => (
        <li
          key={item.key}
          className={cn(
            "flex flex-col gap-1.5 rounded-lg border p-3",
            item.status === "ok" && "border-gray-200 bg-white",
            item.status === "due-soon" && "border-warning-500 bg-warning-50",
            item.status === "overdue" && "border-danger-600 bg-danger-50",
          )}
        >
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {item.title}
          </span>
          <StatusBadge tone={reminderTone[item.status]}>{item.statusLabel}</StatusBadge>
          <span className="text-xs text-gray-700">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
