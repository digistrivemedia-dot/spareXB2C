import { connection } from "next/server";

const hourFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  hourCycle: "h23",
  timeZone: "Asia/Kolkata",
});

/** "Good evening, Arjun", by the time in India when the page is requested. */
export async function Greeting({ name }: { name: string }) {
  // The greeting depends on the clock, so it must be worked out per request, not at build time.
  await connection();
  const hour = Number(hourFormat.format(new Date()));
  const partOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const firstName = name.split(" ")[0];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
        Good {partOfDay}, {firstName}
      </h1>
      <p className="mt-1 text-sm text-gray-600 md:text-base">
        Your vehicles, services and orders in one place.
      </p>
    </div>
  );
}
