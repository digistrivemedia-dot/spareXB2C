// India Standard Time everywhere, so server and browser render the same dates.
const TIME_ZONE = "Asia/Kolkata";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const rupeesWithPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const dateTimeFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TIME_ZONE,
});

const dayFormat = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});

const numberFormat = new Intl.NumberFormat("en-IN");

/** 12499900 → "₹1,24,999". Paise are shown only when the amount is not whole rupees. */
export function formatPrice(paise: number): string {
  const amount = paise / 100;
  return paise % 100 === 0 ? rupees.format(amount) : rupeesWithPaise.format(amount);
}

// en-IN writes September as "Sept"; keep every month to three letters, like "12 Oct 2026".
function format(formatter: Intl.DateTimeFormat, isoDate: string): string {
  return formatter
    .formatToParts(new Date(isoDate))
    .map((part) => (part.type === "month" ? part.value.slice(0, 3) : part.value))
    .join("");
}

/** "2026-10-12T…" → "12 Oct 2026" */
export function formatDate(isoDate: string): string {
  return format(dateFormat, isoDate);
}

/** "2026-10-08T12:05…" → "8 Oct, 12:05 pm" */
export function formatDateTime(isoDate: string): string {
  return format(dateTimeFormat, isoDate);
}

/** "Tue, 14 Oct", for delivery dates */
export function formatDay(date: Date): string {
  return format(dayFormat, date.toISOString());
}

/** Today's (or any) date in India as "2026-10-09", for comparing with ISO dates from the API. */
export function toIndianIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

/** "9845012345" → "+91 98450 12345" */
export function formatMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** "KA03MX4521" → "KA 03 MX 4521" */
export function formatRegistration(registration: string): string {
  const compact = registration.replace(/\s/g, "").toUpperCase();
  const parts = compact.match(/^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{1,4})$/);
  return parts ? parts.slice(1).filter(Boolean).join(" ") : compact;
}

/** 18420 → "18,420 km" */
export function formatKm(km: number): string {
  return `${numberFormat.format(km)} km`;
}

/** "Arjun Rao" → "AR", for avatars. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
