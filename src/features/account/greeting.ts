import { connection } from "next/server";

const hourFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  hourCycle: "h23",
  timeZone: "Asia/Kolkata",
});

/** "Good evening, Arjun", by the time in India when the page is requested. */
export async function getGreeting(name: string): Promise<string> {
  // The greeting depends on the clock, so it must be worked out per request, not at build time.
  await connection();
  const hour = Number(hourFormat.format(new Date()));
  const partOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${partOfDay}, ${name.split(" ")[0]}`;
}
