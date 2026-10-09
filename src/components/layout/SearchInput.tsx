"use client";

import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

/** The header search box, showing the current search on the results page. */
export function SearchInput(props: React.ComponentProps<typeof Input>) {
  const q = useSearchParams().get("q") ?? "";
  // Remount when the search changes, so the box shows the new query after navigation.
  return <Input key={q} defaultValue={q} {...props} />;
}
